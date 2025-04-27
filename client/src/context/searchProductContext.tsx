import { createContext, useContext, useState } from "react";

interface searchContextProps {
    searchProduct: string;
    setSearchProduct: (images: string) => void;
}

const SearchProductContext = createContext<searchContextProps>({
    searchProduct: "",
    setSearchProduct: () => { }
})

export const SearchProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchProduct, setSearchProduct] = useState<string>("")
    return <>
        <SearchProductContext.Provider value={{ searchProduct, setSearchProduct }}>
            {children}
        </SearchProductContext.Provider>
    </>
}

export const useSearchProduct = (): searchContextProps => {
    const context = useContext(SearchProductContext)
    if (!context) {
        throw new Error("userSearchProduct must be used within a SearchProductProvider");
    }
    return context;
}
