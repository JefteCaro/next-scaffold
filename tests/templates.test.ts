import { describe, it, expect } from "vitest";
import { getTemplates, getTemplateMetadata } from "../src/templates/index";

describe("Templates", () => {
  it("should return all available templates", () => {
    const templates = getTemplates();
    expect(templates).toContain("basic");
    expect(templates).toContain("full-stack");
    expect(templates).toContain("e-commerce");
    expect(templates).toContain("saas");
    expect(templates).toContain("blog");
    expect(templates).toContain("monorepo");
  });

  it("should return metadata for basic template", () => {
    const metadata = getTemplateMetadata("basic");
    expect(metadata).toBeDefined();
    expect(metadata?.name).toBe("Basic");
    expect(metadata?.category).toBe("basic");
    expect(metadata?.features).toContain("TypeScript");
  });

  it("should return null for unknown template", () => {
    const metadata = getTemplateMetadata("unknown");
    expect(metadata).toBeNull();
  });

  it("should have nextVersion for all templates", () => {
    const templates = getTemplates();
    templates.forEach((template) => {
      const metadata = getTemplateMetadata(template);
      expect(metadata?.nextVersion).toBeDefined();
      expect(metadata?.nextVersion).toMatch(/\d+\+/);
    });
  });
});
