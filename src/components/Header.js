import React from 'react';
import { Link } from 'react-router-dom'
import logo from '../images/svg/logo.svg';

const Header = (props) => {

    return (
    <header className="header"><img src={logo} alt="логотип Mesto Russia" className="header__logo"/>
    <p className="header__login-email">{props.userData && props.userData.email}</p>
    <p className="header__login-text" onClick={props.signOut && props.signOut}><Link to={props.link && props.link} className="login__link">{props.loginText}</Link></p></header>
    );
}

export default Header;