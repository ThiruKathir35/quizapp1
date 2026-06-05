
const QUIZ_QUESTIONS = [
  {
    question: 'Which data structure uses LIFO (Last In, First Out) principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Tree'],
    correct: 1
  },
  {
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n log n)'],
    correct: 2
  },
  {
    question: 'Which sorting algorithm has the best average-case performance?',
    options: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Selection Sort'],
    correct: 2
  },
  {
    question: 'Which of the following is NOT a primary memory?',
    options: ['RAM', 'ROM', 'Cache', 'Hard Disk'],
    correct: 3
  },
  {
    question: 'What does SQL stand for?',
    options: [
      'Structured Query Language',
      'Simple Question Language',
      'Standard Query Logic',
      'Sequential Query List'
    ],
    correct: 0
  },
  {
    question: 'In OSI model, which layer is responsible for routing?',
    options: ['Data Link', 'Network', 'Transport', 'Session'],
    correct: 1
  },
  {
    question: 'Which of the following is an example of a non-linear data structure?',
    options: ['Array', 'Queue', 'Stack', 'Graph'],
    correct: 3
  },
  {
    question: 'What is the worst-case time complexity of Quick Sort?',
    options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'],
    correct: 2
  },
  {
    question: 'Which protocol is used to send email?',
    options: ['FTP', 'HTTP', 'SMTP', 'POP3'],
    correct: 2
  },
  {
    question: 'What does CPU stand for?',
    options: [
      'Central Processing Unit',
      'Core Programming Unit',
      'Central Program Utility',
      'Computer Processing Unit'
    ],
    correct: 0
  }
];

// ── State ─────────────────────────────────────────────────────────
let _questions   = [];
let _currentIdx  = 0;
let _score       = 0;
let _correct     = 0;
let _wrong       = 0;
let _skipped     = 0;
let _renderFn    = null;

// ── Public API ────────────────────────────────────────────────────

/**
 * Called by quiz.html on DOMContentLoaded.
 * @param {Function} renderFn - the UI render function from quiz.html
 */
function quizInit(renderFn) {
  _renderFn   = renderFn;
  _questions  = shuffle([...QUIZ_QUESTIONS]); // ← YOUR LOGIC HERE (load your questions)
  _currentIdx = 0;
  _score      = 0;
  _correct    = 0;
  _wrong      = 0;
  _skipped    = 0;

  renderFn(_questions[0], 0, _questions.length);
}

/**
 * Called by quiz.html "Next" button.
 * @param {number|null} selectedIdx - the option index the user selected (null = skipped)
 */
function quizNextQuestion(selectedIdx) {
  const q = _questions[_currentIdx];

  if (selectedIdx === null) {
    _skipped++;
  } else if (selectedIdx === q.correct) {
    _correct++;
    _score++;
  } else {
    _wrong++;
  }

  _currentIdx++;

  if (_currentIdx >= _questions.length) {
    quizFinish();
  } else {
    _renderFn(_questions[_currentIdx], _currentIdx, _questions.length);
  }
}

function quizFinish() {
  // Persist results for final.html to read
  sessionStorage.setItem('qm_score',   _score);
  sessionStorage.setItem('qm_total',   _questions.length);
  sessionStorage.setItem('qm_correct', _correct);
  sessionStorage.setItem('qm_wrong',   _wrong);
  sessionStorage.setItem('qm_skipped', _skipped);

  window.location.href =
    `final.html?score=${_score}&total=${_questions.length}` +
    `&correct=${_correct}&wrong=${_wrong}&skipped=${_skipped}`;
}


function quizRestart() {
  sessionStorage.removeItem('qm_score');
  sessionStorage.removeItem('qm_total');
  sessionStorage.removeItem('qm_correct');
  sessionStorage.removeItem('qm_wrong');
  sessionStorage.removeItem('qm_skipped');
  window.location.href = 'quiz.html';
}

// ── Helpers ───────────────────────────────────────────────────────

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}