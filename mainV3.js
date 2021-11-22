let container, stats;

let camera, scene, renderer;

let pointLight;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	//cubemap
	// var reflectionCube = new THREE.CubeTextureLoader()
 //  	.setPath('skybox/')
 //  	.load(['front.jpg', 'back.jpg', 'right.jpg', 'left.jpg', 'top.jpg', 'bottom.jpg']);
	// refractionCube.mapping = THREE.CubeRefractionMapping;

	const path = 'file://skybox/';
	const format = '.jpg';
	// const urls = [
	// 	path + 'px' + format, path + 'nx' + format,
	// 	path + 'py' + format, path + 'ny' + format,
	// 	path + 'pz' + format, path + 'nz' + format
	// ];

	const urls = [
		path + 'front' + format, path + 'back' + format,
		path + 'right' + format, path + 'left' + format,
		path + 'top' + format, path + 'bottom' + format
	];

	const reflectionCube = new THREE.CubeTextureLoader().load( urls );
	const refractionCube = new THREE.CubeTextureLoader().load( urls );
	refractionCube.mapping = THREE.CubeRefractionMapping;

	scene = new THREE.Scene();
	scene.background = reflectionCube;
	// scene.background = new THREE.Color(0x2a3c4b);

	// camera

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 2000;
	// camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
	// camera.position.set(27, 15, -30).setLength(45);

	// LIGHTS

	//initialize directionalLight
	var directionalLight = new THREE.DirectionalLight(0xffffff, 0.025);
	directionalLight.position.setScalar(10);
	scene.add(directionalLight);

	//initialize ambientLight
	var ambientLight = new THREE.AmbientLight(0xffffff, 0.625);
	scene.add(ambientLight);

	renderer = new THREE.WebGLRenderer({antialias: true});
 	renderer.setSize(window.innerWidth, window.innerHeight);
 	renderer.setClearColor(0x101005);
 	renderer.shadowMap.enabled = true;
 	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  	//document.body.appendChild(renderer.domElement);
 	container.appendChild(renderer.domElement);

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

	stats = new Stats();
 	stats.setMode(0);

 	stats.domElement.style.position = 'absolute';
 	stats.domElement.style.left = '0px';
 	stats.domElement.style.top = '0px';
	container.appendChild( stats.dom );

	window.addEventListener( 'resize', onWindowResize );


}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
	stats.update();
	controls.update();
	requestAnimationFrame( animate );
	render();

}

function render() {
	renderer.render( scene, camera );
}