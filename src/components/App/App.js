import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import LoggedIn from "../LoggedIn/LoggedIn";
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
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import * as mainApi from '../../utils/MainApi';
import {
  REG_SUCCESS_MESSAGE,
  REG_UNSUCCESS_MESSAGE,
  LOGIN_UNSUCCESS_MESSAGE,
  USER_INFO_SUCCESS_MESSAGE,
  USER_INFO_UNSUCCESS_MESSAGE,
  MOVIE_SAVE_UNSUCCESS_MESSAGE,
  MOVIE_DELETE_UNSUCCESS_MESSAGE,
} from "../../config/config";

function App() {
  const pathLocation = useLocation().pathname;
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
  const [infoTitle, setInfoTitle] = useState("Успешно!");
  const [infoImg, setInfoImg] = useState(SuccessImgSrc);
  const [savedMovies, setSavedMovies] = useState([]);
  const [editSubmitTitle, setEditSubmitTitle] = useState("Сохранить");

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    if (loggedIn && currentToken) {
      Promise.all([mainApi.getUserInfo(currentToken), mainApi.getSavedMovies(currentToken)])
        .then(([resUser, resSavedMovies]) => {
          setCurrentUser(resUser);
          setSavedMovies(resSavedMovies.reverse());
        })
        .catch(() => {
          console.log(`Ошибка при загрузке данных пользователя и карточек.`);
        });
    }
  }, [loggedIn]);

  function handleRegistration({ name, email, password }) {
    setIsLoading(true);
    mainApi.registerUser(name, email, password)
      .then((res) => {
        if (res) {
          setInfoTitle(REG_SUCCESS_MESSAGE);
          setInfoImg(SuccessImgSrc);
          handleLogin({ email, password });
        }
      })
      .catch(() => {
        setInfoTitle(REG_UNSUCCESS_MESSAGE);
        setInfoImg(FailImgSrc);
      })
      .finally(() => {
        setIsInfoPopupOpen(true);
        setIsLoading(false);
      });
  }

  function handleLogin({ email, password }) {
    setIsLoading(true);
    mainApi.loginUser(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token)
          setLoggedIn(true);
          navigate('/movies', { replace: true });
        }
      })
      .catch((err) => {
        handleUnauthorized(err);
        setInfoTitle(LOGIN_UNSUCCESS_MESSAGE);
        setInfoImg(FailImgSrc);
        setIsInfoPopupOpen(true);
        console.log(`Ошибка при входе в систему`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleLogout() {
    setLoggedIn(false);
    localStorage.removeItem('movies');
    localStorage.removeItem('movieSearch');
    localStorage.removeItem('shortMovies');
    localStorage.removeItem('allMovies');
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  }

  function handleUnauthorized(err) {
    if (err === 'Ошибка: 401') {
      handleLogout();
    }
  }

  function checkToken() {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      mainApi.getContent(currentToken).then((res) => {
        if (res) {
          setLoggedIn(true);
          navigate(pathLocation);
        }
      })
        .catch(() => {
          console.log(`Ошибка при проверке токена`);
        });
    }
  }

  function closeAllPopups() {
    setIsInfoPopupOpen(false);
  }

  function handleUpdateUser(userData) {
    const currentToken = localStorage.getItem('token');
    setIsLoading(true);
    setEditSubmitTitle("Сохраняем...");
    const name = userData.name;
    const email = userData.email;
    mainApi.editUserInfo(name, email, currentToken)
      .then((res) => {
        setCurrentUser(res);
        setInfoTitle(USER_INFO_SUCCESS_MESSAGE);
        setInfoImg(SuccessImgSrc);
      })
      .catch((err) => {
        handleUnauthorized(err);
        setInfoTitle(USER_INFO_UNSUCCESS_MESSAGE);
        setInfoImg(FailImgSrc);
        console.log(`Ошибка при обновлении данных.`)
      })
      .finally(() => {
        setIsLoading(false);
        setIsInfoPopupOpen(true);
        setEditSubmitTitle("Сохранить")
      });
  }

  function saveMovie(movieCard) {
    const currentToken = localStorage.getItem('token');
    mainApi.saveMoviesCard(movieCard, currentToken)
      .then((savedCard) => {
        setSavedMovies([savedCard, ...savedMovies]);
        closeAllPopups();
        console.log(`Карточка cохранена.`)
      })
      .catch((err) => {
        handleUnauthorized(err);
        console.log(`Ошибка при сохранении карточки.`)
        setInfoTitle(MOVIE_SAVE_UNSUCCESS_MESSAGE);
        setInfoImg(FailImgSrc);
        setIsInfoPopupOpen(true);
      });
  }

  function deleteMovie(movieCard) {
    const currentToken = localStorage.getItem('token');
    mainApi.deleteMoviesCard(movieCard._id, currentToken)
      .then(() => {
        setSavedMovies((state) => state.filter((card) => card !== movieCard));
        closeAllPopups();
        console.log(`Карточка удалена.`)
      })
      .catch((err) => {
        handleUnauthorized(err);
        console.log(`Ошибка при удалении карточки.`)
        setInfoTitle(MOVIE_DELETE_UNSUCCESS_MESSAGE);
        setInfoImg(FailImgSrc);
        setIsInfoPopupOpen(true);
      });
  }

  function handleEscClose(e) {
    if (e.key === 'Escape') {
      closeAllPopups();
    }
  }

  function handleOverlay(e) {
    if (!e.target.closest('.popup-container')) {
      closeAllPopups();
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <>
        <Routes>
          <Route path="/movies" element={<ProtectedRoute
            element={MoviesPage}
            loggedIn={loggedIn}
            savedMovies={savedMovies}
            onSaveMovie={saveMovie}
            onDeleteMovie={deleteMovie}
          />} />
          <Route path="/saved-movies" element={<ProtectedRoute
            element={SavedMoviesPage}
            loggedIn={loggedIn}
            savedMovies={savedMovies}
            onDeleteMovie={deleteMovie}
          />} />
          <Route path="/profile" element={<ProtectedRoute
            element={ProfilePage}
            onUpdate={handleUpdateUser}
            editSubmitTitle={editSubmitTitle}
            logOut={handleLogout}
            isLoading={isLoading}
            loggedIn={loggedIn}
          />} />
          <Route path="/" element={<MainPage loggedIn={loggedIn} />} />
          <Route path="/signin" element={<LoggedIn 
            element={Login}
            loggedIn={loggedIn}
            onLogin={handleLogin}
            isLoading={isLoading}
          />} />
          <Route path="/signup" element={<LoggedIn 
            element={Register}
            loggedIn={loggedIn}
            onRegister={handleRegistration}
            isLoading={isLoading}
          />} />
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
    </CurrentUserContext.Provider>
  );
}

export default App;
