import { Controller, Req, Res,Query, Get, Post, Body, Headers,Patch, Param, Delete, UseInterceptors, Put } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { ExpectaionFailedException,SuccessException } from 'src/common/exceptions/application.exception';
import { detailHelper, logAppHelper, logStatHelper, summaryHelper } from 'src/common/helpers/logger.helper';
import { utilityHelper } from 'src/common/helpers/utility.helper';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { PlayerService } from './player.service';
import { BodyPlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ResponseModel } from 'src/interface/response.model';

@Controller('/api/v1/dungeon')
export class PlayerController {
  commandName:string;
  appName:string= this.config.get('app.name');
  statApp:any = this.config.get('logger.statPattern')
  constructor(
    private readonly config: ConfigService, 
    private readonly logStat: logStatHelper,
    private readonly utility: utilityHelper,
    private readonly playerService: PlayerService,
    private readonly validate: ValidationPipe,
    ) {}

  @Post('/username')
  async InitializePlayer(@Req() req,@Res() res,@Body()body:BodyPlayerDto){
    this.commandName = 'initializePlayer';
    let identity;
    const Invoke = this.utility.setValueInitInvoke(req);
    const Summary = new summaryHelper();
    const logApp = new logAppHelper();
    const logDetail = new detailHelper();
    let condition;
    let result;
    try{
      identity =  this.utility.CheckIdentity(req,body.playerName);
      await Summary.logSummaryInit(req,this.commandName,identity);//init Summary
      await logDetail.logInputRequestDetail(this.appName,this.commandName,req,Invoke,identity);//init Detail
      if(!req.headers["content-type"] || req.headers["content-type"] !== 'application/json' && req.headers["content-type"] !== 'application/json; charset=utf-8'){
        //init logger
        await logApp.log('Client ---> darkdungeonBE : Invalid content-type!', "info");
        await this.logStat.logStatApp(this.statApp.requestMissingOrInvalid,this.commandName, 'unknown', this.statApp.type.received, req.method, 'error', this.statApp.action.req,'');
        throw new ExpectaionFailedException();
      }
      //validation
      const keyBody:ArgumentMetadata = {
        type: 'body',
        metatype: BodyPlayerDto
      };
      await logApp.log("body : "+JSON.stringify(body), "info");
      await this.validate.transform(body,keyBody); //validate body
      await this.logStat.logStatApp(this.statApp.receivedRequest,this.commandName, 'unknown', this.statApp.type.received, req.method, 'success', this.statApp.action.req,'');
      
      //generate DateNow format YYYYMMDDHHmmss
      let date = new Date();
      let formattedDate = `${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}${('0' + date.getDate()).slice(-2)}${('0' + date.getHours()).slice(-2)}${('0' + date.getMinutes()).slice(-2)}${('0' + date.getSeconds()).slice(-2)}`;
      

      condition ={
        "playerName" : body.playerName,
        "createdDate" : formattedDate
      };
      result = await this.playerService.createByCondtion('player',condition,'cm_initializePlayer',logApp,logDetail,Summary);
      
      const message = new ResponseModel(new SuccessException());
      await logDetail.logOutputResponseDetail(this.commandName,res,message); 
      await logApp.log('darkdungeonBE --> client :' + JSON.stringify(message), "info");
      await this.logStat.logStatApp(this.statApp.returnedSuccess,this.commandName, 'unknown', this.statApp.type.returned, req.method, 'success', this.statApp.action.res, '20000');
      await Summary.logEndSummary(message);
      res.status(200);
      res.json(message);
    }catch(err){ 
      await logApp.log('an error occurred : '+err, "error"); 
      if(err.response){
        await Summary.logEndSummary(err.response);
        await logDetail.logOutputResponseDetail(this.commandName,res,err.response);
        await this.logStat.logStatApp(this.statApp.returnedError,this.commandName, 'unknown', this.statApp.type.returned, req.method, 'error', this.statApp.action.res, err.response.resultCode);
        throw err;
      }else{
        err = new ResponseModel(new ExpectaionFailedException());
        await Summary.logEndSummary(err);
        await logDetail.logOutputResponseDetail(this.commandName,res,err);
        await this.logStat.logStatApp(this.statApp.returnedError,this.commandName, 'unknown', this.statApp.type.returned, req.method, 'error', this.statApp.action.res, err.resultCode);
        throw err;
      }
    }
  }
}

