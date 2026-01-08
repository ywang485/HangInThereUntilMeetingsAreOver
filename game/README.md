# Hang In There Until Meetings Are Over

A turn-based social management game where you navigate workplace relationships with three animal communities (Cats, Ducks, and Squirrels) to keep your job.

## About

This is a Next.js port of the original Unity game "NoCollapseUntilMeetingsAreOver". The game features:

- **Turn-based gameplay**: Attend meetings and make dialogue choices
- **Resource management**: Balance your hearts (mental energy) with relationship building
- **Multiple endings**: Win by reaching 100 relationship with any community, or lose if relationships or hearts drop too low
- **Bilingual support**: Full English and Chinese localization
- **Pixel art aesthetic**: Retro-styled visuals with a charming indie feel

## How to Play

- Each meeting, choose from three response options:
  - **2-Heart Response** (Red): Costs 2 hearts, improves relationship (+5 regular, +10 important NPCs)
  - **1-Heart Response** (Yellow): Costs 1 heart, neutral relationship change
  - **0-Heart Response** (Green): Gains 1 heart, hurts relationship (-10 regular, -20 important NPCs)

- **Win condition**: Reach 100 relationship points with any community
- **Lose conditions**: Any relationship drops to 0, or you run out of meetings

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to play the game.

## Building for Production

Build the static site:

```bash
npm run build
```

This will create an optimized static export in the `out` directory.

## Deploying to Vercel

The easiest way to deploy this Next.js app is to use [Vercel](https://vercel.com):

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and deploy your app

Alternatively, you can deploy using the Vercel CLI:

```bash
npm install -g vercel
vercel
```

## Technology Stack

- **Next.js 16**: React framework with static export support
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Context API**: State management

## Credits

Original game created in Unity. Ported to Next.js for web deployment.
