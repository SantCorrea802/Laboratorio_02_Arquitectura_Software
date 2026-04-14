import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Transaction {
  id: number;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  timestamp: string;
}

export default function History() {
  const [accountNumber, setAccountNumber] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountNumber.trim()) {
      setError("Ingresa un número de cuenta");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getTransactionsByAccount(accountNumber);
      setTransactions(data);
      setSearched(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener transacciones"
      );
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES");
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Historial de Transacciones</h1>

      <Card className="p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Ingresa número de cuenta"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </form>
      </Card>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200 mb-6">
          <p className="text-red-800">Error: {error}</p>
        </Card>
      )}

      {searched && transactions.length === 0 && !error && (
        <Card className="p-6 text-center">
          <p className="text-gray-600">
            No hay transacciones para esta cuenta
          </p>
        </Card>
      )}

      {transactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Cuenta Origen
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Cuenta Destino
                </th>
                <th className="px-4 py-3 text-right font-semibold">Monto</th>
                <th className="px-4 py-3 text-left font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{tx.id}</td>
                  <td className="px-4 py-3 font-mono text-sm">
                    {tx.senderAccountNumber}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm">
                    {tx.receiverAccountNumber}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-700">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(tx.timestamp)}
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
