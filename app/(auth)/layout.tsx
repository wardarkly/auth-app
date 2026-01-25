import { GalleryVerticalEnd, Weight } from "lucide-react";
import { Inter, Kanit } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontKanit = Kanit({
  subsets: ["latin"],
  weight: ["200", "400", "100", "300", "500", "600", "700", "800", "900"],
});

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.className
      )}
    >
      <div
        className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient`}
      >
        <div className="container relative z-10 grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-2 md:gap-0 lg:py-20">
          {/* Left side - Branding */}
          <div className="flex flex-col items-center justify-center md:items-start">
            <div className="mb-6 flex items-center">
              <div className="mr-3 rounded-full bg-white/80 p-2 shadow-md">
                <Image
                  src="/hospital-logo.png"
                  alt="โรงพยาบาลบ้านนา Logo"
                  width={40}
                  height={40}
                  className="h-8 w-auto"
                />
              </div>
              <h1 className="text-2xl font-bold text-primary md:text-3xl font-kanit">
                โรงพยาบาลบ้านนา
              </h1>
            </div>

            <div className="mb-8 hidden space-y-4 md:block">
              <h2 className="text-4xl font-bold leading-tight text-muted-foreground font-kanit">
                ยินดีต้อนรับสู่ระบบ Lab Viewer
                <br />
              </h2>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex items-center justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
