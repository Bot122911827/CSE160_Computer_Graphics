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
let g_globalAngle_Y = 0;
let g_NeckAngle = -120;
let g_HeadAngle = 110;
let g_TailAngle = 45;
let g_leg1Angle = 90;
let g_leg2Angle = 0;
let g_leg1_1Angle = 90;
let g_leg2_1Angle = 0;
let g_HeadAnimation=false;
let g_NeckAnimation=false;
let g_Leg1Animation=false;
let g_Leg2Animation=false;

function addActionsForHtmlUI(){

  //buttons
  document.getElementById("animationNeckOnButton").onclick = function() {g_NeckAnimation=true};
  document.getElementById("animationNeckOffButton").onclick = function() {g_NeckAnimation=false};

  document.getElementById("animationHeadOnButton").onclick = function() {g_HeadAnimation=true};
  document.getElementById("animationHeadOffButton").onclick = function() {g_HeadAnimation=false};

  //leg anime buttons
  document.getElementById("animationLegOnButton").onclick = function() {g_Leg1Animation=true; g_Leg2Animation=true;};
  document.getElementById("animationLegOffButton").onclick = function() {g_Leg1Animation=false; g_Leg2Animation=false;};

  //slider
  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = -this.value; renderScene();});

  document.getElementById('NeckAngle').addEventListener('mousemove', function() {g_NeckAngle = this.value; renderScene();});
  document.getElementById('HeadAngle').addEventListener('mousemove', function() {g_HeadAngle = this.value; renderScene();});

  //shift
  document.addEventListener('click', logKey);

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

  //mouse move
  var currentAngle = [0.0, 0.0]; // Current rotation angle ([x-axis, y-axis] degrees)
  initEventHandlers(canvas, currentAngle);

  // Clear <canvas>
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000;
varg_seconds = performance.now()/1000-g_startTime;

function logKey(e) {
  console.log(e.shiftKey);

  updateAnimationAngles(10);

  renderScene();

  requestAnimationFrame(tick);
}

function tick(){

  g_seconds  =performance.now()/1000-g_startTime;
  //console.log(g_seconds);

  updateAnimationAngles(5);

  renderScene();

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
  renderScene();

}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x, y]);
}



function updateAnimationAngles(speed){
  if (g_HeadAnimation){
    //console.log(Math.sin(g_seconds));
    g_HeadAngle = (110+4*Math.sin(speed*g_seconds));
  }

  if (g_NeckAnimation){
    g_NeckAngle = (-120+4*Math.sin(speed*g_seconds));
  }

  if (g_Leg1Animation){
    g_leg1Angle = (90+10*Math.sin(speed*g_seconds));
    g_leg1_1Angle = (90+10*Math.cos(speed*g_seconds+3));
  }

  if (g_Leg2Animation){
    g_leg2Angle = (10*(Math.cos(speed*g_seconds)));
    g_leg2_1Angle = (10*(Math.sin(speed*g_seconds+3)));
  }

  g_TailAngle = (45+4*(Math.cos(speed*g_seconds)));
}


function initEventHandlers(canvas, currentAngle) {
  var dragging = false;         // Dragging or not
  var lastX = -1, lastY = -1;   // Last position of the mouse

  canvas.onmousedown = function(ev) {   // Mouse is pressed
    var x = ev.clientX, y = ev.clientY;
    // Start dragging if a moue is in <canvas>
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x; lastY = y;
      dragging = true;
    }

  };

  canvas.onmouseup = function(ev) { dragging = false;  }; // Mouse is released

  canvas.onmousemove = function(ev) { // Mouse is moved
    var x = ev.clientX, y = ev.clientY;
    if (dragging) {
      var factor = 100/canvas.height; // The rotation ratio
      var dx = factor * (x - lastX);
      var dy = factor * (y - lastY);
      // Limit x-axis rotation angle to -90 to 90 degrees
      currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
      currentAngle[1] = currentAngle[1] + dx;
      g_globalAngle = -x;
      g_globalAngle_Y = -y;
    }
    lastX = x, lastY = y;
    
  };
}

function renderScene(){

  //pass u_ModelMatrix attribute
  var startTime = performance.now();
  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
  globalRotMat.rotate(g_globalAngle_Y,1,0,0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  //clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //test
  var test = new Cylinder();
  test.color = [1.0,0.0,1.0,1.0];
  test.matrix.translate(0.0 , -0.1, 0.4);
  test.matrix.rotate(g_TailAngle, 1, 0, 0);
  test.matrix.scale(1, 1, 0.5);
  test.render();

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

  //legs

  //leg1_________________________________________________
  //draw leg1 right-front
  var leg1 = new Cube();
  leg1.color = [0.0,1.0,1.0,1.0];
  leg1.matrix.translate(-0.27 , -0.2, -0.48);
  leg1.matrix.rotate(g_leg1_1Angle, 1, 0, 0);
  var leg1Base = new Matrix4(leg1.matrix);
  leg1.matrix.scale(0.11, .2, 0.3);
  leg1.render();

  //draw leg1_b right-front
  var leg1_b = new Cube();
  leg1_b.matrix = leg1Base;
  leg1_b.color = [0.0,1.0,0.0,1.0];
  leg1_b.matrix.translate(0.01 , 0.05, 0.1);
  leg1_b.matrix.rotate(g_leg2_1Angle, 1, 0, 0);
  leg1_b.matrix.scale(0.09, .1, 0.5);
  leg1_b.render();

  //leg2________________________________________________
  //draw leg2 left-front
  var leg2 = new Cube();
  leg2.color = [0.0,1.0,1.0,1.0];
  leg2.matrix.translate(0.16 , -0.2, -0.48);
  leg2.matrix.rotate(g_leg1Angle, 1, 0, 0);
  var leg2Base = new Matrix4(leg2.matrix);
  leg2.matrix.scale(0.11, .2, 0.3);
  leg2.render();

  //draw leg2_b right-front
  var leg2_b = new Cube();
  leg2_b.matrix = leg2Base;
  leg2_b.color = [0.0,1.0,0.0,1.0];
  leg2_b.matrix.translate(0.01 , 0.05, 0.1);
  leg2_b.matrix.rotate(g_leg2Angle, 1, 0, 0);
  leg2_b.matrix.scale(0.09, .1, 0.5);
  leg2_b.render();

  //leg3______________________________________________
  //draw leg3 left-back
  var leg3 = new Cube();
  leg3.color = [0.0,1.0,1.0,1.0];
  leg3.matrix.translate(-0.27 , -0.2, 0.29);
  leg3.matrix.rotate(g_leg1_1Angle, 1, 0, 0);
  var leg3Base = new Matrix4(leg3.matrix);
  leg3.matrix.scale(0.11, .2, 0.3);
  leg3.render();

  //draw leg3_b right-front
  var leg3_b = new Cube();
  leg3_b.matrix = leg3Base;
  leg3_b.color = [0.0,1.0,0.0,1.0];
  leg3_b.matrix.translate(0.01 , 0.05, 0.1);
  leg3_b.matrix.rotate(g_leg2_1Angle, 1, 0, 0);
  leg3_b.matrix.scale(0.09, .1, 0.5);
  leg3_b.render();

  //leg4______________________________________________
  //draw leg4 left-back
  var leg4 = new Cube();
  leg4.color = [0.0,1.0,1.0,1.0];
  leg4.matrix.translate(0.16 , -0.2, 0.29);
  leg4.matrix.rotate(g_leg1Angle, 1, 0, 0);
  var leg4Base = new Matrix4(leg4.matrix);
  leg4.matrix.scale(0.11, .2, 0.3);
  leg4.render();

  //draw leg4_b right-front
  var leg4_b = new Cube();
  leg4_b.matrix = leg4Base;
  leg4_b.color = [0.0,1.0,0.0,1.0];
  leg4_b.matrix.translate(0.01 , 0.05, 0.1);
  leg4_b.matrix.rotate(g_leg2Angle, 1, 0, 0);
  leg4_b.matrix.scale(0.09, .1, 0.5);
  leg4_b.render();

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
