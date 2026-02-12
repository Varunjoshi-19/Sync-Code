import dynamic from "next/dynamic"
import { LayoutType } from "../Interfaces"
const Topbar = dynamic(() => import("../Components/Topbar"), {
    ssr: false,
})

export default function PlansLayout({ children }: LayoutType) {
    return (
        <>
            <Topbar options={false} />
            {children}
        </>
    )
}

