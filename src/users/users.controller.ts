import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport'; // Giả sử dùng 'jwt'
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin/create-account')
  @Roles(Role.ADMIN)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  createAccount(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createAccountByAdmin(createUserDto);
  }

  // ... (các API khác)
}
