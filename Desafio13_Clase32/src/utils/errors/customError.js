export default class CustomError extends Error {
    constructor(error){
        this.name=error.name || "Error"
        this.cause=error.cause
        this.message=error.message
        this.code=error.code || 1
    }
    
}