import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import LandingSection from "./_common/landing-section";
import { CanvasProvider } from "../../../context/canvas-context";
import Canvas from "@/components/canvas";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  
  // Mock data for the landing page Canvas demo
  const frames: never[] = [];
  const themeId = "paper";
  const hasInitialData = false;

  return (
    <>
      <LandingSection user={user} />
      <div className="relative h-screen w-full flex flex-col">
        <CanvasProvider
          initialFrames={frames}
          initialTheme={themeId}
          hasInitialData={hasInitialData}
          projectId={undefined}
        >
          <div className="flex flex-1 overflow-hidden">
            <div className="relative h-full w-full">
              <Canvas/>
            </div>
          </div>
        </CanvasProvider>
      </div>
    </>
  );
}
