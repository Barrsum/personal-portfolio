import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './App.css';

// Theme context
const ThemeContext = React.createContext();

// Floating 3D Shapes Component
function FloatingShapes({ theme }) {
  const shapes = [];
  const colors = theme === 'dark' ? ['#ff0080', '#00ffff', '#ff8000'] : 
                 theme === 'blue' ? ['#4a90ff', '#00d4ff', '#8b5cf6'] :
                 ['#3b82f6', '#06b6d4', '#8b5cf6'];
  
  for (let i = 0; i < 15; i++) {
    shapes.push(
      <Float key={i} speed={2} rotationIntensity={1} floatIntensity={0.5}>
        <mesh
          position={[
            Math.random() * 20 - 10,
            Math.random() * 20 - 10,
            Math.random() * 20 - 10
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        >
          {i % 3 === 0 ? (
            <boxGeometry args={[0.5, 0.5, 0.5]} />
          ) : i % 3 === 1 ? (
            <sphereGeometry args={[0.3, 16, 16]} />
          ) : (
            <octahedronGeometry args={[0.4]} />
          )}
          <meshStandardMaterial 
            color={colors[i % colors.length]} 
            emissive={colors[i % colors.length]}
            emissiveIntensity={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
      </Float>
    );
  }
  return <>{shapes}</>;
}

// 3D Hero Text Component  
function Hero3DText({ theme }) {
  const color = theme === 'dark' ? '#ffffff' : 
                theme === 'blue' ? '#e2e8f0' : '#1f2937';
  
  return (
    <group position={[0, 0, 0]}>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.3}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={1.5}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          position={[-3.5, 0, 0]} // Center the text by offsetting half the width
        >
          RAM BAPAT
          <meshStandardMaterial 
            color={color}
            emissive={theme === 'dark' ? '#ff0080' : '#3b82f6'}
            emissiveIntensity={0.1}
          />
        </Text3D>
      </Float>
    </group>
  );
}

// Theme Toggle Component
function ThemeToggle({ theme, setTheme }) {
  const themes = ['dark', 'blue', 'light'];
  const themeNames = ['Pure Dark', 'Blue Dark', 'Light'];
  
  const nextTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };
  
  return (
    <motion.button
      onClick={nextTheme}
      className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
        theme === 'dark' ? 'bg-black border-white text-white hover:bg-gray-900' :
        theme === 'blue' ? 'bg-slate-900 border-blue-400 text-blue-400 hover:bg-slate-800' :
        'bg-white border-gray-800 text-gray-800 hover:bg-gray-100'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {themeNames[themes.indexOf(theme)]}
    </motion.button>
  );
}

// Hero Section
function HeroSection({ theme }) {
  const [ref, inView] = useInView({ threshold: 0.1 });
  
  useEffect(() => {
    // Using CSS-based animation instead of anime.js for better compatibility
    if (inView) {
      const subtitle = document.querySelector('.hero-subtitle');
      if (subtitle) {
        subtitle.style.transition = 'all 1s ease-out';
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'translateY(0)';
      }
    }
  }, [inView]);
  
  return (
    <section 
      ref={ref}
      className={`relative h-screen overflow-hidden ${
        theme === 'dark' ? 'bg-black' :
        theme === 'blue' ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' :
        'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'
      }`}
    >
      {/* 3D Canvas */}
      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 10], fov: 75 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Hero3DText theme={theme} />
          <FloatingShapes theme={theme} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      
      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <div className={`hero-subtitle text-xl md:text-2xl transition-all duration-1000 ease-out opacity-0 translate-y-12 ${inView ? 'opacity-100 translate-y-0' : ''} ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Full Stack Developer • AI Enthusiast • 3rd Year CS Student
          </div>
          <div className={`mt-4 text-lg ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Building the future, one project at a time
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10"
        >
          <div className={`animate-bounce ${
            theme === 'light' ? 'text-gray-600' : 'text-white'
          }`}>
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// About Section
function AboutSection({ theme }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  
  const skills = [
    'Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'GCP', 
    'Firebase', 'MERN Stack', 'Cloud Computing', 'AI/ML'
  ];
  
  return (
    <section 
      ref={ref}
      className={`min-h-screen py-20 px-6 ${
        theme === 'dark' ? 'bg-black text-white' :
        theme === 'blue' ? 'bg-slate-900 text-white' :
        'bg-white text-gray-900'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-center mb-16"
        >
          About Me
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold mb-6">
              Hi, I'm Ram Bapat! 👋
            </h3>
            <p className={`text-lg mb-6 leading-relaxed ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              A passionate 20-year-old B.Tech Computer Science student at VIT Bhopal, 
              specializing in Cloud Computing & Automation. Born on July 11, 2004, 
              I've been on an incredible journey of building innovative solutions.
            </p>
            <p className={`text-lg mb-6 leading-relaxed ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              With over 70 projects under my belt and counting, I'm constantly 
              pushing the boundaries of what's possible with technology. My recent 
              30-day coding challenge showcased my dedication to continuous learning.
            </p>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    theme === 'dark' ? 'bg-gray-800 text-cyan-400 border border-cyan-400' :
                    theme === 'blue' ? 'bg-blue-900 text-blue-300 border border-blue-300' :
                    'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-900 border border-gray-700' :
              theme === 'blue' ? 'bg-slate-800 border border-slate-600' :
              'bg-gray-50 border border-gray-200'
            }`}>
              <h4 className="text-xl font-bold mb-2">Education</h4>
              <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                B.Tech CSE (Cloud Computing & Automation)<br/>
                VIT Bhopal University (2022-2026)
              </p>
            </div>
            
            <div className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-900 border border-gray-700' :
              theme === 'blue' ? 'bg-slate-800 border border-slate-600' :
              'bg-gray-50 border border-gray-200'
            }`}>
              <h4 className="text-xl font-bold mb-2">Achievement</h4>
              <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                🏆 3rd Place Winner - Hawk-a-thoon'25 Hackathon<br/>
                💼 Finance Team Head - Meraki Club, VIT Bhopal
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// 30 Day Challenge Section
function ChallengeSection({ theme }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  
  return (
    <section 
      ref={ref}
      className={`min-h-screen py-20 px-6 ${
        theme === 'dark' ? 'bg-gray-900 text-white' :
        theme === 'blue' ? 'bg-slate-800 text-white' :
        'bg-gray-100 text-gray-900'
      }`}
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-8"
        >
          🚀 30 Day Vibecoding Challenge
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`text-xl mb-12 max-w-3xl mx-auto ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}
        >
          In April 2025, I took on the ultimate challenge: build a complete project every single day for 30 days. 
          Each project was fully documented, open-sourced on GitHub, and deployed live on Vercel.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`inline-block p-8 rounded-2xl ${
            theme === 'dark' ? 'bg-black border-2 border-cyan-400' :
            theme === 'blue' ? 'bg-slate-900 border-2 border-blue-400' :
            'bg-white border-2 border-blue-500 shadow-lg'
          }`}
        >
          <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            30
          </div>
          <div className="text-2xl font-bold mb-2">PROJECTS</div>
          <div className="text-lg">IN 30 DAYS</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12"
        >
          <a
            href="https://30-day-dashboard.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 ${
              theme === 'dark' ? 'bg-cyan-500 text-black hover:bg-cyan-400' :
              theme === 'blue' ? 'bg-blue-500 text-white hover:bg-blue-400' :
              'bg-blue-600 text-white hover:bg-blue-500'
            } hover:scale-105 transform`}
          >
            View Dashboard 🎯
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// Projects Section
function ProjectsSection({ theme }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  
  const projects = [
    {
      name: "Tiapine",
      description: "AI Therapy Chatbot - Commercially launched project built from scratch",
      url: "https://www.tiapine.com",
      tech: ["AI/ML", "React", "Node.js", "Python"],
      status: "🚀 Live"
    },
    {
      name: "Moaiji", 
      description: "Express Yourself - AI-powered expression platform",
      url: "https://www.moaiji.com",
      tech: ["AI Model", "React", "Cloud", "Express"],
      status: "🚀 Live"
    }
  ];
  
  return (
    <section 
      ref={ref}
      className={`min-h-screen py-20 px-6 ${
        theme === 'dark' ? 'bg-black text-white' :
        theme === 'blue' ? 'bg-slate-900 text-white' :
        'bg-white text-gray-900'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-center mb-16"
        >
          Featured Projects
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
                theme === 'dark' ? 'bg-gray-900 border border-gray-700 hover:border-cyan-400' :
                theme === 'blue' ? 'bg-slate-800 border border-slate-600 hover:border-blue-400' :
                'bg-gray-50 border border-gray-200 hover:border-blue-500 hover:shadow-xl'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">{project.name}</h3>
                <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full">
                  {project.status}
                </span>
              </div>
              
              <p className={`text-lg mb-6 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech) => (
                  <span 
                    key={tech}
                    className={`px-3 py-1 text-sm rounded-full ${
                      theme === 'dark' ? 'bg-gray-800 text-cyan-400' :
                      theme === 'blue' ? 'bg-blue-900 text-blue-300' :
                      'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  theme === 'dark' ? 'bg-cyan-500 text-black hover:bg-cyan-400' :
                  theme === 'blue' ? 'bg-blue-500 text-white hover:bg-blue-400' :
                  'bg-blue-600 text-white hover:bg-blue-500'
                } hover:scale-105 transform`}
              >
                Visit Project →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection({ theme }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  
  const contacts = [
    {
      name: "Email",
      value: "mugdharam89@gmail.com",
      icon: "📧",
      link: "mailto:mugdharam89@gmail.com"
    },
    {
      name: "GitHub", 
      value: "@Barrsum",
      icon: "🔗",
      link: "https://github.com/Barrsum"
    },
    {
      name: "LinkedIn",
      value: "ram-bapat-barrsum-diamos",
      icon: "💼",
      link: "https://www.linkedin.com/in/ram-bapat-barrsum-diamos"
    },
    {
      name: "Phone",
      value: "+91 9691632158",
      icon: "📱",
      link: "tel:+919691632158"
    }
  ];
  
  return (
    <section 
      ref={ref}
      className={`min-h-screen py-20 px-6 flex items-center ${
        theme === 'dark' ? 'bg-gray-900 text-white' :
        theme === 'blue' ? 'bg-slate-800 text-white' :
        'bg-gray-100 text-gray-900'
      }`}
    >
      <div className="max-w-4xl mx-auto text-center w-full">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-8"
        >
          Let's Connect! 🤝
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`text-xl mb-12 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}
        >
          Ready to build something amazing together? Let's turn ideas into reality!
        </motion.p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contacts.map((contact, index) => (
            <motion.a
              key={contact.name}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 block ${
                theme === 'dark' ? 'bg-black border border-gray-700 hover:border-cyan-400' :
                theme === 'blue' ? 'bg-slate-900 border border-slate-600 hover:border-blue-400' :
                'bg-white border border-gray-200 hover:border-blue-500 hover:shadow-lg'
              }`}
            >
              <div className="text-3xl mb-3">{contact.icon}</div>
              <div className="font-bold mb-2">{contact.name}</div>
              <div className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {contact.value}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main App Component
function App() {
  const [theme, setTheme] = useState('dark');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`font-sans ${theme === 'dark' ? 'bg-black' : theme === 'blue' ? 'bg-slate-900' : 'bg-white'}`}>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        
        <HeroSection theme={theme} />
        <AboutSection theme={theme} />
        <ChallengeSection theme={theme} />
        <ProjectsSection theme={theme} />
        <ContactSection theme={theme} />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;