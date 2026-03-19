import fsExtra from "fs-extra";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const { ensureDir, writeFile, readFile: fsReadFile, copy } = fsExtra;
import { logger } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface GenerateOptions {
  templateName: string;
  projectPath: string;
  projectName: string;
  packageManager?: "pnpm" | "npm" | "yarn";
}

export async function generateProject(options: GenerateOptions): Promise<void> {
  const { templateName, projectPath, projectName, packageManager = "pnpm" } = options;

  const rootProjectPath = projectPath.endsWith("src") ? join(projectPath, "..") : projectPath;

  try {
    // Create project directory
    await ensureDir(projectPath);
    logger.success(`Created project directory: ${projectPath}`);

    // Copy template files from preset
    logger.info(`Generating ${templateName} template...`);
    
    // Construct the template source path (presets are copied from templates/ to dist/templates/)
    const templateSourcePath = join(__dirname, "..", "templates", templateName);

    // Construct the tailwindcss preset files
    const nextAppPresetSourcePath = join(__dirname, "..", "presets", "next-app");

    const nextComponentsSourcePath = join(__dirname, "..", "presets", "next-components");
    
    try {
      // Copy all template files to project directory
      await copy(templateSourcePath, join(projectPath, "app"), {
        overwrite: true,
        errorOnExist: false,
      });
      logger.success(`Copied template files from ${templateSourcePath}`);
    } catch (error) {
      throw new Error(
        `Failed to copy template files: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    try {
      // Copy tailwindcss and shadcn-ui presets
      let nextAppDestPath = projectPath;

      if(nextAppDestPath.endsWith("src")) {
        nextAppDestPath = join(nextAppDestPath, "..");
      }
      await copy(nextAppPresetSourcePath, nextAppDestPath, {
        overwrite: true,
        errorOnExist: false,
      });
      logger.success(`Copied presets from ${nextAppPresetSourcePath}`);
    } catch (error) {
      throw new Error(
        `Failed to copy presets: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    try {
      // Copy next-components preset to src/components
      await copy(nextComponentsSourcePath, projectPath, {
        overwrite: true,
        errorOnExist: false,
      });
      logger.success(`Copied components preset from ${nextComponentsSourcePath}`);
    } catch (error) {
      throw new Error(
        `Failed to copy components preset: ${error instanceof Error ? error.message : String(error)}`
      );

    }

    // Update package.json with project name
    const packageJsonPath = join(rootProjectPath, "package.json");
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
  1. cd ${rootProjectPath}
  2. ${packageManager} install
  3. ${packageManager === "pnpm" ? "pnpm dev" : `${packageManager} run dev`}
    `);
  } catch (error) {
    logger.error(`Failed to generate project: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}
