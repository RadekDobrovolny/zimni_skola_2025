let canvas;

let myFont;
let bgImg;

let panel;
let textMessages;

let intImgs = [];
let intSounds = [];


function preload() {
  font = loadFont('assets/fonts/font.otf');
  bgImg = loadImage('assets/images/background.jpg');
  textMessages = loadStrings('assets/texts/texts.txt');
  conjs = loadStrings('assets/texts/conjs.txt');

  let imgNames = ["ak.png", "hrib.png", "huba.png", "ihrisko.png", "kabinet.png", "kino.png", "konev.png", "kytka1.png", "kytka2.png", "kytka3.png", "meta.png", "nfjct.png", "pan.png", "slepy.png", "sprcha.png", "vetrak.png", "zachod.png", "zidle.png"];
  for (let name of imgNames) {
    intImgs.push(loadImage('assets/images/' + name));
  }
  
  let sndNames = ["asmr.m4a", "caj.m4a", "cinky.m4a", "cvernovka.m4a", "dvere.m4a", "fixka.m4a", "fukar.m4a", "lednicka.m4a", "slova.m4a", "spacak.m4a", "spacak2.m4a", "sprcha.m4a", "stolicky.m4a", "timi1.m4a", "timi2.m4a", "timi3.m4a", "vlajka.m4a", "vytah.m4a"];
  for (let name of sndNames) {
    intSounds.push(loadSound('assets/sounds/' + name));
  }
}

function setup() {
    const copyrightDiv = document.getElementById('copyright');
    const copyrightHeight = copyrightDiv.offsetHeight;
  
    canvas = createCanvas(windowWidth, windowHeight - copyrightHeight);
    canvas.position(0, 0);

    textFont(font);
    background(bgImg);

    panel = new Panel(textMessages, color("#ff101f"));

    intObj = new InteractiveObj(height * 0.05, "right");
    intObj2 = new InteractiveObj(height * 0.6, "left");

    borderLine = new Border();
}

function draw() {
    // Vypočítáme faktor pro "cover", aby obrázek pokryl celý canvas
    let scaleFactor = max(width / bgImg.width, height / bgImg.height);
    let imgWidth = bgImg.width * scaleFactor;
    let imgHeight = bgImg.height * scaleFactor;
  
    // Vypočítáme odsazení, abychom obrázek vycentrovali
    let x = (width - imgWidth) / 2;
    let y = (height - imgHeight) / 2;
  
    // Vykreslíme obrázek na canvas
    image(bgImg, x, y, imgWidth, imgHeight);

    panel.update();
    panel.show();

    intObj.update();
    intObj.checkCollision(); // kontrola kolize s Border
    intObj.show();

    intObj2.update();
    intObj2.checkCollision(); // kontrola kolize s Border
    intObj2.show();

    borderLine.update();
    borderLine.show();
}

function mousePressed() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }

    intObj.checkClick(mouseX, mouseY);
    intObj2.checkClick(mouseX, mouseY);
}

function windowResized() {
  // Při změně rozměrů okna upravíme velikost canvasu
  const copyrightDiv = document.getElementById('copyright');
  const copyrightHeight = copyrightDiv.offsetHeight;
  resizeCanvas(windowWidth, windowHeight - copyrightHeight);
}


class Panel {
    /**
     * @param {Array} textArray - Pole řetězců, ze kterých se vybírá text.
     * @param {p5.Color} bgColor - Barva pozadí panelu.
     */

    constructor(textArray, bgColor) {
        this.textArray = textArray;
        this.bgColor = bgColor || color(50, 150, 250); // výchozí barva, lze přizpůsobit
        this.currentTextIndex = 0;
        this.lastUpdateTime = millis();

        this.index1 = floor(random(this.textArray.length));
        this.index2 = floor(random(this.textArray.length));
        do {
            this.index2 = floor(random(this.textArray.length));
        } while (this.index1 === this.index2);
        this.indexConj = floor(random(conjs.length));
        this.currentText = (this.textArray[this.index1] + " \n \u{2021}\u{2021}\u{2021} " + conjs[this.indexConj] + " \u{2021}\u{2021}\u{2021} \n" + this.textArray[this.index2]).toUpperCase();
  
        // Nastavení počátečních rozměrů panelu
        this.updateDimensions();
    }
    
    // Aktualizuje rozměry panelu dle aktuální velikosti canvasu
    updateDimensions() {
        // Pokud je šířka canvasu menší než 600, předpokládáme, že se jedná o mobil
        if (width < 600) {
            this.w = width;               // panel bude o 20 % širší než canvas
            this.x = (width - this.w) / 2;        // vycentrování panelu
            this.h = height / 3;                // výška panelu zůstává 1/4 výšky canvasu
        } else {
            this.w = width;
            this.x = 0;
            this.h = height / 3.5;
        }
        this.y = (height - this.h) / 2;         // panel bude vertikálně vycentrovaný
    }
    
    
    // Kontroluje, zda uplynulo 15 sekund, a v případě potřeby změní text
    update() {
        if (millis() - this.lastUpdateTime >= 15000) {
            this.index1 = floor(random(this.textArray.length));
            this.index2 = floor(random(this.textArray.length));
            do {
                this.index2 = floor(random(this.textArray.length));
            } while (this.index1 === this.index2);

            this.indexConj = floor(random(conjs.length));
            
            this.currentTextIndex = (this.currentTextIndex + 1) % this.textArray.length;
            this.currentText = (this.textArray[this.index1] + "\n \u{2021}\u{2021}\u{2021} " + conjs[this.indexConj] + " \u{2021}\u{2021}\u{2021} \n" + this.textArray[this.index2]).toUpperCase();
            this.lastUpdateTime = millis();
        }
    }
    
    // Vykreslí panel a text
    show() {
        // Aktualizace rozměrů při případné změně canvasu
        this.updateDimensions();
      
        // Vykreslení pozadí panelu
        noStroke();
        fill(this.bgColor);
        rect(this.x, this.y, this.w, this.h);
      
        // Vykreslení textu uvnitř panelu
        fill("#d7e3ea"); // barva textu
        textAlign(CENTER, CENTER);
        let fontSize = width < 600 ? this.h * 0.08 : this.h * 0.13;
        textSize(fontSize);
        textLeading(fontSize * 1.5); // případné řádkování
        textWrap(WORD);
        text(this.currentText, this.x, this.y, this.w, this.h);
    }
}
  
class Border {
    constructor() {
      this.thickness = width < 600 ? 60 : 120; // Tloušťka křivky
      this.amplitude = 0.1 * width;      // Maximální odchylka ±10 % šířky canvasu
      this.phase = 0;                  // Počáteční fázový posun
      this.speed = 0.005;              // Rychlost změny fáze (nastavit dle potřeby)
    }
    
    update() {
      // Aktualizace fáze, což způsobuje vlnění křivky
      this.phase += this.speed;
    }
    
    show() {
      // Aktualizace amplitudy při změně velikosti canvasu
      this.amplitude = 0.1 * width;
      
      // Nastavíme blend mode na DIFFERENCE, aby se výsledná barva stala inverzí podkladu
      blendMode(DIFFERENCE);
      
      // Vykreslíme křivku
      stroke("#00FF00");             // Bílá barva při DIFFERENCE režimu invertuje barvy podkladu
      strokeWeight(this.thickness);
      noFill();
      
      beginShape();
      for (let y = 0; y <= height; y += 5) {
        // "Envelope" zajišťuje, že na horním a dolním okraji je posun nulový a uprostřed maximální
        let envelope = 1 - abs(2 * y / height - 1);
        // Výpočet horizontálního posunu s jednou oscilací podél celé výšky
        let offset = this.amplitude * envelope * sin((TWO_PI / height) * y + this.phase);
        // Výchozí pozice je střed canvasu
        let x = width / 2 + offset;
        vertex(x, y);
      }
      endShape();
      
      // Po vykreslení resetujeme blend mode na výchozí režim
      blendMode(BLEND);
    }
  }
  
  

class InteractiveObj {
    /**
     * @param {number} level - Y-ová souřadnice (hladina), ve které se objekt pohybuje.
     * @param {string} initDirection - Počáteční směr: "right" nebo "left".
     */
    constructor(level, initDirection) {
      this.level = level;
      this.direction = initDirection; // "right" nebo "left"
      
      // Načteme první obrázek náhodně z globálního pole intImgs
      this.img = this.getRandomImage();
      
      // Nastavení počáteční pozice mimo obrazovku podle směru
      if (this.direction === "right") {
        // Začne z levé strany (mimo obrazovku)
        this.x = -this.img.width;
      } else {
        // Začne z pravé strany
        this.x = width;
      }
      
      // Nastavení rychlosti (kladná hodnota, její znaménko určí směr)
      this.speed = this.getRandomSpeed();
      if (this.direction === "left") {
        this.speed = -this.speed;
      }
      
      this.moving = true;  // Objekt se pohybuje
      this.collided = false; // Příznak kolize s Border (aby se změna obrázku spustila jen jednou za průjezd)
    }
    
    // Vrátí náhodný obrázek z pole intImgs
    getRandomImage() {
        return random(intImgs);
    }
    
    // Vrátí náhodnou rychlost (v pixelech za snímek); upravte rozsah dle potřeby
    getRandomSpeed() {
        return width < 600 ? random(1, 2) : random(2, 6);
    }

    // Vypočítá škálovací faktor a výsledné rozměry pro vykreslení obrázku
    getScaledDimensions() {
        // Maximální povolená výška obrázku: 15 % výšky canvasu
        const maxHeight = height * .35;
        let scaleFactor = 1;
        if (this.img.height > maxHeight) {
            scaleFactor = maxHeight / this.img.height;
        }
        return {
            w: this.img.width * scaleFactor,
            h: this.img.height * scaleFactor
        };
    }
    
    // Aktualizace polohy objektu
    update() {
      if (this.moving) {
        this.x += this.speed;
      }
      
      // Pokud objekt vyjel mimo obrazovku, resetujeme ho (změní se směr, rychlost i obrázek)
      if (this.direction === "right" && this.x > width) {
        this.reset();
      } else if (this.direction === "left" && (this.x + this.img.width) < 0) {
        this.reset();
      }
    }
    
    // Reset objektu: změní se obrázek, rychlost a směr se obrátí, pozice se nastaví na počátek
    reset() {
      // Obrácení směru
      if (this.direction === "right") {
        this.direction = "left";
        this.x = width; // nově vyjede z pravé strany
      } else {
        this.direction = "right";
        this.x = -this.img.width; // nově vyjede z levé strany
      }
      // Nová rychlost
      let newSpeed = this.getRandomSpeed();
      this.speed = (this.direction === "right") ? newSpeed : -newSpeed;
      
      // Nový obrázek
      this.img = this.getRandomImage();
      
      // Reset příznaku kolize
      this.collided = false;
      
      // Objekt se znovu pohybuje
      this.moving = true;
    }
    
    // Vykreslí objekt (obrázek)
    show() {
        const dims = this.getScaledDimensions();
        image(this.img, this.x, this.level, dims.w, dims.h);
    }
    
    // Zkontroluje, zda bylo kliknuto na objekt; pokud ano, zastaví se a přehraje se náhodný zvuk
    checkClick(mx, my) {
        // Předpokládáme obdélníkovou oblast obrázku
        if (
          mx >= this.x && mx <= this.x + this.img.width &&
          my >= this.level && my <= this.level + this.img.height
        ) {
          if (this.moving) {  // pouze pokud je objekt právě v pohybu
            this.moving = false;
            let snd = random(intSounds);
            snd.play();
            // Po skončení zvuku se pohyb opět spustí
            snd.onended(() => {
              this.moving = true;
            });
          }
        }
      }
    
    checkCollision() {
        // Použijeme škálované rozměry, pokud máte metodu getScaledDimensions() nebo getDrawWidth()
        const dims = this.getScaledDimensions();
        let objCenterX = this.x + dims.w / 2;
        
        if (!this.collided) {
          // Pokud se objekt pohybuje doprava a jeho střed je za středem canvasu,
          // nebo se pohybuje doleva a jeho střed je před středem canvasu:
            if ((this.speed > 0 && objCenterX >= width / 2) || (this.speed < 0 && objCenterX <= width / 2)) {
                this.img = this.getRandomImage();
                this.collided = true;
            }
        }
    }
}