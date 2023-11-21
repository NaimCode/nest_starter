import { ApiKeyGuard } from './guards/api-key/api-key.guard';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { RequestMethod } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { Variables } from './variables';
async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(Variables.APP_NAME)
    .setDescription(Variables.APP_DESCRIPTION)
    .setVersion(Variables.APP_VERSION)
    .addTag(Variables.APP_TAG)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.use(helmet());

  app.setGlobalPrefix(Variables.APP_PREFIX_VERSION, {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });
  //  app.useLogger();
  app.enableCors();
  app.useGlobalGuards(new ApiKeyGuard());

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
