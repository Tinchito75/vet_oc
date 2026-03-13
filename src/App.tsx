import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import Layout from '@/components/layout'
import OphthalmogramDemo from '@/pages/ophthalmogram-demo'
import OwnersPage from '@/pages/owners'
import OwnerForm from '@/pages/owner-form'
import PatientForm from '@/pages/patient-form'
import PatientDetails from '@/pages/patient-details'
import PatientsPage from '@/pages/patients'
import VisitForm from '@/pages/visit-form'
import VisitDetails from '@/pages/visit-details'
import SchedulePage from '@/pages/schedule'
import Dashboard from '@/pages/dashboard'
import BillingDashboard from '@/pages/billing-dashboard'
import { FinancialStats } from './components/admin/financial-stats'
import StudyRequestScreen from '@/pages/study-request'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/demo" element={<OphthalmogramDemo />} />
            <Route path="/owners" element={<OwnersPage />} />
            <Route path="/owners/new" element={<OwnerForm />} />
            <Route path="/owners/:id" element={<OwnerForm />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/owners/:ownerId/patients/new" element={<PatientForm />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
            <Route path="/patients/:id/visits/new" element={<VisitForm />} />
            <Route path="/visits/:id" element={<VisitDetails />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/estudios" element={<StudyRequestScreen />} />
            <Route path="/billing" element={<BillingDashboard />} />
            <Route path="/admin" element={<div className="max-w-6xl mx-auto"><FinancialStats /></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
