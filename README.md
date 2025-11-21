# HederaWise - Project Details

## Project Description
HederaWise is a comprehensive DeFi savings platform built on Hedera featuring the **$HWISE** fungible token. Users can create customizable savings plans, "nest" accounts (including but not limited to children's savings), and manage their stash (personal savings account). When users deposit HBAR, they receive $HWISE tokens that are locked in their savings goals, providing a tokenized savings experience with automated payouts, NFT rewards, and cross-platform accessibility through mobile and web applications.

## Selected Hackathon Track
**Theme 2: DeFi & Tokenization - Basic Problem Statement (DeFi & Tokenization)**

Traditional savings accounts for children lack transparency, have low interest rates, and don't leverage modern financial technology. Parents struggle to find secure, long-term savings solutions that combine accessibility with the benefits of decentralized finance.

## Tech Stack

### Blockchain & DeFi Infrastructure
- **Hedera Hashgraph** - Primary blockchain network for transactions and smart contracts
- **$HWISE Token** - Custom fungible token (HW symbol) for tokenized savings
- **$HWISENFT** - NFT token (HWNFT symbol) for milestone rewards and achievements
- **Hedera SDK (@hashgraph/sdk)** - JavaScript SDK for blockchain interactions
- **Hedera Testnet** - Development and testing environment

### Frontend Technologies
- **React Native** with **Expo** - Cross-platform mobile application
- **React 19** - Web application frontend
- **TypeScript** - Type-safe development across all platforms
- **TailwindCSS** - Utility-first CSS framework
- **NativeWind** - TailwindCSS for React Native

### Backend Infrastructure
- **Hono** - Modern web framework for API development
- **Bun** - JavaScript runtime and package manager
- **Better Auth** - Authentication system with Expo integration
- **Drizzle ORM** - Type-safe database ORM
- **Neon Database** - Serverless PostgreSQL database

### Development Tools & Services
- **Turborepo** - Monorepo build orchestration
- **pnpm** - Fast, disk space efficient package manager
- **Vite** - Fast build tool for web application
- **ESLint & Prettier** - Code quality and formatting

### UI/UX Components
- **Radix UI** - Accessible UI primitives for web
- **rn-primitives** - React Native UI component library
- **Lucide React** - Icon library
- **Expo Vector Icons** - Icon set for mobile

### State Management & Data
- **Zustand** - Lightweight state management
- **TanStack Query** - Data fetching and caching
- **TanStack Router** - Type-safe routing for web
- **TanStack Form** - Form management with validation
- **Zod** - Schema validation

### Additional Services
- **React Native MMKV** - Fast key-value storage
- **Croner** - Cron job scheduling

### Development Infrastructure
- **Git** - Version control
- **GitHub** - Code repository hosting
- **TypeScript** - Static type checking
- **Biome** - Fast linter and formatter
- **Drizzle Kit** - Database migration tool
