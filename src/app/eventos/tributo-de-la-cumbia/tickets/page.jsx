"use client";
import { useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import "./style.css";

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
      const res = await fetch( `${process.env.NEXT_PUBLIC_URL_API_BASE}/api/tickets`, {
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
    <div className="bodyContent">
      <div>
        {" "}
        <img className="logoTributo" src="../../../img/logo_tributo.png" alt="" />
      </div>
      <h3 className="txtTitle">Verifica y descarga tus boletos</h3>
      <form onSubmit={handleSubmit} className="formContent">
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

        <button type="submit" className="btnReserva">
          Buscar boletos
        </button>
      </form>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      <div className="mt-8 flex flex-col gap-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="btnDowsWrapper">
            <div>
              <p className="font-bold">{ticket.evento}</p>
              <p>{ticket.nombre}</p>
              <p className="text-sm text-gray-300">{ticket.email}</p>
            </div>
            <button onClick={() => downloadPDF(ticket)} className="btnPdfDown">
              Descargar Ticket - PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
