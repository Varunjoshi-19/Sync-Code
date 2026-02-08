import Topbar from "../Components/Topbar"

interface LayoutType { 
    children : React.ReactNode
}

export default function  Layout({children} : LayoutType) {
     return(
        <>
        <Topbar options={false} />
        {children}
        </>
     )
}

