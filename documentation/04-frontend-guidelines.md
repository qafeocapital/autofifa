# Frontend Guidelines

**Project**: FifaRun  
**Version**: 1.0  
**Last Updated**: 2025-08-21

## Table of Contents
- [Frontend Architecture](#frontend-architecture)
- [Design Principles](#design-principles)
- [Styling and Theming](#styling-and-theming)
- [Component Structure](#component-structure)
- [State Management](#state-management)
- [Routing and Navigation](#routing-and-navigation)
- [Performance Optimization](#performance-optimization)
- [Testing and Quality Assurance](#testing-and-quality-assurance)
- [Development Workflow](#development-workflow)

## Frontend Architecture

### Component-Based Design Philosophy
The FifaRun frontend utilizes a **component-based architecture** that promotes:
- **Reusability** - Shared components across web and mobile platforms
- **Maintainability** - Isolated, testable component units
- **Scalability** - Easy feature additions through modular design
- **Consistency** - Unified UI patterns throughout the application

### Platform Strategy
**Shared Component Library**
```
/packages
├── /ui-components     # Shared UI components for web and mobile
├── /business-logic    # Platform-agnostic business logic
├── /types            # TypeScript type definitions
└── /utils            # Shared utility functions
```

**Platform-Specific Implementation**
```
/apps
├── /web              # Next.js web application
├── /mobile           # React Native mobile application
└── /admin            # Administrative dashboard
```

### Data Flow Architecture
- **Unidirectional Data Flow** - Clear data movement from parent to child components
- **Prop Drilling Avoidance** - Context API and state management for deeply nested data
- **Immutable State Updates** - Predictable state changes following React principles
- **Error Boundaries** - Graceful error handling at component level

## Design Principles

### User-Centered Design
**Accessibility First**
- **WCAG AA Compliance** - Meet or exceed accessibility standards
- **Keyboard Navigation** - Full functionality without mouse interaction
- **Screen Reader Support** - Proper semantic HTML and ARIA labels
- **Color Contrast** - Minimum 4.5:1 ratio for normal text, 3:1 for large text
- **Focus Management** - Clear visual indicators and logical tab order

**Mobile-First Responsive Design**
- **Progressive Enhancement** - Core functionality works on all devices
- **Touch-Friendly Interface** - Minimum 44px touch targets
- **Flexible Grid System** - Tailwind CSS responsive utilities
- **Viewport Optimization** - Appropriate scaling across device sizes

### User Experience Principles
**Immediate Feedback**
- **Loading States** - Clear indicators during data fetching and processing
- **Success Confirmation** - Positive feedback for completed actions
- **Error Communication** - Clear, actionable error messages
- **Progress Indicators** - Step-by-step progress for multi-step processes

**Intuitive Navigation**
- **Consistent Patterns** - Uniform navigation structure across platform
- **Clear Hierarchy** - Logical information architecture
- **Breadcrumb Navigation** - Location awareness in complex flows
- **Quick Actions** - Easy access to frequently used features

## Styling and Theming

### Design System
**Color Palette**
```css
/* Primary Colors */
--electric-blue: #0066ff;
--neon-green: #00ff88;
--gold: #ffaa00;
--white: #ffffff;

/* Background Colors */
--background-dark: #0a0a0a;
--background-card: #1a1a1a;
--background-elevated: #2a2a2a;

/* Text Colors */
--text-primary: #ffffff;
--text-secondary: #cccccc;
--text-muted: #888888;

/* Status Colors */
--success: #22c55e;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

**Typography Scale**
```css
/* Font Families */
--font-primary: 'Inter', system-ui, sans-serif;
--font-display: 'Montserrat', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
```

### Glassmorphism Theme Implementation
**Visual Characteristics**
- **Semi-transparent backgrounds** with backdrop-blur effects
- **Subtle borders** with gradient overlays
- **Layered depth** using shadows and elevation
- **Vibrant accent colors** against dark backgrounds

**Tailwind CSS Configuration**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        'glass': 'rgba(255, 255, 255, 0.1)',
        'glass-hover': 'rgba(255, 255, 255, 0.15)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
    },
  },
}
```

## Component Structure

### Component Organization
**Domain-Driven Structure**
```
/components
├── /auth
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── OnboardingWizard.tsx
├── /challenges
│   ├── ChallengeCard.tsx
│   ├── CreateChallenge.tsx
│   └── Matchmaking.tsx
├── /wallet
│   ├── WalletBalance.tsx
│   ├── TransactionHistory.tsx
│   └── DepositModal.tsx
├── /social
│   ├── FriendsList.tsx
│   ├── GroupManagement.tsx
│   └── ChatInterface.tsx
└── /shared
    ├── Button.tsx
    ├── Input.tsx
    ├── Modal.tsx
    └── LoadingSpinner.tsx
```

### Component Patterns
**Composition Pattern**
```typescript
// Flexible, composable components
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors';
  const variantClasses = {
    primary: 'bg-electric-blue hover:bg-blue-700 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    ghost: 'bg-transparent hover:bg-glass text-white',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
```

**Custom Hook Pattern**
```typescript
// Business logic separation
export const useChallenge = (challengeId: string) => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        const data = await supabase
          .from('challenges')
          .select('*')
          .eq('id', challengeId)
          .single();
        
        if (data.error) throw data.error;
        setChallenge(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId]);

  return { challenge, loading, error };
};
```

## State Management

### State Architecture Strategy
**Local State** (useState, useReducer)
- Component-specific UI state (form inputs, modal visibility)
- Temporary data that doesn't need persistence
- Simple state that doesn't require sharing

**Global State** (React Context)
- User authentication and profile information
- Application-wide settings and preferences
- Real-time notification state

**Server State** (SWR/React Query)
- API data fetching and caching
- Match information and leaderboards  
- Social features and friend lists

### Context Providers Structure
```typescript
// Global state management
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Authentication logic...

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Real-time State with Supabase
```typescript
// Real-time subscription management
export const useRealTimeMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const subscription = supabase
      .channel('matches')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'matches'
      }, (payload) => {
        // Handle real-time updates
        setMatches(prev => updateMatchInArray(prev, payload));
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return matches;
};
```

## Routing and Navigation

### Web Application Routing (Next.js)
**App Router Structure**
```
/app
├── page.tsx                    # Home page
├── auth/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── dashboard/page.tsx
├── challenges/
│   ├── page.tsx               # Challenge list
│   ├── [id]/page.tsx         # Challenge details
│   └── create/page.tsx       # Create challenge
├── wallet/page.tsx
├── profile/
│   ├── page.tsx
│   └── settings/page.tsx
└── admin/
    └── layout.tsx            # Protected admin layout
```

**Dynamic Route Handling**
```typescript
// Dynamic challenge routes
interface ChallengePageProps {
  params: { id: string };
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const challenge = await getChallenge(params.id);
  
  return (
    <div>
      <ChallengeDetails challenge={challenge} />
    </div>
  );
}
```

### Mobile Navigation (React Navigation)
**Stack and Tab Navigation**
```typescript
// Main navigation structure
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        // Icon logic based on route.name
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Discover" component={DiscoverScreen} />
    <Tab.Screen name="Wallet" component={WalletScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const RootNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Challenge" component={ChallengeScreen} />
    <Stack.Screen name="CreateChallenge" component={CreateChallengeScreen} />
  </Stack.Navigator>
);
```

## Performance Optimization

### Web Performance Strategies
**Code Splitting and Lazy Loading**
```typescript
// Route-based code splitting
const LazyWalletPage = lazy(() => import('./pages/WalletPage'));
const LazyAdminPanel = lazy(() => import('./pages/AdminPanel'));

// Component-based lazy loading
const LazyChartComponent = lazy(() => import('./components/charts/AdvancedChart'));
```

**Image Optimization**
```typescript
// Next.js Image component usage
import Image from 'next/image';

export const UserAvatar = ({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src}
    alt={alt}
    width={40}
    height={40}
    className="rounded-full"
    priority={false} // Only true for above-the-fold images
  />
);
```

### Mobile Performance Strategies
**Memory Management**
```typescript
// Proper cleanup in useEffect
useEffect(() => {
  const fetchData = async () => {
    // Async operations
  };

  fetchData();

  return () => {
    // Cleanup subscriptions, timers, etc.
  };
}, [dependency]);
```

**List Optimization**
```typescript
// FlatList performance optimization
const optimizedProps = {
  getItemLayout: (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }),
  keyExtractor: (item) => item.id,
  removeClippedSubviews: true,
  maxToRenderPerBatch: 10,
  updateCellsBatchingPeriod: 50,
};
```

## Testing and Quality Assurance

### Testing Strategy
**Unit Testing with Jest and React Testing Library**
```typescript
// Component testing example
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Integration Testing**
```typescript
// User flow testing
import { renderWithProviders } from '../test-utils';
import { CreateChallengeFlow } from './CreateChallengeFlow';

test('user can create a challenge', async () => {
  renderWithProviders(<CreateChallengeFlow />);
  
  // Fill form
  fireEvent.change(screen.getByLabelText('Challenge Name'), {
    target: { value: 'Test Challenge' }
  });
  
  // Submit form
  fireEvent.click(screen.getByText('Create Challenge'));
  
  // Assert success
  await waitFor(() => {
    expect(screen.getByText('Challenge created successfully')).toBeInTheDocument();
  });
});
```

### End-to-End Testing with Cypress
```typescript
// E2E test for challenge creation
describe('Challenge Creation', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password');
    cy.visit('/challenges/create');
  });

  it('creates a new challenge', () => {
    cy.get('[data-testid=challenge-name]').type('Test Challenge');
    cy.get('[data-testid=stake-amount]').type('10');
    cy.get('[data-testid=create-button]').click();
    
    cy.url().should('include', '/challenges/');
    cy.contains('Challenge created successfully').should('be.visible');
  });
});
```

## Development Workflow

### Code Quality Standards
**ESLint Configuration**
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-console': 'warn',
  },
};
```

**Pre-commit Hooks with Husky**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run type-check && npm run test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

### Git Workflow
**Branch Naming Convention**
- `feature/` - New features (feature/match-creation)
- `fix/` - Bug fixes (fix/wallet-balance-display)
- `refactor/` - Code refactoring (refactor/auth-context)
- `docs/` - Documentation updates (docs/api-endpoints)

**Commit Message Format**
```
type(scope): description

feat(challenges): add real-time match updates
fix(wallet): resolve balance calculation error
docs(readme): update installation instructions
```

---

**Related Documents:**
- [Project Requirements](./01-project-requirements.md) - Feature requirements and business logic
- [User Flows & App Navigation](./02-app-flow.md) - User interaction patterns and flows
- [Technical Architecture](./03-tech-stack.md) - Backend services and infrastructure
- [Implementation Roadmap](./05-implementation-plan.md) - Development phases and milestones