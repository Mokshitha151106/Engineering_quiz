const questions = [
  { q: "Who is known as the father of Indian engineering?", a: "visvesvaraya" },
  { q: "Which branch of engineering deals with robots?", a: "robotics" },
  { q: "What does CPU stand for?", a: "central processing unit" },
  { q: "Which is the largest engineering body in India?", a: "institution of engineers" },
  { q: "Who invented alternating current?", a: "nikola tesla" },
  { q: "Which metal is most used in engineering constructions?", a: "steel" },
  { q: "On which date is Engineers Day celebrated in India?", a: "september 15" },
  { q: "Which programming language is called the mother of all languages?", a: "c" },
  { q: "Which engineering field designs airplanes?", a: "aerospace" },
  { q: "Which Indian missile scientist is known as the Missile Man?", a: "apj abdul kalam" }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const feedbackEl = document.getElementById("feedback");
const userAnswerEl = document.getElementById("user-answer");
const startBtn = document.getElementById("start-btn");

// ??? Speak with gentle female voice
function speak(text) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-IN";

  const voices = synth.getVoices();
  const femaleVoice = voices.find(v =>
    v.name.toLowerCase().includes("female") ||
    v.name.toLowerCase().includes("zira") ||
    v.name.toLowerCase().includes("samantha")
  );
  if (femaleVoice) utter.voice = femaleVoice;

  utter.pitch = 1.1;
  utter.rate = 0.95;
  synth.speak(utter);
}

// Load question
function loadQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.q;
  feedbackEl.textContent = "";
  userAnswerEl.textContent = "...";

  speak("Next question. " + q.q);
}

// Check answer
function checkAnswer(answer) {
  const q = questions[currentQuestion];
  if (answer.includes(q.a.toLowerCase())) {
    feedbackEl.textContent = "? Correct!";
    speak("Correct answer!");
    score++;
  } else {
    feedbackEl.textContent = "? Wrong! Correct: " + q.a;
    speak("Wrong answer. The correct answer is " + q.a);
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
      startListening();
    } else {
      endQuiz();
    }
  }, 4000);
}

// Start listening
function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript.toLowerCase();
    userAnswerEl.textContent = speechResult;
    checkAnswer(speechResult);
  };

  recognition.onerror = (event) => {
    feedbackEl.textContent = "?? Error: " + event.error;
    speak("I could not hear you properly. Please try again.");
  };
}

startBtn.addEventListener("click", () => {
  loadQuestion();
  startListening();
});

// End quiz celebration
function endQuiz() {
  questionEl.innerHTML = `?????? <br> Congratulations! <br> You scored ${score} out of ${questions.length}. <br> ??????`;
  feedbackEl.textContent = "";
  userAnswerEl.textContent = "";
  startBtn.style.display = "none";

  speak(`Congratulations! You have completed the Engineering Day Quiz with a score of ${score} out of ${questions.length}. Well done, future engineer!`);

  startConfetti();
  setTimeout(stopConfetti, 7000);
}

// ?? Confetti Animation
let confettiCtx, confettiParticles = [];

function startConfetti() {
  const canvas = document.getElementById("confetti");
  confettiCtx = canvas.getContext("2d");
  resizeCanvas(canvas);

  window.addEventListener("resize", () => resizeCanvas(canvas));

  for (let i = 0; i < 150; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 50 + 50,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 10
    });
  }
  requestAnimationFrame(updateConfetti);
}

function updateConfetti() {
  const canvas = document.getElementById("confetti");
  confettiCtx.clearRect(0, 0, canvas.width, canvas.height);

  confettiParticles.forEach(p => {
    confettiCtx.beginPath();
    confettiCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fill();

    p.y += Math.cos(p.d) + 1 + p.r / 2;
    p.x += Math.sin(p.d);

    if (p.y > canvas.height) {
      p.y = -10;
      p.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(updateConfetti);
}

function stopConfetti() {
  confettiParticles = [];
}

function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Intro message
window.onload = () => {
  speak("Hello, welcome to the Engineering Day Quiz. I will ask you questions, and you can answer by speaking. Let's begin.");
};
