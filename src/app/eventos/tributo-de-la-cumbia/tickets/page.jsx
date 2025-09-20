"use client";
import { useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";

export default function TicketsPage() {
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !cpf) {
      setError("Debe ingresar email y CPF.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3100/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cpf }),
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok || !data.tickets?.length) {
        setError(data.message || "No se encontraron boletos.");
        return;
      }

      setError("");
      setTickets(data.tickets);
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor.");
    }
  };

  const downloadPDF = async (ticket) => {
    const doc = new jsPDF();

    // Generar QR Code con datos del ticket
    const qrData = await QRCode.toDataURL(JSON.stringify(ticket.pedido_id));

    doc.setFontSize(18);
    doc.text("Ticket - Tributo a la cumbia", 20, 20);

    doc.setFontSize(12);
    doc.text(`ID: ${ticket.pedido_id}`, 20, 40);
    doc.text(`Nombre: ${ticket.buyer_name}`, 20, 50);
    doc.text(`Email: ${ticket.buyer_email}`, 20, 60);
    doc.text(`CPF: ${ticket.cpf}`, 20, 70);
    doc.text(`Evento: Tributo a la Cumbia`, 20, 80);
    doc.text(`Status: ${ticket.status}`, 20, 90);

    // Agregar QR al PDF
    doc.addImage(qrData, "PNG", 140, 40, 50, 50);

    doc.save(`boleto-${ticket.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#262626] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">
        Verifica y descarga tus boletos
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <input
          type="email"
          placeholder="Email"
          className="p-2 border border-white bg-transparent text-white rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="CPF"
          className="p-2 border border-white bg-transparent text-white rounded"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />

        <button
          type="submit"
          className="p-2 border border-white rounded hover:bg-white hover:text-black transition"
        >
          Buscar boletos
        </button>
      </form>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      <div className="mt-8 flex flex-col gap-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="border border-white p-4 rounded w-[400px] flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{ticket.evento}</p>
              <p>{ticket.nombre}</p>
              <p className="text-sm text-gray-300">{ticket.email}</p>
            </div>
            <button
              onClick={() => downloadPDF(ticket)}
              className="border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition"
            >
              Descargar PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
