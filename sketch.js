let fontInconsolata;
let fontRubik;
let fontsLoaded = false;
let imgHome1;
let imgHome3;
const scaleFactor = 0.13;

function preload() {
  fontInconsolata = loadFont('fonts/Inconsolata.ttf'); 
  fontRubik = loadFont('fonts/RubikOne.ttf'); 
  imgHome1 = loadImage('img/home1.png');
  imgHome3 = loadImage('img/home3.png');
  imgHome2 = loadImage('img/home2.png');
  imgHome4 = loadImage('img/home4.png');
  imgHome5 = loadImage('img/home5.png');
  imgHome6 = loadImage('img/home6.png');
  imgHome7 = loadImage('img/home7.png');
  imgHomeastronauta = loadImage('img/homeastronauta.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight); 
    let buttonPositions = [
        { x: width - 630, y: 30 },
        { x: width - 510, y: 30 },
        { x: width - 370, y: 30 },
        { x: width - 160, y: 30 }
    ];
    createButtons(buttonPositions);
    
    // Creazione del pulsante "ESPLORA I DATI" spostata qui
    let exploreButton = createButton('ESPLORA I DATI');
    exploreButton.position(width / 2 - 90, height / 2 + 190);
    exploreButton.size(150, 60);
    exploreButton.style('border-radius', '10px');
    exploreButton.style('background-color', 'black');
    exploreButton.style('color', 'white');
    exploreButton.style('border', '2px solid black');
    exploreButton.style('font-family', 'Inconsolata');
    exploreButton.style('font-weight', 'bold');
    exploreButton.style('font-size', '16px');
    exploreButton.style('cursor', 'pointer');

    exploreButton.mouseOver(() => {
        exploreButton.style('background-color', 'white');
        exploreButton.style('color', 'black');
        exploreButton.style('border', '2px solid black');
    });
    exploreButton.mouseOut(() => {
        exploreButton.style('background-color', 'black');
        exploreButton.style('color', 'white');
        exploreButton.style('border', '2px solid black');
    });

    exploreButton.mousePressed(() => {
        window.location.href = 'p5/notizie+vista generale/index.html';
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
        
        button.mouseOver(() => {
            button.style('background-color', 'black');
            button.style('color', 'white');
            button.style('border', '2px solid white');
        });
        button.mouseOut(() => {
            button.style('background-color', 'white');
            button.style('color', 'black');
            button.style('border', '2px solid black');
        });

        button.mousePressed(() => {
            console.log(buttonLabels[i] + ' cliccato');
            if (buttonLabels[i] === 'COSA SONO') {
                window.location.href = 'p5/cosasono/index.html';
            } else if (buttonLabels[i] === 'CHI SIAMO') {
                window.location.href = 'p5/chisiamo/index.html';
            } else if (buttonLabels[i] === 'LEGGERE IL GRAFICO') {
                window.location.href = 'p5/leggereilgrafico/index.html';
            } else if (buttonLabels[i] === 'GRAFICO') {
                window.location.href = 'p5/notizie+vista generale/index.html';
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
  image(imgHome1, 90 + cos(time) * floatAmplitude, 10 + sin(time) * floatAmplitude, imgHome1.width * scaleFactor, imgHome1.height * scaleFactor);
  image(imgHome3, 410 + cos(time + 1) * floatAmplitude, 390 + sin(time + 1) * floatAmplitude, imgHome3.width * scaleFactor, imgHome3.height * scaleFactor);
  image(imgHome2, 160 + cos(time + 2) * floatAmplitude, 490 + sin(time + 2) * floatAmplitude, imgHome2.width * scaleFactor, imgHome2.height * scaleFactor);
  image(imgHome4, 510 + cos(time + 3) * floatAmplitude, 700 + sin(time + 3) * floatAmplitude, imgHome4.width * scaleFactor, imgHome4.height * scaleFactor);
  image(imgHome5, 1110 + cos(time + 4) * floatAmplitude, 50 + sin(time + 4) * floatAmplitude, imgHome5.width * scaleFactor, imgHome5.height * scaleFactor);
  image(imgHome6, 1400 + cos(time + 5) * floatAmplitude, 140 + sin(time + 5) * floatAmplitude, imgHome6.width * scaleFactor, imgHome6.height * scaleFactor);
  image(imgHome7, 700 + cos(time + 6) * floatAmplitude, 140 + sin(time + 6) * floatAmplitude, imgHome7.width * scaleFactor, imgHome7.height * scaleFactor);
  image(imgHomeastronauta, 1210 + cos(time + 7) * floatAmplitude, 350 + sin(time + 7) * floatAmplitude, imgHomeastronauta.width * scaleFactor, imgHomeastronauta.height * scaleFactor);

  // titolo
  textSize(113); 
  textLeading(95);
  stroke(0); 
  fill(0); 
  textFont(fontRubik); 
  text('RIFIUTI\nSPAZIALI', width / 2 - 10, height / 2 -30); 
  strokeWeight(7); 
  fill(255); 
  textFont(fontRubik); 
  text('RIFIUTI\nSPAZIALI', width / 2, height / 2 -40); 
  
  // testino
  textSize(16);
  textFont(fontInconsolata); 
  textLeading(16);
  noStroke ();
  fill (0);
  text('Da quando noi umani abbiamo iniziato a esplorare lo spazio,\nabbiamo anche creato un pò di confusione...', width / 2, height / 2 + 130); 
}