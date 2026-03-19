import { useSekolah, type DataSekolah } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Save, Trash2, KeyRound } from "lucide-react";
import { useState } from "react";

export default function IdentitasKepalaSekolah() {
  const [sekolah, setSekolah] = useSekolah();
  const [form, setForm] = useState(sekolah);
  const [newPassword, setNewPassword] = useState("");

  const handleChange = <K extends keyof DataSekolah>(field: K, value: DataSekolah[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSekolah(form);
    toast.success("Identitas kepala sekolah berhasil disimpan");
  };

  const handleResetData = () => {
    if (confirm("Apakah Anda yakin? Semua data siswa, nilai, dan pengaturan akan dihapus permanen. Pastikan Anda sudah melakukan Backup.")) {
      localStorage.clear();
      toast.success("Seluruh data berhasil dihapus. Mereset aplikasi...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
  };

  const handleChangePassword = () => {
    if (newPassword) {
      localStorage.setItem("admin_password", newPassword);
      toast.success("Password berhasil diubah!");
      setNewPassword("");
    } else {
      toast.error("Silakan masukkan password baru.");
    }
  };

  return (
    <div className="max-w-3xl animate-fade-in space-y-4">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading font-semibold">Identitas Kepala Sekolah</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="h-9">
              <Save className="mr-2 h-4 w-4" /> Simpan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="kepalaSekolah" className="text-sm">Nama Kepala Sekolah</Label>
              <Input
                id="kepalaSekolah"
                value={form.kepalaSekolah}
                onChange={(e) => handleChange("kepalaSekolah", e.target.value)}
                className="h-9 mt-1"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="nipKepalaSekolah" className="text-sm">NIP Kepala Sekolah</Label>
              <Input
                id="nipKepalaSekolah"
                value={form.nipKepalaSekolah}
                onChange={(e) => handleChange("nipKepalaSekolah", e.target.value)}
                className="h-9 mt-1"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Mapel Muatan Lokal</Label>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mulo-sunda" 
                  checked={form.mapelMuloSunda} 
                  onCheckedChange={(checked) => handleChange("mapelMuloSunda", !!checked)}
                />
                <label htmlFor="mulo-sunda" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-0.7">
                  Bahasa Sunda
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mulo-inggris" 
                  checked={form.mapelMuloInggris} 
                  onCheckedChange={(checked) => handleChange("mapelMuloInggris", !!checked)}
                />
                <label htmlFor="mulo-inggris" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-0.7">
                  Bahasa Inggris
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mulo-komputer" 
                  checked={form.mapelMuloKomputer} 
                  onCheckedChange={(checked) => handleChange("mapelMuloKomputer", !!checked)}
                />
                <label htmlFor="mulo-komputer" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-0.7">
                  Komputer
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <Label htmlFor="nomorSurat" className="text-sm">Nomor Surat Lainnya</Label>
              <Input
                id="nomorSurat"
                value={form.nomorSurat}
                onChange={(e) => handleChange("nomorSurat", e.target.value)}
                placeholder="Contoh: 421.2/001/SDNMB01/III/2026"
                className="h-9 mt-1 border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="kota" className="text-sm">Nama Kota</Label>
              <Input
                id="kota"
                value={form.kota}
                onChange={(e) => handleChange("kota", e.target.value)}
                className="h-9 mt-1 border-slate-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-t-4 border-t-slate-800">
        <CardHeader>
          <CardTitle className="text-heading font-bold flex items-center gap-2">
            <KeyRound className="h-5 w-5" /> KEAMANAN AKUN
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <div className="flex gap-2">
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru..."
                  className="h-10 border-slate-200"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleChangePassword();
                    }
                  }}
                />
                <Button onClick={handleChangePassword} variant="secondary">
                  Simpan Password
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 italic">*Password baru ini akan menggantikan password lama di sistem login.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-red-900">Penghapusan Data</h4>
                <p className="text-xs text-red-700">Hapus permanen semua data (siswa, nilai, pengaturan) dari localStorage.</p>
              </div>
              <Button onClick={handleResetData} variant="destructive" className="font-bold shadow-lg shadow-red-100">
                <Trash2 className="mr-2 h-4 w-4" /> Hapus Semua Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
