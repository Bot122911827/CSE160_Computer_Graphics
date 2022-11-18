// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'attribute vec3 a_Normal;\n' +
  'varying vec2 v_UV;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec4 v_VertPos;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '  v_UV = a_UV;\n' + 
  '  v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));\n' + 
  '  v_VertPos = u_ModelMatrix * a_Position;\n' + 
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n' + 
  'varying vec3 v_Normal;\n' +
  'uniform vec4 u_FragColor;\n' + 
  'uniform sampler2D u_Sampler0;\n' + 
  'uniform sampler2D u_Sampler1;\n' + 
  'uniform sampler2D u_Sampler2;\n' + 
  'uniform int u_whichTexture;\n' + 
  'uniform vec3 u_lightPos;\n' + 
  'uniform vec3 u_cameraPos;\n' + 
  'uniform vec3 u_lightColor;\n' + 
  'varying vec4 v_VertPos;\n' + 
  'uniform bool u_lightOn;\n' + 
  'void main() {\n' +
  '   if (u_whichTexture == -2){\n' + 
  '     gl_FragColor = u_FragColor;\n' + 
  '   } else if (u_whichTexture == -1){\n' + 
  '     gl_FragColor = vec4(v_UV, 1.0, 1.0);\n' + 
  '   } else if (u_whichTexture == 0){\n' + 
  '     gl_FragColor = texture2D(u_Sampler0, v_UV);\n' + 
  '   } else if (u_whichTexture == 1){\n' + 
  '     gl_FragColor = texture2D(u_Sampler1, v_UV);\n' + 
  '   } else if (u_whichTexture == 2){\n' + 
  '     gl_FragColor = texture2D(u_Sampler2, v_UV);\n' + 
  '   } else if (u_whichTexture == 3){\n' + 
  '     gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);\n' + 
  '   } else {\n' + 
  '     gl_FragColor = vec4(1, .2, .2, 1);\n' + 
  '   }\n' + 
  '   vec3 lightVector = u_lightPos-vec3(v_VertPos);\n' + 
  '   float r=length(lightVector);\n' + 
  '   vec3 L = normalize(lightVector);\n' + 
  '   vec3 N = normalize(v_Normal);\n' + 
  '   float nDotL = max(dot(N, L), 0.0);\n' + 
  '   vec3 R = reflect(-L, N);\n' + 
  '   vec3 E = normalize(u_cameraPos - vec3(v_VertPos));\n' +
  '   float S = pow(max(dot(E, R), 0.0), 64.0) * 0.8;\n' +
  '   vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;\n' + 
  '   vec3 ambient = vec3(gl_FragColor) * 0.2;\n' + 
  '   vec3 specular = vec3(gl_FragColor) * S;\n' + 
  '   if (u_lightOn){\n' + 
  '     if (u_whichTexture == 0){\n' + 
  '       gl_FragColor = vec4(u_lightColor * specular + u_lightColor * diffuse + u_lightColor * ambient, 1.0);\n' + 
  '     } else {\n' + 
  '       gl_FragColor = vec4(u_lightColor * diffuse + u_lightColor * ambient, 1.0);\n' + 
  '     }\n' + 
  '   }\n' +
  '}\n';

//Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_NormalMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let u_lightColor;


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

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
  if (!u_lightColor) {
    console.log('Failed to get the storage location of u_lightColor');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  // Get the storage location of Size
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
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
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
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
let g_normalOn=false;
let g_AnimationOn=false;
let g_lightPos = [6,1,-10];
let g_lightOn=true;
let g_lightColor=[1, 1, 1];

function addActionsForHtmlUI(){

  //normals
  document.getElementById("normalOn").onclick = function() {g_normalOn=true};
  document.getElementById("normalOff").onclick = function() {g_normalOn=false};

  //light animation
  document.getElementById("AnimationOn").onclick = function() {g_AnimationOn=true};
  document.getElementById("AnimationOff").onclick = function() {g_AnimationOn=false};

  //light On/Off
  document.getElementById("LightOn").onclick = function() {g_lightOn=true};
  document.getElementById("LightOff").onclick = function() {g_lightOn=false};

  //slider
  document.getElementById('lightSliderX').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[0] = -this.value/100; renderScene();}});
  document.getElementById('lightSliderY').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[1] = this.value/100; renderScene();}});
  document.getElementById('lightSliderZ').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[2] = -this.value/100; renderScene();};});

  //slider RGB
  document.getElementById('lightR').addEventListener('mouseup', function() {g_lightColor[0] = this.value/100; renderScene();});
  document.getElementById('lightG').addEventListener('mouseup', function() {g_lightColor[1] = this.value/100; renderScene();});
  document.getElementById('lightB').addEventListener('mouseup', function() {g_lightColor[2] = this.value/100; renderScene();});

}

function initTextures() {

  var image0 = new Image();  // Create the image object 
    if (!image0) {
      console.log('Failed to create the image0 object');
      return false;
    }
  
  var image1 = new Image();  // Create the image object 
  if (!image1) {
    console.log('Failed to create the image1 object');
    return false;
  }

  var image2 = new Image();  // Create the image object 
  if (!image1) {
    console.log('Failed to create the image1 object');
    return false;
  }

  // Register the event handler to be called on loading an image
  image0.onload = function(){ sendTextureToTEXTURE0(image0); };
   
  // Tell the browser to load an image
  image0.src = '../resources/sky1.jpg';

  // Register the event handler to be called on loading an image
  image1.onload = function(){ sendTextureToTEXTURE1(image1); };
   
  // Tell the browser to load an image
  image1.src = '../resources/Grass.jpg';

  // Register the event handler to be called on loading an image
  image2.onload = function(){ sendTextureToTEXTURE2(image2); };
   
  // Tell the browser to load an image
  image2.src = '../resources/Mud.png';

  return true;
}

function sendTextureToTEXTURE0(image) {

  var texture0 = gl.createTexture();   // Create a texture object
  if (!texture0) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture0);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler0
  gl.uniform1i(u_Sampler0, 0);
  
  console.log('finished loadTexture0');
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
  
  // Set the texture unit 1 to the sampler1
  gl.uniform1i(u_Sampler1, 1);
  
  console.log('finished loadTexture1');
}

function sendTextureToTEXTURE2(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit1
  gl.activeTexture(gl.TEXTURE2);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 1 to the sampler1
  gl.uniform1i(u_Sampler2, 2);
  
  console.log('finished loadTexture2');
}

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if (ev.buttons == 1) {click(ev)}};
  document.onkeydown = keydown;

  initTextures();

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


function tick(){

  g_seconds  =performance.now()/1000-g_startTime;

  updateAnimationAngles();

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

function updateAnimationAngles(){
  if (g_AnimationOn){
    g_lightPos[0]=Math.cos(g_seconds)+5;
  }
}

function keydown(ev){

  if (ev.keyCode == 68){ //right
    g_camera.right();
  } else
  if (ev.keyCode == 65){ //left
    g_camera.left();
  }

  if (ev.keyCode == 83){ //back
    g_camera.back();
  } else
  if (ev.keyCode == 87){ //front
    g_camera.forward();
  }

  if (ev.keyCode == 32){ //up
    g_camera.eye.elements[1] += 0.2;
  } else
  if (ev.keyCode == 17){ //down
    g_camera.eye.elements[1] -=0.2;
  }

  if (ev.keyCode == 81){ //left-look
    g_camera.panRight();
  } else
  if (ev.keyCode == 69){ //right-look
    g_camera.panLeft();
  }

  renderScene();
  console.log(ev.keyCode);
}

var g_camera = new Camera();

var g_map = [
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
  [3,0,0,1,0,0,0,0,0,0,0,1,0,0,0,3],
  [3,0,0,1,0,0,0,0,0,0,0,1,0,0,0,3],
  [3,0,0,2,2,2,2,0,2,2,2,2,0,0,0,3],
  [3,0,0,2,0,0,2,0,2,0,0,2,0,0,0,3],
  [3,0,0,2,0,0,2,0,2,0,0,2,0,0,,3],
  [3,0,0,2,2,2,2,0,2,2,2,2,0,0,0,3],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
  [3,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3],
  [3,2,2,2,1,0,0,1,0,0,1,0,0,0,0,3],

  [0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,3],
  [0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,3],
  [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3],
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
  [3,0,0,2,2,2,2,0,2,2,2,2,0,0,0,3],
  [3,0,0,2,0,0,2,0,2,0,0,2,0,0,0,3],
  [3,0,0,2,0,0,2,0,2,0,0,2,0,0,0,3],
  [3,0,0,2,2,2,2,0,2,2,2,2,0,0,0,3],
  [3,0,0,1,0,0,0,0,0,0,0,1,0,0,0,3],
  [3,0,0,1,0,0,0,1,0,0,0,1,0,0,0,3],
  [3,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
];

function drawMap(){
  for (x = 0; x < 24; x+=1){
    for (y= 0; y < 16; y+=1){
      if (g_map[x][y]>0){
        for (j= 0; j < g_map[x][y]; j+=1){
          var body = new Cube();
          body.textureNum = 2;
          if (g_normalOn) body.textureNum = 3;
          body.color = [1.0, 1.0, 1.0, 1.0];
          body.matrix.translate(0, -0.25, 0);
          body.matrix.translate(x-10, -.75-(-1)*j, y-4);
          body.renderfast();
        }
        
      }
    }
  }
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

      g_camera.panX((lastX - x)/5);
      g_camera.panY((lastY - y));
    }
    lastX = x, lastY = y;
    
  };
}

function renderScene(){

  //pass u_ModelMatrix attribute
  var startTime = performance.now();

  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(
        g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
        g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
        g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2],);//look at (eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
  

  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,-1,0);
  globalRotMat.rotate(g_globalAngle_Y,1,0,0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);                                                                                                                            

  //clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //Map_Wall
  drawMap();

  //floor
  var floor = new Cube();
  floor.color = [1.0,0.0,0.0,1.0];
  floor.textureNum = 1;
  if (g_normalOn) floor.textureNum = 3;
  floor.matrix.translate(0, -.75, 0.0);
  floor.matrix.scale(32, 0, 32);
  floor.matrix.translate(-.5, 0, -.5);
  floor.renderfast();

  //sky
  var sky = new Cube();
  sky.color = [1.0,0.0,0.0,1.0];
  sky.textureNum = 0;
  if (g_normalOn) sky.textureNum = 3;
  sky.matrix.scale(-50, -50, -50);
  sky.matrix.translate(-.5, -.5, -.5);
  sky.normalMatrix.setInverseOf(sky.matrix).transpose();
  sky.renderfast();
  
  //test sphere
  var test = new Sphere();
  test.color = [0.0,0.0,0.0,1.0];
  test.textureNum = -3;
  if (g_normalOn) test.textureNum = 3;
  test.matrix.scale(1, 1, 1);
  test.matrix.translate(5, 1, -6);
  test.normalMatrix.setInverseOf(test.matrix).transpose();
  test.render();

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2])
  gl.uniform3f(u_cameraPos, g_camera.eye[0], g_camera.eye[1], g_camera.eye[2]);
  gl.uniform1i(u_lightOn, g_lightOn);

  //light
  var light = new Cube();
  light.color = [2,2,0,1];
  light.textureNum = -2;
  if (g_normalOn) light.textureNum = 3;
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1,-.1,-.1);
  light.matrix.translate(-.5,-.5,-.5);

  light.normalMatrix.setInverseOf(light.matrix).transpose();
  light.renderfast();

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
