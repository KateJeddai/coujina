import React, { useState, useEffect } from 'react';
import '../../styles/AppModal.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const AppModal = (props) => {
    const [modalClosed, setModalClosed] = useState(false);
    const {errors, message} = props;
    
    const closeModal = () => {
        setModalClosed(true);
    }

    useEffect(() => {        
        props.handleModal(modalClosed);
    }, [props, modalClosed]);

    return (
        <div className="modal-wrapper">
            <div className="inner-modal">
                {errors && errors.length > 0 ? errors.map((err, i) => (
                    <div className="modal-content" key={i}>{err}</div>
                )) : null}
                {message ? <p>{message}</p> : null }
                <div className="btn btn-close"> 
                    <FontAwesomeIcon icon={faTimes} className="fontawesome" onClick={closeModal} />
                </div>    
            </div>
        </div>
    )
};

export default AppModal;
