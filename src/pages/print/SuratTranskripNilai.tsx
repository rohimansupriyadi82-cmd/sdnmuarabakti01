import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { getStore, calculateNilaiIjazah, MATA_PELAJARAN_FULL } from "@/lib/store";
import { TandaTanganKepala } from "@/components/print/KopSekolah";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutDashboard, Printer } from "lucide-react";

export default function SuratTranskripNilai() {
  const store = getStore();
  const navigate = useNavigate();
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

  const nilaiKurmer = useMemo(() => {
    const get = (k: string) => (typeof nilaiIjazah[k] === "number" ? (nilaiIjazah[k] as number) : 0);
    const ipa = get("IPA");
    const ips = get("IPS");
    const ipas = ipa || ips ? (ipa + ips) / (ipa && ips ? 2 : 1) : 0;

    const rows = [
      { no: 1, label: "Pendidikan Agama", value: get("Agama") },
      { no: 2, label: "Pendidikan Pancasila", value: get("PKn") },
      { no: 3, label: "Bahasa Indonesia", value: get("B Indo") },
      { no: 4, label: "Matematika", value: get("MTK") },
      { no: 5, label: "IPAS", value: ipas },
      { no: 6, label: "Seni Budaya", value: get("SBdP") },
      { no: 7, label: "PJOK", value: get("PJOK") },
      { no: 8, label: "Bahasa Sunda", value: get("Bahasa Sunda") },
      { no: 9, label: "Bahasa Inggris", value: get("Inggris") },
      { no: 10, label: "Komputer", value: get("Komputer") },
    ];

    const total = rows.reduce((a, b) => a + (b.value || 0), 0);
    const avg = rows.length > 0 ? total / rows.length : 0;
    return { rows, total, avg };
  }, [nilaiIjazah]);

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
              <div className="text-center border-b-[3px] border-black pb-2 mb-5">
                <div className="text-[14pt] font-black uppercase leading-tight">
                  SD NEGERI MUARA BAKTI
                </div>
                <div className="text-[11pt] leading-snug">
                  Kecamatan {store.sekolah.kecamatan}, {store.sekolah.alamatSekolah}
                </div>
                <div className="text-[11pt] leading-snug">
                  Email: {store.sekolah.email}
                </div>
              </div>

              <div className="text-center mb-5">
                <div className="text-[13pt] font-bold underline uppercase">SURAT TRANSKRIP NILAI</div>
                <div className="text-[11pt] mt-1">Nomor: {store.sekolah.noSuratTranskrip}</div>
              </div>

              <div className="space-y-1 mb-5 text-[11pt]">
                <div className="flex">
                  <span className="w-56">Nama Peserta Didik</span>
                  <span className="w-4">:</span>
                  <span className="font-bold uppercase">{siswa.nama}</span>
                </div>
                <div className="flex">
                  <span className="w-56">Tempat dan Tanggal Lahir</span>
                  <span className="w-4">:</span>
                  <span>
                    {siswa.tempatLahir}, {siswa.tanggalLahir}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-56">Nama Orang Tua/Wali</span>
                  <span className="w-4">:</span>
                  <span className="uppercase">{siswa.namaOrtuIjazah || siswa.namaAyah}</span>
                </div>
                <div className="flex">
                  <span className="w-56">Nomor Induk Siswa (NIS)</span>
                  <span className="w-4">:</span>
                  <span>{siswa.nis}</span>
                </div>
                <div className="flex">
                  <span className="w-56">Nomor Induk Siswa Nasional (NISN)</span>
                  <span className="w-4">:</span>
                  <span>{siswa.nisn}</span>
                </div>
                <div className="flex">
                  <span className="w-56">Nomor Peserta Ujian/Asesmen</span>
                  <span className="w-4">:</span>
                  <span>{siswa.nomorPeserta}</span>
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
                  {nilaiKurmer.rows.map((r) => (
                    <tr key={r.no}>
                      <td className="border border-foreground/40 p-1.5 text-center tabular-nums">
                        {r.no}
                      </td>
                      <td className="border border-foreground/40 p-1.5">
                        {r.label === "Seni Budaya"
                          ? (MATA_PELAJARAN_FULL["SBdP"] || "Seni Budaya")
                          : r.label}
                      </td>
                      <td className="border border-foreground/40 p-1.5 text-center tabular-nums">
                        {r.value ? r.value.toFixed(2).replace(".", ",") : "-"}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td
                      colSpan={2}
                      className="border border-foreground/40 p-1.5 text-center font-bold"
                    >
                      Jumlah Nilai
                    </td>
                    <td className="border border-foreground/40 p-1.5 text-center tabular-nums font-bold">
                      {nilaiKurmer.total.toFixed(2).replace(".", ",")}
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
                      {nilaiKurmer.avg.toFixed(2).replace(".", ",")}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-[11pt] text-justify indent-8 mb-6">
                Berdasarkan kriteria kelulusan Fase C dan penyelesaian Projek Penguatan Profil Pelajar
                Pancasila (P5)
              </div>

              <TandaTanganKepala />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="no-print fixed bottom-6 right-6 z-50">
        <Button onClick={() => navigate("/dashboard")} className="h-11 rounded-xl shadow-xl">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Kembali ke Dashboard
        </Button>
      </div>
    </div>
  );
}
