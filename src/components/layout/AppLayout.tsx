import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function AppLayout() {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border bg-card px-4 no-print">
            <SidebarTrigger className="mr-3" />
            <PageTitle />
          </header>
          <main className="flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function PageTitle() {
  const location = useLocation();
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/data-sekolah': 'Pengaturan Sekolah',
    '/pengaturan-sekolah': 'Pengaturan Sekolah',
    '/data-siswa': 'Data Peserta Didik',
    '/pengaturan-bobot': 'Pengaturan Bobot Nilai',
    '/nilai-us': 'Nilai Ujian Sekolah',
  };

  let title = titles[location.pathname];
  if (!title && location.pathname.startsWith('/nilai/')) {
    const sem = location.pathname.split('/').pop();
    title = `Nilai Raport Semester ${sem}`;
  }
  if (!title && location.pathname.startsWith('/print/')) {
    title = 'Cetak Dokumen';
  }

  return <h1 className="text-heading font-semibold text-foreground">{title || 'Aplikasi Olah Nilai'}</h1>;
}
