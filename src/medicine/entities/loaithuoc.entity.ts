// src/medicine/entities/loaithuoc.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ThuocEntity } from './thuoc.entity';

@Entity('loaithuoc')
export class LoaiThuocEntity {
  @PrimaryGeneratedColumn()
  maLoai: number;

  @Column({ type: 'varchar', length: 100 })
  tenLoai: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  moTa: string;

  @Column({ type: 'tinyint', default: 0 })
  isDelete: boolean;

  // Định nghĩa quan hệ ngược: Một 'LoaiThuoc' có nhiều 'Thuoc'
  @OneToMany(() => ThuocEntity, (thuoc) => thuoc.loaiThuoc)
  danhSachThuoc: ThuocEntity[];

  // ... Thêm các cột CreateAt, CreateBy...
}
