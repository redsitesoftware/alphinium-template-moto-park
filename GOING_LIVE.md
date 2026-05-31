# Moto-Park — Going Live Checklist

## Overview
Community-sourced motorcycle parking map. Revenue via alphinium-ads + premium listings for parking operators.

## Step 1: Real Spot Submission
1. Add "Submit a Spot" screen — form with location picker (alphinium-maps)
2. Backend: store in Supabase/Firebase with moderation queue
3. Spots pending approval → admin dashboard review
4. Email confirm to submitter via alphinium-email

## Step 2: Live Map Data
- Replace `motoStore.js` hardcoded spots with API call:
  ```js
  GET /api/spots?lat=...&lng=...&radius=10km
  ```
- alphinium-maps cluster markers at zoom-out levels
- User location → "Spots near me" sorted by distance

## Step 3: Community Features
- Spot ratings (1-5 stars) — alphinium-reviews addon
- Comments ("Tight entrance, watch the kerb")
- Photos upload per spot
- "Verified by rider" badge after 3+ confirmations

## Step 4: Premium Listings (Revenue)
- Paid parking operators can claim/upgrade their listing: $15/mo
- "Premium" badge, photos, booking link, address highlight
- alphinium-payments for subscription billing

## Step 5: alphinium-ads
- Banner ads on spot detail pages
- Sponsored spots (appear at top of search results)
- Motorcycle gear affiliate ads (RevZilla, MotoNation, MCAS)

## Step 6: Deploy
1. `expo export` → `motopark.alphinium.com` or `motopark.app`
2. App stores (iOS/Android) — key platform for mobile users on the road
3. QR code sticker campaign — "Found good parking? Add it to Moto-Park" → growth hack

## Expansion
- Scooter/e-bike mode (broader TAM)
- Charging station layer for electric motorcycles
- Route planning with parking at destination
