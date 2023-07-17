import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { logStatHelper } from "./logger.helper";
import { utilityHelper } from "./utility.helper";
@Injectable()
export class constructorService {
    commandName: any
    constructor(
        public readonly utility: utilityHelper,
        public readonly configService: ConfigService,
        public readonly logStat: logStatHelper
    ) {}
    appname: any = this.configService.get('app.name');
    statApp: any = this.configService.get('logger.statPattern');
}
