import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Customers from "./pages/Customers";
import Transfer from "./pages/Transfer";
import History from "./pages/History";
import CreateCustomer from "./pages/CreateCustomer";
import SearchTransaction from "./pages/SearchTransaction";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/customers"} component={Customers} />
      <Route path={"/create-customer"} component={CreateCustomer} />
      <Route path={"/transfer"} component={Transfer} />
      <Route path={"/history"} component={History} />
      <Route path={"/search-transaction"} component={SearchTransaction} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen flex flex-col">
            {/* Navegación */}
            <nav className="bg-blue-600 text-white shadow-md">
              <div className="container flex items-center justify-between py-4">
                <h1 className="text-xl font-bold">Bank App</h1>
                <ul className="flex gap-6">
                  <li>
                    <a
                      href="/"
                      className="hover:text-blue-100 transition"
                    >
                      Inicio
                    </a>
                  </li>
                  <li>
                    <a
                      href="/customers"
                      className="hover:text-blue-100 transition"
                    >
                      Clientes
                    </a>
                  </li>
                  <li>
                    <a
                      href="/create-customer"
                      className="hover:text-blue-100 transition"
                    >
                      Crear Cliente
                    </a>
                  </li>
                  <li>
                    <a
                      href="/transfer"
                      className="hover:text-blue-100 transition"
                    >
                      Transferencia
                    </a>
                  </li>
                  <li>
                    <a
                      href="/history"
                      className="hover:text-blue-100 transition"
                    >
                      Historial
                    </a>
                  </li>
                  <li>
                    <a
                      href="/search-transaction"
                      className="hover:text-blue-100 transition"
                    >
                      Buscar Transacción
                    </a>
                  </li>
                </ul>
              </div>
            </nav>

            {/* Contenido */}
            <main className="flex-1">
              <Router />
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 text-gray-600 text-center py-4 border-t">
              <p>Bank App - Sistema Bancario</p>
            </footer>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
