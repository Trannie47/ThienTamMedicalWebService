import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(
    toEmail: string,
    maNV: string,
    username: string,
    tempPass: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: toEmail,
        subject: 'Chào mừng bạn! Thông tin đăng nhập Hệ thống Kho Thuốc',
        template: './welcome',
        context: {
          username: username,
          maNV: maNV,
          password: tempPass,
        },
      });
    } catch (error) {
      console.error('Không thể gửi mail:', error);
    }
  }
}
