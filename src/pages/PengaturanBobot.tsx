import { useState } from "react";
import { useBobot, getStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function PengaturanBobot() {
  const [bobot, setBobot] = useBobot();
  const store = getStore();
  const [raport, setRaport] = useState(String(bobot.raport * 100));
  const [us, setUs] = useState(String(bobot.us * 100));
  const [ki3, setKi3] = useState(String(bobot.ki3 * 100));
  const [ki4, setKi4] = useState(String(bobot.ki4 * 100));

  // Progress calculations
  const totalSiswa = store.siswaList.length;
  const dataSiswaProgress = totalSiswa > 0 ? Math.round((totalSiswa / 500) * 100) : 0;
  // Placeholder for penentuan lulus - 100% if bobot is configured
  const penentuanLulusProgress = (bobot.raport > 0 && bobot.us > 0) ? 100 : 0;

  const handleSave = () => {
    const r = parseFloat(raport);
    const u = parseFloat(us);
    const k3 = parseFloat(ki3);
    const k4 = parseFloat(ki4);

    if (isNaN(r) || isNaN(u) || r + u !== 100) {
      toast.error("Total bobot Raport + US harus 100%");
      return;
    }
    if (isNaN(k3) || isNaN(k4) || k3 + k4 !== 100) {
      toast.error("Total bobot KI 3 + KI 4 harus 100%");
      return;
    }
    setBobot({ raport: r / 100, us: u / 100, ki3: k3 / 100, ki4: k4 / 100 });
    toast.success("Bobot nilai berhasil disimpan");
  };

  return (
    <div className="max-w-lg space-y-4 animate-fade-in">
      {/* Progress Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-heading font-semibold">Prosentase Progres Kerja</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Data Siswa:</span>
              <span className="tabular-nums font-semibold text-foreground">{dataSiswaProgress}%</span>
            </div>
            <Progress
              value={dataSiswaProgress}
              className="h-5"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Penentuan Lulus:</span>
              <span className="tabular-nums font-semibold text-foreground">{penentuanLulusProgress}%</span>
            </div>
            <Progress
              value={penentuanLulusProgress}
              className="h-5"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bobot Card */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading font-semibold">Pengaturan Bobot Nilai</CardTitle>
          <Button onClick={handleSave} size="sm" className="h-9">
            <Save className="mr-2 h-4 w-4" /> Simpan
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Label htmlFor="raport" className="w-48 text-sm font-semibold text-right">Nilai Raport:</Label>
              <Input id="raport" type="number" min="0" max="100" value={raport} onChange={(e) => setRaport(e.target.value)} className="h-9 w-24 tabular-nums text-center" />
              <span className="text-sm font-medium text-muted-foreground">%</span>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="us" className="w-48 text-sm font-semibold text-right">Nilai Ujian Sekolah:</Label>
              <Input id="us" type="number" min="0" max="100" value={us} onChange={(e) => setUs(e.target.value)} className="h-9 w-24 tabular-nums text-center" />
              <span className="text-sm font-medium text-muted-foreground">%</span>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="ki3" className="w-48 text-sm text-right text-muted-foreground">Nilai Pengetahuan (KI 3):</Label>
              <Input id="ki3" type="number" min="0" max="100" value={ki3} onChange={(e) => setKi3(e.target.value)} className="h-9 w-24 tabular-nums text-center" />
              <span className="text-sm font-medium text-muted-foreground">%</span>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="ki4" className="w-48 text-sm text-right text-muted-foreground">Nilai Keterampilan (KI 4):</Label>
              <Input id="ki4" type="number" min="0" max="100" value={ki4} onChange={(e) => setKi4(e.target.value)} className="h-9 w-24 tabular-nums text-center" />
              <span className="text-sm font-medium text-muted-foreground">%</span>
            </div>
          </div>

          <div className="p-3 rounded-md bg-muted space-y-1">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Formula RT:</strong> (KI 3 × {ki3}%) + (KI 4 × {ki4}%)
            </p>
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Formula Ijazah:</strong> (Rata-rata Raport × {raport}%) + (Nilai US × {us}%)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
