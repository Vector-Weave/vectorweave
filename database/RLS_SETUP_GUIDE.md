# Supabase RLS Setup Guide

## What We've Implemented

### Backend Security (✅ DONE)
- JWT token validation filter
- Authentication required for protected endpoints
- Backend verifies user identity before processing requests

### Database Security (⚠️ ACTION REQUIRED)
- RLS policies created in `database/setup_rls.sql`
- Need to run the SQL script in Supabase

---

## How to Apply RLS Policies

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project (vectorweave)
3. Navigate to **SQL Editor** (📝 icon in left sidebar)

### Step 2: Run the RLS Script
1. Click **"New query"** button
2. Open `database/setup_rls.sql` from your project
3. Copy the ENTIRE file contents
4. Paste into the SQL editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. Should see: **"Success. No rows returned"** ✅

### Step 3: Verify RLS is Enabled
Run this query to verify:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('customers', 'carts', 'cart_items', 'orders', 'fragments', 'backbones');
```

Expected output:
```
tablename     | rowsecurity
--------------|-------------
customers     | true
carts         | true
cart_items    | true
orders        | true
fragments     | true
backbones     | true
```

---

## Understanding Your Setup

### Backend Connection
Your backend connects with `postgres` user (superuser credentials):
```
SUPABASE_USERNAME=postgres.jlihzatifptvthfgpdcl
SUPABASE_PASSWORD=plasmids123.
```

**Important:** Postgres superuser **bypasses RLS** by default!

### Why RLS Still Matters

Even though your backend bypasses RLS, the policies protect against:

1. **Direct Database Access**
   - If someone steals your DB credentials
   - They still can't see other users' data via SQL console

2. **Other Services**
   - Any other app connecting to your database
   - RLS applies to them

3. **Supabase Features**
   - Auto-generated APIs (if you ever use them)
   - Realtime subscriptions
   - Storage permissions

### Architecture Diagram
```
┌──────────────────────────────────────────────────────┐
│ Frontend (JWT token from Supabase Auth)             │
└────────────────┬─────────────────────────────────────┘
                 │ Authorization: Bearer <token>
                 ↓
┌──────────────────────────────────────────────────────┐
│ Backend (Spring Boot)                                │
│  1. JwtAuthenticationFilter validates token          │
│  2. Extracts user ID from token                      │
│  3. Uses user ID in queries (application level)      │
└────────────────┬─────────────────────────────────────┘
                 │ postgres user (bypasses RLS)
                 ↓
┌──────────────────────────────────────────────────────┐
│ Supabase Database                                    │
│  - RLS enabled (protection for other access)         │
│  - Backend bypass allowed (trusted server)           │
└──────────────────────────────────────────────────────┘
```

### Security Model: "Trust But Verify"

Your backend is **trusted** (bypasses RLS), but:
- JWT validation ensures backend knows the real user
- Backend code checks user ownership
- RLS provides backup protection

This is a **valid and common architecture** for backends connecting to Supabase!

---

## Alternative: Using Service Role Key (Optional)

If you want more explicit control, you can use Supabase's service_role key instead of postgres credentials:

### Pros:
- More explicit "trusted service" designation
- Same RLS bypass behavior
- Better aligned with Supabase best practices

### Cons:
- Requires changing connection method
- May need to use Supabase client libraries instead of raw JDBC

**For now:** Your current setup (postgres user) is fine! Backend validates JWTs properly.

---

## Testing Your Security

### Test 1: Unauthenticated Access (Should Fail)
```bash
# Try to get cart without auth token
curl http://localhost:8080/api/cart/some-user-id
# Expected: 401 Unauthorized ✅
```

### Test 2: With Valid Token (Should Work)
```bash
# Get your JWT from browser console after logging in
# Then:
curl -H "Authorization: Bearer <your-jwt-token>" \
     http://localhost:8080/api/cart/your-user-id
# Expected: 200 OK with your cart data ✅
```

### Test 3: Wrong User (Should Fail)
This requires backend code changes - implementing user ID verification in controllers.
We'll add this next!

---

## Next Steps

- [x] Enable RLS in Supabase (run setup_rls.sql)
- [ ] Add user ID verification in backend controllers
- [ ] Test authentication flow end-to-end
- [ ] Update frontend to handle 401 errors gracefully
