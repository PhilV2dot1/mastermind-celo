// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Mastermind
 * @dev Smart contract for playing Mastermind code-breaking game on-chain (free to play)
 * @notice Players start a game, then submit their score
 */
contract Mastermind {
    struct PlayerStats {
        uint256 wins;
        uint256 losses;
        uint256 totalGames;
        uint256 totalAttempts;
        uint256 bestScore;
        uint256 lastPlayed;
    }

    struct ActiveGame {
        bool exists;
        uint256 startTime;
    }

    mapping(address => PlayerStats) public playerStats;
    mapping(address => ActiveGame) public activeGames;

    event GameStarted(address indexed player, uint256 timestamp);
    event ScoreSubmitted(
        address indexed player,
        uint256 score,
        bool won,
        uint256 attempts,
        uint256 timestamp
    );
    event GameAbandoned(address indexed player, uint256 timestamp);

    /**
     * @dev Start a new on-chain game (free)
     */
    function startGame() external {
        require(!activeGames[msg.sender].exists, "Game already in progress");

        activeGames[msg.sender] = ActiveGame({
            exists: true,
            startTime: block.timestamp
        });

        emit GameStarted(msg.sender, block.timestamp);
    }

    /**
     * @dev Submit a game score to the blockchain
     * @param score The final score achieved (0-90 points)
     * @param won Whether the player won
     * @param attempts Number of attempts used (1-10)
     */
    function submitScore(uint256 score, bool won, uint256 attempts) external {
        require(activeGames[msg.sender].exists, "No active game - start a game first");
        require(attempts <= 10, "Invalid attempts");

        delete activeGames[msg.sender];

        PlayerStats storage stats = playerStats[msg.sender];

        if (won) {
            stats.wins++;
            stats.totalAttempts += attempts;
            if (score > stats.bestScore) {
                stats.bestScore = score;
            }
        } else {
            stats.losses++;
        }

        stats.totalGames++;
        stats.lastPlayed = block.timestamp;

        emit ScoreSubmitted(msg.sender, score, won, attempts, block.timestamp);
    }

    /**
     * @dev Abandon the current active game
     */
    function abandonGame() external {
        if (!activeGames[msg.sender].exists) {
            return;
        }

        delete activeGames[msg.sender];

        PlayerStats storage stats = playerStats[msg.sender];

        stats.losses++;
        stats.totalGames++;
        stats.lastPlayed = block.timestamp;

        emit GameAbandoned(msg.sender, block.timestamp);
    }

    /**
     * @dev Get player statistics
     */
    function getStats(address player) external view returns (
        uint256 wins,
        uint256 losses,
        uint256 totalGames,
        uint256 averageAttempts,
        uint256 bestScore
    ) {
        PlayerStats memory stats = playerStats[player];
        uint256 avgAttempts = stats.wins > 0
            ? stats.totalAttempts / stats.wins
            : 0;

        return (
            stats.wins,
            stats.losses,
            stats.totalGames,
            avgAttempts,
            stats.bestScore
        );
    }

    /**
     * @dev Check if player has an active game
     */
    function hasActiveGame(address player) external view returns (bool exists, uint256 startTime) {
        ActiveGame memory game = activeGames[player];
        return (game.exists, game.startTime);
    }
}
