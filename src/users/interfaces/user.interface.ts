export interface User {
  maNV: string;
  tenNhanVien: string;
  ngaySinh?: string;
  ngayVaoLam: string;
  matKhau?: string;
  SDT: string;
  PhongBan: number; // enum Role
  mustChangePassword: boolean;
  isDelete: boolean;
}
