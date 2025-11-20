/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, UseGuards, Req, Get,Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MustChangePasswordGuard } from './guards/must-change-password.guard';
import { AuthService } from './auth.service';
import { Request as ExpressRequest } from 'express';
import { NhanVienEntity } from 'src/users/entities/nhanvien.entity';
import { User } from '../users/interfaces/user.interface';

export class LoginDto {
  maNV: string;
  matKhau: string;
}

export class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

interface JwtUser {
  id: string;
  username: string;
  mustChangePassword?: boolean;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(
    @Req() req: ExpressRequest & { user: NhanVienEntity },
    @Body() _loginDto: LoginDto,
  ): { access_token: string } {
    return this.authService.login(req.user);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'), MustChangePasswordGuard)
  async changePassword(
    @Body() changePassDto: ChangePasswordDto,
    @Req() req: ExpressRequest & { user: JwtUser },
  ): Promise<{ success: boolean; message: string }> {
    const userId = req.user.id;
    await this.authService.changeFirstPassword(userId, changePassDto);
    return { success: true, message: 'Đổi mật khẩu thành công.' };
  }

  @Get('nhanvien/:id')
  @UseGuards(AuthGuard('jwt'))
  async getNhanVienByID(
    @Param('id') id: string,
    @Req() req: ExpressRequest & { user: User },
  ): Promise<{ success: boolean; data: any }> {
    const user = await this.authService.getNhanVienByID(id);

    return {
      success: true,
      data: user,
    };
  }

}
