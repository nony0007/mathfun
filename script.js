let score = 0;
let questionCount = 0;
let totalQuestions = 10;
let difficulty = 'easy';
let playerName = '';
let correctAnswer;

const operationsList = {
  easy: ['+','-'],
  medium: ['+','-','*'],
  hard: ['+','-','*','/']
};

const maxValues = {
  easy: 10,
  medium: 50,
  hard: 100
};

function loadHighScores() {
  const scores = JSON.parse(localStorage.getItem('mathfun-highscores')) || [];
  const list = document.getElementById('high-scores');
  if (!list) return;
  list.innerHTML = '';
  scores.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name}: ${item.score} pts (${item.totalQuestions} Qs)`;
    list.appendChild(li);
  });
}

function saveHighScore() {
  const scores = JSON.parse(localStorage.getItem('mathfun-highscores')) || [];
  scores.push({ name: playerName || 'Player', score, totalQuestions });
  scores.sort((a, b) => b.score - a.score);
  if (scores.length > 10) scores.splice(10);
  localStorage.setItem('mathfun-highscores', JSON.stringify(scores));
}

function generateQuestion() {
  const ops = operationsList[difficulty];
  const op = ops[Math.floor(Math.random() * ops.length)];
  const max = maxValues[difficulty];
  let a = Math.floor(Math.random() * (max + 1));
  let b = Math.floor(Math.random() * (max + 1));
  if (op === '/') {
    b = Math.floor(Math.random() * max) + 1;
    a = b * Math.floor(Math.random() * Math.floor(max / b + 1));
  }
  let questionText = `${a} ${op} ${b} = ?`;
  switch (op) {
    case '+': correctAnswer = a + b; break;
    case '-': correctAnswer = a - b; break;
    case '*': correctAnswer = a * b; break;
    case '/': correctAnswer = a / b; break;
  }
  document.getElementById('question').textContent = questionText;
  document.getElementById('answer-input').value = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('submit-btn').disabled = false;
  document.getElementById('cheat-btn').disabled = false;
  document.getElementById('next-btn').disabled = true;
}

function checkAnswer() {
  const input = document.getElementById('answer-input');
  const userAnswer = parseFloat(input.value);
  if (isNaN(userAnswer)) {
    document.getElementById('feedback').textContent = 'Please enter a number.';
    return;
  }
  if (Math.abs(userAnswer - correctAnswer) < 0.0001) {
    document.getElementById('feedback').textContent = 'Correct! 🎉';
    score++;
  } else {
    document.getElementById('feedback').textContent = `Incorrect. The answer was ${correctAnswer}.`;
  }
  document.getElementById('score').textContent = score;
  questionCount++;
  updateProgress();
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('cheat-btn').disabled = true;
  document.getElementById('next-btn').disabled = false;
  if (questionCount >= totalQuestions) {
    document.getElementById('next-btn').textContent = 'Finish';
  } else {
    document.getElementById('next-btn').textContent = 'Next Question';
  }
}

function cheat() {
  document.getElementById('feedback').textContent = `Cheat answer: ${correctAnswer}`;
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('cheat-btn').disabled = true;
  document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
  if (questionCount >= totalQuestions) {
    endGame();
  } else {
    generateQuestion();
  }
}

function updateProgress() {
  const progress = document.querySelector('.progress');
  const percent = (questionCount / totalQuestions) * 100;
  if (progress) {
    progress.style.width = percent + '%';
  }
}

function startGame() {
  const nameInput = document.getElementById('player-name');
  playerName = nameInput ? nameInput.value.trim() : '';
  const diffSelect = document.getElementById('difficulty-select');
  difficulty = diffSelect ? diffSelect.value : 'easy';
  const numSelect = document.getElementById('num-questions');
  totalQuestions = numSelect ? parseInt(numSelect.value) : 10;
  const themeSelect = document.getElementById('theme-select');
  const theme = themeSelect ? themeSelect.value : 'classic';
  document.body.className = 'theme-' + theme;
  score = 0;
  questionCount = 0;
  document.getElementById('score').textContent = 0;
  document.getElementById('next-btn').textContent = 'Next Question';
  const startScreen = document.querySelector('.start-screen');
  const container = document.querySelector('.container');
  if (startScreen && container) {
    startScreen.style.display = 'none';
    container.style.display = 'block';
  }
  generateQuestion();
  updateProgress();
}

function endGame() {
  saveHighScore();
  loadHighScores();
  alert(`Game over, ${playerName || 'Player'}! Your score: ${score} / ${totalQuestions}`);
  const startScreen = document.querySelector('.start-screen');
  const container = document.querySelector('.container');
  if (startScreen && container) {
    startScreen.style.display = 'block';
    container.style.display = 'none';
  }
  document.getElementById('next-btn').disabled = true;
}

function loadChat() {
  const messages = JSON.parse(localStorage.getItem('mathfun-chat')) || [];
  const list = document.getElementById('chat-messages');
  if (!list) return;
  list.innerHTML = '';
  messages.forEach(msg => {
    const li = document.createElement('li');
    li.textContent = `${msg.name}: ${msg.text}`;
    list.appendChild(li);
  });
  list.scrollTop = list.scrollHeight;
}

function sendChat() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  const messages = JSON.parse(localStorage.getItem('mathfun-chat')) || [];
  messages.push({ name: playerName || 'Anon', text });
  localStorage.setItem('mathfun-chat', JSON.stringify(messages));
  input.value = '';
  loadChat();
}

document.addEventListener('DOMContentLoaded', () => {
  loadHighScores();
  loadChat();
  const startBtn = document.getElementById('start-btn');
  if (startBtn) startBtn.addEventListener('click', startGame);
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) submitBtn.addEventListener('click', checkAnswer);
  const cheatBtn = document.getElementById('cheat-btn');
  if (cheatBtn) cheatBtn.addEventListener('click', cheat);
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
  const sendBtn = document.getElementById('send-btn');
  if (sendBtn) sendBtn.addEventListener('click', sendChat);
  const chatInput = document.getElementById('chat-input');
  if (chatInput) chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChat();
  });
});
