import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from '../components/layout/SiteLayout'

const HomePage = lazy(() => import('../pages/HomePage'))
const AboutPage = lazy(() => import('../pages/AboutPage'))
const ServicesPage = lazy(() => import('../pages/ServicesPage'))
const FleetPage = lazy(() => import('../pages/FleetPage'))
const BookNowPage = lazy(() => import('../pages/BookNowPage'))
const ContactPage = lazy(() => import('../pages/ContactPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export default function App() { return <Suspense fallback={<div className="page-loader" role="status">Loading 1st Class Express…</div>}><Routes><Route element={<SiteLayout/>}><Route index element={<HomePage/>}/><Route path="about-us" element={<AboutPage/>}/><Route path="our-services" element={<ServicesPage/>}/><Route path="our-fleet" element={<FleetPage/>}/><Route path="book-now" element={<BookNowPage/>}/><Route path="contact" element={<ContactPage/>}/><Route path="*" element={<NotFoundPage/>}/></Route></Routes></Suspense> }
