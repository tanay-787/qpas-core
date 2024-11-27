import { Button } from "@/components/ui/button";
import NavBar from "./shared-components/NavBar";



export default function LandingPage() {

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary">
            <header className="bg-background/85 backdrop-blur-[3px] sticky top-0 z-50">
                <NavBar />
            </header>
            <main className="flex-grow content-center self-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to QPAS</h1>
                {/* <Button>Get Started</Button> */}
            </main>
            {/* <Footer /> */}
        </div>
    );
}