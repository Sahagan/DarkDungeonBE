import * as logger from 'commonlog-kb';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
@Injectable()
export class logStatHelper {
    appName = this.configService.get('app.name');
    constructor(
        private configService: ConfigService,
        private adapterHost: HttpAdapterHost
    ) {
        const conf = configService.get<any>('logger.config')
        const express = adapterHost.httpAdapter;
        logger.init(conf,express)
    }
    async logStatApp(statName, commandName, destNode, type, method, message, action, resultCode) {
        try {
            let stat = statName;
            let appName = this.appName;
            let delimiter = this.configService.get('logger.statPattern.delimiter') || ' '
            let command = `${commandName}` + `_` + `${resultCode}`
            if (action == 'request') {
                command = `${commandName}`
            }
            if(method){
                command = `${method}` + `_` + `${commandName}` + `_` + `${resultCode}`
                if (resultCode == 'error') {
                    command = `${method}` + `_` + `${commandName}`
                }
                if (action == 'request') {
                    command = `${method}` + `_` + `${commandName}`                    
                }
            }
            stat = stat.replace('<nodeName>', appName || '-')
            stat = stat.replace('<destNode>', destNode || 'unknown')
            stat = stat.replace('<type>', type || '-')
            stat = stat.replace('<method>', method || '-')
            stat = stat.replace('<table>', command || 'unknown')
            stat = stat.replace('<command>', command || 'unknown')
            stat = stat.replace('<action>', action || '-')
            stat = stat.replace(/ /g, delimiter)   
            logger.stat(stat);
            
            return stat
        } catch (error) {
            throw error;
        }
    }
}
export class logAppHelper {
    request:any;
    async initRequest(request) {
        this.request = request;
    }
    async log(msg, type) {
        // add appName for appLog
        try {
            let sessionId
            if (this.request) {
                sessionId = `${this.request.SESSION}:${this.request.RTID}:${this.request.TID}`
            }
            switch (type) {
                case 'debug':
                    logger.debug(sessionId, msg);
                    break;
                case 'info':
                    logger.info(sessionId, msg);
                    break;
                case 'warn':
                    logger.warn(sessionId, msg);
                    break;
                case 'error':
                    logger.error(sessionId, msg);
                    break;
                default:
                    logger.debug(sessionId, msg);
            }
            return;
        } catch (err) {
            throw err;
        }
    }
}
export class detailHelper {
    logDetail: any = {};
    appName: string;
    request: any = "";
    initInvoke: string;
    protocal: string;
    commandName: string;
    method: string;
    destNode: string;
    collection : string;
    async logInputRequestDetail(appName, commandName, request, initInvoke, identity = 'unknown') {
        this.appName = appName;
        this.request = request;
        this.initInvoke = initInvoke;
        try {
            let inputReq = {
                Method: this.request.method,
                Data: {
                    Header: this.request.headers,
                    Url: this.request.originalUrl,
                    Body: this.request.body
                },
                Protocol: this.request.protocol,
            }
            const session = `${this.request.SESSION}:${this.request.RTID}:${this.request.TID}`
            const scenario = `${this.request.method} ${commandName}`
            //CREATE detailLog
            this.logDetail = await logger.detail(session, this.initInvoke, scenario, identity);
            const event = `${this.request.method} ${commandName}`
            let rawData = ""
            if(JSON.stringify(inputReq.Data.Body) != "{}"){
                rawData = JSON.stringify(inputReq.Data.Body)
            }
            //appName, event, initInvoke, rawData, data, protocal, method
            await this.logDetail.addInputRequest(this.appName, event, this.initInvoke, rawData, inputReq.Data, inputReq.Protocol, inputReq.Method);
            return
        } catch (err) {
            throw err;
        }
    }
    async logOutputResponseDetail(commandName, res, resBody) {
        try {
            if (this.request['TID']) {
                res.setHeader('x-tid', this.request['TID'])
            }
            if (this.request['RTID']) {
                res.setHeader('x-rtid', this.request['RTID'])
            }
            if (this.request['SESSION']) {
                res.setHeader('x-session-id', this.request['SESSION'])
            }
            const invoke = this.initInvoke
            let resOutput = {
                Header: res.getHeaders(),
                Url: this.request.originalUrl,
                Body: resBody
            }
            //CREATE detailLog
            // (appname, commandName, invoke, rawData, data)
            const rawData = JSON.stringify(resOutput.Body)
            const event = `${this.request.method} ${commandName}`
            await this.logDetail.addOutputResponse(this.appName, event, invoke, rawData, resOutput);
            await this.logDetail.end();
            return
        } catch (err) {
            throw err;
        }
    }
    async logAddOutputRequestDetail(reqData, logInvoke) {
        this.commandName = reqData.commandName
        this.method = reqData.method
        this.destNode = reqData.destNode
        this.collection = reqData.collection
        try {
            let data: any;
            let rawData: string;
            let event:string;
            const invoke = logInvoke
            if (reqData.destNode === 'mongoDB') {
                data = {
                    Url: reqData.url,
                    Body: {
                        Value: reqData.value
                    }
                }
                rawData = JSON.stringify(data.Body.Value)
                event = `${reqData.method} ${reqData.collection}`
            }
            else {
                data = {
                    Header: reqData.headers,
                    Url: reqData.url,
                    Body: reqData.body
                }
                rawData = JSON.stringify(data.Body)
                event = `${reqData.method} ${reqData.commandName}`
            }
            //CREATE detailLog
            //(node, cmd, invoke, rawData , data, protocol, Method)
            await this.logDetail.addOutputRequest(reqData.destNode, event, invoke, rawData, data, reqData.protocal, reqData.method);
            await this.logDetail.end();
            return
        } catch (err) {
            throw err;
        }
    }
    async logAddInputResponseDetail(resData, logInvoke) {
        try {
            let data: any
            let event:string;
            const invoke = logInvoke
            if (resData.destNode === 'mongoDB') {
                data = {
                    Url: resData.url,
                    Body: resData.result
                }
                event = `${this.method} ${this.collection}`
            }
            else {
                data = {
                    Header: resData.headers,
                    Url: resData.url,
                    Body: resData.body
                }
                event = `${this.method} ${this.commandName}`
            }
            const rawData = JSON.stringify(data.Body)
            //CREATE detailLog
            // (node, cmd, invoke, rawData, data, resTime)
            await this.logDetail.addInputResponse(this.destNode, event, invoke, rawData, data);
            return
        } catch (err) {
            throw err;
        }
    }
    async logAddInputResponseErrorDetail(resData, logInvoke){
        try {
            let event:string;
            const invoke = logInvoke
            if (resData.destNode === 'mongoDB') {
                event = `${this.method} ${this.collection}`
            }
            else {
                event = `${this.method} ${this.commandName}`
            }
            //CREATE detailLog
            // (node, cmd, invoke, rawData, data, resTime)
            await this.logDetail.addInputResponseError(this.destNode, event, invoke);
            return
        } catch (err) {
            throw err;
        }
    }
}
export class summaryHelper {
    summary: any = {};
    async logSummaryInit(request, commandName, identity = 'unknown') {
        let method = request.method;
        try {
            let session = `${request.SESSION}:${request.RTID}:${request.TID}`
            // CREATE summary
            this.summary.logSummary = await logger.summary(session, request.TID, method + ' ' + commandName, identity);
            return
        } catch (err) {
            throw err;
        }
    }
    async logAddBlockSummary(reqData, type, res) {
        let response = {
            resultCode: null,
            resultDesc: ""
        }
        let event:string;
        if(reqData.destNode === 'mongoDB'){
            event = `${reqData.method} ${reqData.collection}`
        }
        else{
            event = `${reqData.method} ${reqData.commandName}`
        }
        try {
            if (type === 'success') {
                response.resultCode = res.body.resultCode;
                response.resultDesc = res.body.resultMessage || res.body.developerMessage;
                await this.summary.logSummary.addSuccessBlock(reqData.destNode, event, response.resultCode, response.resultDesc);
            } else if (type === 'error') {
                response.resultCode = res.resultCode;
                response.resultDesc = res.resultMessage || res.developerMessage;
                await this.summary.logSummary.addErrorBlock(reqData.destNode, event, response.resultCode, response.resultDesc)
            }
            return
        } catch (error) {
            throw error;
        }
    }
    async logEndSummary(res) {
        let response = {
            resultCode: null,
            resultDesc: ""
        }
        try {
            response.resultDesc = res.developerMessage || res.resultDescription || res.resultMessage;
            response.resultCode = res.resultCode;
            await this.summary.logSummary.end(response.resultCode, response.resultDesc);
            return
        } catch (error) {
            throw error;
        }
    }
}