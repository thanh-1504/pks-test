import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { CourseModule } from './course/course.module';
import { MyZodValidationPipe } from './shared/configs/custom-zod-validation';
import { ExceptionsFilter } from './shared/filters/exceptions.filter';
import { ShareModule } from './shared/modules/shared.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
@Module({
  imports: [
    ShareModule,
    AuthModule,
    CourseModule,
    EnrollmentModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: MyZodValidationPipe,
    },
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
