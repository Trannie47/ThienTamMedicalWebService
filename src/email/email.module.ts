// File: src/mailer/email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    // Nest MailerModule với cấu hình SMTP
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('MAIL_USER')}>`,
        },
        template: {
          dir: __dirname + '/templates', // thư mục chứa Pug templates
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService], // export để các module khác (ví dụ UsersModule) dùng được
})
export class EmailModule {}
