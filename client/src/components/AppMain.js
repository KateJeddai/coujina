import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import AppSlider from './AppSlider';
import AppRecipeCategory from './AppRecipeCategory';
import AppNewRecipes from './AppNewRecipes';
//import AppLoading from './AppLoading';
import { getRecipes } from '../actions/recipes-actions';
import { getUserData } from '../actions/auth-actions';
import '../styles/AppMain.scss';
import AppFilters from './AppFilters';
import { categoriesTitles } from '../constants';
import queryString from 'query-string';

const AppMain = (props) => {
    let limitState = 4;    
    if(window.innerWidth < 600) {
        limitState = 1;
    }
    else if(window.innerWidth >= 600 && window.innerWidth < 900) {
        limitState = 2;
    }
    else if(window.innerWidth >= 900 && window.innerWidth < 1520) {
        limitState = 3;
    }
    else limitState = 4; 

    const [width, setWidth] = useState(window.innerWidth);
    const [limit, setLimit] = useState(limitState);    
    const [userId, setUserId] = useState(null);

    const dispatch = useDispatch(); 
    
    useEffect(() => {
        const user_id = queryString.parse(props.location.search).id;
        user_id && localStorage.setItem('id', user_id);
        const id = localStorage.getItem('id');
        if(id) {
            setUserId(id);
            dispatch(getUserData());
        }        
    }, [userId])     
    
    useEffect(() => {
        if(props.location.search.split(/[?=]/)[2] === "success") {
            return <Redirect to="/verification" />
        }
    }, [props])
    
    useEffect(() => {
        fetchRecipes();
        return () => {};
    }, [dispatch, limit])

    const fetchRecipes = () => {
        categoriesTitles.forEach((cat) => {
            dispatch(getRecipes(cat.name, limit, cat.range));
        });
    };

    const updateSize = useCallback(() => {
          setWidth(window.innerWidth);        
    }, [width]);

    window.addEventListener('resize', updateSize);
    
    useEffect(() => {
        updateSize();
        if(width < 600) {
            setLimit(1);
        }
        else if(width >= 600 && width < 900) {
            setLimit(2);
        }
        else if(width >= 900 && width < 1520) {
            setLimit(3);
        }
        else {
            setLimit(4);
        } 
        return () => window.removeEventListener('resize', updateSize);
    }, [width])
    
        
    const firstLetterToUppercase = (str) => {
        let res = str.split('');
            res = res.slice(0, 1)[0].toUpperCase() + res.slice(1, res.length).join('');
            return res;
    }  
    
    const [start, setStart] = useState(1);
    const [cat, setCat] = useState('');
    
    const handleGetMoreCategoryRecipes = (cat, start) => {
        setStart(() => start);
        setCat(() => cat);
    }

    useEffect(() => {        
        dispatch(getRecipes(cat, limit, start));        
        return () => {};
    }, [start, cat])

    const recipesState = useSelector(state => state.recipes.recipes);

    return (
        <React.Fragment>
          <AppSlider />  
          <AppFilters />          
          <main>
            <div className="new-recipes">
                <AppNewRecipes />
            </div>
            <div className="categories">
                {categoriesTitles.map((cat, i) => (
                    <div className="category-row" key={i}>
                        <h3 className="category-title" id={cat.name}>{firstLetterToUppercase(cat.name)}</h3>
                        <div className="category-content">
                            <AppRecipeCategory category={cat.name} 
                                            limit={limit} 
                                            handleGetMoreCategoryRecipes={handleGetMoreCategoryRecipes}
                                            recipes={recipesState[cat.name]} />
                        </div>
                    </div>
                ))}
            </div>
          </main> 
        </React.Fragment>
    )
}
  
export default AppMain;

