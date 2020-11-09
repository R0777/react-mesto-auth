import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header.js';
import Main from './Main.js';
import Login from './Login';
import Register from './Register';
import EditAvatarPopup from './EditAvatarPopup'
import EditProfilePopup from './EditProfilePopup'
import PopupWithForm from './PopupWithForm';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';
import Footer from './Footer.js';
import '../index.css';
import * as auth from '../utils/auth.js';
import { getToken } from '../utils/token';
import {api} from '../utils/api.js';
import {CurrentUserContext} from '../contexts/CurrentUserContext'
import {CurrentCardContext} from '../contexts/CurrentCardContext'

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState({ email: '', password: ''});
    const history = useHistory();

    const handleLogin = (userData) => {
        setUserData(userData);
        setLoggedIn(true);
        handleTooltip()
    }
    
    const tokenCheck = () => {
        const jwt = getToken();
    
        if (!jwt) {
        return;
        }
    
        auth.getContent(jwt).then((res) => {
        if (res) {
            const userData = {
            email: res.email,
            password: res.password
            }

            setLoggedIn(true);
            setUserData(userData);
            history.push('/sign-in')
        }
        });
    }

    const signOut = () => {
        localStorage.removeItem('jwt');
        history.push('/sign-in');
    }
    
        useEffect(() => {
        tokenCheck();
    }, []);
        

    const [isEditProfilePopupOpen,
        setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen,
        setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen,
        setIsEditAvatarPopupOpen] = React.useState(false);
    const [isTrashOpen,
        setIsTrashOpen] = React.useState(false);
    const [isTooltipOpen,
            setTooltipOpen] = React.useState(false);
    const [isSelectedCard,
        setIsSelectedCard] = React.useState()
    const [currentUser,
        setCurrentUser] = React.useState({})
    const [currentCards,
        setCurrentCards] = React.useState([])

    React.useEffect(() => {

        Promise.all([
            api.getProfile(),
            api.getInitialCards()
        ]).then(res => {
            const [profile, card] = res
            setCurrentUser(profile)
            setCurrentCards(card)
        }).catch((err) => {
            console.log(err);
        })
    }, [])
    
    const handleCardLike = (card) => {
        const isLiked = card
            .likes
            .some(i => i._id === currentUser._id);
        if (!isLiked) {
            api
                .addLike(card.id)
                .then((newCard) => {

                    const newCards = currentCards.map((c) => c._id === card.id
                        ? newCard
                        : c);
                    setCurrentCards(newCards);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            api
                .unLike(card.id)
                .then((newCard) => {

                    const newCards = currentCards.map((c) => c._id === card.id
                        ? newCard
                        : c);
                    setCurrentCards(newCards);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    const handleDeleteCard = (card) => {

        api
            .deleteCard(card.id)
            .then(res => {
                const deletedCard = currentCards.filter(el => el._id !== card.id)
                setCurrentCards(deletedCard);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true)
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true)
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true)
    }

    function handleTrashClick() {
        setIsTrashOpen(true)
    }

    const handleCardClick = (card) => {
        setIsSelectedCard(card)
    }

    function handleTooltip() {
        setTooltipOpen(true)
    }

    function closeAllPopups() {
        setIsAddPlacePopupOpen(false)
        setIsEditProfilePopupOpen(false)
        setIsEditAvatarPopupOpen(false)
        setIsTrashOpen(false)
        setTooltipOpen(false)
        setIsSelectedCard()
    }

    function handleUpdateUser({name, about}) {
        api
            .setProfile(name, about)
            .then(res => {
                setCurrentUser(res)
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleUpdateAvatar = ({avatar}) => {
        api
            .profileAvatar(avatar)
            .then(res => {
                setCurrentUser(res)
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleAddPlaceSubmit = ({place, link}) => {
        api
            .setCard(place, link)
            .then(res => {
                setCurrentCards([
                    res, ...currentCards
                ])
                closeAllPopups();
            })
        
    }

    return (
        <CurrentCardContext.Provider value={currentCards}>
            <CurrentUserContext.Provider value={currentUser}>
                <div className="page">
                    <Switch>

                    <Route path="/sign-in">
                    <InfoTooltip 
                        onClose={closeAllPopups} 
                        isTooltipOpen={isTooltipOpen} 
                        tooltipTitle="Что-то пошло не так! Попробуйте ещё раз." />
                    <Header 
                        loginText="Регистрация" 
                        link="/sign-up" />
                    <Login 
                        handleLogin={handleLogin} 
                        handleTooltip={handleTooltip} />
                    </Route>
                    <Route 
                        path="/sign-up">
                    <Header 
                        loginText="Войти" 
                        link="/sign-in" />
                    <Register />
                    </Route>
                
                    <ProtectedRoute 
                        path="/" 
                        loginText="Выйти" 
                        userData={userData} 
                        link=""
                        signOut={signOut}
                        handleTooltip={handleTooltip}
                        isTooltipOpen={isTooltipOpen}
                        loggedIn={loggedIn}
                        component={Main}
                        onCardLike={handleCardLike}
                        onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}
                        onTrash={handleTrashClick}
                        onEditAvatar={handleEditAvatarClick}
                        onClose={closeAllPopups}
                        card={isSelectedCard}
                        onCardClick={handleCardClick}
                        onCardDelete={handleDeleteCard} />
            
                            <Route>
                        {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
                    </Route>
                    </Switch>
                    <EditProfilePopup
                        title="Редактировать профиль"
                        id="profile"
                        isOpen={isEditProfilePopupOpen}
                        buttonText={'Сохранить'}
                        isClose={closeAllPopups}
                        onUpdateUser={handleUpdateUser}/>
                    <AddPlacePopup
                        title="Новое место"
                        id="add-card"
                        isOpen={isAddPlacePopupOpen}
                        buttonText={'Сохранить'}
                        isClose={closeAllPopups}
                        onAddPlace={handleAddPlaceSubmit}/>

                    <EditAvatarPopup
                        title="Обновить аватар"
                        id="new-avatar"
                        buttonText={'Обновить'}
                        isOpen={isEditAvatarPopupOpen}
                        isClose={closeAllPopups}
                        onUpdateAvatar={handleUpdateAvatar}/>

                    <PopupWithForm
                        title="Вы уверены?"
                        id="remove-card"
                        buttonText={'Удалить'}
                        isOpen={isTrashOpen}
                        isClose={closeAllPopups}/>
                        <Footer />
                </div>
            </CurrentUserContext.Provider>
        </CurrentCardContext.Provider>

    );
}

export default App;
