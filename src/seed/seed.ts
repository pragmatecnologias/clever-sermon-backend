import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { BibleTranslation } from '../entities/bible-translation.entity';
import { SermonWorkspace, SermonStyle, StoryArc, WorkspaceStatus } from '../entities/sermon-workspace.entity';
import { SermonOutline } from '../entities/sermon-outline.entity';
import { SermonManuscript } from '../entities/sermon-manuscript.entity';
import { SermonApplication, AudienceType } from '../entities/sermon-application.entity';
import { SermonIllustration } from '../entities/sermon-illustration.entity';
import { DiscussionQuestion } from '../entities/discussion-question.entity';
import { SermonCitation, StatementType } from '../entities/sermon-citation.entity';
import { Note } from '../entities/note.entity';
import { Highlight } from '../entities/highlight.entity';
import { WordStudy } from '../entities/word-study.entity';
import { KnowledgeContent, ContentType } from '../entities/knowledge-content.entity';
import { TopicGraphNode } from '../entities/topic-graph-node.entity';
import { TopicGraphEdge } from '../entities/topic-graph-edge.entity';
import { CrossReference } from '../entities/cross-reference.entity';
import { AiConversation, AiMode } from '../entities/ai-conversation.entity';
import { LlmRequest } from '../entities/llm-request.entity';
import { LlmProvider } from '../entities/enums/llm-provider.enum';
import { SermonDnaAnalysis } from '../entities/sermon-dna-analysis.entity';
import { ChurchSettings } from '../entities/church-settings.entity';

config();

async function seed() {
  const baseUrl = process.env.DATABASE_URL;
  const databaseName = process.env.DATABASE_NAME;
  const dbUser = process.env.DATABASE_USER;
  const dbPassword = process.env.DATABASE_PASSWORD;
  let url = baseUrl;

  if (baseUrl) {
    const parsed = new URL(baseUrl);
    if (dbUser && !parsed.username) {
      parsed.username = dbUser;
    }
    if (dbPassword && !parsed.password) {
      parsed.password = dbPassword;
    }
    if (databaseName && (!parsed.pathname || parsed.pathname === '/')) {
      parsed.pathname = `/${databaseName}`;
    }
    url = parsed.toString();
  }

  url = url || 'postgres://postgres:postgres@localhost:5432/clever_sermon';

  const dataSource = new DataSource({
    type: 'postgres',
    url,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const translationRepository = dataSource.getRepository(BibleTranslation);
  const workspaceRepository = dataSource.getRepository(SermonWorkspace);
  const outlineRepository = dataSource.getRepository(SermonOutline);
  const manuscriptRepository = dataSource.getRepository(SermonManuscript);
  const applicationRepository = dataSource.getRepository(SermonApplication);
  const illustrationRepository = dataSource.getRepository(SermonIllustration);
  const discussionRepository = dataSource.getRepository(DiscussionQuestion);
  const citationRepository = dataSource.getRepository(SermonCitation);
  const noteRepository = dataSource.getRepository(Note);
  const highlightRepository = dataSource.getRepository(Highlight);
  const wordStudyRepository = dataSource.getRepository(WordStudy);
  const knowledgeRepository = dataSource.getRepository(KnowledgeContent);
  const topicNodeRepository = dataSource.getRepository(TopicGraphNode);
  const topicEdgeRepository = dataSource.getRepository(TopicGraphEdge);
  const crossReferenceRepository = dataSource.getRepository(CrossReference);
  const aiConversationRepository = dataSource.getRepository(AiConversation);
  const llmRequestRepository = dataSource.getRepository(LlmRequest);
  const dnaRepository = dataSource.getRepository(SermonDnaAnalysis);
  const churchSettingsRepository = dataSource.getRepository(ChurchSettings);

  let adminUser = await userRepository.findOne({ where: { email: 'admin@example.com' } });
  if (!adminUser) {
    const passwordHash = await bcrypt.hash('password123', 10);
    adminUser = userRepository.create({
      email: 'admin@example.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      preferences: {
        dashboardLayout: 'sermon-focus',
        highlightColor: '#F59E0B',
      },
    });
    await userRepository.save(adminUser);
    console.log('✅ Created admin user: admin@example.com / password123');
  }

  let churchSettings = await churchSettingsRepository.findOne({ where: { userId: adminUser.id } });
  if (!churchSettings) {
    churchSettings = churchSettingsRepository.create({ userId: adminUser.id });
  }
  Object.assign(churchSettings, {
    userId: adminUser.id,
    churchName: 'Iglesia Adventista Metropolitana de Atlanta',
    addressLine1: '5990 Oakbrook Pkwy',
    addressLine2: null,
    city: 'Norcross',
    state: 'GA',
    postalCode: '30093-1704',
    country: 'USA',
    phone: '770-242-5860',
    website: 'https://atlantametropolitanhispanicga.adventistchurch.org/',
    logoUrl: null,
    defaultTimezone: 'America/New_York',
  });
  await churchSettingsRepository.save(churchSettings);
  console.log('✅ Upserted church settings defaults');

  const translations = [
    { code: 'KJV', name: 'King James Version', language: 'en', apiId: null, isPublicDomain: true },
    { code: 'NIV', name: 'New International Version', language: 'en', apiId: null, isPublicDomain: false },
    { code: 'ESV', name: 'English Standard Version', language: 'en', apiId: null, isPublicDomain: false },
    { code: 'NKJV', name: 'New King James Version', language: 'en', apiId: '63097d2a0a2f7db3-01', isPublicDomain: false },
    { code: 'NLT', name: 'New Living Translation', language: 'en', apiId: null, isPublicDomain: false },
    { code: 'RVR1960', name: 'Reina-Valera 1960', language: 'es', apiId: '592420522e16049f-01', isPublicDomain: false },
    { code: 'NBLA', name: 'Nueva Biblia de las Américas', language: 'es', apiId: 'ce11b813f9a27e20-01', isPublicDomain: false },
  ];

  for (const trans of translations) {
    const existing = await translationRepository.findOne({ where: { code: trans.code } });
    if (!existing) {
      await translationRepository.save(translationRepository.create(trans));
      console.log(`✅ Created translation: ${trans.name}`);
    } else {
      await translationRepository.update({ code: trans.code }, trans);
      console.log(`✅ Updated translation: ${trans.name}`);
    }
  }

  const kjvTranslation = await translationRepository.findOne({ where: { code: 'KJV' } });

  let workspace = await workspaceRepository.findOne({
    where: { userId: adminUser.id, title: 'Faith Under Fire' },
  });

  if (!workspace) {
    workspace = workspaceRepository.create({
      userId: adminUser.id,
      title: 'Faith Under Fire',
      seriesTitle: 'Courageous Faith',
      mainPassage: 'Daniel 3:13-28',
      additionalPassages: ['Isaiah 43:2', '1 Peter 1:7'],
      references: [
        {
          reference: 'Daniel 3:25',
          context: 'Seeded reference for sermon exploration',
          addedAt: new Date().toISOString(),
        },
      ],
      theme: 'God meets us in adversity with presence and power.',
      audienceProfile: 'Saturday worship congregation, multi-generational.',
      sermonGoals: 'Encourage the church to stay faithful under pressure.',
      style: SermonStyle.EXPOSITORY,
      storyArc: StoryArc.PROBLEM_TRUTH_RESPONSE,
      status: WorkspaceStatus.IN_PROGRESS,
      language: 'en',
      egwEnabled: true,
      sermonCore: {
        bigIdea: 'Faithfulness to God shines brightest in the fire.',
        fallenCondition: 'We often compromise when pressured by fear or opposition.',
        centralTruth: 'God’s presence sustains His people when they stand for Him.',
        sermonGoal: 'Call the congregation to courageous loyalty to Christ.',
        audienceNeed: 'Believers need assurance that God is with them in trials.'
      },
    });
    await workspaceRepository.save(workspace);
    console.log('✅ Created English sermon workspace');
  }

  let workspaceEs = await workspaceRepository.findOne({
    where: { userId: adminUser.id, title: 'La Gracia Transformadora' },
  });

  if (!workspaceEs) {
    workspaceEs = workspaceRepository.create({
      userId: adminUser.id,
      title: 'Vida en Cristo',
      seriesTitle: 'Viviendo en Cristo',
      mainPassage: 'Efesios 2:1-10',
      additionalPassages: ['Romanos 5:8', 'Tito 3:4-7'],
      references: [
        {
          reference: 'Romanos 5:8',
          context: 'Referencia inicial para el estudio',
          addedAt: new Date().toISOString(),
        },
      ],
      theme: 'La gracia de Dios nos transforma de muerte a vida.',
      audienceProfile: 'Congregación hispana, familias y jóvenes.',
      sermonGoals: 'Inspirar gratitud por la gracia de Dios y motivar a vivir en santidad.',
      style: SermonStyle.EXPOSITORY,
      storyArc: StoryArc.PROBLEM_TRUTH_RESPONSE,
      status: WorkspaceStatus.IN_PROGRESS,
      language: 'es',
      egwEnabled: true,
      sermonCore: {
        bigIdea: 'La gracia de Dios nos rescata de la muerte espiritual.',
        fallenCondition: 'El pecado nos separa de Dios y nos deja sin vida espiritual.',
        centralTruth: 'En Cristo somos vivificados y reconciliados con Dios.',
        sermonGoal: 'Invitar a la congregación a vivir en la nueva vida de Cristo.',
        audienceNeed: 'La iglesia necesita esperanza de transformación real.'
      },
    });
    await workspaceRepository.save(workspaceEs);
    console.log('✅ Created Spanish sermon workspace');
  }

  let outline = await outlineRepository.findOne({ where: { workspaceId: workspace.id } });
  if (!outline) {
    outline = outlineRepository.create({
      workspaceId: workspace.id,
      title: 'Faith Under Fire Outline',
      structure: {
        introduction: 'Setting the scene of the fiery furnace.',
        points: [
          'Conviction anchored in God’s character',
          'Courage in the face of pressure',
          'Christ present in the fire',
        ],
        conclusion: 'Invite the church to public trust.',
      },
      isSelected: true,
      generatedBy: LlmProvider.LOCAL,
      generatedModel: 'local-model',
    });
    await outlineRepository.save(outline);
  }

  let manuscript = await manuscriptRepository.findOne({ where: { workspaceId: workspace.id } });
  if (!manuscript) {
    manuscript = manuscriptRepository.create({
      workspaceId: workspace.id,
      outlineId: outline.id,
      content: {
        intro: 'We all face moments when faith is tested.',
        sections: [
          {
            heading: 'Conviction',
            body: 'Shadrach, Meshach, and Abednego chose loyalty over safety.',
          },
          {
            heading: 'Courage',
            body: 'Faith sometimes means standing when others bow.',
          },
          {
            heading: 'Christ in the Fire',
            body: 'God’s presence is the promise, not avoidance of hardship.',
          },
        ],
        conclusion: 'Invite the congregation to trust God publicly this week.',
      },
      wordCount: 1250,
      estimatedMinutes: 18,
      transitions: {
        betweenPoints: 'Pause for reflection and prayer.'
      },
      generatedBy: LlmProvider.LOCAL,
      generatedModel: 'local-model',
    });
    await manuscriptRepository.save(manuscript);
  }

  if ((await applicationRepository.count({ where: { workspaceId: workspace.id } })) === 0) {
    await applicationRepository.save([
      applicationRepository.create({
        workspaceId: workspace.id,
        audienceType: AudienceType.MIXED_CONGREGATION,
        content: 'Identify one place you are tempted to compromise and choose obedience.',
        orderIndex: 0,
        isSelected: true,
      }),
      applicationRepository.create({
        workspaceId: workspace.id,
        audienceType: AudienceType.SMALL_GROUP,
        content: 'Share a story where God met you in adversity and pray for one another.',
        orderIndex: 1,
      }),
    ]);
  }

  if ((await illustrationRepository.count({ where: { workspaceId: workspace.id } })) === 0) {
    await illustrationRepository.save(
      illustrationRepository.create({
        workspaceId: workspace.id,
        title: 'The Refiner’s Fire',
        content: 'Gold is purified by heat, and faith is refined through trials.',
        source: 'Pastoral illustration',
        relatedPoint: 'Christ in the Fire',
        tags: ['refining', 'faith', 'perseverance'],
      }),
    );
  }

  if ((await dnaRepository.count({ where: { workspaceId: workspace.id } })) === 0) {
    await dnaRepository.save(
      dnaRepository.create({
        userId: adminUser.id,
        workspaceId: workspace.id,
        summary: 'Strong narrative flow with emphasis on courage and God’s presence.',
        themes: ['Courage', 'Presence', 'Faithfulness', 'Public Witness'],
        scores: {
          clarity: 8,
          structure: 8,
          scriptureFocus: 7,
          applicationDepth: 7,
        },
      }),
    );
  }

  if ((await discussionRepository.count({ where: { workspaceId: workspace.id } })) === 0) {
    await discussionRepository.save([
      discussionRepository.create({
        workspaceId: workspace.id,
        question: 'Where do you feel pressure to bow to culture rather than Christ?',
        orderIndex: 0,
        category: 'application',
      }),
      discussionRepository.create({
        workspaceId: workspace.id,
        question: 'How have you experienced God’s presence during hardship?',
        orderIndex: 1,
        category: 'testimony',
      }),
    ]);
  }

  if ((await citationRepository.count({ where: { workspaceId: workspace.id } })) === 0) {
    await citationRepository.save([
      citationRepository.create({
        workspaceId: workspace.id,
        statementType: StatementType.OBSERVATION,
        statement: 'God’s deliverance is not always removal but presence.',
        verseReferences: ['Daniel 3:25', 'Isaiah 43:2'],
        isVerified: true,
      }),
      citationRepository.create({
        workspaceId: workspace.id,
        statementType: StatementType.APPLICATION,
        statement: 'Public faith shapes public witness.',
        verseReferences: ['Matthew 5:14-16'],
      }),
    ]);
  }

  if ((await noteRepository.count({ where: { userId: adminUser.id } })) === 0) {
    await noteRepository.save([
      noteRepository.create({
        userId: adminUser.id,
        workspaceId: workspace.id,
        title: 'Sermon hook ideas',
        content: 'Contrast comfort vs conviction in modern culture.',
        verseReferences: ['Daniel 3:16-18'],
        tags: ['hook', 'intro'],
      }),
      noteRepository.create({
        userId: adminUser.id,
        title: 'Prayer prompts',
        content: 'Pray for courage in workplace witness.',
        tags: ['prayer', 'application'],
      }),
    ]);
  }

  if ((await highlightRepository.count({ where: { userId: adminUser.id } })) === 0) {
    await highlightRepository.save([
      highlightRepository.create({
        userId: adminUser.id,
        verseReference: 'Daniel 3:25',
        translationId: kjvTranslation?.id,
        color: '#F59E0B',
        tags: ['presence', 'fire'],
      }),
      highlightRepository.create({
        userId: adminUser.id,
        verseReference: 'Isaiah 43:2',
        translationId: kjvTranslation?.id,
        color: '#10B981',
        tags: ['promise'],
      }),
    ]);
  }

  if ((await wordStudyRepository.count({ where: { userId: adminUser.id } })) === 0) {
    await wordStudyRepository.save(
      wordStudyRepository.create({
        userId: adminUser.id,
        word: 'Faithful',
        lemma: 'πιστός',
        language: 'Greek',
        transliteration: 'pistos',
        definition: 'Trustworthy, dependable, believing.',
        usageCount: 67,
        verseExamples: ['1 Corinthians 4:2', '2 Timothy 2:13'],
        notes: 'Faithfulness is active trust demonstrated in action.',
      }),
    );
  }

  if ((await knowledgeRepository.count({ where: { userId: adminUser.id } })) === 0) {
    await knowledgeRepository.save([
      knowledgeRepository.create({
        userId: adminUser.id,
        title: 'Daniel 3 background notes',
        contentType: ContentType.STUDY_NOTE,
        extractedText: 'Historical context about Babylonian worship practices.',
        metadata: { source: 'Study Bible', tags: ['background'] },
      }),
      knowledgeRepository.create({
        userId: adminUser.id,
        title: 'Sermon research on persecution',
        contentType: ContentType.SERMON,
        originalFilename: 'persecution-notes.docx',
        filePath: './uploads/seed/persecution-notes.docx',
        extractedText: 'Key quotes from church history and modern examples.',
        metadata: { tags: ['research', 'persecution'] },
      }),
    ]);
  }

  let courageNode = await topicNodeRepository.findOne({
    where: { userId: adminUser.id, topic: 'Courage' },
  });
  if (!courageNode) {
    courageNode = topicNodeRepository.create({
      userId: adminUser.id,
      topic: 'Courage',
      description: 'Biblical courage rooted in trust.',
      relatedVerses: ['Joshua 1:9', 'Daniel 3:17'],
      metadata: { category: 'character' },
    });
    await topicNodeRepository.save(courageNode);
  }

  let presenceNode = await topicNodeRepository.findOne({
    where: { userId: adminUser.id, topic: 'God’s Presence' },
  });
  if (!presenceNode) {
    presenceNode = topicNodeRepository.create({
      userId: adminUser.id,
      topic: 'God’s Presence',
      description: 'The promise that God is with us in trials.',
      relatedVerses: ['Isaiah 43:2', 'Matthew 28:20'],
      metadata: { category: 'promise' },
    });
    await topicNodeRepository.save(presenceNode);
  }

  if ((await topicEdgeRepository.count({ where: { sourceNodeId: courageNode.id } })) === 0) {
    await topicEdgeRepository.save(
      topicEdgeRepository.create({
        sourceNodeId: courageNode.id,
        targetNodeId: presenceNode.id,
        relationshipType: 'flows_from',
        strength: 9,
      }),
    );
  }

  if ((await crossReferenceRepository.count()) === 0) {
    await crossReferenceRepository.save([
      crossReferenceRepository.create({
        sourceVerse: 'Daniel 3:25',
        targetVerse: 'Isaiah 43:2',
        relationshipType: 'presence',
        strength: 9,
      }),
      crossReferenceRepository.create({
        sourceVerse: 'Daniel 3:17',
        targetVerse: '1 Peter 1:7',
        relationshipType: 'refining',
        strength: 7,
      }),
    ]);
  }

  if ((await aiConversationRepository.count({ where: { userId: adminUser.id } })) === 0) {
    await aiConversationRepository.save(
      aiConversationRepository.create({
        userId: adminUser.id,
        workspaceId: workspace.id,
        mode: AiMode.MENTOR,
        messages: [
          { role: 'user', content: 'How do I help people face pressure at work?' },
          { role: 'assistant', content: 'Point them to God’s presence and invite prayerful courage.' },
        ],
        context: { focus: 'workplace faith' },
      }),
    );
  }

  if ((await llmRequestRepository.count({ where: { userId: adminUser.id } })) === 0) {
    await llmRequestRepository.save(
      llmRequestRepository.create({
        userId: adminUser.id,
        provider: LlmProvider.LOCAL,
        model: 'local-model',
        prompt: 'Generate three sermon points for Daniel 3.',
        response: '1) Conviction anchored in God. 2) Courage in pressure. 3) Christ in the fire.',
        tokenCount: 182,
        latencyMs: 940,
        wasSuccessful: true,
      }),
    );
  }

  console.log('✅ Seed completed successfully!');
  await dataSource.destroy();
}

seed().catch(console.error);
