# Erasmus Mundus Tracker - MVP Architecture

## 🎯 Project Overview
Centralized tracker for Erasmus Mundus Joint Masters programs with real-time deadline tracking, program filtering, and automated notifications.

## 📊 Tech Stack
- **Backend:** FastAPI + Python 3.11
- **Web Scraping:** BeautifulSoup4 + Scrapy + Selenium (for JS-heavy sites)
- **Task Scheduling:** APScheduler
- **Database:** PostgreSQL + SQLAlchemy ORM
- **Frontend:** React 18 + TypeScript + TailwindCSS
- **Async:** asyncio + aiohttp
- **Deployment:** Docker + GitHub Actions + AWS/Heroku
- **Notifications:** SendGrid (email) + Telegram Bot API

---

## 🏗️ Architecture Overview

### 1. Data Collection Layer (Scraper)
```
Sources:
├── Official EC Portal (erasmus-plus.ec.europa.eu)
├── Individual Program Websites
│   ├── meta4.0 (master-meta4-0.eu)
│   ├── MARIHE (marihe.org)
│   └── [100+ programs]
└── MastersPortal API (if public API available)

Scrapers:
├── EC Portal Scraper (structured, easier)
├── Generic Program Website Scraper (pattern-based)
└── JS-heavy Site Scraper (Selenium-based)
```

### 2. Data Processing Pipeline
```
Raw Data → Validation → Cleaning → Standardization → Storage
     ↓
   - Extract deadlines (format normalization)
   - Classify programs (field, country, funding)
   - Detect changes (new programs, moved deadlines)
   - Trigger alerts for close deadlines
```

### 3. Database Schema (Simplified)
```sql
Programs:
  - id (PK)
  - name (text)
  - url (text)
  - consortium (text, e.g., "KTH + Chalmers + Lund")
  - countries (array)
  - field (enum: AI/ML, Engineering, Sustainability, etc.)
  - duration_months (int)
  - tuition_covered (boolean)
  - monthly_allowance (int, EUR)
  - application_deadline (datetime)
  - intake_month (int, e.g., 9 for September)
  - english_requirement (text, e.g., "IELTS 6.5")
  - created_at, updated_at
  - scrape_status (last_checked, success/failure)

Deadlines (tracked for changes):
  - id (PK)
  - program_id (FK)
  - deadline (datetime)
  - changed_on (datetime)
  - old_deadline (datetime, nullable)

UserAlerts (future feature):
  - id (PK)
  - user_email (text)
  - field_filter (array)
  - country_filter (array)
  - days_before_deadline (int, e.g., 7)
```

### 4. Backend API (FastAPI)

**Key Endpoints:**
```
GET /api/v1/programs
  ├── filters: field, country, deadline_range, funding_type
  ├── sort_by: deadline, funding, duration
  └── returns: paginated list + metadata

GET /api/v1/programs/{id}
  └── returns: detailed program info + requirements + recent updates

GET /api/v1/deadlines/upcoming
  ├── days: 7, 14, 30
  └── returns: programs with deadlines coming up

GET /api/v1/programs/field/{field}
  └── returns: all programs in that field

POST /api/v1/alerts/subscribe (future)
  ├── email, filters, notification_frequency
  └── creates email notification job

GET /api/v1/stats
  └── returns: total programs, countries, fields, recent updates
```

### 5. Frontend Dashboard (React)

**Core Pages:**
1. **Home/Search:** Filter programs by field, country, deadline
2. **Program Detail:** Full info + requirements + checklist
3. **Timeline:** Calendar view of deadlines (all programs)
4. **Comparison:** Side-by-side program comparison
5. **Alerts:** Notification preferences (future)
6. **Roadmap:** My application timeline (future, requires auth)

---

## 🚀 MVP Scope (v1.0 - 2 weeks)

**Phase 1: Data Collection (Days 1-3)**
- Scrape 5-10 major programs manually (EC portal + individual sites)
- Build database schema
- Create initial data import script

**Phase 2: Backend (Days 4-7)**
- Set up FastAPI project structure
- Implement core scraper (BeautifulSoup-based)
- Create API endpoints for /programs, /deadlines
- Set up PostgreSQL + migrations
- Deploy to AWS/Heroku

**Phase 3: Frontend (Days 8-10)**
- React setup + routing
- Program listing page with filters
- Program detail page
- Deadline timeline (simple grid/calendar)

**Phase 4: Polish & Launch (Days 11-14)**
- Error handling
- Rate limiting on scrapers
- Basic testing (pytest)
- GitHub repo setup
- Deployment pipeline

**Post-MVP (Roadmap):**
- Email alerts
- User accounts + saved programs
- Telegram bot integration
- Mobile app (React Native)
- ML-based program recommendations

---

## 📂 Project Structure

```
erasmus-tracker/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py (FastAPI app)
│   │   ├── config.py (settings)
│   │   ├── api/
│   │   │   ├── routes.py
│   │   │   ├── schemas.py (Pydantic models)
│   │   │   └── dependencies.py
│   │   ├── models/
│   │   │   └── database.py (SQLAlchemy models)
│   │   ├── scrapers/
│   │   │   ├── base_scraper.py
│   │   │   ├── ec_portal_scraper.py
│   │   │   ├── generic_program_scraper.py
│   │   │   └── utils.py
│   │   ├── services/
│   │   │   ├── program_service.py
│   │   │   └── scraper_service.py
│   │   ├── database.py (connection, session management)
│   │   └── tasks.py (scheduled tasks)
│   ├── tests/
│   │   ├── test_scrapers.py
│   │   ├── test_api.py
│   │   └── conftest.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProgramCard.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── DeadlineTimeline.tsx
│   │   │   └── ProgramDetail.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── ProgramList.tsx
│   │   │   ├── ProgramDetail.tsx
│   │   │   └── Timeline.tsx
│   │   ├── hooks/
│   │   │   ├── usePrograms.ts
│   │   │   └── useFilters.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .github/
│   └── workflows/
│       ├── ci.yml (tests)
│       └── deploy.yml (auto-deploy)
├── README.md
└── ROADMAP.md
```

---

## ⚙️ Scraping Strategy

### Challenge: Different Sites, Different Structures
**Solution:** Combination approach

```python
# 1. Structured sources (easiest)
- EC official API/portal (standardized fields)
- Data extraction: name, deadline, consortium, countries

# 2. Semi-structured (medium effort)
- Program website with consistent layout
- CSS selectors + pattern matching
- Handle variations gracefully

# 3. Dynamic/JS-heavy (hardest)
- Use Selenium for full JS rendering
- Fallback to cached version if timeout
- Skip if cost > benefit
```

### Rate Limiting & Ethics
- Respect `robots.txt`
- Delay between requests (2-5 sec)
- Cache aggressively (re-scrape only if changed)
- Identify yourself: `User-Agent: ErasmusTracker/1.0`
- Contact program owners: "hey, can I scrape your deadline data?"

---

## 🔄 Scheduled Tasks

```python
# APScheduler job configuration
- Every 6 hours: Re-scrape all program websites (check for deadline changes)
- Every day at 2 AM: Send email alerts for deadlines in next 7 days
- Every week: Generate stats report (new programs, popular fields)
- Every month: Archive old programs (deadline passed)
```

---

## 📦 Dependencies (Backend)

```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
beautifulsoup4==4.12.2
scrapy==2.11.0
selenium==4.15.0
requests==2.31.0
aiohttp==3.9.1
apscheduler==3.10.4
pydantic==2.5.0
python-dotenv==1.0.0
```

---

## 🔐 Environment Variables

```
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/erasmus_tracker
PYTHONUNBUFFERED=1
LOG_LEVEL=INFO
SCRAPER_DELAY=3
SCRAPER_TIMEOUT=30
SENDGRID_API_KEY=your_key_here
TELEGRAM_BOT_TOKEN=your_token_here
```

---

## 📈 Success Metrics (Post-MVP)

- [ ] 500+ programs tracked
- [ ] 100+ Daily active users
- [ ] 95%+ deadline accuracy
- [ ] <1 sec API response time
- [ ] Email alert open rate >30%

---

## 🤝 Open Source & Community

**GitHub:** https://github.com/yourusername/erasmus-tracker
**License:** MIT
**Contributing:** PRs welcome! Check CONTRIBUTING.md

**Community Features:**
- Contribute new program sources
- Report deadline inaccuracies
- Suggest new fields/filters
- Build extensions (Telegram bot, Discord integration, etc.)

---

## 💡 Why This Project?

1. **Solves real problem:** 90,000+ students apply to Erasmus Mundus → all need deadline tracking
2. **Showcases full-stack skills:** Scraping + API + DB + React + DevOps
3. **Portfolio piece:** Production-ready code → attracts employers/investors
4. **Open source:** Community contribution → networking + reputation
5. **Scalable:** Start with 100 programs → 1000 → enterprise edition

---

## 📚 Learning Outcomes

- Web scraping at scale (handling 100+ sites)
- Async Python (asyncio + aiohttp)
- FastAPI best practices
- Database design for frequently-queried data
- React patterns (hooks, state management)
- DevOps (Docker, CI/CD, monitoring)
- Open source project management

---

## 🎯 Next Steps (Day 1)

1. Create GitHub repo
2. Set up backend project structure
3. Write initial EC portal scraper (proof of concept)
4. Set up PostgreSQL locally (Docker)
5. Push first commit

**Estimated effort for MVP:** 80-100 hours
**Timeline:** 2 weeks (10-15 hrs/week)
**Team:** Just you initially (or recruit contributors)
