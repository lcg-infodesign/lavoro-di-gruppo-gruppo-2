let fontInconsolata;
let fontRubik;
let fontsLoaded = false;
let imgHome1;
let imgHome3;
let imgHome2, imgHome4, imgHome5;
const scaleFactor = 0.13;

function preload() {
  fontInconsolata = loadFont('../../fonts/Inconsolata.ttf'); 
  fontRubik = loadFont('../../fonts/RubikOne.ttf'); 
imgLeggere1 = loadImage('../../img/leggere1.png');
//   imgHome3 = loadImage('../../img/home3.png');
//   imgHome2 = loadImage('../../img/home2.png');
//   imgHome4 = loadImage('../../img/home4.png');
//   imgHome5 = loadImage('../../img/home5.png');
//   imgHome6 = loadImage('../../img/home6.png');
//   imgHome7 = loadImage('../../img/home7.png');
//   imgHomeastronauta = loadImage('../../img/homeastronauta.png');
imgHome2 = loadImage('../../img/home2.png');
imgHome3 = loadImage('../../img/home3.png');
imgHome4 = loadImage('../../img/home4.png');
imgHome5 = loadImage('../../img/home5.png');
imgleggereterra = loadImage('../../img/leggereterra.png');
imgleggerefreccia = loadImage('../../img/leggerefreccia.png');
imgcosa5 = loadImage('../../img/cosa5.png');
}

function setup() {
    createCanvas(windowWidth, 2100); 
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

        if (buttonLabels[i] === 'LEGGERE IL GRAFICO') {
            button.style('background-color', 'black');
            button.style('color', 'white');
            button.style('border', '2px solid white');
        } else {
            button.style('background-color', 'white');
            button.style('color', 'black');
            button.style('border', '2px solid black');
        }
        
        button.mouseOver(() => {
            if (buttonLabels[i] === 'LEGGERE IL GRAFICO') {
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
            if (buttonLabels[i] === 'LEGGERE IL GRAFICO') {
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
image(imgLeggere1, 100 + cos(time) * floatAmplitude, 300 + sin(time) * floatAmplitude, imgLeggere1.width * scaleFactor, imgLeggere1.height * scaleFactor);
//   image(imgHome3, 410 + cos(time + 1) * floatAmplitude, 390 + sin(time + 1) * floatAmplitude, imgHome3.width * scaleFactor, imgHome3.height * scaleFactor);
//   image(imgHome2, 160 + cos(time + 2) * floatAmplitude, 490 + sin(time + 2) * floatAmplitude, imgHome2.width * scaleFactor, imgHome2.height * scaleFactor);
//   image(imgHome4, 510 + cos(time + 3) * floatAmplitude, 700 + sin(time + 3) * floatAmplitude, imgHome4.width * scaleFactor, imgHome4.height * scaleFactor);
//   image(imgHome5, 1110 + cos(time + 4) * floatAmplitude, 50 + sin(time + 4) * floatAmplitude, imgHome5.width * scaleFactor, imgHome5.height * scaleFactor);
//   image(imgHome6, 1400 + cos(time + 5) * floatAmplitude, 140 + sin(time + 5) * floatAmplitude, imgHome6.width * scaleFactor, imgHome6.height * scaleFactor);
//   image(imgHome7, 700 + cos(time + 6) * floatAmplitude, 140 + sin(time + 6) * floatAmplitude, imgHome7.width * scaleFactor, imgHome7.height * scaleFactor);
//   image(imgHomeastronauta, 1210 + cos(time + 7) * floatAmplitude, 350 + sin(time + 7) * floatAmplitude, imgHomeastronauta.width * scaleFactor, imgHomeastronauta.height * scaleFactor);

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
  
  // paragrafo1
  textSize (57)
  strokeWeight(7);
  textLeading(57); 
  stroke (0)
  fill(255); 
  textFont(fontRubik); 
  text('DA DOVE VENGONO\nI DATI?', width / 2, 450);
  text('QUALI DATI\nSONO RAPPRESENTATI?', width / 2, 1050 ); 

  textSize(14);
  textFont(fontInconsolata); 
  textLeading(14);
  noStroke ();
  fill (0);
  text('Il dataset di riferimento è fornito da una API di Space-Track.org basato\nsui dati del United States Space Surveillance Network che rileva,\ntraccia, cataloga e identifica oggetti artificial\nin orbita attorno alla Terra.', width / 2, 580); 

  // Disegna 6 rettangoli bianchi con bordo nero e angoli arrotondati
  let rects = [
    { x: 275, y: 1228, width: 306, height: 136 },
    { x: 623, y: 1228, width: 632, height: 400 },
    { x: 1297, y: 1228, width: 143, height: 569 },
    { x: 275, y: 1398, width: 306, height: 620 },
    { x: 623, y: 1670, width: 632, height: 127 },
    { x: 623, y: 1836, width: 815, height: 182 }
  ];

  for (let i = 0; i < rects.length; i++) {
    let r = rects[i];
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(r.x, r.y, r.width, r.height, 10); // angoli arrotondati

    // Testo con font Rubik
    textSize(22);
    textAlign(LEFT);
    noStroke();
    textLeading(22);
    fill(0);
    textFont(fontRubik);
    const rubikTexts = [
        'ID',
        'TIPOLOGIA',
        'PAESE',
        'FORZA SEGNALE\nRADAR',
        'ANNO',
        'PERIGEO'
    ];
    text(rubikTexts[i], r.x + 30, r.y + 30);
    
    textLeading(14);
    
    // Aggiungi i nuovi testi nel rettangolo 2
    if (i === 1) { // Controlla se siamo nel secondo rettangolo
        // Draw images behind the texts
        image(imgHome5, r.x + 50 , r.y + 130 + sin(time + 6) * floatAmplitude, imgHome5.width * 0.1, imgHome5.height * 0.1); 
        image(imgHome3, r.x + 200, r.y + 140 + sin(time + 5) * floatAmplitude, imgHome3.width * 0.15, imgHome3.height * 0.15);
        image(imgHome4, r.x + 330, r.y + 120 + sin(time + 3) * floatAmplitude, imgHome4.width * 0.08, imgHome4.height * 0.08);
        image(imgHome2, r.x + 520, r.y + 140 + sin(time + 4) * floatAmplitude, imgHome2.width * 0.08, imgHome2.height * 0.08);
//   image(imgHome3, 410 + cos(time + 1) * floatAmplitude, 390 + sin(time + 1) * floatAmplitude, imgHome3.width * scaleFactor, imgHome3.height * scaleFactor);

textSize(22);
        stroke(0); // Bordo nero
        strokeWeight (3)
        fill(255); // Testo bianco
        text('payload', r.x + 50, r.y + 180);
        text('detrito', r.x + 200, r.y + 180);
        text('rocket body', r.x + 330, r.y + 180);
        text('tba', r.x + 520, r.y + 180);
        
        textSize(14); 
        fill(0); 
        noStroke ()
        textFont(fontInconsolata);
        text('elementi del\nveicolo spaziale\nspecificamente\ndedicati alla\nproduzione di\ndati di missione\nealla successiva\ntrasmissione di\ntali dati\nalla Terra.', r.x + 40, r.y + 305);
        text('scaglie di\nvernici, polveri,\nmaterialeespulso\ndai motori dei\nrazzi, liquido\nrefrigerante ed\naltre piccole\nparticelle.', r.x + 190, r.y + 290);
        text('struttura che\nrimane in orbita\ndopo aver\ncompletato il\nsuo compito\ndi trasportare il\npayload nello spazio.', r.x + 340, r.y + 280);
        text('oggetto non\nidentificato.', r.x + 510, r.y + 245);
    } else if (i === 2) { // Controlla se siamo nel rettangolo "PAESE"
        stroke(0); // Bordo nero
        strokeWeight(5);
        fill(255); // Cerchio bianco
        ellipse(r.x + 71, r.y + 308, 90, 90); // Cerchio dietro al numero "99"
        
        stroke(0); // Bordo nero
        strokeWeight(2);
        fill(255); // Cerchio bianco
        ellipse(r.x + 73, r.y + 305, 90, 90); // Cerchio dietro al numero "99"
        
        textSize(44); // Aumenta la dimensione del testo
        noStroke(); // Assicurati che non ci sia bordo
        fill(0); // Colore del testo nero
        textFont(fontRubik);
        text('99', r.x + 40, r.y + 300); // Sposta il testo più in basso
    } else if (i === 3) { // Controlla se siamo nel rettangolo "FORZA SEGNALE RADAR"
        // Aggiungi i nuovi testi "piccola", "media", "grande"
        textSize(22); // Dimensione del testo
        fill(255); // Testo bianco
        stroke(0); // Bordo nero
        strokeWeight(3); // Spessore del bordo
        textAlign(CENTER); // Allinea il testo al centro
        text('piccola', r.x + r.width / 2, r.y + 275); // Testo "piccola"
        text('media', r.x + r.width / 2, r.y + 385); // Testo "media"
        text('grande', r.x + r.width / 2, r.y + 495); // Testo "grande"
        
        // Aggiungi cerchi neri centrati rispetto al rettangolo
        fill(0); // Colore nero per i cerchi
        ellipse(r.x + r.width / 2, r.y + 320, 12, 12); // Cerchio sotto "piccola"
        ellipse(r.x + r.width / 2, r.y + 440, 17, 17); // Cerchio sotto "media"
        ellipse(r.x + r.width / 2, r.y + 545, 22, 22); // Cerchio sotto "grande"
        textAlign(LEFT); // Ripristina l'allineamento a sinistra per il testo Inconsolata
    } else if (i === 5) { // Controlla se siamo nel rettangolo "PERIGEO"
        // Aggiungi ellisse bianca con bordo nero
        fill(255); // Colore bianco per l'ellisse
        stroke(0); // Bordo nero
        strokeWeight(2); // Spessore del bordo
        ellipse(r.x + r.width - 240, r.y + r.height / 2, 220, 110); // Disegna l'ellisse sul lato destro
        
        // Aggiungi l'immagine leggereterra al centro dell'ellisse
        image(imgleggereterra, r.x + r.width - 270 - imgleggereterra.width * 0.1 / 2, r.y + r.height / 2 - imgleggereterra.height * 0.1 / 2, imgleggereterra.width * 0.1, imgleggereterra.height * 0.1); // Modifica le dimensioni per mantenere le proporzioni
        fill(0); // Colore nero per il cerchio
        ellipse(r.x + r.width - 350, r.y + r.height / 2 , 20, 20); // Disegna un cerchio nero

        // Aggiungi la rotazione per l'immagine leggerfreccia
        push(); // Salva lo stato corrente
        translate(r.x + r.width / 2, r.y + r.height / 2); // Trasla al centro dell'ellisse
       rotate(radians(50)); // Ruota di 30 gradi in senso orario
        image(imgleggerefreccia, -imgleggerefreccia.width * 0.1 / 2 - 90, -imgleggerefreccia.height * 0.1 / 2, imgleggerefreccia.width * 0.18, imgleggerefreccia.height * 0.18); // Modifica le dimensioni per mantenere le proporzioni
        pop(); // Ripristina lo stato precedente
        
        // Aggiungi la linea nera tra leggereterra e cosa5
        stroke(0); // Imposta il colore della linea a nero
        strokeWeight(2); // Spessore della linea
        line(r.x + r.width - 295, r.y + r.height / 2, r.x + r.width - 330, r.y + r.height / 2); // Disegna la linea

        // Aggiungi linee verticali nere
        line(r.x + r.width - 295, r.y + r.height / 2 - 5, r.x + r.width - 295, r.y + r.height / 2 + 5); // Linea verticale sinistra
        line(r.x + r.width - 330, r.y + r.height / 2 - 5, r.x + r.width - 330, r.y + r.height / 2 + 5); // Linea verticale destra
    }

    // Testo con font Inconsolata
    textSize(14);
    noStroke();
    fill(0);
    textFont(fontInconsolata);
    const inconsolataTexts = [
        'indica il codice di riferimento\ndel detrito.',
        'indica la tipologia di detrito.',
        'responsabile\ndel lancio.',
        'indica quanto il detrito\nè rilevabile dai radar, maggiore\nè la forza radar, più l’oggetto\nè rilevabile. Per oggetti con debole\nforza radar, il rischio\ndi collisione è maggiore, in quanto\ndifficilmente rilevabili.',
        'indica l’anno in cui l’oggetto al quale apparteneva il detrito è stato lanciato\nnello spazio. Vanno dal 1960 al 2021.',
        'è il punto di massima vicinanza\ndel detrito alla Terra, mentre orbita\nintorno ad essa.'
    ];
    text(inconsolataTexts[i], r.x + 30, r.y + 80);
  }
}
