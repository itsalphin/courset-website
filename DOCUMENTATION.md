# COURSET -- Project Documentation

## 1. Project Overview

**COURSET** is a luxury e-commerce website selling handcrafted pickleball-inspired jewelry. The site spans three product tiers (Victory, Signature, Legacy), offers a full customization studio, style quiz recommendations, Stripe checkout, JWT-based auth, and white-glove concierge services.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.2 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Animations | Framer Motion 12 |
| 3D | Three.js 0.183 + React Three Fiber 9 + Drei 10 |
| Database | SQLite via libSQL + Prisma 7.6 ORM |
| Auth | Custom JWT (access + refresh tokens) + Argon2id password hashing |
| Payments | Stripe Checkout Sessions + Webhooks |
| Email | Nodemailer (SMTP) |
| Validation | Zod 4 |
| Icons | Lucide React |
| React | React 19.2.4 |

### Architecture

- **Server**: Next.js App Router with API routes under `src/app/api/`
- **Client**: React client components with context providers (Auth, Cart)
- **Database**: SQLite file (`dev.db`) accessed via Prisma with libSQL adapter
- **Security**: Multi-layer -- middleware CSRF, rate limiting, WAF/IP blocking, RBAC, audit logging, field encryption (AES-256-GCM)
- **Rendering**: Most pages are client-rendered (`'use client'`); the customize page exports server metadata

---

## 2. Directory Structure

```
courset/
  .env                          Environment variables
  Dockerfile                    Multi-stage production build
  docker-compose.yml            Docker Compose config
  next.config.ts                Next.js config (security headers, image optimization)
  package.json                  Dependencies and scripts
  prisma.config.ts              Prisma CLI config (datasource URL)
  tsconfig.json                 TypeScript config (strict, path aliases)
  prisma/
    schema.prisma               Database schema (9 models)
  public/
    images/                     Product and editorial images
    models/                     3D model assets
    videos/                     Video assets (concierge, craftsmanship)
  src/
    middleware.ts                Edge middleware (CSRF, null-byte WAF)
    app/
      layout.tsx                Root layout (fonts, Providers wrapper)
      globals.css               Design system (CSS variables, Tailwind theme)
      page.tsx                  Homepage
      error.tsx                 Global error boundary
      not-found.tsx             404 page
      robots.ts                 robots.txt generation
      sitemap.ts                sitemap.xml generation
      cart/page.tsx             Shopping bag page
      collections/page.tsx      All collections page (Victory, Signature, Legacy)
      concierge/page.tsx        Concierge / consultation booking page
      customize/page.tsx        Customization studio page
      login/page.tsx            Login / register page
      profile/page.tsx          User profile / dashboard page
      story/page.tsx            Brand story page
      api/
        auth/
          login/route.ts        POST -- login
          register/route.ts     POST -- register
          logout/route.ts       POST -- logout
          refresh/route.ts      POST -- token refresh
          reset-password/route.ts  POST -- request reset, PUT -- execute reset
        checkout/route.ts       POST -- create Stripe checkout session
        webhook/route.ts        POST -- Stripe webhook handler
        price-estimate/route.ts POST -- customization price calculator
        style-quiz/route.ts     POST -- style quiz recommendations
        admin/
          orders/route.ts       GET -- list all orders (admin)
          users/route.ts        GET -- list all users (admin)
    components/
      Providers.tsx             Wraps app in AuthProvider + CartProvider
      ai/
        StyleQuizModal.tsx      5-step style quiz modal with product recommendations
      customization/
        DiamondSelector.tsx     Diamond toggle, size/cut/clarity selectors
        JewelryPreview.tsx      2D SVG preview of customized jewelry
        KaratSelector.tsx       Karat (10-24K) and metal type selector
        PriceCalculator.tsx     Live price breakdown display
        ProductSelector.tsx     Product picker grid grouped by collection
        ShapeSelector.tsx       Shape selector (paddle, ball, court, net, custom)
      layout/
        Footer.tsx              Site footer with newsletter, link columns
        Navigation.tsx          Fixed header nav with mobile overlay
      sections/
        BrandStory.tsx          Origin story with alternating text/image layout
        CollectionGrid.tsx      Responsive product card grid
        CollectionHero.tsx      Full-width split hero for each collection
        CollectionPreview.tsx   Homepage collection teaser cards
        CollectionStory.tsx     Generic collection section wrapper
        Community.tsx           Testimonials and community image grid
        CompleteTheSet.tsx      Horizontal scroll complementary products
        Craftsmanship.tsx       Materials, process, certification, guarantee
        CustomizationStudio.tsx Full customization page with state management
        EditorialDivider.tsx    Dark full-width quote divider
        Hero.tsx                Homepage hero with parallax and synced entrance
        ProvenanceStrip.tsx     Trust badges strip (GIA, ethical, warranty, shipping)
        StyleQuiz.tsx           Style quiz CTA section
        WhiteGlove.tsx          Concierge services section (consultation, sizing, bespoke)
      three/
        JewelryModel.tsx        Three.js mesh with PBR metal materials
        ProductViewer3D.tsx     Lazy-loaded 3D viewer wrapper
        ThreeCanvas.tsx         R3F Canvas with OrbitControls and environment
      ui/
        AnimatedImage.tsx       Next/Image with fade-in on load
        Button.tsx              Multi-variant button (primary/secondary/ghost, sm/md/lg)
        ConciergeButton.tsx     Fixed floating concierge FAB
        PriceDisplay.tsx        Formatted price text
        ProductCard.tsx         Product card with image, badges, add-to-bag
        Reveal.tsx              Scroll-triggered fade-in animation wrapper
        SectionLabel.tsx        Uppercase accent label
        TrustBadge.tsx          Icon + label trust indicator
    hooks/
      useARSupport.ts           Detects WebXR immersive-AR support (mobile only)
      useReducedMotion.ts       Wraps Framer's useReducedMotion with safe transitions
      useScrollProgress.ts      Scroll-linked progress value and parallax transform
    lib/
      animations.ts             Animation presets (fadeInUp, fadeIn, fadeInLeft, etc.)
      auth-context.tsx          AuthProvider with login/register/logout + localStorage
      cart-context.tsx           CartProvider with useReducer + localStorage persistence
      pricing.ts                Price calculator (base, karat multiplier, metal surcharge, diamond)
      products.ts               Product catalog (16 products) + query helpers
      rate-limit.ts             In-memory sliding window rate limiter
      recommendations.ts        Quiz answer scoring and product recommendation engine
      types.ts                  TypeScript interfaces (Product, CustomizationState, QuizAnswers, etc.)
      server/
        audit.ts                Audit logging, IP blocking, RBAC permissions
        auth.ts                 Password hashing, JWT, sessions, refresh tokens, field encryption
        db.ts                   Prisma client singleton
        email.ts                Transactional email templates (reset, login alert, order confirmation)
        middleware.ts           Composable middleware (withAuth, withPermission, withRateLimit, withWAF, withCSRF)
        stripe.ts               Stripe checkout session creation + webhook verification
    generated/
      prisma/                   Prisma-generated client code (auto-generated, committed for deployment)
```

---

## 3. Pages

### `/` -- Homepage
Client component. Sections: Hero (parallax, synced image load), Story teaser, Style Quiz CTA, Collection Preview (3 tiers), Editorial Divider, Concierge teaser. Uses `Navigation` (light variant), `Footer`, floating `ConciergeButton`, and `StyleQuizModal`.

### `/collections` -- Collections
Displays all three collections in sequence. Each has a `CollectionHero` (full-width split with image), then a `CollectionGrid` of products. Signature section includes `CompleteTheSet` cross-sell. Legacy section includes `ProvenanceStrip` trust badges. Dark editorial dividers between sections.

### `/customize` -- Customization Studio
Server-exported metadata. Renders `CustomizationStudio` which provides a `useReducer`-based state machine for shape, karat, metal, diamond, and engraving. Left panel: sticky product preview image. Right panel: `ProductSelector`, `ShapeSelector`, `KaratSelector`, `DiamondSelector`, engraving input, `PriceCalculator`. Has a compact mode (not currently used on this page).

### `/story` -- Brand Story
Hero section, full-width banner image, origin story, philosophy quote, `BrandStory` (alternating layout with video), `Craftsmanship` (4 info blocks + press mentions), `Community` (image grid + testimonials).

### `/concierge` -- Concierge
Hero, banner image, `WhiteGlove` service cards (virtual consultation with video, sizing kit, bespoke commissions), booking form (name/email/message), trust badges strip.

### `/cart` -- Shopping Bag
Reads cart from `useCart()` context. Empty state with CTA. Populated state: item list with image, name, collection, customization details, quantity controls (+/-), remove button. Sticky order summary sidebar with subtotal, complimentary shipping, total. Checkout button links to `/login`.

### `/login` -- Authentication
Toggleable login/register form. Login: email + password. Register: name + email + password (min 12 chars). On success, redirects to `/profile`. Calls `useAuth()` context methods.

### `/profile` -- User Dashboard
Protected route (redirects to `/login` if no user). Shows welcome header with name/email, logout button. Dashboard grid: Profile Details, Order History, Wishlist, Settings (all placeholder links). Recent orders section (placeholder empty state).

### `/error` -- Error Boundary
Client error boundary with "Try Again" button that calls `reset()`.

### `/not-found` -- 404
Static 404 page with "Return Home" link.

---

## 4. Components

### Layout

| Component | Props | Description |
|-----------|-------|-------------|
| `Navigation` | `variant?: 'light' \| 'dark'` | Fixed header. Scrolls to frosted-glass bg. Desktop horizontal links + icons, mobile full-screen overlay. Shows cart badge count. Links: Collections, Customize, Our Story, Concierge. |
| `Footer` | none | Dark bg footer. Newsletter email input. 4 link columns (Collections, Services, About, Contact). Copyright bar with Privacy/Terms links. |
| `Providers` | `children` | Wraps children in `AuthProvider` then `CartProvider`. |

### UI

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `children, variant?, size?, className?, onClick?, href?, type?` | Multi-variant button. Renders `<motion.a>` if `href` provided, else `<motion.button>`. Variants: primary (gold bg), secondary (outlined), ghost (accent outlined). Sizes: sm/md/lg. Micro-interactions on hover/tap. |
| `Reveal` | `children, delay?, direction?, className?` | Scroll-triggered entrance animation. Directions: up/left/right. Respects `prefers-reduced-motion`. |
| `AnimatedImage` | `src, alt, fill?, width?, height?, sizes?, className?, priority?, quality?` | Next/Image wrapper with opacity fade-in on load. |
| `ProductCard` | `product: Product, size?, onView3D?` | Product card: image with hover scale, 3D badge, AR badge (mobile), feature badges, name, price, diamond spec, "Add to Bag" button. |
| `PriceDisplay` | `price: string, size?, className?` | Formatted price in accent color. Sizes: sm/md/lg. |
| `ConciergeButton` | none | Fixed bottom-right FAB. Sparkles icon. Hover reveals "Virtual Concierge" tooltip. Links to `/concierge`. |
| `SectionLabel` | `children, className?` | Uppercase accent-colored section label. |
| `TrustBadge` | `icon: LucideIcon, label: string, className?` | Icon + label pair for trust indicators. |

### Sections

| Component | Props | Description |
|-----------|-------|-------------|
| `Hero` | none | Full-viewport hero. Parallax background image. Text entrance synced to image load. CTAs: "Explore Collections", "Customize Your Piece". Bouncing chevron at bottom. |
| `StyleQuiz` | `onOpenQuiz: () => void` | CTA section prompting the style quiz. |
| `CollectionPreview` | none | 3 collection teaser cards with images, taglines, price ranges. "View All Collections" button. |
| `CollectionHero` | `id, label, name, quote, narrative, ctaLabel, ctaHref, imageSide?, bgClass?, imageSrc` | Split-screen collection hero. Image on configurable side. Text with label, title, italic quote, narrative, arrow CTA. |
| `CollectionGrid` | `products: Product[], columns?: 2\|3` | Responsive grid of `ProductCard` components with staggered reveal. |
| `CollectionStory` | `id, label, headline, narrative, products, bgClass?, columns?, ctaLabel?, ctaHref?, children?` | Generic collection section: label, headline, narrative, product grid, optional children and CTA. |
| `CompleteTheSet` | `products: Product[]` | Horizontal scrolling complementary product strip. |
| `EditorialDivider` | `quote: string` | Dark background full-width quote with gold decorative lines. |
| `BrandStory` | none | Two-row alternating text/image layout. Second row includes a craftsmanship video. |
| `Craftsmanship` | none | 4 info blocks (Materials, Process, Certification, Guarantee), macro detail image, press mentions. |
| `Community` | none | Community image grid (8 images, masonry-style), 3 testimonial blockquotes, star rating. |
| `WhiteGlove` | none | 3 service cards: virtual consultation (with video), sizing kit, bespoke commissions. Trust badges strip at bottom. |
| `ProvenanceStrip` | none | Horizontal strip of trust badges (GIA, Ethically Sourced, Lifetime Warranty, Insured Delivery). |
| `CustomizationStudio` | `compact?: boolean` | Full customization interface. Compact mode shows product selector + preview with "Open Full Studio" link. Full mode: sticky left preview + scrollable right controls. State managed via `useReducer`. |

### AI

| Component | Props | Description |
|-----------|-------|-------------|
| `StyleQuizModal` | `open: boolean, onClose: () => void` | Animated modal. 5 questions (style, occasion, metal, diamond, budget). Progress dots. Loading state. Results show 4 recommended `ProductCard`s with personalized reasons. Uses client-side `getQuizRecommendations()` with 800ms simulated delay. |

### Customization

| Component | Props | Description |
|-----------|-------|-------------|
| `ProductSelector` | `selectedId: string, onSelect: (product) => void` | Grid of all 16 products grouped by collection. Thumbnail + name + price. Selected state with accent ring. |
| `ShapeSelector` | `selected, onSelect` | 5-option grid with SVG icons: Paddle, Ball, Court, Net, Custom. |
| `KaratSelector` | `karat, metalType, onKaratChange, onMetalChange` | Karat buttons (10K/14K/18K/24K). Metal buttons with color swatches (Yellow Gold, White Gold, Rose Gold, Platinum). |
| `DiamondSelector` | `diamond, onToggle, onSizeChange, onCutChange, onClarityChange` | Toggle switch. Animated expand/collapse of options. Carat sizes (0.25-2.0), cuts (Round/Princess/Cushion/Emerald), clarities (VS2 through IF). |
| `PriceCalculator` | `state: CustomizationState` | Live price breakdown: base piece, metal cost, diamond cost (conditional), total. "Begin Your Commission" CTA. Trust line. |
| `JewelryPreview` | `state: CustomizationState` | 2D SVG preview. Shape morphs between paddle/ball/court/net/custom. Metal color updates by karat and type. Diamond appears/scales based on settings. Gradient fills and shadows. |

### Three.js (3D)

| Component | Props | Description |
|-----------|-------|-------------|
| `ThreeCanvas` | `state: CustomizationState` | R3F Canvas. Studio environment. Ambient light. OrbitControls with auto-rotate. Contact shadows. `frameloop="demand"` for performance. |
| `JewelryModel` | `state: CustomizationState` | PBR mesh. Geometry changes by shape (sphere/box/torus). `MeshPhysicalMaterial` with per-karat metalness/roughness. Color lerps on change. Diamond as icosahedron with transmission material (IOR 2.42). |
| `ProductViewer3D` | `state: CustomizationState` | Lazy-loaded Suspense wrapper around `ThreeCanvas`. Pulse loading fallback. |

---

## 5. API Routes

### `POST /api/auth/register`
- **Body**: `{ email: string, password: string (min 12), name: string }`
- **Validation**: Zod strict schema, email normalized to lowercase
- **Rate limit**: 3 per hour per IP
- **Response**: `{ user: { id, email, name, role }, accessToken }` + sets `refreshToken` and `sessionToken` cookies
- **Errors**: 400 (validation), 409 (email exists), 429 (rate limited), 500

### `POST /api/auth/login`
- **Body**: `{ email: string, password: string }`
- **Rate limit**: 5 per 15 minutes per IP+email
- **Security**: Account lockout after 5 failed attempts (15 min). Timing-safe (doesn't reveal if email exists). Login alert email on new IP.
- **Response**: `{ user: { id, email, name, role }, accessToken }` + cookies
- **Errors**: 400, 401 (invalid credentials), 423 (locked), 429, 500

### `POST /api/auth/logout`
- Reads `sessionToken` cookie, invalidates session in DB
- Deletes `refreshToken` and `sessionToken` cookies
- **Response**: `{ success: true }`

### `POST /api/auth/refresh`
- Reads `refreshToken` cookie, rotates to new token pair
- **Security**: Detects token reuse (revokes entire family)
- **Response**: `{ accessToken }` + new `refreshToken` cookie
- **Errors**: 401 (missing or invalid token)

### `POST /api/auth/reset-password`
- **Body**: `{ email: string }`
- **Rate limit**: 3 per hour per IP
- Always returns `{ message: "If that email exists..." }` (no email enumeration)
- Sends reset email with 1-hour token

### `PUT /api/auth/reset-password`
- **Body**: `{ token: string, password: string (min 12) }`
- Validates token, hashes new password, invalidates all user sessions
- **Response**: `{ message: "Password has been reset." }`

### `POST /api/checkout`
- **Auth**: Bearer token required
- **Body**: `{ items: [{ productId, name, priceInCents, quantity, customization? }] }`
- **Rate limit**: 5 per minute per IP
- **Validation**: Zod strict (max 20 items, max 10 qty, max $100K per item)
- Creates Stripe Checkout Session with shipping address collection (US/CA/GB/AU)
- **Response**: `{ url: string }` (Stripe redirect URL)

### `POST /api/webhook`
- **Auth**: Stripe signature verification (not JWT)
- Handles `checkout.session.completed`: creates Order in DB, sends confirmation email
- Handles `payment_intent.payment_failed`: audit logs the failure
- **Response**: `{ received: true }`

### `POST /api/price-estimate`
- **Body**: Full `CustomizationState` object
- **Rate limit**: 30 per minute per IP
- **Validation**: Strict allowlist for all enum values
- **Response**: `PriceBreakdown { base, metalCost, diamondCost, total }`

### `POST /api/style-quiz`
- **Body**: `{ style, occasion, metal, diamond, budget }`
- **Rate limit**: 10 per minute per IP
- **Validation**: Strict allowlist for all values
- **Response**: `{ recommendations: [{ productId, reason }] }` (up to 4)

### `GET /api/admin/orders`
- **Auth**: Bearer token + `orders:read` permission
- **Query params**: `page`, `limit` (max 100), `status`
- **Response**: `{ orders, total, page, limit }` with user and items included

### `GET /api/admin/users`
- **Auth**: Bearer token + `users:read` permission
- **Query params**: `page`, `limit` (max 100)
- **Response**: `{ users, total, page, limit }` (excludes password hash, includes order count)

---

## 6. Libraries

### `types.ts`
Core interfaces: `Product` (16 fields including collection tier, category, badges, occasions, customizable, 3D/AR flags, complementary IDs, diamond spec). `CustomizationState` (shape, karat, metalType, diamond settings, engraving, baseProduct). `PriceBreakdown`. `UserProfile`. `QuizAnswers` (5 dimensions). `Recommendation`. `CustomizationAction` (discriminated union, 9 action types).

### `products.ts`
Static catalog of 16 products across 3 collections:
- **Victory** (6 products, $450-$890): Court Pendant, Rally Bracelet, Match Point Studs, Ace Pendant, First Win Ring, Drop Shot Charm
- **Signature** (6 products, $2,200-$5,200): Signature Ring, Heritage Charm Bracelet, Statement Court Pendant, Milestone Cuff, Custom Initial Earrings, Champion's Necklace
- **Legacy** (4 products, $7,000-$12,000): Dynasty Diamond Ring, Grand Slam Pendant, Legacy Championship Bracelet, Bespoke Commission

Helper functions: `getProductsByCollection()`, `getProductById()`, `getComplementaryProducts()`, `getProductsByOccasion()`.

### `pricing.ts`
Price engine. Base prices per product ID. Karat multipliers: 10K=1.0x, 14K=1.4x, 18K=1.85x, 24K=2.5x. Metal surcharges: yellow gold=$0, white gold=+$150, rose gold=+$200, platinum=+$800. Diamond prices per carat by clarity: VS2=$3K, VS1=$4.2K, VVS2=$5.8K, VVS1=$7.5K, IF=$12K. Cut modifiers: round=1.0, princess=0.85, cushion=0.9, emerald=0.95. `formatPrice()` uses `Intl.NumberFormat`.

### `animations.ts`
Framer Motion presets. `EASE = [0.25, 0.1, 0.25, 1.0]`. `DURATION = { fast: 0.3, normal: 0.5, slow: 0.8 }`. Presets: `fadeInUp`, `fadeIn`, `fadeInLeft`, `fadeInRight`, `staggerChildren()`.

### `cart-context.tsx`
React context + `useReducer`. Actions: `ADD_ITEM` (increments if exists), `REMOVE_ITEM`, `UPDATE_QUANTITY` (removes at 0), `CLEAR_CART`, `TOGGLE_CART`, `LOAD_CART`. Persists to `localStorage` key `courset-cart`. Exposes `state`, `dispatch`, `totalItems`, `totalPrice`.

### `auth-context.tsx`
React context with `useState`. Stores `user` (id, email, name, role) and `accessToken`. Restores from `localStorage` on mount (keys: `courset-user`, `courset-token`). Methods: `login()` calls `POST /api/auth/login`, `register()` calls `POST /api/auth/register`, `logout()` calls `POST /api/auth/logout`. All return `{ success, error? }`.

### `rate-limit.ts`
In-memory sliding window rate limiter. `Map<string, { count, resetAt }>`. `rateLimit(key, maxRequests, windowMs)` returns `{ allowed, remaining }`. Auto-cleanup of expired entries every 60 seconds.

### `recommendations.ts`
Quiz recommendation engine. Filters products by budget range and diamond preference. Scores by occasion match (+3), style match (+2), diamond preference (+2). Sorts by score descending, returns top 4 with generated reason strings.

### `server/db.ts`
Prisma client singleton. Uses `PrismaLibSql` adapter with `DATABASE_URL`. Global singleton pattern for development hot reload.

### `server/auth.ts`
- **Password hashing**: Argon2id (memoryCost 64MB, timeCost 3, parallelism 4)
- **JWT**: Access tokens (15 min, HS256), refresh tokens (7 days, stored as SHA-256 hash)
- **Refresh rotation**: Family-based detection -- reuse of a token revokes the entire family
- **Sessions**: 8-hour sessions with hashed tokens, IP and user-agent tracking
- **Account lockout**: 5 failed logins triggers 15-minute lockout
- **Password reset**: 1-hour token, marks as used, invalidates all sessions on reset
- **Field encryption**: AES-256-GCM with random IV and auth tag (for sensitive fields)

### `server/audit.ts`
- `logAudit()`: Writes structured audit events to DB (action, outcome, severity, IP, user-agent, details as JSON). Never throws.
- `isIPBlocked()` / `blockIP()`: IP blacklist with optional expiry
- **RBAC**: Role permission map. `superadmin` has wildcard. `admin` has user/order/product/audit access. `user` has own profile/orders. `guest` has product read only. `hasPermission()` and `requireRole()` helpers.

### `server/email.ts`
Nodemailer SMTP transport. In development, logs to console instead of sending. Templates:
- `sendPasswordResetEmail()`: Branded HTML with reset link (1-hour expiry)
- `sendLoginAlertEmail()`: IP, device, timestamp notification
- `sendOrderConfirmationEmail()`: Order ID and total with "Your Commission Has Begun" messaging

Includes DNS record recommendations (SPF, DKIM, DMARC).

### `server/middleware.ts`
Composable middleware functions:
- `withAuth(handler)`: Validates Bearer token, injects `user` into context
- `withPermission(permission, handler)`: Combines auth + RBAC check
- `withRateLimit(max, window, handler)`: IP-based rate limiting with Retry-After header
- `withWAF(handler)`: IP blacklist check + null byte detection
- `withCSRF(handler)`: Origin header validation for state-changing methods
- `compose(...middlewares)`: Right-to-left middleware composition

### `server/stripe.ts`
Lazy Stripe client initialization (API version `2025-03-31.basil`).
- `createCheckoutSession()`: Creates Stripe session with line items, customer email, userId metadata, shipping address collection (US/CA/GB/AU), success/cancel URLs.
- `constructWebhookEvent()`: Verifies Stripe webhook signature.

---

## 7. Database Schema

**Provider**: SQLite (via libSQL adapter)

### User
| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| email | String | Unique, indexed |
| passwordHash | String | Argon2id hash |
| name | String | |
| role | String | Default "user". Values: user, admin, superadmin |
| emailVerified | Boolean | Default false |
| mfaEnabled | Boolean | Default false |
| mfaSecret | String? | TOTP secret (prepared, not yet implemented) |
| recoveryCodes | String? | |
| failedLogins | Int | Default 0 |
| lockedUntil | DateTime? | Account lockout expiry |
| lastLoginAt | DateTime? | |
| lastLoginIp | String? | |
| createdAt | DateTime | |
| updatedAt | DateTime | Auto-updated |
| Relations | | sessions[], refreshTokens[], orders[], addresses[], auditLogs[] |

### Session
| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| userId | String | FK to User (cascade delete) |
| token | String | Unique, indexed (SHA-256 hash of actual token) |
| userAgent | String? | |
| ipAddress | String? | |
| expiresAt | DateTime | 8 hours from creation |
| createdAt | DateTime | |

### RefreshToken
| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| userId | String | FK to User (cascade delete) |
| tokenHash | String | Unique, indexed |
| familyId | String | Indexed; groups related tokens for reuse detection |
| used | Boolean | Default false |
| expiresAt | DateTime | 7 days from creation |
| createdAt | DateTime | |

### PasswordReset
| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| email | String | |
| tokenHash | String | Unique, indexed |
| used | Boolean | Default false |
| expiresAt | DateTime | 1 hour from creation |
| createdAt | DateTime | |

### Order
| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| userId | String | FK to User, indexed |
| status | String | Default "pending" |
| totalCents | Int | Price in cents |
| currency | String | Default "usd" |
| stripePaymentId | String? | Unique, indexed |
| stripeSessionId | String? | Unique |
| shippingAddress | String? | JSON string |
| notes | String? | |
| createdAt | DateTime | |
| updatedAt | DateTime | |
| Relations | | items[] (OrderItem) |

### OrderItem
| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| orderId | String | FK to Order (cascade delete), indexed |
| productId | String | |
| productName | String | Denormalized |
| quantity | Int | Default 1 |
| unitPriceCents | Int | |
| customization | String? | JSON string |

### Address
| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| userId | String | FK to User (cascade delete), indexed |
| label | String | Default "default" |
| fullName | String | |
| line1 | String | |
| line2 | String? | |
| city | String | |
| state | String | |
| postalCode | String | |
| country | String | Default "US" |
| isDefault | Boolean | Default false |

### AuditLog
| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| userId | String? | FK to User (nullable) |
| action | String | Indexed (e.g., "auth.login", "order.paid") |
| outcome | String | "success", "failure", "blocked" |
| resource | String? | |
| ipAddress | String? | |
| userAgent | String? | |
| details | String? | JSON string |
| severity | String | Default "info". Values: info, warn, critical |
| createdAt | DateTime | Indexed |

### BlockedIP
| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key |
| ipAddress | String | Unique, indexed |
| reason | String | |
| blockedAt | DateTime | |
| expiresAt | DateTime? | Auto-clears when expired |

---

## 8. Security Features

### HTTP Security Headers (next.config.ts)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 0` (modern approach, relies on CSP)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`: Disables camera, microphone, geolocation, payment, USB, magnetometer, gyroscope, accelerometer
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (production only)
- `Cross-Origin-Opener-Policy: same-origin` (production only)
- `Content-Security-Policy`: Restrictive policy, `frame-ancestors 'none'`, `form-action 'self'` (production only)
- `poweredByHeader: false`

### CSRF Protection (middleware.ts)
Edge middleware on all `/api/*` routes. Validates `Origin` header against `Host` for POST/PUT/DELETE/PATCH. Exempts Stripe webhooks (they have signature verification).

### WAF
- Null byte blocking in URLs (`%00`, `\0`) at both middleware and route level
- IP blacklist with expiry (`BlockedIP` model)
- Server identity removal (strips `x-powered-by` and `server` headers)

### Authentication Flow
1. **Registration**: Email + password (min 12 chars) validated with Zod -> Argon2id hash -> JWT access token (15m) + refresh token (7d cookie, httpOnly, secure, sameSite strict) + session token (8h cookie)
2. **Login**: Rate limited (5/15m per IP+email) -> account lockout check -> Argon2id verify -> reset failed login counter -> issue tokens + session -> login alert email on new IP
3. **Token refresh**: Reads httpOnly cookie -> SHA-256 hash lookup -> family-based reuse detection (revokes entire family on reuse) -> rotates to new token pair
4. **Logout**: Invalidates session in DB -> deletes cookies

### Rate Limiting
In-memory sliding window per route+IP:
- Login: 5 req / 15 min
- Register: 3 req / 1 hour
- Password reset: 3 req / 1 hour
- Checkout: 5 req / 1 min
- Price estimate: 30 req / 1 min
- Style quiz: 10 req / 1 min

### Field Encryption
AES-256-GCM with random IV and authentication tag. Used for sensitive fields. Key from `FIELD_ENCRYPTION_KEY` env var (64 hex chars = 256 bits).

### RBAC
Four roles: `superadmin` (wildcard), `admin` (users/orders/products/audit CRUD), `user` (own profile/orders, read products), `guest` (read products). Enforced via `withPermission()` middleware.

### Audit Logging
All security-relevant actions logged: login attempts (success/failure/blocked), registration, logout, token refresh failures, password resets, checkout creation, order payment, admin operations.

### Docker Security (docker-compose.yml)
- `read_only: true` filesystem
- `no-new-privileges` security option
- Non-root user (uid/gid 1001)
- Resource limits (1 CPU, 512MB RAM)
- tmpfs for /tmp

---

## 9. Design System

### Fonts
- **Display**: Cormorant Garamond (300-700, serif) -- headings, quotes, product names
- **Body**: Manrope (300-700, sans-serif) -- body text, labels, buttons

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | #FFFFFF | Main background |
| `--color-bg-secondary` | #F7F7F7 | Section backgrounds |
| `--color-bg-tertiary` | #ECECEC | Alternate sections |
| `--color-bg-inverse` | #1A1A1A | Dark sections, footer |
| `--color-text-primary` | #1A1A1A | Headings, primary text |
| `--color-text-secondary` | #6B6B6B | Body text |
| `--color-text-tertiary` | #767676 | Captions, labels |
| `--color-accent` | #C9A96E | Gold accent (buttons, highlights) |
| `--color-accent-text` | #8B7335 | Price text |
| `--color-accent-hover` | #B8944F | Button hover |
| `--color-success` | #4A7C59 | Success states |
| `--color-error` | #C44536 | Error states |

**Gold swatches**: `--gold-10k` through `--gold-24k`, `--white-gold`, `--rose-gold`, `--platinum`

### Typography Scale (fluid clamp)
- Hero: 3.5rem to 7rem
- Section title: 2rem to 3.5rem
- Collection title: 1.75rem to 2.5rem
- Body large: 1.125rem to 1.25rem
- Body: 1rem
- Caption: 0.875rem
- Label: 0.75rem

### Spacing (fluid clamp)
- Section: 5rem to 10rem
- Block: 3rem to 5rem
- Element: 1.5rem to 2.5rem
- Gutter: 1.25rem to 3rem

### Layout Widths
- Max width: 1440px
- Content width: 1200px
- Narrow width: 768px

### Shadows
- sm: `0 2px 4px rgba(0,0,0,0.04)`
- md: `0 4px 12px rgba(0,0,0,0.06)`
- lg: `0 8px 24px rgba(0,0,0,0.08)`
- hover: `0 8px 30px rgba(0,0,0,0.1)`

### Transitions
- Fast: 150ms
- Normal: 300ms
- Slow: 500ms
- Easing: `cubic-bezier(0.25, 0.1, 0.25, 1)`

### Accessibility
- `prefers-reduced-motion` respected (disables scroll-behavior, Reveal animations)
- Skip-to-content link in layout
- ARIA labels on interactive elements (nav buttons, cart badge, quantity controls, diamond toggle)
- `aria-live="polite"` on price calculator total

---

## 10. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite connection string. Default: `file:./dev.db` |
| `JWT_ACCESS_SECRET` | Yes | 256-bit secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Yes | 256-bit secret for signing refresh tokens |
| `SESSION_SECRET` | Yes | Secret for session tokens |
| `FIELD_ENCRYPTION_KEY` | Yes | 64 hex chars (256-bit key) for AES-256-GCM field encryption |
| `STRIPE_SECRET_KEY` | Yes | Stripe server-side secret key |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Stripe client-side publishable key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signature secret (`whsec_...`) |
| `SMTP_HOST` | Yes | SMTP server hostname (default: smtp.gmail.com) |
| `SMTP_PORT` | Yes | SMTP port (default: 587) |
| `SMTP_USER` | Yes | SMTP username/email |
| `SMTP_PASS` | Yes | SMTP password / app password |
| `EMAIL_FROM` | Yes | Sender display name and email |
| `NEXT_PUBLIC_APP_URL` | Yes | Public base URL (e.g., `https://courset.com`) |
| `NODE_ENV` | Auto | `development` or `production` |

---

## 11. Deployment

### Scripts
```bash
npm run dev          # next dev (development server)
npm run build        # prisma generate && next build
npm run start        # next start (production server)
npm run lint         # eslint
npm run postinstall  # prisma generate (runs after npm install)
```

### Docker (Production)

**Dockerfile** -- 3-stage multi-stage build:
1. `deps`: Alpine Node 20, installs production dependencies
2. `builder`: Copies deps, generates Prisma client, builds Next.js (telemetry disabled)
3. `runner`: Alpine Node 20, non-root user (`courset`, UID 1001), copies standalone output + static + prisma + generated. Health check on port 3000 every 30s.

**docker-compose.yml**:
- Reads secrets from environment variables (not embedded)
- Read-only filesystem with tmpfs for /tmp
- `no-new-privileges` security option
- Resource limits: 1 CPU, 512MB RAM
- Persistent volume for database (`db-data`)
- Restart policy: `unless-stopped`

```bash
docker compose up -d      # Start production
docker compose down        # Stop
```

### Vercel
- Standard Next.js deployment
- Prisma generated client committed to `src/generated/prisma/` for Vercel (no native binary compilation needed at build time with libSQL adapter)
- Environment variables set in Vercel dashboard
- `next.config.ts` disables `poweredByHeader` and adds security headers

---

## 12. Third-party Integrations

### Stripe
- **SDK**: `stripe` v22 (server), `@stripe/stripe-js` v9 (client, imported but not directly used yet)
- **API version**: `2025-03-31.basil`
- **Checkout**: Hosted Stripe Checkout Sessions with `payment` mode, card payments, shipping address collection (US/CA/GB/AU)
- **Webhook**: Handles `checkout.session.completed` (creates order, sends confirmation email) and `payment_intent.payment_failed` (audit log)
- **Metadata**: `userId` passed through session metadata for order attribution

### Email (Nodemailer)
- **Transport**: SMTP (Gmail by default, port 587, STARTTLS)
- **Templates**: 3 branded HTML email templates -- password reset, login alert, order confirmation
- **Development**: Console logging instead of sending
- **DNS**: SPF, DKIM, DMARC records recommended in code comments

### Prisma ORM
- **Version**: 7.6 with `prisma-client` generator
- **Adapter**: `@prisma/adapter-libsql` for SQLite/libSQL
- **Database**: SQLite file (`dev.db` in development, `prod.db` in production Docker)
- **Generated client**: Output to `src/generated/prisma/`, committed to repo for Vercel deployments
- **Config**: `prisma.config.ts` with datasource URL from `DATABASE_URL` env var
