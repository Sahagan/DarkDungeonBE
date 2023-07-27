export class ResponseModel {
    resultCode: string;
    developerMessage: string;
    data: string;

    constructor(constants,data?) {      
        this.resultCode =  constants.resultCode || constants.response.resultCode;
        this.developerMessage = constants.developerMessage || constants.response.developerMessage;
        if(data){
            this.data = data;
        }
    }
}