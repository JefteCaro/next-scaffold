import fsExtra from "fs-extra";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const { ensureDir, exists, writeFile, readFile: fsReadFile, copy } = fsExtra;
import { logger } from "./logger.js";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dependencies = {
  supabase: {
    "@supabase/ssr": "^0.9.0",
    "@supabase/supabase-js": "^2.100.0",
  }
}

export interface InitAuthOptions {
  provider?: string
  projectPath: string
}

export async function initializeAuth(options: InitAuthOptions): Promise<void> {

  const {provider, projectPath } = options
  
  const rootProjectPath = projectPath?.endsWith("src") ? join(projectPath, "..") : projectPath;

  const sourcePath = join(__dirname, "..", "presets", "auth");

  logger.info(`Setting up authentication with ${provider}...`);

  switch (provider?.toLowerCase()) {
    case "supabase":
      await initializeSupabase(sourcePath, rootProjectPath);
      break;
    case "nextauth.js":
      // Placeholder for NextAuth.js auth setup logic
      logger.info("NextAuth.js authentication setup is currently a placeholder. Please refer to the documentation for manual setup instructions.");
      break;
    case "clerk":
      // Placeholder for Clerk auth setup logic
      logger.info("Clerk authentication setup is currently a placeholder. Please refer to the documentation for manual setup instructions.");
      break;
    case "auth0":
      // Placeholder for Auth0 auth setup logic
      logger.info("Auth0 authentication setup is currently a placeholder. Please refer to the documentation for manual setup instructions.");
      break;
    default:
      logger.error(`Unsupported authentication provider: ${provider}. Skipping auth setup.`);
  }

}


const initializeSupabase = async (source: string, rootPath: string ) => {
  // Copy app pages and API routes for Supabase auth
      await copy(join(source, 'supabase', "app"), join(rootPath, "app"), {overwrite: true, errorOnExist: false});
      // Copy lib files
      await copy(join(source, 'supabase', "lib"), join(rootPath, "lib"), {overwrite: true, errorOnExist: false});
      // Copy proxy
      await copy(join(source, 'supabase', "proxy.ts"), join(rootPath, "proxy.ts"), {overwrite: true, errorOnExist: false});
      // Copy .env file
      await copy(join(source, 'supabase', "env.example"), join(rootPath, ".env.local"), {overwrite: true, errorOnExist: false});
      // Update package.json dependencies
      const packageJsonPath = join(rootPath, "package.json");
      if (await exists(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(await fsReadFile(packageJsonPath, "utf-8"));
          packageJson.dependencies = {
            ...packageJson.dependencies,
            ...dependencies.supabase,
          };
          await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf-8");
          logger.success(`Updated package.json with Supabase dependencies`);
        } catch (error) {
          logger.error(`Failed to update package.json: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else {
        logger.warn(`package.json not found at ${packageJsonPath}. Please ensure to install @supabase/supabase-js and @supabase/ssr manually.`);
      }
      logger.success(`Copied Supabase auth templates`);
}