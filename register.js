document.getElementById("registerBtn").addEventListener("click", () => {
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if(!username || !password){
    document.getElementById("error").textContent = "All fields are required!";
    return;
  }

  if(localStorage.getItem(username)){
    document.getElementById("error").textContent = "Username already exists!";
    return;
  }

  const user = { password, score: 0 };
  localStorage.setItem(username, JSON.stringify(user));
  localStorage.setItem("loggedInUser", username);

  window.location.href = "index.html"; // Redirect to quiz
});
