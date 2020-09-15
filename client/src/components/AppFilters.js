import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { history } from '../routers/AppRouter';
import '../styles/AppFilters.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretSquareRight } from '@fortawesome/free-solid-svg-icons';
import { searchRecipesByIngredient, searchRecipesByTime } from '../actions/filtersort-actions';


const AppFilters = (props) => {
    const [searchIngr, setSearchIngr] = useState('');
    const dispatch = useDispatch();

    const handleChangeIngredient = (e) => {
        const val = e.target.value;
        setSearchIngr(val);
    }
    const handleSubmit = () => {
        if(searchIngr) {
            dispatch(searchRecipesByIngredient(searchIngr));
            history.push('/search');            
        }
    }
    const handleKeyDown = (e) => {
        if(e.keyCode === 13) {
            handleSubmit();
        }
    }

    const handleSelectTime = (e) => {
        dispatch(searchRecipesByTime(e.target.value));
        history.push('/search');
    }


    return (
        <div className="filters-wrapper">
            <h2>Browse Recipes:</h2>
            <div className="input-group search"> 
                <input type="text" 
                       placeholder="Search by ingredient" 
                       onChange={handleChangeIngredient} 
                       onKeyDown={handleKeyDown} 
                       />
                       <FontAwesomeIcon icon={faCaretSquareRight} 
                                        className="fontawesome"
                                        onClick={handleSubmit} />
            </div>
            <div className="input-group">   
                <select className="select-sort" 
                        onChange={handleSelectTime}
                        defaultValue="Search by cooking time:"
                        >
                    <option disabled>Search by cooking time:</option>
                    <option value="0-30">Less than 30 min</option>
                    <option value="30-60">30 min - 1 hour</option>
                    <option value="60-120">1 hour - 2 hours</option>
                    <option value="120-1200">More than 2 hours</option>
                </select>
            </div>
        </div>
    )
}

export default AppFilters;
