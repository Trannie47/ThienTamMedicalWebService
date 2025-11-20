import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { KhachHangEntity } from 'src/customers/entities/khachhang.entity';
import { NhanVienEntity } from 'src/users/entities/nhanvien.entity';
import { ChiTietPhieuXuatEntity } from './chitietphieuxuat.entity';

@Entity('phieuxuat')
export class PhieuXuatEntity {
  @PrimaryColumn({ type: 'varchar', length: 13 })
  maPhieuXuat: string;

  @Column({ type: 'varchar', length: 10 })
  ngayXuat: string;

  @Column({ type: 'int' })
  trangThai: number;

  // === Cột chứa Foreign Key ===
  @Column({ type: 'varchar', length: 11 })
  sdtKH: string;

  @Column({ type: 'varchar', length: 11 })
  maNV: string;

  // === Định nghĩa Quan hệ ===

  // Quan hệ: Nhiều 'Phiếu Xuất' thuộc về 1 'Khách Hàng'
  @ManyToOne(() => KhachHangEntity, (kh) => kh.phieuXuats)
  @JoinColumn({ name: 'sdtKH' })
  khachHang: KhachHangEntity;

  // Quan hệ: Nhiều 'Phiếu Xuất' được lập bởi 1 'Nhân Viên'
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => NhanVienEntity, (nv) => nv.phieuXuats)
  @JoinColumn({ name: 'maNV' })
  nhanVien: NhanVienEntity;

  // Quan hệ: 1 'Phiếu Xuất' có nhiều 'Chi Tiết Phiếu Xuất'
  @OneToMany(() => ChiTietPhieuXuatEntity, (ctpx) => ctpx.phieuXuat)
  chiTietPhieuXuats: ChiTietPhieuXuatEntity[];
}
