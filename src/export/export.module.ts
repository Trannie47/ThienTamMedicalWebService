// File: src/export/export.module.ts

import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- 1. IMPORT
import { PhieuXuatEntity } from './entities/phieuxuat.entity'; // <-- 2. IMPORT ENTITY

@Module({
  imports: [
    // 3. THÊM DÒNG NÀY ĐỂ SỬA LỖI
    // Nó sẽ cung cấp "PhieuXuatEntityRepository"
    TypeOrmModule.forFeature([PhieuXuatEntity]),
  ],
  providers: [ExportService],
  controllers: [ExportController],
})
export class ExportModule {}
