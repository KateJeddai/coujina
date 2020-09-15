import React, {useState} from 'react'; 
import { Link } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import AppSearch from './AppSearch';
import '../styles/AppHeader.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import AppSidebar from './AppSidebar';

const AppHeader = (props) => {
    const [openedSearch, setOpenedSearch] = useState(false);
    const [navbar, setNavbar] = useState(false);

    const handleNavbarCollapsedFalse = (collapsed) => {
        setNavbar(collapsed);
    }

    const handleNavbarCollapsedTrue = (e) => {
        e.preventDefault();
        setNavbar(true);
    }

    const handleOpenSearch = (ifOpenedSearch) => {
        setOpenedSearch(ifOpenedSearch);
    }

    return (
        <React.Fragment>
            <AppSidebar navbarCollapsed={navbar} handleNavbarCollapsedFalse={handleNavbarCollapsedFalse} />
            <header>
                <AppNavbar></AppNavbar>
                <div className={!openedSearch ? "brand-wrapper" : "brand-wrapper md-search"} id="brand-wrapper">
                    <div className="inner-brand-wrapper">
                        <div className="navbar-collapse">
                            <FontAwesomeIcon icon={faBars} className="fontawesome" onClick={handleNavbarCollapsedTrue} />
                        </div>
                        <div className="logo-wrapper">
                            <h2><Link to="/" className="link">Coujina Haddu</Link></h2>
                        </div>
                    </div>    
                    <AppSearch handleOpenSearch={handleOpenSearch} />
                </div>
            </header>   
        </React.Fragment>
    )
}

export default AppHeader;
