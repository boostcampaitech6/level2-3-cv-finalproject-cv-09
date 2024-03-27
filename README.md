# 🖼️ K-Logo Gen
[![video](https://img.shields.io/badge/Video-Presentation-F9D371)](https://youtu.be/-TJc_Sb6EOA)
[![slides](https://img.shields.io/badge/Presentation-Slides-B762C1)](https://docs.google.com/presentation/d/1fsTnZFHb64v7twtQSQ03_ahk-SpKlLhi8-PQzvXCQQ8/edit?usp=sharing)
[![homepage](https://img.shields.io/badge/service-page-blue)](http://www.klogogen.studio)
[![notion](https://img.shields.io/badge/notion-page-black)](https://www.notion.so/boostcampait/CV-09-SCV-K-Logo-Gen-d0bb6092d3084777a5b944953f6f4be1?pvs=4)

사용자가 원하는 Prompt 입력을 통해서 로고를 제작해주는 프로그램입니다.

사업분야나 색 표현, 피사체 등을 Prompt에 입력하여 4가지 모델을 통해 생성된 로고를 체험할 수 있습니다.
지금 서비스 주소를 통해 원하는 로고를 만들어 보세요!

서비스 주소 : http://www.klogogen.studio (서비스 기간 : ~4/2)



## SCV 팀 소개 (Naver Boostcamp AI Tech Computer Vision - 09)
| 이름 | 역할 |
| --------- | --- |
| [오왕택](https://github.com/ohkingtaek) | PM, 프로젝트 기획 및 관리, FrontEnd, TextDiffuser-2 |
| [박상언](https://github.com/PSangEon) | Service 팀원, BackEnd, FrontEnd |
| [지현동](https://github.com/tolfromj) | Service 팀원, 데이터 수집 및 레이블링, FrontEnd |
| [이주헌](https://github.com/LeeJuheonT6138) | Service 팀원, 데이터 수집, Github 관리, BackEnd, 선정성 탐지 모형 |
| [이동호](https://github.com/as9786) | 모형 개발 팀원, 사업 제안, SD 2.0, DeepFloyd IF, 선정성 탐지 모형 |
| [송지민](https://github.com/Remiing) | 모형 개발 팀원, 데이터 수집, SDXL LoRA Fine-tuning, 모델 성능 최적화 |

## 프로젝트 타임라인
<p>
  <img src="https://github.com/boostcampaitech6/level2-3-cv-finalproject-cv-09/assets/49676680/ff83f1c6-2f95-44a4-adc9-7d0c41e55012" alt="timeline" width="70%" height="70%"/>
</p>

## 프로젝트 소개
<p align="center">
  <img src="https://github.com/boostcampaitech6/level2-3-cv-finalproject-cv-09/assets/49676680/17ae841e-ecdb-4791-b3a7-6f35e5027270" alt="introduction" width="50%" height="60%"/>
</p>

- 배경
    - 로고 디자인은 모든 기업에게 중요한 심미적 요소이며, 스타트업이나 자영업자, 브랜드를 정립하지 못한 기업에서 다양한 시안을 구하는 데 어려움이 있음
    - 외주나 자체적으로 로고를 제작하는 비용이 굉장히 많이 필요
    - 작은 가게나 축제, 일회성으로 필요한 기관들도 큰 예산을 투자하기 어려움
- 기대효과
    - 딥러닝이 생성한 로고가 속도와 편의성 측면에서 전문 로고 디자이너가 만든 로고보다 우위를 가짐
    - 훨씬 저렴한 비용으로 로고를 생성할 수 있음
    - 로고 제작 전에 후보군을 선정해서 원하는 로고 느낌을 찾을 수 있음
    - AI 생성 모형들이 글자 생성에 취약하므로 한계를 극복하고자 함
    - 편의성 및 오락적인 요소

## 서비스 아키텍처
<p align="center">
  <img src="https://github.com/boostcampaitech6/level2-3-cv-finalproject-cv-09/assets/49676680/1c897cf8-0cb9-4030-ad74-70a7be2e92b4" alt="service" width="70%" height="70%"/>
</p>

## Acknowledgement
The model codes used were [Stable Diffusion2](https://github.com/Stability-AI/stablediffusion), [Stable Diffusion XL](https://github.com/Stability-AI/generative-models), [DeepFloyd IF](https://github.com/deep-floyd/IF), and [TextDiffuser-2](https://github.com/microsoft/unilm/tree/master/textdiffuser-2).

Other models used were [CRAFT](https://github.com/clovaai/CRAFT-pytorch), [parseq](https://github.com/baudm/parseq) for OCR, [googletrans](https://github.com/ssut/py-googletrans) for translation, and [BLIP-VQA](https://github.com/salesforce/LAVIS) for image captioning.
