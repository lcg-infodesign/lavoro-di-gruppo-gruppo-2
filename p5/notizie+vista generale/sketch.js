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
  fontRubik = loadFont('assets/RubikOne.ttf');
  fontInconsolata = loadFont('assets/Inconsolata.ttf');

  // Carica le immagini principali
  rocketImg = loadImage('razzino.png', img => {
    let ratio = img.width / img.height;
    rocketWidth = rocketHeight * ratio;
  });
  terraImg = loadImage('leggereterrasottile.png');

  // Carica i dati CSV
  table = loadTable("assets/space_decay.csv", "header");
  notizieTable = loadTable("assets/notizie.csv", "header");
  
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

  // Crea lo slider per selezionare l'anno (nascosto)
  slider = createSlider(1960, 2020, 1960, 1);
  slider.position((width - 700) / 2, height - 60); // Posiziona lo slider al centro in basso
  slider.style('width', '700px');
  slider.style('height', '0px');
  slider.style('border-radius', '0px');
  slider.style('background', '#ddd');
  slider.style('outline', 'none');
  slider.style('box-shadow', '0 0px opx rgba(0, 0, 0, 0)');
  slider.style('opacity', '0');  // Nasconde il slider tipico
  
  // Ottieni i codici paese dal CSV
  loadCountryCodes();
  
  // Genera associazione settori-codici paese
  generateSectors();
  
  // Genera il numero di pallini per ciascun paese
  generateDots();
}

function draw() {
  background(240);
  drawHighlightedSector();
  drawCircleWithRays();
  drawDots();
  drawSliderTimeline();
  drawInfoBox();
}

function drawSliderTimeline() {
  // Testo sopra lo slider per mostrare l'anno selezionato
  stroke(0);
  strokeWeight(2);
  fill(255);
  textFont(fontRubik);  // Cambio font per l'anno
  textSize(20);
  text(selectedYear, width / 2, height - 100);

  noStroke();
  fill(0);
  // Torna a Inconsolata per le etichette
  textFont(fontInconsolata);
  textSize(14);
  text('1960', (width - 700) / 2 - 30, height - 40);  // Etichetta 1960
  text('2020', (width + 700) / 2 + 30, height - 40);  // Etichetta 2020

  // Disegna la linea nera continua
  stroke(0);  // Colore nero
  strokeWeight(2);  // Spessore della linea
  let startX = (width - 700) / 2;
  let endX = startX + 700;
  line(startX, height - 55, endX, height - 55);  // Linea continua

  // Aggiorna selectedYear solo se il mouse è premuto e si trova sopra lo slider
  if (mouseIsPressed && 
      mouseY > height - 65 && mouseY < height - 45 && 
      mouseX > startX && mouseX < startX + 700) {
    let mouseXPosition = constrain(mouseX, startX, startX + 700);
    let mouseIndex = map(mouseXPosition, startX, startX + 700, 0, 60);
    selectedYear = int(map(mouseIndex, 0, 60, 1960, 2020));
    slider.value(selectedYear);
  }

  // Disegna il razzo sulla timeline
  let pallinoX = map(selectedYear, 1960, 2020, startX, startX + 700);
  drawRocket(pallinoX, height - 45);
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
  let index = 0;
  // Associa un codice paese a ciascun settore
  for (let i = 0; i < 99; i++) {
    let countryCode = countryCodes[index];
    
    // Aggiungi un oggetto settore con il codice paese
    sectors.push({ countryCode });

    // Stampa il codice del paese per ogni settore
    console.log(`Settore ${i + 1}: ${countryCode}`);
    
    // Incrementa l'indice e cicla sui codici paese
    index = (index + 1) % countryCodes.length; // Se ci sono meno di 99 codici, si ripetono
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
        let textToShow = `${countryName}`;  // Testo da visualizzare

        // Calcola la posizione per disegnare il nome del paese accanto al mouse
        let offsetX = 20;  // Offset per separare il nome dal mouse
        let offsetY = -20;  // Offset verticale
        textSize(16);
        fill(0);
        text(textToShow, mouseX + offsetX, mouseY + offsetY); // Posiziona il testo vicino al mouse
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
    let baseY = 20;
    let padding = 15;
    let visibleHeight = 30;
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