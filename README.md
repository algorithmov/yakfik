# Yakfik

**An AI-powered food delivery price & deal comparison platform for Qatar**

> A "Google Flights" for food delivery — tell it what you want and your budget, it tells you where to get the best deal, right now.

Yakfik aggregates deals, discounts, and prices from Qatar's major food delivery apps (Snoonu, Talabat, Keeta, and Rafeeq) into a single platform. Users describe what they want in natural language, and the AI recommends the best meal at the best price.

---

## Table of Contents

- [Concept Overview](#concept-overview)
- [How It Works](#how-it-works)
- [Market Opportunity](#market-opportunity)
- [Technical Architecture](#technical-architecture)
- [Data Strategy](#data-strategy)
- [Implementation Roadmap](#implementation-roadmap)
- [Go-to-Market Plan](#go-to-market-plan)
- [Monetization Options](#monetization-options)
- [Early Success Metrics](#early-success-metrics)
- [Things to Watch](#things-to-watch)

---

## Concept Overview

Instead of opening multiple apps and manually comparing prices and offers, Yakfik does the searching and comparing on the user's behalf. It functions as a smart search engine for food-delivery deals in Qatar and can evolve into a personal ordering assistant that learns preferences over time.

## How It Works

1. **User describes their request naturally**
   Example: *"I want a spicy chicken burger with fries and a drink, budget under QAR 30."*
2. **AI parses the request** and identifies matching restaurants and meals.
3. **App compares prices and available offers** across Snoonu, Talabat, Keeta, Rafeeq (and others).
4. **Final price is calculated** — including discounts, delivery fees, and active promotions.
5. **Best options are displayed**, ranked by price, deal value, rating, and delivery time.
6. **User selects an offer** and is redirected to the relevant delivery app to complete the order.

## Market Opportunity

Qatar's food delivery market is highly competitive:

- **Keeta** (Meituan) entered with aggressive vouchers and free-delivery promotions.
- **Snoonu** is backed by Jahez.
- **Talabat** operates under Delivery Hero's regional network.
- **Rafeeq** rounds out the local landscape.

With four major platforms constantly running different prices and promotions, no single app gives users the full picture. Yakfik fills this gap by showing the best deal at a glance — especially valuable while platforms actively compete on price.

## Technical Architecture

Yakfik operates as a smart layer on top of the food-delivery ecosystem.

### Data Sourcing

Restaurant, meal, price, and delivery-fee data is built from:

- Restaurant-submitted listings (self-service dashboard)
- Direct partnerships

Restaurants opt in and share pricing because they receive value in return (visibility + competitive insights).

### Data Normalization

All sources are converted into a unified format so the same restaurant or meal can be compared across apps. Handles variations by branch and item customization.

**Example — Chicken Burger + Fries**

| Item | Snoonu | Talabat | Keeta | Rafeeq |
|---|---|---|---|---|
| Chicken Burger + Fries | QAR 27 | QAR 29 | QAR 24 | QAR 26 |

### AI-Powered Search

Users describe requests in natural language. The model converts them into searchable criteria:

- Cuisine type
- Quantity
- Budget
- Preferences
- Rating
- Location

### Comparison Engine

Calculates the true cost of each option by factoring in:

- Food price
- Discounts
- Delivery fees
- Minimum order requirements
- Service fees
- Offers and coupons
- Delivery time

### Recommendation Engine

Results are presented from multiple angles:

- **Cheapest:** QAR 24
- **Best Value:** QAR 27
- **Fastest:** 25 minutes
- **Highest Rated:** 4.8 / 5

### Redirect to Order Platform

Users are routed to the matching delivery app's restaurant page to complete checkout. Payment and fulfillment stay with the delivery platform.

## Data Strategy

Pricing data is built on relationships, not scraping:

- Restaurants submit and maintain their own pricing via a self-service dashboard.
- As the platform grows, direct data-sharing partnerships with delivery apps become the natural next step.
- This approach stays legally clean and scales cleanly.

## Implementation Roadmap

### Stage 1 — Compare & Redirect
Launch with a curated set of restaurants that submit their own pricing. Users search → compare → tap through to the restaurant's page in the matching delivery app.

**Unlocks:** Fast, low-cost way to prove demand and build restaurant relationships.

### Stage 2 — AI-Assisted Cart Preparation
With a delivery-platform partnership, the AI pre-builds the order.

Example: *"I want a chicken burger, no onions, with fries and a drink, budget QAR 35"* → **Keeta — QAR 29:** Chicken Burger, Fries, Cola, No onions → *"Your order is ready — QAR 29 [Review & Pay]"*.

**Unlocks:** Significantly faster ordering experience.

### Stage 3 — Full Marketplace
Yakfik becomes the ordering layer itself:

`Your App → Partner APIs → Cart Creation → Order Confirmation → Payment → Delivery`

Users never need to open the other apps.

**Unlocks:** Unified ordering and payment experience across every major platform in Qatar.

## Go-to-Market Plan

1. Launch MVP with hand-picked restaurants that submit pricing directly.
2. Offer restaurants a companion tool showing how their pricing compares to competitors (early revenue + deeper relationships).
3. Approach delivery platforms for data-sharing partnerships (starting with those that gain most from extra visibility — e.g. Keeta or Rafeeq).
4. Expand into AI-assisted cart preparation and eventually a full marketplace once partnerships are in place.

## Monetization Options

- Restaurant "competitive pricing insight" subscription (strong early revenue stream)
- Affiliate / referral commission on redirected orders
- Sponsored restaurant placement (clearly labeled)
- Aggregated demand insights licensed to restaurants and platforms

## Early Success Metrics

- Restaurant sign-ups and retention on the pricing-insight tool
- Monthly active users and repeat-search rate
- Search-to-click-through rate on redirected orders
- Number of delivery platforms with active data-sharing partnerships

## Things to Watch

- **Competitive response:** The comparison feature itself is easy to copy. The durable asset is restaurant relationships and partnerships.
- **Price freshness:** Platforms run frequent promotions. Frequent refreshes + visible "last updated" timestamps are essential.
- **Pricing complexity:** Same item can vary by branch and customization — invest early in the normalization layer.
- **Engineering sequencing:** AI/NLU search is relatively quick to build. Focus early effort on data quality, coverage, and the restaurant dashboard.