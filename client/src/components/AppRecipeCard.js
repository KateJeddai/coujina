import React from 'react';
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import '../styles/AppRecipeCard.scss';
import AppRankingStars from './AppRankingStars';

const AppRecipeCard = (props) => {
    const authenticated = useSelector(state => state.auth.isAuthenticated);
    const access = localStorage.getItem('access');
    
    const shortenContent = (str) => {
        let res;
        if(str && str.length > 50) {
            res = str.substring(0, 50) + '...';
            return res;
        }
        else return str;
    }  
    
    return props.recipe && (
            <div className="card">
                <img src={props.recipe.imagePath} alt={props.recipe.title} />                            
                <div className="card-content">
                    <p>{props.recipe.title}</p>
                    <div className="card-time-rank">
                        {props.recipe && props.recipe.time && <span>
                            <FontAwesomeIcon icon={faClock} className="fontawesome" />
                                {props.recipe.time.prepTime}min
                        </span>}   
                        {props.recipe.ranking && props.recipe.ranking.number > 0 ? <AppRankingStars recipeData={props.recipe} /> : null}
                    </div>    
                    { authenticated && access === "admin" ? (
                        <Link to={`/admin/edit/${props.recipe.category}/${props.recipe._id}`} className="icon">
                            <FontAwesomeIcon icon={faEdit} className="fontawesome edit" />
                        </Link>
                    ) : null }
                    <div className="card-descr">{shortenContent(props.recipe.description)}</div>
                    <a href={`/${props.recipe.category}/${props.recipe.title}`}>
                        <button className="btn btn-open">Get the recipe...</button>                                    
                    </a>
                </div>
            </div>
        )
}

export default AppRecipeCard;
