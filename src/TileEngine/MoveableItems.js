var LandRover = {
    tile1: 109,
    tile2: 110,
    tile3: 111,
    tile4: 112,
    speed: 0.15,
    position: undefined,
    stage: 0,
    path: [{x:0, y:0},{x:0, y:9},{x:8, y:9},{x:8, y:0},{x:0, y:0}],
    repeat: true,
    shortestPath: false,
    reverse: false
  }

  var LandRover1 = {
    tile1: 109,
    tile2: 110,
    tile3: 111,
    tile4: 112,
    speed: 0.15,
    position: undefined,
    stage: 0,
    path: [{x:1, y:0},{x:8, y:5}],
    repeat: false,
    shortestPath: true,
    reverse: false
  }
  
  var LandRover2 = {
    tile1: 109,
    tile2: 110,
    tile3: 111,
    tile4: 112,
    speed: 0.15,
    position: undefined,
    stage: 0,
    path: [{x:0, y:9},{x:6, y:6}],
    repeat: false,
    shortestPath: true,
    reverse: true
  }

  var MovableTank2 = {
    tile1: 99,
    tile2: 99,
    tile3: 99,
    tile4: 99,
    speed: 0.2,
    position: undefined,
    stage: 0,
    path: [{x:2, y:0},{x:2, y:1},{x:4, y:1},{x:4, y:7}],
    repeat: false,
    shortestPath: false,
    reverse: false
  }
  
  export const MovableItems = [LandRover1, LandRover2]