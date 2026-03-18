import { useState, useCallback, useEffect } from "react";
import {
  getStore, getNilaiUS, setNilaiUS, MATA_PELAJARAN, calcRT,
  type NilaiMapel,
} from "@/lib/store";
import { exportNilaiToExcel } from "@/lib/exportExcel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, FileDown } from "lucide-react";

export default function NilaiUSPage() {
  const store = getStore();

  const [allNilai, setAllNilai] = useState<Record<string, Record<string, NilaiMapel>>>({});

  useEffect(() => {
    const data: Record<string, Record<string, NilaiMapel>> = {};
    for (const s of store.siswaList) {
      data[s.id] = getNilaiUS(s.id);
    }
    setAllNilai(data);
  }, []);

  const handleChange = (siswaId: string, mapel: string, field: 'ki3' | 'ki4', value: string) => {
    const num = value === "" ? null : Math.min(100, Math.max(0, parseFloat(value) || 0));
    setAllNilai(prev => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        [mapel]: {
          ...(prev[siswaId]?.[mapel] || { ki3: null, ki4: null }),
          [field]: num,
        },
      },
    }));
  };

  const handleBlur = useCallback((siswaId: string) => {
    if (allNilai[siswaId]) {
      setNilaiUS(siswaId, allNilai[siswaId]);
    }
  }, [allNilai]);

  const handleSaveAll = () => {
    for (const s of store.siswaList) {
      if (allNilai[s.id]) {
        setNilaiUS(s.id, allNilai[s.id]);
      }
    }
    toast.success("Nilai US disimpan");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading font-semibold">Nilai Ujian Sekolah</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => { exportNilaiToExcel(); toast.success("File Excel berhasil diunduh"); }} size="sm" variant="outline" className="h-9">
              <FileDown className="mr-2 h-4 w-4" /> Ekspor Excel
            </Button>
            <Button onClick={handleSaveAll} size="sm" className="h-9">
              <Save className="mr-2 h-4 w-4" /> Simpan Semua
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[70vh]">
            <table className="w-full border-collapse text-xs min-w-[1800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th rowSpan={2} className="border border-border px-2 py-1.5 text-center font-semibold bg-muted sticky left-0 z-20 min-w-[40px]">
                    No
                  </th>
                  <th rowSpan={2} className="border border-border px-2 py-1.5 text-left font-semibold bg-muted sticky left-[40px] z-20 min-w-[160px]">
                    Nama
                  </th>
                  {MATA_PELAJARAN.map((mapel) => (
                    <th key={mapel} colSpan={3} className="border border-border px-1 py-1.5 text-center font-semibold bg-primary/10">
                      {mapel}
                    </th>
                  ))}
                </tr>
                <tr className="bg-muted/70">
                  {MATA_PELAJARAN.map((mapel) => (
                    <>
                      <th key={`${mapel}-ki3`} className="border border-border px-1 py-1 text-center font-medium min-w-[52px] text-muted-foreground">KI 3</th>
                      <th key={`${mapel}-ki4`} className="border border-border px-1 py-1 text-center font-medium min-w-[52px] text-muted-foreground">KI 4</th>
                      <th key={`${mapel}-rt`} className="border border-border px-1 py-1 text-center font-medium min-w-[52px] bg-accent/60 text-muted-foreground">RT</th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {store.siswaList.map((siswa, idx) => {
                  const nilaiSiswa = allNilai[siswa.id] || {};
                  return (
                    <tr key={siswa.id} className="hover:bg-primary/5 transition-colors">
                      <td className="border border-border px-2 py-1 text-center tabular-nums bg-card sticky left-0 z-10">{idx + 1}</td>
                      <td className="border border-border px-2 py-1 bg-card sticky left-[40px] z-10 whitespace-nowrap font-medium">{siswa.nama}</td>
                      {MATA_PELAJARAN.map((mapel) => {
                        const nm = nilaiSiswa[mapel] || { ki3: null, ki4: null };
                        const rt = calcRT(nm.ki3, nm.ki4);
                        return (
                          <>
                            <td key={`${siswa.id}-${mapel}-ki3`} className="border border-border p-0">
                              <Input
                                type="number" min={0} max={100}
                                value={nm.ki3 ?? ""}
                                onChange={(e) => handleChange(siswa.id, mapel, 'ki3', e.target.value)}
                                onBlur={() => handleBlur(siswa.id)}
                                className="h-7 w-full border-0 rounded-none text-center tabular-nums text-xs px-1 focus:ring-1 focus:ring-primary/30"
                              />
                            </td>
                            <td key={`${siswa.id}-${mapel}-ki4`} className="border border-border p-0">
                              <Input
                                type="number" min={0} max={100}
                                value={nm.ki4 ?? ""}
                                onChange={(e) => handleChange(siswa.id, mapel, 'ki4', e.target.value)}
                                onBlur={() => handleBlur(siswa.id)}
                                className="h-7 w-full border-0 rounded-none text-center tabular-nums text-xs px-1 focus:ring-1 focus:ring-primary/30"
                              />
                            </td>
                            <td key={`${siswa.id}-${mapel}-rt`} className="border border-border px-1 py-1 text-center tabular-nums bg-accent/30 font-medium">
                              {rt !== null ? rt.toFixed(1) : ""}
                            </td>
                          </>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
