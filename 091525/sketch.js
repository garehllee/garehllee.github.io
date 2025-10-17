let cols = 20;
let alphas = [];
let img;

function preload(){
  Img1 = loadImage('/091525/images/Image-02.svg');
  Img2 = loadImage('/091525/images/Image-03.svg');
  Img3 = loadImage('/091525/images/Image-04.svg');
  Img4 = loadImage('/091525/images/Image-05.svg');
  Img5 = loadImage('/091525/images/Image-06.svg');
  Img6 = loadImage('/091525/images/Image-07.svg');
  Img7 = loadImage('/091525/images/Image-08.svg');
  Img8 = loadImage('/091525/images/Image-09.svg');
  Img9 = loadImage('/091525/images/Image-10.svg');
  Img10 = loadImage('/091525/images/Image-11.svg');
}

function setup() {
  frameRate(6);
  setAttributes('depth', false);
  createCanvas(1350, 900, WEBGL);
  rectMode(CENTER);
  noFill();
  strokeWeight(0);

  // Slider container
  sliderContainer = createDiv();
  sliderContainer.position(20, 20);
  sliderContainer.style('background', 'rgba(0,0,0,0.2)');
  sliderContainer.style('padding', '10px');
  sliderContainer.style('border-radius', '1px');
  sliderContainer.style('font-family', 'Arial, sans-serif');
  sliderContainer.style('color', 'white');
  sliderContainer.style('font-size', '8px');

  // Time slider
  let tLabel = createP('How much experience affects life: 7');
  tLabel.parent(sliderContainer);
  tLabel.style('margin', '3px 0');
  tSlider = createSlider(1, 7, 7);
  tSlider.parent(sliderContainer);
  tSlider.style('width', '100px');
  tSlider.input(() => {
    tLabel.html(`How much experience affects life: ${tSlider.value()}`);
  });

  // Outer radius slider
  let outerRLabel = createP('How different life is after: 3');
  outerRLabel.parent(sliderContainer);
  outerRLabel.style('margin', '3px 0');
  outerRSlider = createSlider(1, 7, 3);
  outerRSlider.parent(sliderContainer);
  outerRSlider.style('width', '100px');
  outerRSlider.input(() => {
    outerRLabel.html(`How different life is after: ${outerRSlider.value()}`);
  });

  // Camera rotation slider
  let CamLabel = createP('How ambiguous the related feelings are: 1');
  CamLabel.parent(sliderContainer);
  CamLabel.style('margin', '3px 0');
  CamSlider = createSlider(1, 7, 1);
  CamSlider.parent(sliderContainer);
  CamSlider.style('width', '100px');
  CamSlider.input(() => {
    CamLabel.html(`How ambiguous the related feelings are: ${CamSlider.value()}`);
  });

  // Shape slider
  let sLabel = createP('How positive the experience impact was: 1');
  sLabel.parent(sliderContainer);
  sLabel.style('margin', '3px 0');
  sSlider = createSlider(1, 7, 1);
  sSlider.parent(sliderContainer);
  sSlider.style('width', '100px');
  sSlider.input(() => {
    sLabel.html(`How positive the experience impact was: ${sSlider.value()}`);
  });

  // initialize alphas
  let timefun = tSlider.value() + 5;
  let cols = round((29 / 8 * timefun - 13.5));
  let rows = round((15 / 29 * cols + 14.5));
  for (let i = 0; i < cols * rows; i++) {
    alphas[i] = 100;
  }
}

function draw() {
  frameRate(6);

  // Slider values
  let backgroundValue = 50;
  let hueValue = 50;
  let flashProb = 0;
  let R = outerRSlider.value();
  R = round(-1 * (215 / 3 * (R - 1)) + 500);
  let r = 801 - R;

  let loopDuration = tSlider.value() + 5;
  let totalFrames = loopDuration * 6; // frames per loop
  let percent = (frameCount % totalFrames) / totalFrames;
  let phase = percent * TWO_PI;

  let cam = CamSlider.value();
  let sizeVar = round(75 * (cam - 1) + 50);
  let shape = sSlider.value();

  // Colors
  colorMode(HSB, 360, 100, 100, 255);
  background(backgroundValue, 0, 50, 255);

  let cols = round((29 / 8 * (loopDuration) - 13.5));
  let rows = round((15 / 29 * cols + 14.5));

  // breathing scale
  let cycle = sin(phase) * 0.5 + 0.5;
  let sizex = lerp(30, 30 + sizeVar, cycle);
  let sizey = lerp(30, 30 + sizeVar, cycle);

  // camera loop
  let spinPhase = phase;
  if (cam === 0) orbitControl();
  if (cam === 1) rotateZ(spinPhase);
  if (cam === 2) rotateX(spinPhase);
  if (cam === 3) rotateY(spinPhase);
  if (cam === 4) { rotateY(spinPhase); rotateZ(spinPhase); }
  if (cam === 5) { rotateY(spinPhase); rotateX(spinPhase); }
  if (cam === 6) { rotateX(spinPhase); rotateZ(spinPhase); }
  if (cam === 7) { rotateY(spinPhase); rotateX(spinPhase); rotateZ(spinPhase); }

  // torus loop
  for (let i = 0; i < cols; i++) {
    let theta = map(i, 0, cols, 0, TWO_PI);
    for (let j = 0; j < rows; j++) {
      let phi = map(j, 0, rows, 0, TWO_PI);
      let idx = i * rows + j;

      if (random(1) < flashProb) alphas[idx] = 230;
      alphas[idx] = lerp(alphas[idx], 70, 0.05);

      let x = (R + r * cos(phi)) * cos(theta);
      let y = (R + r * cos(phi)) * sin(theta);
      let z = r * sin(phi);

      push();
      translate(x, y, z);

      // texture choice
      if (shape === 1) texture(Img1);
      else if (shape === 2) texture(Img3);
      else if (shape === 3) texture(Img5);
      else if (shape === 4) texture(Img6);
      else if (shape === 5) texture(Img8);
      else if (shape === 6) texture(Img9);
      else if (shape === 7) texture(Img10);

      tint(0, alphas[idx] / 5);
      rect(0, 0, sizex, sizey);
      pop();
    }
  }
}

// function keyPressed() {
//   if (key === 's') {
//     let loopDuration = tSlider.value() + 5;
//     // saveGif('mySketch', loopDuration, { units: 'seconds', delay: 1/6 });
//     save('test.jpg');
//   }
// }
