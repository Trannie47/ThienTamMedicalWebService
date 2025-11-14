// File: src/auth/strategies/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { Role } from 'src/users/enums/role.enum';

// Định nghĩa cấu trúc payload của JWT
interface JwtPayload {
  id: string;
  userId: string;
  username: string;
  role: Role;
  mustChangePassword: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService, // Inject ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!, // <-- dấu ! ép kiểu
    });
  }

  /**
   * Passport gọi hàm này sau khi xác thực token thành công
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: JwtPayload) {
    // Object trả về từ đây sẽ được gán vào request.user
    // trong TẤT CẢ các API dùng AuthGuard('jwt')
    return {
      id: payload.id,
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
      mustChangePassword: payload.mustChangePassword,
    };
  }
}
