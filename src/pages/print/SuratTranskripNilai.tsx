import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { getStore, calculateNilaiIjazah, MATA_PELAJARAN, MATA_PELAJARAN_FULL, useSekolah } from "@/lib/store";
import { KopSekolah, TandaTanganKepala } from "@/components/print/KopSekolah";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer } from "lucide-react";

export default function SuratTranskripNilai() {
  const store = getStore();
  const params = useParams<{ siswaId?: string }>();
  const initialId = params.siswaId && store.siswaList.some(s => s.id === params.siswaId)
    ? params.siswaId
    : store.siswaList[0]?.id || "";

  const [selectedSiswa, setSelectedSiswa] = useState(initialId);
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: printRef });

  useEffect(() => {
    if (params.siswaId && store.siswaList.some(s => s.id === params.siswaId)) {
      setSelectedSiswa(params.siswaId);
    }
  }, [params.siswaId, store.siswaList]);

  const siswa = store.siswaList.find(s => s.id === selectedSiswa);
  const nilaiIjazah = useMemo(
    () => (selectedSiswa ? calculateNilaiIjazah(selectedSiswa) : {}),
    [selectedSiswa],
  );

  const nilaiArr = useMemo(
    () => MATA_PELAJARAN.map(m => nilaiIjazah[m] || 0),
    [nilaiIjazah],
  );
  const jumlah = nilaiArr.reduce((a, b) => a + b, 0);
  const rataRata = nilaiArr.length > 0 ? jumlah / nilaiArr.length : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="shadow-card no-print">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading font-semibold">Surat Transkrip Nilai</CardTitle>
          <div className="flex items-center gap-3">
            <div className="max-w-xs">
              <label className="text-[10px] font-medium text-foreground block uppercase tracking-wider">
                Peserta Didik
              </label>
              <Select value={selectedSiswa} onValueChange={setSelectedSiswa}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Pilih peserta didik" />
                </SelectTrigger>
                <SelectContent>
                  {store.siswaList.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => handlePrint()} size="sm" className="h-9 self-end" disabled={!siswa}>
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
              className="print-container print-f4-portrait bg-card"
              style={{
                width: "210mm",
                minHeight: "330mm",
                margin: "0 auto",
                padding: "25mm 15mm 20mm 20mm",
                fontFamily: "'Times New Roman', serif",
                fontSize: "11pt",
                lineHeight: 1.5,
              }}
            >
              <KopSekolah judulSurat="SURAT TRANSKRIP NILAI" />

              <div className="space-y-1 mb-4 text-[11pt]">
                <div className="flex">
                  <span className="w-44">Nama</span>
                  <span className="w-4">:</span>
                  <span className="font-bold uppercase">{siswa.nama}</span>
                </div>
                <div className="flex">
                  <span className="w-44">Nomor Peserta</span>
                  <span className="w-4">:</span>
                  <span>{siswa.nomorPeserta}</span>
                </div>
                <div className="flex">
                  <span className="w-44">NISN</span>
                  <span className="w-4">:</span>
                  <span>{siswa.nisn}</span>
                </div>
                <div className="flex">
                  <span className="w-44">NIS</span>
                  <span className="w-4">:</span>
                  <span>{siswa.nis}</span>
                </div>
              </div>

              <table className="w-full border-collapse border border-foreground/40 text-[10pt] mb-4">
                <thead>
                  <tr>
                    <th className="border border-foreground/40 p-1.5 text-center w-10 font-bold">
                      No
                    </th>
                    <th className="border border-foreground/40 p-1.5 text-center font-bold">
                      Mata Pelajaran
                    </th>
                    <th className="border border-foreground/40 p-1.5 text-center w-20 font-bold">
                      Nilai
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={3}
                      className="border border-foreground/40 p-1.5 font-bold bg-muted/40"
                    >
                      Kelompok A
                    </td>
                  </tr>
                  {MATA_PELAJARAN.slice(0, 6).map((mapel, idx) => (
                    <tr key={mapel}>
                      <td className="border border-foreground/40 p-1.5 text-center tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="border border-foreground/40 p-1.5">
                        {MATA_PELAJARAN_FULL[mapel] || mapel}
                      </td>
                      <td className="border border-foreground/40 p-1.5 text-center tabular-nums">
                        {nilaiIjazah[mapel] ? nilaiIjazah[mapel].toFixed(2).replace(".", ",") : ""}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td
                      colSpan={3}
                      className="border border-foreground/40 p-1.5 font-bold bg-muted/40"
                    >
                      Kelompok B
                    </td>
                  </tr>
                  {/* Seni Budaya dan Prakarya */}
                  <tr>
                    <td className="border border-foreground/40 p-1.5 text-center tabular-nums">1</td>
                    <td className="border border-foreground/40 p-1.5">
                      {MATA_PELAJARAN_FULL["SBdP"] || "Seni Budaya dan Prakarya"}
                    </td>
                    <td className="border border-foreground/40 p-1.5 text-center tabular-nums">
                      {nilaiIjazah["SBdP"]
                        ? nilaiIjazah["SBdP"].toFixed(2).replace(".", ",")
                        : ""}
                    </td>
                  </tr>
                  {/* PJOK */}
                  <tr>
                    <td className="border border-foreground/40 p-1.5 text-center tabular-nums">2</td>
                    <td className="border border-foreground/40 p-1.5">
                      {MATA_PELAJARAN_FULL["PJOK"] || "PJOK"}
                    </td>
                    <td className="border border-foreground/40 p-1.5 text-center tabular-nums">
                      {nilaiIjazah["PJOK"]
                        ? nilaiIjazah["PJOK"].toFixed(2).replace(".", ",")
                        : ""}
                    </td>
                  </tr>
                  {/* Muatan Lokal header */}
                  <tr>
                    <td className="border border-foreground/40 p-1.5 text-center tabular-nums">
                      3
                    </td>
                    <td className="border border-foreground/40 p-1.5 font-semibold">
                      Muatan Lokal
                    </td>
                    <td className="border border-foreground/40 p-1.5" />
                  </tr>
                  {/* Muatan Lokal a. Bahasa Sunda */}
                  <tr>
                    <td className="border border-foreground/40 p-1.5 text-center tabular-nums" />
                    <td className="border border-foreground/40 p-1.5 pl-8">
                      a. {MATA_PELAJARAN_FULL["Bahasa Sunda"] || "Bahasa Sunda"}
                    </td>
                    <td className="border border-foreground/40 p-1.5 text-center tabular-nums">
                      {nilaiIjazah["Bahasa Sunda"]
                        ? nilaiIjazah["Bahasa Sunda"].toFixed(2).replace(".", ",")
                        : ""}
                    </td>
                  </tr>
                  {/* Muatan Lokal c. Komputer */}
                  <tr>
                    <td className="border border-foreground/40 p-1.5 text-center tabular-nums" />
                    <td className="border border-foreground/40 p-1.5 pl-8">
                      c. {MATA_PELAJARAN_FULL["Komputer"] || "Komputer"}
                    </td>
                    <td className="border border-foreground/40 p-1.5 text-center tabular-nums">
                      {nilaiIjazah["Komputer"]
                        ? nilaiIjazah["Komputer"].toFixed(2).replace(".", ",")
                        : "-"}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan={2}
                      className="border border-foreground/40 p-1.5 text-center font-bold"
                    >
                      Jumlah Nilai
                    </td>
                    <td className="border border-foreground/40 p-1.5 text-center tabular-nums font-bold">
                      {jumlah.toFixed(2).replace(".", ",")}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan={2}
                      className="border border-foreground/40 p-1.5 text-center font-bold"
                    >
                      Rata-rata
                    </td>
                    <td className="border border-foreground/40 p-1.5 text-center tabular-nums font-bold">
                      {rataRata.toFixed(2).replace(".", ",")}
                    </td>
                  </tr>
                </tbody>
              </table>

              <TandaTanganKepala />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

