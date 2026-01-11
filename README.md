# Spaces - Linear Algebra Matrix Calculator

A modern web application for computing the four fundamental subspaces of linear algebra matrices.

## Features

- **Local Computation**: All matrix calculations are performed in the browser using JavaScript - no backend required
- **Four Fundamental Subspaces**: Computes Column Space, Row Space, Null Space, and Left Null Space
- **Exact Arithmetic**: Uses fraction-based computation for precise results
- **Interactive UI**: Smooth animations and responsive design
- **Optional Cloud Save**: Save your matrices using Supabase (optional)

## Technology Stack

- **React** + **Vite** for fast development and optimal performance
- **Custom Matrix Engine**: Pure JavaScript implementation of linear algebra algorithms
- **KaTeX**: Beautiful mathematical notation rendering
- **Supabase** (optional): Cloud storage for saved matrices

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. (Optional) Configure Supabase for cloud save functionality:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials

## Architecture

This application runs entirely in the frontend with no backend dependencies for matrix computation. All calculations are performed using:

- **Fraction arithmetic** for exact results
- **Gaussian elimination** for RREF computation
- **Basis extraction** algorithms for subspace computation

The optional Supabase integration only handles saving/loading matrices for authenticated users.
