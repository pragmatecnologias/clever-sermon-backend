import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChurchSettings } from '../../entities/church-settings.entity';
import { UpdateChurchSettingsDto } from './dto/update-church-settings.dto';
import { promises as fs } from 'fs';
import * as path from 'path';

const DEFAULT_CHURCH_SETTINGS = {
  churchName: 'Iglesia Adventista Metropolitana de Atlanta',
  addressLine1: '5990 Oakbrook Pkwy',
  addressLine2: null as string | null,
  city: 'Norcross',
  state: 'GA',
  postalCode: '30093-1704',
  country: 'USA',
  phone: '770-242-5860',
  website: 'https://atlantametropolitanhispanicga.adventistchurch.org/',
  logoUrl: null as string | null,
  defaultTimezone: 'America/New_York',
};

@Injectable()
export class ChurchSettingsService {
  constructor(
    @InjectRepository(ChurchSettings)
    private readonly churchSettingsRepository: Repository<ChurchSettings>,
  ) {}

  async getByUserId(userId: string) {
    return this.ensureExists(userId);
  }

  async updateByUserId(userId: string, dto: UpdateChurchSettingsDto) {
    const settings = await this.ensureExists(userId);
    Object.assign(settings, dto || {});
    return this.churchSettingsRepository.save(settings);
  }

  async updateLogoByUserId(userId: string, logoPath: string) {
    const settings = await this.ensureExists(userId);
    const previousLogo = settings.logoUrl;
    settings.logoUrl = logoPath;
    const saved = await this.churchSettingsRepository.save(settings);

    if (
      previousLogo &&
      previousLogo.startsWith('/uploads/church-logos/') &&
      previousLogo !== logoPath
    ) {
      const diskPath = path.join(process.cwd(), previousLogo.replace(/^\//, ''));
      try {
        await fs.unlink(diskPath);
      } catch {
        // Ignore cleanup failures.
      }
    }
    return saved;
  }

  private async ensureExists(userId: string) {
    let settings = await this.churchSettingsRepository.findOne({ where: { userId } });
    if (!settings) {
      settings = this.churchSettingsRepository.create({
        userId,
        ...DEFAULT_CHURCH_SETTINGS,
      });
      return this.churchSettingsRepository.save(settings);
    }

    let changed = false;
    for (const [key, value] of Object.entries(DEFAULT_CHURCH_SETTINGS)) {
      const current = (settings as any)[key];
      if (current === null || current === undefined || String(current).trim() === '') {
        (settings as any)[key] = value;
        changed = true;
      }
    }
    return changed ? this.churchSettingsRepository.save(settings) : settings;
  }
}
