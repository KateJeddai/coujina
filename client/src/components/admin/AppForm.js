import React, { Component } from 'react';
import { history } from '../../routers/AppRouter';
import { connect } from 'react-redux';
import { addRecipe, updateRecipe, deleteRecipe, cleanErrors } from '../../actions/recipes-actions';
import AppIngredients from './AppIngredients';
import AppFormTime from './AppFormTime';
import AppModal from './AppModal';
import '../../styles/AppForm.scss';

class AppForm extends Component {
    state = {
        id: this.props.id || '',
        title: this.props.recipe ? this.props.recipe.title : '',
        imagePath: this.props.recipe ? this.props.recipe.imagePath : '',
        category: this.props.recipe ? this.props.recipe.category : '',
        ingredients: this.props.recipe ? this.props.recipe.ingredients : [],
        newIngredient: '',
        time: { 
            prepTime: this.props.recipe && this.props.recipe.time ? this.props.recipe.time.prepTime : '',
            cookTime: this.props.recipe && this.props.recipe.time ? this.props.recipe.time.cookTime : ''
        },
        prepTime: '',
        cookTime: '',
        description: this.props.recipe ? this.props.recipe.description : '',
        modeEditing: this.props.modeEditing || false,
        image: '',
        error: false,
        errors: this.props.errors || []
    };

    handleChangeTitle = (e) => {
        const title = e.target.value.trim();
        this.setState(() => ({
            title 
        }));
    }

    handleChangeImage = (e) => {
        const imagePath = e.target.files[0];
        var reader = new FileReader();
            reader.onload = () => {
                this.setState(() => ({
                    image: reader.result
                }))
            };
            reader.readAsDataURL(imagePath);
            const MIME_TYPE_MAP = {
                'image/png': 'png',
                'image/jpeg': 'jpg',
                'image/jpg': 'jpg'
            };
            
            if(!MIME_TYPE_MAP[imagePath.type]) {
                const {errors} = this.state;
                errors.push('Invalid image mime type');
                this.setState(() => ({
                    error: true,
                    errors: [...errors]
                }))
            }
            this.setState(() => ({
                imagePath 
            }));
    }

    handleChangeCategory = (e) => {
        const category = e.target.value.trim().toLowerCase();
        this.setState(() => ({
            category
        }));
    }

    editIngredients = (ingredients) => {
        this.setState(() => ({
            ingredients
        }))
    }

    editTime = (time) => {
        this.setState(() => ({
            time
        }))
    }

    handleChangeDescription = (e) => {
        const description = e.target.value;
        this.setState(() => ({
            description
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { id, title, imagePath, category, ingredients, time, description, modeEditing } = this.state;
        if(!title || 
           !category || 
           !imagePath || 
           ingredients.length <= 0 || 
           !time.cookTime || 
           !time.prepTime || 
           !description) {
            this.setState(() => ({
                error: true
            }))
        }
        else if(title && category && imagePath && ingredients.length > 0 && time.cookTime && time.prepTime && description) {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("imagePath", imagePath);
            formData.append("category", category);
            formData.append("ingredients", JSON.stringify(ingredients));
            formData.append("time", JSON.stringify(time));
            formData.append("description", description);
            formData.append("date", Date.now());

            !modeEditing ? this.props.addRecipe(formData) : this.props.updateRecipe(id, formData);
            history.push('/');
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.errors.length !== this.props.errors.length && this.props.errors.length > 0) {
            console.log(this.props.errors)
            this.setState(() => ({
                error: true,
                errors: this.props.errors
            }))
        }
    }

    handleModal = (modalClosed) => {
        if(modalClosed) {
            this.setState(() => ({
                error: false,
                errors: []
            }))
            this.props.cleanErrors([]);
        }
    }
    
    handleDeleteRecipe = (e) => {
        e.preventDefault();
        this.props.deleteRecipe(e.target.id, this.state.category);
        history.push('/');
    }

    render() {
        const { id, title, category, image, imagePath, ingredients, time, description, modeEditing, error } = this.state;
        return (
          <React.Fragment> 
            { error ? <AppModal handleModal={this.handleModal} 
                                errors={this.state.errors}  
                                /> : null }
            <div className="form-recipe-wrapper">
                <form>
                    {modeEditing ? (<button className="button btn-delete" id={id} onClick={this.handleDeleteRecipe}>
                                       Delete Recipe
                                   </button>) : null }
                    <div className="input-group">
                        <label htmlFor="title">Title</label><br/>
                        <input type="text"
                            name="title"
                            defaultValue={title}
                            onChange={this.handleChangeTitle} 
                            required
                            autoFocus />
                    </div>
                    <div className="input-group">           
                        <label htmlFor="imagePath">Image</label><br/>
                        <input type="file"
                            name="imagePath"
                            onChange={this.handleChangeImage} 
                            />  
                        <div className="img-preview"><img src={image ? image : imagePath} alt="" /></div>            
                    </div>
                    <div className="input-group">           
                        <label htmlFor="category">Category</label><br/>
                        <input type="text"
                            name="category"
                            defaultValue={category} 
                            onChange={this.handleChangeCategory} 
                            required />       
                    </div>
                    <AppIngredients ingredients={ingredients} 
                                    editIngredients={this.editIngredients}
                                    />
                    <AppFormTime time={time}
                                modeEditing={modeEditing} 
                                editTime={this.editTime} />
                    <div className="input-group">
                        <label htmlFor="description">Description</label><br/>
                        <textarea name="description"
                            rows="10"
                            defaultValue={description}
                            placeholder="Recipe description..."
                            onChange={this.handleChangeDescription}
                            required>
                        </textarea>
                    </div>    
                    <button className="btn btn-submit" type="submit" onClick={this.handleSubmit}>
                        {modeEditing ? 'Save' : 'Submit'}
                    </button>
                </form>
            </div>  
        </React.Fragment>    
        )
    }
}

const mapStateToProps = (state) => ({
    errors: state.recipes.errors
})

const mapDispatchToProps = (dispatch) => ({
    addRecipe: (recipe) => dispatch(addRecipe(recipe)),
    updateRecipe: (id, recipe) => dispatch(updateRecipe(id, recipe)),
    deleteRecipe: (id, cat) => dispatch(deleteRecipe(id, cat)),
    cleanErrors: (errors) => dispatch(cleanErrors(errors))
})

export default connect(mapStateToProps, mapDispatchToProps)(AppForm);
