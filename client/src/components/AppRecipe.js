import React, { Component } from 'react';
import { connect } from 'react-redux';
import { history } from '../routers/AppRouter';
import { getRecipe, cleanErrors } from '../actions/recipes-actions';
import { saveRecipeForUser } from '../actions/auth-actions';
import moment from 'moment';
import AppModal from './admin/AppModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import AppRankingStars from './AppRankingStars';

class AppRecipe extends Component {
    state = {
        saved: false,
        savingError: false,
        errors: [],
        rank: this.props.recipeRanking,
        comments: this.props.recipeData && this.props.recipeData.comments,
        message: ""
    };  
    
    ifSaved(recipeId) {
        const savedRecipeIndex = this.props.user.savedRecipes && 
                                 this.props.user.savedRecipes.map(rec => rec.recipe._id)
                                     .findIndex(id => id === recipeId);
               
        return savedRecipeIndex > -1;
     }

    componentDidMount() {
        this.props.getRecipe(this.props.recipe);      
    }    

    componentDidUpdate(prevProps) {        
        if(prevProps.recipe !== this.props.recipe) {
            this.props.getRecipe(this.props.recipe);
        }
        else if(prevProps.recipeData && prevProps.recipeData.comments && 
                prevProps.recipeData.comments.length !== this.props.recipeData.comments.length) {
                    this.props.getRecipe(this.props.recipe); 
        }
        else if(prevProps.recipeRanking !== this.props.recipeRanking) {
            this.setState(() => ({
                rank: this.props.recipeRanking
            }))
            if(prevProps.recipeData && prevProps.recipeData.ranking && 
                prevProps.recipeData.ranking.rankUsers.length !== this.props.recipeData.ranking.rankUsers.length) {                        
                this.setState(() => ({
                    message: "You've successfully ranked the recipe!"
                }))
            } 
        }
        else if(prevProps.user.savedRecipes && 
                prevProps.user.savedRecipes.length !== this.props.user.savedRecipes.length) {
                    this.setState(() => ({
                        saved: true
                    }))              
        }       
        else if(prevProps.errors !== this.props.errors && this.props.errors.length > 0) {
            this.setState(() => ({
                savingError: true,
                errors: [this.props.errors]
            }))
        }
    }

    formatDate(dateStr) {
        return moment(dateStr).format('LL'); 
    }

    handleSaveRecipe = () => {        
        if(!this.props.authenticated){
             history.push({
                 pathname: '/login',
                 state: { from: this.props.location }
             })
         }
        else if(this.props.authenticated) { 
            const recipeId = this.props.recipeData._id;
            const ifSaved = this.ifSaved(recipeId);
            if(!!ifSaved) {
                this.setState(() => ({
                    savingError: true,
                    errors: ['The recipe was saved before.']
                }))
            }
            
            const data = {
                recipeId,
                userType: localStorage.getItem('google') == "true" ? 'google' : 'local'
            };
            
            if(!ifSaved) {
                this.props.saveRecipeForUser(data);
            }         
        }
    }

    handleModal = (modalClosed) => {
        if(modalClosed) {
            this.setState(() => ({
                savingError: false,
                errors: [],
                message: ""
            }));
            this.props.cleanErrors([]);
        }
    }
    
    render() {
        const recipeData = this.props.recipeData;  
        const {savingError, errors, comments, message} = this.state;
        return this.props.loading ? (<p>Loading...</p>) : (
                    <React.Fragment>
                        {savingError ? <AppModal errors={errors} handleModal={this.handleModal} /> : null}
                        {message ? <AppModal message={message} handleModal={this.handleModal} /> : null}
                        {recipeData ? (                            
                        <div className="recipe-wrapper">
                            <h3>{recipeData.title}</h3>
                            <div className="date-and-save">
                                <p>{this.formatDate(recipeData.date)}</p>
                                {recipeData.ranking && recipeData.ranking.number > 0 && 
                                    <AppRankingStars recipeData={recipeData} 
                                                     rank={this.state.rank}
                                                     rankingSubmitted={this.rankingSubmitted} />}
                                {comments && comments.length > 0 && (
                                    <div className="comments-number">
                                        <FontAwesomeIcon icon={faComment} className="fontawesome"/>                                    
                                        <span>{recipeData.comments.length}</span>
                                    </div>
                                )}
                                <button className="btn btn-save"
                                        onClick={this.handleSaveRecipe}
                                        disabled={this.ifSaved(recipeData._id) || this.state.saved ? true : false}    
                                        >
                                            {this.ifSaved(recipeData._id) || this.state.saved ? "Saved" : "Save recipe"}
                                </button>
                            </div>       
                            <img src={recipeData.imagePath} alt={recipeData.title} />
                            {recipeData.time ? (
                                <div className="time-wrapper">
                                    <span>Preparation Time - {recipeData.time.prepTime}</span>
                                    <span>Cooking Time - {recipeData.time.cookTime}</span>
                                </div> ) : null }
                            <div className="ingrs-wrapper">
                                <ul>                    
                                    {recipeData.ingredients ? recipeData.ingredients.map((ingr, i) => (
                                        <li key={i}>{ingr.name} - {ingr.quantity}</li>
                                    )) : null}
                                </ul>
                            </div>
                            <div className="description-wrapper">
                                {recipeData.description}
                            </div>
                        </div> ) : <p>Recipe not found</p>}
                    </React.Fragment>
                ) 
    }
}
const mapStateToProps = (state) => {
    return {
        recipes: state.recipes.recipes,
        recipeData: state.recipes.recipe,
        recipeRanking: state.recipes.recipe && state.recipes.recipe.ranking ? state.recipes.recipe.ranking.rank : null,
        loading: state.recipes.loading,
        authenticated: state.auth.isAuthenticated,
        user: state.auth.user,
        errors: state.recipes.errors
    }
}

const mapDispatchToProps = (dispatch) => ({
    getRecipe: (title) => dispatch(getRecipe(title)),
    cleanErrors: (errs) => dispatch(cleanErrors(errs)),
    saveRecipeForUser: (data) => dispatch(saveRecipeForUser(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(AppRecipe);
