import React, { Component } from 'react';
import {history} from '../routers/AppRouter';
import { connect } from 'react-redux';
import { getNewRecipes, getRecipes } from '../actions/recipes-actions';
import AppRecipeCard from './AppRecipeCard';
import AppLoading from './AppLoading';
import AppPagination from './AppPagination';
import '../styles/AppNewRecipesPage.scss';

class AppNewRecipesPage extends Component {
    state = {
        recipes: [],
        route: this.props.match.params.cat,
        limit: 4,
        startAt: 1
    }

    componentDidMount() {
       const { route, limit, startAt } = this.state;
       switch(route) {
            case "new":
                this.props.getNewRecipes(limit, startAt); 
                this.setState(() => ({
                    recipes: this.props.recipes
                }))               
                break;
            case "couscous":
            case "tajine":
            case "marqat":
            case "soups":
            case "dough":    
                this.props.getRecipes(route, limit, startAt);
                this.setState(() => ({
                    recipes: this.props.recipesByCategory[route]
                }))
                break;
            default: 
                history.push('/')
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.match.params.cat !== this.props.match.params.cat) {
            this.setState(() => ({
                route: this.props.match.params.cat
            }))
        }
    }
     
    handleChangePage = (num) => {        
        const { route, limit } = this.state;
        this.setState(() => ({
            startAt: num
        }));
        if(route === "new") {
            this.props.getNewRecipes(limit, num);
            this.setState(() => ({
                recipes: this.props.recipes
            })) 
        }
        else {
            this.props.getRecipes(route, limit, num);
            this.setState(() => ({
                recipes: this.props.recipesByCategory[route]
            }))
        }
    }
   
    render() {
        const { route, limit } = this.state;
        const { count } = this.props;
        const numberOfPages = Math.ceil(count / limit);
        const recipes = route === "new" ? this.props.recipes : this.props.recipesByCategory[route];
        
        return (
            <React.Fragment>
                <div className="newrecipes-wrapper">
                    {!this.props.loading ? recipes && recipes.length > 0 && recipes.map((rec, i) => (
                        <div className="card-wrapper" key={rec.title}>
                            <AppRecipeCard recipe={rec} />
                        </div> 
                    )) : <AppLoading />}
                </div>
                <AppPagination numberOfPages={numberOfPages} handlePageChange={this.handleChangePage} />
            </React.Fragment>    
        )
    }
}

const mapStateToProps = (state) => { 
    return {
        recipes: state.recipes.recipesAll,
        recipesByCategory: state.recipes.recipes,
        loading: state.recipes.loading,
        count: state.recipes.count
    }
}
    
const mapDispatchToProps = (dispatch) => ({
    getNewRecipes: (lim, start) => dispatch(getNewRecipes(lim, start)),
    getRecipes: (cat, lim, start) => dispatch(getRecipes(cat, lim, start))
})

export default connect(mapStateToProps, mapDispatchToProps)(AppNewRecipesPage);
