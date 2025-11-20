// src/medicine/medicine.controller.ts
import {
  Controller,
  Get,
  Param,
  //   UsePipes,
  //   ValidationPipe,
} from '@nestjs/common';
import { MedicineService } from './medicine.service';

@Controller('medicine') // Đường dẫn chung là /medicine
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Get('thuoc') // GET /medicine/thuoc
  getAllThuoc() {
    return this.medicineService.findAllThuoc();
  }

  @Get('thuoc/:id') // GET /medicine/thuoc/some-id
  getOneThuoc(@Param('id') id: string) {
    return this.medicineService.findOneThuoc(id);
  }

  // ... Thêm các endpoint @Post, @Patch, @Delete
}
