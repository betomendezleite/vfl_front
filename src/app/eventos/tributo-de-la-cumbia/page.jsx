"use client";

import React, { useEffect, useState } from "react";
import "./style.css";
import BtnBistros from "./utils/btnBistros";
import BuyerForm from "./utils/BuyerForm";

export default function TicketCheckout() {
  const API_BASE = process.env.NEXT_PUBLIC_URL_API_BASE;

  const PRICE = 220;
  const HALF = 0.5;

  const [tab, setTab] = useState("ingresso");

  // ingresso
  const [quantity, setQuantity] = useState(1);
  const [hasMeia, setHasMeia] = useState(false);
  const [meiaCount, setMeiaCount] = useState(0);
  const [meiaPeople, setMeiaPeople] = useState([]);
  const [selectedArea, setSelectedArea] = useState("planta_baixa");

  // comprador
  const [buyer, setBuyer] = useState({
    fullName: "",
    cpf: "",
    phone: "",
    email: "",
  });

  // bistrô
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const selectedMesa = tables.find((t) => t.id === selectedTable);
  const totalMesa = selectedMesa ? selectedMesa.capacity * PRICE : 0;

  // feedback
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");

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
    async function fetchTables() {
      try {
        const resAlta = await fetch(`${API_BASE}/bistros/planta-alta`);
        const resBaixa = await fetch(`${API_BASE}/bistros/planta-baixa`);

        const alta = await resAlta.json();
        const baixa = await resBaixa.json();

        // 🔥 Filtrar en el front
        const now = new Date();
        const filtrar = (mesas) =>
          mesas.filter((mesa) => {
            if (mesa.status === "available") return true;

            if (mesa.status === "pending" && mesa.updatedAt) {
              const updated = new Date(mesa.updatedAt);
              const diffMin = (now - updated) / 1000 / 60; // diferencia en minutos
              return diffMin > 20; // solo mostrar si ya pasaron +2 minutos
            }

            return false;
          });

        setTables([...filtrar(alta), ...filtrar(baixa)]);
      } catch (err) {
        console.error(err);
      }
    }

    fetchTables();
  }, []);

  useEffect(() => {
    if (meiaCount > quantity) setMeiaCount(quantity);
  }, [quantity]);

  const totalFull = (quantity - meiaCount) * PRICE;
  const totalMeia = meiaCount * PRICE * HALF;
  const preciosIngressos = totalFull + totalMeia;
  const precioComTaxa = preciosIngressos * 0.05;
  const totalIngressos = preciosIngressos + precioComTaxa;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  async function handleBuy(e) {
    e.preventDefault();
    setErrors([]);
    setSuccess("");

    const validation = [];

    if (!buyer.fullName) validation.push("Nome do comprador é obrigatório.");
    if (!buyer.cpf) validation.push("CPF do comprador é obrigatório.");
    if (!buyer.phone) validation.push("Telefone é obrigatório.");
    if (!buyer.email) validation.push("Email é obrigatório.");

    if (tab === "ingresso") {
      if (quantity < 1) validation.push("Selecione pelo menos 1 ingresso.");
      if (hasMeia && meiaCount > 0) {
        meiaPeople.forEach((p, idx) => {
          if (!p.fullName)
            validation.push(`Beneficiário ${idx + 1}: nome obrigatório.`);
          if (!p.cpf)
            validation.push(`Beneficiário ${idx + 1}: CPF obrigatório.`);
          if (!p.docNumber)
            validation.push(`Beneficiário ${idx + 1}: documento obrigatório.`);
        });
      }
    } else if (tab === "bistrot") {
      if (!selectedTable) validation.push("Selecione uma mesa no bistrô.");
    }

    if (validation.length > 0) {
      setErrors(validation);
      return;
    }

    // Seguridad: tables siempre array antes de filtrar
    const plantaBaixa = Array.isArray(tables)
      ? tables.filter((t) => t.area === "planta_baixa")
      : [];
    const plantaAlta = Array.isArray(tables)
      ? tables.filter((t) => t.area === "planta_alta")
      : [];

    // construir payload
    const payload = {
      type: tab === "bistrot" ? "bistro" : "ingresso",
      cpf: buyer.cpf,
      quantity: tab === "bistrot" ? 1 : quantity,
      buyerName: buyer.fullName,
      buyerEmail: buyer.email,
      area:
        tab === "bistrot"
          ? plantaBaixa.find((t) => t.id === selectedTable)?.area ||
            plantaAlta.find((t) => t.id === selectedTable)?.area
          : selectedArea,
      bistroTableId: tab === "bistrot" ? selectedTable : null,
      total:
        tab === "bistrot"
          ? totalMesa.toFixed(2) // ✅ Usa el total de la mesa
          : totalIngressos.toFixed(2), // ✅ Usa el total de ingressos
      meiaCount: meiaCount,
      meiaPeople: meiaPeople,
    };

    try {
      console.log(payload);
      const res = await fetch(`${API_BASE}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao registrar pedido");
      }

      const data = await res.json();
      console.log("Respuesta del backend:", data);

      if (data.mpLink) {
        window.location.href = data.mpLink;
      }
    } catch (err) {
      console.log(err.message);
      setErrors([err.message]);
    }
  }

  // Seguridad: tables siempre array antes de filtrar
  const plantaBaixa = Array.isArray(tables)
    ? tables.filter((t) => t.area === "planta_baixa")
    : [];
  const plantaAlta = Array.isArray(tables)
    ? tables.filter((t) => t.area === "planta_alta")
    : [];

  return (
    <div className="tc-page">
      <div className="tc-card">
        <h1 className="tc-title">Compra de Tickets — Tributo a la Cumbia</h1>

        <div className="tc-tabs">
          <button
            className={"tc-tab " + (tab === "ingresso" ? "active" : "")}
            onClick={() => setTab("ingresso")}
          >
            Só ingresso
          </button>
          <button
            className={"tc-tab " + (tab === "bistrot" ? "active" : "")}
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

        <form onSubmit={handleBuy}>
          {tab === "ingresso" ? (
            /* ---- INGRESSOS ---- */
            <section>
              <div className="tc-map-images">
                <img src="/img/ingresos.jpg" alt="planta alta 1" />
              </div>
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
                  <p className="tc-small">
                    Valor unitário: R$ {PRICE.toFixed(2)}
                  </p>
                </div>
              </div>

              {hasMeia && (
                <div className="tc-panel">
                  <label className="tc-label">
                    Quantos serão meia-entrada?
                  </label>
                  <div className="tc-qty">
                    <button
                      type="button"
                      onClick={() =>
                        setMeiaCount((c) => clamp(c - 1, 0, quantity))
                      }
                    >
                      -
                    </button>
                    <input
                      value={meiaCount}
                      onChange={(e) =>
                        setMeiaCount(
                          clamp(Number(e.target.value) || 0, 0, quantity)
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setMeiaCount((c) => clamp(c + 1, 0, quantity))
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="tc-note">
                    Limite máximo: quantidade selecionada. Meia = 50%.
                  </p>

                  {meiaCount > 0 && (
                    <div className="tc-meia-list">
                      <h4>Dados dos beneficiários</h4>
                      <p className="tc-small">
                        Beneficiários: estudantes, idosos , PCD, jovens 15-29
                        (CadÚnico).
                      </p>
                      {meiaPeople.map((p, idx) => (
                        <div className="tc-grid" key={idx}>
                          <div>
                            <label className="tc-label">Nome completo</label>
                            <input
                              value={p.fullName}
                              onChange={(e) => {
                                const next = [...meiaPeople];
                                next[idx] = {
                                  ...next[idx],
                                  fullName: e.target.value,
                                };
                                setMeiaPeople(next);
                              }}
                            />
                          </div>
                          <div>
                            <label className="tc-label">CPF</label>
                            <input
                              value={p.cpf}
                              onChange={(e) => {
                                const next = [...meiaPeople];
                                next[idx] = {
                                  ...next[idx],
                                  cpf: e.target.value,
                                };
                                setMeiaPeople(next);
                              }}
                            />
                          </div>
                          <div>
                            <label className="tc-label">Categoria</label>
                            <select
                              value={p.category}
                              onChange={(e) => {
                                const next = [...meiaPeople];
                                next[idx] = {
                                  ...next[idx],
                                  category: e.target.value,
                                };
                                setMeiaPeople(next);
                              }}
                            >
                              <option value="estudante">Estudante</option>
                              <option value="idoso">Idoso </option>
                              <option value="pcd">
                                Pessoa com deficiência
                              </option>
                              <option value="jovem_cad">
                                Jovem 15-29 (CadÚnico)
                              </option>
                            </select>
                            <input
                              className="tc-small-input"
                              placeholder="Número do documento"
                              value={p.docNumber}
                              onChange={(e) => {
                                const next = [...meiaPeople];
                                next[idx] = {
                                  ...next[idx],
                                  docNumber: e.target.value,
                                };
                                setMeiaPeople(next);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* --- Nova seleção de planta --- */}
              <div className="tc-panel">
                <h3>Escolha a planta</h3>
                <div className="tc-areas">
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
              </div>

              <BuyerForm buyer={buyer} setBuyer={setBuyer} />

              <div className="tc-row tc-space">
                <h3>DETALHES</h3>
                <div>
                  <p className="tc-total">
                    Total ingressos: R$ {totalIngressos.toFixed(2)}
                  </p>
                  <p className="tc-small">
                    Full: {quantity - meiaCount} × R$ {PRICE.toFixed(2)} | Meia:{" "}
                    {meiaCount} × R$ {(PRICE * HALF).toFixed(2)} | Taxa de
                    Serviço R$ {precioComTaxa}
                  </p>
                </div>
                <div>
                  <button className="tc-buy" type="submit" onClick={handleBuy}>
                    Comprar
                  </button>
                </div>
              </div>

              {/* --- mapas --- */}
            </section>
          ) : (
            /* ---- BISTRÔ ---- */
            <section>
              <div className="tc-panel">
                <h3>Selecione sua mesa no bistrô</h3>

                <div className="tc-map">
                  <p className="tc-map-title">Planta Baixa</p>
                  <div className="tc-map-images">
                    <img
                      src="../../../img/planta_alta.jpg"
                      alt="planta baixa 1"
                    />
                    <img
                      src="../../../img/planta_baja.jpg"
                      alt="planta baixa 2"
                    />
                  </div>
                </div>
                <BtnBistros
                  tables={tables}
                  selectedTableId={selectedTable}
                  onSelect={(id) => setSelectedTable(id)}
                />

                {selectedTable && (
                  <p className="tc-total" style={{ marginTop: 12 }}>
                    Mesa escolhida: {selectedMesa?.name} — Total: R${" "}
                    {totalMesa.toFixed(2)}
                  </p>
                )}
              </div>
              <BuyerForm buyer={buyer} setBuyer={setBuyer} />

              <div className="tc-row tc-space">
                <button
                  className="tc-buy"
                  type="submit"
                  disabled={!selectedTable}
                  onClick={handleBuy}
                >
                  Comprar Bistrô
                </button>
              </div>
            </section>
          )}
        </form>

        <p className="tc-foot">
          Observação: Os pagamentos serão feitos pela plataforma do Mercado
          Pago.
        </p>
      </div>
    </div>
  );
}
