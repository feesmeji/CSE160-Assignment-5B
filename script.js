console.log('Script is running!');

import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

//Camera setup
	const fov = 125;
	const aspect = 1; // the canvas default  x, width/height
	const near = 0.1;  //y 
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 2;

//Make a scene
	const scene = new THREE.Scene();

// add lighting
{
	const color = 0xFFFFFF;
	const intensity = 3;
	const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(-1, 2, 4);
	scene.add(light);
}
// stuff for cube
	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	const loader = new THREE.TextureLoader();
	const texture = loader.load( 'rubber_duck.jpg');
	texture.colorSpace = THREE.SRGBColorSpace;

	const material = new THREE.MeshPhongMaterial( { map: texture} ); // greenish blue hex number
	const cube = new THREE.Mesh( geometry, material );
	//cube.visible = false
	scene.add( cube );


// stuff for sphere
const sphere_geometry = new THREE.SphereGeometry( 0.7, 32, 16 ); 
const sphere_material = new THREE.MeshPhongMaterial( { color: 0xff0000 } ); 
const sphere = new THREE.Mesh( sphere_geometry, sphere_material ); 

sphere.position.set(-1.7,0,0);  //chatgpt suggested I use this function to set the position on the screen, I put the values on my own

scene.add( sphere );

//stuff for tetrahedron
const tetrahedron_geometry = new THREE.TetrahedronGeometry(0.8, 0);
const tetrahedron_material = new THREE.MeshPhongMaterial({color : 0x00FFFF });
const tetrahedron = new THREE.Mesh(tetrahedron_geometry, tetrahedron_material);

tetrahedron.position.set(1.7, 0 ,0);

scene.add(tetrahedron);


//Stuff for obj file
//create init object 
	const objLoader = new OBJLoader();
	objLoader.load('./10680_Dog_v2.obj', (object) => {
	object.scale.set(0.038, 0.038, 0.038); // Adjust the scaling factor (CHATgpt helped me come up with this line of code, I input the numbers by myself)
	object.position.set(1.7,1.5,0)    //I added the appropriate numbers to get close to the cube
	scene.add(object);
    // Apply texture to the material of the 3D dog object (chatgpt helped me come up with the next 4 lines, I learned its a standard way of applying textures to 3d object like this using children)
	// Similar to this: https://discourse.threejs.org/t/how-to-texture-a-3d-model-in-three-js/25035
    object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            const dogTexture = loader.load('grasslight-big.jpg');
            child.material.map = dogTexture;
        }
    });
});



//render shape
	function render( time ) {

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
	requestAnimationFrame( render );  //request browser that I need to animate something

}
main();