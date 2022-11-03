class Cube{
    constructor(){
      this.type = 'cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.textureNum = -2;
    }
  
    render() {
      var rgba = this.color;

      //pass the texture number
      gl.uniform1i(u_whichTexture, this.textureNum);
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      //pass matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
      
      //Front of Cube
      drawTriangle3DUV([0,0,0,  1,1,0,  1,0,0], [0,0, 1,1, 1,0]);
      drawTriangle3DUV([0,0,0,  0,1,0,  1,1,0], [0,0, 0,1, 1,1]);
      //drawTriangle3D([0.0,0.0,0.0,  1.0,1.0,0.0,  1.0,0.0,0.0]);
      //drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0]);

      //fake lighting
      gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

      //top of cube
      //drawTriangle3D([0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0]);
      //drawTriangle3D([0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0]);
      drawTriangle3DUV([0,1,0,  0,1,1,  1,1,1], [0,0, 0,1, 1,1]);
      drawTriangle3DUV([0,1,0,  1,1,1,  1,1,0], [0,0, 1,1, 1,0]);

      gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
      gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);


      //right of cube
      //drawTriangle3D([1.0,0.0,1.0,  1.0,0.0,0.0,  1.0,1.0,1.0]);
      //drawTriangle3D([1.0,1.0,0.0,  1.0,0.0,0.0,  1.0,1.0,1.0]);
      drawTriangle3DUV([1,0,1,  1,0,0,  1,1,1], [0,0, 0,1, 1,1]);
      drawTriangle3DUV([1,1,0,  1,0,0,  1,1,1], [0,0, 1,0, 1,1]);

      //left of cube
      //drawTriangle3D([0.0,0.0,1.0,  0.0,0.0,0.0,  0.0,1.0,1.0]);
      //drawTriangle3D([0.0,1.0,0.0,  0.0,0.0,0.0,  0.0,1.0,1.0]);
      drawTriangle3DUV([0,0,1,  0,0,0,  0,1,1], [0,0, 0,1, 1,1]);
      drawTriangle3DUV([0,1,0,  0,0,0,  0,1,1], [0,0, 0,1, 1,1]);

      //back of cube
      //drawTriangle3D([0.0,0.0,1.0,  1.0,0.0,1.0,  1.0,1.0,1.0]);
      //drawTriangle3D([0.0,0.0,1.0,  0.0,1.0,1.0,  1.0,1.0,1.0]);
      drawTriangle3DUV([0,0,1,  1,0,1,  1,1,1], [1,0, 0,0, 1,1]);
      drawTriangle3DUV([0,0,1,  0,1,1,  1,1,1], [0,0, 0,1, 1,1]);

      //bottom of cube
      //drawTriangle3D([0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,0.0]);
      //drawTriangle3D([1.0,0.0,1.0,  0.0,0.0,1.0,  1.0,0.0,0.0]);
      drawTriangle3DUV([0,0,0,  0,0,1,  1,0,0], [0,0, 1,1, 1,0]);
      drawTriangle3DUV([1,0,1,  0,0,1,  1,0,0], [0,0, 0,1, 1,1]);
    }
}