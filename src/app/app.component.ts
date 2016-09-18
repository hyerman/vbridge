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
  bidSum : number;

  @ViewChildren(SquareComponent) squareComponents: QueryList<SquareComponent>;
  @ViewChildren(ActionComponent) actionComponents: QueryList<ActionComponent>;


  constructor(){
    this.numPlayers = 4;
    this.playerNames = [{name:''},{name:''},{name:''},{name:''}];
    this.pointTotals = [0,0,0,0];
    this.myMode = 'settings';
    this.buttonText = 'Start Game';
    this.cardCounts = [52,52,26,17,13,10,8]; 
    this.cardLevels = [];
    this.bids = [];
    this.points = [];
  }

  onChangeNumPlayers(){
    this.playerNames=[];
    this.pointTotals=[];
    for (let i = 0; i < this.numPlayers; i++){
      this.playerNames[i] = {name:''};
      this.pointTotals[i] = 0;
    }
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
      //update points
       this.updatePlayerPointTotals();
       let nextLevel=actionObj.cardLevel-1;
       if(nextLevel == 0){
         //game over man
       }
       else{
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
    //remember to turn off ngOnInit for square or it will double count
      //should check that all squares are complete
      //rollback action level and alert user to error
      //or maybe have the action component check the squares...
    //call nextActionStage() of action component in next row
    //update row square levels
    this.squareComponents.toArray().forEach(
    (child)=>{
      if(child.getSquareCardLevel() == actionObj.cardLevel){
        child.increaseSquareStage();
      }
    });
  }
}
