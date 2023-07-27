import { Controller, Get, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { detailHelper, logAppHelper, logStatHelper, summaryHelper } from 'src/common/helpers/logger.helper';
import { utilityHelper } from 'src/common/helpers/utility.helper';
import { MapService } from './map.service';
import { ResponseModel } from 'src/interface/response.model';
import { ExpectaionFailedException, SuccessException } from 'src/common/exceptions/application.exception';

@Controller('/api/v1/dungeon')
export class MapController {
    commandName: string;
    appName: string = this.config.get('app.name');
    statApp: any = this.config.get('logger.statPattern')
    constructor(
        private readonly config: ConfigService,
        private readonly logStat: logStatHelper,
        private readonly mapService: MapService,
        private readonly utility: utilityHelper
    ) { }
    @Get('/map')
    async GetMap(@Req() req, @Res() res) {
        this.commandName = 'GetDungeonMap';
        let identity;
        const Invoke = this.utility.setValueInitInvoke(req);
        const Summary = new summaryHelper();
        const logApp = new logAppHelper();
        const logDetail = new detailHelper();
        try {
            identity = this.utility.CheckIdentity(req, req['TID']);
            await Summary.logSummaryInit(req, this.commandName, identity);//init Summary
            await logDetail.logInputRequestDetail(this.appName, this.commandName, req, Invoke, identity);//init Detail
            await this.logStat.logStatApp(this.statApp.receivedRequest, this.commandName, 'unknown', this.statApp.type.received, req.method, 'success', this.statApp.action.req, '');

            //generate event
            let dungeonMap = await this.utility.generateDungeon();
            
            const message = new ResponseModel(new SuccessException(),Buffer.from(dungeonMap).toString('base64'));
            await logDetail.logOutputResponseDetail(this.commandName, res, message);
            await logApp.log('darkdungeonBE --> client :' + JSON.stringify(message), "info");
            await this.logStat.logStatApp(this.statApp.returnedSuccess, this.commandName, 'unknown', this.statApp.type.returned, req.method, 'success', this.statApp.action.res, '20000');
            await Summary.logEndSummary(message);
            res.status(200);
            res.json(message);
        } catch (err) {
            await logApp.log('an error occurred : ' + err, "error");
            if (err.response) {
                await Summary.logEndSummary(err.response);
                await logDetail.logOutputResponseDetail(this.commandName, res, err.response);
                await this.logStat.logStatApp(this.statApp.returnedError, this.commandName, 'unknown', this.statApp.type.returned, req.method, 'error', this.statApp.action.res, err.response.resultCode);
                throw err;
            } else {
                err = new ResponseModel(new ExpectaionFailedException());
                await Summary.logEndSummary(err);
                await logDetail.logOutputResponseDetail(this.commandName, res, err);
                await this.logStat.logStatApp(this.statApp.returnedError, this.commandName, 'unknown', this.statApp.type.returned, req.method, 'error', this.statApp.action.res, err.resultCode);
                throw err;
            }
        }
    }
}
