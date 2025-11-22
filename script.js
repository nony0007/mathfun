let score = 0;
let questionCount = 0;
const totalQuestions = 10;
let correctAnswer;

const questionElement = document.getElementById('question');
const inputElement = document.getElementById('answer-input');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('score');
const progressBar = document.getElementById('progress-bar');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  const operations = ['+', '-', '×', '÷'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  let a, b;

  if (op === '+') {
    a = getRandomInt(0, 50);
    b = getRandomInt(0, 50);
    correctAnswer = a + b;
  } else if (op === '-') {
    a = getRandomInt(0, 50);
    b = getRandomInt(0, a);
    correctAnswer = a - b;
  } else if (op === '×') {
    a = getRandomInt(0, 12);
    b = getRandomInt(0, 12);
    correctAnswer = a * b;
  } else if (op === '÷') {
    b = getRandomInt(1, 12);
    correctAnswer = getRandomInt(0, 12);
    a = correctAnswer * b;
  }

  questionElement.textContent = `${a} ${op} ${b} = ?`;
}

function checkAnswer() {
  const userValue = parseFloat(inputElement.value);
  if (isNaN(userValue)) {
    feedbackElement.textContent = 'Please enter a number.';
    return;
  }
  if (Math.abs(userValue - correctAnswer) < 0.0001) {
    feedbackElement.textContent = 'Correct! 🎉';
    score++;
  } else {
    feedbackElement.textContent = `Oops! The correct answer was ${correctAnswer}.`;
  }
  scoreElement.textContent = `Score: ${score}`;
  questionCount++;
  progressBar.style.width = `${(questionCount / totalQuestions) * 100}%`;
  submitBtn.disabled = true;
  inputElement.disabled = true;
  nextBtn.disabled = false;
  if (questionCount === totalQuestions) {
    feedbackElement.textContent += ' Game over!';
    nextBtn.disabled = true;
    inputElement.disabled = true;
    submitBtn.disabled = true;
  }
}

function nextQuestion() {
  if (questionCount < totalQuestions) {
    generateQuestion();
    inputElement.value = '';
    inputElement.disabled = false;
    feedbackElement.textContent = '';
    submitBtn.disabled = false;
    nextBtn.disabled = true;
  }
}

submitBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', nextQuestion);

// Initialize first question
generateQuestion();
submitBtn.disabled = false;
nextBtn.disabled = true;
