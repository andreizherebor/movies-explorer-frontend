import React from 'react';
import AuthForm from '../../components/AuthForm/AuthForm';
import { useState } from 'react';
import CurrentUser from '../../utils/CurrentUser';

function Login({ onLogin }) {
  const [emailValue, setEmailValue] = useState(CurrentUser.email);
  const [passwordValue, setPasswordValue] = useState("password");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
    setEmailValue("");
    setPasswordValue("");
  }

  function changeEmail(e) {
    setEmailValue(e.target.value);
  }


  function changePassword(e) {
    setPasswordValue(e.target.value);
  }
  return (
    <main className="content page__content">
      <AuthForm
        type="login"
        title="Рады видеть!"
        formName="login-form"
        onSubmit={handleSubmit}
        buttonTitle="Войти"
        linkText="Ещё не зарегистрированы?"
        link="/signup"
        linkTitle="Регистрация"
      >
        <div className="auth__form-block auth__form-block_type_login">
          <label className="auth__label" htmlFor="email">E-mail</label>
          <input
            onChange={changeEmail}
            className="auth__input auth__input_type_login"
            type="email"
            value={emailValue || ""}
            name="email"
            id="email"
            placeholder="E-mail"
            minLength="2"
            maxLength="30"
            required
          />
          <span id="email-error" className="auth__error">Что-то пошло не так...</span>
        </div>
        <div className="auth__form-block auth__form-block_type_login">
          <label className="auth__label" htmlFor="password">Пароль</label>
          <input
            onChange={changePassword}
            className="auth__input auth__input_type_login"
            type="password"
            value={passwordValue || ""}
            name="password"
            id="password"
            placeholder="Пароль"
            minLength="6"
            maxLength="30"
            required />
          <span id="password-error" className="auth__error">Что-то пошло не так...</span>
        </div>
      </AuthForm>
    </main>
  );
}

export default Login;