# FifaRun Glossary

**Project**: FifaRun  
**Version**: 1.0  
**Last Updated**: 2025-08-21

## A-D

**Agent Dashboard**  
Administrative interface for gaming studios and shops to onboard and manage multiple players. Includes bulk registration tools, performance tracking, and commission management. *See: [Agent Dashboard](./05-implementation-plan.md#agent-dashboard)*

**AI Matchmaking**  
GPT-4o powered system that analyzes player skills, preferences, and playing styles to suggest optimal opponents. Considers factors like skill rating, geographic location, and gaming preferences. *See: [AI Matchmaking](./01-project-requirements.md#match-discovery--ai-matchmaking)*

**AI Onboarding Wizard**  
Intelligent setup process that guides new users through profile creation, platform selection, and skill assessment using GPT-4o recommendations. *See: [AI Onboarding Wizard](./02-app-flow.md#onboarding-wizard)*

**Challenge**  
A match invitation between players that can be public (open to all), private (invitation-only), friendly (no stakes), or competitive (real money/platform currency). *See: [Challenge System](./05-implementation-plan.md#challenge-system)*

**Console API**  
Direct integration with PlayStation Network, Xbox Live, and PC gaming platforms to automatically fetch match results and verify gameplay data. *See: [Console Integration](./03-tech-stack.md#console-integration)*

**Cpay.world**  
Non-custodial cryptocurrency payment gateway that handles secure deposits, withdrawals, and escrow services while allowing users to maintain control of their private keys. *See: [Crypto Payments](./03-tech-stack.md#crypto-payments)*

**Dispute Resolution**  
AI-assisted system for handling contested match results, including evidence upload, GPT-4o analysis, and moderator review for fair conflict resolution. *See: [Dispute Resolution](./02-app-flow.md#dispute-resolution)*

## E-H

**Escrow System**  
Automated smart contract functionality that holds match stakes in secure custody until results are verified and funds can be distributed to the winner. *See: [Escrow Management](./01-project-requirements.md#crypto-wallet--payments)*

**Firebase Realtime Database**  
Google's real-time database service used for instant messaging, live chat, and real-time notifications across the platform. *See: [Real-time Features](./03-tech-stack.md#real-time-features)*

**Fraud Detection**  
GPT-4o powered system that analyzes gameplay patterns, historical behavior, and match evidence to identify suspicious activities and potential cheating. *See: [Advanced AI Systems](./05-implementation-plan.md#advanced-ai-systems)*

**Freemium Model**  
Business model offering three tiers: Free (basic features), Pro ($4.99/month), and Elite ($14.99/month) with progressively advanced features and capabilities. *See: [Subscription System](./05-implementation-plan.md#subscription-system)*

**GPT-4o**  
OpenAI's advanced language model integrated into FifaRun for AI matchmaking, fraud detection, dispute triage, and intelligent user assistance. *See: [AI Services](./03-tech-stack.md#ai-and-machine-learning-services)*

## I-L

**KYC (Know Your Customer)**  
Identity verification process deferred until users engage in high-stake matches or reach transaction thresholds, maintaining regulatory compliance while reducing initial friction. *See: [KYC Integration](./05-implementation-plan.md#kyc-integration)*

**Leaderboards**  
Ranking systems displaying player performance across global, regional, and friends-only categories, with achievements, badges, and skill ratings. *See: [Leaderboards & Achievements](./01-project-requirements.md#leaderboards--achievements)*

## M-P

**Multi-Tier Affiliate Program**  
Referral system offering 10% commission for direct referrals (Tier 1), 3% for second-level (Tier 2), and 1% for third-level (Tier 3) referrals with crypto payouts. *See: [Affiliate Program](./05-implementation-plan.md#affiliate-program)*

**Next.js 14**  
React-based web framework with app router, server-side rendering, and automatic optimization features used for the FifaRun web application. *See: [Web Application Stack](./03-tech-stack.md#web-application-stack)*

**Platform Currency**  
USD-based internal currency with real-time crypto conversion rates, allowing users to view and transact in familiar dollar amounts while using cryptocurrency. *See: [Crypto Wallet & Payments](./01-project-requirements.md#crypto-wallet--payments)*

## Q-T

**React Native**  
Cross-platform mobile development framework enabling shared codebase for iOS and Android applications with native performance. *See: [Mobile Application Stack](./03-tech-stack.md#mobile-application-stack)*

**Real-Time Chat**  
Instant messaging system powered by Firebase Realtime Database, supporting in-game communication, support chat, and group messaging. *See: [Social Features](./02-app-flow.md#social-features)*

**Skill Rating**  
AI-generated numerical score representing player ability, updated dynamically based on match performance and used for fair matchmaking. *See: [AI Matchmaking](./01-project-requirements.md#match-discovery--ai-matchmaking)*

**Supabase**  
Backend-as-a-Service platform providing PostgreSQL database, authentication, real-time subscriptions, storage, and edge functions for the FifaRun infrastructure. *See: [Database and Authentication](./03-tech-stack.md#database-and-authentication)*

## U-Z

**Unified Documentation**  
Consolidated documentation system with cross-references, navigation links, and consistent formatting across all project documents. *See: [Documentation Structure](./README.md)*

**User Flow**  
Complete user journey from registration through gameplay, including onboarding, match creation, result submission, and community interaction. *See: [User Flows & App Navigation](./02-app-flow.md)*

**Wallet Integration**  
Non-custodial cryptocurrency wallet system enabling secure deposits, withdrawals, and escrow functionality through Cpay.world gateway. *See: [Wallet Management](./02-app-flow.md#wallet-management)*

---

## Related Terms by Category

### **Authentication & Security**
- AI Onboarding Wizard
- KYC (Know Your Customer)  
- Multi-Factor Authentication
- Fraud Detection

### **Gaming & Challenges**
- Challenge
- Console API
- Skill Rating
- AI Matchmaking
- Dispute Resolution

### **Financial & Payments**
- Cpay.world
- Escrow System
- Platform Currency
- Wallet Integration

### **Social & Community**
- Leaderboards
- Real-Time Chat
- Multi-Tier Affiliate Program
- Agent Dashboard

### **Technical Infrastructure**
- Next.js 14
- React Native
- Supabase
- Firebase Realtime Database
- GPT-4o

---

**Navigation:**  
← [Back to Main Documentation](./README.md) | [Project Requirements](./01-project-requirements.md) | [Technical Architecture](./03-tech-stack.md) →