const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Créer le dossier assets s'il n'existe pas
// eslint-disable-next-line no-undef
const assetsDir = path.join(__dirname, '../assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Dimensions (1024x1024 pour icon.png)
const width = 1024;
const height = 1024;

// Créer le canvas
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Couleurs du projet (modifiez selon vos couleurs)
const primaryColor = '#4299E1'; // Bleu
const secondaryColor = '#2D3748'; // Gris foncé
const backgroundColor = '#FFFFFF'; // Blanc

// 1. Fond
ctx.fillStyle = backgroundColor;
ctx.fillRect(0, 0, width, height);

// 2. Cercle de fond (optionnel)
ctx.fillStyle = primaryColor + '20'; // 20% d'opacité
ctx.beginPath();
ctx.arc(width / 2, height / 2, 400, 0, Math.PI * 2);
ctx.fill();

// 3. Logo textuel "MyGarage" avec style sportif
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Style pour "My" (première partie)
ctx.font = 'bold 180px "Arial Black", sans-serif';
ctx.fillStyle = primaryColor;
ctx.fillText('My', width / 2, height / 2 - 50);

// Style pour "Garage" (deuxième partie)
ctx.font = 'bold 180px "Arial Black", sans-serif';
ctx.fillStyle = secondaryColor;
ctx.fillText('Garage', width / 2, height / 2 + 100);

// 4. Ajouter un effet de vitesse/ligne sportive
ctx.strokeStyle = primaryColor;
ctx.lineWidth = 15;
ctx.beginPath();
ctx.moveTo(width * 0.2, height * 0.3);
ctx.bezierCurveTo(
  width * 0.3, height * 0.4,
  width * 0.7, height * 0.6,
  width * 0.8, height * 0.7
);
ctx.stroke();

// 5. Sauvegarder l'icône principale
const iconBuffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconBuffer);

console.log('✅ icon.png généré avec succès!');

// 6. Générer adaptive-icon.png (même logo mais sans fond)
const canvasAdaptive = createCanvas(width, height);
const ctxAdaptive = canvasAdaptive.getContext('2d');

// Fond transparent
ctxAdaptive.fillStyle = 'transparent';
ctxAdaptive.fillRect(0, 0, width, height);

// Logo seulement (sans fond)
ctxAdaptive.textAlign = 'center';
ctxAdaptive.textBaseline = 'middle';

// "My"
ctxAdaptive.font = 'bold 180px "Arial Black", sans-serif';
ctxAdaptive.fillStyle = primaryColor;
ctxAdaptive.fillText('My', width / 2, height / 2 - 50);

// "Garage"
ctxAdaptive.font = 'bold 180px "Arial Black", sans-serif';
ctxAdaptive.fillStyle = secondaryColor;
ctxAdaptive.fillText('Garage', width / 2, height / 2 + 100);

// Ligne sportive
ctxAdaptive.strokeStyle = primaryColor;
ctxAdaptive.lineWidth = 15;
ctxAdaptive.beginPath();
ctxAdaptive.moveTo(width * 0.2, height * 0.3);
ctxAdaptive.bezierCurveTo(
  width * 0.3, height * 0.4,
  width * 0.7, height * 0.6,
  width * 0.8, height * 0.7
);
ctxAdaptive.stroke();

const adaptiveBuffer = canvasAdaptive.toBuffer('image/png');
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptiveBuffer);

console.log('✅ adaptive-icon.png généré avec succès!');

// 7. Générer splash.png (1242x2436)
const splashWidth = 1242;
const splashHeight = 2436;
const canvasSplash = createCanvas(splashWidth, splashHeight);
const ctxSplash = canvasSplash.getContext('2d');

// Fond
ctxSplash.fillStyle = backgroundColor;
ctxSplash.fillRect(0, 0, splashWidth, splashHeight);

// Logo centré plus grand
ctxSplash.textAlign = 'center';
ctxSplash.textBaseline = 'middle';

// "My"
ctxSplash.font = 'bold 250px "Arial Black", sans-serif';
ctxSplash.fillStyle = primaryColor;
ctxSplash.fillText('My', splashWidth / 2, splashHeight / 2 - 80);

// "Garage"
ctxSplash.font = 'bold 250px "Arial Black", sans-serif';
ctxSplash.fillStyle = secondaryColor;
ctxSplash.fillText('Garage', splashWidth / 2, splashHeight / 2 + 120);

// Ligne sportive
ctxSplash.strokeStyle = primaryColor;
ctxSplash.lineWidth = 20;
ctxSplash.beginPath();
ctxSplash.moveTo(splashWidth * 0.2, splashHeight * 0.4);
ctxSplash.bezierCurveTo(
  splashWidth * 0.3, splashHeight * 0.45,
  splashWidth * 0.7, splashHeight * 0.55,
  splashWidth * 0.8, splashHeight * 0.6
);
ctxSplash.stroke();

const splashBuffer = canvasSplash.toBuffer('image/png');
fs.writeFileSync(path.join(assetsDir, 'splash.png'), splashBuffer);

console.log('✅ splash.png généré avec succès!');

// 8. Générer notification-icon.png (96x96)
const notifWidth = 96;
const notifHeight = 96;
const canvasNotif = createCanvas(notifWidth, notifHeight);
const ctxNotif = canvasNotif.getContext('2d');

// Fond blanc
ctxNotif.fillStyle = '#FFFFFF';
ctxNotif.fillRect(0, 0, notifWidth, notifHeight);

// Logo simplifié
ctxNotif.textAlign = 'center';
ctxNotif.textBaseline = 'middle';

// "MG" abrégé
ctxNotif.font = 'bold 50px "Arial Black", sans-serif';
ctxNotif.fillStyle = primaryColor;
ctxNotif.fillText('MG', notifWidth / 2, notifHeight / 2);

const notifBuffer = canvasNotif.toBuffer('image/png');
fs.writeFileSync(path.join(assetsDir, 'notification-icon.png'), notifBuffer);

console.log('✅ notification-icon.png généré avec succès!');

console.log('\n🎨 Tous les assets ont été générés dans le dossier assets/');