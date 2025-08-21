# User Flows & App Navigation

**Project**: FifaRun  
**Version**: 1.0  
**Last Updated**: 2025-08-21

## Table of Contents
- [Onboarding and Sign-In/Sign-Up](#onboarding-and-sign-insign-up)
- [Main Dashboard](#main-dashboard)
- [Feature Flows](#feature-flows)
- [Settings and Account Management](#settings-and-account-management)
- [Error States and Alternate Paths](#error-states-and-alternate-paths)
- [Overall App Journey](#overall-app-journey)

## Onboarding and Sign-In/Sign-Up

### New User Registration
New users open FifaRun on web or mobile and see options to sign up via:
- **Email/Password** - Traditional account creation
- **Phone Number** - SMS-based verification
- **Google OAuth** - Social login integration
- **Apple ID** - iOS ecosystem integration

No immediate identity verification is required, reducing initial friction for users wanting to explore the platform.

### AI Onboarding Wizard {#onboarding-wizard}
After successful registration, an **AI-powered wizard** guides new users through essential setup:

1. **Gamer Tag Selection** - Choose unique platform identifier
2. **Avatar Upload** - Profile photo or custom avatar selection
3. **Platform Selection** - PlayStation, Xbox, PC preferences
4. **Skill Assessment** - Self-reported skill level for matchmaking
5. **Gaming Preferences** - Favorite game modes and playing times

The wizard uses contextual suggestions and validates inputs to ensure complete profiles for effective matchmaking.

### KYC Deferral
Know Your Customer (KYC) verification is strategically deferred until users:
- Attempt high-stake real-money matches (typically $50+)
- Reach 20 completed real-money matches
- Request withdrawal of significant amounts

This approach maximizes user acquisition while maintaining compliance requirements.

### Sign-In Flow
Returning users utilize the same authentication providers:
- Persistent login sessions with security timeouts
- Password recovery via email/SMS links
- Multi-device session management
- Secure logout with session termination

## Main Dashboard {#main-dashboard}

### Home Interface Layout
The main dashboard serves as the central hub with distinct sections:

#### Navigation Structure
- **Sidebar Menu** (Web) / **Bottom Tab Bar** (Mobile)
  - Home - Dashboard overview
  - Discover - Match finding
  - [**Wallet**](#wallet-management) - Financial management
  - Profile - Account settings
  - [**Social**](#social-features) - Friends and groups

#### Central Content Area
- **Active Challenges** - Ongoing and pending matches
- **Match Suggestions** - AI-powered opponent recommendations
- **Quick Actions** - Create challenge, find match buttons
- **Recent Activity** - Match history and notifications

#### Header Section
- **Notification Bell** - Real-time alerts and messages
- **Chat Icon** - Access to messaging system
- **User Avatar** - Quick profile access

### Personalized AI Suggestions
The dashboard features GPT-4o powered recommendations:
- **Skill-matched opponents** based on recent performance
- **Preferred game modes** and stakes
- **Optimal playing times** based on user activity patterns
- **Friends' activities** and available challenges

## Feature Flows

### Challenge Creation and Management
Users can create various types of matches:

#### Challenge Configuration
1. **Match Type Selection**
   - Public - Open to all users
   - Private - Invitation-only
   - Friendly - No stakes, practice matches
   - Competitive - Real money or platform currency

2. **Game Settings**
   - Platform selection (PS, Xbox, PC)
   - Game mode (Ultimate Team, Career, etc.)
   - Match duration and rules
   - Custom restrictions or requirements

3. **Stake Configuration** (For competitive matches)
   - Amount selection with USD conversion
   - [**Escrow activation**](./01-project-requirements.md#crypto-wallet--payments)
   - Fee structure display

#### Share and Invite System
Completed challenges generate shareable invitations via:
- **WhatsApp** - Direct message with match details
- **SMS** - Text message with join link
- **Social Media** - Twitter, Facebook sharing
- **Email** - Formatted invitation with match info
- **Platform Copy Link** - Universal sharing option

### Match Discovery and Joining

#### Search and Filter Options
- **Skill Level** - Beginner to Professional
- **Geographic Location** - Regional preferences
- **Stake Range** - Free to high-stakes matches
- **Platform** - Console-specific filtering
- **Game Mode** - Specific FIFA modes
- **Availability** - Real-time opponent status

#### AI-Powered Matchmaking
GPT-4o analyzes user data to suggest optimal matches:
- **Skill Compatibility** - Similar rating ranges
- **Playing Style** - Aggressive vs defensive preferences
- **Historical Performance** - Win/loss patterns
- **Geographic Proximity** - Reduced latency matching

### Match Execution and Results

#### Pre-Match Flow
1. **Mutual Confirmation** - Both players confirm readiness
2. **[**Escrow Lock**](./03-tech-stack.md#crypto-payments)** - Stakes secured automatically
3. **Connection Details** - Platform-specific connection info
4. **Timer Start** - Match countdown begins

#### Result Submission
**Automated Console API Integration** (when available):
- Automatic result fetching from PlayStation, Xbox, or PC
- Real-time score updates during match
- Instant payout upon completion

**Manual Submission Flow** (fallback):
- Screenshot/video evidence upload
- Mutual result confirmation
- AI verification using GPT-4o
- Dispute escalation if results conflict

### Dispute Resolution {#dispute-resolution}

#### Evidence Submission
When match results are contested:
1. **Evidence Upload** - Screenshots, videos, or other proof
2. **Statement Submission** - Text description of dispute
3. **Automatic Notification** - Opponent informed of dispute

#### AI Triage System
GPT-4o analyzes submitted evidence:
- **Image/Video Analysis** - Scoreboard recognition
- **Pattern Detection** - Unusual gameplay indicators
- **Historical Context** - Player behavior analysis
- **Confidence Scoring** - Reliability assessment

#### Moderator Review
For complex disputes requiring human intervention:
- **Evidence Package** - All materials forwarded to human moderators
- **Timeline Tracking** - Regular status updates to both parties
- **Fair Resolution** - Unbiased decision making
- **Appeal Process** - Secondary review option

### Social Features {#social-features}

#### Friends and Groups
- **Friend Discovery** - Search by username, email, or real name
- **Group Creation** - Gaming communities and tournaments
- **Activity Feeds** - Friend match results and achievements
- **Direct Messaging** - Private chat capabilities

#### Community Building
- **Leaderboards** - Global, regional, and friends-only rankings
- **Tournaments** - Group-organized competitive events
- **Achievement Sharing** - Badge and trophy celebrations
- **Gaming Communities** - Interest-based groups

### Wallet Management {#wallet-management}

#### Balance and Transactions
- **Current Balance** - USD-equivalent display with crypto details
- **Escrowed Funds** - Stakes locked in active matches
- **Transaction History** - Complete record of deposits, withdrawals, wins, losses
- **Conversion Rates** - Real-time crypto to USD pricing

#### Deposit and Withdrawal
- **[Crypto Deposits](./03-tech-stack.md#crypto-payments)** - Multiple cryptocurrency support via Cpay.world
- **Withdrawal Processing** - Secure transfer to external wallets
- **Fee Structure** - Transparent cost breakdown
- **Security Verification** - 2FA required for significant transactions

## Settings and Account Management

### Profile Settings
- **Personal Information** - Name, email, phone updates
- **Gaming Preferences** - Platforms, game modes, availability
- **Avatar Management** - Photo uploads and avatar selection
- **Privacy Controls** - Profile visibility and data sharing

### Security Settings
- **Password Management** - Change password and security questions
- **Two-Factor Authentication** - Google Authenticator integration
- **Session Management** - Active device monitoring and logout
- **Security Alerts** - Unusual activity notifications

### Notification Preferences
- **Push Notifications** - Mobile app alerts configuration
- **Email Notifications** - Match invites, results, disputes
- **In-App Alerts** - Real-time platform notifications
- **Frequency Controls** - Granular notification timing

### Subscription Management
- **Plan Overview** - Current subscription (Free, Pro, Elite)
- **Upgrade Options** - Feature comparison and pricing
- **Billing History** - Payment records and receipts
- **Cancellation** - Self-service subscription termination

## Error States and Alternate Paths

### Input Validation Errors
- **Registration Issues** - Invalid email, weak password, duplicate username
- **Challenge Creation** - Insufficient funds, invalid stakes, missing requirements
- **Profile Updates** - Invalid phone numbers, unsupported file formats

**Error Handling**: Inline validation with clear, actionable error messages explaining how to resolve issues.

### Connectivity Issues
- **Network Loss** - Full-screen offline notice with retry options
- **API Timeouts** - Loading states with timeout handling and manual retry
- **Real-time Disconnection** - Chat and notification reconnection logic

### Authorization Limits
- **Free Plan Restrictions** - Modal explaining feature limitations with upgrade prompts
- **KYC Requirements** - Clear explanation of verification process for high-stakes matches
- **Geographic Restrictions** - Region-blocking with explanation and alternatives

### Match-Specific Errors
- **Console API Failure** - Fallback to manual result submission
- **Opponent No-Show** - Automatic match cancellation and refund
- **Evidence Upload Issues** - File size and format guidance with retry options

## Overall App Journey

### User Progression Path
1. **Discovery** - Landing page or app store to download
2. **Onboarding** - Quick signup with AI wizard guidance
3. **First Match** - Tutorial-guided friendly match creation
4. **Community Building** - Friend connections and group joining
5. **Competitive Play** - Real-money matches with escrow
6. **Platform Mastery** - Advanced features, affiliate programs, tournaments

### Engagement Loops
- **Match Completion** → **Result Sharing** → **Friend Challenges** → **New Matches**
- **Skill Improvement** → **Higher Stakes** → **Better Opponents** → **Ranking Advancement**
- **Community Participation** → **Tournament Entry** → **Achievement Unlocking** → **Social Recognition**

### Long-term User Journey
Users evolve from casual players to community leaders through:
- **Skill Development** - Improving ratings and unlocking advanced features
- **Social Growth** - Building friend networks and gaming communities
- **Economic Participation** - Engaging in higher-stake matches and earning rewards
- **Platform Advocacy** - Referring friends through affiliate programs

---

**Related Documents:**
- [Project Requirements](./01-project-requirements.md) - Core features and business logic
- [Technical Architecture](./03-tech-stack.md) - Implementation details
- [Frontend Guidelines](./04-frontend-guidelines.md) - UI/UX implementation standards
- [Implementation Roadmap](./05-implementation-plan.md) - Development timeline