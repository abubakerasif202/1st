import { Navigate, Route, Routes } from 'react-router-dom'
import { SeoHead } from '../components/common/SeoHead'
import { AdminGuard } from '../features/admin/AdminGuard'
import { AdminAuthProvider } from '../features/admin/auth'
import { AdminQuoteDetail } from '../features/admin/AdminQuoteDetail'
import { AdminQuotesList } from '../features/admin/AdminQuotesList'

export default function AdminSectionPage() {
  return (
    <section className="lovable-section">
      <SeoHead
        title="Admin | 1st Class Express"
        description="Internal freight quote management."
        noIndex
      />
      <div className="container-page">
        <AdminAuthProvider>
          <AdminGuard>
            <Routes>
              <Route index element={<Navigate to="quotes" replace />} />
              <Route path="quotes" element={<AdminQuotesList />} />
              <Route path="quotes/:reference" element={<AdminQuoteDetail />} />
              <Route path="*" element={<Navigate to="quotes" replace />} />
            </Routes>
          </AdminGuard>
        </AdminAuthProvider>
      </div>
    </section>
  )
}
