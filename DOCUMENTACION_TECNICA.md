# 📘 Documentación Técnica - Tutorial Interactivo de Ciencia de Datos

## 📋 Tabla de Contenidos

1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Arquitectura](#arquitectura)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura de Componentes](#estructura-de-componentes)
5. [Estado y Datos](#estado-y-datos)
6. [Animaciones](#animaciones)
7. [Rendimiento](#rendimiento)
8. [Deployment](#deployment)
9. [Testing](#testing)
10. [Guía de Desarrollo](#guía-de-desarrollo)

---

## 1. Resumen del Proyecto

### Objetivo
Tutorial web interactivo y animado para enseñar ciencia de datos desde fundamentos hasta nivel avanzado.

### Audiencia
- Estudiantes de ciencia de datos
- Profesionales en reconversión
- Autodidactas con conocimientos básicos

### Propuesta de Valor
- **Altamente visual**: Animaciones y visualizaciones en cada concepto
- **Interactivo**: Simuladores y ejercicios prácticos
- **Gamificado**: Quizzes, progreso y feedback inmediato
- **Moderno**: Stack tecnológico actual y best practices

---

## 2. Arquitectura

### Arquitectura General

```
┌─────────────────────────────────────────────┐
│           Usuario (Navegador)               │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│         Next.js 14 (App Router)             │
│  ┌─────────────────────────────────────┐   │
│  │   Server Components (SSR/SSG)       │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │   Client Components (Interactivos)  │   │
│  │   - Framer Motion                   │   │
│  │   - React State                     │   │
│  │   - Canvas API                      │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│         CDN (Vercel Edge Network)           │
│  - Static Assets                            │
│  - Images (optimizadas)                     │
│  - Fonts                                    │
└─────────────────────────────────────────────┘
```

### Flujo de Datos

```
User Action
    │
    ▼
Event Handler (Component)
    │
    ▼
State Update (useState/useReducer)
    │
    ▼
Re-render con Animaciones
    │
    ▼
Feedback Visual (Framer Motion)
```

### Decisiones Arquitectónicas

#### ¿Por qué Next.js 14?
- **SSR/SSG**: Mejor SEO y performance inicial
- **App Router**: Routing moderno y layouts anidados
- **Image Optimization**: Imágenes optimizadas automáticamente
- **API Routes**: Backend integrado si se necesita
- **Ecosistema**: Gran comunidad y recursos

#### ¿Por qué TypeScript?
- **Type Safety**: Menos bugs en producción
- **Better DX**: Autocomplete y documentación inline
- **Refactoring**: Cambios seguros y confiables
- **Escalabilidad**: Mejor para proyectos grandes

#### ¿Por qué TailwindCSS?
- **Utility-first**: Desarrollo rápido
- **Consistencia**: Sistema de diseño built-in
- **Performance**: PurgeCSS automático
- **Responsive**: Mobile-first por defecto

---

## 3. Stack Tecnológico

### Frontend Core
```json
{
  "next": "14.2.0",          // Framework React
  "react": "18.3.0",         // Librería UI
  "typescript": "5.4.0"      // Lenguaje
}
```

### Estilos y Animaciones
```json
{
  "tailwindcss": "3.4.0",    // CSS Utility-first
  "framer-motion": "11.0.0", // Animaciones React
  "gsap": "3.12.0"           // Animaciones avanzadas (futuro)
}
```

### Visualizaciones
```json
{
  "d3": "7.9.0",                    // Visualizaciones de datos
  "recharts": "2.12.0",             // Charts React
  "@react-three/fiber": "8.16.0",   // 3D (futuro)
  "@react-three/drei": "9.105.0"    // Helpers 3D
}
```

### UI Components
```json
{
  "lucide-react": "0.365.0",              // Iconos
  "class-variance-authority": "0.7.0",    // Variantes de componentes
  "tailwind-merge": "2.2.0"               // Merge de clases
}
```

---

## 4. Estructura de Componentes

### Jerarquía de Componentes

```
App Layout
├── Header
│   ├── Logo
│   ├── Navigation
│   └── Mobile Menu
├── Main Content
│   ├── Module Pages
│   │   ├── Module Header
│   │   ├── Sections
│   │   │   ├── Text Content
│   │   │   ├── Interactive Components
│   │   │   │   ├── DataScienceLifecycle
│   │   │   │   ├── RolesComparison
│   │   │   │   ├── InteractiveQuiz
│   │   │   │   ├── GradientDescentSimulator
│   │   │   │   └── ProbabilitySimulator
│   │   │   └── Info Cards
│   │   └── Module Navigation
│   └── Home Page
│       ├── Animated Hero
│       ├── Features Section
│       └── Modules Grid
└── Footer
    ├── About
    ├── Quick Links
    └── Social Links
```

### Tipos de Componentes

#### 1. Layout Components
```typescript
// src/components/layout/Header.tsx
export default function Header() {
  // Header con navegación sticky
  // Responsive mobile menu
  // Animaciones de entrada
}
```

#### 2. Interactive Components
```typescript
// src/components/interactive/InteractiveQuiz.tsx
interface InteractiveQuizProps {
  questions: Question[];
}

export default function InteractiveQuiz({ questions }: InteractiveQuizProps) {
  // Lógica de quiz
  // Animaciones de feedback
  // Tracking de progreso
}
```

#### 3. UI Components
```typescript
// src/components/ui/ModuleCard.tsx
interface ModuleCardProps {
  module: Module;
  index: number;
}

export default function ModuleCard({ module, index }: ModuleCardProps) {
  // Card con animaciones hover
  // Gradientes dinámicos
  // Link a módulo
}
```

### Patrones de Componentes

#### Compound Components
```typescript
<Section title="..." icon={...} color="...">
  <Content>
    {children}
  </Content>
</Section>
```

#### Render Props
```typescript
<DataProvider>
  {({ data, loading }) => (
    loading ? <Spinner /> : <Chart data={data} />
  )}
</DataProvider>
```

#### Custom Hooks
```typescript
// src/hooks/useProgress.ts
export function useProgress(moduleId: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem(`progress-${moduleId}`);
    if (saved) setProgress(JSON.parse(saved));
  }, [moduleId]);

  const updateProgress = (value: number) => {
    setProgress(value);
    localStorage.setItem(`progress-${moduleId}`, JSON.stringify(value));
  };

  return { progress, updateProgress };
}
```

---

## 5. Estado y Datos

### Gestión de Estado

#### Local State (useState)
```typescript
// Para estado simple de componentes
const [isOpen, setIsOpen] = useState(false);
const [count, setCount] = useState(0);
```

#### Complex State (useReducer)
```typescript
// Para estado complejo con múltiples acciones
const [state, dispatch] = useReducer(reducer, initialState);

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
}
```

#### Context API (futuro)
```typescript
// Para estado global compartido
const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [globalProgress, setGlobalProgress] = useState({});

  return (
    <ProgressContext.Provider value={{ globalProgress, setGlobalProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}
```

### Persistencia de Datos

#### LocalStorage
```typescript
// Guardar progreso
const saveProgress = (moduleId: string, data: any) => {
  localStorage.setItem(`module-${moduleId}`, JSON.stringify(data));
};

// Cargar progreso
const loadProgress = (moduleId: string) => {
  const saved = localStorage.getItem(`module-${moduleId}`);
  return saved ? JSON.parse(saved) : null;
};
```

#### Futuro: Backend
```typescript
// Opcionalmente con Supabase/Firebase
const { data, error } = await supabase
  .from('progress')
  .select('*')
  .eq('user_id', userId);
```

---

## 6. Animaciones

### Framer Motion - Patrones Principales

#### 1. Fade In
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Contenido
</motion.div>
```

#### 2. Slide In
```typescript
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Contenido
</motion.div>
```

#### 3. Hover Effects
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

#### 4. Layout Animations
```typescript
<motion.div layout>
  {items.map(item => (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

#### 5. Variants
```typescript
const variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 }
};

<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  Contenido
</motion.div>
```

### Canvas Animations

```typescript
// GradientDescentSimulator.tsx
const drawFrame = () => {
  const ctx = canvasRef.current?.getContext('2d');
  if (!ctx) return;

  // Clear
  ctx.clearRect(0, 0, width, height);

  // Draw function
  ctx.beginPath();
  for (let x = -10; x <= 10; x += 0.1) {
    const y = costFunction(x);
    const screenX = centerX + x * scale;
    const screenY = centerY - y * scale;
    ctx.lineTo(screenX, screenY);
  }
  ctx.stroke();

  // Draw point
  ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
  ctx.fill();
};

useEffect(() => {
  drawFrame();
}, [currentPoint]);
```

---

## 7. Rendimiento

### Optimizaciones Implementadas

#### 1. Code Splitting
```typescript
// Lazy loading de componentes pesados
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Spinner />}>
  <HeavyComponent />
</Suspense>
```

#### 2. Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/image.png"
  width={800}
  height={600}
  alt="Description"
  loading="lazy"
  quality={85}
/>
```

#### 3. Memoization
```typescript
// useMemo para cálculos costosos
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// useCallback para funciones
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// React.memo para componentes
export default memo(ExpensiveComponent);
```

#### 4. Debouncing
```typescript
const debouncedSearch = useMemo(
  () => debounce((value: string) => {
    performSearch(value);
  }, 300),
  []
);
```

### Métricas Target

```
First Contentful Paint:  < 1.5s
Time to Interactive:     < 3s
Largest Contentful Paint: < 2.5s
Cumulative Layout Shift: < 0.1
Total Bundle Size:       < 500KB
```

### Lighthouse Scores Target

```
Performance:    > 90
Accessibility:  > 95
Best Practices: > 95
SEO:           > 90
```

---

## 8. Deployment

### Vercel (Recomendado)

#### 1. Setup
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

#### 2. Configuración
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

#### 3. Environment Variables
```bash
# .env.local (no commitear)
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X
```

### Alternativa: Netlify

```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### CI/CD con GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 9. Testing

### Testing Strategy

```typescript
// Unit Tests - Jest + React Testing Library
describe('InteractiveQuiz', () => {
  it('should render questions', () => {
    render(<InteractiveQuiz questions={mockQuestions} />);
    expect(screen.getByText('Question 1')).toBeInTheDocument();
  });

  it('should handle answer selection', () => {
    render(<InteractiveQuiz questions={mockQuestions} />);
    fireEvent.click(screen.getByText('Option A'));
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });
});

// Integration Tests - Playwright
test('module navigation flow', async ({ page }) => {
  await page.goto('/modulos/introduccion');
  await page.click('text=Siguiente');
  await expect(page).toHaveURL('/modulos/matematicas');
});

// E2E Tests - Cypress
describe('Complete Module Flow', () => {
  it('completes module with quiz', () => {
    cy.visit('/modulos/introduccion');
    cy.get('[data-testid=quiz-answer-0]').click();
    cy.get('[data-testid=next-button]').click();
    cy.url().should('include', '/matematicas');
  });
});
```

---

## 10. Guía de Desarrollo

### Workflow

1. **Crear rama de feature**
```bash
git checkout -b feature/nuevo-modulo
```

2. **Desarrollar componente**
```bash
# Crear componente
touch src/components/interactive/NuevoComponente.tsx

# Implementar
# - TypeScript types
# - Lógica del componente
# - Animaciones
# - Estilos
```

3. **Probar localmente**
```bash
npm run dev
# Verificar en http://localhost:3000
```

4. **Lint y format**
```bash
npm run lint
npm run type-check
```

5. **Commit y push**
```bash
git add .
git commit -m "feat: add nuevo componente interactivo"
git push origin feature/nuevo-modulo
```

6. **Pull Request**
- Crear PR en GitHub
- Descripción clara de cambios
- Screenshots/videos si aplica
- Review de código

### Convenciones de Código

#### Nombres
```typescript
// Componentes: PascalCase
function MyComponent() {}

// Funciones: camelCase
function handleClick() {}

// Constantes: UPPER_SNAKE_CASE
const API_URL = "...";

// Tipos/Interfaces: PascalCase con 'I' prefix
interface IUser {}
type TConfig = {};
```

#### Estructura de Archivos
```
ComponentName/
├── index.tsx          # Export del componente
├── ComponentName.tsx  # Implementación
├── types.ts          # TypeScript types
├── utils.ts          # Utilidades
└── __tests__/        # Tests
    └── ComponentName.test.tsx
```

### Best Practices

1. **Componentes pequeños y enfocados**
2. **Props con TypeScript types**
3. **Hooks personalizados para lógica compartida**
4. **Comentarios solo cuando sea necesario**
5. **Nombres descriptivos**
6. **Testing de componentes críticos**
7. **Accesibilidad desde el inicio**
8. **Performance en mente**

---

## 📚 Referencias

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Framer Motion API](https://www.framer.com/motion/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

**Última actualización:** Noviembre 2024
**Versión:** 1.0
