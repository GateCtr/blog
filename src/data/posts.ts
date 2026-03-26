import type { Post } from '../types';

export const posts: Post[] = [
  {
    id: '1',
    slug: 'getting-started-with-react',
    title: 'Getting Started with React in 2026',
    excerpt: 'React continues to evolve rapidly. Here is everything you need to know to hit the ground running with modern React development.',
    content: `React has come a long way since its initial release. In 2026, building with React means embracing hooks, concurrent features, and server components as first-class citizens.

## Setting Up Your First Project

The recommended way to start a new React project is with Vite. It offers lightning-fast hot module replacement and an excellent developer experience.

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
\`\`\`

## Understanding Hooks

Hooks are the backbone of modern React. The most commonly used hooks are:

- **useState** - for local component state
- **useEffect** - for side effects
- **useCallback** - for memoizing functions
- **useMemo** - for memoizing expensive computations
- **useContext** - for consuming context values

## The Component Lifecycle

With hooks, thinking about component lifecycle has shifted. Instead of lifecycle methods, you have effects that run in response to state and prop changes.

## Best Practices

1. Keep components small and focused
2. Lift state up when multiple components need it
3. Use custom hooks to share logic
4. Prefer composition over inheritance
5. Memoize only when you have a proven performance problem

React development in 2026 is smoother than ever. The ecosystem has matured, tooling has improved, and the community has settled on clear patterns for building scalable applications.`,
    author: 'GateCtr Team',
    date: '2026-03-20',
    category: 'React',
    readTime: 5,
  },
  {
    id: '2',
    slug: 'typescript-tips-for-better-code',
    title: 'TypeScript Tips for Writing Better Code',
    excerpt: 'TypeScript has become essential for serious JavaScript development. These practical tips will help you write safer, more maintainable code.',
    content: `TypeScript brings type safety to JavaScript, catching bugs at compile time rather than runtime. Here are some tips to make the most of it.

## Use Strict Mode

Always enable strict mode in your tsconfig.json. It catches many common mistakes and forces better coding habits.

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

## Prefer Interfaces for Object Types

While both types and interfaces can describe object shapes, interfaces offer better error messages and support declaration merging.

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}
\`\`\`

## Use Discriminated Unions

Discriminated unions are a powerful pattern for handling different states or types of data safely.

\`\`\`typescript
type Result<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };
\`\`\`

## Leverage Utility Types

TypeScript comes with many built-in utility types that save time:

- **Partial<T>** - makes all properties optional
- **Required<T>** - makes all properties required
- **Pick<T, K>** - picks a subset of properties
- **Omit<T, K>** - omits certain properties
- **Record<K, V>** - creates a map type

## Type Narrowing

TypeScript is smart about narrowing types based on control flow. Use this to your advantage.

TypeScript is an investment that pays off quickly. The initial setup time is more than recovered in time saved debugging type-related bugs.`,
    author: 'GateCtr Team',
    date: '2026-03-15',
    category: 'TypeScript',
    readTime: 7,
  },
  {
    id: '3',
    slug: 'building-modern-uis-with-css',
    title: 'Building Modern UIs with CSS Grid and Flexbox',
    excerpt: 'CSS Grid and Flexbox together give you all the power you need to build complex, responsive layouts without relying on heavy CSS frameworks.',
    content: `CSS layout has transformed dramatically over the past decade. Grid and Flexbox together solve virtually every layout challenge you will encounter.

## Flexbox for One-Dimensional Layouts

Flexbox excels at laying out items along a single axis — either a row or a column. It is perfect for navigation bars, card grids, and centering content.

\`\`\`css
.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}
\`\`\`

## CSS Grid for Two-Dimensional Layouts

Grid is the go-to for two-dimensional layouts — think page layouts, dashboards, and complex card arrangements.

\`\`\`css
.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr;
  min-height: 100vh;
}
\`\`\`

## Responsive Design Without Media Queries

CSS Grid's auto-fill and auto-fit features allow you to create naturally responsive layouts with minimal code.

\`\`\`css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
\`\`\`

## When to Use Which

- Use **Flexbox** when arranging items in a line (row or column)
- Use **Grid** when you need control over both rows and columns
- They can be — and often should be — used together

Modern CSS layout is incredibly powerful. Mastering Grid and Flexbox will make you a much more effective frontend developer.`,
    author: 'GateCtr Team',
    date: '2026-03-10',
    category: 'CSS',
    readTime: 6,
  },
  {
    id: '4',
    slug: 'performance-optimization-in-web-apps',
    title: 'Performance Optimization in Modern Web Apps',
    excerpt: 'Performance is a feature. Learn the most impactful techniques for making your web application fast, responsive, and efficient.',
    content: `Web performance directly affects user experience and conversion rates. A one-second delay in page load time can reduce conversions by up to 7%. Here is how to keep your app fast.

## Measure First

Never optimize without measuring. Use Chrome DevTools, Lighthouse, and Web Vitals to identify actual bottlenecks.

The Core Web Vitals to watch:
- **LCP** (Largest Contentful Paint) - loading performance
- **FID** (First Input Delay) - interactivity
- **CLS** (Cumulative Layout Shift) - visual stability

## Code Splitting

Do not ship everything on first load. Split your code and load only what is needed.

\`\`\`javascript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
\`\`\`

## Image Optimization

Images often account for the majority of a page's weight. Always:
- Use modern formats (WebP, AVIF)
- Specify width and height to prevent layout shift
- Use lazy loading for below-the-fold images
- Serve appropriately sized images

## Bundle Analysis

Use tools like \`vite-bundle-visualizer\` to see what is in your bundle and identify opportunities to reduce size.

## Caching Strategy

A good caching strategy can dramatically reduce load times for returning visitors. Use service workers and proper cache headers.

Performance optimization is an ongoing process. Build it into your development workflow from the start.`,
    author: 'GateCtr Team',
    date: '2026-03-05',
    category: 'Performance',
    readTime: 8,
  },
  {
    id: '5',
    slug: 'introduction-to-state-management',
    title: 'State Management: Choosing the Right Approach',
    excerpt: 'With so many state management options available, how do you choose? This guide breaks down the tradeoffs to help you make the right call.',
    content: `State management is one of the most discussed topics in frontend development. The right choice depends heavily on your application's needs.

## Local State is Often Enough

Before reaching for a state management library, ask whether local state with useState and useReducer is sufficient. For many applications, it is.

## React Context for Shared State

Context is built into React and works well for state that does not change frequently — things like theme, language, and user authentication.

\`\`\`typescript
const ThemeContext = React.createContext<Theme>('light');

function App() {
  const [theme, setTheme] = useState<Theme>('light');
  return (
    <ThemeContext.Provider value={theme}>
      <AppContent />
    </ThemeContext.Provider>
  );
}
\`\`\`

## Zustand for Global State

Zustand is a minimal, flexible state management library that avoids the boilerplate of Redux while being more scalable than Context.

## React Query for Server State

Server state — data fetched from an API — has different needs than UI state. React Query handles caching, background refetching, and synchronization automatically.

## When to Use Redux

Redux shines in large applications with complex state interactions and teams that benefit from strict patterns and excellent DevTools support.

## The Decision Framework

1. Is this state only needed by one component? → useState
2. Is this state shared by a few nearby components? → lift state up
3. Is this UI state needed across the app? → Context or Zustand
4. Is this data from a server? → React Query
5. Is this complex application state with many interactions? → Redux

Choose the simplest solution that meets your requirements. You can always upgrade later.`,
    author: 'GateCtr Team',
    date: '2026-02-28',
    category: 'React',
    readTime: 9,
  },
  {
    id: '6',
    slug: 'git-workflow-best-practices',
    title: 'Git Workflow Best Practices for Teams',
    excerpt: 'A good Git workflow can make the difference between a smooth development process and a chaotic mess. Here is what works in practice.',
    content: `Git is the universal version control system, but using it well takes practice. Here are the patterns and practices that help teams collaborate effectively.

## Commit Messages Matter

A well-written commit message is a gift to your future self and your teammates. Follow the conventional commits specification:

\`\`\`
feat: add user authentication
fix: resolve race condition in data fetching
docs: update API documentation
refactor: simplify error handling logic
\`\`\`

## Branch Strategy

The simplest branch strategy that works is:
- **main** - production-ready code, always deployable
- **feature/*** - new features, branched from main
- **fix/*** - bug fixes
- **chore/*** - maintenance tasks

## Keep Pull Requests Small

Large pull requests are hard to review. Aim for changes that can be understood and reviewed in under 30 minutes. If a feature requires many changes, break it into logical smaller pieces.

## Code Review Culture

Code review is about sharing knowledge and catching bugs — not criticizing the author. Keep reviews constructive, specific, and kind.

## Rebasing vs Merging

Use rebase to maintain a clean, linear history. Use merge commits at integration points (when landing a feature branch into main).

## Git Hooks

Automate quality checks with git hooks. Run linting and tests before commits and pushes to catch issues early.

A good workflow becomes invisible — it just makes collaboration smooth and natural.`,
    author: 'GateCtr Team',
    date: '2026-02-20',
    category: 'DevOps',
    readTime: 6,
  },
];

export const categories = [
  { id: 'react', name: 'React', count: posts.filter(p => p.category === 'React').length },
  { id: 'typescript', name: 'TypeScript', count: posts.filter(p => p.category === 'TypeScript').length },
  { id: 'css', name: 'CSS', count: posts.filter(p => p.category === 'CSS').length },
  { id: 'performance', name: 'Performance', count: posts.filter(p => p.category === 'Performance').length },
  { id: 'devops', name: 'DevOps', count: posts.filter(p => p.category === 'DevOps').length },
];
