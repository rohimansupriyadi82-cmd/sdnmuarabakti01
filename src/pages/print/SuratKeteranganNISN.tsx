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
              <div className="text-center">
                <h3 className="text-[14pt] font-bold underline">SURAT KETERANGAN NISN</h3>
                <p className="text-[12pt]">Nomor : {store.sekolah.noSuratNISN}</p>
              </div>

              <p className="text-justify mb-6 mt-8">
                Yang bertandatangan dibawah ini Kepala SDN MUARA BAKTI 01 menerangkan bahwa :
              </p>

              <table className="mb-6 ml-4 text-[12pt]" style={{ borderSpacing: '0 4px' }}>
                <tbody>
                  <tr><td className="w-56">Nama</td><td className="w-4">:</td><td className="font-bold uppercase">{siswa.nama}</td></tr>
                  <tr><td>Tempat dan Tanggal Lahir</td><td>:</td><td>{siswa.tempatLahir}, {siswa.tanggalLahir}</td></tr>
                  <tr><td>Jenis Kelamin</td><td>:</td><td>{siswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td></tr>
                  <tr><td>Nomor Induk Siswa</td><td>:</td><td>{siswa.nis}</td></tr>
                  <tr><td>NISN</td><td>:</td><td className="font-bold">{siswa.nisn}</td></tr>
                  <tr><td>Asal Sekolah</td><td>:</td><td>SDN MUARA BAKTI 01</td></tr>
                  <tr><td>Nama Orang Tua/Wali</td><td>:</td><td>{siswa.namaOrtuIjazah || siswa.namaAyah}</td></tr>
                  <tr><td>Alamat</td><td>:</td><td>{siswa.alamat}</td></tr>
                </tbody>
              </table>

              <p className="text-justify indent-12 mb-6">
                Adalah benar nama tersebut di atas berasal dari SDN MUARA BAKTI 01 Tahun Pelajaran 2024/2025 dan berdasarkan catatan pada kami, peserta didik tersebut telah mempunyai Nomor Induk Siswa Nasional (NISN) hasil Verfikasi dan Validasi (VERVAL PD) di PDSP yaitu :
              </p>

              <div className="my-8 py-6 px-8 text-center rounded-none" style={{ backgroundColor: '#e3f2fd', border: '1px solid #2196f3' }}>
                <span className="text-5xl font-bold text-black">{siswa.nisn}</span>
              </div>

              <p className="text-justify indent-12 mb-12">
                Demikian surat keterangan ini dibuat untuk dipergunakan sebagai bahan persyaratan mengikuti seleksi Penerimaan Peserta Didik Baru (PPDB) pada sekolah lanjutan
              </p>

              <div className="flex justify-between items-end mt-16">
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
