import { getUserDTO } from "@/lib/dto"
import { NavbarClient } from "./navbar-client"

export async function Navbar() {
  const user = await getUserDTO()
  
  return <NavbarClient user={user} />
}
