let selectedYear = 1960;
let points = [];
const colors = ["#00bffc","#1b39ff","#9c76ff","#000000", ]; // Nuova palette
const dotOffset = 40; // Offset per creare un anello vuoto attorno al cerchio centrale
const totalSpicchi = 60; // Numero di spicchi
const startYear = 1960; // Anno di inizio
const endYear = 2020; // Anno di fine (correlato al numero di spicchi)
let satelliteData; 
let hoveredPoint = null;
let inconsolataFont, rubikOneFont; // Variabili per i font
let terraImg; // Nuova variabile per l'immagine
let countries = []; // Array per memorizzare i paesi unici
let menuOpen = false; // Variabile per tracciare lo stato del menu
let rocketBodyImage; // Aggiungi questa riga per la variabile dell'immagine del rocket body
let razzinoImage; // Nuova variabile per l'immagine del razzino
let smokePositions = []; // Array per memorizzare le posizioni del fumo

// Add these global variables at the top
let fumoData = []; // Array for storing fixed smoke properties
let numFumo = 75; // Maximum number of smoke puffs
let fumoAspectRatio = 1; // Width/height ratio of smoke images
let autoScroll = true;
let autoScrollSpeed = 0.5;
let autoScrollCompleted = false;
let lastUpdateTime = 0;
let ANIMATION_DURATION = 5000; // 5 seconds for the full animation

function preload() {
  // Carica i font
  inconsolataFont = loadFont('../../fonts/Inconsolata.ttf');
  rubikOneFont = loadFont('../../fonts/RubikOne.ttf');
  terraImg = loadImage('../../img/marenero.png'); // Carica l'immagine
  imgtitolo = loadImage('../../img/titolo.png');
  imgperigeo = loadImage('../../img/perigeo2.png');


  // Carica il CSV
  satelliteData = loadTable('../../space_decay.csv', 'csv', 'header', 
    () => {
      console.log("CSV caricato con successo");
      console.log("Numero di righe:", satelliteData.getRowCount()); // Log per il numero di righe
      console.log("Colonne:", satelliteData.columns); // Log per le colonne

      // Estrai i paesi unici
      let uniqueCountries = new Set();
      for (let row of satelliteData.rows) {
        let country = row.get('COUNTRY_CODE');
        if (country && country.trim() !== '') {
          uniqueCountries.add(country);
          console.log("Aggiunto paese:", country); // Log per ogni paese aggiunto
        }
      }
      countries = Array.from(uniqueCountries).sort();
      console.log("Lista finale dei paesi:", countries); // Log per la lista finale
    },
    (error) => {
      console.error("Errore nel caricamento del CSV:", error); // Log per eventuali errori
    }
  );

  payloadImage = loadImage('../../img/payload.png', 
    () => console.log("Immagine payload caricata con successo"), 
    (error) => console.error("Errore nel caricamento dell'immagine payload:", error)
  ); // Carica l'immagine del payload
  debrisImage = loadImage('../../img/debris.png', 
    () => console.log("Immagine debris caricata con successo"), 
    (error) => console.error("Errore nel caricamento dell'immagine debris:", error)
  ); // Carica l'immagine dei debris
  tbiImage = loadImage('../../img/tbi.png', 
    () => console.log("Immagine TBI caricata con successo"), 
    (error) => console.error("Errore nel caricamento dell'immagine TBI:", error)
  ); // Carica l'immagine TBI
  rocketBodyImage = loadImage('../../img/rocket body.png', // Assicurati di usare il nome corretto
    () => console.log("Immagine rocket body caricata con successo"), 
    (error) => console.error("Errore nel caricamento dell'immagine rocket body:", error)
  ); // Carica l'immagine del rocket body
  razzinoImage = loadImage('../../img/razzino.png', // Carica l'immagine del razzino
    () => console.log("Immagine razzino caricata con successo"), 
    (error) => console.error("Errore nel caricamento dell'immagine razzino:", error)
  ); 
  smokeImage = loadImage('../../img/fumo.png', () => {
    fumoAspectRatio = smokeImage.width / smokeImage.height;
    console.log("Immagine fumo caricata con successo");
    // Precalculate smoke positions after loading
    precalculateFumo();
  }, (error) => console.error("Errore nel caricamento dell'immagine fumo:", error));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);

  let buttonPositions = [
    { x: width - 430, y: 30 },
    { x: width - 300, y: 30 },
    { x: width - 160, y: 30 }
];
createButtons(buttonPositions);
// Aggiungi questa riga per rendere i pulsanti fissi
let buttons = selectAll('button');
buttons.forEach(button => {
    button.style('position', 'fixed');
});


  // Genera tutti i punti una volta sola
  for (let year = startYear; year <= endYear; year++) {
    generateDotsForYear(year);
  }
  createHamburgerMenu();
}

function windowResized() {
  // ridimensiona canvas quando finestra viene ridimensionata
  resizeCanvas(windowWidth, windowHeight);
  redraw(); 
}

function precalculateFumo() {
  let centerX = width / 2;
  let centerY = height;
  let radius = 320;
  let arcLength = PI * radius; // Length of the semicircle
  let step = arcLength / numFumo;

  for (let i = 0; i < numFumo; i++) {
    let angle = map(i, 0, numFumo, 180, 360);
    let randomScale = random(0.8, 1.3);
    let randomRotation = random(-30, 30);
    let randomOffsetR = random(-5, 5);

    fumoData.push({
      angle: angle,
      scale: randomScale,
      rotation: randomRotation,
      offsetR: randomOffsetR
    });
  }
}

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

  // Handle automatic slider advancement
  if (autoScroll && !autoScrollCompleted) {
    let currentTime = millis();
    
    if (lastUpdateTime === 0) {
      lastUpdateTime = currentTime;
    }
    
    let elapsed = currentTime - lastUpdateTime;
    let progress = elapsed / ANIMATION_DURATION;
    
    // Apply easing for deceleration
    let easedProgress = easeOutQuad(progress);
    
    // Update the year based on progress
    selectedYear = Math.round(lerp(1960, 2020, easedProgress));
    
    // Check if animation is complete
    if (progress >= 1) {
      selectedYear = 2020;
      autoScroll = false;
      autoScrollCompleted = true;
    }
  }

  let boxWidth = 270; // Larghezza dei rettangoli
  let boxHeight = 140; // Altezza standard dei rettangoli
  let firstBoxHeight = boxHeight * 1.5; // Altezza del primo rettangolo aumentata di 1.5 volte
  let cornerRadius = 10; // Raggio degli angoli arrotondati
  let startY = (height - (firstBoxHeight + boxHeight * 3 + 30)) / 2 + 50; // Aggiunto 50 per spostare i rettangoli più in basso
  let startX = 30; // Posizione X dei rettangoli
  let spacing = 20; // Distanza tra i rettangoli

  // Disegna il primo rettangolo con altezza aumentata
  fill(255); // Colore bianco
  stroke(0); // Bordo nero
  strokeWeight(2); // Spessore del bordo
  rect(startX, startY, boxWidth, firstBoxHeight, cornerRadius); // Disegna il primo rettangolo

  // Disegna il secondo rettangolo (spostato più in basso)
  fill(255); // Colore bianco
  stroke(0); // Bordo nero
  strokeWeight(2); // Spessore del bordo
  rect(startX, startY + (boxHeight + spacing) +65, boxWidth, boxHeight, cornerRadius); // Disegna il secondo rettangolo più in basso

  // Calcola la posizione X per gli ultimi due rettangoli
  let rightX = width - boxWidth - 30; // Posizione X per gli ultimi due rettangoli

  // Disegna il terzo rettangolo
  fill(255); // Colore bianco
  stroke(0); // Bordo nero
  strokeWeight(2); // Spessore del bordo
  rect(rightX, startY, boxWidth, boxHeight * 1.3, cornerRadius); // Allunga il terzo rettangolo

  // Disegna il quarto rettangolo (alla stessa altezza del secondo)
  fill(255); // Colore bianco
  stroke(0); // Bordo nero
  strokeWeight(2); // Spessore del bordo
  rect(rightX, startY + (boxHeight + spacing) + 37, boxWidth, boxHeight * 0.8, cornerRadius); // Accorcia il quarto rettangolo
  
  textFont(rubikOneFont); // Font Rubik
  textAlign(LEFT, TOP); // Allineamento del testo
  let textX = 42; // Posizione X del testo
  let textY = (height - boxHeight) / 2 -198; // Modificato per allineare il testo con il primo rettangolo
  

  // Aggiungi il resto del testo all'interno del rettangolo
  fill(0); // Colore del testo per il resto
  strokeWeight(0); // Nessuno stroke per il resto del testo
  textSize(18); // Dimensione del testo per RIFIUTI SPAZIALI, TIPOLOGIE, DIMENSIONE
  textAlign(LEFT, TOP); // Allineamento del testo
  text("RIFIUTI SPAZIALI", textX, textY); // Testo "RIFIUTI SPAZIALI"

  textY += 25; // Sposta ulteriormente la posizione Y per "TIPOLOGIE"
  text("TIPOLOGIE", textX, textY); // Testo "TIPOLOGIE"

  // Imposta il font Inconsolata per le voci specifiche
  textFont(inconsolataFont); // Font Inconsolata
  textSize(14); // Dimensione del testo per PAYLOAD, TBA, ROCKET BODY
  textY += 35; // Sposta la posizione Y per le voci specifiche
  text("PAYLOAD      To Be Identified  ", textX, textY); // Voce "PAYLOAD"
  // Sostituisci il rettangolo nero con l'immagine payload
  let payloadImageX = textX; // Posizione X dell'immagine
  let payloadImageY = textY + 20; // Posizione Y dell'immagine
  image(payloadImage, payloadImageX, payloadImageY, 50, 40); // Disegna l'immagine al posto del rettangolo nero
  let tbiX = textX; // Posizione X dell'immagine
  let tbiY = textY + 20; // Posizione Y dell'immagine
  image(tbiImage, tbiX+125, tbiY, 40, 40); // Disegna l'immagine al posto del rettangolo nero
  
  
  
  
  textY += 70; // Sposta la posizione Y per "ROCKET BODY" (aumentato per più spazio)
  text("ROCKET BODY       DETRITO", textX, textY); // Voce "ROCKET BODY"

  // Disegna un rettangolo nero tra "ROCKET BODY" e "DIMENSIONE"
  let rocketX = textX; // Posizione X dell'immagine
  let rocketY = textY + 20; // Posizione Y dell'immagine
  image(rocketBodyImage, rocketX+10, rocketY, 30, 30); // Disegna l'immagine al posto del rettangolo nero
  
  
  let debrisX = textX; // Posizione X dell'immagine
  let debrisY = textY; // Posizione Y dell'immagine
  image(debrisImage, debrisX+120, debrisY, 60, 60); // Disegna l'immagine al posto del rettangolo nero
  

  textY += 96; // Sposta la posizione Y per il resto del testo (aumentato per più spazio)
  textFont(rubikOneFont); // Font Rubik
  textSize(18); // Dimensione del testo per DIMENSIONE

  text("DIMENSIONE", textX, textY); // Resto del testo

  textFont(inconsolataFont); // Font Inconsolata
  textSize(12);
  // Aggiungi il nuovo testo richiesto
  textY += 35; // Sposta la posizione Y per "DIMENSIONE"
  text("Piccolo       Medio       Grande", textX, textY); // Voce "Piccolo,"
  image(tbiImage, textX + 15, textY+ 20, 20, 20);
  image(tbiImage, textX + 80, textY+ 10, 40, 40);
  image(tbiImage, textX + 140, textY+ 5, 60, 60);

  textFont(inconsolataFont); // Font Inconsolata
  textSize(12);

  textY += 60; // A capo

  text("Intensità della forza radar", textX, textY)
  textY += 40; // A capo

  // Ripristina il font Rubik per il resto del testo
  textFont(rubikOneFont); // Font Rubik
  textSize(18); // Dimensione del testo per DIMENSIONE


  if (imgtitolo) {
    image(imgtitolo, 10, 10, imgtitolo.width * 0.25, imgtitolo.height * 0.25);
  }
  if (mouseX > 50 && mouseX < -30 + imgtitolo.width * 0.25 && mouseY > 30 && mouseY < 20 + imgtitolo.height * 0.25) {
    cursor(HAND);
    if (mouseIsPressed) {
      window.location.href = '../../index.html';
    }
  } else {
    cursor(ARROW);
  }

  push();
  // Titolo "STATI UNITI" con il font Rubik One e nuovo stile
  fill(0);
  textSize(50);
  textFont(rubikOneFont);
  strokeWeight(0);
  textAlign(CENTER, CENTER); // Assicurati che l'allineamento sia centrato
  text("STATI UNITI", width / 2, 250); // Centra il titolo
  pop();

  drawCircleWithRays();
  drawDots();
  drawSelectedYear();
  drawRadialSlider();
  
  // Disegna il tooltip qui, dopo tutti gli altri elementi
  if (hoveredPoint) {
    drawTooltip(hoveredPoint);
  }

  // Aggiungi il testo per il terzo rettangolo (copia speculare)
  textFont(rubikOneFont); // Font Rubik
  textAlign(LEFT, TOP); // Allineamento del testo
  let textXRight = rightX +12 ; // Posizione X del testo a destra
  let textYRight = (height - boxHeight) / 2 -198; // Modificato per allineare il testo con il terzo rettangolo

  // Aggiungi il resto del testo all'interno del terzo rettangolo
  fill(0); // Colore del testo per il resto
  strokeWeight(0); // Nessuno stroke per il resto del testo
  textSize(18); // Dimensione del testo per RIFIUTI SPAZIALI, TIPOLOGIE, DIMENSIONE
  textAlign(LEFT, TOP); // Allineamento del testo
  text("PERIGEO", textXRight, textYRight); // Testo "RIFIUTI SPAZIALI"


  // Imposta il font Inconsolata per le voci specifiche
  textFont(inconsolataFont); // Font Inconsolata
  textSize(14); // Dimensione del testo per PAYLOAD, TBA, ROCKET BODY
  textYRight += 32; // Sposta la posizione Y per le voci specifiche
  text("DISTANZA DALLA TERRA", textXRight, textYRight); // Voce "PAYLOAD"
// Ripristina il font Rubik per il resto del testo
  textYRight += 32; // A capo
//

image(imgperigeo, textXRight, textYRight, imgperigeo.width * 0.17, imgperigeo.height * 0.17);
textYRight += 57; // A capo
textSize(12); // Dimensione del testo per PAYLOAD, TBA, ROCKET BODY

text("Il punto di massima vicinanza del tetrito \nalla terra, mentre orbita intorno ad essa", textXRight, textYRight); // Voce "DISTANZA DALLA TERRA"
// Ripristina il font Rubik per il resto del testo
textY += 52; // A capo

textFont(rubikOneFont); // Font Rubik
textSize(18); // Dimensione del testo per DIMENSIONE
  textYRight += 73; // Sposta la posizione Y per "ANNO"
  text("ANNO", textXRight, textYRight); // Testo "ANNO"

  textFont(inconsolataFont); // Font Inconsolata
  textSize(22);
  textYRight += 30
  text("0000", textXRight, textYRight); // Testo "ANNO"

  // Imposta il font Inconsolata per "anno in cui è stato lanciato il detrito"
  textFont(inconsolataFont); // Font Inconsolata
  textSize(12); // Dimensione del testo per "anno in cui è stato lanciato il detrito"
  textYRight += 37; // Sposta la posizione Y per "anno in cui è stato lanciato il detrito"
  text("Anno in cui è stato lanciato il detrito", textXRight, textYRight); // Resto del testo

  if (imgtitolo) {
    image(imgtitolo, 10, 10, imgtitolo.width * 0.25, imgtitolo.height * 0.25);
  }
  if (mouseX > 50 && mouseX < -30 + imgtitolo.width * 0.25 && mouseY > 30 && mouseY < 20 + imgtitolo.height * 0.25) {
    cursor(HAND);
    if (mouseIsPressed) {
      window.location.href = '../../index.html';
    }
  } else {
    cursor(ARROW);
  }
}


function drawCircleWithRays() {
  let centerX = width / 2;
  let centerY = height;
  let radius = 300;

  push();
  imageMode(CENTER);
  // Disegna solo la metà superiore dell'immagine
  let imgSize = radius * 2;
  image(terraImg, centerX, centerY, imgSize, imgSize);
  
  // Disegna solo il contorno del semicerchio
  
  pop();
}

function generateDotsForYear(year) {
  let centerX = width / 2;
  let centerY = height;
  let minDistance = 450;
  let maxDistance = min(width, height) * 2.2;

  for (let row of satelliteData.rows) {
    let countryCode = row.get('COUNTRY_CODE');
    if (countryCode !== 'STATI UNITI') continue;

    let launchDate = new Date(row.get('LAUNCH_DATE'));
    let launchYear = launchDate.getFullYear();

    if (launchYear === year) {
      let apoapsis = parseFloat(row.get('APOAPSIS'));
      if (isNaN(apoapsis)) continue;

      let constrainedApoapsis = constrain(apoapsis, 0, 1000000);
      let distance = map(constrainedApoapsis, 0, 1000000, minDistance, maxDistance);

      let angle = map(year - startYear, 0, endYear - startYear, 180, 360);
      angle += random(-8, 8);

      let x = centerX + distance * cos(angle);
      let y = centerY + distance * sin(angle);

      let objectType = row.get('OBJECT_TYPE');
      let dotColor;
      switch (objectType) {
        case 'PAYLOAD':
          dotColor = colors[0];
          break;
        case 'ROCKET BODY':
          dotColor = colors[1];
          break;
        case 'DEBRIS':
          dotColor = colors[2];
          break;
        default :
          dotColor = colors[3];
      }

      let rcsSize = row.get('RCS_SIZE');
      let dotSize = 2;
      switch (rcsSize) {
        case 'LARGE':
          dotSize = 8;
          break;
        case 'MEDIUM':
          dotSize = 5;
          break;
        case 'SMALL':
          dotSize = 3;
          break;
      }

      points.push({ 
        x, 
        y, 
        year: launchYear, 
        color: dotColor,
        size: dotSize,
        objectId: row.get('OBJECT_ID'),
        site: row.get('SITE'),
        objectType: row.get('OBJECT_TYPE'),
        rcsSize: row.get('RCS_SIZE'),
        apoapsis: row.get('APOAPSIS')
      });
    }
  }
}

function drawDots() {
  hoveredPoint = null; 

  for (let point of points) {
    if (point.year <= selectedYear) {
      let alpha = map(abs(point.year - selectedYear), 0, 60, 255, 50);
      alpha = constrain(alpha, 50, 255);

      let d = dist(mouseX, mouseY, point.x, point.y);
      if (d < point.size) {
        hoveredPoint = point;
        strokeWeight(2);
        stroke(0);
      }

      // Sostituisci il cerchio con l'immagine del payload solo se il tipo è 'PAYLOAD'
      if (point.objectType === 'PAYLOAD') {
        let enlargedSize = point.size * 3; // Ingrandisci l'immagine del payload
        image(payloadImage, point.x - enlargedSize / 2, point.y - enlargedSize / 2, enlargedSize, enlargedSize); // Usa l'immagine del payload
      } 
      // Sostituisci il cerchio con l'immagine dei debris solo se il tipo è 'DEBRIS'
      else if (point.objectType === 'DEBRIS') {
        let enlargedSize = point.size * 3; // Ingrandisci l'immagine dei debris
        image(debrisImage, point.x - enlargedSize / 2, point.y - enlargedSize / 2, enlargedSize, enlargedSize); // Usa l'immagine dei debris
      } 
      // Sostituisci il cerchio con l'immagine TBI solo se il tipo è 'TO BE IDENTIFIED'
      else if (point.objectType === 'TO BE IDENTIFIED') {
        let enlargedSize = point.size * 3; // Ingrandisci l'immagine TBI
        image(tbiImage, point.x - enlargedSize / 2, point.y - enlargedSize / 2, enlargedSize, enlargedSize); // Usa l'immagine TBI
      } 
      // Sostituisci il cerchio con l'immagine del rocket body solo se il tipo è 'ROCKET BODY'
      else if (point.objectType === 'ROCKET BODY') {
        let enlargedSize = point.size * 3; // Ingrandisci l'immagine del rocket body
        let aspectRatio = rocketBodyImage.width / rocketBodyImage.height; // Calcola il rapporto di aspetto
        let imgWidth = enlargedSize; // Larghezza dell'immagine
        let imgHeight = enlargedSize / aspectRatio; // Calcola l'altezza mantenendo il rapporto di aspetto
        image(rocketBodyImage, point.x - imgWidth / 2, point.y - imgHeight / 2, imgWidth, imgHeight); // Usa l'immagine del rocket body
      } 
      else {
        fill(point.color); // Assicurati di riempire con il colore corretto
        noStroke();
        ellipse(point.x, point.y, point.size, point.size); // Mantieni il cerchio per gli altri tipi
      }
    }
  }

  if (hoveredPoint) {
    drawTooltip(hoveredPoint);
  }
}

// ... existing code ...
function drawTooltip(point) {
  let tooltipX = mouseX + 20;
  let tooltipY = mouseY;
  let tooltipW = 200;
  let tooltipH = 120;

  if (tooltipX + tooltipW > width) tooltipX = mouseX - tooltipW - 20;
  if (tooltipY + tooltipH > height) tooltipY = mouseY - tooltipH;

  // Disegna il tooltip
  fill(255);
  stroke(0);
  strokeWeight(1);
  rect(tooltipX, tooltipY, tooltipW, tooltipH + 10, 5); // Aggiunto padding inferiore di 25 px

  noStroke();
  fill(0);
  textAlign(LEFT);
  textSize(14);
  textFont(inconsolataFont);
  textStyle(BOLD);

  let leftPadding = 25;
  let verticalPadding = 2;
  let lineHeight = 20;
  
  text(`ID oggetto: ${point.objectId}`, tooltipX + leftPadding, tooltipY + verticalPadding + lineHeight);
  text(`Sito di lancio: ${point.site}`, tooltipX + leftPadding, tooltipY + verticalPadding + lineHeight * 2);
  text(`Tipo: ${point.objectType}`, tooltipX + leftPadding, tooltipY + verticalPadding + lineHeight * 3);
  text(`Forza segnale: ${point.rcsSize}`, tooltipX + leftPadding, tooltipY + verticalPadding + lineHeight * 4);
  text(`Perigeo: ${Math.round(point.apoapsis)} km`, tooltipX + leftPadding, tooltipY + verticalPadding + lineHeight * 5);

  textAlign(CENTER, CENTER);
}
// ... existing code ...

function drawSelectedYear() {
  let centerX = width / 2;
  let centerY = height;

  // Nuovo stile per l'anno selezionato
  textSize(32);
  textFont(inconsolataFont);
  strokeWeight(0);
  stroke(0);
  fill(255);
  textAlign(CENTER, CENTER);
  text(selectedYear, centerX, centerY - 55); // Mostra l'anno selezionato
}

function drawRadialSlider() {
  let centerX = width / 2;
  let centerY = height;
  let radius = 320;
  let startAngle = 180;
  let endAngle = 360;
  let interactionRadius = 50; // Raggio di interazione per il clic

  noFill();
  stroke(192);
  strokeWeight(2);
  arc(centerX, centerY, (radius + 20) * 2, (radius + 20) * 2, startAngle, endAngle);

  for (let year = startYear; year <= endYear; year += 10) {
    let angle = map(year, startYear, endYear, startAngle, endAngle);
    let x1 = centerX + (radius + 10) * cos(angle);
    let y1 = centerY + (radius + 10) * sin(angle);
    let x2 = centerX + (radius + 30) * cos(angle);
    let y2 = centerY + (radius + 30) * sin(angle);

    strokeWeight(1);
    line(x1, y1, x2, y2);
    noStroke();
    fill(0);
    textSize(25);
    textFont(inconsolataFont);

    let textY = centerY + (radius + 40) * sin(angle) - 10;
    text(year, centerX + (radius + 60) * cos(angle), textY);
  }

  let sliderAngle = map(selectedYear, startYear, endYear, startAngle, endAngle);
  let sliderX = centerX + (radius + 20) * cos(sliderAngle);
  let sliderY = centerY + (radius + 20) * sin(sliderAngle);

  // Aggiungi la posizione del fumo all'array
  smokePositions.push({ x: sliderX, y: sliderY });

  // Draw smoke effects
  for (let fumo of fumoData) {
    if (fumo.angle <= sliderAngle) {
      let fumoX = centerX + (radius + 20 + fumo.offsetR) * cos(fumo.angle);
      let fumoY = centerY + (radius + 20 + fumo.offsetR) * sin(fumo.angle);
      
      push();
      translate(fumoX, fumoY);
      rotate(radians(fumo.rotation));
      imageMode(CENTER);
      image(smokeImage, 0, 0, 
        25 * fumo.scale, 
        (25 / fumoAspectRatio) * fumo.scale
      );
      pop();
    }
  }

  // Draw rocket with orbital rotation
  let imgWidth = razzinoImage.width * 0.15;
  let imgHeight = razzinoImage.height * 0.15;
  push();
  translate(sliderX, sliderY);
  // Make rocket rotate around the center point
  rotate(radians(sliderAngle));
  imageMode(CENTER);
  image(razzinoImage, 0, 0, imgWidth, imgHeight);
  pop();

  // Limita l'interazione solo se il clic è all'interno del raggio di interazione
  if (mouseIsPressed) {
    let d = dist(mouseX, mouseY, sliderX, sliderY);
    if (d < interactionRadius) {
      let angle = atan2(mouseY - centerY, mouseX - centerX);
      if (angle < 0) angle += 360;
      if (angle >= startAngle && angle <= endAngle) {
        selectedYear = floor(map(angle, startAngle, endAngle, startYear, endYear + 1));
        selectedYear = constrain(selectedYear, startYear, endYear);
      }
    }
  }
}

function createHamburgerMenu() {
  let menuButton = createButton('Cambia Paese'); // Nuovo bottone
  menuButton.class('hamburger-menu');
  menuButton.position(width / 2 - 105, 300); // Centra il bottone orizzontalmente (105px è la metà della larghezza del menu)
  menuButton.style('font-size', '16px'); // Dimensione del bottone
  menuButton.style('background-color', 'white'); // Sfondo bianco
  menuButton.style('border', '2px solid black'); // Bordo nero
  menuButton.style('font-family', 'RubikOne'); // Font RubikOne per il bottone
  menuButton.style('padding', '10px 20px'); // Padding per il bottone
  menuButton.style('width', '220px'); // Imposta la larghezza del bottone per corrispondere al menu
  menuButton.mousePressed(() => {
    toggleMenu();
  });
  
  let dropdownMenu = createDiv('');
  dropdownMenu.class('dropdown-menu');
  dropdownMenu.position(width / 2 - 105, 350); // Sposta il menu a sinistra di 5px
  dropdownMenu.style('display', 'none');
  dropdownMenu.style('width', '200px'); // Aumenta la larghezza del menu
  dropdownMenu.style('height', 'auto'); // Altezza automatica per adattarsi al contenuto
  dropdownMenu.style('background-color', 'white'); // Sfondo bianco per il menu
  dropdownMenu.style('border-radius', '10px'); // Angoli arrotondati
  dropdownMenu.style('padding', '10px'); // Padding per il contenuto del menu
  dropdownMenu.style('border', '2px solid black'); // Aggiungi bordo nero al menu

  // Aggiungi stili per lo slider
  dropdownMenu.style('overflow-y', 'auto'); // Abilita lo slider verticale
  dropdownMenu.style('overflow-x', 'hidden'); // Nascondi lo slider orizzontale
  dropdownMenu.style('background-color', 'white'); // Sfondo dello slider
  dropdownMenu.style('color', 'black'); // Colore del testo

  // Aggiungi stili per la barra dello slider
  let style = document.createElement('style');
  style.innerHTML = `
    .dropdown-menu::-webkit-scrollbar {
      width: 8px; /* Larghezza della barra dello slider */
    }
    .dropdown-menu::-webkit-scrollbar-track {
      background: white; /* Sfondo della barra dello slider */
    }
    .dropdown-menu::-webkit-scrollbar-thumb {
      background: black; /* Colore della barra dello slider */
      border-radius: 10px; /* Angoli arrotondati della barra */
    }
  `;
  document.head.appendChild(style);

  if (countries && countries.length > 0) {
    countries.forEach(country => {
      let countryItem = createDiv(country);
      countryItem.parent(dropdownMenu);
      countryItem.class('country-item');
      countryItem.style('color', 'black');
      countryItem.style('text-align', 'center'); // Centra il testo dei paesi
      countryItem.style('font-family', 'RubikOne'); // Imposta il font RubikOne
      
      // Aggiungi un evento di clic per ogni paese
      countryItem.mousePressed(() => {
        if (country === 'FRANCIA') {
          window.location.href = '../grafico Francia/index.html'; // Modifica il percorso per la Francia
        }
        // Aggiungi qui altre condizioni per altri paesi se necessario
      });
      
      console.log("Aggiunto paese al menu:", country); // Log per debug
    });
  } else {
    console.log("Nessun paese disponibile"); // Log se non ci sono paesi
  }
}

function toggleMenu() {
  let dropdown = select('.dropdown-menu');
  if (dropdown.style('display') === 'none') {
    dropdown.style('display', 'block');
    setTimeout(() => {
      dropdown.addClass('show');
    }, 10);
  } else {
    dropdown.removeClass('show');
    setTimeout(() => {
      dropdown.style('display', 'none');
    }, 300);
  }
}

function updateRazzinoPosition(sliderValue) {
    const curvePoint = getCurvePoint(sliderValue); // Ottieni il punto sulla curva
    const tangentAngle = getTangentAngle(sliderValue); // Calcola l'angolo tangente

    // Posiziona Razzino
    razzino.position.set(curvePoint.x, curvePoint.y); // Imposta la posizione del razzino
    razzino.rotation.z = radians(tangentAngle); // Ruota Razzino per essere tangente
}

// Funzione per calcolare il punto sulla curva
function getCurvePoint(value) {
    let centerX = width / 2;
    let centerY = height;
    let radius = 320; // Raggio dell'arco
    let startAngle = 180; // Angolo di inizio
    let endAngle = 360; // Angolo di fine

    // Calcola l'angolo corrispondente al valore
    let angle = map(value, startYear, endYear, startAngle, endAngle);
    
    // Calcola le coordinate del punto sulla curva
    let x = centerX + radius * cos(radians(angle));
    let y = centerY + radius * sin(radians(angle));

    return { x, y }; // Restituisce un oggetto con le coordinate x e y
}

// Funzione per calcolare l'angolo della tangente
function getTangentAngle(value) {
    let startAngle = 180; // Angolo di inizio
    let endAngle = 360; // Angolo di fine

    // Calcola l'angolo corrispondente al valore
    let angle = map(value, startYear, endYear, startAngle, endAngle);
    console.log("Input Value:", value, "Calculated Angle:", angle); // Log per il debug
    return angle; // Restituisce l'angolo della tangente
}

// Easing function for smooth deceleration
function easeOutQuad(t) {
  return t * (2 - t);
}

// Update mousePressed to prevent interaction during animation
function mousePressed() {
  if (autoScroll || !autoScrollCompleted) {
    return false;
  }
}
