import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) navigate("/");
    else setError("Identifiants invalides");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-card p-6 rounded border border-border">
        <h1 className="text-2xl font-bold text-foreground">Connexion Admin</h1>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Identifiant</label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Mot de passe</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
    </div>
  );
};

export default Login;


