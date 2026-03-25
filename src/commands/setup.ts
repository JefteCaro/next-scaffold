import inquirer from "inquirer";
import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { logger } from "../utils/logger.js";
import { generateProject } from "../utils/generator.js";
import { initializeAuth } from "../utils/initializeAuth.js";
import { getTemplates, getTemplateMetadata } from "../templates/index.js";
import { copy } from "fs-extra";

interface SetupOptions {
  name?: string;
  template?: string;
  dir?: string;
  auth?: string
}

const AUTH_PROVIDERS = ["Supabase", "NextAuth.js", "Clerk", "Auth0"];

interface WorkspaceInfo {
  isMonorepo: boolean;
  monorepoRoot?: string;
  packageManager: "pnpm" | "npm" | "yarn";
}

/**
 * Detect if the current workspace is a monorepo or standalone Next.js project
 * Checks for pnpm-workspace.yaml, turbo.json, lerna.json, or workspaces in package.json
 */
function detectWorkspaceType(startPath: string = process.cwd()): WorkspaceInfo {
  let currentPath = startPath;
  const rootIndicators = ["pnpm-workspace.yaml", "turbo.json", "lerna.json", "pnpm-lock.yaml"];
  
  // Search up the directory tree for monorepo indicators
  while (currentPath !== join(currentPath, "..")) {
    try {
      // Check for monorepo files
      for (const indicator of rootIndicators) {
        if (existsSync(join(currentPath, indicator))) {
          logger.info(`Detected monorepo at: ${currentPath}`);
          return {
            isMonorepo: true,
            monorepoRoot: currentPath,
            packageManager: detectPackageManager(currentPath),
          };
        }
      }
      
      // Check for workspaces in package.json
      const packageJsonPath = join(currentPath, "package.json");
      if (existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
          if (packageJson.workspaces) {
            logger.info(`Detected monorepo with workspaces at: ${currentPath}`);
            return {
              isMonorepo: true,
              monorepoRoot: currentPath,
              packageManager: detectPackageManager(currentPath),
            };
          }
        } catch {
          // Continue searching if package.json parse fails
        }
      }
      
      currentPath = join(currentPath, "..");
    } catch {
      break;
    }
  }
  
  logger.info("Detected standalone Next.js project");
  return {
    isMonorepo: false,
    packageManager: detectPackageManager(startPath),
  };
}

/**
 * Detect the package manager being used (pnpm, npm, or yarn)
 */
function detectPackageManager(path: string): "pnpm" | "npm" | "yarn" {
  if (existsSync(join(path, "pnpm-lock.yaml"))) {
    return "pnpm";
  }
  if (existsSync(join(path, "yarn.lock"))) {
    return "yarn";
  }
  return "npm";
}

export async function setupCommand(options: SetupOptions): Promise<void> {
  try {
    logger.info("Starting Next.js project setup...\n");

    // Detect workspace type
    const workspaceInfo = detectWorkspaceType();

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

    // Determine output directory based on workspace type
    let outputDir = options.dir;
    if (!outputDir) {
      if (workspaceInfo.isMonorepo && workspaceInfo.monorepoRoot) {
        // For monorepo, install in apps/ directory by default
        outputDir = join(workspaceInfo.monorepoRoot, "apps", projectName, "src");
        logger.info(`Installing in monorepo apps directory`);
      } else {
        // For standalone, install in current directory or project name subdirectory
        outputDir = join(process.cwd(), projectName, "src");
      }
    }

    logger.info(`Creating project: ${projectName}`);
    logger.info(`Template: ${template}`);
    logger.info(`Workspace type: ${workspaceInfo.isMonorepo ? "Monorepo" : "Standalone"}`);
    logger.info(`Location: ${outputDir}\n`);

    // Generate project
    await generateProject({
      templateName: template!,
      projectPath: outputDir,
      projectName: projectName!,
      packageManager: workspaceInfo.packageManager,
    });

    // Initialize authentication (if specified)
    if (options.auth) {
      await initializeAuth({provider: options.auth, projectPath: outputDir});
    }


    logger.success("\nProject setup complete!");
  } catch (error) {
    logger.error(`Setup failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
