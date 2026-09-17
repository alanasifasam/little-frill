## 🌐 Live Demo

You can access the live application here: [**View the application**](https://brave-grass-0a0f0f51e.3.azurestaticapps.net/)

> **Note:** The backend is hosted on Azure using a free-tier plan and may be temporarily offline. If the application is unavailable, please contact the creator to have the backend started.

Front: https://brave-grass-0a0f0f51e.3.azurestaticapps.net/

back:https://littlefrill-deckh4fde0fuckha.westus3-01.azurewebsites.net/


# Little Frill

Full-stack e-commerce app for **Little Frill** (*by Arrais*) — a one-person sewing atelier
in Lisbon that makes handmade fabric goods (bags, pouches, laptop/Kindle sleeves, and baby,
kitchen and pet linens). Portuguese-only storefront, EUR pricing, shipping within Portugal
only, plus an admin back office for orders, stock, and site content.

> This is a **portfolio snapshot** of the real project. Day-to-day development happens in a
> private repository; this copy exists to show the codebase and approach to recruiters and
> other engineers.

## Architecture

The backend follows **Clean Architecture** in four layers, defined as a hard contract in
[`CLAUDE.md`](./CLAUDE.md):

- **Core** — entities, value objects, domain logic. No external dependencies.
- **Application** — use cases (application services), orchestrating repositories and
  infrastructure through interfaces only. Every service method returns a `Result` (Result
  Pattern — no exceptions for expected failures like "out of stock" or "not found").
- **Infrastructure** — repository implementations, persistence (EF Core + PostgreSQL),
  auth, and external services (Azure Blob Storage for product photos).
- **API** — thin controllers that call application services and translate `Result` into
  HTTP status codes. No business logic here.

The frontend is a React SPA: function components, hooks for data fetching and derived
state, no client-side business logic beyond what the API already decided (prices, totals
and stock are always server-authoritative).

## Tech stack

**Backend** — ASP.NET Core 8 · EF Core / Npgsql (PostgreSQL) · JWT authentication ·
Azure Blob Storage · manual DTO mapping (no AutoMapper) · Result Pattern instead of
exceptions for expected failures.

**Frontend** — React 19 · TypeScript · Vite · React Router · Axios.

**Infra** — Azure Static Web Apps (frontend) · Azure App Service (API, containerized via
Docker) · Azure Pipelines for CI/CD.

## Built with AI pair-programming (Claude Code)

This project doubles as hands-on practice with agentic coding workflows, as part of an
ongoing course on AI-assisted software engineering techniques. A few concrete pieces of
that workflow live directly in this repo:

- [`CLAUDE.md`](./CLAUDE.md) — the architecture contract described above (Clean
  Architecture, Result Pattern, no AutoMapper, React conventions) that every change is
  expected to follow, enforced through the coding agent rather than just documented.
- [`.claude/agents/dotnet-backend.md`](./.claude/agents/dotnet-backend.md) — a
  specialized subagent for backend work: applies Clean Architecture layering and the
  Result Pattern, enforces the project's domain rules (shipping costs, stock checks,
  order states), and refuses to cut corners like leaking business logic into a
  controller or a repository.
- [`.claude/agents/react-frontend.md`](./.claude/agents/react-frontend.md) — a
  specialized subagent for frontend work: ports screens from the approved prototype
  (`docs/prototipo/`) and the frontend/backend handoff spec
  (`docs/handoff-react-dotnet.md`) faithfully, enforcing the design tokens,
  accessibility rules, and copy that were already signed off — its job is translation
  into React, not redesign.
- The Azure deployment itself (Static Web Apps + App Service, CI pipeline, CORS,
  and a couple of real production bugs along the way) was set up and debugged through
  the same Claude Code workflow.

## Project structure

```
backend/LittleFrill/
  Core/            domain entities, interfaces
  Application/      use cases, DTOs/view models, Result-returning services
  Infrastructure/   EF Core persistence, Azure Blob Storage, auth
  Api/              ASP.NET Core controllers, DI wiring
frontend/
  src/api/           axios calls per resource
  src/components/    presentational + feature components
  src/hooks/         data-fetching and derived-state hooks
  src/pages/         route-level views (storefront + admin)
docs/
  handoff-react-dotnet.md   shared data model, endpoints, business rules
  prototipo/                approved static HTML/CSS prototype
.claude/agents/       the two subagents described above
CLAUDE.md              architecture contract for the whole repo
```

## Running locally

Backend (needs a local PostgreSQL instance):

```bash
cd backend/LittleFrill
dotnet run --project Api
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

`appsettings.Development.json` in this snapshot ships with placeholder credentials —
swap in your own local PostgreSQL connection string and admin seed values before running.
