export interface TemplateMetadata {
  name: string;
  description: string;
  category: "basic" | "full-stack" | "e-commerce" | "saas" | "blog" | "monorepo" | "ai" | "cms" | "portfolio" | "documentation" | "enterprise";
  features: string[];
  nextVersion: string;
  repository?: string;
  source?: "local" | "vercel";
}

export const TEMPLATES_METADATA: Record<string, TemplateMetadata> = {
  // Local Templates
  basic: {
    name: "Basic",
    description: "Minimal Next.js app setup",
    category: "basic",
    features: ["TypeScript", "ESLint", "Tailwind CSS"],
    nextVersion: "14+",
    source: "local",
  },
  "full-stack": {
    name: "Full-stack",
    description: "Next.js with API routes and database",
    category: "full-stack",
    features: ["TypeScript", "API Routes", "Prisma", "Database"],
    nextVersion: "14+",
    source: "local",
  },
  "e-commerce": {
    name: "E-commerce",
    description: "Product catalog, cart, checkout",
    category: "e-commerce",
    features: ["Product Catalog", "Shopping Cart", "Checkout", "Payment"],
    nextVersion: "14+",
    source: "local",
  },
  saas: {
    name: "SaaS",
    description: "Auth, billing, multi-tenant",
    category: "saas",
    features: ["Authentication", "Billing", "Multi-tenant", "Teams"],
    nextVersion: "14+",
    source: "local",
  },
  blog: {
    name: "Blog",
    description: "Content management with markdown",
    category: "blog",
    features: ["MDX", "SEO", "Dark Mode", "Search"],
    nextVersion: "14+",
    source: "local",
  },
  monorepo: {
    name: "Monorepo",
    description: "Turborepo workspace",
    category: "monorepo",
    features: ["Turborepo", "Multiple Apps", "Shared Packages"],
    nextVersion: "14+",
    source: "local",
  },

  // Vercel Templates - Starters
  "nextjs-boilerplate": {
    name: "Next.js Boilerplate",
    description: "Get started with Next.js and React in seconds",
    category: "basic",
    features: ["React", "TypeScript", "Tailwind CSS", "Project Setup"],
    nextVersion: "14+",
    repository: "https://github.com/vercel/next.js",
    source: "vercel",
  },

  // Vercel Templates - E-commerce
  "nextjs-commerce": {
    name: "Next.js Commerce",
    description: "Starter kit for high-performance commerce with Shopify",
    category: "e-commerce",
    features: ["Shopify", "Commerce", "Performance", "Payment Integration"],
    nextVersion: "14+",
    source: "vercel",
  },
  "medusa-ecommerce": {
    name: "Medusa Next.js Ecommerce Store",
    description: "Ecommerce store template with Medusa and TailwindCSS",
    category: "e-commerce",
    features: ["Medusa", "Algolia Search", "Stripe Checkout", "TailwindCSS"],
    nextVersion: "14+",
    source: "vercel",
  },
  "stripe-subscription": {
    name: "Stripe Subscription Starter",
    description: "All-in-one subscription starter kit for SaaS applications",
    category: "e-commerce",
    features: ["Stripe", "Supabase", "Authentication", "Billing"],
    nextVersion: "14+",
    source: "vercel",
  },

  // Vercel Templates - SaaS
  "platforms-starter": {
    name: "Platforms Starter Kit",
    description: "Multi-tenant applications with App Router and Redis",
    category: "saas",
    features: ["Multi-tenant", "Redis", "App Router", "Scalable"],
    nextVersion: "14+",
    source: "vercel",
  },
  "nextjs-saas-starter": {
    name: "Next.js SaaS Starter",
    description: "Complete SaaS starter with Postgres, Auth, and Tailwind",
    category: "saas",
    features: ["Postgres", "Authentication", "Tailwind", "shadcn/ui"],
    nextVersion: "14+",
    source: "vercel",
  },
  "nextjs-enterprise": {
    name: "Next.js Enterprise Boilerplate",
    description: "Enterprise-grade boilerplate with advanced tooling",
    category: "enterprise",
    features: ["TypeScript", "ESLint", "Jest", "Playwright", "Storybook"],
    nextVersion: "14+",
    source: "vercel",
  },
  "liveblocks-starter": {
    name: "Liveblocks Starter Kit",
    description: "Real-time collaborative product starter kit",
    category: "saas",
    features: ["Real-time Collaboration", "Liveblocks", "TypeScript"],
    nextVersion: "14+",
    source: "vercel",
  },

  // Vercel Templates - Blog
  "blog-starter": {
    name: "Blog Starter Kit",
    description: "Statically generated blog using Next.js and Markdown",
    category: "blog",
    features: ["Markdown", "Static Generation", "SEO", "Responsive"],
    nextVersion: "14+",
    source: "vercel",
  },
  "nextjs-contentlayer": {
    name: "Next.js Contentlayer Blog",
    description: "Blog template with Contentlayer, App Router, and dark mode",
    category: "blog",
    features: ["Contentlayer", "App Router", "Tailwind CSS", "Dark Mode"],
    nextVersion: "14+",
    source: "vercel",
  },
  "isr-blog-wordpress": {
    name: "ISR Blog with Next.js and WordPress",
    description: "Incremental Static Regeneration blog using WordPress",
    category: "blog",
    features: ["WordPress", "ISR", "Headless CMS", "Performance"],
    nextVersion: "14+",
    source: "vercel",
  },

  // Vercel Templates - Portfolio
  "portfolio-starter": {
    name: "Portfolio Starter Kit",
    description: "Easily create a portfolio with Next.js and Markdown",
    category: "portfolio",
    features: ["Markdown", "Portfolio", "Responsive", "Custom Domain"],
    nextVersion: "14+",
    source: "vercel",
  },
  "nextjs-portfolio-blog": {
    name: "Next.js Portfolio with Blog",
    description: "Portfolio site with integrated blog functionality",
    category: "portfolio",
    features: ["Markdown", "Blog", "Portfolio", "SEO Optimized"],
    nextVersion: "14+",
    source: "vercel",
  },

  // Vercel Templates - CMS
  "sanity-personal-website": {
    name: "Sanity + Next.js Personal Website",
    description: "Personal website with Sanity CMS and visual editing",
    category: "cms",
    features: ["Sanity", "Visual Editing", "Live Previews", "Real-time Collaboration"],
    nextVersion: "14+",
    source: "vercel",
  },
  "sanity-clean-app": {
    name: "Sanity + Next.js Clean App",
    description: "Clean starter with Sanity, visual editing, and drag-drop builder",
    category: "cms",
    features: ["Sanity", "Drag-drop Builder", "AI Media Support", "Visual Editing"],
    nextVersion: "14+",
    source: "vercel",
  },

  // Vercel Templates - Documentation
  "nextra-docs": {
    name: "Nextra: Docs Starter Kit",
    description: "Simple, powerful, and flexible markdown-powered docs site",
    category: "documentation",
    features: ["Nextra", "Markdown", "Documentation", "Search"],
    nextVersion: "14+",
    source: "vercel",
  },

  // Vercel Templates - AI
  chatbot: {
    name: "Chatbot",
    description: "Full-featured, hackable AI chatbot built by Vercel",
    category: "ai",
    features: ["AI", "Chatbot", "Vercel AI SDK", "Real-time Streaming"],
    nextVersion: "14+",
    source: "vercel",
  },
  "gemini-chatbot": {
    name: "Gemini AI Chatbot",
    description: "Gemini-powered chatbot with Vercel AI SDK",
    category: "ai",
    features: ["Gemini", "AI SDK", "React", "Real-time Chat"],
    nextVersion: "14+",
    source: "vercel",
  },
  "empathic-voice": {
    name: "Hume AI - Empathic Voice Interface",
    description: "Voice chat starter using Hume AI's empathic interface",
    category: "ai",
    features: ["Voice", "Hume AI", "Real-time", "Speech Recognition"],
    nextVersion: "14+",
    source: "vercel",
  },
  "lead-agent": {
    name: "Lead Agent",
    description: "Inbound lead qualification and research agent",
    category: "ai",
    features: ["AI Agent", "Lead Qualification", "Workflow DevKit", "Slack Integration"],
    nextVersion: "14+",
    source: "vercel",
  },
  morphic: {
    name: "Morphic: AI-powered Answer Engine",
    description: "AI answer engine with Generative UI",
    category: "ai",
    features: ["Generative UI", "Answer Engine", "AI", "Search"],
    nextVersion: "14+",
    source: "vercel",
  },
  "pinecone-rag": {
    name: "Pinecone - Vercel AI SDK Starter",
    description: "Chatbot using RAG pattern with Pinecone vector database",
    category: "ai",
    features: ["RAG", "Pinecone", "Vector DB", "AI SDK"],
    nextVersion: "14+",
    source: "vercel",
  },
  "customer-reviews-ai": {
    name: "Customer Reviews AI Summary",
    description: "Use LLM to summarize customer feedback",
    category: "ai",
    features: ["LLM", "AI Analysis", "Customer Insights", "Summarization"],
    nextVersion: "14+",
    source: "vercel",
  },
  "qrgpt": {
    name: "qrGPT – AI QR Code Generator",
    description: "Generate beautiful QR codes using AI",
    category: "ai",
    features: ["AI", "QR Code", "Image Generation", "Replicate"],
    nextVersion: "14+",
    source: "vercel",
  },
  "headshot-ai": {
    name: "AI Headshot Generator",
    description: "Professional AI headshot generator starter kit",
    category: "ai",
    features: ["AI", "Image Generation", "Portraits", "Leap AI"],
    nextVersion: "14+",
    source: "vercel",
  },

  // Vercel Templates - Other
  "app-router-playground": {
    name: "Next.js App Router Playground",
    description: "Examples of many Next.js App Router features",
    category: "basic",
    features: ["App Router", "Examples", "TypeScript", "Best Practices"],
    nextVersion: "14+",
    source: "vercel",
  },
  "image-gallery-starter": {
    name: "Image Gallery Starter",
    description: "Image gallery built on Next.js and Cloudinary",
    category: "basic",
    features: ["Cloudinary", "Image Gallery", "Responsive", "Performance"],
    nextVersion: "14+",
    source: "vercel",
  },
  "supabase-starter": {
    name: "Supabase Starter",
    description: "App Router template with cookie-based auth using Supabase",
    category: "saas",
    features: ["Supabase", "Authentication", "Tailwind CSS", "TypeScript"],
    nextVersion: "14+",
    source: "vercel",
  },
  "email-client": {
    name: "Next.js Email Client",
    description: "Email client template with Postgres, Tailwind, and shadcn/ui",
    category: "full-stack",
    features: ["Postgres", "Tailwind", "shadcn/ui", "Email"],
    nextVersion: "14+",
    source: "vercel",
  },
  "preview-mode": {
    name: "Next.js Preview Mode",
    description: "Preview content changes before publishing",
    category: "basic",
    features: ["Preview Mode", "Draft", "Publishing", "Content Management"],
    nextVersion: "14+",
    source: "vercel",
  },
};

export function getTemplates(): string[] {
  return Object.keys(TEMPLATES_METADATA);
}

export function getTemplateMetadata(name: string): TemplateMetadata | null {
  return TEMPLATES_METADATA[name] || null;
}
