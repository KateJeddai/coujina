import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserData, uploadUserPhoto, deleteUserPhoto, deleteUserSavedRecipe } from '../../actions/auth-actions';
import '../../styles/auth/PrivateRoom.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import AppRecipeCard from '../AppRecipeCard';

const PrivateRoom = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    let savedRecipes = useSelector(state => state.auth.user && state.auth.user.savedRecipes);
    let [recipes, setRecipes] = useState([]);

    const [avatarInput, setAvatarInput] = useState(false);
    const [imagePath, setImagePath] = useState('');
    const [errors, setErrors] = useState('');
        
    useEffect(() => {
        dispatch(getUserData());   
        return () => {}
    }, [dispatch])

    useEffect(() => {
        setRecipes(savedRecipes);
        return () => {}
    }, [savedRecipes])

    const handleAvatarInput = () => {
        setAvatarInput(true);
    }
    const handleChangePhoto = (e) => {
        setErrors('');
        const imagePath = e.target.files[0];
        var reader = new FileReader();
            reader.onload = () => {
               console.log(reader.result);
            };
            reader.readAsDataURL(imagePath);
            const MIME_TYPE_MAP = {
                'image/png': 'png',
                'image/jpeg': 'jpg',
                'image/jpg': 'jpg'
            };
            if(!MIME_TYPE_MAP[imagePath.type]) {
                setErrors('Invalid image mime type');
            }
            setImagePath(imagePath);
    }

    const handleUploadPhoto = () => {
        if(errors.length === 0) {
            setAvatarInput(false);     
            const formData = new FormData();
                  formData.append("imagePath", imagePath);  
            const userType = localStorage.getItem('google') == "true" ? 'google' : 'local';
            formData.append("userType", userType);
            dispatch(uploadUserPhoto(formData));
        }
    }

    const handleCancelUploadPhoto = () => {
        setAvatarInput(false);
        setErrors(''); 
    }

    const handleDeletePhoto = () => {
        const userType = localStorage.getItem('google') == "true" ? 'google' : 'local';
        const data = {userType}
        dispatch(deleteUserPhoto(data));
    }

    const handleChangeSearch = (e) => {
        if(e.target.value.trim() === '') {
            dispatch(getUserData());   
        }
        const recipesCopy = [...savedRecipes];
        const filteredRecipes = recipesCopy.filter(rec => rec.recipe.title.toLowerCase().includes(e.target.value.toLowerCase()));
        setRecipes(filteredRecipes); 
    }

    const handleSelectTime = (e) => {
        let t = e.target.value.split('-');   
        if(t[0] === "Search by cooking time:") {
            dispatch(getUserData());
        }
        const recipesCopy = [...savedRecipes];
        const data = recipesCopy.filter(rec => {
            let prep = +rec.recipe.time.prepTime;
            let cook = +rec.recipe.time.cookTime;
            let prepcook = prep + cook;  
            if(prepcook <= t[1] && prepcook > t[0]) { 
                return rec;
            }
        })
        return setRecipes(data);
    }

    const handleDeleteRecipe = (rec) => {
        const recipeId = rec._id;
        const userType = localStorage.getItem('google') == "true" ? 'google' : 'local';
        const data = {
            recipeId,
            userType 
        };
        dispatch(deleteUserSavedRecipe(data))
    }
    
    return (
            <div className="my_room-wrapper">
                <div className="my_profile-wrapper">
                    <div className="avatar-wrapper">
                       {user && user.imagePath ? (<React.Fragment>
                                                      <FontAwesomeIcon icon={faTimes} className="fontawesome close-icon" onClick={handleDeletePhoto} />
                                                      <img src={user.imagePath} alt="" />
                                                  </React.Fragment>) : 
                                                  <FontAwesomeIcon icon={faUser} className="fontawesome" />}
                    </div> 
                    <div className="profile-edit-wrapper">   
                        <div className="username">Welcome, {user && user.username}!</div>
                        <div className="btn btn-edit">
                            <Link to="/my-cabinet/edit" className="link link-edit">Edit Profile</Link>
                        </div>
                        <div className={!avatarInput ? "btn btn-edit show" : "btn btn-edit hide"}
                            onClick={handleAvatarInput}>
                            { user && user.imagePath ? "Change Photo" : "Upload Photo"}
                        </div>
                        <div className={avatarInput ? "input-group show" : "input-group hide"}>
                            <input type="file" name="file" id="file" onChange={handleChangePhoto} className="inputfile" />
                            <label className="input-file" htmlFor="file">Choose File</label><br/>   
                            {imagePath && imagePath.name && <p>{imagePath.name}</p> }                        
                            <button className="btn btn-upload"
                                    onClick={handleUploadPhoto}>
                                    Upload
                            </button>
                            <button className="btn btn-cancel"
                                    onClick={handleCancelUploadPhoto}>
                                        Cancel
                            </button>
                            {errors.length > 0 && <p>{errors}</p>}
                        </div>
                    </div>    
                </div>
                <div className="saved_recipes-wrapper">
                    <div className="filters-wrapper">
                        <h3>My Saved Recipes</h3>
                        <div className="filters-inner">
                            <div className="input-group search"> 
                                <input type="text" 
                                    placeholder="Search recipes by title" 
                                    onChange={handleChangeSearch} 
                                    />
                            </div>
                            <div className="input-group">   
                                <select className="select-sort" 
                                        onChange={handleSelectTime}
                                        defaultValue="Search by cooking time:"
                                        >
                                    <option>Search by cooking time:</option>
                                    <option value="0-30">Less than 30 min</option>
                                    <option value="30-60">30 min - 1 hour</option>
                                    <option value="60-120">1 hour - 2 hours</option>
                                    <option value="120-1200">More than 2 hours</option>
                                </select>
                            </div>
                        </div>    
                    </div>
                    <div className="saved_recipes-inner-wrapper">
                        {recipes && recipes.length > 0 ? recipes.map((rec, i) => {
                            return (
                                <div className="saved_recipe-card" key={i} >
                                    <AppRecipeCard recipe={rec.recipe} />
                                    <button className="btn btn-delete" onClick={() => handleDeleteRecipe(rec.recipe)}>
                                        <FontAwesomeIcon icon={faTimes} className="fontawesome" />
                                    </button>
                                </div>    
                            )
                        }) : <p>You don't have recipes saved.</p>}
                    </div>
                </div>
            </div>
        )
}

export default PrivateRoom;
