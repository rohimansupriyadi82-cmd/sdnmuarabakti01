import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { getStore } from "@/lib/store";
import { KopSekolah, TandaTanganKepala } from "@/components/print/KopSekolah";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Printer } from "lucide-react";

export default function SuratKeteranganNISN() {
  const store = getStore();
  const [selectedSiswa, setSelectedSiswa] = useState(store.siswaList[0]?.id || "");
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: printRef });

  const siswa = store.siswaList.find(s => s.id === selectedSiswa);

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="shadow-card no-print">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading font-semibold">Surat Keterangan NISN</CardTitle>
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
                judulSurat="SURAT KETERANGAN NISN"
                nomorSurat="400.3.12.1/041/SD.37/VI/2025"
              />

              <p className="text-justify indent-8 mb-6">
                Yang bertandatangan dibawah ini Kepala {store.sekolah.namaSekolah} menerangkan bahwa :
              </p>

              <div className="space-y-1 mb-6 ml-8 text-[11pt]">
                <div className="flex"><span className="w-48">Nama</span><span className="w-4">:</span><span className="font-bold uppercase">{siswa.nama}</span></div>
                <div className="flex"><span className="w-48">Tempat dan Tanggal Lahir</span><span className="w-4">:</span><span>{siswa.tempatLahir}, {siswa.tanggalLahir}</span></div>
                <div className="flex"><span className="w-48">Jenis Kelamin</span><span className="w-4">:</span><span>{siswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span></div>
                <div className="flex"><span className="w-48">Nomor Induk Siswa</span><span className="w-4">:</span><span>{siswa.nis}</span></div>
                <div className="flex"><span className="w-48">NISN</span><span className="w-4">:</span><span>{siswa.nisn}</span></div>
                <div className="flex"><span className="w-48">Asal Sekolah</span><span className="w-4">:</span><span>{store.sekolah.namaSekolah}</span></div>
                <div className="flex"><span className="w-48">Nama Orang Tua/Wali</span><span className="w-4">:</span><span>{siswa.namaOrtuIjazah}</span></div>
                <div className="flex"><span className="w-48">Alamat</span><span className="w-4">:</span><span>{siswa.alamat}</span></div>
              </div>

              <p className="text-justify indent-8 mb-4">
                Adalah benar nama tersebut di atas berasal dari {store.sekolah.namaSekolah} Tahun
                Pelajaran 2024/2025 dan berdasarkan catatan pada kami, peserta didik tersebut telah
                mempunyai Nomor Induk Siswa Nasional (NISN) hasil Verfikasi dan Validasi (VERVAL PD)
                di PDSP yaitu :
              </p>

              <div className="flex justify-center my-6">
                <div style={{ border: "2px solid #333", background: "#bcd0ee", padding: "8mm 14mm", textAlign: "center", width: "150mm" }}>
                  <p className="text-[28pt] font-bold tabular-nums tracking-widest">{siswa.nisn}</p>
                </div>
              </div>

              <p className="text-justify indent-8 mb-4">
                Demikian surat keterangan ini dibuat untuk dipergunakan sebagai bahan persyaratan
                mengikuti seleksi Penerimaan Peserta Didik Baru (PPDB) pada sekolah lanjutan
              </p>

              <TandaTanganKepala />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
