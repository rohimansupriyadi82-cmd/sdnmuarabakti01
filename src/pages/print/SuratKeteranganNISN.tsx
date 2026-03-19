import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { getStore } from "@/lib/store";
import { KopSekolah, TandaTanganKepala } from "@/components/print/KopSekolah";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Printer, ChevronLeft } from "lucide-react";
import JsBarcode from "jsbarcode";

export default function SuratKeteranganNISN() {
  const store = getStore();
  const [selectedSiswa, setSelectedSiswa] = useState(store.siswaList[0]?.id || "");
  const printRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);
  const handlePrint = useReactToPrint({ contentRef: printRef });

  const siswa = store.siswaList.find(s => s.id === selectedSiswa);

  useEffect(() => {
    if (siswa && barcodeRef.current) {
      JsBarcode(barcodeRef.current, siswa.nisn, {
        format: "CODE128",
        width: 1.5,
        height: 40,
        displayValue: true,
        fontSize: 12,
        margin: 0
      });
    }
  }, [siswa]);

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="shadow-card no-print">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="h-9 w-9 p-0">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-heading font-semibold">Surat Keterangan NISN</CardTitle>
          </div>
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
                fontSize: "12pt",
                lineHeight: 1.5,
                color: "black",
                background: "white",
              }}
            >
              <KopSekolah
                judulSurat={
                  <div className="text-center">
                    <span className="font-bold underline text-[14pt]">SURAT KETERANGAN NISN</span>
                    <div className="font-normal text-[12pt] mt-1">Nomor : {store.sekolah.noSuratNISN}</div>
                  </div>
                }
                hideDefaultJudul
              />

              <p className="text-justify mb-6 mt-8">
                Yang bertandatangan dibawah ini Kepala SDN MUARA BAKTI 01 menerangkan bahwa :
              </p>

              <div className="space-y-1 mb-6 ml-4 text-[12pt]">
                <div className="flex"><span className="w-56">Nama</span><span className="w-4">:</span><span className="font-bold uppercase">{siswa.nama}</span></div>
                <div className="flex"><span className="w-56">Tempat dan Tanggal Lahir</span><span className="w-4">:</span><span>{siswa.tempatLahir}, {siswa.tanggalLahir}</span></div>
                <div className="flex"><span className="w-56">Jenis Kelamin</span><span className="w-4">:</span><span>{siswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span></div>
                <div className="flex"><span className="w-56">Nomor Induk Siswa</span><span className="w-4">:</span><span>{siswa.nis}</span></div>
                <div className="flex"><span className="w-56">NISN</span><span className="w-4">:</span><span className="font-bold">{siswa.nisn}</span></div>
                <div className="flex"><span className="w-56">Asal Sekolah</span><span className="w-4">:</span><span>SDN MUARA BAKTI 01</span></div>
                <div className="flex"><span className="w-56">Nama Orang Tua/Wali</span><span className="w-4">:</span><span>{siswa.namaOrtuIjazah || siswa.namaAyah}</span></div>
                <div className="flex"><span className="w-56">Alamat</span><span className="w-4">:</span><span>{siswa.alamat}</span></div>
              </div>

              <p className="text-justify indent-12 mb-6">
                Adalah benar nama tersebut di atas berasal dari SDN MUARA BAKTI 01 Tahun Pelajaran 2024/2025 dan berdasarkan catatan pada kami, peserta didik tersebut telah mempunyai Nomor Induk Siswa Nasional (NISN) hasil Verfikasi dan Validasi (VERVAL PD) di PDSP yaitu :
              </p>

              <div className="my-8 py-6 px-8 bg-[#e3f2fd] text-center rounded-none border border-blue-200">
                <span className="text-5xl font-bold text-black">{siswa.nisn}</span>
              </div>

              <p className="text-justify indent-12 mb-12">
                Demikian surat keterangan ini dibuat untuk dipergunakan sebagai bahan persyaratan mengikuti seleksi Penerimaan Peserta Didik Baru (PPDB) pada sekolah lanjutan
              </p>

              <div className="flex justify-between items-end mt-16 px-4">
                <div className="barcode-container">
                  <svg ref={barcodeRef}></svg>
                </div>
                <div className="signature-container">
                  <TandaTanganKepala tanggal={store.sekolah.tanggalSurat} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
