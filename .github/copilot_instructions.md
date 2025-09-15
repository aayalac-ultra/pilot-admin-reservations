# COPILOT_INSTRUCTIONS — SmartLinks Reservations Admin (Angular 19)

> **Propósito**: Unificar en **un único archivo** todas las reglas y patrones para que **Copilot Chat** y el equipo generen **incrementos consistentes, testeables y mantenibles** en el Admin de Reservas, reutilizando lo mejor del proyecto de Ofertas Locales.

---

## 1) Project Overview & Tech Stack

- **App**: SmartLinks Reservations Admin — Angular **19** (standalone components), TypeScript **strict**, RxJS 7, NgRx 18, PrimeNG 19, TailwindCSS 3 + SCSS.
- **Arquitectura**: **Clean Architecture** + **DTO/Domain/Adapter** + **Atomic Design** + **Facade + NgRx** + **Repository Pattern**.
- **Enfoque**: Mobile-first, performance (OnPush, lazy loading), accesibilidad, i18n vía adapter (opcional), testabilidad end-to-end.
- **Aliases TypeScript (usar siempre)**:
  ```ts
  @core/*          // src/app/core/*
  @shared/*        // src/app/shared/*
  @features/*      // src/app/features/*
  @ui/*            // src/app/shared/ui/*
  @environments/*  // src/environments/*
  ```

---

## 2) Clean Architecture — Capas y Dependencias

**Regla de oro**: Dependencias apuntan hacia adentro. La UI no conoce infraestructura ni formatos de API.

```
Presentation (Pages/Components/UI)
   ↓  (Facade abstrae NgRx)
Application (NgRx Store, Effects, Facade)
   ↓
Domain (Models, Repositories[interfaces], Use Cases opcional)
   ↓
Infrastructure (HTTP/Mocks, DTOs, Adapters)
```

### 2.1 Estructura por Feature (ejemplo `reservations`)
```
src/app/features/reservations/
├── presentation/
│   ├── pages/
│   └── components/
├── application/
│   ├── facades/
│   └── store/   (actions, reducer, selectors, effects)
├── domain/
│   └── repositories/ (interfaces)
└── infrastructure/
    ├── http/     (implementaciones HTTP)
    ├── dto/      (modelos API)
    └── adapters/ (DTO ↔ Domain)
```

### 2.2 Patrón DTO/Domain/Adapter
- **DTO**: formato de API (no sale de `infrastructure/dto`).
- **Domain**: tipos puros y estables (Date, number, enums… sin Angular).
- **Adapter**: mapea **únicamente** entre DTO y Domain.

```ts
// dto/booking.dto.ts
export interface BookingDto { id: string; created_at: string; total_amount: number; }

// shared/domain/models/reservation-base.model.ts
export interface ReservationBase { id: string; createdAt: Date; totalAmount: number; }

// infrastructure/adapters/booking.adapter.ts
export class BookingAdapter {
  static toDomain(dto: BookingDto): ReservationBase {
    return { id: dto.id, createdAt: new Date(dto.created_at), totalAmount: dto.total_amount };
  }
}
```

---

## 3) State Management — NgRx + Facade

### 3.1 Convenciones
- **Actions**: `[Feature] Operation`.
- **EntityAdapter** para colecciones (normalización + selectores gratis).
- **Effects**: Side effects, manejo de errores con `catchError` y acciones `Failure`.
- **Selectors**: memorizados, sin lógica de negocio compleja.
- **Facade**: API simple para componentes (oculta NgRx y orquesta flows).

```ts
// application/facades/reservations.facade.ts
@Injectable({ providedIn: 'root' })
export class ReservationsFacade {
  private store = inject(Store);
  readonly reservations$ = this.store.select(ReservationsSelectors.selectAll);
  readonly loading$ = this.store.select(ReservationsSelectors.selectLoading);

  load(params?: ReservationListParams) { this.store.dispatch(ReservationsActions.load({ params })); }
}
```

---

## 4) Repository Pattern — Interfaces y HTTP/Mock

- **Domain** declara interfaces (contratos estables):
```ts
// domain/repositories/reservations.repository.ts
export interface ReservationListParams { search?: string; status?: string; page?: number; limit?: number; }
export interface ReservationListResult { data: ReservationBase[]; pagination: { currentPage: number; totalPages: number; totalItems: number; }; }
export abstract class ReservationsRepository {
  abstract list(params?: ReservationListParams): Observable<ReservationListResult>;
  abstract byId(id: string): Observable<ReservationBase>;
}
```
- **Infrastructure/HTTP** implementa usando `HttpClient` + `environment.apiUrl` + Adapters.
- **Mocks** viven en `infrastructure/http/*-mock.repository.ts` y deben simular latencia realista con `delay()`.

---

## 5) UI/UX — Atomic Design, Responsive y Accesibilidad

### 5.1 Atomic Design
- **Átomos** (`@ui/atoms`): botones, inputs, chips.
- **Moléculas** (`@ui/molecules`): filtros, toolbars, modales.
- **Organismos** (`@ui/components`): tablas, galerías, sidebars.
- **Pages** (`presentation/pages`): smart components (container) **OnPush**.

### 5.2 Reglas
- **Standalone components** con `inject()` y `changeDetection: OnPush`.
- **Inputs/Outputs** con sintaxis Angular 19 (`input<T>()`, `output<T>()`).
- **BEM** en SCSS. **Tailwind** para utilitarios (breakpoints definidos en `styles`).
- **Accesibilidad**: ARIA, `aria-live` en feedbacks, foco gestionado tras acciones.

---

## 6) Signals & Stores (cuando aplique)

- Señales privadas `signal()` + públicas `asReadonly()`.
- Computed para derivados (`computed(() => …)`).
- Inyección de store en componentes con `inject(Store/Facade)`.
- **Proveer stores a nivel de ruta**, no global, cuando sean feature-scoped.

---

## 7) Error Handling & Loading

- **Repositorios** **no** lanzan errores crudos; convierten a un `Error` legible o `Result` con estado.
- **Stores/Effects** emiten `Failure` y setean `loading=false` y `error=mensaje`.
- **Componentes** solo leen señales/selectores: `loading`, `error`, `hasResults`.
- **UI** siempre representa: loading spinner + error banner + empty state.

---

## 8) Naming, Imports & Estructura de Archivos

- **Convenciones**:
  - Components: `kebab-case.component.ts`
  - Services: `kebab-case.service.ts`
  - Stores: `kebab-case.reducer.ts|effects.ts|selectors.ts|actions.ts`
  - Models: `kebab-case.model.ts` — Interfaces prefijo `I` **no** requerido.
  - Interfaces opcionalmente con sufijo `.interface.ts` si aclara intención.
- **Orden de imports (ESLint)**: Angular core → externas → **aliases** → relativos.
- **Prohibido** `any` sin justificación. Usa generics y utility types.

---

## 9) Testing

### 9.1 Unit
- **Jest** con `jest-preset-angular`.
- Usar `provideHttpClient()` + `provideHttpClientTesting()`; **no** `HttpClientTestingModule` deprecado.
- Store testing con `@ngrx/store/testing` y `provideMockStore`.

### 9.2 E2E
- **Playwright** preferido (o Cypress si ya existe).
- Mínimo: flujo lista → filtro → detalle. Trazas `on-first-retry`.

### 9.3 Cobertura mínima
- **Lógica de dominio y adapters**: 90% lines.
- **Reducers/Selectors**: 90%.
- **Effects/Repositorios**: 80%.

---

## 10) Workflows de Desarrollo

### 10.1 Scripts (estándar)
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

### 10.2 Git & PR
- **Conventional Commits**.
- Branching: `feature/*`, `fix/*`, `chore/*`.
- **Checklist PR** (copiar/pegar en descripción):
  - [ ] Arquitectura y capas respetadas
  - [ ] Tests unitarios y/o e2e incluidos y pasando
  - [ ] Lint/format ok
  - [ ] Accesibilidad mínima verificada
  - [ ] Build prod exitoso
  - [ ] Documentación/README actualizados si aplica

### 10.3 CI/CD (resumen)
- Jobs: **test** (lint + unit + build) y **deploy** (solo `main`).
- Node 18+, cache de npm, `npm ci` estricto.

---

## 11) Performance Checklist

- [ ] **OnPush** en todos los componentes que renderizan datos.
- [ ] **trackBy** en `*ngFor`.
- [ ] **Lazy loading** de rutas/features.
- [ ] **Evitar pipes pesados** en templates; usar computed/selectors.
- [ ] **Imágenes optimizadas** y `loading="lazy"` donde aplique.
- [ ] **CDK Virtual Scroll** para listas largas.

---

## 12) Generación de Incrementos (Plantillas para Copilot)

### 12.1 Nuevo Feature (resumen)
**Objetivo**: crear `features/<feature>` con las 4 capas, store NgRx, facade, repositorio, adapter y páginas.

```md
Crear feature "<feature>" con estructura Clean Architecture:
- presentation/{pages,components} con standalone components OnPush.
- application/{facades,store} con actions/reducer/effects/selectors usando EntityAdapter.
- domain/repositories con interfaz(es) de repositorio.
- infrastructure/{http,dto,adapters} con adapter DTO↔Domain y repositorio HTTP.
Usar aliases @features, @shared, @ui, @core. Agregar tests unitarios de adapter, reducer y effect principal.
```

### 12.2 Nuevo Adapter
```md
Crear adapter <X>Adapter en infrastructure/adapters que convierta entre <X>Dto y <X>Domain. No importes nada de Angular. Test unitario con casos: campos faltantes, fechas inválidas, valores edge.
```

### 12.3 Nueva Página + Tabla
```md
Crear página standalone en presentation/pages con layout responsive (2 columnas desktop, 1 columna móvil), tabla empresarial (PrimeNG) en organismo `@ui/components/<tabla>`. Conectar a facade para `loading`, `error`, `data`. Añadir trackBy y estados: loading, empty, error.
```

### 12.4 Nueva Acción/Effect
```md
Agregar acción `[Feature] Load` + `[Feature] Load Success/Failure`. Effect hace llamada a repositorio, mapea errores y despacha Success/Failure. Tests cubren success y failure.
```

---

## 13) Definición de Hecho (DoD)

Un incremento se considera **hecho** cuando:
- Código respeta **Clean Architecture** y convenciones.
- **Tests** unitarios y e2e mínimos incluidos y verdes.
- **Accesibilidad** básica (ARIA roles, foco) aplicada.
- **Rendimiento** (OnPush, trackBy, lazy) verificado.
- **Documentación** mínima actualizada (README/feature docs si aplica).
- **PR Checklist** completo.

---

## 14) Ejemplos Rápidos

### 14.1 Selector con EntityAdapter
```ts
const { selectAll, selectEntities } = adapter.getSelectors();
export const selectAllReservations = createSelector(selectFeature, selectAll);
export const selectReservationsEntities = createSelector(selectFeature, selectEntities);
```

### 14.2 Effect con manejo de error
```ts
load$ = createEffect(() => this.actions$.pipe(
  ofType(Actions.load),
  switchMap(({ params }) => this.repo.list(params).pipe(
    map(result => Actions.loadSuccess({ result })),
    catchError(err => of(Actions.loadFailure({ error: normalizeError(err) })))
  ))
));
```

### 14.3 Página Standalone OnPush
```ts
@Component({
  selector: 'app-reservations-list-page',
  standalone: true,
  imports: [CommonModule, ReservationsTableComponent, ProgressSpinnerModule],
  templateUrl: './reservations-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationsListPageComponent implements OnInit {
  private facade = inject(ReservationsFacade);
  readonly data$ = this.facade.reservations$;
  readonly loading$ = this.facade.loading$;
  ngOnInit() { this.facade.load({ page: 1, limit: 20 }); }
}
```

---

## 15) Lint, Format & Configuración

- **ESLint**: reglas clave activas (no-unused-vars, suffix de componentes/directivas, etc.).
- **Prettier**: `printWidth: 100`, `singleQuote: true`, `trailingComma: es5`.
- **TSConfig**: `strict: true`, `noImplicitAny: true`, `noUnusedLocals: true`.

---

## 16) Troubleshooting (rápido)

- Build roto → `rm -rf node_modules && npm ci`, `ng cache clean`, `npx tsc --noEmit`.
- Peer deps → `npm ls` y alinear versiones Angular/NgRx/PrimeNG.
- Store no actualiza → verificar `Effects` y acciones Success/Failure + selectors correctos.
- UI lenta → revisar OnPush, trackBy, computeds pesados en template.

---

## 17) Convenciones de Routing & Providers

- Rutas **lazy** por feature; `providers: [FeatureRepository, FeatureEffects]` a nivel de ruta cuando scopeado.
- Guards para auth/roles en `@core`.
- Interceptors en `@core/interceptors` (auth, timing/metrics).

---

## 18) Seguridad & Observabilidad (mínimos)

- **HTTP Interceptors**: `auth.interceptor.ts` + `http-timing.interceptor.ts` para métricas.
- **Logs**: niveles por `environment.logLevel`.
- **Sentry/App Insights** opcional con wrapper en `@core/services`.

---

## 19) Anexos — Comandos útiles

```bash
npm start                 # Dev server
npm test                  # Unit tests
npm run test:watch        # Watch
npm run lint && npm run format
npm run build:prod        # Build prod
```

---

### Nota final
Este archivo es la **única fuente** que Copilot Chat debe consumir para generar código nuevo en el Admin de Reservas. Los documentos extendidos (README, Developer Guide, Architecture) permanecen como referencia humana, pero **toda instrucción operativa para Copilot vive aquí**.

