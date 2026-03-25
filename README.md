# 🚀 Nusarix

> A modular, multi-tenant ERP & CRM platform built with Laravel, featuring metadata-driven architecture, RBAC, workflow automation, and AI-powered operations.

---

## 🧷 Badges

![Laravel](https://img.shields.io/badge/Laravel-13-red?logo=laravel)
![React](https://img.shields.io/badge/React-Inertia-blue?logo=react)
![Multi-Tenant](https://img.shields.io/badge/Multi--Tenant-stancl%2Ftenancy-green)
![RBAC](https://img.shields.io/badge/RBAC-Spatie-orange)
![Realtime](https://img.shields.io/badge/Realtime-Reverb-purple)
![AI](https://img.shields.io/badge/AI-Copilot-black)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## 🧠 Overview

**Nusarix** is a next-generation, enterprise-grade ERP & CRM platform designed to unify business operations into a single, scalable, and customizable system.

It is:

- 🧩 Modular architecture
- 🏢 Multi-tenant SaaS ready
- 🧠 Fully metadata-driven
- 🔐 Enterprise RBAC & scoped permissions
- ⚙️ Workflow automation engine
- 🤖 AI Copilot with action orchestration

---

## 🏗 Architecture

![Architecture](docs/architecture.png)

### Core Layers

- **Presentation Layer**
  - React + Inertia + Vistro
  - Central & Tenant portals
  - API layer

- **Application Core**
  - Tenancy (stancl/tenancy)
  - RBAC (spatie/permission)
  - Metadata engine
  - Workflow engine
  - AI engine

- **Infrastructure**
  - Redis (cache, queue, session)
  - Laravel Reverb (realtime)
  - Queue workers
  - File storage

---

## 🏢 Multi-Tenancy

- Subdomain & custom domain support
- Tenant-isolated databases
- Central + Tenant DB separation
- Plan-based module enablement
- Branch & organization hierarchy

---

## 🧬 Metadata Builder

Everything is configurable via metadata:

### Modules
- CRM, ERP, Reports, Workflow, AI, Workspace

### Objects
- Standard & custom objects
- Dynamic schema creation

### Fields
- Text, number, date, lookup, JSON
- Validation rules
- Field-level permissions

---

## 🧩 Layout Builder

Dynamic UI rendering:

- Listing (Table / Kanban / Calendar / Grid)
- Detail view
- Forms
- Dashboards
- Workspaces

Supports:
- Drag & drop layout builder
- Role-based layout visibility
- User personalization

---

## 📊 View & Filter System

- Default filters
- Saved filters
- Advanced query builder
- Multi-view support:
  - Table
  - Kanban (CRM style)
  - Calendar
  - Timeline

---

## ⚙️ Workflow Builder

- Drag & drop workflow designer
- Event triggers (create/update/schedule)
- Approval flows
- Notifications
- Webhooks & integrations

---

## 🤖 AI Copilot

AI-powered assistant that can:

- Query system data
- Suggest business actions
- Trigger workflows
- Generate insights & reports

### Guardrails
- RBAC validation
- Tenant/branch scope enforcement
- Full audit logging

---

## 🔐 RBAC & Scope

Permissions at:

- Module level
- Object level
- Field level
- Layout level

Scoped by:
- Tenant
- Organization
- Branch
- Role
- User

---

## 🗄 Database Design

### Central DB
- tenants
- domains
- plans
- subscriptions
- modules
- metadata definitions

### Tenant DB
- users
- organizations
- branches
- business records
- workflow runs
- AI logs
- documents

---

## ⚡ Infrastructure

- Redis → cache, queue, session
- Reverb → realtime events
- Queue Workers → async processing

---

## 📁 Project Structure

```
app/
 ├── Core/
 ├── Modules/
 ├── Metadata/
 ├── Workflow/
 ├── AI/
 ├── Services/

routes/
 ├── web.php
 ├── tenant.php
 ├── api.php
```

---

## 🎯 Goals

- Fully modular ERP + CRM platform
- Metadata-driven architecture
- AI-powered automation
- Enterprise scalability
- SaaS-ready multi-tenant system

---

## 🛣 Roadmap

- Metadata Builder UI
- Workflow Drag & Drop Builder
- AI Agent Builder
- Reporting Engine
- Mobile SDK
- Plugin Marketplace

---

## 🧠 Philosophy

> “Everything is metadata. Everything is configurable. Everything is controlled.”

---

## 📄 License

MIT License