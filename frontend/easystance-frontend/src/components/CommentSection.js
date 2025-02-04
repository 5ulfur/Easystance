import React, { useState, useRef, useCallback } from "react";
import { useAuth } from "../services/AuthContext";
import useLazyLoading from "../services/LazyLoading";
import { t } from "../translations/translations";
import Comment from "./Comment";
import config from "../config/config";
import "../assets/styles/CommentSection.css";

const CommentSection = ({ id }) => {
    const { token } = useAuth();
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState(null);
    const listRef = useRef(null);
    const limit = 10;
    
    const getComments = useCallback(async (page, limit) => {
        setError(null);

        const response = await fetch(`${config.apiUrl}${config.endpoints.getComments}`, {
            method: "POST",
            headers: { "Authorization": token , "Content-Type": "application/json" },
            body: JSON.stringify({ id, page, limit })
        });

        const data = await response.json();
        if (response.ok) {
            return { data: data.comments, hasMore: data.hasMore };
        } else {
            setError(data.error);
            return { data: [], hasMore: false };
        }
    }, [token, id]);

    const { items: comments, hasMore, loadMore, reload } = useLazyLoading(getComments, limit);

    const handleScroll = async () => {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    
        if (clientHeight + scrollTop + 1 >= scrollHeight && hasMore) {
            loadMore();
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${config.apiUrl}${config.endpoints.createComment}`, {
                method: "POST",
                headers: { "Authorization": token, "Content-Type": "application/json" },
                body: JSON.stringify({ id, comment: newComment })
            });

            const data = await response.json();
            if (response.ok) {
                reload();
                setNewComment("");
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleChangeComment = (e) => {
        const { value } = e.target;
        setNewComment(value);
    };

    return (
        <div className="comment-section">
            <h3>{t(`comments`)}</h3>
            <form onSubmit={handleSubmitComment}>
                <input
                    type="text"
                    name="comment"
                    maxLength="1000"
                    value={newComment}
                    onChange={handleChangeComment}
                    required
                />
                <button type="submit">{t(`send`)}</button>
            </form>
            {error && <p className="error-box"><strong>{error}</strong></p>}
            <div ref={listRef} onScroll={handleScroll} className="comment-section-list">
                {comments.map((comment) => (
                    <Comment
                        key={comment.id}
                        author={`${comment.employee.name} ${comment.employee.surname} (${comment.employee.email})`}
                        date={comment.createdAt}
                        description={comment.description}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;