'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HousingComplexScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue background
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 35);
    camera.lookAt(0, 15, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create ground areas and roads
    const createGroundAndRoads = () => {
      // Reuse materials to reduce WebGL resources
      const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x4A7C59 });
      const courtyardMaterial = new THREE.MeshLambertMaterial({ color: 0xD2B48C });
      const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x404040 });
      const lineMarkingMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
      const parkingMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
      const sidewalkMaterial = new THREE.MeshLambertMaterial({ color: 0xB0B0B0 });
      const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
      const fixtureMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xFFFACD,
        emissive: 0x111100
      });

      // Main grass ground
      const grassGeometry = new THREE.PlaneGeometry(100, 100);
      const grass = new THREE.Mesh(grassGeometry, grassMaterial);
      grass.rotation.x = -Math.PI / 2;
      grass.receiveShadow = true;
      scene.add(grass);

      // Central courtyard around main building (lighter colored ground)
      const courtyardGeometry = new THREE.PlaneGeometry(25, 25);
      const courtyard = new THREE.Mesh(courtyardGeometry, courtyardMaterial);
      courtyard.rotation.x = -Math.PI / 2;
      courtyard.position.y = 0.01; // Slightly above grass to avoid z-fighting
      courtyard.receiveShadow = true;
      scene.add(courtyard);

      // Main roads - horizontal and vertical
      // Horizontal main road
      const horizontalRoadGeometry = new THREE.PlaneGeometry(100, 6);
      const horizontalRoad = new THREE.Mesh(horizontalRoadGeometry, roadMaterial);
      horizontalRoad.rotation.x = -Math.PI / 2;
      horizontalRoad.position.set(0, 0.02, 20);
      horizontalRoad.receiveShadow = true;
      scene.add(horizontalRoad);

      // Vertical main road
      const verticalRoadGeometry = new THREE.PlaneGeometry(6, 100);
      const verticalRoad = new THREE.Mesh(verticalRoadGeometry, roadMaterial);
      verticalRoad.rotation.x = -Math.PI / 2;
      verticalRoad.position.set(20, 0.02, 0);
      verticalRoad.receiveShadow = true;
      scene.add(verticalRoad);

      // Secondary connecting roads
      const secondaryRoadGeometry = new THREE.PlaneGeometry(4, 35);
      
      // Road connecting to main building from horizontal road
      const connectingRoad1 = new THREE.Mesh(secondaryRoadGeometry, roadMaterial);
      connectingRoad1.rotation.x = -Math.PI / 2;
      connectingRoad1.position.set(0, 0.02, 2.5);
      connectingRoad1.receiveShadow = true;
      scene.add(connectingRoad1);

      // Road connecting to side buildings
      const connectingRoad2 = new THREE.Mesh(secondaryRoadGeometry, roadMaterial);
      connectingRoad2.rotation.x = -Math.PI / 2;
      connectingRoad2.rotation.z = Math.PI / 2;
      connectingRoad2.position.set(2.5, 0.02, 0);
      connectingRoad2.receiveShadow = true;
      scene.add(connectingRoad2);

      // Road markings (center lines) - reduce number of markings
      const lineGeometry = new THREE.PlaneGeometry(3, 0.2);
      const verticalLineGeometry = new THREE.PlaneGeometry(0.2, 3);
      
      // Horizontal road center line (reduced frequency)
      for (let i = -8; i <= 8; i += 2) {
        const line = new THREE.Mesh(lineGeometry, lineMarkingMaterial);
        line.rotation.x = -Math.PI / 2;
        line.position.set(i * 5, 0.03, 20);
        scene.add(line);
      }

      // Vertical road center line (reduced frequency)
      for (let i = -8; i <= 8; i += 2) {
        const line = new THREE.Mesh(verticalLineGeometry, lineMarkingMaterial);
        line.rotation.x = -Math.PI / 2;
        line.position.set(20, 0.03, i * 5);
        scene.add(line);
      }

      // Parking areas removed since side buildings are no longer present

      // Sidewalks along main roads
      // Sidewalks for horizontal road
      const sidewalk1Geometry = new THREE.PlaneGeometry(100, 2);
      const sidewalk1 = new THREE.Mesh(sidewalk1Geometry, sidewalkMaterial);
      sidewalk1.rotation.x = -Math.PI / 2;
      sidewalk1.position.set(0, 0.015, 24);
      sidewalk1.receiveShadow = true;
      scene.add(sidewalk1);

      const sidewalk2 = new THREE.Mesh(sidewalk1Geometry, sidewalkMaterial);
      sidewalk2.rotation.x = -Math.PI / 2;
      sidewalk2.position.set(0, 0.015, 16);
      sidewalk2.receiveShadow = true;
      scene.add(sidewalk2);

      // Sidewalks for vertical road
      const sidewalk3Geometry = new THREE.PlaneGeometry(2, 100);
      const sidewalk3 = new THREE.Mesh(sidewalk3Geometry, sidewalkMaterial);
      sidewalk3.rotation.x = -Math.PI / 2;
      sidewalk3.position.set(24, 0.015, 0);
      sidewalk3.receiveShadow = true;
      scene.add(sidewalk3);

      const sidewalk4 = new THREE.Mesh(sidewalk3Geometry, sidewalkMaterial);
      sidewalk4.rotation.x = -Math.PI / 2;
      sidewalk4.position.set(16, 0.015, 0);
      sidewalk4.receiveShadow = true;
      scene.add(sidewalk4);

      // Street lights along main roads - reuse geometries
      const poleGeometry = new THREE.CylinderGeometry(0.1, 0.15, 6);
      const fixtureGeometry = new THREE.SphereGeometry(0.3);
      
      const addStreetLight = (x: number, z: number) => {
        // Light pole
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(x, 3, z);
        pole.castShadow = true;
        scene.add(pole);

        // Light fixture
        const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
        fixture.position.set(x, 5.8, z);
        fixture.castShadow = true;
        scene.add(fixture);

        // Point light for illumination
        const streetLight = new THREE.PointLight(0xFFFACD, 0.5, 15);
        streetLight.position.set(x, 5.5, z);
        streetLight.castShadow = true;
        scene.add(streetLight);
      };

      // Add street lights along the main roads (reduced number)
      for (let i = -1; i <= 1; i++) {
        addStreetLight(i * 20, 25); // Along horizontal road
        addStreetLight(i * 20, 15); // Along horizontal road
        addStreetLight(25, i * 20); // Along vertical road
        addStreetLight(15, i * 20); // Along vertical road
      }
    };

    // Create all ground elements and roads
    createGroundAndRoads();

    // Function to create detailed main building with 10 floors
    const createMainBuilding = () => {
      const buildingGroup = new THREE.Group();
      
      // Building dimensions
      const buildingWidth = 12;
      const buildingDepth = 12;
      const floorHeight = 3;
      const totalFloors = 10;
      const totalHeight = floorHeight * totalFloors;

      // Reuse materials to reduce WebGL resources
      const mainStructureMaterial = new THREE.MeshLambertMaterial({ color: 0xD2B48C });
      const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
      const windowFrameMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      const windowGlassMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x87CEEB,
        transparent: true,
        opacity: 0.8 
      });

      // Reuse geometries
      const windowFrameGeometry = new THREE.BoxGeometry(2.5, 2.5, 0.3);
      const windowGlassGeometry = new THREE.BoxGeometry(2, 2, 0.2);
      
      // Main building structure
      const mainStructureGeometry = new THREE.BoxGeometry(buildingWidth, totalHeight, buildingDepth);
      const mainStructure = new THREE.Mesh(mainStructureGeometry, mainStructureMaterial);
      mainStructure.position.set(0, totalHeight / 2, 0);
      mainStructure.castShadow = true;
      buildingGroup.add(mainStructure);
      
      // Flat roof
      const roofGeometry = new THREE.BoxGeometry(buildingWidth + 0.5, 0.5, buildingDepth + 0.5);
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.set(0, totalHeight + 0.25, 0);
      roof.castShadow = true;
      buildingGroup.add(roof);
      
      // Create floors with windows
      for (let floor = 0; floor < totalFloors; floor++) {
        const floorY = (floor * floorHeight) + (floorHeight / 2);
        
        // Create windows for each side
        const sides = [
          { position: [buildingWidth / 2, 0, 0], rotation: [0, 0, 0] }, // Front
          { position: [-buildingWidth / 2, 0, 0], rotation: [0, Math.PI, 0] }, // Back
          { position: [0, 0, buildingDepth / 2], rotation: [0, -Math.PI / 2, 0] }, // Right
          { position: [0, 0, -buildingDepth / 2], rotation: [0, Math.PI / 2, 0] } // Left
        ];
        
        sides.forEach((side, sideIndex) => {
          // Two windows per side - reusing materials and geometries
          for (let windowIndex = 0; windowIndex < 2; windowIndex++) {
            const windowOffset = windowIndex === 0 ? -2 : 2;
            
            // Window frame - reuse geometry and material
            const windowFrame = new THREE.Mesh(windowFrameGeometry, windowFrameMaterial);
            
            // Window glass - reuse geometry and material
            const windowGlass = new THREE.Mesh(windowGlassGeometry, windowGlassMaterial);
            
            // Position windows outside the building walls but closer for realism
            if (sideIndex === 0) {
              // Front wall
              windowFrame.position.set(windowOffset, floorY + 0.2, buildingDepth / 2 + 0.2);
              windowGlass.position.set(windowOffset, floorY + 0.2, buildingDepth / 2 + 0.3);
            } else if (sideIndex === 1) {
              // Back wall
              windowFrame.position.set(windowOffset, floorY + 0.2, -buildingDepth / 2 - 0.2);
              windowGlass.position.set(windowOffset, floorY + 0.2, -buildingDepth / 2 - 0.3);
            } else if (sideIndex === 2) {
              // Right wall
              windowFrame.position.set(buildingWidth / 2 + 0.2, floorY + 0.2, windowOffset);
              windowGlass.position.set(buildingWidth / 2 + 0.3, floorY + 0.2, windowOffset);
            } else {
              // Left wall
              windowFrame.position.set(-buildingWidth / 2 - 0.2, floorY + 0.2, windowOffset);
              windowGlass.position.set(-buildingWidth / 2 - 0.3, floorY + 0.2, windowOffset);
            }
            
            windowFrame.castShadow = true;
            windowFrame.receiveShadow = true;
            windowGlass.castShadow = true;
            windowGlass.receiveShadow = true;
            
            buildingGroup.add(windowFrame);
            buildingGroup.add(windowGlass);
          }
        });
      }
      
      return buildingGroup;
    };

    // Simple housing complex buildings
    const buildings: THREE.Mesh[] = [];
    
    // Create detailed main building
    const mainBuildingGroup = createMainBuilding();
    scene.add(mainBuildingGroup);

    // Trees - reuse geometries and materials
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 3);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const leavesGeometry = new THREE.SphereGeometry(2);
    const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    
    for (let i = 0; i < 8; i++) {
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);

      const angle = (i / 8) * Math.PI * 2;
      const radius = 25 + Math.random() * 10;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      trunk.position.set(x, 1.5, z);
      leaves.position.set(x, 3.5, z);

      trunk.castShadow = true;
      leaves.castShadow = true;

      scene.add(trunk);
      scene.add(leaves);
    }

    // Basic camera animation
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Rotate camera around the scene
      const radius = 35;
      camera.position.x = Math.cos(time * 0.3) * radius;
      camera.position.z = Math.sin(time * 0.3) * radius;
      camera.position.y = 15 + Math.sin(time * 0.5) * 5; // Higher camera position for tall building
      camera.lookAt(0, 15, 0); // Look at middle height of the main building

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      // Dispose of all scene resources
      if (scene) {
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
        scene.clear();
      }
      
      if (mountRef.current && renderer && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Housing Complex 3D View</h1>
        <p className="text-sm mb-2">
          Modern residential tower with surrounding infrastructure
        </p>
        <div className="mt-2 text-xs opacity-75">
          <div className="mb-1">🏢 <strong>Main Building:</strong></div>
          <div className="ml-4 mb-2">
            • 10 floors with clean facade<br/>
            • 2 windows per side on each floor<br/>
            • Central courtyard placement<br/>
            • Minimalist architectural style
          </div>
          <div className="mb-1">🛣️ <strong>Infrastructure:</strong></div>
          <div className="ml-4 mb-2">
            • Main road network with markings<br/>
            • Connecting roads and access<br/>
            • Sidewalks and landscaping<br/>
            • Central courtyard design
          </div>
          <div className="mb-1">🎥 <strong>Camera:</strong></div>
          <div className="ml-4">
            • Automatic rotation around tower<br/>
            • Dynamic height adjustment<br/>
            • Focused on main building
          </div>
        </div>
      </div>
    </div>
  );
}
