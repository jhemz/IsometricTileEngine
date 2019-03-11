import React from 'react';
import "./Tiles.scss";
import "react-isometric-tilemap/build/css/index.css";
import { ProcessPath } from './TileEngine/PathProcessor';
import { TileSwitcher } from './TileEngine/TileSwitcher';
import { terrainMap } from './TileEngine/TerrainMap';
import { items } from './TileEngine/ItemsMap';
import { MovableItems } from './TileEngine/MoveableItems';
import { terrain } from './TileEngine/TileMapProcessor';

const tileWidth = 100;
var subterrain;
var bedrock;
var mapWidth = 0;
var mouseCoords = {x: 0, y: 0}

class App extends React.Component {

  constructor( props ){
    super( props );
    this.loop = this.loop.bind(this);
    this.draw = this.draw.bind(this);
    this.getPosition = this.getPosition.bind(this);
    this.MouseMoveEvent = this.MouseMoveEvent.bind(this);
    mapWidth = terrainMap[0].length

    
    bedrock = new Array(terrainMap.length)

    for (var i = 0; i < terrainMap.length; i++) {
      bedrock[i] = new Array(terrainMap[i].length)
      for (var j = 0; j < terrainMap[i].length; j++) {
        bedrock[i][j] = 101;
      }
    }

    subterrain = new Array(terrainMap.length)

    for (var i = 0; i < terrainMap.length; i++) {
      subterrain[i] = new Array(terrainMap[i].length)
      for (var j = 0; j < terrainMap[i].length; j++) {
        subterrain[i][j] = 77;
      }
    }
  }

  loop() {
    this.draw();

    requestAnimationFrame(this.loop);
  }

  draw() {
    
    const canvas = this.refs.canvas
    
    canvas.addEventListener("mousedown", this.getPosition, false);
    canvas.addEventListener("mousemove", this.MouseMoveEvent, false);


    const ctx = canvas.getContext("2d")
    var img = this.refs.dirt
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

      //bedrock
      for (var i = 0; i < bedrock.length; i++) {
        for (var j = 0; j < bedrock[i].length; j++) {
          if(bedrock[i][j] !== 0){
            img = TileSwitcher(bedrock[i][j], this.refs)
            var top = Math.ceil(((mapWidth*tileWidth)/2)/100)*100
            ctx.drawImage(img, top + (50 * j) - (50 * i), (25 * j)+ (25 * i) + 30)
          }
        }
      }

      //subterrain
      for (var i = 0; i < subterrain.length; i++) {
        for (var j = 0; j < subterrain[i].length; j++) {
          if(subterrain[i][j] !== 0){
            img = TileSwitcher(subterrain[i][j], this.refs)
            var top = Math.ceil(((mapWidth*tileWidth)/2)/100)*100
            ctx.drawImage(img, top + (50 * j) - (50 * i), (25 * j)+ (25 * i) + 15)
          }
        }
      }

      //terrain
      for (i = 0; i < terrain.length; i++) {
        for (j = 0; j < terrain[i].length; j++) {
          if(terrain[i][j] !== 0){
            img = TileSwitcher(terrain[i][j], this.refs)
            top = Math.ceil(((mapWidth*tileWidth)/2)/100)*100
            ctx.drawImage(img, top + (50 * j) - (50 * i), (25 * j)+ (25 * i) )

            if(i === mouseCoords.y && j == mouseCoords.x){
              img = TileSwitcher(106, this.refs)
              ctx.drawImage(img, top + (50 * j) - (50 * i), (25 * j)+ (25 * i) )
            }
          }
        }
      }

      //items
      for (i = 0; i < items.length; i++) {
        for (j = 0; j < items[i].length; j++) {
            if(items[i][j] !== 0){
              img = TileSwitcher(items[i][j], this.refs)
              top = Math.ceil(((mapWidth*tileWidth)/2)/100)*100
              ctx.drawImage(img, top + (50 * j) - (50 * i), (25 * j)+ (25 * i))
            }
        }

      //moveable Items  
      for (var z = 0; z < MovableItems.length; z++) {
        var item = MovableItems[z];
        const path = item.path
        const realPath = ProcessPath(path, mapWidth, tileWidth)
        var itemToMove = TileSwitcher(item.tileId, this.refs)
        if(item.position === undefined){
          item.position = realPath[0];
        }
        if(item.stage < realPath.length - 1){
          const NextPosition = realPath[item.stage + 1]
          if(NextPosition.x < item.position.x ){
            item.position.x -= item.speed;
          }
          else{
            item.position.x += item.speed;
          }
          if(NextPosition.y < item.position.y ){
            item.position.y -=item.speed/2;
          }
          else{
            item.position.y +=item.speed/2;
          }
          
          if(NextPosition.x === Math.round(item.position.x) && NextPosition.y === Math.round(item.position.y)){
            item.stage++;
          }
        }
        ctx.drawImage(itemToMove, item.position.x, item.position.y)
      }


    }
  }

  getPosition(event)
  {
    if(event !== undefined){
      var x = event.x;
      var y = event.y;
      var tiles = [];
  
      for (var i = 0; i < terrainMap.length; i++) {
        for (var j = 0; j < terrainMap[i].length; j++) {
          var top = Math.ceil(((mapWidth*tileWidth)/2)/100)*100
          const tileX = top + (50 * j) - (50 * i);
          const tileY = (25 * j)+ (25 * i);
          const centreX = tileX + 50;
          const centreY = tileY + 25;
          const distanceToCentre = Math.pow((Math.pow((x - centreX), 2) + Math.pow((y - centreY), 2)), 0.5)
          tiles.push({x:j, y:i, d:distanceToCentre});
        }
      }
     
      const minD = Math.min.apply( Math, tiles.map(d => d.d) );
      var tile = tiles.find(x => x.d === minD);
      // console.log(tiles)
      // console.log(tile)
      // console.log("x:" + tile.x + " y:" + tile.y);
      const tileId = terrain[tile.y][tile.x]
      const modal = this.refs.myModal
      modal.style.display = "block";
      this.refs.modalImage.src =  TileSwitcher(tileId, this.refs).src;
    }
   
  }

  MouseMoveEvent(event)
  {
    if(event !== undefined){
      var x = event.x;
      var y = event.y;
      var tiles = [];
  
      for (var i = 0; i < terrainMap.length; i++) {
        for (var j = 0; j < terrainMap[i].length; j++) {
          var top = Math.ceil(((mapWidth*tileWidth)/2)/100)*100
          const tileX = top + (50 * j) - (50 * i);
          const tileY = (25 * j)+ (25 * i);
          const centreX = tileX + 50;
          const centreY = tileY + 25;
          const distanceToCentre = Math.pow((Math.pow((x - centreX), 2) + Math.pow((y - centreY), 2)), 0.5)
          tiles.push({x:j, y:i, d:distanceToCentre});
        }
      }
     
      const minD = Math.min.apply( Math, tiles.map(d => d.d) );
      var tile = tiles.find(x => x.d === minD);
      mouseCoords = {x: tile.x, y: tile.y};
    }
   
  }
  
  componentDidMount() {
  requestAnimationFrame(this.loop);
  }

  render() {
    return(
      <div className="center">

        {/* <!-- The Modal --> */}
        <div ref="myModal" id="myModal" className="modal">

          {/* <!-- The Close Button --> */}
          <span className="close" onClick={() => {this.refs.myModal.style.display = "none"}}>&times;</span>

          {/* <!-- Modal Content (The Image) --> */}
          <img  ref="modalImage" className="modal-content" id="img01"/>

          {/* <!-- Modal Caption (Image Text) --> */}
          <div id="caption"></div>
        </div>

        <canvas ref="canvas" id="canvas" width={1000} height={500} />

        <img alt="" ref="grass" src={require("./images/grass.png")} className="hidden"/>
        <img alt="" ref="dirt" src={require("./images/dirt.png")} className="hidden"/>

        {/* water */}
        <img alt="" ref="waterN" src={require("./images/waterN.png")} className="hidden"/>
        <img alt="" ref="waterNE" src={require("./images/waterNE.png")} className="hidden"/>
        <img alt="" ref="waterE" src={require("./images/waterE.png")} className="hidden"/>
        <img alt="" ref="waterES" src={require("./images/waterES.png")} className="hidden"/>
        <img alt="" ref="waterS" src={require("./images/waterS.png")} className="hidden"/>
        <img alt="" ref="waterSW" src={require("./images/waterSW.png")} className="hidden"/>
        <img alt="" ref="waterW" src={require("./images/waterW.png")} className="hidden"/>
        <img alt="" ref="waterNW" src={require("./images/waterNW.png")} className="hidden"/>
        <img alt="" ref="water" src={require("./images/water.png")} className="hidden"/>
        <img alt="" ref="waterCornerES" src={require("./images/waterCornerES.png")} className="hidden"/>
        <img alt="" ref="waterCornerNE" src={require("./images/waterCornerNE.png")} className="hidden"/>
        <img alt="" ref="waterCornerNW" src={require("./images/waterCornerNW.png")} className="hidden"/>
        <img alt="" ref="waterCornerSW" src={require("./images/waterCornerSW.png")} className="hidden"/>

        {/* road */}
        <img alt="" ref="road" src={require("./images/road.png")} className="hidden"/>
        <img alt="" ref="roadES" src={require("./images/roadES.png")} className="hidden"/>
        <img alt="" ref="roadEW" src={require("./images/roadEW.png")} className="hidden"/>
        <img alt="" ref="roadHill2E" src={require("./images/roadHill2E.png")} className="hidden"/>
        <img alt="" ref="roadHill2N" src={require("./images/roadHill2N.png")} className="hidden"/>
        <img alt="" ref="roadHill2S" src={require("./images/roadHill2S.png")} className="hidden"/>
        <img alt="" ref="roadHill2W" src={require("./images/roadHill2W.png")} className="hidden"/>
        <img alt="" ref="roadHillE" src={require("./images/roadHillE.png")} className="hidden"/>
        <img alt="" ref="roadHillN" src={require("./images/roadHillN.png")} className="hidden"/>
        <img alt="" ref="roadHillS" src={require("./images/roadHillS.png")} className="hidden"/>
        <img alt="" ref="roadHillW" src={require("./images/roadHillW.png")} className="hidden"/>
        <img alt="" ref="roadNE" src={require("./images/roadNE.png")} className="hidden"/>
        <img alt="" ref="roadNS" src={require("./images/roadNS.png")} className="hidden"/>
        <img alt="" ref="roadNW" src={require("./images/roadNW.png")} className="hidden"/>
        <img alt="" ref="roadSW" src={require("./images/roadSW.png")} className="hidden"/>

        <img alt="" ref="lotE" src={require("./images/lotE.png")} className="hidden"/>
        <img alt="" ref="lotES" src={require("./images/lotES.png")} className="hidden"/>
        <img alt="" ref="lotN" src={require("./images/lotN.png")} className="hidden"/>
        <img alt="" ref="lotNE" src={require("./images/roadSW.png")} className="hidden"/>
        <img alt="" ref="lotNW" src={require("./images/lotNW.png")} className="hidden"/>
        <img alt="" ref="lotS" src={require("./images/lotS.png")} className="hidden"/>
        <img alt="" ref="lotSW" src={require("./images/lotSW.png")} className="hidden"/>
        <img alt="" ref="lotW" src={require("./images/lotW.png")} className="hidden"/>

        <img alt="" ref="bridgeEW" src={require("./images/bridgeEW.png")} className="hidden"/>
        <img alt="" ref="bridgeNS" src={require("./images/bridgeNS.png")} className="hidden"/>
        <img alt="" ref="crossroad" src={require("./images/crossroad.png")} className="hidden"/>
        <img alt="" ref="crossroadESW" src={require("./images/crossroadESW.png")} className="hidden"/>
        <img alt="" ref="crossroadNES" src={require("./images/crossroadNES.png")} className="hidden"/>
        <img alt="" ref="crossroadNEW" src={require("./images/crossroadNEW.png")} className="hidden"/>
        <img alt="" ref="crossroadNSW" src={require("./images/crossroadNSW.png")} className="hidden"/>
        <img alt="" ref="endE" src={require("./images/endE.png")} className="hidden"/>
        <img alt="" ref="endN" src={require("./images/endN.png")} className="hidden"/>
        <img alt="" ref="endS" src={require("./images/endS.png")} className="hidden"/>
        <img alt="" ref="endW" src={require("./images/endW.png")} className="hidden"/>
        <img alt="" ref="exitE" src={require("./images/exitE.png")} className="hidden"/>
        <img alt="" ref="exitN" src={require("./images/exitN.png")} className="hidden"/>
        <img alt="" ref="exitS" src={require("./images/exitS.png")} className="hidden"/>
        <img alt="" ref="exitW" src={require("./images/exitW.png")} className="hidden"/>

        {/* river */}
        <img alt="" ref="riverBankedES" src={require("./images/riverBankedES.png")} className="hidden"/>
        <img alt="" ref="riverBankedEW" src={require("./images/riverBankedEW.png")} className="hidden"/>
        <img alt="" ref="riverBankedNE" src={require("./images/riverBankedNE.png")} className="hidden"/>
        <img alt="" ref="riverBankedNS" src={require("./images/riverBankedNS.png")} className="hidden"/>
        <img alt="" ref="riverBankedNW" src={require("./images/riverBankedNW.png")} className="hidden"/>
        <img alt="" ref="riverBankedSW" src={require("./images/riverBankedSW.png")} className="hidden"/>
        <img alt="" ref="riverES" src={require("./images/riverES.png")} className="hidden"/>
        <img alt="" ref="riverEW" src={require("./images/riverEW.png")} className="hidden"/>
        <img alt="" ref="riverNE" src={require("./images/riverNE.png")} className="hidden"/>
        <img alt="" ref="riverNS" src={require("./images/riverNS.png")} className="hidden"/>
        <img alt="" ref="riverNW" src={require("./images/riverNW.png")} className="hidden"/>
        <img alt="" ref="riverSW" src={require("./images/riverSW.png")} className="hidden"/>

        {/* grass */}
        <img alt="" ref="grass" src={require("./images/grass.png")} className="hidden"/>
        <img alt="" ref="grassWhole" src={require("./images/grassWhole.png")} className="hidden"/>
        <img alt="" ref="hillE" src={require("./images/hillE.png")} className="hidden"/>
        <img alt="" ref="hillES" src={require("./images/hillES.png")} className="hidden"/>
        <img alt="" ref="hillN" src={require("./images/hillN.png")} className="hidden"/>
        <img alt="" ref="hillNE" src={require("./images/hillNE.png")} className="hidden"/>
        <img alt="" ref="hillNW" src={require("./images/hillNW.png")} className="hidden"/>
        <img alt="" ref="hillS" src={require("./images/hillS.png")} className="hidden"/>
        <img alt="" ref="hillSW" src={require("./images/hillSW.png")} className="hidden"/>
        <img alt="" ref="hillW" src={require("./images/hillW.png")} className="hidden"/>

        {/* dirt */}
        <img alt="" ref="dirt" src={require("./images/dirt.png")} className="hidden"/>
        <img alt=""  ref="dirtDouble" src={require("./images/dirtDouble.png")} className="hidden"/>

        {/* beach */}
        <img alt="" ref="beach" src={require("./images/beach.png")} className="hidden"/>
        <img alt="" ref="beachCornerES" src={require("./images/beachCornerES.png")} className="hidden"/>
        <img alt="" ref="beachCornerNE" src={require("./images/beachCornerNE.png")} className="hidden"/>
        <img alt="" ref="beachCornerNW" src={require("./images/beachCornerNW.png")} className="hidden"/>
        <img alt="" ref="beachCornerSW" src={require("./images/beachCornerSW.png")} className="hidden"/>
        <img alt="" ref="beachE" src={require("./images/beachE.png")} className="hidden"/>
        <img alt="" ref="beachES" src={require("./images/beachES.png")} className="hidden"/>
        <img alt="" ref="beachN" src={require("./images/beachN.png")} className="hidden"/>
        <img alt="" ref="beachNE" src={require("./images/beachNE.png")} className="hidden"/>
        <img alt="" ref="beachNW" src={require("./images/beachNW.png")} className="hidden"/>
        <img alt="" ref="beachS" src={require("./images/beachS.png")} className="hidden"/>
        <img alt="" ref="beachSW" src={require("./images/beachSW.png")} className="hidden"/>
        <img alt="" ref="beachW" src={require("./images/beachW.png")} className="hidden"/>

        {/* conifer trees */}
        <img alt="" ref="coniferAltShort" src={require("./images/coniferAltShort.png")} className="hidden"/>
        <img alt="" ref="coniferAltTall" src={require("./images/coniferAltTall.png")} className="hidden"/>
        <img alt="" ref="coniferShort" src={require("./images/coniferShort.png")} className="hidden"/>
        <img alt="" ref="coniferTall" src={require("./images/coniferTall.png")} className="hidden"/>

        {/* non conifer trees */}
        <img alt="" ref="treeAltShort" src={require("./images/treeAltShort.png")} className="hidden"/>
        <img alt="" ref="treeAltTall" src={require("./images/treeAltTall.png")} className="hidden"/>
        <img alt="" ref="treeShort" src={require("./images/treeShort.png")} className="hidden"/>
        <img alt="" ref="treeTall" src={require("./images/treeTall.png")} className="hidden"/>

        <img alt="" ref="tank" src={require("./images/tank.png")} className="hidden"/>
        <img alt="" ref="empty" src={require("./images/empty.png")} className="hidden"/>

         <img alt="" ref="rock" src={require("./images/rock.png")} className="hidden"/>

        <img alt="" ref="riverBridge1" src={require("./images/riverBridge1.png")} className="hidden"/>
        <img alt="" ref="riverBridge2" src={require("./images/riverBridge2.png")} className="hidden"/>
        <img alt="" ref="riverBridge3" src={require("./images/riverBridge3.png")} className="hidden"/>
        <img alt="" ref="riverBridge4" src={require("./images/riverBridge4.png")} className="hidden"/>

        <img alt="" ref="selectedGrid" src={require("./images/selectedGrid.png")} className="hidden"/>
      </div>
   )
  }
}

export default App;



