import '../pages/market.css';
import {openModal, closeModal, initOverlayClose} from './popup.js';
import {enableValidation, clearValidation} from './validation.js';
import {auth} from './auth.js';
import {menuBtnsActive} from './menu-button.js';

const singUp = document.querySelector('.popup-filter-sign-up');
const logIn = document.querySelector('.popup-filter-log-in');
const not = document.querySelector('.popup-filter-not');
const singUpForm = document.forms['sign-up'];
const logInForm = document.forms['log-in'];
const signUpBtn = document.querySelectorAll('.sign-up');
const logInBtn = document.querySelectorAll('.log-in');
const notBtn = document.querySelectorAll('.not');
const closeLogInBtn = document.querySelector('.popup-close__button-sing-in');
const closeSingUpBtn = document.querySelector('.popup-close__button');
const indexBtn = document.querySelector('.index-button');
const btnMenu = Array.from(document.querySelectorAll('.menu'));

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'button_inactive',
  inputErrorClass: 'form__input_type_error',
  errorClass: 'form__input-error_active'
};

menuBtnsActive(btnMenu);

auth(closeModal, singUp, logIn);

indexBtn.addEventListener('click', () => {
  location.href = 'index.html';
});

enableValidation(validationConfig);

initOverlayClose(singUp);
initOverlayClose(logIn);
initOverlayClose(not);

closeSingUpBtn.addEventListener('click', () => closeModal(singUp));
closeLogInBtn.addEventListener('click', () => closeModal(logIn));

signUpBtn.forEach((btns) => {
  btns.addEventListener('click', () => {
    openModal(singUp);
    clearValidation(singUp, validationConfig);
    singUpForm.reset();
  });
});

logInBtn.forEach((btns) => {
  btns.addEventListener('click', () => {
    openModal(logIn);
    clearValidation(logIn, validationConfig);
    logInForm.reset();
  });
});

notBtn.forEach((btns) => {
  btns.addEventListener('click', () => {
    openModal(not);
      setTimeout(function() { closeModal(not) }, 500);
      return false;
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  const coinsList = document.querySelector('.coin-list');
  const template = document.getElementById('memcoin-template');

  try {
    const res = await fetch('https://clammy-four-puck.glitch.me/api/coins');
    const coins = await res.json();

    coinsList.innerHTML = '';

    coins.forEach((coin) => {
      const clone = template.content.cloneNode(true);

      clone.querySelector('.memcoin__image').src = coin.image || '';
      clone.querySelector('.memcoin__image').alt = coin.name;
      clone.querySelector('.memcoin__title').textContent = coin.name;
      clone.querySelector('.memcoin__ticker').textContent = coin.ticker;
      clone.querySelector('.memcoin__description').textContent = coin.description;

      coinsList.prepend(clone);
    });
  } catch (err) {
    console.error('Ошибка при загрузке мемкоинов:', err);
    coinsList.innerHTML = '<li>Не удалось загрузить монеты</li>';
  }
});
