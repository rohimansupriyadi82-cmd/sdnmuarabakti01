import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router-dom";
import { getStore, useSekolah } from "@/lib/store";
import logoBekasi from "@/assets/logo-bekasi.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Envelope "surat standar" (DL) approximation: 220mm x 110mm
const pageStyle = `
  @page {
    size: 220mm 110mm;
    margin: 8mm 10mm;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

export default function AmplopKelulusan() {
  const store = getStore();
  const [sekolah] = useSekolah();
  const params = useParams<{ siswaId?: string }>();
  const initialId =
    params.siswaId && store.siswaList.some((s) => s.id === params.siswaId)
      ? params.siswaId
      : store.siswaList[0]?.id || "";

  const [selectedSiswa, setSelectedSiswa] = useState(initialId);
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: printRef, pageStyle });

  useEffect(() => {
    if (params.siswaId && store.siswaList.some((s) => s.id === params.siswaId)) {
      setSelectedSiswa(params.siswaId);
    }
  }, [params.siswaId, store.siswaList]);

  const siswa = store.siswaList.find((s) => s.id === selectedSiswa);
  const s = sekolah;
  const logoSrc = s.logoDataUrl || logoBekasi;

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="shadow-card no-print">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading font-semibold">Cetak Amplop Kelulusan</CardTitle>
          <div className="flex items-center gap-3">
            <div className="max-w-xs">
              <label className="text-sm font-medium text-foreground mb-1 block">
                Peserta Didik
              </label>
              <Select value={selectedSiswa} onValueChange={setSelectedSiswa}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Pilih peserta didik" />
                </SelectTrigger>
                <SelectContent>
                  {store.siswaList.map((st) => (
                    <SelectItem key={st.id} value={st.id}>
                      {st.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => handlePrint()} size="sm" className="h-9" disabled={!siswa}>
              <Printer className="mr-2 h-4 w-4" /> Cetak
            </Button>
          </div>
        </CardHeader>
      </Card>

      {siswa && (
        <Card className="shadow-card overflow-auto">
          <CardContent className="p-0">
            <div
              ref={printRef}
              className="print-container bg-card"
              style={{
                width: "220mm",
                minHeight: "110mm",
                margin: "0 auto",
                padding: "8mm 10mm",
                fontFamily: "'Times New Roman', serif",
                fontSize: "10.5pt",
                lineHeight: 1.25,
                color: "black",
                background: "white",
                position: "relative",
              }}
            >
              {/* KOP kiri atas */}
              <div style={{ display: "flex", alignItems: "center", gap: "6mm" }}>
                <img
                  src={logoSrc}
                  alt="Logo"
                  style={{ width: "18mm", height: "18mm", objectFit: "contain" }}
                />
                <div style={{ lineHeight: 1.15 }}>
                  <div style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase" }}>
                    Pemerintah Kabupaten {s.kabupaten}
                  </div>
                  <div style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase" }}>
                    Dinas Pendidikan
                  </div>
                  <div style={{ fontSize: "12pt", fontWeight: 900, textTransform: "uppercase" }}>
                    {s.namaSekolah}
                  </div>
                  <div style={{ fontSize: "8.5pt" }}>
                    {s.alamatSekolah}
                  </div>
                </div>
              </div>

              <div style={{ borderBottom: "2px solid black", marginTop: "3mm" }} />

              {/* Nomor & Hal */}
              <div style={{ marginTop: "3mm", fontSize: "10pt" }}>
                <div style={{ display: "flex" }}>
                  <span style={{ width: "18mm" }}>Nomor</span>
                  <span style={{ width: "4mm" }}>:</span>
                  <span style={{ flex: 1 }} />
                </div>
                <div style={{ display: "flex" }}>
                  <span style={{ width: "18mm" }}>Hal</span>
                  <span style={{ width: "4mm" }}>:</span>
                  <span style={{ fontWeight: 700 }}>Pengumuman Kelulusan</span>
                </div>
              </div>

              {/* Kotak tujuan kanan bawah */}
              <div
                style={{
                  position: "absolute",
                  right: "10mm",
                  bottom: "10mm",
                  width: "95mm",
                  minHeight: "35mm",
                  border: "1.2px solid black",
                  padding: "4mm",
                  fontSize: "11pt",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: "2mm" }}>Kepada:</div>
                <div style={{ fontWeight: 700, textTransform: "uppercase" }}>{siswa.nama}</div>
                <div style={{ marginTop: "1mm" }}>
                  NIS/NISN: {siswa.nis} / {siswa.nisn}
                </div>
                <div style={{ marginTop: "1mm" }}>di Bekasi</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

