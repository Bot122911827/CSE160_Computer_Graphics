// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

//Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

//Consts
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//UI Global
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10.0;
let g_selectedSegment = 10.0;
let g_selectedType = POINT;

function addActionsForHtmlUI(){

  //clear
  document.getElementById('clear').onclick = function() {g_shapesList = []; renderAllShapes(); };
  document.getElementById('draw').onclick = function() {drawAll()};

  //color
  document.getElementById('Red').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100;});
  document.getElementById('Green').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100;});
  document.getElementById('Blue').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100;});
  document.getElementById('Alpha').addEventListener('mouseup', function() {g_selectedColor[3] = this.value/100;});

  //shape
  document.getElementById('square').onclick = function() {g_selectedType = POINT;};
  document.getElementById('triangle').onclick = function() {g_selectedType = TRIANGLE;};
  document.getElementById('circle').onclick = function() {g_selectedType = CIRCLE;};

  //size
  document.getElementById('Size').addEventListener('mouseup', function() {g_selectedSize = this.value;});

  //segment
  document.getElementById('Segment Count').addEventListener('mouseup', function() {g_selectedSegment = this.value;});

}

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if (ev.buttons == 1) {click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

function click(ev) {

  let [x, y] = convertCoordinatesEventToGL(ev);
  
  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE){
    point = new Triangle();
  }else{
    point = new Circle();
    point.segments = g_selectedSegment;
  }
  
  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize
  g_shapesList.push(point);
  
  //Draw every shape that is supposed to be in the canvas
  renderAllShapes();

}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x, y]);
}

function renderAllShapes(){
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

function drawAll(){

  let allPt = [
    [-0.29498579502105715, 0.3249857950210571],
    [-0.15498579502105714, 0.3749857950210571],
    [-0.12498579502105713, 0.3249857950210571],
    [-0.15998579502105714, 0.3299857950210571],
    [-0.19998579502105712, 0.29498579502105715],
    [-0.2649857950210571, 0.29498579502105715],
    [-0.04498579502105713, 0.28498579502105714],
    [-0.3699857950210571, 0.3299857950210571],
    [-0.23498579502105713, 0.4999857950210571],
    [-0.3249857950210571, 0.27498579502105713],
    [-0.17498579502105713, 0.21498579502105714],
    [-0.18998579502105714, 0.15998579502105714],
    [-0.18998579502105714, 0.08498579502105713],
    [-0.18498579502105714, 0.009985795021057129],
    [-0.18498579502105714, -0.05001420497894287],
    [-0.18498579502105714, -0.05501420497894287],
    [-0.17498579502105713, -0.12501420497894286],
    [-0.16998579502105712, -0.18501420497894286],
    [-0.16998579502105712, -0.23501420497894288],
    [-0.16998579502105712, -0.24001420497894288],
    [-0.17498579502105713, -0.24001420497894288],
    [-0.17498579502105713, -0.3100142049789429],
    [-0.17498579502105713, -0.3100142049789429],
    [-0.17498579502105713, -0.3600142049789429],
    [-0.28998579502105715, 0.5049857950210571],
    [-0.28998579502105715, 0.5099857950210571],
    [-0.08998579502105714, 0.5199857950210571],
    [-0.22998579502105712, 0.4399857950210571],
    [-0.08998579502105714, 0.4449857950210571],
    [-0.08998579502105714, 0.4449857950210571],
    [-0.3149857950210571, 0.4349857950210571],
    [-0.14998579502105713, -0.39501420497894285],
    [-0.15998579502105714, -0.4300142049789429],
    [-0.15998579502105714, -0.4350142049789429],
    [-0.14998579502105713, -0.5100142049789429],
    [-0.14998579502105713, -0.5750142049789428],
    [-0.13998579502105712, -0.6300142049789429]

  ];

  for (var i = 0; i < allPt.length; i+=1){
    drawTriangle( [allPt[i][0], allPt[i][1], allPt[i][0]+0.1, allPt[i][1], allPt[i][0], allPt[i][1]+0.1]);
  }
  
}
