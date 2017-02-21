let camera = null;
let scene = null;
let sceneRenderer = null;
let cssRenderer = null;
let projector = null;

document.addEventListener('DOMContentLoaded', () => {
   
    loadScene();
});

function loadScene() {
    
    const container = document.getElementById('render');
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    
    camera.target = new THREE.Vector3(1000, 0, 0);
    camera.position.set(0, 0, 0);
    camera.lookAt(camera.target);
    
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1024, 1024, 1024, 7, 7, 7), new THREE.MeshFaceMaterial(null));
    
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
    document.addEventListener("click", ".vt div.tp", touchpointAction);
    document.getElementsByClassName('expl').addEventListener("click", moveCamera);
    document.getElementsByClassName('vt').addEventListener("click", moveCamera);
}

function moveCamera(ev) {
    
}

function onWindowResize(ev) {
    
}