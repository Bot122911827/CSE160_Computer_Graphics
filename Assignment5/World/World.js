import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {OBJLoader} from '../lib/three.js-master/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from '../lib/three.js-master//examples/jsm/loaders/MTLLoader.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(20, 15, 40);

  class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
      this.obj = obj;
      this.minProp = minProp;
      this.maxProp = maxProp;
      this.minDif = minDif;
    }
    get min() {
      return this.obj[this.minProp];
    }
    set min(v) {
      this.obj[this.minProp] = v;
      this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
      return this.obj[this.maxProp];
    }
    set max(v) {
      this.obj[this.maxProp] = v;
      this.min = this.min;  // this will call the min setter
    }
  }

  function updateCamera() {
    camera.updateProjectionMatrix();
  }

  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  class DegRadHelper {
    constructor(obj, prop) {
      this.obj = obj;
      this.prop = prop;
    }
    get value() {
      return THREE.MathUtils.radToDeg(this.obj[this.prop]);
    }
    set value(v) {
      this.obj[this.prop] = THREE.MathUtils.degToRad(v);
    }
  }

  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -100, 100).onChange(onChangeFn);
    folder.add(vector3, 'y', -100, 100).onChange(onChangeFn);
    folder.add(vector3, 'z', -100, 100).onChange(onChangeFn);
    folder.open();
  }
  

  const gui = new GUI();
  gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
  gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
  gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  //fog
  {
    const near = 0.1;
    const far = 80;
    const color = 'white';
    scene.fog = new THREE.Fog(color, near, far);
    scene.background = new THREE.Color(color);
  }

  {
    const planeSize = 400;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

  function createWall(x, y, r, w){
    const loader = new THREE.TextureLoader();
    const brickMaterial = new THREE.MeshBasicMaterial({
      map: loader.load('../resources/brick.jpg'),
    });
    const height = 8;  // ui: height
    const depth = 1.8;  // ui: depth
    const cubeGeo = new THREE.BoxGeometry(w, height, depth); 
    //const cubeMat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const mesh = new THREE.Mesh(cubeGeo, brickMaterial);
    mesh.position.set(w + x, height / 2, y);
    mesh.rotateY(Math.PI / 180 * r);
    scene.add(mesh);
  }

  function createCastle(x, y){
    //1
    const radiusTop = 1.2;  // ui: radiusTop
    const radiusBottom = 2;  // ui: radiusBottom
    const height = 8;  // ui: height
    const radialSegments = 120;  // ui: radialSegments
    const cylinder1Geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    //const cylinder1Mat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const loader = new THREE.TextureLoader();
    const brickMaterial = new THREE.MeshBasicMaterial({
      map: loader.load('../resources/brick.jpg'),
    });

    const loader2 = new THREE.TextureLoader();
    const roofMaterial = new THREE.MeshBasicMaterial({
      map: loader2.load('../resources/roof.jpg'),
    });
    const mesh = new THREE.Mesh(cylinder1Geo, brickMaterial);
    mesh.position.set(-radiusBottom - x, radiusBottom + 1, y);
    scene.add(mesh);

    //2
    const radiusTop2 = 1.3;  // ui: radiusTop
    const radiusBottom2 = 1.4;  // ui: radiusBottom
    const height2 = 1.5;  // ui: height
    const radialSegments2 = 120;  // ui: radialSegments
    const cylinder2Geo = new THREE.CylinderGeometry(radiusTop2, radiusBottom2, height2, radialSegments2);
    //const cylinder2Mat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const mesh2 = new THREE.Mesh(cylinder2Geo, brickMaterial);
    mesh2.position.set(-radiusBottom - x, radiusBottom2 + 6, y);
    scene.add(mesh2);

    //3
    const radiusTop3 = 1.15;  // ui: radiusTop
    const radiusBottom3 = 1;  // ui: radiusBottom
    const height3 = 2.3;  // ui: height
    const radialSegments3 = 120;  // ui: radialSegments
    const cylinder3Geo = new THREE.CylinderGeometry(radiusTop3, radiusBottom3, height3, radialSegments3);
    //const cylinder3Mat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const mesh3 = new THREE.Mesh(cylinder3Geo, brickMaterial);
    mesh3.position.set(-radiusBottom - x, radiusBottom3 + 7.5, y);
    scene.add(mesh3);

    //4
    const radius4 = 1.3;  // ui: radius
    const height4 = 3.5;  // ui: height
    const radialSegments4 = 100;  // ui: radialSegments
    const cone4Geo = new THREE.ConeGeometry(radius4, height4, radialSegments4);
    //const cone4Mat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const mesh4 = new THREE.Mesh(cone4Geo, roofMaterial);
    mesh4.position.set(-radiusBottom - x, radius4 + 9.7, y);
    scene.add(mesh4);
  }

  function createCastleStraight(x, y, z){

    const loader = new THREE.TextureLoader();
    const brickMaterial = new THREE.MeshBasicMaterial({
      map: loader.load('../resources/brick.jpg'),
    });
    const loader2 = new THREE.TextureLoader();
    const roofMaterial = new THREE.MeshBasicMaterial({
      map: loader2.load('../resources/roof.jpg'),
    });
    //1
    const radiusTop = 1.2;  // ui: radiusTop
    const radiusBottom = 1.2;  // ui: radiusBottom
    const height = 8;  // ui: height
    const radialSegments = 120;  // ui: radialSegments
    const cylinder1Geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    //const cylinder1Mat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const mesh = new THREE.Mesh(cylinder1Geo, brickMaterial);
    mesh.position.set(-radiusBottom - x, z + 1, y);
    scene.add(mesh);

    //2
    const radiusTop2 = 1.3;  // ui: radiusTop
    const radiusBottom2 = 1.3;  // ui: radiusBottom
    const height2 = 1.5;  // ui: height
    const radialSegments2 = 120;  // ui: radialSegments
    const cylinder2Geo = new THREE.CylinderGeometry(radiusTop2, radiusBottom2, height2, radialSegments2);
    //const cylinder2Mat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const mesh2 = new THREE.Mesh(cylinder2Geo, brickMaterial);
    mesh2.position.set(-radiusBottom - x, z + 5, y);
    scene.add(mesh2);

    //3
    const radiusTop3 = 1;  // ui: radiusTop
    const radiusBottom3 = 1;  // ui: radiusBottom
    const height3 = 2.3;  // ui: height
    const radialSegments3 = 120;  // ui: radialSegments
    const cylinder3Geo = new THREE.CylinderGeometry(radiusTop3, radiusBottom3, height3, radialSegments3);
    //const cylinder3Mat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const mesh3 = new THREE.Mesh(cylinder3Geo, brickMaterial);
    mesh3.position.set(-radiusBottom - x, z + 6, y);
    scene.add(mesh3);

    //4
    const radius4 = 1.3;  // ui: radius
    const height4 = 3.5;  // ui: height
    const radialSegments4 = 100;  // ui: radialSegments
    const cone4Geo = new THREE.ConeGeometry(radius4, height4, radialSegments4);
    //const cone4Mat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const mesh4 = new THREE.Mesh(cone4Geo, roofMaterial);
    mesh4.position.set(-radiusBottom - x, z + 8.7, y);
    scene.add(mesh4);
  }

  function createCastleStraightSmall(x, y, z){

    const loader = new THREE.TextureLoader();
    const brickMaterial = new THREE.MeshBasicMaterial({
      map: loader.load('../resources/brick.jpg'),
    });
    const loader2 = new THREE.TextureLoader();
    const roofMaterial = new THREE.MeshBasicMaterial({
      map: loader2.load('../resources/roof.jpg'),
    });
    //1
    const radiusTop = 1.2;  // ui: radiusTop
    const radiusBottom = 1.2;  // ui: radiusBottom
    const height = 8;  // ui: height
    const radialSegments = 120;  // ui: radialSegments
    const cylinder1Geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    //const cylinder1Mat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const mesh = new THREE.Mesh(cylinder1Geo, brickMaterial);
    mesh.position.set(-radiusBottom - x, z - 1, y);
    mesh.scale.set(0.5, 0.5, 0.5);
    scene.add(mesh);

    //2
    const radiusTop2 = 1.3;  // ui: radiusTop
    const radiusBottom2 = 1.3;  // ui: radiusBottom
    const height2 = 1.5;  // ui: height
    const radialSegments2 = 120;  // ui: radialSegments
    const cylinder2Geo = new THREE.CylinderGeometry(radiusTop2, radiusBottom2, height2, radialSegments2);
    //const cylinder2Mat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const mesh2 = new THREE.Mesh(cylinder2Geo, brickMaterial);
    mesh2.position.set(-radiusBottom - x, z + 1, y);
    mesh2.scale.set(0.5, 0.5, 0.5);
    scene.add(mesh2);

    //3
    const radiusTop3 = 1;  // ui: radiusTop
    const radiusBottom3 = 1;  // ui: radiusBottom
    const height3 = 2.3;  // ui: height
    const radialSegments3 = 120;  // ui: radialSegments
    const cylinder3Geo = new THREE.CylinderGeometry(radiusTop3, radiusBottom3, height3, radialSegments3);
    //const cylinder3Mat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const mesh3 = new THREE.Mesh(cylinder3Geo, brickMaterial);
    mesh3.position.set(-radiusBottom - x, z + 1.5, y);
    mesh3.scale.set(0.5, 0.5, 0.5);
    scene.add(mesh3);

    //4
    const radius4 = 1.3;  // ui: radius
    const height4 = 3.5;  // ui: height
    const radialSegments4 = 100;  // ui: radialSegments
    const cone4Geo = new THREE.ConeGeometry(radius4, height4, radialSegments4);
    //const cone4Mat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const mesh4 = new THREE.Mesh(cone4Geo,roofMaterial);
    mesh4.position.set(-radiusBottom - x, z + 2.7, y);
    mesh4.scale.set(0.5, 0.5, 0.5);
    scene.add(mesh4);
  }

  function createSpotlight(x, y, a, b , c){
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.SpotLight(color, intensity);
    light.position.set(x, -1, y);
    light.angle = Math.PI / 180 * 40;
    light.target.position.set(a, b, c);
    scene.add(light);
    scene.add(light.target);

    const helper = new THREE.SpotLightHelper(light);
    //scene.add(helper);

    function updateLight() {
      light.target.updateMatrixWorld();
      helper.update();
    }
    updateLight();

  }

  //cylinder castle model1
  {
    //line1
    createCastle(1, 0);
    createCastle(12, 0);

    //line2
    createCastle(-8, -10);
    createCastle(21, -10);

    //line3
    createCastle(-8, -20);
    createCastle(21, -20);

    //create Wall
    createWall(-18, 0, 0, 10); //1

    createWall(-11.5, -4.5, 48, 12.7); //2
    createWall(-31.5, -5, -48, 12.7);

    createWall(-3.8, -15, 90, 10); //3
    createWall(-32.8, -15, 90, 10);

    //center of castle
    const loader = new THREE.TextureLoader();
    const brickMaterial = new THREE.MeshBasicMaterial({
      map: loader.load('../resources/brick.jpg'),
    });
    const radiusTop3 = 8.5;  // ui: radiusTop
    const radiusBottom3 = 8.5;  // ui: radiusBottom
    const height3 = 16;  // ui: height
    const radialSegments3 = 120;  // ui: radialSegments
    const cylinder3Geo = new THREE.CylinderGeometry(radiusTop3, radiusBottom3, height3, radialSegments3);
    //const cylinder3Mat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const mesh3 = new THREE.Mesh(cylinder3Geo, brickMaterial);
    mesh3.position.set(-radiusBottom3, radiusBottom3 - 6, -14);
    scene.add(mesh3);

    //create higher wall
    const width = 9;
    const height = 8;  // ui: height
    const depth = 8;  // ui: depth
    const cubeGeo = new THREE.BoxGeometry(width, height, depth); 
    //const cubeMat = new THREE.MeshPhongMaterial({color: '#adaeaf'});
    const mesh = new THREE.Mesh(cubeGeo, brickMaterial);
    mesh.position.set(width - 17, height + 5, -14);
    scene.add(mesh);

    //main straight castle
    createCastleStraight(5, -7.5, 13);

    //create some more castle
    createCastleStraightSmall(10, -7.5, 13);
    createCastleStraightSmall(3, -15, 18);
    createCastleStraightSmall(10, -16, 20);
    

  }

  
  //Directional lighting
  {
    const color = '#FFFFE0';
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
  }

  //point light
  {
    const color = '#65a3d2';
    const intensity = 0.5;
    const pointlight = new THREE.PointLight(color, intensity);
    pointlight.position.set(-8.4, 10, 0);
    scene.add(pointlight);

    const helper = new THREE.PointLightHelper(pointlight);
    scene.add(helper);

    function updateLight() {
      helper.update();
    }

    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(pointlight, 'color'), 'value').name('color');
    gui.add(pointlight, 'intensity', 0, 2, 0.01);
    gui.add(pointlight, 'distance', 0, 40).onChange(updateLight);

    makeXYZGUI(gui, pointlight.position, 'position');
  }

  //spotlights
  {
    
    createSpotlight(-1.96, 3.2, -3.68, 6.72, -1.72);
    createSpotlight(-14.8, 3.2, -13, 6.72, -1.72);

  }

  //skybox
  { 
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      '../resources/sky1.jpg',
      '../resources/sky1.jpg',
      '../resources/sky1.jpg',
      '../resources/sky1.jpg',
      '../resources/sky1.jpg',
      '../resources/sky1.jpg',
    ]);
    scene.background = texture;
  }

  //add .obj
  /*{
    const mtlLoader = new MTLLoader();
    mtlLoader.load('https://threejs.org/manual/examples/resources/models/windmill/windmill.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('https://threejs.org/manual/examples/resources/models/windmill/windmill.obj', (root) => {
        scene.add(root);
      });
    });
  }*/

  /*{
    const objLoader = new OBJLoader();
    objLoader.load('../resources/Castle.obj', (root) => {
      scene.add(root);
    });

    //objLoader.scale(10, 10, 10);
  }*/

  //billboards
  const bodyRadiusTop = .4;
  const bodyHeight = 2;
   
  const labelGeometry = new THREE.PlaneGeometry(1, 1);
  
    function makeLabelCanvas(size, name) {
      const borderSize = 2;
      const ctx = document.createElement('canvas').getContext('2d');
      const font =  `${size}px bold sans-serif`;
      ctx.font = font;
      // measure how long the name will be
      const doubleBorderSize = borderSize * 2;
      const width = ctx.measureText(name).width + doubleBorderSize;
      const height = size + doubleBorderSize;
      ctx.canvas.width = width;
      ctx.canvas.height = height;
     
      // need to set font again after resizing canvas
      ctx.font = font;
      ctx.textBaseline = 'top';
     
      ctx.fillStyle = 'blue';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'white';
      ctx.fillText(name, borderSize, borderSize);
     
      return ctx.canvas;
    }
  
    function makePerson(x, size, name) {
      const canvas = makeLabelCanvas(size, name);
      const texture = new THREE.CanvasTexture(canvas);
      // because our canvas is likely not a power of 2
      // in both dimensions set the filtering appropriately.
      texture.minFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
     
      const labelMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });
     
      const root = new THREE.Object3D();
      root.position.x = x;
     
      const label = new THREE.Sprite(labelMaterial);
      root.add(label);
      label.position.y = bodyHeight * 4 / 5;
      label.position.z = bodyRadiusTop * 1.01;
     
      // if units are meters then 0.01 here makes size
      // of the label into centimeters.
      const labelBaseScale = 0.01;
      label.scale.x = canvas.width  * labelBaseScale;
      label.scale.y = canvas.height * labelBaseScale;
     
      scene.add(root);
      return root;
    }
  
    makePerson(6.2, 32, 'Welcome');
    makePerson(8, 32, ' to ');
    makePerson(10, 32, 'Disneyland');

    //try
    const radius = 0.4;  // ui: radius
    const detail = 2;  // ui: detail
    const geometry = new THREE.DodecahedronGeometry(radius, detail);

    function makeInstance(geometry, color, x) {
      const material = new THREE.MeshPhongMaterial({color});

      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      sphere.position.x = x;
      sphere.position.y = 15;

      return sphere;
    }

    const spheres = [
      makeInstance(geometry, 0x44aa88,  0),
    ];
  
  
  //additions

  let explosions = [];  
  
  function Explosion(){
    this.particleGroup = new THREE.Group();
    this.expplosion = false;
    this.particleTexture = new THREE.TextureLoader().load("../resources/spot.png");
    this.numberParticles = Math.random() * 200 + 100;
    this.spd = 0.01;
    this.color = new THREE.Color();

    this.makeParticles = function(){
      this.color.setHSL((Math.random()), 0.95, 0.5);
      for (let i = 0; i < this.numberParticles; i+=1){
        let particleMaterial = new THREE.SpriteMaterial({ map: this.particleTexture, depthTest: false});

        let sprite = new THREE.Sprite(particleMaterial);

        sprite.material.blending = THREE.AdditiveBlending;

        sprite.userData.velocity = new THREE.Vector3(
          Math.random() * this.spd - this.spd/2,
          Math.random() * this.spd - this.spd/2,
          Math.random() * this.spd - this.spd/2
        );
        sprite.userData.velocity.multiplyScalar(Math.random() * Math.random() * 3 + 2);
        sprite.material.color = this.color;
        sprite.material.opacity = Math.random() * 0.2 + 0.8;

        let size = Math.random() * 0.1 + 0.1;
        sprite.scale.set(size, size, size);

        this.particleGroup.add(sprite);
      }

      this.particleGroup.position.set(Math.random() * 20 - 10, Math.random() * 5 + 3, Math.random() * 10 - 5);
      scene.add(this.particleGroup);
      this.explosion = true
    }

    this.update = function(){
      this.particleGroup.children.forEach((child => {
        child.position.add(child.userData.velocity);
        child.material.opacity -=0.008;
      }))

      this.particleGroup.children = this.particleGroup.children.filter((child) => child.material.opacity > 0.0);
      if(this.particleGroup.children.length === 0) this.explosion = false;

      explosions = explosions.filter((exp) => exp.explosion);
    }
  }

  animate();

  function animate(){
    requestAnimationFrame(animate);

    if (explosions.length>0){
      explosions.forEach((e) => e.update());
    }
    renderer.render(scene, camera);
  }
  

  for (let i = 0; i < 10; i+=1){
    let e = new Explosion;
    setTimeout(function() {console.log('1')}, 2000 * i);
    e.makeParticles();
    explosions.push(e); 
    console.log("i: ", i);

  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  

  function render(t) {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    t += 0.01;  // convert time to seconds

    spheres.forEach((sphere) => {

      sphere.position.x = 10*Math.cos(t/1000) - 7;
      sphere.position.z = 10*Math.sin(t/1000) - 14;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}





main();


