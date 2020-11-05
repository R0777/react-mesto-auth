import React from 'react';
import logo from '../images/svg/logo.svg';

const Header = () => {
    return (
        <header className="header"><img src={logo} alt="логотип Mesto Russia" className="header__logo"/></header>
    );
}

export default Header;