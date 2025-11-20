import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  Length,
  Matches,
  IsOptional,
} from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 11, { message: 'Mã nhân viên phải từ 3 đến 11 ký tự' })
  maNV: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên nhân viên không được để trống' })
  tenNhanVien: string;

  /**
   * Email để gửi thông tin đăng nhập.
   * Trường này không lưu vào CSDL (theo CSDL gốc) nhưng cần cho nghiệp vụ.
   */
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0[0-9]{9}$/, {
    message: 'Số điện thoại phải có 10 số và bắt đầu bằng số 0',
  })
  SDT: string;

  /**
   * Vai trò (Phòng ban) mà Admin tạo.
   * Admin không thể tạo một Admin khác.
   */
  @IsEnum(Role, {
    message: 'Vai trò không hợp lệ. Chỉ chấp nhận 2, 3, hoặc 4.',
  })
  @IsNotEmpty()
  role: Role.KE_TOAN | Role.QUAN_LY_KHO | Role.KINH_DOANH;

  @IsString()
  @IsNotEmpty({ message: 'Ngày vào làm không được để trống' })
  ngayVaoLam: string; // Ví dụ: "2025-11-10"

  @IsString()
  @IsOptional() // Có thể có hoặc không
  ngaySinh?: string; // Ví dụ: "2000-01-30"
}
