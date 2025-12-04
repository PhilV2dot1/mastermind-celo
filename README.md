# 🎯 Mastermind on Celo

A Farcaster mini-app implementation of the classic Mastermind code-breaking game, built on the Celo blockchain.

## 🎮 Game Features

- **Classic Mastermind Gameplay**: Crack a 4-color secret code in 10 attempts
- **Dual-Mode Gameplay**:
  - **Free Mode**: Practice offline with localStorage stats
  - **On-Chain Mode**: Compete on Celo blockchain with 0.01 CELO fee per game
- **Smart Contract**: Deployed on Celo mainnet at `0x04481EeB5111BDdd2f05A6E20BE51B295b5251C9`
- **Real-time Feedback**: Black pegs (correct position) and white pegs (correct color, wrong position)
- **Scoring System**: 100 - (attempts × 10) = score (max 90 points)
- **Statistics Tracking**: Wins, losses, best score, and win rate
- **Farcaster Integration**: Share results directly to Farcaster
- **Mobile-Optimized**: Touch-friendly UI designed for mobile play

## 🚀 Tech Stack

- **Framework**: Next.js 14.2.15 (App Router)
- **Blockchain**: Celo (Mainnet & Alfajores Testnet)
- **Wallet Integration**: Wagmi v2 + Viem v2
- **Farcaster**: Mini-App SDK v0.2.1
- **Smart Contracts**: Solidity 0.8.20 + Hardhat
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/mastermind-celo.git
cd mastermind-celo

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your WalletConnect Project ID
```

## 🔧 Configuration

Create a `.env.local` file:

```env
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get a WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)

## 💻 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔗 Smart Contract Deployment

The smart contract is already deployed on Celo mainnet. To deploy to a different network:

```bash
cd contracts

# Deploy to Alfajores testnet
npx hardhat run scripts/deploy.js --network alfajores

# Deploy to Celo mainnet
npx hardhat run scripts/deploy.js --network celo
```

Update the contract address in `lib/contract-abi.ts` after deployment.

## 🎯 How to Play

1. **Choose Your Mode**:
   - **Free Play**: No wallet needed, practice offline
   - **On-Chain**: Connect wallet to compete on-chain

2. **Make Your Guess**:
   - Select 4 colors from the palette
   - Colors can repeat in the secret code
   - Submit your guess

3. **Interpret Feedback**:
   - **Black Peg**: Correct color in correct position
   - **White Peg**: Correct color in wrong position
   - Use feedback to refine your next guess

4. **Win the Game**:
   - Crack the code in 10 attempts or less
   - Higher score for fewer attempts (100 - attempts × 10)

## 📱 Farcaster Mini-App

This game is designed as a Farcaster mini-app. To register:

1. Deploy the app to a public URL (Vercel recommended)
2. Register at [Farcaster Developer Portal](https://developers.farcaster.xyz/)
3. Update `next.config.mjs` with your mini-app UUID
4. Share in Warpcast!

## 🎨 Design

The UI follows the Blackjack Farcaster design language:
- Light gradient background (gray → yellow tones)
- White cards with backdrop blur and Celo yellow borders
- Compact, mobile-first layout
- Touch-friendly 44px minimum tap targets
- Safe area support for notched devices

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📄 License

MIT License

## 🙏 Acknowledgments

- Built on [Celo](https://celo.org) blockchain
- Farcaster Mini-App SDK
- Classic Mastermind game by Mordecai Meirowitz

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
