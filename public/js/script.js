let camera = null;
let scene = null, cssScene = null;
let sceneRenderer = null;
let cssRenderer = null;
let container = null;
const target = new THREE.Vector3();
let movingCamera = false;
let timer = 3600; // 60 minutes in seconds

document.addEventListener('DOMContentLoaded', () => {
   
    loadScene();

    loadInteractionEvents();
});

function loadScene() {
    
    container = document.getElementById('render');
    
    scene = new THREE.Scene();
    cssScene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    
    camera.target = new THREE.Vector3(1000, 0, 0);
    camera.position.set(0, 0, 0);
    camera.lookAt(camera.target);
    
    const loader = new THREE.CubeTextureLoader();
    loader.setPath( 'images/' );

    const textureCube = loader.load( [
        'room.left.jpg', 'room.right.jpg',
        'room.bottom.jpg', 'room.top.jpg',
        'room.front.jpg', 'room.back.jpg'
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
    
    window.addEventListener("resize", onWindowResize, !1);

    moveCamera();
    render();

    createElement(68, 57, -421, "switch", "lightbulb-o", "Switch", "page-lightswitch");
    createElement(-546, 227, -244, "note", "book", "Note", "page-note");
    createElement(-556, -27, 96, "code", "lock", "Code", "page-code");
    createElement(-314, 93, 225, "interact", "hand-paper-o", "Interactables", "page-interact");
    createElement(-22, -240, 500, "hidden", "eye", "Hidden", "page-hidden");
    createElement(230, 0, 500, "doors", "exchange", "Doors", "page-doors");

    // Require a delay so that CSS elements are rendered before assigning event handlers
    setTimeout(() => {
        
        for (const el of document.querySelectorAll('.interactable')) {

            el.addEventListener('click', () => {

                // Variable el.dataset.link now holds the element to highlight in a pane
                triggerPage(el.dataset.link);
            });
        }
    }, 100);
}

function startTimer() {

    // Check if timer not already going
    if (timer !== 3600) {
        return;
    }

    setInterval(() => {

        const minutes = timer / 60;
        let seconds = timer % 60;

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        document.getElementsByClassName('timer')[0].innerHTML = `${Math.floor(minutes)}:${seconds}`;

        timer -= 1;

        if (timer <= 0) {

            timer = 3600;
        }
    }, 1000);
}

function createElement(x, y, z, className, iconName, label, link) {

    const element = document.createElement("div");
    element.dataset.link = link;
    element.innerHTML = `<div class="interactable-tail"></div><div class="interactable-icon"><i class="fa fa-${iconName}" aria-hidden="true"></i></div><div class="interactable-text">${label}</div>`;
    element.className = "interactable " + className;

    const div = new THREE.CSS3DSprite(element);
    div.position.x = x;
    div.position.y = y;
    div.position.z = z;
    div.scale.x = div.scale.y = .4;

    cssScene.add(div);
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

    camera.lookAt( target );

    cssRenderer.render( cssScene, camera );

	sceneRenderer.render( scene, camera );
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

    hidePages();
}

function moveCamera() {

    container.addEventListener("mousedown", onDocumentMouseDown);
    container.addEventListener("mousemove", onDocumentMouseMove);
    container.addEventListener("mouseup", onDocumentMouseUp);

    camera.updateProjectionMatrix();
}

function loadInteractionEvents() {

    const streamToggle = document.getElementById('toggle-streaming');
    const skipToggle = document.getElementById('toggle-skip');
    const backButton = document.getElementById('menu-back');

    streamToggle.addEventListener('click', (ev) => {

        streamToggle.classList.toggle('active');
    });

    skipToggle.addEventListener('click', (ev) => {

        skipToggle.classList.toggle('active');
    });

    document.getElementById('menu-gameplay').addEventListener('click', () => {

        for (const el of document.getElementsByClassName('main-menu')) {

            el.classList.add('hidden');
        }

        for (const el of document.getElementsByClassName('gameplay-menu')) {

            el.classList.remove('hidden');
        }

        backButton.classList.remove('hidden');
    });

    document.getElementById('menu-options').addEventListener('click', () => {

        for (const el of document.getElementsByClassName('main-menu')) {

            el.classList.add('hidden');
        }

        for (const el of document.getElementsByClassName('options-menu')) {

            el.classList.remove('hidden');
        }

        backButton.classList.remove('hidden');
    });

    document.getElementById('menu-stats').addEventListener('click', () => {

        for (const el of document.getElementsByClassName('main-menu')) {

            el.classList.add('hidden');
        }

        for (const el of document.getElementsByClassName('stats-menu')) {

            el.classList.remove('hidden');
        }

        backButton.classList.remove('hidden');
    });

    document.getElementById('menu-puzzlemode').addEventListener('click', () => {

        for (const el of document.getElementsByClassName('main-menu')) {

            el.classList.add('hidden');
        }

        for (const el of document.getElementsByClassName('gameplay-menu')) {

            el.classList.add('hidden');
        }

        for (const el of document.getElementsByClassName('puzzle-menu')) {

            el.classList.remove('hidden');
        }

        backButton.classList.remove('hidden');
    });

    backButton.addEventListener('click', () => {

        resetMenus();
    })

    addPageHandler('menu-storymode', 'page-storymode');
    addPageHandler('menu-puzzlemode', 'page-puzzlemode');
    addPageHandler('menu-tutorial', 'page-tutorial');
    addPageHandler('menu-share', 'page-share');
    addPageHandler('menu-leaderboards', 'page-leaderboards');
    addPageHandler('timer', 'page-timer');
    addPageHandler('menu-options', 'page-options');
    addPageHandler('menu-configurestreaming', 'page-configurestreaming');
    addPageHandler('inventory-button', 'page-inventory');
    addPageHandler('inventory-skip', 'page-inventory-skip');
    addPageHandler('menu-singleplayer', 'page-singleplayer');
    addPageHandler('menu-multiplayer', 'page-multiplayer');

    for (const el of document.getElementsByClassName('page-close')) {

        el.addEventListener('click', hidePages);
    }

    for (const el of document.getElementsByClassName('start-game')) {

         el.addEventListener('click', startGame);
    }

    document.getElementById('menu-toggle').addEventListener('click', () => {

        resetMenus();

        stopGame();
    });

    document.getElementById('close-gameplay-notice').addEventListener('click', () => {

        document.getElementById('gameplay-notice').classList.remove('active');
    });

    document.getElementById('inventory-button').addEventListener('click', () => {

        document.getElementById('inventory').classList.add('active');
    });

    document.getElementById('inventory-close').addEventListener('click', () => {

        document.getElementById('inventory').classList.remove('active');
    });
}

function resetMenus() {

    for (const el of document.getElementsByClassName('main-menu')) {

        el.classList.remove('hidden');
    }

    for (const el of document.getElementsByClassName('gameplay-menu')) {

        el.classList.add('hidden');
    }

    for (const el of document.getElementsByClassName('options-menu')) {

        el.classList.add('hidden');
    }

    for (const el of document.getElementsByClassName('stats-menu')) {

        el.classList.add('hidden');
    }

    for (const el of document.getElementsByClassName('puzzle-menu')) {

        el.classList.add('hidden');
    }

    document.getElementById('menu-back').classList.add('hidden');
}

function hidePages() {

    for (const el of document.getElementsByClassName('page')) {

        el.classList.remove('active');
    }
}

function hideMenus() {

    resetMenus();

    for (const el of document.getElementsByClassName('menu_box')) {

        el.classList.add('hidden');
    }
}

function addPageHandler(menuClass, pageID) {

    document.getElementById(menuClass).addEventListener('click', () => {

        triggerPage(pageID);
    });
}

function triggerPage(pageID) {

    hidePages();

    setTimeout(() => {

        document.getElementById(pageID).classList.add('active');
    }, 450);
}

function startGame() {

    // Corner buttons
    document.getElementById('menu-toggle').classList.add('active');
    document.getElementById('inventory-button').classList.add('active');

    document.getElementById('render').classList.remove('blur');

    hidePages();

    hideMenus();

    startTimer();

    document.getElementById('gameplay-notice').classList.add('active');
}

function stopGame() {

    document.getElementById('menu-toggle').classList.remove('active');
    document.getElementById('inventory-button').classList.remove('active');

    document.getElementById('render').classList.add('blur');
}