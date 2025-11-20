import { PhieuNhapEntity } from 'src/import/entities/phieunhap.entity';
import { PhieuXuatEntity } from 'src/export/entities/phieuxuat.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum';

@Entity('nhanvien')
export class NhanVienEntity {
  @PrimaryColumn({ type: 'varchar', length: 11 })
  maNV: string;

  @Column({ type: 'varchar', length: 30 })
  tenNhanVien: string;

  @Column({ type: 'varchar', length: 10 })
  ngaySinh: string;

  @Column({ type: 'varchar', length: 10 })
  ngayVaoLam: string;

  @Column({ type: 'varchar', length: 100, select: false }) // 'select: false' để không trả về mật khẩu khi query
  matKhau?: string;

  @Column({ type: 'varchar', length: 11 })
  SDT: string;

  @Column({
    type: 'int',
    comment: '1:Admin, 2:Kế toán, 3:QL Kho, 4:Kinh doanh',
  })
  PhongBan: Role; // Sử dụng cột PhongBan để lưu Role

  @Column({ type: 'tinyint', default: 1 }) // Mặc định là 1 (true)
  mustChangePassword: boolean;

  @Column({ type: 'tinyint', default: 0 })
  isDelete: boolean;

  // ... Các cột CreateAt, CreateBy, UpdateAt, UpdateBy ...

  // Quan hệ: 1 Nhân viên lập nhiều Phiếu nhập
  @OneToMany(() => PhieuNhapEntity, (pn) => pn.nhanVien)
  phieuNhaps: PhieuNhapEntity[];

  // Quan hệ: 1 Nhân viên lập nhiều Phiếu xuất
  @OneToMany(() => PhieuXuatEntity, (px) => px.nhanVien)
  phieuXuats: PhieuXuatEntity[];
}
