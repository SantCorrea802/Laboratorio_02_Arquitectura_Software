import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  accountNumber: string;
  balance: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await api.getAllCustomers();
        setCustomers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-800">Error: {error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Consultar Clientes</h1>

      {customers.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600">No hay clientes registrados</p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                <th className="px-4 py-3 text-left font-semibold">Apellido</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Número de Cuenta
                </th>
                <th className="px-4 py-3 text-right font-semibold">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{customer.id}</td>
                  <td className="px-4 py-3">{customer.firstName}</td>
                  <td className="px-4 py-3">{customer.lastName}</td>
                  <td className="px-4 py-3 font-mono text-sm">
                    {customer.accountNumber}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-green-700">
                    ${customer.balance.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
