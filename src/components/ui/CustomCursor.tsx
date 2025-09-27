import React, { useEffect, useRef, useState } from 'react'

const CustomCursor: React.FC = () => {
  // Keep minimal state for click animation only
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Refs to DOM nodes for direct style updates without rerender
  const dotRef = useRef<HTMLDivElement | null>(null)
  const outlineRef = useRef<HTMLDivElement | null>(null)

  // Position refs
  const targetX = useRef(0)
  const targetY = useRef(0)
  const currentX = useRef(0)
  const currentY = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      targetX.current = e.clientX
      targetY.current = e.clientY
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    document.addEventListener('mousemove', updateMouse)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // Animation loop with light smoothing
    const render = () => {
      // linear interpolation for smooth trailing effect (tweak factor for responsiveness)
      const lerpFactor = 0.35
      currentX.current += (targetX.current - currentX.current) * lerpFactor
      currentY.current += (targetY.current - currentY.current) * lerpFactor

      if (dotRef.current && outlineRef.current) {
        const x = currentX.current
        const y = currentY.current
        dotRef.current.style.transform = `translate(${x - 2.5}px, ${y - 2.5}px)`
        outlineRef.current.style.transform = `translate(${x - 15}px, ${y - 15}px)`
        const opacity = isVisible ? '1' : '0'
        dotRef.current.style.opacity = opacity
        outlineRef.current.style.opacity = opacity
      }
      rafId.current = requestAnimationFrame(render)
    }

    rafId.current = requestAnimationFrame(render)

    return () => {
      document.removeEventListener('mousemove', updateMouse)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [isVisible])

  return (
    <>
      <div
        ref={dotRef}
        className={`cursor-dot ${isClicking ? 'scale-150' : 'scale-100'} transition-transform duration-150`}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          willChange: 'transform, opacity'
        }}
      />
      <div
        ref={outlineRef}
        className={`cursor-outline ${isClicking ? 'scale-50' : 'scale-100'} transition-transform duration-300`}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          willChange: 'transform, opacity'
        }}
      />
    </>
  )
}

export default CustomCursor