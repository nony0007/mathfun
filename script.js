let score = 0;
let questionCount = 0;
const totalQuestions = 10;
let correctAnswer;

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('score');
const progressBar = document.getElementById('progress-bar');
const nextButton = document.getElementById('next-btn');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  const operations = ['+', '-', '\u00d7', '\u00f7'];
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
  } else if (op === '\u00d7') {
    a = getRandomInt(0, 12);
    b = getRandomInt(0, 12);
    correctAnswer = a * b;
  } else if (op === '\u00f7') {
    b = getRandomInt(1, 12);
    correctAnswer = getRandomInt(0, 12);
    a = correctAnswer * b;
  }
  questionElement.textContent = `${a} ${op} ${b} = ?`;

  answersElement.innerHTML = '';
  let choices = new Set();
  choices.add(correctAnswer);
  while (choices.size < 4) {
    let wrong = correctAnswer + getRandomInt(-10, 10);
    if (wrong === correctAnswer || wrong < 0) continue;
    choices.add(wrong);
  }
  const shuffled = Array.from(choices).sort(() => Math.random() - 0.5);
  shuffled.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'answer';
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice);
    answersElement.appendChild(btn);
  });
}

function checkAnswer(answer) {
  if (answer === correctAnswer) {
    feedbackElement.textContent = 'Correct!';
    score++;
    scoreElement.textContent = score;
  } else {
    feedbackElement.textContent = `Oops! The correct answer was ${correctAnswer}.`;
  }
  questionCount++;
  progressBar.style.width = ((questionCount / totalQuestions) * 100) + '%';
  if (questionCount >= totalQuestions) {
    questionElement.textContent = 'Great job!';
    answersElement.innerHTML = '';
    nextButton.disabled = true;
    feedbackElement.textContent += ' Game over!';
  }
}

nextButton.addEventListener('click', () => {
  feedbackElement.textContent = '';
  if (questionCount < totalQuestions) {
    generateQuestion();
  }
});

generateQuestion();
