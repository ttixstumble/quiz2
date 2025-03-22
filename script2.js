document.addEventListener("DOMContentLoaded", function () {
    let user = localStorage.getItem("user");
    if (!user) {
        alert("Veuillez vous connecter.");
        window.location.href = "login.html"; // Redirection si non connecté
    }

    let categories = JSON.parse(localStorage.getItem(`${user}_categories`)) || {};
    let quizData = JSON.parse(localStorage.getItem(`${user}_quiz`)) || {};

    // Gestion des fenêtres modales
    function toggleModal(id, show = true) {
        document.getElementById(id).style.display = show ? "block" : "none";
    }

    document.querySelectorAll(".fermer").forEach(btn => {
        btn.addEventListener("click", () => toggleModal(btn.parentElement.parentElement.id, false));
    });

    // Ajout de catégorie
    document.getElementById("btnCategorie").addEventListener("click", () => toggleModal("modalCategorie"));
    document.getElementById("ajouterCategorie").addEventListener("click", function () {
        let cat = document.getElementById("nomCategorie").value.trim();
        if (cat && !categories[cat]) {
            categories[cat] = [];
            localStorage.setItem(`${user}_categories`, JSON.stringify(categories));
            alert("Catégorie ajoutée !");
        } else {
            alert("Catégorie invalide ou existante !");
        }
    });

    // Ajout de question
    document.getElementById("btnQuiz").addEventListener("click", function () {
        let select = document.getElementById("selectCategorie");
        select.innerHTML = Object.keys(categories).map(cat => `<option>${cat}</option>`).join("");
        toggleModal("modalQuiz");
    });

    document.getElementById("ajouterQuestion").addEventListener("click", function () {
        let cat = document.getElementById("selectCategorie").value;
        let question = document.getElementById("question").value.trim();
        let reponse = document.getElementById("reponse").value.trim();

        if (question && reponse) {
            categories[cat].push({ question, reponse });
            localStorage.setItem(`${user}_categories`, JSON.stringify(categories));
            alert("Question ajoutée !");
        }
    });

    // Jouer
    document.getElementById("btnJouer").addEventListener("click", function () {
        let select = document.getElementById("selectJouerCategorie");
        select.innerHTML = Object.keys(categories).map(cat => `<option>${cat}</option>`).join("");
        toggleModal("modalJouer");
    });

    document.getElementById("demarrerQuiz").addEventListener("click", function () {
        let cat = document.getElementById("selectJouerCategorie").value;
        let questions = categories[cat];
        if (questions.length === 0) return alert("Aucune question !");
        
        let score = 0;
        let index = 0;
        let erreurs = 0;

        function poserQuestion() {
            let q = questions[index];
            let reponse = prompt(q.question);
            if (reponse && reponse.trim().toLowerCase() === q.reponse.toLowerCase()) {
                score++;
                index++;
                if (index < questions.length) poserQuestion();
                else alert(`Quiz terminé ! Score: ${score}/${questions.length}`);
            } else {
                erreurs++;
                if (erreurs >= 3) {
                    alert(`Réponse correcte : ${q.reponse}`);
                    let validation = prompt("Recopiez la réponse pour valider :");
                    if (validation && validation.trim().toLowerCase() === q.reponse.toLowerCase()) {
                        index++;
                        poserQuestion();
                    }
                } else {
                    alert("Mauvaise réponse, réessayez !");
                    poserQuestion();
                }
            }
        }

        poserQuestion();
    });

    // Réinitialisation
    document.getElementById("btnReinitialiser").addEventListener("click", function () {
        let select = document.getElementById("selectResetCategorie");
        select.innerHTML = Object.keys(categories).map(cat => `<option>${cat}</option>`).join("");
        toggleModal("modalReinitialiser");
    });

    document.getElementById("resetTout").addEventListener("click", function () {
        if (confirm("Tout supprimer ?")) {
            categories = {};
            localStorage.setItem(`${user}_categories`, JSON.stringify(categories));
            alert("Tout a été réinitialisé !");
        }
    });

    document.getElementById("resetCategorie").addEventListener("click", function () {
        let cat = document.getElementById("selectResetCategorie").value;
        delete categories[cat];
        localStorage.setItem(`${user}_categories`, JSON.stringify(categories));
        alert(`Catégorie '${cat}' supprimée !`);
    });

    document.getElementById("btnDeconnexion").addEventListener("click", function () {
        localStorage.removeItem("user");
        window.location.href = "login.html";
    });
});
