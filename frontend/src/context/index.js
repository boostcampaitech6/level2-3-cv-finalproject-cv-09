import { createContext, useContext, useState } from "react";

const MakingContext = createContext([]);
const PromptContext = createContext([]);
// const BrandNameContext = createContext(null);

const useMakingState=()=> {
    const value = useContext(MakingContext);
    if (value === undefined) {
        throw new Error('useMakingState should be used within MakingProvider');
    }
    return value;
}
const usePromptState=()=> {
    const value = useContext(PromptContext);
    if (value === undefined) {
        throw new Error('usePromptState should be used within PromptProvider');
    }
    return value;
}
// const useBNState=()=> {
//     const value = useContext(BrandNameContext);
//     if (value === undefined) {
//         throw new Error('BrandNameContext should be used within NameProvider');
//     }
//     return value;
// }

// const NameProvider = ({children}) => {
//     const [brandName, setBrandName] = useState();
//     return(
//         <MakingContext.Provider value={brandName}>
//             {children}
//         </MakingContext.Provider>
//     )
// }

const MakingProvider = ({children}) => {
    const [checkItems, setCheckItems] = useState([]);
    return(
        <MakingContext.Provider value={[checkItems, setCheckItems]}>
            {children}
        </MakingContext.Provider>
    )
}
const PromptProvider = ({children}) => {
    const [koPrompt, setKoPrompt] = useState({Area:[],Purpose:[],BgColor:[],FontColor:[],Style:[]});
    return(
        <PromptContext.Provider value={[koPrompt, setKoPrompt]}>
            {children}
        </PromptContext.Provider>
    )
}

const useUpdateItems = () =>{
    const [checkItems, setCheckItems]=useMakingState();
    const updateItems = (item) => {
        if (!checkItems) {
            setCheckItems([item]); // checkItems가 정의되지 않은 경우, 새로운 배열로 초기화
        }if (checkItems.includes(item)) {
            setCheckItems(checkItems.filter((el) => el !== item)); //item 제거
            console.log('item_out', item);
        } else {
            setCheckItems([...checkItems, item])};
            console.log('item_in', item);
    }
    return {checkItems, updateItems};
}

const useKoPrompt = () =>{
    const promptByCategory = {
        Area: ['카페', '스포츠', '미용', '음식', '패션', '부동산', '음악', '학술', '숙박업'],
        Purpose: ['프로모션', '행사', '동아리', '대회', '콘서트', '캠페인', '축제', '공익', '광고'],
        BgColor: ['하얀색', '검정색', '그레이', '네이비', '빨간색', '초록색', '파란색', '보라색', '분홍색', '베이지색', '브라운', '주황색', '노란색', '민트색', '무지개색'],
        FontColor: ['흰색', '검정', '회색', '남색', '빨강', '초록', '파랑', '보라', '분홍', '베이지', '갈색', '주황', '노랑', '민트', '무지개'],
        Style: ['모던한', '고딕풍의', '심플한', '화려한', '빈티지한', '신비로운', '타이포그래피', '우아한', '추상적인']
    };
    const additionalPrompt = {
        카페: '커피', 
        스포츠: '공', 
        미용: '헤어, 반짝반짝', 
        음식: '음식', 
        패션: '옷, 신발', 
        부동산: '집, 아파트', 
        음악: '음표', 
        학술: '책, 펜', 
        숙박업: '침대'
    }
    const [koPrompt, setKoPrompt] = usePromptState();
    const setKoPromptList = (items) => {
        setKoPrompt({Area:[],Purpose:[],BgColor:[],FontColor:[],Style:[],Shape:[]})
        items.forEach(item => {
            const { Area, Purpose, BgColor, FontColor, Style } = promptByCategory;
            if (Area.includes(item)) {
                setKoPrompt(prevState => ({ ...prevState, Area: [...prevState.Area, item], Shape: [...prevState.Shape, additionalPrompt[item]] }));
                // setKoPrompt(prevState => ({ ...prevState, Shape: [...prevState.Shape, additionalPrompt[item]] }))
            } else if (Purpose.includes(item)) {
                setKoPrompt(prevState => ({ ...prevState, Purpose: [...prevState.Purpose, item] }));
            } else if (BgColor.includes(item)) {
                setKoPrompt(prevState => ({ ...prevState, BgColor: [...prevState.BgColor, item] }));
            } else if (FontColor.includes(item)) {
                setKoPrompt(prevState => ({ ...prevState, FontColor: [...prevState.FontColor, item] }));
            } else if (Style.includes(item)) {
                setKoPrompt(prevState => ({ ...prevState, Style: [...prevState.Style, item] }));
            }
        });
    };
    
    const prompt_sentence = () => {
        if (!koPrompt) {
            return "Prompt not available";
        }
        let area = koPrompt.Area.join(', ');
        let purpose = koPrompt.Purpose.join(', ');
        let area_purpose = '';
        let shape = koPrompt.Shape ? `로고에 들어가는 모양은 ${koPrompt.Shape.join(', ')}이다. `:'';
        let bg = koPrompt.BgColor ? `로고의 배경색은 ${koPrompt.BgColor.join(', ')}이다. `:'';
        let font = koPrompt.FontColor ? `로고의 글자색은 ${koPrompt.FontColor.join(', ')}이다. `:'';
        let style = koPrompt.Style ? `로고는 전체적으로 ${koPrompt.Style.join(', ')} 스타일이다. `:'';
        if (area!=='' && purpose !=='') {
            area_purpose = `${area} 관련된 ${purpose} 목적의 로고이다. `;
        } else if (area ==='' && purpose !=='') {
            area_purpose = `${purpose} 목적의 로고이다. `;
        } else if (area !=='' && purpose ==='') {
            area_purpose = `${area} 관련된 로고이다. `;
        }
        return area_purpose + shape + bg + font + style;
    }
    return {koPrompt, setKoPromptList, prompt_sentence};
}

export { MakingProvider, useMakingState, useUpdateItems, PromptProvider, useKoPrompt }