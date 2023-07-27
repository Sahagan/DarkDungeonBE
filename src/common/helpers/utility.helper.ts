import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExpectaionFailedException, unauthorizedException, PermissionDeniedException, TokenExpiredException } from '../exceptions/application.exception';
import { logAppHelper } from '../helpers/logger.helper';

@Injectable()
export class utilityHelper {
    constructor(
        private readonly configService: ConfigService
    ) { }
    parseJson(string) {
        try {
            return JSON.parse(string)
        } catch (error) {
            console.log('can not parse JSON');
            throw new ExpectaionFailedException();
        }
    }

    setValueInitInvoke(req) {
        let testresponse = req.TID
        return testresponse
    }

    generateRandomChar() {
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 5; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
        return result.join('');
    }

    setInvokeDestNode() {
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

    CheckIdentity(req, identity) {
        const logApp = new logAppHelper();
        logApp.log('CheckIdentity : ' + identity, "info");
        if (!identity) {
            logApp.log(identity + " is Empty!", "debug");
            return "undefined";
        } else {
            logApp.log(identity + " have value!", "info");
            return identity;
        };
    }

    generateSeed(length) {
        let validFirstNumbers = [1, 3, 4, 5];
        let firstNumber = 2;
        let secondNumber = Math.floor(Math.random() * 3) + 1;
        let generatedNumber = firstNumber.toString() + secondNumber.toString();

        for (let i = 0; i < length; i++) {
            firstNumber = validFirstNumbers[Math.floor(Math.random() * validFirstNumbers.length)];
            secondNumber = Math.floor(Math.random() * 3) + 1;
            generatedNumber += firstNumber.toString() + secondNumber.toString();
        }
        return generatedNumber;
    }

    generateDungeon() {
        //_1 randomNormalEvent _2 mainEvent _3 Door _4 Locked Door _5 specialEvent
        let start = '23'; //Dungeon Entrance
        let end = '21'
        for (let i = 0; i < 10; i++) {
            start = start + this.generateSeed(i);
        };
        return start + end;
    }
}

