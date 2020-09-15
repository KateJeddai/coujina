import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getRecipes } from '../actions/recipes-actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/AppMain.scss';
import {history} from '../routers/AppRouter';
import AppRankingStars from './AppRankingStars';

const AppCategoryCouscous = (props) => {
    const { limit } = props;
    const dispatch = useDispatch();  
    const authenticated = useSelector(state => state.auth.isAuthenticated);
    const recipesState = useSelector(state => state.recipes.recipes);
    const recipesDiff = useSelector(state => state.recipes.diff);

    const recipes = recipesState["couscous"]; 
    const access = localStorage.getItem('access'); 

    const generateHandler = (rec, method) => e => method(e, rec);

    const handleOpenRecipe = (e, rec) => {
       history.push(`/${rec.category}/${rec.title}`);
    } 

    const [start, setStart] = useState(1);

    const showOtherRecipes = (e) => {
        const right = e.target.classList.contains('right');
        if(right) {
            if(recipes["couscous"] && recipes["couscous"].length < limit || 
               recipes["couscous"] && recipes["couscous"].length === 0 || 
               recipesDiff["couscous"] <= limit) {
                    setStart(() => 1);
                    dispatch(getRecipes("couscous", limit, start));
            } 
            else {
                let copyStart = start;
                copyStart++;
                setStart(() => copyStart);
                dispatch(getRecipes("couscous", limit, start));
            }    
        } 
        else {
            if(start > 1) {
                let copyStart = start;
                copyStart--;
                setStart(() => copyStart);
                dispatch(getRecipes("couscous", limit, start));
            }
        }
    }

    return (
        <div className="category-wrapper">
            {recipes && recipes.length > 0 ? (
                    recipes.map((rec, i) => (
                        <div className="recipe-card" key={i}>
                            <span className="recipe-link" onClick={generateHandler(rec, handleOpenRecipe)}>
                                <div className="lighten-img"></div>
                                <div className="card-img">
                                    <img src={rec.imagePath} alt={rec.title} />
                                </div>    
                                <p className="card-title">{rec.title}</p>
                            </span>
                                <p className="time">
                                    <FontAwesomeIcon icon={faClock} className="fontawesome" />
                                    {rec.time.prepTime}
                                </p>  
                                {rec.ranking && rec.ranking.number > 0 && <AppRankingStars recipeData={rec} />}
                            { authenticated && access === "admin" ? (                        
                                <Link to={`/admin/edit/${rec.category}/${rec._id}`}>
                                    <FontAwesomeIcon icon={faEdit} className="fontawesome edit" />
                                </Link>
                            ) : null }    
                        </div>
                    ))
                ) : <h3>No recipes</h3>}
                <div className="icon left" onClick={showOtherRecipes}>
                    <FontAwesomeIcon icon={faArrowLeft} className="fontawesome"  />
                </div> 
                <div className="icon right"  onClick={showOtherRecipes}>
                    <FontAwesomeIcon icon={faArrowRight} className="fontawesome"  />
                </div> 
        </div>
        )
}

export default AppCategoryCouscous;

