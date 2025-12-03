import React from 'react';
import { getBoardName, getBoardColor, getBoardById } from '../../../data/boardConfig';

const ForumHeader = ({ selectedBoard, onBackToBoards }) => {
    return (
        <div className="forum-header">
            <div className="forum-header-inner">
                <div className="header-center">
                    <div className="forum-title-wrapper">
                        <button
                            className="back-to-boards-btn"
                            aria-label="Back to boards"
                            onClick={onBackToBoards}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <h1 className="forum-title">{getBoardName(selectedBoard)}</h1>
                    </div>
                    <p className="forum-description">{getBoardById(selectedBoard)?.description}</p>

                    <div className="icon-rules-row">
                        <div
                            className="forum-board-icon"
                            style={{ '--board-color': getBoardColor(selectedBoard) }}
                        >
                            <i className={`fa-solid ${getBoardById(selectedBoard)?.icon}`}></i>
                        </div>

                        {getBoardById(selectedBoard)?.rules && (
                            <ol className="board-rules inline-rules">
                                {getBoardById(selectedBoard).rules.map((r, idx) => (
                                    <li key={idx}>{r}</li>
                                ))}
                            </ol>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForumHeader;
