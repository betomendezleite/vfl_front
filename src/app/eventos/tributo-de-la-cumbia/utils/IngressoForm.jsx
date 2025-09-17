"use client";

import React, { useEffect, useState } from "react";
import BuyerForm from "./BuyerForm";

export default function IngressoForm({ buyer, setBuyer, onBuy }) {
  const PRICE = 200;
  const HALF = 0.5;

  const [quantity, setQuantity] = useState(1);
  const [hasMeia, setHasMeia] = useState(false);
  const [meiaCount, setMeiaCount] = useState(0);
  const [meiaPeople, setMeiaPeople] = useState([]);
  const [selectedArea, setSelectedArea] = useState("planta_baixa");

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  useEffect(() => {
    setMeiaPeople((prev) => {
      const next = prev.slice(0, meiaCount);
      while (next.length < meiaCount)
        next.push({
          fullName: "",
          cpf: "",
          category: "estudante",
          docNumber: "",
        });
      return next;
    });
  }, [meiaCount]);

  useEffect(() => {
    if (meiaCount > quantity) setMeiaCount(quantity);
  }, [quantity]);

  const totalFull = (quantity - meiaCount) * PRICE;
  const totalMeia = meiaCount * PRICE * HALF;
  const totalIngressos = totalFull + totalMeia;

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      type: "ingresso",
      cpf: buyer.cpf,
      quantity,
      meiaCount,
      buyerName: buyer.fullName,
      buyerEmail: buyer.email,
      area: selectedArea,
      bistroTableId: null,
    };

    onBuy(payload);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* quantidade e meia */}
      <div className="tc-row">
        <div className="tc-col">
          <label className="tc-label">Quantidade de ingressos</label>
          <div className="tc-qty">
            <button
              type="button"
              onClick={() => setQuantity((q) => clamp(q - 1, 1, 100))}
            >
              -
            </button>
            <input
              value={quantity}
              onChange={(e) =>
                setQuantity(clamp(Number(e.target.value) || 0, 1, 100))
              }
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => clamp(q + 1, 1, 100))}
            >
              +
            </button>
          </div>
        </div>

        <div className="tc-col tc-center">
          <label className="tc-checkbox">
            <input
              type="checkbox"
              checked={hasMeia}
              onChange={(e) => {
                setHasMeia(e.target.checked);
                if (!e.target.checked) setMeiaCount(0);
              }}
            />{" "}
            Habilitar meia-entrada
          </label>
        </div>

        <div className="tc-col tc-right">
          <p className="tc-small">Valor unitário: R$ {PRICE.toFixed(2)}</p>
        </div>
      </div>

      {/* meia entrada */}
      {hasMeia && (
        <div className="tc-panel">
          <label className="tc-label">Quantos serão meia-entrada?</label>
          <div className="tc-qty">
            <button
              type="button"
              onClick={() => setMeiaCount((c) => clamp(c - 1, 0, quantity))}
            >
              -
            </button>
            <input
              value={meiaCount}
              onChange={(e) =>
                setMeiaCount(clamp(Number(e.target.value) || 0, 0, quantity))
              }
            />
            <button
              type="button"
              onClick={() => setMeiaCount((c) => clamp(c + 1, 0, quantity))}
            >
              +
            </button>
          </div>
          {meiaCount > 0 &&
            meiaPeople.map((p, idx) => (
              <div className="tc-grid" key={idx}>
                <input
                  placeholder="Nome completo"
                  value={p.fullName}
                  onChange={(e) => {
                    const next = [...meiaPeople];
                    next[idx] = { ...next[idx], fullName: e.target.value };
                    setMeiaPeople(next);
                  }}
                />
                <input
                  placeholder="CPF"
                  value={p.cpf}
                  onChange={(e) => {
                    const next = [...meiaPeople];
                    next[idx] = { ...next[idx], cpf: e.target.value };
                    setMeiaPeople(next);
                  }}
                />
                <select
                  value={p.category}
                  onChange={(e) => {
                    const next = [...meiaPeople];
                    next[idx] = { ...next[idx], category: e.target.value };
                    setMeiaPeople(next);
                  }}
                >
                  <option value="estudante">Estudante</option>
                  <option value="idoso">Idoso (=60)</option>
                  <option value="pcd">Pessoa com deficiência</option>
                  <option value="jovem_cad">Jovem 15-29 (CadÚnico)</option>
                </select>
                <input
                  placeholder="Número do documento"
                  value={p.docNumber}
                  onChange={(e) => {
                    const next = [...meiaPeople];
                    next[idx] = { ...next[idx], docNumber: e.target.value };
                    setMeiaPeople(next);
                  }}
                />
              </div>
            ))}
        </div>
      )}

      {/* planta */}
      <div className="tc-panel">
        <h3>Escolha a planta</h3>
        <label>
          <input
            type="radio"
            name="area"
            value="planta_baixa"
            checked={selectedArea === "planta_baixa"}
            onChange={(e) => setSelectedArea(e.target.value)}
          />
          Planta Baixa
        </label>
        <label>
          <input
            type="radio"
            name="area"
            value="planta_alta"
            checked={selectedArea === "planta_alta"}
            onChange={(e) => setSelectedArea(e.target.value)}
          />
          Planta Alta
        </label>
      </div>

      <BuyerForm buyer={buyer} setBuyer={setBuyer} />

      <div className="tc-row tc-space">
        <p className="tc-total">
          Total ingressos: R$ {totalIngressos.toFixed(2)}
        </p>
        <button className="tc-buy" type="submit">
          Comprar
        </button>
      </div>
    </form>
  );
}
