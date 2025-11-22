let score = 0;
let questionCount = 0;
const totalQuestions = 10;
let correctAnswer;
let difficulty = 'easy';

const maxValues = {
    easy: 10,
    medium: 50,
    hard: 100
};

const operationsList = {
    easy: ['+', '-'],
    medium: ['+', '-', '*'],
    hard: ['+', '-', '*', '/']
};

const startScreen = document.querySelector('.start-screen');
const container = document.querySelector('.container');
const difficultySelect = document.getElementById('difficulty-select');
const startBtn = document.getElementById('start-btn');
const highScoresDiv = document.getElementById('high-scores');

const questionElement = document.getElementById('question');
const inputElement = document.getElementById('answer-input');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('score');
const progressBar = document.querySelector('.progress');
const submitBtn = document.getElementById('submit-btn');
const cheatBtn = document.getElementById('cheat-btn');
const nextBtn = document.getElementById('next-btn');

function loadHighScores() {
    const scores = JSON.parse(localStorage.getItem('mathfun-highscores')) || [];
    scores.sort((a, b) => b - a);
    const topScores = scores.slice(0, 5);
    let html = '<h2>High Scores</h2><ul>';
    if (topScores.length === 0) {
        html += '<li>No scores yet! Be the first 🎉</li>';
    } else {
        topScores.forEach((s, idx) => {
            html += `<li>${idx + 1}. ${s}/${totalQuestions}</li>`;
        });
    }
    html += '</ul>';
    highScoresDiv.innerHTML = html;
}

function saveScore(newScore) {
    const scores = JSON.parse(localStorage.getItem('mathfun-highscores')) || [];
    scores.push(newScore);
    localStorage.setItem('mathfun-highscores', JSON.stringify(scores));
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
    const ops = operationsList[difficulty];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const maxVal = maxValues[difficulty];
    let a, b;
    if (op === '+') {
        a = getRandomInt(0, maxVal);
        b = getRandomInt(0, maxVal);
        correctAnswer = a + b;
    } else if (op === '-') {
        a = getRandomInt(0, maxVal);
        b = getRandomInt(0, maxVal);
        correctAnswer = a - b;
    } else if (op === '*') {
        a = getRandomInt(0, Math.floor(maxVal / 2));
        b = getRandomInt(0, Math.floor(maxVal / 2));
        correctAnswer = a * b;
    } else if (op === '/') {
        b = getRandomInt(1, Math.floor(maxVal / 2)) || 1;
        correctAnswer = getRandomInt(1, Math.floor(maxVal / 2));
        a = correctAnswer * b;
    }
    questionElement.textContent = `${a} ${op === '*' ? '×' : op === '/' ? '÷' : op} ${b} = ?`;
    inputElement.value = '';
    feedbackElement.textContent = '';
    submitBtn.disabled = false;
    cheatBtn.disabled = false;
    nextBtn.style.display = 'none';
}

function checkAnswer() {
    const userAnswer = parseFloat(inputElement.value);
    if (isNaN(userAnswer)) {
        feedbackElement.textContent = 'Please enter a number!';
        return;
    }
    if (userAnswer === correctAnswer) {
        score++;
        feedbackElement.textContent = 'Correct! 🎉';
    } else {
        feedbackElement.textContent = `Oops! The correct answer was ${correctAnswer}.`;
    }
    scoreElement.textContent = `Score: ${score}`;
    questionCount++;
    progressBar.style.width = `${(questionCount / totalQuestions) * 100}%`;
    submitBtn.disabled = true;
    cheatBtn.disabled = true;
    if (questionCount >= totalQuestions) {
        endGame();
    } else {
        nextBtn.style.display = 'inline-block';
    }
}

function cheat() {
    feedbackElement.textContent = `Cheat 🤫: The answer is ${correctAnswer}.`;
    submitBtn.disabled = true;
    cheatBtn.disabled = true;
    questionCount++;
    progressBar.style.width = `${(questionCount / totalQuestions) * 100}%`;
    if (questionCount >= totalQuestions) {
        endGame();
    } else {
        nextBtn.style.display = 'inline-block';
    }
}

function nextQuestion() {
    generateQuestion();
}

function endGame() {
    feedbackElement.textContent += ` Game over! Your final score: ${score}/${totalQuestions}.`;
    submitBtn.disabled = true;
    cheatBtn.disabled = true;
    nextBtn.style.display = 'none';
    saveScore(score);
    loadHighScores();
    setTimeout(() => {
        container.style.display = 'none';
        startScreen.style.display = 'block';
    }, 2000);
}

function startGame() {
    difficulty = difficultySelect.value;
    score = 0;
    questionCount = 0;
    scoreElement.textContent = `Score: ${score}`;
    progressBar.style.width = '0%';
    container.style.display = 'block';
    startScreen.style.display = 'none';
    generateQuestion();
}

startBtn.addEventListener('click', startGame);
submitBtn.addEventListener('click', checkAnswer);
cheatBtn.addEventListener('click', cheat);
nextBtn.addEventListener('click', nextQuestion);

loadHighScores();
