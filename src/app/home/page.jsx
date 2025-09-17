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
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, 
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
          <div><img src="img/tiktok.svg" alt="" srcset="" /></div>
          <div><img src="img/instagram.svg" alt="" srcset="" /></div>
          <div><img src="img/facebook.svg" alt="" srcset="" /></div>
        </div>
        <div>
          <img width={"100%"} src="img/rasgado_inf.svg" alt="" />
        </div>
      </div>
    </div>
  );
}
