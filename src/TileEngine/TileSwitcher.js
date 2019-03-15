export const TileIdToDescription = (tileId) => {
  switch (tileId) {
      //water
      case 3: return "Water"
      case 4: return "Water"
      case 5: return "Water"
      case 6: return "Water"
      case 7: return "Water"
      case 8: return "Water"
      case 9: return "Water"
      case 10: return"Water"
      case 11: return "Water"
      case 12: return "Water"
      case 13: return "Water"
      case 14: return "Water"
      case 15: return "Water"

      //road
      case 16: return "Road"
      case 17: return "Road"
      case 18: return "Road"
      case 19: return "Road"
      case 20: return "Road"
      case 21: return "Road"
      case 22: return "Road"
      case 23: return "Road"
      case 24: return "Road"
      case 25: return "Road"
      case 26: return "Road"
      case 27: return "Road"
      case 28: return "Road"
      case 29: return "Road"
      case 30: return "Road"
      case 31: return "Road"
      case 32: return "Road"
      case 33: return "Road"
      case 34: return "Road"
      case 35: return "Road"
      case 36: return "Road"
      case 37: return "Road"
      case 38: return "Road"
      case 39: return "Road"
      case 40: return "Road"
      case 41: return "Road"
      case 42:  return "Road"
      case 43: return "Road"
      case 44: return "Road";
      case 45: return "Road"
      case 46: return "Road"
      case 47: return "Road"
      case 48:  return "Road"
      case 49: return "Road"
      case 50:  return "Road"
      case 51: return "Road"
      case 52: return "Road"
      case 53: return "Road"

    


      //river
      case 54: return "River"
      case 55: return "River"
      case 56: return "River"
      case 57: return "River"
      case 58: return "River"
      case 59: return "River"
      case 60: return "River"
      case 61: return "River"
      case 62: return "River"
      case 63: return "River"
      case 64:  return "River"
      case 65:  return "River"

      //grass
      case 66: return "Grass"
      case 67: return "Grass"
      case 68: return "Grass"
      case 69: return "Grass"
      case 70: return "Grass"
      case 71: return "Grass"
      case 72:  return "Grass"
      case 73: return "Grass"
      case 74: return "Grass"
      case 75: return "Grass"
      //dirt
      case 76: return "Dirt"
      case 77: return "Dirt"

      //beach
      case 78: return "Beach"
      case 79:  return "Beach"
      case 80:  return "Beach"
      case 81:  return "Beach"
      case 82: return "Beach"
      case 83: return "Beach"
      case 84: return "Beach"
      case 85: return "Beach"
      case 86: return "Beach"
      case 87: return "Beach"
      case 88:  return "Beach"
      case 89:  return "Beach"
      case 90: return "Beach"

      // conifer trees
      case 91: return "Fir tree"
      case 92: return "Fir tree"
      case 93: return "Fir tree"
      case 94: return "Fir tree"

      // non conifer trees
      case 95: return "Tree"
      case 96: return "Tree"
      case 97: return "Tree"
      case 98: return "Tree"

      case 99: return "Tank"

      case 100: return "Empty"

      case 101: return "Rock"

      case 102: return "Bridge"
      case 103: return "Bridge"
      case 104: return "Bridge"
      case 105: return "Bridge"

      case 106: return "Grid"

      case 107: return "Building"

      case 108: return "Office"

      case 109: return "Car"
      case 110: return "Car"
      case 111: return "Car"
      case 112: return "Car"
      case 113: return "Empty"
      case 114: return "Bore Hole"
      case 115: return "Water Tower"
      case 116: return "Building 2"
      case 117: return "Treatment Pond"

      case 118: return "Pipe"
      case 119: return "Pipe"
      case 120: return "Pipe"
      case 121: return "Pipe"
      case 122: return "Pipe"
      case 123: return "Pipe"
      case 124: return "Pipe"
      case 125: return "Pipe"
      case 126: return "Pipe"
      case 127: return "Pipe"
      case 128: return "Pipe"

      default: return "Empty"
  }
}

export const TileSwitcher = (tileId, context) => {
      
    switch (tileId) {

      //water
      case 3: return context.waterN;
      case 4: return context.waterNE;
      case 5: return context.waterE;
      case 6: return context.waterES;
      case 7: return context.waterS;
      case 8: return context.waterSW;
      case 9: return context.waterW;
      case 10: return context.waterNW;
      case 11: return context.water;
      case 12: return context.waterCornerES;
      case 13: return context.waterCornerNE;
      case 14: return context.waterCornerNW;
      case 15: return context.waterCornerSW;

      //road
      case 16: return context.road;
      case 17: return context.roadES;
      case 18: return context.roadEW;
      case 19: return context.roadHill2E;
      case 20: return context.roadHill2N;
      case 21: return context.roadHill2S;
      case 22: return context.roadHill2W;
      case 23: return context.roadHillE;
      case 24: return context.roadHillN;
      case 25: return context.roadHillS;
      case 26: return context.roadHillW;
      case 27: return context.roadNE;
      case 28: return context.roadNS;
      case 29: return context.roadNW;
      case 30: return context.roadSW;
      case 31: return context.lotE;
      case 32: return context.lotES;
      case 33: return context.lotN;
      case 34: return context.lotNE;
      case 35: return context.lotNW;
      case 36: return context.lotS;
      case 37: return context.lotSW;
      case 38: return context.lotW;
      case 39: return context.bridgeEW;
      case 40: return context.bridgeNS;
      case 41: return context.crossroad;
      case 42:  return context.crossroadESW;
      case 43: return context.crossroadNES;
      case 44: return context.crossroadNEW;
      case 45: return context.crossroadNSW;
      case 46: return context.endE;
      case 47: return context.endN;
      case 48:  return context.endS;
      case 49: return context.endW;
      case 50:  return context.exitE;
      case 51: return context.exitN;
      case 52: return context.exitS;
      case 53: return context.exitW;

     


      //river
      case 54: return context.riverBankedES;
      case 55: return context.riverBankedEW;
      case 56: return context.riverBankedNE;
      case 57: return context.riverBankedNS;
      case 58: return context.riverBankedNW;
      case 59: return context.riverBankedSW;
      case 60: return context.riverES;
      case 61: return context.riverEW;
      case 62: return context.riverNE;
      case 63: return context.riverNS;
      case 64:  return context.riverNW;
      case 65:  return context.riverSW;

      //grass
      case 66: return context.grass;
      case 67: return context.grassWhole;
      case 68: return context.hillE;
      case 69: return context.hillES;
      case 70: return context.hillN;
      case 71: return context.hillNE;
      case 72:  return context.hillNW;
      case 73: return context.hillS;
      case 74: return context.hillSW;
      case 75: return context.hillW;

      //dirt
      case 76: return context.dirt;
      case 77: return context.dirtDouble;

      //beach
      case 78: return context.beach;
      case 79:  return context.beachCornerES;
      case 80:  return context.beachCornerNE;
      case 81:  return context.beachCornerNW;
      case 82: return context.beachCornerSW;
      case 83: return context.beachE;
      case 84: return context.beachES;
      case 85: return context.beachN;
      case 86: return context.beachNE;
      case 87: return context.beachNW;
      case 88:  return context.beachS;
      case 89:  return context.beachSW;
      case 90: return context.beachW;

      // conifer trees
      case 91: return context.coniferAltShort;
      case 92: return context.coniferAltTall;
      case 93: return context.coniferShort;
      case 94: return context.coniferTall;

      // non conifer trees
      case 95: return context.treeAltShort;
      case 96: return context.treeAltTall;
      case 97: return context.treeShort;
      case 98: return context.treeTall;

      case 99: return context.tank;

      case 100: return context.empty;

      case 101: return context.rock;

      case 102: return context.riverBridge1;
      case 103: return context.riverBridge2;
      case 104: return context.riverBridge3;
      case 105: return context.riverBridge4;

      case 106: return context.selectedGrid;

      case 107: return context.building;

      case 108: return context.office;

      case 109: return context.car1;
      case 110: return context.car2;
      case 111: return context.car3;
      case 112: return context.car4;
      case 113: return context.emptyItem;
      case 114: return context.boreHole;
      case 115: return context.waterTower;
      case 116: return context.building2;
      case 117: return context.treatmentPond;

      case 118: return context.pipe1;
      case 119: return context.pipe2;
      case 120: return context.pipe3;
      case 121: return context.pipe4;
      case 122: return context.pipe5;
      case 123: return context.pipe6;
      case 124: return context.pipe7;
      case 125: return context.pipe8;
      case 126: return context.pipe9;
      case 127: return context.pipe10;
      case 128: return context.pipe11;

      default: return context.empty;
    }

  }