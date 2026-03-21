# VectorWeave - Comprehensive Issues & TODO List

## 🚨 CRITICAL SECURITY ISSUES (P0 - Must Fix Before Deployment)

### 1. Backend Has No Authentication/Authorization
**Severity:** 🔴 CRITICAL
**File:** `backend/src/main/java/com/ezvector/backend/config/SecurityConfig.java:32`

**Problem:**
- All API endpoints are set to `.anyRequest().permitAll()`
- Anyone can access any user's data without authentication
- No JWT token validation from Supabase

**Impact:**
- Any user can access/modify ANY other user's cart by just knowing their Supabase user ID
- Orders can be created/viewed without authentication
- Complete bypass of authentication layer

**Example Attack:**
```bash
# Anyone can get another user's cart
curl http://yourapi.com/api/cart/some-other-users-id

# Anyone can delete items from another user's cart
curl -X DELETE http://yourapi.com/api/cart/some-other-users-id/clear
```

**Solution Required:**
- [ ] Add Supabase JWT token verification filter
- [ ] Validate JWT tokens on protected endpoints
- [ ] Verify user owns the resource they're accessing
- [ ] Change `permitAll()` to `authenticated()` for protected routes

---

### 2. Frontend API Client Doesn't Send Auth Headers
**Severity:** 🔴 CRITICAL
**File:** `frontend/src/services/api.ts`

**Problem:**
- Axios instance doesn't include auth headers
- `getAuthHeader()` function exists in `lib/auth.ts` but is never used
- Backend receives unauthenticated requests even for logged-in users

**Current Code:**
```typescript
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});
// No interceptor to add auth headers!
```

**Solution Required:**
- [ ] Add axios request interceptor to inject Supabase JWT token
- [ ] Handle token refresh logic
- [ ] Handle 401 responses and redirect to login

---

### 3. Supabase Database Security - No Row Level Security (RLS)
**Severity:** 🔴 CRITICAL
**Platform:** Supabase Dashboard

**Problem:**
- Unknown if RLS policies are configured on Supabase tables
- Backend uses direct database access bypassing Supabase Auth
- Tables may be publicly accessible

**Tables at Risk:**
- `customers`
- `orders`
- `carts`
- `cart_items`
- `backbones`
- `fragments`

**Solution Required:**
- [ ] Enable RLS on all tables in Supabase
- [ ] Create policies to restrict access to authenticated users
- [ ] Ensure users can only access their own data
- [ ] Test RLS policies thoroughly

---

## ⚠️ HIGH PRIORITY ISSUES (P1)

### 4. Missing Orders List Backend Integration
**Severity:** 🟡 HIGH
**File:** `frontend/src/pages/OrdersListPage.tsx:35`

**Problem:**
```typescript
// TODO: Fetch orders from backend
// For now, using empty array
setOrders([]);
```

**Missing Endpoint:**
- Need `GET /api/orders/{supabaseUserId}` to fetch user's order history

**Solution Required:**
- [ ] Create `GET /api/orders/{userId}` endpoint in `OrderController.java`
- [ ] Create `getOrders()` service method in `OrderService.java`
- [ ] Update `OrdersListPage.tsx` to fetch real data
- [ ] Add proper TypeScript types for order data

---

### 5. Stripe Webhook Not Tested
**Severity:** 🟡 HIGH
**File:** `backend/src/main/java/com/ezvector/backend/controller/StripeController.java:52-89`

**Problem:**
- Stripe webhook handler exists but testing status unknown
- Webhook secret configuration unclear
- Cart clearing after payment success not verified
- No error handling logs for failed webhook processing

**Current Flow:**
1. User completes Stripe payment
2. Stripe sends webhook to `/api/stripe/webhook`
3. Backend calls `cartService.checkoutCart(supabaseUserId)`
4. ⚠️ **Uncertain if this works**

**Solution Required:**
- [ ] Test webhook locally with Stripe CLI (`stripe listen --forward-to localhost:8080/api/stripe/webhook`)
- [ ] Verify webhook signature validation works
- [ ] Test cart clearing after successful payment
- [ ] Add proper error logging and monitoring
- [ ] Document webhook setup process

---

### 6. Input Validation & SQL Injection Prevention
**Severity:** 🟡 HIGH
**Files:** All controller files

**Problem:**
- No input validation on request bodies
- No sanitization of user inputs
- Potential for SQL injection via JPA queries
- No size limits on inputs (DNA sequences, plasmid names)

**Example Vulnerable Code:**
```java
@PostMapping("/add")
public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request) {
    // No validation of request fields!
    CartResponse response = cartService.addToCart(request);
}
```

**Solution Required:**
- [ ] Add `@Valid` annotation to request parameters
- [ ] Add validation annotations to DTO classes (`@NotNull`, `@Size`, `@Pattern`)
- [ ] Sanitize DNA sequences and plasmid names
- [ ] Add rate limiting to prevent abuse
- [ ] Use parameterized queries (JPA already does this, verify)

---

## 📋 MEDIUM PRIORITY ISSUES (P2)

### 7. Missing Environment Variables Configuration
**Severity:** 🟠 MEDIUM
**File:** `frontend/.env.production` (DELETED)

**Problem:**
- `frontend/.env.production` was deleted in recent commit
- Production environment variables not configured
- Risk of using development URLs in production

**Solution Required:**
- [ ] Recreate `frontend/.env.production`
- [ ] Add proper production backend URL
- [ ] Document required environment variables
- [ ] Add `.env.example` files for reference

**Required Variables:**
```
VITE_BACKEND_URL=https://your-production-api.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

### 8. CORS Configuration for Production
**Severity:** 🟠 MEDIUM
**File:** `backend/src/main/java/com/ezvector/backend/config/SecurityConfig.java:44`

**Problem:**
- CORS only configured for `localhost:5173` in many controllers
- `@CrossOrigin(origins = "http://localhost:5173")` hardcoded
- Won't work in production with different domain

**Solution Required:**
- [ ] Remove `@CrossOrigin` from individual controllers
- [ ] Use centralized CORS config in `SecurityConfig.java`
- [ ] Read allowed origins from environment variable
- [ ] Support multiple origins (dev + production)

---

### 9. Sensitive Data Encryption Evaluation
**Severity:** 🟠 MEDIUM

**Problem:**
- Unclear if sensitive data needs additional encryption
- Stripe API keys stored in environment variables (okay but verify)
- User PII (emails, names) stored in plain text in database
- No encryption at rest for sensitive fields

**Data to Review:**
- Stripe API keys (currently in env - GOOD)
- User emails/names (Supabase Auth - GOOD)
- DNA sequences (public data - okay?)
- Payment metadata (review)

**Solution Required:**
- [ ] Document what data is sensitive
- [ ] Verify Supabase encrypts at rest
- [ ] Ensure Stripe keys never logged
- [ ] Review if DNA sequences need encryption (likely not)

---

### 10. Branch Sync & Code Review
**Severity:** 🟠 MEDIUM

**Problem:**
- Multiple remote branches exist with unknown changes:
  - `remotes/origin/dev/auth`
  - `remotes/origin/1-landing-page`
  - `remotes/origin/2-order-page-implement-dynamic-plasmid-build-ui`
  - `remotes/origin/model-code`
- Potential important features or fixes in other branches
- Risk of losing work or duplicating effort

**Solution Required:**
- [ ] Review `dev/auth` branch for auth improvements
- [ ] Check `1-landing-page` for frontend updates
- [ ] Review `2-order-page-implement-dynamic-plasmid-build-ui` for OrderPage changes
- [ ] Merge or close stale branches
- [ ] Document branch strategy

---

## 🔧 NICE TO HAVE / ENHANCEMENTS (P3)

### 11. Error Handling Improvements
- [ ] Add global error handler for backend
- [ ] Standardize error response format
- [ ] Add user-friendly error messages
- [ ] Log errors to monitoring service

### 12. Type Safety Improvements
- [ ] Create TypeScript types matching Java DTOs
- [ ] Consider OpenAPI/Swagger for auto-generated types
- [ ] Add runtime validation with Zod

### 13. Testing
- [ ] Add backend unit tests for services
- [ ] Add integration tests for API endpoints
- [ ] Add frontend component tests
- [ ] Test Stripe webhook flow end-to-end

### 14. Performance Optimizations
- [ ] Add database indexes for common queries
- [ ] Implement caching for user backbones
- [ ] Optimize cart queries (reduce N+1 queries)
- [ ] Add pagination for orders list

### 15. Documentation
- [ ] Document API endpoints (OpenAPI/Swagger)
- [ ] Add README with setup instructions
- [ ] Document Stripe webhook setup
- [ ] Create deployment guide

---

## 📊 Summary by Priority

| Priority | Count | Issues |
|----------|-------|--------|
| 🔴 P0 (Critical) | 3 | Auth, JWT headers, RLS |
| 🟡 P1 (High) | 3 | Orders API, Stripe webhook, Input validation |
| 🟠 P2 (Medium) | 5 | Env vars, CORS, Encryption, Branch sync |
| 🔵 P3 (Nice to have) | 5 | Error handling, Testing, Docs, Performance |

**Total Issues:** 16

---

## 🎯 Recommended Order of Implementation

1. **Security First (P0):**
   - Add JWT validation to backend
   - Configure axios to send auth headers
   - Enable Supabase RLS

2. **Complete Core Features (P1):**
   - Add orders list endpoint
   - Test Stripe webhook
   - Add input validation

3. **Production Ready (P2):**
   - Fix environment variables
   - Update CORS config
   - Sync branches

4. **Polish (P3):**
   - Add tests
   - Improve error handling
   - Write documentation

---

## 🚀 Deployment Blockers

**DO NOT DEPLOY until these are fixed:**
- [ ] Backend authentication (Issue #1)
- [ ] Auth headers in API client (Issue #2)
- [ ] Supabase RLS policies (Issue #3)
- [ ] Environment variables (Issue #7)
- [ ] CORS for production (Issue #8)

---

*Generated: 2026-03-21*
*Project: VectorWeave - E-commerce Plasmid Builder*
