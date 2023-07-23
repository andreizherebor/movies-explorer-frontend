import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import MainPage from '../../pages/MainPage/MainPage';
import MoviesPage from '../../pages/MoviesPage/MoviesPage';
import SavedMoviesPage from '../../pages/SavedMoviesPage/SavedMoviesPage';
import ProfilePage from '../../pages/ProfilePage/ProfilePage';
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';
import NotFound from '../../pages/NotFound/NotFound';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import SuccessImgSrc from '../../images/Info_Success.svg';
import FailImgSrc from '../../images/Info_Fail.svg';

function App() {

   
  const [isSuccessReg, setIsSuccessReg] = useState(true);
  const [isSuccessLogin, setIsSuccessLogin] = useState(false);
  const [isSuccessUpdate, setIsSuccessUpdate] = useState(false);

  const navigate = useNavigate();
 
  const [loggedIn, setLoggedIn] = useState(false);

  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
 
  const [infoTitle, setInfoTitle] = useState("Успешно!");
  const [infoImg, setInfoImg] = useState(SuccessImgSrc);

  function closeAllPopups() {
    setIsInfoPopupOpen(false);
  }

  function handleRegistration() {
    if (isSuccessReg === true) {
      setInfoTitle("Вы успешно зарегистрировались!");
      setInfoImg(SuccessImgSrc);
      navigate('/signin', { replace: true });
      setIsInfoPopupOpen(true);
    } else {
      setInfoTitle("Что-то пошло не так! Попробуйте ещё раз.");
      setInfoImg(FailImgSrc);
      setIsInfoPopupOpen(true);
    }
  }

  function handleLogin() {
    if (isSuccessLogin === true) {
      setLoggedIn(true);
      navigate('/movies', { replace: true });
    } else {
      setInfoTitle("Не получилось войти! Попробуйте ещё раз.");
      setInfoImg(FailImgSrc);
      setIsInfoPopupOpen(true);
    }
  }

  function handleUpdateUser() {
    if (isSuccessUpdate === true) {
      setInfoTitle("Данные успешно обновлены!");
      setInfoImg(SuccessImgSrc);
      setIsInfoPopupOpen(true);
    } else {
      setInfoTitle("Ошибка при обновлении данных! Попробуйте ещё раз.");
      setInfoImg(FailImgSrc);
      setIsInfoPopupOpen(true);
    }
  }

  function handleLogout() {
    setLoggedIn(false);
    navigate('/', { replace: true });
  }

  function handleEscClose(e) {
    if (e.key === 'Escape') {
      closeAllPopups();
    }
  }

  function handleOverlay(e) {
    if (!e.target.closest('.popup__container')) {
      closeAllPopups();
    }
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/saved-movies" element={<SavedMoviesPage />} />
        <Route path="/profile" element={<ProfilePage onUpdate={handleUpdateUser} />} />
        <Route path="/signin" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Register onRegister={handleRegistration} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <InfoTooltip
        isOpen={isInfoPopupOpen}
        onClose={closeAllPopups}
        infoTitle={infoTitle}
        infoImg={infoImg}
        onEscClick={handleEscClose}
        onOverlayClick={handleOverlay}
      />
    </>
  );
}

export default App;
