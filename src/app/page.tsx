import { auth } from "@/lib/auth";
import { headers } from "next/headers";
// import Image from "next/image";
import { redirect } from "next/navigation";
// import { authClient } from "@/lib/auth-client"; //import the auth client

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect("/admin");
  } else {
    return redirect("auth/sign-in");
  }
}
