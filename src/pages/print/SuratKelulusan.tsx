import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { getStore, calculateNilaiIjazah, MATA_PELAJARAN, MATA_PELAJARAN_FULL } from "@/lib/store";
import { KopSekolah, TandaTanganKepala } from "@/components/print/KopSekolah";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Printer } from "lucide-react";

export default function SuratKelulusan() {
  const store = getStore();
  const [selectedSiswa, setSelectedSiswa] = useState(store.siswaList[0]?.id || "");
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: printRef });

  const siswa = store.siswaList.find(s => s.id === selectedSiswa);
  const nilaiIjazah = selectedSiswa ? calculateNilaiIjazah(selectedSiswa) : {};

  const nilaiArr = MATA_PELAJARAN.map(m => nilaiIjazah[m] || 0);
  const jumlah = nilaiArr.reduce((a, b) => a + b, 0);
  const rataRata = nilaiArr.length > 0 ? jumlah / nilaiArr.length : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="shadow-card no-print">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading font-semibold">Surat Keterangan Kelulusan</CardTitle>
          <Button onClick={() => handlePrint()} size="sm" className="h-9" disabled={!siswa}>
            <Printer className="mr-2 h-4 w-4" /> Cetak
          </Button>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <label className="text-sm font-medium text-foreground mb-1 block">Peserta Didik</label>
            <Select value={selectedSiswa} onValueChange={setSelectedSiswa}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Pilih peserta didik" /></SelectTrigger>
              <SelectContent>
                {store.siswaList.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
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
                color: "black",
                background: "white",
              }}
            >
              <KopSekolah
                judulSurat="SURAT KETERANGAN KELULUSAN KELAS VI"
                nomorSurat={store.sekolah.noSuratLulus}
              />

              <p className="text-justify mb-4 indent-8">
                Sehubungan telah dilaksanakannya Ujian Satuan Pendidikan (USP) bagi putra-putri Bapak / Ibu,
                dan Berdasarkan hasil nilai Ujian Satuan Pendidikan (USP) yang diperolehnya, maka dengan ini
                kami menetapkan nilai sebagai berikut :
              </p>

              <div className="space-y-1 mb-4 text-[11pt]">
                <div className="flex"><span className="w-44">N a m a</span><span className="w-4">:</span><span className="font-bold uppercase">{siswa.nama}</span></div>
                <div className="flex"><span className="w-44">Nomer Perserta Ujian</span><span className="w-4">:</span><span>{siswa.nomorPeserta?.split('-').slice(3).join('-') || '-'}</span></div>
                <div className="flex"><span className="w-44">Tempat, Tanggal Lahir</span><span className="w-4">:</span><span>{siswa.tempatLahir}, {siswa.tanggalLahir}</span></div>
                <div className="flex"><span className="w-44">No Induk</span><span className="w-4">:</span><span>{siswa.nis}</span></div>
                <div className="flex"><span className="w-44">NISN</span><span className="w-4">:</span><span>{siswa.nisn}</span></div>
              </div>

              <p className="font-bold mb-2">Hasil Nilai Kelulusan</p>
              <table className="w-full border-collapse text-[10pt] mb-4" style={{ border: "1px solid black" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid black", padding: "2mm 1.5mm", textAlign: "center", width: "10mm", fontWeight: 700, background: "#d9d9d9" }}>No</th>
                    <th style={{ border: "1px solid black", padding: "2mm 1.5mm", textAlign: "center", fontWeight: 700, background: "#d9d9d9" }}>Mata Pelajaran</th>
                    <th style={{ border: "1px solid black", padding: "2mm 1.5mm", textAlign: "center", width: "22mm", fontWeight: 700, background: "#d9d9d9" }}>Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {MATA_PELAJARAN.map((mapel, i) => (
                    <tr key={mapel}>
                      <td style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center" }} className="tabular-nums">{i + 1}</td>
                      <td style={{ border: "1px solid black", padding: "1.5mm" }}>
                        {i >= 8 ? `${String.fromCharCode(97 + i - 8)}. ${MATA_PELAJARAN_FULL[mapel] || mapel}` : (MATA_PELAJARAN_FULL[mapel] || mapel)}
                      </td>
                      <td style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center" }} className="tabular-nums">
                        {nilaiIjazah[mapel] ? nilaiIjazah[mapel].toFixed(2).replace('.', ',') : ''}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2} style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700 }}>Jumlah Nilai</td>
                    <td style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700 }} className="tabular-nums">{jumlah.toFixed(2).replace('.', ',')}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700 }}>Rata-rata</td>
                    <td style={{ border: "1px solid black", padding: "1.5mm", textAlign: "center", fontWeight: 700 }} className="tabular-nums">{rataRata.toFixed(2).replace('.', ',')}</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-center font-bold text-[14pt] mb-4">
                LULUS / <span className="line-through">TIDAK LULUS</span>
              </p>
              <p className="text-center mb-6">dan berhak untuk melanjutkan ke jenjang berikutnya</p>

              <p className="text-justify indent-8 mb-2">
                Demikian pemberitahuan kelulusan dari kami, kepada yang lulus, kami ucapkan
                <strong className="underline"> Selamat </strong> dan kami haturkan terimakasih
              </p>

              <TandaTanganKepala />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
