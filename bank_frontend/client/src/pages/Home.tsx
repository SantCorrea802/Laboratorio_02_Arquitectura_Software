import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Bienvenido a Bank App</h1>
          <p className="text-xl text-blue-100 mb-6">
            Sistema bancario para gestionar clientes y transacciones
          </p>
          <div className="flex gap-4">
            <a href="/customers">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Ver Clientes
              </Button>
            </a>
            <a href="/transfer">
              <Button variant="outline" className="border-white text-white hover:bg-blue-700">
                Realizar Transferencia
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Funcionalidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">Consultar Clientes</h3>
              <p className="text-gray-600">
                Visualiza la lista completa de clientes registrados con sus
                números de cuenta y saldos disponibles.
              </p>
              <a href="/customers" className="mt-4 inline-block">
                <Button variant="outline" className="w-full">
                  Ir a Clientes
                </Button>
              </a>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">Transferencias</h3>
              <p className="text-gray-600">
                Realiza transferencias de dinero entre cuentas de forma rápida y
                segura. Especifica la cuenta origen, destino y monto.
              </p>
              <a href="/transfer" className="mt-4 inline-block">
                <Button variant="outline" className="w-full">
                  Transferir Dinero
                </Button>
              </a>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">Historial</h3>
              <p className="text-gray-600">
                Consulta el historial completo de transacciones de cualquier
                cuenta con detalles de fecha, monto y cuentas involucradas.
              </p>
              <a href="/history" className="mt-4 inline-block">
                <Button variant="outline" className="w-full">
                  Ver Historial
                </Button>
              </a>
            </Card>
          </div>
        </div>
      </section>


    </div>
  );
}
