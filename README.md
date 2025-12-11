# Animated

A powerful tool for creating stunning animated code presentations. Record videos, capture screenshots, and build professional code demonstrations with ease.

<img width="1200" height="630" alt="opengraph-image" src="https://github.com/user-attachments/assets/b96c2b61-0b85-4c12-9b75-3fbf97b960f2" />

## About Animated

Animated empowers developers to create professional code presentations and demonstrations effortlessly. Whether you're documenting your code, creating tutorials, or showcasing your projects, Animated provides the tools you need to bring your code to life with beautiful animations and recordings.

Explore the live application and start creating:  
👉 [**Animated**](https://www.animated.extend-ui.com/)

## Key Features

- **Video Recording**: Create stunning code presentations with multiple slides and smooth animations.
- **Screenshot Capture**: Capture high-quality images of your code with customizable themes and backgrounds.
- **Full Customization**: Fine-tune every detail from card appearance, backgrounds, and animations to match your style.
- **Multi-Language Support**: Syntax highlighting for 10+ programming languages with full editor support.
- **Privacy & Control**: Complete ownership of your content with local processing and no data sharing.

## Tech Stack

- **Framework**: Next.js 15.2.6
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Code Editor**: Monaco Editor
- **UI Components**: Radix UI
- **State Management**: Zustand

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/extend-labs/animated.git
   cd animated
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the necessary environment variables (check `src/env.js` for required variables).

4. **Run the development server**

   ```bash
   bun dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `dev` - Start the development server
- `build` - Build the application for production
- `start` - Start the production server
- `preview` - Build and start the production server
- `lint` - Run ESLint
- `lint:fix` - Fix ESLint errors automatically
- `typecheck` - Run TypeScript type checking
- `check` - Run both linting and type checking
- `format` - Format code with Prettier
- `format:check` - Check code formatting

## Project Structure

```
animated/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (landing)/         # Landing page routes
│   │   ├── dashboard/         # Dashboard routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/                # UI components (Radix UI)
│   │   └── extendui/          # Extended UI components
│   ├── config/                # Configuration files
│   ├── constants/             # Constants and data
│   ├── helpers/               # Utility functions
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Library utilities
│   ├── styles/                # Global styles
│   ├── types/                 # TypeScript type definitions
│   └── zustand/               # Zustand stores
├── public/                    # Static assets
└── ...config files
```

## Configuration

The project uses environment variables for configuration. Make sure to set up:

- Database connection (Supabase)
- Authentication settings
- API keys (if needed)

Check `src/env.js` for the complete list of required environment variables.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Code Quality

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

## Links

- **Website**: [https://www.extend-labs.com/](https://www.extend-labs.com/)
- **GitHub**: [https://github.com/extendlabs/](https://github.com/extendlabs/)

## Acknowledgments

Built with ❤️ by [Extend Labs](https://github.com/extendlabs)
