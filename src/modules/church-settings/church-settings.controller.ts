import { BadRequestException, Body, Controller, Get, Patch, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChurchSettingsService } from './church-settings.service';
import { UpdateChurchSettingsDto } from './dto/update-church-settings.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

const CHURCH_LOGOS_DIR = path.join(process.cwd(), 'uploads', 'church-logos');

@Controller('church-settings')
@UseGuards(JwtAuthGuard)
export class ChurchSettingsController {
  constructor(private readonly churchSettingsService: ChurchSettingsService) {}

  @Get('me')
  getMine(@Request() req) {
    return this.churchSettingsService.getByUserId(req.user.userId);
  }

  @Patch('me')
  updateMine(@Request() req, @Body() dto: UpdateChurchSettingsDto) {
    return this.churchSettingsService.updateByUserId(req.user.userId, dto);
  }

  @Post('me/logo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          fs.mkdirSync(CHURCH_LOGOS_DIR, { recursive: true });
          cb(null, CHURCH_LOGOS_DIR);
        },
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname || '').toLowerCase() || '.png';
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const accepted = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
        if (!accepted.includes(file.mimetype)) {
          return cb(new BadRequestException('Invalid logo file type'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadLogo(@Request() req, @UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Logo file is required');
    }
    const relativePath = `/uploads/church-logos/${file.filename}`;
    return this.churchSettingsService.updateLogoByUserId(req.user.userId, relativePath);
  }
}
