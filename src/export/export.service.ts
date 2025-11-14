import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { PhieuXuatEntity } from './entities/phieuxuat.entity';
import { ChiTietPhieuXuatEntity } from './entities/chitietphieuxuat.entity';
import { SoloEntity } from 'src/medicine/entities/solo.entity';
import { CreateExportDto } from './dto/create-export.dto';
import { v4 as uuidv4 } from 'uuid'; // Dùng để tạo mã phiếu ngẫu nhiên

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(PhieuXuatEntity)
    private readonly phieuXuatRepo: Repository<PhieuXuatEntity>,
    private readonly entityManager: EntityManager, // Dùng để quản lý transaction
  ) {}

  /**
   * Lấy tất cả phiếu xuất
   */
  async findAll() {
    return this.phieuXuatRepo.find({
      relations: ['khachHang', 'nhanVien', 'chiTietPhieuXuats'],
    });
  }

  /**
   * Lấy một phiếu xuất bằng ID
   */
  async findOne(maPhieuXuat: string) {
    const phieuXuat = await this.phieuXuatRepo.findOne({
      where: { maPhieuXuat },
      relations: [
        'khachHang',
        'nhanVien',
        'chiTietPhieuXuats',
        'chiTietPhieuXuats.soLo', // Lấy thông tin lô của chi tiết
      ],
    });

    if (!phieuXuat) {
      throw new NotFoundException('Không tìm thấy phiếu xuất');
    }
    return phieuXuat;
  }

  /**
   * Tạo phiếu xuất mới (Sử dụng Transaction)
   * @param dto Dữ liệu phiếu xuất
   * @param maNV Mã nhân viên (lấy từ auth)
   */
  async create(dto: CreateExportDto, maNV: string) {
    // Chạy nghiệp vụ trong một transaction
    return this.entityManager.transaction(
      async (transactionManager: EntityManager) => {
        // === BƯỚC 1: Kiểm tra tồn kho của tất cả sản phẩm ===
        for (const item of dto.chiTiet) {
          const soLo = await transactionManager.findOne(SoloEntity, {
            where: { maLo: item.maSoLo, maThuoc: item.maThuoc },
          });

          if (!soLo) {
            throw new NotFoundException(
              `Không tìm thấy lô ${item.maSoLo} / thuốc ${item.maThuoc}`,
            );
          }
          if (soLo.SoLuong < item.soLuong) {
            throw new BadRequestException(
              `Không đủ tồn kho cho thuốc ${item.maThuoc} (Lô ${item.maSoLo}). Chỉ còn ${soLo.SoLuong}`,
            );
          }
        }

        // === BƯỚC 2: Tạo Phiếu Xuất chính ===
        const phieuXuat = transactionManager.create(PhieuXuatEntity, {
          maPhieuXuat: `PX-${uuidv4().split('-')[0]}`, // Tạo mã phiếu ngẫu nhiên
          ngayXuat: dto.ngayXuat,
          sdtKH: dto.sdtKH,
          maNV: maNV, // Lấy từ user đăng nhập
          trangThai: 1, // 1 = Mới tạo
        });
        await transactionManager.save(phieuXuat);

        // === BƯỚC 3: Tạo Chi Tiết Phiếu Xuất và Trừ Tồn Kho ===
        let index = 1;
        for (const item of dto.chiTiet) {
          // Tạo chi tiết
          const chiTiet = transactionManager.create(ChiTietPhieuXuatEntity, {
            maPhieuXuat: phieuXuat.maPhieuXuat,
            maChiTietPhieuXuat: index.toString().padStart(3, '0'), // 001, 002
            maSoLo: item.maSoLo,
            maThuoc: item.maThuoc,
            SoLuong: item.soLuong,
          });
          await transactionManager.save(chiTiet);

          // Trừ tồn kho lô
          await transactionManager.decrement(
            SoloEntity,
            { maLo: item.maSoLo, maThuoc: item.maThuoc },
            'SoLuong',
            item.soLuong,
          );

          index++;
        }

        return phieuXuat;
      },
    );
  }
}
