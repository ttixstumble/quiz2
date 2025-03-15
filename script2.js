document.addEventListener("DOMContentLoaded", function() {
    loadCategories();
});

let quizData = JSON.parse(localStorage.getItem("quizData")) || {};

function showMenu() {
    document.querySelectorAll(".hidden").forEach(el => el.style.display = "none");
    document.getElementById("menu").style.display = "block";
}

function showCreateQuiz() {
    document.querySelectorAll(".hidden").forEach(el => el.style.display = "none");
    document.getElementById("createQuiz").style.display = "block";
    updateCategoryDropdown("category");
}

function showPlayQuiz() {
    document.querySelectorAll(".hidden").forEach(el => el.style.display = "none");
    document.getElementById("playQuiz").style.display = "block";
    updateCategoryDropdown("categorySelect");
}

function showResetOptions() {
    document.querySelectorAll(".hidden").forEach(el => el.style.display = "none");
    document.getElementById("resetOptions").style.display = "block";
    updateCategoryDropdown("resetCategorySelect");
}

function addQuestion() {
    let question = document.getElementById("question").value.trim();
    let answer = document.getElementById("answer").value.trim();
    let category = document.getElementById("category").value.trim();

    if (question && answer && category) {
        if (!quizData[category]) quizData[category] = [];
        quizData[category].push({ question, answer });
        localStorage.setItem("quizData", JSON.stringify(quizData));
        alert("Question ajoutée !");
        document.getElementById("question").value = "";
        document.getElementById("answer").value = "";
    } else {
        alert("Veuillez remplir tous les champs");
    }
}

function updateCategoryDropdown(selectId) {
    let select = document.getElementById(selectId);
    select.innerHTML = "";
    Object.keys(quizData).forEach(cat => {
        let option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

function startQuiz() {
    let category = document.getElementById("categorySelect").value;
    if (!quizData[category] || quizData[category].length === 0) {
        alert("Aucune question dans cette catégorie");
        return;
    }
    sessionStorage.setItem("currentCategory", category);
    sessionStorage.setItem("currentQuestion", 0);
    sessionStorage.setItem("score", 0);
    showQuestion();
}

function showQuestion() {
    let category = sessionStorage.getItem("currentCategory");
    let index = parseInt(sessionStorage.getItem("currentQuestion"));
    let questions = quizData[category];

    if (index < questions.length) {
        document.querySelectorAll(".hidden").forEach(el => el.style.display = "none");
        document.getElementById("quiz").style.display = "block";
        document.getElementById("questionDisplay").textContent = questions[index].question;
    } else {
        alert(`Quiz terminé ! Score : ${sessionStorage.getItem("score")}/${questions.length}`);
        showMenu();
    }
}

function checkAnswer() {
    let category = sessionStorage.getItem("currentCategory");
    let index = parseInt(sessionStorage.getItem("currentQuestion"));
    let questions = quizData[category];
    let userAnswer = document.getElementById("userAnswer").value.trim().toLowerCase();
    let correctAnswer = questions[index].answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        let score = parseInt(sessionStorage.getItem("score")) + 1;
        sessionStorage.setItem("score", score);
        sessionStorage.setItem("currentQuestion", index + 1);
        showQuestion();
    } else {
        alert("Mauvaise réponse, réessayez !");
    }
}

function resetCategory() {
    let category = document.getElementById("resetCategorySelect").value;
    delete quizData[category];
    localStorage.setItem("quizData", JSON.stringify(quizData));
    alert("Catégorie réinitialisée");
    updateCategoryDropdown("resetCategorySelect");
}

function resetQuiz() {
    localStorage.removeItem("quizData");
    quizData = {};
    alert("Quiz entièrement réinitialisé");
    updateCategoryDropdown("resetCategorySelect");
}
