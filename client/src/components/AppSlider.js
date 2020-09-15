import React, { useState, useEffect } from 'react';
import '../styles/AppSlider.scss';
import kouskous from "../images/kouskous.jpg";
import tajine from "../images/tajine.jpg";
import sweets from "../images/sweets-slider.jpg";
import brik from "../images/brik.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AppSlider = (props) => {
    let [index, setIndex] = useState(0);
    let [images] = useState([kouskous, tajine, brik, sweets]);
    
    const imgUrl = images[index];
    const divStyle = {
        backgroundImage: 'url(' + imgUrl + ')',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    };

 
    useEffect(() => {
        const interval = setInterval(() => {
            index++;
            setIndex(index);        
            if(index > (images.length - 1)) {
                index = 0;
                setIndex(0);
            }       
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const showPreviousSlide = () => {
        index--;
        setIndex(index);
        if(index < 0) {
            index = images.length - 1;
            setIndex(images.length - 1);
        }  
    }

    const showNextSlide = () => {
        index++;
        setIndex(index);
        if(index > (images.length - 1)) {
            index = 0;
            setIndex(0);
        }  
    }
 
    return (
        <div className="slider-wrapper">
           <div className="over-slider-div"><p>Discover the World of Tunisian Cuisine </p></div>
           { images.map((img, i) => (
              <div className={i === index ? "slider-img active" : "slider-img"} 
                   style={{...divStyle, backgroundImage: 'url(' + img + ')' }}
                   key={i}>
              </div>
           ))}
           <div className="icon left" onClick={showPreviousSlide}>
                <FontAwesomeIcon icon={faArrowLeft} className="fontawesome" />
            </div> 
            <div className="icon right"  onClick={showNextSlide}>
                <FontAwesomeIcon icon={faArrowRight} className="fontawesome" />
            </div>  
        </div>
    )
}

export default AppSlider;
