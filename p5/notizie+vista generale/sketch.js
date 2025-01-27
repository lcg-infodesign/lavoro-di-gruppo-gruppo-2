// DICHIARAZIONE VARIABILI GLOBALI
let fumoImg; // Immagine per l'effetto fumo
let fumoAspectRatio = 1; // Rapporto dimensionale del fumo
let numFumo = 40; // Numero di particelle di fumo
let slider; // Slider per la timeline

let selectedYear = 1960; // Anno selezionato iniziale
const dotOffset = 40; // Spazio vuoto intorno al cerchio centrale
let notizieTable; // Tabella contenente le notizie
let notiziaCorrente = null; // Notizia attualmente visualizzata

// IMMAGINI
let rocketImg; // Immagine del razzo
let rocketWidth; // Larghezza del razzo
let rocketHeight = 40; // Altezza del razzo
let terraImg; // Immagine della Terra

// FONT UTILIZZATI
let fontInconsolata; // Font principale
let fontRubik; // Font secondario
let rotationAngle = 0; // Angolo di rotazione della Terra

// ARRAY PER LA GESTIONE DEI DATI
let cardPositions = []; // Posizioni delle carte notizie
let cardTargets = []; // Posizioni target per l'animazione delle carte
let immaginiNotizie = {}; // Oggetto contenente le immagini delle notizie
let points = []; // Punti per la visualizzazione dei detriti
let countryCodes = []; // Codici dei paesi
let countryEventCount = {}; // Contatore eventi per paese
let sectors = []; // Settori del grafico circolare
let fumoData = []; // Dati per l'animazione del fumo

// PARAMETRI ANIMAZIONE
let autoScrollProgress = 0; // Progresso dello scroll automatico
let AUTO_SCROLL_DURATION = 5000; // Durata dell'animazione in millisecondi
let lastUpdateTime = 0; // Ultimo aggiornamento
let ANIMATION_SPEED = 0.075; // Velocità dell'animazione

let autoScroll = true; // Attivazione scroll automatico
let autoScrollSpeed = 0.5; // Velocità dello scroll
let autoScrollCompleted = false; // Stato completamento scroll
let sectorHighlightProgress = 0; // Progresso evidenziazione settori

// GESTIONE AUDIO
let sound; // File audio
let toggleButton; // Pulsante per il controllo audio
let isPlaying = false; // Stato riproduzione audio

// FUNZIONE DI PRECARICAMENTO RISORSE
function preload() {
  // Caricamento font
  fontRubik = loadFont('../../fonts/RubikOne.ttf');
  fontInconsolata = loadFont('../../fonts/Inconsolata.ttf');

  // Caricamento immagini notizie
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

  // Caricamento immagini specifiche
  imgtitolo = loadImage('../../img/titolo.png');
  imgperigeo = loadImage('../../img/perigeo2.png');

  // Caricamento immagine razzo
  rocketImg = loadImage('../../img/razzino.png', img => {
    let ratio = img.width / img.height;
    rocketWidth = rocketHeight * ratio;
  });

  // Caricamento immagine Terra
  terraImg = loadImage('../../img/marenero.png');

  // Caricamento immagine fumo
  fumoImg = loadImage("../../img/fumo.png", () => {
    fumoAspectRatio = fumoImg.width / fumoImg.height;
  });

  // Caricamento dati CSV
  table = loadTable("../../space_decay.csv", "header");
  notizieTable = loadTable("../../notizie.csv", "header");

  // Caricamento audio
  sound = loadSound('../../space.mp3');
}

// FUNZIONE PER CARICARE I CODICI DEI PAESI
function loadCountryCodes() {
  if (table.getRowCount() > 0) {
    // Estrazione codici paese dal CSV
    countryCodes = table.getColumn("COUNTRY_CODE");
    // Rimozione duplicati
    countryCodes = [...new Set(countryCodes)];
    // Conteggio eventi per paese
    countCountryEvents();
    console.log(`Codici paese caricati: ${countryCodes.length}`);
  } else {
    console.error("Errore nel caricamento del CSV. Controlla il file.");
  }
}

// FUNZIONE PER CONTARE GLI EVENTI PER PAESE
function countCountryEvents() {
  for (let row of table.rows) {
    let countryCode = row.get("COUNTRY_CODE");
    if (countryEventCount[countryCode]) {
      countryEventCount[countryCode]++;
    } else {
      countryEventCount[countryCode] = 1;
    }
  }
}

// CONFIGURAZIONE INIZIALE DELL'APPLICAZIONE
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textFont(fontInconsolata);
  textAlign(CENTER, CENTER);

  // Configurazione posizioni dei pulsanti nella barra di navigazione
  let buttonPositions = [
    { x: width - 430, y: 30 },
    { x: width - 300, y: 30 },
    { x: width - 160, y: 30 }
  ];

  // Creazione pulsanti della navbar
  createButtons(buttonPositions);

  // Fissaggio dei pulsanti per il ridimensionamento della finestra
  let buttons = selectAll('button');
  buttons.forEach(button => {
    button.style('position', 'fixed');
  });

  // Configurazione dello slider temporale
  slider = createSlider(1960, 2020, 1960, 1);
  slider.position((width - slider.width) / 2, height - 60);
  slider.style('width', '700px');
  slider.style('opacity', '0');

  // Configurazione del pulsante audio
  toggleButton = createButton('Play Sound');
  toggleButton.style('position', 'fixed');
  toggleButton.position(40, windowHeight - 55);
  toggleButton.mousePressed(toggleAudio);
  sound.setVolume(0.2);
  styleButton(toggleButton);

  // Inizializzazione delle altre funzionalità
  loadCountryCodes();
  generateSectors();
  generateDots();
  precalculateFumo();
}

// GESTIONE DEL RIDIMENSIONAMENTO DELLA FINESTRA
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Aggiornamento posizione pulsante audio
  toggleButton.position(40, windowHeight - 55);
  // Rigenerazione dei punti con la nuova posizione centrale
  generateDots();
  // Ridisegno del canvas
  redraw();
}

// STILE DEL PULSANTE AUDIO
function styleButton(button) {
  button.style('font-family', 'Inconsolata');
  button.style('font-size', '12px');
  button.style('padding', '5px 10px');
  button.style('border', '2px solid black');
  button.style('border-radius', '8px');
  button.style('background-color', 'white');
  button.style('color', 'black');
  button.style('cursor', 'pointer');
  button.style('text-align', 'center');
}

// GESTIONE DELLA RIPRODUZIONE AUDIO
function toggleAudio() {
  if (isPlaying) {
    sound.stop();
    toggleButton.html('Play Sound');
    isPlaying = false;
  } else {
    sound.play();
    toggleButton.html('Stop Sound');
    isPlaying = true;
  }
}

// CREAZIONE DEI PULSANTI DELLA NAVBAR
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

// FUNZIONE PRINCIPALE DI DISEGNO
function draw() {
  background(240);

  //INFO BOX SETUP
  fill(255); 
  stroke(0); 
  strokeWeight(2); 
  let boxWidth = 300; 
  let boxHeight = 120; 
  let firstBoxHeight = boxHeight * (2 / 3); 
  let secondBoxHeight = boxHeight * (4 / 3) + 20; 
  let cornerRadius = 10; // Raggio degli angoli arrotondati
  let spacing = 15; // Spazio tra i rettangoli
  let totalHeight = firstBoxHeight + secondBoxHeight + boxHeight * 2 + spacing * 4; // Altezza totale per 4 rettangoli e spazi
  let startY = (height - totalHeight) / 2; // Posizione Y 

  // primo rettangolo 
  rect(40, startY, boxWidth, firstBoxHeight, cornerRadius); 

  //secondo rettangolo
  rect(40, startY + firstBoxHeight + spacing, boxWidth, secondBoxHeight, cornerRadius);

  // terzo e quarto rettangolo
  for (let i = 2; i < 3; i++) {
    rect(40, startY + firstBoxHeight + secondBoxHeight + spacing * 2 + (i - 2) * (boxHeight + spacing), boxWidth, boxHeight, cornerRadius);
  }
  //altezza del quarto rettangolo
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

  
  textFont(fontRubik);
  textSize(22);

  fill(255);
  noStroke(); 
  textAlign(LEFT); // testo allineato a sinistra
  
  
  noStroke(); 
  fill(0); 
  textSize(18);
  text('RIFIUTO SPAZIALE', 56, (height - boxHeight) / 2 -193); 

  // Rettangolo 
  fill(0);
  ellipse(56 + 15, (height - boxHeight) / 2 - 160, 10, 10); 

  
  textFont(fontRubik);
  textSize(18);
  fill(0);
  noStroke(); 
  text('PERIGEO', 56, (height - boxHeight) / 2 - 100); 
  image(imgperigeo, 56, (height - boxHeight) / 2 -50, imgperigeo.width * 0.17, imgperigeo.height * 0.17);

  textFont(fontInconsolata);
  textSize(14);
  fill(0);
  noStroke(); 
  text('DISTANZA DALLA TERRA', 56, (height - boxHeight) / 2 - 72 ); 

  textFont(fontInconsolata);
  textSize(12);
  fill(0);
  noStroke(); 
  text(
    'Il punto di massima vicinanza del detrito\nalla terra, mentre orbita intorno ad essa',
    56,
    (height - boxHeight) / 2 + 25  
  );

  textFont(fontRubik);
  textSize(18);
  fill(0);
  noStroke(); 
  text('ANNO', 56, (height - boxHeight) / 2 + 78 + 17); 

  textFont(fontInconsolata);
  textSize(24); 
  fill(0);
  noStroke(); 
  text('0000', 56, (height - boxHeight) / 2 + 122); 

  textFont(fontInconsolata);
  textSize(12);
  fill(0);
  noStroke(); 
  text(
    "L'anno in cui l'oggetto è stato lanciato\nnello spazio. Dal 1960 al 2021",
    56,
    (height - boxHeight) / 2 + 162  // Spostato in basso
  );

  textFont(fontRubik);
  textSize(18);
  fill(0);
  noStroke(); 
  text('PAESE', 56, (height - boxHeight) / 2 + 228); 

  fill(192); 
  arc(66 + 20, (height - boxHeight) / 2 + 255, 350, 255, 0, PI + QUARTER_PI); 

  
  textFont(fontInconsolata);
  textSize(12);
  fill(0);
  noStroke(); 
  text('Il paese responsabile del lancio del detrito', 56, (height - boxHeight) / 2 + 289); 
}

// PRECALCOLO DELL'EFFETTO FUMO
function precalculateFumo() {
  let startX = (width - 700) / 2;
  let endX = startX + 700;
  let step = (endX - startX) / numFumo;

  for (let i = 0; i < numFumo; i++) {
    // Calcolo delle proprietà casuali per ogni particella di fumo
    let x = startX + i * step;
    let randomScale = random(0.8, 1.3);
    let randomRotation = random(-30, 30);
    let randomOffsetY = random(-5, 5);

    fumoData.push({ x, scale: randomScale, rotation: randomRotation, offsetY: randomOffsetY });
  }
}

// DISEGNO DELLA TIMELINE CON SLIDER
function drawSliderTimeline() {
  // Visualizzazione dell'anno selezionato
  stroke(0);
  strokeWeight(0);
  fill(0);
  textFont(fontInconsolata);
  textSize(20);
  text(selectedYear, width / 2, height - 100);

  // Etichette degli anni agli estremi della timeline
  noStroke();
  fill(0);
  textFont(fontInconsolata);
  textSize(14);
  text('1960', (width - 700) / 2 - 60, height - 57);
  text('2020', (width + 700) / 2 + 40, height - 57);

  // Linea della timeline (parte non ancora percorsa)
  stroke(192);
  strokeWeight(2);
  let startX = (width - 700) / 2;
  let endX = startX + 700;
  let passedX = map(selectedYear, 1960, 2020, startX, endX);
  line(passedX, height - 55, endX, height - 55);

  // Indicatori di inizio e fine timeline
  fill(0);
  ellipse(startX, height - 55, 10, 10);
  ellipse(endX, height - 55, 10, 10);

  // Visualizzazione effetto fumo sulla timeline
  for (let fumo of fumoData) {
    if (fumo.x <= passedX) {
      push();
      translate(fumo.x, height - 60 + fumo.offsetY);
      rotate(radians(fumo.rotation));
      imageMode(CENTER);
      image(fumoImg, 0, 0, 25 * fumo.scale, (25 / fumoAspectRatio) * fumo.scale);
      pop();
    }
  }

  // Gestione dell'animazione automatica
  if (autoScroll && !autoScrollCompleted) {
    // Aggiornamento del progresso temporale
    autoScrollProgress += deltaTime / AUTO_SCROLL_DURATION;

    // Applicazione dell'effetto di rallentamento
    let easedProgress = easeOutQuad(autoScrollProgress);

    // Calcolo dell'anno corrente
    selectedYear = Math.round(lerp(1960, 2020, easedProgress));

    // Aggiornamento dell'evidenziazione dei settori
    sectorHighlightProgress = easedProgress;

    // Gestione del completamento dell'animazione
    if (autoScrollProgress >= 1) {
      autoScrollProgress = 1;
      autoScroll = false;
      autoScrollCompleted = true;
      sectorHighlightProgress = 0;
    }

    slider.value(selectedYear);
  }

  // Gestione dell'interazione manuale con lo slider
  if (
    mouseIsPressed &&
    mouseY > height - 90 &&
    mouseY < height - 30 &&
    mouseX > startX &&
    mouseX < endX
  ) {
    autoScrollCompleted = true;
    autoScroll = false;
    let mouseXPosition = constrain(mouseX, startX, endX);
    let mouseIndex = map(mouseXPosition, startX, endX, 0, 60);
    selectedYear = int(map(mouseIndex, 0, 60, 1960, 2020));
    slider.value(selectedYear);
  }

  // Visualizzazione del razzo sulla timeline
  let rocketX = map(selectedYear, 1960, 2020, startX, endX);
  if (rocketX <= endX) {
    drawRocket(rocketX, height-55);
  }
}

// FUNZIONE PER L'EFFETTO DI RALLENTAMENTO
function easeOutQuad(t) {
  return t * (2 - t);
}

// DISEGNO DEL RAZZO SULLA TIMELINE
function drawRocket(x, y) {
  push();
  translate(x, y);
  imageMode(CENTER);
  image(rocketImg, 0, 0, rocketWidth, rocketHeight);
  pop();
}

// CONFIGURAZIONE DIMENSIONI DEL GRAFICO
function getGraphSize() {
  const baseSize = (windowHeight * 7) / 8;
  return {
    radius: baseSize * 0.12,        // Raggio della Terra
    rayLength: baseSize * 0.3,      // Lunghezza dei raggi/settori
    dotSize: baseSize * 0.003,      // Dimensione dei punti dei detriti
    minRadius: baseSize * 0.14,     // Raggio interno per i punti
    maxRadius: baseSize * 0.35      // Raggio esterno per i punti
  };
}

// DISEGNO DEL CERCHIO CENTRALE E DEI RAGGI
function drawCircleWithRays() {
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;
  const sizes = getGraphSize();

  // Disegno della Terra con rotazione
  push();
  translate(centerX, centerY);
  rotate(rotationAngle);
  imageMode(CENTER);
  image(terraImg, 0, 0, sizes.radius * 2, sizes.radius * 2);
  pop();

  rotationAngle += 0.2;

  // Disegno dei raggi
  for (let i = 0; i < 98; i++) {
    let angle = map(i, 0, 98, 0, 360);
    let x1 = centerX + sizes.radius * cos(angle);
    let y1 = centerY + sizes.radius * sin(angle);
    let x2 = centerX + (sizes.radius + sizes.rayLength) * cos(angle);
    let y2 = centerY + (sizes.radius + sizes.rayLength) * sin(angle);

    stroke(240);
    strokeWeight(0.5);
    line(x1, y1, x2, y2);
  }
}

// GENERAZIONE DEI SETTORI DEL GRAFICO
function generateSectors() {
  // Ordinamento alfabetico dei codici paese
  countryCodes.sort(); 
  
  // Inizializzazione array dei settori
  sectors = [];
  let index = 0;

  for (let i = 0; i < countryCodes.length; i++) {
    let countryCode = countryCodes[index];
    sectors.push({ countryCode });
    console.log(`Settore ${i + 1}: ${countryCode}`);
    index++;
  }
}

// EVIDENZIAZIONE DEI SETTORI E INTERAZIONE
function drawHighlightedSector() {
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;
  const sizes = getGraphSize();

  // Calcolo della posizione del mouse rispetto al centro
  let mouseAngle = atan2(mouseY - centerY, mouseX - centerX);
  if (mouseAngle < 0) mouseAngle += 360;
  let mouseDist = dist(mouseX, mouseY, centerX, centerY);

  // Reset del cursore
  cursor(ARROW);

  // Animazione automatica dei settori
  if (autoScroll && !autoScrollCompleted) {
    let currentSector = Math.floor(map(sectorHighlightProgress, 0, 1, 0, 98));
    let angle1 = map(currentSector, 0, 98, 0, 360);
    let angle2 = map(currentSector + 1, 0, 98, 0, 360);

    // Visualizzazione del settore corrente
    fill(80, 80, 80, 80);
    noStroke();
    arc(centerX, centerY, (sizes.radius + sizes.rayLength) * 2, (sizes.radius + sizes.rayLength) * 2, angle1, angle2, PIE);

    // Visualizzazione del nome del paese
    let countryName = sectors[currentSector].countryCode;
    textSize(25);
    textFont(fontRubik);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(0);
    text(countryName, width / 2, 100);
  }

  // Gestione dell'interazione con il mouse
  if (mouseDist > sizes.radius + dotOffset && mouseDist < sizes.radius + sizes.rayLength) {
    for (let i = 0; i < 98; i++) {
      let angle1 = map(i, 0, 98, 0, 360);
      let angle2 = map(i + 1, 0, 98, 0, 360);

      if (mouseAngle >= angle1 && mouseAngle < angle2) {
        cursor(HAND);

        // Evidenziazione del settore selezionato
        fill(80, 80, 80, 80);
        noStroke();
        arc(centerX, centerY, (sizes.radius + sizes.rayLength) * 2, (sizes.radius + sizes.rayLength) * 2, angle1, angle2, PIE);

        // Visualizzazione nome del paese
        let countryName = sectors[i].countryCode;
        textSize(25);
        textFont(fontRubik);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        noStroke();
        fill(0);
        text(countryName, width / 2, 100);

        // Gestione del click e reindirizzamento alla pagina del paese
        if (mouseIsPressed) {
          // Switch case per il reindirizzamento
          switch (countryName) {
            case "STATI UNITI":
              window.location.href = '../grafico STATI UNITI/index.html';
              break;
            case "FRANCIA":
              window.location.href = '../grafico Francia/index.html';
              break;
            case "ITALIA":
              window.location.href = '../grafico ITALIA/index.html';
              break;
            case "ABCASIA (GEORGIA)":
              window.location.href = '../grafico Abcasia/index.html';
              break;
            case "ALGERIA":
              window.location.href = '../grafico ALGERIA/index.html';
              break;
            case "ALLEANZA ASIATICA":
              window.location.href = '../grafico ALLEANZA ASIATICA/index.html';
              break;
            case "ANGOLA":
              window.location.href = '../grafico ANGOLA/index.html';
              break;
            case "ARABIA SAUDITA":
              window.location.href = '../grafico ARABIA SAUDITA/index.html';
              break;
            case "ARGENTINA":
              window.location.href = '../grafico ARGENTINA/index.html';
              break;
            case "ASCENTION ISLAND":
              window.location.href = '../grafico ASCENTION ISLAND/index.html';
              break;
            case "AUSTRALIA":
              window.location.href = '../grafico AUSTRALIA/index.html';
              break;
            case "AZERBAIGIAN":
              window.location.href = '../grafico AZERBAIGIAN/index.html';
              break;
            case "BANGLADESH":
              window.location.href = '../grafico BANGLADESH/index.html';
              break;
            case "BELGIO":
              window.location.href = '../grafico BELGIO/index.html';
              break;
            case "BERMUDA":
              window.location.href = '../grafico BERMUDA/index.html';
              break;
            case "BIELORUSSIA":
              window.location.href = '../grafico BIELORUSSIA/index.html';
              break;
            case "BOLIVIA":
              window.location.href = '../grafico BOLIVIA/index.html';
              break;
            case "BRASILE":
              window.location.href = '../grafico BRASILE/index.html';
              break;
            case "BULGARIA":
              window.location.href = '../grafico BULGARIA/index.html';
              break;
            case "CANADA":
              window.location.href = '../grafico CANADA/index.html';
              break;
            case "CILE":
              window.location.href = '../grafico CILE/index.html';
              break;
            case "CINA":
              window.location.href = '../grafico CINA/index.html';
              break;
            case "COLOMBIA":
              window.location.href = '../grafico COLOMBIA/index.html';
              break;
            case "COREA DEL NORD":
              window.location.href = '../grafico COREA DEL NORD/index.html';
              break;
            case "COREA DEL SUD":
              window.location.href = '../grafico COREA DEL SUD/index.html';
              break;
            case "DANIMARCA":
              window.location.href = '../grafico DANIMARCA/index.html';
              break;
            case "ECUADOR":
              window.location.href = '../grafico ECUADOR/index.html';
              break;
            case "EGITTO":
              window.location.href = '../grafico EGITTO/index.html';
              break;
            case "EMIRATI ARABI UNITI":
              window.location.href = '../grafico EMIRATI ARABI UNITI/index.html';
              break;
            case "ESTONIA":
              window.location.href = '../grafico ESTONIA/index.html';
              break;
            case "EUROPA E MEDIO ORIENTE":
              window.location.href = '../grafico EUROPA E MEDIO ORIENTE/index.html';
              break;
            case "EUTELSAT":
              window.location.href = '../grafico EUTELSAT/index.html';
              break;
            case "EX USSR":
              window.location.href = '../grafico EX USSR/index.html';
              break;
            case "FILIPPINE":
              window.location.href = '../grafico FILIPPINE/index.html';
              break;
            case "FINLANDIA":
              window.location.href = '../grafico FINLANDIA/index.html';
              break;
            case "FRIT":
              window.location.href = '../grafico FRIT/index.html';
              break;
            case "GERMANIA":
              window.location.href = '../grafico GERMANIA/index.html';
              break;
            case "GIAPPONE":
              window.location.href = '../grafico GIAPPONE/index.html';
              break;
            case "GIORDANIA":
              window.location.href = '../grafico GIORDANIA/index.html';
              break;
            case "GLOBALSTAR":
              window.location.href = '../grafico GLOBALSTAR/index.html';
              break;
            case "GRECIA":
              window.location.href = '../grafico GRECIA/index.html';
              break;
            case "INDIA":
              window.location.href = '../grafico INDIA/index.html';
              break;
            case "INMARSAT":
              window.location.href = '../grafico INMARSAT/index.html';
              break;
            case "INTELSAT":
              window.location.href = '../grafico INTELSAT/index.html';
              break;
            case "IRAN":
              window.location.href = '../grafico IRAN/index.html';
              break;
            case "IRAQ":
              window.location.href = '../grafico IRAQ/index.html';
              break;
            case "ISRAELE":
              window.location.href = '../grafico ISRAELE/index.html';
              break;
            case "KAZAKISTAN":
              window.location.href = '../grafico KAZAKISTAN/index.html';
              break;
            case "KUWAIT":
              window.location.href = '../grafico KUWAIT/index.html';
              break;
            case "LAOS":
              window.location.href = '../grafico LAOS/index.html';
              break;
            case "LITUANIA":
              window.location.href = '../grafico LITUANIA/index.html';
              break;
            case "LUSSEMBURGO":
              window.location.href = '../grafico LUSSEMBURGO/index.html';
              break;
            case "MALA":
              window.location.href = '../grafico MALA/index.html';
              break;
            case "MALESIA":
              window.location.href = '../grafico MALESIA/index.html';
              break;
            case "MAROCCO":
              window.location.href = '../grafico MAROCCO/index.html';
              break;
            case "MAURITIUS":
              window.location.href = '../grafico MAURITIUS/index.html';
              break;
            case "MESSICO":
              window.location.href = '../grafico MESSICO/index.html';
              break;
            case "MYANMAR":
              window.location.href = '../grafico MYANMAR/index.html';
              break;
            case "NIGERIA":
              window.location.href = '../grafico NIGERIA/index.html';
              break;
            case "NORVEGIA":
              window.location.href = '../grafico NORVEGIA/index.html';
              break;
            case "NUOVA ZELANDA":
              window.location.href = '../grafico NUOVA ZELANDA/index.html';
              break;
            case "O3B":
              window.location.href = '../grafico O3B/index.html';
              break;
            case "ORGANIZZAZIONE REGIONALE AFRICANA DELLA COMUNICAZIONE SATELLITARE":
              window.location.href = '../grafico ORGANIZZAZIONE REGIONALE AFRICANA DELLA COMUNICAZIONE SATELLITARE/index.html';
              break;
            case "ORGANIZZAZIONI INTERNAZIONALI":
              window.location.href = '../grafico ORGANIZZAZIONI INTERNAZIONALI/index.html';
              break;
            case "PAESI BASSI":
              window.location.href = '../grafico PAESI BASSI/index.html';
              break;
            case "PAKISTAN":
              window.location.href = '../grafico PAKISTAN/index.html';
              break;
            case "PARAGUAY":
              window.location.href = '../grafico PARAGUAY/index.html';
              break;
            case "PERÙ":
              window.location.href = '../grafico PERÙ/index.html';
              break;
            case "POLONIA":
              window.location.href = '../grafico POLONIA/index.html';
              break;
            case "QATAR":
              window.location.href = '../grafico QATAR/index.html';
              break;
            case "REGNO UNITO":
              window.location.href = '../grafico REGNO UNITO/index.html';
              break;
            case "REPUBBLICA CECA":
              window.location.href = '../grafico REPUBBLICA CECA/index.html';
              break;
            case "REPUBBLICA CINESE":
              window.location.href = '../grafico REPUBBLICA CINESE/index.html';
              break;
            case "REPUBBLICA CINO-BRASILIANA":
              window.location.href = '../grafico REPUBBLICA CINO-BRASILIANA/index.html';
              break;
            case "RUANDA":
              window.location.href = '../grafico RUANDA/index.html';
              break;
            case "SCONOSCIUTO":
              window.location.href = '../grafico SCONOSCIUTO/index.html';
              break;
            case "SEA LAUNCH DEMO":
              window.location.href = '../grafico SEA LAUNCH DEMO/index.html';
              break;
            case "SEYCHELLES":
              window.location.href = '../grafico SEYCHELLES/index.html';
              break;
            case "SINGAPORE":
              window.location.href = '../grafico SINGAPORE/index.html';
              break;
            case "SINGAPORE/TAIWAN":
              window.location.href = '../grafico SINGAPORE/TAIWAN/index.html';
              break;
            case "SLOVENIA":
              window.location.href = '../grafico SLOVENIA/index.html';
              break;
            case "SPAGNA":
              window.location.href = '../grafico SPAGNA/index.html';
              break;
            case "STATI IN EST/SUD AFRICA":
              window.location.href = '../grafico STATI IN EST/SUD AFRICA/index.html';
              break;
            case "STATI UNITI/BRASILE":
              window.location.href = '../grafico STATI UNITI/BRASILE/index.html';
              break;
            case "STAZIONE SPAZIALE INTERNAZIONALE":
              window.location.href = '../grafico STAZIONE SPAZIALE INTERNAZIONALE/index.html';
              break;
            case "SUD AFRICA":
              window.location.href = '../grafico SUD AFRICA/index.html';
              break;
            case "SUDAN":
              window.location.href = '../grafico SUDAN/index.html';
              break;
            case "SVEZIA":
              window.location.href = '../grafico SVEZIA/index.html';
              break;
            case "SVIZZERA":
              window.location.href = '../grafico SVIZZERA/index.html';
              break;
            case "THAILANDIA":
              window.location.href = '../grafico THAILANDIA/index.html';
              break;
            case "TUNISIA":
              window.location.href = '../grafico TUNISIA/index.html';
              break;
            case "TURCHIA":
              window.location.href = '../grafico TURCHIA/index.html';
              break;
            case "TURKMENISTAN":
              window.location.href = '../grafico TURKMENISTAN/index.html';
              break;
            case "UCRAINA":
              window.location.href = '../grafico UCRAINA/index.html';
              break;
            case "UNGHERIA":
              window.location.href = '../grafico UNGHERIA/index.html';
              break;
            case "URUGUAY":
              window.location.href = '../grafico URUGUAY/index.html';
              break;
            case "VENEZUELA":
              window.location.href = '../grafico VENEZUELA/index.html';
              break;
            case "VIETNAM":
              window.location.href = '../grafico VIETNAM/index.html';
              break;            
            // Aggiungi qui altri paesi se necessario
            default:
              console.log(`Nessun reindirizzamento definito per ${countryName}`);
          }
        }
      }
    }
  }
}

// GENERAZIONE DEI PUNTI DEI DETRITI
function generateDots() {
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;
  const sizes = getGraphSize();

  points = [];

  // Calcolo del periapside minimo e massimo per ogni settore
  let sectorPeriapsis = sectors.map(() => ({ min: Infinity, max: -Infinity }));

  // Analisi dei dati per trovare i valori estremi
  for (let row of table.rows) {
    let countryCode = row.get("COUNTRY_CODE");
    let sectorIndex = countryCodes.indexOf(countryCode);
    if (sectorIndex !== -1) {
      let periapsis = row.getNum("PERIAPSIS");
      if (periapsis < sectorPeriapsis[sectorIndex].min) sectorPeriapsis[sectorIndex].min = periapsis;
      if (periapsis > sectorPeriapsis[sectorIndex].max) sectorPeriapsis[sectorIndex].max = periapsis;
    }
  }

  // Generazione dei punti per ogni settore
  for (let i = 0; i < 98; i++) {
    let countryCode = sectors[i].countryCode;
    let numEvents = countryEventCount[countryCode] || 0;

    for (let j = 0; j < numEvents; j++) {
      // Calcolo dell'angolo per il punto
      let angle1 = map(i, 0, 98, 0, 360);
      let angle2 = map(i + 1, 0, 98, 0, 360);
      let randomAngle = random(angle1, angle2);

      // Calcolo della distanza in base al periapside
      let periapsis = table.getNum(j, "PERIAPSIS");
      let mappedDistance = map(
        periapsis,
        sectorPeriapsis[i].min,
        sectorPeriapsis[i].max,
        sizes.minRadius,
        sizes.maxRadius
      );

      // Vincolo della distanza entro i limiti del settore
      let constrainedDistance = constrain(mappedDistance, sizes.minRadius, sizes.maxRadius);

      // Calcolo delle coordinate finali del punto
      let x = centerX + constrainedDistance * cos(randomAngle);
      let y = centerY + constrainedDistance * sin(randomAngle);

      // Estrazione dell'anno di lancio
      let launchDate = table.getString(j, "LAUNCH_DATE");
      let launchYear = int(launchDate.substring(0, 4));

      // Aggiunta del punto all'array
      points.push({ x, y, year: launchYear, color: "#000000" });
    }
  }
}

// VISUALIZZAZIONE DEI DETRITI SPAZIALI
function drawDots() {
  const sizes = getGraphSize();
  selectedYear = slider.value();

  for (let point of points) {
    if (point.year <= selectedYear) {
      // Calcolo della sfumatura di grigio in base all'età del detrito
      let yearsAgo = selectedYear - point.year;
      let grayValue = map(yearsAgo, 0, 60, 0, 255);
      grayValue = constrain(grayValue, 0, 255);
      
      // Disegno del punto rappresentante il detrito
      fill(grayValue);
      noStroke();
      ellipse(point.x, point.y, sizes.dotSize, sizes.dotSize);
    }
  }
}

// GESTIONE E VISUALIZZAZIONE DELLE NOTIZIE
function drawNewsBox() {
  // Ricerca delle notizie fino all'anno selezionato
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
  
  // Visualizzazione delle notizie trovate
  if (notizieDaMostrare.length > 0) {
    // Configurazione dimensioni e posizione del box notizie
    let boxWidth = 350;
    let boxHeight = 200;
    let baseX = width - boxWidth - 20;
    let baseY = windowHeight/2 -100;
    let padding = 15;
    let visibleHeight = 5;
    let offsetY = visibleHeight;
    
    // Dimensioni delle immagini nelle notizie
    let imgSize = 150;
    let imgPadding = 10;

    // Inizializzazione delle posizioni delle carte
    while (cardPositions.length < notizieDaMostrare.length) {
      cardPositions.push(baseY - boxHeight);
      cardTargets.push(baseY);
    }

    // Aggiornamento delle posizioni target
    for (let i = 0; i < notizieDaMostrare.length; i++) {
      cardTargets[i] = baseY + (i * offsetY);
    }

    // Animazione delle posizioni
    for (let i = 0; i < cardPositions.length; i++) {
      let target = cardTargets[i];
      cardPositions[i] += (target - cardPositions[i]) * ANIMATION_SPEED;
    }
    
    // Disegno delle carte notizie
    for (let i = 0; i < notizieDaMostrare.length; i++) {
      let notizia = notizieDaMostrare[i];
      let boxX = baseX;
      let boxY = cardPositions[i];
      
      // Sfondo della carta notizia
      fill(255);
      stroke(0);
      strokeWeight(1.5);
      rect(boxX, boxY, boxWidth, boxHeight, 8);
      
      // Area disponibile per il testo
      let maxWidth = boxWidth - (padding * 3) - imgSize;
      
      // Formattazione del testo
      noStroke();
      fill(0);
      textAlign(LEFT, TOP);
      
      let textX = boxX + padding;
      let textY = boxY + padding;
      let lineHeight = 18;
      
      // Contenuto della notizia
      textSize(16);
      text(notizia.testo, textX, textY, maxWidth);
      
      // Anno della notizia
      textStyle(NORMAL);
      textSize(16);
      let bottomY = boxY + boxHeight - padding - lineHeight * 2;
      text(notizia.anno, textX, bottomY);
      
      // Paese di riferimento
      fill(255);
      stroke(0);
      strokeWeight(1.5);
      textFont(fontRubik);
      textSize(18);
      text(notizia.paese, textX, bottomY + lineHeight);
      
      // Immagine associata alla notizia
      let imgIndex = i % 16;
      let imgWidth = imgSize;
      let imgHeight = (imgWidth / eval(`imgn${imgIndex + 1}`).width) * eval(`imgn${imgIndex + 1}`).height;
      image(eval(`imgn${imgIndex + 1}`), boxX + boxWidth - imgWidth - imgPadding, boxY + padding + lineHeight * 2, imgWidth, imgHeight);
      
      // Ripristino font predefinito
      textFont(fontInconsolata);
    }
    
    textAlign(CENTER, CENTER);

    // Pulizia delle carte in eccesso
    while (cardPositions.length > notizieDaMostrare.length) {
      cardPositions.pop();
      cardTargets.pop();
    }
  }
}

// DISEGNO DELLA LEGENDA
function drawLegend() {
  // Configurazione dimensioni e posizioni
  const legendX = 50;
  const legendY = 340;
  const imageWidth = 40;
  const spacing = 60;
  const labels = [
    { img: imgn19, text: "Rifiuto Spaziale" },
  ];

  // Disegno del riquadro della legenda
  noStroke();
  fill(255);
  rect(legendX - 10, legendY - 10, imageWidth + 10 + 150, labels.length * spacing + 20 + 120);

  // Configurazione stile del testo
  noStroke();
  textAlign(LEFT, CENTER);
  textFont(fontRubik);
  textSize(15);
  textStyle(BOLD);
  fill(0);

  // Visualizzazione delle etichette e immagini
  for (let i = 0; i < labels.length; i++) {
    let img = labels[i].img;
    let labelText = labels[i].text.toUpperCase();

    if (img) {
      // Testo dell'etichetta
      text(labelText, legendX, legendY + i * spacing);

      // Calcolo proporzioni immagine
      let imgHeight = imageWidth / (img.width / img.height);

      // Posizionamento immagine
      image(img, legendX + (150 - imageWidth) / 2, legendY + i * spacing + 20, imageWidth, imgHeight);
    }
  }

  // Testo descrittivo della distanza
  textSize(12);
  textStyle(NORMAL);
  text("DISTANZA DALLA TERRA", 
       legendX + (150 - textWidth("DISTANZA DALLA TERRA")) / 2, 
       legendY + labels.length * spacing + 20 + 10);

  // Spiegazione del perigeo
  textFont(fontInconsolata);
  textSize(10);
  textStyle(NORMAL);
  text("È IL PUNTO DI MASSIMA VICINANZA DEL DETRITO ALLA TERRA, MENTRE ORBITA INTORNO AD ESSA",
       legendX + 10,
       legendY + labels.length * spacing + 20 + 50,
       130);

  // Caricamento e visualizzazione immagine perigeo
  let perigeoImg = loadImage('../../img/perigeo.png');
  image(perigeoImg,
        legendX + (150 - imageWidth) / 2,
        legendY + labels.length * spacing + 20 + 70,
        imageWidth,
        imageWidth * (perigeoImg.height / perigeoImg.width));

  // Bordo della legenda
  stroke(0);
  noFill();
  rect(legendX - 10, legendY - 10, imageWidth + 10 + 150, labels.length * spacing + 20 + 120);
}

// DISEGNO DEI RIQUADRI INFORMATIVI
function drawInfoBoxes() {
  // Configurazione dimensioni e posizioni
  let boxWidth = 150;
  let boxHeight = 100;
  let baseX = 20;
  let baseY = height - 200;

  // Creazione dei riquadri informativi
  for (let i = 0; i < 3; i++) {
    let boxY = baseY + i * (boxHeight + padding);

    // Disegno del riquadro
    fill(255);
    stroke(0);
    strokeWeight(1.5);
    rect(baseX, boxY, boxWidth, boxHeight, 8);
  }
}
