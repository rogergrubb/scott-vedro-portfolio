import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import './App.css'

// Easing curve - architectural precision
const ease = [0.16, 1, 0.3, 1]

// Animated reveal wrapper
const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 1, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Navigation - sparse and invisible until needed
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <>
      <motion.nav 
        className={`nav ${scrolled ? 'nav--visible' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="nav__inner">
          <a href="#" className="nav__logo">
            <span className="nav__logo-mark">SV</span>
          </a>
          
          <button 
            className={`nav__toggle ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
          </button>
          
          <div className="nav__links">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </motion.nav>
      
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="nav__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div 
              className="nav__menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.6, ease }}
            >
              <div className="nav__menu-links">
                {['Work', 'About', 'Contact'].map((item, i) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
              <div className="nav__menu-footer">
                <span>Scott Vedro, AIA</span>
                <span>San Francisco Bay Area</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Hero - full-bleed cinematic
const Hero = () => {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 800], [0, 200])
  const opacity = useTransform(scrollY, [0, 600], [1, 0])
  const scale = useTransform(scrollY, [0, 800], [1, 1.1])
  
  return (
    <section className="hero">
      <motion.div className="hero__media" style={{ y, scale }}>
        <div className="hero__image">
          {/* Architectural placeholder - geometric composition */}
          <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E8E4DE" />
                <stop offset="100%" stopColor="#D4CFC7" />
              </linearGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#heroGrad)"/>
            {/* Architectural forms */}
            <rect x="0" y="300" width="800" height="780" fill="#2D2926" opacity="0.06"/>
            <rect x="1200" y="0" width="720" height="600" fill="#B8A898" opacity="0.4"/>
            <rect x="600" y="400" width="500" height="680" fill="#C9B8A8" opacity="0.3"/>
            <rect x="1400" y="500" width="520" height="580" fill="#2D2926" opacity="0.05"/>
            {/* Vertical fins - GFRC reference */}
            {[...Array(12)].map((_, i) => (
              <rect key={i} x={150 + i * 50} y="350" width="3" height="400" fill="#2D2926" opacity="0.08"/>
            ))}
            {/* Light beam - electrochromic reference */}
            <rect x="1100" y="0" width="2" height="1080" fill="#C17F59" opacity="0.3"/>
            {/* Grid lines */}
            <line x1="0" y1="540" x2="1920" y2="540" stroke="#2D2926" strokeWidth="0.5" opacity="0.1"/>
            <line x1="960" y1="0" x2="960" y2="1080" stroke="#2D2926" strokeWidth="0.5" opacity="0.1"/>
          </svg>
        </div>
        <div className="hero__overlay"></div>
      </motion.div>
      
      <motion.div className="hero__content" style={{ opacity }}>
        <div className="hero__text">
          <motion.div 
            className="hero__name"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease }}
          >
            Scott Vedro, AIA
          </motion.div>
          
          <motion.h1 
            className="hero__title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease }}
          >
            Architecture as precision,<br />
            <em>light, and performance.</em>
          </motion.h1>
        </div>
        
        <motion.div 
          className="hero__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <div className="hero__scroll-line"></div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// Statement section
const Statement = () => {
  return (
    <section className="statement">
      <div className="container">
        <Reveal>
          <p className="statement__text">
            Creating buildings that respond to their environment—through sculptural form, 
            advanced material systems, and the intelligent orchestration of natural light. 
            Each project balances technical innovation with enduring design.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// Projects data
const projects = [
  {
    id: 'fremont-bank',
    title: 'Fremont Bank',
    subtitle: 'Corporate Headquarters',
    location: 'Fremont, CA',
    year: '2024',
    role: 'Senior Project Architect',
    description: 'A jewel box presence incorporating electrochromic glazing, sculptural GFRC vertical fins, and an animated LED facade system designed to engage the community.',
    innovations: ['Electrochromic Glass', 'GFRC Vertical Fins', 'Integrated LED Systems', 'Multi-layer Security'],
    color: '#C9B8A8',
    accent: '#C17F59'
  },
  {
    id: 'the-waymark',
    title: 'The Waymark',
    subtitle: 'Mixed-Use Development',
    location: 'Oakland, CA',
    year: '2023',
    role: 'Project Architect',
    description: 'Urban precision balancing residential density with activated ground-floor retail and civic plaza space. A study in contextual materiality.',
    innovations: ['Urban Infill', 'Ground-Floor Activation', 'Public Plaza Integration'],
    color: '#D4CFC7',
    accent: '#8B9080'
  },
  {
    id: '7600-monterey',
    title: '7600 Monterey',
    subtitle: 'Commercial Office',
    location: 'Gilroy, CA',
    year: '2022',
    role: 'Project Architect',
    description: 'Adaptive reuse transforming a mid-century structure into contemporary creative workspace while honoring its original architectural character.',
    innovations: ['Adaptive Reuse', 'Heritage Integration', 'Daylighting Optimization'],
    color: '#E0D8D0',
    accent: '#9B8B7A'
  },
  {
    id: 'millbrae-recreation',
    title: 'Millbrae Recreation Center',
    subtitle: 'Civic Architecture',
    location: 'Millbrae, CA',
    year: '2021',
    role: 'Project Architect',
    description: 'Community-focused recreation center designed for programmatic flexibility, abundant natural light, and seamless indoor-outdoor connection.',
    innovations: ['Community Design', 'Flexible Programming', 'Indoor-Outdoor Flow'],
    color: '#DED6CC',
    accent: '#7A8B9B'
  }
]

// Project Card - gallery exhibition style
const ProjectCard = ({ project, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [isHovered, setIsHovered] = useState(false)
  
  const isEven = index % 2 === 0
  
  return (
    <motion.article 
      ref={ref}
      className={`project ${isEven ? 'project--left' : 'project--right'}`}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 1, delay: 0.2, ease }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="project__image-wrapper">
        <motion.div 
          className="project__image"
          animate={{ scale: isHovered ? 1.03 : 1 }}
          transition={{ duration: 0.8, ease }}
        >
          <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id={`grad-${project.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={project.color} />
                <stop offset="100%" stopColor="#E8E4DE" />
              </linearGradient>
            </defs>
            <rect width="800" height="600" fill={`url(#grad-${project.id})`}/>
            {/* Architectural composition */}
            <rect x="50" y="100" width="300" height="400" fill={project.accent} opacity="0.2"/>
            <rect x="400" y="50" width="350" height="300" fill="#2D2926" opacity="0.06"/>
            <rect x="500" y="300" width="250" height="250" fill={project.accent} opacity="0.15"/>
            {/* Detail lines */}
            {[...Array(6)].map((_, i) => (
              <line key={i} x1={100 + i * 30} y1="150" x2={100 + i * 30} y2="450" stroke="#2D2926" strokeWidth="1" opacity="0.05"/>
            ))}
            <line x1="0" y1="300" x2="800" y2="300" stroke={project.accent} strokeWidth="1" opacity="0.3"/>
          </svg>
          <motion.div 
            className="project__image-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <span>View Case Study</span>
          </motion.div>
        </motion.div>
        <div className="project__index">
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>
      </div>
      
      <div className="project__content">
        <div className="project__meta">
          <span className="project__location">{project.location}</span>
          <span className="project__divider">·</span>
          <span className="project__year">{project.year}</span>
        </div>
        
        <h3 className="project__title">{project.title}</h3>
        <p className="project__subtitle">{project.subtitle}</p>
        
        <p className="project__description">{project.description}</p>
        
        <div className="project__innovations">
          {project.innovations.map((item, i) => (
            <span key={i} className="project__tag">{item}</span>
          ))}
        </div>
        
        <div className="project__role">
          <span className="project__role-label">Role</span>
          <span className="project__role-value">{project.role}</span>
        </div>
      </div>
    </motion.article>
  )
}

// Work Section
const Work = () => {
  return (
    <section id="work" className="work">
      <div className="container">
        <div className="work__header">
          <Reveal>
            <span className="section-label">Selected Works</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="section-title">
              Projects that define<br />
              <em>performance and craft</em>
            </h2>
          </Reveal>
        </div>
        
        <div className="projects">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
        
        <Reveal className="work__cta">
          <a href="#contact" className="cta-link">
            <span>View All Projects</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  )
}

// About Section
const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about__grid">
          <div className="about__image-col">
            <Reveal>
              <div className="about__image">
                <svg viewBox="0 0 500 650" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="aboutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E8E4DE" />
                      <stop offset="100%" stopColor="#D4CFC7" />
                    </linearGradient>
                  </defs>
                  <rect width="500" height="650" fill="url(#aboutGrad)"/>
                  {/* Portrait placeholder - architectural silhouette */}
                  <ellipse cx="250" cy="250" rx="120" ry="150" fill="#2D2926" opacity="0.08"/>
                  <rect x="130" y="380" width="240" height="200" fill="#C17F59" opacity="0.1"/>
                  {/* Frame lines */}
                  <rect x="30" y="30" width="440" height="590" fill="none" stroke="#2D2926" strokeWidth="1" opacity="0.1"/>
                </svg>
                <div className="about__image-frame"></div>
              </div>
            </Reveal>
          </div>
          
          <div className="about__content-col">
            <Reveal>
              <span className="section-label">About</span>
            </Reveal>
            
            <Reveal delay={0.1}>
              <h2 className="section-title">
                California modernism,<br />
                <em>technical rigor</em>
              </h2>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="about__text">
                <p>
                  As Principal Architect at Lathe Architecture, I lead projects that bridge 
                  sculptural ambition with technical precision. Over two decades of practice 
                  have honed an approach centered on material intelligence and systems thinking.
                </p>
                <p>
                  Each building is conceived as a performance system—responding to light, 
                  climate, and human occupation through carefully orchestrated assemblies of 
                  structure, skin, and space.
                </p>
                <p>
                  From adaptive reuse to ground-up commercial development, the work seeks to 
                  create lasting value through design excellence and technical innovation.
                </p>
              </div>
            </Reveal>
            
            <Reveal delay={0.3}>
              <div className="about__credentials">
                <div className="credential">
                  <span className="credential__value">AIA</span>
                  <span className="credential__label">Licensed Architect</span>
                </div>
                <div className="credential">
                  <span className="credential__value">20+</span>
                  <span className="credential__label">Years Practice</span>
                </div>
                <div className="credential">
                  <span className="credential__value">Lathe</span>
                  <span className="credential__label">Architecture Inc.</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// Contact Section
const Contact = () => {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact__grid">
          <div className="contact__content">
            <Reveal>
              <span className="section-label">Contact</span>
            </Reveal>
            
            <Reveal delay={0.1}>
              <h2 className="section-title">
                Start the<br />
                <em>conversation</em>
              </h2>
            </Reveal>
            
            <Reveal delay={0.2}>
              <p className="contact__intro">
                For inquiries about new projects, collaborations, or to discuss 
                how architecture can serve your vision—I welcome the conversation.
              </p>
            </Reveal>
          </div>
          
          <div className="contact__details">
            <Reveal delay={0.3}>
              <a href="mailto:svedro@lathearch.com" className="contact__link">
                <span className="contact__link-label">Email</span>
                <span className="contact__link-value">svedro@lathearch.com</span>
              </a>
            </Reveal>
            
            <Reveal delay={0.35}>
              <a href="tel:+14152152146" className="contact__link">
                <span className="contact__link-label">Direct</span>
                <span className="contact__link-value">415 215 2146</span>
              </a>
            </Reveal>
            
            <Reveal delay={0.4}>
              <div className="contact__link">
                <span className="contact__link-label">Location</span>
                <span className="contact__link-value">San Francisco Bay Area</span>
              </div>
            </Reveal>
            
            <Reveal delay={0.45}>
              <a href="https://www.lathearch.com" target="_blank" rel="noopener noreferrer" className="contact__link">
                <span className="contact__link-label">Practice</span>
                <span className="contact__link-value">Lathe Architecture →</span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <span className="footer__name">Scott Vedro, AIA</span>
            <span className="footer__role">Principal Architect</span>
          </div>
          
          <div className="footer__links">
            <a href="https://www.linkedin.com/in/scott-vedro-51542791/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://www.lathearch.com" target="_blank" rel="noopener noreferrer">
              Lathe Architecture
            </a>
          </div>
          
          <div className="footer__legal">
            <span>© {new Date().getFullYear()} Scott Vedro</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main App
function App() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Statement />
        <Work />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
