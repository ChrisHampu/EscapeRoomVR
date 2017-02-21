let camera = null;
let scene = null;
let sceneRenderer = null;
let cssRenderer = null;
let projector = null;
let container = null;
const target = new THREE.Vector3();
let movingCamera = false;

document.addEventListener('DOMContentLoaded', () => {
   
    loadScene();
});

function loadScene() {
    
    container = document.getElementById('render');
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    
    camera.target = new THREE.Vector3(1000, 0, 0);
    camera.position.set(0, 0, 0);
    camera.lookAt(camera.target);
    
    const loader = new THREE.CubeTextureLoader();
    loader.setPath( 'images/' );

    const textureCube = loader.load( [
        'cube.left.png', 'cube.right.png',
        'cube.bottom.png', 'cube2top.png',
        'cube.front.png', 'cube.back.png'
    ] );

    const cube = new THREE.Mesh(new THREE.BoxGeometry(1024, 1024, 1024, 7, 7, 7), new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } ));
    
    cube.scale.x = -1;
    cube.name = "cube";
    cube.x = 0;
    cube.y = 0;
    cube.z = 0;
    scene.add(cube);
    
    cssRenderer = new THREE.CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.style.position = "absolute";
    cssRenderer.domElement.style.top = 0;
    container.appendChild(cssRenderer.domElement);

    sceneRenderer = new THREE.WebGLRenderer();
    sceneRenderer.setSize( window.innerWidth, window.innerHeight );
    
    container.appendChild( sceneRenderer.domElement );


    projector = new THREE.Projector();
    
    window.addEventListener("resize", onWindowResize, !1);

    moveCamera();
    render();
}

function onWindowResize(ev) {
    
}

function touchpointAction(ev) {

}

let lon = 1000, lat = 0, onPointerDownLat = 0, onPointerDownLon = 0, onPointerDownPointerX = 0, onPointerDownPointerY = 0;

function render() {
	requestAnimationFrame( render );

	lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
	theta = THREE.Math.degToRad( lon );

    target.x = Math.sin( phi ) * Math.cos( theta );
    target.y = Math.cos( phi );
    target.z = Math.sin( phi ) * Math.sin( theta );

    console.log(phi, theta, target);

    camera.lookAt( target );

	sceneRenderer.render( scene, camera );

    cssRenderer.render( scene, camera );
}

function onDocumentMouseMove(event) {

    if (!movingCamera) {
        return;
    }

    lon = .12 * (onPointerDownPointerX - event.clientX) + onPointerDownLon;
    lat = .12 * (event.clientY - onPointerDownPointerY) + onPointerDownLat;
}

function onDocumentMouseDown(event) {

    event.preventDefault();
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;

    movingCamera = true;
}

function onDocumentMouseUp() {

    event.preventDefault();

    movingCamera = false;
}

function moveCamera() {

    container.addEventListener("mousedown", onDocumentMouseDown);
    container.addEventListener("mousemove", onDocumentMouseMove);
    container.addEventListener("mouseup", onDocumentMouseUp);

    camera.updateProjectionMatrix();
}