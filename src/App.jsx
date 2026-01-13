import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import './App.css'

// Easing curve - architectural precision
const ease = [0.16, 1, 0.3, 1]
const easeOut = [0.33, 1, 0.68, 1]

// Architectural Intro Loader
const IntroLoader = ({ onComplete }) => {
  const [phase, setPhase] = useState(0)
  
  useEffect(() => {
    // Phase timing
    const timers = [
      setTimeout(() => setPhase(1), 100),    // Start line drawing
      setTimeout(() => setPhase(2), 1200),   // Show SV
      setTimeout(() => setPhase(3), 2200),   // Start fade out
      setTimeout(() => onComplete(), 2800),  // Complete
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])
  
  // Line animation variants
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.2, delay: i * 0.1, ease: easeOut },
        opacity: { duration: 0.3, delay: i * 0.1 }
      }
    })
  }
  
  return (
    <motion.div 
      className="intro-loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase >= 3 ? 0 : 1 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="intro-loader__content">
        {/* Architectural grid lines */}
        <svg 
          className="intro-loader__grid"
          viewBox="0 0 400 400" 
          fill="none"
        >
          {/* Horizontal lines */}
          <motion.line 
            x1="0" y1="100" x2="400" y2="100" 
            stroke="#C17F59" strokeWidth="0.5"
            variants={lineVariants}
            initial="hidden"
            animate={phase >= 1 ? "visible" : "hidden"}
            custom={0}
          />
          <motion.line 
            x1="0" y1="200" x2="400" y2="200" 
            stroke="#C17F59" strokeWidth="0.5"
            variants={lineVariants}
            initial="hidden"
            animate={phase >= 1 ? "visible" : "hidden"}
            custom={1}
          />
          <motion.line 
            x1="0" y1="300" x2="400" y2="300" 
            stroke="#C17F59" strokeWidth="0.5"
            variants={lineVariants}
            initial="hidden"
            animate={phase >= 1 ? "visible" : "hidden"}
            custom={2}
          />
          
          {/* Vertical lines */}
          <motion.line 
            x1="100" y1="0" x2="100" y2="400" 
            stroke="#C17F59" strokeWidth="0.5"
            variants={lineVariants}
            initial="hidden"
            animate={phase >= 1 ? "visible" : "hidden"}
            custom={1}
          />
          <motion.line 
            x1="200" y1="0" x2="200" y2="400" 
            stroke="#C17F59" strokeWidth="0.5"
            variants={lineVariants}
            initial="hidden"
            animate={phase >= 1 ? "visible" : "hidden"}
            custom={2}
          />
          <motion.line 
            x1="300" y1="0" x2="300" y2="400" 
            stroke="#C17F59" strokeWidth="0.5"
            variants={lineVariants}
            initial="hidden"
            animate={phase >= 1 ? "visible" : "hidden"}
            custom={3}
          />
          
          {/* Diagonal accent */}
          <motion.line 
            x1="100" y1="300" x2="300" y2="100" 
            stroke="#C17F59" strokeWidth="1"
            variants={lineVariants}
            initial="hidden"
            animate={phase >= 1 ? "visible" : "hidden"}
            custom={4}
          />
          
          {/* Corner brackets - architectural detail */}
          <motion.path 
            d="M 80 80 L 80 120 M 80 80 L 120 80" 
            stroke="#2D2926" strokeWidth="1"
            variants={lineVariants}
            initial="hidden"
            animate={phase >= 1 ? "visible" : "hidden"}
            custom={3}
          />
          <motion.path 
            d="M 320 80 L 320 120 M 320 80 L 280 80" 
            stroke="#2D2926" strokeWidth="1"
            variants={lineVariants}
            initial="hidden"
            animate={phase >= 1 ? "visible" : "hidden"}
            custom={3}
          />
          <motion.path 
            d="M 80 320 L 80 280 M 80 320 L 120 320" 
            stroke="#2D2926" strokeWidth="1"
            variants={lineVariants}
            initial="hidden"
            animate={phase >= 1 ? "visible" : "hidden"}
            custom={4}
          />
          <motion.path 
            d="M 320 320 L 320 280 M 320 320 L 280 320" 
            stroke="#2D2926" strokeWidth="1"
            variants={lineVariants}
            initial="hidden"
            animate={phase >= 1 ? "visible" : "hidden"}
            custom={4}
          />
        </svg>
        
        {/* SV Logo reveal */}
        <motion.div 
          className="intro-loader__logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: phase >= 2 ? 1 : 0, 
            scale: phase >= 2 ? 1 : 0.8 
          }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="intro-loader__logo-text">SV</span>
          <motion.div 
            className="intro-loader__logo-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase >= 2 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease }}
          />
        </motion.div>
        
        {/* Tagline */}
        <motion.p 
          className="intro-loader__tagline"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: phase >= 2 ? 1 : 0, 
            y: phase >= 2 ? 0 : 10 
          }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
        >
          Architecture
        </motion.p>
      </div>
    </motion.div>
  )
}

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

// Hero - full-bleed cinematic with real image
const Hero = () => {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 800], [0, 200])
  const opacity = useTransform(scrollY, [0, 600], [1, 0])
  const scale = useTransform(scrollY, [0, 800], [1, 1.15])
  
  return (
    <section className="hero">
      <motion.div className="hero__media" style={{ y, scale }}>
        <div className="hero__image">
          <img 
            src="https://images.squarespace-cdn.com/content/v1/629f7ea45455bf40e552bb36/1729912589405-YZ7Q8V32ZVF1966NYTFT/Fremont+10-24+05.jpg" 
            alt="Fremont Bank Headquarters - Architectural facade with GFRC fins"
          />
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

// Projects data with real images from lathearch.com
const projects = [
  {
    id: 'fremont-bank',
    title: 'Fremont Bank',
    subtitle: 'Corporate Headquarters',
    location: 'Fremont, CA',
    year: '2024',
    role: 'Senior Project Architect',
    description: 'A jewel box presence incorporating electrochromic glazing, sculptural GFRC vertical fins, and an animated LED facade system designed to engage the community.',
    innovations: ['Electrochromic Glass', 'GFRC Vertical Fins', 'Integrated LED Systems'],
    image: 'https://images.squarespace-cdn.com/content/v1/629f7ea45455bf40e552bb36/1729912589405-YZ7Q8V32ZVF1966NYTFT/Fremont+10-24+05.jpg',
  },
  {
    id: 'springline',
    title: 'Springline',
    subtitle: 'Mixed-Use Campus',
    location: 'Menlo Park, CA',
    year: '2023',
    role: 'Project Architect',
    description: 'A LEED Gold certified development featuring residential towers, Class-A office space, and extensive amenities around a landscaped central courtyard.',
    innovations: ['LEED Gold', 'Mass Timber', 'Podium Design'],
    image: 'https://images.squarespace-cdn.com/content/v1/629f7ea45455bf40e552bb36/1655613487703-0PE3IVW15XZTLAF1Y7TN/LA+Springline+012.jpg',
  },
  {
    id: 'the-waymark',
    title: 'The Waymark',
    subtitle: 'Mixed-Use Development',
    location: 'Walnut Creek, CA',
    year: '2023',
    role: 'Project Architect',
    description: 'Urban precision balancing residential density with activated ground-floor retail and civic plaza space. A study in contextual materiality.',
    innovations: ['Urban Infill', 'Ground-Floor Activation', 'Public Plaza'],
    image: 'https://images.squarespace-cdn.com/content/v1/629f7ea45455bf40e552bb36/1676008390659-PBA3BQKF0P0FLCKF9INO/WM009.jpg',
  },
  {
    id: '550-ofarrell',
    title: "550 O'Farrell",
    subtitle: 'High-Rise Residential',
    location: 'San Francisco, CA',
    year: '2023',
    role: 'Project Architect',
    description: 'A 422 DU/Acre tower in the heart of San Francisco, maximizing density while creating a distinctive urban presence on the skyline.',
    innovations: ['High-Density Housing', 'Urban Tower', 'Transit-Oriented'],
    image: 'https://images.squarespace-cdn.com/content/v1/629f7ea45455bf40e552bb36/1702263318011-X47R28KC65WDVFS3MIHV/550+Street.jpg',
  },
  {
    id: 'field-house',
    title: 'Field House',
    subtitle: 'Bay Meadows',
    location: 'San Mateo, CA',
    year: '2022',
    role: 'Project Architect',
    description: 'Community amenity building anchoring the Bay Meadows master plan, designed to foster connection and serve as a neighborhood gathering space.',
    innovations: ['Community Hub', 'Master Plan Integration', 'Indoor-Outdoor'],
    image: 'https://images.squarespace-cdn.com/content/v1/629f7ea45455bf40e552bb36/1655611708507-DMAA0R6WBLHXWB9COR39/BM+COLOR+0690.jpg',
  },
  {
    id: '7600-monterey',
    title: '7600 Monterey',
    subtitle: 'Commercial Office',
    location: 'Gilroy, CA',
    year: '2022',
    role: 'Project Architect',
    description: 'Adaptive reuse transforming a mid-century structure into contemporary creative workspace while honoring its original architectural character.',
    innovations: ['Adaptive Reuse', 'Heritage Integration', 'Daylighting'],
    image: 'https://images.squarespace-cdn.com/content/v1/629f7ea45455bf40e552bb36/1655612112040-56D0C9HC0K8LLVUYBLP0/LA+GILROY_001.jpg',
  },
  {
    id: 'austin-energy',
    title: 'Austin Energy',
    subtitle: 'Corporate Headquarters',
    location: 'Austin, TX',
    year: '2021',
    role: 'Project Architect',
    description: 'A landmark headquarters for the municipal utility, featuring a dramatic courtyard and sustainable design strategies befitting an energy company.',
    innovations: ['Sustainable HQ', 'Courtyard Design', 'Civic Presence'],
    image: 'https://images.squarespace-cdn.com/content/v1/629f7ea45455bf40e552bb36/1676005518329-I52E1LTZMLODDQ4DSU37/Austin-Energy-courtyard+from+Harvey+Cleary.jpg',
  },
  {
    id: 'millbrae-recreation',
    title: 'Millbrae Recreation',
    subtitle: 'Civic Center',
    location: 'Millbrae, CA',
    year: '2021',
    role: 'Project Architect',
    description: 'Community-focused recreation center designed for programmatic flexibility, abundant natural light, and seamless indoor-outdoor connection.',
    innovations: ['Community Design', 'Flexible Programming', 'Natural Light'],
    image: 'https://images.squarespace-cdn.com/content/v1/629f7ea45455bf40e552bb36/1676010644422-DNBCGMU5Z1JYQ656OW84/MRC08.jpg',
  }
]

// Project Card - gallery exhibition style with parallax
const ProjectCard = ({ project, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [isHovered, setIsHovered] = useState(false)
  
  // Parallax effect on scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  
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
          animate={{ scale: isHovered ? 1.02 : 1 }}
          transition={{ duration: 0.8, ease }}
        >
          <motion.img 
            src={project.image} 
            alt={`${project.title} - ${project.subtitle}`}
            loading="lazy"
            style={{ y: imageY }}
          />
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
  const [loading, setLoading] = useState(true)
  
  return (
    <>
      <AnimatePresence>
        {loading && (
          <IntroLoader onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
      >
        <Navigation />
        <main>
          <Hero />
          <Statement />
          <Work />
          <About />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </>
  )
}

export default App
