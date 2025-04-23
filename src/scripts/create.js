import '../pages/create.css';
import {openModal, closeModal, initOverlayClose} from './popup.js';
import {enableValidation, clearValidation} from './validation.js';
import {auth} from './auth.js';

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

indexBtn.addEventListener('click', () => {
  location.href = 'index.html';
});

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'button_inactive',
  inputErrorClass: 'form__input_type_error',
  errorClass: 'form__input-error_active'
};

auth(closeModal, singUp, logIn);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.forms['create'];

  const nameInput = form['name-coin'];
  const tickerInput = form['ticker-coin'];
  const imageInput = form['image-coin'];
  const descriptionInput = form['description-coin'];
  const listContainer = document.querySelector('.place-section__list');
  const template = document.querySelector('#memcoin-template');

  const email = localStorage.getItem('email');

  if (!email) {
    openModal(logIn);
    clearValidation(logIn, validationConfig);
    singUpForm.reset();
    return;
  }

  function renderCoin(coin) {
    const clone = template.content.cloneNode(true);
    clone.querySelector('.memcoin__image').src = coin.image || '';
    clone.querySelector('.memcoin__image').alt = coin.name;
    clone.querySelector('.memcoin__title').textContent = coin.name;
    clone.querySelector('.memcoin__ticker').textContent = coin.ticker;
    clone.querySelector('.memcoin__description').textContent = coin.description;
  
    const deleteBtn = clone.querySelector('.memcoin__delete');
    deleteBtn.addEventListener('click', async () => {
      if (!confirm(`Удалить ${coin.name}?`)) return;
  
      try {
        const res = await fetch(`http://localhost:3000/api/coins/${coin._id}`, {
          method: 'DELETE',
        });
  
        if (res.ok) {
          deleteBtn.closest('.memcoin__item').remove();
        } else {
          alert('Ошибка при удалении');
        }
      } catch (err) {
        alert('Ошибка сервера при удалении');
        console.error(err);
      }
    });
  
    listContainer.prepend(clone);
  }
  

  async function loadCoins() {
    listContainer.innerHTML = '';
    try {
      const res = await fetch(`http://localhost:3000/api/coins?ownerEmail=${encodeURIComponent(email)}`);
      const coins = await res.json();
      coins.forEach(renderCoin);
    } catch (err) {
      console.error('Ошибка при загрузке монет:', err);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const coin = {
      name: nameInput.value,
      ticker: tickerInput.value,
      image: imageInput.value,
      description: descriptionInput.value,
      ownerEmail: email
    };

    try {
      const res = await fetch('http://localhost:3000/api/coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coin),
      });

      const data = await res.json();
      if (res.ok) {
        renderCoin(data.coin);
        form.reset();
      } else {
        alert(data.message || 'Ошибка создания');
      }
    } catch (err) {
      alert('Ошибка сервера');
      console.error(err);
    }
  });

  loadCoins();
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
