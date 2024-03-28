import React from "react"
import MainNav from "../components/MainNav";
import { Box, Grid } from "@mui/material";
import "./Devs.css"
const Devs = () =>{
    return(
        <div>
          <MainNav/>
          <Grid container direction="column"  justifyContent="center" alignItems="center">
            <Grid item>
              <Grid container direction="row"justifyContent="center"alignItems="center">
                <Grid item >
                  <div className="profile_card">
                    <h2>박상언</h2>
                    <h5 style={{paddingLeft: '40px'}}>
                      • 서비스 아키텍쳐 구성<br/>
                      • 프론트엔드 로직, 디자인<br/>
                      • 백엔드<br/>
                      • 모델 서빙<br/>
                      • GCP, GCS 서비스
                    </h5>
                  </div>
                </Grid>
                <Grid item >
                  <div className="profile_card">
                    <h2>송지민</h2>
                    <h5 style={{paddingLeft: '40px'}}>
                      • 모형 개발 팀원<br/>
                      • 데이터 수집<br/>
                      • SDXL LoRA Fine-tuning<br/>
                      • 모델 성능 최적화
                    </h5>
                  </div>
                </Grid>
                <Grid item >
                  <div className="profile_card">
                    <h2>오왕택</h2>
                    <h5 style={{paddingLeft: '40px'}}>
                      • Project Manager <br/>
                      • 프로젝트 기획 및 관리<br/>
                      • 개발 환경 및 Jira 환경 구축<br/>
                      • FrontEnd<br/>
                      • 모델 선행 연구 및 TextDiffuser-2<br/>
                      • Text Inpainting 모형 공부
                    </h5>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="row"justifyContent="center"alignItems="center">
                <Grid item>
                  <div className="profile_card">
                    <h2>이동호</h2>
                    <h5 style={{paddingLeft: '40px'}}>
                      • 데이터 수집 및 정제 <br/>
                      • Stable Diffusion 2, Deepfloyd<br/>
                      • Dreambooth, LoRa fine tuning<br/>
                      • GoogleTrans, T5 translator<br/>
                      • Detoxic BERT<br/>
                    </h5>
                  </div>
                </Grid>
                <Grid item>
                  <div className="profile_card">
                    <h2>이주헌</h2>
                    <h5 style={{paddingLeft: '40px'}}>
                      • Service 팀원 <br/>
                      • 데이터 수집, Github관리<br/>
                      • BackEnd<br/>
                      • 선정성 탐지 모형<br/>
                    </h5>
                  </div>
                </Grid>
                <Grid item>
                  <div className="profile_card">
                    <h2>지현동</h2>
                    <h5 style={{paddingLeft: '40px'}}>
                      • Front-End <br/>
                      • React, MUI 활용한 반응형 웹 제작<br/>
                      • useContext로 전역 변수 리팩토링<br/>
                      • 데이터 수집 및 라벨링<br/>
                      • BLIP QVA모델로 pseudo 라벨링<br/>
                    </h5>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          </div>
    );
}
export default Devs;