import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe, // Giả sử mã phiếu là UUID, nếu không thì dùng string
  Req, // Dùng để lấy thông tin user từ request
  UseGuards, // Nên dùng
} from '@nestjs/common';
import { ExportService } from './export.service';
import { CreateExportDto } from './dto/create-export.dto';
// import { AuthGuard } from '@nestjs/passport'; // Ví dụ về Guard

@Controller('export') // Đường dẫn /export
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  /**
   * GET /export
   * Lấy tất cả phiếu xuất
   */
  @Get()
  findAll() {
    return this.exportService.findAll();
  }

  /**
   * GET /export/:id
   * Lấy 1 phiếu xuất theo mã
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exportService.findOne(id);
  }

  /**
   * POST /export
   * Tạo một phiếu xuất mới
   */
  // @UseGuards(AuthGuard('jwt')) // Nên bảo vệ endpoint này
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createExportDto: CreateExportDto, @Req() req: any) {
    // === LƯU Ý QUAN TRỌNG ===
    // Trong thực tế, 'maNV' phải được lấy từ user đã đăng nhập
    // ví dụ: const maNhanVien = req.user.maNV;
    // Ở đây tôi dùng tạm mã 'NV001' để làm ví dụ
    const maNhanVien = 'NV001'; // <<< THAY THẾ BẰNG LOGIC AUTH CỦA BẠN

    return this.exportService.create(createExportDto, maNhanVien);
  }
}
