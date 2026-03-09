import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SermonPatternTracker } from '../../entities/sermon-pattern-tracker.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class SermonPatternTrackerService {
  constructor(
    @InjectRepository(SermonPatternTracker)
    private trackerRepository: Repository<SermonPatternTracker>,
    @InjectRepository(SermonWorkspace)
    private workspaceRepository: Repository<SermonWorkspace>,
    private llmService: LlmService,
  ) {}

  async updatePatterns(userId: string, workspaceId: string): Promise<SermonPatternTracker> {
    let tracker = await this.trackerRepository.findOne({ where: { userId } });

    if (!tracker) {
      tracker = this.trackerRepository.create({
        userId,
        totalSermons: 0,
        styleFrequency: {},
        themeFrequency: {},
        applicationCategoryBalance: {
          personal: 0,
          communal: 0,
          missional: 0,
          doctrinal: 0,
        },
        avoidedTexts: [],
        overusedIllustrations: [],
        growthInsights: [],
      });
    }

    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId, userId },
      relations: ['applications'],
    });

    if (!workspace) {
      return tracker;
    }

    tracker.totalSermons += 1;

    if (workspace.style) {
      tracker.styleFrequency[workspace.style] = (tracker.styleFrequency[workspace.style] || 0) + 1;
    }

    if (workspace.theme) {
      const themeKey = workspace.theme.toLowerCase().substring(0, 50);
      tracker.themeFrequency[themeKey] = (tracker.themeFrequency[themeKey] || 0) + 1;
    }

    const applications = workspace.applications || [];
    applications.forEach(app => {
      const category = this.categorizeApplication(app.content);
      if (category && tracker.applicationCategoryBalance) {
        tracker.applicationCategoryBalance[category]++;
      }
    });

    return this.trackerRepository.save(tracker);
  }

  async analyzeGrowth(userId: string): Promise<SermonPatternTracker> {
    const tracker = await this.trackerRepository.findOne({ where: { userId } });

    if (!tracker || tracker.totalSermons < 3) {
      return tracker || this.trackerRepository.create({
        userId,
        totalSermons: 0,
        styleFrequency: {},
        themeFrequency: {},
        applicationCategoryBalance: { personal: 0, communal: 0, missional: 0, doctrinal: 0 },
        growthInsights: [{ strength: 'Not enough data', weakness: 'Need at least 3 sermons', recommendation: 'Keep preaching!' }],
      });
    }

    const workspaces = await this.workspaceRepository.find({
      where: { userId },
      relations: ['outlines', 'manuscripts', 'applications'],
      order: { createdAt: 'DESC' },
      take: 20,
    });

    const allPassages = workspaces.map(w => w.mainPassage).filter(Boolean);
    const allThemes = workspaces.map(w => w.theme).filter(Boolean);

    const prompt = `You are analyzing a pastor's preaching patterns across ${tracker.totalSermons} sermons.

STYLE FREQUENCY: ${JSON.stringify(tracker.styleFrequency)}
THEME FREQUENCY: ${JSON.stringify(tracker.themeFrequency)}
APPLICATION BALANCE: ${JSON.stringify(tracker.applicationCategoryBalance)}

RECENT PASSAGES: ${allPassages.slice(0, 10).join(', ')}
RECENT THEMES: ${allThemes.slice(0, 10).join(', ')}

TASK: Provide growth insights:

1. STRENGTHS - What patterns show maturity?
2. WEAKNESSES - What patterns reveal blind spots?
   - Do they overemphasize application?
   - Underemphasize Christ?
   - Repeat same structure?
   - Avoid prophetic tone?
   - Avoid difficult texts?
3. RECOMMENDATIONS - Specific growth areas

Return JSON:
{
  "avgChristCentrality": 75,
  "avgApplicationDepth": 65,
  "avoidedTexts": ["Book or type of text avoided"],
  "overusedIllustrations": ["Illustration type used too often"],
  "growthInsights": [
    {
      "strength": "Specific strength",
      "weakness": "Specific weakness",
      "recommendation": "Actionable next step"
    }
  ]
}`;

    try {
      const response = await this.llmService.generateCompletion(prompt, userId, {
        temperature: 0.4,
        maxTokens: 1500,
      });

      const parsed = JSON.parse(response);

      tracker.avgChristCentrality = parsed.avgChristCentrality || null;
      tracker.avgApplicationDepth = parsed.avgApplicationDepth || null;
      tracker.avoidedTexts = parsed.avoidedTexts || [];
      tracker.overusedIllustrations = parsed.overusedIllustrations || [];
      tracker.growthInsights = parsed.growthInsights || [];

      return this.trackerRepository.save(tracker);
    } catch (error) {
      return tracker;
    }
  }

  async get(userId: string): Promise<SermonPatternTracker | null> {
    return this.trackerRepository.findOne({ where: { userId } });
  }

  private categorizeApplication(content: string): 'personal' | 'communal' | 'missional' | 'doctrinal' | null {
    const lower = content.toLowerCase();
    if (lower.includes('you') || lower.includes('your') || lower.includes('personal')) {
      return 'personal';
    }
    if (lower.includes('we') || lower.includes('church') || lower.includes('community')) {
      return 'communal';
    }
    if (lower.includes('mission') || lower.includes('evangelism') || lower.includes('witness')) {
      return 'missional';
    }
    if (lower.includes('doctrine') || lower.includes('theology') || lower.includes('believe')) {
      return 'doctrinal';
    }
    return 'personal';
  }
}
