// Mastermind Smart Contract ABI
// This will be updated after contract deployment

export const CONTRACT_ADDRESS = "0x04481EeB5111BDdd2f05A6E20BE51B295b5251C9" as `0x${string}`;

export const CONTRACT_ABI = [
  {
    type: "function",
    name: "startGame",
    inputs: [],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "submitScore",
    inputs: [
      { name: "score", type: "uint256" },
      { name: "won", type: "bool" },
      { name: "attempts", type: "uint256" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getStats",
    inputs: [{ name: "player", type: "address" }],
    outputs: [
      { name: "wins", type: "uint256" },
      { name: "losses", type: "uint256" },
      { name: "totalGames", type: "uint256" },
      { name: "averageAttempts", type: "uint256" },
      { name: "bestScore", type: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "hasActiveGame",
    inputs: [{ name: "player", type: "address" }],
    outputs: [
      { name: "exists", type: "bool" },
      { name: "startTime", type: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "GAME_FEE",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "event",
    name: "GameStarted",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "ScoreSubmitted",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "score", type: "uint256", indexed: false },
      { name: "won", type: "bool", indexed: false },
      { name: "attempts", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false }
    ]
  }
] as const;
