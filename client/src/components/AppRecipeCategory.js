import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/AppMain.scss';
import {history} from '../routers/AppRouter';
import AppRankingStars from './AppRankingStars';
import { categoriesTitles } from '../constants';
//import AppLoading from './AppLoading';


const AppRecipeCategory = (props) => {
    const { limit, category, recipes } = props;
    const authenticated = useSelector(state => state.recipes.isAuthenticated);
    const recipesDiff = useSelector(state => state.recipes.diff);
    //const loading = useSelector(state => state.recipes.loading);
    console.log(recipes)

    const access = localStorage.getItem('access'); 

    const generateHandler = (rec, method) => e => method(e, rec);

    const handleOpenRecipe = (e, rec) => {
       history.push(`/${rec.category}/${rec.title}`);
    } 
    
    const [start, setStart] = useState(1);

    const passCategoryAndStart = (start) => {        
        props.handleGetMoreCategoryRecipes(category, start)
    }   

    const showOtherRecipes = (e) => {
        const right = e.target.classList.contains('right');
        categoriesTitles.forEach((cat, i) => {
            if(cat.name === e.target.id) {
                if(right) {
                    if(recipes[cat.name] && recipes[cat.name].length < limit || 
                       recipes[cat.name] && recipes[cat.name].length === 0 || 
                       recipesDiff[cat.name] <= limit) {
                            setStart(() => 1);
                            passCategoryAndStart(1);
                    } 
                    else {
                       let copyStart = start;
                       copyStart++;
                       setStart(() => copyStart);
                       passCategoryAndStart(copyStart);
                    }    
                } 
                else {
                    let copyStart = start;                       
                    if(start > 1) {
                       copyStart--;
                       setStart(() => copyStart);
                    }                    
                    passCategoryAndStart(copyStart);
               }
            }
        })
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
                <div className="icon left" onClick={showOtherRecipes} id={category}>
                    <FontAwesomeIcon icon={faArrowLeft} className="fontawesome"  />
                </div> 
                <div className="icon right"  onClick={showOtherRecipes} id={category}>
                    <FontAwesomeIcon icon={faArrowRight} className="fontawesome"  />
                </div> 
        </div>
        )
}

export default AppRecipeCategory;
 
