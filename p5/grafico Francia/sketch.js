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

function preload() {
  // Carica i font
  inconsolataFont = loadFont('../../fonts/Inconsolata.ttf');
  rubikOneFont = loadFont('../../fonts/RubikOne.ttf');
  terraImg = loadImage('../../img/terra3.png'); // Carica l'immagine

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
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);

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


function draw() {
  background(240);

  // titolo
  textSize(23); 
  stroke(0); 
  fill(0); 
  textFont(rubikOneFont);
  text('RIFIUTI SPAZIALI', 158, 52); 
  //strokeWeight(3); 
  fill(255); 
  textFont(rubikOneFont); 
  text('RIFIUTI SPAZIALI', 160, 50); 

  if (mouseX > 158 && mouseX < 300 && mouseY > 30 && mouseY < 70) {
    cursor(HAND);
    if (mouseIsPressed) {
      window.location.href = '../home/index.html';
    }
  } else {
    cursor(ARROW);
  }

  push();
  // Titolo "FRANCIA" con il font Rubik One e nuovo stile
  fill(0);
  textSize(50);
  textFont(rubikOneFont);
  strokeWeight(0);
  text("FRANCIA", width / 2, 250);

  drawCircleWithRays();
  drawDots();
  drawSelectedYear();
  drawRadialSlider();
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
  noFill();
  stroke(0);
  strokeWeight(2);
  arc(centerX, centerY, radius * 2, radius * 2, 180, 360);
  pop();
}

function generateDotsForYear(year) {
  let centerX = width / 2;
  let centerY = height;
  let minDistance = 450;
  let maxDistance = min(width, height) * 2.2;

  for (let row of satelliteData.rows) {
    let countryCode = row.get('COUNTRY_CODE');
    if (countryCode !== 'FRANCIA') continue;

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

      let col = color(point.color);
      col.setAlpha(alpha);
      fill(col);
      noStroke();

      let d = dist(mouseX, mouseY, point.x, point.y);
      if (d < point.size) {
        hoveredPoint = point;
        strokeWeight(2);
        stroke(0);
      }

      ellipse(point.x, point.y, point.size, point.size);
    }
  }

  if (hoveredPoint) {
    drawTooltip(hoveredPoint);
  }
}

function drawTooltip(point) {
  let tooltipX = mouseX + 20;
  let tooltipY = mouseY;
  let tooltipW = 200;
  let tooltipH = 120;

  if (tooltipX + tooltipW > width) tooltipX = mouseX - tooltipW - 20;
  if (tooltipY + tooltipH > height) tooltipY = mouseY - tooltipH;

  fill(255);
  stroke(0);
  strokeWeight(1);
  rect(tooltipX, tooltipY, tooltipW, tooltipH, 5);

  noStroke();
  fill(0);
  textAlign(LEFT);
  textSize(12);

  let padding = 10;
  let lineHeight = 20;
  text(`Object ID: ${point.objectId}`, tooltipX + padding, tooltipY + padding + lineHeight);
  text(`Launch Site: ${point.site}`, tooltipX + padding, tooltipY + padding + lineHeight * 2);
  text(`Type: ${point.objectType}`, tooltipX + padding, tooltipY + padding + lineHeight * 3);
  text(`Size: ${point.rcsSize}`, tooltipX + padding, tooltipY + padding + lineHeight * 4);
  text(`Apoapsis: ${Math.round(point.apoapsis)} km`, tooltipX + padding, tooltipY + padding + lineHeight * 5);

  textAlign(CENTER, CENTER);
}

function drawSelectedYear() {
  let centerX = width / 2;
  let centerY = height;

  // Nuovo stile per l'anno selezionato
  textSize(32);
  textFont(inconsolataFont);
  strokeWeight(0);
  stroke(0);
  fill(0);
  text(selectedYear, centerX, centerY - 30);
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

  fill(255);
  stroke(0);
  strokeWeight(2);
  ellipse(sliderX, sliderY, 16, 16);

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