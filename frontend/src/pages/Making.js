import { useLocation } from "react-router";
import MakingNav from "../components/MakingNav";
import './Making.css';

const Making = () =>{
    let location = useLocation();
    const name = location.state?.content;
    return(
        <div>
          <MakingNav />
          <mian>
            <section >
                <div class='container' style={{paddingTop: "100px"}}>
              <h2>{name}라는 로고를 만들게요.</h2>
              <h2>먼저 어디 사용할 로고인지 알려주세요!</h2>
              <div class="button_margin">
                <ul class="button_list">
                <li class="li"><button class="button">음식점</button></li>
                <li class="li"><button class="button">행사</button></li>
                <li class="li"><button class="button">대회</button></li>
                <li class="li"><button class="button">기타</button></li>
                </ul>
              </div>
              </div>
            </section>
          </mian>
          </div>
    );
}

export default Making;