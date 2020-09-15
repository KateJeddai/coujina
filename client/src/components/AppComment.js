import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/AppIndividualRecipe.scss';

const AppComment = (props) => {
    const {comment} = props;
    
    return comment.commentUser && (
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
}

export default AppComment;
