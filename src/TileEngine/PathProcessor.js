import { terrainMap } from './TerrainMap';

var PF = require('pathfinding');

export function ProcessPath(coordinates, xAdjuster, yAdjuster){
    //i = 0 is starting point
 
    var realCoordinates = []
    for (var i = 0; i < coordinates.length; i++) {
      //to move to
     
      const x = coordinates[i].x
      const y = coordinates[i].y
      var realCoord = {x:(xAdjuster + (50 * x) - (50 * y)), y:(yAdjuster + (25 * x)+ (25 * y))}
      realCoordinates.push(realCoord)
      
    }
    return realCoordinates
  }

  export function ProcessShortestPath(coordinates, xAdjuster, yAdjuster){
    //i = 0 is starting point
 
    var realCoordinates = []
    for (var i = 0; i < coordinates.length; i++) {
      //to move to
     
      const x = coordinates[i][0]
      const y = coordinates[i][1]
      var realCoord = {x:(xAdjuster + (50 * x) - (50 * y)), y:(yAdjuster + (25 * x)+ (25 * y))}
      realCoordinates.push(realCoord)
      
    }
    return realCoordinates
  }

  export function FindShortestPathPath(start, end, xAdjuster, yAdjuster){
    

    var grid = new PF.Grid(terrainMap[0].length, terrainMap.length); 
    

    for (var i = 0; i < terrainMap.length; i++) {
      for (var j = 0; j < terrainMap[i].length; j++) {
        if(terrainMap[i][j] == "r"){
          grid.setWalkableAt(j, i, true);
        }
        else{
          grid.setWalkableAt(j, i, false);
        }
       
      }
    }

    var finder = new PF.AStarFinder();
    var path = finder.findPath(start.x, start.y, end.x, end.y, grid); 
   

    var realCoordinates =  ProcessShortestPath(path, xAdjuster, yAdjuster);
    // console.log("logging shortestPath")
      
   
    return realCoordinates;
  }
 