# 🔐 DropVault — Secure Photo & PDF Storage Manager

DropVault is a clean, modern, full-stack **photo & PDF storage manager** designed to securely upload, store, preview, and manage files in the cloud.  
Built using **Next.js + TypeScript**, powered by **Clerk authentication**, **ImageKit uploads**, and **Postgres (Neon) with Drizzle ORM**.

🔗 **Live Demo:** https://www.dropvault.site/  
📦 **Tech Stack:** Next.js, TypeScript, TailwindCSS, Clerk Auth, ImageKit, Drizzle ORM, Neon Postgres

---

## ⭐ Features

### 🔐 Authentication & User Management
- Seamless login/signup using **Clerk Auth**
- Fully protected routes
- Secure session handling
- Zod validation for inputs

### 📤 End-to-End File Upload System
- Uploads handled via **ImageKit**
- Auto-generated **unique filenames**
- File type validation (Images + PDFs)
- Metadata stored in Postgres (Neon)
- Smooth upload experience with real-time status

### 🗂️ File Management System
- Designed schema using **Drizzle**
- View/manage all uploaded files
- File filtering by type
- Clean and responsive dashboard UI

### ⚡ Clean & Smooth Frontend UI
- Built with **Next.js App Router**
- Minimal, distraction-free design
- Smooth transitions and optimized rendering
- Continuous UI/UX polishing

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**
- **TypeScript**
- **TailwindCSS**
- **Zod** (validation)
- **Clerk Auth**

### Backend / Server Actions
- **Next.js App Router**
- **ImageKit**
- **Drizzle ORM**
- **PostgreSQL (Neon)**

### Database
- **Neon** (serverless Postgres)
- Drizzle migrations + schema

---

## 📦 Core Architecture

- **Next.js App Router** for full-stack routing  
- **Clerk** for auth and user identity  
- **ImageKit** as file upload + CDN layer  
- **Drizzle + Neon** for storing metadata  


---

## 🚀 Build-in-Public Progress

- 🔐 Clerk Auth integrated  
- 🧩 Sign-in & Sign-up components built  
- 📁 File schema designed  
- 📤 ImageKit upload system implemented  
- 🗂️ Metadata stored in Postgres  
- 🛠️ API routes wired  
- ⚡ Frontend UI polishing in progress  

---

## 🧪 Local Setup

```bash
git clone https://github.com/DevDilip28/DropVault
cd DropVault

pnpm install
pnpm dev

