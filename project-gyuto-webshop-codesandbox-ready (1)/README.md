# CodeSandbox
Dra og slipp ZIP-filen i CodeSandbox (Create → Import), den starter automatisk.

# Project Gyuto – Webshop

En lettvekts nettbutikk (React + Vite + Tailwind) med produktbilder, filtre, handlekurv og enkel kasse (mock).

## Kom i gang
```bash
npm install
npm run dev
```

Åpne nettadressen i terminalen (typisk http://localhost:5173).

## Rediger produkter
- Fil: `src/products.json` (name, type, steel, finish, length, price, image, stock, variants).
- Bytt ut `image`-URL-ene med dine egne produktbilder.

## Stripe – testmodus (valgfritt)
Dette repoet har en enkel kasse som **simulerer** betaling. For ekte Stripe test:
1. Opprett Stripe-konto og et produkt/price i NOK.
2. Lag `.env` i prosjektroten med:
   ```
   VITE_STRIPE_PK=pk_test_...
   VITE_PRICE_ID_DEFAULT=price_...
   ```
3. Implementer Checkout Session i backend eller bruk Stripe's prebuilt Checkout client-only flow (anbefaler backend for ordrelinjer).

## Deploy
- Netlify/Vercel/Cloudflare Pages – bygges med `npm run build` og deploy mappen `dist/`.

## Lisens på bilder
- Bildene peker til Unsplash-URL-er som eksempel. Erstatt med egne produktfoto eller lisensierte bilder før produksjon.
