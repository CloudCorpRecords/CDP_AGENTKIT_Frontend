
# CDP AgentKit Chatbot - Complete Technical Documentation

## 1. File Structure and Dependencies
```typescript
// Core CDP AgentKit imports for blockchain functionality
import {
  AgentKit,                  // Main framework for blockchain operations
  CdpWalletProvider,         // Manages wallet and key operations
  wethActionProvider,        // Wrapped ETH operations
  walletActionProvider,      // Wallet management functions
  erc20ActionProvider,       // ERC20 token operations
  cdpApiActionProvider,      // CDP API integration
  cdpWalletActionProvider,   // CDP wallet management
  pythActionProvider,        // Price feed functionality
} from "@coinbase/agentkit";

// LangChain integration imports for AI capabilities
import { getLangChainTools } from "@coinbase/agentkit-langchain";    // Tool integration
import { HumanMessage } from "@langchain/core/messages";             // Message handling
import { MemorySaver } from "@langchain/langgraph";                  // Memory management
import { createReactAgent } from "@langchain/langgraph/prebuilt";    // Agent creation
import { ChatOpenAI } from "@langchain/openai";                      // OpenAI integration

// System utilities
import * as dotenv from "dotenv";        // Environment variable management
import * as fs from "fs";                // File system operations
import * as readline from "readline";     // Command line interface
```

## 2. Environment Management
```typescript
// Load environment variables
dotenv.config();

// Environment validation function
function validateEnvironment(): void {
  const missingVars: string[] = [];
  const requiredVars = [
    "OPENAI_API_KEY",           // Required for AI functionality
    "CDP_API_KEY_NAME",         // CDP API authentication
    "CDP_API_KEY_PRIVATE_KEY"   // CDP API private key
  ];
  
  // Check each required variable
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Exit if any required variables are missing
  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach(varName => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }

  // Network ID warning
  if (!process.env.NETWORK_ID) {
    console.warn("Warning: NETWORK_ID not set, defaulting to base-sepolia testnet");
  }
}
```

## 3. Agent Initialization
```typescript
// Wallet data persistence
const WALLET_DATA_FILE = "wallet_data.txt";

async function initializeAgent() {
  try {
    // Initialize LLM with GPT-4
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
    });

    // Handle wallet data persistence
    let walletDataStr: string | null = null;
    if (fs.existsSync(WALLET_DATA_FILE)) {
      try {
        walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
      } catch (error) {
        console.error("Error reading wallet data:", error);
      }
    }

    // CDP Configuration setup
    const config = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      cdpWalletData: walletDataStr || undefined,
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    // Initialize wallet provider
    const walletProvider = await CdpWalletProvider.configureWithWallet(config);

    // Setup AgentKit with all action providers
    const agentkit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        wethActionProvider(),           // WETH operations
        pythActionProvider(),           // Price feeds
        walletActionProvider(),         // Wallet management
        erc20ActionProvider(),          // ERC20 tokens
        cdpApiActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        cdpWalletActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      ],
    });

    // Get LangChain tools
    const tools = await getLangChainTools(agentkit);

    // Initialize memory and configuration
    const memory = new MemorySaver();
    const agentConfig = { 
      configurable: { 
        thread_id: "CDP AgentKit Chatbot Example!" 
      } 
    };

    // Create React Agent
    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
        You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit.
        You are empowered to interact onchain using your tools.
        If you ever need funds, you can request them from the faucet if you are on network ID 'base-sepolia'.
        If not, you can provide your wallet details and request funds from the user.
        Before executing your first action, get the wallet details to see what network you're on.
        If there is a 5XX (internal) HTTP error code, ask the user to try again later.
        If someone asks you to do something you can't do with your currently available tools,
        you must say so, and encourage them to implement it themselves using the CDP SDK + Agentkit,
        recommend they go to docs.cdp.coinbase.com for more information.
        Be concise and helpful with your responses.
        Refrain from restating your tools' descriptions unless it is explicitly requested.
      `,
    });

    // Save wallet data for persistence
    const exportedWallet = await walletProvider.exportWallet();
    fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error;
  }
}
```

## 4. Operation Modes

### 4.1 Autonomous Mode
```typescript
async function runAutonomousMode(agent: any, config: any, interval = 10) {
  console.log("Starting autonomous mode...");

  while (true) {
    try {
      // Generate creative blockchain interaction
      const thought =
        "Be creative and do something interesting on the blockchain. " +
        "Choose an action or set of actions and execute it that highlights your abilities.";

      // Process and stream results
      const stream = await agent.stream(
        { messages: [new HumanMessage(thought)] },
        config
      );

      // Handle stream chunks
      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }

      // Wait for next interval
      await new Promise(resolve => setTimeout(resolve, interval * 1000));
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
      process.exit(1);
    }
  }
}
```

### 4.2 Chat Mode
```typescript
async function runChatMode(agent: any, config: any) {
  console.log("Starting chat mode... Type 'exit' to end.");

  // Initialize readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Promise wrapper for readline
  const question = (prompt: string): Promise<string> =>
    new Promise(resolve => rl.question(prompt, resolve));

  try {
    while (true) {
      // Get user input
      const userInput = await question("\nPrompt: ");

      // Check for exit command
      if (userInput.toLowerCase() === "exit") {
        break;
      }

      // Process user input
      const stream = await agent.stream(
        { messages: [new HumanMessage(userInput)] },
        config
      );

      // Handle response stream
      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}
```

### 4.3 Mode Selection
```typescript
async function chooseMode(): Promise<"chat" | "auto"> {
  // Initialize readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Promise wrapper for readline
  const question = (prompt: string): Promise<string> =>
    new Promise(resolve => rl.question(prompt, resolve));

  while (true) {
    // Display mode options
    console.log("\nAvailable modes:");
    console.log("1. chat    - Interactive chat mode");
    console.log("2. auto    - Autonomous action mode");

    // Get user choice
    const choice = (await question("\nChoose a mode (enter number or name): "))
      .toLowerCase()
      .trim();

    // Process choice
    if (choice === "1" || choice === "chat") {
      rl.close();
      return "chat";
    } else if (choice === "2" || choice === "auto") {
      rl.close();
      return "auto";
    }
    console.log("Invalid choice. Please try again.");
  }
}
```

## 5. Main Program Execution
```typescript
async function main() {
  try {
    // Initialize agent and get configuration
    const { agent, config } = await initializeAgent();
    
    // Get user's preferred mode
    const mode = await chooseMode();

    // Run selected mode
    if (mode === "chat") {
      await runChatMode(agent, config);
    } else {
      await runAutonomousMode(agent, config);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
}

// Entry point check and execution
if (require.main === module) {
  console.log("Starting Agent...");
  main().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
```

## 6. Error Handling Strategy
- Comprehensive try-catch blocks throughout the code
- Specific error type checking using instanceof
- Graceful degradation with appropriate error messages
- Clean process exit on fatal errors
- User-friendly error feedback

## 7. Memory Management
- Conversation history persistence using MemorySaver
- Thread identification for context maintenance
- State persistence across sessions
- Efficient memory cleanup on exit

## 8. Configuration Management
- Environment variable validation
- Wallet data persistence
- Network configuration
- API key management
- Action provider configuration

## 9. Security Considerations
- API key validation
- Secure wallet data storage
- Error handling for sensitive operations
- Network ID verification
- Safe exit procedures
