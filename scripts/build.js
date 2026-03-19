#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  // Copy templates
  console.log("Copying templates...");
  execSync("node scripts/copy-templates.js", {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
  });

  // Run TypeScript compiler
  console.log("Compiling TypeScript...");
  execSync("tsc", {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
  });

  console.log("✓ Build complete");
} catch (error) {
  console.error("✗ Build failed");
  process.exit(1);
}
