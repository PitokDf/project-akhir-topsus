import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FeatureLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Link
                href={"/admin"}
                className="px-3 py-2 flex inleft items-center gap-2 text-sm text-white hover:text-slate-200 bg-blue-500 w-fit rounded-md"
            >
                <ArrowLeft className="w-5 h-5" />
                back
            </Link>
            {children}
        </>
    );
}