import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { company } from '../../data/company'

export function AnimatedLogoIntro() {
  const reduce = useReducedMotion()
  // Starts hidden so the prerendered HTML and the first client render agree;
  // the overlay is opted into after mount, where sessionStorage is readable.
  const [show, setShow] = useState(false)
  useEffect(() => {
    try {
      if (!window.sessionStorage.getItem('intro-seen')) setShow(true)
    } catch {
      // Restricted storage should never prevent the site from loading.
    }
  }, [])
  const closeIntro = useCallback(() => {
    setShow(false)
    window.requestAnimationFrame(() => document.getElementById('home-hero-title')?.focus())
  }, [])
  useEffect(() => {
    if (!show || reduce) return
    try {
      window.sessionStorage.setItem('intro-seen', 'true')
    } catch {
      // Restricted storage should never prevent the site from loading.
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(closeIntro, 2350)
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previousOverflow
    }
  }, [closeIntro, reduce, show])
  return <AnimatePresence>{show && !reduce && <motion.div className="intro-screen" initial={{opacity: 1}} exit={{opacity: 0, scale: 1.03}} transition={{duration: .4}} role="dialog" aria-modal="true" aria-label="1st Class Express opening animation" onKeyDown={(event) => {
    if (event.key === 'Tab') event.preventDefault()
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') closeIntro()
  }}>
    <button className="intro-skip" type="button" onClick={closeIntro} autoFocus>Skip intro</button>
    <div className="intro-ambient" />
    <motion.div className="intro-truck-plane" initial={reduce ? false : {opacity: 0, x: '20%', rotateY: -14}} animate={{opacity: .38, x: 0, rotateY: -8}} transition={{duration: 1.1, ease: 'easeOut'}}>
      <img src="/images/replacement/prime-mover-hero-branded.webp" alt="" />
    </motion.div>
    <div className="intro-perspective">
      <motion.div className="intro-logo-depth" initial={reduce ? false : {opacity: 0, rotateX: 56, rotateY: -34, z: -180, scale: .72}} animate={{opacity: 1, rotateX: 0, rotateY: 0, z: 0, scale: 1}} transition={{duration: 1.05, ease: [0.16, 1, 0.3, 1]}}>
        <span className="intro-logo-edge" />
        <img src="/brand/first-class-express-logo.webp" alt="" />
      </motion.div>
      <div className="intro-road-grid" />
      <div className="intro-road">
        <motion.i initial={{scaleX: 0}} animate={{scaleX: 1}} transition={{duration: .85, delay: .45}}/>
        <motion.i initial={{scaleX: 0}} animate={{scaleX: 1}} transition={{duration: .85, delay: .6}}/>
      </div>
    </div>
    <motion.p initial={reduce ? false : {opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{delay: .95}}>{company.tagline}</motion.p>
  </motion.div>}</AnimatePresence>
}
