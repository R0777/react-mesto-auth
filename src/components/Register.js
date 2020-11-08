import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import * as auth from '../utils/auth';

const Register = (props) => {

    const [data, setData] = useState( {
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
          auth.register(email, password).then((res) => {
            if(res.statusCode !== 400){
              setMessage('');
              history.push('/');
            } else {
              setMessage('Что-то пошло не так!')
            }
          });
        
      }
    



    return (
        <section className="login">
            <form className="login__block" noValidate onSubmit={handleSubmit}>
                <h4 className="login__title">Регистрация</h4>
                <label className="login__field">
                <input
                    type="email"
                    className="login__input login__input_email"
                    id='login-input'
                    name="email"
                    placeholder="Email"
                    minLength="6"
                    maxLength="30"
                    required value={data.email} onChange={handleChange}/>
                <span className='login__input-error' id='email-input-error'>{message}</span>
            </label>
            <label className="login__field">
                <input
                    className="login__input login__input_password"
                    id='password-input'
                    placeholder="Пароль" 
                    name="password"
                    type="password"
                    required value={data.password} onChange={handleChange}/>
                <span className='login__input-error' id='pass-input-error'>{message}</span>
            </label>
                <button className="login__enter" type="submit">Зарегистрироваться</button>
                <p className="login__text"><Link className="login__link" to="/sign-in">Уже зарегистрированы? Войти</Link></p>
            </form>
        </section>
    );
}

export default Register;