export class Response {
  public code: number
  public message: string
  public errors: boolean
  public payload: any

  constructor(code: number, message: string, errors: boolean, payload: any) {
    this.code = code
    this.message = message
    this.errors = errors
    this.payload = payload
  }
}
