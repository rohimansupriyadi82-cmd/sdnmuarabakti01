import { useSekolah, type DataSekolah } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Upload, KeyRound, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function Settings() {
  const [sekolah, setSekolah] = useSekolah();
  const [form, setForm] = useState(sekolah);
  const [newPassword, setNewPassword] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = <K extends keyof DataSekolah>(field: K, value: DataSekolah[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoPick = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File logo harus berupa gambar");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setForm((prev) => ({ ...prev, logoDataUrl: dataUrl }));
      toast.success("Logo berhasil dimuat. Klik Simpan untuk menerapkan.");
    };
    reader.readAsDataURL(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemoveLogo = () => {
    setForm((prev) => ({ ...prev, logoDataUrl: null }));
  };

  const handleSave = () => {
    setSekolah(form);
    toast.success("Pengaturan berhasil disimpan");
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

  const handleResetData = () => {
    if (window.confirm("⚠️ APAKAH ANDA YAKIN? Semua data (siswa, nilai, pengaturan) akan dihapus permanen. Pastikan Anda sudah melakukan Backup.")) {
      if (window.confirm("KONFIRMASI TERAKHIR: Anda benar-benar ingin menghapus seluruh data aplikasi? Tindakan ini tidak dapat dibatalkan.")) {
        localStorage.clear();
        toast.success("Seluruh data berhasil dihapus. Mereset aplikasi...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    }
  };

  type SettingsFieldKey =
    | "namaSekolah"
    | "npsn"
    | "status"
    | "alamatSekolah"
    | "kelurahan"
    | "kecamatan"
    | "kabupaten"
    | "kodePos"
    | "provinsi"
    | "email"
    | "tahunPelajaran"
    | "kepalaSekolah"
    | "nipKepalaSekolah";

  const fields = useMemo(
    (): { key: SettingsFieldKey; label: string }[] => [
      { key: "namaSekolah", label: "Nama Sekolah" },
      { key: "npsn", label: "NPSN" },
      { key: "status", label: "Status" },
      { key: "alamatSekolah", label: "Alamat" },
      { key: "kelurahan", label: "Desa/Kelurahan" },
      { key: "kecamatan", label: "Kecamatan" },
      { key: "kabupaten", label: "Kabupaten/Kota" },
      { key: "kodePos", label: "Kode Pos" },
      { key: "provinsi", label: "Provinsi" },
      { key: "email", label: "Email" },
      { key: "tahunPelajaran", label: "Tahun Pelajaran" },
      { key: "kepalaSekolah", label: "Nama Kepala Sekolah" },
      { key: "nipKepalaSekolah", label: "NIP Kepala Sekolah" },
    ],
    [],
  );

  return (
    <div className="max-w-2xl animate-fade-in space-y-4">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading font-semibold">Pengaturan Sekolah</CardTitle>
          <Button onClick={handleSave} size="sm" className="h-9">
            <Save className="mr-2 h-4 w-4" /> Simpan
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm">Logo Sekolah</Label>
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-md border bg-muted/30 flex items-center justify-center overflow-hidden">
                {form.logoDataUrl ? (
                  <img
                    src={form.logoDataUrl}
                    alt="Logo Sekolah"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground text-center px-2">Belum ada logo</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload Logo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9"
                    onClick={handleRemoveLogo}
                    disabled={!form.logoDataUrl}
                  >
                    Hapus
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Disarankan PNG/JPG rasio 1:1. Logo akan dipakai di semua surat.
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleLogoPick(e.target.files?.[0])}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ key, label }) => (
              <div key={key} className={key === "alamatSekolah" ? "sm:col-span-2" : ""}>
                <Label htmlFor={key} className="text-sm">
                  {label}
                </Label>
                <Input
                  id={key}
                  value={form[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="h-9 mt-1"
                />
              </div>
            ))}
            <div className="space-y-1">
              <Label className="text-sm">Tgl. Surat (Global)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-9 mt-1 border-slate-200",
                      !form.tanggalSurat && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.tanggalSurat ? format(new Date(form.tanggalSurat), "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.tanggalSurat ? new Date(form.tanggalSurat) : undefined}
                    onSelect={(date) => handleChange("tanggalSurat", date?.toISOString().split('T')[0])}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-[10px] text-muted-foreground mt-1">*Akan memperbarui tanggal di semua surat (SKL, Kelakuan Baik, NISN).</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-t-4 border-t-slate-800">
        <CardHeader>
          <CardTitle className="text-heading font-bold flex items-center gap-2">
            <KeyRound className="h-5 w-5" /> KEAMANAN
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2 max-w-md">
              <Label htmlFor="newPassword">Ganti Password</Label>
              <div className="flex gap-2">
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru..."
                  className="h-10 border-slate-200"
                />
                <Button onClick={handleChangePassword} variant="secondary">
                  Update Password
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 italic">*Password baru ini akan menggantikan password lama.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-red-900">Reset Data Aplikasi</h4>
                <p className="text-xs text-red-700">Hapus permanen semua data dari localStorage.</p>
              </div>
              <Button onClick={handleResetData} variant="destructive" className="font-bold shadow-lg shadow-red-100">
                <Trash2 className="mr-2 h-4 w-4" /> ⚠️ HAPUS SEMUA DATA & RESET
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-start px-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => window.history.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          Kembali
        </Button>
      </div>
    </div>
  );
}
