let fontInconsolata;
let fontRubik;
let fontsLoaded = false;
let imgHome1;
let imgHome3;
const scaleFactor = 0.10;

function preload() {
  fontInconsolata = loadFont('../../fonts/Inconsolata.ttf'); 
  fontRubik = loadFont('../../fonts/RubikOne.ttf'); 
imgele = loadImage('../../img/ele.png');
imglara = loadImage('../../img/lara.png');
imgsofi = loadImage('../../img/sofi.png');
imgjaco = loadImage('../../img/jaco.png');
imgale = loadImage('../../img/ale.png');
imgfra = loadImage('../../img/fra.png');
imgteamluna = loadImage('../../img/teamluna.png');
imgHomeastronauta = loadImage('../../img/homeastronauta.png');
imgCosaastronauta = loadImage('../../img/cosaastronauta.png');
}

function setup() {
    createCanvas(windowWidth, 2700); 
    let buttonPositions = [
      { x: width - 630, y: 30 },
      { x: width - 510, y: 30 },
      { x: width - 370, y: 30 },
      { x: width - 160, y: 30 }
  ];
    createButtons(buttonPositions);
        // Aggiungi questa riga per rendere i pulsanti fissi
        let buttons = selectAll('button');
        buttons.forEach(button => {
            button.style('position', 'fixed');
        });
    
}

function windowResized() {
    // ridimensiona canvas quando finestra viene ridimensionata
    resizeCanvas(windowWidth, windowHeight);
    redraw(); 
  }
  
function createButtons(positions) {
    let buttonWidth = 100;
    let buttonHeight = 40;
    let buttonSpacing = 10;
    let buttonLabels = ['GRAFICO', 'COSA SONO', 'LEGGERE IL GRAFICO', 'CHI SIAMO'];
    for (let i = 0; i < buttonLabels.length; i++) {
        let button = createButton(buttonLabels[i]);
        let buttonWidth = textWidth(buttonLabels[i]) + 20;
        button.position(positions[i].x, positions[i].y);
        button.size(buttonWidth, buttonHeight);
        button.style('border-radius', '10px');
        button.style('background-color', 'white');
        button.style('border', '2px solid black');
        button.style('font-family', 'Inconsolata');
        button.style('font-weight', 'bold');
        button.style('font-size', '16px');
        button.style('cursor', 'pointer');
        button.style('width', 'auto');
        button.style('padding', '10px 20px');

        if (buttonLabels[i] === 'CHI SIAMO') {
            button.style('background-color', 'black');
            button.style('color', 'white');
            button.style('border', '2px solid white');
        } else {
            button.style('background-color', 'white');
            button.style('color', 'black');
            button.style('border', '2px solid black');
        }
        
        button.mouseOver(() => {
            if (buttonLabels[i] === 'CHI SIAMO') {
                button.style('background-color', 'black');
                button.style('color', 'white');
                button.style('border', '2px solid white');
            } else {
                button.style('background-color', 'black');
                button.style('color', 'white');
                button.style('border', '2px solid white');
            }
        });
        button.mouseOut(() => {
            if (buttonLabels[i] === 'CHI SIAMO') {
                button.style('background-color', 'black');
                button.style('color', 'white');
                button.style('border', '2px solid white');
            } else {
                button.style('background-color', 'white');
                button.style('color', 'black');
                button.style('border', '2px solid black');
            }
        });
        button.mousePressed(() => {
            console.log(buttonLabels[i] + ' cliccato');
            if (buttonLabels[i] === 'COSA SONO') {
                window.location.href = '../cosasono/index.html';
            } else if (buttonLabels[i] === 'CHI SIAMO') {
                window.location.href = '../chisiamo/index.html';
            } else if (buttonLabels[i] === 'LEGGERE IL GRAFICO') {
                window.location.href = '../leggereilgrafico/index.html';
              } else if (buttonLabels[i] === 'GRAFICO') {
                window.location.href = '../notizie+vista generale/index.html';

              }
        });
    }
}

function draw() {
  background('#F2F2F2');
  textAlign(CENTER, CENTER);

  let time = millis() * 0.001;
  let floatAmplitude = 10;

  // Titolo
  textSize(23);
  stroke(0);
  fill(0);
  textFont(fontRubik);
  text('RIFIUTI SPAZIALI', 158, 52);
  strokeWeight(3);
  fill(255);
  textFont(fontRubik);
  text('RIFIUTI SPAZIALI', 160, 50);

  if (mouseX > 158 && mouseX < 300 && mouseY > 30 && mouseY < 70) {
    cursor(HAND);
    if (mouseIsPressed) {
      window.location.href = '../../index.html';
    }
  } else {
    cursor(ARROW);
  }

  textSize(57);
  strokeWeight(7);
  textLeading(57);
  stroke(0);
  fill(255);
  textFont(fontRubik);
  text('CIAO!', width / 2, 460);

  // Testo descrittivo
  textSize(16);
  textFont(fontInconsolata);
  textLeading(16);
  noStroke();
  fill(0);
  text(
    'Siamo studenti del Politecnico di Milano, del corso\ndi Laboratorio di Computer Grafica, Sezione C2,\ndel Secondo Anno di Design della Comunicazione.',
    width / 2,
    550
  );

  // Posizione della griglia
  let startX = (width - (3 * 340 + 2 * 50)) / 2; // Calcola l'allineamento centrale
  let startY = 1200; // Posizione iniziale Y
  let rectWidth = 340;
  let rectHeight = 550;
  let horizontalSpacing = 50; // Spaziatura orizzontale tra le card
  let verticalSpacing = 70; // Spaziatura verticale tra le righe

  let images = [imgale, imglara, imgjaco, imgsofi, imgele, imgfra];
  let labels = ['Alessandro\nBacci', 'Lara\nFrigeni', 'Jacopo\nLeonardi', 'Sofia\nRaimondo', 'Eleonora\nVilla', 'Francesco\nZanchetta'];
  let descriptions = [
    'Descrizione Ale',
    'Descrizione Lara',
    'Descrizione Jaco',
    'Descrizione Sofi',
    'Descrizione Ele',
    'Descrizione Fra',
  ];

  // Titolo per le card
  textSize(57);
  textFont(fontRubik);
  fill(255);
  stroke(0);
  strokeWeight(7);
  text('IL TEAM:', width / 2, startY - 80);

  // Disegna le card in una griglia 2x3
  for (let i = 0; i < images.length; i++) {
    let col = i % 3; // Colonna corrente (0, 1, 2)
    let row = Math.floor(i / 3); // Riga corrente (0 o 1)

    // Calcola la posizione X e Y della card
    let rectX = startX + col * (rectWidth + horizontalSpacing);
    let rectY = startY + row * (rectHeight + verticalSpacing);

    // Disegna il rettangolo della card
    fill('#F2F2F2');
    stroke(0);
    strokeWeight(2);
    rect(rectX, rectY, rectWidth, rectHeight, 10);

    // Disegna l'immagine
    image(
      images[i],
      rectX + (rectWidth - images[i].width * scaleFactor) / 2,
      rectY + 35,
      images[i].width * scaleFactor,
      images[i].height * scaleFactor
    );

    // Testo sopra l'immagine
    textSize(42);
    textAlign(CENTER);
    textFont(fontRubik);
    textLeading(42);
    fill(255);
    stroke(0);
    strokeWeight(5);
    text(labels[i], rectX + rectWidth / 2, rectY + images[i].height * scaleFactor + 100);

    // Descrizione sotto l'immagine
    textSize(16);
    textLeading(16);
    textFont(fontInconsolata);
    noStroke();
    fill(0);
    text(descriptions[i], rectX + rectWidth / 2, rectY + images[i].height * scaleFactor + 185);
  }

  // Aggiungi l'immagine del team sotto le card
  image(
    imgteamluna,
    width / 2 - imgteamluna.width * (scaleFactor * 1.3) / 2,
    startY + 2 * rectHeight + verticalSpacing + 60,
    imgteamluna.width * (scaleFactor * 1.3),
    imgteamluna.height * (scaleFactor * 1.3)
  );
}