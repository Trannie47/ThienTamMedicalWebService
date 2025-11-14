import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

// interface type-safe cho user từ JWT
interface JwtUser {
  userId: string;
  username: string;
  role: Role; // enum Role
  // thêm các field khác nếu cần
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy roles được gán bằng decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      // Nếu không có @Roles() -> cho qua
      return true;
    }

    // Lấy request và ép kiểu type-safe
    const request = context.switchToHttp().getRequest<{ user: JwtUser }>();
    const user = request.user;

    if (!user || !user.role) {
      // Không có user hoặc role -> không cho phép
      return false;
    }

    // Kiểm tra xem role của user có nằm trong requiredRoles không
    return requiredRoles.includes(user.role);
  }
}
