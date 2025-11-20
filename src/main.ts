// File: src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'; // <-- 1. Import ConfigService
import { Logger } from '@nestjs/common'; // <-- 2. Import Logger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 3. Khởi tạo Logger
  const logger = new Logger('Bootstrap'); 

  // 4. Lấy ConfigService (vì nó là global từ AppModule)
  const configService = app.get(ConfigService);

  // 5. Lấy port (giữ nguyên logic của bạn, mặc định là 3000)
  const port = configService.get<number>('PORT') || 3000;

  // 6. Chạy app
  await app.listen(port);

  // 7. Log ra cổng đang chạy
  logger.log(`🚀 Ứng dụng đang chạy trên cổng (port): ${port}`);
  logger.log(`🚀 URL truy cập: http://localhost:${port}`);
}
bootstrap();