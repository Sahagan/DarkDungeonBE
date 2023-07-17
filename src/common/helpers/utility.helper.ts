import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExpectaionFailedException, unauthorizedException, PermissionDeniedException, TokenExpiredException } from '../exceptions/application.exception';
import { logAppHelper } from '../helpers/logger.helper';

@Injectable()
export class utilityHelper {
    constructor(
        private readonly configService:ConfigService
    ){}
    parseJson (string){
		try {
			return JSON.parse(string)
		} catch (error) {
            console.log('can not parse JSON');        
			throw new ExpectaionFailedException();
		}
	}

    setValueInitInvoke (req){
        let testresponse = req.TID
		return testresponse
    }

    generateRandomChar(){
        var result = [];
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < 5; i++) {
			result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
		}
		return result.join('');
    }

    setInvokeDestNode (){
        let node = this.configService.get('app.name');
		let now = new Date()
		let year = now.getFullYear()
		let month = ("0" + (now.getMonth() + 1)).slice(-2);
		let date = ("0" + now.getDate()).slice(-2)
		let hour = ("0" + now.getHours()).slice(-2);
		let minute = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes()
		let second = (now.getSeconds() < 10 ? '0' : '') + now.getSeconds()

		return `${node}-${year}${month}${date}${hour}${minute}${second}${this.generateRandomChar()}`
    }

	generateHeader() {
		let node = this.configService.get('app.name');
        let now = new Date()
        let year = now.getFullYear()
        let month = ("0" + (now.getMonth() + 1)).slice(-2);
        let date = ("0" + now.getDate()).slice(-2)
        let hour = ("0" + now.getHours()).slice(-2);
        let minute = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes()
        let second = (now.getSeconds() < 10 ? '0' : '') + now.getSeconds()

        return `${node}-${year}${month}${date}${hour}${minute}${second}${this.generateRandomChar()}`
    }

    CheckIdentity(req,identity){
        const logApp = new logAppHelper();
        logApp.log('CheckIdentity : '+identity, "info");
        if(!identity){
            logApp.log( identity+" is Empty!", "debug");
            return "undefined";
        }else{
            logApp.log( identity+" have value!", "info");
            return identity;
        };
    }
    
}

