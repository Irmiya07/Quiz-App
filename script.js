let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timer;
let questions = [];

function loadQuestions() {
  const category = document.getElementById("category").value;
  const url = `https://opentdb.com/api.php?amount=5&category=${category}&type=multiple`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      questions = data.results.map(q => {
        const answers = [...q.incorrect_answers];
        const correctIndex = Math.floor(Math.random() * 4);
        answers.splice(correctIndex, 0, q.correct_answer);
        return {
          question: decodeHTML(q.question),
          answers: answers.map(decodeHTML),
          correct: correctIndex
        };
      });

      startQuiz();
    });
}

function startQuiz() {
  document.getElementById("start-screen").classList.add("hide");
  document.getElementById("quiz-screen").classList.remove("hide");
  currentQuestion = 0;
  score = 0;
  showQuestion();
  startTimer();
}

function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question-box").innerText = q.question;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.answers.forEach((answer, i) => {
    const btn = document.createElement("button");
    btn.innerText = answer;
    btn.onclick = () => checkAnswer(i);
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(selectedIndex) {
  if (selectedIndex === questions[currentQuestion].correct) {
    score++;
  }
  nextQuestion();
}

function nextQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
    startTimer();
  } else {
    showResult();
  }
}

function startTimer() {
  document.getElementById("time").innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").innerText = timeLeft;
    if (timeLeft <= 0) {
      nextQuestion();
    }
  }, 1000);
}

function showResult() {
  document.getElementById("quiz-screen").classList.add("hide");
  document.getElementById("result-screen").classList.remove("hide");
  document.getElementById("score-text").innerText = `You scored ${score}/${questions.length}`;

  // Save score to LocalStorage
  const prevScores = JSON.parse(localStorage.getItem("quizScores")) || [];
  prevScores.push(score);
  localStorage.setItem("quizScores", JSON.stringify(prevScores));
}

// Decode HTML entities from API (like &quot;)
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
