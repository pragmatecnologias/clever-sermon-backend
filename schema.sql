CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE sermon_style AS ENUM ('expository', 'topical', 'narrative', 'apologetic', 'devotional');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE story_arc AS ENUM ('problem_truth_response', 'tension_turn_resolution', 'question_discovery_answer', 'challenge_journey_transformation');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE audience_type AS ENUM ('youth', 'new_believers', 'leadership', 'mixed_congregation', 'pastoral_care', 'small_group');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ai_mode AS ENUM ('answer', 'mentor', 'coach');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE statement_type AS ENUM ('observation', 'interpretation', 'application', 'illustration', 'external_reference');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE llm_provider AS ENUM ('local', 'openai', 'anthropic');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE content_type AS ENUM ('sermon', 'pdf', 'outline', 'study_note');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE workspace_status AS ENUM ('draft', 'in_progress', 'completed', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  "passwordHash" text NOT NULL,
  role user_role NOT NULL DEFAULT 'admin',
  "firstName" text,
  "lastName" text,
  preferences jsonb DEFAULT '{}',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bible_translations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  language text NOT NULL DEFAULT 'en',
  "apiId" text,
  "isPublicDomain" boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sermon_workspaces (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  "seriesTitle" text,
  "mainPassage" text NOT NULL,
  "additionalPassages" text[],
  theme text,
  "audienceProfile" text,
  "sermonGoals" text,
  "theologicalLens" text,
  style sermon_style,
  "storyArc" story_arc,
  status workspace_status NOT NULL DEFAULT 'draft',
  language text NOT NULL DEFAULT 'en',
  metadata jsonb DEFAULT '{}',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sermon_outlines (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "workspaceId" uuid NOT NULL REFERENCES sermon_workspaces(id) ON DELETE CASCADE,
  title text NOT NULL,
  structure jsonb NOT NULL,
  "contentFormat" varchar(20) NOT NULL DEFAULT 'markdown',
  "isSelected" boolean NOT NULL DEFAULT false,
  "generatedBy" llm_provider,
  "generatedModel" text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sermon_manuscripts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "workspaceId" uuid NOT NULL REFERENCES sermon_workspaces(id) ON DELETE CASCADE,
  "outlineId" uuid REFERENCES sermon_outlines(id) ON DELETE SET NULL,
  content jsonb NOT NULL,
  "contentFormat" varchar(20) NOT NULL DEFAULT 'markdown',
  "wordCount" integer,
  "estimatedMinutes" integer,
  transitions jsonb,
  "generatedBy" llm_provider,
  "generatedModel" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sermon_applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "workspaceId" uuid NOT NULL REFERENCES sermon_workspaces(id) ON DELETE CASCADE,
  "audienceType" audience_type NOT NULL,
  content text NOT NULL,
  "contentFormat" varchar(20) NOT NULL DEFAULT 'markdown',
  "orderIndex" integer NOT NULL DEFAULT 0,
  "isSelected" boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sermon_illustrations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "workspaceId" uuid NOT NULL REFERENCES sermon_workspaces(id) ON DELETE CASCADE,
  title text,
  content text NOT NULL,
  "contentFormat" varchar(20) NOT NULL DEFAULT 'markdown',
  source text,
  "relatedPoint" text,
  tags text[],
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS discussion_questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "workspaceId" uuid NOT NULL REFERENCES sermon_workspaces(id) ON DELETE CASCADE,
  question text NOT NULL,
  "contentFormat" varchar(20) NOT NULL DEFAULT 'markdown',
  "orderIndex" integer NOT NULL DEFAULT 0,
  category text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sermon_citations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "workspaceId" uuid NOT NULL REFERENCES sermon_workspaces(id) ON DELETE CASCADE,
  "statementType" statement_type NOT NULL,
  statement text NOT NULL,
  "verseReferences" text[],
  "externalSources" text[],
  "isVerified" boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sermon_study_reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "workspaceId" uuid NOT NULL REFERENCES sermon_workspaces(id) ON DELETE CASCADE,
  sections jsonb NOT NULL DEFAULT '{}',
  "contentFormat" varchar(20) NOT NULL DEFAULT 'markdown',
  "rawResponse" text,
  "generatedBy" llm_provider,
  "generatedModel" text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS highlights (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "verseReference" text NOT NULL,
  "translationId" uuid REFERENCES bible_translations(id) ON DELETE SET NULL,
  color text,
  tags text[],
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text,
  content text NOT NULL,
  "verseReferences" text[],
  tags text[],
  "linkedNoteIds" uuid[],
  "workspaceId" uuid REFERENCES sermon_workspaces(id) ON DELETE SET NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cross_references (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "sourceVerse" text NOT NULL,
  "targetVerse" text NOT NULL,
  "relationshipType" text,
  strength integer DEFAULT 5,
  "isAutoGenerated" boolean NOT NULL DEFAULT true,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS word_studies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word text NOT NULL,
  lemma text,
  language text NOT NULL,
  transliteration text,
  definition text,
  "usageCount" integer,
  "verseExamples" text[],
  notes text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS knowledge_content (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  "contentType" content_type NOT NULL,
  "originalFilename" text,
  "filePath" text,
  "extractedText" text,
  metadata jsonb DEFAULT '{}',
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS topic_graph_nodes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  description text,
  "relatedVerses" text[],
  "relatedNotes" uuid[],
  metadata jsonb DEFAULT '{}',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS topic_graph_edges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "sourceNodeId" uuid NOT NULL REFERENCES topic_graph_nodes(id) ON DELETE CASCADE,
  "targetNodeId" uuid NOT NULL REFERENCES topic_graph_nodes(id) ON DELETE CASCADE,
  "relationshipType" text NOT NULL,
  strength integer DEFAULT 5,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "workspaceId" uuid REFERENCES sermon_workspaces(id) ON DELETE CASCADE,
  mode ai_mode NOT NULL DEFAULT 'answer',
  messages jsonb NOT NULL DEFAULT '[]',
  context jsonb DEFAULT '{}',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sermon_dna_analyses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "workspaceId" uuid NOT NULL REFERENCES sermon_workspaces(id) ON DELETE CASCADE,
  summary text NOT NULL,
  "contentFormat" varchar(20) NOT NULL DEFAULT 'markdown',
  themes text[],
  scores jsonb DEFAULT '{}',
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS llm_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider llm_provider NOT NULL,
  model text NOT NULL,
  prompt text NOT NULL,
  response text,
  "tokenCount" integer,
  "latencyMs" integer,
  "wasSuccessful" boolean NOT NULL DEFAULT true,
  error text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sermon_workspaces_user ON sermon_workspaces("userId");
CREATE INDEX IF NOT EXISTS idx_sermon_workspaces_status ON sermon_workspaces(status);
CREATE INDEX IF NOT EXISTS idx_sermon_outlines_workspace ON sermon_outlines("workspaceId");
CREATE INDEX IF NOT EXISTS idx_sermon_manuscripts_workspace ON sermon_manuscripts("workspaceId");
CREATE INDEX IF NOT EXISTS idx_highlights_user ON highlights("userId");
CREATE INDEX IF NOT EXISTS idx_highlights_verse ON highlights("verseReference");
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes("userId");
CREATE INDEX IF NOT EXISTS idx_notes_workspace ON notes("workspaceId");
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_cross_references_source ON cross_references("sourceVerse");
CREATE INDEX IF NOT EXISTS idx_cross_references_target ON cross_references("targetVerse");
CREATE INDEX IF NOT EXISTS idx_word_studies_user ON word_studies("userId");
CREATE INDEX IF NOT EXISTS idx_word_studies_lemma ON word_studies(lemma);
CREATE INDEX IF NOT EXISTS idx_knowledge_content_user ON knowledge_content("userId");
CREATE INDEX IF NOT EXISTS idx_knowledge_content_type ON knowledge_content("contentType");
CREATE INDEX IF NOT EXISTS idx_topic_graph_nodes_user ON topic_graph_nodes("userId");
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations("userId");
CREATE INDEX IF NOT EXISTS idx_ai_conversations_workspace ON ai_conversations("workspaceId");
CREATE INDEX IF NOT EXISTS idx_llm_requests_user ON llm_requests("userId");
CREATE INDEX IF NOT EXISTS idx_llm_requests_provider ON llm_requests(provider);
CREATE INDEX IF NOT EXISTS idx_sermon_dna_workspace ON sermon_dna_analyses("workspaceId");
