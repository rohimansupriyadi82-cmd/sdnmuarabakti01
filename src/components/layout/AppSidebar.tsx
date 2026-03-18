import { 
  BookOpen, Calendar, ChevronRight, ClipboardList, 
  FileText, GraduationCap, LayoutDashboard, LogOut, 
  Settings, Users, BarChart, Download, Printer,
  School, ChevronDown
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar, SidebarSeparator
} from "@/components/ui/sidebar";

import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { exportNilaiToExcel } from "@/lib/exportExcel";
import { toast } from "sonner";

const administrasiGuruKelasItems = [
  { title: "Cetak Kartu Ujian", url: "/print/kartu-ujian", icon: Printer },
  { title: "Generate Nomor Meja", url: "/generate/nomor-meja", icon: Users },
  { title: "Data Murid & NISN", url: "/data-siswa", icon: Users },
  { title: "Olah Nilai & Raport.", url: "/nilai/7", icon: BookOpen },
];

const dataMasterItems = [
  { title: "Identitas Sekolah", url: "/identitas-sekolah", icon: School },
  { title: "Data Peserta Didik", url: "/data-siswa", icon: Users },
];

const inputNilaiItems = [
  { title: "Semester 7", url: "/nilai/7" },
  { title: "Semester 8", url: "/nilai/8" },
  { title: "Semester 9", url: "/nilai/9" },
  { title: "Semester 10", url: "/nilai/10" },
  { title: "Semester 11", url: "/nilai/11" },
  { title: "Semester 12", url: "/nilai/12" },
  { title: "Nilai Ujian Sekolah", url: "/nilai-us" },
  { title: "Ekspor Nilai (Excel)", url: "#", icon: FileText, onClick: true },
];

const dokumenKelulusanItems = [
  { title: "Surat Transkrip Nilai", url: "/print/transkrip" },
  { title: "Surat Kelulusan", url: "/print/surat-kelulusan" },
  { title: "Surat Ket. NISN", url: "/print/surat-nisn" },
  { title: "Surat Kelakuan Baik", url: "/print/surat-kelakuan" },
  { title: "Serah Terima Ijazah", url: "/print/serah-terima" },
  { title: "Daftar Kendali Ijazah", url: "/print/daftar-kendali-ijazah" },
  { title: "Amplop Kelulusan", url: "/print/amplop-kelulusan" },
];

const pengaturanItems = [
  { title: "Identitas Kepala Sekolah", url: "/identitas-kepala-sekolah", icon: Users },
  { title: "Pengaturan Bobot", url: "/pengaturan-bobot", icon: Settings },
];

interface CollapsibleGroupProps {
  label: string;
  icon: React.ElementType;
  items: { title: string; url: string; icon?: React.ElementType; onClick?: boolean }[];
  collapsed: boolean;
}

function CollapsibleGroup({ label, icon: Icon, items, collapsed }: CollapsibleGroupProps) {
  const location = useLocation();
  const isActive = items.some(item => location.pathname === item.url || location.pathname.startsWith(item.url + '/'));

  const handleItemClick = (item: any) => {
    if (item.onClick && item.title.includes("Ekspor")) {
      exportNilaiToExcel();
      toast.success("Data Nilai berhasil diekspor ke Excel");
    }
  };

  return (
    <Collapsible defaultOpen={isActive}>
      <SidebarGroup>
        <CollapsibleTrigger className="w-full">
          <SidebarGroupLabel className="flex items-center justify-between text-sidebar-foreground/60 hover:text-sidebar-foreground/80 transition-colors cursor-pointer">
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {!collapsed && label}
            </span>
            {!collapsed && <ChevronDown className="h-3 w-3 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />}
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.onClick ? (
                      <button
                        onClick={() => handleItemClick(item)}
                        className="w-full flex items-center hover:bg-sidebar-accent/10 transition-colors duration-200 rounded-md text-left px-2 py-1.5"
                      >
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        {!collapsed && <span className="text-data text-sm">{item.title}</span>}
                      </button>
                    ) : (
                      <NavLink
                        to={item.url}
                        className="w-full flex items-center hover:bg-sidebar-accent/10 transition-colors duration-200 rounded-md px-2 py-1.5"
                      >
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        {!collapsed && <span className="text-data text-sm">{item.title}</span>}
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo-bekasi.png" alt="Logo" className="h-12 w-12" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground/90">Aplikasi Olah Nilai</span>
              <span className="text-xs text-sidebar-foreground/50">Tahun Pelajaran 2025/2026</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard"
                    className="w-full flex items-center hover:bg-sidebar-accent/10 transition-colors duration-200 rounded-md px-2 py-1.5"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <CollapsibleGroup label="ADMINISTRASI GURU KELAS" icon={Users} items={administrasiGuruKelasItems} collapsed={collapsed} />
        <SidebarSeparator />

        <CollapsibleGroup label="DATA MASTER" icon={FileText} items={dataMasterItems} collapsed={collapsed} />
        <SidebarSeparator />
        <CollapsibleGroup label="INPUT NILAI" icon={BookOpen} items={inputNilaiItems} collapsed={collapsed} />
        <SidebarSeparator />
        <CollapsibleGroup label="DOKUMEN KELULUSAN" icon={Printer} items={dokumenKelulusanItems} collapsed={collapsed} />
        <SidebarSeparator />
        <CollapsibleGroup label="PENGATURAN" icon={Settings} items={pengaturanItems} collapsed={collapsed} />
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <SidebarMenu>
          {!collapsed && (
            <div className="px-2 pb-2 text-[11px] leading-snug text-sidebar-foreground/40">
              Hak Cipta © Rohiman Supriyadi
            </div>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate('/login')}
              className="hover:bg-sidebar-accent/10 transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Keluar</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}