import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './MoviesCardList.css';
import MoviesCard from '../MoviesCard/MoviesCard'
import Preloader from '../Preloader/Preloader';
import EmptyResults from '../EmptyResults/EmptyResults'
import {
    MIN_BIG_SCREEN_SIZE,
    MAX_MEDIUM_SCREEN_SIZE,
    MIN_MEDIUM_SCREEN_SIZE,
    MAX_SMALL_SCREEN_SIZE,
    CARDS_QUANTITY_DECKTOP,
    CARDS_QUANTITY_TABLET,
    CARDS_QUANTITY_MOBILE,
    CARDS_MORE_DECKTOP,
    CARDS_MORE_MOBILE,
    NOTHING_FOUND,
    MOVIES_SERVER_ERROR
} from "../../config/config";

function MoviesCardList({ filteredMovies, savedMovies, onSaveMovie, onDeleteMovie, isSavedFilms, isRequestError, isNotFound, isLoading }) {
    const currentLocation = useLocation().pathname;
    const [shownMoviesQuantity, setShownMoviesQuantity] = useState(0);

    function setShownQuantity() {
        const display = window.innerWidth;
        if (display > MIN_BIG_SCREEN_SIZE) {
            setShownMoviesQuantity(CARDS_QUANTITY_DECKTOP);
        } else if (display > MIN_MEDIUM_SCREEN_SIZE && display < MAX_MEDIUM_SCREEN_SIZE) {
            setShownMoviesQuantity(CARDS_QUANTITY_TABLET);
        } else if (display < MAX_SMALL_SCREEN_SIZE) {
            setShownMoviesQuantity(CARDS_QUANTITY_MOBILE);
        }
    }

    useEffect(() => {
        setShownQuantity();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            window.addEventListener('resize', setShownQuantity);
        }, 500);
        return () => {
            window.removeEventListener('resize', setShownQuantity);
        }
    }, []);


    function loadMoreMovies() {
        const display = window.innerWidth;
        if (display > MIN_BIG_SCREEN_SIZE) {
            setShownMoviesQuantity(shownMoviesQuantity + CARDS_MORE_DECKTOP);
        } else if (display > MIN_MEDIUM_SCREEN_SIZE && display < MAX_MEDIUM_SCREEN_SIZE) {
            setShownMoviesQuantity(shownMoviesQuantity + CARDS_MORE_MOBILE);
        } else if (display < MAX_SMALL_SCREEN_SIZE) {
            setShownMoviesQuantity(shownMoviesQuantity + CARDS_MORE_MOBILE);
        }
    }

    function getSavedMovieCard(savedMovies, card) {
        return savedMovies.find((savedMovie) => savedMovie.movieId === card.id);
    }

    return (
        <section className="cards" aria-label="Карточки фильмов">
            {isLoading && <Preloader />}
            {!isLoading && !isRequestError && !isNotFound && (
                <>
                    {currentLocation === '/saved-movies' ? (
                        <>
                            <ul className="cards__list">
                                {filteredMovies.map(item => {
                                    return (
                                        <MoviesCard
                                            card={item}
                                            key={isSavedFilms ? item._id : item.id}
                                            savedCard={getSavedMovieCard(savedMovies, item)}
                                            onSaveMovie={onSaveMovie}
                                            onDeleteMovie={onDeleteMovie}
                                            isSavedFilms={isSavedFilms}
                                            savedMovies={savedMovies}
                                        />
                                    )
                                }
                                )}
                            </ul>
                            <div className="cards__button-container"></div>
                        </>
                    ) : (
                        <>
                            <ul className="cards__list">
                                {filteredMovies.slice(0, shownMoviesQuantity).map(item => {
                                    return (
                                        <MoviesCard
                                            card={item}
                                            key={isSavedFilms ? item._id : item.id}
                                            savedCard={getSavedMovieCard(savedMovies, item)}
                                            onSaveMovie={onSaveMovie}
                                            onDeleteMovie={onDeleteMovie}
                                            isSavedFilms={isSavedFilms}
                                            savedMovies={savedMovies}
                                        />
                                    )
                                }
                                )}
                            </ul>
                            <div className="cards__button-container">
                                {filteredMovies.length > shownMoviesQuantity ? (
                                    <button onClick={loadMoreMovies} type="button" className="cards__loading-button">Ещё</button>
                                ) : ''}

                            </div>
                        </>
                    )}
                </>
            )}
            {isNotFound && !isLoading && <EmptyResults title={NOTHING_FOUND} />}
            {isRequestError && !isLoading && <EmptyResults title={MOVIES_SERVER_ERROR} />}
        </section>
    );
}

export default MoviesCardList;