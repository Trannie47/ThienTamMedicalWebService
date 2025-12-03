// File: src/auth/auth.service.ts

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './auth.controller';
import { User } from '../users/interfaces/user.interface';
import { NhanVienEntity } from 'src/users/entities/nhanvien.entity'; // <-- Import Entity

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * (ĐÃ SỬA)
   * Validate credentials (used by LocalStrategy)
   */
  async validateUser(
    maNV: string,
    matKhau: string,
  ): Promise<NhanVienEntity | null> {
    const user = await this.usersService.findForAuth(maNV);

    if (!user || !user.matKhau) return null;

    const isMatch = await bcrypt.compare(matKhau, user.matKhau);
    if (!isMatch) return null;
    delete user.matKhau;
    return user;
  }

  /**
   * (ĐÃ SỬA)
   * Create JWT for authenticated user
   * 'user' ở đây là NhanVienEntity từ hàm validateUser
   */
  login(user: NhanVienEntity): { access_token: string } {
    const payload = {
      id: user.maNV,
      userId: user.maNV,
      username: user.tenNhanVien,
      role: user.PhongBan,
      mustChangePassword: user.mustChangePassword,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  /**
   * (Hàm cũ - Giữ nguyên)
   * Hàm này dùng findById là ĐÚNG, vì nó không cần kiểm tra mật khẩu cũ
   */
  async changeFirstPassword(
    userId: string,
    changePassDto: ChangePasswordDto,
  ): Promise<void> {
    // Dùng findById (bản an toàn, không có mật khẩu)
    const user = await this.usersService.findById(userId);

    if (!user) throw new NotFoundException('User không tồn tại');
    if (!user.mustChangePassword)
      throw new BadRequestException('Người dùng không cần đổi mật khẩu');

    const hashedPassword = await bcrypt.hash(
      changePassDto.newPassword,
      SALT_ROUNDS,
    );
    await this.usersService.update(userId, {
      matKhau: hashedPassword,
      mustChangePassword: false,
    });
  }

  async getNhanVienByID(id: string): Promise<User> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy nhân viên');
    }

    return user;
  }
}
