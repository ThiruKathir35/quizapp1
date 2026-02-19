document.getElementById("loginBtn").addEventListener("click", () => {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const user = JSON.parse(localStorage.getItem(username));

  if(!user || user.password !== password){
    document.getElementById("error").textContent = "Invalid username or password!";
    return;
  }

  localStorage.setItem("loggedInUser", username);
  window.location.href = "index.html";
});
