import "./style.css";

export default function TextTitleComponent({title}) {
  return (
    <div className="titleWrapper">
      <div className="titleInferior">{title}</div>
      <div className="titleSuperior">{title}</div>
    </div>
  );
}
