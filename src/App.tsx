import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "@/hooks/use-auth";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

function HeaderAuth() {
  const { isAdmin, logout } = useAuth();
  return (
    <div className="fixed top-0 right-0 z-50 p-4">
      {!isAdmin ? (
        <Link to="/login"><Button size="sm" variant="secondary">Se connecter</Button></Link>
      ) : (
        <Button size="sm" variant="outline" onClick={logout}>Se déconnecter</Button>
      )}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <HeaderAuth />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
