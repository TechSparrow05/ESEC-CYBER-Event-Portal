-- Supabase Schema Migration: College Event Portal (ESEC)
-- Schema initialization: Auth, Profiles, Sequential Participant UID, Events, Teams, Registrations, Payments & RLS

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PARTICIPANT ID SEQUENCE
CREATE SEQUENCE IF NOT EXISTS participant_id_seq START WITH 1001;

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    participant_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    college TEXT NOT NULL,
    department TEXT,
    year_of_study TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function & Trigger to auto-generate sequential participant ID
CREATE OR REPLACE FUNCTION public.generate_participant_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.participant_id IS NULL OR NEW.participant_id = '' THEN
        NEW.participant_id := 'EVT-2026-' || LPAD(nextval('participant_id_seq')::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_set_participant_id
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.generate_participant_id();

-- 3. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Technical', 'Non-Technical')),
    description TEXT NOT NULL,
    short_desc TEXT,
    icon_name TEXT DEFAULT 'Code',
    fee NUMERIC NOT NULL DEFAULT 150,
    is_team_event BOOLEAN DEFAULT false,
    min_team_size INT DEFAULT 1,
    max_team_size INT DEFAULT 1,
    schedule_time TIMESTAMPTZ,
    venue TEXT,
    rules JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_code VARCHAR(10) UNIQUE NOT NULL,
    team_name TEXT NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    leader_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'Member' CHECK (role IN ('Leader', 'Member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- 6. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    technical_event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    non_technical_event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    role_type TEXT NOT NULL CHECK (role_type IN ('Leader', 'Member', 'Solo')),
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Enforce that at least one event is chosen
    CONSTRAINT check_at_least_one_event CHECK (technical_event_id IS NOT NULL OR non_technical_event_id IS NOT NULL)
);

-- Function & Trigger: Enforce category business rules strictly in database
CREATE OR REPLACE FUNCTION public.check_registration_event_categories()
RETURNS TRIGGER AS $$
DECLARE
    tech_cat TEXT;
    non_tech_cat TEXT;
BEGIN
    -- Verify technical event is indeed Technical
    IF NEW.technical_event_id IS NOT NULL THEN
        SELECT category INTO tech_cat FROM public.events WHERE id = NEW.technical_event_id;
        IF tech_cat <> 'Technical' THEN
            RAISE EXCEPTION 'Event assigned to technical_event_id must be of category Technical';
        END IF;
    END IF;

    -- Verify non-technical event is indeed Non-Technical
    IF NEW.non_technical_event_id IS NOT NULL THEN
        SELECT category INTO non_tech_cat FROM public.events WHERE id = NEW.non_technical_event_id;
        IF non_tech_cat <> 'Non-Technical' THEN
            RAISE EXCEPTION 'Event assigned to non_technical_event_id must be of category Non-Technical';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_check_registration_categories
BEFORE INSERT OR UPDATE ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION public.check_registration_event_categories();

-- 7. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    upi_ref_id VARCHAR(12) UNIQUE NOT NULL CHECK (upi_ref_id ~ '^[0-9]{12}$'),
    screenshot_url TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    vpa TEXT DEFAULT 'esecfest2026@okaxis',
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'verified', 'rejected')),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-update registration status on verified payment
CREATE OR REPLACE FUNCTION public.sync_payment_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'verified' THEN
        UPDATE public.registrations
        SET status = 'verified'
        WHERE id = NEW.registration_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_sync_payment_status
AFTER INSERT OR UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.sync_payment_status();

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile; anyone authenticated can read basic profile info
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Events: Viewable by everyone
CREATE POLICY "Events viewable by everyone" ON public.events FOR SELECT USING (is_active = true);

-- Teams: Viewable by authenticated users, insertable by team leader
CREATE POLICY "Teams viewable by authenticated users" ON public.teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leaders can create teams" ON public.teams FOR INSERT TO authenticated WITH CHECK (auth.uid() = leader_id);

-- Team Members: Viewable by team members
CREATE POLICY "Team members viewable" ON public.team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join team" ON public.team_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Registrations: Users can only see & manage their own registrations
CREATE POLICY "Users can view own registrations" ON public.registrations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own registrations" ON public.registrations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registrations" ON public.registrations FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Payments: Users can see own payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can submit own payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 9. SEED EVENT DATA (ESEC College Tech & Cultural Fest 2026)
INSERT INTO public.events (slug, title, category, description, short_desc, icon_name, fee, is_team_event, min_team_size, max_team_size, schedule_time, venue, rules)
VALUES
(
    'code-sprint',
    'Algorithmic Code Sprint',
    'Technical',
    'Intense competitive programming arena testing algorithmic efficiency, data structures, and edge-case solving. Real-time test-case validation with leaderboard.',
    'Fast-paced speed coding and problem solving contest.',
    'Code',
    150,
    false,
    1,
    1,
    '2026-10-15 10:00:00+05:30',
    'Lab 3 (Turing Hall)',
    '["Individual participation only.", "Supported languages: C++, Java, Python, Go.", "Total 5 problems, 90 minutes duration.", "Plagiarism detection strictly enforced."]'::jsonb
),
(
    'web-dev-hackathon',
    'Full-Stack Web Dev Clash',
    'Technical',
    'Build and deploy a functional web application based on a live mystery prompt within 4 hours. Judged on responsiveness, UI aesthetic, clean code, and API architecture.',
    '4-hour sprint to build next-gen interactive web apps.',
    'Layout',
    300,
    true,
    2,
    4,
    '2026-10-15 11:30:00+05:30',
    'Incubation Center (Silicon Lab)',
    '["Teams of 2 to 4 members.", "Framework agnostic (React, Next.js, Vue, or Vanilla).", "Git repository link must be submitted before deadline.", "Deployment on Vercel/Netlify required."]'::jsonb
),
(
    'paper-presentation',
    'National Paper Presentation',
    'Technical',
    'Present innovative research in AI/ML, Quantum Computing, IoT, Cyber Security, or Sustainable Engineering before an eminent panel of IEEE chairpersons.',
    'Showcase peer-reviewed scientific breakthroughs & research papers.',
    'FileText',
    200,
    true,
    1,
    3,
    '2026-10-15 14:00:00+05:30',
    'Auditorium Seminar Hall A',
    '["Teams of 1 to 3 members.", "IEEE format paper (max 6 pages) submission.", "8 minutes presentation + 2 minutes Q&A.", "Bring 2 printed hard copies."]'::jsonb
),
(
    'circuit-debugging',
    'Circuit Debug & Logic Design',
    'Technical',
    'Diagnose flawed PCB layouts, repair simulated analog and digital circuits, and construct optimal breadboard configurations under strict time constraints.',
    'Hardware debugging, IC troubleshooting, and digital logic challenge.',
    'Cpu',
    150,
    false,
    1,
    2,
    '2026-10-15 15:30:00+05:30',
    'VLSI & Embedded Systems Lab',
    '["Round 1: Written logic elimination (30 mins).", "Round 2: Live hardware debugging.", "Multimeters and probes provided on-site."]'::jsonb
),
(
    'lens-craft-photography',
    'LensCraft Photography',
    'Non-Technical',
    'Capture visual stories across the campus reflecting this year''s theme: ''Vibrancy & Solitude''. Digital processing and raw capture evaluation.',
    'Campus photography contest capturing real emotion and light.',
    'Camera',
    100,
    false,
    1,
    1,
    '2026-10-15 10:30:00+05:30',
    'Open Amphitheatre Campus Grounds',
    '["Single participant entry.", "DSLR or Smartphone entries categorized separately.", "Basic color correction permitted; heavy AI editing disqualified.", "Submit raw EXIF data with entries."]'::jsonb
),
(
    'bgmi-esports-showdown',
    'BGMI Esports Showdown',
    'Non-Technical',
    'Squad tactical battle royale tournament across Erangel and Miramar. Intense lobby matches culminating in an arena-streamed grand finals.',
    'Mobile esports squad battle for dominance and championship trophy.',
    'Gamepad2',
    400,
    true,
    4,
    4,
    '2026-10-15 13:00:00+05:30',
    'Student Activity Center (SAC 2)',
    '["Strictly 4 players per squad (Leader + 3 members).", "Mobile devices only (No tablets/emulators).", "Point system: Placement + Elimination points.", "Screenshots required at match end."]'::jsonb
),
(
    'mystery-treasure-hunt',
    'The Da Vinci Code Hunt',
    'Non-Technical',
    'Decrypt cryptographic clues, decipher riddles hidden across campus landmarks, and unlock checkpoints to uncover the grand relic before other squads.',
    'Campus-wide cryptic treasure hunt requiring lateral thinking.',
    'Compass',
    250,
    true,
    2,
    4,
    '2026-10-15 14:30:00+05:30',
    'Main Library Quadrangle',
    '["Teams of 2 to 4 members.", "Each clue must be validated at marshaled checkpoints.", "Time-based penalty for wrong attempts.", "Physical navigation only - no outside interference."]'::jsonb
),
(
    'adzap-marketing-mania',
    'AdZap: Marketing Mania',
    'Non-Technical',
    'Market absurd, humorous, or impossible products on spot with spontaneous skits, jingles, and brand pitches to convince the jury.',
    'Spontaneous product pitch, theatrical comedy, and creative marketing.',
    'Megaphone',
    200,
    true,
    2,
    4,
    '2026-10-15 16:00:00+05:30',
    'Mini Auditorium',
    '["Teams of 2 to 4 members.", "Preparation time: 5 minutes after prompt draw.", "Stage performance time: 3 to 4 minutes.", "Judged on humor, wit, and persuasiveness."]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
