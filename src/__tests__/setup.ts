import { afterEach, beforeEach, vi } from "vitest";

import "@testing-library/jest-dom";

// Global test setup
beforeEach(() => {
  // Reset mocks before each test
  vi.clearAllMocks();
});

afterEach(() => {
  // Cleanup after each test
  vi.restoreAllMocks();
});
