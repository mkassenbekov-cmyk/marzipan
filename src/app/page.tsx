"use client";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { user, loading, loginWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [user, loading, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const err = await loginWithEmail(email, password);
    if (err) setError(err);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#C8A45D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-[0.3em] text-[#2A2521] uppercase">MARZIPAN</h1>
          <p className="text-[#8A7E72] tracking-[0.2em] text-sm uppercase mt-2">OS · Platform</p>
          <div className="w-12 h-0.5 bg-[#C8A45D] mx-auto mt-4" />
        </div>

        <div className="bg-white rounded-2xl border border-[#E5DED2] shadow-sm p-8">
          <p className="text-base font-semibold text-[#1E1E1E] mb-6">Вход в систему</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs text-[#8A7E72] block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="madi@marzipan.kz"
                required
                className="w-full border border-[#E5DED2] rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30 focus:border-[#C8A45D]"
              />
            </div>
            <div>
              <label className="text-xs text-[#8A7E72] block mb-1.5">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-[#E5DED2] rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30 focus:border-[#C8A45D]"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530] disabled:opacity-50 transition-colors mt-2"
            >
              {submitting ? "Входим..." : "Войти"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#8A7E72] mt-6">MARZIPAN OS · 2025</p>
      </div>
    </div>
  );
}
