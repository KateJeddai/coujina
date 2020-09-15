import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {logoutUser} from '../actions/auth-actions';
import '../styles/AppNavbar.scss';

class AppNavbar extends Component {
    constructor(props) {
      super(props);      
      this.toggle = this.toggle.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
      this.state = {
        isOpen: false,
        username: null
      };
    }

    componentDidUpdate(prevProps) {
      if (this.props.username !== prevProps.username) {
          this.setState(() => ({
            username: this.props.username
          }))
      }
    }     

    toggle() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }

    handleLogout() {
      this.props.logoutUser();
    }
    
    render() {
      const {username} = this.props;
      return (
        <div className="nav-wrapper">
          <div className="container nav-container">
            <div className="auth-wrapper">
              <div className="navbar">
                  { username ? (
                    <React.Fragment>                   
                        <div><a href="/auth/logout" className="nav-item auth" onClick={this.handleLogout}>Logout</a></div>
                        <Link to="/my-cabinet" className="nav-item auth">{username}</Link> 
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                        <Link to="/register" className="nav-item auth">Signup</Link>
                        <Link to="/login" className="nav-item auth">Login</Link>
                    </React.Fragment>
                  )}
              </div>    
            </div>
            <nav className="nav">
              <div className="navbar">
                  <div className="nav-item-wrapper">
                      <Link to="/couscous" className="nav-item main">Couscous</Link>
                      <div className="nav-item-underline"></div> 
                  </div>
                  <div className="nav-item-wrapper">
                      <Link to="/tajine" className="nav-item main">Tajine</Link>
                      <div className="nav-item-underline"></div>
                  </div>
                  <div className="nav-item-wrapper">    
                      <Link to="/marqat" className="nav-item main">Marqat</Link>
                      <div className="nav-item-underline"></div>
                  </div>
                  <div className="nav-item-wrapper">
                      <Link to="/soups" className="nav-item main">Soups and Salads</Link>
                      <div className="nav-item-underline"></div>
                  </div>
                  <div className="nav-item-wrapper">
                      <Link to="/dough" className="nav-item main">Dough and Sweets</Link>
                      <div className="nav-item-underline"></div>
                  </div>
              </div>
            </nav>
          </div>
        </div> 
      )
    }
  }
  
  const mapStateToProps = (state) => {
    return {
      username: state.auth.user && state.auth.user.username
    }
  }

  const mapDispatchToProps = (dispatch) => ({
    logoutUser: () => dispatch(logoutUser())
  })

  export default connect(mapStateToProps, mapDispatchToProps)(AppNavbar);
