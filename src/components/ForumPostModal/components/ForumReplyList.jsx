import React from 'react';
import ForumReplyItem from './ForumReplyItem';

const ForumReplyList = ({
    replies,
    currentUser,
    isAdmin,
    editingReplyId,
    editReplyContent,
    editError,
    onReplyLike,
    onReplyClick,
    onEditReplyClick,
    onDeleteReply,
    onReportReply,
    onEditReplyCancel,
    onEditReplySave,
    setEditReplyContent
}) => {
    return (
        <div className="modal-replies-section">
            {replies.map(reply => (
                <ForumReplyItem
                    key={reply.id}
                    reply={reply}
                    currentUser={currentUser}
                    isAdmin={isAdmin}
                    isEditing={editingReplyId === reply.id}
                    editContent={editReplyContent}
                    editError={editError}
                    onLike={onReplyLike}
                    onReply={onReplyClick}
                    onEditClick={onEditReplyClick}
                    onDelete={onDeleteReply}
                    onReport={onReportReply}
                    onEditCancel={onEditReplyCancel}
                    onEditSave={onEditReplySave}
                    setEditContent={setEditReplyContent}
                />
            ))}
        </div>
    );
};

export default ForumReplyList;
