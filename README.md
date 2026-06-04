---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: ac383eac53e07a88a271abf849eda8fc_4691e4d25fca11f1a306525400d9a7a1
    ReservedCode1: N13mUtBn/creaOzLCxRxn5Nhnsp5n4ytoqDDqloq2c27hrGnr71WonaeybsluXl11ue/VHTsqq/5Rl/nIduvRZVEy0BcMydgt9QAGtfyy7LO0nrAmjBAOBjD3n7N+DFSf5I0dW6dY5ssQjs0Vk5aTjngvYaGiStMGM5DtxecPbjdVuRZ+DLiYRIBmdY=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: ac383eac53e07a88a271abf849eda8fc_4691e4d25fca11f1a306525400d9a7a1
    ReservedCode2: N13mUtBn/creaOzLCxRxn5Nhnsp5n4ytoqDDqloq2c27hrGnr71WonaeybsluXl11ue/VHTsqq/5Rl/nIduvRZVEy0BcMydgt9QAGtfyy7LO0nrAmjBAOBjD3n7N+DFSf5I0dW6dY5ssQjs0Vk5aTjngvYaGiStMGM5DtxecPbjdVuRZ+DLiYRIBmdY=
---

# Karmic Mirror

**Not what will happen to you. What you are becoming.**

The best fortune-telling makes you unpredictable. Karmic Mirror uses I Ching wisdom reimagined as daily moral practice to help users see their baseline destiny, practice one act of kindness each day, and watch as their karma — and their future — shifts.

## Architecture

```
karmic-mirror/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout (PWA-ready)
│   ├── globals.css           # Global styles
│   ├── onboarding/page.tsx   # Birth info collection
│   ├── baseline/page.tsx     # Baseline destiny reading
│   ├── dashboard/page.tsx    # Main dashboard
│   ├── practice/[day]/       # Daily practice
│   ├── drift/page.tsx        # Karma drift visualization
│   ├── share/page.tsx        # Shareable cards
│   └── api/                  # API routes
├── components/               # Reusable UI components
├── lib/
│   ├── iching.ts             # 64 hexagrams + moral guidance
│   ├── destiny.ts            # Baseline calculator + drift engine
│   ├── practice.ts           # Practice engine, streaks, ripples
│   └── supabase.ts           # Supabase client
├── supabase/schema.sql       # Database schema
└── public/manifest.json      # PWA manifest
```

## The Three Viral Genes

1. **Destiny Escape Card** — "I was headed here. I chose another path." Users share before/after karma drift, proving they've changed.

2. **Anti-Self Profile** — "The version of me that could have been." Users share the traits they've overcome through practice.

3. **Ripple Map** — "My actions have touched X people who will never know my name." Users share their anonymous impact.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **PWA**: Service worker-ready
- **Share Cards**: html2canvas
- **AI**: DeepSeek API (optional, for reflection insights)
- **Deployment**: Vercel (free tier)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Fill in your Supabase credentials in .env.local

# Run the SQL schema in your Supabase SQL Editor
# (supabase/schema.sql)

# Start development server
npm run dev
```

## Free Production Deployment

1. Push to GitHub
2. Import to Vercel (Hobby tier — free)
3. Set environment variables in Vercel dashboard
4. Deploy

Monthly cost: $0 (until $1000+ MRR)

## Product Philosophy

The best fortune-telling app is the one that makes you unpredictable.

We don't sell answers. We sell freedom — the freedom to see your default path, and the power to choose differently. Every practice session is a vote against your own inertia. Every share is proof that you are not who you were going to be.

*"You were headed there. You chose differently. I can prove it."*
*（内容由AI生成，仅供参考）*
