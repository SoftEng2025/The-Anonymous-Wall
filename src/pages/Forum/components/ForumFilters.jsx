import React from 'react';

const ForumFilters = ({
    isFilterMenuOpen,
    setIsFilterMenuOpen,
    filterType,
    setFilterType,
    onCreatePost
}) => {
    return (
        <div className="forum-controls">
            <div className="filter-container">
                <button
                    className={`filter-btn ${isFilterMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                >
                    <i className="fa-solid fa-sliders"></i>
                    Sort
                </button>

                {isFilterMenuOpen && (
                    <div className="filter-menu">
                        <button
                            className={`filter-option ${filterType === 'latest' ? 'active' : ''}`}
                            onClick={() => { setFilterType('latest'); setIsFilterMenuOpen(false); }}
                        >
                            <i className="fa-regular fa-clock"></i> Latest
                        </button>
                        <button
                            className={`filter-option ${filterType === 'likes' ? 'active' : ''}`}
                            onClick={() => { setFilterType('likes'); setIsFilterMenuOpen(false); }}
                        >
                            <i className="fa-regular fa-heart"></i> Most Liked
                        </button>
                        <button
                            className={`filter-option ${filterType === 'comments' ? 'active' : ''}`}
                            onClick={() => { setFilterType('comments'); setIsFilterMenuOpen(false); }}
                        >
                            <i className="fa-regular fa-comment"></i> Most Discussed
                        </button>
                    </div>
                )}
            </div>
            <button className="create-post-btn" onClick={onCreatePost}>
                <i className="fa-solid fa-plus"></i> Create Post
            </button>
        </div>
    );
};

export default ForumFilters;
