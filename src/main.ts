import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { RetryInterceptor } from './common/interceptors/retry.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // Global error handling
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // Global interceptors for resilience
  app.useGlobalInterceptors(new RetryInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());

  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  
  app.setGlobalPrefix('api/v1');
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Clever Sermon API running on http://localhost:${port}`);
  console.log(`✅ Global error handling enabled`);
  console.log(`✅ Retry mechanism enabled (max 3 attempts)`);
  console.log(`✅ Timeout protection enabled (30s default, 2min for LLM)`);
}

bootstrap();
