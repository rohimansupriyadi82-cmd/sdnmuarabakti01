import { Users, BookOpen, GraduationCap, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStore } from "@/lib/store";
import { useNavigate } from "react-router-dom";

const stats = () => {
  const store = getStore();
  return [
    {
      label: "Peserta Didik",
      value: store.siswaList.length,
      icon: Users,
      href: "/data-siswa",
      bgClass: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      label: "Semester Aktif",
      value: "7 – 12",
      icon: BookOpen,
      href: "/nilai/7",
      bgClass: "bg-gradient-to-br from-orange-400 to-orange-500",
    },
    {
      label: "Bobot Raport",
      value: `${store.bobot.raport * 100}%`,
      icon: GraduationCap,
      href: "/pengaturan-bobot",
      bgClass: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    },
    {
      label: "Dokumen Cetak",
      value: "9 Template",
      icon: Printer,
      href: "/print/ijazah",
      bgClass: "bg-gradient-to-br from-purple-500 to-indigo-600",
    },
  ];
};

export default function Dashboard() {
  const navigate = useNavigate();
  const items = stats();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-heading font-bold text-foreground">Aplikasi Administrasi Sekolah</h2>
        <p className="text-sm text-muted-foreground mt-1">Kec. Babelan Kab. Bekasi</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card
            key={item.label}
            className={[
              "cursor-pointer transition-all duration-200",
              "rounded-2xl shadow-xl hover:shadow-2xl",
              "text-white border-0",
              item.bgClass,
            ].join(" ")}
            onClick={() => navigate(item.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-white/90">{item.label}</CardTitle>
              <item.icon className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tabular-nums text-white">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Panduan Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Lengkapi <strong className="text-foreground">Pengaturan Sekolah</strong> di menu Input Data</li>
            <li>Tambahkan <strong className="text-foreground">Data Peserta Didik</strong> (hingga 500 siswa)</li>
            <li>Atur <strong className="text-foreground">Bobot Nilai</strong> raport dan ujian sekolah</li>
            <li>Input <strong className="text-foreground">Nilai Raport</strong> semester 7–12 dan Nilai US</li>
            <li>Cetak dokumen resmi melalui menu <strong className="text-foreground">Cetak Dokumen</strong></li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
