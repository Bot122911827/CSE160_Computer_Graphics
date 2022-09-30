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
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
  ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color

  //instantiate a vector v1
  let v1 = new Vector3([2.25, 2.25, 0]);
  console.log(v1.elements[1]);

  drawVector(v1, "red");
}

//number 2
function drawVector(vector, color){

  ctx.strokeStyle = color;

  let cx = canvas.width/2;
  let cy = canvas.height/2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + 20*vector.x, cy - 20*vector.y);
  ctx.stroke(); 
}

//number 3
function handleDrawEvent(){
  let v1 = document.getElementById("name").value;
  console.log(v1);

  ctx.strokeStyle = 'red';

  let cx = canvas.width/2;
  let cy = canvas.height/2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + 75, cy + 50);
  ctx.stroke();

}
