import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const errors = [];

function checkFile(filePath, content) {
  const relativePath = path.relative(rootDir, filePath);

  // Check for SSR/ISR/Edge/API Route patterns
  const ssrPatterns = [
    /getServerSideProps/,
    /getStaticProps/,
    /getInitialProps/,
    /server-only/,
    /next\/headers/,
    /cookies\(\)/,
    /dynamic\s*=\s*['"]force-dynamic['"]/,
  ];

  ssrPatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      errors.push(`❌ ${relativePath}: Contains SSR/ISR pattern: ${pattern}`);
    }
  });

  // Check for API routes
  if (filePath.includes("/api/") || filePath.includes("/pages/api/")) {
    errors.push(`❌ ${relativePath}: API Route detected (not allowed for static export)`);
  }

  // Check for dynamic routes without generateStaticParams
  if (filePath.includes("[") && filePath.endsWith(".tsx")) {
    const dir = path.dirname(filePath);
    const hasGenerateStaticParams = content.includes("generateStaticParams");
    if (!hasGenerateStaticParams) {
      errors.push(
        `❌ ${relativePath}: Dynamic route without generateStaticParams`
      );
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, out
      if (
        !file.startsWith(".") &&
        file !== "node_modules" &&
        file !== ".next" &&
        file !== "out"
      ) {
        walkDir(filePath);
      }
    } else if (file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".jsx") || file.endsWith(".js")) {
      const content = fs.readFileSync(filePath, "utf-8");
      checkFile(filePath, content);
    }
  }
}

// Check app directory
const appDir = path.join(rootDir, "app");
if (fs.existsSync(appDir)) {
  walkDir(appDir);
}

// Check pages directory
const pagesDir = path.join(rootDir, "pages");
if (fs.existsSync(pagesDir)) {
  walkDir(pagesDir);
}

// Check components directory
const componentsDir = path.join(rootDir, "components");
if (fs.existsSync(componentsDir)) {
  walkDir(componentsDir);
}

if (errors.length > 0) {
  console.error("\n❌ Static Export Check Failed:\n");
  errors.forEach((error) => console.error(error));
  console.error(`\nFound ${errors.length} error(s)\n`);
  process.exit(1);
} else {
  console.log("✅ Static export check passed!");
}

