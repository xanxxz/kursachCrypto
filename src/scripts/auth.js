export function auth(closeModal, singUp, logIn) {
  document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.forms['sign-up'];
    const loginForm = document.forms['log-in'];
    const navBar = document.querySelector('.header__menu-list-item__sign-buttons');
  
const updateUI = () => {
  const email = localStorage.getItem('email');
  if (email && navBar) {
    navBar.replaceChildren();

    const userSpan = document.createElement('span');
    userSpan.className = 'user-email';
    userSpan.textContent = ` ${email}`;

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'button logout-button';
    logoutBtn.type = 'button';

    const logoutSpan = document.createElement('span');
    logoutSpan.textContent = 'Logout';

    logoutBtn.appendChild(logoutSpan);

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      location.reload();
    });

    navBar.appendChild(userSpan);
    navBar.appendChild(logoutBtn);
  }
};
  
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = signupForm.email.value;
      const password = signupForm.password.value;

      const response = await fetch('https://clammy-four-puck.glitch.me/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
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
  
      const response = await fetch('https://clammy-four-puck.glitch.me/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', 'mock');
        localStorage.setItem('email', email);
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
