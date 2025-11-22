let score = 0;
let questionCount = 0;
let totalQuestions = 10;
let correctAnswer;
let difficulty = 'easy';
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
  list.innerHTML = '';
  scores.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.score} pts (${item.difficulty}, ${item.totalQuestions} Qs)`;
    list.appendChild(li);
  });
}

function saveHighScore() {
  const scores = JSON.parse(localStorage.getItem('mathfun-highscores')) || [];
  scores.push({score, difficulty, totalQuestions});
  scores.sort((a,b) => b.score - a.score);
  localStorage.setItem('mathfun-highscores', JSON.stringify(scores.slice(0,5)));
}

function generateQuestion() {
  const max = maxValues[difficulty];
  const ops = operationsList[difficulty];
  const op = ops[Math.floor(Math.random()*ops.length)];
  let a = Math.floor(Math.random()*max) + 1;
  let b = Math.floor(Math.random()*max) + 1;
  if (op === '/') {
    correctAnswer = a;
    b = Math.floor(Math.random()*max) + 1;
    a = correctAnswer * b;
  } else if (op === '-') {
    if (b > a) [a,b] = [b,a];
  }
  switch(op) {
    case '+': correctAnswer = a + b; break;
    case '-': correctAnswer = a - b; break;
    case '*': correctAnswer = a * b; break;
    case '/': correctAnswer = a / b; break;
  }
  document.getElementById('question').textContent = `${a} ${op} ${b} = ?`;
  document.getElementById('answer-input').value = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('submit-btn').disabled = false;
  document.getElementById('cheat-btn').disabled = false;
  document.getElementById('next-btn').style.display = 'none';
}

function updateProgress() {
  const progress = document.querySelector('.progress');
  const percent = (questionCount / totalQuestions) * 100;
  progress.style.width = `${percent}%`;
}

function checkAnswer() {
  const answer = Number(document.getElementById('answer-input').value);
  if (answer === correctAnswer) {
    document.getElementById('feedback').textContent = 'Correct! 🎉';
    score++;
  } else {
    document.getElementById('feedback').textContent = `Oops! The correct answer was ${correctAnswer}`;
  }
  questionCount++;
  document.getElementById('score').textContent = `Score: ${score}`;
  updateProgress();
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('cheat-btn').disabled = true;
  if (questionCount < totalQuestions) {
    document.getElementById('next-btn').style.display = 'block';
  } else {
    endGame();
  }
}

function cheat() {
  document.getElementById('feedback').textContent = `Cheat! The answer is ${correctAnswer}. No points awarded.`;
  questionCount++;
  updateProgress();
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('cheat-btn').disabled = true;
  if (questionCount < totalQuestions) {
    document.getElementById('next-btn').style.display = 'block';
  } else {
    endGame();
  }
}

function nextQuestion() {
  generateQuestion();
}

function startGame() {
  difficulty = document.getElementById('difficulty-select').value;
  totalQuestions = Number(document.getElementById('num-questions').value);
  const theme = document.getElementById('theme-select').value;
  document.body.className = `theme-${theme}`;
  score = 0;
  questionCount = 0;
  document.querySelector('.start-screen').style.display = 'none';
  document.querySelector('.container').style.display = 'block';
  document.getElementById('score').textContent = `Score: ${score}`;
  document.querySelector('.progress').style.width = '0%';
  generateQuestion();
}

function endGame() {
  saveHighScore();
  loadHighScores();
  alert(`Game over! Your score: ${score}/${totalQuestions}`);
  document.querySelector('.container').style.display = 'none';
  document.querySelector('.start-screen').style.display = 'block';
}

function loadChat() {
  const messages = JSON.parse(localStorage.getItem('mathfun-chat')) || [];
  const list = document.getElementById('chat-messages');
  list.innerHTML = '';
  messages.forEach(msg => {
    const li = document.createElement('li');
    li.textContent = msg;
    list.appendChild(li);
  });
  const chatBox = document.getElementById('chat-box');
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (text) {
    const messages = JSON.parse(localStorage.getItem('mathfun-chat')) || [];
    messages.push(text);
    localStorage.setItem('mathfun-chat', JSON.stringify(messages.slice(-50)));
    input.value = '';
    loadChat();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadHighScores();
  loadChat();
  document.getElementById('start-btn').addEventListener('click', startGame);
  document.getElementById('submit-btn').addEventListener('click', checkAnswer);
  document.getElementById('cheat-btn').addEventListener('click', cheat);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('chat-send-btn').addEventListener('click', sendChat);
  document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChat();
  });
});
