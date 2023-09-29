# Générateur de tournois ⚽🎮

Bienvenue sur mon générateur de tournois **Antcritique** ! Cette application permet de créer facilement un arbre de tournoi pour les petites compétitions sportives ou de jeux-vidéos entre amis !

J'ai uploadé ce site sur Vercel, voici le [lien](https://tournois-generateur.vercel.app/) ! 

L'application est plutôt faite pour être utilisée sur téléphone mais est également calibrée pour les ordis.

## Présentation 🌟

Je cherchais un projet qui pourrait me faire monter en compétence sur le JavaScript et qui répondrait à un vrai besoin. Je fais souvent des tournois FIFA entre amis, et nous notons les résultats au fur et à mesure sur un papier ou les notes du téléphone. Je me suis dit que ce serait sympa de créer une petite application pour le faire rapidement et pour afficher visuellement l'arbre du tournoi.

## Comment ça marche ? 🎬📖

L'application est scindé en 3 blocs

### Le bloc paramètres du tournois
![image](https://github.com/AntoineGrb/tournois-generateur/assets/119600392/46fa90fb-fe1a-4c54-9c4e-f42b9818f18a)

Renseigner les paramètres du tournoi :
- Le nom du tournoi
- Le nombre d'équipes ou de joueurs
- Le mode de tirage (dans l'ordre de saisie ou aléatoire)
- Le mode scores (si activé, il faudra renseigner les scores de chaque match)

### Le bloc équipes
![image](https://github.com/AntoineGrb/tournois-generateur/assets/119600392/a3f50f97-ea1c-4227-acfd-234112a141e1)


Il se met dynamiquement à jour en fonction des choix sur le bloc paramètres. Renseigner le nom des équipes et valider.
Une fois validé, les paramètres se figent. Pour annuler et changer le tournoi, cliquer sur Annuler.

### Le bloc tournoi
![image](https://github.com/AntoineGrb/tournois-generateur/assets/119600392/8eaa6a31-d32d-4527-ab14-090a5f6e881b)

L'arbre de tournoi est créé à la validation, avec son nom, la date du jour et toutes les équipes renseignées. 
Pour passer au tour suivant, cliquer sur le vainqueur du match (ou inscrire les scores + cliquer si le mode score est activé.
Le tournoi est sauvegardé dans le localStorage, il est donc possible de reprendre là ou on en était plus tard, si on reste sur le même appareil.
Il est également possible de sauvegarder l'image de l'arbre du tournoi en cliquant sur la disquette, pour se rappeler du vainqueur. 
Have fun !

## Technologies utilisées 🛠️

- **HTML**
- **CSS**
- **Sass**
- **JavaScript**

## Auteur 👩‍💻👨‍💻

C'est moi ! Si vous voulez en savoir plus sur moi ou discuter de ce projet ou d'autres sujets intéressants, n'hésitez pas à me suivre ou à m'envoyer un message.
