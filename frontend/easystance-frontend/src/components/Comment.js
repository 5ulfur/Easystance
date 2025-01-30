import React from "react";
import "../assets/styles/Comment.css";

const Comment = ({ author, date, description }) => {
    const formattedDate = new Intl.DateTimeFormat('it-IT', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date));

    return (
        <div className="comment">
            <div className="comment-header">
                <h4>{author}</h4>
                <span>{formattedDate}</span>
            </div>
            <p>{description}</p>
        </div>
    );
};

export default Comment;