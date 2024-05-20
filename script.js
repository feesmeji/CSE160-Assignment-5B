import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js';

//ChatGPT suggested I add this line of code to debug my shapes not spinning 
let cube, sphere, tetrahedron; // Declare variables at higher scope

function main() {
	const scene = new THREE.Scene();
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	function updateLight() {

		light.target.updateMatrixWorld();
		helper.update();
	}

// Add sky2block
{

	const loader = new THREE.CubeTextureLoader();
	const texture = loader.load([
		'end_sky.jpg',
		'end_sky.jpg',
		'end_sky.jpg',
		'end_sky.jpg',
		'end_sky.jpg',
		'end_sky.jpg',

	] );
	scene.background = texture;

}

//Camera Setup
//Update from last time
	const fov = 45;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 10, 20 );

	class MinMaxGUIHelper {

		constructor( obj, minProp, maxProp, minDif ) {

			this.obj = obj;
			this.minProp = minProp;
			this.maxProp = maxProp;
			this.minDif = minDif;

		}
		get min() {

			return this.obj[ this.minProp ];

		}
		set min( v ) {

			this.obj[ this.minProp ] = v;
			this.obj[ this.maxProp ] = Math.max( this.obj[ this.maxProp ], v + this.minDif );

		}
		get max() {

			return this.obj[ this.maxProp ];

		}
		set max( v ) {

			this.obj[ this.maxProp ] = v;
			this.min = this.min; // this will call the min setter

		}

	}

	function updateCamera() {

		camera.updateProjectionMatrix();

	}

	// const gui = new GUI();
	// gui.add( camera, 'fov', 1, 180 ).onChange( updateCamera );
	// const minMaxGUIHelper = new MinMaxGUIHelper( camera, 'near', 'far', 0.1 );
	// gui.add( minMaxGUIHelper, 'min', 0.1, 50, 0.1 ).name( 'neafr' ).onChange( updateCamera );
	// gui.add( minMaxGUIHelper, 'max', 0.1, 50, 0.1 ).name( 'far' ).onChange( updateCamera );

//Passed the OrbitControls a camera to control
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 ); //orbit around 5 units above the origin and call control.update.
	controls.update();
	// /scene.background = new THREE.Color( 'black' );


// Floor 
	{
		//Load grass texture, 
	 const planeSize = 60;    //size of the floor.

		const loader = new THREE.TextureLoader();
		const texture = loader.load( 'grasslight-big.jpg' );
		texture.wrapS = THREE.RepeatWrapping;   //repeat the texture 
		texture.wrapT = THREE.RepeatWrapping;   //repeat the texture
		texture.magFilter = THREE.NearestFilter;   //set filtering to nearest.
		//texture.colorSpace = THREE.SRGBColorSpace;
		const repeats = planeSize / 20;  //"Since the texture is a 2x2 pixel checkerboard, by repeating and setting the repeat to half the size of the plane each check on the checkerboard will be exactly 1 unit large"
		texture.repeat.set( repeats, repeats );


		//Make Plane geometry. (Default Xy plane), ground (XZ) plane
		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshStandardMaterial( {  //make material for the plane
			map: texture,
			side: THREE.DoubleSide,
		} );
		//Create a mesh to insert it in the scene.
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
		scene.add( mesh );

	}

	{
		//Light Blue Cube
		const cubeSize = 4;
		const cubeGeo = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
		const cubeMat = new THREE.MeshStandardMaterial( { color: '#8AC' } );
		const mesh = new THREE.Mesh( cubeGeo, cubeMat );
		mesh.position.set( cubeSize + 1, cubeSize / 2, 0 );
		scene.add( mesh );

	}

	{
		//Tan Sphere
		const sphereRadius = 3;
		const sphereWidthDivisions = 32;
		const sphereHeightDivisions = 16;
		const sphereGeo = new THREE.SphereGeometry( sphereRadius, sphereWidthDivisions, sphereHeightDivisions );
		const sphereMat = new THREE.MeshStandardMaterial( { color: '#CA8' } );
		const mesh = new THREE.Mesh( sphereGeo, sphereMat );
		mesh.position.set( - sphereRadius - 4, sphereRadius + 2, 0 );
		scene.add( mesh );

	}
	{
		//3A cube:
		const boxWidth = 4;
		const boxHeight = 4;
		const boxDepth = 4;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

		const loader = new THREE.TextureLoader();
		const texture = loader.load( 'rubber_duck.jpg');
		texture.colorSpace = THREE.SRGBColorSpace;

		const material = new THREE.MeshStandardMaterial( { map: texture} ); // greenish blue hex number
		cube = new THREE.Mesh( geometry, material );
		//cube.visible = false
		cube.position.set(0,3,0);
		scene.add( cube );
	}

	{
		//3A Sphere
		const sphere_geometry = new THREE.SphereGeometry( 0.7, 32, 16 ); 
		const sphere_material = new THREE.MeshStandardMaterial( { color: 0xff0000 } ); 
		sphere = new THREE.Mesh( sphere_geometry, sphere_material ); 

		sphere.position.set(-10,1,0);  //chatgpt suggested I use this function to set the position on the screen, I put the values on my own

		scene.add( sphere );
	}

	{
		//3A Tetrahedron
		const tetrahedron_geometry = new THREE.TetrahedronGeometry(2, 0);
		const tetrahedron_material = new THREE.MeshStandardMaterial({color : 0x00FFFF });
		tetrahedron = new THREE.Mesh(tetrahedron_geometry, tetrahedron_material);

		tetrahedron.position.set(10, 4 ,0);

		scene.add(tetrahedron);
	}

	{
	//3A Dog Obj File
	//Stuff for obj file
	//create init object
	const objLoader = new OBJLoader();
	objLoader.load('./white_dog.obj', (object) => {
	//object.rotation.set(0,60,0);
	object.scale.set(0.5, 0.5, 0.5); // Adjust the scaling factor (CHATgpt helped me come up with this line of code, I input the numbers by myself)
	object.position.set(0,-0.1,-15);    //I added the appropriate numbers to get close to the cube

	
	scene.add(object);
	// Apply texture to the material of the 3D dog object (chatgpt helped me come up with the next 4 lines, I learned its a standard way of applying textures to 3d object like this using children)
	// Similar to this: https://discourse.threejs.org/t/how-to-texture-a-3d-model-in-three-js/25035
	object.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			const loader = new THREE.TextureLoader();
			const dogTexture = loader.load('white_dog_texture.png');
			child.material.map = dogTexture;
		}
	});
	});
	}


//Lighting ------------------------------------------------
//GUI setup:

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

//Ambient Lighting
{
	const color = 0xFFFFFF;
	const intensity = 1;
	const light = new THREE.AmbientLight(color, intensity);
	scene.add(light);

	const ambientGUI = new GUI();
	const ambientContainer = document.getElementById('ambient-container'); // Create a container for ambient GUI controls
	ambientContainer.appendChild(ambientGUI.domElement); // Append to the ambient container
	//document.getElementById('ambient-container').appendChild(ambientGUI.domElement); // Append to a container div (chatgpt)
	ambientGUI.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
	ambientGUI.add(light, 'intensity', 0, 2, 0.01);


}

// RectArea Light
{
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
	
	RectAreaLightUniformsLib.init();
	const color = 0xFFFFFF;
	const intensity = 5;
	const width = 12;
	const height = 4;
	const light = new THREE.RectAreaLight(color, intensity, width, height);
	light.position.set(0, 10, 0);
	light.rotation.x = THREE.MathUtils.degToRad(-90);
	scene.add(light);
	 
	const helper = new RectAreaLightHelper(light);
	light.add(helper);

//GUI
	const gui = new GUI();
	gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
	gui.add(light, 'intensity', 0, 10, 0.01);
	gui.add(light, 'width', 0, 20);
	gui.add(light, 'height', 0, 20);
	gui.add(new DegRadHelper(light.rotation, 'x'), 'value', -180, 180).name('x rotation');
	gui.add(new DegRadHelper(light.rotation, 'y'), 'value', -180, 180).name('y rotation');
	gui.add(new DegRadHelper(light.rotation, 'z'), 'value', -180, 180).name('z rotation');
	
	makeXYZGUI(gui, light.position, 'position');

}


//Directional Light

function makeXYZGUI( gui, vector3, name, onChangeFn ) {

	const folder = gui.addFolder( name );
	folder.add( vector3, 'x', - 10, 10 ).onChange( onChangeFn );
	folder.add( vector3, 'y', 0, 10 ).onChange( onChangeFn );
	folder.add( vector3, 'z', - 10, 10 ).onChange( onChangeFn );
	folder.open();

}

{

	const color = 0xFFFFFF;
	const intensity = 1;
	const light = new THREE.DirectionalLight( color, intensity );
	light.position.set( 0, 10, 0 );
	light.target.position.set( - 5, 0, 0 );
	scene.add( light );
	scene.add( light.target );

	const helper = new THREE.DirectionalLightHelper( light );
	scene.add( helper );

	function updateLight() {

		light.target.updateMatrixWorld();
		helper.update();

	}

	updateLight();

	const directionalGUI = new GUI();
    const directionalContainer = document.getElementById('directional-container'); // Create a container for directional GUI controls
    directionalContainer.appendChild(directionalGUI.domElement); // Append to the directional container
	//document.getElementById('directional-container').appendChild(directionalGUI.domElement); // Append to a container div
	directionalGUI.addColor( new ColorGUIHelper( light, 'color' ), 'value' ).name( 'color' );
	directionalGUI.add( light, 'intensity', 0, 5, 0.01 );

	makeXYZGUI( directionalGUI, light.position, 'position', updateLight );
	makeXYZGUI( directionalGUI, light.target.position, 'target', updateLight );

}

// Directional Light End ---------------------------

	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	function render(time) {

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}
		time *= 0.001; // convert time to seconds

		cube.rotation.x = time;
		cube.rotation.y = time;

		sphere.rotation.x = time;
		sphere.rotation.y = time;

		tetrahedron.rotation.x = time;
		tetrahedron.rotation.y = time;
		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );


}

main();