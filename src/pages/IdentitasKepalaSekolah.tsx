import { useSekolah } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Save, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function IdentitasKepalaSekolah() {
  const [sekolah, setSekolah] = useSekolah();
  const [form, setForm] = useState(sekolah);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSekolah(form);
    toast.success("Identitas kepala sekolah berhasil disimpan");
  };

  return (
    <div className="max-w-3xl animate-fade-in space-y-4">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading font-semibold">Identitas Kepala Sekolah</CardTitle>
          <Button onClick={handleSave} size="sm" className="h-9">
            <Save className="mr-2 h-4 w-4" /> Simpan
          </Button>
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
              <Label htmlFor="nomorSurat" className="text-sm">Nomor Surat Sekolah</Label>
              <Input
                id="nomorSurat"
                value={form.nomorSurat}
                onChange={(e) => handleChange("nomorSurat", e.target.value)}
                placeholder="Contoh: 421.2/001/SDNMB01/III/2026"
                className="h-9 mt-1"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="kota" className="text-sm">Nama Kota</Label>
              <Input
                id="kota"
                value={form.kota}
                onChange={(e) => handleChange("kota", e.target.value)}
                className="h-9 mt-1"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Tanggal Surat</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-9 mt-1",
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}