// src/medicine/entities/thuoc.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { LoaiThuocEntity } from './loaithuoc.entity';
import { SoloEntity } from './solo.entity';
import { ChiTietPhieuNhapEntity } from 'src/import/entities/chitietphieunhap.entity';

@Entity('thuoc')
export class ThuocEntity {
  @PrimaryColumn({ type: 'varchar', length: 48 })
  maThuoc: string;

  @Column({ type: 'varchar', length: 100 })
  tenThuoc: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  moTa: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thanhPhan: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  congDung: string;

  @Column({ type: 'varchar', length: 500 })
  tacDungPhu: string;

  @Column({ type: 'varchar', length: 500 })
  baoQuan: string;

  @Column({ type: 'tinyint', default: 0 })
  chiDinhBacSi: boolean;

  @Column({ type: 'double', default: 0 })
  giaBan: number;

  @Column({ type: 'int' })
  maLoai: number;

  // Định nghĩa quan hệ: Nhiều 'Thuoc' thuộc về một 'LoaiThuoc'
  @ManyToOne(() => LoaiThuocEntity, (loai) => loai.danhSachThuoc)
  @JoinColumn({ name: 'maLoai' }) // Tên cột khoá ngoại trong bảng 'thuoc'
  loaiThuoc: LoaiThuocEntity;

  // Định nghĩa quan hệ: Một 'Thuoc' có nhiều 'Solo'
  @OneToMany(() => SoloEntity, (solo) => solo.thuoc)
  danhSachSoLo: SoloEntity[];

  // Quan hệ với chi tiết phiếu nhập
  @OneToMany(() => ChiTietPhieuNhapEntity, (ctpn) => ctpn.thuoc)
  chiTietPhieuNhaps: ChiTietPhieuNhapEntity[];

  // ... Thêm các cột CreateAt, CreateBy...
}
