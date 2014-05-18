// Constantes du jeu
var NBR_LIGNES = 5;
var NBR_BRIQUES_PAR_LIGNE = 8;
var BRIQUE_WIDTH = 48; // px
var BRIQUE_HEIGHT = 15;
var ESPACE_BRIQUE = 2; // espacement entre les briques en px

// Variables
var tabBriques; // tableau virtuel contenant les briques

window.addEventListener('load', function(){
	// On récupère l'objet Canvas
	var elem = document.getElementById('canvasElem');
	if(!elem || !elem.getContext){
		return;
	}

	// On récupère le contexte 2D
	var context = elem.getContext('2d');

	if(!context){
		return;
	}

	// le navigateur est compatible + le contexte a bien été récupéré

}, false);
