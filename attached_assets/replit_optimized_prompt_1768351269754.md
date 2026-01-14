# 🎯 Replit-Optimized Prompt: Erasmus Tracker MVP
**Para usar com Replit Agent (nativo) OU Replit + Cursor/Windsurf (híbrido)**

---

## ⚡ Contexto: O Que Você Está Buildando

Você está criando o **Erasmus Mundus Tracker** — uma ferramenta que scrape 50+ programas de mestrado europeus, armazena em DB, expõe via FastAPI, e renderiza em React. **MVP em 14 dias.**

**Tech Stack otimizado para Replit:**
- **Backend:** FastAPI (Python) rodiando em um único Repl
- **Frontend:** React + Vite (rodando em outro Repl separado)
- **Database:** PostgreSQL nativo do Replit (plug-and-play)
- **Scraping:** BeautifulSoup4 + async requests
- **Deploy:** Replit autoscale deployments

---

## 🔧 Setup Inicial (Execute Isso Primeiro)

### Se você está usando **Replit Agent V2** (Replit nativo - mais rápido):

1. **Crie um novo Repl:**
   - Vá a https://replit.com/new
   - Selecione "Python" template
   - Nome: `erasmus-tracker-backend`

2. **Cole este prompt completo no chat do Agent (lado direito)**

---

## 📋 Prompt Detalhado por Fase

### FASE 1: Setup Inicial (5 min)

```
[COPY & PASTE NO REPLIT AGENT]

I'm building an Erasmus Mundus scholarship tracker MVP. Here's what I need:

1. **Project Structure:**
   - Create /backend folder with FastAPI app
   - Create /models folder with database models
   - Create /scrapers folder with BeautifulSoup scrapers
   - Create /tests folder with pytest tests

2. **Files to Create:**
   - main.py (FastAPI app entry point)
   - models.py (SQLAlchemy models for Program, Deadline)
   - database.py (PostgreSQL connection + session management)
   - scrapers/base_scraper.py (BaseScraper class)
   - scrapers/ec_portal.py (EC portal scraper)
   - scrapers/generic.py (Generic program website scraper)
   - requirements.txt (dependencies)
   - .replit (Replit config)
   - .env.example (template for environment variables)

3. **Install Dependencies:**
   pip install fastapi uvicorn sqlalchemy psycopg2-binary beautifulsoup4 requests pytest python-dotenv

4. **Output:**
   - Project structure created
   - All files stubbed out (not implemented yet)
   - Ready for Phase 2
```

**Expected Output:** Você verá a estrutura pronta. ✅

---

### FASE 2: Database Setup (10 min)

```
[EXECUTE DEPOIS que Phase 1 passar]

Now let's set up PostgreSQL on Replit. Here's what I need:

1. **Enable Replit PostgreSQL:**
   - In Replit, click "Database" tab on left sidebar
   - Click "+ Add Database"
   - Select "PostgreSQL"
   - Wait for it to be ready (you'll see connection string)

2. **Setup Database Connection:**
   In database.py:
   - Import os, sqlalchemy, and create_engine
   - Get DATABASE_URL from os.environ.get("DATABASE_URL")
   - Create engine with: create_engine(DATABASE_URL, echo=True)
   - Create SessionLocal with sessionmaker
   - Create Base class from declarative_base()
   - Add get_db() dependency function

3. **Create Models in models.py:**
   
   Database schema:
   - Programs table: id, name, url, consortium, countries (array), field, deadline, duration_months, tuition_covered, monthly_allowance, english_requirement, created_at, updated_at, scrape_status
   - Deadlines table: id, program_id (FK), deadline, changed_on, old_deadline

4. **Add this to main.py startup:**
   - Import Base from models
   - On app startup: Base.metadata.create_all(bind=engine)

5. **Test Connection:**
   - Add a test endpoint: GET /api/health
   - Should return {"status": "ok"}
   - Run: uvicorn main:app --reload
   - Visit http://localhost:8000/docs

Expected Output: Database tables created, health endpoint working ✅
```

---

### FASE 3: FastAPI Endpoints (15 min)

```
[EXECUTE quando DB estiver rodando]

Build the core FastAPI endpoints. Here's what I need in main.py:

1. **Setup FastAPI with CORS:**
   - Import CORSMiddleware
   - Add CORS middleware to allow all origins (for frontend testing)
   - Configure to accept: credentials, all methods, all headers

2. **Create These Endpoints:**

   a) GET /api/v1/programs
      - Query params: field (optional), country (optional), sort_by (default: deadline)
      - Returns: {total: int, programs: [Program], filters_applied: dict}
      - Logic: Filter programs by field and country, sort by deadline/name
      - Response model: ProgramListResponse (Pydantic schema)

   b) GET /api/v1/programs/{program_id}
      - Path param: program_id
      - Returns: Single program with all details
      - Add computed field: days_until_deadline
      - Response model: ProgramSchema

   c) GET /api/v1/deadlines/upcoming
      - Query param: days (default: 7)
      - Returns: Programs with deadlines in next X days, sorted by deadline
      - Response: {upcoming_count: int, programs: []}

   d) GET /api/v1/stats
      - Returns: {total_programs: int, countries: int, fields: [], avg_deadline_days: int}

3. **For Now, Use Temporary In-Memory Database:**
   - Create PROGRAMS_DB = [] list in main.py
   - Pre-populate with 3 example programs:
     - META4.0, KTH Machine Learning, Chalmers Data Science
   - When DB query methods work, we'll replace with SQLAlchemy queries

4. **Test All Endpoints:**
   - Run: uvicorn main:app --reload
   - Visit http://localhost:8000/docs (Swagger UI)
   - Try each endpoint in the UI

Expected Output: 4 working endpoints, Swagger docs visible, test data flowing ✅
```

---

### FASE 4: Web Scrapers (20 min)

```
[EXECUTE quando endpoints forem OK]

Now let's build the scrapers. Here's what I need:

1. **Create scrapers/base_scraper.py:**
   - BaseClass Scraper with methods:
     * __init__(timeout=30, delay=2.0)
     * fetch_html(url: str) -> Optional[str]
   - Add proper User-Agent header: "ErasmusTracker/1.0"
   - Add error handling for network issues
   - Add time.sleep(self.delay) between requests

2. **Create scrapers/ec_portal.py (ECPortalScraper):**
   - URL: https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters
   - For now: Return hardcoded list of 5 programs with correct structure:
     * name, url, consortium, countries, field, deadline, duration_months
   - Structure should match Program model from models.py
   - Deadline should be parsed to datetime object
   - Return as list of dicts

3. **Create scrapers/generic.py (GenericProgramScraper):**
   - Method: scrape_program(url: str, program_name: str) -> Optional[Dict]
   - Use BeautifulSoup to parse HTML
   - Try to find deadline text with regex patterns like r'deadline|closes on'
   - Have _find_deadline() helper method
   - Have _parse_deadline() helper to convert string to datetime
   - Handle failures gracefully (return None if can't parse)

4. **Create endpoints to test scrapers:**
   - POST /api/v1/scrape/trigger
   - Calls ECPortalScraper.scrape_programs()
   - Returns: {message: "...", programs_found: int}
   - For now, just returns count (doesn't save to DB)

5. **Test Scrapers:**
   - Call POST /api/v1/scrape/trigger
   - Should return 5 programs

Expected Output: Scrapers working, returning program data ✅
```

---

### FASE 5: Frontend Setup (10 min)

```
[EXECUTE EM UM NOVO REPL - não no mesmo]

Create a second Repl for the frontend. Here's what I need:

1. **Create New Repl:**
   - Name: `erasmus-tracker-frontend`
   - Template: "React (Vite)"

2. **Folder Structure:**
   - src/components/ (ProgramCard, FilterPanel, DeadlineTimeline)
   - src/pages/ (Home, ProgramList, ProgramDetail, Timeline)
   - src/services/ (api.ts for all API calls)
   - src/hooks/ (usePrograms, useFilters custom hooks)

3. **API Service (src/services/api.ts):**
   - baseURL: "http://[YOUR_BACKEND_REPL_URL]" (you'll get this after publishing backend)
   - Methods:
     * getPrograms(filters?: {field?, country?, sort_by?})
     * getProgramById(id: number)
     * getUpcomingDeadlines(days: number)
     * getStats()
   - Use axios or fetch
   - Handle CORS (should work with our CORS middleware)

4. **Home Page (src/pages/Home.tsx):**
   - Display header: "Erasmus Mundus Tracker"
   - Show /stats (total programs, countries, fields)
   - Link to /programs page

Expected Output: Frontend repo created, structure ready for Phase 6 ✅
```

---

### FASE 6: React Components (20 min)

```
[CONTINUE EM ERASMUS-TRACKER-FRONTEND]

Build React components to display programs. Here's what I need:

1. **ProgramCard Component (src/components/ProgramCard.tsx):**
   - Props: Program object
   - Display: name, consortium, countries, deadline, days_until_deadline
   - Style with Tailwind (blue border, padding, hover effect)
   - Make it clickable (link to detail page)

2. **FilterPanel Component (src/components/FilterPanel.tsx):**
   - Props: onFilterChange(field, country)
   - Dropdowns for: Field (AI/ML, Engineering, Data Science, etc), Country
   - Clear filters button
   - Use useState for selected values

3. **Program List Page (src/pages/ProgramList.tsx):**
   - Call usePrograms hook to fetch programs
   - Show FilterPanel
   - Map through programs, render ProgramCard for each
   - Show loading state
   - Show error state
   - Show "No programs found" if empty

4. **usePrograms Hook (src/hooks/usePrograms.ts):**
   - useState for programs, loading, error
   - useState for filters (field, country)
   - useEffect to fetch programs when filters change
   - Return: {programs, loading, error, filters, setFilters}

5. **Install Dependencies:**
   - npm install axios react-router-dom tailwindcss

6. **App.tsx Router Setup:**
   - Import BrowserRouter, Routes, Route
   - Routes:
     * "/" -> Home
     * "/programs" -> ProgramList
     * "/programs/:id" -> ProgramDetail (stub for now)

Expected Output: Program list page showing 3 programs with filters working ✅
```

---

### FASE 7: Connect Frontend ↔ Backend (10 min)

```
[MAKE SURE BOTH REPLS ARE RUNNING]

Connect the two Repls:

1. **In Backend Repl:**
   - Click "Publish" button (top right)
   - Select "Autoscale deployment"
   - Machine: 1vCPU, 2GB RAM (default)
   - Click "Publish"
   - Wait 2-3 minutes
   - Copy the public URL (e.g., https://erasmus-tracker-backend.username.repl.co)

2. **In Frontend Repl:**
   - Update src/services/api.ts baseURL to your backend URL
   - Example: const baseURL = "https://erasmus-tracker-backend.username.repl.co"
   - Test endpoints in browser console

3. **Test Full Integration:**
   - Run frontend (npm run dev)
   - Should show 3 programs from backend
   - Test filters
   - Test sorting

Expected Output: Frontend fetching real data from backend ✅
```

---

### FASE 8: Database Integration (15 min)

```
[NOW CONNECT SCRAPERS TO DATABASE]

Replace in-memory DB with PostgreSQL:

1. **In main.py:**
   - Add database operations for each endpoint
   - GET /programs: Query from db.query(Program)
   - GET /programs/{id}: Get single by ID
   - POST /scrape/trigger: Scrape programs, INSERT into DB

2. **Populate Database:**
   - Endpoint: POST /api/v1/programs/seed
   - Scrape 10 real programs
   - Save to PostgreSQL
   - Return: {programs_added: int}
   - Call this once to populate

3. **Add Error Handling:**
   - Try-except around DB queries
   - Return 404 if program not found
   - Return 500 if DB error

Expected Output: Data persisted in PostgreSQL, survives restarts ✅
```

---

### FASE 9: Polish & Testing (15 min)

```
[FINAL PHASE]

Make it production-ready:

1. **Add Unit Tests (backend/test_api.py):**
   - Test GET /programs returns list
   - Test GET /programs/{id} returns single
   - Test GET /deadlines/upcoming filters by date
   - Use pytest fixtures for test data
   - Run: pytest -v

2. **Frontend Polish:**
   - Add loading spinners
   - Add error messages
   - Add empty state UI
   - Make responsive (mobile-friendly Tailwind classes)

3. **Documentation:**
   - Create README.md in backend:
     * Setup instructions
     * API endpoints list
     * Environment variables
   - Create README.md in frontend:
     * Setup instructions
     * Component structure

4. **Environment Variables:**
   - Create .env.example files
   - Backend: DATABASE_URL (auto-filled by Replit)
   - Frontend: VITE_API_URL

Expected Output: Code documented, tests passing, ready to deploy ✅
```

---

## 🎯 How to Use This Prompt with Replit

### Option A: **Native Replit Agent (Easiest)**
1. Create Python Repl
2. Paste each phase above in Agent chat (one at a time)
3. Wait for completion
4. Paste next phase

### Option B: **Cursor/Windsurf + Replit (Fastest)**
1. Create Repl
2. Clone to local: `git clone https://replit.com/@yourusername/erasmus-tracker.git`
3. Open in Cursor/Windsurf
4. Paste each phase into Cursor's AI chat
5. Commit to git: `git push`
6. Replit auto-syncs

---

## ⚠️ Critical Replit-Specific Tips

### Database:
- Replit PostgreSQL connection string is auto-injected as `DATABASE_URL` env var
- You don't need to configure connection manually
- Just do: `db_url = os.environ.get("DATABASE_URL")`

### Deployment:
- Click "Publish" button to make repo live
- Gets unique public URL automatically
- Scales automatically (Replit autoscale)

### Multi-Repl:
- Use one Repl for backend (Python)
- Use one Repl for frontend (Node.js)
- Use environment variables to connect them

### Secrets:
- For API keys, use Replit Secrets tab (not .env)
- Add to .env.example but not .env (which is gitignored)

### Performance:
- Keep scrapers async (use aiohttp or asyncio)
- Cache aggressively (programs don't change hourly)
- Use PostgreSQL for persistence (don't re-scrape every startup)

---

## 📊 Success Metrics

After you execute all phases:
- ✅ Backend Repl published (live URL)
- ✅ Frontend Repl published (live URL)
- ✅ 10+ programs in database
- ✅ All 4 endpoints working
- ✅ React components fetching real data
- ✅ Filters & sorting working
- ✅ Tests passing
- ✅ GitHub repo synced

---

## 🚀 What's Next (After MVP)

1. **Week 2:**
   - Expand to 50 programs
   - Email alerts (SendGrid)
   - User favorites

2. **Week 3:**
   - Telegram bot
   - Mobile responsiveness
   - Advanced filtering

3. **Launch:**
   - Post to r/opensource
   - Dev.to article
   - Product Hunt
   - HackerNews

---

## 📝 Git Workflow (Critical!)

After each phase:
```bash
git add .
git commit -m "[Phase N] Description"
git push
```

This keeps Replit + local in sync.

---

## 💡 Pro Tips for Speed

1. **Use Replit Agent to 80%, then manually fix 20%**
   - Agent is fast at scaffolding
   - You're faster at debugging

2. **Test Each Phase Immediately**
   - Don't wait to integrate
   - Catch issues early

3. **Commit After Each Phase**
   - Rollback if something breaks
   - Track progress

4. **Use Swagger UI** (http://localhost:8000/docs)
   - Test endpoints instantly
   - No Postman needed

5. **Keep Repls Public**
   - Share with friends to test
   - Get feedback early

---

## ❓ Troubleshooting

**"CORS error"**
→ Add proper CORS middleware to FastAPI

**"DATABASE_URL not found"**
→ Click Database tab in Replit, create PostgreSQL

**"Frontend can't reach backend"**
→ Use Replit public URL, not localhost
→ Check CORS is enabled

**"Port already in use"**
→ Replit auto-assigns ports (ignore)
→ Just click Run

---

**Status:** 🟢 Ready to build
**Time to MVP:** 14 days
**Effort:** 10-15 hrs/week

Boa sorte! Let's build 🚀
