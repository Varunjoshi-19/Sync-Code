import { LayoutType } from "../Interfaces";

export default function Layout({ children }: LayoutType) {
    return (
        <div>
            {children}
        </div>
    )
}