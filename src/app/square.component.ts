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
  styleUrls: ['square.component.css']
})

export class SquareComponent {
  @Input() cardLevel : number;
  @Input() playerID : number;
  @Input() startLvl : number;
  @Input() numPlayers : number;
  @Input() startDealer : number;
  @Output() bidSet: EventEmitter<any> = new EventEmitter();
  @Output() pointsSet: EventEmitter<any> = new EventEmitter();
  squarePoints: number;
  squareBid: number;
  squareTricks: number;
  stage : number;
  squareCards = [];
  isSpecial : boolean;
  isDealer : boolean;
  isFirstBidder : boolean;

  constructor(){
    this.squarePoints= 0;
    this.squareBid = undefined;
    this.squareTricks = undefined;
    this.stage = 0;
    this.squareCards=[];
    this.isSpecial = false; 
    this.isDealer = false;
    this.isFirstBidder = false; 
  }

setClasses() {
  let classes =  {
    dealer: this.isDealer, 
    firstBidder: this.isFirstBidder, 
  };
  return classes;
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

    //determine if dealer or bidder
    let b = (this.startDealer + this.startLvl - this.cardLevel) % this.numPlayers;
    if(b == this.playerID){
      this.isDealer = true;
    }

    let c = (1 + this.startDealer + this.startLvl - this.cardLevel) % this.numPlayers;
    if(c == this.playerID){
      this.isFirstBidder = true;
    }
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
      this.isSpecial = true;
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
  decreaseSquareStage(){
    if(this.stage > 0){
      this.stage--;
    }
  }
  skipSquareLevel(){
    this.stage = 4;
    this.squareBid = 0;
    this.squarePoints = 0;
  }
}