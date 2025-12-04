import sdk from "@farcaster/miniapp-sdk";

// Initialize Farcaster SDK immediately when this module loads
// This ensures ready() is called as early as possible to dismiss the splash screen
if (typeof window !== "undefined") {
  sdk.actions.ready().catch((error) => {
    console.error("Failed to initialize Farcaster SDK on load:", error);
  });
}
