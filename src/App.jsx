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

  const upcomingClasses = [
    {
      title: 'Ladies Night',
      description: 'An evening of art, laughter, and connection. Every Thursday.',
      schedule: 'Every Thursday • 6:00 – 8:00 PM',
      link: 'https://lp.constantcontactpages.com/ev/reg/99pkryk/lp/056834c4-864a-4c37-b303-959670d797ce',
      featured: true,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Favorite Person - Valentine\'s Day',
      description: 'Celebrate love with a special painting experience perfect for couples.',
      schedule: 'Valentine\'s Special',
      link: 'https://lp.constantcontactpages.com/ev/reg/mfcrz2k/lp/fafa9951-f7ce-4f15-bd9a-a2fe5afd212b',
      featured: true,
      gradient: 'linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%)'
    },
    {
      title: 'February Home Class',
      description: 'For Homeschoolers: Explore creativity in a comfortable setting.',
      schedule: 'February Special',
      link: 'https://lp.constantcontactpages.com/ev/reg/55dks8r/lp/4964ae08-0095-4614-b872-47a8ec389458',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Mommy & Me',
      description: 'A beautiful bonding experience for mothers and children. Perfect for Mother\'s Day.',
      schedule: 'Mother\'s Day Special',
      link: 'https://lp.constantcontactpages.com/ev/reg/uam9uzb/lp/f6aeb366-3dad-4d8a-9bf3-682d652cebc9',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    {
      title: 'Winter Cardinal',
      description: 'Paint a stunning winter scene featuring the iconic red cardinal.',
      schedule: 'Seasonal Workshop',
      link: 'https://lp.constantcontactpages.com/ev/reg/5u8pqeu/lp/dc5e2665-fbc1-4c96-97c5-5b6c5666d21b',
      gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
    },
    {
      title: 'Paint Kits',
      description: 'Take the studio experience home. Everything you need to create your masterpiece.',
      schedule: 'Available Now',
      link: 'https://lp.constantcontactpages.com/ev/reg/4fg93fu/lp/b9b41c4c-8d1b-405d-9848-1903a4dd2518',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
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

      {/* Classes Section - NEW */}
      <section id="classes" className="pv5 pv6-l ph3 ph4-l bg-white">
        <div className="max-w-7 center">
          <div className="tc mb5">
            <h2 className="f2 f1-l fw6 mb3 black" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Upcoming Classes & Events
            </h2>
            <p className="f5 f4-l lh-copy black-60 measure center">
              From beginner-friendly workshops to special celebrations, find the perfect class for your creative journey.
            </p>
          </div>

          {/* Featured Classes */}
          <div className="mb4">
            <div className="grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {upcomingClasses.filter(c => c.featured).map((classItem, i) => (
                <a
                  key={i}
                  href={classItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                  style={{ textDecoration: 'none' }}
                >
                  <div 
                    className="br4 pa4 pa5-l relative overflow-hidden transition-all white"
                    style={{
                      background: classItem.gradient,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      minHeight: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                    }}
                  >
                    <div>
                      <div className="f6 fw6 mb2 white-80 tracked ttu" style={{ letterSpacing: '0.1em' }}>
                        Featured
                      </div>
                      <h3 className="f3 f2-l fw7 mb3 white" style={{ letterSpacing: '-0.01em' }}>
                        {classItem.title}
                      </h3>
                      <p className="f5 lh-copy white-90 mb3">
                        {classItem.description}
                      </p>
                    </div>
                    <div>
                      <div className="f6 white-80 mb3">
                        {classItem.schedule}
                      </div>
                      <div 
                        className="dib ph4 pv2 br-pill fw6 f6 transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255,255,255,0.3)',
                          color: 'white'
                        }}
                      >
                        Register Now →
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Regular Classes Grid */}
          <div className="grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '1.5rem'
          }}>
            {upcomingClasses.filter(c => !c.featured).map((classItem, i) => (
              <a
                key={i}
                href={classItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
                style={{ textDecoration: 'none' }}
              >
                <div 
                  className="bg-white br4 overflow-hidden transition-all"
                  style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0,0,0,0.06)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                >
                  <div 
                    className="pa1"
                    style={{
                      background: classItem.gradient,
                      height: '8px'
                    }}
                  ></div>
                  <div className="pa4">
                    <h3 className="f4 fw6 mb2 black" style={{ letterSpacing: '-0.01em' }}>
                      {classItem.title}
                    </h3>
                    <p className="f6 lh-copy black-60 mb3">
                      {classItem.description}
                    </p>
                    <div className="f7 black-50 mb3">
                      {classItem.schedule}
                    </div>
                    <div 
                      className="dib ph3 pv2 br-pill fw6 f7 black transition-all"
                      style={{
                        border: '2px solid black'
                      }}
                    >
                      View Details →
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Weekly Schedule */}
          <div className="mt5 pt5 bt b--black-10">
            <h3 className="f3 f2-l fw6 mb4 tc black" style={{ letterSpacing: '-0.02em' }}>
              Weekly Schedule
            </h3>
            <div className="grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1rem'
            }}>
              <div className="bg-near-white pa4 br3">
                <div className="fw6 black mb2 f5">Walk-in Wednesday</div>
                <div className="black-60">1:00 PM – 6:00 PM</div>
                <div className="f7 black-50 mt2">No reservation needed</div>
              </div>
              <div className="bg-near-white pa4 br3">
                <div className="fw6 black mb2 f5">Ladies Night</div>
                <div className="black-60">Every Thursday, 6:00 – 8:00 PM</div>
                <a 
                  href="https://lp.constantcontactpages.com/ev/reg/99pkryk/lp/056834c4-864a-4c37-b303-959670d797ce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f7 black no-underline mt2 dib hover-underline"
                >
                  Register here →
                </a>
              </div>
              <div className="bg-near-white pa4 br3">
                <div className="fw6 black mb2 f5">Date Night</div>
                <div className="black-60">Every Friday, 6:00 – 8:00 PM</div>
                <div className="f7 black-50 mt2">Perfect for couples</div>
              </div>
            </div>
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
              href="#contact" 
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
            <p className="f5 f4-l lh-copy black-60 mb4">
              Whether you prefer structured classes or drop-in sessions, we have options that fit your lifestyle. 
              Browse our full schedule and find the perfect time to create.
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
              View All Classes
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
      <section id="contact" className="flex flex-column flex-row-l min-vh-50 min-vh-100-l">
        <div className="w-100 w-50-l flex items-center justify-center pa4 pa5-l bg-white order-0">
          <div className="w-100" style={{ maxWidth: '32rem' }}>
            <h2 className="f3 f2-m f1-l fw6 mb3 mb4-l black" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              A space designed<br/>for inspiration
            </h2>
            <p className="f5 f4-l lh-copy black-60 mb4">
              Step into our thoughtfully designed studio where every detail encourages creativity. 
              Natural light, comfortable seating, and an atmosphere that makes artistry feel effortless.
            </p>
            <div className="mb4">
              <div className="fw6 black mb2">Location</div>
              <div className="black-60 mb1">140 Main Street</div>
              <div className="black-60 mb3">Pennington Gap, VA 24277</div>
              
              <div className="fw6 black mb2">Contact</div>
              <div className="black-60">Visit us or check our class schedule online</div>
            </div>
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
              href="#classes" 
              className="dib w-100 w-auto-ns bg-white black ph4 pv3 ph5-l br-pill no-underline fw6 hover-bg-white-90 transition-all tc"
              style={{ 
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Browse Classes
            </a>
            <a 
              href="https://lp.constantcontactpages.com/ev/reg/4fg93fu/lp/b9b41c4c-8d1b-405d-9848-1903a4dd2518" 
              target="_blank"
              rel="noopener noreferrer"
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
              Order Paint Kits
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
                <h4 className="f6 f5-l fw6 mb2 black">Connect</h4>
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

        .hover-underline:hover {
          text-decoration: underline;
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