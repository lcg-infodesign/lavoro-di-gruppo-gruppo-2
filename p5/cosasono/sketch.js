let fontInconsolata;
let fontRubik;
let fontsLoaded = false;
let imgHome1;
let imgHome3;
const scaleFactor = 0.13;

function preload() {
  fontInconsolata = loadFont('../../fonts/Inconsolata.ttf'); 
  fontRubik = loadFont('../../fonts/RubikOne.ttf'); 
//   imgHome1 = loadImage('../../img/home1.png');
//   imgHome3 = loadImage('../../img/home3.png');
//   imgHome2 = loadImage('../../img/home2.png');
imgHome4 = loadImage('../../img/home4.png');
//   imgHome5 = loadImage('../../img/home5.png');
imgHome6 = loadImage('../../img/home6.png');
imgCosa2 = loadImage('../../img/cosa2.png');
imgCosa4 = loadImage('../../img/cosa4.png');
imgCosa5 = loadImage('../../img/cosa5.png');
imgCosa6 = loadImage('../../img/cosa6.png');
imgCosarazzo = loadImage('../../img/cosarazzo.png');
imgCosasuolo = loadImage('../../img/cosasuolo.png');
//   imgHome7 = loadImage('../../img/home7.png');
imgcosaastronauta = loadImage('../../img/cosaastronauta.png');
}

function setup() {
    createCanvas(windowWidth, 3900); 
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

        if (buttonLabels[i] === 'COSA SONO') {
            button.style('background-color', 'black');
            button.style('color', 'white');
            button.style('border', '2px solid white');
        } else {
            button.style('background-color', 'white');
            button.style('color', 'black');
            button.style('border', '2px solid black');
        }
        
        button.mouseOver(() => {
            if (buttonLabels[i] === 'COSA SONO') {
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
            if (buttonLabels[i] === 'COSA SONO') {
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
          }
      });
    }
}

function draw() {
  background('#F2F2F2'); 
  textAlign (CENTER, CENTER);

  // Variabili per il movimento delle immagini
  let time = millis() * 0.001; // Tempo per l'oscillazione
  let floatAmplitude = 10; // Ampiezza del movimento

  //immagini
//   image(imgHome1, 90 + cos(time) * floatAmplitude, 10 + sin(time) * floatAmplitude, imgHome1.width * scaleFactor, imgHome1.height * scaleFactor);
//   image(imgHome3, 410 + cos(time + 1) * floatAmplitude, 390 + sin(time + 1) * floatAmplitude, imgHome3.width * scaleFactor, imgHome3.height * scaleFactor);
//   image(imgHome2, 160 + cos(time + 2) * floatAmplitude, 490 + sin(time + 2) * floatAmplitude, imgHome2.width * scaleFactor, imgHome2.height * scaleFactor);
image(imgHome4, 810 + cos(time + 3) * floatAmplitude, 150 + sin(time + 3) * floatAmplitude, imgHome4.width * 0.2, imgHome4.height * 0.2);
//   image(imgHome5, 1110 + cos(time + 4) * floatAmplitude, 50 + sin(time + 4) * floatAmplitude, imgHome5.width * scaleFactor, imgHome5.height * scaleFactor);
image(imgHome6, 200 + cos(time + 5) * floatAmplitude, 1000 + sin(time + 5) * floatAmplitude, imgHome6.width * scaleFactor, imgHome6.height * scaleFactor);
image(imgCosa2, 600 + cos(time + 5) * floatAmplitude, 800 + sin(time + 5) * floatAmplitude, imgCosa2.width * scaleFactor, imgCosa2.height * scaleFactor);
image(imgCosa4, 900 + cos(time + 5) * floatAmplitude, 1200 + sin(time + 5) * floatAmplitude, imgCosa4.width * scaleFactor, imgCosa4.height * scaleFactor);
image(imgCosa5, 1400 + cos(time + 5) * floatAmplitude, 1450 + sin(time + 5) * floatAmplitude, imgCosa5.width * scaleFactor, imgCosa5.height * scaleFactor);
image(imgCosa6, 200 + cos(time + 5) * floatAmplitude, 1550 + sin(time + 5) * floatAmplitude, imgCosa6.width * scaleFactor, imgCosa6.height * scaleFactor);
image(imgCosarazzo, 1200 + cos(time + 5) * floatAmplitude, 2250 + sin(time + 5) * floatAmplitude, imgCosarazzo.width * scaleFactor, imgCosarazzo.height * scaleFactor);
image(imgCosasuolo, 0, 3740, imgCosasuolo.width * 0.16, imgCosasuolo.height * 0.16);
//   image(imgHome7, 700 + cos(time + 6) * floatAmplitude, 140 + sin(time + 6) * floatAmplitude, imgHome7.width * scaleFactor, imgHome7.height * scaleFactor);
image(imgcosaastronauta, 710 + cos(time + 7) * floatAmplitude, 3100 + sin(time + 7) * floatAmplitude, imgcosaastronauta.width * scaleFactor, imgcosaastronauta.height * scaleFactor);

  // titolo
  textSize(23); 
  stroke(0); 
  fill(0); 
  textFont(fontRubik); 
  text('RIFIUTI SPAZIALI', 158, 52); 
  strokeWeight(3); 
  fill(255); 
  textFont(fontRubik); 
  text('RIFIUTI SPAZIALI', 160, 50); 

  if (mouseX > 158 && mouseX < 300 && mouseY > 30 && mouseY < 70) {
    cursor(HAND);
    if (mouseIsPressed) {
      window.location.href = '../home/index.html';
    }
  } else {
    cursor(ARROW);
  }

  textAlign (LEFT, CENTER);

  //paragrafo1
  textSize(57); 
  stroke (0)
  strokeWeight(7); 
  textLeading(57);
  fill(255); 
  textFont(fontRubik); 
  text('COSA SONO\nI RIFIUTI\nSPAZIALI?', width / 2 - 500, 400); 

  textSize(14);
  textFont(fontInconsolata); 
  textLeading(14);
  noStroke ();
  fill (0);
  text('I rifiuti spaziali sono qualsiasi pezzo di macchinario o detrito\nlasciato dagli esseri umani nello spazio.\nPuò riferirsi a oggetti di grandi dimensioni come satelliti morti che\nhanno fallito o sono rimasti in orbita alla fine della loro missione.\nPuò anche riferirsi a cose più piccole, come pezzi di detriti o macchie\ndi vernice cadute da un razzo.', width / 2 , 600);   

//paragrafo2
textSize(57); 
stroke (0)
strokeWeight(7); 
textLeading(57);
fill(255); 
textFont(fontRubik); 
text('QUANTA SPAZZATURA\nSPAZIALE CE?', width / 2 - 500, 1250); 

textSize(14);
textFont(fontInconsolata); 
textLeading(14);
noStroke ();
fill (0);
text('Mentre ci sono circa 2.000 satelliti attivi in orbita attorno alla Terra\nal momento, ce ne sono anche 3.000 morti che disseminano lo spazio.\nInoltre, ci sono circa 34.000 pezzi di spazzatura spaziale\npiù grandi di 10 centimetri e milioni di pezzi più piccoli\nche potrebbero comunque rivelarsi disastrosi\nse colpissero qualcos altro.', width / 2 , 1100);  

//paragrafo3
textSize(57); 
stroke (0)
strokeWeight(7); 
textLeading(57);
fill(255); 
textFont(fontRubik); 
textAlign (RIGHT)
text('COME ARRIVANO\nI DETRITI\nNELLO SPAZIO?', width / 2 + 450, 1800); 

textSize(14);
textFont(fontInconsolata); 
textLeading(14);
noStroke ();
fill (0);
textAlign (LEFT)
text('Tutti i detriti spaziali provengono dal lancio di oggetti dalla Terra\ne rimangono in orbita finché non rientrano nellatmosfera.\nAlcuni oggetti in orbite più basse di poche centinaia di chilometri\npossono tornare rapidamente. Spesso rientrano nellatmosfera dopo\nalcuni anni e, per la maggior parte, bruciano, quindi non raggiungono\nil suolo. Ma detriti o satelliti lasciati ad altitudini\npiù elevate di 36.000 chilometri, dove i satelliti\nper le comunicazioni e per il meteo sono spesso posizionati in orbite\ngeostazionarie, possono continuare a orbitare attorno alla Terra\nper centinaia o persino migliaia di anni.\n\nAlcuni detriti spaziali derivano da collisioni o test anti-satellite\nin orbita. Quando due satelliti si scontrano, possono frantumarsi\nin migliaia di nuovi pezzi, creando molti nuovi detriti. Ciò è raro,\nma diversi paesi tra cui USA, Cina e India hanno utilizzato missili \nper esercitarsi a far esplodere i propri satelliti. Ciò crea migliaia\ndi nuovi pezzi di detriti pericolosi.', width / 2 - 500, 2070); 

//paragrafo4
textSize(57); 
stroke (0)
strokeWeight(7); 
textLeading(57);
fill(255); 
textFont(fontRubik); 
text('QUALI RISCHI\nRAPPRESENTANO\nPER LESPLORAZIONE\nSPAZIALE?', width / 2 - 500,2600); 

textSize(14);
textFont(fontInconsolata); 
textLeading(14);
noStroke ();
fill (0);
text('Fortunatamente, al momento, la spazzatura spaziale non rappresenta un grosso rischio per i nostri\nsforzi di esplorazione, il pericolo maggiore che rappresenta è per gli altri satelliti in orbita.\nQuesti satelliti devono spostarsi per evitare di essere colpiti da tutti questi detriti spaziali\nin arrivo, per evitare di essere danneggiati o distrutti.\nIn totale, ogni anno vengono eseguite centinaia di manovre anticollisione su tutti i satelliti,\ncompresa la Stazione Spaziale Internazionale (ISS), dove vivono gli astronauti.\nFortunatamente, le collisioni sono rare: un satellite cinese si è rotto a marzo 2021 dopo\nuna collisione. Prima di allora, lultimo satellite a scontrarsi ed essere distrutto da spazzatura\nspaziale era stato nel 2009. E quando si tratta di esplorare oltre lorbita terrestre,\nnessuna delle limitate quantità di spazzatura spaziale là fuori rappresenta un problema.', width / 2 -200 , 2830); 

//paragrafo5
textSize(57); 
stroke (0)
strokeWeight(7); 
textLeading(57);
fill(255); 
textFont(fontRubik); 
textAlign (RIGHT)
text('I DETRITI\nSPAZIALI\nSARANNO\nUN PROBLEMA\nIN FUTURO?', width / 2 + 500, 3400); 

textSize(14);
textFont(fontInconsolata); 
textLeading(14);
noStroke ();
fill (0);
textAlign (LEFT)
text('Potrebbero benissimo esserlo. Diverse aziende\nstanno progettando nuovi grandi gruppi\ndi satelliti, chiamati mega costellazioni,\nche trasmetteranno internet sulla Terra.\nQueste aziende, tra cui SpaceX e Amazon, hanno\nin programma di lanciare migliaia di satelliti\nper raggiungere una copertura globale di internet via\nsatellite. In caso di successo, potrebbero\nesserci altri 50.000 satelliti in orbita.\nCiò significa anche che saranno necessarie molte\npiù manovre di prevenzione delle collisioni.\nA settembre 2019, lAgenzia Spaziale Europea\nha eseguito la sua prima manovra satellitare\nper evitare la collisione con una mega costellazione.\nÈ insolito dover evitare satelliti attivi.\nAssicurandoci che i satelliti vengano rimossi\ndallorbita in un lasso di tempo ragionevole\nuna volta che non sono più attivi, potremo attenuare\nil problema dei rifiuti spaziali in futuro.\nLorbita della Terra ci consente di studiare\nil nostro pianeta, inviare comunicazioni e altro\nancora. È importante che la utilizziamo in modo\nsostenibile, consentendo anche alle generazioni\nfuture di goderne i benefici.', width / 2 - 500, 3425); 
}