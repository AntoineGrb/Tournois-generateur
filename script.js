//Zones de sélection
const tournamentName = document.querySelector("#tournament-name");
const teamsSelect = document.querySelector("#teams-count");
const drawMode = document.querySelector("#draw-mode");
const scoreModeSelect = document.querySelector("#score-mode");
const buttonAnnuler = document.querySelector("#button__annuler");
const buttonValider = document.querySelector("#button__valider");

//Valeurs par défaut
let teamsArray = [];
let teamsCount = 4;
let rounds = 2;
let matchs = 2;

//Local storage 
let objectStorage = {
    id:"",
    name:"",
    score:0,   
};
let dataStorage = [];

//#region GESTION DU LOCAL STORAGE
//! Tester si il y a des données dans le local. Si oui les rapatrier 


function disabledParameters() {
    tournamentName.disabled = true;
    teamsSelect.disabled = true; 
    drawMode.disabled = true;
    scoreModeSelect.disabled = true;
    buttonValider.style.display = "none";
    buttonAnnuler.style.display = "block"; //Affiche le bouton Annuler
}
disabledParameters();

//#endregion

//#region CREATION DE L'ARBRE DE TOURNOI
    // Fonction : Création des inputs
    function createInputs(teamsCount) {
        const teamsInputs = document.querySelector(".teams__inputs");
        teamsInputs.innerHTML = "";

        for (let team = 1 ; team <= teamsCount ; team++) {
            let input = document.createElement("input");
            input.setAttribute("id" , `input-team${team}`);
            input.setAttribute("type" , "text");
            input.setAttribute("maxlength" , 25);
            input.setAttribute("placeholder" , `Equipe ${team}`);
            teamsInputs.appendChild(input);
        }
    }

    // Fonction : Création de l'arbre
    function createTree(teamsCount) {
        const treeContainer = document.querySelector(".tree__container");
        treeContainer.innerHTML = "";
        
        //Les rounds
        rounds = Math.log2(teamsCount);
        for (let round = 0 ; round < rounds ; round++) {
            let roundDiv = document.createElement("div");
            roundDiv.setAttribute("class" , "tree__container__round");
            roundDiv.setAttribute("id" , `r${round}`);

            let teamTag = 1;
            //Les matchs
            matchs = teamsCount / 2 ** (round + 1);
            for (let match = 1 ; match <= matchs ; match++) {
                let matchDiv = document.createElement("div");
                matchDiv.setAttribute("class" , "tree__container__round__match");
                matchDiv.setAttribute("id" , `r${round}-m${match}`);

                //Les équipes
                for (let team = 1 ; team <= 2 ; team++) {
                    let teamDiv = document.createElement("div");
                    teamDiv.setAttribute("class" , "tree__container__round__match__team");
                    teamDiv.setAttribute("id" , `r${round}-m${match}-t${team}`);
                    let teamDivName = document.createElement("p");
                    teamDiv.appendChild(teamDivName);
                    matchDiv.appendChild(teamDiv);

                    // Les scores
                    let scoreDiv = document.createElement("div");
                    scoreDiv.setAttribute("class" , "tree__container__round__match__team__score");
                    scoreDiv.setAttribute("id" , `r${round}-m${match}-t${team}-s`);
                    // scoreDiv.appendChild(document.createElement("input"));
                    teamDiv.appendChild(scoreDiv);

                    if (round === 0) {
                        teamDiv.classList.add(`team__${teamTag}`);
                        teamTag++;
                    }

                    //Ajouter l'écouteur d'évènement sur chaque matchDiv
                    teamDivName.addEventListener("click", (e) => {
                        clickToWin(e); //Définie hors de l'évent
                    });
                }
                roundDiv.appendChild(matchDiv);
            }
            treeContainer.appendChild(roundDiv);
        }
    }

    //* Event : mettre à jour les inputs et l'arbre en fonction du nombre d'équipes

    teamsSelect.addEventListener("change" , (e) => {
        e.preventDefault();
        teamsCount = e.target.value;
        createInputs(teamsCount);
        createTree(teamsCount);
        scoreModeSelect.value = "no-score"; //Remet le mode score à sa valeur initiale

        //Save dans le local Storage
        window.localStorage.setItem("dataTeamsCount" , JSON.stringify(teamsCount));
        console.log("dataTeamsCount" , JSON.stringify(teamsCount));
    });
//#endregion

//#region ACTIVATION / DESACTIVATION DU MODE SCORES
    //Fonction : Activer le mode score
    function addScoreInputs(teamsCount) {
        rounds = Math.log2(teamsCount);

        for (let round = 0 ; round < rounds ; round++) {
            matchs = teamsCount / 2 ** (round + 1);

            for (let match = 1 ; match <= matchs ; match++) {

                for (let team = 1 ; team <= 2 ; team++) {
                    let teamDiv = document.querySelector(`#r${round}-m${match}-t${team}-s`);
                    let inputDiv = document.createElement("input");
                    inputDiv.setAttribute("type" , "number");
                    inputDiv.setAttribute("max" , 99);
                    inputDiv.setAttribute("min" , 0);
                    teamDiv.appendChild(inputDiv);
                };
            };
        };
    };

    //Fonction : Retirer le mode score
    function removeScoreInputs(teamsCount) {
        rounds = Math.log2(teamsCount);

        for (let round = 0 ; round < rounds ; round++) {
            matchs = teamsCount / 2 ** (round + 1);

            for (let match = 1 ; match <= matchs ; match++) {

                for (let team = 1 ; team <= 2 ; team++) {
                    let teamDiv = document.querySelector(`#r${round}-m${match}-t${team}-s`);
                    let inputElement = teamDiv.querySelector("input");
                    if (inputElement) {
                        teamDiv.removeChild(inputElement);
                    }
                };
            };
        };
    };

    //* Event : mettre à jour le mode score sur l'arbre
    let isScoreMode = false;

    scoreModeSelect.addEventListener("change" , (e) => {
        e.preventDefault();
        if (e.target.value === "score") {
            addScoreInputs(teamsCount);
            isScoreMode = true;
        }
        else if (e.target.value === "no-score") {
            removeScoreInputs(teamsCount);
            isScoreMode = false;
        }
    });

     //Save dans le local Storage
     window.localStorage.setItem("dataScoreMode" , JSON.stringify(isScoreMode));
    
//#endregion

//#region VALIDER LE TOURNOI 
    //* Event : Sélectionner le mode de tirage en fonction du champ draw-mode
    let mode = "order";
    drawMode.addEventListener("change" , (e) => {
        mode = e.target.value;
    });

    //* Event : Cliquer sur Valider
    document.querySelector("#button__valider").addEventListener("click" , (e) => {

            //Contrôle des champs Inputs
            for (let i = 1 ; i <= teamsCount ; i++) {
                let inputChecked = document.querySelector(`#input-team${i}`);
                if (inputChecked.value.trim() === "") {
                    return alert("Toutes les équipes n'ont pas de nom !");
                }
            }

            //Stock les valeurs des inputs dans un tableau
            for (let team = 1 ; team <= teamsCount ; team++) {
                const teamInputName = document.querySelector(`#input-team${team}`).value;
                teamsArray.push(teamInputName);
                console.log("inputName = " , teamInputName);
            };

            //^ Si mode Random : mélange le tableau
            if (mode === "random") {
                function shuffle(array) {
                    for (let i = array.length - 1; i > 0; i--) {
                      const j = Math.floor(Math.random() * (i + 1));
                      [array[i], array[j]] = [array[j], array[i]];
                    }
                    return array;
                }
                shuffle(teamsArray);
            };

            //! Tirage des équipes (TIRER PAR ID ET NON PAR CLASS)
            for (let team = 1 ; team <= teamsCount ; team++) {
                const teamDivName = document.querySelector(`.team__${team} > p`);
                teamDivName.innerText = teamsArray[team - 1];

                //Save dans le local Storage
                objectStorage = {
                    id:`team__${team}`,
                    name:teamDivName.innerText,
                }
                dataStorage.push(objectStorage);
                console.log("dataStorage" , dataStorage);
            }; 
            window.localStorage.setItem("dataStorage" , JSON.stringify(dataStorage));

            //Désactive la sélection des paramètres une fois validé
            disabledParameters();
    });
//#endregion

//#region ANNULER LE TOURNOI
    //* Event : Cliquer sur Annuler
    buttonAnnuler.addEventListener("click" , (e) => {
        teamsArray = [];
        createInputs(4);
        createTree(4);
        scoreModeSelect.value = "no-score"; //Remet le mode score à sa valeur initiale

        //Réactive la sélection des paramètres et affiche le bouton Valider
        e.target.style.display = "none";
        teamsSelect.disabled = false; 
        teamsSelect.value = 4; 
        tournamentName.disabled = false;
        tournamentName.value = "";
        drawMode.disabled = false;
        scoreModeSelect.disabled = false;
        buttonValider.style.display = "block";   

        // Remove from local Storage
        window.localStorage.removeItem("dataTeamsCount");
        window.localStorage.removeItem("dataScoreMode");
        window.localStorage.removeItem("dataStorage");

    });
//#endregion

//#region DETERMINER LE VAINQUEUR D'UN MATCH ET PASSAGE AU TOUR SUIVANT

    //FOnction : Cliquer pour passer au prochain tour
    function clickToWin(e) {
        // On récupère les infos avec l'ID de la div sélectionnée
        const currentId = e.currentTarget.parentElement.getAttribute("id");
        const currentRound = parseInt(currentId.slice(1,2));
        const currentMatch = parseInt(currentId.slice(4,5));
        const currentTeam = parseInt(currentId.slice(7,8));
        let currentOtherTeam = 1;
        if (currentTeam === 1) { //L'équipe perdante
            currentOtherTeam = 2;
        } 
        const currentOtherTeamId = `r${currentRound.toString()}-m${currentMatch.toString()}-t${currentOtherTeam.toString()}`;

        //On détermine l'ID de la div du tour suivant
        const nextRound = currentRound + 1;
        const nextMatch = Math.ceil(currentMatch / 2);
        let nextTeam = 1; 
        if (currentMatch % 2 === 0 ) {
            nextTeam = 2; //Si le match est un nombre pair, alors l'équipe ira en position 2 au prochain match
        };
        const nextId = `r${nextRound.toString()}-m${nextMatch.toString()}-t${nextTeam.toString()}`;

         //^ Si le mode "Score" est activé
         if (scoreModeSelect.value === "score") {

            //^Contrôle sur les scores
            let currentTeamScore = document.querySelector(`#${currentId} input`).value;
            let currentOtherTeamScore = document.querySelector(`#${currentOtherTeamId} input`).value;
            if (currentTeamScore === "" || currentOtherTeamScore === "") {
                alert("Renseigner le score du match");
                return 
            }
            if (currentTeamScore < currentOtherTeamScore) {
                alert("Le score n'est pas cohérent avec le vainqueur du match");
                return 
            }

            //^On fige les inputs et on met en forme les scores validés
            document.querySelector(`#${currentId} input`).setAttribute("readonly" , "readonly");
            document.querySelector(`#${currentId} input`).classList.add("input--disabled");
            document.querySelector(`#${currentOtherTeamId} input`).setAttribute("readonly" , "readonly");
            document.querySelector(`#${currentOtherTeamId} input`).classList.add("input--disabled");

            //^Save dans le local Storage
            function updateScoreById(tableau, currentId, currentTeamScore , currentOtherTeamId , currentOtherTeamScore) {
                const winnerTeam = tableau.find(winnerTeam => winnerTeam.id === currentId);
                if (winnerTeam) {
                winnerTeam.score = currentTeamScore;
                } else {
                    console.log("Aucun objet trouvé avec l'id donné");
                };

                const loserTeam = tableau.find(loserTeam => loserTeam.id === currentOtherTeamId);
                if (loserTeam) {
                    loserTeam.score = currentOtherTeamScore;
                } else {
                    console.log("Aucun objet trouvé avec l'id donné");
                }
            };
            updateScoreById(dataStorage , currentId , currentTeamScore , currentOtherTeamId , currentOtherTeamScore);

            window.localStorage.setItem("dataStorage" , JSON.stringify(dataStorage));
            console.log("dataStorage" , JSON.stringify(dataStorage));
        }; 

        //On met en forme le vainqueur et le perdant
        e.currentTarget.parentElement.style.fontWeight = "bold";
        document.getElementById(currentOtherTeamId).style.fontWeight = "normal";

        //On envoie l'équipe gagnante au tour suivant
        const winnerTeam = e.currentTarget.parentElement.querySelector("p").innerText;
        document.querySelector(`#${nextId} > p `).innerText = winnerTeam;

    };

    //* Event : cliquer sur une équipe
    const teamsDiv = document.querySelectorAll("div[id^=r][id$=t1] > p, div[id^=r][id$=t2] > p");   
    teamsDiv.forEach(teamDiv => {
        teamDiv.addEventListener("click", (e) => {
            clickToWin(e);
        });
    });
//#endregion

//#region  SCROLL-GRAB SUR L'ARBRE DE TOURNOI
    const slider = document.querySelector(".tree__container")
    let startX;
    let scrollLeft;
    let isDown = false;

    //* Les évènements de souris
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      });

      slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
      });

      slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
      });
      
      slider.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
        console.log(walk);
      });
//#endregion