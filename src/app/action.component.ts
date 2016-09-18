import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'action',
  templateUrl: 'action.component.html',
})

export class ActionComponent {
  @Input() cardLevel : number;
  @Input() startLvl : number;
  @Output() actionStageIncreased: EventEmitter<any> = new EventEmitter();
  stage : number;
  bidSum : number;
  remainingPoints : number;

  constructor(){
    this.stage = 0;
    this.bidSum = 0; 
  }

  ngOnInit() { 
    if(this.startLvl==this.cardLevel){
      //this action is in the top row and needs to move up a stage
      this.nextActionStage();
    }
    this.remainingPoints = this.cardLevel;
  }

  nextActionStage(){
    if(this.stage < 4 ){
      this.stage++;
      this.actionStageIncreased.emit(this);
    }
    else{
      //do nothing stage 4 is the final stage
    }
  }

  priorActionStage(){
    this.stage--; //used to roll back to prior stage when conditions were not met
  }

  setBidSum(amount){
    this.bidSum = amount;
    //console.log('aaa '+amount);
    this.remainingPoints = this.cardLevel - this.bidSum;
  }

}