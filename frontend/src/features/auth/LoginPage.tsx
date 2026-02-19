import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "./authApi";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const res = await login(data);
      localStorage.setItem("access_token", res.access_token);
      onSuccess();
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        "Login failed. Please try again.";
      setServerError(String(msg));
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            style={{ width: "100%", padding: 8 }}
            {...register("email")}
            placeholder="you@email.com"
          />
          {errors.email && (
            <p style={{ color: "crimson" }}>{errors.email.message}</p>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            style={{ width: "100%", padding: 8 }}
            {...register("password")}
            type="password"
            placeholder="******"
          />
          {errors.password && (
            <p style={{ color: "crimson" }}>{errors.password.message}</p>
          )}
        </div>

        {serverError && <p style={{ color: "crimson" }}>{serverError}</p>}

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}