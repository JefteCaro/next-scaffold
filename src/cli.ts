#!/usr/bin/env node
import chalk from "chalk";
import { program } from "commander";
import { setupCommand } from "./commands/setup.js";
import { listCommand } from "./commands/list.js";
import { createCommand } from "./commands/create.js";
import { pageCommand } from "./commands/page.js";

const version = "0.0.0";

program
  .version(version, "-v, --version", `Display version (${chalk.cyan(version)})`)
  .description(chalk.cyan("Next.js Starter") + " - CLI tool for scaffolding production-ready Next.js projects")
  .helpOption("-h, --help", "Display help for command");

program
  .command("setup")
  .description(chalk.green("Set up a new Next.js project from templates"))
  .option("-n, --name <name>", "Project name")
  .option("-t, --template <template>", "Template type (basic, full-stack, e-commerce, saas, blog, monorepo)")
  .option("-d, --dir <dir>", "Output directory")
  .action(setupCommand);

program
  .command("list")
  .description(chalk.green("List available templates"))
  .action(listCommand);

program
  .command("create <name>")
  .description(chalk.green("Create a new project with the specified name"))
  .option("-t, --template <template>", "Template type")
  .option("-d, --dir <dir>", "Output directory")
  .action(createCommand);

program
  .command("page")
  .description(chalk.green("Create a new page with the specified route and template"))
  .option("-r, --route <route>", "Route path (e.g., /dashboard, /settings/profile, /api/users)")
  .option("-t, --template <template>", "Available page templates:\n"+ chalk.green("blank, form, form-with-validation, api-route, dashboard, data-table, auth, blog, shop, login, signup, forgot-password, profile, settings, product-detail, checkout, order-confirmation, landing, pricing, features, contact, testimonials, team, about, faq, error-404, error-500, maintenance, admin-dashboard, gallery, invoice, search-results, case-study"))
  .option("-s, --style <style>", "UI/UX style variant (default, minimal, modern, glassmorphism, vibrant, dark)")
  .option("-d, --dir <dir>", "Project directory (defaults to current directory)")
  .option("--layout", "Generate layout.tsx for the route")
  .option("--not-found", "Generate not-found.tsx for the route")
  .option("--template-component", "Generate template.tsx for the route")
  .option("--loading", "Generate loading.tsx for the route")
  .action(pageCommand);

program.parse();
