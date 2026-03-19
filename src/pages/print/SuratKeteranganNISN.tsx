import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { getStore, useSekolah } from "@/lib/store";
import { TandaTanganKepala } from "@/components/print/KopSekolah";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Printer, ChevronLeft } from "lucide-react";
import logoBekasi from "@/assets/logo-bekasi.png";

export default function SuratKeteranganNISN() {
  const store = getStore();
  const [selectedSiswa, setSelectedSiswa] = useState(store.siswaList[0]?.id || "");
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const siswa = store.siswaList.find((s) => s.id === selectedSiswa);

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="shadow-card no-print">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-heading font-semibold">
              Surat Keterangan NISN
            </CardTitle>
          </div>
          <Button
            onClick={() => handlePrint()}
            size="sm"
            className="h-9"
            disabled={!siswa}
          >
            <Printer className="mr-2 h-4 w-4" /> Cetak
          </Button>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <label className="text-sm font-medium text-foreground mb-1 block">
              Peserta Didik
            </label>
            <Select value={selectedSiswa} onValueChange={setSelectedSiswa}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Pilih peserta didik" />
              </SelectTrigger>
              <SelectContent>
                {store.siswaList.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nama}
                  </SelectItem>
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
                padding: "20mm 15mm 20mm 20mm",
                fontFamily: "'Times New Roman', serif",
                fontSize: "12pt",
                lineHeight: 1.5,
                color: "black",
                background: "white",
              }}
            >
              {/* Kop Surat Manual untuk memastikan kerapihan */}
              <div className="flex items-center border-b-[3px] border-black pb-1">
                <img
                  src={store.sekolah.logoDataUrl || logoBekasi}
                  alt="Logo"
                  className="w-[22mm] h-[22mm] object-contain"
                />
                <div className="flex-1 text-center">
                  <div className="text-[12pt] font-bold uppercase leading-tight">
                    PEMERINTAH KABUPATEN {store.sekolah.kabupaten.toUpperCase()}
                  </div>
                  <div className="text-[12pt] font-bold uppercase leading-tight">
                    DINAS PENDIDIKAN
                  </div>
                  <div className="text-[16pt] font-extrabold uppercase leading-tight tracking-wider">
                    {store.sekolah.namaSekolah}
                  </div>
                  <div className="text-[10pt] italic leading-tight">
                    {store.sekolah.alamatSekolah} {store.sekolah.kelurahan},{" "}
                    Kec. {store.sekolah.kecamatan}, {store.sekolah.kabupaten},{" "}
                    {store.sekolah.provinsi} {store.sekolah.kodePos}
                  </div>
                  {store.sekolah.email && (
                    <div className="text-[10pt] leading-tight">
                      Email:{" "}
                      <span className="underline text-blue-700">
                        {store.sekolah.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-b border-black mt-[1px] mb-6" />

              <div className="text-center mb-8">
                <h3 className="text-[14pt] font-bold underline leading-none uppercase">
                  SURAT KETERANGAN NISN
                </h3>
                <p className="text-[12pt] mt-1">
                  Nomor : {store.sekolah.noSuratNISN}
                </p>
              </div>

              <p className="text-justify mb-6">
                Yang bertandatangan dibawah ini Kepala SDN MUARA BAKTI 01
                menerangkan bahwa :
              </p>

              <table
                className="mb-6 ml-4 w-full"
                style={{ borderCollapse: "collapse" }}
              >
                <tbody>
                  <tr>
                    <td className="w-56 py-0.5">Nama</td>
                    <td className="w-4 py-0.5">:</td>
                    <td className="font-bold uppercase py-0.5">{siswa.nama}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5">Tempat dan Tanggal Lahir</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">
                      {siswa.tempatLahir}, {siswa.tanggalLahir}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-0.5">Jenis Kelamin</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">
                      {siswa.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-0.5">Nomor Induk Siswa</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{siswa.nis}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5">NISN</td>
                    <td className="py-0.5">:</td>
                    <td className="font-bold py-0.5">{siswa.nisn}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5">Asal Sekolah</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">SDN MUARA BAKTI 01</td>
                  </tr>
                  <tr>
                    <td className="py-0.5">Nama Orang Tua/Wali</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">
                      {siswa.namaOrtuIjazah || siswa.namaAyah}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-0.5">Alamat</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{siswa.alamat}</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-justify indent-12 mb-6">
                Adalah benar nama tersebut di atas berasal dari SDN MUARA BAKTI
                01 Tahun Pelajaran {store.sekolah.tahunPelajaran} dan berdasarkan catatan pada kami,
                peserta didik tersebut telah mempunyai Nomor Induk Siswa
                Nasional (NISN) hasil Verfikasi dan Validasi (VERVAL PD) di PDSP
                yaitu :
              </p>

              <div
                className="my-8 py-6 px-8 text-center"
                style={{
                  backgroundColor: "#e3f2fd",
                  border: "2px solid #2196f3",
                }}
              >
                <span className="text-6xl font-black text-black tracking-widest">
                  {siswa.nisn}
                </span>
              </div>

              <p className="text-justify indent-12 mb-12">
                Demikian surat keterangan ini dibuat untuk dipergunakan sebagai
                bahan persyaratan mengikuti seleimaan Peserta Didik Baru (PPDB)
                pada sekolah lanjutan
              </p>

              <div className="flex justify-between items-end mt-16 px-4">
                <div className="barcode-container">
                  {/* Ruang kosong pengganti Barcode sesuai instruksi */}
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
