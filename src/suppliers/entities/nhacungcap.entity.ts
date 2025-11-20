import { PhieuNhapEntity } from 'src/import/entities/phieunhap.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity('nhacungcap')
export class NhaCungCapEntity {
  @PrimaryColumn({ type: 'varchar', length: 15 })
  maNhaCungCap: string;

  @Column({ type: 'varchar', length: 100 })
  TenNhaCungCap: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  SoDienThoai: string;

  @Column({ type: 'varchar', length: 200 })
  DiaChi: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tenNguoiDaiDien: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  sdtNguoiDaiDien: string;

  @Column({ type: 'tinyint', default: 0 })
  IsDelete: boolean;

  // ... Các cột CreateAt, CreateBy, UpdateAt, UpdateBy ...

  // Quan hệ: 1 Nhà cung cấp có nhiều Phiếu nhập
  @OneToMany(() => PhieuNhapEntity, (pn) => pn.nhaCungCap)
  phieuNhaps: PhieuNhapEntity[];
}
