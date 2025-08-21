# Contextual References Guide

**Project**: FifaRun  
**Version**: 1.0  
**Last Updated**: 2025-08-21

## Quick Context Definitions

This guide provides quick context for key terms that appear throughout the documentation, designed for rapid reference without losing your place in the current document.

---

## 🔐 Authentication & Security

**Multi-Provider Auth** 
*Context: User signup and login system*
- Supports email, phone, Google, Apple authentication
- No initial KYC required for user onboarding
- **Details**: [Auth System](./01-project-requirements.md#core-features) | [User Flow](./02-app-flow.md#onboarding-and-sign-insign-up)

**2FA (Two-Factor Authentication)**
*Context: Security for sensitive operations*  
- Google Authenticator integration for financial transactions
- Required for high-stake matches and withdrawals
- **Details**: [Security Requirements](./01-project-requirements.md#tech-stack--tools) | [Implementation](./05-implementation-plan.md#crypto-wallet-integration)

**KYC (Know Your Customer)**
*Context: Identity verification for compliance*
- Deferred until high-stake play or withdrawal thresholds
- Integrated with Jumio, Onfido, or Persona providers
- **Details**: [Compliance](./01-project-requirements.md#constraints--assumptions) | [KYC Flow](./05-implementation-plan.md#kyc-integration)

---

## 🎮 Gaming & Challenges

**AI Matchmaking**
*Context: Intelligent opponent pairing*
- GPT-4o powered system analyzing skill, style, location
- Considers player history and preferences for fair matches
- **Details**: [Core Features](./01-project-requirements.md#core-features) | [Technical Implementation](./03-tech-stack.md#ai-and-machine-learning-services)

**Challenge System**
*Context: Match creation and management*
- Public/private matches with customizable stakes and rules
- Automated escrow for competitive matches
- **Details**: [Challenge Features](./01-project-requirements.md#core-features) | [User Flow](./02-app-flow.md#feature-flows)

**Console API Integration**
*Context: Automatic match result verification*
- PlayStation Network, Xbox Live, and PC platform integration
- Fallback to manual evidence submission when APIs unavailable
- **Details**: [Technical Architecture](./03-tech-stack.md#console-integration) | [Known Issues](./01-project-requirements.md#known-issues--potential-pitfalls)

**Skill Rating**
*Context: Player ability assessment*
- AI-generated numerical score for fair matchmaking
- Dynamic adjustment based on match performance
- **Details**: [Leaderboards](./01-project-requirements.md#core-features) | [AI Systems](./05-implementation-plan.md#advanced-ai-systems)

---

## 💰 Financial Systems

**Crypto Wallet**
*Context: Non-custodial cryptocurrency management*
- Cpay.world integration for secure deposits/withdrawals
- USD-based display with real-time conversion rates
- **Details**: [Wallet Features](./01-project-requirements.md#core-features) | [Technical Implementation](./03-tech-stack.md#crypto-payments)

**Cpay.world**
*Context: Third-party payment processor*
- Non-custodial gateway maintaining user control of private keys
- Multi-cryptocurrency support (Bitcoin, Ethereum, USDC)
- **Details**: [Payment Integration](./03-tech-stack.md#crypto-payments) | [Implementation Plan](./05-implementation-plan.md#crypto-wallet-integration)

**Escrow System**
*Context: Secure stake management*
- Smart contracts holding match funds until result verification
- Automatic payout to winner upon match completion
- **Details**: [Core Features](./01-project-requirements.md#core-features) | [User Experience](./02-app-flow.md#wallet-management)

**Platform Currency**
*Context: USD-equivalent internal currency*
- Crypto-backed currency displayed in familiar dollar amounts
- Real-time conversion rates for transparency
- **Details**: [Financial Systems](./01-project-requirements.md#core-features) | [Wallet Management](./02-app-flow.md#wallet-management)

---

## 👥 Social & Community

**Real-Time Chat**
*Context: Instant messaging system*
- Firebase Realtime Database for low-latency communication
- In-game chat, support channels, and group messaging
- **Details**: [Social Features](./01-project-requirements.md#core-features) | [Technical Implementation](./03-tech-stack.md#real-time-features)

**Firebase Integration**
*Context: Google's real-time services*
- Realtime Database for chat, Cloud Messaging for notifications
- Scalable infrastructure for thousands of concurrent users
- **Details**: [Technical Architecture](./03-tech-stack.md#real-time-features) | [Implementation](./05-implementation-plan.md#real-time-communication)

**Leaderboards**
*Context: Player ranking system*
- Global, regional, and friends-only rankings
- Achievement badges and trophies for milestones
- **Details**: [Core Features](./01-project-requirements.md#core-features) | [Social Features](./02-app-flow.md#social-features)

**Affiliate Program**
*Context: Referral commission system*
- Multi-tier structure: 10% Tier 1, 3% Tier 2, 1% Tier 3
- Crypto payouts with tracking dashboard
- **Details**: [Monetization](./01-project-requirements.md#in-scope-vs-out-of-scope) | [Implementation](./05-implementation-plan.md#affiliate-program)

---

## 🤖 AI & Machine Learning

**GPT-4o Integration**
*Context: OpenAI's advanced language model*
- Powers matchmaking, fraud detection, and dispute triage
- Analyzes gameplay patterns and evidence for decision support
- **Details**: [AI Services](./03-tech-stack.md#ai-and-machine-learning-services) | [Advanced Features](./05-implementation-plan.md#advanced-ai-systems)

**Fraud Detection**
*Context: Automated suspicious activity identification*
- GPT-4o analysis of gameplay patterns and historical behavior
- Risk scoring for transactions and match results
- **Details**: [AI Services](./03-tech-stack.md#ai-and-machine-learning-services) | [Security](./05-implementation-plan.md#advanced-ai-systems)

**Dispute Resolution**
*Context: AI-assisted conflict resolution*
- Evidence analysis with GPT-4o for fair dispute handling
- Moderator escalation for complex cases
- **Details**: [Core Features](./01-project-requirements.md#core-features) | [User Flow](./02-app-flow.md#dispute-resolution)

---

## ⚙️ Technical Infrastructure

**Next.js 14**
*Context: React-based web framework*
- App router with server-side rendering for optimal performance
- Code splitting and automatic optimizations
- **Details**: [Frontend Technologies](./03-tech-stack.md#frontend-technologies) | [Development Guidelines](./04-frontend-guidelines.md#frontend-architecture)

**React Native**
*Context: Cross-platform mobile development*
- Shared codebase for iOS and Android with native performance
- Component library shared between web and mobile
- **Details**: [Mobile Stack](./03-tech-stack.md#mobile-application-stack) | [Architecture](./04-frontend-guidelines.md#frontend-architecture)

**Supabase Platform**
*Context: Backend-as-a-Service infrastructure*
- PostgreSQL database with real-time capabilities
- Authentication, storage, and edge functions
- **Details**: [Backend Technologies](./03-tech-stack.md#backend-technologies) | [Implementation](./05-implementation-plan.md#backend-foundation)

**TypeScript**
*Context: JavaScript with static type checking*
- Compile-time error detection and enhanced IDE support
- Used across web, mobile, and backend components
- **Details**: [Frontend Stack](./03-tech-stack.md#web-application-stack) | [Development Standards](./04-frontend-guidelines.md#component-structure)

---

## 💼 Business & Monetization

**Freemium Model**
*Context: Three-tier subscription structure*
- Free (basic), Pro ($4.99/mo), Elite ($14.99/mo) plans
- Pay-per-match options for occasional players
- **Details**: [Monetization](./01-project-requirements.md#in-scope-vs-out-of-scope) | [Subscription System](./05-implementation-plan.md#subscription-system)

**Agent Dashboard**
*Context: Gaming studio management interface*
- Bulk player onboarding for gaming centers and shops
- Performance tracking and commission management
- **Details**: [Business Features](./01-project-requirements.md#in-scope-vs-out-of-scope) | [Implementation](./05-implementation-plan.md#agent-dashboard)

---

## How to Use This Guide

1. **Quick Reference** - Find immediate context without navigating away
2. **Deep Dive Links** - Click detailed links for comprehensive information  
3. **Cross-Referencing** - Use as a bridge between related concepts
4. **Development Aid** - Reference during implementation for context

---

**Navigation**: [← Back to Documentation](./README.md) | [Cross-Reference Index](./cross-reference-index.md) | [Glossary](./glossary.md)