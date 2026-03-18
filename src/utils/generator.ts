import fsExtra from "fs-extra";
import { join } from "path";

const { ensureDir, writeFile, readFile: fsReadFile } = fsExtra;
import { logger } from "./logger.js";

export interface GenerateOptions {
  templateName: string;
  projectPath: string;
  projectName: string;
  packageManager?: "pnpm" | "npm" | "yarn";
}

export async function generateProject(options: GenerateOptions): Promise<void> {
  const { templateName, projectPath, projectName, packageManager = "pnpm" } = options;

  try {
    // Create project directory
    await ensureDir(projectPath);
    logger.success(`Created project directory: ${projectPath}`);

    // Copy template files (will be implemented with actual templates)
    logger.info(`Generating ${templateName} template...`);

    // Update package.json with project name
    const packageJsonPath = join(projectPath, "package.json");
    try {
      const packageJson = JSON.parse(await fsReadFile(packageJsonPath, "utf-8"));
      packageJson.name = projectName;
      await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      logger.success(`Updated package.json with project name: ${projectName}`);
    } catch {
      logger.warn(`Could not update package.json`);
    }

    logger.success(`Project generated successfully!`);
    logger.info(`Next steps:
  1. cd ${projectPath}
  2. ${packageManager} install
  3. ${packageManager === "pnpm" ? "pnpm dev" : `${packageManager} run dev`}
    `);
  } catch (error) {
    logger.error(`Failed to generate project: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}
