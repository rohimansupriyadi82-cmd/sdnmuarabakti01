import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

const titles: Record<string, string> = {
  "/print/kolektif-nilai": "Kolektif Nilai",
  "/print/rekap-ppdb": "Rekap Nilai Raport (PPDB)",
  "/print/rekap-dinas": "Rekap Nilai Raport (Dinas)",
  "/print/surat-kelulusan": "Surat Kelulusan",
  "/print/surat-kelakuan": "Surat Kelakuan Baik",
  "/print/serah-terima": "Serah Terima Ijazah",
  "/print/laporan-kelulusan": "Laporan Kelulusan",
  "/print/kenaikan-kelas": "Daftar Kenaikan Kelas",
};

export default function PrintPlaceholder() {
  const location = useLocation();
  const title = titles[location.pathname] || "Cetak Dokumen";

  return (
    <div className="animate-fade-in">
      <Card className="shadow-card">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-heading font-semibold text-foreground mb-2">{title}</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Template cetak {title} akan tersedia setelah data peserta didik dan nilai telah dilengkapi.
            Silakan input data terlebih dahulu melalui menu navigasi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
