import { ExceptionFilter, Catch, HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import e, { Request, Response } from 'express';
import { ResponseModel } from 'src/interface/response.model';
import {  ExpectaionFailedException, UrlNotFoundException } from 'src/common/exceptions/application.exception';
import { detailHelper, logAppHelper, logStatHelper, summaryHelper } from '../helpers/logger.helper';
import { constructorService } from '../helpers/service.helper';

@Catch(HttpException)
export class HttpExceptionFilter extends constructorService implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {//HttpExceptionFilter need catch propety
    const logApp = new logAppHelper();
    const logDetail = new detailHelper();
    const Summary = new summaryHelper();
    let commandName;
    let err: any = exception.getResponse();
    let httpStatus = exception.getStatus();
    const req = host.switchToHttp().getRequest<Request>();
    const res = host.switchToHttp().getResponse<Response>();
    const Invoke = this.utility.setValueInitInvoke(req);
    host.switchToHttp().getResponse().status(httpStatus);
    if(err.error === 'Not Found'){//init logger for unknowUrl case
      
      commandName = 'unknown_url';
      err = new ResponseModel(new UrlNotFoundException());
     //this.logger.initCommandIdentity('unknown_url','unknown');
      await logApp.log('Client ---> darkdungeonBE : unknwon Url', "info");
      await logDetail.logInputRequestDetail(this.appname,commandName,req,Invoke,'unknown');//init Detail
      await Summary.logSummaryInit(req,commandName,'unknown');//init Summary
      await this.logStat.logStatApp(this.statApp.receivedUnknownUrl,commandName, 'unknown', this.statApp.type.received,'', 'success', this.statApp.action.req,'')
   // await this.stat.logStatApp(this.statApp.receivedUnknownUrl,commandName, 'unknown', this.statApp.type.received, '', 'success', this.statApp.action.req, '')

    }else if(err.statusCode === 400){
      commandName = 'unknown';
      await logApp.log('Client ---> darkdungeonBE : '+err.message,"info");
      await logDetail.logInputRequestDetail(this.appname,commandName,req,Invoke,'unknown');//init Detail
      await Summary.logSummaryInit(req,commandName,'unknown');//init Summary
      await this.logStat.logStatApp(this.statApp.requestUnknown,commandName, 'unknown', this.statApp.type.received,'', 'success', this.statApp.action.req,'')
  }
    //write log return error
    await logApp.log('darkdungeonBE ---> Client :' + JSON.stringify(err), "info");
    if(err.resultCode === '40400'){
      await logDetail.logOutputResponseDetail(commandName,res,err);
      await this.logStat.logStatApp(this.statApp.returnedunknown,'unknown_url', '', this.statApp.type.returned,'', 'error', this.statApp.action.res, err.resultCode);
      await Summary.logEndSummary(err);
    }else if(err.statusCode === 400){
      err = new ResponseModel(new ExpectaionFailedException());
      httpStatus = 417;
      await logDetail.logOutputResponseDetail(commandName,res,err);
      await this.logStat.logStatApp(this.statApp.returnUnknown, 'unknown','unknown', this.statApp.type.returned,'', 'error', this.statApp.action.res, err.resultCode);
      await Summary.logEndSummary(err);
    }
    res.status(httpStatus);
    res.json(err);
  }
}


