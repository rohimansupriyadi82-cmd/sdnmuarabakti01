import { useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { getStore, useSekolah } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Printer } from "lucide-react";
import { TandaTanganKepala } from "@/components/print/KopSekolah";

const pageStyle = `
  @page {
    size: 330mm 215mm;
    margin: 12mm 12mm 14mm 12mm;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

export default function SerahTerimaIjazah() {
  const store = getStore();
  const siswaList = useMemo(() => [...store.siswaList], [store.siswaList]);
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: printRef, pageStyle });

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="shadow-card no-print">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading font-semibold">Tanda Serah Terima Ijazah</CardTitle>
          <Button onClick={() => handlePrint()} size="sm" className="h-9">
            <Printer className="mr-2 h-4 w-4" /> Cetak
          </Button>
        </CardHeader>
      </Card>

      <Card className="shadow-card overflow-auto">
        <CardContent className="p-0">
          <div
            ref={printRef}
            className="print-container bg-card"
            style={{
              width: "330mm",
              minHeight: "215mm",
              margin: "0 auto",
              padding: "10mm 10mm 12mm 10mm",
              fontFamily: "'Times New Roman', serif",
              fontSize: "10pt",
              lineHeight: 1.25,
              color: "black",
              background: "white",
            }}
          >
            <div style={{ textAlign: "center", fontWeight: 700, fontSize: "10pt", marginBottom: "4mm" }}>
              <div style={{ letterSpacing: "0.2px" }}>TANDA SERAH TERIMA IJAZAH SDN MUARA BAKTI 01</div>
              <div>KECAMATAN BABELAN</div>
              <div>TAHUN PELAJARAN {store.sekolah.tahunPelajaran}</div>
            </div>

            <table className="w-full border-collapse text-[9pt]" style={{ border: "1px solid black" }}>
              <thead>
                <tr>
                  {[
                    { label: "No", w: "8mm" },
                    { label: "NIS", w: "20mm" },
                    { label: "NISN", w: "25mm" },
                    { label: "No Peserta Ujian", w: "34mm" },
                    { label: "Tempat Lahir", w: "24mm" },
                    { label: "Tgl Lahir", w: "22mm" },
                    { label: "No Ijazah", w: "20mm" },
                    { label: "Nama Siswa", w: "45mm" },
                    { label: "Nama Orang Tua", w: "45mm" },
                    { label: "Tanda Terima", w: "55mm" },
                  ].map((c) => (
                    <th
                      key={c.label}
                      style={{
                        border: "1px solid black",
                        padding: "2mm 1.5mm",
                        textAlign: "center",
                        fontWeight: 700,
                        width: c.w,
                        verticalAlign: "middle",
                        background: "#d9d9d9",
                      }}
                    >
                      {c.label.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {siswaList.map((s, idx) => (
                  <tr key={s.id}>
                    <td style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center" }}>{idx + 1}</td>
                    <td style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center" }}>{s.nis}</td>
                    <td style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center" }}>{s.nisn}</td>
                    <td style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center" }}>{s.nomorPeserta}</td>
                    <td style={{ border: "1px solid black", padding: "1.5mm" }}>{s.tempatLahir}</td>
                    <td style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center" }}>{s.tanggalLahir}</td>
                    <td style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center" }}>{s.noSeriIjazah}</td>
                    <td style={{ border: "1px solid black", padding: "1.5mm", fontWeight: 700, textTransform: "uppercase" }}>
                      {s.nama}
                    </td>
                    <td style={{ border: "1px solid black", padding: "1.5mm", textTransform: "uppercase" }}>
                      {s.namaOrtuIjazah}
                    </td>
                    <td style={{ border: "1px solid black", padding: "1.5mm" }} />
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "10mm" }}>
              <div style={{ textAlign: "center", fontSize: "10pt", width: "80mm" }}>
                <TandaTanganKepala />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
