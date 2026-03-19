import { useState, useMemo, useRef } from "react";
import {
  useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, flexRender, type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import { useSiswaList, type Siswa } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, Upload, Download, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const emptyStudent: Omit<Siswa, 'id'> = {
  nomorPeserta: '', nisn: '', nis: '', nama: '', jenisKelamin: 'L',
  tempatLahir: '', tanggalLahir: '', namaAyah: '', namaIbu: '',
  noSeriIjazah: '', namaOrtuIjazah: '', alamat: '', status: 'aktif',
};

export default function DataSiswa() {
  const [siswaList, setSiswaList] = useSiswaList();
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyStudent);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CSV Import
  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) { toast.error("File CSV kosong"); return; }
      
      // Parse header
      const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
      const newStudents: Siswa[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length < 4) continue;
        
        const get = (keys: string[]) => {
          for (const k of keys) {
            const idx = header.findIndex(h => h.includes(k));
            if (idx >= 0 && values[idx]) return values[idx].trim();
          }
          return '';
        };

        newStudents.push({
          id: `s${Date.now()}-${i}`,
          nomorPeserta: get(['nomor peserta', 'no peserta']),
          nisn: get(['nisn']),
          nis: get(['nis', 'no induk']),
          nama: get(['nama peserta', 'nama']),
          jenisKelamin: (get(['jenis kelamin', 'l/p', 'kelamin']).toUpperCase().startsWith('P') ? 'P' : 'L') as 'L' | 'P',
          tempatLahir: get(['tempat lahir']),
          tanggalLahir: get(['tanggal lahir', 'tgl lahir']),
          namaAyah: get(['nama ayah', 'ayah']),
          namaIbu: get(['nama ibu', 'ibu']),
          noSeriIjazah: get(['no. seri', 'seri ijazah', 'no seri']),
          namaOrtuIjazah: get(['nama ortu di ijazah', 'ortu ijazah', 'nama ortu']),
          alamat: get(['alamat']),
          status: 'aktif',
        });
      }

      if (newStudents.length === 0) {
        toast.error("Tidak ada data valid ditemukan di CSV");
        return;
      }

      const total = siswaList.length + newStudents.length;
      if (total > 500) {
        toast.error(`Kapasitas melebihi 500 (${total} siswa)`);
        return;
      }

      setSiswaList([...siswaList, ...newStudents]);
      toast.success(`${newStudents.length} peserta didik berhasil diimpor`);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // CSV line parser (handles quoted values)
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { result.push(current); current = ''; continue; }
      current += ch;
    }
    result.push(current);
    return result;
  };

  // CSV Template Download
  const downloadTemplate = () => {
    const headers = 'Nomor Peserta,NISN,NIS,Nama Peserta,Jenis Kelamin (L/P),Tempat Lahir,Tanggal Lahir,Nama Ayah,Nama Ibu,No. Seri Ijazah,Nama Ortu di Ijazah,Alamat';
    const sample = '26-02-12-064-01-009,3130369278,202101001,Aditia Ramadan,L,Bekasi,11/07/2013,Niman,Sainih,1,Niman,Muara Bakti';
    const blob = new Blob([headers + '\n' + sample + '\n'], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'template_data_siswa.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const columns = useMemo<ColumnDef<Siswa>[]>(() => [
    { header: "No", cell: ({ row }) => row.index + 1, size: 40 },
    { accessorKey: "nomorPeserta", header: "Nomor Peserta" },
    { accessorKey: "nisn", header: "NISN" },
    { accessorKey: "nis", header: "NIS" },
    { accessorKey: "nama", header: "Nama Peserta" },
    { accessorKey: "jenisKelamin", header: "L/P", size: 40 },
    { accessorKey: "tempatLahir", header: "Tempat Lahir" },
    { accessorKey: "tanggalLahir", header: "Tgl Lahir" },
    { accessorKey: "namaAyah", header: "Nama Ayah" },
    { accessorKey: "namaIbu", header: "Nama Ibu" },
    { accessorKey: "noSeriIjazah", header: "No. Seri", size: 50 },
    { accessorKey: "namaOrtuIjazah", header: "Ortu di Ijazah" },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center gap-[10px]">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => openEdit(row.original)}
            title="Edit"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive"
            onClick={() => handleDelete(row.original.id)}
            title="Hapus"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-auto p-1 flex items-center"
            onClick={() => navigate(`/print/transkrip/${row.original.id}`)}
            title="Cetak Transkrip"
          >
            <Printer className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-auto p-1 flex items-center"
            onClick={() => navigate(`/print/amplop-kelulusan/${row.original.id}`)}
            title="Cetak Amplop Kelulusan"
          >
            <Printer className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: siswaList,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 30 } },
  });

  const openEdit = (siswa: Siswa) => {
    setEditId(siswa.id);
    const { id, ...rest } = siswa;
    setForm(rest);
    setDialogOpen(true);
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ ...emptyStudent });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nama || !form.nisn) {
      toast.error("Nama dan NISN wajib diisi");
      return;
    }
    if (editId) {
      setSiswaList(siswaList.map(s => s.id === editId ? { ...form, id: editId } : s));
      toast.success("Data peserta didik berhasil diperbarui");
    } else {
      if (siswaList.length >= 500) {
        toast.error("Kapasitas maksimal 500 peserta didik");
        return;
      }
      setSiswaList([...siswaList, { ...form, id: `s${Date.now()}` }]);
      toast.success("Data peserta didik berhasil ditambahkan");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setSiswaList(siswaList.filter(s => s.id !== id));
    toast.success("Data peserta didik berhasil dihapus");
  };

  const formFields: { key: string; label: string; type?: string; half?: boolean }[] = [
    { key: "nomorPeserta", label: "Nomor Peserta" },
    { key: "nisn", label: "NISN", half: true },
    { key: "nis", label: "NIS", half: true },
    { key: "nama", label: "Nama Peserta" },
    { key: "tempatLahir", label: "Tempat Lahir", half: true },
    { key: "tanggalLahir", label: "Tanggal Lahir", half: true },
    { key: "namaAyah", label: "Nama Ayah", half: true },
    { key: "namaIbu", label: "Nama Ibu", half: true },
    { key: "noSeriIjazah", label: "No. Seri Ijazah", half: true },
    { key: "namaOrtuIjazah", label: "Nama Ortu di Ijazah", half: true },
    { key: "alamat", label: "Alamat" },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-heading font-semibold">
            Data Peserta Didik
            <span className="text-sm font-normal text-muted-foreground ml-2">({siswaList.length}/500)</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => navigate("/print/serah-terima")}
              title="Cetak Tanda Serah Terima Ijazah"
            >
              <Printer className="mr-2 h-4 w-4" /> Serah Terima Ijazah
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => navigate("/print/daftar-kendali-ijazah")}
              title="Cetak Daftar Kendali Ijazah"
            >
              <Printer className="mr-2 h-4 w-4" /> Kendali Ijazah
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => navigate("/print/amplop-kelulusan")}
              title="Cetak Amplop Kelulusan"
            >
              <Printer className="mr-2 h-4 w-4" /> Amplop Kelulusan
            </Button>
            <Button variant="outline" size="sm" className="h-9" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" /> Template CSV
            </Button>
            <Button variant="outline" size="sm" className="h-9" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Impor CSV
            </Button>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
            <Button onClick={openAdd} size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" /> Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau NISN..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          <div className="rounded-lg border overflow-auto max-h-[65vh]">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(hg => (
                  <TableRow key={hg.id} className="bg-muted/50">
                    {hg.headers.map(header => (
                      <TableHead key={header.id} className="text-xs font-semibold text-muted-foreground h-9 whitespace-nowrap">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                      Tidak ada data siswa ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} className="hover:bg-primary/5 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="py-2 text-data whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-muted-foreground">
              Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
            </p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit" : "Tambah"} Peserta Didik</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            {formFields.map(({ key, label, type, half }) => (
              <div key={key} className={half ? "" : "col-span-2"}>
                <Label htmlFor={key} className="text-sm">{label}</Label>
                {key === "jenisKelamin" ? null : (
                  <Input
                    id={key}
                    type={type || "text"}
                    value={(form as any)[key]}
                    onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="h-9 mt-1"
                  />
                )}
              </div>
            ))}
            <div>
              <Label className="text-sm">Jenis Kelamin</Label>
              <Select value={form.jenisKelamin} onValueChange={(v) => setForm(prev => ({ ...prev, jenisKelamin: v as 'L' | 'P' }))}>
                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-9">Batal</Button>
            <Button onClick={handleSave} className="h-9">Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
