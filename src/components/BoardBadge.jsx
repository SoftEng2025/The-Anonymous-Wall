import React from 'react';
import { getBoardColor } from '../data/boardConfig';
import './BoardBadge.css';

const BoardBadge = ({ board, className = '' }) => {
    if (!board) return null;

    const color = getBoardColor(board.id);

    return (
        <span
            className={`board-badge ${className}`}
            style={{ backgroundColor: color }}
        >
            <i className={`fa-solid ${board.icon}`}></i>
            {board.name}
        </span>
    );
};

export default BoardBadge;
