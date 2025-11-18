"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Play, Table, AlertCircle } from "lucide-react";

interface Customer {
  id: number;
  nombre: string;
  ciudad: string;
  pais: string;
}

interface Order {
  id: number;
  customer_id: number;
  producto: string;
  cantidad: number;
  precio: number;
  fecha: string;
}

export default function SQLQueryBuilder() {
  // Database tables
  const customers: Customer[] = [
    { id: 1, nombre: "Ana Garcia", ciudad: "Madrid", pais: "España" },
    { id: 2, nombre: "John Smith", ciudad: "London", pais: "UK" },
    { id: 3, nombre: "Maria Silva", ciudad: "Lisboa", pais: "Portugal" },
    { id: 4, nombre: "Carlos Lopez", ciudad: "Barcelona", pais: "España" },
    { id: 5, nombre: "Sophie Martin", ciudad: "Paris", pais: "Francia" }
  ];

  const orders: Order[] = [
    { id: 101, customer_id: 1, producto: "Laptop", cantidad: 1, precio: 1200, fecha: "2024-01-15" },
    { id: 102, customer_id: 1, producto: "Mouse", cantidad: 2, precio: 25, fecha: "2024-01-16" },
    { id: 103, customer_id: 2, producto: "Teclado", cantidad: 1, precio: 80, fecha: "2024-01-17" },
    { id: 104, customer_id: 3, producto: "Monitor", cantidad: 2, precio: 300, fecha: "2024-01-18" },
    { id: 105, customer_id: 2, producto: "Laptop", cantidad: 1, precio: 1200, fecha: "2024-01-19" },
    { id: 106, customer_id: 4, producto: "Mouse", cantidad: 3, precio: 25, fecha: "2024-01-20" },
    { id: 107, customer_id: 5, producto: "Laptop", cantidad: 1, precio: 1200, fecha: "2024-01-21" },
    { id: 108, customer_id: 3, producto: "Teclado", cantidad: 2, precio: 80, fecha: "2024-01-22" }
  ];

  const [selectedQuery, setSelectedQuery] = useState<string>("select");
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [showTables, setShowTables] = useState<boolean>(true);

  const queries = [
    {
      id: "select",
      title: "SELECT básico",
      sql: "SELECT * FROM customers",
      description: "Seleccionar todos los registros"
    },
    {
      id: "where",
      title: "WHERE filter",
      sql: "SELECT * FROM customers\nWHERE pais = 'España'",
      description: "Filtrar clientes de España"
    },
    {
      id: "join",
      title: "INNER JOIN",
      sql: "SELECT customers.nombre, orders.producto, orders.precio\nFROM customers\nINNER JOIN orders ON customers.id = orders.customer_id",
      description: "Combinar clientes con sus pedidos"
    },
    {
      id: "groupby",
      title: "GROUP BY",
      sql: "SELECT customers.nombre, COUNT(orders.id) as total_pedidos\nFROM customers\nINNER JOIN orders ON customers.id = orders.customer_id\nGROUP BY customers.nombre",
      description: "Contar pedidos por cliente"
    },
    {
      id: "aggregate",
      title: "Agregación",
      sql: "SELECT producto, SUM(cantidad) as total, AVG(precio) as precio_avg\nFROM orders\nGROUP BY producto",
      description: "Estadísticas por producto"
    },
    {
      id: "orderby",
      title: "ORDER BY",
      sql: "SELECT * FROM orders\nORDER BY precio DESC",
      description: "Ordenar por precio descendente"
    }
  ];

  const executeQuery = (queryId: string) => {
    setSelectedQuery(queryId);
    let result: any[] = [];

    switch (queryId) {
      case "select":
        result = customers;
        break;

      case "where":
        result = customers.filter(c => c.pais === "España");
        break;

      case "join":
        result = orders.map(order => {
          const customer = customers.find(c => c.id === order.customer_id);
          return {
            nombre: customer?.nombre,
            producto: order.producto,
            precio: order.precio
          };
        });
        break;

      case "groupby":
        const grouped: { [key: string]: number } = {};
        orders.forEach(order => {
          const customer = customers.find(c => c.id === order.customer_id);
          if (customer) {
            grouped[customer.nombre] = (grouped[customer.nombre] || 0) + 1;
          }
        });
        result = Object.entries(grouped).map(([nombre, total_pedidos]) => ({
          nombre,
          total_pedidos
        }));
        break;

      case "aggregate":
        const productStats: { [key: string]: { total: number; sumPrecio: number; count: number } } = {};
        orders.forEach(order => {
          if (!productStats[order.producto]) {
            productStats[order.producto] = { total: 0, sumPrecio: 0, count: 0 };
          }
          productStats[order.producto].total += order.cantidad;
          productStats[order.producto].sumPrecio += order.precio;
          productStats[order.producto].count++;
        });
        result = Object.entries(productStats).map(([producto, stats]) => ({
          producto,
          total: stats.total,
          precio_avg: Math.round(stats.sumPrecio / stats.count)
        }));
        break;

      case "orderby":
        result = [...orders].sort((a, b) => b.precio - a.precio);
        break;
    }

    setQueryResult(result);
  };

  return (
    <div className="space-y-6">
      {/* Query Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {queries.map(query => (
          <button
            key={query.id}
            onClick={() => executeQuery(query.id)}
            className={`px-4 py-3 rounded-lg font-medium text-left transition-all ${
              selectedQuery === query.id
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="font-semibold">{query.title}</div>
            <div className={`text-xs mt-1 ${
              selectedQuery === query.id ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {query.description}
            </div>
          </button>
        ))}
      </div>

      {/* SQL Query Display */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Database className="w-4 h-4" />
            <span className="text-xs font-semibold">SQL Query</span>
          </div>
          <button
            onClick={() => executeQuery(selectedQuery)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            <span className="text-xs font-semibold">Ejecutar</span>
          </button>
        </div>
        <pre className="text-green-400 font-mono text-sm">
          {queries.find(q => q.id === selectedQuery)?.sql}
        </pre>
      </div>

      {/* Database Schema */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <button
          onClick={() => setShowTables(!showTables)}
          className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors"
        >
          <Table className="w-5 h-5" />
          Esquema de Base de Datos
          <span className="text-sm text-gray-500 ml-2">
            {showTables ? '▼' : '▶'}
          </span>
        </button>

        {showTables && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customers Table */}
            <div className="border-2 border-blue-200 rounded-lg overflow-hidden">
              <div className="bg-blue-500 text-white px-4 py-2 font-semibold">
                customers
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-3 py-2 text-left">id</th>
                      <th className="px-3 py-2 text-left">nombre</th>
                      <th className="px-3 py-2 text-left">ciudad</th>
                      <th className="px-3 py-2 text-left">pais</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.slice(0, 3).map(customer => (
                      <tr key={customer.id} className="border-b border-gray-200">
                        <td className="px-3 py-2">{customer.id}</td>
                        <td className="px-3 py-2">{customer.nombre}</td>
                        <td className="px-3 py-2">{customer.ciudad}</td>
                        <td className="px-3 py-2">{customer.pais}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-xs text-gray-500 px-3 py-2 bg-gray-50">
                  ... {customers.length} filas total
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="border-2 border-green-200 rounded-lg overflow-hidden">
              <div className="bg-green-500 text-white px-4 py-2 font-semibold">
                orders
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-3 py-2 text-left">id</th>
                      <th className="px-3 py-2 text-left">customer_id</th>
                      <th className="px-3 py-2 text-left">producto</th>
                      <th className="px-3 py-2 text-left">precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 3).map(order => (
                      <tr key={order.id} className="border-b border-gray-200">
                        <td className="px-3 py-2">{order.id}</td>
                        <td className="px-3 py-2">{order.customer_id}</td>
                        <td className="px-3 py-2">{order.producto}</td>
                        <td className="px-3 py-2">€{order.precio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-xs text-gray-500 px-3 py-2 bg-gray-50">
                  ... {orders.length} filas total
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Query Result */}
      {queryResult.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 flex items-center justify-between">
            <h3 className="font-bold">Resultado de la Query ({queryResult.length} filas)</h3>
            <Database className="w-5 h-5" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  {Object.keys(queryResult[0]).map(key => (
                    <th key={key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queryResult.map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                  >
                    {Object.values(row).map((value, vidx) => (
                      <td key={vidx} className="px-4 py-3 text-sm text-gray-700">
                        {typeof value === 'number' && value > 100 ? `€${value}` : String(value)}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* SQL Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          Conceptos Clave de SQL
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <strong className="text-blue-900">SELECT:</strong> Selecciona columnas de una tabla
          </div>
          <div>
            <strong className="text-blue-900">WHERE:</strong> Filtra filas según condiciones
          </div>
          <div>
            <strong className="text-blue-900">JOIN:</strong> Combina datos de múltiples tablas
          </div>
          <div>
            <strong className="text-blue-900">GROUP BY:</strong> Agrupa filas para agregaciones
          </div>
          <div>
            <strong className="text-blue-900">ORDER BY:</strong> Ordena resultados
          </div>
          <div>
            <strong className="text-blue-900">COUNT/SUM/AVG:</strong> Funciones de agregación
          </div>
        </div>
      </div>
    </div>
  );
}
