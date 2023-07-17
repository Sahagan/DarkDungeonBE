/*------------------ Nest common ------------------*/
import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule ,ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

/*------------------ App common ------------------*/
import configuration from './common/configs/configuration';
import { logStatHelper } from './common/helpers/logger.helper';
import { axiosHelper } from './common/helpers/axios.helper';
import { utilityHelper } from './common/helpers/utility.helper';
import { entryPointMiddleware } from './common/middleware/entrypoint.middleware';
import { HttpExceptionFilter } from './common/filters/exception.filter';

/*------------------ App module ------------------*/
import { PlayerModule } from './player/player.module';
import { ValidationPipe } from './common/pipes/validation.pipe';

@Global()
@Module({
  imports: [
    HttpModule.register({}),
    ConfigModule.forRoot(
      {
        load: [configuration],
        isGlobal: true,
        ignoreEnvFile: true
      }
    ),
    MongooseModule.forRootAsync({//connect DB using uri from configfile
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        let uri;
        const url = config.get('db.mongo.host');
        const replicaName = config.get('db.mongo.replicaName');
        if(config.get('db.mongo.SRV') == true){
          uri = `mongodb+srv://${encodeURIComponent(config.get('db.mongo.username'))}:${encodeURIComponent(config.get('db.mongo.password'))}@${config.get('db.mongo.digitalCo.host')}/${config.get('db.mongo.dbname')}`
          
        }else{
          if(replicaName !== undefined){
            uri = 'mongodb://'+url+'/'+config.get('db.mongo.dbname')+'?replicaSet='+replicaName;
          }else{
            uri = 'mongodb://'+url+'/'+config.get('db.mongo.dbname')
          }
        }
        process.env.mongoUrl = uri;
        return {
          uri: uri
        }
      },
    }),
    PlayerModule
  ],
  providers: [
    axiosHelper,
    logStatHelper,
    utilityHelper,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    ValidationPipe
  ],
  exports: [axiosHelper, logStatHelper,utilityHelper,ValidationPipe]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(entryPointMiddleware).forRoutes('*');
  }
}

