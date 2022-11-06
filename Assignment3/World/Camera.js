class Camera{
    constructor(){
        this.fov = 60;
        this.eye = new Vector3([5,0,-10]);
        this.at = new Vector3([0,0,20]);
        this.up = new Vector3([0,1,0]);
        this.speed = 0.2;
        this.alpha = 4;

        this.viewMatrix = new Matrix4();
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2],);//look at (eye, at, up)
        
        this.projectionMatrix = new Matrix4();
        this.projectionMatrix.setPerspective(this.fov, 1, 0.1, 100);

        this.rotationMatrix = new Matrix4();

    } 

    forward(){
        /*var f = this.at.sub(this.eye);
        f = f.div(f.length());
        this.at = this.at.add(f);
        this.eye = this.eye.add(f);*/
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(this.speed);
        this.at.add(f);
        this.eye.add(f);
        //console.log(this.eye.elements);
    }

    back(){
        let f = new Vector3();
        f.set(this.eye);
        f.sub(this.at);
        f.normalize();
        f.mul(this.speed);
        this.at.add(f);
        this.eye.add(f);
    }

    left(){
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(this.speed);
        this.eye.add(s);
        this.at.add(s);
    }

    right(){

        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(this.speed);
        this.eye.add(s);
        this.at.add(s);
    }

    panRight(){

        /*Compute the forward vector  f = at - eye;
        Rotate the vector f by alpha (decide a value) degrees around the up vector.
        Create a rotation matrix: rotationMatrix.setRotate(alpha, up.x, up.y, up.z).
        Multiply this matrix by f to compute f_prime = rotationMatrix.multiplyVector3(f);
        Update the "at"vector to be at = eye + f_prime;*/
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        this.rotationMatrix.setRotate(this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = this.rotationMatrix.multiplyVector3(f);
        let tmp = new Vector3();
        tmp.add(this.eye);
        tmp.add(f_prime);
        this.at.set(tmp);

    }

    panLeft(){
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        this.rotationMatrix.setRotate(-this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = this.rotationMatrix.multiplyVector3(f);
        let tmp = new Vector3();
        tmp.add(this.eye);
        tmp.add(f_prime);
        this.at.set(tmp);
    }

}

function test(){
    console.log("test");
}