document.addEventListener("DOMContentLoaded", function() {
    checkUserSession();
});

let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = localStorage.getItem("currentUser");

function register() {
    let username = document.getElementById("username").value;
    if (username && !users[username]) {
        users[username] = { quizzes: {}, categories: [] };
        localStorage.setItem("users", JSON.stringify(users));
        alert("Inscription réussie !");
    } else {
        alert("Nom d'utilisateur déjà pris ou invalide.");
    }
}

function login() {
    let username = document.getElementById("username").value;
    if (users[username]) {
        currentUser = username;
        localStorage.setItem("currentUser", username);
        checkUserSession();
    } else {
        alert("Utilisateur non trouvé.");
    }
}

function checkUserSession() {
    if (currentUser) {
        document.getElementById("auth-section").style.display = "none";
        document.getElementById("quiz-section").style.display = "block";
        document.getElementById("user-display").textContent = currentUser;
        loadCategories();
    }
}

function createCategory() {
    let categoryName = document.getElementById("category-name").value;
    if (categoryName && !users[currentUser].categories.includes(categoryName)) {
        users[currentUser].categories.push(categoryName);
        users[currentUser].quizzes[categoryName] = [];
        localStorage.setItem("users", JSON.stringify(users));
        alert("Catégorie créée !");
        loadCategories();
    } else {
        alert("Catégorie invalide ou existante.");
    }
}

function loadCategories() {
    let categorySelect = document.getElementById("category-select");
    let categoryPlaySelect = document.getElementById("category-play-select");
    categorySelect.innerHTML = "";
    categoryPlaySelect.innerHTML = "";

    users[currentUser].categories.forEach(category => {
        let option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);

        let optionPlay = document.createElement("option");
        optionPlay.value = category;
        optionPlay.textContent = category;
        categoryPlaySelect.appendChild(optionPlay);
    });
}

function addQuestion() {
    let category = document.getElementById("category-select").value;
    let question = document.getElementById("question").value;
    let answer = document.getElementById("answer").value;

    if (question && answer && category) {
        users[currentUser].quizzes[category].push({ question, answer });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Question ajoutée !");
    } else {
        alert("Veuillez remplir tous les champs.");
    }
}

function startQuiz() {
    let category = document.getElementById("category-play-select").value;
    let questions = users[currentUser].quizzes[category];

    if (questions.length === 0) {
        alert("Aucune question dans cette catégorie.");
        return;
    }

    let score = 0;
    for (let i = 0; i < questions.length; i++) {
        let userAnswer = prompt(questions[i].question);
        if (userAnswer && userAnswer.toLowerCase() === questions[i].answer.toLowerCase()) {
            score++;
        }
    }

    alert(`Quiz terminé ! Score : ${score}/${questions.length}`);
}

function resetAllQuizzes() {
    users[currentUser].quizzes = {};
    users[currentUser].categories = [];
    localStorage.setItem("users", JSON.stringify(users));
    alert("Tous les quiz ont été réinitialisés !");
    loadCategories();
}

function showQuizCreation() {
    document.getElementById("quiz-section").style.display = "none";
    document.getElementById("quiz-creation-section").style.display = "block";
}

function showPlayQuiz() {
    document.getElementById("quiz-section").style.display = "none";
    document.getElementById("play-quiz-section").style.display = "block";
}

function backToMenu() {
    document.getElementById("quiz-creation-section").style.display = "none";
    document.getElementById("play-quiz-section").style.display = "none";
    document.getElementById("quiz-section").style.display = "block";
}
