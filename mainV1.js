/*!
 * mainV1.js 
 *
 * Dependices:
 * Should Includes three.js
 * Check this website for color coding reference:  https://www.w3schools.com/tags/ref_colornames.asp
 */


/*
let scene = undefined;
let renderer = undefined;
let camera = undefined;
let pointLight = ambientLight = undefined;
let controls = undefined;
let stats = undefined;
*/
       
//创建场景

var scene = new THREE.Scene();
//scene.background = new THREE.Color(0x2a3c4b);
scene.background = new THREE.CubeTextureLoader()
  .setPath('skybox/')
  .load(['front.jpg', 'back.jpg', 'top.jpg', 'down.jpg', 'right.jpg', 'left.jpg']);

//const textureCube = new THREE.CubeTextureLoader()
//  .setPath('skybox/')
//  .load(['front.jpg', 'back.jpg', 'top.jpg', 'down.jpg', 'right.jpg', 'left.jpg']);
//  textureCube.mapping = THREE.EquirectangularReflectionMapping;

var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

camera.position.set(9, 5, -10).setLength(15);
var renderer = new THREE.WebGLRenderer({antialias: true});



renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x101005);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minPolarAngle = THREE.Math.degToRad(60);
controls.maxPolarAngle = THREE.Math.degToRad(95);
controls.minDistance = 4;
controls.maxDistance = 20;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.target.set(0, 2, 0);
controls.update();

       
// light
var light1 = new THREE.DirectionalLight(0xffffff, 0.025);
light1.position.setScalar(10);
scene.add(light1);
scene.add(new THREE.AmbientLight(0xffffff, 0.625));


/*
// candle
var casePath = new THREE.Path();
casePath.moveTo(0, 0);
casePath.lineTo(0, 0);
casePath.absarc(1.5, 0.5, 0.5, Math.PI * 1.5, Math.PI * 2);
casePath.lineTo(2, 1.5);
casePath.lineTo(1.99, 1.5);
casePath.lineTo(1.9, 0.5);
var caseGeo = new THREE.LatheBufferGeometry(casePath.getPoints(), 64);
var caseMat = new THREE.MeshStandardMaterial({color: "silver" });
var caseMesh = new THREE.Mesh(caseGeo, caseMat);
caseMesh.castShadow = true;
*/


/*

// paraffin
var paraffinPath = new THREE.Path();
paraffinPath.moveTo(0, -.25);
paraffinPath.lineTo(0, -.25);
paraffinPath.absarc(1, 0, 0.25, Math.PI * 1.5, Math.PI * 2);
paraffinPath.lineTo(1.25, 0);
paraffinPath.absarc(1.89, 0.1, 0.1, Math.PI * 1.5, Math.PI * 2);
var paraffinGeo = new THREE.LatheBufferGeometry(paraffinPath.getPoints(), 64);
paraffinGeo.translate(0, 1.25, 0);
var paraffinMat = new THREE.MeshStandardMaterial({color: 0xffff99, side: THREE.BackSide, metalness: 0, roughness: 0.75});
var paraffinMesh = new THREE.Mesh(paraffinGeo, paraffinMat);
//caseMesh.add(paraffinMesh);
paraffinMesh.castShadow = true;
*/

//cylinderMesh
var cylinderGeo = new THREE.CylinderGeometry( 0.5, 0.5, 4, 32 );//(r,r,h,num of faces)
var cylinderMat = new THREE.MeshBasicMaterial( {color: 0xfffff0} );
var cylinderMesh = new THREE.Mesh( cylinderGeo, cylinderMat );
scene.add( cylinderMesh );




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
candlewickGeo.translate(0, 2, 0);//move it to where you want(0,0.95,0)
var candlewickMat = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});

var candlewickMesh = new THREE.Mesh(candlewickGeo, candlewickMat);
//caseMesh.add(candlewickMesh);
//paraffinMesh.add(candlewickMesh);
cylinderMesh.add(candlewickMesh);


// candle light
var candleLight = new THREE.PointLight(0xffaa33, 1, 5, 2);
candleLight.position.set(0, 3, 0);
candleLight.castShadow = true; 
//caseMesh.add(candleLight);
//paraffinMesh.add(candleLight);
cylinderMesh.add(candleLight);



var candleLight2 = new THREE.PointLight(0xffaa33, 1, 5, 2);
candleLight2.position.set(0, 4, 0);
candleLight2.castShadow = true;
//caseMesh.add(candleLight2);
//paraffinMesh.add(candleLight2);
cylinderMesh.add(candleLight2);


//scene.add(new THREE.PointLightHelper(candleLight2));


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


// table
var tableGeo = new THREE.CylinderBufferGeometry(14, 14, 0.5, 64);
tableGeo.translate(0, -0.25, 0);
var tableMat = new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/hardwood2_diffuse.jpg"), metalness: 0, roughness: 0.75});
var tableMesh = new THREE.Mesh(tableGeo, tableMat);
tableMesh.receiveShadow = true;
//tableMesh.add(caseMesh);
//tableMesh.add(paraffinMesh);
tableMesh.add(cylinderMesh);



scene.add(tableMesh);






//-----------------------------  LAOD BACKGROUND  ---------------------------------START

/*
//load background
//load in this order: ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']
//if you are not sure how Cartesian coordinate system looks like check here: https://discoverthreejs.com/book/first-steps/transformations/
scene.background = new THREE.CubeTextureLoader()
  .setPath('skybox/')
  .load(['front.jpg', 'back.jpg', 'top.jpg', 'down.jpg', 'right.jpg', 'left.jpg']);
  const textureCube = new THREE.CubeTextureLoader()
  .setPath('skybox/')
  .load(['front.jpg', 'back.jpg', 'top.jpg', 'down.jpg', 'right.jpg', 'left.jpg']);
  textureCube.mapping = THREE.EquirectangularReflectionMapping;
*/

camera.position.z = 5;

var clock = new THREE.Clock();
var time = 0;

render();

function render(){
  requestAnimationFrame(render);
  time += clock.getDelta();
  //flameMaterials[0].uniforms.time.value = time;
  //flameMaterials[1].uniforms.time.value = time;
  candleLight2.position.x = Math.sin(time * Math.PI) * 0.25;
  candleLight2.position.z = Math.cos(time * Math.PI * 0.75) * 0.25;
  candleLight2.intensity = 2 + Math.sin(time * Math.PI * 2) * Math.cos(time * Math.PI * 1.5) * 0.25;
  controls.update();
  renderer.render(scene, camera);
}


//function render(){
//
//}

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



