import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { getStore } from "@/lib/store";
import { KopSekolah, TandaTanganKepala } from "@/components/print/KopSekolah";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Printer } from "lucide-react";
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
      JsBarcode(barcodeRef.current, siswa.nisn || siswa.nama, {
        format: "CODE128",
        width: 1.5,
        height: 40,
        displayValue: true,
        fontSize: 10,
        margin: 0
      });
    }
  }, [siswa]);

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
                nomorSurat={store.sekolah.noSuratNISN}
              />

              <p className="text-justify indent-8 mb-6">
                Yang bertandatangan dibawah ini Kepala {store.sekolah.namaSekolah} menerangkan bahwa :
              </p>

              <div className="space-y-1 mb-6 ml-8 text-[11pt]">
                <div className="flex"><span className="w-48">Nama</span><span className="w-4">:</span><span className="font-bold uppercase">{siswa.nama}</span></div>
                <div className="flex"><span className="w-48">Tempat dan Tanggal Lahir</span><span className="w-4">:</span><span>{siswa.tempatLahir}, {siswa.tanggalLahir}</span></div>
                <div className="flex"><span className="w-48">Jenis Kelamin</span><span className="w-4">:</span><span>{siswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span></div>
                <div className="flex"><span className="w-48">Nama Orang Tua</span><span className="w-4">:</span><span>{siswa.namaOrtuIjazah || siswa.namaAyah}</span></div>
                <div className="flex"><span className="w-48">NISN</span><span className="w-4">:</span><span className="font-bold">{siswa.nisn}</span></div>
              </div>

              <p className="text-justify indent-8 mb-4">
                Demikian surat keterangan ini dibuat untuk dipergunakan sebagai bahan persyaratan
                mengikuti seleksi Penerimaan Peserta Didik Baru (PPDB) pada sekolah lanjutan
              </p>

              <div className="flex justify-between items-end mt-12">
                <div className="barcode-container">
                  <svg ref={barcodeRef}></svg>
                </div>
                <TandaTanganKepala tanggal={store.sekolah.tglSuratNISN} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
