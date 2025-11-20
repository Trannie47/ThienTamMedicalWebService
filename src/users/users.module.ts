// File: src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { NhanVienEntity } from './entities/nhanvien.entity';

// Import EmailModule mới
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    // Import repository của NhanVienEntity
    TypeOrmModule.forFeature([NhanVienEntity]),

    // Import EmailModule để cung cấp EmailService
    EmailModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],

  // Export UsersService để module khác có thể dùng
  exports: [UsersService],
})
export class UsersModule {}
