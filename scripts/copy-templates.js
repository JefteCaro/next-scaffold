import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Copy presets from templates to dist/templates

const templatesSourceDir = path.join(__dirname, "..", "templates");
const templatesDestDir = path.join(__dirname, "..", "dist", "templates");

const presetSourceDir = path.join(__dirname, "..", "presets");
const presetDestDir = path.join(__dirname, "..", "dist", "presets");

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src, { withFileTypes: true });
  
  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function copyTemplates(sourceDir, destDir) {
  try {
    console.log(`Copying templates from ${sourceDir} to ${destDir}`);
    
    if (!fs.existsSync(sourceDir)) {
      throw new Error(`Source directory not found: ${sourceDir}`);
    }

    copyRecursive(sourceDir, destDir);
    console.log("✓ Templates copied successfully");
  } catch (error) {
    console.error("✗ Failed to copy templates:", error.message);
    process.exit(1);
  }
}

copyTemplates(templatesSourceDir, templatesDestDir);
copyTemplates(presetSourceDir, presetDestDir);
