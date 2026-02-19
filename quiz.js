document.addEventListener("DOMContentLoaded", async () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) window.location.href = "login.html";

  let user = JSON.parse(localStorage.getItem(loggedInUser));
  let score = user.score || 0;

  const quizContainer = document.getElementById("quizContainer");
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const nextBtn = document.getElementById("nextBtn");
  const scoreEl = document.getElementById("score");
  const userInfo = document.getElementById("userInfo");
  const timerProgress = document.getElementById("timerProgress");

  let current = 0;
  let timer;
  const timePerQuestion = 15; // seconds
  let timeLeft = timePerQuestion;
  let answered = false;

  // Show username at top-right
  userInfo.textContent = `Hello, ${loggedInUser}`;

  // Show initial score
  scoreEl.textContent = `Score: ${score} | Time: ${timeLeft}s`;

  // Fetch 10 Computer Science questions from Open Trivia DB
  const res = await fetch("https://opentdb.com/api.php?amount=10&category=18&type=multiple");
  const data = await res.json();
  const questions = data.results;

  // Start the timer
  function startTimer() {
    timeLeft = timePerQuestion;
    timerProgress.style.width = "100%";
    timer = setInterval(() => {
      timeLeft--;
      timerProgress.style.width = `${(timeLeft / timePerQuestion) * 100}%`;
      scoreEl.textContent = `Score: ${score} | Time: ${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(timer);
        showCorrectAnswer();
      }
    }, 1000);
  }

  // Show question and options
  function showQuestion() {
    answered = false;
    clearInterval(timer);
    startTimer();

    const q = questions[current];
    questionEl.innerHTML = q.question;

    const answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

    optionsEl.innerHTML = "";
    answers.forEach(ans => {
      const btn = document.createElement("button");
      btn.innerHTML = ans;
      btn.addEventListener("click", () => {
        if (answered) return; // prevent multiple clicks
        answered = true;
        clearInterval(timer);

        const allBtns = optionsEl.querySelectorAll("button");
        allBtns.forEach(b => b.disabled = true);

        if (ans === q.correct_answer) {
          btn.classList.add("correct");
          score++;
        } else {
          btn.classList.add("wrong");
          // highlight the correct answer
          allBtns.forEach(b => {
            if (b.innerHTML === q.correct_answer) b.classList.add("correct");
          });
        }
      });
      optionsEl.appendChild(btn);
    });
  }

  // Show correct answer automatically when time runs out
  function showCorrectAnswer() {
    answered = true;
    const allBtns = optionsEl.querySelectorAll("button");
    allBtns.forEach(b => b.disabled = true);
    allBtns.forEach(b => {
      if (b.innerHTML === questions[current].correct_answer) {
        b.classList.add("correct");
      }
    });
  }

  // Move to next question
  function nextQuestion() {
    current++;
    if (current < questions.length) {
      showQuestion();
    } else {
      user.score = score;
      localStorage.setItem(loggedInUser, JSON.stringify(user));
      window.location.href = "final.html"; // go to final page
    }
  }

  // Next button click
  nextBtn.addEventListener("click", () => {
    clearInterval(timer);
    nextQuestion();
  });

  // Show first question
  showQuestion();
});
