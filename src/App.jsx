import React, { useState, useEffect } from 'react';
import Inside from './assets/Inside.webp';
import Outside from './assets/Outside.webp';
import PaintImage from './assets/PaintImage.webp';
import PaintingInsideTheStudio from './assets/PaintingInsideTheStudio.webp';
import HandPainting from './assets/HandPainting.webp';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { 
      title: 'Canvas Painting', 
      desc: 'Master the art of expression in an intimate studio setting. Walk away with a masterpiece that\'s uniquely yours.'
    },
    { 
      title: 'Social Experience', 
      desc: 'Where creativity meets community. Professional guidance in an atmosphere designed for connection.'
    },
    { 
      title: 'Premium Hospitality', 
      desc: 'All Beverages & Supplies Included. Just bring your imagination and we\'ll handle the rest.'
    },
    { 
      title: 'Accessible Excellence', 
      desc: 'Museum-quality instruction at prices that welcome everyone to the canvas.'
    }
  ];

  const parties = [
    'Date Night', 'Girls Night', 'Kids Painting', 'Birthday Celebrations', 
    'Holiday Events', 'Corporate Gatherings', 'Team Building', 'Praise & Paint',
    'Town Pride', 'School Programs', 'Bridal Showers'
  ];

  return (
    <div className="bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-999 transition-all bg-white-90 backdrop-blur" style={{ 
        backdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}>
        <div className="flex justify-between items-center pa3 pa4-l max-w-7 center">
          <div className="f6 f5-l fw6 black transition-all">Painting Outside The Lines</div>
          
          {/* Desktop Navigation */}
          <div className="dn flex-l gap3">
            <a href="#classes" className="black-70 no-underline hover-black transition-all">Classes</a>
            <a href="#contact" className="black-70 no-underline hover-black transition-all">Contact</a>
          </div>
          
          {/* Mobile Hamburger */}
          <button 
            className="db dn-l bg-transparent bn pointer pa2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-column gap1">
              <div className={`bg-black transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ 
                width: '24px', 
                height: '2px',
                transform: mobileMenuOpen ? 'rotate(45deg) translateY(8px)' : 'none',
                transition: 'all 0.3s ease'
              }}></div>
              <div className={`bg-black transition-all ${mobileMenuOpen ? 'o-0' : 'o-100'}`} style={{ 
                width: '24px', 
                height: '2px',
                opacity: mobileMenuOpen ? 0 : 1,
                transition: 'all 0.3s ease'
              }}></div>
              <div className={`bg-black transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ 
                width: '24px', 
                height: '2px',
                transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none',
                transition: 'all 0.3s ease'
              }}></div>
            </div>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div 
          className={`dn-l bg-white transition-all overflow-hidden`}
          style={{
            maxHeight: mobileMenuOpen ? '300px' : '0',
            transition: 'max-height 0.3s ease',
            borderTop: mobileMenuOpen ? '1px solid rgba(0,0,0,0.1)' : 'none'
          }}
        >
          <div className="pa3 flex flex-column gap2">
            <a 
              href="#classes" 
              className="black-70 no-underline hover-black pv3 ph2 transition-all f5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Classes
            </a>
            <a 
              href="#contact" 
              className="black-70 no-underline hover-black pv3 ph2 transition-all f5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-column flex-row-l min-vh-100" style={{ paddingTop: '60px' }}>
        <div className="w-100 w-60-l relative overflow-hidden" style={{ minHeight: '40vh' }}>
          <img 
            src={PaintingInsideTheStudio} 
            alt="Studio" 
            className="w-100 h-100 object-cover db"
            style={{ 
              minHeight: '40vh',
              transform: `scale(${1 + scrollY * 0.0002})`
            }}
          />
        </div>
        <div className="w-100 w-40-l flex items-center justify-center pa4 pa5-m pa6-l bg-white">
          <div className="w-100" style={{ maxWidth: '32rem' }}>
            <h1 className="f2 f1-l f-headline-xl fw7 mb3 mb4-l black tracked-tight" style={{
              fontSize: 'clamp(2rem, 8vw, 4.5rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.03em'
            }}>
              Where Art<br/>Meets Life
            </h1>
            <p className="f5 f4-l fw4 mb3 black-70 tracked" style={{ 
              letterSpacing: '0.05em'
            }}>
              PAINTING OUTSIDE THE LINES STUDIO
            </p>
            <p className="f6 f5-l fw4 mb4 mb5-l black-60">140 Main Street, Pennington Gap, VA</p>
            <a 
              href="#classes" 
              className="dib bg-black white ph4 pv3 ph5-l br-pill no-underline fw5 hover-bg-black-80 transition-all tc"
              style={{ 
                transition: 'all 0.3s ease',
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Explore Classes
            </a>
          </div>
        </div>
      </section>

      {/* Statement Section */}
      <section className="pv5 pv6-l ph3 ph4-l tc max-w-4 center">
        <h2 className="f3 f2-m f1-l fw6 mb3 mb4-l black" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
          Transform blank canvas into beautiful memories
        </h2>
        <p className="f5 f4-l lh-copy black-60 measure center">
          Every stroke tells a story. In our studio, you'll discover not just how to paint, 
          but how to see the world through an artist's eyes.
        </p>
      </section>

      {/* Services Grid */}
      <section className="pv5 pv6-l ph3 ph4-l bg-near-white">
        <div className="max-w-7 center">
          <div className="grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '1rem'
          }}>
            {services.map((service, i) => (
              <div 
                key={i} 
                className="bg-white pa4 pa5-l br4 transition-all"
                style={{
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                }}
              >
                <h3 className="f4 f3-l fw6 mb3 black" style={{ letterSpacing: '-0.01em' }}>{service.title}</h3>
                <p className="f5 lh-copy black-60">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Large Image Section - Hand Painting */}
      <section className="flex flex-column flex-row-l min-vh-50 min-vh-100-l">
        <div className="w-100 w-50-l order-1 order-0-l" style={{ minHeight: '40vh' }}>
          <img 
            src={HandPainting} 
            alt="Hand Painting" 
            className="w-100 h-100 object-cover db"
          />
        </div>
        <div className="w-100 w-50-l flex items-center justify-center pa4 pa5-l bg-white order-0 order-1-l">
          <div className="w-100" style={{ maxWidth: '32rem' }}>
            <h2 className="f3 f2-m f1-l fw6 mb3 mb4-l black" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Every artist<br/>starts somewhere
            </h2>
            <p className="f5 f4-l lh-copy black-60 mb4">
              Watch your vision take shape with every brushstroke. Our expert instructors guide you through 
              techniques that transform a blank canvas into a piece you'll be proud to display. It's not about 
              being perfect—it's about discovering what you're capable of creating.
            </p>
            <a 
              href="#classes" 
              className="dib black ph4 pv3 br-pill no-underline fw6 transition-all tc"
              style={{ 
                border: '2px solid black',
                transition: 'all 0.3s ease',
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'black';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'black';
              }}
            >
              Start Creating
            </a>
          </div>
        </div>
      </section>

      {/* Events Showcase */}
      <section className="pv5 pv6-l ph3 ph4-l bg-black white">
        <div className="max-w-6 center">
          <h2 className="f3 f2-m f1-l fw6 mb2 mb3-l tc" style={{ letterSpacing: '-0.02em' }}>
            Every occasion deserves art
          </h2>
          <p className="f6 f5-l tc mb4 mb5-l white-60">Tailored experiences for every celebration</p>
          
          <div className="flex flex-wrap justify-center gap2 mb4 mb5-l" style={{ gap: '0.5rem' }}>
            {parties.map((party, i) => (
              <span 
                key={i} 
                className="ph3 pv2 br-pill white-90 f7 f6-l fw5 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {party}
              </span>
            ))}
          </div>

          <div className="tc">
            <a 
              href="#register" 
              className="dib bg-white black ph4 pv3 ph5-l br-pill no-underline fw6 hover-bg-white-90 transition-all tc"
              style={{ 
                transition: 'all 0.3s ease',
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Book Your Event
            </a>
          </div>
        </div>
      </section>

      {/* Split Feature */}
      <section className="flex flex-column flex-row-l min-vh-50 min-vh-100-l">
        <div className="w-100 w-50-l flex items-center justify-center pa4 pa5-l bg-white order-0">
          <div className="w-100" style={{ maxWidth: '32rem' }}>
            <h2 className="f3 f2-m f1-l fw6 mb3 mb4-l black" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Your schedule.<br/>Your masterpiece.
            </h2>
            <div className="f6 f5-l lh-copy black-60 mb4">
              <div className="mb3 pb3 bb b--black-10">
                <div className="fw6 black mb2">Walk-in Wednesday</div>
                <div>1:00 PM – 6:00 PM</div>
              </div>
              <div className="mb3 pb3 bb b--black-10">
                <div className="fw6 black mb2">Ladies Night</div>
                <div>Every Thursday, 6:00 – 8:00 PM</div>
              </div>
              <div className="mb3 pb3 bb b--black-10">
                <div className="fw6 black mb2">Date Night</div>
                <div>Every Friday, 6:00 – 8:00 PM</div>
              </div>
              <div className="mb3">
                <div className="fw6 black mb2">Special: Brunch & Painting</div>
                <div>September 27th</div>
              </div>
            </div>
            <a 
              href="#register" 
              className="dib black ph4 pv3 br-pill no-underline fw6 transition-all tc"
              style={{ 
                border: '2px solid black',
                transition: 'all 0.3s ease',
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'black';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'black';
              }}
            >
              Reserve Your Spot
            </a>
          </div>
        </div>
        <div className="w-100 w-50-l order-1" style={{ minHeight: '40vh', display: 'flex' }}>
          <img 
            src={Outside} 
            alt="Studio Exterior" 
            className="w-100 object-cover db"
            style={{ height: '100%', minHeight: '40vh' }}
          />
        </div>
      </section>

      {/* Image Feature - Paint Image */}
      <section className="flex flex-column flex-row-l min-vh-50 min-vh-100-l">
        <div className="w-100 w-50-l order-1 order-0-l" style={{ minHeight: '40vh' }}>
          <img 
            src={PaintImage} 
            alt="Painting Creation" 
            className="w-100 h-100 object-cover db"
          />
        </div>
        <div className="w-100 w-50-l flex items-center justify-center pa4 pa5-l bg-near-white order-0 order-1-l">
          <div className="w-100" style={{ maxWidth: '32rem' }}>
            <h2 className="f3 f2-m f1-l fw6 mb3 mb4-l black" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Create something<br/>extraordinary
            </h2>
            <p className="f5 f4-l lh-copy black-60 mb4">
              From first brushstroke to final masterpiece, discover the joy of bringing your vision to life. 
              No experience needed—just bring your creativity and we'll guide you through the rest.
            </p>
            <a 
              href="#classes" 
              className="dib black ph4 pv3 br-pill no-underline fw6 transition-all tc"
              style={{ 
                border: '2px solid black',
                transition: 'all 0.3s ease',
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'black';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'black';
              }}
            >
              View Classes
            </a>
          </div>
        </div>
      </section>

      {/* Image Feature - Inside Studio */}
      <section className="flex flex-column flex-row-l min-vh-50 min-vh-100-l">
        <div className="w-100 w-50-l flex items-center justify-center pa4 pa5-l bg-white order-0">
          <div className="w-100" style={{ maxWidth: '32rem' }}>
            <h2 className="f3 f2-m f1-l fw6 mb3 mb4-l black" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              A space designed<br/>for inspiration
            </h2>
            <p className="f5 f4-l lh-copy black-60 mb4">
              Step into our thoughtfully designed studio where every detail encourages creativity. 
              Natural light, comfortable seating, and an atmosphere that makes artistry feel effortless.
            </p>
            <a 
              href="#contact" 
              className="dib black ph4 pv3 br-pill no-underline fw6 transition-all tc"
              style={{ 
                border: '2px solid black',
                transition: 'all 0.3s ease',
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'black';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'black';
              }}
            >
              Visit Us
            </a>
          </div>
        </div>
        <div className="w-100 w-50-l order-1" style={{ minHeight: '40vh', display: 'flex' }}>
          <img 
            src={Inside} 
            alt="Studio Interior" 
            className="w-100 object-cover db"
            style={{ height: '100%', minHeight: '40vh' }}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="pv5 pv6-l ph3 ph4-l tc" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="max-w-4 center white">
          <h2 className="f3 f2-m f1-l fw6 mb3" style={{ letterSpacing: '-0.02em' }}>
            Ready to create?
          </h2>
          <p className="f5 f4-l mb4 mb5-l white-90 measure center">
            Join us for an unforgettable artistic experience. No experience necessary.
          </p>
          <div className="flex flex-column flex-row-ns justify-center items-center" style={{ gap: '1rem' }}>
            <a 
              href="#payment" 
              className="dib w-100 w-auto-ns bg-white black ph4 pv3 ph5-l br-pill no-underline fw6 hover-bg-white-90 transition-all tc"
              style={{ 
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Payment Options
            </a>
            <a 
              href="#register" 
              className="dib w-100 w-auto-ns white ph4 pv3 ph5-l br-pill no-underline fw6 transition-all tc"
              style={{ 
                border: '2px solid white',
                transition: 'all 0.3s ease',
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'white';
              }}
            >
              Class Registration
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pv4 pv5-l ph3 ph4-l bg-near-white">
        <div className="max-w-7 center">
          <div className="flex flex-column flex-row-l justify-between items-start mb4">
            <div className="mb4 mb0-l">
              <h3 className="f4 f3-l fw6 mb3 black">Painting Outside The Lines Studio</h3>
              <p className="f6 f5-l black-60 mb2">140 Main Street</p>
              <p className="f6 f5-l black-60">Pennington Gap, VA 24277</p>
            </div>
            <div className="flex gap3 gap4-l">
              <div>
                <h4 className="f6 f5-l fw6 mb2 black">Navigate</h4>
                <a href="#classes" className="db f7 f6-l black-60 no-underline hover-black mb2">Classes</a>
                <a href="#contact" className="db f7 f6-l black-60 no-underline hover-black">Contact</a>
              </div>
              <div>
                <h4 className="f6 f5-l fw6 mb2 black">Navigate</h4>
                <a href="#" className="db f7 f6-l black-60 no-underline hover-black mb2">Facebook</a>
                <a href="#" className="db f7 f6-l black-60 no-underline hover-black mb2">Instagram</a>
              </div>
            </div>
          </div>
          <div className="pt4 bt b--black-10 tc f7 f6-l black-60">
            © {new Date().getFullYear()} Painting Outside The Lines Studio. All rights reserved.
          </div>
        </div>
      </footer>

      <style>{`
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        img {
          display: block;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          overflow-x: hidden;
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .backdrop-blur {
          backdrop-filter: saturate(180%) blur(20px);
        }
        
        .max-w-4 {
          max-width: 48rem;
        }
        
        .max-w-5 {
          max-width: 32rem;
        }
        
        .max-w-6 {
          max-width: 64rem;
        }
        
        .max-w-7 {
          max-width: 80rem;
        }
        
        .grid-gap-3 {
          gap: 1.5rem;
        }
        
        .grid-gap-4 {
          gap: 2rem;
        }
        
        .gap1 {
          gap: 0.25rem;
        }
        
        .gap2 {
          gap: 0.5rem;
        }
        
        .gap3 {
          gap: 1rem;
        }
        
        .gap4 {
          gap: 1.5rem;
        }
        
        .object-cover {
          object-fit: cover;
        }
        
        .z-999 {
          z-index: 999;
        }
        
        .z-1 {
          z-index: 1;
        }
        
        .bg-white-90 {
          background-color: rgba(255, 255, 255, 0.9);
        }
        
        .white-90 {
          color: rgba(255, 255, 255, 0.9);
        }
        
        .white-60 {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .black-60 {
          color: rgba(0, 0, 0, 0.6);
        }
        
        .black-70 {
          color: rgba(0, 0, 0, 0.7);
        }
        
        .hover-bg-black-80:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }
        
        .min-vh-50 {
          min-height: 50vh;
        }
        
        /* Mobile touch improvements */
        @media (max-width: 60em) {
          a, button {
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
          }
          
          .min-vh-100 {
            min-height: auto;
          }
        }
        
        /* Prevent horizontal scroll on mobile */
        .overflow-hidden {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default App;