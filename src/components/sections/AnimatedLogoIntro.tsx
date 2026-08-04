import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function AnimatedLogoIntro() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(() => !sessionStorage.getItem('intro-seen'))
  useEffect(() => {
    if (!show) return
    sessionStorage.setItem('intro-seen', 'true')
    const timer = window.setTimeout(() => setShow(false), reduce ? 150 : 1850)
    return () => window.clearTimeout(timer)
  }, [reduce, show])
  return <AnimatePresence>{show && <motion.div className="intro-screen" initial={{opacity: 1}} exit={{opacity: 0}} transition={{duration: reduce ? .05 : .35}} aria-hidden="true">
    <motion.img src="/brand/first-class-express-logo.png" alt="" initial={reduce ? false : {opacity: 0, scale: .9}} animate={{opacity: 1, scale: 1}} transition={{duration: .65}} />
    <div className="intro-road"><motion.i initial={{scaleX: 0}} animate={{scaleX: 1}} transition={{duration: .7, delay: .35}}/><motion.i initial={{scaleX: 0}} animate={{scaleX: 1}} transition={{duration: .7, delay: .5}}/></div>
    <motion.p initial={reduce ? false : {opacity: 0}} animate={{opacity: 1}} transition={{delay: .7}}>Committed to Deliver a Quality Service</motion.p>
  </motion.div>}</AnimatePresence>
}
