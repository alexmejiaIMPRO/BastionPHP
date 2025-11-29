# Bastion PHP Framework

**Enterprise-Grade PHP Framework for Multi-Plant Standardization**

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/AlexMejiaImpro/bastionphp)
[![Security](https://img.shields.io/badge/security-9.5%2F10-brightgreen.svg)](SECURITY_FIXES_SUMMARY.md)
[![PHP](https://img.shields.io/badge/PHP-8.1%2B-777BB4.svg)](https://www.php.net/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> Built to standardize development across multiple manufacturing plants. Same structure, same patterns, same code everywhere.

**Now with Enterprise Architecture** - Version 3.0 introduces a Service Container, Data View (DV) Engine, and native Tailwind CSS v4 support while maintaining the simplicity that makes it perfect for internal tools.

---

## Table of Contents

- [Why Bastion PHP?](#why-bastion-php)
- [The Multi-Plant Challenge](#the-multi-plant-challenge)
- [New in v3.0: Enterprise Architecture](#new-in-v30-enterprise-architecture) **← NEW!**
- [Features](#features)
- [Security Highlights](#security-highlights)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Bastion CLI (Process Manager)](#bastion-cli-process-manager) **← NEW!**
- [Core Architecture](#core-architecture)
- [DV (Data View) Engine](#dv-data-view-engine) **← NEW!**
- [Global Styling System (Tailwind v4)](#global-styling-system-tailwind-v4) **← UPDATED!**
- [File-Based Routing](#file-based-routing)
- [Dynamic Routes](#dynamic-routes)
- [API Routes](#api-routes)
- [Authentication](#authentication)
- [Middleware](#middleware)
- [Database & Facades](#database--facades)
- [Helper Functions Reference](#helper-functions-reference)
- [Components & HTMX](#components--htmx)
- [Security](#security)
- [Performance](#performance)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Why Bastion PHP?

**Bastion PHP was built to solve a real problem: standardizing development across multiple manufacturing plants with different teams.**

When you're managing software development across 3, 5, or 10 plants, each with their own developers building internal tools, you face chaos:
- Every plant writes code differently
- Developer A can't understand Developer B's code
- Moving developers between plants takes weeks of ramp-up
- Code sharing is impossible because nothing is compatible
- Maintenance becomes a nightmare

**Bastion PHP solves this.** One framework, one structure, everywhere.

---

## The Multi-Plant Challenge

### Our Situation (Why I Built This)

I work at a manufacturing company with **multiple plants**. Each plant has:
- Local developers building internal tools
- Different PHP codebases (some Laravel, some raw PHP, some custom frameworks)
- Different folder structures
- Different authentication systems
- Different deployment processes

**The Problems This Created:**

1. **No Code Reusability**
   - Plant A builds a quality control dashboard
   - Plant B needs the same thing
   - Can't reuse the code - completely different structure
   - Result: Build it twice, maintain it twice

2. **Developer Transfers Are Painful**
   - Developer moves from Plant A to Plant B
   - Takes 2-3 weeks to understand Plant B's codebase
   - Different routing system, different auth, different patterns
   - Productivity tanks

3. **Security Inconsistency**
   - Plant A has CSRF protection
   - Plant B doesn't
   - Plant C has SQL injection vulnerabilities
   - No company-wide security standard

4. **Training Costs**
   - Hire new developer
   - Have to explain a custom framework nobody else uses
   - Takes a month to become productive
   - High learning curve

### The Solution: Bastion PHP

**One framework across all plants.**

Now:
- Developer at Plant A writes code exactly like Plant B and Plant C
- New developer learns Bastion PHP once, productive at ANY plant
- Build a tool once, deploy it everywhere
- Company-wide security standards enforced automatically
- Code reviews are consistent across plants

### Real-World Benefits We've Seen

✅ **Developer Mobility:** Developer can move between plants and start coding day one
✅ **Code Sharing:** Quality dashboard built at Plant A deployed to all 5 plants
✅ **Faster Onboarding:** New developers productive in 1 week instead of 1 month
✅ **Consistent Security:** All plants have the same security features out of the box
✅ **Lower Maintenance:** Fix a bug once, update all plants with same structure

---

## New in v3.0: Enterprise Architecture

Version 3.0 represents a major maturity milestone for Bastion PHP. We have introduced three key architectural pillars to ensure scalability while keeping the code clean:

1.  **Service Container:** A robust Dependency Injection (DI) container that manages your application services. This allows for better testing and decoupling.
2.  **DV (Data View) Engine:** A clean, static engine for passing data to views. No more global variable pollution or confusing scope issues.
3.  **Tailwind CSS v4 (Oxide):** Native support for the next generation of Tailwind, configured directly in CSS with no JavaScript configuration files required.


---

## Features

### 🚀 Core Features

- **🏛️ Service Container** — Full dependency injection and singleton management for robust architecture.
- **👁️ DV Engine** — Explicit data passing to views using `DV::set()` instead of relying on global scope.
- **🎨 Tailwind v4 Support** — Native integration with the new Oxide engine via the Bastion CLI.
- **📁 File-Based Routing** — Just create folders and `page.php` files. No route definitions needed.
- **🔐 JWT Authentication** — Built-in access & refresh tokens with secure cookie handling.
- **🛡️ Security First** — Path traversal protection, CSRF, CSP nonces, rate limiting out of the box.
- **⚡ High Performance** — SQLite WAL mode (10-100x faster concurrent writes).
- **🗄️ Database Facades** — Clean static syntax `DB::table()` backed by a testable singleton instance.
- **🔄 Modern Stack** — HTMX integration, PSR-4 autoloading, PHP 8.1+ features.

---

## Security Highlights

Bastion PHP has undergone extensive security audits and hardening. **Security Score: 9.5/10** 🛡️

### Critical Vulnerabilities Fixed & Prevented

✅ **Path Traversal Protection** — Automatically filters `..` and `.` segments
✅ **Session Fixation Prevention** — Session IDs regenerated after login
✅ **Header Injection Prevention** — All redirects sanitized
✅ **XSS Protection** — CSP with cryptographic nonces instead of `unsafe-inline`
✅ **SQL Injection** — Facade-driven prepared statements

---

## Quick Start

### Prerequisites

- PHP 8.1 or higher
- Node.js & NPM (for Tailwind v4)
- Composer
- PHP Extensions: PDO, pdo_sqlite, mbstring

### Create New Project

```bash
# Clone the repository or use the generator
bash create-bastion-app.sh my-app --full-stack

cd my-app

# Start the development environment (PHP + Tailwind + BrowserSync)
./bastion run-dev
