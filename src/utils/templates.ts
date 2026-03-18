import { readdir, readFile } from "fs/promises";
import { join } from "path";

export interface TemplateMetadata {
  name: string;
  description: string;
  category: "basic" | "full-stack" | "e-commerce" | "saas" | "blog" | "monorepo";
  features: string[];
  nextVersion: string;
}

const TEMPLATES_DIR = join(import.meta.dirname, "..", "templates", "presets");

export async function getTemplateFiles(templateName: string): Promise<string[]> {
  const templateDir = join(TEMPLATES_DIR, templateName);
  try {
    return await readdir(templateDir, { recursive: true });
  } catch {
    return [];
  }
}

export async function readTemplateFile(templateName: string, filePath: string): Promise<string> {
  const fullPath = join(TEMPLATES_DIR, templateName, filePath);
  return readFile(fullPath, "utf-8");
}

export async function getAvailableTemplates(): Promise<string[]> {
  try {
    return await readdir(TEMPLATES_DIR);
  } catch {
    return ["basic", "full-stack", "e-commerce", "saas", "blog", "monorepo"];
  }
}
