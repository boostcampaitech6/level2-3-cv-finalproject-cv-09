import promotion from '../assets/Purpose_imgs/promotion.avif'
import event from '../assets/Purpose_imgs/event.avif'
import concert from '../assets/Purpose_imgs/concert.avif'
import festival from '../assets/Purpose_imgs/festival.avif'
import non_profit from '../assets/Purpose_imgs/non_profit.avif'
import public_announcement from '../assets/Purpose_imgs/public_announcement.avif'
import contest from '../assets/Purpose_imgs/contest.avif'
import advertise from '../assets/Purpose_imgs/advertise.avif'
import campaign from '../assets/Purpose_imgs/campaign.avif'


const PurposeData = [
    {
      img: promotion,
      title: '프로모션',
      rows: 1,
      cols: 1,
      featured: true,
      en_prompt: 'promotion',
      ko_prompt: '프로모션'
    },
    {
      img: event,
      title: '행사',
      rows: 1,
      cols: 1,
      featured: true,
      en_prompt: 'event',
      ko_prompt: '행사'
    },
    {
      img: non_profit,
      title: '비영리',
      rows: 1,
      cols: 1,
      featured: true,
      en_prompt: 'non-profit',
      ko_prompt: '비영리'
    },
    {
      img: contest,
      title: '대회',
      rows: 1,
      cols: 1,
      featured: true,
      en_prompt: 'Competition',
      ko_prompt: '대회'
    },
    {
      img: concert,
      title: '콘서트',
      rows: 1,
      cols: 1,
      featured: true,
      en_prompt: 'promotion',
      ko_prompt: '콘서트'
    },
    {
      img: campaign,
      title: '캠페인',
      rows: 1,
      cols: 1,
      featured: true,
      en_prompt: 'event',
      ko_prompt: '캠페인'
    },
    {
      img: festival,
      title: '축제',
      rows: 1,
      cols: 1,
      featured: true,
      en_prompt: 'non-profit',
      ko_prompt: '축제'
    },
    {
      img: public_announcement,
      title: '공익',
      rows: 1,
      cols: 1,
      featured: true,
      en_prompt: 'Competition',
      ko_prompt: '공익'
    },
    {
      img: advertise,
      title: '광고',
      rows: 1,
      cols: 1,
      featured: true,
      en_prompt: 'Competition',
      ko_prompt: '광고'
    },
  ];

  export default PurposeData;