import { toast } from "sonner";

export const backupData = () => {
  try {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key) || "";
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup_data_sekolah_${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Data Utama berhasil di-backup!");
  } catch (error) {
    console.error("Backup failed:", error);
    toast.error("Gagal melakukan backup data.");
  }
};

export const restoreData = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const data = JSON.parse(content);

      if (confirm("Apakah Anda yakin? Data saat ini akan digantikan oleh data dari file backup.")) {
        localStorage.clear();
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, value as string);
        });
        toast.success("Restore data berhasil! Halaman akan dimuat ulang...");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Restore failed:", error);
      toast.error("File backup tidak valid.");
    }
  };
  reader.readAsText(file);
};
