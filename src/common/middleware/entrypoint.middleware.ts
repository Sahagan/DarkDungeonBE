import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express'
import { logAppHelper } from '../helpers/logger.helper';
import { constructorService } from '../helpers/service.helper';

@Injectable()
export class entryPointMiddleware extends constructorService implements NestMiddleware {
    statApp: any = this.configService.get<any>('logger.statPattern')
    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        const logApp = new logAppHelper();
        //set x-tid
        if (req.headers["x-tid"]) {
            req['TID'] = req.headers["x-tid"]
            // res.setHeader('x-tid', req['TID'])
        } else {
            if (req.headers["x-transaction-id"]) {
                req['TID'] = req.headers["x-transaction-id"]
                // res.setHeader('x-tid', req['TID'])
            } else {
                const reqTID = this.utility.generateHeader()
                req['TID'] = reqTID;
                // res.setHeader('x-tid', req['TID'])
            }
        }
        //set x-rtid
        if (req.headers["x-rtid"]) {
            req['RTID'] = req.headers["x-rtid"]
            // res.setHeader('x-rtid', req['RTID'])
        } else {
            const reqRTID = this.utility.generateHeader()
            req['RTID'] = reqRTID;
            // res.setHeader('x-rtid', req['RTID'])
        }
        //set x-session-id
        if (req.headers["x-session-id"]) {
            req['SESSION'] = req.headers["x-session-id"]
            // res.setHeader('x-session-id', req['SESSION'])
        } else {
            req['SESSION'] = this.utility.generateHeader()
            // res.setHeader('x-session-id', req['SESSION'])
        }
        //set x-transaction-id
        if (req.headers["x-transaction-id"]) {
            res.setHeader('x-transaction-id', req.headers["x-transaction-id"])
        }
        //set content-type Header
        res.setHeader('content-type', 'application/json');
        logApp.log('Client --> '+this.appname+' : Set Headers Xtid,Xrtid,Xsessionid','info');
        next();
    }
}
