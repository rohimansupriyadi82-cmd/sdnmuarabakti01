import { useSekolah, type DataSekolah } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Upload } from "lucide-react";
import { useState, useRef } from "react";

export default function DataSekolah() {
  const [sekolah, setSekolah] = useSekolah();
  const [form, setForm] = useState(sekolah);
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
    toast.success("Identitas sekolah berhasil disimpan");
  };

  type SchoolFieldKey =
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
    | "tahunPelajaran";

  const fields: { key: SchoolFieldKey; label: string }[] = [
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
  ];

  return (
    <div className="max-w-3xl animate-fade-in space-y-4">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading font-semibold">Identitas Sekolah</CardTitle>
          <Button onClick={handleSave} size="sm" className="h-9">
            <Save className="mr-2 h-4 w-4" /> Simpan
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 border-b pb-4">
            <Label className="text-sm">Logo Sekolah (Dinas Pendidikan Kabupaten Bekasi)</Label>
            <div className="flex items-start gap-4">
              <div className="h-24 w-24 rounded-md border bg-muted/30 flex items-center justify-center overflow-hidden">
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
                  Disarankan logo Dinas Pendidikan Kabupaten Bekasi (PNG/JPG).
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
                <Label htmlFor={key} className="text-sm">{label}</Label>
                <Input
                  id={key}
                  value={form[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="h-9 mt-1"
                />
              </div>
            ))}
            <div className="space-y-1">
              <Label className="text-sm">Kurikulum</Label>
              <Select 
                value={form.kurikulum} 
                onValueChange={(val) => handleChange("kurikulum", val)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Pilih Kurikulum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kurikulum Merdeka">Kurikulum Merdeka</SelectItem>
                  <SelectItem value="Kurikulum 2013">Kurikulum 2013</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
