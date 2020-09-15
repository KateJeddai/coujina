import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getRecipes } from '../actions/recipes-actions';
import AppRecipeCard from './AppRecipeCard';
import '../styles/AppIndividualRecipe.scss';

class AppNewFromCategory extends Component {
    componentDidMount() {
        this.props.getRecipes(this.props.category, 5, 1);
    }
    
    render() {
        const recipes = this.props.recipes[this.props.category];     
        let  category = this.props.category.split('');
             category = category.slice(0, 1)[0].toUpperCase() + category.slice(1, category.length).join('');
             
        return (
            <div className="new-recipes-wrapper">
                <h3>Most Recent of {category}</h3>
                <div className="new-from-category-wrapper">
                    {recipes ? recipes.map((rec, i) => (
                            <AppRecipeCard recipe={rec} key={i} />)) : null}
                </div>
            </div>
        )       
    }
}

const mapStateToProps = (state) => ({
    recipes: state.recipes.recipes
});

const mapDispatchToProps = (dispatch) => ({
    getRecipes: (cat, limit, start) => dispatch(getRecipes(cat, limit, start))
})

export default connect(mapStateToProps, mapDispatchToProps)(AppNewFromCategory);
