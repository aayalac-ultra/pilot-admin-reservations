# 🏢 SmartLinks Reservations Admin

## 📋 Descripción del Proyecto

**SmartLinks Reservations Admin** es una aplicación empresarial de administración de reservas construida con **Angular 19** siguiendo principios de **Clean Architecture** y **Atomic Design**. 

### 🎯 Características Principales

- ✅ **Clean Architecture** con 4 capas claramente separadas
- ✅ **Patrón DTO/Domain/Adapter** para separación de modelos
- ✅ **NgRx Store** con EntityAdapter para gestión de estado
- ✅ **PrimeNG 19** para componentes UI empresariales
- ✅ **Atomic Design** (Átomos, Moléculas, Organismos)
- ✅ **Responsive Design** mobile-first
- ✅ **TypeScript estricto** con tipos seguros
- ✅ **Standalone Components** (sin NgModules)

### 🏗️ Arquitectura Implementada

```
┌─────────────────────────────────────────────────────────────┐
│                    🎨 Presentation Layer                    │
│   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│   │     Pages       │ │   Components    │ │   UI Library    │ │
│   │   (Smart)       │ │   (Feature)     │ │   (Atomic)      │ │
│   └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   ⚙️ Application Layer                      │
│   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│   │   NgRx Store    │ │     Effects     │ │     Facade      │ │
│   │  (State Mgmt)   │ │  (Side Effects) │ │  (Abstraction)  │ │
│   └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    🏛️ Domain Layer                          │
│   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│   │  Domain Models  │ │  Repositories   │ │  Business Rules │ │
│   │  (Pure TS)      │ │  (Interfaces)   │ │   (Use Cases)   │ │
│   └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 🔌 Infrastructure Layer                     │
│   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│   │  HTTP Services  │ │   DTO Models    │ │    Adapters     │ │
│   │  (External)     │ │  (API Format)   │ │  (Mappers)      │ │
│   └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Inicio Rápido

### 📋 Prerrequisitos

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Angular CLI >= 19.0.0
```

### ⚡ Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd smartlinks-reservations-admin

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm start
# o
ng serve

# 4. Abrir en navegador
# http://localhost:4200
```

### 🏗️ Comandos de Construcción

```bash
# Desarrollo
npm start                 # Servidor de desarrollo

# Construcción
npm run build            # Build para producción
npm run build:dev        # Build para desarrollo

# Testing
npm test                 # Tests unitarios
npm run test:watch       # Tests en modo watch
npm run e2e              # Tests end-to-end

# Linting
npm run lint             # ESLint
npm run lint:fix         # Auto-fix linting issues
```

### 🌐 Configuración de Ambientes

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  useMockData: true
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.smartlinks.com',
  useMockData: false
};
```

### 📦 Build para Producción

```bash
# Build optimizado para producción
npm run build

# Build con análisis de bundle
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/smartlinks-reservations-admin/stats.json

# Preview del build de producción
npx http-server dist/smartlinks-reservations-admin
```

## 📁 Estructura del Proyecto

```
src/app/
├── 🎯 features/reservations/           # Feature Module
│   ├── application/                    # Application Layer
│   │   ├── facades/                    # Facade Pattern
│   │   │   └── reservations.facade.ts
│   │   └── store/                      # NgRx Store
│   │       ├── reservations.actions.ts
│   │       ├── reservations.effects.ts
│   │       ├── reservations.reducer.ts
│   │       └── reservations.selectors.ts
│   ├── domain/                         # Domain Layer
│   │   └── repositories/
│   │       └── reservations.repository.ts
│   ├── infrastructure/                 # Infrastructure Layer
│   │   ├── adapters/
│   │   │   └── booking.adapter.ts      # DTO ↔ Domain Mapper
│   │   ├── dto/
│   │   │   └── booking.dto.ts          # API Models
│   │   └── http/
│   │       ├── reservations-http.repository.ts
│   │       └── reservations-mock.repository.ts
│   └── presentation/                   # Presentation Layer
│       ├── components/
│       │   └── reservation-detail/
│       │       ├── reservation-detail.component.ts
│       │       ├── reservation-detail.component.html
│       │       └── reservation-detail.component.scss
│       └── pages/
│           ├── reservations-list-page/
│           │   ├── reservations-list-page.component.ts
│           │   ├── reservations-list-page.component.html
│           │   └── reservations-list-page.component.scss
│           └── reservation-detail-page/
│               ├── reservation-detail-page.component.ts
│               ├── reservation-detail-page.component.html
│               └── reservation-detail-page.component.scss
├── 🧱 shared/                          # Shared Resources
│   ├── domain/models/                  # Domain Models
│   │   └── reservation-base.model.ts
│   ├── services/                       # Shared Services
│   │   └── ui-config.service.ts
│   └── ui/                             # UI Library (Atomic Design)
│       ├── atoms/                      # Basic UI Elements
│       │   └── stats-card/
│       │       ├── stats-card.component.ts
│       │       ├── stats-card.component.html
│       │       └── stats-card.component.scss
│       ├── molecules/                  # Component Groups
│       │   └── stats-cards-section/
│       │       ├── stats-cards-section.component.ts
│       │       ├── stats-cards-section.component.html
│       │       └── stats-cards-section.component.scss
│       └── components/                 # Complex Components
│           └── reservations-table/
│               ├── reservations-table.component.ts
│               ├── reservations-table.component.html
│               └── reservations-table.component.scss
└── 🛠️ core/                            # Core Services
    ├── interceptors/
    │   ├── auth.interceptor.ts
    │   └── http-timing.interceptor.ts
    └── services/
        └── notification.service.ts
```

## 🎨 Funcionalidades Implementadas

### 📊 Dashboard de Reservas (`/reservas`)
- ✅ **Tabla Empresarial**: Listado responsive con PrimeNG
- ✅ **Estadísticas**: Cards con métricas de reservas
- ✅ **Filtros Avanzados**: Búsqueda, estado, tipo de producto
- ✅ **Paginación Backend**: Control total desde el servidor
- ✅ **Acciones por Fila**: Ver, editar, cancelar reservas
- ✅ **Estados Visuales**: Chips de color según estado
- ✅ **Exportación**: Descarga de datos (funcionalidad preparada)

### 🔍 Detalle de Reserva (`/reservas/:id`)
- ✅ **Layout Profesional**: Diseño de dos columnas (desktop)
- ✅ **Información Completa**: Datos generales, precios, pagos
- ✅ **Sidebar Interactivo**: Acciones rápidas y datos adicionales
- ✅ **Responsive Design**: Adaptable a móvil y tablet
- ✅ **PrimeNG Integration**: Componentes empresariales
- ✅ **Confirmaciones**: Diálogos para acciones críticas

### 🧱 Componentes Atómicos
- ✅ **StatsCard**: Tarjetas de estadísticas reutilizables
- ✅ **StatsCardsSection**: Sección agrupada de métricas
- ✅ **ReservationsTable**: Tabla completa de reservas

## 🔧 Tecnologías y Dependencias

### 🚀 Core Framework
- **Angular 19.2.16** - Framework principal
- **TypeScript 5.6+** - Tipado estático
- **RxJS 7.8+** - Programación reactiva
- **NgRx 18+** - Gestión de estado

### 🎨 UI/UX
- **PrimeNG 19.1.1** - Biblioteca de componentes UI
- **@primeng/themes** - Sistema de temas
- **Tailwind CSS 3.4+** - Utility-first CSS
- **SCSS** - Preprocesador CSS

### 🧪 Testing & Quality
- **Jest** - Framework de testing
- **ESLint** - Linting de código
- **TypeScript Strict Mode** - Verificación estricta

### 🔧 Development Tools
- **Angular CLI 19+** - Herramientas de desarrollo
- **Webpack** - Bundling (vía Angular CLI)
- **PostCSS** - Procesamiento CSS

## 🏗️ Patrones de Arquitectura

### 🎯 Clean Architecture
- **Separation of Concerns**: Cada capa tiene una responsabilidad específica
- **Dependency Inversion**: Las capas internas no dependen de las externas
- **Testability**: Fácil testing por separación de capas

### 🔄 DTO/Domain/Adapter Pattern
```typescript
// Infrastructure DTO (API Format)
interface BookingDto {
  id: string;
  created_at: string;  // ISO string
  total_amount: number;
}

// Domain Model (Business Logic)
interface ReservationBase {
  id: string;
  createdAt: Date;     // JavaScript Date
  totalAmount: number;
}

// Adapter (Converter)
class BookingAdapter {
  static toReservationBase(dto: BookingDto): ReservationBase {
    return {
      id: dto.id,
      createdAt: new Date(dto.created_at),
      totalAmount: dto.total_amount
    };
  }
}
```

### ⚛️ Atomic Design
- **Atoms**: Elementos básicos (StatsCard)
- **Molecules**: Grupos de átomos (StatsCardsSection)
- **Organisms**: Componentes complejos (ReservationsTable)
- **Templates**: Layouts de página
- **Pages**: Instancias específicas

### 🏪 Facade Pattern
```typescript
// Simplified API for components
@Injectable()
export class ReservationsFacade {
  // Simple methods that hide NgRx complexity
  loadReservations(filters: ReservationListParams) {
    this.store.dispatch(loadReservations({ filters }));
  }
  
  readonly reservations$ = this.store.select(selectAllReservations);
  readonly loading$ = this.store.select(selectReservationsLoading);
}
```

## 🚢 Deploy y Producción

## 🔧 Configuración de Desarrollo

### 🛠️ Configuración del IDE (VS Code)

Extensiones recomendadas:
```json
{
  "recommendations": [
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "nrwl.angular-console"
  ]
}
```

### 📝 Scripts Disponibles

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix"
  }
}
```

### 🎯 Proxy de Desarrollo

```json
// proxy.conf.json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

## 🧪 Testing

### 🔬 Tests Unitarios

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Tests con coverage
npm run test:coverage
```

### 🎭 Tests E2E

```bash
# Setup Cypress/Playwright
npm install --save-dev cypress
# o
npm install --save-dev @playwright/test

# Ejecutar E2E tests
npm run e2e
```

## 📚 Guías de Desarrollo

### 🆕 Crear Nuevo Componente

```bash
# Componente de página
ng generate component features/reservations/presentation/pages/nueva-pagina --standalone

# Componente átomo
ng generate component shared/ui/atoms/nuevo-atomo --standalone

# Componente con routing
ng generate component features/nueva-feature/presentation/pages/inicio --standalone --routing
```

### 🏪 Agregar Nueva Feature

```bash
# 1. Crear estructura de carpetas
mkdir -p src/app/features/nueva-feature/{application,domain,infrastructure,presentation}

# 2. Crear store NgRx
ng generate store features/nueva-feature/application/store/nueva-feature --module features/nueva-feature

# 3. Crear facade
ng generate service features/nueva-feature/application/facades/nueva-feature-facade

# 4. Crear rutas
ng generate module features/nueva-feature/nueva-feature-routing --flat
```

### 📊 Agregar Nuevo State

```typescript
// 1. Definir actions
export const loadItems = createAction('[Items] Load');
export const loadItemsSuccess = createAction(
  '[Items] Load Success',
  props<{ items: Item[] }>()
);

// 2. Crear reducer con EntityAdapter
const adapter = createEntityAdapter<Item>();
const initialState = adapter.getInitialState({
  loading: false,
  error: null
});

// 3. Implementar effects
@Injectable()
export class ItemsEffects {
  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItems),
      switchMap(() =>
        this.service.getItems().pipe(
          map(items => loadItemsSuccess({ items })),
          catchError(error => of(loadItemsFailure({ error })))
        )
      )
    )
  );
}
```

## 🤝 Contribución

### 📋 Reglas de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Nuevas funcionalidades
git commit -m "feat(reservations): add export functionality"

# Corrección de bugs
git commit -m "fix(ui): resolve table pagination issue"

# Documentación
git commit -m "docs(readme): update installation guide"

# Refactoring
git commit -m "refactor(store): improve action naming"
```

### 🔀 Flujo de Desarrollo

```bash
# 1. Crear rama desde main
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar con commits atómicos
git add .
git commit -m "feat(feature): implement basic functionality"

# 3. Mantener rama actualizada
git fetch origin
git rebase origin/main

# 4. Push y crear PR
git push origin feature/nueva-funcionalidad
```

### ✅ Checklist de PR

- [ ] ✅ Código sigue las convenciones del proyecto
- [ ] 🧪 Tests unitarios incluidos
- [ ] 📚 Documentación actualizada
- [ ] 🎨 UI responsive en móvil y desktop
- [ ] ♿ Accesibilidad verificada
- [ ] 🚀 Build de producción exitoso

## 📞 Soporte y Contacto

- **Documentación**: Ver [`ARCHITECTURE-IMPLEMENTATION.md`](./ARCHITECTURE-IMPLEMENTATION.md)
- **Issues**: Crear issue en el repositorio
- **Desarrollo**: Revisar guías en `/docs`

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver archivo `LICENSE` para más detalles.

---

⚡ **Desarrollado con Angular 19 + Clean Architecture + PrimeNG** ⚡
