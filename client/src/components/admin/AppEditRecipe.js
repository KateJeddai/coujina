import React from 'react';
import { useSelector } from 'react-redux';
import AppForm from './AppForm';

const AppEditRecipe = (props) => {
    const { id, category } = props.match.params;
    const recipes = useSelector(state => state.recipes.recipes[category]);
    
    const recipeToEdit = recipes.filter(rec => rec._id === id)[0];
 
    return (
        <AppForm recipe={recipeToEdit} id={id} modeEditing="true" />        
    )
}

export default AppEditRecipe;
