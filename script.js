const teamsSelect = document.querySelector("#teams-count");
let teamsArray = [];
let teamsCount = 4; //Valeur défaut

//#region CREATION DES INPUTS NOMS DES EQUIPES
    //Fonction créer les inputs
    function createInputs(teamsCount) {
        const teamsInputs = document.querySelector(".teams__inputs");
        teamsInputs.innerHTML = "";

        for (let team = 1 ; team <= teamsCount ; team++) {
            let input = document.createElement("input");
            input.setAttribute("id" , `input-team${team}`);
            input.setAttribute("type" , "text");
            input.setAttribute("maxlength" , "30");
            input.setAttribute("placeholder" , `Equipe ${team}`);
            teamsInputs.appendChild(input);
        }
    }
//#endregion

//#region CREATION DE L'ARBRE DE TOURNOI
    //Fonction : créer l'arbre
    function createTree(teamsCount) {
        const treeContainer = document.querySelector(".tree__container");
        treeContainer.innerHTML = "";
        
        //Les rounds
        let rounds = Math.log2(teamsCount);
        for (let round = 0 ; round < rounds ; round++) {
            let roundDiv = document.createElement("div");
            roundDiv.setAttribute("class" , "tree__container__round");
            roundDiv.setAttribute("id" , `r${round}`);

            let teamTag = 1;
            //Les matchs
            let matchs = teamsCount / 2 ** (round + 1);
            for (let match = 1 ; match <= matchs ; match++) {
                let matchDiv = document.createElement("div");
                matchDiv.setAttribute("class" , "tree__container__round__match");
                matchDiv.setAttribute("id" , `r${round}-m${match}`);

                //Les équipes
                for (let team = 1 ; team <= 2 ; team++) {
                    let teamDiv = document.createElement("div");
                    teamDiv.setAttribute("class" , "tree__container__round__match__team");
                    teamDiv.setAttribute("id" , `r${round}-m${match}-t${team}`);
                    teamDiv.appendChild(document.createElement("p"));
                    matchDiv.appendChild(teamDiv);

                    if (round === 0) {
                        teamDiv.classList.add(`team__${teamTag}`);
                        teamTag++;
                    }

                    //Ajouter l'écouteur d'évènement sur chaque matchDiv
                    teamDiv.addEventListener("click", (e) => {
                        clickToWin(e); //Définie hors de l'évent
                    });
                }
                roundDiv.appendChild(matchDiv);
            }
            treeContainer.appendChild(roundDiv);
        }
    }
//#endregion

//EVENT : CREER LES INPUTS ET L'ARBRE
    teamsSelect.addEventListener("change" , (e) => {
        e.preventDefault();
        teamsCount = e.target.value;
        createInputs(teamsCount);
        createTree(teamsCount);
    })

//#region VALIDER LE TOURNOI 
    //Sélection du mode
    let mode = "order";
    const drawMode = document.querySelector("#draw-mode");
    drawMode.addEventListener("change" , (e) => {
        mode = e.target.value;
    });

    //Event : Cliquer sur Valider
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

            //Random mode --> mélange le tableau
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

            //Tirage
            for (let team = 1 ; team <= teamsCount ; team++) {
                const teamDivName = document.querySelector(`.team__${team} > p`);
                teamDivName.innerText = teamsArray[team - 1];
            };

            //Désactive la sélection des paramètres une fois validé
            e.target.style.display = "none";
            document.querySelector("#teams-count").disabled = true; 
            document.querySelector("#tournament-name").disabled = true;
            document.querySelector("#draw-mode").disabled = true;
            document.querySelector("#button__annuler").style.display = "block"; //Affiche le bouton Annuler 
    });

//#endregion

//#region ANNULER LE TOURNOI

    //Event : Cliquer sur Annuler
    document.querySelector("#button__annuler").addEventListener("click" , (e) => {
        teamsArray = [];
        createInputs(4);
        createTree(4);

        //Réactive la sélection des paramètres et affiche le bouton Valider
        e.target.style.display = "none";
        document.querySelector("#teams-count").disabled = false; 
        document.querySelector("#tournament-name").disabled = false;
        document.querySelector("#tournament-name").value = "";
        document.querySelector("#draw-mode").disabled = false;
        document.querySelector("#button__valider").style.display = "block";   
    });

//#endregion

//#region DETERMINER LE VAINQUEUR D'UN MATCH ET PASSAGE AU TOUR SUIVANT
    //Fonction : cliquer pour passer au prochain tour
    function clickToWin(e) {
        // On récupère les infos avec l'ID de la div sélectionnée
        const currentId = e.currentTarget.getAttribute("id");
        const currentRound = parseInt(currentId.slice(1,2));
        const currentMatch = parseInt(currentId.slice(4,5));
        const currentTeam = parseInt(currentId.slice(7,8));
        let currentOtherTeam = 1;
        if (currentTeam === 1) { //L'équipe perdante
            currentOtherTeam = 2;
        } 

        //On détermine l'ID de la div du tour suivant
        const nextRound = currentRound + 1;
        const nextMatch = Math.ceil(currentMatch / 2);
        let nextTeam = 1; 
        if (currentMatch % 2 === 0 ) {
            nextTeam = 2; //Si le match est un nombre pair, alors l'équipe ira en position 2 au prochain match
        };
        const nextId = `r${nextRound.toString()}-m${nextMatch.toString()}-t${nextTeam.toString()}`;
        console.log("ID winning team " ,nextId);

        //On envoie l'équipe au tour suivant
        const winnerTeam = e.currentTarget.querySelector("p").innerText;
        document.querySelector(`#${nextId} > p `).innerText = winnerTeam;

        //On met en gras le vainqueur
        e.currentTarget.style.fontWeight = "bold";
        //On s'assure que l'autre équipe n'est pas en gras
        const currentOtherTeamId = `r${currentRound.toString()}-m${currentMatch.toString()}-t${currentOtherTeam.toString()}`;
        document.getElementById(currentOtherTeamId).style.fontWeight = "normal";
    };

    //Event : cliquer sur une div pour passer au prochain tour
    const teamsDiv = document.querySelectorAll("div[id^=r][id$=t1], div[id^=r][id$=t2]");   
    teamsDiv.forEach(teamDiv => {
        teamDiv.addEventListener("click", (e) => {
            clickToWin(e);
        });
    });

//#endregion