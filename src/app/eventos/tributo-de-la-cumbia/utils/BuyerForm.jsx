import React from "react";
import "./style.css";

export default function BuyerForm({ buyer, setBuyer }) {
  return (
    <div className="tc-panel">
      <h3>Cadastro do comprador (nominal)</h3>
      <p className="tc-small">
        Os tickets serão enviados por e-mail informado abaixo.
      </p>

      <div className="tc-grid">
        <input
          placeholder="Nome completo"
          value={buyer.fullName}
          onChange={(e) =>
            setBuyer({ ...buyer, fullName: e.target.value })
          }
        />

        <input
          placeholder="CPF"
          value={buyer.cpf}
          onChange={(e) =>
            setBuyer({ ...buyer, cpf: e.target.value })
          }
        />

        <input
          placeholder="Telefone"
          value={buyer.phone}
          onChange={(e) =>
            setBuyer({ ...buyer, phone: e.target.value })
          }
        />

        <input
          placeholder="Email"
          type="email"
          value={buyer.email}
          onChange={(e) =>
            setBuyer({ ...buyer, email: e.target.value })
          }
        />
      </div>
    </div>
  );
}
