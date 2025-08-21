# Developer View - FifaRun Documentation

**Target Audience**: Developers, Software Engineers, Technical Contributors  
**Focus**: Technical implementation, APIs, code examples, architecture  
**Last Updated**: 2025-08-21

---

## 🚀 Quick Start for Developers

### Essential Technical Information
- **Tech Stack**: [Next.js 14 + React Native + Supabase](../03-tech-stack.md#frontend-technologies)
- **Database**: [PostgreSQL with Supabase](../03-tech-stack.md#database-and-authentication)
- **AI Integration**: [GPT-4o for matchmaking and fraud detection](../03-tech-stack.md#ai-and-machine-learning-services)
- **Payments**: [Cpay.world crypto gateway](../03-tech-stack.md#crypto-payments)
- **Real-time**: [Firebase for chat and notifications](../03-tech-stack.md#real-time-features)

### Development Setup
1. **Clone Repository** and install dependencies
2. **Environment Setup** - Configure Supabase, Firebase, OpenAI API keys
3. **Database Schema** - Run migrations for user, challenge, transaction tables
4. **Development Server** - Start Next.js web and React Native mobile apps
5. **Testing Suite** - Run Jest, RTL, and Cypress test suites

---

## ⚙️ Technical Architecture

### Database Schema
```sql
-- Core Tables for FifaRun Platform
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  avatar_url TEXT,
  skill_rating INTEGER DEFAULT 1000,
  platforms TEXT[] DEFAULT '{}',
  kyc_status TEXT DEFAULT 'not_required',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id),
  opponent_id UUID REFERENCES users(id),
  game_mode TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('playstation', 'xbox', 'pc')),
  stake_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'active', 'completed', 'disputed')),
  rules JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  challenge_id UUID REFERENCES challenges(id),
  type TEXT CHECK (type IN ('deposit', 'withdrawal', 'escrow_lock', 'escrow_release')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USDC',
  status TEXT DEFAULT 'pending',
  blockchain_tx_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints Structure
```typescript
// Authentication API
POST /auth/register
POST /auth/login  
POST /auth/logout
GET  /auth/session
POST /auth/2fa/setup
POST /auth/2fa/verify

// User Management
GET    /users/profile
PUT    /users/profile
POST   /users/avatar
GET    /users/friends
POST   /users/friends/request

// Challenge System
GET    /challenges              // List challenges
POST   /challenges              // Create challenge  
GET    /challenges/:id          // Get challenge details
PUT    /challenges/:id          // Update challenge
POST   /challenges/:id/join     // Join challenge
POST   /challenges/:id/result   // Submit result

// Wallet Operations
GET    /wallet/balance
POST   /wallet/deposit
POST   /wallet/withdraw
GET    /wallet/transactions
POST   /wallet/escrow/lock
POST   /wallet/escrow/release
```

---

## 🔧 Implementation Details

### Frontend Component Architecture
```typescript
// Component Structure
/components
├── /auth
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx  
│   └── OnboardingWizard.tsx
├── /challenges
│   ├── ChallengeCard.tsx
│   ├── CreateChallenge.tsx
│   ├── JoinChallenge.tsx
│   └── ChallengeResults.tsx
├── /wallet
│   ├── WalletBalance.tsx
│   ├── DepositModal.tsx
│   ├── WithdrawModal.tsx
│   └── TransactionHistory.tsx
└── /shared
    ├── Button.tsx
    ├── Input.tsx
    ├── Modal.tsx
    └── LoadingSpinner.tsx

// Example Component Implementation
interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: (challengeId: string) => void;
  onView: (challengeId: string) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onJoin,
  onView
}) => {
  return (
    <div className="bg-glass backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{challenge.gameMode}</h3>
        <span className="text-neon-green font-mono">${challenge.stakeAmount}</span>
      </div>
      
      <div className="space-y-2 text-gray-300">
        <p>Platform: {challenge.platform}</p>
        <p>Creator: {challenge.creator.username}</p>
        <p>Expires: {formatRelativeTime(challenge.expiresAt)}</p>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button variant="primary" onClick={() => onJoin(challenge.id)}>
          Join Challenge
        </Button>
        <Button variant="ghost" onClick={() => onView(challenge.id)}>
          View Details
        </Button>
      </div>
    </div>
  );
};
```

### State Management with React Context
```typescript
// Auth Context Implementation
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
      
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🔐 Security Implementation

### Authentication Flow
```typescript
// Multi-Provider Authentication
const authProviders = {
  email: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  google: async () => {
    return await supabase.auth.signInWithOAuth({ provider: 'google' });
  },
  
  apple: async () => {
    return await supabase.auth.signInWithOAuth({ provider: 'apple' });
  },
  
  phone: async (phone: string) => {
    return await supabase.auth.signInWithOtp({ phone });
  }
};

// 2FA Implementation
const setupTwoFactor = async (userId: string) => {
  const secret = authenticator.generateSecret();
  
  await supabase
    .from('user_2fa')
    .upsert({ 
      user_id: userId, 
      secret_key: secret,
      enabled: false 
    });
    
  const qrCodeUrl = authenticator.keyuri(
    userId, 
    'FifaRun', 
    secret
  );
  
  return { secret, qrCodeUrl };
};
```

### Input Validation and Sanitization
```typescript
// API Input Validation with Zod
import { z } from 'zod';

const CreateChallengeSchema = z.object({
  gameMode: z.enum(['ultimate-team', 'career', 'seasons']),
  platform: z.enum(['playstation', 'xbox', 'pc']),
  stakeAmount: z.number().min(0).max(1000),
  rules: z.object({
    duration: z.number().min(3).max(90),
    difficulty: z.enum(['beginner', 'professional', 'world-class']),
  }).optional(),
  isPublic: z.boolean().default(true),
  expirationHours: z.number().min(1).max(168).default(24)
});

// API Route Handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CreateChallengeSchema.parse(body);
    
    // Create challenge with validated data
    const challenge = await createChallenge(validatedData);
    
    return Response.json(challenge);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## 🧪 Testing Strategy

### Unit Testing with Jest and React Testing Library
```typescript
// Component Testing Example
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChallengeCard } from './ChallengeCard';

const mockChallenge: Challenge = {
  id: '123',
  gameMode: 'ultimate-team',
  platform: 'playstation',
  stakeAmount: 10,
  creator: { id: '456', username: 'testuser' },
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
};

describe('ChallengeCard', () => {
  test('displays challenge information correctly', () => {
    render(
      <ChallengeCard 
        challenge={mockChallenge} 
        onJoin={jest.fn()} 
        onView={jest.fn()} 
      />
    );
    
    expect(screen.getByText('ultimate-team')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
    expect(screen.getByText('Platform: playstation')).toBeInTheDocument();
    expect(screen.getByText('Creator: testuser')).toBeInTheDocument();
  });

  test('calls onJoin when join button is clicked', async () => {
    const onJoinMock = jest.fn();
    
    render(
      <ChallengeCard 
        challenge={mockChallenge} 
        onJoin={onJoinMock} 
        onView={jest.fn()} 
      />
    );
    
    fireEvent.click(screen.getByText('Join Challenge'));
    
    await waitFor(() => {
      expect(onJoinMock).toHaveBeenCalledWith('123');
    });
  });
});
```

### Integration Testing with Cypress
```typescript
// E2E Test Example
describe('Challenge Creation Flow', () => {
  beforeEach(() => {
    cy.login('developer@fifarun.com', 'password123');
    cy.visit('/challenges/create');
  });

  it('creates a new challenge successfully', () => {
    // Fill out challenge form
    cy.get('[data-testid=game-mode-select]').select('ultimate-team');
    cy.get('[data-testid=platform-select]').select('playstation');
    cy.get('[data-testid=stake-amount]').type('25');
    cy.get('[data-testid=duration-select]').select('15');
    
    // Submit form
    cy.get('[data-testid=create-challenge-btn]').click();
    
    // Verify success
    cy.url().should('include', '/challenges/');
    cy.get('[data-testid=success-message]').should('contain', 'Challenge created successfully');
    
    // Verify challenge appears in list
    cy.visit('/challenges');
    cy.get('[data-testid=challenge-card]').should('contain', '$25');
  });

  it('validates required fields', () => {
    cy.get('[data-testid=create-challenge-btn]').click();
    
    cy.get('[data-testid=error-message]').should('contain', 'Game mode is required');
    cy.get('[data-testid=error-message]').should('contain', 'Platform is required');
  });
});
```

---

## 🚀 Deployment and CI/CD

### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run unit tests
      run: npm test -- --coverage
    
    - name: Run E2E tests
      run: npm run test:e2e
      env:
        CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel Staging
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        scope: ${{ secrets.TEAM_ID }}
```

### Environment Configuration
```typescript
// config/environment.ts
interface Environment {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  OPENAI_API_KEY: string;
  CPAY_API_KEY: string;
  FIREBASE_CONFIG: FirebaseConfig;
  NODE_ENV: 'development' | 'staging' | 'production';
}

export const env: Environment = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  CPAY_API_KEY: process.env.CPAY_API_KEY!,
  FIREBASE_CONFIG: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  },
  NODE_ENV: (process.env.NODE_ENV as Environment['NODE_ENV']) || 'development'
};

// Validation
const requiredEnvVars = Object.keys(env);
requiredEnvVars.forEach(key => {
  if (!env[key as keyof Environment]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
```

---

## 📊 Performance Optimization

### Code Splitting and Lazy Loading
```typescript
// Route-based code splitting
const LazyWalletPage = lazy(() => import('./pages/WalletPage'));
const LazyAdminPanel = lazy(() => import('./pages/AdminPanel'));

// Component-based lazy loading
const LazyChart = lazy(() => import('./components/Chart'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <LazyWalletPage />
</Suspense>
```

### Database Query Optimization
```sql
-- Indexes for common queries
CREATE INDEX idx_challenges_creator_id ON challenges(creator_id);
CREATE INDEX idx_challenges_status_created ON challenges(status, created_at DESC);
CREATE INDEX idx_transactions_user_id_created ON transactions(user_id, created_at DESC);
CREATE INDEX idx_users_skill_rating ON users(skill_rating DESC);

-- Optimized challenge search query
SELECT c.*, 
       u.username as creator_username,
       u.skill_rating as creator_rating
FROM challenges c
JOIN users u ON c.creator_id = u.id
WHERE c.status = 'pending'
  AND c.stake_amount BETWEEN $1 AND $2
  AND c.platform = ANY($3)
  AND c.expires_at > NOW()
ORDER BY c.created_at DESC
LIMIT $4 OFFSET $5;
```

---

## 🔗 Related Developer Resources

- **[Technical Architecture](../03-tech-stack.md)** - Complete technical specifications
- **[Frontend Guidelines](../04-frontend-guidelines.md)** - Development standards and patterns
- **[Implementation Plan](../05-implementation-plan.md)** - Development phases and timeline
- **[API Documentation](../03-tech-stack.md#api-architecture)** - Complete API reference
- **[Database Schema](../05-implementation-plan.md#backend-foundation)** - Data models and relationships

---

**Developer Tools**: [VS Code Extensions](https://marketplace.visualstudio.com/search?term=react%20nextjs&target=VSCode) | [GitHub Repository](https://github.com/qafeocapital/fifarun) | [Staging Environment](https://fifarun-staging.vercel.app)