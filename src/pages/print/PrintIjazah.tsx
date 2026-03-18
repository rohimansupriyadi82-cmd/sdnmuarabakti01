import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { getStore, calculateNilaiIjazah, MATA_PELAJARAN, MATA_PELAJARAN_FULL } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Printer } from "lucide-react";

export default function PrintIjazah() {
  const store = getStore();
  const [selectedSiswa, setSelectedSiswa] = useState(store.siswaList[0]?.id || "");
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({ contentRef: printRef });

  const siswa = store.siswaList.find(s => s.id === selectedSiswa);
  const nilaiIjazah = selectedSiswa ? calculateNilaiIjazah(selectedSiswa) : {};

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="shadow-card no-print">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading font-semibold">Print Ijazah</CardTitle>
          <Button onClick={() => handlePrint()} size="sm" className="h-9" disabled={!siswa}>
            <Printer className="mr-2 h-4 w-4" /> Cetak
          </Button>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <label className="text-sm font-medium text-foreground mb-1 block">Peserta Didik</label>
            <Select value={selectedSiswa} onValueChange={setSelectedSiswa}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Pilih peserta didik" />
              </SelectTrigger>
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
            <div ref={printRef} className="print-container print-f4-portrait bg-card" style={{ padding: '30px 40px', fontFamily: "'Times New Roman', serif", fontSize: '11pt', lineHeight: '1.5' }}>
              <div className="text-center mb-8">
                <p className="text-sm uppercase tracking-widest text-muted-foreground">Kementerian Pendidikan dan Kebudayaan</p>
                <h1 className="text-xl font-bold uppercase mt-2 text-foreground">Ijazah Sekolah Dasar</h1>
                <p className="text-sm text-muted-foreground mt-1">{store.sekolah.namaSekolah}</p>
              </div>

              <div className="space-y-1 mb-6 text-sm">
                <div className="flex"><span className="w-40">Nama Peserta Didik</span><span>: {siswa.nama}</span></div>
                <div className="flex"><span className="w-40">NISN</span><span>: {siswa.nisn}</span></div>
                <div className="flex"><span className="w-40">Nomor Peserta</span><span>: {siswa.nomorPeserta}</span></div>
                <div className="flex"><span className="w-40">Tempat, Tanggal Lahir</span><span>: {siswa.tempatLahir}, {siswa.tanggalLahir}</span></div>
                <div className="flex"><span className="w-40">Nama Orang Tua</span><span>: {siswa.namaOrtuIjazah}</span></div>
              </div>

              <table className="w-full border-collapse border border-foreground/30 text-sm mb-6">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="border border-foreground/30 p-2 text-left w-10">No</th>
                    <th className="border border-foreground/30 p-2 text-left">Mata Pelajaran</th>
                    <th className="border border-foreground/30 p-2 text-center w-24">Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {MATA_PELAJARAN.map((mapel, i) => (
                    <tr key={mapel}>
                      <td className="border border-foreground/30 p-2 tabular-nums">{i + 1}</td>
                      <td className="border border-foreground/30 p-2">{MATA_PELAJARAN_FULL[mapel] || mapel}</td>
                      <td className="border border-foreground/30 p-2 text-center tabular-nums font-medium">
                        {nilaiIjazah[mapel]?.toFixed(2) || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mt-12">
                <div className="text-center text-sm">
                  <p>{store.sekolah.kabupaten}, {store.sekolah.tglIjazah ? new Date(store.sekolah.tglIjazah).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'}) : '.................... 2026'}</p>
                  <p className="mt-1">Kepala Sekolah</p>
                  <div className="h-16" />
                  <p className="font-medium underline">{store.sekolah.kepalaSekolah}</p>
                  <p>NIP. {store.sekolah.nipKepalaSekolah}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
