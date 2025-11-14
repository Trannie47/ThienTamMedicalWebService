import {
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO cho từng mặt hàng trong chi tiết
class ChiTietXuatDto {
  @IsString()
  @IsNotEmpty()
  maSoLo: string;

  @IsString()
  @IsNotEmpty()
  maThuoc: string;

  @IsNumber()
  @Min(1)
  soLuong: number;
}

// DTO cho toàn bộ phiếu xuất
export class CreateExportDto {
  @IsString()
  @IsNotEmpty()
  sdtKH: string; // Số điện thoại khách hàng

  @IsString()
  @IsNotEmpty()
  ngayXuat: string; // Ví dụ: "2025-11-10"

  // 🔽 Mảng các chi tiết phiếu xuất
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChiTietXuatDto)
  chiTiet: ChiTietXuatDto[];

  // Ghi chú: maNV (mã nhân viên) nên được lấy từ thông tin
  // đăng nhập (ví dụ: JWT payload), không nên truyền từ body
  // để đảm bảo bảo mật.
}
