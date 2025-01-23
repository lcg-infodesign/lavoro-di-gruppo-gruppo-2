let selectedYear = 1960;
let points = [];
const colors = ["#00bffc","#1b39ff","#9c76ff","#f400da", ]; // Nuova palette
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


function preload() {
  // Carica i font
  inconsolataFont = loadFont('../../fonts/Inconsolata.ttf');
  rubikOneFont = loadFont('../../fonts/RubikOne.ttf');
  terraImg = loadImage('../../img/marenero.png'); // Carica l'immagine
  imgtitolo = loadImage('../../img/titolo.png');


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
  smokeImage = loadImage('../../img/fumo.png', // Carica l'immagine del fumo
    () => console.log("Immagine fumo caricata con successo"), 
    (error) => console.error("Errore nel caricamento dell'immagine fumo:", error)
  ); 
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

  image(imgtitolo, 10, 10, imgtitolo.width * 0.25, imgtitolo.height * 0.25);
  if (mouseX > 50 && mouseX < -30 + imgtitolo.width * 0.25 && mouseY > 30 && mouseY < 20 + imgtitolo.height * 0.25) {
    cursor(HAND);
    if (mouseIsPressed) {
      window.location.href = '../../index.html';
    }
  } else {
    cursor(ARROW);
  }

  push();
  // Titolo "USA" con il font Rubik One e nuovo stile
  fill(0);
  textSize(50);
  textFont(rubikOneFont);
  strokeWeight(0);
  text("STATI UNITI", width / 2, 250);

  drawCircleWithRays();
  drawDots();
  drawSelectedYear();
  drawRadialSlider();
  
  // Disegna il tooltip qui, dopo tutti gli altri elementi
  if (hoveredPoint) {
    drawTooltip(hoveredPoint);
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
        default:
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
  rect(tooltipX, tooltipY, tooltipW, tooltipH, 5);

  noStroke();
  fill(0);
  textAlign(LEFT);
  textSize(14);
  textFont(inconsolataFont);
  textStyle(BOLD);

  let leftPadding = 20;
  let verticalPadding = 1;
  let lineHeight = 20;
  
  text(`Object ID: ${point.objectId}`, tooltipX + leftPadding, tooltipY + verticalPadding + lineHeight);
  text(`Launch Site: ${point.site}`, tooltipX + leftPadding, tooltipY + verticalPadding + lineHeight * 2);
  text(`Type: ${point.objectType}`, tooltipX + leftPadding, tooltipY + verticalPadding + lineHeight * 3);
  text(`Size: ${point.rcsSize}`, tooltipX + leftPadding, tooltipY + verticalPadding + lineHeight * 4);
  text(`Apoapsis: ${Math.round(point.apoapsis)} km`, tooltipX + leftPadding, tooltipY + verticalPadding + lineHeight * 5);

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
  text(selectedYear, centerX, centerY - 55);
}

function drawRadialSlider() {
  let centerX = width / 2;
  let centerY = height;
  let radius = 320;
  let startAngle = 180;
  let endAngle = 360;
  let interactionRadius = 50; // Raggio di interazione per il clic

  noFill();
  stroke(0);
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

  // Disegna tutte le immagini del fumo accumulate
  for (let pos of smokePositions) {
    image(smokeImage, pos.x - 14, pos.y - 4, smokeImage.width * 0.25, smokeImage.height * 0.25); // Riduci l'immagine del fumo del 75% e sposta a sinistra
  }

  // Usa l'immagine del razzino invece del cerchio
  let imgWidth = razzinoImage.width * 0.15; // Riduci la dimensione dell'immagine del 50%
  let imgHeight = razzinoImage.height * 0.15;
  push();
  translate(sliderX, sliderY); // Trasla al centro dell'immagine
  rotate(radians(sliderAngle - 90)); // Ruota in base all'angolo dello slider, -90 per orientare verso l'alto
  imageMode(CENTER); // Imposta il modo di immagine al centro
  image(razzinoImage, 0, 0, imgWidth, imgHeight); // Usa l'immagine del razzino ridimensionata
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
  let menuButton = createDiv('►');
  menuButton.class('hamburger-menu');
  menuButton.position(width / 2 - 20, 300); // Posizione della freccia
  menuButton.style('font-size', '16px'); // Dimensione della freccia
  menuButton.style('background-color', 'transparent'); // Rimuovi lo sfondo
  menuButton.style('border', 'none'); // Rimuovi il bordo
  menuButton.mousePressed(() => {
    toggleMenu();
    // Ruota la freccia e cambia il colore di sfondo
    if (menuButton.html() === '►') {
      menuButton.html('▼'); // Cambia la freccia verso il basso
      // Non cambiare il colore di sfondo
    } else {
      menuButton.html('►'); // Cambia la freccia verso destra
      // Non cambiare il colore di sfondo
    }
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
