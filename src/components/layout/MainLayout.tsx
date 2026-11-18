import type { ReactNode } from 'react';
import { Toast } from '../ui/Toast';
import { BottomNav } from './BottomNav';
import { Navbar } from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 md:pb-12 md:pt-7">
        {children}
      </main>
      <footer className="hidden border-t border-stone-200/80 py-4 text-xs text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-400 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <span>Queso Circular IA</span>
          <span>Valorización láctea y lactosuero</span>
        </div>
      </footer>
      <BottomNav />
      <Toast />
    </div>
  );
}
