# CDP AgentKit Chatbot Web Interface

A web-based interface for interacting with Coinbase's CDP AgentKit, featuring real-time blockchain interactions through a modern React frontend. This project demonstrates the capabilities of CDP AgentKit for building autonomous blockchain agents with a user-friendly interface.

## Quick Start with Replit

1. Fork this project on Replit:
   - Visit [https://replit.com/@CloudCorpRecord/Coinbase-x-Agent-Kit?v=1](https://replit.com/@CloudCorpRecord/Coinbase-x-Agent-Kit?v=1)
   - Click "Fork" to create your own copy
   - Replit will automatically set up the development environment

2. Set up your API Keys (IMPORTANT):
   - Before running the application, you MUST obtain these API keys:
     - `OPENAI_API_KEY`: Get from [OpenAI Platform](https://platform.openai.com)
     - `CDP_API_KEY_NAME` and `CDP_API_KEY_PRIVATE_KEY`: Get from [Coinbase Cloud](https://cloud.coinbase.com)
   - **DO NOT** add the keys manually! The agent will automatically prompt you for them
   - When you first run the application, the CDP AgentKit chatbot will guide you through setting up your keys securely

3. Start developing:
   - The application will automatically start in development mode
   - The agent will prompt you for the required API keys
   - Follow the agent's instructions to complete the setup
   - Access your app through the Replit webview

## Features

- 💬 Interactive chat interface
- 🤖 Autonomous mode for automated blockchain interactions
- 💳 Real-time wallet information
- 🌐 Network status monitoring
- 📝 Message history with PostgreSQL persistence
- 🎨 Modern, responsive UI with shadcn/ui

## Architecture

- Frontend: React with TypeScript
- Backend: Express.js
- Database: PostgreSQL with Drizzle ORM
- Real-time: Socket.IO
- Styling: Tailwind CSS + shadcn/ui

## Development

This project uses Replit's development environment, which provides:
- Automatic dependency management
- Built-in database
- Integrated development environment
- Live preview

## Contributing

This is an open-source project that demonstrates the integration between Replit and Coinbase's CDP AgentKit. Feel free to:
1. Fork the repository
2. Make improvements
3. Submit pull requests
4. Report issues
5. Suggest new features

## Learn More

- [CDP AgentKit Documentation](https://docs.cdp.coinbase.com)
- [Replit Documentation](https://docs.replit.com)
- [React Documentation](https://react.dev)

## Community

Join our community to discuss development, ask questions, and share your projects:
- [Coinbase Cloud Discord](https://discord.gg/coinbasecloud)
- [Replit Discord](https://discord.gg/replit)

## License

This project is open-source under the MIT license. Feel free to use it as a starting point for your own CDP AgentKit projects!