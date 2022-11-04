class Camera{
    constructor(){
        this.eye = new Vector3([0,0,3]);
        this.at = new Vector3([0,0,-100]);
        this.up = new Vector3([0,1,0]);
    }

    forward(){
        var f = this.at.sub(this.eye);
        f = f.div(f.length());
        this.at = this.at.add(f);
        this.eye = this.eye.add(f);
    }

    back(){
        var f = this.eye.sub(this.at);
        f = f.div(f.length());
        this.at = this.at.add(f);
        this.eye = this.eye.add(f);
    }

    left(){
        var f = this.eye.sub(this.at);
        f = f.div(f.length());
        var s = Vector3.cross(f, this.up);
        s = s.div(s.length());
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    right(){
        var f = this.at.sub(this.eye);
        f = f.div(f.length());
        var s = Vector3.cross(f, this.up);
        s = s.div(s.length());
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

}

function test(){
    console.log("test");
}