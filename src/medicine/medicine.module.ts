// src/medicine/medicine.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicineController } from './medicine.controller';
import { MedicineService } from './medicine.service';
import { ThuocEntity } from './entities/thuoc.entity';
import { LoaiThuocEntity } from './entities/loaithuoc.entity';
import { SoloEntity } from './entities/solo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ThuocEntity, LoaiThuocEntity, SoloEntity]),
  ],
  controllers: [MedicineController],
  providers: [MedicineService],
})
export class MedicineModule {}
