import React, { useState } from 'react';

const AppIngredients = (props) => {
    const { ingredients, editIngredients } = props;
    const quantityInput = React.createRef();
    const unitInput = React.createRef();
    const ingredientInput = React.createRef();

    let [newIngredient, setNewIngredient] = useState({});
    let [openEdit, setOpenEdit] = useState(false);
    let [ingredientToEdit, setIngredientToEdit] = useState({});
    let [editIndex, setEditIndex] = useState(null);

    const openEditInput = (e) => {
        e.preventDefault();
        const i = e.target.id;
        setEditIndex(i);
        setOpenEdit(true);
        setIngredientToEdit(ingredients[i]);
        setNewIngredient(ingredients[i]);
    }

    const handleChangeIngredient = () => {
        const ingredient = ingredientInput.current.value;
        const ingredientQuantity = quantityInput.current.value;
        let ingredientUnit = unitInput.current.value;

        if(ingredientQuantity > 1 && ingredientUnit === "item") {
            ingredientUnit = "items";
        }
        
        if(ingredient && ingredientQuantity && ingredientUnit) {
            const newIngredient = { name: ingredient, 
                                    quantity: ingredientQuantity.concat(' ').concat(ingredientUnit)};
            setNewIngredient(newIngredient); 
        }
    }
    
    const checkUniqueIngredient = () => {
        let unique;
        
        if(ingredients.length === 0) {
            unique = true;
        }
        ingredients.forEach(ingr => {
           if(ingr.name === newIngredient.name){
                unique = false; 
            } else unique = true;
        })
        return unique;
    }

    const saveIngredient = (e) => {
        e.preventDefault();
        setOpenEdit(false);
        setIngredientToEdit({});

        ingredients[editIndex] = newIngredient;
        editIngredients(ingredients);
    }
    
    const addIngredient = (e) => {
        e.preventDefault();
        const unique = checkUniqueIngredient();
        const newIngredients = [...ingredients];
            
        if(unique) {
            newIngredients.push(newIngredient);
            editIngredients(newIngredients);
        }
        ingredientInput.current.value = '';
        quantityInput.current.value = '';
        unitInput.current.value = ''; 
    }
    

    const deleteIngredient = (e) => {
        e.preventDefault();
        setOpenEdit(false);
        setIngredientToEdit({});

        ingredients.splice(editIndex, 1);
    }

    return (
        <fieldset className="input-group">  
            <legend>Ingredients</legend>
            <React.Fragment> 
            <div className="input-block">
                <div className="block-name">        
                    <label htmlFor="ingredient">Ingredient Name</label><br/>
                    <input type="text"
                            name="ingredient"
                            ref={ingredientInput}
                            onChange={handleChangeIngredient} 
                            required/>
                </div>
                <div className="block-quan">
                    <label htmlFor="ingr-quantity">Quantity</label><br/>       
                    <input type="number"
                        name="ingr-quantity" 
                        onChange={handleChangeIngredient}
                        ref={quantityInput} 
                        required/>
                </div>
                <div className="block-unit">      
                    <label htmlFor="ingr-unit">Measurement Unit</label><br/>         
                    <select name="ingr-unit" 
                        ref={unitInput} 
                        onChange={handleChangeIngredient}
                        required>
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                            <option value="lb">lb</option>
                            <option value="oz">oz</option>
                            <option value="l">l</option>
                            <option value="ml">ml</option>
                            <option value="cup">cup</option>                        
                            <option value="tablespoon">tablespoon</option>
                            <option value="teaspoon">teaspoon</option>
                            <option value="item">items</option>
                            <option value="clove">clove</option>
                            <option value="pinch">pinch</option>
                    </select> 
                </div>
            </div>
            <button className="btn btn-add" onClick={addIngredient}>Add Ingredient</button>
            { ingredients.length > 0 ?
                ingredients.map((ingr, i) => (
                    <div className="ingredient" key={i}>
                        {ingr.name} - {ingr.quantity}
                        <button className="btn btn-edit" id={i} onClick={openEditInput}>Edit Ingredient</button>
                    </div>
                ))  : null }   

            {openEdit ? (
            <div className="input-block">
                <div className="block-name">        
                    <label htmlFor="ingredient">Ingredient Name</label><br/>
                    <input type="text"
                        name="ingredient"
                        defaultValue={ingredientToEdit.name}
                        ref={ingredientInput}
                        onChange={handleChangeIngredient} 
                        required/>
                </div>
                <div className="block-quan">
                    <label htmlFor="ingr-quantity">Quantity</label><br/>       
                    <input type="number"
                        name="ingr-quantity" 
                        defaultValue={ingredientToEdit ? ingredientToEdit.quantity.match(/\d+/) : ''}
                        onChange={handleChangeIngredient}
                        ref={quantityInput} 
                        required/>
                </div>
                <div className="block-unit">      
                    <label htmlFor="ingr-unit">Measurement Unit</label><br/>         
                    <select name="ingr-unit" 
                        ref={unitInput} 
                        defaultValue={ingredientToEdit ? ingredientToEdit.quantity.match(/[a-zA-Z]+/) : ''}
                        onChange={handleChangeIngredient}
                        required>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="lb">lb</option>
                        <option value="oz">oz</option>
                        <option value="l">l</option>
                        <option value="ml">ml</option>
                        <option value="cup">cup</option>                        
                        <option value="tablespoon">tablespoon</option>
                        <option value="teaspoon">teaspoon</option>
                        <option value="item">item</option>
                        <option value="clove">clove</option>
                        <option value="pinch">pinch</option>
                    </select> 
                </div>                                        
                <button className="btn btn-add" onClick={saveIngredient}>Save Ingredient</button> 
                <button className="btn btn-delete" onClick={deleteIngredient}>Delete Ingredient</button> 
            </div>
            ) : null }
            </React.Fragment> 
        </fieldset>
    )
}

export default AppIngredients;
