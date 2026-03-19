// Simple in-memory store for the app state
import { useState, useCallback, type SetStateAction } from 'react';

export interface Siswa {
  id: string;
  nomorPeserta: string;
  nisn: string;
  nis: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  namaAyah: string;
  namaIbu: string;
  noSeriIjazah: string;
  namaOrtuIjazah: string;
  alamat: string;
  status: 'aktif' | 'lulus' | 'remedial';
}

export interface DataSekolah {
  namaSekolah: string;
  npsn: string;
  status: string;
  alamatSekolah: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  email: string;
  kurikulum: string;
  tahunPelajaran: string;
  logoDataUrl?: string | null;
  
  // Identitas Kepala Sekolah
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  mapelMuloSunda: boolean;
  mapelMuloInggris: boolean;
  mapelMuloKomputer: boolean;
  nomorSurat: string;
  noSuratTranskrip: string;
  noSuratLulus: string;
  tglSuratLulus: string;
  noSuratKelakuanBaik: string;
  tglSuratKelakuanBaik: string;
  noSuratNISN: string;
  tglSuratNISN: string;
  tglIjazah: string;
  tanggalSurat: string;
  tanggalKelulusan?: string;
  kota: string;
}

export interface BobotNilai {
  raport: number;
  us: number;
  ki3: number; // e.g., 0.5
  ki4: number; // e.g., 0.5
}

export const MATA_PELAJARAN = [
  'Agama',
  'PKn',
  'B Indo',
  'MTK',
  'IPA',
  'IPS',
  'SBdP',
  'PJOK',
  'Bahasa Sunda',
  'Inggris',
  'Komputer',
] as const;

export type MataPelajaran = typeof MATA_PELAJARAN[number];

export const MATA_PELAJARAN_FULL: Record<string, string> = {
  'Agama': 'Pendidikan Agama',
  'PKn': 'Pendidikan Kewarganegaraan',
  'B Indo': 'Bahasa Indonesia',
  'MTK': 'Matematika',
  'IPA': 'Ilmu Pengetahuan Alam',
  'IPS': 'Ilmu Pengetahuan Sosial',
  'SBdP': 'Seni Budaya dan Prakarya',
  'PJOK': 'Pendidikan Jasmani',
  'Bahasa Sunda': 'Bahasa Sunda',
  'Inggris': 'Bahasa Inggris',
  'Komputer': 'Komputer',
};

export const SEMESTERS = [7, 8, 9, 10, 11, 12] as const;

// Nilai per mapel now has KI3 and KI4, RT is calculated
export interface NilaiMapel {
  ki3: number | null;
  ki4: number | null;
}

// Per siswa per semester: Record<mapelName, NilaiMapel>
export interface NilaiSiswa {
  siswaId: string;
  semester: number;
  nilai: Record<string, NilaiMapel>;
}

export interface NilaiUS {
  siswaId: string;
  nilai: Record<string, NilaiMapel>;
}

export const calcRT = (ki3: number | null, ki4: number | null): number | null => {
  if (ki3 === null && ki4 === null) return null;
  const v3 = ki3 ?? 0;
  const v4 = ki4 ?? 0;
  const w3 = bobot.ki3;
  const w4 = bobot.ki4;
  return Math.round((v3 * w3 + v4 * w4) * 100) / 100;
};

const realStudents: Omit<Siswa, 'id' | 'status' | 'alamat'>[] = [
  { nomorPeserta: '26-02-12-064-01-009', nisn: '3130369278', nis: '202101001', nama: 'Aditia Ramadan', jenisKelamin: 'L', tempatLahir: 'Bekasi', tanggalLahir: '11/07/2013', namaAyah: 'Niman', namaIbu: 'Sainih', noSeriIjazah: '1', namaOrtuIjazah: 'Niman' },
  { nomorPeserta: '26-02-12-064-02-009', nisn: '131954537', nis: '202304038', nama: 'Aisyah Maharani Harja', jenisKelamin: 'P', tempatLahir: 'Bekasi', tanggalLahir: '05/06/2013', namaAyah: 'Yudi Prawira', namaIbu: 'Siti Rofiah', noSeriIjazah: '2', namaOrtuIjazah: 'Yudi Prawira' },
  { nomorPeserta: '26-02-12-064-03-009', nisn: '132121570', nis: '202101004', nama: 'Aldi Marhali', jenisKelamin: 'L', tempatLahir: 'Bekasi', tanggalLahir: '31/05/2013', namaAyah: 'Carsa', namaIbu: 'Warsih', noSeriIjazah: '3', namaOrtuIjazah: 'Carsa' },
  { nomorPeserta: '26-02-12-064-04-009', nisn: '3134674685', nis: '202101005', nama: 'Alya Natasya', jenisKelamin: 'P', tempatLahir: 'Bekasi', tanggalLahir: '01/10/2013', namaAyah: 'Kurdi', namaIbu: 'Kartini', noSeriIjazah: '4', namaOrtuIjazah: 'Kurdi' },
  { nomorPeserta: '26-02-12-064-05-009', nisn: '138182404', nis: '202101006', nama: 'Arman Maulana', jenisKelamin: 'L', tempatLahir: 'Bekasi', tanggalLahir: '11/08/2013', namaAyah: 'Buhe Effendi', namaIbu: 'Mahlia', noSeriIjazah: '5', namaOrtuIjazah: 'Buhe Effendi' },
  { nomorPeserta: '26-02-12-064-06-009', nisn: '135053704', nis: '252606052', nama: 'Azmi Maiza Deski Saputra', jenisKelamin: 'L', tempatLahir: 'Bekasi', tanggalLahir: '11/12/2013', namaAyah: 'Rozi Maiza Putra', namaIbu: 'Indra Mah Yeni', noSeriIjazah: '6', namaOrtuIjazah: 'Rozi Maiza Putra' },
  { nomorPeserta: '26-02-12-064-07-009', nisn: '3146212483', nis: '202101008', nama: 'Bella Ramadhani', jenisKelamin: 'P', tempatLahir: 'Bekasi', tanggalLahir: '28/04/2014', namaAyah: 'Nasrum', namaIbu: 'Mulyanah', noSeriIjazah: '7', namaOrtuIjazah: 'Nasrum' },
  { nomorPeserta: '26-02-12-064-09-009', nisn: '149821399', nis: '202101010', nama: 'Fadil Robiansyah', jenisKelamin: 'L', tempatLahir: 'Bekasi', tanggalLahir: '27/02/2014', namaAyah: 'Sukarta', namaIbu: 'Suryanah', noSeriIjazah: '8', namaOrtuIjazah: 'Sukarta' },
  { nomorPeserta: '26-02-12-064-09-009', nisn: '144147785', nis: '202101011', nama: 'Gilang Mahardika Pratama', jenisKelamin: 'L', tempatLahir: 'Bekasi', tanggalLahir: '01/03/2014', namaAyah: 'Haris Siswanto', namaIbu: 'Suheni', noSeriIjazah: '9', namaOrtuIjazah: 'Haris Siswanto' },
  { nomorPeserta: '26-02-12-064-10-009', nisn: '3130637155', nis: '202101012', nama: 'Iqbal Rizky El Rafif', jenisKelamin: 'L', tempatLahir: 'Jakarta', tanggalLahir: '15/11/2013', namaAyah: 'Tri Yulianto', namaIbu: 'Tetty Rizky Oktaviany', noSeriIjazah: '10', namaOrtuIjazah: 'Tri Yulianto' },
  { nomorPeserta: '26-02-12-064-11-009', nisn: '148449890', nis: '202101013', nama: 'Jihan Khansa Aqilla', jenisKelamin: 'P', tempatLahir: 'Bekasi', tanggalLahir: '13/08/2014', namaAyah: 'Marniah Imannudin', namaIbu: 'Dita Tri Saputri', noSeriIjazah: '11', namaOrtuIjazah: 'Marniah Imannudin' },
  { nomorPeserta: '26-02-12-064-12-009', nisn: '3144227996', nis: '202101016', nama: 'Kamal Luddin', jenisKelamin: 'L', tempatLahir: 'Bekasi', tanggalLahir: '01/02/2014', namaAyah: 'Dadang Sutrisna', namaIbu: 'Khusnul Khotimah', noSeriIjazah: '12', namaOrtuIjazah: 'Dadang Sutrisna' },
  { nomorPeserta: '26-02-12-064-13-009', nisn: '3132869185', nis: '202101019', nama: 'Mohamad Rahmat Jakaria', jenisKelamin: 'L', tempatLahir: 'Bekasi', tanggalLahir: '06/09/2013', namaAyah: 'Rijal', namaIbu: 'Rizah Yuningsih', noSeriIjazah: '13', namaOrtuIjazah: 'Rijal' },
  { nomorPeserta: '26-02-12-064-14-009', nisn: '3140182405', nis: '202202033', nama: 'Muhamad Abdul Rohman', jenisKelamin: 'L', tempatLahir: 'Bekasi', tanggalLahir: '13/04/2014', namaAyah: 'Arif Sunandar', namaIbu: 'Kamelia Malik', noSeriIjazah: '14', namaOrtuIjazah: 'Arif Sunandar' },
  { nomorPeserta: '26-02-12-064-15-009', nisn: '3145817863', nis: '202101018', nama: 'Muhammad Raheel Ibrahim', jenisKelamin: 'L', tempatLahir: 'Bekasi', tanggalLahir: '25/04/2014', namaAyah: 'Maryanto', namaIbu: 'Ani Sulastri', noSeriIjazah: '15', namaOrtuIjazah: 'Maryanto' },
  { nomorPeserta: '26-02-12-064-16-009', nisn: '3148923641', nis: '202101020', nama: 'Muhammad Raziq Hanan', jenisKelamin: 'L', tempatLahir: 'Bekasi', tanggalLahir: '02/06/2014', namaAyah: 'Edi Purwanto', namaIbu: 'Ulus Usaniah', noSeriIjazah: '16', namaOrtuIjazah: 'Edi Purwanto' },
  { nomorPeserta: '26-02-12-064-17-009', nisn: '135613381', nis: '202101021', nama: 'Nabhan Zulfadhli', jenisKelamin: 'L', tempatLahir: 'Jakarta', tanggalLahir: '15/09/2013', namaAyah: 'Haan Rojali', namaIbu: 'Siti Maryanah', noSeriIjazah: '17', namaOrtuIjazah: 'Haan Rojali' },
  { nomorPeserta: '26-02-12-064-18-009', nisn: '3141430414', nis: '202101022', nama: 'Nashila Fazhira Meyda', jenisKelamin: 'P', tempatLahir: 'Jakarta', tanggalLahir: '02/05/2014', namaAyah: 'Oktaviadi Abdul Fazri', namaIbu: 'Yunita Hayatun', noSeriIjazah: '18', namaOrtuIjazah: 'Oktaviadi Abdul Fazri' },
  { nomorPeserta: '26-02-12-064-19-009', nisn: '136759916', nis: '202101024', nama: 'Nayla Rahayu Ramadhani', jenisKelamin: 'P', tempatLahir: 'Bekasi', tanggalLahir: '23/07/2013', namaAyah: 'Rustono', namaIbu: 'Nunung Inayah', noSeriIjazah: '19', namaOrtuIjazah: 'Rustono' },
  { nomorPeserta: '26-02-12-064-20-009', nisn: '3149997930', nis: '202101025', nama: 'Prananda Ramadhan', jenisKelamin: 'L', tempatLahir: 'Bekasi', tanggalLahir: '07/07/2014', namaAyah: 'Rosan', namaIbu: 'Ita Muniah', noSeriIjazah: '20', namaOrtuIjazah: 'Rosan' },
  { nomorPeserta: '26-02-12-064-21-009', nisn: '3136043408', nis: '202101026', nama: 'Putri Kencana Ramadhan', jenisKelamin: 'P', tempatLahir: 'Bekasi', tanggalLahir: '01/07/2013', namaAyah: 'Bedan', namaIbu: 'Nurasih', noSeriIjazah: '21', namaOrtuIjazah: 'Bedan' },
  { nomorPeserta: '26-02-12-064-22-009', nisn: '3132045814', nis: '202102035', nama: 'Putri Syahira Fathanah', jenisKelamin: 'P', tempatLahir: 'Bekasi', tanggalLahir: '14/10/2013', namaAyah: 'Sahril', namaIbu: 'Vivi Selfiana', noSeriIjazah: '22', namaOrtuIjazah: 'Sahril' },
  { nomorPeserta: '26-02-12-064-23-009', nisn: '136673922', nis: '202101027', nama: 'Ruswandi Pratama', jenisKelamin: 'L', tempatLahir: 'Bekasi', tanggalLahir: '02/12/2013', namaAyah: 'Weni Rosadi', namaIbu: 'Siti Marpuah', noSeriIjazah: '23', namaOrtuIjazah: 'Weni Rosadi' },
  { nomorPeserta: '26-02-12-064-24-009', nisn: '3131558392', nis: '202101028', nama: 'Siti Adilatul Muzdalifah', jenisKelamin: 'P', tempatLahir: 'Bekasi', tanggalLahir: '16/04/2013', namaAyah: 'Mahpudin', namaIbu: 'Eva Verawati', noSeriIjazah: '24', namaOrtuIjazah: 'Mahpudin' },
  { nomorPeserta: '26-02-12-064-25-009', nisn: '3134015302', nis: '202101029', nama: 'Sri Kencana Ramadhan', jenisKelamin: 'P', tempatLahir: 'Bekasi', tanggalLahir: '01/07/2013', namaAyah: 'Bedan', namaIbu: 'Nurasih', noSeriIjazah: '25', namaOrtuIjazah: 'Bedan' },
  { nomorPeserta: '26-02-12-064-26-009', nisn: '136998124', nis: '202101030', nama: 'Zahwa Noprianti', jenisKelamin: 'P', tempatLahir: 'Bekasi', tanggalLahir: '28/11/2013', namaAyah: 'Sarmaja', namaIbu: 'Wardah', noSeriIjazah: '26', namaOrtuIjazah: 'Sarmaja' },
];

const generateStudents = (): Siswa[] =>
  realStudents.map((s, i) => ({
    ...s,
    id: `s${i + 1}`,
    alamat: 'Muara Bakti, Babelan, Bekasi',
    status: 'aktif' as const,
  }));

const defaultSekolah: DataSekolah = {
  namaSekolah: 'SD NEGERI MUARA BAKTI',
  npsn: '20254321',
  status: 'Negeri',
  alamatSekolah: 'Jl. Bayangkara RT. 12/07 Ds. Muara Bakti',
  kelurahan: 'Muara Bakti',
  kecamatan: 'Babelan',
  kabupaten: 'Bekasi',
  provinsi: 'Jawa Barat',
  kodePos: '17610',
  email: 'sdnmuarabakti1@gmail.com',
  kurikulum: 'Kurikulum Merdeka',
  tahunPelajaran: '2025/2026',
  logoDataUrl: null,
  
  // Identitas Kepala Sekolah
  kepalaSekolah: 'ROHIMAN SUPRIYADI',
  nipKepalaSekolah: '',
  mapelMuloSunda: true,
  mapelMuloInggris: true,
  mapelMuloKomputer: true,
  nomorSurat: '421.2/001/SDNMB01/III/2026',
  noSuratTranskrip: '400.3.11.1/040/SD.37/VI/2026',
  noSuratLulus: '400.3.12.1/041/SD.37/VI/2025',
  tglSuratLulus: new Date().toISOString().split('T')[0],
  noSuratKelakuanBaik: '400.3.12.1/042/SD.37/VI/2025',
  tglSuratKelakuanBaik: new Date().toISOString().split('T')[0],
  noSuratNISN: '400.3.12.1/043/SD.37/VI/2025',
  tglSuratNISN: new Date().toISOString().split('T')[0],
  tglIjazah: new Date().toISOString().split('T')[0],
  tanggalSurat: new Date().toISOString().split('T')[0],
  kota: 'Bekasi',
};

const defaultBobot: BobotNilai = { raport: 0.6, us: 0.4, ki3: 0.5, ki4: 0.5 };

let siswaList: Siswa[] = generateStudents();
const STORAGE_KEY_SEKOLAH = 'gradebook.sekolah';
const loadSekolah = (): DataSekolah => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SEKOLAH);
    if (!raw) return { ...defaultSekolah };
    const parsed = JSON.parse(raw) as Partial<DataSekolah>;
    return { ...defaultSekolah, ...parsed };
  } catch {
    return { ...defaultSekolah };
  }
};

let sekolah: DataSekolah = typeof window !== 'undefined' ? loadSekolah() : { ...defaultSekolah };
let bobot: BobotNilai = { ...defaultBobot };
const nilaiMap: Map<string, NilaiSiswa> = new Map();
const nilaiUSMap: Map<string, NilaiUS> = new Map();

export const getStore = () => ({
  siswaList: [...siswaList],
  sekolah: { ...sekolah },
  bobot: { ...bobot },
});

export const setSiswaList = (list: Siswa[]) => { siswaList = list; };
export const setSekolah = (data: DataSekolah) => {
  sekolah = data;
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SEKOLAH, JSON.stringify(sekolah));
    }
  } catch {
    // ignore storage failures (private mode / quota)
  }
};
export const setBobot = (data: BobotNilai) => { bobot = data; };

export const getNilai = (siswaId: string, semester: number): Record<string, NilaiMapel> => {
  const key = `${siswaId}-${semester}`;
  return nilaiMap.get(key)?.nilai || {};
};

export const setNilai = (siswaId: string, semester: number, nilai: Record<string, NilaiMapel>) => {
  const key = `${siswaId}-${semester}`;
  nilaiMap.set(key, { siswaId, semester, nilai });
};

export const getNilaiUS = (siswaId: string): Record<string, NilaiMapel> => {
  return nilaiUSMap.get(siswaId)?.nilai || {};
};

export const setNilaiUS = (siswaId: string, nilai: Record<string, NilaiMapel>) => {
  nilaiUSMap.set(siswaId, { siswaId, nilai });
};

export const getAllNilaiSemester = (semester: number): Map<string, Record<string, NilaiMapel>> => {
  const result = new Map<string, Record<string, NilaiMapel>>();
  for (const s of siswaList) {
    result.set(s.id, getNilai(s.id, semester));
  }
  return result;
};

export const getAllNilaiUS = (): Map<string, Record<string, NilaiMapel>> => {
  const result = new Map<string, Record<string, NilaiMapel>>();
  for (const s of siswaList) {
    result.set(s.id, getNilaiUS(s.id));
  }
  return result;
};

export const calculateNilaiIjazah = (siswaId: string): Record<string, number> => {
  const result: Record<string, number> = {};
  for (const mapel of MATA_PELAJARAN) {
    const semesterRTs: number[] = [];
    for (const sem of SEMESTERS) {
      const n = getNilai(siswaId, sem);
      const nm = n[mapel];
      if (nm) {
        const rt = calcRT(nm.ki3, nm.ki4);
        if (rt !== null) semesterRTs.push(rt);
      }
    }
    const usNilai = getNilaiUS(siswaId);
    const usMapel = usNilai[mapel];
    const usRT = usMapel ? calcRT(usMapel.ki3, usMapel.ki4) : null;

    const avgRaport = semesterRTs.length > 0
      ? semesterRTs.reduce((a, b) => a + b, 0) / semesterRTs.length
      : 0;
    const nilaiUS = usRT || 0;
    result[mapel] = Math.round((avgRaport * bobot.raport + nilaiUS * bobot.us) * 100) / 100;
  }
  return result;
};

// Custom hooks
export function useSiswaList() {
  const [list, setList] = useState(siswaList);
  const update = useCallback((action: SetStateAction<Siswa[]>) => {
    setList((prev) => {
      const next = typeof action === 'function'
        ? (action as (p: Siswa[]) => Siswa[])(prev)
        : action;
      setSiswaList(next);
      return [...next];
    });
  }, []);
  return [list, update] as const;
}

export function useSekolah() {
  const [data, setData] = useState(sekolah);
  const update = useCallback((newData: DataSekolah) => {
    setSekolah(newData);
    setData({ ...newData });
  }, []);
  return [data, update] as const;
}

export function useBobot() {
  const [data, setData] = useState(bobot);
  const update = useCallback((newData: BobotNilai) => {
    setBobot(newData);
    setData({ ...newData });
  }, []);
  return [data, update] as const;
}
