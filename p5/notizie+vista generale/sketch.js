let fumoImg; // Variabile globale per l'immagine del fumo
let fumoAspectRatio = 1; // Rapporto larghezza/altezza delle nuvolette
let slider;
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
let rocketHeight = 50; // Aumentato da 30 a 50 per un razzo più grande
let terraImg;
let fontInconsolata;
let fontRubik;
let rotationAngle = 0;
let cardPositions = []; // Array per tenere traccia delle posizioni delle carte
let cardTargets = [];  // Array per le posizioni target
let ANIMATION_SPEED = 0.15; // Velocità di animazione (0-1)
let immaginiPrecaricate = {
  'apollo11.png': null,
  'sputnik.png': null,
  'gagarin.png': null,
  'apollo13.png': null,
  'skylab.png': null,
  'mir.png': null,
  'challenger.png': null,
  'hubble.png': null,
  'iss.png': null,
  'columbia.png': null,
  'spirit.png': null,
  'spacex.png': null
};

function preload() {
  // Carica i font
  fontRubik = loadFont('../../fonts/RubikOne.ttf');
  fontInconsolata = loadFont('../../fonts/Inconsolata.ttf');

  // Carica le immagini principali
  rocketImg = loadImage('../../img/razzino.png', img => {
    let ratio = img.width / img.height;
    rocketWidth = rocketHeight * ratio;
  });
  terraImg = loadImage('../../img/leggereterrasottile.png');

  // Carica l'immagine del fumo nella funzione preload
  fumoImg = loadImage("../../img/fumo.png", () => {
    // Calcola il rapporto larghezza/altezza una volta caricata l'immagine
    fumoAspectRatio = fumoImg.width / fumoImg.height;
  });

  // Carica i dati CSV
  table = loadTable("../../space_decay.csv", "header");
  notizieTable = loadTable("../../notizie.csv", "header");
  
  // Precarica tutte le immagini delle notizie
  for (let nomeImmagine in immaginiPrecaricate) {
    immaginiNotizie[nomeImmagine] = loadImage('img/' + nomeImmagine, 
      // Callback di successo
      () => console.log("Immagine precaricata con successo:", nomeImmagine),
      // Callback di errore
      () => console.error("Errore nel caricamento dell'immagine:", nomeImmagine)
    );
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textFont(fontInconsolata);
  textAlign(CENTER, CENTER);

  

  // Posizioni pulsanti nella navbar
  let buttonPositions = [
    { x: width - 540, y: 30 },
    { x: width - 430, y: 30 },
    { x: width - 300, y: 30 },
    { x: width - 115, y: 30 }
  ];

  createButtons(buttonPositions);

  // Rendi i pulsanti fissi per il ridimensionamento
  let buttons = selectAll('button');
  buttons.forEach(button => {
    button.style('position', 'fixed');
  });

  // Inizializza altre funzioni del setup
  slider = createSlider(1960, 2020, 1960, 1);
  slider.position((width - 700) / 2, height - 60);
  slider.style('width', '700px');
  slider.style('opacity', '0');

  loadCountryCodes();
  generateSectors();
  generateDots();
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
        } else if (buttonLabels[i] === 'LEGGERE IL GRAFICO') {
            window.location.href = '../leggereilgrafico/index.html';
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

  // Disegna il titolo
  textSize(23); 
  stroke(0); 
  fill(0); 
  textFont(fontRubik);  // Usa il font RubikOne
  text('RIFIUTI SPAZIALI', 158, 52);  // Posizione del titolo
  strokeWeight(3); 
  fill(255); 
  textFont(fontRubik); 
  text('RIFIUTI SPAZIALI', 160, 50);  // Posizione del titolo sopra

  if (mouseX > 158 && mouseX < 300 && mouseY > 30 && mouseY < 70) {
    cursor(HAND);
    if (mouseIsPressed) {
      window.location.href = '../home/index.html';
    }
  } else {
    cursor(ARROW);
  }


  // Resto del codice di rendering
  drawHighlightedSector();
  drawCircleWithRays();
  drawDots();
  drawSliderTimeline();
  drawInfoBox();
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
  stroke(192); // Colore nero
  strokeWeight(2); // Spessore della linea
  let startX = (width - 700) / 2;
  let endX = startX + 700;
  let passedX = map(selectedYear, 1960, 2020, startX, endX); // Posizione massima del cursore
  line(passedX, height - 55, endX, height - 55); // Linea a destra del cursore

  // Disegna i pallini di delimitazione
  fill(0); // Colore nero
  ellipse(startX, height - 55, 10, 10); // Pallino sinistro
  ellipse(endX, height - 55, 10, 10); // Pallino destro

  // Aggiungi fumo cartoon proporzionato lungo lo slider, solo dove il cursore è passato
  let fumoWidth = 30; // Larghezza delle immagini del fumo
  let fumoHeight = fumoWidth / fumoAspectRatio; // Altezza proporzionata

  for (let i = 0; i <= passedX - startX; i += fumoWidth - 5) {
    let fumoX = startX + i;

    // Disegna le nuvolette solo dove il cursore è passato
    if (fumoX <= passedX) {
      image(fumoImg, fumoX, height - 70, fumoWidth, fumoHeight); // Posiziona e ridimensiona l'immagine
    }
  }

  // Aggiorna `selectedYear` se il mouse è sopra lo slider e viene premuto
  if (
    mouseIsPressed &&
    mouseY > height - 65 &&
    mouseY < height - 45 &&
    mouseX > startX &&
    mouseX < endX
  ) {
    let mouseXPosition = constrain(mouseX, startX, endX);
    let mouseIndex = map(mouseXPosition, startX, endX, 0, 60);
    selectedYear = int(map(mouseIndex, 0, 60, 1960, 2020));
    slider.value(selectedYear);
  }

  // Disegna il razzo ruotato di 90° sopra lo slider
  let rocketX = map(selectedYear, 1960, 2020, startX, endX);
  if (rocketX <= endX) {
    drawRocket(rocketX, height - 45); // Posizione del razzo
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
    let boxHeight = 150;
    let baseX = width - boxWidth - 20;
    let baseY = windowHeight/2 -100;
    let padding = 15;
    let visibleHeight = 5;
    let offsetY = visibleHeight;
    
    let imgSize = 100;
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
      textStyle(BOLD);
      textSize(14);
      text(notizia.testo, textX, textY, maxWidth);
      
      // Anno
      textStyle(NORMAL);
      textSize(14);
      let bottomY = boxY + boxHeight - padding - lineHeight * 2;
      text(notizia.anno, textX, bottomY);
      
      // Paese
      fill(255);
      stroke(0);
      strokeWeight(1.5);
      textFont(fontRubik);
      textSize(16);
      text(notizia.paese, textX, bottomY + lineHeight);
      
      // Ritorna al font Inconsolata
      textFont(fontInconsolata);
      
      // Posizione dell'immagine
      let imgX = boxX + boxWidth - imgSize - padding;
      let imgY = boxY + (boxHeight - imgSize) / 2;
      
      if (notizia.immagine && immaginiNotizie[notizia.immagine]) {
        image(immaginiNotizie[notizia.immagine], imgX, imgY, imgSize, imgSize);
      } else {
        stroke(200);
        strokeWeight(1);
        fill(240);
        rect(imgX, imgY, imgSize, imgSize);
        
        fill(150);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(10);
        text('IMG', imgX + imgSize/2, imgY + imgSize/2);
      }
    }
    
    textAlign(CENTER, CENTER);

    // Rimuovi le carte in eccesso se necessario
    while (cardPositions.length > notizieDaMostrare.length) {
      cardPositions.pop();
      cardTargets.pop();
    }
  }
}

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
