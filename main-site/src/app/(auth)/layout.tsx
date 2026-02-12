import { LayoutType } from "../Interfaces"
import Topbar from "../Components/Topbar"
export default function  Layout({children} : LayoutType) {
     return(
        <>
        <Topbar options={false} />
        {children}
        </>
     )
}

