import { WalletConnect } from "@/components/WalletConnect";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          🌟 Welcome to Lumentix
        </h1>
        <p className="text-center text-lg mb-4">
          Stellar Event Platform - Coming Soon
        </p>
        <p className="text-center text-gray-500 mb-8">
          Your decentralized event management platform
        </p>
        
        <div className="flex justify-center">
          <WalletConnect />
        </div>
      </div>
    </main>
  );
}
