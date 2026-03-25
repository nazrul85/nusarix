# Nusarix — Modern ERP & CRM Platform

A modular, enterprise-ready ERP & CRM starter platform built with **Laravel** (backend API) and **React + TypeScript** (frontend), styled with the **Vristo** admin design system using **Tailwind CSS**.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 11 (API-only) |
| Authentication | Laravel Sanctum (token-based, Passport-ready) |
| Authorization | Spatie Laravel Permission (roles & permissions) |
| Database | MySQL or PostgreSQL |
| Frontend | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS (Vristo design system) |
| State Management | Zustand |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Notifications | React Hot Toast |

---

## 📁 Project Structure

```
nusarix/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/  # All API controllers
│   │   │   └── Requests/         # Form Request validators
│   │   ├── Models/               # Eloquent models
│   │   ├── Services/             # Business logic layer
│   │   └── Providers/
│   ├── config/
│   ├── database/
│   │   ├── migrations/           # All database migrations
│   │   └── seeders/              # Seed roles, permissions, users
│   └── routes/
│       └── api.php               # RESTful API routes
│
└── frontend/                   # React + TypeScript app
    └── src/
        ├── components/
        │   ├── layout/           # Sidebar, Header, MainLayout
        │   └── ui/               # Table, Modal, SearchBar, StatCard, ConfirmDialog
        ├── hooks/                # usePagination, useApi
        ├── pages/
        │   ├── auth/             # Login, ForgotPassword, ResetPassword
        │   ├── dashboard/        # Dashboard with stats & activities
        │   ├── customers/        # Full CRUD + detail view
        │   ├── users/            # User management
        │   ├── roles/            # Role management
        │   ├── permissions/      # Permission management
        │   ├── leads/            # Lead listing
        │   ├── opportunities/    # Opportunity listing
        │   ├── tasks/            # Task listing
        │   └── activities/       # Activity listing
        ├── services/             # Axios API service layer
        ├── store/                # Zustand auth store
        └── types/                # TypeScript interfaces
```

---

## ⚙️ Backend Setup

### Prerequisites
- PHP 8.2+
- Composer 2.x
- MySQL 8.0+ or PostgreSQL 13+

### Installation

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=nusarix
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations
php artisan migrate

# Seed initial data (roles, permissions, admin user)
php artisan db:seed

# Start the development server
php artisan serve
```

The API will be available at `http://localhost:8000`.

### Default Users

| Email | Password | Role |
|---|---|---|
| admin@nusarix.com | password | admin |
| manager@nusarix.com | password | manager |

### API Endpoints

**Authentication**
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

**Core Resources** (all require `auth:sanctum`)
```
GET/POST              /api/users
GET/PUT/DELETE        /api/users/{id}
POST                  /api/users/{id}/assign-role
POST                  /api/users/{id}/remove-role

GET/POST              /api/roles
GET/PUT/DELETE        /api/roles/{id}
POST                  /api/roles/{id}/sync-permissions

GET/POST              /api/permissions
GET/PUT/DELETE        /api/permissions/{id}

GET/POST              /api/customers
GET/PUT/DELETE        /api/customers/{id}

GET/POST              /api/companies
GET/PUT/DELETE        /api/companies/{id}

GET/POST              /api/leads
GET/PUT/DELETE        /api/leads/{id}

GET/POST              /api/opportunities
GET/PUT/DELETE        /api/opportunities/{id}

GET/POST              /api/tasks
GET/PUT/DELETE        /api/tasks/{id}

GET/POST              /api/activities
GET/PUT/DELETE        /api/activities/{id}

GET                   /api/dashboard/stats
GET                   /api/dashboard/recent-activities
```

**API Response Format**
```json
{
  "success": true,
  "message": "Operation successful.",
  "data": { ... }
}
```

---

## 🎨 Frontend Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

---

## 🔐 Authentication Flow

1. User submits login form → `POST /api/auth/login`
2. Backend returns `{ user, token }` on success
3. Token stored in Zustand store (persisted to `localStorage`)
4. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
5. On 401 response, user is automatically logged out and redirected to `/login`
6. Protected routes require `isAuthenticated: true` in the auth store

---

## 👥 Roles & Permissions

| Role | Permissions |
|---|---|
| **admin** | Full access to all modules |
| **manager** | View/Create/Edit on CRM modules |
| **staff** | View-only access |

The sidebar automatically hides admin-only navigation items based on the user's roles.

---

## 🗄️ Database Models

| Model | Key Fields |
|---|---|
| User | name, email, password |
| Customer | first_name, last_name, email, phone, company, status |
| Company | name, industry, website, phone, email |
| Lead | title, customer, assigned_to, source, status, value |
| Opportunity | title, customer, stage, status, value, probability, close_date |
| Task | title, description, assigned_to, status, priority, due_date |
| Activity | type, description, user, subject (polymorphic) |

All models support soft deletes. Activities use a polymorphic `subject` relationship.

---

## 🧩 Extensibility

The architecture is designed for future expansion:

- **New ERP modules** — Add migration + model + controller + service + frontend page
- **Workflow engine** — Add a `workflows` module with trigger/action architecture
- **Reporting** — Add aggregate queries in services, chart components in frontend
- **AI assistant** — Add an `AiController` with OpenAI/Anthropic integration
- **Multi-tenancy** — Add `tenant_id` to models and global scopes
- **Mobile apps** — Sanctum token auth is already mobile-ready (Passport upgrade is seamless)

---

## 🛠️ Development

### Backend
```bash
cd backend
php artisan make:model NewModel -mcrs    # Model + migration + controller + seeder
php artisan migrate:fresh --seed         # Reset database
php artisan route:list                   # List all routes
php artisan test                         # Run tests
```

### Frontend
```bash
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint check
```

---

## 🔒 Security

- API authentication via Laravel Sanctum (Bearer tokens)
- Role-based access control via Spatie Permission
- Form Request validation on all write endpoints
- CORS configured for frontend domain only
- Passwords hashed with bcrypt
- SQL injection protected via Eloquent ORM
- Mass assignment protected via `$fillable`

---

## 📋 What's Included

- [x] Authentication (login, logout, forgot/reset password, email verification)
- [x] Dashboard with stats, recent activities, quick actions
- [x] Sidebar navigation with Vristo design (dark navy)
- [x] Header with profile dropdown
- [x] Role-based menu rendering
- [x] Users CRUD
- [x] Roles CRUD + permission sync
- [x] Permissions CRUD
- [x] Customers CRUD + detail view
- [x] Leads, Opportunities, Tasks, Activities (list views)
- [x] Companies module (API-ready)
- [x] Reusable Table, Modal, SearchBar, StatCard, ConfirmDialog components
- [x] Axios service layer with auth interceptors
- [x] usePagination hook for all list pages
- [x] TypeScript types for all entities
- [x] Zustand auth store with persistence
- [x] Consistent API response format
- [x] Soft deletes on all major models
- [x] Database seeders (roles, permissions, demo users)

---

## 📄 License

MIT License — built for the Nusarix ERP & CRM Platform.
