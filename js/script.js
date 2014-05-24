// Constantes du jeu
var NBR_LIGNES = 5;
var NBR_BRIQUES_PAR_LIGNE = 8;
var BRIQUE_WIDTH = 48; // px
var BRIQUE_HEIGHT = 15;
var ESPACE_BRIQUE = 2; // espacement entre les briques en px
var BARRE_JEU_WIDTH = 80; // largeur de la barre du jeu
var BARRE_JEU_HEIGHT = 10; // hauteur de la barre de jeu
var PXL_DEPLA = 3; // "vitesse" de déplacement de la raquette
var COULEUR_BALLE = "#16A6DB"; // bleu
var DIMENSION_BALLE = 8; // diamètre
var VITESSE_BALLE = 2;

// Variables
var tabBriques; // tableau virtuel contenant les briques
var barreX; // position en X de la barre (changement dynamique)
var barreY; // position en Y de la barre (ne bougera pas)
var context;
var zone_jeu_width;
var zone_jeu_height;
var balleX = 100;
var balleY = 250;
var dirBalleX = 1; // direction initiale en X
var dirBalleY = -1; // direction initiale en Y
var boucleJeu; // pour pouvoir arrêter le jeu quand le joueur perd
var limiteBriques = (ESPACE_BRIQUE+BRIQUE_HEIGHT)*NBR_LIGNES; // zone des briques
var aGagne = 0; // pour détecter si le joueur a gagné
var keyNum = 0;

// pour les couleurs des briques, générées aléatoirement
var couleurs_briques = [];
for(var i = 0; i < NBR_LIGNES; i++){
	couleurs_briques.push("rgb("+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+")");
}

window.addEventListener('load', function(){
	// message de bienvenue
	alert("Bienvenue sur le jeu de casse-briques !\nUtilisez les touches \"Q\" et \"D\" pour déplacer la raquette.");	

	// On récupère l'objet Canvas
	var elem = document.getElementById('canvasElem');
	if(!elem || !elem.getContext){
		return;
	}

	// On récupère le contexte 2D
	context = elem.getContext('2d');
	if(!context){
		return;
	}

	// initialisation des variables
	zone_jeu_width = elem.width;
	zone_jeu_height = elem.height;
	barreX = (zone_jeu_width/2)-(BARRE_JEU_WIDTH/2); // on calcule le centre du jeu
	barreY = zone_jeu_height-BARRE_JEU_HEIGHT; // on calcule la position la plus basse pour la barre

	// le navigateur est compatible + le contexte a bien été récupéré
	// on initialise le jeu
	creerBriques(context, NBR_LIGNES, NBR_BRIQUES_PAR_LIGNE, BRIQUE_WIDTH,
		BRIQUE_HEIGHT, ESPACE_BRIQUE);
	// on attribue la couleur de la barre + on la positionne
	context.fillStyle = "#333333";
	context.fillRect(barreX, barreY, BARRE_JEU_WIDTH, BARRE_JEU_HEIGHT);

	// boucle de rafraichissement du contexte 2D (timer JS)
	boucleJeu = setInterval(refreshGame, 10); // tous les dixièmes de seconde

	// gestion des évènements
	window.document.onkeydown = function(e) {
		keyNum = e.keyCode;
	};
	window.document.onkeyup = function(e) {
		keyNum = 0;
	};

}, false);

// fonction permettant de créer les briques du jeu
// 1 = brique existante ; 0 = brique cassée
function creerBriques(ctx, nbrLignes, nbrParLigne, largeur, hauteur, espace) {

	// Tableau virtuel: On initialise les lignes de briques
	tabBriques = new Array(nbrLignes);
	
	for (var i=0; i < nbrLignes; i++) {
		
		// Tableau virtuel: On initialise les briques de la ligne
		tabBriques[i] = new Array(nbrParLigne);
		
		// Affichage: On attribue une couleur aux briques de la ligne
		//ctx.fillStyle = "rgb("+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+")";
		ctx.fillStyle = couleurs_briques[i];
		
		for (var j=0; j < nbrParLigne; j++) {
			
			// Affichage: On affiche une nouvelle brique
			ctx.fillRect((j*(largeur+espace)),(i*(hauteur+espace)),largeur,hauteur);
			
			// Tableau virtuel: On attribue à la case actuelle la valeur 1 = la brique existe encore
			tabBriques[i][j] = 1;
		}
	}
	
	// Les briques sont initialisées.
	return 1;
	
}


function perdu() {
	clearInterval(boucleJeu); // on stoppe le jeu
	alert("Perdu !");
}

function gagne() {
	clearInterval(boucleJeu);
	alert("Bravo, vous avez gagné !"); // on stoppe le jeu
}
// fonction pour rendre transparente une zone
function clearContexte(ctx, startwidth, ctxwidth, startheight, ctxheight) {
	ctx.clearRect(startwidth, startheight, ctxwidth, ctxheight);
}

// fonction pour "mettre à jour" les briques et la barre du jeu
function refreshGame() {

	// on efface la zone
	clearContexte(context, 0, zone_jeu_width, 0, zone_jeu_height);

	aGagne = 1;
	// Réaffichage des briques dont l'état = 1
	for (var i=0; i < tabBriques.length; i++) {
		context.fillStyle = couleurs_briques[i];
		for (var j=0; j < tabBriques[i].length; j++) {
			if (tabBriques[i][j] == 1){
				context.fillRect((j*(BRIQUE_WIDTH+ESPACE_BRIQUE)),
						(i*(BRIQUE_HEIGHT+ESPACE_BRIQUE)),BRIQUE_WIDTH,BRIQUE_HEIGHT);
				aGagne = 0; // le joueur n'a pas gagné, il reste (au moins) 1 brique
			}
		}
	}

	// On vérifie si le joueur a gagné
	if(aGagne) gagne();

	// contrôle de la raquette
	// Touche "D" pressée
	if (keyNum == 68){
		// on ne déborde pas du cadre :
		if((barreX + BARRE_JEU_WIDTH + PXL_DEPLA) <= zone_jeu_width){
			barreX += PXL_DEPLA;
		}
	}
	// Touche "Q" pressée
	else if (keyNum == 81){
		// on ne déborde pas du cadre :
		if((barreX - PXL_DEPLA) >= 0){
			barreX -= PXL_DEPLA;
		}
	}

	// Réaffichage de la raquette
	context.fillStyle = "#333333";
	context.fillRect(barreX,barreY,BARRE_JEU_WIDTH,BARRE_JEU_HEIGHT);

	// Calcul de la direction de la balle
	if ((balleX + dirBalleX * VITESSE_BALLE) > zone_jeu_width){
		//dirBalleX = -1;
		dirBalleX = -dirBalleX; // on lance la balle dans la direction opposée (conserve le vecteur)
	}
	else{
		if ((balleX + dirBalleX * VITESSE_BALLE) < 0){
			//dirBalleX = 1;
			dirBalleX = -dirBalleX; // on lance la balle dans la direction opposée
		}
	}
	if ((balleY + dirBalleY * VITESSE_BALLE) > zone_jeu_height){
		// la balle touche le bas de la zone
		perdu();
		//dirBalleY = -1;
	}
	else{
		if ((balleY + dirBalleY * VITESSE_BALLE) < 0){
			dirBalleY = 1;
		}
		else{
			// rebond sur la barre
			if ((balleY + dirBalleY * VITESSE_BALLE >= zone_jeu_height - BARRE_JEU_HEIGHT) &&
				(balleX + dirBalleX * VITESSE_BALLE >= barreX) &&
				(balleX + dirBalleX * VITESSE_BALLE <= barreX + BARRE_JEU_WIDTH)){
				dirBalleY = -1;
				// "bidouille" pour que la direction soit un peu différente
				// selon le lieu de collision
				dirBalleX = 2 * (balleX- (barreX + BARRE_JEU_WIDTH / 2)) / BARRE_JEU_WIDTH;
			}
		}
	}
	
	// Test des collisions avec les briques (serait à optimiser)
	if ( balleY <= limiteBriques) {
		// On est dans la zone des briques
		// on regarde le positionnement de la balle par rapport aux lignes de briques
		var ligneY = Math.floor(balleY/(BRIQUE_HEIGHT+ESPACE_BRIQUE));
		var ligneX = Math.floor(balleX/(BRIQUE_WIDTH+ESPACE_BRIQUE));
		if ( tabBriques[ligneY][ligneX] == 1 ) {
			// si la brique "touchée" existait encore :
			tabBriques[ligneY][ligneX] = 0; // on la met à zéro
			dirBalleY = -(dirBalleY); // on lance la balle dans l'autre direction
		}
	}	
	
	// On fait avancer la balle
	balleX += dirBalleX * VITESSE_BALLE;
	balleY += dirBalleY * VITESSE_BALLE;
	
	// Affichage de la balle
	context.fillStyle = COULEUR_BALLE;
	context.beginPath();
	context.arc(balleX, balleY, DIMENSION_BALLE, 0, Math.PI*2, true);
	context.closePath();
	context.fill();	
}
