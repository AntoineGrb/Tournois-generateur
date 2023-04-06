//Sélection HTML
const tournamentName = document.querySelector("#tournament-name");
const teamsSelect = document.querySelector("#teams-count");
const drawMode = document.querySelector("#draw-mode");
const scoreModeSelect = document.querySelector("#score-mode");
const buttonAnnuler = document.querySelector("#button__annuler");
const buttonValider = document.querySelector("#button__valider");

//Valeurs par défaut
let teamsArray = [];
let rounds = 2;
let matchs = 2;
let teamsCount;
let scoreMode;
//Local storage  
let dataMatchs = [];
let dataMatchsObject = {
    id:"",
    name:"",
    score:0,   
};
let dataParamObject = {
    teamsCount: 4,
    scoreMode: "no-score",
    tournamentName: "",
    tournamentDate: "",
}

//#region RECUPERER DATA FROM LOCAL STORAGE
   dataMatchs = window.localStorage.getItem("dataMatchs");
   dataParamObject = window.localStorage.getItem("dataParamObject");

    //Déclaration des fonctions utilisées
    function disabledParameters() {
        tournamentName.disabled = true;
        teamsSelect.disabled = true; 
        drawMode.disabled = true;
        scoreModeSelect.disabled = true;
        buttonValider.style.display = "none";
        buttonAnnuler.style.display = "block";
    }
    function updateMatchs() {
        for (let i = 0 ; i < dataMatchs.length ; i++) {
            const teamId = dataMatchs[i].id;
            const teamName = dataMatchs[i].name;
            const teamScore = dataMatchs[i].score;
            console.log("teamId : " , teamId);
            console.log("teamName : " , teamName);
            console.log("teamScore : " , teamScore);
            const teamElement = document.querySelector(`#${teamId} > p`);
            const inputElement = document.querySelector(`#${teamId} input`);
        
            if (teamElement) {
              teamElement.innerText = teamName;
            }
        
            if (teamScore !== undefined && teamScore !== null && inputElement) {
              inputElement.value = teamScore;
              inputElement.setAttribute("readonly" , "readonly");
            }
        }
    }

    //Si data dans le local Storage
    if (dataMatchs !== null) {
        //Parser les data
        dataMatchs = JSON.parse(dataMatchs);
        dataParamObject = JSON.parse(dataParamObject);
        console.log("dataMatchs = " , dataMatchs);
        console.log("dataParamObj = " , dataParamObject);

        //Récupérer les valeurs sauvegardées
        teamsCount = dataParamObject.teamsCount;
        scoreMode = dataParamObject.scoreMode;  
        document.querySelector(".tree__id__name").innerText = dataParamObject.tournamentName ;
        document.querySelector(".tree__id__date").innerText = dataParamObject.tournamentDate; 

        //Lancer les fonctions
        createTree(teamsCount , true); //true car première création d'arbre au rechargement
        if (scoreMode === "score") {
            addScoreInputs(teamsCount);
        }
        disabledParameters();
        updateMatchs();
    }
    //Si pas de data dans le local storage, on rénitialise les valeurs
    else {
        dataMatchs = [];
        dataParamObject = {
            teamsCount: 4,
            scoreMode: "no-score",
            tournamentName: "",
            tournamentDate: "",
        }
        teamsCount = dataParamObject.teamsCount;
        scoreMode = dataParamObject.scoreMode;
    }
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
    function createTree(teamsCount , firstLoad = false) { //Deuxième paramètre pour ne charger qu'une fois les écouteurs d'event
        console.log("inside create tree avec teamsCount = " , teamsCount);
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

                    //Ajouter l'écouteur d'évènement sur chaque matchDiv
                    if (!firstLoad) {
                        teamDivName.addEventListener("click", (e) => {
                            console.log("inside EVENT CREATE TREE")
                            clickToWin(e);
                        });
                    }
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
                }
                roundDiv.appendChild(matchDiv);
            }
            treeContainer.appendChild(roundDiv);
        }
    };

    //*Event : mettre à jour les inputs et l'arbre en fonction du nombre d'équipes
    teamsSelect.addEventListener("change" , (e) => {
        e.preventDefault();
        teamsCount = e.target.value;
        createInputs(teamsCount);
        createTree(teamsCount);
        scoreModeSelect.value = "no-score"; //Remet le mode score à sa valeur initiale

        //Save dans le local Storage
        dataParamObject.teamsCount = teamsCount;
        window.localStorage.setItem("dataParamObject" , JSON.stringify(dataParamObject));
        console.log("dataParamObject" , JSON.stringify(dataParamObject));
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
    scoreModeSelect.addEventListener("change" , (e) => {
        e.preventDefault();
        if (e.target.value === "score") {
            addScoreInputs(teamsCount);
            scoreMode = "score";
        }
        else if (e.target.value === "no-score") {
            removeScoreInputs(teamsCount);
            scoreMode = "no-score";
        }

        //Save dans le local Storage
        dataParamObject.scoreMode = scoreMode;
        window.localStorage.setItem("dataParamObject" , JSON.stringify(dataParamObject));
        console.log("dataParamObject" , JSON.stringify(dataParamObject));
    });
//#endregion

//#region VALIDER LE TOURNOI 
    //* Event : Sélectionner le mode de tirage en fonction du champ draw-mode
    let mode = "order"; //Par défaut
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

            // Tirage des équipes
            matchs = teamsCount / 2;
            let teamIndex = 0;

            for (let match = 1 ; match <= matchs ; match++) {

                for (let team = 1 ; team <= 2 ; team++) {
                    const teamDivName = document.querySelector(`#r0-m${match}-t${team} > p`);
                    teamDivName.innerText = teamsArray[teamIndex];
                    teamIndex++;

                    //Save chaque team dans le local Storage
                    dataMatchsObject = {
                        id:`r0-m${match}-t${team}`,
                        name:teamDivName.innerText,
                    }
                    dataMatchs.push(dataMatchsObject);
                    console.log("dataMatchs" , dataMatchs);
                };
            };
            window.localStorage.setItem("dataMatchs" , JSON.stringify(dataMatchs));            

            //Ajoute le nom et la date du tournoi
            let tournamentName = document.querySelector("#tournament-name").value;
            document.querySelector(".tree__id__name").innerText = `${tournamentName} - ` ;
            const date = new Date();
            let todayDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            document.querySelector(".tree__id__date").innerText = todayDate;
            
            //Save dans le local Storage
            dataParamObject.tournamentName = `${tournamentName} - `;
            dataParamObject.tournamentDate = todayDate;
            window.localStorage.setItem("dataParamObject" , JSON.stringify(dataParamObject));
            
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
        window.localStorage.removeItem("dataParamObject");
        window.localStorage.removeItem("dataMatchs");
        dataMatchs = [];
        dataParamObject = {
            teamsCount: 4,
            scoreMode: "no-score",
            tournamentName: "",
            tournamentDate: "",
        };
        document.querySelector(".tree__id__name").innerText ="";
        document.querySelector(".tree__id__date").innerText = "";
        console.log("dataParamObject" , JSON.stringify(dataParamObject));
        console.log("dataMatchs" , JSON.stringify(dataMatchs));
    });
//#endregion

//#region DETERMINER LE VAINQUEUR D'UN MATCH ET PASSAGE AU TOUR SUIVANT

    //Fonction : Cliquer pour passer au prochain tour
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
         console.log("scoreMode = " , scoreMode);
         if (scoreMode === "score") {
            console.log("Mode score ok");

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

            //^Désactivation des matchs terminés
            console.log("désactivation des matchs")
            function disabledMatchs(winnerId , loserId) {
                document.querySelector(`#${winnerId} input`).setAttribute("readonly" , "readonly"); //Plus d'inputs
                document.querySelector(`#${winnerId} input`).classList.add("input--disabled"); //Mise en forme inputs
                document.querySelector(`#${winnerId} input`).style.backgroundColor = "lightgreen";//Couleur
                document.querySelector(`#${loserId} input`).setAttribute("readonly" , "readonly");
                document.querySelector(`#${loserId} input`).classList.add("input--disabled");
                document.querySelector(`#${loserId} input`).style.backgroundColor = "lightcoral";
            }
            disabledMatchs(currentId , currentOtherTeamId);

            //^Save score dans le local Storage
                //^ Récupérer et sauvegarder le score
                function saveScoreById(tableau, currentId, currentTeamScore , currentOtherTeamId , currentOtherTeamScore) {
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
                saveScoreById(dataMatchs , currentId , currentTeamScore , currentOtherTeamId , currentOtherTeamScore);

            window.localStorage.setItem("dataMatchs" , JSON.stringify(dataMatchs));
            console.log("dataMatchs" , JSON.stringify(dataMatchs));
        }; 

        //On met en forme le vainqueur et le perdant
        e.currentTarget.parentElement.style.fontWeight = "bold";
        document.getElementById(currentOtherTeamId).style.fontWeight = "normal";

        //On envoie l'équipe gagnante au tour suivant
        const winnerTeam = e.currentTarget.parentElement.querySelector("p").innerText;
        document.querySelector(`#${nextId} > p `).innerText = winnerTeam;

        //Save next round dans le local Storage
        dataMatchsObject = {
            id:nextId,
            name:winnerTeam,
        }
        dataMatchs.push(dataMatchsObject);
        window.localStorage.setItem("dataMatchs" , JSON.stringify(dataMatchs));
        console.log("dataMatchs" , dataMatchs);
    };

    //* Event : cliquer sur une équipe
    const teamsDiv = document.querySelectorAll("div[id^=r][id$=t1] > p, div[id^=r][id$=t2] > p");   
    teamsDiv.forEach(teamDiv => {
        teamDiv.addEventListener("click", (e) => {
            console.log("inside EVENT CLICK TO WIN SOLO")
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
