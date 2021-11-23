let container1, container2, stats;

let camera, scene, renderer, controls;

// let caseMesh;
let tableMesh;
// let candleLight;
// let candleLight2;
var flameMaterials = [];
var candleList = [];
var candleLight2List = [];

// fireflies
let fireflies = [];

// GUI
let effectController;

class Fly {
  constructor() {
    this.group = new THREE.Group();
    this.drawLight();
  }
  drawLight() {
    const geometry = new THREE.SphereBufferGeometry(0.2, 16, 16);
    // const flyLight = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    //   color: 0xB1E770,
    //   shading: THREE.FlatShading,
    // }));
    const flyLight = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial( {
        emissive: 0xB1E770,
        emissiveIntensity: 1,
        color: 0xB1E770
    }));
    this.group.add(flyLight);

    // flyLight.rotation.y = 45 * (Math.PI / 180);

    // const light = new THREE.PointLight(0x00FFA5, 1, 15);
    // light.add(flyLight);
    // light.position.set(0, 10, 0);
    // light.castShadow = false;
    // this.group.add(light);
  }
}

main();

function main() {
  init();

  // lonely candle
  // candle(0, 0);
  // flame(false, 0, 0);
  // flame(true, 0, 0);

  // Peach heart
  PeachHeart(5, 0, 0,function(x, z) {
      candle(x, z);
      flame(false, x, z);
      flame(true, x, z);
  });

  // table
  table();

  // fireflies
  drawFireflies();

  window.addEventListener('resize', onWindowResize, false);

  // GUI
  setupGui();
}


function init() {

  //scene
  scene = new THREE.Scene();
  const textureCube = new THREE.CubeTextureLoader()
    // .setPath('skybox/')
    // .load(['front.jpg', 'back.jpg', 'top.jpg', 'bottom.jpg', 'right.jpg', 'left.jpg']);
    .setPath('star_sky/')
    .load(['front.jpeg', 'back.jpeg', 'top.jpeg', 'bottom.jpeg', 'right.jpeg', 'left.jpeg']);
  textureCube.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = textureCube;

  // camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  // camera.position.set(3, 20, 8).setLength(100);
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 500, 200).setLength(100);


  // renderer
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x101005);
  renderer.shadowMap.enabled = false; // true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container1 = document.createElement('div');
  document.body.appendChild(container1);
  container1.appendChild(renderer.domElement);

  // stats
  stats = new Stats();
  stats.setMode(0);

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  container2 = document.createElement('div');
  
  document.body.appendChild(container2);
  container2.appendChild(stats.domElement);

  // controls
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

  // scene.add(new THREE.GridHelper(10, 10, 0x552222, 0x333322));

  var light = new THREE.DirectionalLight(0xffffff, 0.025);
  light.position.setScalar(10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.0625));

}




function candle(x, z) {

  // cylinder candle
  var cylinderGeo = new THREE.CylinderGeometry( 0.6, 0.6, 2, 32 );//(r,r,h,num of faces)
  cylinderGeo.translate(x, 0, z);//increase y to lift the cylinder up
  var cylinderMat = new THREE.MeshStandardMaterial( {color: 0xffff99, metalness: 0, roughness: 0.75} );
  var cylinderMesh = new THREE.Mesh( cylinderGeo, cylinderMat);


  // // candle
  // var casePath = new THREE.Path();
  // casePath.moveTo(0, 0);
  // casePath.lineTo(0, 0);
  // casePath.absarc(1.5, 0.5, 0.5, Math.PI * 1.5, Math.PI * 2);
  // casePath.lineTo(2, 1.5);
  // casePath.lineTo(1.99, 1.5);
  // casePath.lineTo(1.9, 0.5);
  // var caseGeo = new THREE.LatheBufferGeometry(casePath.getPoints(), 64);
  // caseGeo.translate(x, 0, z);
  // var caseMat = new THREE.MeshStandardMaterial({color: "silver" });
  // var caseMesh = new THREE.Mesh(caseGeo, caseMat);
  // caseMesh.castShadow = false;

  // // paraffin
  // var paraffinPath = new THREE.Path();
  // paraffinPath.moveTo(0, -.25);
  // paraffinPath.lineTo(0, -.25);
  // paraffinPath.absarc(1, 0, 0.25, Math.PI * 1.5, Math.PI * 2);
  // paraffinPath.lineTo(1.25, 0);
  // paraffinPath.absarc(1.89, 0.1, 0.1, Math.PI * 1.5, Math.PI * 2);
  // var paraffinGeo = new THREE.LatheBufferGeometry(paraffinPath.getPoints(), 64);
  // paraffinGeo.translate(x, 1.25, z);
  // var paraffinMat = new THREE.MeshStandardMaterial({color: 0xffff99, side: THREE.BackSide, metalness: 0, roughness: 0.75});
  // var paraffinMesh = new THREE.Mesh(paraffinGeo, paraffinMat);
  // caseMesh.add(paraffinMesh);

  // candlewick
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
  candlewickGeo.translate(x, 0.95, z);
  var candlewickMat = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});

  var candlewickMesh = new THREE.Mesh(candlewickGeo, candlewickMat);
  cylinderMesh.add(candlewickMesh);

  // candle light
  candleLight = new THREE.PointLight(0xffaa33, 0.5, 3, 2);
  candleLight.position.set(x, 2.2, z);
  candleLight.castShadow = false; 
  cylinderMesh.add(candleLight);
  candleLight2 = new THREE.PointLight(0xffaa33, 0.5, 6, 2);
  candleLight2.position.set(x, 2.5, z);
  candleLight2.castShadow = false;
  candleLight2List.push(candleLight2);
  cylinderMesh.add(candleLight2);
  // scene.add(new THREE.PointLightHelper(candleLight));
  // scene.add(new THREE.PointLightHelper(candleLight2));
  candleList.push(cylinderMesh);
  scene.add(cylinderMesh);
}

function flame(isFrontSide, x, z){
  // flame
  let flameGeo = new THREE.SphereBufferGeometry(0.3, 32, 32);
  flameGeo.translate(0, 0.3, 0);

  let flameMat = getFlameMaterial(true);
  flameMaterials.push(flameMat);
  let flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.set(x + 0.06, 1.2, z + 0.06);
  flame.rotation.y = THREE.Math.degToRad(-45);
  scene.add(flame);
}

function table() {
  // table
  var tableGeo = new THREE.CylinderBufferGeometry(50, 50, 0.5, 64);
  // var tableGeo = new THREE.BoxGeometry(100, 0.5, 100);
  // var axesHelper = new THREE.AxesHelper( 5 );
  // scene.add( axesHelper );
  tableGeo.translate(0, -0.25, 0);
  var tableMat = new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/hardwood2_diffuse.jpg"), metalness: 0, roughness: 0.75});
  tableMesh = new THREE.Mesh(tableGeo, tableMat);
  tableMesh.receiveShadow = false;
  // tableMesh.add(caseMesh);
  scene.add(tableMesh);
}


// pentagram
/*var penta = new THREE.CircleGeometry(7, 5);
penta.rotateX(-Math.PI * 0.5);
penta.vertices.shift();
var pentagramGeo = new THREE.BufferGeometry().setFromPoints(penta.vertices);
pentagramGeo.setIndex([0,1, 1,2, 2,3, 3,4, 4,0, 0,2, 2,4, 4,1, 1,3, 3,0]);
var pentagram = new THREE.LineSegments(pentagramGeo, new THREE.LineBasicMaterial({color: 0xff3311}));
pentagram.y = 0.01;
scene.add(pentagram);*/

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight);
}


function setupGui() {

  effectController = {

  // candle paraffin color
  hue: 0.166666,
  saturation: 1,
  lightness: 0.8,

  // candle light 2
  lhue: 0.097222,
  lsaturation: 1,  
  llightness: 0.6,
  lintensity: 0.5,
  ldistance: 6,

  // candle text 4 numbers
  one: "0",
  two: "9",
  three: "3",
  four: "0",

  };

  let h;

  const gui = new dat.GUI();

  // candle paraffin color

  h = gui.addFolder( "Candle paraffin color" );

  h.add( effectController, "hue", 0.0, 1.0, 0.025 ).name( "hue" ).onChange( render_gui );
  h.add( effectController, "saturation", 0.0, 1.0, 0.025 ).name( "saturation" ).onChange( render_gui );
  h.add( effectController, "lightness", 0.0, 1.0, 0.025 ).name( "lightness" ).onChange( render_gui );
 
  // candle light 2

  h = gui.addFolder( "Candle Lighting" );

  h.add( effectController, "lhue", 0.0, 1.0, 0.025 ).name( "hue" ).onChange( render_gui );
  h.add( effectController, "lsaturation", 0.0, 1.0, 0.025 ).name( "saturation" ).onChange( render_gui );
  h.add( effectController, "llightness", 0.0, 1.0, 0.025 ).name( "lightness" ).onChange( render_gui );
  h.add( effectController, "ldistance", 0.0, 10.0, 0.01 ).name( "distance" ).onChange( render_gui );

  // candle text 4 numbers

  h = gui.addFolder( "Candle Number" );
  h.add( effectController, "one", [ "0", "1", "2", "3", "4", 
    "5", "6", "7", "8", "9"] ).name( "First Num" ).onChange( render_num );
  h.add( effectController, "two", [ "0", "1", "2", "3", "4", 
    "5", "6", "7", "8", "9"] ).name( "Second Num" ).onChange( render_num );
  h.add( effectController, "three", [ "0", "1", "2", "3", "4", 
    "5", "6", "7", "8", "9"] ).name( "Third Num" ).onChange( render_num );
  h.add( effectController, "four", [ "0", "1", "2", "3", "4", 
    "5", "6", "7", "8", "9"] ).name( "Fourth Num" ).onChange( render_num );

}

var clock = new THREE.Clock();
var time = 0;

render();

function render(){
  requestAnimationFrame(render);
  time += clock.getDelta();
  for (let i = 0; i < candleList.length; i++) {
    flameMaterials[2 * i].uniforms.time.value = time;
    flameMaterials[2 * i + 1].uniforms.time.value = time;
    // candleLight2.position.x = 5 + Math.sin(time * Math.PI) * 0.25;
    // candleLight2.position.z = 10 + Math.cos(time * Math.PI * 0.75) * 0.25;
    candleLight2List[i].intensity = 2 + Math.sin(time * Math.PI * 2) * Math.cos(time * Math.PI * 1.5) * 0.25;
  }

  fireflies.forEach((firefly, index) => {
    const xPos = 20 * Math.cos(time / 4 + index) + 10;
    const yPos = 5 * Math.sin(time / 6 * index) + 20;
    const zPos = 20 * Math.sin(time / 4 + index) + 10;
    firefly.group.position.set(xPos, yPos, zPos);
  });
  controls.update();
  stats.update();
  renderer.render(scene, camera);
}

function render_gui(){
  // console.log(candleList[0].material.color.getHSL());
  // console.log(candleLight2List[0].color.getHSL());
  for (let i = 0; i < candleList.length; i++) {
    candleList[i].material.color.setHSL( effectController.hue, effectController.saturation, effectController.lightness );
    candleLight2List[i].color.setHSL( effectController.lhue, effectController.lsaturation, effectController.llightness );
    candleLight2List[i].distance = effectController.ldistance;
  }
}

function render_num(){
    // String from effect controller [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    // effectController.one
    // effectController.two
    // effectController.three
    // effectController.four
}

function PeachHeart(r,dx,dy,callback){
  var m,n,x,y,i;
    //i的最大值*自增长值等于10为合适
    for(i = 0; i <= 25; i += 1){
      m = i;
      n = -r * (((Math.sin(i) * Math.sqrt(Math.abs(Math.cos(i)))) / (Math.sin(i) + 1.4)) - 2 * Math.sin(i) + 2);
      x = n * Math.cos(m) + dx;
      y = n * Math.sin(m) + dy;
      // console.log(i+'|x:' + x+"|y:"+y);  
      //callback(i,x,y);
      callback(x,y);
    }
}

// Fireflies
function drawFireflies() {
  const rand = (min, max) => THREE.Math.randFloat(min, max);
  for (let i = 0; i < 15; i += 1) {
    const firefly = new Fly();
    firefly.group.position.set(rand(-5, 20), rand(5, 20), rand(-5, 20));

    // const scale = rand(0.3, 1);
    // firefly.group.scale.set(scale, scale, scale);

    scene.add(firefly.group);
    fireflies.push(firefly);
  }
}

