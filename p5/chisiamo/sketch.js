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
    createCanvas(windowWidth, 2000); 
    let buttonPositions = [
        { x: width - 540, y: 30 },
        { x: width - 430, y: 30 },
        { x: width - 300, y: 30 },
        { x: width - 115, y: 30 }
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
        button.style('font-family', 'Inconsolata');
        button.style('font-weight', 'bold');

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
            }
        });
    }
}

function draw() {
  background('#F2F2F2'); 
  textAlign (CENTER, CENTER);

  // Variabili per il movimento delle immagini
  let time = millis() * 0.001; // Tempo per l'oscillazione
  let floatAmplitude = 10; // Ampiezza del movimento

  //immagini
//   image(imgHome1, 90 + cos(time) * floatAmplitude, 10 + sin(time) * floatAmplitude, imgHome1.width * scaleFactor, imgHome1.height * scaleFactor);
//   image(imgHome3, 410 + cos(time + 1) * floatAmplitude, 390 + sin(time + 1) * floatAmplitude, imgHome3.width * scaleFactor, imgHome3.height * scaleFactor);
//   image(imgHome2, 160 + cos(time + 2) * floatAmplitude, 490 + sin(time + 2) * floatAmplitude, imgHome2.width * scaleFactor, imgHome2.height * scaleFactor);
//   image(imgHome4, 510 + cos(time + 3) * floatAmplitude, 700 + sin(time + 3) * floatAmplitude, imgHome4.width * scaleFactor, imgHome4.height * scaleFactor);
//   image(imgHome5, 1110 + cos(time + 4) * floatAmplitude, 50 + sin(time + 4) * floatAmplitude, imgHome5.width * scaleFactor, imgHome5.height * scaleFactor);
//   image(imgHome6, 1400 + cos(time + 5) * floatAmplitude, 140 + sin(time + 5) * floatAmplitude, imgHome6.width * scaleFactor, imgHome6.height * scaleFactor);
//   image(imgHome7, 700 + cos(time + 6) * floatAmplitude, 140 + sin(time + 6) * floatAmplitude, imgHome7.width * scaleFactor, imgHome7.height * scaleFactor);
image(imgHomeastronauta, 1210 + cos(time + 7) * floatAmplitude, 350 + sin(time + 7) * floatAmplitude, imgHomeastronauta.width * 0.15, imgHomeastronauta.height * 0.15);
image(imgCosaastronauta, 210 + cos(time + 2) * floatAmplitude, 100 + sin(time + 2) * floatAmplitude, imgCosaastronauta.width * 0.15, imgCosaastronauta.height * 0.15);

  // titolo
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
      window.location.href = '../home/index.html';
    }
  } else {
    cursor(ARROW);
  }

  textSize (57)
  strokeWeight(7);
  textLeading(57); 
  stroke (0)
  fill(255); 
  textFont(fontRubik); 
  text('CIAO!', width / 2, 460);

  // testino
  textSize(14);
  textFont(fontInconsolata); 
  textLeading(14);
  noStroke ();
  fill (0);
  text('Siamo studenti del Politecnico di Milano, del corso\ndi Laboratorio di Computer Grafica, Sezione C2,\ndel Secondo Anno di Design della Comunicazione.', width / 2, 550); 

  // Variabili per la posizione dei rettangoli
  let rectX = 100; // Posizione iniziale X
  let rectY = 1200; // Aumentata la posizione Y per spostare le card più in basso
  let rectWidth = 340; // Aumentata la larghezza del rettangolo
  let rectHeight = 550; // Aumentata l'altezza del rettangolo
  let images = [imgale, imglara, imgjaco, imgsofi, imgele, imgfra];
  let labels = ['Alessandro\nBacci', 'Lara\nFrigeni', 'Jacopo\nLeonardi', 'Sofia\nRaimondo', 'Eleonora\nVilla', 'Francesco\nZanchetta'];
  let descriptions = [
    'Descrizione Ale',
    'Descrizione Lara',
    'Descrizione Jaco',
    'Descrizione Sofi',
    'Descrizione Ele',
    'Descrizione Fra'
  ];

  // Aggiungi il testo sopra le card
  textSize(57);
  textFont(fontRubik);
  fill(255); // Colore del testo
  stroke(0); // Colore del bordo
  strokeWeight(7);
  text('IL TEAM:', 235, rectY - 80); // Testo allineato a sinistra

  for (let i = 0; i < images.length; i++) {
    // Disegna il rettangolo
    fill('#F2F2F2');
    stroke(0);
    strokeWeight(2);
    rect(rectX, rectY, rectWidth, rectHeight, 10); // Angoli arrotondati

    // Disegna l'immagine
    image(images[i], rectX + (rectWidth - images[i].width * scaleFactor) / 2, rectY + 35, images[i].width * scaleFactor, images[i].height * scaleFactor);

    // Disegna il testo sopra l'immagine
    textSize(42);
    textAlign(CENTER);
    textFont(fontRubik); 
    textLeading(42);
    fill(255);
    stroke(0);
    strokeWeight(5);
    text(labels[i], rectX + rectWidth / 2, rectY + images[i].height * scaleFactor + 100);

    // Disegna la descrizione sotto il testo
    textSize(14);
    textLeading(14);
    textFont(fontInconsolata); 
    noStroke();
    fill(0);
    text(descriptions[i], rectX + rectWidth / 2, rectY + images[i].height * scaleFactor + 185);

    // Aggiorna la posizione X per il prossimo rettangolo
    rectX += rectWidth + 50; // Aumentato lo spazio tra i rettangoli
  }

  // Aggiungi l'immagine teamluna sotto le card
  image(imgteamluna, width / 2 - imgteamluna.width * (scaleFactor * 1.3) / 2 - 400, rectY + rectHeight + 60, imgteamluna.width * (scaleFactor * 1.3), imgteamluna.height * (scaleFactor * 1.3));
}