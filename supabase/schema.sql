-- Karmic Mirror Database Schema
-- Deploy to Supabase SQL Editor

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  display_name TEXT,
  birth_year INTEGER NOT NULL,
  birth_month INTEGER NOT NULL,
  birth_day INTEGER NOT NULL,
  birth_hour INTEGER NOT NULL,
  life_hexagram INTEGER NOT NULL,
  karma_inertia_index INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Baseline destiny readings (one per user, immutable after creation)
CREATE TABLE baseline_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  karma_inertia_index INTEGER NOT NULL,
  readings JSONB NOT NULL,       -- Array of BaselineReading objects
  summary TEXT NOT NULL
);

-- Daily practice sessions
CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  date DATE NOT NULL,
  day_number INTEGER NOT NULL,
  hexagram_id INTEGER NOT NULL,
  completed BOOLEAN,              -- null = pending, true = done, false = tried
  reflection TEXT DEFAULT '',
  mood INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Drift reports (periodic recalculation)
CREATE TABLE drift_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  previous_karma_index INTEGER NOT NULL,
  current_karma_index INTEGER NOT NULL,
  drift_data JSONB NOT NULL,       -- Array of dimension drift objects
  summary TEXT NOT NULL
);

-- Share card generations (track viral shares)
CREATE TABLE share_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  card_type TEXT NOT NULL,         -- 'drift', 'anti_self', 'ripple', 'percentile'
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  referrer_code TEXT
);

-- Indexes
CREATE INDEX idx_practice_user_date ON practice_sessions(user_id, date);
CREATE INDEX idx_drift_user ON drift_reports(user_id, created_at);
CREATE INDEX idx_share_user ON share_events(user_id, shared_at);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE baseline_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE drift_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only access their own data
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own baseline" ON baseline_readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own baseline" ON baseline_readings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own sessions" ON practice_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON practice_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON practice_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own drifts" ON drift_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own drifts" ON drift_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own shares" ON share_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shares" ON share_events FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can read share events" ON share_events FOR SELECT USING (true);

-- Community reflections (public, anonymous)
CREATE TABLE IF NOT EXISTS reflections (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  day_number INTEGER NOT NULL,
  hexagram_id INTEGER NOT NULL DEFAULT 0,
  question_number INTEGER NOT NULL,
  answer TEXT DEFAULT '',
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Reflection likes (track anonymous likes)
CREATE TABLE IF NOT EXISTS reflection_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reflection_id BIGINT REFERENCES reflections(id) ON DELETE CASCADE,
  user_anon_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reflection_id, user_anon_id)
);

-- Reflection indexes
CREATE INDEX IF NOT EXISTS idx_reflections_created ON reflections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reflection_likes_ref ON reflection_likes(reflection_id);

-- Enable RLS for community tables
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflection_likes ENABLE ROW LEVEL SECURITY;

-- Public can read reflections and likes
CREATE POLICY "Public can read reflections" ON reflections FOR SELECT USING (true);
CREATE POLICY "Public can insert reflections" ON reflections FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update own reflections" ON reflections FOR UPDATE USING (true);

CREATE POLICY "Public can read likes" ON reflection_likes FOR SELECT USING (true);
CREATE POLICY "Public can insert likes" ON reflection_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can delete own likes" ON reflection_likes FOR DELETE USING (true);
