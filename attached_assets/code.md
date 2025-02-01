
# CDP AgentKit Implementation Guide

## 1. Project Structure
```
project/
├── chatbot.ts           // Main application file
├── wallet_data.txt      // Persistent wallet storage
├── .env                 // Environment configuration
└── package.json         // Dependencies and scripts
```

## 2. Core Components

### 2.1 Environment Configuration
- Uses dotenv for environment variable management
- Required variables:
  - OPENAI_API_KEY: For AI model access
  - CDP_API_KEY_NAME: CDP API authentication
  - CDP_API_KEY_PRIVATE_KEY: CDP API security
- Optional:
  - NETWORK_ID: Blockchain network selection (defaults to base-sepolia)

### 2.2 Wallet Management
- Persistent storage in wallet_data.txt
- Automatic wallet recovery on restart
- Secure wallet export/import
- Network-specific configuration

### 2.3 Agent Framework
- Built on CDP AgentKit
- LangChain integration for AI capabilities
- React Agent implementation
- Memory management for conversation persistence

## 3. Action Providers

### 3.1 WETH Actions
- Wrapped ETH operations
- Token wrapping/unwrapping
- Balance management
- Transfer capabilities

### 3.2 Wallet Actions
- Account management
- Balance checking
- Transaction signing
- Key management

### 3.3 ERC20 Actions
- Token transfers
- Balance queries
- Allowance management
- Contract interactions

### 3.4 CDP API Actions
- Platform integration
- API request handling
- Response processing
- Error management

### 3.5 Pyth Actions
- Price feed integration
- Real-time data access
- Market information
- Price verification

## 4. Operation Modes

### 4.1 Chat Mode
- Interactive user interface
- Command processing
- Response streaming
- Exit handling

### 4.2 Autonomous Mode
- Continuous operation
- Interval-based actions
- Creative blockchain interactions
- Error recovery

## 5. Implementation Details

### 5.1 Memory Management
```typescript
const memory = new MemorySaver();
const agentConfig = {
  configurable: {
    thread_id: "CDP AgentKit Chatbot Example!"
  }
};
```

### 5.2 Agent Configuration
```typescript
const agent = createReactAgent({
  llm,                    // Language model
  tools,                  // Action tools
  checkpointSaver: memory, // Memory management
  messageModifier: `...`   // Behavior definition
});
```

### 5.3 Error Handling
```typescript
try {
  // Operation code
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
  process.exit(1);
}
```

## 6. Security Features

### 6.1 Environment Validation
```typescript
function validateEnvironment(): void {
  // Required variable checking
  // Network configuration
  // API key validation
}
```

### 6.2 Wallet Security
```typescript
const exportedWallet = await walletProvider.exportWallet();
fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));
```

## 7. User Interface

### 7.1 Mode Selection
```typescript
console.log("\nAvailable modes:");
console.log("1. chat    - Interactive chat mode");
console.log("2. auto    - Autonomous action mode");
```

### 7.2 User Input Processing
```typescript
const userInput = await question("\nPrompt: ");
if (userInput.toLowerCase() === "exit") {
  break;
}
```

## 8. Performance Considerations

### 8.1 Stream Processing
```typescript
const stream = await agent.stream(
  { messages: [new HumanMessage(userInput)] },
  config
);
```

### 8.2 Interval Management
```typescript
await new Promise(resolve => setTimeout(resolve, interval * 1000));
```

## 9. Development Guidelines

### 9.1 Code Style
- TypeScript for type safety
- Async/await for asynchronous operations
- Comprehensive error handling
- Clear documentation
- Consistent formatting

### 9.2 Best Practices
- Environment validation
- Secure data handling
- Graceful error recovery
- Clean exit procedures
- User feedback

## 10. Deployment

### 10.1 Prerequisites
- Node.js environment
- API keys configuration
- Network selection
- Storage setup

### 10.2 Configuration
```typescript
const config = {
  apiKeyName: process.env.CDP_API_KEY_NAME,
  apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  cdpWalletData: walletDataStr || undefined,
  networkId: process.env.NETWORK_ID || "base-sepolia",
};
```
