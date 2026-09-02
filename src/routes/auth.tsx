import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Zizaib Studio Access" },
      { name: "description", content: "Sign in to the Zizaib studio dashboard to manage category pictures and orders." },
      { property: "og:title", content: "Sign in — Zizaib Studio Access" },
      { property: "og:description", content: "Studio access for the Zizaib team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin/category-images" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        setNotice("Account created. Check your inbox to confirm, then sign in.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container-page py-16">
      <h1 className="font-brand text-3xl">Studio access</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in to manage category pictures. Only accounts with the admin role can save changes.
      </p>

      <form onSubmit={submit} className="mt-8 max-w-sm space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Email</span>
          <input
            type="email"
            required
            value={email}
            maxLength={255}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-pink-200 bg-background px-4 py-3 outline-none focus:border-pink-400"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Password</span>
          <input
            type="password"
            required
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-pink-200 bg-background px-4 py-3 outline-none focus:border-pink-400"
          />
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {notice && <p className="text-sm text-muted-foreground">{notice}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          className="text-sm text-muted-foreground underline"
        >
          {mode === "in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </form>
    </main>
  );
}
