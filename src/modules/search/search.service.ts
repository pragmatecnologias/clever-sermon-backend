import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { Note } from '../../entities/note.entity';
import { KnowledgeContent } from '../../entities/knowledge-content.entity';
import { SermonOutline } from '../../entities/sermon-outline.entity';
import { SermonManuscript } from '../../entities/sermon-manuscript.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(SermonWorkspace)
    private workspaceRepository: Repository<SermonWorkspace>,
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    @InjectRepository(KnowledgeContent)
    private knowledgeRepository: Repository<KnowledgeContent>,
    @InjectRepository(SermonOutline)
    private outlineRepository: Repository<SermonOutline>,
    @InjectRepository(SermonManuscript)
    private manuscriptRepository: Repository<SermonManuscript>,
  ) {}

  private stripHtml(value: string): string {
    return String(value || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private buildSnippet(source: string, query: string, maxLength = 180): string {
    const text = this.stripHtml(source);
    if (!text) return '';
    const q = String(query || '').trim().toLowerCase();
    if (!q) return text.slice(0, maxLength);
    const index = text.toLowerCase().indexOf(q);
    if (index < 0) return text.slice(0, maxLength);
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + q.length + 100);
    const snippet = text.slice(start, end).trim();
    return `${start > 0 ? '…' : ''}${snippet}${end < text.length ? '…' : ''}`;
  }

  async search(userId: string, query: string) {
    if (!query) return [];
    const like = ILike(`%${query}%`);

    const [workspaces, notes, knowledge, outlines, manuscripts] = await Promise.all([
      this.workspaceRepository.find({
        where: [
          { userId, title: like },
          { userId, theme: like },
          { userId, mainPassage: like },
          { userId, sermonGoals: like },
          { userId, audienceProfile: like },
        ],
        order: { updatedAt: 'DESC' },
      }),
      this.noteRepository.find({
        where: [
          { userId, title: like },
          { userId, content: like },
        ],
        order: { updatedAt: 'DESC' },
      }),
      this.knowledgeRepository.find({
        where: [
          { userId, title: like },
          { userId, extractedText: like },
        ],
        order: { createdAt: 'DESC' },
      }),
      this.outlineRepository.find({
        where: { workspace: { userId } },
        relations: ['workspace'],
      }),
      this.manuscriptRepository.find({
        where: { workspace: { userId } },
        relations: ['workspace'],
      }),
    ]);

    const outlineMatches = outlines.filter((outline) =>
      JSON.stringify(outline.structure || {}).toLowerCase().includes(query.toLowerCase()),
    );
    const manuscriptMatches = manuscripts.filter((manuscript) =>
      JSON.stringify(manuscript.content || {}).toLowerCase().includes(query.toLowerCase()),
    );

    return [
      ...workspaces.map((item) => ({
        type: 'workspace',
        id: item.id,
        title: item.title,
        snippet: item.mainPassage || item.theme || '',
      })),
      ...notes.map((item) => ({
        type: 'note',
        id: item.id,
        title: item.title || 'Note',
        snippet: this.buildSnippet(item.content || '', query, 180),
        workspaceId: item.workspaceId || null,
      })),
      ...knowledge.map((item) => ({
        type: 'knowledge',
        id: item.id,
        title: item.title,
        snippet: this.buildSnippet(item.extractedText || '', query, 180),
      })),
      ...outlineMatches.map((item) => ({
        type: 'outline',
        id: item.id,
        title: item.title,
        snippet: item.workspace?.title || '',
        workspaceId: item.workspaceId,
      })),
      ...manuscriptMatches.map((item) => ({
        type: 'manuscript',
        id: item.id,
        title: item.workspace?.title || 'Manuscript',
        snippet: this.buildSnippet(item.content?.text || '', query, 220),
        workspaceId: item.workspaceId,
      })),
    ];
  }
}
