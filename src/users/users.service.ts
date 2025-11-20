import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NhanVienEntity } from './entities/nhanvien.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(NhanVienEntity)
    private readonly nhanVienRepo: Repository<NhanVienEntity>,
    private readonly emailService: EmailService,
  ) {}

  async findForAuth(maNV: string): Promise<NhanVienEntity | null> {
    const user = await this.nhanVienRepo
      .createQueryBuilder('nhanvien')
      .where('nhanvien.maNV = :maNV', { maNV })
      .andWhere('nhanvien.isDelete = :isDelete', { isDelete: false })
      .addSelect('nhanvien.matKhau') // <-- Ép TypeORM lấy cột matKhau
      .getOne();

    return user;
  }

  /**
   * Tạo tài khoản mới bởi Admin
   */
  async createAccountByAdmin(dto: CreateUserDto): Promise<User> {
    // Kiểm tra tồn tại
    const existingUser = await this.nhanVienRepo.findOne({
      where: [{ maNV: dto.maNV }, { SDT: dto.SDT }],
    });
    if (existingUser) {
      throw new ConflictException('Mã nhân viên hoặc SĐT đã tồn tại');
    }

    // Tạo mật khẩu tạm ngẫu nhiên
    const tempPassword = uuidv4().split('-')[0]; // 8 ký tự
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Tạo entity mới
    const newUser = this.nhanVienRepo.create({
      maNV: dto.maNV,
      tenNhanVien: dto.tenNhanVien,
      SDT: dto.SDT,
      matKhau: hashedPassword,
      PhongBan: dto.role, // 2,3,4
      mustChangePassword: true,
      ngaySinh: dto.ngaySinh,
      ngayVaoLam: dto.ngayVaoLam,
      isDelete: false,
    });

    // Lưu vào DB
    await this.nhanVienRepo.save(newUser);

    // Gửi mail (không await để không block)
    this.emailService.sendWelcomeEmail(
      dto.email,
      newUser.maNV,
      newUser.tenNhanVien,
      tempPassword,
    );

    delete newUser.matKhau;

    return {
      maNV: newUser.maNV,
      tenNhanVien: newUser.tenNhanVien,
      ngaySinh: newUser.ngaySinh,
      ngayVaoLam: newUser.ngayVaoLam,
      matKhau: undefined,
      SDT: newUser.SDT,
      PhongBan: newUser.PhongBan,
      mustChangePassword: newUser.mustChangePassword,
      isDelete: newUser.isDelete,
    };
  }

  /**
   * Tìm user theo maNV
   */
  async findById(maNV: string): Promise<User | null> {
    const user = await this.nhanVienRepo.findOne({
      where: { maNV, isDelete: false },
    });
    if (!user) return null;

    return {
      maNV: user.maNV,
      tenNhanVien: user.tenNhanVien,
      ngaySinh: user.ngaySinh,
      ngayVaoLam: user.ngayVaoLam,
      matKhau: user.matKhau,
      SDT: user.SDT,
      PhongBan: user.PhongBan,
      mustChangePassword: user.mustChangePassword,
      isDelete: user.isDelete,
    };
  }

  /**
   * Cập nhật user
   */
  async update(maNV: string, updateData: Partial<User>): Promise<void> {
    const result = await this.nhanVienRepo.update({ maNV }, updateData);
    if (result.affected === 0) {
      throw new NotFoundException('User không tồn tại');
    }
  }
}
