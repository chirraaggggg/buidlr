import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import LandingSection from "./_common/landing-section";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  
  return (
    <>
      <LandingSection user={user} />
    </>
  );
}
