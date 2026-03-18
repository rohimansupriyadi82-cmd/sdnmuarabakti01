import { useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { getStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";

const pageStyle = `
  @page {
    size: 330mm 215mm;
    margin: 10mm 12mm 12mm 12mm;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

export default function DaftarKendaliIjazah() {
  const store = getStore();
  const siswaList = useMemo(() => [...store.siswaList], [store.siswaList]);
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: printRef, pageStyle });

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="shadow-card no-print">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading font-semibold">Daftar Kendali Ijazah</CardTitle>
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
              padding: "8mm 10mm 10mm 10mm",
              fontFamily: "'Times New Roman', serif",
              fontSize: "10pt",
              lineHeight: 1.25,
              color: "black",
              background: "white",
            }}
          >
            <div style={{ textAlign: "center", fontWeight: 700, fontSize: "10pt", marginBottom: "4mm" }}>
              <div>DAFTAR KENDALI IJAZAH SEKOLAH DASAR (SD)</div>
              <div>TAHUN PELAJARAN 2024/2025</div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-start", gap: "18mm", fontSize: "9pt", marginBottom: "3mm" }}>
              <div style={{ display: "flex", gap: "3mm" }}>
                <span style={{ width: "22mm", fontWeight: 700 }}>KECAMATAN</span>
                <span>:</span>
                <span style={{ fontWeight: 700 }}>{store.sekolah.kecamatan.toUpperCase()}</span>
              </div>
              <div style={{ display: "flex", gap: "3mm" }}>
                <span style={{ width: "22mm", fontWeight: 700 }}>KAB/KOTA</span>
                <span>:</span>
                <span style={{ fontWeight: 700 }}>{store.sekolah.kabupaten.toUpperCase()}</span>
              </div>
            </div>

            <table className="w-full border-collapse text-[9pt]" style={{ border: "1px solid black" }}>
              <thead>
                <tr>
                  <th rowSpan={2} style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700, width: "10mm", background: "#d9d9d9" }}>
                    URUT
                  </th>
                  <th colSpan={2} style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700, background: "#d9d9d9" }}>
                    NOMOR
                  </th>
                  <th colSpan={2} style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700, background: "#d9d9d9" }}>
                    IDENTITAS SISWA
                  </th>
                  <th rowSpan={2} style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700, width: "32mm", background: "#d9d9d9" }}>
                    NOMOR SERI IJAZAH
                  </th>
                  <th colSpan={2} style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700, background: "#d9d9d9" }}>
                    IDENTITAS SEKOLAH
                  </th>
                  <th rowSpan={2} style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700, width: "28mm", background: "#d9d9d9" }}>
                    KET
                  </th>
                </tr>
                <tr>
                  <th style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700, width: "22mm", background: "#d9d9d9" }}>
                    INDUK SISWA
                  </th>
                  <th style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700, width: "28mm", background: "#d9d9d9" }}>
                    UJIAN SEKOLAH
                  </th>
                  <th style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700, width: "55mm", background: "#d9d9d9" }}>
                    NAMA
                  </th>
                  <th style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700, width: "55mm", background: "#d9d9d9" }}>
                    TEMPAT, TANGGAL LAHIR
                  </th>
                  <th style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700, width: "52mm", background: "#d9d9d9" }}>
                    NAMA SEKOLAH
                  </th>
                  <th style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700, width: "10mm", background: "#d9d9d9" }}>
                    KLS
                  </th>
                </tr>
              </thead>
              <tbody>
                {siswaList.map((s, idx) => (
                  <tr key={s.id}>
                    <td style={{ border: "1px solid black", padding: "1.2mm", textAlign: "center" }}>{idx + 1}</td>
                    <td style={{ border: "1px solid black", padding: "1.2mm", textAlign: "center" }}>{s.nis}</td>
                    <td style={{ border: "1px solid black", padding: "1.2mm", textAlign: "center" }}>{s.nomorPeserta}</td>
                    <td style={{ border: "1px solid black", padding: "1.2mm", fontWeight: 700, textTransform: "uppercase" }}>{s.nama}</td>
                    <td style={{ border: "1px solid black", padding: "1.2mm" }}>
                      {s.tempatLahir}, {s.tanggalLahir}
                    </td>
                    <td style={{ border: "1px solid black", padding: "1.2mm", textAlign: "center" }}>{s.noSeriIjazah}</td>
                    <td style={{ border: "1px solid black", padding: "1.2mm", textTransform: "uppercase" }}>
                      SD NEGERI MUARA BAKTI 01
                    </td>
                    <td style={{ border: "1px solid black", padding: "1.2mm", textAlign: "center" }}>6</td>
                    <td style={{ border: "1px solid black", padding: "1.2mm" }} />
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "10mm" }}>
              <div style={{ textAlign: "center", fontSize: "10pt", width: "80mm" }}>
                <div>Bekasi, 02 Juni 2025</div>
                <div style={{ marginTop: "2mm" }}>Kepala Sekolah</div>
                <div style={{ height: "18mm" }} />
                <div style={{ fontWeight: 700, textDecoration: "underline" }}>{store.sekolah.kepalaSekolah}</div>
                <div>NIP {store.sekolah.nipKepalaSekolah}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

