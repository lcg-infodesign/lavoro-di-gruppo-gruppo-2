let fumoImg; // Variabile globale per l'immagine del fumo
let fumoAspectRatio = 1; // Rapporto larghezza/altezza delle nuvolette
let numFumo = 40; // Numero massimo di nuvolette di fumo
let slider;

let selectedYear = 1960;
const dotOffset = 40; // Offset per creare un anello vuoto attorno al cerchio centrale
let notizieTable;
let notiziaCorrente = null;

//IMAGES
let rocketImg;
let rocketWidth;
let rocketHeight = 40; // Aumentato da 30 a 50 per un razzo più grande
let terraImg;

//FONTS
let fontInconsolata;
let fontRubik;
let rotationAngle = 0;

//ARRAYS
let cardPositions = []; // Array per tenere traccia delle posizioni delle carte
let cardTargets = [];  // Array per le posizioni target
let immaginiNotizie = {};
let points = [];
let countryCodes = []; // Array per i codici paese
let countryEventCount = {}; // Conta gli eventi per ciascun paese
let sectors = []; // Associa i codici paese ai settori
let fumoData = []; // Array per memorizzare le proprietà fisse delle nuvolette

//ANIMATION
let autoScrollProgress = 0; // Variabile che traccia il progresso (0 a 1)
let AUTO_SCROLL_DURATION = 5000; // Durata totale in millisecondi
let lastUpdateTime = 0;
let ANIMATION_SPEED = 0.075; // Rallentato del 50% rispetto a 0.15

let autoScroll = true; // Variabile per abilitare lo scorrimento automatico
let autoScrollSpeed = 0.5; // Rallentato del 50% rispetto a 1
let autoScrollCompleted = false; // Variabile per indicare se l'auto-scroll è completato

let sectorHighlightProgress = 0; // Variabile per tracciare il progresso dell'evidenziazione dei settori

//SOUND
let sound;
let toggleButton; // Variable for the button
let isPlaying = false; // Tracks the audio state


function preload() {
  //LOAD FONTS
  fontRubik = loadFont('../../fonts/RubikOne.ttf');
  fontInconsolata = loadFont('../../fonts/Inconsolata.ttf');

  //LOAD NEWS IMAGES
  imgn1 = loadImage('../../img/n1.png');
  imgn2 = loadImage('../../img/n2.png');
  imgn3 = loadImage('../../img/n3.png');
  imgn4 = loadImage('../../img/n4.png');
  imgn5 = loadImage('../../img/n5.png');
  imgn6 = loadImage('../../img/n6.png');
  imgn7 = loadImage('../../img/n7.png');
  imgn8 = loadImage('../../img/n8.png');
  imgn9 = loadImage('../../img/n9.png');
  imgn10 = loadImage('../../img/n10.png');
  imgn11 = loadImage('../../img/n11.png');
  imgn12 = loadImage('../../img/n12.png');
  imgn13 = loadImage('../../img/n13.png');
  imgn14 = loadImage('../../img/n14.png');
  imgn15 = loadImage('../../img/n15.png');
  imgn16 = loadImage('../../img/n16.png');
  imgn17 = loadImage('../../img/n17.png');
  imgn18 = loadImage('../../img/payload.png');
  imgn19 = loadImage('../../img/tbi.png');
  imgn20 = loadImage('../../img/rocket body.png');
  imgn21 = loadImage('../../img/debris.png');

  //LOAD SPECIFIC IMAGES
  imgtitolo = loadImage('../../img/titolo.png');
  imgperigeo = loadImage('../../img/perigeo2.png');

  //LOAD ROCKET IMAGE
  rocketImg = loadImage('../../img/razzino.png', img => {
    let ratio = img.width / img.height;
    rocketWidth = rocketHeight * ratio;
  });

  //LOAD TERRA IMAGE
  terraImg = loadImage('../../img/marenero.png');

  //LOAD SMOKE IMAGE
  fumoImg = loadImage("../../img/fumo.png", () => {
    fumoAspectRatio = fumoImg.width / fumoImg.height;
  });

  //LOAD CSV DATA
  table = loadTable("../../space_decay.csv", "header");
  notizieTable = loadTable("../../notizie.csv", "header");

  //LOAD SOUND
  sound = loadSound('../../space.mp3');
}


function loadCountryCodes() {
  // Verifica se la tabella è stata caricata correttamente
  if (table.getRowCount() > 0) {
    // Estrai i codici paese dalla colonna COUNTRY_CODE
    countryCodes = table.getColumn("COUNTRY_CODE");

    // Rimuovi eventuali duplicati
    countryCodes = [...new Set(countryCodes)];

    // Conta gli eventi per ciascun paese
    countCountryEvents();

    console.log(`Codici paese caricati: ${countryCodes.length}`);
  } else {
    console.error("Errore nel caricamento del CSV. Controlla il file.");
  }
}

function countCountryEvents() {
  // Conta il numero di eventi per ciascun paese
  for (let row of table.rows) {
    let countryCode = row.get("COUNTRY_CODE");
    if (countryEventCount[countryCode]) {
      countryEventCount[countryCode]++;
    } else {
      countryEventCount[countryCode] = 1;
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textFont(fontInconsolata);
  textAlign(CENTER, CENTER);

  // Posizioni pulsanti nella navbar
  let buttonPositions = [
    { x: width - 430, y: 30 },
    { x: width - 300, y: 30 },
    { x: width - 160, y: 30 }
  ];

  //CREATE TOP NAVBAR BUTTONS
  createButtons(buttonPositions);

  // Rendi i pulsanti fissi per il ridimensionamento
  let buttons = selectAll('button');
  buttons.forEach(button => {
    button.style('position', 'fixed');
  });

  //SLIDER SETUP
  slider = createSlider(1960, 2020, 1960, 1);
  slider.position((width - slider.width) / 2, height - 60);
  slider.style('width', '700px');
  slider.style('opacity', '0');

  //PLAY SOUND BUTTON SETUP
  toggleButton = createButton('Play Sound');
  toggleButton.style('position', 'fixed');
  toggleButton.position(40, windowHeight - 55);
  toggleButton.mousePressed(toggleAudio);
  sound.setVolume(0.2);
  styleButton(toggleButton);

  //SETUP OTHER FUNCTIONS
  loadCountryCodes();
  generateSectors();
  generateDots();
  precalculateFumo();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Update the play sound button position on window resize
  toggleButton.position(40, windowHeight - 55);
  // Regenerate dots with new center position
  generateDots();
  // Redraw the canvas
  redraw();
}

//PLAY SOUND BUTTON STYLE
function styleButton(button) {
  button.style('font-family', 'Inconsolata'); // Use Inconsolata font
  button.style('font-size', '12px');
  button.style('padding', '5px 10px');
  button.style('border', '2px solid black'); // Black border
  button.style('border-radius', '8px'); // Rounded corners
  button.style('background-color', 'white'); // White background
  button.style('color', 'black'); // Black text
  button.style('cursor', 'pointer'); // Pointer cursor
  button.style('text-align', 'center');
}

// Function to toggle audio
function toggleAudio() {
  if (isPlaying) {
    sound.stop();
    toggleButton.html('Play Sound'); // Update to play icon
    isPlaying = false;
  } else {
    sound.play();
    toggleButton.html('Stop Sound'); // Update to stop icon
    isPlaying = true;
  }
}

//TOP NAVBAR BUTTONS
function createButtons(positions) {
  let buttonWidth = 100;
  let buttonHeight = 40;
  let buttonSpacing = 10;
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

      if (buttonLabels[i] === 'GRAFICO') {
          button.style('background-color', 'black');
          button.style('color', 'white');
          button.style('border', '2px solid white');
      } else {
          button.style('background-color', 'white');
          button.style('color', 'black');
          button.style('border', '2px solid black');
      }
      
      button.mouseOver(() => {
          if (buttonLabels[i] === 'GRAFICO') {
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
          if (buttonLabels[i] === 'GRAFICO') {
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
  background(240);

  //INFO BOX SETUP
  fill(255); // Colore bianco
  stroke(0); // Bordo nero
  strokeWeight(2); // Spessore del bordo
  let boxWidth = 300; // Larghezza del riquadro
  let boxHeight = 120; // Altezza di ciascun rettangolo
  let firstBoxHeight = boxHeight * (2 / 3); // Altezza del primo rettangolo a 2/3
  let secondBoxHeight = boxHeight * (4 / 3) + 20; // Aumentato di 20 pixel
  let cornerRadius = 10; // Raggio degli angoli arrotondati
  let spacing = 15; // Spazio tra i rettangoli
  let totalHeight = firstBoxHeight + secondBoxHeight + boxHeight * 2 + spacing * 4; // Altezza totale per 4 rettangoli e spazi
  let startY = (height - totalHeight) / 2; // Posizione Y iniziale per centrare

  // Disegna il primo rettangolo con altezza ridotta
  rect(40, startY, boxWidth, firstBoxHeight, cornerRadius); 

  // Disegna il secondo rettangolo con altezza aumentata
  rect(40, startY + firstBoxHeight + spacing, boxWidth, secondBoxHeight, cornerRadius);

  // Disegna i restanti 2 rettangoli mantenendo la stessa distanza
  for (let i = 2; i < 3; i++) {
    rect(40, startY + firstBoxHeight + secondBoxHeight + spacing * 2 + (i - 2) * (boxHeight + spacing), boxWidth, boxHeight, cornerRadius);
  }
  // Modifica l'altezza del quarto rettangolo
  rect(40, startY + firstBoxHeight + secondBoxHeight + spacing * 2 + (3 - 2) * (boxHeight + spacing), boxWidth, boxHeight * 0.9, cornerRadius); // Ridotto a 90% dell'altezza originale

  //TITLE HOME BUTTON
  image(imgtitolo, 10, 10, imgtitolo.width * 0.25, imgtitolo.height * 0.25);
  if (mouseX > 50 && mouseX < -30 + imgtitolo.width * 0.25 && mouseY > 30 && mouseY < 20 + imgtitolo.height * 0.25) {
    cursor(HAND);
    if (mouseIsPressed) {
      window.location.href = '../../index.html';
    }
  } else {
    cursor(ARROW);
  }

  
  
  //SLIDER TIMELINE DRAW
  drawSliderTimeline();
  drawHighlightedSector();
  drawCircleWithRays();
  drawDots();
  drawNewsBox();

  
  // Aggiungi il nuovo contenuto all'interno del rettangolo bianco
  textFont(fontRubik);
  textSize(22);

  fill(255);
  noStroke(); // Assicurati che non ci sia contorno
  textAlign(LEFT); // Allinea il testo a sinistra
  
  
  noStroke(); // Assicurati che non ci sia contorno per il testo successivo
  fill(0); // Colore del testo nero
  textSize(18);
  text('RIFIUTO SPAZIALE', 56, (height - boxHeight) / 2 -193); // Spostato in basso

  // Rettangolo (come placeholder)
  fill(0);
  ellipse(56 + 15, (height - boxHeight) / 2 - 160, 10, 10); // Spostato in basso

  // Stile per il testo descrittivo
  textFont(fontRubik);
  textSize(18);
  fill(0);
  noStroke(); // Assicurati che non ci sia contorno
  text('PERIGEO', 56, (height - boxHeight) / 2 - 100); // Spostato in basso

  image(imgperigeo, 56, (height - boxHeight) / 2 -50, imgperigeo.width * 0.17, imgperigeo.height * 0.17);

  textFont(fontInconsolata);
  textSize(14);
  fill(0);
  noStroke(); // Assicurati che non ci sia contorno
  text('DISTANZA DALLA TERRA', 56, (height - boxHeight) / 2 - 72 ); // Spostato in basso

  textFont(fontInconsolata);
  textSize(12);
  fill(0);
  noStroke(); // Assicurati che non ci sia contorno
  text(
    'Il punto di massima vicinanza del detrito\nalla terra, mentre orbita intorno ad essa',
    56,
    (height - boxHeight) / 2 + 25  // Spostato in basso
  );

  textFont(fontRubik);
  textSize(18);
  fill(0);
  noStroke(); // Assicurati che non ci sia contorno
  text('ANNO', 56, (height - boxHeight) / 2 + 78 + 17); // Spostato in basso

  textFont(fontInconsolata);
  textSize(24); // Dimensione del testo per "0000"
  fill(0);
  noStroke(); // Assicurati che non ci sia contorno
  text('0000', 56, (height - boxHeight) / 2 + 122); // Spostato in basso

  textFont(fontInconsolata);
  textSize(12);
  fill(0);
  noStroke(); // Assicurati che non ci sia contorno
  text(
    "L'anno in cui l'oggetto è stato lanciato\nnello spazio. Dal 1960 al 2021",
    56,
    (height - boxHeight) / 2 + 162  // Spostato in basso
  );

  textFont(fontRubik);
  textSize(18);
  fill(0);
  noStroke(); // Assicurati che non ci sia contorno
  text('PAESE', 56, (height - boxHeight) / 2 + 228); // Spostato a destra

  fill(192); // Colore grigio
  arc(66 + 20, (height - boxHeight) / 2 + 255, 350, 255, 0, PI + QUARTER_PI); // Spostato a destra

  // Nuovo testo aggiunto sotto l'ultimo rettangolo nero
  textFont(fontInconsolata);
  textSize(12);
  fill(0);
  noStroke(); // Assicurati che non ci sia contorno
  text('Il paese responsabile del lancio del detrito', 56, (height - boxHeight) / 2 + 289); // Spostato a destra
}



function precalculateFumo() {
  let startX = (width - 700) / 2;
  let endX = startX + 700;
  let step = (endX - startX) / numFumo;

  for (let i = 0; i < numFumo; i++) {
    let x = startX + i * step; // Posizione lungo lo slider
    let randomScale = random(0.8, 1.3); // Scala casuale tra 80% e 120%
    let randomRotation = random(-30, 30); // Rotazione casuale tra -15° e 15°
    let randomOffsetY = random(-5, 5); // Traslazione verticale casuale

    fumoData.push({ x, scale: randomScale, rotation: randomRotation, offsetY: randomOffsetY });
  }
}

function drawSliderTimeline() {
  // Mostra l'anno selezionato sopra lo slider
  stroke(0);
  strokeWeight(0);
  fill(0);
  textFont(fontInconsolata); // Font per l'anno
  textSize(20);
  text(selectedYear, width / 2, height - 100);

  // Disegna le etichette degli anni estremi
  noStroke();
  fill(0);
  textFont(fontInconsolata);
  textSize(14);
  text('1960', (width - 700) / 2 - 60, height - 57); // Etichetta 1960
  text('2020', (width + 700) / 2 + 40, height - 57); // Etichetta 2020

  // Disegna la linea principale dello slider solo a destra del cursore
  stroke(192); // Colore grigio
  strokeWeight(2); // Spessore della linea
  let startX = (width - 700) / 2;
  let endX = startX + 700;
  let passedX = map(selectedYear, 1960, 2020, startX, endX); // Posizione massima del cursore
  line(passedX, height - 55, endX, height - 55); // Linea a destra del cursore

  // Disegna i pallini di delimitazione
  fill(0); // Colore nero
  ellipse(startX, height - 55, 10, 10); // Pallino sinistro
  ellipse(endX, height - 55, 10, 10); // Pallino destro

  // Disegna le nuvolette di fumo, solo dove il cursore è passato
  for (let fumo of fumoData) {
    if (fumo.x <= passedX) {
      push();
      translate(fumo.x, height - 60 + fumo.offsetY); // Posiziona il fumo con offset
      rotate(radians(fumo.rotation)); // Applica la rotazione casuale
      imageMode(CENTER); // Cambia il punto di riferimento dell'immagine
      image(fumoImg, 0, 0, 25 * fumo.scale, (25 / fumoAspectRatio) * fumo.scale); // Ridotto da 30 a 25
      pop();
    }
  }

  //SLIDER ANIMATION SETUP
  if (autoScroll && !autoScrollCompleted) {
    // Incrementa il progresso temporale
    autoScrollProgress += deltaTime / AUTO_SCROLL_DURATION;

    // Applica easing-out per un rallentamento fluido verso la fine
    let easedProgress = easeOutQuad(autoScrollProgress);

    // Calcola l'anno in base al progresso interpolato
    selectedYear = Math.round(lerp(1960, 2020, easedProgress)); // Arrotonda il valore

    // Aggiorna il progresso dell'evidenziazione dei settori
    sectorHighlightProgress = easedProgress;

    // Blocca il progresso a 1 per evitare overflow
    if (autoScrollProgress >= 1) {
      autoScrollProgress = 1;
      autoScroll = false; // Ferma l'animazione
      autoScrollCompleted = true;
      sectorHighlightProgress = 0; // Reset the sector highlight progress
    }

    slider.value(selectedYear); // Aggiorna il valore dello slider
  }

  // Aggiorna `selectedYear` se il mouse è sopra lo slider e viene premuto
  if (
    mouseIsPressed &&
    mouseY > height - 90 && // Ampliato il range verticale sopra lo slider
    mouseY < height - 30 && // Ampliato il range verticale sotto lo slider
    mouseX > startX &&
    mouseX < endX
  ) {
    autoScrollCompleted = true; // Segna l'auto-scroll come completato
    autoScroll = false; // Disabilita l'auto-scroll quando l'utente interagisce manualmente
    let mouseXPosition = constrain(mouseX, startX, endX);
    let mouseIndex = map(mouseXPosition, startX, endX, 0, 60);
    selectedYear = int(map(mouseIndex, 0, 60, 1960, 2020));
    slider.value(selectedYear);
  }

  // Disegna il razzo ruotato di 90° sopra lo slider
  let rocketX = map(selectedYear, 1960, 2020, startX, endX);
  if (rocketX <= endX) {
    drawRocket(rocketX, height-55); // Posizione del razzo
  }
}

function easeOutQuad(t) {
  return t * (2 - t); // Equazione di easing-out quadratica
}

//ROCKET DRAW
function drawRocket(x, y) {
  push();
  translate(x, y);
  imageMode(CENTER);
  image(rocketImg, 0, 0, rocketWidth, rocketHeight);
  pop();
}



//CIRCLE SETUP
function getGraphSize() {
  // Use 7/8 of window height as the base size
  const baseSize = (windowHeight * 7) / 8;
  return {
    radius: baseSize * 0.12,        // Earth radius (12% of base size)
    rayLength: baseSize * 0.3,      // Length of rays/sectors (30% of base size)
    dotSize: baseSize * 0.003,      // Size of debris dots
    minRadius: baseSize * 0.14,     // Inner radius for dots (slightly larger than Earth)
    maxRadius: baseSize * 0.35      // Outer radius for dots (35% of base size)
  };
}

function drawCircleWithRays() {
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;
  const sizes = getGraphSize();

  // Draw Earth with rotation
  push();
  translate(centerX, centerY);
  rotate(rotationAngle);
  imageMode(CENTER);
  image(terraImg, 0, 0, sizes.radius * 2, sizes.radius * 2);
  pop();

  rotationAngle += 0.2;

  // Draw rays
  for (let i = 0; i < 99; i++) {
    let angle = map(i, 0, 99, 0, 360);
    let x1 = centerX + sizes.radius * cos(angle);
    let y1 = centerY + sizes.radius * sin(angle);
    let x2 = centerX + (sizes.radius + sizes.rayLength) * cos(angle);
    let y2 = centerY + (sizes.radius + sizes.rayLength) * sin(angle);

    stroke(240);
    strokeWeight(0.5);
    line(x1, y1, x2, y2);
  }
}

//SECTORS SETUP
function generateSectors() {
  // Ordina i codici paese in ordine alfabetico
  countryCodes.sort(); 
  
  sectors = []; // Resetta l'array dei settori
  let index = 0;

  for (let i = 0; i < countryCodes.length; i++) {
    let countryCode = countryCodes[index];
    
    // Aggiungi un oggetto settore con il codice paese
    sectors.push({ countryCode });

    // Stampa il codice del paese per debug
    console.log(`Settore ${i + 1}: ${countryCode}`);
    
    // Incrementa l'indice
    index++;
  }
}


function drawHighlightedSector() {
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;
  const sizes = getGraphSize();

  // Calculate mouse position relative to center
  let mouseAngle = atan2(mouseY - centerY, mouseX - centerX);
  if (mouseAngle < 0) mouseAngle += 360;
  let mouseDist = dist(mouseX, mouseY, centerX, centerY);

  // Rest of the sector highlighting code using sizes.radius and sizes.rayLength
  if (autoScroll && !autoScrollCompleted) {
    let currentSector = Math.floor(map(sectorHighlightProgress, 0, 1, 0, 99));
    let angle1 = map(currentSector, 0, 99, 0, 360);
    let angle2 = map(currentSector + 1, 0, 99, 0, 360);

    fill(80, 80, 80, 80);
    noStroke();
    arc(centerX, centerY, (sizes.radius + sizes.rayLength) * 2, (sizes.radius + sizes.rayLength) * 2, angle1, angle2, PIE);

    // Mostra il nome del paese associato al settore corrente
    let countryName = sectors[currentSector].countryCode; // Nome del paese
    textSize(25);
    textFont(fontRubik);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(0);
    text(countryName, width / 2, 100); // Posiziona il testo al centro in alto
  }

  if (mouseDist > sizes.radius + dotOffset && mouseDist < sizes.radius + sizes.rayLength) {
    for (let i = 0; i < 99; i++) {
      let angle1 = map(i, 0, 99, 0, 360);
      let angle2 = map(i + 1, 0, 99, 0, 360);

      // Controlla se il mouse è in questo settore
      if (mouseAngle >= angle1 && mouseAngle < angle2) {
        fill(80, 80, 80, 80); // Colore evidenziato
        noStroke();
        arc(centerX, centerY, (sizes.radius + sizes.rayLength) * 2, (sizes.radius + sizes.rayLength) * 2, angle1, angle2, PIE);

        // Mostra il codice paese e il nome del paese associato
        let countryName = sectors[i].countryCode; // Nome del paese

        // Disegna il nome del paese al centro in alto
        textSize(25);
        textFont(fontRubik);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        noStroke();
        fill(0);
        text(countryName, width / 2, 100); // Posiziona il testo al centro in alto

        // Aggiungi il reindirizzamento se il paese è Stati Uniti
        if (countryName === "STATI UNITI") { // Assicurati che il codice paese sia corretto
          if (mouseIsPressed) {
            window.location.href = '../grafico 2 ale/index.html'; // Reindirizza alla pagina
          }
        }
        // Aggiungi il reindirizzamento se il paese è Stati Uniti
        if (countryName === "FRANCIA") { // Assicurati che il codice paese sia corretto
          if (mouseIsPressed) {
            window.location.href = '../grafico Francia/index.html'; // Reindirizza alla pagina
          }
        }
      }
    }
  }
}

//PRECALCULATE DOTS
function generateDots() {
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;
  const sizes = getGraphSize();

  points = [];

  // Calculate min and max periapsis for each sector
  let sectorPeriapsis = sectors.map(() => ({ min: Infinity, max: -Infinity }));

  for (let row of table.rows) {
    let countryCode = row.get("COUNTRY_CODE");
    let sectorIndex = countryCodes.indexOf(countryCode);
    if (sectorIndex !== -1) {
      let periapsis = row.getNum("PERIAPSIS");
      if (periapsis < sectorPeriapsis[sectorIndex].min) sectorPeriapsis[sectorIndex].min = periapsis;
      if (periapsis > sectorPeriapsis[sectorIndex].max) sectorPeriapsis[sectorIndex].max = periapsis;
    }
  }

  for (let i = 0; i < 99; i++) {
    let countryCode = sectors[i].countryCode; 
    let numEvents = countryEventCount[countryCode] || 0; 

    for (let j = 0; j < numEvents; j++) {
      let angle1 = map(i, 0, 99, 0, 360);
      let angle2 = map(i + 1, 0, 99, 0, 360);

      // Ensure the angle is within the sector's boundaries
      let randomAngle = random(angle1, angle2);

      // Get the "PERIAPSIS" value for this event
      let periapsis = table.getNum(j, "PERIAPSIS");

      // Map the "PERIAPSIS" value to a distance between minRadius and maxRadius for this sector
      let mappedDistance = map(
        periapsis,
        sectorPeriapsis[i].min,
        sectorPeriapsis[i].max,
        sizes.minRadius,
        sizes.maxRadius
      );

      // Constrain the distance to ensure it stays within the sector's boundaries
      let constrainedDistance = constrain(mappedDistance, sizes.minRadius, sizes.maxRadius);

      let x = centerX + constrainedDistance * cos(randomAngle);
      let y = centerY + constrainedDistance * sin(randomAngle);

      let launchDate = table.getString(j, "LAUNCH_DATE");
      let launchYear = int(launchDate.substring(0, 4));

      let color = "#000000";

      points.push({ x, y, year: launchYear, color });
    }
  }
}

//DOTS / DEBRIS DRAW
function drawDots() {
  const sizes = getGraphSize();
  selectedYear = slider.value();

  for (let point of points) {
    if (point.year <= selectedYear) {
      let yearsAgo = selectedYear - point.year;
      let grayValue = map(yearsAgo, 0, 60, 0, 255);
      grayValue = constrain(grayValue, 0, 255);
      fill(grayValue);
      noStroke();
      ellipse(point.x, point.y, sizes.dotSize, sizes.dotSize);
    }
  }
}


//NEWS BOX SETUP
push();
function drawNewsBox() {
  // Trova tutte le notizie fino all'anno selezionato
  let notizieDaMostrare = [];
  for (let row of notizieTable.rows) {
    let annoNotizia = int(row.get('anno'));
    if (annoNotizia <= selectedYear) {
      notizieDaMostrare.push({
        testo: row.get('notizia'),
        paese: row.get('paese'),
        anno: annoNotizia,
        immagine: row.get('img')
      });
    }
  }
  
  
  // Mostra le notizie trovate
  if (notizieDaMostrare.length > 0) {
    let boxWidth = 350;
    let boxHeight = 200; // Aumentato per far spazio all'immagine
    let baseX = width - boxWidth - 20;
    let baseY = windowHeight/2 -100;
    let padding = 15;
    let visibleHeight = 5;
    let offsetY = visibleHeight;
    
    let imgSize = 150;
    let imgPadding = 10;

    // Inizializza le posizioni se necessario
    while (cardPositions.length < notizieDaMostrare.length) {
      cardPositions.push(baseY - boxHeight); // Inizia fuori dallo schermo
      cardTargets.push(baseY);
    }

    // Aggiorna le posizioni target
    for (let i = 0; i < notizieDaMostrare.length; i++) {
      cardTargets[i] = baseY + (i * offsetY);
    }

    // Anima le posizioni
    for (let i = 0; i < cardPositions.length; i++) {
      let target = cardTargets[i];
      cardPositions[i] += (target - cardPositions[i]) * ANIMATION_SPEED;
    }
    
    // Disegna le carte con le posizioni animate
    for (let i = 0; i < notizieDaMostrare.length; i++) {
      let notizia = notizieDaMostrare[i];
      let boxX = baseX;
      let boxY = cardPositions[i];
      
      // Disegna il rettangolo bianco
      fill(255);
      stroke(0);
      strokeWeight(1.5);
      rect(boxX, boxY, boxWidth, boxHeight, 8);
      
      // Calcola la larghezza disponibile per il testo
      let maxWidth = boxWidth - (padding * 3) - imgSize;
      
      // Testo all'interno del rettangolo
      noStroke();
      fill(0);
      textAlign(LEFT, TOP);
      
      let textX = boxX + padding;
      let textY = boxY + padding;
      let lineHeight = 18;
      
      // Testo della notizia
      textSize(16);
      text(notizia.testo, textX, textY, maxWidth);
      
      // Anno
      textStyle(NORMAL);
      textSize(16);
      let bottomY = boxY + boxHeight - padding - lineHeight * 2;
      text(notizia.anno, textX, bottomY);
      
      // Paese
      fill(255);
      stroke(0);
      strokeWeight(1.5);
      textFont(fontRubik);
      textSize(18);
      text(notizia.paese, textX, bottomY + lineHeight);
      
      // Disegna l'immagine corrispondente sotto il paese
      let imgIndex = i % 16; // Assicurati che ci siano 16 immagini
      let imgWidth = imgSize; // Larghezza dell'immagine
      let imgHeight = (imgWidth / eval(`imgn${imgIndex + 1}`).width) * eval(`imgn${imgIndex + 1}`).height; // Altezza calcolata per mantenere le proporzioni
      image(eval(`imgn${imgIndex + 1}`), boxX + boxWidth - imgWidth - imgPadding, boxY + padding + lineHeight * 2, imgWidth, imgHeight); // Disegna l'immagine sotto il paese
      
      // Ritorna al font Inconsolata
      textFont(fontInconsolata);
      
    }
    
    textAlign(CENTER, CENTER);

    // Rimuovi le carte in eccesso se necessario
    while (cardPositions.length > notizieDaMostrare.length) {
      cardPositions.pop();
      cardTargets.pop();
    }
  }
}
pop();




//LEGEND DRAW
function drawLegend() {
  const legendX = 50; // Posizione X della legenda
  const legendY = 340; // Posizione Y iniziale della legenda
  const imageWidth = 40; // Larghezza standard delle immagini
  const spacing = 60; // Spaziatura verticale tra le immagini
  const labels = [
    { img: imgn19, text: "Rifiuto Spaziale" },
  ];

  noStroke();
  fill(255); // Colore di riempimento bianco per il riquadro
  // Modificato per includere il testo
  rect(legendX - 10, legendY - 10, imageWidth + 10 + 150, labels.length * spacing + 20 + 120); // Disegna il riquadro

  noStroke();
  textAlign(LEFT, CENTER);
  textFont(fontRubik); // Assicurati di usare il font corretto
  textSize(15);
  textStyle(BOLD); // Imposta il testo in grassetto
  fill(0);

  // Itera tra le immagini e disegna la legenda
  for (let i = 0; i < labels.length; i++) {
    let img = labels[i].img;
    let labelText = labels[i].text.toUpperCase(); // Converti il testo in maiuscolo

    if (img) {
      // Disegna il testo
      text(labelText, legendX, legendY + i * spacing); // Posiziona il testo

      // Calcola l'altezza mantenendo le proporzioni
      let imgHeight = imageWidth / (img.width / img.height);

      // Disegna l'immagine centrata sotto il testo
      image(img, legendX + (150 - imageWidth) / 2, legendY + i * spacing + 20, imageWidth, imgHeight); // Posiziona l'immagine centrata sotto il testo
    }
  }

  // Aggiungi il testo "DISTANZA DALLA TERRA" sotto il pallino
  textSize(12); // Dimensione del testo per la nuova scritta
  textStyle(NORMAL); // Assicurati che il testo non sia in bold
  text("DISTANZA DALLA TERRA", legendX + (150 - textWidth("DISTANZA DALLA TERRA")) / 2, legendY + labels.length * spacing + 20 + 10); // Posiziona il testo centrato


  // Aggiungi il testo descrittivo sotto "PERIGEO"
  textFont(fontInconsolata); // Cambia il font a Inconsolata
  textSize(10); // Dimensione del testo per la descrizione
  textStyle(NORMAL); // Assicurati che il testo non sia in bold
  text("È IL PUNTO DI MASSIMA VICINANZA DEL DETRITO ALLA TERRA, MENTRE ORBITA INTORNO AD ESSA", legendX + 10, legendY + labels.length * spacing + 20 + 50, 130); // Posiziona il testo centrato

  // Aggiungi l'immagine "perigeo.png" sotto il testo descrittivo
  let perigeoImg = loadImage('../../img/perigeo.png'); // Carica l'immagine dal percorso corretto
  image(perigeoImg, legendX + (150 - imageWidth) / 2, legendY + labels.length * spacing + 20 + 70, imageWidth, imageWidth * (perigeoImg.height / perigeoImg.width)); // Posiziona l'immagine centrata

  stroke(0); // Imposta il colore del bordo a nero
  noFill(); // Non riempire il rettangolo
  // Modificato per includere il testo
  rect(legendX - 10, legendY - 10, imageWidth + 10 + 150, labels.length * spacing + 20 + 120); // Disegna il bordo
}

// Aggiungi questa nuova funzione per disegnare le finestrelle
function drawInfoBoxes() {
  let boxWidth = 150; // Larghezza delle finestrelle
  let boxHeight = 100; // Altezza delle finestrelle
  let baseX = 20; // Posizione X delle finestrelle
  let baseY = height - 200; // Posizione Y iniziale delle finestrelle (spostato più in basso)
  let padding = 10; // Padding interno

  for (let i = 0; i < 3; i++) {
    let boxY = baseY + i * (boxHeight + padding); // Calcola la posizione Y per ogni finestra

    // Disegna il rettangolo bianco
    fill(255);
    stroke(0);
    strokeWeight(1.5);
    rect(baseX, boxY, boxWidth, boxHeight, 8);
  }
}
