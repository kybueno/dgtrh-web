
## **Migration Plan: Nuxt 4 + Prisma + PostgreSQL (No Supabase)**

### **Phase 1: Infrastructure Setup**

#### **1.1 Dependencies & Configuration**
- Remove `@nuxtjs/supabase` from dependencies
- Add Prisma packages: `@prisma/client`, `@prisma/adapter-pg`, `pg`, `prisma`
- Add JWT authentication: `jose`, `bcryptjs`
- Add validation: `zod`
- Set up Docker PostgreSQL connection

#### **1.2 Prisma Schema Creation**
```prisma
// Core models based on existing database analysis:
model User {           // Authentication users
model Worker {         // Employee data  
model Profile {        // User-Worker linkage
model Incident {       // HR incidents
model Payroll {        // Payroll management
model Holiday {        // Vacation/holiday data
// ... other models
```

#### **1.3 Database & Prisma Setup**
- Initialize Prisma with PostgreSQL adapter
- Create migration files
- Set up seed data for development
- Configure environment variables

### **Phase 2: Authentication System**

#### **2.1 Custom JWT Session Auth**
- Create Nitro server routes for authentication:
  - `POST /api/auth/login`
  - `POST /api/auth/register` 
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
- Implement JWT token generation/validation
- Session management with secure HTTP-only cookies
- Password hashing with bcryptjs

#### **2.2 Auth Utilities**
```typescript
// server/utils/auth.ts
export async function verifyToken(token: string)
export async function hashPassword(password: string)
export async function createSession(userId: string)
// Auto-imported auth middleware for protected routes
```

### **Phase 3: API Layer Migration**

#### **3.1 Server Routes (Nitro)**
Replace Supabase client calls with Prisma:
```typescript
// Before: supabase.from("workers").select()
// After: prisma.worker.findMany()
```

#### **3.2 Store Refactoring**
- Update Pinia stores to use `/api/*` endpoints
- Maintain reactive patterns
- Implement proper error handling
- Keep existing loading states

### **Phase 4: UI Components & Pages**

#### **4.1 Component Updates**
- Remove `useSupabaseClient()` usage
- Update to `useFetch()` for API calls
- Maintain all existing UI components (90%+ reusable)
- Update authentication components for new flow

#### **4.2 Authentication Pages**
- Recreate login/register pages with forms
- Add password fields (since Supabase used email+password)
- Implement session-based protected routes

### **Phase 5: PDF Generation**
- Keep existing `nuxt-pdfmake` implementation
- Update data sources from API responses
- Maintain all document types (prenómina, certificates, etc.)

### **Implementation Order**

**Step 1:** Install dependencies & remove Supabase
**Step 2:** Set up Prisma with local PostgreSQL  
**Step 3:** Create JWT authentication system
**Step 4:** Migrate core API routes (workers, auth)
**Step 5:** Update stores and components
**Step 6:** Add seed data and test
**Step 7:** Migrate remaining features (incidents, payroll)
**Step 8:** Final testing and optimization

### **Key Benefits of This Approach**

✅ **No external dependencies** - Complete control over auth and data
✅ **Better performance** - Local development, no latency
✅ **Type safety** - Full Prisma type generation  
✅ **Maintainable** - Standard stack (Nuxt + Prisma + PostgreSQL)
✅ **Reusable UI** - Keep 90%+ of existing components
✅ **Session-based auth** - More reliable than Supabase auth

Would you like me to start implementing this migration plan? I'll begin with Phase 1 (infrastructure setup) and work through each step systematically.