import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import AppComment from './AppComment';
import AppNewComment from './AppNewComment';
import {getRecipe} from '../actions/recipes-actions';
import '../styles/AppIndividualRecipe.scss';

const AppComments = (props) => {
    const recipeTitle = props.recipe;    
    const user = useSelector(state => state.auth.user);
    const recipe = useSelector(state => state.recipes.recipe);
    const dispatch = useDispatch();
        
    useEffect(() => {
        dispatch(getRecipe(recipeTitle));
        return () => {};
    }, [dispatch, recipeTitle])

    return (
        <div className="comments-wrapper">
            <div className="comments-title">            
                <FontAwesomeIcon icon={faComments} className="fontawesome" />
                <h3>Comments</h3>
            </div>
            {user && user.username ? <AppNewComment recipe={recipeTitle} /> : 
                                     <Link className="link-login"
                                           to={{
                                               pathname: '/login',
                                               state: { from: props.location }
                                           }}>Please, login to leave a comment.</Link>
            }
            <div className="comments-body">
                {recipe && recipe.comments && recipe.comments.length > 0 ? recipe.comments.map((comment, i) => {
                    return <AppComment key={i} comment={comment} />
                }) :  <p>Be first to leave a comment!</p>}
            </div>
        </div>
    )
}

export default AppComments;
