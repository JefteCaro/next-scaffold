# next-scaffold

A CLI tool for scaffolding production-ready Next.js boilerplate projects.

## Overview

`scaffold` is a code generator that creates customized Next.js projects based on your selected template. It provides multiple pre-configured templates to jumpstart your development with best practices, conventions, and modern tooling already set up.

## Installation

##### via npm
```bash
npm add @jeftecaro/next-scaffold
```

##### via pnpm
```bash
pnpm add @jeftecaro/next-scaffold
```

##### via yarn
```bash
yarn add @jeftecaro/next-scaffold
```

## Usage

### List Available Templates

View all available templates:

```bash
pnpm scaffold list
```

### Setup New Project (Interactive)

Start an interactive setup wizard:

```bash
pnpm scaffold setup
```

You'll be prompted to:
1. Enter your project name
2. Select a template
3. Choose output directory (defaults to current directory)

#### Options
| Parameter | Description |
| --------- | ------- |
| `-n`, `--name <name>` | Project Name |
| `-t`, `--template <template>` | Template type |
| `-d`, `--dir <dir>` | Output directory |

##### Available Templates
- `basic`
- `dashboard`
- `analytics`
- `calendars`
- `chat`
- `cms`
- `crm`
- `ecommerce`
- `files`
- `inbox`
- `payment`
- `projects`
- `shop`
- `video-call`
- `workspace`


### Create Project (Direct)

Create a project with specific template:

```bash
pnpm scaffold create my-app --template basic
pnpm scaffold create my-app --template full-stack --dir ./projects
```

### Available Templates

scaffold provides a comprehensive collection of templates, including local starters and curated templates from Vercel. Templates are organized by category:

#### Local Templates

**Basic** - Minimal Next.js setup with TypeScript and ESLint

**Full-stack** - Next.js with API routes and database integration  

**E-commerce** - Product catalog, shopping cart, and checkout flows

**SaaS** - Authentication, billing, multi-tenant architecture

**Blog** - Content management with markdown and SEO optimization

**Monorepo** - Turborepo workspace with multiple apps and shared packages

#### Vercel Community Templates

##### AI & Machine Learning
- **Chatbot** - Full-featured AI chatbot
- **Gemini AI Chatbot** - Gemini-powered chat interface  
- **Hume AI Voice Interface** - Voice chat with empathic AI
- **Lead Agent** - Lead qualification agent with Slack integration
- **Morphic** - AI-powered answer engine
- **Pinecone RAG** - Retrieval-augmented generation with vector database
- **Customer Reviews AI** - Summarize customer feedback with LLM
- **qrGPT** - AI QR code generator
- **AI Headshot Generator** - Professional headshot generation

##### E-commerce
- **Next.js Commerce** - Shopify integration
- **Medusa Store** - Medusa ecommerce platform
- **Stripe Subscription** - SaaS billing with Stripe

##### SaaS & Business
- **Platforms Starter** - Multi-tenant architecture
- **Next.js SaaS Starter** - Complete SaaS setup
- **Enterprise Boilerplate** - Enterprise-grade setup
- **Liveblocks Starter** - Real-time collaboration

##### Content & CMS
- **Sanity Personal Website** - Sanity CMS integration
- **Sanity Clean App** - Sanity with visual editor
- **Nextra Docs** - Documentation site generator
- **Blog Starter Kit** - Markdown-based blog
- **Contentlayer Blog** - Blog with Contentlayer
- **ISR WordPress Blog** - Headless WordPress integration

##### Portfolio & Design
- **Portfolio Starter** - Portfolio with markdown
- **Portfolio with Blog** - Portfolio + blog combination

##### Other
- **App Router Playground** - Examples of App Router features
- **Image Gallery** - Cloudinary image gallery
- **Supabase Starter** - Supabase authentication
- **Email Client** - Email management app
- **Preview Mode** - Content preview functionality

## Project Structure

```
packages/scaffold/
├── src/
│   ├── cli.ts              # CLI entry point
│   ├── index.ts            # Public API
│   ├── commands/           # CLI commands
│   │   ├── setup.ts
│   │   ├── list.ts
│   │   └── create.ts
│   ├── utils/              # Utility functions
│   │   ├── logger.ts
│   │   ├── generator.ts
│   │   └── templates.ts
│   └── templates/          # Template presets
│       └── presets/
│           └── basic/      # Template files
├── tests/                  # Test files
├── package.json
├── tsconfig.json
└── README.md
```

## Template Sources

**Local Templates** - Custom templates maintained in this workspace
- Located in `packages/scaffold/src/templates/presets/`
- Local customization and full control
- Workspace conventions and best practices

**Vercel Templates** - Curated templates from the Vercel community
- Referenced via metadata (URL, description, features)
- Community-tested and maintained
- Wide variety of use cases and technologies
- Ideal for learning and quick starts

## Development

### Build

```bash
pnpm build
```

### Development Mode

Run CLI in development mode with ts-node:

```bash
pnpm run dev -- list
pnpm run dev -- setup
```

### Testing

Run tests:

```bash
pnpm test
```

Run tests with coverage:

```bash
pnpm test:coverage
```

### Type Checking

```bash
pnpm check-types
```

### Linting

```bash
pnpm lint
```

## Adding New Templates

### Add a Local Template

To add a new local template:

1. Create a new directory in `src/templates/presets/<template-name>`
2. Add template files (package.json, layout.tsx, etc.)
3. Update `src/templates/index.ts` with template metadata
4. Update `src/commands/list.ts` to include the new template
5. Add tests in `tests/`

Example:

```bash
mkdir -p src/templates/presets/my-template
# Add template files
```

Then update `src/templates/index.ts`:

```typescript
export const TEMPLATES_METADATA: Record<string, TemplateMetadata> = {
  // ... existing templates
  "my-template": {
    name: "My Template",
    description: "Description of your template",
    category: "basic",
    features: ["Feature 1", "Feature 2"],
    nextVersion: "14+",
    source: "local",
  },
};
```

### Add a Vercel Template Reference

To add a reference to a Vercel template (without downloading it):

1. Update `src/templates/index.ts` with the template metadata:

```typescript
"template-id": {
  name: "Template Name",
  description: "Description from Vercel",
  category: "category",
  features: ["Feature 1", "Feature 2"],
  nextVersion: "14+",
  repository: "https://vercel.com/templates/...",
  source: "vercel",
}
```

2. The template will automatically appear in `pnpm scaffold list`
3. Users can see details about it without it being pre-packaged

## Integration with Workspace

The CLI can be invoked from any directory in the workspace:

```bash
# From root
pnpm scaffold setup

# From an app
cd apps/web
pnpm scaffold create my-project --template basic

# From another location
pnpm scaffold list
```

## Scripts

Root workspace scripts that use scaffold:

```bash
pnpm scaffold          # Show help
pnpm scaffold:setup    # Run setup wizard
pnpm scaffold:list     # List templates
```

## API Usage

Use scaffold programmatically:

```typescript
import {
  setupCommand,
  createCommand,
  getTemplates,
  getTemplateMetadata,
} from "@repo/scaffold";

// List all templates
const templates = getTemplates();

// Get template metadata
const basic = getTemplateMetadata("basic");

// Programmatically create a project
await createCommand("my-app", {
  template: "basic",
  dir: "./projects",
});
```

## Next Steps

After creating a project:

```bash
cd my-app
pnpm install
pnpm dev
```

Your project will be available at `http://localhost:3000`

## Contributing

When contributing new features or templates:

1. Follow the existing code structure
2. Add tests for new functionality
3. Update documentation
4. Ensure TypeScript types are correct
5. Follow the workspace ESLint configuration

### Supported Categories

Categories help organize templates by their primary use case:
- `basic` - Minimal starter projects
- `full-stack` - Backend + frontend integration
- `e-commerce` - Online store and commerce
- `saas` - Multi-tenant and subscription apps
- `blog` - Content and documentation sites
- `monorepo` - Multi-package workspaces
- `ai` - AI/ML and generative features
- `cms` - Content management systems
- `portfolio` - Personal websites and portfolios
- `documentation` - Doc sites and knowledge bases
- `enterprise` - Large-scale applications

Add new categories by updating the `TemplateMetadata` interface category type union.

## License

MIT
