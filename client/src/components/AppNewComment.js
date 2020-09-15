import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {updateRecipeRanking, postComment} from '../actions/recipes-actions';
import '../styles/AppIndividualRecipe.scss';
import AppRanking from './AppRanking';

const AppNewComment = (props) => {
    const user = useSelector(state => state.auth.user);    
    const userType = localStorage.getItem('google') == "true" ? 'google' : 'local';
    const recipe = props.recipe;
    const [commentSubmit, setCommentSubmit] = useState(false);
    const [comment, setComment] = useState('');
    const [rank, setRank] = useState(null);
    const textareaRef = React.createRef();

    const dispatch = useDispatch();
    
    const handleShowSubmitButton = () => {
        setCommentSubmit(true);
    }

    const handleSetComment = (e) => {
        const text = e.target.value;
        setComment(text);
    }

    const handleRanking = (rank) => {
        setCommentSubmit(true);
        setRank(rank);
    }

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if(rank) {
            dispatch(updateRecipeRanking(recipe, rank));
        }
        const dataComment = {
            comment, userType
        };              
        if(comment.trim().length > 0) {
            dispatch(postComment(recipe, dataComment))
        }
        setComment('');
        setCommentSubmit(false); 
        setRank(null);
    } 

    const cancelComment = (e) => {
        e.preventDefault();
        setCommentSubmit(false);
    }

    return (
        <div className="new-comment">
                <div className="comment-intro">
                    <p>{user.username}, tell us what you think!</p>
                    <AppRanking handleRanking={handleRanking} commentSubmit={commentSubmit} />
                </div>
                <form className="form-comment">
                    <div className="input-group">
                        <textarea className="comment-text"
                                  value={comment}
                                  placeholder="Share your thoughts..." 
                                  onFocus={handleShowSubmitButton}
                                  onChange={handleSetComment}
                                  ref={textareaRef}></textarea>  
                        <div className={commentSubmit ? "btns-wrapper visible" : "btns-wrapper invisible"}>
                            <button className="btn btn-cancel" onClick={cancelComment}>Cancel</button>              
                            <button className="btn btn-submit" 
                                    disabled={!rank && comment.trim().length <= 0}
                                    onClick={handleSubmitComment}>Submit</button>
                        </div>
                    </div>
                </form>
        </div>
    )
}

export default AppNewComment;
