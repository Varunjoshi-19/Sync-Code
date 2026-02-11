import Topbar from "../Components/Topbar"

interface LayoutType {
    children: React.ReactNode
}

export default function OtherLayout({ children }: LayoutType) {
    return (
        <>
            <Topbar options={true} upgrade={true} />
            {children}
        </>
    )
}

