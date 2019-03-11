export function ProcessPath(coordinates, mapWidth, tileWidth){
    //i = 0 is starting point
    var realCoordinates = []
    for (var i = 0; i < coordinates.length; i++) {
      //to move to
      const x = coordinates[i].x
      const y = coordinates[i].y
      var top = Math.ceil(((mapWidth*tileWidth)/2)/100)*100
      var realCoord = {x:(top + (50 * x) - (50 * y)), y:((25 * x)+ (25 * y))}
      realCoordinates.push(realCoord)
    }
    return realCoordinates
  }