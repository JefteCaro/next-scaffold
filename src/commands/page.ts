import { log } from "console";
import { logger } from "../utils/logger.js";
import { generatePage, PageTemplate, UIStyle } from "../utils/pageGenerator.js";

interface PageOptions {
  route?: string;
  template?: PageTemplate;
  style?: UIStyle;
  dir?: string;
  layout?: boolean;
  notFound?: boolean;
  templateComponent?: boolean;
  loading?: boolean;
}

export async function pageCommand(options: PageOptions): Promise<void> {
  // Validate route
  if (!options.route) {
    logger.error("Route is required. Use --route /your-route");
    logger.info("Available templates: blank, form, form-with-validation, api-route, dashboard, data-table, auth, blog, shop, login, signup, forgot-password, profile, settings, product-detail, checkout, order-confirmation, landing, pricing, features, contact, testimonials, team, about, faq, error-404, error-500, maintenance, admin-dashboard, gallery, invoice, search-results, case-study");
    process.exit(1);
  }

  // Validate template
  if (!options.template) {
    options.template = "blank"; // Default to blank template if not specified
    logger.warn("No template specified. Defaulting to 'blank' template.");
  }

  const validTemplates: PageTemplate[] = ["blank", "form", "form-with-validation", "api-route", "dashboard", "data-table", "auth", "blog", "shop", "login", "signup", "forgot-password", "profile", "settings", "product-detail", "checkout", "order-confirmation", "landing", "pricing", "features", "contact", "testimonials", "team", "about", "faq", "error-404", "error-500", "maintenance", "admin-dashboard", "gallery", "invoice", "search-results", "case-study"];
  if (!validTemplates.includes(options.template)) {
    logger.error(`Unknown template: ${options.template}`);
    logger.info(`Available templates: ${validTemplates.join(", ")}`);
    process.exit(1);
  }

  // Validate style if provided
  const validStyles: UIStyle[] = ["default", "minimal", "modern", "glassmorphism", "vibrant", "dark"];
  if (options.style && !validStyles.includes(options.style)) {
    logger.error(`Unknown style: ${options.style}`);
    logger.info(`Available styles: ${validStyles.join(", ")}`);
    process.exit(1);
  }

  try {
    await generatePage({
      route: options.route,
      template: options.template,
      style: options.style || "default",
      projectPath: options.dir || process.cwd(),
      layout: options.layout || false,
      notFound: options.notFound || false,
      template_component: options.templateComponent || false,
      loading: options.loading || false,
    });
  } catch (error) {
    logger.error(`Page creation failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
