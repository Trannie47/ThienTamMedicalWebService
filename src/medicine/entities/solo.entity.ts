import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ThuocEntity } from './thuoc.entity';
import { ChiTietPhieuNhapEntity } from 'src/import/entities/chitietphieunhap.entity';
import { ChiTietPhieuXuatEntity } from 'src/export/entities/chitietphieuxuat.entity';

@Entity('solo')
export class SoloEntity {
  // Composite Primary Key
  @PrimaryColumn({ type: 'varchar', length: 13 })
  maLo: string;

  @PrimaryColumn({ type: 'varchar', length: 48 })
  maThuoc: string;

  @Column({ type: 'int' })
  SoLuong: number; // Số lượng tồn của lô này

  @Column({ type: 'double', nullable: true })
  DonGiaNhap: number;

  @Column({ type: 'double', nullable: true })
  DonGiaBan: number;

  @Column({ type: 'int' })
  HSD: number; // Hạn sử dụng (số tháng?)

  @Column({ type: 'varchar', length: 10 })
  NgayNhap: string;

  // Quan hệ: Nhiều 'Số Lô' thuộc về 1 'Thuốc'
  @ManyToOne(() => ThuocEntity, (thuoc) => thuoc.danhSachSoLo)
  @JoinColumn({ name: 'maThuoc' })
  thuoc: ThuocEntity;

  // Quan hệ: 1 Lô thuốc có trong nhiều Chi tiết phiếu nhập
  @OneToMany(() => ChiTietPhieuNhapEntity, (ctpn) => ctpn.soLo)
  chiTietPhieuNhaps: ChiTietPhieuNhapEntity[];

  // Quan hệ: 1 Lô thuốc có trong nhiều Chi tiết phiếu xuất
  @OneToMany(() => ChiTietPhieuXuatEntity, (ctpx) => ctpx.soLo)
  chiTietPhieuXuats: ChiTietPhieuXuatEntity[];
}
