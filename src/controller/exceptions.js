export class UserError extends Error {
    constructor(message) {
        super();
        this.message = message
    }
}

export class ServerError extends Error {
    constructor(message=undefined) {
        super();
        this.message = message ? `The server has failed to process this request: ${message}` :
            "The server has failed to process this request"
    }
}

export function handleUserError(e, errorMessageHandler) {
    if (e instanceof RangeError) {
        let errorMessage = e.message
        errorMessageHandler(errorMessage)
    } else {
        throw e;  // re-throw the error unchanged
    }
}