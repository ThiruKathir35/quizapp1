// register.js — QuizMaster Pro
// Logic preserved; UI helpers added for new design system

function register() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const confirm  = document.getElementById('confirm-password').value;

  hideAlert();

  // Validation
  if (!username) {
    showAlert('Please enter a username.');
    return;
  }
  if (username.length < 3) {
    showAlert('Username must be at least 3 characters.');
    return;
  }
  if (!password) {
    showAlert('Please enter a password.');
    return;
  }
  if (password.length < 6) {
    showAlert('Password must be at least 6 characters.');
    return;
  }
  if (password !== confirm) {
    showAlert('Passwords do not match.');
    return;
  }

  // Check if username already exists
  const existing = JSON.parse(localStorage.getItem('qm_users') || '{}');
  if (existing[username]) {
    showAlert('That username is already taken. Try another.');
    return;
  }

  // Save user
  existing[username] = { password };
  localStorage.setItem('qm_users', JSON.stringify(existing));

  // Set session (both storages so navbar.js always finds it)
  sessionStorage.setItem('qm_user', username);
  localStorage.setItem('qm_user', username);

  // Success feedback then redirect
  showAlert('Account created! Redirecting…', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1200);
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') register();
  });
});