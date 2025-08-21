# Project Requirements Document

**Project**: FifaRun  
**Version**: 1.0  
**Last Updated**: 2025-08-21

## Table of Contents
- [Project Overview](#project-overview)
- [In-Scope vs Out-of-Scope](#in-scope-vs-out-of-scope)
- [User Flow](#user-flow)
- [Core Features](#core-features)
- [Tech Stack & Tools](#tech-stack--tools)
- [Non-Functional Requirements](#non-functional-requirements)
- [Constraints & Assumptions](#constraints--assumptions)
- [Known Issues & Potential Pitfalls](#known-issues--potential-pitfalls)

## Project Overview

FifaRun is a global platform designed for FIFA players on PlayStation, Xbox, and PC to challenge each other to matches for real money using crypto payments or just for fun in free friendlies. It solves the problem of finding fair opponents, managing stakes securely, and fostering a social, competitive gaming experience across web and mobile.

The key objectives are to deliver a seamless, mobile-first experience with fast match discovery, secure crypto wallet handling, AI-driven fraud detection and matchmaking, robust dispute resolution, and viral growth through social sharing and affiliate/agent programs. Success is measured by user adoption, match volume, low dispute rates, and active community engagement.

## In-Scope vs Out-of-Scope

### In-Scope

- Multi-provider signup/login (email, phone, Google, Apple) without initial KYC
- AI-powered onboarding wizard for profile setup
- Challenge creation/joining (public/private, friendly/competitive, custom rules/stakes)
- Match discovery with search, filters, location/skill-based and GPT-4o matchmaking suggestions
- [**Crypto wallet**](./03-tech-stack.md#crypto-payments) with USD-based platform currency, real-time local conversion, [**escrow**](./02-app-flow.md#wallet-management), and transaction history
- [**Social features**](./02-app-flow.md#social-features): friends, groups, invite sharing (WhatsApp, SMS, social media, email)
- In-game and support chat via [**Firebase Realtime Database**](./03-tech-stack.md#real-time-features)
- Push and in-app notifications via [**Firebase Cloud Messaging**](./03-tech-stack.md#real-time-features)
- Freemium subscription plans (Free, Pro $4.99/mo, Elite $14.99/mo) plus pay-per-match options
- Multi-tier affiliate program (10% Tier 1, 3% Tier 2, 1% Tier 3) with crypto payouts
- Agent dashboard for gaming studios/shops to onboard and manage players
- [**Dispute center**](./02-app-flow.md#dispute-resolution) with evidence upload, GPT-4o triage, and moderator review
- Leaderboards (global, regional, friends-only), badges, trophies, AI-powered skill ratings
- Admin and moderator roles for platform oversight, user management, financial controls

### Out-of-Scope

- Mandatory KYC at sign-up (deferred until post-threshold)
- Localization beyond English at launch
- Integration with every console API (initially partial, with manual proof fallback)
- Offline or VR/AR features
- Third-party tournament integrations
- Advanced analytics beyond admin dashboards

## User Flow

New users land on the FifaRun web or mobile app and choose signup via email, phone, Google, or Apple. An [**AI-driven wizard**](./02-app-flow.md#onboarding-wizard) guides them to pick a gamer tag, upload an avatar, select platforms, and self-assess skill. They skip KYC until they join high-stake real-money matches. Upon completion, they arrive at the [**Home dashboard**](./02-app-flow.md#main-dashboard) where they see active challenges, personalized AI-match suggestions, and quick actions to create or discover matches.

Within the app, users browse or search for opponents by skill, location, or stake size, then create or join a challenge. Crypto funds are placed in escrow automatically. After playing, results are fetched via console APIs when possible or submitted manually by players; mutual confirmation or AI-fraud checks resolve outcomes. Disputes trigger the [**dispute center workflow**](./02-app-flow.md#dispute-resolution). Users can also manage their profile, wallet, subscription, and settings, plus affiliates and agents can access dedicated dashboards. Real-time chat and notifications keep everyone connected.

## Core Features

### User Authentication & Profiles
- Multi-provider login with optional KYC after threshold
- AI-generated skill rating and matchmaking preferences
- Profile customization with avatar, platforms, and gaming stats

### AI Onboarding Wizard
- Step-by-step profile and platform setup
- Skill assessment and preference configuration
- Seamless integration with main platform

### Challenge Lifecycle
- Create/join public or private, friendly or competitive matches
- Custom rules and stakes with escrow management
- Automated result fetching and manual confirmation options

### Match Discovery & AI Matchmaking
- Search and filter capabilities
- GPT-4o–powered pairing suggestions
- Location and skill-based recommendations

### Crypto Wallet & Payments
- Non-custodial deposits through [**Cpay.world integration**](./03-tech-stack.md#crypto-payments)
- Escrow logic for secure match stakes
- USD-based currency with local rate conversion
- Comprehensive transaction history

### Social & Communication
- Friends and groups management
- Invite sharing across multiple platforms
- [**Firebase Realtime Database chat**](./03-tech-stack.md#real-time-features)
- Community building features

### Dispute Resolution
- Evidence upload system
- AI triage with GPT-4o analysis
- Moderator review and escalation process
- Fair resolution mechanisms

### Affiliate & Agent Programs
- Multi-tier referral commission structure
- Dedicated dashboards for tracking and management
- Crypto payout system
- Gaming studio/shop integration

### Subscriptions & Monetization
- Freemium model with Free, Pro, and Elite tiers
- Pay-per-match fee options
- Platform commission structure

### Notifications
- Push alerts via Firebase Cloud Messaging
- In-app notification system
- Customizable notification preferences

### Leaderboards & Achievements
- Global, regional, and friends-only rankings
- Badge and trophy system
- AI-powered skill ratings and progression tracking

### Administration
- Admin and moderator control panels
- User, match, and financial management
- Platform oversight and moderation tools

## Tech Stack & Tools

- **Web Frontend**: [Next.js 14](./03-tech-stack.md#frontend-technologies) (app router), TypeScript, Tailwind CSS, shadcn UI
- **Mobile Frontend**: [React Native](./03-tech-stack.md#frontend-technologies) with TypeScript
- **Backend & Database**: [Supabase](./03-tech-stack.md#backend-technologies) for auth, PostgreSQL, storage, real-time
- **Crypto Payments**: [Cpay.world](./03-tech-stack.md#third-party-integrations) non-custodial gateway
- **Real-Time Chat**: [Firebase Realtime Database](./03-tech-stack.md#third-party-integrations)
- **Notifications**: [Firebase Cloud Messaging](./03-tech-stack.md#third-party-integrations) (push and in-app)
- **AI Services**: [GPT-4o](./03-tech-stack.md#backend-technologies) (fraud detection, dispute triage, matchmaking)
- **Security**: Google Authenticator 2FA, end-to-end encryption
- **KYC/Compliance**: Post-threshold integration with Jumio/Onfido/Persona

## Non-Functional Requirements

### Performance
- Page load times under 2 seconds
- Match discovery response under 500ms
- Real-time chat with minimal latency

### Scalability
- Support for 10,000+ concurrent users
- Real-time chat scaling capabilities
- Database optimization for growth

### Security
- 99.9% uptime requirement
- Encrypted data at rest and in transit
- Mandatory 2FA for financial operations
- Secure credential management

### Compliance
- GDPR compliance for user data
- Crypto transaction regulation adherence
- KYC integration for high-value transactions

### User Experience
- Mobile-first responsive design
- WCAG AA accessibility standards
- Intuitive navigation and clear error messaging

## Constraints & Assumptions

- **Supabase Dependency**: Covers most backend needs initially; may require microservices architecture later
- **KYC Deferral**: Delayed until after 20 real-money matches to reduce initial friction
- **Console API Limitations**: Initial integration may not cover all match types, requiring manual proof systems
- **Language Support**: English-only at launch with i18n framework prepared
- **AI Service Availability**: GPT-4o availability assumed via OpenAI API
- **User Knowledge**: Basic understanding of crypto concepts assumed

## Known Issues & Potential Pitfalls

### Console API Coverage
- **Issue**: Partial console API coverage requires manual proof submission
- **Mitigation**: Clear guidance and AI-powered verification checks

### Crypto Price Volatility
- **Issue**: Price swings may affect user perception of platform currency
- **Mitigation**: Real-time conversion rates and clear USD-equivalent displays

### Chat Scaling
- **Issue**: Firebase chat may need sharding for high usage
- **Mitigation**: Plan for migration to dedicated chat infrastructure

### Fraud Risk
- **Issue**: Delayed KYC increases potential for fraudulent activity
- **Mitigation**: AI-based monitoring and risk assessment systems

### Regional Restrictions
- **Issue**: Crypto regulations may require blocking certain geographical areas
- **Mitigation**: Compliance monitoring and geo-blocking capabilities

---

**Related Documents:**
- [User Flows & App Navigation](./02-app-flow.md)
- [Technical Architecture](./03-tech-stack.md)
- [Frontend Guidelines](./04-frontend-guidelines.md)
- [Implementation Roadmap](./05-implementation-plan.md)