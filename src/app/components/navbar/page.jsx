import "./style.css";

export default function NavbarComponent() {
  return (
    <div className="contentNavbar">
      <div className="LogoBox">
        <img src="img/logo.png" alt="Logo VFL Music" />
      </div>
      <div className="navbar">
        <div>INICIO</div>
        <div>QUIENES SOMOS?</div>
        <div>EVENTOS</div>
        <div>CONTATO</div>
      </div>
    </div>
  );
}
