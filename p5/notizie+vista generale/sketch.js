let fumoImg; // Variabile globale per l'immagine del fumo
let fumoAspectRatio = 1; // Rapporto larghezza/altezza delle nuvolette
let fumoData = []; // Array per memorizzare le proprietà fisse delle nuvolette
let numFumo = 40; // Numero massimo di nuvolette di fumo
let slider;

let autoScroll = true; // Variabile per abilitare lo scorrimento automatico
let autoScrollSpeed = 0.5; // Rallentato del 50% rispetto a 1
let autoScrollCompleted = false; // Variabile per indicare se l'auto-scroll è completato

let selectedYear = 1960;
let points = [];
let countryCodes = []; // Array per i codici paese
let countryEventCount = {}; // Conta gli eventi per ciascun paese
const totalDots = 15000;
let sectors = []; // Associa i codici paese ai settori
const dotOffset = 40; // Offset per creare un anello vuoto attorno al cerchio centrale
let notizieTable;
let notiziaCorrente = null;
let immaginiNotizie = {};
let rocketImg;
let rocketWidth;
let rocketHeight = 40; // Aumentato da 30 a 50 per un razzo più grande
let terraImg;
let fontInconsolata;
let fontRubik;
let rotationAngle = 0;
let cardPositions = []; // Array per tenere traccia delle posizioni delle carte
let cardTargets = [];  // Array per le posizioni target
let ANIMATION_SPEED = 0.075; // Rallentato del 50% rispetto a 0.15

let autoScrollProgress = 0; // Variabile che traccia il progresso (0 a 1)
let AUTO_SCROLL_DURATION = 5000; // Durata totale in millisecondi
let lastUpdateTime = 0;


let customCursorImg;

let sound;
let toggleButton; // Variable for the button
let isPlaying = false; // Tracks the audio state


function preload() {
  
  // Carica i font
  fontRubik = loadFont('../../fonts/RubikOne.ttf');
  fontInconsolata = loadFont('../../fonts/Inconsolata.ttf');
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
  imgtitolo = loadImage('../../img/titolo.png');

  


  rocketImg = loadImage('../../img/razzino.png', img => {
    let ratio = img.width / img.height;
    rocketWidth = rocketHeight * ratio;
  });
  terraImg = loadImage('../../img/marenero.png');

  // Carica l'immagine del fumo nella funzione preload
  fumoImg = loadImage("../../img/fumo.png", () => {
    // Calcola il rapporto larghezza/altezza una volta caricata l'immagine
    fumoAspectRatio = fumoImg.width / fumoImg.height;
  });

  // Carica i dati CSV
  table = loadTable("../../space_decay.csv", "header");
  notizieTable = loadTable("../../notizie.csv", "header");

  // Carica l'immagine del cursore
  customCursorImg = loadImage("../../img/cursor.png");

  // Load the audio file in preload
  sound = loadSound('../../space.mp3');
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textFont(fontInconsolata);
  textAlign(CENTER, CENTER);

  noCursor();
  // Imposta il cursore personalizzato
  let cursorURL = "url('../../img/cursor.png'), auto";
  canvas = document.querySelector('canvas');
  canvas.style.cursor = cursorURL;


  // Posizioni pulsanti nella navbar
  let buttonPositions = [
    { x: width - 430, y: 30 },
    { x: width - 300, y: 30 },
    { x: width - 160, y: 30 }
];

  createButtons(buttonPositions);

  // Rendi i pulsanti fissi per il ridimensionamento
  let buttons = selectAll('button');
  buttons.forEach(button => {
    button.style('position', 'fixed');
  });

  // Inizializza altre funzioni del setup
  slider = createSlider(1960, 2020, 1960, 1);
  slider.position((width - slider.width) / 2, height - 60);
  slider.style('width', '700px');
  slider.style('opacity', '0');

  loadCountryCodes();
  generateSectors();
  generateDots();
  // Precalcola i dati del fumo
  precalculateFumo();

 // Create a single toggle button
 toggleButton = createButton('Play Sound'); // Starts with the play icon
 toggleButton.position(30, height - 60);
 toggleButton.mousePressed(toggleAudio);
 sound.setVolume(0.2);
 

}

// Function to toggle audio
function toggleAudio() {
  if (isPlaying) {
    sound.stop();
    toggleButton.html('Play Sound'); // Update to play icon
    isPlaying = false;
  } else {
    sound.play();
    toggleButton.html('Stop'); // Update to stop icon
    isPlaying = true;
  }
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


function windowResized() {
  // ridimensiona canvas quando finestra viene ridimensionata
  resizeCanvas(windowWidth, windowHeight);
  redraw(); 
}

function draw() {
  background(240);

  image(imgtitolo, 10, 10, imgtitolo.width * 0.25, imgtitolo.height * 0.25);
  if (mouseX > 50 && mouseX < -30 + imgtitolo.width * 0.25 && mouseY > 30 && mouseY < 20 + imgtitolo.height * 0.25) {
    cursor(HAND);
    if (mouseIsPressed) {
      window.location.href = '../../index.html';
    }
  } else {
    cursor(ARROW);
  }

  if (autoScroll && !autoScrollCompleted) {
    // Incrementa il progresso temporale
    autoScrollProgress += deltaTime / AUTO_SCROLL_DURATION;

    // Applica easing-out per un rallentamento fluido verso la fine
    let easedProgress = easeOutQuad(autoScrollProgress);


    // Calcola l'anno in base al progresso interpolato
    selectedYear = Math.round(lerp(1960, 2020, easedProgress)); // Arrotonda il valore

    // Blocca il progresso a 1 per evitare overflow
    if (autoScrollProgress >= 1) {
      autoScrollProgress = 1;
      autoScroll = false; // Ferma l'animazione
      autoScrollCompleted = true;
    }

    slider.value(selectedYear); // Aggiorna il valore dello slider
  }
  // Disegna la legenda
  drawLegend();

  drawSliderTimeline();

  // Resto del codice di rendering
  drawHighlightedSector();
  drawCircleWithRays();
  drawDots();
  
  drawInfoBox();

  // Disegna il cursore personalizzato
  if (customCursorImg) {
    image(customCursorImg, mouseX, mouseY, 14, 16); // Dimensioni cursore personalizzate
  }
  
}

function easeOutQuad(t) {
  return t * (2 - t); // Equazione di easing-out quadratica
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
  text('1960', (width - 700) / 2 - 30, height - 55); // Etichetta 1960
  text('2020', (width + 700) / 2 + 30, height - 55); // Etichetta 2020

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

  // Aggiorna `selectedYear` se il mouse è sopra lo slider e viene premuto
  if (
    mouseIsPressed &&
    mouseY > height - 80 && // Ampliato il range verticale sopra lo slider
    mouseY < height - 40 && // Ampliato il range verticale sotto lo slider
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



function drawRocket(x, y) {
  push();
  translate(x, y);
  rotate(90);  // Ruota il razzo di 90°
  imageMode(CENTER);
  image(rocketImg, 0, 0, rocketWidth, rocketHeight);
  pop();
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

function generateDots() {
  let centerX = width / 2;
  let centerY = height / 2;  
  let minRadius = 100;        // Aumentato da 80 a 100 per creare più spazio
  let maxRadius = 250;       // Distanza massima dal centro

  for (let i = 0; i < 99; i++) {
    let countryCode = sectors[i].countryCode; 
    let numEvents = countryEventCount[countryCode] || 0; 

    for (let j = 0; j < numEvents; j++) {
      let angle1 = map(i, 0, 99, 0, 360);
      let angle2 = map(i + 1, 0, 99, 0, 360);

      let randomAngle = random(angle1, angle2);

      // Calcola la distanza radiale
      let randomDist = random(minRadius, maxRadius);

      let x = centerX + randomDist * cos(randomAngle);
      let y = centerY + randomDist * sin(randomAngle);

      let launchDate = table.getString(j, "LAUNCH_DATE");
      let launchYear = int(launchDate.substring(0, 4));

      let color = "#000000";

      points.push({ x, y, year: launchYear, color });
    }
  }
}

function drawCircleWithRays() {
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = 80;
  let rayLength = 200;

  // Disegna l'immagine della terra al posto del cerchio con rotazione
  push();
  translate(centerX, centerY);
  rotate(rotationAngle);
  imageMode(CENTER);
  image(terraImg, 0, 0, radius * 2, radius * 2);
  pop();

  // Incrementa l'angolo di rotazione (modifica questo valore per cambiare la velocità)
  rotationAngle += 0.2;

  // Disegna i raggi invisibili
  for (let i = 0; i < 99; i++) {
    let angle = map(i, 0, 99, 0, 360);
    let x1 = centerX + radius * cos(angle);
    let y1 = centerY + radius * sin(angle);
    let x2 = centerX + (radius + rayLength) * cos(angle);
    let y2 = centerY + (radius + rayLength) * sin(angle);

    stroke(240);
    strokeWeight(0.5);
    line(x1, y1, x2, y2);
  }
}

function drawDots() {
  selectedYear = slider.value();

  for (let point of points) {
    if (point.year <= selectedYear) { 
      // Calcola la differenza tra l'anno selezionato e l'anno di lancio
      let yearsAgo = selectedYear - point.year;

      // Mappa la differenza di anni su una scala di grigi (0 = nero, 255 = bianco)
      let grayValue = map(yearsAgo, 0, 60, 0, 255); // Supponendo una durata massima di 60 anni

      // Assicurati che i valori siano tra 0 (nero) e 255 (bianco)
      grayValue = constrain(grayValue, 0, 255);

      // Imposta il colore in base alla scala di grigi
      fill(grayValue);  
      noStroke();

      // Disegna il pallino
      ellipse(point.x, point.y, 4, 4);
    }
  }
}

function drawHighlightedSector() {
  let centerX = width / 2;
  let centerY = height / 2; // Posiziona il cerchio al centro della pagina
  let radius = 100;
  let rayLength = 200;

  // Calcola la posizione polare del mouse rispetto al centro del cerchio
  let mouseAngle = atan2(mouseY - centerY, mouseX - centerX);
  if (mouseAngle < 0) mouseAngle += 360;
  let mouseDist = dist(mouseX, mouseY, centerX, centerY);

  // Controlla se il mouse è dentro il cerchio
  if (mouseDist > radius + dotOffset && mouseDist < radius + rayLength) {
    for (let i = 0; i < 99; i++) {
      let angle1 = map(i, 0, 99, 0, 360);
      let angle2 = map(i + 1, 0, 99, 0, 360);

      // Controlla se il mouse è in questo settore
      if (mouseAngle >= angle1 && mouseAngle < angle2) {
        fill(80, 80, 80, 80); // Colore evidenziato
        noStroke();
        arc(centerX, centerY, (radius + rayLength) * 2, (radius + rayLength) * 2, angle1, angle2, PIE);

        // Mostra il codice paese e il nome del paese associato
        let countryName = sectors[i].countryCode; // Nome del paese

        // Disegna il nome del paese al centro in alto
        textSize(20);
        textFont(fontRubik)
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
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

push();
function drawInfoBox() {
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

// Aggiungi questa funzione per disegnare il razzo
function drawRocket(x, y) {
  push();
  translate(x, y);
  imageMode(CENTER);
  image(rocketImg, 0, 0, rocketWidth, rocketHeight);
  pop();
}



function createHamburgerMenu() {
  let menuButton = createDiv('');
  menuButton.class('hamburger-menu');
  menuButton.position(50, 80);
  menuButton.mousePressed(toggleMenu);
  
  for (let i = 0; i < 3; i++) {
    let line = createDiv('');
    line.parent(menuButton);
    line.class('menu-line');
  }
  
  let dropdownMenu = createDiv('');
  dropdownMenu.class('dropdown-menu');
  dropdownMenu.position(50, 130);
  dropdownMenu.style('display', 'none');
  
  if (countries && countries.length > 0) {
    countries.forEach(country => {
      let countryItem = createDiv(country);
      countryItem.parent(dropdownMenu);
      countryItem.class('country-item');
      countryItem.style('color', 'black');
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




function drawLegend() {
  const legendX = 50; // Posizione X della legenda
  const legendY = 340; // Posizione Y iniziale della legenda
  const imageWidth = 40; // Larghezza standard delle immagini
  const spacing = 60; // Spaziatura verticale tra le immagini
  const labels = [
    
    { img: imgn19, text: "Rifiuto Spaziale" },
    
  ];

  noStroke();
  textAlign(LEFT, CENTER);
  textFont(fontInconsolata);
  textSize(15);
  textStyle(NORMAL); // Assicura che il testo non sia in bold
  fill(0);

  // Itera tra le immagini e disegna la legenda
  for (let i = 0; i < labels.length; i++) {
    let img = labels[i].img;
    let labelText = labels[i].text;

    if (img) {
      // Calcola l'altezza mantenendo le proporzioni
      let imgHeight = imageWidth / (img.width / img.height);

      // Disegna l'immagine
      image(img, legendX, legendY + i * spacing, imageWidth, imgHeight);

      // Disegna il testo accanto all'immagine
      text(labelText, legendX + imageWidth + 10, legendY + i * spacing + imgHeight / 2);
    }
  }
}

