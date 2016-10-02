import { Component,ViewChildren,QueryList,ViewChild } from '@angular/core';
import { SquareComponent } from './square.component';
import { ActionComponent } from './action.component';
//import {ChildCmp} from "./child";


@Component({
  moduleId: module.id,
  selector: 'app-root',
  directives: [SquareComponent,ActionComponent],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  
  title = 'app works!';
  numPlayers: number;
  playerNames = [];
  myMode : string;
  buttonText : string;
  cardCounts = [];
  maxCards : number;
  currentCards : number;
  cardLevels = [];
  pointTotals = [];
  bids = [];
  points = [];
  tricks = [];
  bidSum : number;
  tricksSum : number;
  startDealer : number;

  @ViewChildren(SquareComponent) squareComponents: QueryList<SquareComponent>;
  @ViewChildren(ActionComponent) actionComponents: QueryList<ActionComponent>;


  constructor(){
    this.numPlayers = 4;
    this.playerNames = [{name:''},{name:''},{name:''},{name:''}];
    this.pointTotals = [0,0,0,0];
    this.myMode = 'settings';
    this.buttonText = 'Start Game';
    this.cardCounts = [52,52,26,17,13,10,8,7,6,5,5]; 
    this.cardLevels = [];
    this.bids = [];
    this.points = [];
    this.tricks = [];
    this.startDealer = 0;
  }

  onChangeNumPlayers(value){
    this.numPlayers = parseInt(value);
    this.playerNames=[];
    this.pointTotals=[];
    for (let i = 0; i < this.numPlayers; i++){
      this.playerNames[i] = {name:''};
      this.pointTotals[i] = 0;
    }
  }

  onPickRandomDealer(){
    this.startDealer = Math.floor(Math.random() * (this.numPlayers - 0)) + 0;
  }

  onSelectDealer(value){
    this.startDealer = parseInt(value);
  }

  onClickedStart(){
    if(this.myMode=='settings'){
      for (let i = 0; i < this.numPlayers; i++){
        console.log(this.playerNames[i].name);
      }
      this.myMode='play';
      this.buttonText = 'Setup New Game';
      this.maxCards=this.cardCounts[this.numPlayers];
      this.currentCards=this.maxCards;
      this.cardLevels = [];
      for(let i=this.maxCards; i>0; i--){
        this.cardLevels.push(i);
      }
      console.log('aaa '+this.startDealer);
    }
    else{
      this.myMode='settings';
      this.buttonText = 'Start Game';
    }
  }

  onBidSet(squareObj){
    //update array of player bids
    this.bids[squareObj.playerID]=squareObj.squareBid; 
    //determine sum of bids and send to action component
    this.bidSum = 0;
    for(let i=0; i<this.bids.length; i++){
      if(this.bids[i] != undefined){
        this.bidSum += this.bids[i];
      }
    }
    //find right action component and send bidSum to it
    this.actionComponents.toArray().forEach(
    (child)=>{
      if(child.stage == 1){
        child.setBidSum(this.bidSum);
      }
    });
  }

  onPointsSet(squareObj){
    this.points[squareObj.playerID]=squareObj.squarePoints; 
    this.tricks[squareObj.playerID]=squareObj.squareTricks; 
    //console.log(JSON.stringify(this.bids, null, "  "));
    //console.log('length '+ this.bids.length);
  }

  onTest(){
    //this works below
    //console.log(this.squareComponents.first.getMyValue());
    //for (let child in this.squareComponents.toArray()){
    //for (let child in Object.keys(this.squareComponents)
      //console.log(typeof child);
      //console.log(child);
   //}
   this.squareComponents.first.increaseSquareStage();
   console.log(this.squareComponents.first.getSquareStage());
   document.getElementById("11").innerHTML="<button>click me</button>";
  }

  updatePlayerPointTotals(){
    for (let i = 0; i < this.numPlayers; i++){
      this.pointTotals[i] = 0;
    }

    this.squareComponents.toArray().forEach(
    (child)=>{
      this.pointTotals[child.getSquarePlayerID()] += child.getSquarePoints();
    });
  }

  onActionStageIncreased(actionObj){
    //console.log(actionObj.cardLevel);
    //get all bids to handle rewind
    //getting points while I am at it
    this.squareComponents.toArray().forEach(
    (child)=>{
      if(child.getSquareCardLevel() == actionObj.cardLevel){
        this.bids[child.getSquarePlayerID()] = child.getSquareBid();
        this.points[child.getSquarePlayerID()] = child.getSquarePoints();
      }
    });
    //make sure all the bids are set
    if(actionObj.stage == 2){
      if(this.bids.length != this.numPlayers){
        actionObj.priorActionStage();//send stage back to prior level
        window.alert("Make sure all bids are set.");//alert
        return;
      }
      for(let i=0; i<this.bids.length; i++){
        if(this.bids[i] == undefined){
          actionObj.priorActionStage();//send stage back to prior level
          window.alert("Make sure all bids are set.");//alert
          return;         
        }
      }
    }

    if(actionObj.stage == 4){
      //make sure all points are set
      if(this.points.length != this.numPlayers){
        actionObj.priorActionStage();//send stage back to prior level
        window.alert("Make sure all points are set.");//alert
        return;
      }
      
      for(let i=0; i<this.points.length; i++){
        if(this.points[i] == undefined){
          actionObj.priorActionStage();//send stage back to prior level
          window.alert("Make sure all points are set.");//alert
          return;         
        }
      }
      //check and make sure right number of points were claimed 
      this.tricksSum = 0;
      this.squareComponents.toArray().forEach(
      (child)=>{
        if(child.getSquareCardLevel() == actionObj.cardLevel){
          this.tricksSum += child.getSquareTricks();
        }
      });
      if(this.tricksSum != actionObj.cardLevel){
        actionObj.priorActionStage();//send stage back to prior level
        window.alert("The number of tricks claimed ("+this.tricksSum+') does not equal the number of points in the hand ('+actionObj.cardLevel+').');//alert
        return;         
      }

      //update points
       this.updatePlayerPointTotals();

       let nextLevel=actionObj.cardLevel-1;
       if(nextLevel == 0){
         //game over man
       }
       else{
         // increase stage of next action component
         // calling nextActionStage  on that next action component will 
         // fire an event that will increase the stage of the square components
         // in that next row
        this.actionComponents.toArray().forEach(
        (child)=>{
          if(child.cardLevel == nextLevel){
            child.nextActionStage();
          }
        });  
        this.bids = [];//reset bids array
        this.points = [];//reset points array
       }
    }

    //increase stage of square components 
    this.squareComponents.toArray().forEach(
    (child)=>{
      if(child.getSquareCardLevel() == actionObj.cardLevel){
        child.increaseSquareStage();
      }
    });
  }

  onRewind(){
    //determine what level and stage is active
    let currentActionObj;
    this.actionComponents.toArray().forEach(
    (child)=>{
      if(child.getStage() > 0  && child.getStage() < 4){
        currentActionObj = child; 
      }
    });
    //console.log(currentActionObj.getCardLevel());
    if(currentActionObj.getStage() == 1){
      if(currentActionObj.getCardLevel() == this.maxCards){
        //Do nothing. Can't rewind futher
      }
      else{
        //need to rewind current row and prior row to a level
        //first rewind current row (action and squares)
        currentActionObj.priorActionStage();
        this.squareComponents.toArray().forEach(
        (child)=>{
          if(child.getSquareCardLevel() == currentActionObj.cardLevel){
            child.decreaseSquareStage();
          }
        });
        //rewind prior row to stage 3
        //rewind action component
        let nextLevel=currentActionObj.cardLevel+1;
        this.actionComponents.toArray().forEach(
        (child)=>{
          if(child.cardLevel == nextLevel){
            child.priorActionStage();
          }
        });  
        // rewind squares
        this.squareComponents.toArray().forEach(
        (child)=>{
          if(child.getSquareCardLevel() == nextLevel){
            child.decreaseSquareStage();
          }
        });
      }
    }
    else{
      //simple rewind of the stage at same level
      currentActionObj.priorActionStage();
      this.squareComponents.toArray().forEach(
      (child)=>{
        if(child.getSquareCardLevel() == currentActionObj.cardLevel){
          child.decreaseSquareStage();
        }
      });
    }
  }
  onSkip(){
    //determine what level is active
    let currentActionObj;
    this.actionComponents.toArray().forEach(
    (child)=>{
      if(child.getStage() > 0  && child.getStage() < 4){
        currentActionObj = child; 
      }
    });
    //set current row to stage 4
    this.squareComponents.toArray().forEach(
    (child)=>{
      if(child.getSquareCardLevel() == currentActionObj.cardLevel){
        child.decreaseSquareStage();
        child.skipSquareLevel();
      }
    });
    currentActionObj.skipActionLevel();
    //set next row to stage 1
    let nextLevel=currentActionObj.cardLevel-1;
    if(nextLevel == 0){
      //game over man
    }
    else{
      // increase stage of next action component
      // calling nextActionStage  on that next action component will 
      // fire an event that will increase the stage of the square components
      // in that next row
    this.actionComponents.toArray().forEach(
    (child)=>{
      if(child.cardLevel == nextLevel){
        child.nextActionStage();
      }
    });  
    this.bids = [];//reset bids array
    this.points = [];//reset points array
    }
  }
  highlightActiveLevel(){
    //probably pass in the active level
    // first set all TDs to nothing
    // then set all tds that are sub of the tr{{}} to css
    // http://www.w3schools.com/jsref/met_document_queryselectorall.asp
    // https://www.kirupa.com/html5/setting_css_styles_using_javascript.htm 
  }
}
