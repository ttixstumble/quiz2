let currentUser = null;
let usersData = JSON.parse(localStorage.getItem("usersData")) || {};

function registerUser() {
    let username = document.getElementById("username").value.trim();
    if (!username) return alert("Veuillez entrer un nom d'utilisateur.");
    if (usersData[username]) return alert("Ce nom d'utilisateur est déjà pris.");

    usersData[username] = { categories: {}, quizzes: {} };
    localStorage.setItem("usersData", JSON.stringify(usersData));
    loginUser();
}

function loginUser() {
    let username = document.getElementById("username").value.trim();
    if (!usersData[username]) return alert("Utilisateur non trouvé. Veuillez vous inscrire.");

    currentUser = username;
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
    loadCategories();
}

function logoutUser() {
    currentUser = null;
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("auth").classList.remove("hidden");
}

function showCreateCategory() {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("createCategory").classList.remove("hidden");
}

function addCategory() {
    let category = document.getElementById("newCategory").value.trim();
    if (!category) return alert("Veuillez entrer un nom de catégorie.");
    
    if (!usersData[currentUser].categories[category]) {
        usersData[currentUser].categories[category] = [];
        localStorage.setItem("usersData", JSON.stringify(usersData));
        loadCategories();
    }
    showMenu();
}

function showCreateQuiz() {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("createQuiz").classList.remove("hidden");
}

function addQuestion() {
    let question = document.getElementById("question").value.trim();
    let answer = document.getElementById("answer").value.trim();
    let category = document.getElementById("category").value;

    if (!question || !answer || !category) return alert("Veuillez remplir tous les champs.");
    
    usersData[currentUser].categories[category].push({ question, answer });
    localStorage.setItem("usersData", JSON.stringify(usersData));
    showMenu();
}

function loadCategories() {
    let categorySelects = document.querySelectorAll("#category, #categorySelect, #resetCategorySelect");
    categorySelects.forEach(select => select.innerHTML = "");
    
    for (let category in usersData[currentUser].categories) {
        let option = new Option(category, category);
        categorySelects.forEach(select => select.add(option.cloneNode(true)));
    }
}

function showPlayQuiz() {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("playQuiz").classList.remove("hidden");
}

function startQuiz() {
    let category = document.getElementById("categorySelect").value;
    if (!category) return alert("Veuillez choisir une catégorie.");
    
    let questions = usersData[currentUser].categories[category];
    if (!questions.length) return alert("Aucune question dans cette catégorie.");
    
    playQuiz(questions);
}

function playQuiz(questions) {
    let index = 0;
    let score = 0;
    document.getElementById("playQuiz").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");
    
    function askQuestion() {
        if (index < questions.length) {
            document.getElementById("questionDisplay").innerText = questions[index].question;
        } else {
            alert(`Quiz terminé ! Score : ${score}/${questions.length}`);
            showMenu();
        }
    }

    function checkAnswer() {
        let userAnswer = document.getElementById("userAnswer").value.trim().toLowerCase();
        if (userAnswer === questions[index].answer.toLowerCase()) score++;
        index++;
        askQuestion();
    }
    
    window.checkAnswer = checkAnswer;
    askQuestion();
}

function showResetOptions() {
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("resetOptions").classList.remove("hidden");
}

function resetCategory() {
    let category = document.getElementById("resetCategorySelect").value;
    if (category) {
        usersData[currentUser].categories[category] = [];
        localStorage.setItem("usersData", JSON.stringify(usersData));
    }
    showMenu();
}

function resetQuiz() {
    usersData[currentUser].categories = {};
    localStorage.setItem("usersData", JSON.stringify(usersData));
    showMenu();
}

function showMenu() {
    document.querySelectorAll(".container").forEach(div => div.classList.add("hidden"));
    document.getElementById("menu").classList.remove("hidden");
}
