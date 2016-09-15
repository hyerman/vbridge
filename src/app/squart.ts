export enum StageEnum {
	Inactive, 
	Bidding, 
	Playing,
	Recording,
	Closed
}

export class Square {
  bid: number;
  tricks: number;
  points: number;
  stage: any;

  constructor() {
      this.bid = null;
      this.tricks = null;
      this.points = null;
      this.stage = StageEnum.Inactive;
  }

  increaseStage(){
	console.log(this.stage);
	return 'blah';
  }
}

let fn = new Square();
fn.increaseStage();
