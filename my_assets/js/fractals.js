/**
 * 
 * Diagram for this use of WebGL

  JS (CPU)            GPU
  │                   │
  │ compile shaders → │
  │ upload uniforms → │
  │ draw call  ─────► │ vertex shader
  │                   │ rasterizer
  │                   │ fragment shader
  │ ◀──── sync only   │ framebuffer

*/

// Import a custom API for rendering
import initFractalRenderer from './fractalRenderer.js';

// Get DOM elements
const selector = document.getElementById('fractal');
const picker = document.getElementById('picker');
const iterSlider = document.getElementById('iterSlider');
const BSlider = document.getElementById('BSlider');
const iterValue = document.getElementById('iterValue');
const BValue = document.getElementById('BValue');
const glcanvas = document.getElementById('glcanvas');
const dragbar = document.getElementById('dragbar');
const status = document.getElementById('status');

//  Handle DOM events
picker.addEventListener('mousedown', startDrag);
picker.addEventListener('mousemove', onDrag);
picker.addEventListener('mouseup', stopDrag);
iterSlider.addEventListener('input', iterSlide);
BSlider.addEventListener('input', BSlide);
dragbar.addEventListener('mousedown', startDragBar);
window.addEventListener('mouseup', stopDragBar);
window.addEventListener('mousemove', dragBar);
glcanvas.addEventListener('click', clicked);
glcanvas.addEventListener('wheel', wheeled, { passive : false });
glcanvas.addEventListener('mousedown', startDragFractal);
window.addEventListener('mouseup', stopDragFractal);
window.addEventListener('mousemove', moveFractal);
window.addEventListener('keydown', keyDown);

// DOM Logic
let draggingBar = false;
let isDragging = false;
let c = { x: 0.0 , y: 0.0 }; // complex parameter
let center = { x: 0.0, y: 0.0 }; 
let scale = 2.0;
let draggingFractal = false;
let lastX = 0; 
let lastY = 0;

// map picker coords [0, 200] \mapsto [-1, 1]
function pickerToC(evt) {
  const rect = picker.getBoundingClientRect();
  let px = (evt.clientX - rect.left) / picker.width  * 2 - 1;
  let py = (evt.clientY - rect.top ) / picker.height * 2 - 1;
  c.x = px;  
  c.y = -py; // flip y for positive = up
  drawPicker();
}
function startDrag(e){ isDragging = true; pickerToC(e); }
function onDrag(e){ if(isDragging) pickerToC(e); }
function stopDrag(){ isDragging = false; }
function iterSlide() { iterValue.textContent = iterSlider.value; }
function BSlide() { BValue.textContent = BSlider.value; }
function startDragBar() { draggingBar = true; }
function stopDragBar() { draggingBar = false; }
function dragBar(e) {
  if (!draggingBar) return;
  const pct = e.clientX / window.innerWidth;
  // clamp between 10 % and 90 %
  const leftW = Math.min(Math.max(pct, 0.1), 0.9) * 100;

  // apply new widths
  document.getElementById('left').style.width = `${leftW}%`;
  document.getElementById('ui').style.width = `${100 - leftW}%`;

  // keep the fractal canvas square
  renderer.resize();
};

function clicked(e) {
    const rect = glcanvas.getBoundingClientRect();
    const x =  (e.clientX - rect.left) / rect.width; // 0-1
    const y =  (e.clientY - rect.top ) / rect.height; // 0-1
    // map to complex coords of the click
    const cx = (x - 0.5) * scale * 2.0 + center.x;
    const cy = (0.5 - y) * scale * 2.0 + center.y; // flip Y
    center.x = cx;
    center.y = cy;
    // zoom in (Shift-click = zoom out)
    scale *= e.shiftKey ? 2.0 : 0.5;
}

function wheeled(e) {
  e.preventDefault();
  scale *= e.deltaY < 0 ? 0.9 : 1.1; // scroll up zooms in
}

// reset button 
document.getElementById('resetBtn').onclick = () => {
  center = { x : 0, y : 0 };
  scale  = 2.0;
  c = { x : 0, y : 0 }; 
  drawPicker();
};

function drawPicker() {
  const ctx = picker.getContext('2d');
  const w = picker.width;
  const h = picker.height;

  // clear
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);

  // draw grid every 0.25 units
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth   = 1;
  for (let i = 0.25; i < 1; i += 0.25) {
    ctx.beginPath();
    ctx.moveTo(i * w, 0); ctx.lineTo(i * w, h); ctx.stroke(); // vertical
    ctx.beginPath();
    ctx.moveTo(0, i * h); ctx.lineTo(w, i * h); ctx.stroke(); // horizontal
  }

  // axes
  ctx.strokeStyle = '#888';
  ctx.beginPath(); ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, h/2); ctx.lineTo(w, h/2); ctx.stroke();

  // red dot
  const dx = (c.x + 1) * 0.5 * w;
  const dy = (1 - (c.y + 1) * 0.5) * h;
  ctx.fillStyle = 'red';
  ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI*2); ctx.fill();
}

function startDragFractal(e) {
  draggingFractal = true;
  lastX = e.clientX;
  lastY = e.clientY;
}

function stopDragFractal() {
  draggingFractal = false;
}

function moveFractal(e) {
  if (!draggingFractal) return;
  const rect = glcanvas.getBoundingClientRect();
  const dx = (e.clientX - lastX) / rect.width;
  const dy = (e.clientY - lastY) / rect.height;
  // translate center by the mouse delta
  center.x -= dx * scale * 2.0;
  center.y += dy * scale * 2.0; // flip Y
  lastX = e.clientX;
  lastY = e.clientY;
}

function keyDown(e) {
  const step = 0.1 * scale * 2.0; // 10% of view
  switch (e.key) {
    case 'ArrowLeft': center.x -= step; break;
    case 'ArrowRight': center.x += step; break;
    case 'ArrowUp': center.y += step; break;
    case 'ArrowDown': center.y -= step; break;
    case '+':
    case '=': scale *= 0.9; break;
    case '-':
    case '_': scale *= 1.1; break;
    default: return; // ignore other keys
  }
  e.preventDefault(); // stop page from scrolling
}

document.getElementById('downloadBtn').onclick = () => {
  const link = document.createElement('a');
  link.download = 'fractal.png';
  link.href = glcanvas.toDataURL('image/png');
  link.click();
};

// ------------------------------------------------------------

// Initialize WebGL fractal renderer
// Handle asynchronously to make the page responsive even while loading the shader files
const renderer = await initFractalRenderer(glcanvas);

// Handle canvas resizing
window.addEventListener('resize', () => renderer.resize());

// Each render loop or frame, uniforms are re-uploaded and issued one gl.drawArrays
function renderLoop() {
  status.textContent = `This is the ${selector.options[selector.selectedIndex].text} set for c = ${c.x.toFixed(3)} ${c.y >= 0 ? '+' : '−'} ${Math.abs(c.y).toFixed(3)} i`;
  // The uniforms are specified in the input dictionary, the renderer will upload them to the GPU
  renderer.draw({
    fractalType: Number(selector.value), // 0, 1, 2, 3, 4, 5
    c: [c.x, c.y], // parameter in the family of Julia/Fatou sets
    maxIter: Number(iterSlider.value), // number of iterations we compute for
    B: Number(BSlider.value), // controls how we judge unbounded behavior
    center: [center.x, center.y], 
    scale: scale
  });
  requestAnimationFrame(renderLoop);
}
// For initializing the picker in the UI
drawPicker();

// For initializing the appropriate size of the canvas
renderer.resize();

// Commence looping!
renderLoop();
