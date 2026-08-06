import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from '../components/layout/SiteLayout'
import routeSeo from '../data/routeSeo.json'

const HomePage = lazy(() => import('../pages/HomePage'))
const AboutPage = lazy(() => import('../pages/AboutPage'))
const ServicesPage = lazy(() => import('../pages/ServicesPage'))
const FleetPage = lazy(() => import('../pages/FleetPage'))
const ServiceAreasPage = lazy(() => import('../pages/ServiceAreasPage'))
const BookNowPage = lazy(() => import('../pages/BookNowPage'))
const ContactPage = lazy(() => import('../pages/ContactPage'))
const CareersPage = lazy(() => import('../pages/CareersPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export default function App() { return <Suspense fallback={<div className="page-loader" role="status">Loading 1st Class Express…</div>}><Routes><Route element={<SiteLayout/>}><Route index element={<HomePage/>}/><Route path={routeSeo.about.path} element={<AboutPage/>}/><Route path={routeSeo.services.path} element={<ServicesPage/>}/><Route path={routeSeo.fleet.path} element={<FleetPage/>}/><Route path={routeSeo.serviceAreas.path} element={<ServiceAreasPage/>}/><Route path={routeSeo.book.path} element={<BookNowPage/>}/><Route path={routeSeo.contact.path} element={<ContactPage/>}/><Route path={routeSeo.careers.path} element={<CareersPage/>}/><Route path="/about-us" element={<Navigate to="/about" replace/>}/><Route path="/our-services" element={<Navigate to="/services" replace/>}/><Route path="/our-fleet" element={<Navigate to="/fleet" replace/>}/><Route path="/book-now" element={<Navigate to="/quote" replace/>}/><Route path="*" element={<NotFoundPage/>}/></Route></Routes></Suspense> }
