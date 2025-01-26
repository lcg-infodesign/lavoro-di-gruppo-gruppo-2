const scaleFactor = 0.1;

function preload() {
// caricamento font
  fontInconsolata = loadFont('../../fonts/Inconsolata.ttf'); 
  fontRubik = loadFont('../../fonts/RubikOne.ttf'); 

// caricamento immagini
  imgele = loadImage('../../img/ele.png');
  imglara = loadImage('../../img/lara.png');
  imgsofi = loadImage('../../img/sofi.png');
  imgjaco = loadImage('../../img/jaco.png');
  imgale = loadImage('../../img/ale.png');
  imgfra = loadImage('../../img/fra.png');
  imgteamluna = loadImage('../../img/teamluna.png');
  imgHomeastronauta = loadImage('../../img/homeastronauta.png');
  imgCosaastronauta = loadImage('../../img/cosaastronauta.png');
  imgtitolo = loadImage('../../img/titolo.png');
}

function setup() {
  createCanvas(windowWidth, 2600);

  let buttonPositions = [
    { x: width - 430, y: 30 },
    { x: width - 300, y: 30 },
    { x: width - 160, y: 30 }
  ];
  createButtons(buttonPositions);

// pulsanti fissi
  let buttons = selectAll('button');
  buttons.forEach(button => {
    button.style('position', 'fixed');
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

// pulsanti
function createButtons(positions) {
  let buttonHeight = 40;
  let buttonLabels = ['GRAFICO', 'COSA SONO', 'CHI SIAMO'];

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
      button.style('background-color', 'black');
      button.style('color', 'white');
      button.style('border', '2px solid white');
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
      } else if (buttonLabels[i] === 'GRAFICO') {
        window.location.href = '../notizie+vista generale/index.html';
      }
    });
  }
}

function draw() {
  background('#F2F2F2');
  textAlign(CENTER, CENTER);

// Variabili per oscillazione immagini
  let time = millis() * 0.001; // Tempo
  let floatAmplitude = 10; // Ampiezza

//immagini
  image(imgHomeastronauta, 1210 + cos(time + 2) * floatAmplitude, 350 + sin(time + 2) * floatAmplitude, imgHomeastronauta.width * 0.15, imgHomeastronauta.height * 0.15);
  image(imgCosaastronauta, 210 + cos(time + 7) * floatAmplitude, 150 + sin(time + 7) * floatAmplitude, imgCosaastronauta.width * 0.15, imgCosaastronauta.height * 0.15);
  image(imgteamluna, 110 + cos(time + 7) * floatAmplitude, 2390 + sin(time + 7) * floatAmplitude, imgteamluna.width * 0.15, imgteamluna.height * 0.15);

// titolo
  textSize(57);
  strokeWeight(7);
  stroke(0);
  fill(255);
  textFont(fontRubik);
  text('CIAO!', width / 2, 460);

// testino
  textSize(16);
  textFont(fontInconsolata);
  noStroke();
  fill(0);
  text(
    'Siamo studenti del Politecnico di Milano, del corso\ndi Laboratorio di Computer Grafica, Sezione C2,\ndel Secondo Anno di Design della Comunicazione.',
    width / 2,
    550
  );

// logo home
  image(imgtitolo, 10, 10, imgtitolo.width * 0.25, imgtitolo.height * 0.25);
  if (mouseX > 50 && mouseX < -30 + imgtitolo.width * 0.25 && mouseY > 30 && mouseY < 20 + imgtitolo.height * 0.25) {
    cursor(HAND);
    if (mouseIsPressed) {
      window.location.href = '../../index.html';
    }
  } else {
    cursor(ARROW);
  }


// griglia card noi
  let startX = (width - (3 * 340 + 2 * 50)) / 2; 
  let startY = 1200; 
  let rectWidth = 340;
  let rectHeight = 540;
  let horizontalSpacing = 50; 
  let verticalSpacing = 70; 

  let images = [imgale, imglara, imgjaco, imgsofi, imgele, imgfra];
  let labels = ['Alessandro\nBacci', 'Lara\nFrigeni', 'Jacopo\nLeonardi', 'Sofia\nRaimondo', 'Eleonora\nVilla', 'Francesco\nZanchetta'];
  let descriptions = [
    'codice grafico paese',
    'grafica\nstruttura del sito\nillustrazioni\ncodice pagine accessorie',
    'codice grafico paese',
    'ricerche database',
    'ricerca notizie\ncodice grafico generale',
    'codice grafico generale',
  ];

  textSize(57);
  textFont(fontRubik);
  fill(255);
  stroke(0);
  strokeWeight(7);
  text('IL TEAM:', width / 2, startY - 80);

  for (let i = 0; i < images.length; i++) {
    let col = i % 3; 
    let row = Math.floor(i / 3); 

    let rectX = startX + col * (rectWidth + horizontalSpacing);
    let rectY = startY + row * (rectHeight + verticalSpacing);

    fill('#F2F2F2');
    stroke(0);
    strokeWeight(2);
    rect(rectX, rectY, rectWidth, rectHeight, 10);

    image(
      images[i],
      rectX + (rectWidth - images[i].width * scaleFactor) / 2,
      rectY + 35,
      images[i].width * scaleFactor,
      images[i].height * scaleFactor
    );

    textSize(42);
    textAlign(CENTER);
    textFont(fontRubik);
    fill(255);
    stroke(0);
    strokeWeight(5);
    text(labels[i], rectX + rectWidth / 2, rectY + images[i].height * scaleFactor + 100);

    textSize(16);
    textFont(fontInconsolata);
    noStroke();
    fill(0);
    text(descriptions[i], rectX + rectWidth / 2, rectY + images[i].height * scaleFactor + 200);
  }
}
