import { useState } from "react";
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

export default function SearchTransaction() {
  const [transactionId, setTransactionId] = useState("");
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionId.trim()) {
      setError("Ingresa un ID de transacción");
      return;
    }

    const id = parseInt(transactionId);
    if (isNaN(id)) {
      setError("El ID debe ser un número válido");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getTransactionById(id);
      setTransaction(data);
      setSearched(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Transacción no encontrada"
      );
      setTransaction(null);
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
      <h1 className="text-3xl font-bold mb-6">Buscar Transacción por ID</h1>

      <Card className="p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="number"
            placeholder="Ingresa ID de transacción"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
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

      {searched && !transaction && !error && (
        <Card className="p-6 text-center">
          <p className="text-gray-600">
            No se encontró una transacción con ese ID
          </p>
        </Card>
      )}

      {transaction && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Detalles de la Transacción</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">ID de Transacción</p>
              <p className="text-lg font-semibold">{transaction.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monto</p>
              <p className="text-lg font-semibold text-green-700">
                ${transaction.amount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cuenta Origen</p>
              <p className="text-lg font-mono">{transaction.senderAccountNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cuenta Destino</p>
              <p className="text-lg font-mono">{transaction.receiverAccountNumber}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Fecha y Hora</p>
              <p className="text-lg">{formatDate(transaction.timestamp)}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
