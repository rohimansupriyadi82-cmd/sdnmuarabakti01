import * as XLSX from 'xlsx';
import {
  getStore, getNilai, getNilaiUS, MATA_PELAJARAN, MATA_PELAJARAN_FULL,
  SEMESTERS, calcRT, calculateNilaiIjazah, type NilaiMapel,
} from '@/lib/store';

function buildSemesterSheet(semester: number) {
  const store = getStore();
  const header1 = ['No', 'NISN', 'NIS', 'Nama'];
  const header2 = ['', '', '', ''];
  for (const m of MATA_PELAJARAN) {
    header1.push(MATA_PELAJARAN_FULL[m] || m, '', '');
    header2.push('KI 3', 'KI 4', 'RT');
  }

  const rows: (string | number | null)[][] = [header1, header2];
  store.siswaList.forEach((s, i) => {
    const nilai = getNilai(s.id, semester);
    const row: (string | number | null)[] = [i + 1, s.nisn, s.nis, s.nama];
    for (const m of MATA_PELAJARAN) {
      const nm: NilaiMapel = nilai[m] || { ki3: null, ki4: null };
      const rt = calcRT(nm.ki3, nm.ki4);
      row.push(nm.ki3, nm.ki4, rt);
    }
    rows.push(row);
  });
  return rows;
}

function buildUSSheet() {
  const store = getStore();
  const header1 = ['No', 'NISN', 'NIS', 'Nama'];
  const header2 = ['', '', '', ''];
  for (const m of MATA_PELAJARAN) {
    header1.push(MATA_PELAJARAN_FULL[m] || m, '', '');
    header2.push('KI 3', 'KI 4', 'RT');
  }

  const rows: (string | number | null)[][] = [header1, header2];
  store.siswaList.forEach((s, i) => {
    const nilai = getNilaiUS(s.id);
    const row: (string | number | null)[] = [i + 1, s.nisn, s.nis, s.nama];
    for (const m of MATA_PELAJARAN) {
      const nm: NilaiMapel = nilai[m] || { ki3: null, ki4: null };
      const rt = calcRT(nm.ki3, nm.ki4);
      row.push(nm.ki3, nm.ki4, rt);
    }
    rows.push(row);
  });
  return rows;
}

function buildRekapSheet() {
  const store = getStore();
  const header = ['No', 'NISN', 'NIS', 'Nama'];
  for (const m of MATA_PELAJARAN) {
    header.push(MATA_PELAJARAN_FULL[m] || m);
  }
  header.push('Jumlah', 'Rata-rata');

  const rows: (string | number | null)[][] = [header];
  store.siswaList.forEach((s, i) => {
    const ijazah = calculateNilaiIjazah(s.id);
    const row: (string | number | null)[] = [i + 1, s.nisn, s.nis, s.nama];
    let total = 0;
    let count = 0;
    for (const m of MATA_PELAJARAN) {
      const v = ijazah[m] || 0;
      row.push(Math.round(v * 100) / 100);
      total += v;
      count++;
    }
    row.push(Math.round(total * 100) / 100);
    row.push(Math.round((total / count) * 100) / 100);
    rows.push(row);
  });
  return rows;
}

export function exportNilaiToExcel() {
  const wb = XLSX.utils.book_new();

  // Semester 7-12
  for (const sem of SEMESTERS) {
    const data = buildSemesterSheet(sem);
    const ws = XLSX.utils.aoa_to_sheet(data);
    // Merge mapel header cells (3 cols each, starting at col 4)
    ws['!merges'] = MATA_PELAJARAN.map((_, i) => ({
      s: { r: 0, c: 4 + i * 3 },
      e: { r: 0, c: 4 + i * 3 + 2 },
    }));
    ws['!cols'] = [
      { wch: 4 }, { wch: 12 }, { wch: 12 }, { wch: 28 },
      ...MATA_PELAJARAN.flatMap(() => [{ wch: 7 }, { wch: 7 }, { wch: 7 }]),
    ];
    XLSX.utils.book_append_sheet(wb, ws, `Semester ${sem}`);
  }

  // US
  const usData = buildUSSheet();
  const usWs = XLSX.utils.aoa_to_sheet(usData);
  usWs['!merges'] = MATA_PELAJARAN.map((_, i) => ({
    s: { r: 0, c: 4 + i * 3 },
    e: { r: 0, c: 4 + i * 3 + 2 },
  }));
  usWs['!cols'] = [
    { wch: 4 }, { wch: 12 }, { wch: 12 }, { wch: 28 },
    ...MATA_PELAJARAN.flatMap(() => [{ wch: 7 }, { wch: 7 }, { wch: 7 }]),
  ];
  XLSX.utils.book_append_sheet(wb, usWs, 'Ujian Sekolah');

  // Rekap Nilai Ijazah
  const rekapData = buildRekapSheet();
  const rekapWs = XLSX.utils.aoa_to_sheet(rekapData);
  rekapWs['!cols'] = [
    { wch: 4 }, { wch: 12 }, { wch: 12 }, { wch: 28 },
    ...MATA_PELAJARAN.map(() => ({ wch: 10 })),
    { wch: 10 }, { wch: 10 },
  ];
  XLSX.utils.book_append_sheet(wb, rekapWs, 'Rekap Nilai Ijazah');

  XLSX.writeFile(wb, 'Nilai_Siswa_Lengkap.xlsx');
}
