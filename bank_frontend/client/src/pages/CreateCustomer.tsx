import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CreateCustomer() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !accountNumber || !balance) {
      setMessage({ type: "error", text: "Todos los campos son requeridos" });
      return;
    }

    const balanceNum = parseFloat(balance);
    if (isNaN(balanceNum) || balanceNum < 0) {
      setMessage({
        type: "error",
        text: "El saldo debe ser un número válido",
      });
      return;
    }

    try {
      setLoading(true);
      await api.createCustomer({
        firstName,
        lastName,
        accountNumber,
        balance: balanceNum,
      });

      setMessage({
        type: "success",
        text: "Cliente creado exitosamente",
      });
      setFirstName("");
      setLastName("");
      setAccountNumber("");
      setBalance("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Cliente</h1>

      <Card className="max-w-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre
            </label>
            <Input
              type="text"
              placeholder="Ej: Juan"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Apellido
            </label>
            <Input
              type="text"
              placeholder="Ej: Pérez"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Número de Cuenta
            </label>
            <Input
              type="text"
              placeholder="Ej: 1234567890"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Saldo Inicial
            </label>
            <Input
              type="number"
              placeholder="Ej: 1000.00"
              step="0.01"
              min="0"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? "Creando..." : "Crear Cliente"}
          </Button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}
      </Card>
    </div>
  );
}
