import { ReactNode } from 'react';
import Navbar from './Navbar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div
      className="min-h-screen bg-background"
      data-icod-id="src_components_applayout_tsx_f637">
      <Navbar data-icod-id="src_components_applayout_tsx_4a79" />
      <main className="lg:pl-64" data-icod-id="src_components_applayout_tsx_112b">
        <div
          className="p-4 pt-20 lg:p-8 lg:pt-8"
          data-icod-id="src_components_applayout_tsx_adfc">
          {children}
        </div>
      </main>
    </div>
  );
}
