# 📝 Multi-Tenant SaaS Notes App

A full-stack **multi-tenant SaaS Notes Application** built using the **MERN stack**.  
It supports **multi-tenancy, role-based access, subscription plans (Free/Pro)**, and a simple **invite-based onboarding flow**.  
The frontend is styled using **Tailwind CSS + Shadcn UI**, and global state is managed with **Zustand**.

---

## 🌐 Live Demo

🔗 **[Multi-Tenant SaaS Notes App](https://yardstick-assignment-neon.vercel.app/)**

---

## 🚀 Features

### 🏢 Multi-Tenancy

- Supports multiple tenants.
- Strict data isolation: notes and users are completely scoped by tenant.
- **Approach used:** Shared schema with a `tenantId` field on all tenant-scoped collections (Users, Notes).
- Ensures no cross-tenant data leakage.

### 🔐 Authentication & Authorization

- JWT-based login stored in **httpOnly cookies**.
- Roles:

  - **Admin:** Can invite users and upgrade the tenant’s subscription plan.
  - **Member:** Can create, read, update, and delete notes.

- Predefined test accounts (password: `password`):
  ```
  admin@acme.test     (Admin, tenant: Acme)
  user@acme.test      (Member, tenant: Acme)
  admin@globex.test   (Admin, tenant: Globex)
  user@globex.test    (Member, tenant: Globex)
  ```

### 📩 Invite Flow

- Admins can send invite links to new users.
- Invite tokens are emailed (or copied from UI) and allow new users to register under the correct tenant.

### 💳 Subscription Plans

- **Free Plan:** Max 3 notes per tenant.
- **Pro Plan:** Unlimited notes.
- Admins can call `POST /tenants/:slug/upgrade` to switch to Pro.
- Frontend shows “Upgrade to Pro” button once the note limit is hit.

### 📓 Notes CRUD API

- `POST /notes` – Create a note
- `GET /notes` – Get all notes of the current tenant
- `GET /notes/:id` – Get a specific note
- `PUT /notes/:id` – Update a note
- `DELETE /notes/:id` – Delete a note

Each request is fully scoped to the currently logged-in user’s tenant and enforces role-based permissions.

### 🌐 Deployment

- Deployed on **Vercel** (both backend and frontend).
- CORS enabled for cross-origin requests.
- `GET /health` endpoint returns `{ "status": "ok" }`.

---

## 🖥️ Frontend Stack

- React.js + Vite
- Tailwind CSS + Shadcn UI
- Zustand for global state
- Axios for API calls
- Cookie-based auth

**Main pages:**

- `LoginPage` — login with predefined accounts
- `NotesPage` — list, create, edit, delete notes
- `InviteUsersPage` — admin-only page to invite users
- `AcceptInvitePage` — register after accepting an invite
- `UpgradePlanButton` — upgrade tenant from Free → Pro

---

## ⚙️ Backend Stack

- Node.js + Express.js
- MongoDB (Mongoose ODM)
- JWT for auth
- Cookie-based sessions
- Role and tenant middleware for isolation

---

## 📦 Setup

### 1. Clone repo

```bash
git clone <your-repo-url>
cd saas-notes-app
```

### 2. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Environment variables

**Backend `.env`:**

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend `.env`:**

```
VITE_API_URL=http://localhost:5000
```

### 4. Run locally

```bash
# backend
cd backend
npm run dev

# frontend
cd frontend
npm run dev
```

Then open: [http://localhost:5173](http://localhost:5173)

---

## ✅ Healthcheck

`GET /health` → `{ "status": "ok" }`

---
