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

function preload() {
  // Carica i font
  inconsolataFont = loadFont('../../fonts/Inconsolata.ttf');
  rubikOneFont = loadFont('../../fonts/RubikOne.ttf');
  terraImg = loadImage('../../img/terra3.png'); // Carica l'immagine

  // Carica il CSV
  satelliteData = loadTable('../../space_data.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);

  // Genera tutti i punti una volta sola
  for (let year = startYear; year <= endYear; year++) {
    generateDotsForYear(year);
  }
}

function draw() {
  background(240);

  // Titolo "USA" con il font Rubik One e nuovo stile
  strokeWeight(6);
  stroke(0);
  fill(255);
  textSize(64);
  textFont(rubikOneFont);
  text("USA", width / 2, 250);

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
  let minDistance = 400;
  let maxDistance = min(width, height) * 2.2;

  for (let row of satelliteData.rows) {
    let countryCode = row.get('COUNTRY_CODE');
    if (countryCode !== 'US') continue;

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
  let radius = 300;
  let startAngle = 180;
  let endAngle = 360;

  noFill();
  stroke(0);
  strokeWeight(2);
  arc(centerX, centerY, radius * 2, radius * 2, startAngle, endAngle);

  for (let year = startYear; year <= endYear; year += 10) {
    let angle = map(year, startYear, endYear, startAngle, endAngle);
    let x1 = centerX + radius * cos(angle);
    let y1 = centerY + radius * sin(angle);
    let x2 = centerX + (radius + 20) * cos(angle);
    let y2 = centerY + (radius + 20) * sin(angle);

    strokeWeight(1);
    line(x1, y1, x2, y2);
    noStroke();
    fill(0);
    textSize(14);
    textFont(inconsolataFont);

    let textY = centerY + (radius + 40) * sin(angle) - 10;
    text(year, centerX + (radius + 40) * cos(angle), textY);
  }

  let sliderAngle = map(selectedYear, startYear, endYear, startAngle, endAngle);
  let sliderX = centerX + radius * cos(sliderAngle);
  let sliderY = centerY + radius * sin(sliderAngle);

  fill(255);
  stroke(0);
  strokeWeight(2);
  ellipse(sliderX, sliderY, 16, 16);

  if (mouseIsPressed) {
    let angle = atan2(mouseY - centerY, mouseX - centerX);
    if (angle < 0) angle += 360;
    if (angle >= startAngle && angle <= endAngle) {
      selectedYear = floor(map(angle, startAngle, endAngle, startYear, endYear));
    }
  }
}
