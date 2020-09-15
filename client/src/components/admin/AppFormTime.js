import React, { useState } from 'react';

const AppFormTime = (props) => {
    const { modeEditing, time, editTime } = props;
    const prepTimeInput = React.createRef();
    const cookTimeInput = React.createRef();

    const [prepTime, setPrepTime] = useState(time.prepTime);
    const [cookTime, setCookTime] = useState(time.cookTime);
    const [newTime, setNewTime] = useState({});

    const handleChangePrepTime = () => {
        const preparTime = prepTimeInput.current.value;
        setPrepTime(preparTime);

        if(!modeEditing) {
            const t = {...newTime, prepTime: preparTime};
            setNewTime(t);
            editTime(t);
        }
    }

    const handleChangeCookTime = () => {
        const cookingTime = cookTimeInput.current.value;
        setCookTime(cookingTime);

        if(!modeEditing) {
            const t = {...newTime, cookTime: cookingTime};
            setNewTime(t);
            editTime(t);
        }
    }

    const handleEditTime = (e) => {
        e.preventDefault();    
        const t = {prepTime: prepTime, cookTime: cookTime};
        setNewTime(t);
        editTime(t);
    }

   return modeEditing ? (
        <React.Fragment>
            <fieldset className="input-group">  
                <legend>Time</legend> 
                <div className="input-block"> 
                   <div className="block-time">          
                        <label htmlFor="preptime">Preparation Time</label><br/>
                        <input type="number"
                                name="preptime" 
                                defaultValue={time && time.prepTime ? time.prepTime.match(/\d+/) : ''}
                                onChange={handleChangePrepTime} 
                                ref={prepTimeInput} 
                                required />
                    </div>
                </div>                       
            </fieldset>
            <fieldset className="input-group">  
                <div className="input-block">
                    <div className="block-cook-time"> 
                        <label htmlFor="cooktime">Cooking Time</label><br/>
                        <input type="number"
                                name="cooktime"
                                defaultValue={time && time.cookTime ? time.cookTime.match(/\d+/) : ''}
                                onChange={handleChangeCookTime} 
                                ref={cookTimeInput} 
                                required/>
                    </div>
                </div>                      
            </fieldset>             
            <button className="btn btn-edit" onClick={handleEditTime}>Save</button> 
        </React.Fragment> ) : (
        <React.Fragment>
            <fieldset className="input-group">  
                <legend>Time</legend> 
                <div className="input-block"> 
                   <div className="block-time">          
                        <label htmlFor="preptime">Preparation Time</label><br/>
                        <input type="number"
                                name="preptime"
                                onChange={handleChangePrepTime} 
                                ref={prepTimeInput} 
                                required />
                    </div>
                </div>                       
            </fieldset>
            <fieldset className="input-group">  
                <div className="input-block">
                    <div className="block-cook-time"> 
                        <label htmlFor="cooktime">Cooking Time</label><br/>
                        <input type="number"
                                name="cooktime" 
                                onChange={handleChangeCookTime} 
                                ref={cookTimeInput} 
                                required/>
                    </div> 
                </div>                      
            </fieldset>
        </React.Fragment>
        )
}

export default AppFormTime;
