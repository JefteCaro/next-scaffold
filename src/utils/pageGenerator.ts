import fsExtra from "fs-extra";
import { join, dirname, resolve } from "path";
import { logger } from "./logger.js";

const { ensureDir, writeFile, existsSync, readdirSync } = fsExtra;

export type UIStyle = "default" | "minimal" | "modern" | "glassmorphism" | "vibrant" | "dark";

export interface PageGenerateOptions {
  route: string; // e.g., "/dashboard", "/settings/profile"
  template: PageTemplate; // blank, form, api-route, etc.
  style?: UIStyle; // UI style variant (default, minimal, modern, glassmorphism, vibrant, dark)
  projectPath?: string; // defaults to cwd
  layout?: boolean; // Generate layout.tsx for the route
  notFound?: boolean; // Generate not-found.tsx for the route
  template_component?: boolean; // Generate template.tsx for the route
  loading?: boolean; // Generate loading.tsx for the route
}

// Helper function to apply style transformations to template code
function applyStyle(code: string, style: UIStyle): string {
  if (style === "default") return code;

  switch (style) {
    case "minimal":
      // Remove shadows, reduce padding, use minimal colors
      return code
        .replace(/shadow/g, "")
        .replace(/bg-gray-50/g, "bg-white")
        .replace(/rounded-lg/g, "")
        .replace(/border border-gray-200/g, "border-b border-gray-300");

    case "dark":
      // Switch to dark theme
      return code
        .replace(/bg-white/g, "bg-gray-900")
        .replace(/bg-gray-50/g, "bg-gray-800")
        .replace(/text-gray-900/g, "text-white")
        .replace(/text-gray-600/g, "text-gray-300")
        .replace(/text-gray-700/g, "text-gray-200")
        .replace(/border-gray-300/g, "border-gray-600")
        .replace(/border-gray-200/g, "border-gray-700")
        .replace(/bg-green-50/g, "bg-green-900")
        .replace(/text-green-800/g, "text-green-100");

    case "glassmorphism":
      // Add glassmorphic effect
      return code
        .replace(/shadow/g, "shadow-lg backdrop-blur-md")
        .replace(/bg-white/g, "bg-white/10 backdrop-blur-md")
        .replace(/bg-gray-50/g, "bg-gray-50/10 backdrop-blur-md")
        .replace(/rounded-lg/g, "rounded-2xl");

    case "vibrant":
      // Use vibrant colors
      return code
        .replace(/bg-blue-600/g, "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600")
        .replace(/bg-blue-700/g, "bg-gradient-to-r from-purple-700 via-pink-700 to-red-700")
        .replace(/text-blue-600/g, "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600");

    case "modern":
      // Already modern by default, just add subtle improvements
      return code
        .replace(/rounded-lg/g, "rounded-xl")
        .replace(/shadow/g, "shadow-lg");

    default:
      return code;
  }
}

/**
 * Detects the project structure and returns the app directory path
 * Supports: app, src/app, pages, src/pages
 */
function detectProjectStructure(projectPath: string): { appDir: string; structure: string } {
  const possibleStructures = [
    { path: join(projectPath, "app"), structure: "app" },
    { path: join(projectPath, "src", "app"), structure: "src/app" },
    { path: join(projectPath, "pages"), structure: "pages" },
    { path: join(projectPath, "src", "pages"), structure: "src/pages" },
  ];

  for (const { path, structure } of possibleStructures) {
    if (existsSync(path)) {
      return { appDir: path, structure };
    }
  }

  // If no structure found, suggest the most common one
  const appPath = join(projectPath, "app");
  return { appDir: appPath, structure: "app" };
}

/**
 * Validates project structure and provides helpful error messages
 */
function validateProjectStructure(projectPath: string): {
  isValid: boolean;
  appDir: string;
  structure: string;
  errors: string[];
} {
  const projectRootMarkers = ["package.json", "next.config.js", "next.config.ts"];
  const hasPackageJson = projectRootMarkers.some((marker) =>
    existsSync(join(projectPath, marker))
  );

  if (!hasPackageJson) {
    return {
      isValid: false,
      appDir: "",
      structure: "",
      errors: [
        `Project root not found at ${projectPath}`,
        "Make sure you're in a Next.js project directory",
        "This directory should contain package.json and next.config.js",
      ],
    };
  }

  const { appDir, structure } = detectProjectStructure(projectPath);

  if (!existsSync(appDir)) {
    return {
      isValid: false,
      appDir,
      structure,
      errors: [
        `${structure} directory not found at ${appDir}`,
        `This Next.js project uses the ${structure} router`,
        "Create the directory first or check your Next.js setup",
      ],
    };
  }

  return {
    isValid: true,
    appDir,
    structure,
    errors: [],
  };
}

export type PageTemplate = "blank" | "form" | "form-with-validation" | "api-route" | "dashboard" | "data-table" | "auth" | "blog" | "shop" | "login" | "signup" | "forgot-password" | "profile" | "settings" | "product-detail" | "checkout" | "order-confirmation" | "landing" | "pricing" | "features" | "contact" | "testimonials" | "team" | "about" | "faq" | "error-404" | "error-500" | "maintenance" | "admin-dashboard" | "gallery" | "invoice" | "search-results" | "case-study";

const PAGE_TEMPLATES: Record<PageTemplate, (componentName: string) => string> = {
  blank: (name) => `"use client";

import React from "react";

export default function ${name}() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900">${name}</h1>
        <p className="mt-4 text-gray-600">This is the ${name} page.</p>
      </div>
    </main>
  );
}
`,

  form: (name) => `"use client";

import React, { useState } from "react";

export default function ${name}() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("Form data:", formData);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">${name}</h1>
        {submitted && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
            Form submitted successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
`,

  "form-with-validation": (name) => `"use client";

import React, { useState } from "react";

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface Errors {
  [key: string]: string;
}

export default function ${name}() {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
      console.log("Form data:", formData);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", password: "" });
      }, 3000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">${name}</h1>
        {submitted && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
            Form submitted successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={
                errors.name
                  ? "mt-1 w-full px-3 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  : "mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              }
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={
                errors.email
                  ? "mt-1 w-full px-3 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  : "mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              }
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={
                errors.password
                  ? "mt-1 w-full px-3 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  : "mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              }
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
`,

  "api-route": (name) => `import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Hello from ${name}",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
`,

  dashboard: (name) => `"use client";

import React from "react";

interface MetricCard {
  title: string;
  value: string;
  change: string;
}

export default function ${name}() {
  const metrics: MetricCard[] = [
    { title: "Total Users", value: "1,234", change: "+12% from last month" },
    { title: "Revenue", value: "\\$45,231", change: "+8% from last month" },
    { title: "Active Sessions", value: "456", change: "+23% from last month" },
    { title: "Conversion Rate", value: "3.24%", change: "-0.5% from last month" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">${name}</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.title} className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
              <p className="text-sm text-green-600 mt-2">{metric.change}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-600">Your recent activity appears here.</p>
        </div>
      </div>
    </main>
  );
}
`,

  "data-table": (name) => `"use client";

import React, { useState } from "react";

interface TableRow {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
}

export default function ${name}() {
  const [data] = useState<TableRow[]>([
    { id: "1", name: "Alice Johnson", email: "alice@example.com", status: "active" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", status: "active" },
    { id: "3", name: "Carol White", email: "carol@example.com", status: "inactive" },
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">${name}</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{row.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        row.status === "active"
                          ? "px-3 py-1 text-sm rounded-full bg-green-100 text-green-800"
                          : "px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800"
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
`,

  auth: (name) => `"use client";

import React, { useState } from "react";

type AuthMode = "login" | "signup";

export default function ${name}() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup" && formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        return;
      }

      console.log(\`\${mode === "login" ? "Logging in" : "Signing up"}:\`, formData.email);
      // Add your authentication logic here
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {mode === "login" ? "Sign in to your account" : "Join us today"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
`,

  blog: (name) => `"use client";

import React from "react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  category: string;
}

export default function ${name}() {
  const posts: BlogPost[] = [
    {
      id: "1",
      title: "Getting Started with Next.js 14",
      excerpt: "Learn how to build fast, production-ready applications with Next.js 14 and React.",
      date: "Mar 18, 2026",
      author: "John Doe",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
      category: "Tutorial",
    },
    {
      id: "2",
      title: "Mastering TypeScript in React",
      excerpt: "A comprehensive guide to using TypeScript with React for type-safe applications.",
      date: "Mar 15, 2026",
      author: "Jane Smith",
      image: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500",
      category: "Guide",
    },
    {
      id: "3",
      title: "Tailwind CSS Best Practices",
      excerpt: "Tips and tricks for writing maintainable and efficient Tailwind CSS code.",
      date: "Mar 10, 2026",
      author: "Mike Johnson",
      image: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500",
      category: "Tips",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">${name}</h1>
          <p className="text-lg text-gray-600">Insights and articles about web development</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="mb-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <span className="text-sm font-medium text-gray-700">By {post.author}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
`,

  shop: (name) => `"use client";

import React, { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
}

export default function ${name}() {
  const [cart, setCart] = useState<string[]>([]);

  const products: Product[] = [
    {
      id: "1",
      name: "Premium Headphones",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      category: "Electronics",
      inStock: true,
      rating: 4.5,
    },
    {
      id: "2",
      name: "Wireless Mouse",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
      category: "Electronics",
      inStock: true,
      rating: 4.2,
    },
    {
      id: "3",
      name: "USB-C Cable",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400",
      category: "Accessories",
      inStock: false,
      rating: 4.0,
    },
    {
      id: "4",
      name: "Mechanical Keyboard",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1587829191301-5f5ec904e0c3?w=400",
      category: "Electronics",
      inStock: true,
      rating: 4.7,
    },
    {
      id: "5",
      name: "Monitor Stand",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1611567595334-4e219fc54665?w=400",
      category: "Accessories",
      inStock: true,
      rating: 4.3,
    },
    {
      id: "6",
      name: "Desk Lamp",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1565637558649-c73097999dd9?w=400",
      category: "Accessories",
      inStock: true,
      rating: 4.4,
    },
  ];

  const addToCart = (productId: string) => {
    setCart((prev) => [...prev, productId]);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((id) => id !== productId));
  };

  const cartCount = cart.length;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">${name}</h1>
            <p className="mt-2 text-gray-600">Premium products for your workspace</p>
          </div>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
            Cart ({cartCount})
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="h-48 bg-gray-200 overflow-hidden rounded-t-lg">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-gray-600 uppercase">{product.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">\${product.price}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
                {product.inStock ? (
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg cursor-not-allowed font-medium"
                  >
                    Out of Stock
                  </button>
                )}
                {cart.includes(product.id) && (
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="w-full mt-2 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                  >
                    Remove from Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
`,

  login: (name) => `"use client";

import React, { useState } from "react";

export default function ${name}() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }
      console.log("Login attempt:", { email, rememberMe });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Sign In</h1>
          <p className="text-center text-gray-600 mb-8">Welcome back to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="youremail@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
`,

  signup: (name) => `"use client";

import React, { useState } from "react";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function ${name}() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!agreed) newErrors.agreed = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      console.log("Signup attempt:", formData.email);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Create Account</h1>
          <p className="text-center text-gray-600 mb-8">Join us today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            <label className="flex items-start">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded mt-1"
              />
              <span className="ml-2 text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreed && <p className="text-sm text-red-600">{errors.agreed}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
`,

  "forgot-password": (name) => `"use client";

import React, { useState } from "react";

export default function ${name}() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email) {
        setError("Please enter your email address");
        return;
      }
      console.log("Password reset requested for:", email);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {!submitted ? (
            <>
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Reset Password</h1>
              <p className="text-center text-gray-600 mb-8">Enter your email address and we'll send you a link to reset your password</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="youremail@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Back to Sign In
                </a>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-4 text-4xl">✉️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-6">We've sent a password reset link to {email}</p>
              <p className="text-sm text-gray-600 mb-8">Click the link in the email to reset your password. The link will expire in 24 hours.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Didn't receive it? Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
`,

  profile: (name) => `"use client";

import React, { useState } from "react";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  phone: string;
}

export default function ${name}() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john@example.com",
    bio: "Product designer and developer",
    location: "San Francisco, CA",
    phone: "+1 (555) 000-0000",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Profile saved:", profile);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between -mt-16 mb-6">
              <div className="flex items-end space-x-4">
                <div className="w-24 h-24 bg-gray-300 rounded-lg border-4 border-white"></div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {isEditing ? (
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
                  <p className="text-gray-900">{profile.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
                    <p className="text-gray-900">{profile.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Phone</h3>
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
`,

  settings: (name) => `"use client";

import React, { useState } from "react";

export default function ${name}() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    twoFactor: true,
    marketingEmails: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">${name}</h1>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
            <div className="space-y-4">
              {[
                { key: "emailNotifications", label: "Email Notifications" },
                { key: "pushNotifications", label: "Push Notifications" },
                { key: "marketingEmails", label: "Marketing Emails" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-700">{label}</span>
                  <button
                    onClick={() => handleToggle(key as keyof typeof settings)}
                    className={
                      settings[key as keyof typeof settings]
                        ? "w-12 h-6 bg-blue-600 rounded-full transition"
                        : "w-12 h-6 bg-gray-300 rounded-full transition"
                    }
                  >
                    <div
                      className={
                        settings[key as keyof typeof settings]
                          ? "w-5 h-5 bg-white rounded-full ml-auto m-0.5 transition"
                          : "w-5 h-5 bg-white rounded-full m-0.5 transition"
                      }
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Security</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-700 font-medium">Two-Factor Authentication</span>
                  <p className="text-sm text-gray-600">Secure your account with 2FA</p>
                </div>
                <button
                  onClick={() => handleToggle("twoFactor")}
                  className={
                    settings.twoFactor
                      ? "w-12 h-6 bg-blue-600 rounded-full transition"
                      : "w-12 h-6 bg-gray-300 rounded-full transition"
                  }
                >
                  <div
                    className={
                      settings.twoFactor
                        ? "w-5 h-5 bg-white rounded-full ml-auto m-0.5 transition"
                        : "w-5 h-5 bg-white rounded-full m-0.5 transition"
                    }
                  />
                </button>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Change Password
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Dark Mode</span>
                <button
                  onClick={() => handleToggle("darkMode")}
                  className={
                    settings.darkMode
                      ? "w-12 h-6 bg-blue-600 rounded-full transition"
                      : "w-12 h-6 bg-gray-300 rounded-full transition"
                  }
                >
                  <div
                    className={
                      settings.darkMode
                        ? "w-5 h-5 bg-white rounded-full ml-auto m-0.5 transition"
                        : "w-5 h-5 bg-white rounded-full m-0.5 transition"
                    }
                  />
                </button>
              </div>
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
            Save Settings
          </button>
        </div>
      </div>
    </main>
  );
}
`,

  "product-detail": (name) => `"use client";

import React, { useState } from "react";

export default function ${name}() {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("black");

  const product = {
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 324,
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    colors: ["black", "silver", "gold"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600",
    ],
  };

  const specs = [
    { label: "Battery Life", value: "30 hours" },
    { label: "Noise Cancellation", value: "Active" },
    { label: "Weight", value: "250g" },
    { label: "Warranty", value: "2 years" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-200 h-96 rounded-lg mb-4 overflow-hidden">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer">
                  <img src={img} alt={"Gallery image " + (i + 1)} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <span className="text-gray-600">{product.rating} ({product.reviews} reviews)</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-900">\${product.price}</span>
                <span className="text-lg text-gray-500 line-through">\${product.originalPrice}</span>
                <span className="text-red-600 font-semibold">25% off</span>
              </div>
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Color</h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={
                      selectedColor === color
                        ? \`w-12 h-12 rounded-lg border-2 border-blue-600 bg-\${color}-500\`
                        : \`w-12 h-12 rounded-lg border-2 border-gray-300 bg-\${color}-500\`
                    }
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  −
                </button>
                <span className="text-xl font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  +
                </button>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium mb-3">
              Add to Cart
            </button>
            <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
              Add to Wishlist
            </button>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {specs.map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="font-medium text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
`,

  checkout: (name) => `"use client";

import React, { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function ${name}() {
  const [cartItems] = useState<CartItem[]>([
    { id: "1", name: "Premium Headphones", price: 199.99, quantity: 1 },
    { id: "2", name: "Wireless Mouse", price: 49.99, quantity: 2 },
  ]);

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = cartItems.length > 0 ? 10 : 0;
  const total = subtotal + tax + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", { items: cartItems, ...formData });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="zip"
                      placeholder="ZIP Code"
                      value={formData.zip}
                      onChange={handleChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Place Order
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-700">
                    <span>{item.name} x{item.quantity}</span>
                    <span>\${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>\${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>\${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>\${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>\${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
`,

  "order-confirmation": (name) => `"use client";

import React from "react";

export default function ${name}() {
  const order = {
    number: "ORD-2026-001234",
    date: "March 18, 2026",
    total: "\\$299.98",
    status: "Processing",
    items: [
      { id: 1, name: "Premium Headphones", qty: 1, price: "\\$199.99" },
      { id: 2, name: "Wireless Mouse", qty: 2, price: "\\$49.99" },
    ],
    shipping: {
      name: "John Doe",
      address: "123 Main St, San Francisco, CA 94102",
      estimatedDelivery: "March 22, 2026",
    },
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-lg font-semibold text-gray-900">{order.number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="text-lg font-semibold text-gray-900">{order.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="text-lg font-semibold text-blue-600">{order.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-lg font-semibold text-gray-900">{order.total}</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-700">{item.name} x {item.qty}</span>
                <span className="font-medium text-gray-900">{item.price}</span>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
          <div className="text-gray-700 mb-6">
            <p className="font-medium">{order.shipping.name}</p>
            <p>{order.shipping.address}</p>
            <p className="mt-4 text-sm"><strong>Estimated Delivery:</strong> {order.shipping.estimatedDelivery}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-blue-900">
            A confirmation email has been sent to <strong>john@example.com</strong>. You can track your order from your account dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
            Track Order
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-medium">
            Continue Shopping
          </button>
        </div>
      </div>
    </main>
  );
}
`,

  landing: (name) => `"use client";

import React from "react";

export default function ${name}() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to ${name}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Build amazing products and grow your business with our powerful platform built for modern teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
                Get Started Free
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "⚡", title: "Lightning Fast", desc: "Optimized for performance and speed" },
            { icon: "🔒", title: "Secure", desc: "Enterprise-grade security out of the box" },
            { icon: "📈", title: "Scalable", desc: "Grow from startup to enterprise" },
          ].map((feature, i) => (
            <div key={i} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Trusted by thousands</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {["Company A", "Company B", "Company C", "Company D"].map((co, i) => (
              <div key={i} className="text-gray-400 font-semibold">{co}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of satisfied customers today</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition font-medium">
            Start Free Trial
          </button>
        </div>
      </div>
    </main>
  );
}
`,

  pricing: (name) => `"use client";

import React from "react";

export default function ${name}() {
  const plans = [
    {
      name: "Starter",
      price: "\\$29",
      description: "Perfect for getting started",
      features: ["10 projects", "Basic analytics", "Community support", "1GB storage"],
      cta: "Get Started",
    },
    {
      name: "Professional",
      price: "\\$79",
      description: "For growing teams",
      features: ["Unlimited projects", "Advanced analytics", "Email support", "100GB storage", "Custom domain"],
      cta: "Choose Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: ["Everything in Pro", "24/7 phone support", "Custom integrations", "Dedicated account manager"],
      cta: "Contact Sales",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">${name}</h1>
          <p className="text-xl text-gray-600">Choose the perfect plan for your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={
                plan.popular
                  ? "bg-white border-2 border-blue-600 rounded-lg shadow-lg p-8 transform scale-105"
                  : "bg-white border border-gray-200 rounded-lg shadow p-8"
              }
            >
              {plan.popular && (
                <div className="mb-4 text-center">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-gray-600">/month</span>}
              </div>

              <button
                className={
                  plan.popular
                    ? "w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium mb-6"
                    : "w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-medium mb-6"
                }
              >
                {plan.cta}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
`,

  features: (name) => `"use client";

import React from "react";

export default function ${name}() {
  const featureGroups = [
    {
      title: "Performance",
      features: [
        { title: "Lightning Fast", desc: "Optimized for sub-second load times" },
        { title: "Global CDN", desc: "Distributed content delivery worldwide" },
      ],
    },
    {
      title: "Security",
      features: [
        { title: "SSL Encryption", desc: "End-to-end encrypted connections" },
        { title: "2FA Support", desc: "Two-factor authentication available" },
      ],
    },
    {
      title: "Analytics",
      features: [
        { title: "Real-time Data", desc: "Live analytics dashboard" },
        { title: "Custom Reports", desc: "Create detailed custom reports" },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">${name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featureGroups.map((group, i) => (
            <div key={i}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{group.title}</h2>
              <div className="space-y-6">
                {group.features.map((feature, j) => (
                  <div key={j}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
`,

  contact: (name) => `"use client";

import React, { useState } from "react";

export default function ${name}() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">${name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: "📧", title: "Email", value: "support@example.com" },
            { icon: "📱", title: "Phone", value: "+1 (555) 123-4567" },
            { icon: "📍", title: "Address", value: "123 Main St, San Francisco, CA" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
`,

  testimonials: (name) => `"use client";

import React from "react";

export default function ${name}() {
  const testimonials = [
    {
      text: "This product has completely transformed how we manage our workflow. Highly recommended!",
      author: "Sarah Johnson",
      role: "CEO, TechCorp",
      rating: 5,
    },
    {
      text: "Excellent customer support and intuitive interface. Worth every penny.",
      author: "Mike Chen",
      role: "Operations Manager, StartupXYZ",
      rating: 5,
    },
    {
      text: "The best investment we made for our business this year.",
      author: "Emily Rodriguez",
      role: "Founder, Creative Studio",
      rating: 5,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">${name}</h1>
        <p className="text-xl text-gray-600 text-center mb-12">What our customers say</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-8">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <span key={j} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
`,

  team: (name) => `"use client";

import React from "react";

export default function ${name}() {
  const members = [
    { name: "Alice Smith", role: "CEO & Founder", image: "👩‍💼" },
    { name: "Bob Johnson", role: "VP of Engineering", image: "👨‍💻" },
    { name: "Carol Davis", role: "Head of Design", image: "👩‍🎨" },
    { name: "David Wilson", role: "Lead Developer", image: "👨‍💻" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">${name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, i) => (
            <div key={i} className="text-center">
              <div className="text-6xl mb-4">{member.image}</div>
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
`,

  about: (name) => `"use client";

import React from "react";

export default function ${name}() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">${name}</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2020, we've grown from a small startup to a team of 50+ professionals dedicated to building the best product in our industry.
            </p>
            <p className="text-gray-600">
              Our mission is to empower teams and companies to achieve more by providing tools and services that streamline workflows and boost productivity.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Customer First - We prioritize our customers' needs</li>
              <li>✓ Innovation - We constantly push boundaries</li>
              <li>✓ Integrity - We operate with transparency</li>
              <li>✓ Excellence - We strive for perfection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-gray-600">
              Have questions? We'd love to hear from you. Contact us at <a href="mailto:hello@example.com" className="text-blue-600">hello@example.com</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
`,

  faq: (name) => `"use client";

import React, { useState } from "react";

export default function ${name}() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is this service?",
      a: "This is a comprehensive platform designed to help teams collaborate and manage their projects efficiently.",
    },
    {
      q: "How much does it cost?",
      a: "We offer various pricing tiers starting from \\$29/month. Check our pricing page for details.",
    },
    {
      q: "Do you offer a free trial?",
      a: "Yes! We offer a 14-day free trial with full access to all features.",
    },
    {
      q: "What support do you offer?",
      a: "We provide email support for all plans and 24/7 phone support for enterprise customers.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">${name}</h1>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-lg shadow">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition flex justify-between items-center"
              >
                {faq.q}
                <span className="text-2xl">{expanded === i ? "−" : "+"}</span>
              </button>
              {expanded === i && (
                <div className="px-6 py-4 bg-gray-50 text-gray-600 border-t border-gray-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
`,

  "error-404": (name) => `"use client";

import React from "react";

export default function ${name}() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
            Go Home
          </a>
          <a href="/contact" className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
}
`,

  "error-500": (name) => `"use client";

import React from "react";

export default function ${name}() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-gray-300 mb-4">500</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Server Error</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! Something went wrong on our end. We're working to fix it.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
            Try Again
          </button>
          <a href="/" className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
            Go Home
          </a>
        </div>
      </div>
    </main>
  );
}
`,

  maintenance: (name) => `"use client";

import React from "react";

export default function ${name}() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">🔧</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Maintenance in Progress</h1>
        <p className="text-xl text-gray-600 mb-8">We're making improvements to give you a better experience. We'll be back soon!</p>
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
          <p className="text-gray-700 mb-4">Expected downtime: 2 hours</p>
          <p className="text-sm text-gray-600">We apologize for any inconvenience. Follow us on social media for updates.</p>
        </div>
      </div>
    </main>
  );
}
`,

  "admin-dashboard": (name) => `"use client";

import React from "react";

export default function ${name}() {
  const stats = [
    { label: "Total Users", value: "2,543", change: "+12%" },
    { label: "Active Sessions", value: "847", change: "+5%" },
    { label: "Revenue", value: "\\$12,543", change: "+23%" },
    { label: "Conversion Rate", value: "3.24%", change: "-0.5%" },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">${name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-green-600 text-sm font-medium">{stat.change} vs last month</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                  <span className="text-gray-700">User {i + 1} activity</span>
                  <span className="text-gray-500 text-sm">2 hours ago</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                View Reports
              </button>
              <button className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition text-sm">
                Manage Users
              </button>
              <button className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition text-sm">
                System Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
`,

  gallery: (name) => `"use client";

import React, { useState } from "react";

export default function ${name}() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    "https://images.unsplash.com/photo-1470224114614-78c50ce453d7?w=400",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    "https://images.unsplash.com/photo-1506531173865-a629b8e2b15f?w=400",
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">${name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, i) => (
            <div
              key={i}
              onClick={() => setSelectedImage(i)}
              className="h-60 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
            >
              <img src={image} alt={\`Gallery image \${i + 1}\`} className="w-full h-full object-cover hover:scale-110 transition" />
            </div>
          ))}
        </div>

        {selectedImage !== null && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <img src={images[selectedImage]} alt={\`Gallery image \${selectedImage + 1}\`} className="w-full rounded-lg" />
              <div className="p-4 text-center">
                <p className="text-gray-600">{selectedImage + 1} of {images.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
`,

  invoice: (name) => `"use client";

import React from "react";

export default function ${name}() {
  const invoice = {
    number: "INV-001234",
    date: "March 18, 2026",
    dueDate: "April 18, 2026",
    from: {
      name: "Your Company",
      address: "123 Business St",
      city: "San Francisco, CA 94102",
    },
    to: {
      name: "Client Name",
      address: "456 Client Ave",
      city: "New York, NY 10001",
    },
    items: [
      { desc: "Consulting Services", qty: 10, rate: 150, amount: 1500 },
      { desc: "Design Work", qty: 20, rate: 100, amount: 2000 },
      { desc: "Development", qty: 40, rate: 125, amount: 5000 },
    ],
  };

  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-gray-600">#{invoice.number}</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Print / Download
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">FROM</h3>
            <p className="text-gray-700">{invoice.from.name}</p>
            <p className="text-gray-600 text-sm">{invoice.from.address}</p>
            <p className="text-gray-600 text-sm">{invoice.from.city}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">BILL TO</h3>
            <p className="text-gray-700">{invoice.to.name}</p>
            <p className="text-gray-600 text-sm">{invoice.to.address}</p>
            <p className="text-gray-600 text-sm">{invoice.to.city}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-gray-600"><strong>Invoice Date:</strong> {invoice.date}</p>
            <p className="text-gray-600"><strong>Due Date:</strong> {invoice.dueDate}</p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 text-gray-900 font-semibold">Description</th>
              <th className="text-center py-3 text-gray-900 font-semibold">Qty</th>
              <th className="text-right py-3 text-gray-900 font-semibold">Rate</th>
              <th className="text-right py-3 text-gray-900 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="py-3 text-gray-700">{item.desc}</td>
                <td className="text-center text-gray-700">{item.qty}</td>
                <td className="text-right text-gray-700">\${item.rate}</td>
                <td className="text-right text-gray-700">\${item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2 border-t-2 border-gray-300">
              <span className="font-semibold text-gray-900">Subtotal:</span>
              <span className="text-gray-700">\${subtotal}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-semibold text-gray-900">Tax (10%):</span>
              <span className="text-gray-700">\${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold border-t-2 border-gray-300">
              <span className="text-gray-900">Total:</span>
              <span className="text-gray-900">\${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-gray-300 pt-8">
          <p className="text-sm text-gray-600">Thank you for your business!</p>
        </div>
      </div>
    </main>
  );
}
`,

  "search-results": (name) => `"use client";

import React, { useState } from "react";

export default function ${name}() {
  const [searchTerm] = useState("nextjs");

  const results = [
    {
      title: "Getting Started with Next.js",
      url: "example.com/getting-started",
      desc: "Learn the basics of Next.js development and build your first application.",
    },
    {
      title: "Next.js Performance Optimization",
      url: "example.com/performance",
      desc: "Tips and tricks for optimizing your Next.js application for better performance.",
    },
    {
      title: "Advanced Next.js Patterns",
      url: "example.com/patterns",
      desc: "Explore advanced patterns and best practices for building scalable Next.js applications.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
          <p className="text-gray-600">Found {results.length} results for "{searchTerm}"</p>
        </div>

        <div className="space-y-6">
          {results.map((result, i) => (
            <div key={i} className="hover:bg-gray-50 p-4 rounded-lg transition">
              <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-700 cursor-pointer mb-1">
                {result.title}
              </h2>
              <p className="text-green-700 text-sm mb-2">{result.url}</p>
              <p className="text-gray-700">{result.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
`,

  "case-study": (name) => `"use client";

import React from "react";

export default function ${name}() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How XYZ Company Increased Their Revenue by 40%</h1>
          <p className="text-gray-600 text-lg">A detailed look at how our platform helped transform their business</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h2>
            <p className="text-gray-700 leading-relaxed">
              XYZ Company faced significant challenges in managing their growing customer base and optimizing their sales workflow. Their manual processes were inefficient and error-prone.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Solution</h2>
            <p className="text-gray-700 leading-relaxed">
              By implementing our platform, they were able to automate their processes, streamline their workflow, and gain better insights into their business metrics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Results</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">40%</p>
                <p className="text-gray-600">Revenue Increase</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-3xl font-bold text-green-600">60%</p>
                <p className="text-gray-600">Time Saved</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">3x</p>
                <p className="text-gray-600">Productivity</p>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Client Testimonial</h3>
            <p className="text-gray-700 italic mb-4">
              "This platform has been a game-changer for our business. We've seen significant improvements in efficiency and revenue."
            </p>
            <p className="font-semibold text-gray-900">John Smith, CEO of XYZ Company</p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
            Get Started Now
          </button>
        </div>
      </div>
    </main>
  );
}
`,
};

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Extracts a valid component name from a route segment
 * Handles dynamic segments like [id], [...slug], and [[...optional]]
 */
function extractComponentName(segment: string): string {
  // Remove brackets and ellipsis for catch-all segments
  // [id] -> id
  // [...slug] -> slug
  // [[...optional]] -> optional
  let cleaned = segment
    .replace(/^\[+/, "") // Remove leading brackets
    .replace(/\]+$/, "") // Remove trailing brackets
    .replace(/^\.\.\./, ""); // Remove leading ellipsis

  // If empty after cleaning, use default name
  if (!cleaned) {
    cleaned = "segment";
  }

  return toPascalCase(cleaned);
}

/**
 * Generates layout.tsx template content for a route segment
 */
function generateLayoutTemplate(componentName: string): string {
  return `import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "${componentName}",
  description: "Generated layout for ${componentName}",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function ${componentName}Layout({ children }: LayoutProps) {
  return (
    <div className="layout-${componentName}">
      {children}
    </div>
  );
}
`;
}

/**
 * Generates not-found.tsx template content for a route segment
 */
function generateNotFoundTemplate(componentName: string): string {
  return `"use client";

import React from "react";
import Link from "next/link";

export default function ${componentName}NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page not found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, we couldn\\'t find what you\\'re looking for in ${componentName}.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
`;
}

/**
 * Generates template.tsx template content for a route segment
 */
function generateTemplateComponent(componentName: string): string {
  return `"use client";

import React from "react";

interface TemplateProps {
  children: React.ReactNode;
}

export default function ${componentName}Template({ children }: TemplateProps) {
  return (
    <div className="template-${componentName} transition-opacity duration-300">
      {children}
    </div>
  );
}
`;
}

/**
 * Generates loading.tsx template content for a route segment
 */
function generateLoadingTemplate(componentName: string): string {
  return `"use client";

import React from "react";

export default function ${componentName}Loading() {
  return (
    <div className="min-h-96 flex items-center justify-center bg-white">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-gray-600 text-center">Loading ${componentName}...</p>
      </div>
    </div>
  );
}
`;
}

function routeToFilePath(
  route: string,
  appDir: string
): { dir: string; filename: string; componentName: string } {
  // Remove leading slash and normalize
  const normalized = route.replace(/^\//, "").toLowerCase();

  // Check if it's an API route
  const isApiRoute = normalized.startsWith("api/");

  if (isApiRoute) {
    const parts = normalized.split("/");
    const filename = "route.ts";
    const dir = join(appDir, ...parts);
    const lastPart = parts[parts.length - 1] || "api";
    
    // Extract valid component name, handling dynamic segments
    const componentName = extractComponentName(lastPart);
    return { dir, filename, componentName };
  }

  // Regular page route
  const parts = normalized.split("/").filter(Boolean);
  const filename = "page.tsx";
  const dir = join(appDir, ...parts);
  const lastPart = parts[parts.length - 1] || "home";
  
  // Extract valid component name, handling dynamic segments
  const componentName = extractComponentName(lastPart);

  return { dir, filename, componentName };
}

export async function generatePage(options: PageGenerateOptions): Promise<void> {
  const {
    route,
    template,
    style = "default",
    projectPath = process.cwd(),
    layout = false,
    notFound = false,
    template_component = false,
    loading = false,
  } = options;

  try {
    // Validate project structure
    const validation = validateProjectStructure(projectPath);

    if (!validation.isValid) {
      logger.error("Invalid project structure");
      validation.errors.forEach((error) => logger.info(error));
      throw new Error("Project structure validation failed");
    }

    logger.info(`Detected: ${validation.structure} structure`);

    // Get route to file path mapping with the detected app directory
    const { dir, filename, componentName } = routeToFilePath(route, validation.appDir);
    const fullPath = join(dir, filename);
    const dirPath = dirname(fullPath);

    // Ensure directory exists
    await ensureDir(dirPath);

    // Get template content
    const templateFn = PAGE_TEMPLATES[template];
    if (!templateFn) {
      throw new Error(`Unknown page template: ${template}`);
    }

    let content = templateFn(componentName);

    // Apply style transformations
    if (style !== "default") {
      content = applyStyle(content, style);
      logger.info(`Style: ${style}`);
    }

    // Write page file
    await writeFile(fullPath, content);
    logger.success(`Page created successfully!`);
    logger.info(`Route: ${route}`);
    logger.info(`Template: ${template}`);
    logger.info(`File: ${fullPath}`);

    // Generate additional files if requested
    if (layout) {
      const layoutPath = join(dirPath, "layout.tsx");
      const layoutContent = generateLayoutTemplate(componentName);
      await writeFile(layoutPath, layoutContent);
      logger.info(`Layout file: ${layoutPath}`);
    }

    if (notFound) {
      const notFoundPath = join(dirPath, "not-found.tsx");
      const notFoundContent = generateNotFoundTemplate(componentName);
      await writeFile(notFoundPath, notFoundContent);
      logger.info(`Not-found file: ${notFoundPath}`);
    }

    if (template_component) {
      const templatePath = join(dirPath, "template.tsx");
      const templateContent = generateTemplateComponent(componentName);
      await writeFile(templatePath, templateContent);
      logger.info(`Template file: ${templatePath}`);
    }

    if (loading) {
      const loadingPath = join(dirPath, "loading.tsx");
      const loadingContent = generateLoadingTemplate(componentName);
      await writeFile(loadingPath, loadingContent);
      logger.info(`Loading file: ${loadingPath}`);
    }
  } catch (error) {
    logger.error(`Failed to generate page: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}
