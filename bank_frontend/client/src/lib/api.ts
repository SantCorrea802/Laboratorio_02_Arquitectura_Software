// Configuración de la API
// Cambia esta URL según donde esté corriendo tu backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const api = {
  // Clientes
  getAllCustomers: async () => {
    const response = await fetch(`${API_BASE_URL}/customers`);
    if (!response.ok) throw new Error("Error al obtener clientes");
    return response.json();
  },

  getCustomerById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`);
    if (!response.ok) throw new Error("Error al obtener cliente");
    return response.json();
  },

  createCustomer: async (customerData: {
    firstName: string;
    lastName: string;
    accountNumber: string;
    balance: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error("Error al crear cliente");
    return response.json();
  },

  // Transacciones
  transferMoney: async (transferData: {
    senderAccountNumber: string;
    receiverAccountNumber: string;
    amount: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transferData),
    });
    if (!response.ok) throw new Error("Error al realizar transferencia");
    return response.json();
  },

  getTransactionsByAccount: async (accountNumber: string) => {
    const response = await fetch(
      `${API_BASE_URL}/transactions/${accountNumber}`
    );
    if (!response.ok) throw new Error("Error al obtener transacciones");
    return response.json();
  },

  getAllTransactions: async () => {
    const response = await fetch(`${API_BASE_URL}/transactions/all`);
    if (!response.ok) throw new Error("Error al obtener todas las transacciones");
    return response.json();
  },

  getTransactionById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/transactions/ids/${id}`);
    if (!response.ok) throw new Error("Error al obtener la transaccion");
    return response.json();
  },
};
