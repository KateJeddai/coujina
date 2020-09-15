import React, { Component } from 'react';
import AppNewFromCategory from './AppNewFromCategory';
import AppRecipe from './AppRecipe';
import AppComments from './AppComments';
import '../styles/AppIndividualRecipe.scss';


class AppIndividualRecipe extends Component {
    state = { 
        category: this.props.match.params.category, 
        recipe: this.props.match.params.recipe,
        rankingChanged: false
    };
    
    componentDidUpdate(prevProps) {
        if(prevProps.match.params.recipe !== this.props.match.params.recipe) {
            this.setState(() => ({
                recipe: this.props.match.params.recipe
            }))
        }
    }

    render() {
        const { category, recipe } = this.state;
      
        return (
            <div className="recipe-container">
                <div className="recipe_comments-wrapper">                    
                    <AppRecipe recipe={recipe} location={this.props.location.pathname} />
                    <AppComments recipe={recipe} location={this.props.location.pathname} />
                </div>
                <AppNewFromCategory category={category} />
            </div>
        )
    }
}

export default AppIndividualRecipe;
