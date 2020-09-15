import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import '../styles/AppIndividualRecipe.scss';

const AppRanking = (props) => {
    const [pageFirstLoaded, setPageFirstLoaded] = useState(true);
    const {commentSubmit} = props;
    const [secondIconOnEntered, setSecondIconOnEntered] = useState(true);
    const [thirdIconOnEntered, setThirdIconOnEntered] = useState(true);
    const [fourthIconOnEntered, setFourthIconOnEntered] = useState(true);
    const [fifthIconOnEntered, setFifthIconOnEntered] = useState(true);

    const [rankingDone, setRankingDone] = useState(false);
    
    useEffect(() => {
        if(!commentSubmit) {
            setRankingDone(false);
            setPageFirstLoaded(true);
        }
        return () => {};
    }, [commentSubmit])
    

    const handleEnterIcon = (e) => {
        const id = e.target.id;
        if(!rankingDone) {
            switch(id) {
                case "1":
                    setSecondIconOnEntered(false);
                    setThirdIconOnEntered(false);
                    setFourthIconOnEntered(false);
                    setFifthIconOnEntered(false);
                    setPageFirstLoaded(false);
                    break;
                case "2":
                    setSecondIconOnEntered(true);
                    setThirdIconOnEntered(false);
                    setFourthIconOnEntered(false);
                    setFifthIconOnEntered(false);
                    setPageFirstLoaded(false);
                    break;
                case "3":
                    setThirdIconOnEntered(true);
                    setFourthIconOnEntered(false);
                    setFifthIconOnEntered(false);
                    setPageFirstLoaded(false);
                    break;
                case "4":
                    setPageFirstLoaded(false);   
                    setFifthIconOnEntered(false);                             
                    setFourthIconOnEntered(true);
                    break;
                case "5":
                    setFifthIconOnEntered(true);
                    setPageFirstLoaded(false);
                    break;
                default: setPageFirstLoaded(true);     
            }
        }    
    }

    const handleLeaveIcon = (e) => {
        const id = e.target.id;
        if(!rankingDone) {
            switch(id) {
                case "1":
                    setPageFirstLoaded(true);
                    break;
                case "2":
                    setSecondIconOnEntered(false);
                    setPageFirstLoaded(true); 
                    break;
                case "3":
                    setThirdIconOnEntered(false);
                    setPageFirstLoaded(true);
                    break;
                case "4":
                    setFourthIconOnEntered(false);
                    setPageFirstLoaded(true);
                    break;
                case "5":
                    setFifthIconOnEntered(false);
                    setPageFirstLoaded(true);
                    break;
                default: setPageFirstLoaded(true);     
            }
        }    
    }
    
    const handleRanking = (e)  => {
        setRankingDone(true);
        const rank = e.target.id;
        switch(rank) {
            case "1": 
                setPageFirstLoaded(false);
                setSecondIconOnEntered(false);
                setThirdIconOnEntered(false);
                setFourthIconOnEntered(false);
                setFifthIconOnEntered(false);
                break;
            case "2": 
                setPageFirstLoaded(false);
                setSecondIconOnEntered(true);
                setThirdIconOnEntered(false);
                setFourthIconOnEntered(false);
                setFifthIconOnEntered(false);
                break;
            case "3": 
                setPageFirstLoaded(false);
                setThirdIconOnEntered(true);
                setFourthIconOnEntered(false);
                setFifthIconOnEntered(false);
                break;
            case "4": 
                setPageFirstLoaded(false);
                setFourthIconOnEntered(true);
                setFifthIconOnEntered(false);
                break;
            case "5": 
                setPageFirstLoaded(false);
                setFifthIconOnEntered(true);
                break;    
            default: setPageFirstLoaded(true); 
        }
        props.handleRanking(rank);
    }

    return (
        <div className="ranking-wrapper">
            <div className="stars-wrapper">
                <span className="icon-div">
                     <div id="1" 
                          className="icon-div-wrap"                                    
                          onMouseEnter={handleEnterIcon}
                          onMouseLeave={handleLeaveIcon} 
                          onClick={handleRanking}></div>               
                     <FontAwesomeIcon icon={faStarSolid} 
                                      className="fontawesome"/>
                </span>
                <span className="icon-div">
                     <div id="2" 
                          className="icon-div-wrap"                                    
                          onMouseEnter={handleEnterIcon}
                          onMouseLeave={handleLeaveIcon} 
                          onClick={handleRanking}></div>   
                     <FontAwesomeIcon icon={pageFirstLoaded || 
                                     secondIconOnEntered || 
                                     thirdIconOnEntered ||
                                     fourthIconOnEntered ||
                                     fifthIconOnEntered ? faStarSolid : faStarRegular } 
                                     className="fontawesome"/>
                </span>
                <span className="icon-div">
                     <div id="3" 
                          className="icon-div-wrap"                                    
                          onMouseEnter={handleEnterIcon}
                          onMouseLeave={handleLeaveIcon} 
                          onClick={handleRanking}></div>                   
                     <FontAwesomeIcon icon={pageFirstLoaded || 
                                     thirdIconOnEntered ||
                                     fourthIconOnEntered || 
                                     fifthIconOnEntered ? faStarSolid : faStarRegular } 
                                     className="fontawesome"/>
                </span>
                <span className="icon-div">
                     <div id="4" 
                          className="icon-div-wrap"                                    
                          onMouseEnter={handleEnterIcon}
                          onMouseLeave={handleLeaveIcon} 
                          onClick={handleRanking}></div>   
                     <FontAwesomeIcon icon={pageFirstLoaded ||
                                     fourthIconOnEntered ||
                                     fifthIconOnEntered ? faStarSolid : faStarRegular }
                                     className="fontawesome"/>
                </span>
                <span className="icon-div">
                     <div id="5" 
                          className="icon-div-wrap"                                    
                          onMouseEnter={handleEnterIcon}
                          onMouseLeave={handleLeaveIcon} 
                          onClick={handleRanking}></div>   
                     <FontAwesomeIcon icon={pageFirstLoaded ||
                                            fifthIconOnEntered ? faStarSolid : faStarRegular }
                                      className="fontawesome"/>
                </span>
            </div>
            <p className="p-ranking">You may want to rank the recipe!</p>
        </div>
    )
}

export default AppRanking;
