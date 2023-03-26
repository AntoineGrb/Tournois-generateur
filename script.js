const teamsSelect = document.querySelector("#teams-count");
let teamsName = [];


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
                    teamDiv.setAttribute("id" , `r${round}-m${match}-${team}`);
                    teamDiv.appendChild(document.createElement("p"));
                    matchDiv.appendChild(teamDiv);

                    if (round === 0) {
                        teamDiv.classList.add(`team__${teamTag}`);
                        teamTag++;
                    }
                }
                roundDiv.appendChild(matchDiv);
            }
            treeContainer.appendChild(roundDiv);
        }
    }
//#endregion

//#region EVENT : CREER LES INPUTS ET L'ARBRE
    let teamsCount = 4;

    teamsSelect.addEventListener("change" , (e) => {
        e.preventDefault();
        teamsCount = e.target.value;
        createInputs(teamsCount);
        createTree(teamsCount);
    })
//#endregion

//#region VALIDATION DU TOURNOI
    //Event : sélection du mode
    let mode = "order";
    const drawMode = document.querySelector("#draw-mode");
    drawMode.addEventListener("change" , (e) => {
        mode = e.target.value;
    });

    //Event : valider le tournoi
    document.querySelector("#button__valider").addEventListener("click" , () => {

            //Stock les valeurs des inputs dans un tableau
            let teamsArray = [];
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
                console.log("arrayRandom = " , teamsArray);
            };
            //Draw
            for (let team = 1 ; team <= teamsCount ; team++) {
                const teamDivName = document.querySelector(`.team__${team} > p`);
                teamDivName.innerText = teamsArray[team - 1];
            };
            //! Rajouter une alerte si tous les inputs ne sont pas complétés
    });

//#endregion
