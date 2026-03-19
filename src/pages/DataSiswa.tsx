import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Plus, Printer, Search, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { useSiswaList, type Siswa } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StudentForm = Pick<Siswa, "nama" | "nisn" | "nis" | "jenisKelamin">;

const emptyForm: StudentForm = {
  nama: "",
  nisn: "",
  nis: "",
  jenisKelamin: "L",
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        current += "\"";
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  result.push(current);
  return result.map((v) => v.trim());
};

const normalizeHeader = (h: string) =>
  h
    .trim()
    .toLowerCase()
    .replace(/"/g, "")
    .replace(/\s+/g, " ")
    .replace(/\./g, "")
    .replace(/_/g, " ");

export default function DataSiswa() {
  const navigate = useNavigate();
  const [siswaList, setSiswaList] = useSiswaList();

  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<StudentForm>(emptyForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return siswaList;
    return siswaList.filter((s) => {
      const nama = (s.nama || "").toLowerCase();
      const nisn = (s.nisn || "").toLowerCase();
      return nama.includes(q) || nisn.includes(q);
    });
  }, [query, siswaList]);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (s: Siswa) => {
    setEditId(s.id);
    setForm({
      nama: s.nama || "",
      nisn: s.nisn || "",
      nis: s.nis || "",
      jenisKelamin: s.jenisKelamin,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nama.trim()) {
      toast.error("Nama wajib diisi");
      return;
    }
    if (!form.nisn.trim()) {
      toast.error("NISN wajib diisi");
      return;
    }

    if (editId) {
      setSiswaList((prev) =>
        prev.map((s) =>
          s.id === editId ? { ...s, ...form, id: editId } : s,
        ),
      );
      toast.success("Data peserta didik berhasil diperbarui");
      setDialogOpen(false);
      return;
    }

    setSiswaList((prev) => {
      if (prev.length >= 500) {
        toast.error("Kapasitas maksimal 500 peserta didik");
        return prev;
      }
      const newSiswa: Siswa = {
        id: `s${Date.now()}`,
        nomorPeserta: "",
        tempatLahir: "",
        tanggalLahir: "",
        namaAyah: "",
        namaIbu: "",
        noSeriIjazah: "",
        namaOrtuIjazah: "",
        alamat: "",
        status: "aktif",
        ...form,
      };
      return [...prev, newSiswa];
    });
    toast.success("Data peserta didik berhasil ditambahkan");
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const ok = window.confirm("Hapus data peserta didik ini?");
    if (!ok) return;
    setSiswaList((prev) => prev.filter((s) => s.id !== id));
    toast.success("Data peserta didik berhasil dihapus");
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = String(evt.target?.result || "");
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length < 2) {
        toast.error("File CSV kosong atau tidak valid");
        return;
      }

      const rawHeader = parseCSVLine(lines[0]).map(normalizeHeader);

      const getValue = (row: string[], keys: string[]) => {
        for (const k of keys) {
          const idx = rawHeader.findIndex((h) => h === k || h.includes(k));
          if (idx >= 0) return row[idx]?.trim() || "";
        }
        return "";
      };

      const newStudents: Siswa[] = [];
      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        if (row.every((v) => v === "")) continue;

        const nama = getValue(row, ["nama peserta", "nama"]);
        const nisn = getValue(row, ["nisn"]);
        const nis = getValue(row, ["nis", "no induk"]);
        const nomorPeserta = getValue(row, ["nomor peserta", "no peserta"]);
        const jkRaw = getValue(row, ["jenis kelamin lp", "jenis kelamin l/p", "jenis kelamin", "l/p", "kelamin"]);
        const tempatLahir = getValue(row, ["tempat lahir"]);
        const tanggalLahir = getValue(row, ["tanggal lahir", "tgl lahir"]);
        const namaAyah = getValue(row, ["nama ayah", "ayah"]);
        const namaIbu = getValue(row, ["nama ibu", "ibu"]);
        const noSeriIjazah = getValue(row, ["no seri ijazah", "no seri", "seri ijazah"]);
        const namaOrtuIjazah = getValue(row, ["nama ortu di ijazah", "nama ortu"]);

        if (!nama && !nisn) continue;

        const jenisKelamin: Siswa["jenisKelamin"] =
          jkRaw.toUpperCase().startsWith("P") ? "P" : "L";

        newStudents.push({
          id: `s${Date.now()}-${i}`,
          nomorPeserta,
          nisn,
          nis,
          nama,
          jenisKelamin,
          tempatLahir,
          tanggalLahir,
          namaAyah,
          namaIbu,
          noSeriIjazah,
          namaOrtuIjazah,
          alamat: "",
          status: "aktif",
        });
      }

      if (newStudents.length === 0) {
        toast.error("Tidak ada data valid ditemukan di CSV");
        return;
      }

      setSiswaList((prev) => {
        const total = prev.length + newStudents.length;
        if (total > 500) {
          toast.error(`Kapasitas melebihi 500 (${total} siswa)`);
          return prev;
        }
        return [...prev, ...newStudents];
      });
      toast.success(`${newStudents.length} peserta didik berhasil diimpor`);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-heading font-semibold">
            Data Peserta Didik
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({siswaList.length}/500)
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleCSVImport}
            />
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => fileInputRef.current?.click()}
              title="Impor CSV"
            >
              <Upload className="mr-2 h-4 w-4" /> Impor CSV
            </Button>
            <Button onClick={openAdd} size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" /> Tambah Siswa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau NISN..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          <div className="rounded-lg border overflow-auto max-h-[65vh]">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-semibold text-muted-foreground h-9 whitespace-nowrap">
                    No
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground h-9 whitespace-nowrap">
                    Nama
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground h-9 whitespace-nowrap">
                    NISN
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground h-9 whitespace-nowrap">
                    NIS
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground h-9 whitespace-nowrap">
                    L/P
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground h-9 whitespace-nowrap">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Tidak ada data siswa ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s, idx) => (
                    <TableRow key={s.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="py-2 text-data whitespace-nowrap tabular-nums">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="py-2 text-data whitespace-nowrap font-medium">
                        {s.nama}
                      </TableCell>
                      <TableCell className="py-2 text-data whitespace-nowrap tabular-nums">
                        {s.nisn}
                      </TableCell>
                      <TableCell className="py-2 text-data whitespace-nowrap tabular-nums">
                        {s.nis}
                      </TableCell>
                      <TableCell className="py-2 text-data whitespace-nowrap">
                        {s.jenisKelamin}
                      </TableCell>
                      <TableCell className="py-2 text-data whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => openEdit(s)}
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive"
                            onClick={() => handleDelete(s.id)}
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => navigate(`/print/transkrip/${s.id}`)}
                            title="Cetak"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit" : "Tambah"} Siswa</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
            <div className="sm:col-span-2">
              <Label htmlFor="nama" className="text-sm">
                Nama
              </Label>
              <Input
                id="nama"
                value={form.nama}
                onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))}
                className="h-9 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="nisn" className="text-sm">
                NISN
              </Label>
              <Input
                id="nisn"
                value={form.nisn}
                onChange={(e) => setForm((p) => ({ ...p, nisn: e.target.value }))}
                className="h-9 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="nis" className="text-sm">
                NIS
              </Label>
              <Input
                id="nis"
                value={form.nis}
                onChange={(e) => setForm((p) => ({ ...p, nis: e.target.value }))}
                className="h-9 mt-1"
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="text-sm">Jenis Kelamin</Label>
              <Select
                value={form.jenisKelamin}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, jenisKelamin: v as "L" | "P" }))
                }
              >
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-9">
              Batal
            </Button>
            <Button onClick={handleSave} className="h-9">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
