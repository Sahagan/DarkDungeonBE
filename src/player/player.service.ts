import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { utilityHelper } from 'src/common/helpers/utility.helper';
import * as https from 'https';
import { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { axiosHelper } from 'src/common/helpers/axios.helper';

/*----------------------- Database -----------------------*/
import { Model } from 'mongoose';

import { playerInterface } from './database/interface/player.interface';
import { DataNotFoundException, DatabaseErrorException, ExpectaionFailedException } from 'src/common/exceptions/application.exception';
import { logStatHelper } from 'src/common/helpers/logger.helper';

@Injectable()
export class PlayerService {
  statApp = this.configService.get('logger.statPattern');
  defaultLog = this.configService.get('defaultLog');
  fieldOption:any;
  model:any
  constructor(
    // private readonly httpService: HttpService,
    @InjectModel('player') private playerModel: Model<playerInterface>,
    private readonly configService: ConfigService,
    private readonly utility: utilityHelper,
    private readonly logStat: logStatHelper
  ) {}
  
  async createByCondtion(collection,condition,commandName,logApp,logDetail,Summary){
    const nodeName = 'mongoDB';
    const method = 'POST';
    const initInvoke = this.utility.setInvokeDestNode();
    let LoggerData: any;
    try{
      LoggerData = {
        method: method,
        destNode: nodeName,
        collection: commandName,
        url: process.env.mongoUrl,
        condition: condition,
        value: `${collection}.insert(${JSON.stringify(condition)})`
      }
      await logDetail.logAddOutputRequestDetail(LoggerData,initInvoke);
      await logApp.log('insert table('+collection+')' + JSON.stringify({
        condition : condition
      }), "info")
      await this.logStat.logStatApp(this.statApp.suc,commandName, nodeName, this.statApp.type.send, method, 'success', this.statApp.action.req,'')
      switch(collection){
        case 'player':
          this.model = this.playerModel;
          break;
        default:
          throw new ExpectaionFailedException();
      }
      const result = await this.model.insertMany([condition]);
      
      LoggerData.result = result;
      await logApp.log(nodeName+'--> darkdungeonBE : ' + JSON.stringify(result), "info");
      await logDetail.logAddInputResponseDetail( LoggerData, initInvoke);
      await Summary.logAddBlockSummary(LoggerData,"success", {body: {resultCode: "20000",developerMessage: 'Success'}});
      await this.logStat.logStatApp(this.statApp.suc,commandName, nodeName, this.statApp.type.recv, method, 'success', this.statApp.action.res, '20000')
      
      return result;
    }catch(error){
      let resultCode = error.response.resultCode;
      let developerMessage = error.response.developerMessage;
      await logApp.log(nodeName+'--> darkdungeonBE : ' + JSON.stringify(error), "error")
      if(resultCode){
        await logDetail.logAddInputResponseDetail(LoggerData, initInvoke)
      }else{
        await logDetail.logAddInputResponseErrorDetail(LoggerData, initInvoke)
      }
      await Summary.logAddBlockSummary(LoggerData, "error",  {resultCode,developerMessage})
      if(resultCode === '50002'){
        await this.logStat.logStatApp(this.statApp.timeoutConnection,LoggerData.collection,LoggerData.destNode, this.statApp.type.recv, LoggerData.method, 'error', this.statApp.action.res, resultCode)
        throw error;
      }else if(resultCode === '50003'){
        await this.logStat.logStatApp(this.statApp.errConnection,LoggerData.collection,LoggerData.destNode, this.statApp.type.recv, LoggerData.method, 'error', this.statApp.action.res, resultCode)
        throw error;
      }else{
        await this.logStat.logStatApp(this.statApp.err,LoggerData.collection,LoggerData.destNode, this.statApp.type.recv, LoggerData.method, 'error', this.statApp.action.res, '50001')
        throw new DatabaseErrorException();
      }        
    }
  }

  async updateByCondtion(collection,condition,commandName,logApp,logDetail,Summary,option?){
    const nodeName = 'mongoDB';
    const method = 'PUT';
    const initInvoke = this.utility.setInvokeDestNode();
    let LoggerData: any;
    try{
      LoggerData = {
        method: method,
        destNode: nodeName,
        collection: commandName,
        url: process.env.mongoUrl,
        condition: condition,
        value: `${collection}.updateOne(${JSON.stringify(condition)},${JSON.stringify(option)})`
      }
      await logDetail.logAddOutputRequestDetail(LoggerData,initInvoke);
      await logApp.log('update table('+collection+')' + JSON.stringify({
        condition : condition
      }), "info")
      await this.logStat.logStatApp(this.statApp.suc,commandName, nodeName, this.statApp.type.send, method, 'success', this.statApp.action.req,'')
      switch(collection){
        case 'player':
          this.model = this.playerModel;
          break;
        default:
          throw new ExpectaionFailedException();
      }
      const result = await this.model.updateOne(condition,option);
      LoggerData.result = result;
      if(result.modifiedCount == 0){
        throw  new DataNotFoundException();
      };
      await logApp.log(nodeName+'--> darkdungeonBE : ' + JSON.stringify(result), "info");
      await logDetail.logAddInputResponseDetail( LoggerData, initInvoke);
      await Summary.logAddBlockSummary(LoggerData,"success", {body: {resultCode: "20000",developerMessage: 'Success'}});
      await this.logStat.logStatApp(this.statApp.suc,commandName, nodeName, this.statApp.type.recv, method, 'success', this.statApp.action.res, '20000')
      
      return result;
    }catch(error){
      let resultCode = error.response.resultCode;
      let developerMessage = error.response.developerMessage;
      await logApp.log(nodeName+'--> darkdungeonBE : ' + JSON.stringify(error), "error")
      if(resultCode){
        await logDetail.logAddInputResponseDetail(LoggerData, initInvoke)
      }else{
        await logDetail.logAddInputResponseErrorDetail(LoggerData, initInvoke)
      }
      await Summary.logAddBlockSummary(LoggerData, "error",  {resultCode,developerMessage})
      if(resultCode === '50002'){
        await this.logStat.logStatApp(this.statApp.timeoutConnection,LoggerData.collection,LoggerData.destNode, this.statApp.type.recv, LoggerData.method, 'error', this.statApp.action.res, resultCode)
        throw error;
      }else if(resultCode === '50003'){
        await this.logStat.logStatApp(this.statApp.errConnection,LoggerData.collection,LoggerData.destNode, this.statApp.type.recv, LoggerData.method, 'error', this.statApp.action.res, resultCode)
        throw error;
      }else if(resultCode ==='40401'){
        await this.logStat.logStatApp(this.statApp.err,LoggerData.collection,LoggerData.destNode, this.statApp.type.recv, LoggerData.method, 'error', this.statApp.action.res, resultCode)
        throw error;
      }else{
        await this.logStat.logStatApp(this.statApp.err,LoggerData.collection,LoggerData.destNode, this.statApp.type.recv, LoggerData.method, 'error', this.statApp.action.res, '50001')
        throw new DatabaseErrorException();
      }        
    }
  }
}
