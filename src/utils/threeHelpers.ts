import * as THREE from 'three';

/**
 * Creates a building mesh with specified dimensions and color
 */
export function createBuilding(
  width: number, 
  height: number, 
  depth: number, 
  color: string | number
): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshLambertMaterial({ color });
  const building = new THREE.Mesh(geometry, material);
  building.castShadow = true;
  building.receiveShadow = true;
  return building;
}

/**
 * Creates a roof mesh (cone shape) for a building
 */
export function createRoof(
  radius: number, 
  height: number, 
  segments: number = 4, 
  color: string | number = 0x8B0000
): THREE.Mesh {
  const geometry = new THREE.ConeGeometry(radius, height, segments);
  const material = new THREE.MeshLambertMaterial({ color });
  const roof = new THREE.Mesh(geometry, material);
  roof.castShadow = true;
  roof.rotation.y = Math.PI / 4;
  return roof;
}

/**
 * Creates a tree with trunk and leaves
 */
export function createTree(
  trunkHeight: number = 3,
  leavesRadius: number = 2,
  trunkColor: string | number = 0x8B4513,
  leavesColor: string | number = 0x228B22
): THREE.Group {
  const treeGroup = new THREE.Group();

  // Trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, trunkHeight);
  const trunkMaterial = new THREE.MeshLambertMaterial({ color: trunkColor });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.castShadow = true;
  trunk.position.y = trunkHeight / 2;

  // Leaves
  const leavesGeometry = new THREE.SphereGeometry(leavesRadius);
  const leavesMaterial = new THREE.MeshLambertMaterial({ color: leavesColor });
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.castShadow = true;
  leaves.position.y = trunkHeight + leavesRadius / 2;

  treeGroup.add(trunk);
  treeGroup.add(leaves);

  return treeGroup;
}

/**
 * Creates a ground plane
 */
export function createGround(
  width: number = 100, 
  height: number = 100, 
  color: string | number = 0x90EE90
): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshLambertMaterial({ color });
  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  return ground;
}

/**
 * Sets up basic lighting for the scene
 */
export function setupLighting(scene: THREE.Scene): void {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);

  // Directional light with shadows
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(50, 50, 50);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 500;
  scene.add(directionalLight);
}

/**
 * Creates a basic camera setup
 */
export function createCamera(
  fov: number = 75,
  aspect: number = window.innerWidth / window.innerHeight,
  near: number = 0.1,
  far: number = 1000
): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);
  camera.lookAt(0, 0, 0);
  return camera;
}

/**
 * Creates a WebGL renderer with shadow support
 */
export function createRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
}

/**
 * Creates a detailed multi-floor building with balconies and windows
 */
export function createDetailedBuilding(
  width: number,
  depth: number,
  floors: number,
  floorHeight: number = 3,
  buildingColor: string | number = 0xD2B48C,
  roofType: 'flat' | 'pyramid' = 'flat'
): THREE.Group {
  const buildingGroup = new THREE.Group();
  const totalHeight = floorHeight * floors;
  
  // Main building structure
  const mainStructureGeometry = new THREE.BoxGeometry(width, totalHeight, depth);
  const mainStructureMaterial = new THREE.MeshLambertMaterial({ color: buildingColor });
  const mainStructure = new THREE.Mesh(mainStructureGeometry, mainStructureMaterial);
  mainStructure.position.set(0, totalHeight / 2, 0);
  mainStructure.castShadow = true;
  buildingGroup.add(mainStructure);
  
  // Roof
  if (roofType === 'flat') {
    const roofGeometry = new THREE.BoxGeometry(width + 0.5, 0.5, depth + 0.5);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, totalHeight + 0.25, 0);
    roof.castShadow = true;
    buildingGroup.add(roof);
  } else {
    const roofGeometry = new THREE.ConeGeometry(Math.max(width, depth) / 2, 2, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, totalHeight + 1, 0);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    buildingGroup.add(roof);
  }
  
  return buildingGroup;
}

/**
 * Adds windows to a building floor (balconies removed)
 */
export function addFloorDetails(
  buildingGroup: THREE.Group,
  floor: number,
  floorHeight: number,
  buildingWidth: number,
  buildingDepth: number,
  windowsPerSide: number = 2
): void {
  const floorY = (floor * floorHeight) + (floorHeight / 2);
  
  const sides = [
    { position: [buildingWidth / 2, 0, 0], rotation: [0, 0, 0] },
    { position: [-buildingWidth / 2, 0, 0], rotation: [0, Math.PI, 0] },
    { position: [0, 0, buildingDepth / 2], rotation: [0, -Math.PI / 2, 0] },
    { position: [0, 0, -buildingDepth / 2], rotation: [0, Math.PI / 2, 0] }
  ];
  
  sides.forEach((side, sideIndex) => {
    // Windows only (balconies removed)
    for (let windowIndex = 0; windowIndex < windowsPerSide; windowIndex++) {
      const windowOffset = windowIndex === 0 ? -2 : 2;
      
      const windowFrameGeometry = new THREE.BoxGeometry(2, 2.5, 0.2);
      const windowFrameMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      const windowFrame = new THREE.Mesh(windowFrameGeometry, windowFrameMaterial);
      
      const windowGlassGeometry = new THREE.BoxGeometry(1.8, 2.3, 0.1);
      const windowGlassMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x4169E1, 
        transparent: true, 
        opacity: 0.8 
      });
      const windowGlass = new THREE.Mesh(windowGlassGeometry, windowGlassMaterial);
      
      if (side.rotation[1] === 0 || side.rotation[1] === Math.PI) {
        windowFrame.position.set(windowOffset, floorY + 0.2, side.position[2] + (side.rotation[1] === 0 ? 0.1 : -0.1));
        windowGlass.position.set(windowOffset, floorY + 0.2, side.position[2] + (side.rotation[1] === 0 ? 0.15 : -0.15));
      } else {
        windowFrame.position.set(side.position[0] + (side.rotation[1] === -Math.PI / 2 ? 0.1 : -0.1), floorY + 0.2, windowOffset);
        windowGlass.position.set(side.position[0] + (side.rotation[1] === -Math.PI / 2 ? 0.15 : -0.15), floorY + 0.2, windowOffset);
      }
      
      windowFrame.rotation.set(side.rotation[0], side.rotation[1], side.rotation[2]);
      windowGlass.rotation.set(side.rotation[0], side.rotation[1], side.rotation[2]);
      
      windowFrame.castShadow = true;
      windowFrame.receiveShadow = true;
      windowGlass.castShadow = true;
      windowGlass.receiveShadow = true;
      
      buildingGroup.add(windowFrame);
      buildingGroup.add(windowGlass);
    }
  });
}
