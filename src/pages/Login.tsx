import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const storedPass = localStorage.getItem("admin_password") || "admin";
      if (username === "admin" && password === storedPass) {
        setAuth({ username: "admin", role: "admin" });
        toast.success("Login berhasil!");
        navigate("/dashboard");
      } else {
        toast.error("Username atau password salah!");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100 p-4">
      <Card className="w-full max-w-sm border-none shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] rounded-[2.5rem] bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="mx-auto mb-6 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src="/admin.png" 
              alt="Profile" 
              className="relative h-20 w-20 rounded-full border-4 border-white shadow-xl object-cover"
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 mb-1">
            Aplikasi Administrasi Sekolah
          </h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
            Tahun Pelajaran 2025/2026
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="h-12 rounded-2xl border-slate-200 focus:border-cyan-400 focus:ring-cyan-400 transition-all bg-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="h-12 rounded-2xl border-slate-200 focus:border-cyan-400 focus:ring-cyan-400 transition-all bg-white/50"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-600 hover:from-teal-500 hover:to-cyan-700 text-white font-bold shadow-lg shadow-teal-200 transition-all duration-300 transform hover:-translate-y-1 active:scale-95" 
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </Button>
            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Default Access: admin / admin
              </p>
              <div className="h-1 w-8 bg-slate-100 rounded-full"></div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
