import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PhieuXuatEntity } from './phieuxuat.entity';
import { SoloEntity } from 'src/medicine/entities/solo.entity';

@Entity('chitietphieuxuat')
export class ChiTietPhieuXuatEntity {
  // Composite Primary Key
  @PrimaryColumn({ type: 'varchar', length: 13 })
  maPhieuXuat: string;

  @PrimaryColumn({ type: 'varchar', length: 3 })
  maChiTietPhieuXuat: string;

  @Column({ type: 'int' })
  SoLuong: number;

  // === Cột chứa Foreign Key ===
  @Column({ type: 'varchar', length: 13 })
  maSoLo: string;

  @Column({ type: 'varchar', length: 48 })
  maThuoc: string;

  // === Định nghĩa Quan hệ ===

  // Quan hệ: Nhiều 'Chi Tiết' thuộc về 1 'Phiếu Xuất'
  @ManyToOne(() => PhieuXuatEntity, (px) => px.chiTietPhieuXuats)
  @JoinColumn({ name: 'maPhieuXuat' })
  phieuXuat: PhieuXuatEntity;

  // Quan hệ: Nhiều 'Chi Tiết' thuộc về 1 'Số Lô' (Composite FK)
  @ManyToOne(() => SoloEntity, (sl) => sl.chiTietPhieuXuats)
  @JoinColumn([
    { name: 'maSoLo', referencedColumnName: 'maLo' },
    { name: 'maThuoc', referencedColumnName: 'maThuoc' },
  ])
  soLo: SoloEntity;
}
