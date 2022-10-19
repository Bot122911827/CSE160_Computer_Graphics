// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
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
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
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
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  //set initial value
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
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
let g_globalAngle = 0;
let g_NeckAngle = -120;
let g_HeadAngle = 110;
let g_HeadAnimation=false;
let g_NeckAnimation=false;

function addActionsForHtmlUI(){

  //buttons
  document.getElementById("animationNeckOnButton").onclick = function() {g_NeckAnimation=true};
  document.getElementById("animationNeckOffButton").onclick = function() {g_NeckAnimation=false};

  document.getElementById("animationHeadOnButton").onclick = function() {g_HeadAnimation=true};
  document.getElementById("animationHeadOffButton").onclick = function() {g_HeadAnimation=false};

  //slider
  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = -this.value; renderAllShapes();});

  document.getElementById('NeckAngle').addEventListener('mousemove', function() {g_NeckAngle = this.value; renderAllShapes();});
  document.getElementById('HeadAngle').addEventListener('mousemove', function() {g_HeadAngle = this.value; renderAllShapes();});

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
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000;
varg_seconds = performance.now()/1000-g_startTime;

function tick(){

  g_seconds  =performance.now()/1000-g_startTime;
  //console.log(g_seconds);

  updateAnimationAngles();

  renderAllShapes();

  requestAnimationFrame(tick);
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

function updateAnimationAngles(){
  if (g_HeadAnimation){
    //console.log(Math.sin(g_seconds));
    g_HeadAngle = (110+4*Math.sin(5*g_seconds));
  }

  if (g_NeckAnimation){
    g_NeckAngle = (-120+4*Math.sin(5*g_seconds));
  }
}

function renderAllShapes(){

  //pass u_ModelMatrix attribute
  var startTime = performance.now();
  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  //clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //draw red body
  var body = new Cube();
  body.color = [1.0,0.0,0.0,1.0];
  body.matrix.translate(-0.3, -0.3, -0.5);
  body.matrix.rotate(0, 1, 0, 0);
  body.matrix.scale(0.6, .3, 1);
  body.render();

  //draw yellow neck
  var yellowNeck = new Cube();
  yellowNeck.color = [1, 1, 0, 1];
  yellowNeck.matrix.translate(-0.16, 0, -0.2);
  yellowNeck.matrix.rotate(g_NeckAngle, 1, 0, 0);
  var BlackBase = new Matrix4(yellowNeck.matrix);
  yellowNeck.matrix.scale(0.3, .3, .5);
  yellowNeck.render();

  //draw White head
  var whiteHead = new Cube();
  whiteHead.matrix = BlackBase;
  whiteHead.color = [1, 1, 1, 1];
  whiteHead.matrix.translate(-0.05, 0, 0.5);
  whiteHead.matrix.rotate(g_HeadAngle, 1, 0, 0);
  whiteHead.matrix.scale(0.4, 0.3, 0.5);
  whiteHead.matrix.rotate(-180, 1, 0, 0);
  whiteHead.render();

  var duration = performance.now() - startTime;
  sendTextToHTML( " ms: " + Math.floor(duration) + " fps " + Math.floor(1000/duration), "texts");

}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm){
    console.log("Failed to get" + htmlID + "from HTML");
    return;
  }

  htmlElm.innerHTML = text;
}
