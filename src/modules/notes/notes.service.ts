import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../../entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  create(userId: string, dto: CreateNoteDto) {
    const note = this.noteRepository.create({
      ...dto,
      userId,
    });
    return this.noteRepository.save(note);
  }

  findAll(userId: string) {
    return this.noteRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(userId: string, id: string) {
    return this.noteRepository.findOne({ where: { id, userId } });
  }

  async update(userId: string, id: string, dto: UpdateNoteDto) {
    await this.noteRepository.update({ id, userId }, dto);
    return this.findOne(userId, id);
  }

  async remove(userId: string, id: string) {
    await this.noteRepository.delete({ id, userId });
  }
}
