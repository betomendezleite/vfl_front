"use client";

import React from "react";
import "./style.css";

export default function BtnBistros({ tables, selectedTableId, onSelect }) {
  const plantaAlta = tables.filter((t) => t.area === "planta_alta");
  const plantaBaixa = tables.filter((t) => t.area === "planta_baixa");

  const renderBistro = (bistro) => (
    <div
      key={bistro.id}
      className={`btnData ${selectedTableId === bistro.id ? "btnDataActive" : ""}`}
      onClick={() => onSelect(bistro.id)}
    >
      <div>Mesa: {bistro.name}</div>
      <div>({bistro.capacity} Pessoas)</div>
    </div>
  );

  return (
    <div className="containerBtn">
      <h3>PLANTA ALTA:</h3>
      <div className="bistroGrid">{plantaAlta.map(renderBistro)}</div>

      <h3>PLANTA BAIXA:</h3>
      <div className="bistroGrid">{plantaBaixa.map(renderBistro)}</div>
    </div>
  );
}
