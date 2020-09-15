import React from 'react';
import { useSelector } from 'react-redux';
import AppRecipeCard from './AppRecipeCard';
import AppLoading from './AppLoading';
import '../styles/AppSearchRes.scss';

const AppSearchRes = (props) => {
    const recipes = useSelector(state => state.filtersorted.searchRecipes);
    const loading = useSelector(state => state.filtersorted.loading);
     
    return !loading ? recipes && recipes.length > 0 ? (
            <div className="search_results-wrapper">
                {recipes.map((rec, i) => (
                    <div key={i} className="search_result-card">
                        <AppRecipeCard recipe={rec} />
                    </div>
                ))}
            </div> ) : (
                        <div className="search_results-wrapper">
                            <p className="recipes-notfound">No recipes were found</p>
                        </div>    
            ) : (
                <AppLoading />
            )
}

export default AppSearchRes;
