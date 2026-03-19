import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import IdentitasKepalaSekolah from "@/pages/IdentitasKepalaSekolah";
import DataSiswa from "@/pages/DataSiswa";
import PengaturanBobot from "@/pages/PengaturanBobot";
import NilaiSemester from "@/pages/NilaiSemester";
import NilaiUSPage from "@/pages/NilaiUS";
import SuratKelulusan from "@/pages/print/SuratKelulusan";
import SuratKeteranganNISN from "@/pages/print/SuratKeteranganNISN";
import SuratKelakuanBaik from "@/pages/print/SuratKelakuanBaik";
import SuratTranskripNilai from "@/pages/print/SuratTranskripNilai";
import SerahTerimaIjazah from "@/pages/print/SerahTerimaIjazah";
import DaftarKendaliIjazah from "@/pages/print/DaftarKendaliIjazah";
import AmplopKelulusan from "@/pages/print/AmplopKelulusan";
import AIToolsPembuatSoal from "@/pages/AIToolsPembuatSoal";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/identitas-sekolah" element={<Settings />} />
            <Route path="/identitas-kepala-sekolah" element={<IdentitasKepalaSekolah />} />
            <Route path="/ai-tools" element={<AIToolsPembuatSoal />} />
            <Route path="/data-siswa" element={<DataSiswa />} />
            <Route path="/pengaturan-bobot" element={<PengaturanBobot />} />
            <Route path="/nilai/:semester" element={<NilaiSemester />} />
            <Route path="/nilai-us" element={<NilaiUSPage />} />
            <Route path="/print/transkrip" element={<SuratTranskripNilai />} />
            <Route path="/print/transkrip/:siswaId" element={<SuratTranskripNilai />} />
            <Route path="/print/surat-kelulusan" element={<SuratKelulusan />} />
            <Route path="/print/surat-nisn" element={<SuratKeteranganNISN />} />
            <Route path="/print/surat-kelakuan" element={<SuratKelakuanBaik />} />
            <Route path="/print/serah-terima" element={<SerahTerimaIjazah />} />
            <Route path="/print/daftar-kendali-ijazah" element={<DaftarKendaliIjazah />} />
            <Route path="/print/amplop-kelulusan" element={<AmplopKelulusan />} />
            <Route path="/print/amplop-kelulusan/:siswaId" element={<AmplopKelulusan />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
