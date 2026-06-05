// login.js — QuizMaster Pro
// Logic preserved; UI helpers added for new design system

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  hideAlert();

  if (!username || !password) {
    showAlert('Please enter your username and password.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('qm_users') || '{}');

  if (!users[username]) {
    showAlert('No account found with that username.');
    return;
  }

  if (users[username].password !== password) {
    showAlert('Incorrect password. Please try again.');
    return;
  }

  // Set session (both storages so navbar.js always finds it)
  sessionStorage.setItem('qm_user', username);
  localStorage.setItem('qm_user', username);

  // Success
  showAlert('Welcome back! Redirecting…', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') login();
  });
});