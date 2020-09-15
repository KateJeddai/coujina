import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/AppIndividualRecipe.scss';

const AppComment = (props) => {
    const {comment} = props;
    console.log(comment)

    if(comment.commentUser) {
        return (
            <div className="comment-wrapper">
                <div className="comment-avatar">
                    {comment.commentUser && comment.commentUser.imagePath ? <img src={comment.commentUser.imagePath} className="img-avatar" alt="" /> :
                                                                            <FontAwesomeIcon icon={faUserCircle} className="fontawesome" />}
                </div>
                <div className="comment-body">
                    <p>{comment.commentUser.username}</p>
                    <p>{comment.commentBody}</p>
                </div>
            </div> )
    } else if(comment.commentLocalUser) {
        return comment.commentLocalUser && (
            <div className="comment-wrapper">
                <div className="comment-avatar">
                    {comment.commentLocalUser && comment.commentLocalUser.imagePath ? 
                                <img src={comment.commentLocalUser.imagePath} className="img-avatar" alt="" /> :
                                <FontAwesomeIcon icon={faUserCircle} className="fontawesome" />}
                </div>
                <div className="comment-body">
                    <p>{comment.commentLocalUser.username}</p>
                    <p>{comment.commentBody}</p>
                </div>
            </div> )
    }
}

export default AppComment;
