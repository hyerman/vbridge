import { Component,ViewChildren,QueryList } from '@angular/core';
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

  @ViewChildren(SquareComponent) squareComponents: QueryList<SquareComponent>;

  constructor(){
    this.numPlayers = 4;
    this.playerNames = [{name:''},{name:''},{name:''},{name:''}];
    this.pointTotals = [0,0,0,0];
    this.myMode = 'settings';
    this.buttonText = 'Start Game';
    this.cardCounts = [52,52,26,17,13,10,8]; 
    this.cardLevels = [];
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

  onBidSet(){
    console.log('bid was set');
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
}
