import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getNewRecipes } from '../actions/recipes-actions';

const AppNewRecipes = (props) => {
    const [limit] = useState(4);
    const newRecipes = useSelector(state => state.recipes.recipesAll);
    const dispatch = useDispatch();
     
    useEffect(() => {
        dispatch(getNewRecipes(limit, 1));
        return () => {}
    }, [dispatch, limit])

    return (
        <React.Fragment>
            <h3 className="new-title">Most Recent</h3>
            {newRecipes ? (newRecipes.map((rec, i) => (
                <Link to={`${rec.category}/${rec.title}`} key={rec._id}>
                            <div className="card">
                                <div className="img-lighten"></div>
                                <img src={rec.imagePath} alt={rec.title} />
                                <div className="card-title">
                                    {rec.title}
                                </div>
                            </div>
                </Link>
            ))) : (<p>No recipes</p>)
           }
           <Link to={`/new`} style={{ textDecoration: 'none'}}><p>More most recent...</p></Link>
        </React.Fragment>
    )
}

export default AppNewRecipes;
