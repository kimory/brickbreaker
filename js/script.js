// Constantes du jeu
var NBR_LIGNES = 5;
var NBR_BRIQUES_PAR_LIGNE = 8;
var BRIQUE_WIDTH = 48; // px
var BRIQUE_HEIGHT = 15;
var ESPACE_BRIQUE = 2; // espacement entre les briques en px
var BARRE_JEU_WIDTH = 80; // largeur de la barre du jeu
var BARRE_JEU_HEIGHT = 10; // hauteur de la barre de jeu
var PXL_DEPLA = 4;

// Variables
var tabBriques; // tableau virtuel contenant les briques
var barreX; // position en X de la barre (changement dynamique)
var barreY; // position en Y de la barre (ne bougera pas)
var context;
var zone_jeu_width;
var zone_jeu_height;

// pour les couleurs des briques, générées aléatoirement
var couleurs_briques = [];
for(var i = 0; i < NBR_LIGNES; i++){
	couleurs_briques.push("rgb("+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+")");
}

window.addEventListener('load', function(){
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
	barreY= zone_jeu_height-BARRE_JEU_HEIGHT; // on calcule la position la plus basse pour la barre

	// le navigateur est compatible + le contexte a bien été récupéré
	// on initialise le jeu
	creerBriques(context, NBR_LIGNES, NBR_BRIQUES_PAR_LIGNE, BRIQUE_WIDTH,
		BRIQUE_HEIGHT, ESPACE_BRIQUE);
	// on attribue la couleur de la barre + on la positionne
	context.fillStyle = "#333333";
	context.fillRect(barreX, barreY, BARRE_JEU_WIDTH, BARRE_JEU_HEIGHT);

	// boucle de rafraichissement du contexte 2D (timer JS)
	idInterv = setInterval(refreshGame, 10); // tous les dixièmes de seconde

	// gestion des évènements
	window.document.onkeydown = checkDepla;

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

// fonction pour rendre transparente une zone
function clearContexte(ctx, startwidth, ctxwidth, startheight, ctxheight) {
	ctx.clearRect(startwidth, startheight, ctxwidth, ctxheight);
}

// contrôle de la raquette
function checkDepla(e){
	// Flêche de droite pressée
	if (e.keyCode == 39){
		// on ne déborde pas du cadre :
		if((barreX + BARRE_JEU_WIDTH + PXL_DEPLA) <= zone_jeu_width){
			barreX += PXL_DEPLA;
		}
	}
	// Flêche de gauche pressée
	else if (e.keyCode == 37){
		// on ne déborde pas du cadre :
		if((barreX - PXL_DEPLA) >= 0){
			barreX -= PXL_DEPLA;
		}
	}
}

// fonction pour "mettre à jour" les briques et la barre du jeu
function refreshGame() {

	// on efface la zone
	clearContexte(context, 0, zone_jeu_width, 0, zone_jeu_height);

	// Réaffichage des briques dont l'état = 1
	for (var i=0; i < tabBriques.length; i++) {
		context.fillStyle = couleurs_briques[i];
		for (var j=0; j < tabBriques[i].length; j++) {
			if (tabBriques[i][j] == 1)
				context.fillRect((j*(BRIQUE_WIDTH+ESPACE_BRIQUE)),(i*(BRIQUE_HEIGHT+ESPACE_BRIQUE)),BRIQUE_WIDTH,BRIQUE_HEIGHT);
		}
	}

	// Réaffichage de la barre de jeu
	context.fillStyle = "#333333";
	context.fillRect(barreX,barreY,BARRE_JEU_WIDTH,BARRE_JEU_HEIGHT);
	
}
