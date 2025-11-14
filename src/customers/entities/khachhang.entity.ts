import { PhieuXuatEntity } from 'src/export/entities/phieuxuat.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity('khachhang')
export class KhachHangEntity {
  @PrimaryColumn({ type: 'varchar', length: 11 })
  sdtKhachHang: string;

  @Column({ type: 'varchar', length: 50 })
  TenKH: string;

  @Column({ type: 'varchar', length: 200 })
  DiaChiKH: string;

  @Column({ type: 'varchar', length: 200 })
  'Ghi chu': string; // Lưu ý cột có dấu cách

  @Column({ type: 'tinyint', default: 0 })
  isDELETED: boolean;

  // ... Các cột CreateAt, CreateBy, UpdateAt, UpdateBy ...

  // Quan hệ: 1 Khách hàng có nhiều Phiếu xuất
  @OneToMany(() => PhieuXuatEntity, (px) => px.khachHang)
  phieuXuats: PhieuXuatEntity[];
}
