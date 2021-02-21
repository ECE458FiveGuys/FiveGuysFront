export class UserError extends Error {
    constructor(message) {
        super();
        this.message = message
    }
}

export class ServerError extends Error {
    constructor() {
        super();
        this.message = "The server has failed to process this request"
    }
}