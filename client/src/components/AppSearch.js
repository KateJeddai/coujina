import React, { useState, useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { history } from '../routers/AppRouter';
import '../styles/AppSearch.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { searchRecipes } from '../actions/filtersort-actions';

const AppSearch = (props) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchSubmitted, setSearchSubmitted] = useState(false);
    const saved = useSelector(state => state.filtersorted.searchRecipes);
    const dispatch = useDispatch();

    const [showForm, setShowForm] = useState(false);

    const handleSearch = (e) => {
        const searchValue = e.target.value;
        setSearchValue(searchValue);
    }

    const handleKeyDown = (e) => {
        if(e.keyCode === 13) {
                dispatch(searchRecipes(searchValue));
                setSearchSubmitted(true);        
                history.push('/search');
        }
    }

    const handleSubmitSearch = (e) => {
        e.preventDefault();
        dispatch(searchRecipes(searchValue));
        setSearchSubmitted(true);
        history.push('/search');
    }

    useEffect(() => {
        return (() => {
            setSearchValue('');
        })
    }, [searchSubmitted])

    useEffect(() => {
        return (() => {
            setSearchValue('');
        })
    }, [saved])

    const openSearch = (e) => {
        e.preventDefault();
        setShowForm(!showForm);
        props.handleOpenSearch(!showForm);
    }

    return (
        <div className="outer-search-wrapper">
            <div className="search-wrapper">
                <input type="text" placeholder="Search..." value={searchValue} onChange={handleSearch} onKeyDown={handleKeyDown} />
                <FontAwesomeIcon icon={faSearch} className="fontawesome" onClick={handleSubmitSearch} />
            </div>             
            <FontAwesomeIcon icon={faSearch} className="fontawesome hidden" onClick={handleSubmitSearch} />
            <FontAwesomeIcon icon={!showForm ? faSearch : faTimes} className="fontawesome hidden-700" onClick={openSearch} />
            <div className={showForm ? "search-wrapper-hidden translateX" : "search-wrapper-hidden"}>
                <input type="text" placeholder="Search..." value={searchValue} onChange={handleSearch} onKeyDown={handleKeyDown} />
                <FontAwesomeIcon icon={faSearch} className="fontawesome" onClick={handleSubmitSearch} />
            </div>
        </div>             
    ) 
}

export default AppSearch;
