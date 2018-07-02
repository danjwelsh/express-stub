export class Response {
  constructor(public code: number, public message: string, public errors: boolean, public payload: any) {}
}
