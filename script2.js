document.addEventListener("DOMContentLoaded", () => {
    checkLogin();
});

let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = null;

function login() {
    let username = document.getElementById("username").value.trim();
    if (username === "") return alert("Entrez un nom d'utilisateur !");
    
    if (!users[username]) {
        users[username] = { categories: {} };
    }
    
    currentUser = username;
    localStorage.setItem("users", JSON.stringify(users));
    showQuizMenu();
}

function showQuizMenu() {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("welcome-message").innerText = `Bienvenue, ${currentUser}`;
}

function logout() {
    currentUser = null;
    document.getElementById("login-container").style.display = "block";
    document.getElementById("quiz-container").style.display = "none";
}

function openPopup(content) {
    document.getElementById("popup-content").innerHTML = content;
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function openCategoryWindow() {
    openPopup(`
        <h3>Nouvelle Catégorie</h3>
        <input type="text" id="category-name" placeholder="Nom de la catégorie">
        <button onclick="addCategory()">Ajouter</button>
    `);
}

function addCategory() {
    let category = document.getElementById("category-name").value.trim();
    if (category === "") return alert("Entrez un nom !");
    
    if (!users[currentUser].categories[category]) {
        users[currentUser].categories[category] = [];
    } else {
        return alert("Catégorie déjà existante !");
    }
    
    localStorage.setItem("users", JSON.stringify(users));
    closePopup();
}

function openQuizWindow() {
    let categoryOptions = Object.keys(users[currentUser].categories)
        .map(cat => `<option value="${cat}">${cat}</option>`)
        .join("");

    if (!categoryOptions) return alert("Aucune catégorie disponible !");

    openPopup(`
        <h3>Nouvelle Question</h3>
        <select id="category-select">${categoryOptions}</select>
        <input type="text" id="question" placeholder="Question">
        <input type="text" id="answer" placeholder="Réponse">
        <button onclick="addQuestion()">Ajouter</button>
    `);
}

function addQuestion() {
    let category = document.getElementById("category-select").value;
    let question = document.getElementById("question").value.trim();
    let answer = document.getElementById("answer").value.trim();

    if (question === "" || answer === "") return alert("Remplissez tous les champs !");

    users[currentUser].categories[category].push({ question, answer });
    localStorage.setItem("users", JSON.stringify(users));
    closePopup();
}

function openPlayWindow() {
    let categoryOptions = Object.keys(users[currentUser].categories)
        .map(cat => `<option value="${cat}">${cat}</option>`)
        .join("");

    if (!categoryOptions) return alert("Aucune catégorie disponible !");

    openPopup(`
        <h3>Jouer</h3>
        <select id="category-select-play">${categoryOptions}</select>
        <button onclick="startQuiz()">Commencer</button>
    `);
}

function startQuiz() {
    let category = document.getElementById("category-select-play").value;
    let questions = users[currentUser].categories[category];

    if (questions.length === 0) return alert("Aucune question dans cette catégorie !");

    let index = 0;
    let errors = 0;

    function askQuestion() {
        if (index >= questions.length) {
            alert("Quiz terminé !");
            closePopup();
            return;
        }

        let userAnswer = prompt(questions[index].question);
        if (userAnswer === null) return;

        if (userAnswer.toLowerCase() === questions[index].answer.toLowerCase()) {
            index++;
            askQuestion();
        } else {
            errors++;
            if (errors >= 3) {
                let correctAnswer = questions[index].answer;
                let validation = prompt(`Réponse : ${correctAnswer}. Tapez-la pour continuer :`);
                if (validation && validation.toLowerCase() === correctAnswer.toLowerCase()) {
                    index++;
                    askQuestion();
                }
            } else {
                alert("Mauvaise réponse, essayez encore !");
                askQuestion();
            }
        }
    }

    askQuestion();
}

function openResetWindow() {
    let categoryOptions = Object.keys(users[currentUser].categories)
        .map(cat => `<option value="${cat}">${cat}</option>`)
        .join("");

    openPopup(`
        <h3>Réinitialiser</h3>
        <button onclick="resetAll()">Tout réinitialiser</button>
        <select id="category-select-reset">${categoryOptions}</select>
        <button onclick="resetCategory()">Supprimer</button>
    `);
}

function resetAll() {
    users[currentUser].categories = {};
    localStorage.setItem("users", JSON.stringify(users));
    closePopup();
}

function resetCategory() {
    let category = document.getElementById("category-select-reset").value;
    delete users[currentUser].categories[category];
    localStorage.setItem("users", JSON.stringify(users));
    closePopup();
}
