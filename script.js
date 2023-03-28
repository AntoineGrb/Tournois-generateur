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
        document.querySelector("#teams-count").value = 4; 
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
        const currentId = e.currentTarget.parentElement.getAttribute("id");
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

        //On met en forme le vainqueur et le perdant
        e.currentTarget.parentElement.style.fontWeight = "bold";
        const currentOtherTeamId = `r${currentRound.toString()}-m${currentMatch.toString()}-t${currentOtherTeam.toString()}`;
        document.getElementById(currentOtherTeamId).style.fontWeight = "normal";

        //^ Si le mode "Score" est activé
            //On teste le score
            let currentTeamScore = document.querySelector(`#${currentId} input`).value;
            let currentOtherTeamScore = document.querySelector(`#${currentOtherTeamId} input`).value;
            if (currentTeamScore <= currentOtherTeamScore) {
                alert("Non cohérent");
                return 
            }

            //On fige les inputs
            document.querySelector(`#${currentId} input`).setAttribute("readonly" , "readonly");
            document.querySelector(`#${currentOtherTeamId} input`).setAttribute("readonly" , "readonly");
            //^ Ajouter une nouvelle class avec une mise en forme sans les champs inputs
            //^ Ajouter une icone d'annulation

        //On envoie l'équipe gagnante au tour suivant
        const winnerTeam = e.currentTarget.parentElement.querySelector("p").innerText;
        document.querySelector(`#${nextId} > p `).innerText = winnerTeam;
    };

    //Event : cliquer sur une div pour passer au prochain tour
    const teamsDiv = document.querySelectorAll("div[id^=r][id$=t1] > p, div[id^=r][id$=t2] > p");   
    teamsDiv.forEach(teamDiv => {
        teamDiv.addEventListener("click", (e) => {
            clickToWin(e);
        });
    });

//#endregion

//#region SCROLL-GRAB SUR L'ARBRE DE TOURNOI
    const slider = document.querySelector(".tree__container")
    let startX;
    let scrollLeft;
    let isDown = false;

    //Les évènements de souris
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