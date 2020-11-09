import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { setToken } from '../utils/token';
import * as auth from '../utils/auth';

const Login = ({ handleLogin, handleTooltip }) => {


    const [data, setData] = useState({
        email: '',
        password: ''
      });
    
      const [message, setMessage] = useState('');
      const history = useHistory();
    
      const handleChange = (e) => {
        const {name, value} = e.target;
        setData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    
      const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password } = data;
    
        if (!email || !password){
        handleTooltip()
          return;
        }
    
        auth.authorize(email, password)
        .then((res) => {
          if (!res){
            handleTooltip()
            setMessage('Что-то пошло не так =( !')
          }
    
          if (res.token) {
            setToken(res.token);
            setData({ email: '', password: ''});
            setMessage('');
            handleLogin(data);
            history.push('/');
          }
          else handleTooltip()
        })
        .catch(err => {
          handleTooltip()
          console.log(err)
        });
      }
    

    return (
        <section className="login">
            <form className="login__block" noValidate onSubmit={handleSubmit}>
                <h4 className="login__title">Вход</h4>
                <label className="login__field">
                <input value={data.email} onChange={handleChange}
                    type="email"
                    className="login__input login__input_email"
                    id='login-input'
                    name="email"
                    placeholder="Email"
                    minLength="5"
                    maxLength="30"
                    required/>
                <span className='login__input-error' id='email-input-error'>{message}</span>
            </label>
            <label className="login__field">
                <input value={data.password} onChange={handleChange}
                    className="login__input login__input_password"
                    id='password-input'
                    placeholder="Пароль" 
                    name="password"
                    type="password"
                    required/>
                <span className='login__input-error' id='pass-input-error'>{message}</span>
            </label>
                <button className="login__enter" type="submit">Войти</button>
            </form>
        </section>
    );
}

export default Login;