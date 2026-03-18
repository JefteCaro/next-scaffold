import { join } from "path";
import { logger } from "../utils/logger.js";
import { generateProject } from "../utils/generator.js";
import { setupCommand } from "./setup.js";

interface CreateOptions {
  template?: string;
  dir?: string;
}

export async function createCommand(projectName: string, options: CreateOptions): Promise<void> {
  if (!projectName) {
    logger.error("Project name is required");
    process.exit(1);
  }

  if (!options.template) {
    // Fall back to setup command for interactive prompt
    await setupCommand({
      name: projectName,
      dir: options.dir,
    });
  } else {
    try {
      const outputDir = options.dir || join(process.cwd(), projectName);

      logger.info(`Creating project: ${projectName}`);
      logger.info(`Template: ${options.template}`);
      logger.info(`Location: ${outputDir}\n`);

      await generateProject({
        templateName: options.template,
        projectPath: outputDir,
        projectName: projectName,
        packageManager: "pnpm",
      });

      logger.success("\nProject created successfully!");
    } catch (error) {
      logger.error(`Create failed: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
}
