let cols = 30;
let alphas = [];
let loopDuration = 30; // seconds for full cycle

// Slider variables
let colorSlider, flashProbSlider, innerRSlider, outerRSlider, sizeVariationSlider;
let sliderContainer;

let font;
// function preload(){
//   font = loadFont('https://fonts.google.com/share?selection.family=Cossette+Titre:wght@400;700');
// }

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  rectMode(CENTER);
  noFill();
  strokeWeight(0.3);
  
  // Create slider container
  sliderContainer = createDiv();
  sliderContainer.position(20, 20);
  sliderContainer.style('background', 'rgba(0,0,0,0.2)');
  sliderContainer.style('padding', '10px');
  sliderContainer.style('border-radius', '1px');
  sliderContainer.style('font-family', 'Arial, sans-serif');
  sliderContainer.style('color', 'white');
  sliderContainer.style('font-size', '8px');
  
      // Rows slider (1-30)
  let rowsLabel = createP('Rows: 20');
  rowsLabel.parent(sliderContainer);
  rowsLabel.style('margin', '3px 0');
  rowsSlider = createSlider(1, 30, 20);
  rowsSlider.parent(sliderContainer);
  rowsSlider.style('width', '100px');
  rowsSlider.input(() => {
    rowsLabel.html(`rows: ${rowsSlider.value()}`);
  });
  let rows = rowsSlider.value();
  
    // Back Color slider
  let backColorLabel = createP('Background Hue: 0');
  backColorLabel.parent(sliderContainer);
  backColorLabel.style('margin', '3px 0');
  backColorSlider = createSlider(0, 360, 0);
  backColorSlider.parent(sliderContainer);
  backColorSlider.style('width', '100px');
  backColorSlider.input(() => {
    backColorLabel.html(`Background Hue: ${backColorSlider.value()}`);
  });
  
      // Back saturation slider 
  let backSatLabel = createP('Background Saturation: 0');
  backSatLabel.parent(sliderContainer);
  backSatLabel.style('margin', '3px 0');
  backSatSlider = createSlider(0, 100, 0);
  backSatSlider.parent(sliderContainer);
  backSatSlider.style('width', '100px');
  backSatSlider.input(() => {
    backSatLabel.html(`Background Saturation: ${backSatSlider.value()}`);
  });
        // Back lightness slider (0-100 for lightness)
  let backLLabel = createP('Background Lightness: 0');
  backLLabel.parent(sliderContainer);
  backLLabel.style('margin', '3px 0');
  backLSlider = createSlider(0, 100, 0);
  backLSlider.parent(sliderContainer);
  backLSlider.style('width', '100px');
  backLSlider.input(() => {
    backLLabel.html(`Background Lightness: ${backLSlider.value()}`);
  });
  
  // Color slider (0-360 for hue)
  let colorLabel = createP('Color Hue: 0');
  colorLabel.parent(sliderContainer);
  colorLabel.style('margin', '3px 0');
  colorSlider = createSlider(0, 360, 0);
  colorSlider.parent(sliderContainer);
  colorSlider.style('width', '100px');
  colorSlider.input(() => {
    colorLabel.html(`Color Hue: ${colorSlider.value()}`);
  });
  
    // Color sat slider (0-100 for sat)
  let colorSatLabel = createP('Color Saturation: 0');
  colorSatLabel.parent(sliderContainer);
  colorSatLabel.style('margin', '3px 0');
  colorSatSlider = createSlider(0, 100, 0);
  colorSatSlider.parent(sliderContainer);
  colorSatSlider.style('width', '100px');
  colorSatSlider.input(() => {
    colorSatLabel.html(`Color Saturation: ${colorSatSlider.value()}`);
  });
  
  // Color lightness slider (0-100 for lightness)
  let colorLLabel = createP('Color Lightness: 0');
  colorLLabel.parent(sliderContainer);
  colorLLabel.style('margin', '3px 0');
  colorLSlider = createSlider(0, 100, 100);
  colorLSlider.parent(sliderContainer);
  colorLSlider.style('width', '100px');
  colorLSlider.input(() => {
    colorLLabel.html(`Color Lightness: ${colorLSlider.value()}`);
  });
  
  // Flash probability slider
  let flashLabel = createP('Flash Probability: 0.0009');
  flashLabel.parent(sliderContainer);
  flashLabel.style('margin', '3px 0');
  flashProbSlider = createSlider(0, 0.002, 0.0009, 0.0001);
  flashProbSlider.parent(sliderContainer);
  flashProbSlider.style('width', '100px');
  flashProbSlider.input(() => {
    flashLabel.html(`Flash Probability: ${flashProbSlider.value().toFixed(3)}`);
  });
  
  // Inner radius slider
  let innerRLabel = createP('Inner Radius: 200');
  innerRLabel.parent(sliderContainer);
  innerRLabel.style('margin', '3px 0');
  innerRSlider = createSlider(50, 800, 200);
  innerRSlider.parent(sliderContainer);
  innerRSlider.style('width', '100px');
  innerRSlider.input(() => {
    innerRLabel.html(`Inner Radius: ${innerRSlider.value()}`);
  });
  
  // Outer radius slider
  let outerRLabel = createP('Outer Radius: 500');
  outerRLabel.parent(sliderContainer);
  outerRLabel.style('margin', '3px 0');
  outerRSlider = createSlider(50, 800, 200);
  outerRSlider.parent(sliderContainer);
  outerRSlider.style('width', '100px');
  outerRSlider.input(() => {
    outerRLabel.html(`Outer Radius: ${outerRSlider.value()}`);
  });
  
  // Size variation slider
  let sizeLabel = createP('Size Variation: 150');
  sizeLabel.parent(sliderContainer);
  sizeLabel.style('margin', '3px 0');
  sizeVariationSlider = createSlider(50, 300, 150);
  sizeVariationSlider.parent(sliderContainer);
  sizeVariationSlider.style('width', '100px');
  sizeVariationSlider.input(() => {
    sizeLabel.html(`Size Variation: ${sizeVariationSlider.value()}`);
  });
  
  for (let i = 0; i < cols * rows; i++) {
    alphas[i] = 100;
  }
}

function draw() {

  // Get slider values
  let backgroundValue = backColorSlider.value();
  let hueValue = colorSlider.value();
  let flashProb = flashProbSlider.value();
  let R = outerRSlider.value(); // major radius (distance from center to tube center)
  let r = innerRSlider.value(); // minor radius (tube radius)
  let sizeVar = sizeVariationSlider.value();
  let backgroundSat = backSatSlider.value();
  let backgroundL = backLSlider.value();
  let colorL = colorLSlider.value();
  let colorSat = colorSatSlider.value();
  // Set color mode to HSB for easier color control
  colorMode(HSB, 360, 100, 100, 255);
  
  background(backgroundValue, backgroundSat, backgroundL, 255);
  let rows = rowsSlider.value();
  
  // get loop progress (0 → 1)
  let t = (millis() / 1000) % loopDuration;
  let phase = map(t, 0, loopDuration, 0, TWO_PI);
  // breathing scale (smoothly loops)
  let cycle = sin(phase) * 0.5 + 0.5;
  let sizex = lerp(10, 100 + sizeVar, cycle); // min, max width
  let sizey = lerp(10, 100 + sizeVar, cycle); // min, max height
  
  // make camera spin loop perfectly
  let spinPhase = map(t, 0, loopDuration, 0, TWO_PI);
  rotateY(spinPhase);
  rotateX(spinPhase);
  
  for (let i = 0; i < cols; i++) {
    let theta = map(i, 0, cols, 0, TWO_PI); // angle around major circle
    for (let j = 0; j < rows; j++) {
      let phi = map(j, 0, rows, 0, TWO_PI); // angle around minor circle
      let idx = i * rows + j;
      
      // occasional flash
      if (random(1) < flashProb) {
        alphas[idx] = 230;
      }
      alphas[idx] = lerp(alphas[idx], 70, 0.05);
      
      // torus position
      let x = (R + r * cos(phi)) * cos(theta);
      let y = (R + r * cos(phi)) * sin(theta);
      let z = r * sin(phi);
      
      push();
      translate(x, y, z);
      
      // Simple approach: align rectangles with torus surface
      // First align with the major circle
      rotateY(theta);
      // Then tilt based on position on minor circle
      rotateX(phi);
      
      stroke(hueValue, colorSat, colorL, alphas[idx]);
      fill(255,0,100,10);
      rect(0, 0, sizex, sizey);
      // ellipse(0,0,sizex,sizey);
      pop();
    }
  }
}