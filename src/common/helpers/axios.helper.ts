import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import * as https from 'https';
import { ConnectionErrorException, ConnectionTimeoutException, SystemErrorException } from '../exceptions/application.exception';

@Injectable()
export class axiosHelper {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async connection(option) {
    Object.assign(option, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: this.configService.get('axiosSetting.rejectUnauthorized')
      }),
      timeout: this.configService.get('axiosSetting.timeout'),
      maxRedirects: this.configService.get('axiosSetting.maxRedirects')
    })

    try {
      const result = await this.httpService.axiosRef.request(option)     
      return result;
    }
    catch (error) {
      if (error.code) {
        if (error.response) {
          return error.response
        }
        let message = this.handleNoneBusinessError(error.code)
        throw message
      }
      else {
        throw new SystemErrorException();
      }
    }
  }

  private handleNoneBusinessError(code: any) {
    switch (code) {
      case "ECONNREFUSED":
        return new ConnectionErrorException()
      case "ECONNABORTED":
        return new SystemErrorException()
      case "ETIMEOUT":
        return new ConnectionTimeoutException()
      case "ESOCKETTIMEDOUT":
        return new ConnectionTimeoutException()
      default:
        return new SystemErrorException()
    }
  }
}