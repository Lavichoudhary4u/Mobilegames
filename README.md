# Multi-Game App Platform

This is a React Native/Expo app that hosts multiple games in one platform. Each game is self-contained in its own folder under `src/games/`, while shared components, hooks, utilities, and types live in `src/shared/` for reuse across all games.

## Project Structure

Games go in `src/games/[game-name]/` with their own components, screens, hooks, utils, and types. The main app screens like home and game selector are in `src/screens/`. All reusable code is organized in `src/shared/` so games can share common functionality without duplication.

## Getting Started

Install dependencies with `npm install` and start the dev server with `npx expo start`. You can then open the app in an iOS simulator, Android emulator, or scan the QR code with Expo Go on your phone.

## Creating a New Game

Create a new folder in `src/games/[game-name]` with the standard structure: components, screens, hooks, utils, types, and an index.ts entry point. Export your game from index.ts and register it in the game selector to make it available in the app.
