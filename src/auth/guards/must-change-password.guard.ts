import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

interface JwtUser {
  userId: string;
  username: string;
  mustChangePassword?: boolean;
}

@Injectable()
export class MustChangePasswordGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Ép kiểu request + user type-safe
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtUser }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }

    const allowedPath: string = '/auth/change-password';
    const actualPath: string = request.path;

    if (user.mustChangePassword) {
      if (actualPath === allowedPath) {
        return true;
      }
      throw new ForbiddenException('Bạn phải đổi mật khẩu trước khi tiếp tục.');
    }

    return true;
  }
}
