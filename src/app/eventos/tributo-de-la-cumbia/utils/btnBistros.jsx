import { useState, useEffect } from "react";
import "./style.css";

export default function BtnBistros() {
  const [dataAlta, setDataAlta] = useState([]);
  const [dataBaixa, setDataBaixa] = useState([]);

  // Função genérica para buscar bistrôs
  const fetchBistros = async (url, setter) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
      const data = await res.json();
      setter(data);
    } catch (error) {
      console.error("Erro ao buscar bistrôs:", error);
    }
  };

  useEffect(() => {
    fetchBistros("http://localhost:3100/bistros/planta-alta", setDataAlta);
    fetchBistros("http://localhost:3100/bistros/planta-baixa", setDataBaixa);
  }, []);

  return (
    <div className="containerBtn">
      <h3>PLANTA ALTA:</h3> <br />
      <div className="bistroGrid">
        {dataAlta.map((bistro) => (
          <div key={bistro.id} className="btnData">
            <div>Mesa: {bistro.name}</div>
            <div>({bistro.capacity} Pessoas)</div>
          </div>
        ))}
      </div>
      <br />
      <h3>PLANTA BAIXA: </h3>
      <br />
      <div className="bistroGrid">
        {dataBaixa.map((bistro) => (
          <div key={bistro.id} className="btnData">
            <div>Mesa: {bistro.name}</div>
            <div>({bistro.capacity} Pessoas)</div>
          </div>
        ))}
      </div>
    </div>
  );
}
