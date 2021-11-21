/*!
 * mainV2.js 
 *
 * Dependices:
 * Should Includes three.js
 * Check this website for color coding reference:  https://www.w3schools.com/tags/ref_colornames.asp
 *
 * These are some references I found helpful during development:
 *
 * <about stats>
 * https://www.hangge.com/blog/cache/detail_1784.html
 *
 * <let vs var>
 * https://stackoverflow.com/questions/762011/whats-the-difference-between-using-let-and-var
 *
 * <CubeTextureLoader>
 * https://blog.csdn.net/qq_37338983/article/details/82562891
 *
 * <>
 * url.
 *
 *
 *

 */
 // -------------------- main logic  ---------------START//


let container1 = document.createElement('div');
document.body.appendChild(container1);

let container2 = document.createElement('div');
document.body.appendChild(container2);

let scene = undefined;
let renderer = undefined;
let camera = undefined;
let directionalLight = undefined;
let ambientLight = undefined;
//let pointLight = undefined;
let controls = undefined;
let stats = undefined;


// variables about candle

let cylinderMesh = undefined;

let candleLight1 = undefined;
let candleLight2 = undefined;


let candleShape = undefined;
var flameMaterials = [];
var CylinderList = [];
var CandlewickList = [];
var FlameList = [];

// choose your candleShape :D

candleShape = "PeachHeart";


main();
render();

// -------------------- main logic  ----------------END//







// -------------------- functions being called---------------START//

function main() {
  //note that there is a logical order to add below things
  //e.g. initScene() always needs to be called first because it initialize a scene object, everything else comes later else will be added on this scene object.
  //the current order is correct
  
  initScene();
  initCamera();
  initRenderer(container1);
  initLight();

  switch(candleShape) {
  case "PeachHeart":
    PeachHeart(5,0,0,function(x,z) {
      oneCandleToPackThemAllWithXZ(x, z);
    });
    break;

  case 0:
    // code block
    break;
  case 1:
    // code block
    break;
  case 2:
    // code block
    break;
  case 3:
    // code block
    break;
  case 4:
    // code block
    break;
  case 5:
    // code block
    break;

  default:
    // "lonely candle"
    oneCandleToPackThemAll();
    
  }

  table();
  initControls();
  //initStats();
  initStats(container2);
  window.addEventListener('resize', onWindowResize, false);
}

function render(){
  requestAnimationFrame(render);
  var clock = new THREE.Clock();
  var time = 0;
  time += clock.getDelta();
  flameMaterials[0].uniforms.time.value = time;
  flameMaterials[1].uniforms.time.value = time;

  //candleLight2.position.x = Math.sin(time * Math.PI) * 0.25;
  //candleLight2.position.z = Math.cos(time * Math.PI * 0.75) * 0.25;
  //candleLight2.intensity = 2 + Math.sin(time * Math.PI * 2) * Math.cos(time * Math.PI * 1.5) * 0.25;

  controls.update();
  stats.update();
  renderer.render(scene, camera);
}

function initScene() {
  // create the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a3c4b);


  // Alternatively, we want to add a cube background
  // You can check one reference <CubeTextureLoader> at the beginning in the file.
  // But there are some bugs with this Loader and I am still working on solving it.

  /*
  scene.background = new THREE.CubeTextureLoader()
    .setPath('skybox/').load(
      [
        'front.jpg',
        'back.jpg',
        'top.jpg',
        'bottom.jpg',
        'right.jpg',
        'left.jpg'
      ]
    );

  const textureCube = new THREE.CubeTextureLoader()
    .setPath('skybox/')
    .load(['front.jpg', 'back.jpg', 'top.jpg', 'bottom.jpg', 'right.jpg', 'left.jpg']);
    textureCube.mapping = THREE.EquirectangularReflectionMapping;
  */
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  //camera.position.set(9, 5, -10).setLength(15);
  camera.position.set(27, 15, -30).setLength(45);
  //camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function initRenderer(container1) {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x101005);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  //document.body.appendChild(renderer.domElement);
  container1.appendChild(renderer.domElement);
}

function initLight() {
  //initialize directionalLight
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.025);
  directionalLight.position.setScalar(10);
  scene.add(directionalLight);

  //initialize ambientLight
  ambientLight = new THREE.AmbientLight(0xffffff, 0.625);
  scene.add(ambientLight);

  //initialize pointLight?
  //TODO
}

function initControls() {
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minPolarAngle = THREE.Math.degToRad(60);
  controls.maxPolarAngle = THREE.Math.degToRad(95);
  controls.minDistance = 4;
  controls.maxDistance = 20;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1;
  controls.target.set(0, 2, 0);
  controls.update();
}


// from here you may see many "redundant" functions
// I will consider combine them in the end to make the code more concise

// functions end with "WithXZ" are used to init mesh/object at (x=0,z=0)
// functions end without "WithXZ" are used to init mesh/object at given position (x,z) 

function candleCylinder() {
  var cylinderGeo = new THREE.CylinderGeometry( 0.5, 0.5, 6, 32 );//(r,r,h,num of faces)
  cylinderGeo.translate(0, 1, 0);//increase y to lift the cylinder up
  var cylinderMat = new THREE.MeshBasicMaterial( {color: 0xfffff0} );
  cylinderMesh = new THREE.Mesh( cylinderGeo, cylinderMat );

  scene.add( cylinderMesh );
}

function candleCylinderWithXZ(x, z) {
  var cylinderGeo = new THREE.CylinderGeometry( 0.5, 0.5, 6, 32 );//(r,r,h,num of faces)
  cylinderGeo.translate(x, 1, z);//increase y to lift the cylinder up
  var cylinderMat = new THREE.MeshBasicMaterial( {color: 0xfffff0} );
  var myCylinderMesh = new THREE.Mesh( cylinderGeo, cylinderMat );
  CylinderList.push(myCylinderMesh)
  scene.add(myCylinderMesh);
}

function candlewick() {
  var candlewickProfile = new THREE.Shape();
  candlewickProfile.absarc(0, 0, 0.0625, 0, Math.PI * 2);

  var candlewickCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.5, -0.0625),
    new THREE.Vector3(0.25, 0.5, 0.125)
  ]);

  var candlewickGeo = new THREE.ExtrudeBufferGeometry(candlewickProfile, {
    steps: 8,
    bevelEnabled: false,
    extrudePath: candlewickCurve
  });
  var colors = [];
  var color1 = new THREE.Color("black");
  var color2 = new THREE.Color(0x994411);
  var color3 = new THREE.Color(0xffff44);
  for (let i = 0; i < candlewickGeo.attributes.position.count; i++){
    if (candlewickGeo.attributes.position.getY(i) < 0.4){
      color1.toArray(colors, i * 3);
    }
    else {
      color2.toArray(colors, i * 3);
    };
    if (candlewickGeo.attributes.position.getY(i) < 0.15) color3.toArray(colors, i * 3);
  }
  candlewickGeo.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colors), 3 ) );
  candlewickGeo.translate(0, 3.8, 0);//original (0,0.95,0)
  var candlewickMat = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});

  var candlewickMesh = new THREE.Mesh(candlewickGeo, candlewickMat);
  //caseMesh.add(candlewickMesh);
  //paraffinMesh.add(candlewickMesh);
  cylinderMesh.add(candlewickMesh);
}

function candlewickWithXZ(x, z) {
  var candlewickProfile = new THREE.Shape();
  candlewickProfile.absarc(0, 0, 0.0625, 0, Math.PI * 2);

  var candlewickCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.5, -0.0625),
    new THREE.Vector3(0.25, 0.5, 0.125)
  ]);

  var candlewickGeo = new THREE.ExtrudeBufferGeometry(candlewickProfile, {
    steps: 8,
    bevelEnabled: false,
    extrudePath: candlewickCurve
  });
  var colors = [];
  var color1 = new THREE.Color("black");
  var color2 = new THREE.Color(0x994411);
  var color3 = new THREE.Color(0xffff44);
  for (let i = 0; i < candlewickGeo.attributes.position.count; i++){
    if (candlewickGeo.attributes.position.getY(i) < 0.4){
      color1.toArray(colors, i * 3);
    }
    else {
      color2.toArray(colors, i * 3);
    };
    if (candlewickGeo.attributes.position.getY(i) < 0.15) color3.toArray(colors, i * 3);
  }
  candlewickGeo.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colors), 3 ) );
  candlewickGeo.translate(x, 3.8, z);//original (0,0.95,0)-->(0,3.8,0)
  var candlewickMat = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});

  var myCandlewickMesh = new THREE.Mesh(candlewickGeo, candlewickMat);
  //caseMesh.add(candlewickMesh);
  //paraffinMesh.add(candlewickMesh);
  CandlewickList.push(myCandlewickMesh)
  scene.add(myCandlewickMesh);
}

function candleLight(){

  // candle light 1
  candleLight1 = new THREE.PointLight(0xffaa33, 1, 5, 2);
  candleLight1.position.set(0, 3, 0);
  candleLight1.castShadow = true; 
  //caseMesh.add(candleLight);
  //paraffinMesh.add(candleLight);
  cylinderMesh.add(candleLight1);

  // candle light 2
  candleLight2 = new THREE.PointLight(0xffaa33, 1, 5, 2);
  candleLight2.position.set(0, 4, 0);
  candleLight2.castShadow = true;
  //caseMesh.add(candleLight2);
  //paraffinMesh.add(candleLight2);
  cylinderMesh.add(candleLight2);

  //scene.add(new THREE.PointLightHelper(candleLight2));
}


function flame(isFrontSide){
  let flameGeo = new THREE.SphereBufferGeometry(0.5, 32, 32);
  flameGeo.translate(0, 0.5, 0);// don't change geometry position
  
  let flameMat = getFlameMaterial(true); 
  flameMaterials.push(flameMat);
  let flameMesh = new THREE.Mesh(flameGeo, flameMat);
  flameMesh.position.set(0.06, 4.2, 0.06);//original (0.06, 1.2, 0.06)
  flameMesh.rotation.y = THREE.Math.degToRad(-45);
  //caseMesh.add(flameMesh);
  //paraffinMesh.add(flameMesh);
  cylinderMesh.add(flameMesh);
}

function flameWithXZ(isFrontSide, x, z){
  let flameGeo = new THREE.SphereBufferGeometry(0.5, 32, 32);
  flameGeo.translate(0, 0.5, 0);// don't change geometry position
  
  let flameMat = getFlameMaterial(true); 
  flameMaterials.push(flameMat);
  let myFlameMesh = new THREE.Mesh(flameGeo, flameMat);
  myFlameMesh.position.set(x + 0.06, 4.2, z + 0.06);//original (0.06, 1.2, 0.06)
  myFlameMesh.rotation.y = THREE.Math.degToRad(-45);
  //caseMesh.add(flameMesh);
  //paraffinMesh.add(flameMesh);
  FlameList.push(myFlameMesh)
  scene.add(myFlameMesh);
}

function oneCandleToPackThemAll(){
  candleCylinder();
  candlewick();
  candleLight();
  flame(false);
  flame(true);
}

function oneCandleToPackThemAllWithXZ(x, z){
  candleCylinderWithXZ(x, z);
  candlewickWithXZ(x, z);
  flameWithXZ(false, x, z);
  flameWithXZ(true, x, z);
}


function table(){
  var tableGeo = new THREE.CylinderBufferGeometry(28, 28, 0.5, 64);
  tableGeo.translate(0, -0.25, 0);
  var tableMat = new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/hardwood2_diffuse.jpg"), metalness: 0, roughness: 0.75});
  var tableMesh = new THREE.Mesh(tableGeo, tableMat);
  tableMesh.receiveShadow = true;
  //tableMesh.add(caseMesh);
  //tableMesh.add(paraffinMesh);

  //tableMesh.add(cylinderMesh);
  scene.add(tableMesh);
}

function initStats(container2) {
  stats = new Stats();
  stats.setMode(0);

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  container2.appendChild(stats.domElement);
}

/*

// This is an alternative way to implement the initStates()
// needs other modification associated with the .html file
// don't bother to change this if everything else works.
// You can check one reference <about stats> at the beginning in the file.

function initStats(){
  stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  //将统计对象添加到对应的<div>元素中 ... see the .html document
  document.getElementById("Stats-output").appendChild(stats.domElement);
}
*/

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight);
}

function PeachHeart(r,dx,dy,callback){
  var m,n,x,y,i;
    //i的最大值*自增长值等于10为合适
    for(i = 0; i <= 25; i += 0.4){
      m = i;
      n = -r * (((Math.sin(i) * Math.sqrt(Math.abs(Math.cos(i)))) / (Math.sin(i) + 1.4)) - 2 * Math.sin(i) + 2);
      x = n * Math.cos(m) + dx;
      y = n * Math.sin(m) + dy;
      //console.log(i+'|x:' + x+"|y:"+y);  
      //callback(i,x,y);
      callback(x,y);
    }
}

