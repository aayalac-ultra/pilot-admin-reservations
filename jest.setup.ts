import 'jest-preset-angular/setup-jest';

// Optional: custom mocks (e.g., for ResizeObserver)
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-ignore
global.ResizeObserver = ResizeObserverMock;
