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

//let cylinderGeo = undefined; 
//let cylinderMat = undefined; 
let cylinderMesh = undefined;

let candleLight1 = undefined;
let candleLight2 = undefined;

       




main();
render();

function main() {
  //note that there is a logical order to add below things
  //the current order is correct
  //be careful if you change the order since it might not work after change
  initScene();
  initCamera();
  initRenderer(container1);
  initLight();
  candleCylinder();
  candlewick();
  candleLight();
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
  //flameMaterials[0].uniforms.time.value = time;
  //flameMaterials[1].uniforms.time.value = time;
  candleLight2.position.x = Math.sin(time * Math.PI) * 0.25;
  candleLight2.position.z = Math.cos(time * Math.PI * 0.75) * 0.25;
  candleLight2.intensity = 2 + Math.sin(time * Math.PI * 2) * Math.cos(time * Math.PI * 1.5) * 0.25;
  controls.update();
  //
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
  camera.position.set(9, 5, -10).setLength(15);
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


function candleCylinder() {
  var cylinderGeo = new THREE.CylinderGeometry( 0.5, 0.5, 4, 32 );//(r,r,h,num of faces)
  var cylinderMat = new THREE.MeshBasicMaterial( {color: 0xfffff0} );
  cylinderMesh = new THREE.Mesh( cylinderGeo, cylinderMat );
  //scene.add( cylinderMesh );

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
  candlewickGeo.translate(0, 2, 0);//move it to where you want(0,0.95,0)
  var candlewickMat = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});

  var candlewickMesh = new THREE.Mesh(candlewickGeo, candlewickMat);
  //caseMesh.add(candlewickMesh);
  //paraffinMesh.add(candlewickMesh);
  cylinderMesh.add(candlewickMesh);

}

function candleLight(){

  // candle light 1
  candleLight1 = new THREE.PointLight(0xffaa33, 1, 5, 2);
  candleLight1.position.set(0, 3, 0);
  candleLight1.castShadow = true; 
  //caseMesh.add(candleLight);
  //paraffinMesh.add(candleLight);
  cylinderMesh.add(candleLight1);

  // candle light 1
  candleLight2 = new THREE.PointLight(0xffaa33, 1, 5, 2);
  candleLight2.position.set(0, 4, 0);
  candleLight2.castShadow = true;
  //caseMesh.add(candleLight2);
  //paraffinMesh.add(candleLight2);
  cylinderMesh.add(candleLight2);


  //scene.add(new THREE.PointLightHelper(candleLight2));
}


/*

// flame
var flameMaterials = [];
function flame(isFrontSide){
  let flameGeo = new THREE.SphereBufferGeometry(0.5, 32, 32);
  flameGeo.translate(0, 0.5, 0);
  let flameMat = getFlameMaterial(true);
  flameMaterials.push(flameMat);
  let flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.set(0.06, 1.2, 0.06);
  flame.rotation.y = THREE.Math.degToRad(-45);
  //caseMesh.add(flame);
  //paraffinMesh.add(flame);
  cylinderMesh.add(flame);
}

flame(false);
flame(true);

*/


function table(){
  var tableGeo = new THREE.CylinderBufferGeometry(14, 14, 0.5, 64);
  tableGeo.translate(0, -0.25, 0);
  var tableMat = new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/hardwood2_diffuse.jpg"), metalness: 0, roughness: 0.75});
  var tableMesh = new THREE.Mesh(tableGeo, tableMat);
  tableMesh.receiveShadow = true;
  //tableMesh.add(caseMesh);
  //tableMesh.add(paraffinMesh);

  tableMesh.add(cylinderMesh);
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





//-----------------------------  functions under development  ----------------------START



function PeachHeart(r,dx,dy,callback){
	var m,n,x,y,i;
    //i的最大值*自增长值等于10为合适
    for(i = 0; i <= 25; i += 0.4){
    	m = i;
    	n = -r * (((Math.sin(i) * Math.sqrt(Math.abs(Math.cos(i)))) / (Math.sin(i) + 1.4)) - 2 * Math.sin(i) + 2);
    	x = n * Math.cos(m) + dx;
    	y = n * Math.sin(m) + dy;
    	//console.log(i+'|x:' + x+"|y:"+y);  
    	callback(i,x,y);
    }
}


function getFlameMaterial(isFrontSide){
                let side = isFrontSide ? THREE.FrontSide : THREE.BackSide;
                return new THREE.ShaderMaterial({
                    uniforms: {
                        time: {value: 0}
                    },
                    vertexShader: `
                    uniform float time;
                    varying vec2 vUv;
                    varying float hValue;s

                    //https://thebookofshaders.com/11/
                    // 2D Random
                    float random (in vec2 st) {
                        return fract(sin(dot(st.xy,
                                             vec2(12.9898,78.233)))
                                     * 43758.5453123);
                    }

                    // 2D Noise based on Morgan McGuire @morgan3d
                    // https://www.shadertoy.com/view/4dS3Wd
                    float noise (in vec2 st) {
                        vec2 i = floor(st);
                        vec2 f = fract(st);

                        // Four corners in 2D of a tile
                        float a = random(i);
                        float b = random(i + vec2(1.0, 0.0));
                        float c = random(i + vec2(0.0, 1.0));
                        float d = random(i + vec2(1.0, 1.0));

                        // Smooth Interpolation

                        // Cubic Hermine Curve.  Same as SmoothStep()
                        vec2 u = f*f*(3.0-2.0*f);
                        // u = smoothstep(0.,1.,f);

                        // Mix 4 coorners percentages
                        return mix(a, b, u.x) +
                                (c - a)* u.y * (1.0 - u.x) +
                                (d - b) * u.x * u.y;
                    }

                    void main() {
                      vUv = uv;
                      vec3 pos = position;

                      pos *= vec3(0.8, 2, 0.725);
                      hValue = position.y;
                      //float sinT = sin(time * 2.) * 0.5 + 0.5;
                      float posXZlen = length(position.xz);

                      pos.y *= 1. + (cos((posXZlen + 0.25) * 3.1415926) * 0.25 + noise(vec2(0, time)) * 0.125 + noise(vec2(position.x + time, position.z + time)) * 0.5) * position.y; // flame height

                      pos.x += noise(vec2(time * 2., (position.y - time) * 4.0)) * hValue * 0.0312; // flame trembling
                      pos.z += noise(vec2((position.y - time) * 4.0, time * 2.)) * hValue * 0.0312; // flame trembling

                      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
                  }
                  `,
                  fragmentShader: `
                    varying float hValue;
                    varying vec2 vUv;

                    // honestly stolen from https://www.shadertoy.com/view/4dsSzr
                    vec3 heatmapGradient(float t) {
                      return clamp((pow(t, 1.5) * 0.8 + 0.2) * vec3(smoothstep(0.0, 0.35, t) + t * 0.5, smoothstep(0.5, 1.0, t), max(1.0 - t * 1.7, t * 7.0 - 6.0)), 0.0, 1.0);
                    }

                    void main() {
                      float v = abs(smoothstep(0.0, 0.4, hValue) - 1.);
                      float alpha = (1. - v) * 0.99; // bottom transparency
                      alpha -= 1. - smoothstep(1.0, 0.97, hValue); // tip transparency
                      gl_FragColor = vec4(heatmapGradient(smoothstep(0.0, 0.3, hValue)) * vec3(0.95,0.95,0.4), alpha) ;
                      gl_FragColor.rgb = mix(vec3(0,0,1), gl_FragColor.rgb, smoothstep(0.0, 0.3, hValue)); // blueish for bottom
                      gl_FragColor.rgb += vec3(1, 0.9, 0.5) * (1.25 - vUv.y); // make the midst brighter
                      gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.66, 0.32, 0.03), smoothstep(0.95, 1., hValue)); // tip
                    }`,
                    transparent: true,
                    side: side
                });
            }



