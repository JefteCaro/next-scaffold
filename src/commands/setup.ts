import inquirer from "inquirer";
import { join } from "path";
import { logger } from "../utils/logger.js";
import { generateProject } from "../utils/generator.js";
import { getTemplates, getTemplateMetadata } from "../templates/index.js";

interface SetupOptions {
  name?: string;
  template?: string;
  dir?: string;
}

export async function setupCommand(options: SetupOptions): Promise<void> {
  try {
    logger.info("Starting Next.js project setup...\n");

    // Prompt for project name if not provided
    let projectName = options.name;
    if (!projectName) {
      const answers = (await inquirer.prompt([
        {
          type: "input",
          name: "projectName",
          message: "Project name:",
          default: "my-next-app",
          validate: (input: string) => {
            if (!input.trim()) return "Project name is required";
            return true;
          },
        },
      ])) as { projectName: string };
      projectName = answers.projectName;
    }

    // Prompt for template if not provided
    let template = options.template;
    if (!template) {
      // Build dynamic choices from templates
      const templates = getTemplates();
      const choices = templates.map((templateId) => {
        const metadata = getTemplateMetadata(templateId);
        return {
          name: metadata?.name || templateId,
          value: templateId,
          description: metadata?.description || "",
        };
      });

      const answers = (await inquirer.prompt([
        {
          type: "list",
          name: "template",
          message: "Select a template:",
          choices,
          pageSize: 15,
        },
      ])) as { template: string };
      template = answers.template;
    }

    // Determine output directory
    const outputDir = options.dir || join(process.cwd(), projectName);

    logger.info(`Creating project: ${projectName}`);
    logger.info(`Template: ${template}`);
    logger.info(`Location: ${outputDir}\n`);

    // Generate project
    await generateProject({
      templateName: template!,
      projectPath: outputDir,
      projectName: projectName!,
      packageManager: "pnpm",
    });

    logger.success("\nProject setup complete!");
  } catch (error) {
    logger.error(`Setup failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
