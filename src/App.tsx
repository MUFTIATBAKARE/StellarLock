import { Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { Landing } from "@/pages/Landing"
import { CreateLock } from "@/pages/CreateLock"
import { MyLocks } from "@/pages/MyLocks"
import { LockDetail } from "@/pages/LockDetail"
import { Explorer } from "@/pages/Explorer"

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/app/create" element={<CreateLock />} />
        <Route path="/app/locks" element={<MyLocks />} />
        <Route path="/app/lock/:id" element={<LockDetail />} />
        <Route path="/explore/:token" element={<Explorer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
