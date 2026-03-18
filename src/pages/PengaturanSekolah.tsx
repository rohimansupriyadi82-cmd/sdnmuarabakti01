import { useSekolah } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";

export default function PengaturanSekolah() {
  const [sekolah, setSekolah] = useSekolah();
  const [form, setForm] = useState(sekolah);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: string) => {
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
    toast.success("Pengaturan sekolah berhasil disimpan");
  };

  const fields = useMemo(
    () => [
      { key: "namaSekolah", label: "Nama Sekolah" },
      { key: "alamatSekolah", label: "Alamat Sekolah" },
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
                  value={(form as any)[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="h-9 mt-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

