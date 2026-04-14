import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Transfer() {
  const [senderAccount, setSenderAccount] = useState("");
  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderAccount || !receiverAccount || !amount) {
      setMessage({ type: "error", text: "Todos los campos son requeridos" });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setMessage({
        type: "error",
        text: "El monto debe ser un número positivo",
      });
      return;
    }

    try {
      setLoading(true);
      await api.transferMoney({
        senderAccountNumber: senderAccount,
        receiverAccountNumber: receiverAccount,
        amount: amountNum,
      });

      setMessage({
        type: "success",
        text: "Transferencia realizada exitosamente",
      });
      setSenderAccount("");
      setReceiverAccount("");
      setAmount("");
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
      <h1 className="text-3xl font-bold mb-6">Realizar Transferencia</h1>

      <Card className="max-w-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Cuenta Origen
            </label>
            <Input
              type="text"
              placeholder="Ej: 1234567890"
              value={senderAccount}
              onChange={(e) => setSenderAccount(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Cuenta Destino
            </label>
            <Input
              type="text"
              placeholder="Ej: 0987654321"
              value={receiverAccount}
              onChange={(e) => setReceiverAccount(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Monto</label>
            <Input
              type="number"
              placeholder="Ej: 100.00"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Procesando..." : "Transferir"}
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
