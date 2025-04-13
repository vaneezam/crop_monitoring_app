import { redirect } from "next/navigation"
import { MapView } from "@/components/map-view"
import { Sidebar } from "@/components/sidebar"

export default function Home() {
  // In a real app, you would check authentication here
  const isAuthenticated = true

  if (!isAuthenticated) {
    redirect("/login")
  }

  return (
    <main className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <MapView />
    </main>
  )
}
