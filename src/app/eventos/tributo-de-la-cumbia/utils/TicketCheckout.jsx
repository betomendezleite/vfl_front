"use client";

import React, { useState } from "react";
import "./style.css";
import IngressoForm from "./utils/IngressoForm";
import BistroForm from "./utils/BistroForm";
import BuyerForm from "./utils/BuyerForm";

export default function TicketCheckout() {
  const [tab, setTab] = useState("ingresso");

  const [buyer, setBuyer] = useState({
    fullName: "",
    cpf: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");

  async function handleBuy(payload) {
    setErrors([]);
    setSuccess("");

    try {
      const res = await fetch("http://localhost:3100/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao registrar pedido");
      }

      const data = await res.json();
      setSuccess("Pedido registrado com sucesso! Código: " + data.order.id);
    } catch (err) {
      setErrors([err.message]);
    }
  }

  return (
    <div className="tc-page">
      <div className="tc-card">
        <h1 className="tc-title">Compra de Tickets — Tributo a la Cumbia</h1>

        <div className="tc-tabs">
          <button
            className={`tc-tab ${tab === "ingresso" ? "active" : ""}`}
            onClick={() => setTab("ingresso")}
          >
            Só ingresso
          </button>
          <button
            className={`tc-tab ${tab === "bistrot" ? "active" : ""}`}
            onClick={() => setTab("bistrot")}
          >
            Bistrôs
          </button>
        </div>

        {errors.length > 0 && (
          <div className="tc-errors">
            {errors.map((e, i) => (
              <p key={i}>{e}</p>
            ))}
          </div>
        )}
        {success && <div className="tc-success">{success}</div>}

        {tab === "ingresso" ? (
          <IngressoForm buyer={buyer} setBuyer={setBuyer} onBuy={handleBuy} />
        ) : (
          <BistroForm buyer={buyer} setBuyer={setBuyer} onBuy={handleBuy} />
        )}

        <p className="tc-foot">
          Observação: frontend de demonstração — integre com backend para
          pagamentos e emissão de tickets.
        </p>
      </div>
    </div>
  );
}
