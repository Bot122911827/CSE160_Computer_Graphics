class Cube{
    constructor(){
      this.type = 'cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.normalMatrix = new Matrix4();
      this.textureNum = 0;
    }
  
    render() {
      var rgba = this.color;

      //pass the texture number
      gl.uniform1i(u_whichTexture, this.textureNum);
      //console.log(this.textureNum);
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      //pass matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
      
      //Front of Cube
      drawTriangle3DUV([0,0,0,  1,1,0,  1,0,0], [0,0, 1,1, 1,0]);
      drawTriangle3DUV([0,0,0,  0,1,0,  1,1,0], [0,0, 0,1, 1,1]);
      //drawTriangle3D([0.0,0.0,0.0,  1.0,1.0,0.0,  1.0,0.0,0.0]);
      //drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0]);

      //fake lighting
      gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

      //top of cube done
      //drawTriangle3D([0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0]);
      //drawTriangle3D([0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0]);
      drawTriangle3DUV([0,1,0,  0,1,1,  1,1,1], [0,0, 0,1, 1,1]);
      drawTriangle3DUV([0,1,0,  1,1,1,  1,1,0], [0,0, 1,1, 1,0]);

      gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
      gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);


      //right of cube
      //drawTriangle3D([1.0,0.0,1.0,  1.0,0.0,0.0,  1.0,1.0,1.0]);
      //drawTriangle3D([1.0,1.0,0.0,  1.0,0.0,0.0,  1.0,1.0,1.0]);
      drawTriangle3DUV([1,0,1,  1,0,0,  1,1,1], [1,0, 0,0, 1,1]);
      drawTriangle3DUV([1,1,0,  1,0,0,  1,1,1], [0,1, 0,0, 1,1]);

      //left of cube done
      //drawTriangle3D([0.0,0.0,1.0,  0.0,0.0,0.0,  0.0,1.0,1.0]);
      //drawTriangle3D([0.0,1.0,0.0,  0.0,0.0,0.0,  0.0,1.0,1.0]);
      drawTriangle3DUV([0,0,1,  0,0,0,  0,1,1], [1,0, 0,0, 1,1]);
      drawTriangle3DUV([0,1,0,  0,0,0,  0,1,1], [0,1, 0,0, 1,1]);

      //back of cube done
      //drawTriangle3D([0.0,0.0,1.0,  1.0,0.0,1.0,  1.0,1.0,1.0]);
      //drawTriangle3D([0.0,0.0,1.0,  0.0,1.0,1.0,  1.0,1.0,1.0]);
      drawTriangle3DUV([0,0,1,  1,0,1,  1,1,1], [0,0, 1,0, 1,1]);
      drawTriangle3DUV([0,0,1,  0,1,1,  1,1,1], [0,0, 0,1, 1,1]);

      //bottom of cube
      //drawTriangle3D([0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,0.0]);
      //drawTriangle3D([1.0,0.0,1.0,  0.0,0.0,1.0,  1.0,0.0,0.0]);
      drawTriangle3DUV([0,0,0,  0,0,1,  1,0,0], [0,0, 1,0, 1,1]);
      drawTriangle3DUV([1,0,1,  0,0,1,  1,0,0], [0,0, 1,1, 0,1]);
    }

    renderfast() {
      var rgba = this.color;

      //pass the texture number
      gl.uniform1i(u_whichTexture, this.textureNum);
      //console.log(this.textureNum);
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      //pass matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
      gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
      
      var allverts = [];
      var allverts1 = [];
      var allvertsNormal = [];
      //Front of Cube
      //drawTriangle3DUV([0,0,0,  1,1,0,  1,0,0], [0,0, 1,1, 1,0]);
      //drawTriangle3DUV([0,0,0,  0,1,0,  1,1,0], [0,0, 0,1, 1,1]);
      allverts=allverts.concat([0,0,0,  1,1,0,  1,0,0]);
      allverts=allverts.concat([0,0,0,  0,1,0,  1,1,0]);

      allverts1 = allverts1.concat([0,0, 1,1, 1,0]);
      allverts1 = allverts1.concat([0,0, 0,1, 1,1]);

      allvertsNormal= allvertsNormal.concat([0,0,-1, 0,0,-1,  0,0,-1]);
      allvertsNormal = allvertsNormal.concat([0,0,-1, 0,0,-1,  0,0,-1]);

      //fake lighting
      gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

      //top of cube done
      //drawTriangle3DUV([0,1,0,  0,1,1,  1,1,1], [0,0, 0,1, 1,1]);
      //drawTriangle3DUV([0,1,0,  1,1,1,  1,1,0], [0,0, 1,1, 1,0]);
      allverts=allverts.concat([0,1,0,  0,1,1,  1,1,1]);
      allverts=allverts.concat([0,1,0,  1,1,1,  1,1,0]);

      allverts1 = allverts1.concat([0,0, 0,1, 1,1]);
      allverts1 = allverts1.concat([0,0, 1,1, 1,0]);

      allvertsNormal= allvertsNormal.concat([0,1,0, 0,1,0, 0,1,0]);
      allvertsNormal = allvertsNormal.concat([0,1,0, 0,1,0, 0,1,0]);

      gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
      gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);


      //right of cube
      //drawTriangle3DUV([1,0,1,  1,0,0,  1,1,1], [1,0, 0,0, 1,1]);
      //drawTriangle3DUV([1,1,0,  1,0,0,  1,1,1], [0,1, 0,0, 1,1]);
      allverts=allverts.concat([1,0,1,  1,0,0,  1,1,1]);
      allverts=allverts.concat([1,1,0,  1,0,0,  1,1,1]);

      allverts1 = allverts1.concat([1,0, 0,0, 1,1]);
      allverts1 = allverts1.concat([0,1, 0,0, 1,1]);

      allvertsNormal= allvertsNormal.concat([1,0,0, 1,0,0, 1,0,0]);
      allvertsNormal = allvertsNormal.concat([1,0,0, 1,0,0, 1,0,0]);

      //left of cube done
      //drawTriangle3DUV([0,0,1,  0,0,0,  0,1,1], [1,0, 0,0, 1,1]);
      //drawTriangle3DUV([0,1,0,  0,0,0,  0,1,1], [0,1, 0,0, 1,1]);
      allverts=allverts.concat([0,0,1,  0,0,0,  0,1,1]);
      allverts=allverts.concat([0,1,0,  0,0,0,  0,1,1]);

      allverts1 = allverts1.concat([1,0, 0,0, 1,1]);
      allverts1 = allverts1.concat([0,1, 0,0, 1,1]);

      allvertsNormal= allvertsNormal.concat([-1,0,0, -1,0,0, -1,0,0]);
      allvertsNormal = allvertsNormal.concat([-1,0,0, -1,0,0, -1,0,0]);


      //back of cube done
      //drawTriangle3DUV([0,0,1,  1,0,1,  1,1,1], [0,0, 1,0, 1,1]);
      //drawTriangle3DUV([0,0,1,  0,1,1,  1,1,1], [0,0, 0,1, 1,1]);
      allverts=allverts.concat([0,0,1,  1,0,1,  1,1,1]);
      allverts=allverts.concat([0,0,1,  0,1,1,  1,1,1]);

      allverts1 = allverts1.concat([0,0, 1,0, 1,1]);
      allverts1 = allverts1.concat([0,0, 0,1, 1,1]);

      allvertsNormal= allvertsNormal.concat([0,0,1, 0,0,1,  0,0,1]);
      allvertsNormal = allvertsNormal.concat([0,0,1, 0,0,1,  0,0,1]);

      //bottom of cube
      //drawTriangle3DUV([0,0,0,  0,0,1,  1,0,0], [0,0, 1,0, 1,1]);
      //drawTriangle3DUV([1,0,1,  0,0,1,  1,0,0], [0,0, 1,1, 0,1]);
      allverts=allverts.concat([0,0,0,  0,0,1,  1,0,0]);
      allverts=allverts.concat([1,0,1,  0,0,1,  1,0,0]);

      allverts1 = allverts1.concat([0,0, 1,0, 1,1]);
      allverts1 = allverts1.concat([0,0, 1,1, 0,1]);

      allvertsNormal= allvertsNormal.concat([0,-1,0, 0,-1,0, 0,-1,0]);
      allvertsNormal = allvertsNormal.concat([0,-1,0, 0,-1,0, 0,-1,0]);

      drawTriangle3DUVNormal(allverts, allverts1, allvertsNormal);
    }
}