// DrawTriangle.js (c) 2012 matsuda
function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color

  //instantiate a vector v1
  /*v1 = new Vector3([2.25, 2.25, 0]);

  drawVector(v1, "red");*/
}

//number 2
function drawVector(vector, color){

  ctx.strokeStyle = color;

  let cx = canvas.width/2;
  let cy = canvas.height/2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + 20*vector.elements[0], cy - 20*vector.elements[1]);
  ctx.stroke(); 
}

//number 3, 4
function handleDrawEvent(){

  //1. Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //2. Read the values of the text boxes to create v1
  let l1x = document.getElementById("v1_x").value;
  let l1y = document.getElementById("v1_y").value;
  v_1 = new Vector3([l1x, l1y, 0]);

  //read v2
  let l2x = document.getElementById("v2_x").value;
  let l2y = document.getElementById("v2_y").value;
  v_2 = new Vector3([l2x, l2y, 0]);

  //3. Call drawVector()
  drawVector(v_1, 'red');
  drawVector(v_2, 'blue');

}

//number 5
function handleDrawOperationEvent(){

  //1. Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let status = document.getElementById("options").value;

  //2. Read the values of the text boxes to create v1
  let l1x = document.getElementById("v1_x").value;
  let l1y = document.getElementById("v1_y").value;
  v_1 = new Vector3([l1x, l1y, 0]);

  //read v2
  let l2x = document.getElementById("v2_x").value;
  let l2y = document.getElementById("v2_y").value;
  v_2 = new Vector3([l2x, l2y, 0]);

  //read scalar
  let scalar = document.getElementById("scalar").value;

  //3. Call drawVector()
  drawVector(v_1, 'red');
  drawVector(v_2, 'blue');

  switch (status) {
    case 'add':
      v_1.add(v_2);
      drawVector(v_1, 'green');
      break;
    case 'sub':
      v_1.sub(v_2);
      drawVector(v_1, 'green');
      break;
    case 'mul':
      v_1.mul(scalar);
      v_2.mul(scalar);
      drawVector(v_1, 'green');
      drawVector(v_2, 'green');
      break;
    case 'div':
      v_1.div(scalar);
      v_2.div(scalar);
      drawVector(v_1, 'green');
      drawVector(v_2, 'green');
      break;
  }
  
}

//number 6