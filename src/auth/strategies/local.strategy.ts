/* eslint-disable @typescript-eslint/no-unsafe-call */
// File: src/auth/strategies/local.strategy.ts

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { NhanVienEntity } from 'src/users/entities/nhanvien.entity';

//sinh ra khoas token
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'maNV',
      passwordField: 'matKhau',
    });
  }

  /**
   * Passport sẽ tự động gọi hàm này với maNV và matKhau từ body
   */
  async validate(maNV: string, matKhau: string): Promise<NhanVienEntity> {
    const user = await this.authService.validateUser(maNV, matKhau);

    if (!user) {
      throw new UnauthorizedException('Mã nhân viên hoặc mật khẩu không đúng');
    }

    // Object trả về từ đây sẽ được gán vào request.user
    return user;
  }
}
