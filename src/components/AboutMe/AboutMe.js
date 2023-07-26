import React from "react";
import "./AboutMe.css";
import photo from "../../images/about-me_photo.jpg";

function AboutMe() {
  return (
    <section className="about-me" id="about-me" aria-label="Студент">
      <h2 className="about-me__title title">Студент</h2>
      <div className="about-me__container">
        <div className="about-me__content">
          <div className="about-me__info">
            <h3 className="about-me__name">Виталий</h3>
            <p className="about-me__profession">Фронтенд-разработчик, 30 лет</p>
            <p className="about-me__description">
              Я родился и живу в Саратове, закончил факультет экономики СГУ. У
              меня есть жена и дочь. Я люблю слушать музыку, а ещё увлекаюсь
              бегом. Недавно начал кодить. С 2015 года работал в компании «СКБ
              Контур». После того, как прошёл курс по веб-разработке, начал
              заниматься фриланс-заказами и ушёл с постоянной работы.
            </p>
          </div>
          <a
            className="about-me__link"
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
        </div>
        <img className="about-me__photo" src={photo} alt="Фотография" />
      </div>
    </section>
  );
}

export default AboutMe;
