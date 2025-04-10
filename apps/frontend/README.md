# HoagieClub Frontend

HoagieClub is a collaborative sandwich creation app built with React Native and Expo. This mobile frontend allows users to create, browse, and comment on hoagies. It connects to a NestJS + MongoDB backend API.

## Features

- User login/signup
- Create hoagies
- Paginated list of hoagies
- View hoagie details with comments
- Add comments to hoagies

## Tech Stack

- React Native (TypeScript)
- Expo
- React Navigation
- React Native Paper (UI)
- Context API (for global user state)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2.Configuration

Ensure the backend is running at:

```
http://localhost:3000
```
### 3. Start the app

```bash
npx expo start
```

## Project Structure

Here's how the frontend app is organized:

- `App.tsx` – Root component and navigation
- `context/` – Global user context (auth state)
- `screens/` – Login, Hoagie List, Create, Detail
- `components/` – Reusable UI like comment input and list
- `services/` – API helper
- `hooks/` – Custom hooks
- `assets/` – Logo and image files