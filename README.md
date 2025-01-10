# Genius Game

## Overview
Genius Game is a modern implementation of the classic memory game "Simon". The project includes both **solo**, **1vs1** and **cooperative multiplayer** modes, where players test their memory and teamwork to follow sequences of colors that grow progressively harder.
This project used **React**, **TypeScript**, and **Firebase** for real-time sycrhronization and responsive gameplay.

## Features
- 🕹️ **Solo Mode**: Play alone and test your memory as the sequence grows.
- ⚔️ **1vs1 Mode**: Test your memory and face your friends.
- 🤝 **Cooperative Mode**: Take turns with another player, working together to complete sequences.
- 💾 **Real-Time Database**: Firebase Firestore ensures game states are synchronized across players in cooperative mode.
- 🔊 **Sound Effects**: Feedback for correct and incorrect moves.
- 🎨 **User-Friendly Interface**: Clean, responsive design for an enjoyable experience.
- 🖼️ **Player Profiles**: Displays player names and avatars in multiplayer mode.

## Technologies Used
- **Frontend**: React, TypeScript, CSS
- **Backend**: Firebase Firestore (real-time database)
- **Tools**: Vite, Universal Cookies for user management
- **Assets**: Custom sound effects for feedback

## Setup Instructions
### Prerequisites
- Node.js installed
- Basic knowledge of `npm` commands
### Installation
1. Clone the repository:
```bash
git clone https://github.com/DanielObara/Genius-Memory-Game.git
cd genius-game
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## How to Play
### Solo Mode
1. Start the game.
2. Make login with your google account.
3. Watch the sequence of colors carefully.
4. Repeat the sequence. The game gets harder as the sequence grows longer.
### 1vs1 Mode
1. Enter a room name to create or join a multiplayer session.
2. Players take turns repeating the sequence.
3. Whoever gets the sequence wrong first loses.
### Cooperative Mode
1. Enter a room name to create or join a multiplayer session.
2. Players take turns repeating the sequence.
3. Work together to complete the sequence and advance to the next round.

## Acknowledgments
- Inspired by the classic "Simon" game.
- [@DanielObara](https://github.com/DanielObara) for mentoring during development.

This project was developed by:
- [@ArtHirche](https://github.com/ArtHirche).
- [@Edugiyuu](https://github.com/Edugiyuu).