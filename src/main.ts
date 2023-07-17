import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PlayerModule } from './player/player.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule); // (AppModule,{ cors: true ,logger:false}); disable Nest log app 
  const configService = app.get<ConfigService>(ConfigService);
  const options = new DocumentBuilder()
    .setTitle(configService.get<string>('app.name'))
    .setDescription(configService.get<string>('app.description'))
    .setVersion(configService.get<string>('app.version'))
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [PlayerModule],
  });
  SwaggerModule.setup(configService.get<string>('app.pathSwagger'), app, document);

  app.enableCors({
    origin: configService.get<any>('corsSetting.origin'),
    methods : configService.get<any>('corsSetting.method'),
    credentials : configService.get<any>('corsSetting.credentail'),
    allowedHeaders: configService.get<any>('corsSetting.allowedHeaders'),
  });
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.listen(configService.get<number>('app.port'));

}
bootstrap();
