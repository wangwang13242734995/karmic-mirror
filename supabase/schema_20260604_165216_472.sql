-- Karmic Mirror: Community Reflections & Admin Content
-- Run this in Supabase SQL Editor

-- 1. Community reflections (user answers to daily questions)
CREATE TABLE IF NOT EXISTS reflections (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  day_number INTEGER NOT NULL,
  hexagram_id INTEGER NOT NULL,
  question_number INTEGER NOT NULL,
  answer TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Index for fetching recent reflections
CREATE INDEX IF NOT EXISTS idx_reflections_date ON reflections(date DESC);
CREATE INDEX IF NOT EXISTS idx_reflections_hexagram ON reflections(hexagram_id);

-- 2. Admin content (daily questions, wisdom texts managed by admin)
CREATE TABLE IF NOT EXISTS admin_content (
  id BIGSERIAL PRIMARY KEY,
  content_key TEXT NOT NULL UNIQUE,
  content_zh TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default daily questions
INSERT INTO admin_content (content_key, content_zh, content_en) VALUES
  ('daily_q1', '善念和善行，哪个更重要？', 'Which matters more — having good intentions, or performing good deeds?'),
  ('daily_q2', '无人知晓的善行，还算善行吗？', 'If a kindness goes entirely unnoticed, does it still count?'),
  ('daily_q3', '出于责任的善，和出于爱的善，价值相等吗？', 'Is a good act done out of duty as valuable as one done out of love?'),
  ('daily_q4', '你可以对一个人感到愤怒，同时仍祝愿他好吗？', 'Can you be angry at someone and still wish them well?'),
  ('daily_q5', '如果必须二选一——正确，还是善良——你选哪个？', 'If you had to choose — be right, or be kind — which would you pick?'),
  ('daily_q6', '你对陌生人的善意，应该多于对自己的善意吗？', 'Do you owe more kindness to strangers or to yourself?'),
  ('daily_q7', '原谅，是为了对方，还是为了自己？', 'Is forgiveness for the other person, or for you?'),
  ('daily_q8', '当你帮助一个人时，你在改变他的命运，还是自己的？', 'When you help someone, are you changing their destiny — or yours?'),
  ('daily_q9', '不善良的真相，是否比善良的谎言更有爱？', 'Can an unkind truth be more loving than a kind lie?'),
  ('daily_q10', '如果每一个念头都会在世界留下痕迹，你的念头会不同吗？', 'If every thought left a trace in the world, would you think differently?'),
  ('daily_q11', '人可能过于无私吗？', 'Is it possible to be too selfless?'),
  ('daily_q12', '苦难让人更善良，还是更坚硬？', 'Does suffering make a person kinder, or harder?'),
  ('daily_q13', '如果没有人看着，你会是谁？', 'If no one were watching, who would you be?'),
  ('daily_q14', '你曾收过哪一个改变你的善意，而施予者从未知晓？', 'What is one kindness you received that changed you — but the giver never knew?')
ON CONFLICT (content_key) DO NOTHING;

-- Enable RLS
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_content ENABLE ROW LEVEL SECURITY;

-- RLS: anyone can read reflections
CREATE POLICY "Anyone can read reflections" ON reflections
  FOR SELECT USING (true);

-- RLS: anyone can insert their own reflection
CREATE POLICY "Users can insert their own reflection" ON reflections
  FOR INSERT WITH CHECK (true);

-- RLS: anyone can read admin content
CREATE POLICY "Anyone can read admin content" ON admin_content
  FOR SELECT USING (true);

-- RLS: only authenticated admin can modify admin content
CREATE POLICY "Admin can modify content" ON admin_content
  FOR ALL USING (auth.role() = 'authenticated');
