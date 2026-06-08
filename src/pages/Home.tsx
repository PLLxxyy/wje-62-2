import React from 'react';
import { Printer, Cpu, Zap } from 'lucide-react';
import { StatusIndicator } from '@/components/StatusIndicator';
import { ImageUploader } from '@/components/ImageUploader';
import { ControlPanel } from '@/components/ControlPanel';
import { AsciiPreview } from '@/components/AsciiPreview';
import { ActionButtons } from '@/components/ActionButtons';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-crt-bg text-crt-green">
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 border-dots" />
      </div>

      <div className="fixed inset-0 pointer-events-none scanlines opacity-10" />

      <header className="relative border-b-4 border-crt-border bg-crt-bgDark">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Printer className="w-10 h-10 text-crt-green" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-crt-green rounded-full animate-breathing led-on" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-crt-green text-shadow-crt tracking-wider">
                  ASCII ART GENERATOR
                </h1>
                <p className="text-crt-green opacity-60 text-sm tracking-widest">
                  ███ DOT-MATRIX PRINTER SIMULATOR ███
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2">
                <Cpu className="w-4 h-4 text-crt-green opacity-60" />
                <span className="text-xs text-crt-green opacity-60 font-mono">
                  SYSTEM V2.1
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-crt-amber" />
                <span className="text-xs text-crt-amber font-mono animate-pulse">
                  ONLINE
                </span>
              </div>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-crt-green animate-breathing led-on" />
                <div className="w-3 h-3 rounded-full bg-crt-amber animate-breathing led-amber-on" style={{ animationDelay: '0.5s' }} />
                <div className="w-3 h-3 rounded-full bg-crt-green animate-breathing led-on" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-crt-green to-transparent opacity-50" />
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-crt-bgDark border-2 border-crt-border rounded-xl p-5 shadow-lg">
              <StatusIndicator />
            </div>

            <div className="bg-crt-bgDark border-2 border-crt-border rounded-xl p-5 shadow-lg">
              <ImageUploader />
            </div>

            <div className="bg-crt-bgDark border-2 border-crt-border rounded-xl p-5 shadow-lg">
              <ControlPanel />
            </div>

            <div className="bg-crt-bgDark border-2 border-crt-border rounded-xl p-5 shadow-lg">
              <ActionButtons />
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-crt-bgDark border-2 border-crt-border rounded-xl p-5 shadow-lg h-full min-h-[600px]">
              <AsciiPreview />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t-2 border-crt-border pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-crt-green opacity-50">
            <div className="flex items-center gap-4 font-mono">
              <span>MODEL: ASCII-PRO-2024</span>
              <span>|</span>
              <span>BAUD: 9600</span>
              <span>|</span>
              <span>PARITY: NONE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-crt-green animate-pulse" />
              <span className="font-mono">READY TO RECEIVE DATA</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-crt-border bg-crt-bgDark mt-8">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-xs text-crt-green opacity-40 font-mono tracking-wider">
            ═══════════════════════════════════════════
            <br />
            ASCII ART GENERATOR © 2024 | DOT MATRIX TECHNOLOGY
            <br />
            ═══════════════════════════════════════════
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;