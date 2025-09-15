# 📚 Guía del Desarrollador - SmartLinks Reservations

## 🎯 Onboarding para Nuevos Desarrolladores

### 📋 Checklist de Setup

- [ ] Node.js 18+ instalado
- [ ] Angular CLI 19+ instalado
- [ ] VS Code con extensiones recomendadas
- [ ] Git configurado con conventional commits
- [ ] Repositorio clonado y dependencias instaladas
- [ ] Aplicación ejecutándose en `http://localhost:4200`
- [ ] Documentación leída y comprendida

### 🔧 Herramientas de Desarrollo

#### VS Code Extensions (Obligatorias)
```json
{
  "recommendations": [
    "angular.ng-template",              // Angular Language Service
    "ms-vscode.vscode-typescript-next", // TypeScript Support
    "bradlc.vscode-tailwindcss",        // Tailwind CSS IntelliSense
    "esbenp.prettier-vscode",           // Code Formatting
    "ms-vscode.vscode-eslint",          // Linting
    "nrwl.angular-console",             // Angular Console
    "ms-vscode.vscode-json",            // JSON Support
    "redhat.vscode-yaml"                // YAML Support
  ]
}
```

#### Configuración de Prettier
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

#### ESLint Rules
```json
// .eslintrc.json (principales reglas)
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@angular-eslint/component-class-suffix": "error",
    "@angular-eslint/directive-class-suffix": "error"
  }
}
```

## 🏗️ Patrones de Desarrollo

### 🎨 Creación de Componentes

#### 1. Componente de Página (Smart Component)
```bash
# Crear estructura
ng generate component features/nueva-feature/presentation/pages/nueva-pagina --standalone

# Estructura resultante:
# nueva-pagina/
# ├── nueva-pagina.component.ts
# ├── nueva-pagina.component.html
# └── nueva-pagina.component.scss
```

**Template del Smart Component:**
```typescript
@Component({
  selector: 'app-nueva-pagina',
  standalone: true,
  imports: [CommonModule, /* otros imports */],
  templateUrl: './nueva-pagina.component.html',
  styleUrls: ['./nueva-pagina.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NuevaPaginaComponent implements OnInit {
  private facade = inject(NuevaFeatureFacade);
  
  // Reactive streams
  data$ = this.facade.data$;
  loading$ = this.facade.loading$;
  error$ = this.facade.error$;

  ngOnInit(): void {
    this.facade.loadData();
  }

  onAction(payload: any): void {
    this.facade.performAction(payload);
  }
}
```

#### 2. Componente Átomo (UI)
```bash
ng generate component shared/ui/atoms/nuevo-atomo --standalone
```

**Template del Componente Átomo:**
```typescript
@Component({
  selector: 'app-nuevo-atomo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nuevo-atomo.component.html',
  styleUrls: ['./nuevo-atomo.component.scss']
})
export class NuevoAtomoComponent {
  // Usar signal inputs (Angular 19)
  data = input.required<DataType>();
  variant = input<'primary' | 'secondary'>('primary');
  
  // Outputs
  actionEvent = output<ActionPayload>();

  protected handleClick(): void {
    this.actionEvent.emit({ /* payload */ });
  }
}
```

### 🏪 Implementación de NgRx

#### 1. Actions
```typescript
// feature.actions.ts
import { createAction, props } from '@ngrx/store';

// Patrón: [Feature] Operation
export const loadItems = createAction('[Items] Load');

export const loadItemsSuccess = createAction(
  '[Items] Load Success',
  props<{ items: Item[] }>()
);

export const loadItemsFailure = createAction(
  '[Items] Load Failure',
  props<{ error: string }>()
);

// CRUD Operations
export const createItem = createAction(
  '[Items] Create',
  props<{ item: CreateItemRequest }>()
);

export const updateItem = createAction(
  '[Items] Update',
  props<{ id: string; changes: Partial<Item> }>()
);

export const deleteItem = createAction(
  '[Items] Delete',
  props<{ id: string }>()
);
```

#### 2. Reducer con EntityAdapter
```typescript
// feature.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export interface Item {
  id: string;
  name: string;
  // otros campos
}

export interface ItemsState extends EntityState<Item> {
  loading: boolean;
  error: string | null;
  selectedId: string | null;
}

export const adapter: EntityAdapter<Item> = createEntityAdapter<Item>();

export const initialState: ItemsState = adapter.getInitialState({
  loading: false,
  error: null,
  selectedId: null
});

export const itemsReducer = createReducer(
  initialState,
  
  // Load
  on(ItemsActions.loadItems, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ItemsActions.loadItemsSuccess, (state, { items }) =>
    adapter.setAll(items, {
      ...state,
      loading: false
    })
  ),
  
  on(ItemsActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // CRUD
  on(ItemsActions.createItemSuccess, (state, { item }) =>
    adapter.addOne(item, state)
  ),
  
  on(ItemsActions.updateItemSuccess, (state, { item }) =>
    adapter.updateOne({ id: item.id, changes: item }, state)
  ),
  
  on(ItemsActions.deleteItemSuccess, (state, { id }) =>
    adapter.removeOne(id, state)
  )
);
```

#### 3. Selectors
```typescript
// feature.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemsState, adapter } from './items.reducer';

export const selectItemsState = createFeatureSelector<ItemsState>('items');

// EntityAdapter selectors
const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();

export const selectAllItems = createSelector(selectItemsState, selectAll);
export const selectItemsEntities = createSelector(selectItemsState, selectEntities);
export const selectItemsIds = createSelector(selectItemsState, selectIds);
export const selectItemsTotal = createSelector(selectItemsState, selectTotal);

// Custom selectors
export const selectItemsLoading = createSelector(
  selectItemsState,
  (state) => state.loading
);

export const selectItemsError = createSelector(
  selectItemsState,
  (state) => state.error
);

export const selectItemById = (id: string) => createSelector(
  selectItemsEntities,
  (entities) => entities[id]
);

export const selectSelectedItem = createSelector(
  selectItemsState,
  selectItemsEntities,
  (state, entities) => state.selectedId ? entities[state.selectedId] : null
);
```

#### 4. Effects
```typescript
// feature.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ItemsEffects {
  private actions$ = inject(Actions);
  private itemsService = inject(ItemsService);
  private notificationService = inject(NotificationService);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.loadItems),
      switchMap(() =>
        this.itemsService.getItems().pipe(
          map(items => ItemsActions.loadItemsSuccess({ items })),
          catchError(error => {
            console.error('Error loading items:', error);
            return of(ItemsActions.loadItemsFailure({ 
              error: 'Error al cargar los elementos' 
            }));
          })
        )
      )
    )
  );

  createItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.createItem),
      switchMap(({ item }) =>
        this.itemsService.createItem(item).pipe(
          map(createdItem => ItemsActions.createItemSuccess({ item: createdItem })),
          catchError(error => of(ItemsActions.createItemFailure({ error: error.message })))
        )
      )
    )
  );

  // Success notifications
  createItemSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ItemsActions.createItemSuccess),
        tap(() => {
          this.notificationService.showSuccess('Elemento creado exitosamente');
        })
      ),
    { dispatch: false }
  );
}
```

#### 5. Facade
```typescript
// feature.facade.ts
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ItemsFacade {
  private store = inject(Store);

  // Selectors as observables
  readonly items$ = this.store.select(ItemsSelectors.selectAllItems);
  readonly loading$ = this.store.select(ItemsSelectors.selectItemsLoading);
  readonly error$ = this.store.select(ItemsSelectors.selectItemsError);
  readonly selectedItem$ = this.store.select(ItemsSelectors.selectSelectedItem);

  // Actions as methods
  loadItems(): void {
    this.store.dispatch(ItemsActions.loadItems());
  }

  createItem(item: CreateItemRequest): void {
    this.store.dispatch(ItemsActions.createItem({ item }));
  }

  updateItem(id: string, changes: Partial<Item>): void {
    this.store.dispatch(ItemsActions.updateItem({ id, changes }));
  }

  deleteItem(id: string): void {
    this.store.dispatch(ItemsActions.deleteItem({ id }));
  }

  selectItem(id: string): void {
    this.store.dispatch(ItemsActions.selectItem({ id }));
  }

  // Derived selectors
  itemById$(id: string): Observable<Item | undefined> {
    return this.store.select(ItemsSelectors.selectItemById(id));
  }
}
```

### 🔌 Implementación de Repository Pattern

#### 1. Domain Interface
```typescript
// domain/repositories/items.repository.ts
export interface ItemListParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface ItemListResult {
  data: Item[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export abstract class ItemsRepository {
  abstract getItems(params?: ItemListParams): Observable<ItemListResult>;
  abstract getItemById(id: string): Observable<Item>;
  abstract createItem(item: CreateItemRequest): Observable<Item>;
  abstract updateItem(id: string, changes: Partial<Item>): Observable<Item>;
  abstract deleteItem(id: string): Observable<void>;
}
```

#### 2. HTTP Implementation
```typescript
// infrastructure/http/items-http.repository.ts
@Injectable()
export class ItemsHttpRepository extends ItemsRepository {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/items`;

  getItems(params: ItemListParams = {}): Observable<ItemListResult> {
    const httpParams = this.buildParams(params);
    
    return this.http.get<ItemListResponseDto>(`${this.baseUrl}`, { params: httpParams })
      .pipe(
        map(response => ItemsAdapter.toDomainList(response)),
        catchError(this.handleError)
      );
  }

  getItemById(id: string): Observable<Item> {
    return this.http.get<ItemDto>(`${this.baseUrl}/${id}`)
      .pipe(
        map(dto => ItemsAdapter.toDomain(dto)),
        catchError(this.handleError)
      );
  }

  createItem(item: CreateItemRequest): Observable<Item> {
    const dto = ItemsAdapter.fromDomain(item);
    
    return this.http.post<ItemDto>(`${this.baseUrl}`, dto)
      .pipe(
        map(response => ItemsAdapter.toDomain(response)),
        catchError(this.handleError)
      );
  }

  private buildParams(params: ItemListParams): HttpParams {
    let httpParams = new HttpParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    
    return httpParams;
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('Repository error:', error);
    return throwError(() => new Error(error.message || 'Unknown error'));
  };
}
```

#### 3. Mock Implementation
```typescript
// infrastructure/http/items-mock.repository.ts
@Injectable()
export class ItemsMockRepository extends ItemsRepository {
  private mockData: Item[] = [
    {
      id: '1',
      name: 'Item 1',
      category: 'Category A',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    // más datos mock...
  ];

  getItems(params: ItemListParams = {}): Observable<ItemListResult> {
    return of(this.mockData).pipe(
      map(data => this.applyFilters(data, params)),
      map(filteredData => this.applyPagination(filteredData, params)),
      delay(500) // Simular latencia de red
    );
  }

  getItemById(id: string): Observable<Item> {
    const item = this.mockData.find(item => item.id === id);
    
    if (!item) {
      return throwError(() => new Error(`Item with id ${id} not found`));
    }
    
    return of(item).pipe(delay(300));
  }

  createItem(item: CreateItemRequest): Observable<Item> {
    const newItem: Item = {
      id: (this.mockData.length + 1).toString(),
      ...item,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockData.push(newItem);
    return of(newItem).pipe(delay(500));
  }

  private applyFilters(data: Item[], params: ItemListParams): Item[] {
    let filtered = [...data];

    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search)
      );
    }

    if (params.category) {
      filtered = filtered.filter(item => item.category === params.category);
    }

    return filtered;
  }

  private applyPagination(data: Item[], params: ItemListParams): ItemListResult {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: data.slice(startIndex, endIndex),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(data.length / limit),
        totalItems: data.length
      }
    };
  }
}
```

## 🎨 Guías de UI/UX

### 📱 Responsive Design

#### Breakpoints Estándar
```scss
// styles/breakpoints.scss
$breakpoints: (
  mobile: 320px,
  tablet: 768px,
  desktop: 1024px,
  wide: 1440px
);

@mixin mobile {
  @media (max-width: 767px) { @content; }
}

@mixin tablet {
  @media (min-width: 768px) and (max-width: 1023px) { @content; }
}

@mixin desktop {
  @media (min-width: 1024px) { @content; }
}

@mixin wide {
  @media (min-width: 1440px) { @content; }
}
```

#### Layout Patterns
```scss
// Grid Layout (Desktop)
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  
  @include mobile {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

// Flexbox Layout (Cards)
.stats-cards-section__container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  
  .stats-card {
    flex: 1;
    min-width: 280px;
    
    @include mobile {
      min-width: 100%;
    }
  }
}
```

### 🎨 Design System

#### Color Palette
```scss
// styles/colors.scss
:root {
  // Primary
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  // Status Colors
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #06b6d4;
  
  // Neutral
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
}
```

#### Typography
```scss
// styles/typography.scss
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }

.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

### 🧱 BEM Methodology

#### Naming Convention
```scss
// Componente: stats-card
.stats-card {                    // Block
  // base styles
  
  &__icon {                      // Element
    // icon styles
  }
  
  &__content {                   // Element
    // content styles
  }
  
  &__title {                     // Element
    // title styles
  }
  
  &--primary {                   // Modifier
    // primary variant
  }
  
  &--secondary {                 // Modifier
    // secondary variant
  }
  
  &--large {                     // Modifier
    // large size
  }
}
```

#### TypeScript Integration
```typescript
export class StatsCardComponent {
  data = input.required<StatsCardData>();
  variant = input<'primary' | 'secondary'>('primary');
  size = input<'small' | 'medium' | 'large'>('medium');

  protected getCardClasses(): string {
    const baseClass = 'stats-card';
    const variantClass = `stats-card--${this.variant()}`;
    const sizeClass = `stats-card--${this.size()}`;
    
    return `${baseClass} ${variantClass} ${sizeClass}`;
  }
}
```

## 🧪 Testing Guidelines

### 🔬 Unit Testing

#### Component Testing
```typescript
// component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('ItemsListComponent', () => {
  let component: ItemsListComponent;
  let fixture: ComponentFixture<ItemsListComponent>;
  let store: MockStore;

  const initialState = {
    items: {
      entities: {},
      ids: [],
      loading: false,
      error: null
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsListComponent],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load items on init', () => {
    spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(loadItems());
  });

  it('should display loading state', () => {
    store.setState({
      ...initialState,
      items: { ...initialState.items, loading: true }
    });
    
    fixture.detectChanges();
    
    const loadingElement = fixture.debugElement.query(By.css('.loading'));
    expect(loadingElement).toBeTruthy();
  });
});
```

#### Service Testing
```typescript
// service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ItemsHttpRepository', () => {
  let repository: ItemsHttpRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemsHttpRepository]
    });
    
    repository = TestBed.inject(ItemsHttpRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch items', () => {
    const mockResponse: ItemListResponseDto = {
      data: [{ id: '1', name: 'Test Item' }],
      meta: { current_page: 1, total_pages: 1, total_items: 1 }
    };

    repository.getItems().subscribe(result => {
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Test Item');
    });

    const req = httpMock.expectOne('/api/items');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
```

### 🎭 E2E Testing

#### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm start',
    port: 4200,
  },
});
```

#### E2E Test Example
```typescript
// e2e/reservations.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Reservations Management', () => {
  test('should display reservations list', async ({ page }) => {
    await page.goto('/reservas');
    
    // Wait for data to load
    await page.waitForSelector('[data-testid="reservations-table"]');
    
    // Check table exists
    const table = page.locator('[data-testid="reservations-table"]');
    await expect(table).toBeVisible();
    
    // Check rows exist
    const rows = page.locator('[data-testid="reservation-row"]');
    await expect(rows).toHaveCountGreaterThan(0);
  });

  test('should filter reservations', async ({ page }) => {
    await page.goto('/reservas');
    
    // Apply status filter
    await page.selectOption('[data-testid="status-filter"]', 'CONFIRMED');
    await page.click('[data-testid="apply-filters"]');
    
    // Check filtered results
    const confirmedRows = page.locator('[data-testid="reservation-row"][data-status="CONFIRMED"]');
    await expect(confirmedRows).toHaveCountGreaterThan(0);
  });

  test('should navigate to reservation detail', async ({ page }) => {
    await page.goto('/reservas');
    
    // Click on first reservation
    await page.click('[data-testid="reservation-row"]:first-child');
    
    // Check navigation
    await expect(page).toHaveURL(/\/reservas\/\w+/);
    
    // Check detail page loaded
    await expect(page.locator('[data-testid="reservation-detail"]')).toBeVisible();
  });
});
```

## 📋 Code Review Checklist

### ✅ Architecture & Structure
- [ ] Componente sigue Clean Architecture
- [ ] Separación correcta de responsabilidades
- [ ] Uso adecuado de Facade pattern
- [ ] Repository pattern implementado correctamente
- [ ] DTO/Domain/Adapter pattern seguido

### ✅ Angular Best Practices
- [ ] Standalone components utilizados
- [ ] OnPush change detection cuando aplique
- [ ] Signal inputs/outputs (Angular 19)
- [ ] Reactive forms para formularios
- [ ] Lazy loading implementado
- [ ] Guards de ruta apropiados

### ✅ TypeScript
- [ ] Tipado estricto sin `any`
- [ ] Interfaces bien definidas
- [ ] Generics utilizados apropiadamente
- [ ] Enums para constantes
- [ ] Utility types utilizados

### ✅ NgRx
- [ ] Actions siguen convención `[Feature] Operation`
- [ ] Reducer es función pura
- [ ] Effects manejan errores apropiadamente
- [ ] Selectors memorizados
- [ ] EntityAdapter para colecciones

### ✅ UI/UX
- [ ] Responsive design implementado
- [ ] Accesibilidad considerada (ARIA labels, etc.)
- [ ] Loading states implementados
- [ ] Error states manejados
- [ ] BEM methodology seguida
- [ ] Design system respetado

### ✅ Testing
- [ ] Unit tests cubren funcionalidad principal
- [ ] Mocks apropiados utilizados
- [ ] Edge cases considerados
- [ ] Tests de integración para features críticas

### ✅ Performance
- [ ] OnPush change detection
- [ ] TrackBy functions en ngFor
- [ ] Lazy loading de módulos/componentes
- [ ] Imágenes optimizadas
- [ ] Bundle size considerado

### ✅ Documentation
- [ ] Código autodocumentado
- [ ] Comentarios JSDoc donde necesario
- [ ] README actualizado si aplica
- [ ] Interfaces documentadas

## 🚀 Deployment & CI/CD

### 📦 Build Process
```bash
# Development build
npm run build:dev

# Production build
npm run build:prod

# Build with source maps
npm run build:prod -- --source-map

# Analyze bundle size
npm run build:prod -- --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

### 🔧 Environment Configuration
```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  useMockData: true,
  enableDevTools: true,
  logLevel: 'debug'
};

// environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.smartlinks.com',
  useMockData: false,
  enableDevTools: false,
  logLevel: 'error'
};
```

### 🔄 CI/CD Pipeline Example
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
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - run: npm ci
    - run: npm run lint
    - run: npm run test:ci
    - run: npm run build:prod

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    - run: npm ci
    - run: npm run build:prod
    - name: Deploy to S3
      run: aws s3 sync dist/ s3://smartlinks-frontend/
```

## 🆘 Troubleshooting Common Issues

### 🐛 Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Update Angular CLI
npm update -g @angular/cli

# Check for peer dependency conflicts
npm ls
```

### 🔧 Development Issues
```bash
# Clear Angular cache
ng cache clean

# Restart development server with fresh build
ng serve --no-build-cache

# Check for TypeScript errors
npx tsc --noEmit
```

### 📱 Browser Issues
```bash
# Clear browser cache and localStorage
# Check browser console for errors
# Verify network requests in DevTools
# Test in incognito mode
```

## 📞 Getting Help

### 📚 Resources
- [Angular Documentation](https://angular.dev/)
- [NgRx Documentation](https://ngrx.io/)
- [PrimeNG Documentation](https://primeng.org/)
- [Clean Architecture Guide](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### 🤝 Team Contacts
- **Tech Lead**: [Nombre] - [email]
- **Frontend Team**: [canal de Slack]
- **Code Reviews**: [proceso de PR]

---

📚 **Happy Coding! Siguiendo Clean Architecture con Angular 19** 📚
