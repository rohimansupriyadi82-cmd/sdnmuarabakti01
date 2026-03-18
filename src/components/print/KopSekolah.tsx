import { useSekolah } from "@/lib/store";
import logoBekasi from "@/assets/logo-bekasi.png";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface KopSekolahProps {
  nomorSurat?: string;
  judulSurat: string;
}

export function KopSekolah({ nomorSurat, judulSurat }: KopSekolahProps) {
  const [s] = useSekolah();
  const logoSrc = s.logoDataUrl || logoBekasi;

  return (
    <div style={{ marginBottom: '6mm', fontFamily: "'Times New Roman', serif", color: 'black' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            <td style={{ width: '22mm', verticalAlign: 'middle', padding: '0 4mm 0 0' }}>
              <img src={logoSrc} alt="Logo" style={{ width: '22mm', height: '22mm', objectFit: 'contain', display: 'block' }} />
            </td>
            <td style={{ verticalAlign: 'middle', textAlign: 'center', lineHeight: '1.2' }}>
              <div style={{ fontSize: '12pt', fontWeight: 700, textTransform: 'uppercase' }}>
                PEMERINTAH KABUPATEN {s.kabupaten.toUpperCase()}
              </div>
              <div style={{ fontSize: '12pt', fontWeight: 700, textTransform: 'uppercase' }}>
                DINAS PENDIDIKAN
              </div>
              <div style={{ fontSize: '16pt', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {s.namaSekolah}
              </div>
              <div style={{ fontSize: '10pt', fontStyle: 'italic' }}>
                {s.alamatSekolah} {s.kelurahan}, Kec. {s.kecamatan}, {s.kabupaten}, {s.provinsi} {s.kodePos}
              </div>
              {s.email && (
                <div style={{ fontSize: '10pt' }}>
                  Email: <span style={{ textDecoration: 'underline', color: 'blue' }}>{s.email}</span>
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      {/* Double line for Kop */}
      <div style={{ borderBottom: '3px solid black', marginTop: '1mm' }} />
      <div style={{ borderBottom: '1px solid black', marginTop: '1px' }} />

      {/* Judul Surat */}
      <div style={{ textAlign: 'center', marginTop: '6mm', marginBottom: '5mm' }}>
        <div style={{ fontSize: '12pt', fontWeight: 700, textDecoration: 'underline', textTransform: 'uppercase' }}>
          {judulSurat}
        </div>
        <div style={{ fontSize: '11pt', marginTop: '1mm' }}>
          Nomor: {nomorSurat || s.nomorSurat}
        </div>
      </div>
    </div>
  );
}

export function TandaTanganKepala({ tanggal }: { tanggal?: string }) {
  const [s] = useSekolah();
  const displayTanggal = tanggal || (s.tanggalSurat ? format(new Date(s.tanggalSurat), "d MMMM yyyy", { locale: id }) : format(new Date(), "d MMMM yyyy", { locale: id }));
  const displayKota = s.kota || s.kabupaten;

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px', fontFamily: "'Times New Roman', serif" }}>
      <div style={{ textAlign: 'center', fontSize: '11pt', minWidth: '60mm' }}>
        <div>{displayKota}, {displayTanggal}</div>
        <div>Kepala Sekolah,</div>
        <div style={{ height: '75px' }} />
        <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{s.kepalaSekolah}</div>
        <div>NIP. {s.nipKepalaSekolah}</div>
      </div>
    </div>
  );
}
