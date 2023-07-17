export class ResponseModel {
    resultCode: string;
    developerMessage: string;

    constructor(constants) {      
        this.resultCode =  constants.resultCode || constants.response.resultCode;
        this.developerMessage = constants.developerMessage || constants.response.developerMessage;
    }
}