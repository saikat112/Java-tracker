# Expense Tracker - Smart Budget Planner + Group Settlement

Production-grade full-stack application with:
- Personal expense tracking & smart budget planning
- Group expense sharing & settlement calculation
- Mobile-first PWA with offline support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Zustand |
| Backend | Java 21, Spring Boot 3, Spring Security JWT |
| Database | Supabase PostgreSQL |
| Hosting | Vercel (frontend) + Render (backend) |

---

## Local Development

### Prerequisites
- Java 21+
- Node.js 18+
- Maven 3.9+
- PostgreSQL (or Supabase connection)

### Backend Setup

```bash
cd backend

# Copy and configure environment
cp src/main/resources/application-dev.yml.example src/main/resources/application-dev.yml
# Edit application-dev.yml with your DB credentials

# Run
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Backend runs at: http://localhost:8080
Swagger UI: http://localhost:8080/swagger-ui.html

### Frontend Setup

```bash
cd frontend
npm install

# Configure API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1" > .env.local

npm run dev
```

Frontend runs at: http://localhost:3000

---

## Database Setup (Supabase)

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor
3. Run the migration script:
   ```
   backend/src/main/resources/db/migration/V1__init_schema.sql
   ```
4. Get connection string from: Settings → Database → Connection string (URI)
5. Format: `jdbc:postgresql://db.xxx.supabase.co:5432/postgres`

---

## Deploy to Render (Backend)

1. Push code to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Build Command**: `cd backend && mvn clean package -DskipTests`
   - **Start Command**: `java -Dspring.profiles.active=prod -jar backend/target/expense-tracker-1.0.0.jar`
   - **Environment**: Java
5. Add Environment Variables:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:postgresql://db.xxx.supabase.co:5432/postgres
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_supabase_password
   JWT_SECRET=your_base64_encoded_256bit_secret
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
   SWAGGER_ENABLED=false
   ```
6. Deploy

> Generate JWT_SECRET: `openssl rand -base64 32`

---

## Deploy to Vercel (Frontend)

1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
   ```
5. Deploy

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register |
| POST | /api/v1/auth/login | Login |
| POST | /api/v1/auth/refresh | Refresh token |
| POST | /api/v1/auth/forgot-password | Forgot password |
| POST | /api/v1/auth/reset-password | Reset password |

### Budget
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/budgets | Create/update budget |
| GET | /api/v1/budgets/{year}/{month} | Get budget |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/expenses | Add expense |
| GET | /api/v1/expenses | List expenses (paginated) |
| PUT | /api/v1/expenses/{id} | Update expense |
| DELETE | /api/v1/expenses/{id} | Delete expense |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/dashboard | Full dashboard analytics |

### Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/groups | Create group |
| GET | /api/v1/groups | List user's groups |
| GET | /api/v1/groups/{id} | Get group |
| POST | /api/v1/groups/{id}/members | Add member |
| DELETE | /api/v1/groups/{id}/members/{memberId} | Remove member |
| POST | /api/v1/groups/{id}/expenses | Add group expense |
| GET | /api/v1/groups/{id}/expenses | List group expenses |
| GET | /api/v1/groups/{id}/settlements | Settlement summary |
| POST | /api/v1/groups/{id}/settlements | Record settlement |

---

## Budget Logic

```
Total Budget = 30,000
Fixed Expenses = 13,000 (Rent, Electricity, etc.)
Savings Goal = 5,000
─────────────────────
Flexible Budget = 12,000

Weeks in month = 4
Weekly Budget = 3,000

Week 1: Spent 2,200 → Remaining 800
Days left in week = 4
Safe spend/day = 200
```

## Settlement Logic

```
Group Total = 3,600
Members = 2 (Saikat, Manodip)
Equal Share = 1,800

Saikat paid = 1,600 → Balance = -200 (owes)
Manodip paid = 2,000 → Balance = +200 (receives)

Settlement: Saikat pays Manodip ₹200
```

---

## Project Structure

```
Java-tracker/
├── backend/                    # Spring Boot API
│   ├── src/main/java/com/expensemanager/
│   │   ├── config/             # Security, OpenAPI config
│   │   ├── controller/         # REST controllers
│   │   ├── dto/                # Request/Response DTOs
│   │   ├── entity/             # JPA entities
│   │   ├── enums/              # Enumerations
│   │   ├── exception/          # Global exception handling
│   │   ├── mapper/             # Entity mappers
│   │   ├── repository/         # Spring Data repositories
│   │   ├── security/           # JWT filter & service
│   │   ├── service/impl/       # Business logic
│   │   └── util/               # Utilities
│   └── src/main/resources/
│       ├── db/migration/       # SQL schema
│       ├── application.yml
│       ├── application-dev.yml
│       └── application-prod.yml
│
├── frontend/                   # Next.js 15 App
│   └── src/
│       ├── app/                # App Router pages
│       │   ├── (auth)/         # Login, Register
│       │   └── (dashboard)/    # Protected pages
│       ├── components/         # Reusable components
│       ├── store/              # Zustand stores
│       ├── lib/                # API client, utils
│       └── types/              # TypeScript types
│
├── render.yaml                 # Render deployment config
├── Procfile                    # Process file
└── README.md
```
