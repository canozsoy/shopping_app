export default class CustomErrorObject {
  object: {};

  status: number;

  constructor(object:{}, status:number) {
    this.object = object;
    this.status = status;
  }
}
