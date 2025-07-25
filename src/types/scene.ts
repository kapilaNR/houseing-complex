// Type definitions for the housing complex 3D visualization

export interface BuildingConfig {
  width: number;
  height: number;
  depth: number;
  color: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export interface LightConfig {
  color: string;
  intensity: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export interface SceneConfig {
  buildings: BuildingConfig[];
  lights: LightConfig[];
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  };
}

export type MaterialType = 'standard' | 'lambert' | 'phong' | 'basic';

export interface FloorConfig {
  height: number;
  hasBalcony: boolean;
  windowsPerSide: number;
}

export interface DetailedBuildingConfig extends BuildingConfig {
  floors: number;
  floorHeight: number;
  floorConfig: FloorConfig;
  roofType: 'flat' | 'pyramid' | 'slanted';
}
