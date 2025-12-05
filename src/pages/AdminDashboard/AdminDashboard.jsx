import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userController } from '../../backend/controllers/userController';
import { reportController } from '../../backend/controllers/reportController';
import { moderationController } from '../../backend/controllers/moderationController';
import { postController } from '../../backend/controllers/postController';
import { messageController } from '../../backend/controllers/messageController';
import { replyController } from '../../backend/controllers/replyController';
import { getBoardById } from '../../data/boardConfig';
import BoardBadge from '../../components/BoardBadge';
import './AdminDashboard.css';

import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('reports'); // reports, logs
    const [reports, setReports] = useState([]);
    const [logs, setLogs] = useState([]);

    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        report: null
    });

    useEffect(() => {
        const checkAdmin = async () => {
            if (currentUser) {
                const adminStatus = await userController.isAdmin(currentUser.uid);
                setIsAdmin(adminStatus);
                if (!adminStatus) {
                    navigate('/');
                }
            } else {
                navigate('/');
            }
            setLoading(false);
        };
        checkAdmin();
    }, [currentUser, navigate]);

    useEffect(() => {
        if (isAdmin) {
            fetchReports();
            fetchLogs();
        }
    }, [isAdmin]);

    const fetchReports = async () => {
        try {
            const pendingReports = await reportController.getPendingReports();

            // Separate reports by type
            const postReports = pendingReports.filter(r => !r.type || r.type === 'post');
            const messageReports = pendingReports.filter(r => r.type === 'message');
            const replyReports = pendingReports.filter(r => r.type === 'reply');

            // Collect IDs
            const postIds = [...new Set(postReports.map(r => r.postId).filter(id => typeof id === 'string' && id.trim().length > 0))];
            const messageIds = [...new Set(messageReports.map(r => r.postId).filter(id => typeof id === 'string' && id.trim().length > 0))];

            // Fetch content
            const [posts, messages] = await Promise.all([
                postController.getPostsByIds(postIds),
                messageController.getMessagesByIds(messageIds)
            ]);

            // Fetch replies individually (since they are subcollections)
            const repliesPromises = replyReports.map(async (r) => {
                if (r.parentPostId && r.postId) {
                    const reply = await replyController.getReply(r.parentPostId, r.postId);
                    return reply;
                }
                return null;
            });
            const replies = (await Promise.all(repliesPromises)).filter(r => r !== null);

            // Create maps for O(1) lookup
            const postsMap = new Map(posts.map(p => [p.id, p]));
            const messagesMap = new Map(messages.map(m => [m.id, m]));
            const repliesMap = new Map(replies.map(r => [r.id, r]));

            // Attach content to reports
            const reportsWithPosts = pendingReports.map(report => {
                let content = null;
                if (report.type === 'message') {
                    content = messagesMap.get(report.postId);
                } else if (report.type === 'reply') {
                    content = repliesMap.get(report.postId);
                } else {
                    content = postsMap.get(report.postId);
                }
                return { ...report, content };
            });

            setReports(reportsWithPosts);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    const fetchLogs = async () => {
        try {
            const moderationLogs = await moderationController.getModerationLogs();
            setLogs(moderationLogs);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    const handleAction = async (report, action) => {
        try {
            if (action === 'DELETE') {
                setDeleteModal({
                    isOpen: true,
                    report: report
                });
            } else if (action === 'KEEP') {
                await reportController.resolveReport(report.id, 'dismissed', currentUser.uid);
                await moderationController.logAction(currentUser.uid, 'KEEP_CONTENT', report.postId, `Dismissed report: ${report.reason}`);
                fetchReports();
                fetchLogs();
            }
        } catch (error) {
            console.error("Error performing action:", error);
            alert("Failed to perform action.");
        }
    };

    const confirmDelete = async () => {
        const { report } = deleteModal;
        if (!report) return;

        try {
            if (report.type === 'message') {
                await messageController.deleteMessage(String(report.postId));
            } else if (report.type === 'reply') {
                await replyController.deleteReply(report.parentPostId, String(report.postId));
            } else {
                await postController.deletePost(String(report.postId));
            }
            await reportController.resolveReport(report.id, 'resolved', currentUser.uid);
            await moderationController.logAction(currentUser.uid, 'DELETE_CONTENT', report.postId, `Reason: ${report.reason} (Type: ${report.type || 'post'})`);

            // Close modal and refresh
            setDeleteModal({ isOpen: false, report: null });
            fetchReports();
            fetchLogs();
        } catch (error) {
            console.error("Error deleting content:", error);
            alert("Failed to delete content.");
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!isAdmin) return null;

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <div className="admin-tabs">
                    <button
                        className={`admin-tab ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        Flagged Posts ({reports.length})
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'logs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('logs')}
                    >
                        Moderation Logs
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {activeTab === 'reports' && (
                    <div className="reports-list">
                        {reports.length === 0 ? (
                            <div className="empty-state">No pending reports. Good job! 🎉</div>
                        ) : (
                            reports.map(report => (
                                <div key={report.id} className="report-card">
                                    <div className="report-meta">
                                        <div className="report-reason">
                                            <span>Reason:</span>
                                            <strong>{report.reason}</strong>
                                        </div>
                                        <span className="report-time">{new Date(report.timestamp?.toDate()).toLocaleString()}</span>
                                    </div>
                                    {report.content ? (
                                        <div className="reported-post">
                                            {report.type === 'message' ? (
                                                <>
                                                    <div className="post-preview-header">
                                                        <span className="post-author">To: {report.content.recipient}</span>
                                                        <span className="post-mood">Mood: {report.content.mood}</span>
                                                    </div>
                                                    <p className="message-content" style={{ backgroundColor: `var(--${report.content.theme})`, padding: '10px', borderRadius: '5px' }}>
                                                        {report.content.message}
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="post-preview-header">
                                                        <span className="post-author">{report.content.author}</span>
                                                        {report.content.board && <BoardBadge board={getBoardById(report.content.board)} />}
                                                    </div>
                                                    <h3>{report.content.title}</h3>
                                                    <p>{report.content.content}</p>
                                                </>
                                            )}
                                            {report.type === 'reply' && (
                                                <>
                                                    <div className="post-preview-header">
                                                        <span className="post-author">Comment by: {report.content.author}</span>
                                                    </div>
                                                    <p className="message-content" style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '5px', fontStyle: 'italic' }}>
                                                        "{report.content.content}"
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="post-deleted">Content already deleted</div>
                                    )}
                                    <div className="report-actions">
                                        <button className="btn-keep" onClick={() => handleAction(report, 'KEEP')}>
                                            <i className="fa-solid fa-check"></i> Keep Post
                                        </button>
                                        <button className="btn-delete" onClick={() => handleAction(report, 'DELETE')}>
                                            <i className="fa-solid fa-trash"></i> Delete Post
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'logs' && (
                    <div className="logs-list">
                        <table className="logs-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Admin</th>
                                    <th>Action</th>
                                    <th>Target ID</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id}>
                                        <td>{new Date(log.timestamp?.toDate()).toLocaleString()}</td>
                                        <td>{log.adminId}</td>
                                        <td><span className={`badge badge-${log.action.toLowerCase().split('_')[0]}`}>{log.action}</span></td>
                                        <td>{log.targetId}</td>
                                        <td>{log.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, report: null })}
                onConfirm={confirmDelete}
                itemType={deleteModal.report?.type || 'post'}
            />
        </div>
    );
};

export default AdminDashboard;
