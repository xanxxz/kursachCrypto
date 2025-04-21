export function auth(closeModal, singUp, logIn) {
  document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.forms['sign-up'];
    const loginForm = document.forms['log-in'];
    const navBar = document.querySelector('.header__menu-list-item__sign-buttons');
  
    const updateUI = () => {
      const email = localStorage.getItem('email');
      if (email) {
        navBar.innerHTML = `
          <span class="user-email">${email}</span>
          <button class="button logout-button" type="button">
            <span>Logout</span>
          </button>
        `;
  
        document.querySelector('.logout-button').addEventListener('click', () => {
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          location.reload();
        });
      }
    };
  
    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = signupForm.email.value;
        const password = signupForm.password.value;
  
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
        if (response.ok) {
          alert('Регистрация успешна');
          localStorage.setItem('token', 'mock');
          localStorage.setItem('email', email);
          closeModal(singUp);
          signupForm.reset();
          updateUI();
        } else {
          alert(data.error || data.message);
        }
      });
    }
  
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
  
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', 'mock');
          localStorage.setItem('email', email);
          alert('Успешный вход');
          closeModal(logIn);
          loginForm.reset();
          updateUI();
        } else {
          alert(data.error || data.message);
        }
      });
    }
  
    updateUI();
  });
  
}
