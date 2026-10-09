# WFH Mobile App (Next.js)

A mobile-friendly e-commerce frontend built with Next.js. It talks to a Django REST API (JWT authentication) for everything: accounts, products, cart, checkout, payments, and orders.

- **Live app:** https://wfh-mobile-app.vercel.app
- **Live API:** https://wfh-blog-app.onrender.com/api/
- **Backend repo:** https://github.com/SalmanShahzadAli/Python-Blog-Application

> **Note:** the backend runs on Render's free tier, which sleeps when idle. The first request after a quiet period (for example, the first login) can take 30-60 seconds. After that it responds normally.

## Features

1. **Register / Login** — JWT authentication against the Django API. New accounts must be approved by an admin before they can log in.
2. **Product listing** — browse products with images, price, and stock status; open a product for full details.
3. **Add to cart** — add items, change quantities, remove items. The cart is tied to the logged-in user via their JWT token.
4. **Checkout + payment** — shipping details form with an embedded Stripe card field. The card is charged client-side through Stripe, then the API re-verifies the payment with Stripe server-side before marking the order "Paid."
5. **My Orders** — list of past orders with status, and a detail page for each.
6. **Profile** — account email, username, and approval status, plus logout.

## Tech Stack

- Next.js (App Router, JavaScript)
- Tailwind CSS
- `@stripe/react-stripe-js` and `@stripe/stripe-js` for the embedded card form
- Django REST Framework + `djangorestframework-simplejwt` (backend)
- Hosted on Vercel (frontend) and Render (API)

## Project Structure

- `src/app/page.js` — root page; redirects to `/products` if logged in, otherwise `/login`
- `src/app/login/`, `src/app/register/` — authentication pages
- `src/app/products/` — product list and `[id]` detail page
- `src/app/cart/` — cart management
- `src/app/checkout/` — shipping form and Stripe payment
- `src/app/orders/` — order list and `[id]` detail page
- `src/app/profile/` — account info and logout
- `src/lib/api.js` — shared fetch wrapper that attaches the JWT access token to every request
- `src/lib/stripe.js` — shared Stripe.js instance

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root:
   ```
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key_here
   ```
   To use the live API instead of running the backend locally, set `NEXT_PUBLIC_API_URL=https://wfh-blog-app.onrender.com/api`.

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

Environment variables beginning with `NEXT_PUBLIC_` are baked in at build time. Restart the dev server after changing `.env.local`, and redeploy on Vercel after changing variables there.

## Backend Requirement

This app is a frontend only; it has no database or business logic of its own. It needs the Django API to be reachable at the URL in `NEXT_PUBLIC_API_URL`. The API must also allow this app's origin in its CORS settings (`http://localhost:3000` for local development and `https://wfh-mobile-app.vercel.app` for production). See the backend repo's README for setup details.

## Testing Payments

Stripe is in **test mode**, so no real charges occur. Use the test card:

```
Card number: 4242 4242 4242 4242
Expiry:      any future date
CVC:         any 3 digits
```

## Typical Test Flow

1. Register a new account.
2. An admin approves it in the Django admin (https://wfh-blog-app.onrender.com/admin/).
3. Log in, browse products, add to cart.
4. Check out with the test card above.
5. Confirm the order shows as "Paid" under My Orders.

## Known Simplifications

- No automated test suite.
- The client-side redirect to `/login` when no token is present is a convenience only. Real access control is enforced by the API on every request.
- Cart quantity changes send an API call on every keystroke rather than being debounced.
- Stripe is in test mode; live payments would require a verified Stripe business account.