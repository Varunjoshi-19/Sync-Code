import Topbar from "../Components/Topbar";
import { LayoutType } from "../Interfaces";

export default function OtherLayout({ children }: LayoutType) {
    return (
        <>
            <Topbar options={true} upgrade={true} />
            {children}
        </>
    )
}

