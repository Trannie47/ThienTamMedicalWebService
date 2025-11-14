// src/medicine/medicine.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThuocEntity } from './entities/thuoc.entity';
import { LoaiThuocEntity } from './entities/loaithuoc.entity';

@Injectable()
export class MedicineService {
  constructor(
    @InjectRepository(ThuocEntity)
    private readonly thuocRepo: Repository<ThuocEntity>,

    @InjectRepository(LoaiThuocEntity)
    private readonly loaiThuocRepo: Repository<LoaiThuocEntity>,
  ) {}

  // Lấy tất cả thuốc (kèm theo loại thuốc)
  async findAllThuoc() {
    return this.thuocRepo.find({
      relations: {
        loaiThuoc: true, // Tự động JOIN với bảng loaithuoc
      },
    });
  }

  // Lấy một thuốc bằng ID
  async findOneThuoc(maThuoc: string) {
    return this.thuocRepo.findOne({
      where: { maThuoc },
      relations: ['loaiThuoc', 'danhSachSoLo'], // JOIN với cả loại thuốc và số lô
    });
  }

  // ... Thêm các hàm create, update, delete
}
