import NavbarComponent from "../components/navbar/page";
import TextTitleComponent from "../components/textTitle/textTitle";
import "./style.css";
import DataCountComponent from "./utils/dataCount";
export default function HomePage() {
  return (
    <div className="homePageClass">
      <div className="sectionPrincipal">
        <NavbarComponent />
        <DataCountComponent />
      </div>
      <div className="sectionQuienesSomos">
        <TextTitleComponent title={"QUIENES SOMOS?"} />
        <div className="textQuienesSomos">
          VFL MUSIC SHOWTIME es una empresa dedicada a la organización de shows
          y eventos musicales, con un enfoque especial en la difusión de la
          cultura latina de habla hispana en Brasil. Nuestro objetivo es acercar
          al público brasileño a la riqueza musical y artística de
          Latinoamérica, creando experiencias únicas que combinan
          entretenimiento, identidad cultural y pasión por la música. Cada
          evento que realizamos busca destacar artistas talentosos, promover la
          diversidad cultural y ofrecer al público momentos inolvidables.
        </div>
      </div>
      <div className="sectionEventos">
        <TextTitleComponent title={"EVENTOS"} />
        <div className="eventosWrapper">
          <div className="cardEvento">
            <img
              className="logoBuyTicket"
              src="img/logo_tributo.png"
              alt=""
              srcset=""
            />
            <div className="btnReserva">COMPRAR TICKET</div>
          </div>
        </div>
      </div>
      <div className="sectionContato">
        <TextTitleComponent title={"CONTACTO"} />
        <div>
          <img width={"100%"} src="img/rasgado_sup.svg" alt="" />
        </div>
        <div className="wrapperIcons">
          <div>
            <img src="img/tiktok.svg" alt="" srcset="" />
          </div>
          <div>
            <img src="img/instagram.svg" alt="" srcset="" />
          </div>
          <div>
            <img src="img/facebook.svg" alt="" srcset="" />
          </div>
        </div>
        <div>
          <img width={"100%"} src="img/rasgado_inf.svg" alt="" />
        </div>
      </div>
    </div>
  );
}
