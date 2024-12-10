let slider;
let selectedYear = 1960;
let points = [];
let countryCodes = [];
let countryEventCount = {};
const totalDots = 15000;
let sectors = [];
const dotOffset = 40;
let notizieTable;
let notiziaCorrente = null;
let immaginiNotizie = {};
let rocketImg;
let rocketWidth;
let rocketHeight = 50;
let terraImg;
let fontInconsolata;
let fontRubik;
let rotationAngle = 0;
let cardPositions = [];
let cardTargets = [];
let ANIMATION_SPEED = 0.005; // Velocità più fluida per il movimento
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
  'spacex.png': null,
};
let autoPlaySlider = true; // Lo slider parte automaticamente
let autoPlayProgress = 0;

function preload() {
  fontRubik = loadFont('../../fonts/RubikOne.ttf');
  fontInconsolata = loadFont('../../fonts/Inconsolata.ttf');

  rocketImg = loadImage('../../img/razzino.png', img => {
    let ratio = img.width / img.height;
    rocketWidth = rocketHeight * ratio;
  });
  terraImg = loadImage('../../img/leggereterrasottile.png');

  table = loadTable("../../space_decay.csv", "header");
  notizieTable = loadTable("../../notizie.csv", "header");

  for (let nomeImmagine in immaginiPrecaricate) {
    immaginiNotizie[nomeImmagine] = loadImage('img/' + nomeImmagine, 
      () => console.log("Immagine precaricata con successo:", nomeImmagine),
      () => console.error("Errore nel caricamento dell'immagine:", nomeImmagine)
    );
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textFont(fontInconsolata);
  textAlign(CENTER, CENTER);

  slider = createSlider(1960, 2020, 1960, 1);
  slider.position((width - 700) / 2, height - 60);
  slider.style('width', '700px');
  slider.style('height', '0px');
  slider.style('border-radius', '0px');
  slider.style('background', '#ddd');
  slider.style('outline', 'none');
  slider.style('box-shadow', '0 0px opx rgba(0, 0, 0, 0)');
  slider.style('opacity', '0');

  loadCountryCodes();
  generateSectors();
  generateDots();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw(); 
}

function draw() {
  background(240);
  drawHighlightedSector();
  drawCircleWithRays();
  drawDots();
  drawSliderTimeline();
  drawInfoBox();

  // Movimento automatico dello slider più fluido
  if (autoPlaySlider) {
    autoPlayProgress += ANIMATION_SPEED;
    selectedYear = int(lerp(1960, 2020, autoPlayProgress)); // Assicura che selectedYear sia intero
    slider.value(selectedYear);

    if (autoPlayProgress >= 1) {
      autoPlaySlider = false; // Ferma l'autoplay una volta completato
      autoPlayProgress = 0; // Resetta il progresso
      selectedYear = 1960; // Riparte da 1960
      slider.value(selectedYear);
    }
  } else {
    selectedYear = int(slider.value()); // Assicura che la data sia sempre intera
  }
}

function drawSliderTimeline() {
  stroke(0);
  strokeWeight(0);
  fill(0);
  textFont(fontInconsolata);
  textSize(20);
  text(selectedYear, width / 2, height - 100);

  noStroke();
  fill(0);
  textFont(fontInconsolata);
  textSize(14);
  text('1960', (width - 700) / 2 - 30, height - 40);
  text('2020', (width + 700) / 2 + 30, height - 40);

  stroke(0);
  strokeWeight(2);
  let startX = (width - 700) / 2;
  let endX = startX + 700;
  line(startX, height - 55, endX, height - 55);

  if (mouseIsPressed && 
      mouseY > height - 65 && mouseY < height - 45 && 
      mouseX > startX && mouseX < startX + 700) {
    let mouseXPosition = constrain(mouseX, startX, startX + 700);
    let mouseIndex = map(mouseXPosition, startX, endX, 0, 60);
    selectedYear = int(map(mouseIndex, 0, 60, 1960, 2020));
    slider.value(selectedYear);
  }

  let pallinoX = map(selectedYear, 1960, 2020, startX, endX);
  drawRocket(pallinoX, height - 45);
}

function drawCircleWithRays() {
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = 80;
  let rayLength = 200;

  push();
  translate(centerX, centerY);
  rotate(rotationAngle);
  imageMode(CENTER);
  image(terraImg, 0, 0, radius * 2, radius * 2);
  pop();

  rotationAngle += 0.2;

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

function drawRocket(x, y) {
  push();
  translate(x, y);
  imageMode(CENTER);
  image(rocketImg, 0, 0, rocketWidth, rocketHeight);
  pop();
}

function drawDots() {
  for (let point of points) {
    if (point.year <= selectedYear) { 
      let yearsAgo = selectedYear - point.year;
      let grayValue = map(yearsAgo, 0, 60, 0, 255);
      grayValue = constrain(grayValue, 0, 255);

      fill(grayValue);  
      noStroke();
      ellipse(point.x, point.y, 4, 4);
    }
  }
}

function drawHighlightedSector() {
  // Codice per il settore evidenziato
}

function drawInfoBox() {
  // Codice per la casella informativa
}

function loadCountryCodes() {
  if (table.getRowCount() > 0) {
    countryCodes = table.getColumn("COUNTRY_CODE");
    countryCodes = [...new Set(countryCodes)];
    countCountryEvents();
    console.log(`Codici paese caricati: ${countryCodes.length}`);
  } else {
    console.error("Errore nel caricamento del CSV. Controlla il file.");
  }
}

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

function generateSectors() {
  let index = 0;
  for (let i = 0; i < 99; i++) {
    let countryCode = countryCodes[index];
    sectors.push({ countryCode });
    console.log(`Settore ${i + 1}: ${countryCode}`);
    index = (index + 1) % countryCodes.length;
  }
}

function generateDots() {
  let centerX = width / 2;
  let centerY = height / 2;  
  let minRadius = 100;
  let maxRadius = 250;

  for (let i = 0; i < 99; i++) {
    let countryCode = sectors[i].countryCode; 
    let numEvents = countryEventCount[countryCode] || 0; 

    for (let j = 0; j < numEvents; j++) {
      let angle1 = map(i, 0, 99, 0, 360);
      let angle2 = map(i + 1, 0, 99, 0, 360);

      let randomAngle = random(angle1, angle2);
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