import React from 'react';
import "./Tiles.scss";
import "react-isometric-tilemap/build/css/index.css";
import { ProcessPath, FindShortestPathPath } from './TileEngine/PathProcessor';
import { TileSwitcher, TileIdToDescription } from './TileEngine/TileSwitcher';
import { terrainMap } from './TileEngine/TerrainMap';
//import { items } from './TileEngine/ItemsMap';
import { MovableItems } from './TileEngine/MoveableItems';
import { terrain, processTiles, ProcessPipes } from './TileEngine/TileMapProcessor';
import { Button, ButtonGroup, DropdownButton, Dropdown,InputGroup, ButtonToolbar, FormControl } from 'react-bootstrap';


const tileWidth = 100;
var subterrain;
var PipesLayer;
var items;
var bedrock;
var mapWidth = 0;
var mouseCoords = {x: 0, y: 0}
var xAdjuster= 0;
var yAdjuster= 0;



class App extends React.Component {

  constructor( props ){
    super( props );
    this.loop = this.loop.bind(this);
    this.draw = this.draw.bind(this);
    this.getPosition = this.getPosition.bind(this);
    this.MouseMoveEvent = this.MouseMoveEvent.bind(this);
    mapWidth = terrainMap[0].length
    xAdjuster=  Math.ceil(((mapWidth*tileWidth)/2)/100)*100;
    yAdjuster = 0;
    
    this.state = { currentTileToSet: 0, drawTile : "", currentItemTileToSet: 0, drawTile : "", 
      drawTile: "",
    };

    bedrock = new Array(terrainMap.length)

    for (var i = 0; i < terrainMap.length; i++) {
      bedrock[i] = new Array(terrainMap[i].length)
      for (var j = 0; j < terrainMap[i].length; j++) {
        bedrock[i][j] = 101;
      }
    }

    subterrain = new Array(terrainMap.length);
    PipesLayer = new Array(terrainMap.length);
    items = new Array(terrainMap.length);
    console.log(items)
    for (var i = 0; i < terrainMap.length; i++) {
      subterrain[i] = new Array(terrainMap[i].length)
      for (var j = 0; j < terrainMap[i].length; j++) {
        subterrain[i][j] = 77;
      }
    }
    for (var i = 0; i < terrainMap.length; i++) {
      PipesLayer[i] = new Array(terrainMap[i].length)
      for (var j = 0; j < terrainMap[i].length; j++) {
        PipesLayer[i][j] = "";
      }
    }
    for (var i = 0; i < terrainMap.length; i++) {
      items[i] = new Array(terrainMap[i].length)
      for (var j = 0; j < terrainMap[i].length; j++) {
        items[i][j] = 0;
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
          ctx.drawImage(img, xAdjuster+ (50 * j) - (50 * i), yAdjuster + (25 * j)+ (25 * i) + 30)
        }
      }
    }

    //subterrain
    for (var i = 0; i < subterrain.length; i++) {
      for (var j = 0; j < subterrain[i].length; j++) {
        if(subterrain[i][j] !== 0){
          img = TileSwitcher(subterrain[i][j], this.refs)
          ctx.drawImage(img, xAdjuster+ (50 * j) - (50 * i),  yAdjuster +(25 * j)+ (25 * i) + 15)
        }
      }
    }

    //Pipes
    var pipesToDraw = ProcessPipes(PipesLayer)
    for (var i = 0; i < pipesToDraw.length; i++) {
      for (var j = 0; j < pipesToDraw[i].length; j++) {
        if(pipesToDraw[i][j] !== 0){
          img = TileSwitcher(pipesToDraw[i][j], this.refs)
          ctx.drawImage(img, xAdjuster+ (50 * j) - (50 * i), yAdjuster + (25 * j)+ (25 * i) + 15)
        }
      }
    }

    //terrain
    var terrainToDraw = processTiles(terrainMap)
    for (i = 0; i < terrainToDraw.length; i++) {
      for (j = 0; j < terrainToDraw[i].length; j++) {
        if(terrainToDraw[i][j] !== 0){
          img = TileSwitcher(terrainToDraw[i][j], this.refs)
         
          //ctx.globalAlpha = 0.4;
          ctx.drawImage(img, xAdjuster+ (50 * j) - (50 * i),  yAdjuster +(25 * j)+ (25 * i) )

          

          if(i === mouseCoords.y && j == mouseCoords.x){
            img = TileSwitcher(106, this.refs)
            ctx.drawImage(img, xAdjuster+ (50 * j) - (50 * i), yAdjuster + (25 * j)+ (25 * i) )
            
            if(items[i][j] !== 0){
              ctx.font = "30px Arial";
              ctx.fillText(TileIdToDescription(items[i][j]), xAdjuster+ (50 * j) - (50 * i), yAdjuster + (25 * j)+ (25 * i) );    
    
            }
         }
        }
      }
    }
    ctx.globalAlpha = 1;
    //items
    for (i = 0; i < items.length; i++) {
      for (j = 0; j < items[i].length; j++) {
          if(items[i][j] !== 0){
            img = TileSwitcher(items[i][j], this.refs)
            ctx.drawImage(img, xAdjuster+ (50 * j) - (50 * i),  yAdjuster +(25 * j)+ (25 * i))
          }
      }
    }
    //moveable Items  
    for (var z = 0; z < MovableItems.length; z++) {
      var item = MovableItems[z];
      const path = item.path

      const realPath = []

      if(item.shortestPath === false){
        realPath = ProcessPath(path, xAdjuster,  yAdjuster)
      }
      else{
        
        realPath = FindShortestPathPath(item.path[0], item.path[1], xAdjuster, yAdjuster)
        
        if(item.position === undefined){
          item.position = realPath[0];
        }

        if(item.stage === realPath.length - 1){
          item.path = [item.path[1], item.path[0]];
          realPath = FindShortestPathPath(item.path[0], item.path[1], xAdjuster, yAdjuster)
          item.stage = 0;
        }
      }

    
      var goingLeft = false;
      var tileToDraw = item.tile1;

      if(item.position === undefined){
        item.position = realPath[0];
      }
      if(item.stage < realPath.length - 1){
        const NextPosition = realPath[item.stage + 1]
        if(NextPosition.x < item.position.x ){
          item.position.x -= item.speed;
          goingLeft = true;
        }
        else{
          item.position.x += item.speed;
          goingLeft = false;
        }
        if(NextPosition.y < item.position.y ){
          item.position.y -=item.speed/2;
          if(goingLeft){
            tileToDraw = item.tile2;
          }
        else{
            tileToDraw = item.tile1;
          }
        }
        else{
          item.position.y +=item.speed/2;
          if(goingLeft){
            tileToDraw = item.tile3;
          }
          if(!goingLeft){
            tileToDraw = item.tile4;
          }
        }
        
        if(NextPosition.x === Math.round(item.position.x) && NextPosition.y === Math.round(item.position.y)){
          item.stage++;
        }
      }
      else if(item.repeat === true){
        item.stage = 0;
        item.position = realPath[0];
      }
      var itemToMove = TileSwitcher(tileToDraw, this.refs)
      ctx.drawImage(itemToMove, item.position.x, item.position.y)
    }


  }


  //Get Mouse Position
  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
  }

  getPosition(event)
  {
    if(event !== undefined){

      const canvas = this.refs.canvas
      var mousePos = this.getMousePos(canvas, event);
      var x = mousePos.x;
      var y = mousePos.y;
      var tiles = [];

     

      for (var i = 0; i < terrainMap.length; i++) {
        for (var j = 0; j < terrainMap[i].length; j++) {
          const tileX = xAdjuster+ (50 * j) - (50 * i);
          const tileY = yAdjuster + (25 * j)+ (25 * i);
          const centreX = tileX + 50;
          const centreY = tileY + 25;
          const distanceToCentre = Math.pow((Math.pow((x - centreX), 2) + Math.pow((y - centreY), 2)), 0.5)
          tiles.push({x:j, y:i, d:distanceToCentre});
        }
      }
     
      const minD = Math.min.apply( Math, tiles.map(d => d.d) );
      var tile = tiles.find(x => x.d === minD);
      
      //if drawing tile is set
      if(this.state.drawTile !== ""){
       
        if(this.state.drawTile !== "p"){
          if(this.state.drawTile !== "_"){
            terrainMap[tile.y][tile.x] = "";
          }
          terrainMap[tile.y][tile.x] = this.state.drawTile
        
          if(items[tile.y][tile.x] !== 0){
            items[tile.y][tile.x] = 0
          }
        }else{
          PipesLayer[tile.y][tile.x] = this.state.drawTile
        }
      }
      
      if(this.state.currentTileToSet !== 0){
        terrain[tile.y][tile.x] = this.state.currentTileToSet
      }

      if(this.state.currentItemTileToSet !== 0){
        console.log(PipesLayer[tile.y][tile.x])
        items[tile.y][tile.x] = this.state.currentItemTileToSet
        if(terrainMap[tile.y][tile.x] === "r"){
          terrainMap[tile.y][tile.x] = "d"
        }
        if(terrainMap[tile.y][tile.x] === ""){
          console.log(PipesLayer[tile.y][tile.x])
          PipesLayer[tile.y][tile.x] = 113
        }
      }
     
    
      const tileId = terrain[tile.y][tile.x]
      
      if(this.state.currentTileToSet === 0 && this.state.currentItemTileToSet === 0 && this.state.currentItemTileToSet === ""){
        const modal = this.refs.myModal
        modal.style.display = "block";
        this.refs.modalImage.src =  TileSwitcher(tileId, this.refs).src;
      }
     
    }
   
  }

  MouseMoveEvent(event)
  {
    if(event !== undefined){
      const canvas = this.refs.canvas
      var mousePos = this.getMousePos(canvas, event);
      var x = mousePos.x;
      var y = mousePos.y;
      var tiles = [];
  
      for (var i = 0; i < terrainMap.length; i++) {
        for (var j = 0; j < terrainMap[i].length; j++) {
          const tileX = xAdjuster+ (50 * j) - (50 * i);
          const tileY = yAdjuster + (25 * j)+ (25 * i);
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

        <ButtonGroup vertical className="float-left">
              <Button  onClick={()=>{this.state.currentItemTileToSet = 113;}}><img src={require("./images/bulldozer.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 0, drawTile : "_"})}}><img src={require("./images/spade.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 0, drawTile : "r"})}} ><img src={require("./images/roadEW.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 0, drawTile : "gr"})}} ><img src={require("./images/grass.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 0, drawTile : "rb"})}} ><img src={require("./images/riverBankedEW.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 0, drawTile : "rv"})}} ><img src={require("./images/riverEW.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 0, drawTile : "b"})}} ><img src={require("./images/beachES.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 0, drawTile : "w"})}} ><img src={require("./images/waterNW.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 0, drawTile : "d"})}} ><img src={require("./images/dirtDouble.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 0, drawTile : "s"})}} ><img src={require("./images/beach.png")}/></Button>
        </ButtonGroup>
        <ButtonGroup vertical className="float-left">
             
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 107, drawTile : ""})}} ><img src={require("./images/building.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 114, drawTile : ""})}} ><img src={require("./images/boreHole.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 115, drawTile : ""})}} ><img src={require("./images/waterTower.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 116, drawTile : ""})}} ><img src={require("./images/building2.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 117, drawTile : ""})}} ><img src={require("./images/treatmentPond.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 108, drawTile : ""})}} ><img src={require("./images/office.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 91, drawTile : ""})}} ><img src={require("./images/coniferAltShort.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 92, drawTile : ""})}} ><img src={require("./images/coniferAltTall.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 93, drawTile : ""})}} ><img src={require("./images/coniferShort.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 94, drawTile : ""})}} ><img src={require("./images/coniferTall.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 95, drawTile : ""})}} ><img src={require("./images/treeAltShort.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 96, drawTile : ""})}} ><img src={require("./images/treeAltTall.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 97, drawTile : ""})}} ><img src={require("./images/treeShort.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 98, drawTile : ""})}} ><img src={require("./images/treeTall.png")}/></Button>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 99, drawTile : ""})}} ><img src={require("./images/tank.png")}/></Button>

              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet: 0, drawTile : "p"})}} ><img src={require("./images/pipe1.png")}/></Button>
        </ButtonGroup>


       
        <canvas ref="canvas" id="canvas" width={1000} height={500} />
      
        <ButtonToolbar>
            <ButtonGroup>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet : 0, drawTile : ""})}}>Select mode</Button>
              {/* <Button  onClick={()=>{console.log(items)}}>Edit mode</Button> */}

              <Button  onClick={()=>{console.log(terrain)}}>Export Terrain</Button>
              <Button  onClick={()=>{console.log(items)}}>Export Items</Button>
              <DropdownButton as={ButtonGroup} title="Tiles" id="bg-nested-dropdown">
                <Dropdown.Item eventKey="1"  onClick={()=>
              {
                this.refs.terrainTiles.style.display = "block";
                this.state.currentItemTileToSet = 0;
                this.refs.itemsTiles.style.display = "none";
                }
              }>Terrain tiles</Dropdown.Item>
                <Dropdown.Item eventKey="2"  onClick={()=>
              {
                this.refs.itemsTiles.style.display = "block";
                this.state.currentTileToSet = 0;
                this.refs.terrainTiles.style.display = "none";
                }
              }>Item tiles</Dropdown.Item>
              </DropdownButton>
            

            
            </ButtonGroup>

            <InputGroup>

                <InputGroup.Prepend>
                    <InputGroup.Text id="btnGroupAddon">length</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="text"
                    placeholder="Input group example"
                    aria-label="Input group example"
                    aria-describedby="btnGroupAddon"
                  />

                <InputGroup.Prepend>
                    <InputGroup.Text id="btnGroupAddon">width</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="text"
                    placeholder="Input group example"
                    aria-label="Input group example"
                    aria-describedby="btnGroupAddon"
                  />


            </InputGroup>

            <ButtonGroup>
              <Button  onClick={()=>{this.setState({currentTileToSet : 0, currentItemTileToSet : 0})}}>Regenerate</Button>
            </ButtonGroup>
        </ButtonToolbar>
       
        
        <div className="terrainVisibility" ref="terrainTiles">
            {/* water */}
            <img className={this.state.currentTileToSet === 3? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 3, currentItemTileToSet: 0, drawTile : "", currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="waterN" src={require("./images/waterN.png")} />
            <img className={this.state.currentTileToSet === 4? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 4, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="waterNE" src={require("./images/waterNE.png")}  />
            <img className={this.state.currentTileToSet === 5? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 5, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="waterE" src={require("./images/waterE.png")}  />
            <img className={this.state.currentTileToSet === 6? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 6, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="waterES" src={require("./images/waterES.png")}  />
            <img className={this.state.currentTileToSet === 7? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 7, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="waterS" src={require("./images/waterS.png")}  />
            <img className={this.state.currentTileToSet === 8? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 8, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="waterSW" src={require("./images/waterSW.png")}  />
            <img className={this.state.currentTileToSet === 9? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 9, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="waterW" src={require("./images/waterW.png")}  />
            <img className={this.state.currentTileToSet === 10? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 10, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="waterNW" src={require("./images/waterNW.png")}  />
            <img className={this.state.currentTileToSet === 11? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 11, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="water" src={require("./images/water.png")}  />
            <img className={this.state.currentTileToSet === 12? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 12, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="waterCornerES" src={require("./images/waterCornerES.png")}  />
            <img className={this.state.currentTileToSet === 13? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 13, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="waterCornerNE" src={require("./images/waterCornerNE.png")}  />
            <img className={this.state.currentTileToSet === 14? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 14, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="waterCornerNW" src={require("./images/waterCornerNW.png")}  />
            <img className={this.state.currentTileToSet === 15? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 15, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="waterCornerSW" src={require("./images/waterCornerSW.png")}  />

            {/* road */}
            <img className={this.state.currentTileToSet === 16? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 16, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="road" src={require("./images/road.png")}  />
            <img className={this.state.currentTileToSet === 17? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 17, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="roadES" src={require("./images/roadES.png")}  />
            <img className={this.state.currentTileToSet === 18? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 18, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="roadEW" src={require("./images/roadEW.png")}  />
            <img className={this.state.currentTileToSet === 19? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 19, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="roadHill2E" src={require("./images/roadHill2E.png")}  />
            <img className={this.state.currentTileToSet === 20? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 20, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="roadHill2N" src={require("./images/roadHill2N.png")}  />
            <img className={this.state.currentTileToSet === 21? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 21, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="roadHill2S" src={require("./images/roadHill2S.png")}  />
            <img className={this.state.currentTileToSet === 22? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 22, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="roadHill2W" src={require("./images/roadHill2W.png")}  />
            <img className={this.state.currentTileToSet === 23? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 23, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="roadHillE" src={require("./images/roadHillE.png")}  />
            <img className={this.state.currentTileToSet === 24? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 24, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="roadHillN" src={require("./images/roadHillN.png")}  />
            <img className={this.state.currentTileToSet === 25? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 25, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="roadHillS" src={require("./images/roadHillS.png")}  />
            <img className={this.state.currentTileToSet === 26? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 26, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="roadHillW" src={require("./images/roadHillW.png")}  />
            <img className={this.state.currentTileToSet === 27? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 27, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="roadNE" src={require("./images/roadNE.png")}  />
            <img className={this.state.currentTileToSet === 28? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 28, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="roadNS" src={require("./images/roadNS.png")}  />
            <img className={this.state.currentTileToSet === 29? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 29, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="roadNW" src={require("./images/roadNW.png")}  />
            <img className={this.state.currentTileToSet === 30? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 30, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="roadSW" src={require("./images/roadSW.png")}  />

            <img className={this.state.currentTileToSet === 31? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 31, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="lotE" src={require("./images/lotE.png")}  />
            <img className={this.state.currentTileToSet === 32? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 32, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="lotES" src={require("./images/lotES.png")}  />
            <img className={this.state.currentTileToSet === 33? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 33, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="lotN" src={require("./images/lotN.png")}  />
            <img className={this.state.currentTileToSet === 34? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 34, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="lotNE" src={require("./images/roadSW.png")}  />
            <img className={this.state.currentTileToSet === 35? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 35, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="lotNW" src={require("./images/lotNW.png")}  />
            <img className={this.state.currentTileToSet === 36? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 36, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="lotS" src={require("./images/lotS.png")}  />
            <img className={this.state.currentTileToSet === 37? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 37, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="lotSW" src={require("./images/lotSW.png")}  />
            <img className={this.state.currentTileToSet === 38? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 38, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="lotW" src={require("./images/lotW.png")}  />

            <img className={this.state.currentTileToSet === 39? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 39, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="bridgeEW" src={require("./images/bridgeEW.png")}  />
            <img className={this.state.currentTileToSet === 40? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 40, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="bridgeNS" src={require("./images/bridgeNS.png")}  />
            <img className={this.state.currentTileToSet === 41? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 41, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="crossroad" src={require("./images/crossroad.png")}  />
            <img className={this.state.currentTileToSet === 42? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 42, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="crossroadESW" src={require("./images/crossroadESW.png")}  />
            <img className={this.state.currentTileToSet === 43? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 43, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="crossroadNES" src={require("./images/crossroadNES.png")}  />
            <img className={this.state.currentTileToSet === 44? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 44, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="crossroadNEW" src={require("./images/crossroadNEW.png")}  />
            <img className={this.state.currentTileToSet === 45? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 45, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="crossroadNSW" src={require("./images/crossroadNSW.png")}  />
            <img className={this.state.currentTileToSet === 46? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 46, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="endE" src={require("./images/endE.png")}  />
            <img className={this.state.currentTileToSet === 47? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 47, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="endN" src={require("./images/endN.png")}  />
            <img className={this.state.currentTileToSet === 48? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 48, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="endS" src={require("./images/endS.png")}  />
            <img className={this.state.currentTileToSet === 49? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 49, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="endW" src={require("./images/endW.png")}  />
            <img className={this.state.currentTileToSet === 50? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 50, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="exitE" src={require("./images/exitE.png")}  />
            <img className={this.state.currentTileToSet === 51? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 51, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="exitN" src={require("./images/exitN.png")}  />
            <img className={this.state.currentTileToSet === 52? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 52, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="exitS" src={require("./images/exitS.png")}  />
            <img className={this.state.currentTileToSet === 53? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 53, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="exitW" src={require("./images/exitW.png")}  />

            {/* river */}
            <img className={this.state.currentTileToSet === 54? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 54, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverBankedES" src={require("./images/riverBankedES.png")}  />
            <img className={this.state.currentTileToSet === 55? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 55, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverBankedEW" src={require("./images/riverBankedEW.png")}  />
            <img className={this.state.currentTileToSet === 56? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 56, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverBankedNE" src={require("./images/riverBankedNE.png")}  />
            <img className={this.state.currentTileToSet === 57? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 57, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverBankedNS" src={require("./images/riverBankedNS.png")}  />
            <img className={this.state.currentTileToSet === 58? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 58, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverBankedNW" src={require("./images/riverBankedNW.png")}  />
            <img className={this.state.currentTileToSet === 59? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 59, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverBankedSW" src={require("./images/riverBankedSW.png")}  />
            <img className={this.state.currentTileToSet === 60? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 60, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverES" src={require("./images/riverES.png")}  />
            <img className={this.state.currentTileToSet === 61? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 61, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverEW" src={require("./images/riverEW.png")}  />
            <img className={this.state.currentTileToSet === 62? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 62, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverNE" src={require("./images/riverNE.png")}  />
            <img className={this.state.currentTileToSet === 63? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 63, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverNS" src={require("./images/riverNS.png")}  />
            <img className={this.state.currentTileToSet === 64? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 64, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverNW" src={require("./images/riverNW.png")}  />
            <img className={this.state.currentTileToSet === 65? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 65, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverSW" src={require("./images/riverSW.png")}  />

            {/* grass */}
            <img className={this.state.currentTileToSet === 66? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 66, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="grass" src={require("./images/grass.png")}  />
            <img className={this.state.currentTileToSet === 67? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 67, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="grassWhole" src={require("./images/grassWhole.png")}  />
            <img className={this.state.currentTileToSet === 68? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 68, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="hillE" src={require("./images/hillE.png")}  />
            <img className={this.state.currentTileToSet === 69? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 69, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="hillES" src={require("./images/hillES.png")}  />
            <img className={this.state.currentTileToSet === 70? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 70, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="hillN" src={require("./images/hillN.png")}  />
            <img className={this.state.currentTileToSet === 71? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 71, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="hillNE" src={require("./images/hillNE.png")}  />
            <img className={this.state.currentTileToSet === 72? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 72, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="hillNW" src={require("./images/hillNW.png")}  />
            <img className={this.state.currentTileToSet === 73? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 73, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="hillS" src={require("./images/hillS.png")}  />
            <img className={this.state.currentTileToSet === 74? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 74, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="hillSW" src={require("./images/hillSW.png")}  />
            <img className={this.state.currentTileToSet === 75? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 75, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="hillW" src={require("./images/hillW.png")}  />

            {/* dirt */}
            <img className={this.state.currentTileToSet === 76? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 76, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="dirt" src={require("./images/dirt.png")}  />
            <img className={this.state.currentTileToSet === 77? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 77, currentItemTileToSet: 0, drawTile : ""})}} alt=""  ref="dirtDouble" src={require("./images/dirtDouble.png")}  />

            {/* beach */}
            <img className={this.state.currentTileToSet === 78? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 78, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="beach" src={require("./images/beach.png")}  />
            <img className={this.state.currentTileToSet === 79? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 79, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="beachCornerES" src={require("./images/beachCornerES.png")}  />
            <img className={this.state.currentTileToSet === 80? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 80, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="beachCornerNE" src={require("./images/beachCornerNE.png")}  />
            <img className={this.state.currentTileToSet === 81? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 81, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="beachCornerNW" src={require("./images/beachCornerNW.png")}  />
            <img className={this.state.currentTileToSet === 82? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 82, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="beachCornerSW" src={require("./images/beachCornerSW.png")}  />
            <img className={this.state.currentTileToSet === 83? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 83, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="beachE" src={require("./images/beachE.png")}  />
            <img className={this.state.currentTileToSet === 84? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 84, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="beachES" src={require("./images/beachES.png")}  />
            <img className={this.state.currentTileToSet === 85? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 85, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="beachN" src={require("./images/beachN.png")}  />
            <img className={this.state.currentTileToSet === 86? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 86, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="beachNE" src={require("./images/beachNE.png")}  />
            <img className={this.state.currentTileToSet === 87? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 87, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="beachNW" src={require("./images/beachNW.png")}  />
            <img className={this.state.currentTileToSet === 88? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 88, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="beachS" src={require("./images/beachS.png")}  />
            <img className={this.state.currentTileToSet === 89? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 89, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="beachSW" src={require("./images/beachSW.png")}  />
            <img className={this.state.currentTileToSet === 90? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 90, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="beachW" src={require("./images/beachW.png")}  />

            <img className={this.state.currentTileToSet === 100? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 100, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="empty" src={require("./images/empty.png")}  />

            <img className={this.state.currentTileToSet === 101? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 101, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="rock" src={require("./images/rock.png")}  />

            <img className={this.state.currentTileToSet === 102? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 102, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverBridge1" src={require("./images/riverBridge1.png")}  />
            <img className={this.state.currentTileToSet === 103? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 103, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverBridge2" src={require("./images/riverBridge2.png")}  />
            <img className={this.state.currentTileToSet === 104? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 104, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverBridge3" src={require("./images/riverBridge3.png")}  />
            <img className={this.state.currentTileToSet === 105? "selected": "unselected"} onClick={()=>{this.setState({currentTileToSet : 105, currentItemTileToSet: 0, drawTile : ""})}} alt="" ref="riverBridge4" src={require("./images/riverBridge4.png")}  />
        </div>

        <div className="itemsVisibility" ref="itemsTiles">
            {/* conifer trees */}
            <img className={this.state.currentItemTileToSet === 91? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 91, currentTileToSet: 0, drawTile : ""})}} alt="" ref="coniferAltShort" src={require("./images/coniferAltShort.png")}  />
            <img className={this.state.currentItemTileToSet === 92? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 92, currentTileToSet: 0, drawTile : ""})}} alt="" ref="coniferAltTall" src={require("./images/coniferAltTall.png")}  />
            <img className={this.state.currentItemTileToSet === 93? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 93, currentTileToSet: 0, drawTile : ""})}} alt="" ref="coniferShort" src={require("./images/coniferShort.png")}  />
            <img className={this.state.currentItemTileToSet === 94? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 94, currentTileToSet: 0, drawTile : ""})}} alt="" ref="coniferTall" src={require("./images/coniferTall.png")}  />

            {/* non conifer trees */}
            <img className={this.state.currentItemTileToSet === 95? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 95, currentTileToSet: 0, drawTile : ""})}} alt="" ref="treeAltShort" src={require("./images/treeAltShort.png")}  />
            <img className={this.state.currentItemTileToSet === 96? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 96, currentTileToSet: 0, drawTile : ""})}} alt="" ref="treeAltTall" src={require("./images/treeAltTall.png")}  />
            <img className={this.state.currentItemTileToSet === 97? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 97, currentTileToSet: 0, drawTile : ""})}} alt="" ref="treeShort" src={require("./images/treeShort.png")}  />
            <img className={this.state.currentItemTileToSet === 98? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 98, currentTileToSet: 0, drawTile : ""})}} alt="" ref="treeTall" src={require("./images/treeTall.png")}  />

            <img className={this.state.currentItemTileToSet === 99? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 99, currentTileToSet: 0, drawTile : ""})}} alt="" ref="tank" src={require("./images/tank.png")}  />
          

            <img  alt="" ref="selectedGrid" src={require("./images/selectedGrid.png")}  />

            <img className={this.state.currentItemTileToSet === 107? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 107, currentTileToSet: 0, drawTile : ""})}} alt="" ref="building" src={require("./images/building.png")}  />
            <img className={this.state.currentItemTileToSet === 108? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 108, currentTileToSet: 0, drawTile : ""})}} alt="" ref="office" src={require("./images/office.png")}  />
       
            <img className={this.state.currentItemTileToSet === 109? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 109, currentTileToSet: 0, drawTile : ""})}} alt="" ref="car1" src={require("./images/car1.png")}  />
            <img className={this.state.currentItemTileToSet === 110? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 110, currentTileToSet: 0, drawTile : ""})}} alt="" ref="car2" src={require("./images/car2.png")}  />
            <img className={this.state.currentItemTileToSet === 111? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 111, currentTileToSet: 0, drawTile : ""})}} alt="" ref="car3" src={require("./images/car3.png")}  />
            <img className={this.state.currentItemTileToSet === 112? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 112, currentTileToSet: 0, drawTile : ""})}} alt="" ref="car4" src={require("./images/car4.png")}  />
            <img className={this.state.currentItemTileToSet === 113? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 113, currentTileToSet: 0, drawTile : ""})}} alt="" ref="emptyItem" src={require("./images/empty.png")}  />

            <img className={this.state.currentItemTileToSet === 114? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 114, currentTileToSet: 0, drawTile : ""})}} alt="" ref="boreHole" src={require("./images/boreHole.png")}  />
            <img className={this.state.currentItemTileToSet === 115? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 115, currentTileToSet: 0, drawTile : ""})}} alt="" ref="waterTower" src={require("./images/waterTower.png")}  />
            <img className={this.state.currentItemTileToSet === 115? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 116, currentTileToSet: 0, drawTile : ""})}} alt="" ref="building2" src={require("./images/building2.png")}/>
            <img className={this.state.currentItemTileToSet === 115? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 117, currentTileToSet: 0, drawTile : ""})}} alt="" ref="treatmentPond" src={require("./images/treatmentPond.png")}/>
        
            <img className={this.state.currentItemTileToSet === 115? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 118, currentTileToSet: 0, drawTile : ""})}} alt="" ref="pipe1" src={require("./images/pipe1.png")}/>
            <img className={this.state.currentItemTileToSet === 115? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 118, currentTileToSet: 0, drawTile : ""})}} alt="" ref="pipe2" src={require("./images/pipe2.png")}/>
            <img className={this.state.currentItemTileToSet === 115? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 118, currentTileToSet: 0, drawTile : ""})}} alt="" ref="pipe3" src={require("./images/pipe3.png")}/>
            <img className={this.state.currentItemTileToSet === 115? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 118, currentTileToSet: 0, drawTile : ""})}} alt="" ref="pipe4" src={require("./images/pipe4.png")}/>
            <img className={this.state.currentItemTileToSet === 115? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 118, currentTileToSet: 0, drawTile : ""})}} alt="" ref="pipe5" src={require("./images/pipe5.png")}/>
            <img className={this.state.currentItemTileToSet === 115? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 118, currentTileToSet: 0, drawTile : ""})}} alt="" ref="pipe6" src={require("./images/pipe6.png")}/>
            <img className={this.state.currentItemTileToSet === 115? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 118, currentTileToSet: 0, drawTile : ""})}} alt="" ref="pipe7" src={require("./images/pipe7.png")}/>
            <img className={this.state.currentItemTileToSet === 115? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 118, currentTileToSet: 0, drawTile : ""})}} alt="" ref="pipe8" src={require("./images/pipe8.png")}/>
            <img className={this.state.currentItemTileToSet === 115? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 118, currentTileToSet: 0, drawTile : ""})}} alt="" ref="pipe9" src={require("./images/pipe9.png")}/>
            <img className={this.state.currentItemTileToSet === 115? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 118, currentTileToSet: 0, drawTile : ""})}} alt="" ref="pipe10" src={require("./images/pipe10.png")}/>
            <img className={this.state.currentItemTileToSet === 115? "selected": "unselected"} onClick={()=>{this.setState({currentItemTileToSet : 118, currentTileToSet: 0, drawTile : ""})}} alt="" ref="pipe11" src={require("./images/pipe11.png")}/>
        </div>
      </div>
   )
  }
}

export default App;



