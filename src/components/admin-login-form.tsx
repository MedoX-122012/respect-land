"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Input, Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function AdminLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      toast("بيانات الدخول غير صحيحة", "error");
      return;
    }
    toast("تم تسجيل الدخول بنجاح");
    router.push("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="البريد الإلكتروني">
        <Input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="admin@respect.land"
          dir="ltr"
          autoComplete="email"
        />
      </Field>
      <Field label="كلمة المرور">
        <Input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
          dir="ltr"
          autoComplete="current-password"
        />
      </Field>
      <Button type="submit" className="w-full" size="lg" isLoading={loading}>
        {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
      </Button>
    </form>
  );
}