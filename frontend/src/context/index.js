import { createContext, useContext, useState } from "react";

const MakingContext = createContext([]);
// const BrandNameContext = createContext(null);

const useMakingState=()=> {
    const value = useContext(MakingContext);
    if (value === undefined) {
        throw new Error('useMakingState should be used within MakingProvider');
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
    // const value = [checkItems, setCheckItems];
    return(
        <MakingContext.Provider value={[checkItems, setCheckItems]}>
            {children}
        </MakingContext.Provider>
    )
}
const useUpdateItems = () =>{
    const [checkItems, setCheckItems]=useMakingState();
    // const [item, setItem] = useState
    const updateItems = (title) => {
        if (!checkItems) {
            setCheckItems([title]); // checkItems가 정의되지 않은 경우, 새로운 배열로 초기화
        }if (checkItems.includes(title)) {
            setCheckItems(checkItems.filter((el) => el !== title)); //item 제거
            console.log('item_out', title);
        } else {
            setCheckItems([...checkItems, title])};
            console.log('item_in', title);
    }
    return {checkItems, updateItems};
}


export {MakingProvider, useMakingState, useUpdateItems }