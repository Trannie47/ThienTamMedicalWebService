/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { NhaCungCapEntity } from 'src/suppliers/entities/nhacungcap.entity';
import { NhanVienEntity } from 'src/users/entities/nhanvien.entity';
import { ChiTietPhieuNhapEntity } from './chitietphieunhap.entity';

@Entity('phieunhap')
export class PhieuNhapEntity {
  @PrimaryColumn({ type: 'varchar', length: 13 })
  maPhieuNhap: string;

  @Column({ type: 'varchar', length: 10 })
  ngayNhap: string;

  @Column({ type: 'int', default: 1 })
  trangThai: number;

  // === Cột chứa Foreign Key ===
  @Column({ type: 'varchar', length: 15 })
  maNhaCungCap: string;

  @Column({ type: 'varchar', length: 12 }) // Trong CSDL là 12, NhanVien là 11? Cần xem lại
  maNhanVien: string;

  // === Định nghĩa Quan hệ ===

  // Quan hệ: Nhiều 'Phiếu Nhập' thuộc về 1 'Nhà Cung Cấp'
  @ManyToOne(() => NhaCungCapEntity, (ncc) => ncc.phieuNhaps)
  @JoinColumn({ name: 'maNhaCungCap' })
  nhaCungCap: NhaCungCapEntity;

  // Quan hệ: Nhiều 'Phiếu Nhập' được lập bởi 1 'Nhân Viên'
  @ManyToOne(() => NhanVienEntity, (nv) => nv.phieuNhaps)
  @JoinColumn({ name: 'maNhanVien' })
  nhanVien: NhanVienEntity;

  // Quan hệ: 1 'Phiếu Nhập' có nhiều 'Chi Tiết Phiếu Nhập'
  @OneToMany(() => ChiTietPhieuNhapEntity, (ctpn) => ctpn.phieuNhap)
  chiTietPhieuNhaps: ChiTietPhieuNhapEntity[];

  // ... Các cột CreateAt, CreateBy, UpdateAt, UpdateBy ...
}
