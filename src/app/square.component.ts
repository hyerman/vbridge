import { Component, Input, Output, EventEmitter } from '@angular/core';

export const enum StageEnum {
	Inactive, 
	Bidding, 
	Playing,
	Recording,
	Closed
}

@Component({
  moduleId: module.id,
  selector: 'square',
  templateUrl: 'square.component.html',
})

export class SquareComponent {
  @Input() cardLevel : number;
  @Input() playerID : number;
  @Input() startLvl : number;
  @Output() bidSet: EventEmitter<any> = new EventEmitter();
  @Output() pointsSet: EventEmitter<any> = new EventEmitter();
  squarePoints: number;
  squareBid: number;
  squareTricks: number;
  stage : number;
  squareCards = [];

  constructor(){
    this.squarePoints= 0;
    this.squareBid = undefined;
    this.squareTricks = undefined;
    this.stage = 0;
    this.squareCards=[];
  }

  ngOnInit() { 
    //this.squareCards.push('Bid');
    for (let i = 0; i <= this.cardLevel; i++){
      this.squareCards.push(i);
    }
    if(this.startLvl==this.cardLevel){
      //this square is in the top row and needs to move up a stage
      this.increaseSquareStage();
    }
    //console.log(this.cardLevel+' '+this.playerID+' '+this.squarePoints+' '+this.squareCards);
    //console.log('h '+this.squareCards);
  }

  onChangeBid(value){
    this.squareBid = parseInt(value);
    this.bidSet.emit(this);
    //console.log('value a '+value);
    //console.log('bid a '+this.squareBid);
    //console.log('tricks a '+this.squareTricks);
    //console.log('points a '+this.squarePoints);
  }
  onChangeTricks(value){
    this.squareTricks = parseInt(value);
    this.squarePoints = 0;
    this.squarePoints = this.squareTricks;

    if(this.squareBid == this.squareTricks){
      this.squarePoints = this.squarePoints + 10;
    }
    this.pointsSet.emit(this);
    //console.log('bid b '+this.squareBid);
    //console.log('points b '+this.squarePoints);
  }

  getSquarePoints(){
    //console.log(this.cardLevel+' '+this.playerID+' '+this.squarePoints);
    return this.squarePoints;
  }
  getSquareBid(){
    return this.squareBid;
  }
  getSquareTricks(){
    return this.squareTricks;
  }
  getSquarePlayerID(){
    return this.playerID;
  }
  getSquareCardLevel(){
    return this.cardLevel;
  }
  getSquareStage(){
    return this.stage;
  }
  increaseSquareStage(){
    if(this.stage < 4 ){
      this.stage++;
    }
    else{
      //do nothing stage 4 is the final stage
    }
  }
}