// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'varying vec2 v_UV;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '  v_UV = a_UV;\n' + 
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n' + 
  'uniform vec4 u_FragColor;\n' + 
  'uniform sampler2D u_Sampler0;\n' + 
  'uniform sampler2D u_Sampler1;\n' + 
  'uniform int u_whichTexture;\n' + 
  'void main() {\n' +
  '   if (u_whichTexture == -2){\n' + 
  '     gl_FragColor = u_FragColor;\n' + 
  '   } else if (u_whichTexture == -1){\n' + 
  '     gl_FragColor = vec4(v_UV, 1.0, 1.0);\n' + 
  '   } else if (u_whichTexture == 0){\n' + 
  '     gl_FragColor = texture2D(u_Sampler0, v_UV);\n' + 
  '   } else if (u_whichTexture == -3){\n' + 
  '     gl_FragColor = texture2D(u_Sampler1, v_UV);\n' + 
  '   } else {\n' + 
  '    gl_FragColor = vec4(1, .2, .2, 1);\n' + 
  '   }\n' + 
  '}\n';

//Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;


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

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
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

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_Sampler
  var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
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

function initTextures(index) {

  var image = new Image();  // Create the image object 
    if (!image) {
      console.log('Failed to create the image object');
      return false;
    }

  if (index == 0){
    
    // Register the event handler to be called on loading an image
    image.onload = function(){ sendTextureToTEXTURE0(image); };
   
    // Tell the browser to load an image
    image.src = '../resources/sky.jpg';
  }else if (index == 1){
    // Register the event handler to be called on loading an image
    image.onload = function(){ sendTextureToTEXTURE1(image); };
   
    // Tell the browser to load an image
    image.src = '../resources/Grass.jpg';

  }

  return true;
}

function sendTextureToTEXTURE0(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  
  console.log('finished loadTexture');
}

function sendTextureToTEXTURE1(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit1
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 1 to the sampler
  gl.uniform1i(u_Sampler1, -3);

  console.log('finished loadTexture1');
}

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = click;
  //canvas.onmousemove = function(ev) { if (ev.buttons == 1) {click(ev)}};
  document.onkeydown = keydown;

  initTextures(0);
  initTextures(1);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  

  //mouse move
  //var currentAngle = [0.0, 0.0]; // Current rotation angle ([x-axis, y-axis] degrees)
  //initEventHandlers(canvas, currentAngle);

  // Clear <canvas>
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000;
varg_seconds = performance.now()/1000-g_startTime;

function logKey(e) {
  console.log(e.shiftKey);

  g_TailAngle = (90+4*(Math.cos(5*g_seconds)));
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

/*function keydown(ev){

  if (ev.keyCode == 68){ //right
    g_camera.eye[0] += 0.2;
  } else
  if (ev.keyCode == 65){ //left
    g_camera.eye[0] -=0.2;
  }

  if (ev.keyCode == 83){ //back
    g_camera.eye[2] += 0.2;
  } else
  if (ev.keyCode == 87){ //front
    g_camera.eye[2] -=0.2;
  }

  if (ev.keyCode == 32){ //up
    g_camera.eye[1] += 0.2;
  } else
  if (ev.keyCode == 17){ //down
    g_camera.eye[1] -=0.2;
  }

  renderScene();
  console.log(ev.keyCode);
}*/

function keydown(ev){
  if (ev.keyCode == 68){ //right
    g_eye[0] += 0.2;
  } else
  if (ev.keyCode == 65){ //left
    g_eye[0] -=0.2;
  }

  if (ev.keyCode == 83){ //back
    g_eye[2] += 0.2;
  } else
  if (ev.keyCode == 87){ //front
    g_eye[2] -=0.2;
  }

  if (ev.keyCode == 32){ //up
    g_eye[1] += 0.2;
  } else
  if (ev.keyCode == 17){ //down
    g_eye[1] -=0.2;
  }

  renderScene();
  console.log(ev.keyCode);
}


var g_eye = [0,0,3];
var g_at = [0,0,-100];
var g_up = [0,1,0];
//test();

//var test1 = new Cube();
//var g_camera = new Camera();
//g_camera.forward();

var g_map = [
  [1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,1,1,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,1],
];

function drawMap(){
  for (x = 0; x < 32; x+=1){
    for (y= 0; y < 32; y+=1){
      if (x<1 || x==31 || y==0 || y==31){
        var body = new Cube();
        body.color = [0.8, 1.0, 1.0, 1.0];
        body.matrix.translate(0, -.75, 0);
        body.matrix.scale(.4,.4,.4);
        body.matrix.translate(x-16, 0, y-16);
        body.renderfast();
      }
    }
  }
}

function renderScene(){

  //pass u_ModelMatrix attribute
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, .1, 100);//perspective
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  /*viewMat.setLookAt(
        g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
        g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
        g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2],);//look at (eye, at, up)
  */
  viewMat.setLookAt(
        g_eye[0], g_eye[1], g_eye[2],
        g_at[0], g_at[1], g_at[2],
        g_up[0], g_up[1], g_up[2],);//look at (eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,-1,0);
  globalRotMat.rotate(g_globalAngle_Y,1,0,0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  //clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //Map
  drawMap();

  //floor
  var floor = new Cube();
  floor.textureNum = -3;
  floor.color = [1.0,0.0,0.0,1.0];
  floor.matrix.translate(0, -.75, 0.0);
  floor.matrix.scale(10, 0, 10);
  floor.matrix.translate(-.5, 0, -.5);
  floor.render();

  //sky
  var sky = new Cube();
  sky.textureNum = -3;
  sky.color = [1.0,0.0,0.0,1.0];
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-.5, -.5, -.5);
  sky.render();

  //test
  /*var test = new Cube();
  test.color = [1.0,0.0,0.0,1.0];
  test.matrix.scale(1, 1, 1);
  test.render();*/

  //test
  var test = new Cylinder();
  test.color = [1.0,0.0,1.0,1.0];
  test.matrix.translate(0.0 , -0.1, 0.4);
  test.matrix.rotate(g_TailAngle, 1, 0, 0);
  test.matrix.scale(1, 1, 0.5);
  test.render();

  //draw red body
  var body = new Cube();
  body.textureNum = -1;
  body.color = [1.0,0.0,0.0,1.0];
  body.matrix.translate(-0.3, -0.3, -0.5);
  body.matrix.rotate(0, 1, 0, 0);
  body.matrix.scale(0.6, .3, 1);
  body.render();

  //draw yellow neck
  var yellowNeck = new Cube();
  yellowNeck.textureNum = -1;
  yellowNeck.color = [1, 1, 0, 1];
  yellowNeck.matrix.translate(-0.16, 0, -0.2);
  yellowNeck.matrix.rotate(g_NeckAngle, 1, 0, 0);
  var BlackBase = new Matrix4(yellowNeck.matrix);
  yellowNeck.matrix.scale(0.3, .3, .5);
  yellowNeck.render();

  //draw White head
  var whiteHead = new Cube();
  whiteHead.textureNum = -1;
  whiteHead.matrix = BlackBase;
  whiteHead.color = [1, 1, 1, 1];
  whiteHead.matrix.translate(-0.05, 0, 0.5);
  whiteHead.matrix.rotate(g_HeadAngle, 1, 0, 0);
  whiteHead.matrix.scale(0.4, 0.3, 0.5);
  whiteHead.matrix.rotate(-180, 1, 0, 0);
  whiteHead.render();

  //draw nose
  var nose = new Cube();
  nose.textureNum = -1;
  nose.matrix = BlackBase;
  nose.color = [1, 0, 0, 1];
  nose.matrix.translate(0.31, 0, 1);
  nose.matrix.rotate(g_HeadAngle, 1, 0, 0);
  nose.matrix.scale(0.4, 0.3, 0.5);
  nose.matrix.rotate(-180, 1, 0, 0);
  nose.render();

  //legs

  //leg1_________________________________________________
  //draw leg1 right-front
  var leg1 = new Cube();
  leg1.textureNum = -1;
  leg1.color = [0.0,1.0,1.0,1.0];
  leg1.matrix.translate(-0.27 , -0.2, -0.48);
  leg1.matrix.rotate(g_leg1_1Angle, 1, 0, 0);
  var leg1Base = new Matrix4(leg1.matrix);
  leg1.matrix.scale(0.11, .2, 0.3);
  leg1.render();

  //draw leg1_b right-front
  var leg1_b = new Cube();
  leg1_b.textureNum = -1;
  leg1_b.matrix = leg1Base;
  leg1_b.color = [0.0,1.0,0.0,1.0];
  leg1_b.matrix.translate(0.01 , 0.05, 0.1);
  leg1_b.matrix.rotate(g_leg2_1Angle, 1, 0, 0);
  leg1_b.matrix.scale(0.09, .1, 0.5);
  leg1_b.render();

  //leg2________________________________________________
  //draw leg2 left-front
  var leg2 = new Cube();
  leg2.textureNum = -1;
  leg2.color = [0.0,1.0,1.0,1.0];
  leg2.matrix.translate(0.16 , -0.2, -0.48);
  leg2.matrix.rotate(g_leg1Angle, 1, 0, 0);
  var leg2Base = new Matrix4(leg2.matrix);
  leg2.matrix.scale(0.11, .2, 0.3);
  leg2.render();

  //draw leg2_b right-front
  var leg2_b = new Cube();
  leg2_b.textureNum = -1;
  leg2_b.matrix = leg2Base;
  leg2_b.color = [0.0,1.0,0.0,1.0];
  leg2_b.matrix.translate(0.01 , 0.05, 0.1);
  leg2_b.matrix.rotate(g_leg2Angle, 1, 0, 0);
  leg2_b.matrix.scale(0.09, .1, 0.5);
  leg2_b.render();

  //leg3______________________________________________
  //draw leg3 left-back
  var leg3 = new Cube();
  leg3.textureNum = -1;
  leg3.color = [0.0,1.0,1.0,1.0];
  leg3.matrix.translate(-0.27 , -0.2, 0.29);
  leg3.matrix.rotate(g_leg1_1Angle, 1, 0, 0);
  var leg3Base = new Matrix4(leg3.matrix);
  leg3.matrix.scale(0.11, .2, 0.3);
  leg3.render();

  //draw leg3_b right-front
  var leg3_b = new Cube();
  leg3_b.textureNum = -1;
  leg3_b.matrix = leg3Base;
  leg3_b.color = [0.0,1.0,0.0,1.0];
  leg3_b.matrix.translate(0.01 , 0.05, 0.1);
  leg3_b.matrix.rotate(g_leg2_1Angle, 1, 0, 0);
  leg3_b.matrix.scale(0.09, .1, 0.5);
  leg3_b.render();

  //leg4______________________________________________
  //draw leg4 left-back
  var leg4 = new Cube();
  leg4.textureNum = -1;
  leg4.color = [0.0,1.0,1.0,1.0];
  leg4.matrix.translate(0.16 , -0.2, 0.29);
  leg4.matrix.rotate(g_leg1Angle, 1, 0, 0);
  var leg4Base = new Matrix4(leg4.matrix);
  leg4.matrix.scale(0.11, .2, 0.3);
  leg4.render();

  //draw leg4_b right-front
  var leg4_b = new Cube();
  leg4_b.textureNum = -1;
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
