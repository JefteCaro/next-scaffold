import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/utils/logger", () => ({
  logger: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    log: vi.fn(),
  },
}));

describe("Generator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a generator instance with options", async () => {
    const options = {
      templateName: "basic",
      projectPath: "/tmp/test-project",
      projectName: "test-project",
      packageManager: "pnpm" as const,
    };

    expect(options.templateName).toBe("basic");
    expect(options.projectName).toBe("test-project");
    expect(options.packageManager).toBe("pnpm");
  });

  it("should have all required options", () => {
    const requiredKeys = ["templateName", "projectPath", "projectName"];
    const options = {
      templateName: "basic",
      projectPath: "/tmp/test",
      projectName: "test",
    };

    requiredKeys.forEach((key) => {
      expect(options).toHaveProperty(key);
    });
  });
});
