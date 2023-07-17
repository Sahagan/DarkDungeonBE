import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Request} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { MissingParameterException } from '../exceptions/application.exception';
import { constructorService } from '../helpers/service.helper';
import { logAppHelper } from '../helpers/logger.helper';

@Injectable()
export class ValidationPipe extends constructorService implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {//get value(object dto with value from client and class dto) 
    const logApp = new logAppHelper();

    await logApp.log('validate: ' + Object.keys(value), "info");

    if (!metatype || !this.toValidate(metatype)) {//if validate success return object dto to controller
      return value;
    }
    
    const object = plainToInstance(metatype, value); //get object error dto
    
    const errors = await validate(object);// get array of error dto with detailed error where parameter is invalid
    
    if (errors.length > 0) {//validate failed
      await logApp.log('validate failed : '+errors.find(err => err).property, "error");
      throw new MissingParameterException();
    }
    await logApp.log('validate Success', "info");
    return value;//return object of dto to controller
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}