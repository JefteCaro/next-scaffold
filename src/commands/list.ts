import { logger } from "../utils/logger.js";
import { getTemplates, getTemplateMetadata } from "../templates/index.js";

export async function listCommand(): Promise<void> {
  const templates = getTemplates();
  const categories = new Map<string, typeof templates>();

  // Group templates by category
  templates.forEach((templateId) => {
    const metadata = getTemplateMetadata(templateId);
    if (metadata) {
      if (!categories.has(metadata.category)) {
        categories.set(metadata.category, []);
      }
      categories.get(metadata.category)!.push(templateId);
    }
  });

  logger.info("Available Templates:\n");

  // Display by category
  Array.from(categories.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([category, templateIds]) => {
      logger.log(`\n📁 ${category.toUpperCase()}`);
      logger.log("─".repeat(60));

      templateIds.forEach((templateId) => {
        const metadata = getTemplateMetadata(templateId);
        if (metadata) {
          const source = metadata.source === "vercel" ? "[Vercel]" : "[Local]";
          logger.log(
            `\n  📦 ${metadata.name.padEnd(30)} ${source}`,
          );
          logger.log(
            `     ${metadata.description}`,
          );
          logger.log(
            `     Features: ${metadata.features.join(", ")}`,
          );
        }
      });
    });

  logger.log("\n");
  logger.info("Usage:");
  logger.log(
    "  pnpm nstarter setup --template <template-id>",
  );
  logger.log(
    "  pnpm nstarter create <project-name> --template <template-id>",
  );
  logger.log(
    "\nExample:",
  );
  logger.log(
    "  pnpm nstarter create my-app --template nextjs-commerce",
  );
  logger.log(
    "  pnpm nstarter setup --template gemini-chatbot",
  );
}
