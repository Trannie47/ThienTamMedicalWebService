import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PhieuNhapEntity } from './phieunhap.entity';
import { ThuocEntity } from 'src/medicine/entities/thuoc.entity';
import { SoloEntity } from 'src/medicine/entities/solo.entity';

@Entity('chitietphieunhap')
export class ChiTietPhieuNhapEntity {
  // Composite Primary Key
  @PrimaryColumn({ type: 'varchar', length: 13 })
  maPhieuNhap: string;

  @PrimaryColumn({ type: 'varchar', length: 3, default: '001' })
  maChiTietPhieuNhap: string;

  @Column({ type: 'int' })
  SoLuong: number;

  @Column({ type: 'float' })
  DonGiaNhap: number;

  // === Cột chứa Foreign Key ===
  @Column({ type: 'varchar', length: 48 })
  maThuoc: string;

  @Column({ type: 'varchar', length: 13, nullable: true })
  maSoLo: string;

  // === Định nghĩa Quan hệ ===

  // Quan hệ: Nhiều 'Chi Tiết' thuộc về 1 'Phiếu Nhập'
  @ManyToOne(() => PhieuNhapEntity, (pn) => pn.chiTietPhieuNhaps)
  @JoinColumn({ name: 'maPhieuNhap' })
  phieuNhap: PhieuNhapEntity;

  // Quan hệ: Nhiều 'Chi Tiết' thuộc về 1 'Thuốc'
  @ManyToOne(() => ThuocEntity)
  @JoinColumn({ name: 'maThuoc' })
  thuoc: ThuocEntity;

  // Quan hệ: Nhiều 'Chi Tiết' thuộc về 1 'Số Lô' (Composite FK)
  @ManyToOne(() => SoloEntity, (sl) => sl.chiTietPhieuNhaps)
  @JoinColumn([
    { name: 'maSoLo', referencedColumnName: 'maLo' },
    { name: 'maThuoc', referencedColumnName: 'maThuoc' },
  ])
  soLo: SoloEntity;

  // ... Các cột CreateAt, CreateBy, UpdateAt, UpdateBy ...
}
