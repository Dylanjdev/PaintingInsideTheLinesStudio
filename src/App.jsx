import React, { useState, useEffect } from 'react';
import Inside from './assets/Inside.webp';
import Outside from './assets/Outside.webp';
import PaintImage from './assets/PaintImage.webp';
import HandPainting from './assets/HandPainting.webp';
import LadiesNightBlueTruck from './assets/ladiesnightbluetruck.webp';
import LadiesNightChicken from './assets/ladiesnightchicken.webp';
import LadiesNightBootsDirty from './assets/ladiesnightbootsdirty.webp';
import LadiesNightHighlanderPurple from './assets/ladiesnighthighlanderpurple.webp';
import LadiesNightHighlanderSunflower from './assets/ladiesnighthighlandersunflower.webp';
import CupOfSunshine from './assets/cupofsunshine.webp';
import Cactus from './assets/cactus.webp';
import Barn from './assets/barn.webp';
import Fence from './assets/fence.webp';
import SpringBird from './assets/springbird.webp';
import CrushedGlassChristmas from './assets/crushedglasschristmas.webp';
import Sled from './assets/sled.webp';
import Welcome from './assets/welcome.webp';
import ElevenSeasons from './assets/11seasons.webp';
import Rwb from './assets/rwb.webp';
import Sand from './assets/sand.webp';
import Slime from './assets/slime.webp';
import Highlander from './assets/highlander.webp';
import CrossCrushedGlass from './assets/cross crushed glass.webp';
import CrushedGlassFlag from './assets/crushedglassflag.webp';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ladiesNightModalOpen, setLadiesNightModalOpen] = useState(false);
  const [classOptionsModal, setClassOptionsModal] = useState(null);
  const [projectModal, setProjectModal] = useState(null);
  const [projectModalClosing, setProjectModalClosing] = useState(false);

  function openProjectModal(classItem) {
    setProjectModalClosing(false);
    setProjectModal(classItem);
  }

  function closeProjectModal() {
    setProjectModalClosing(true);
    window.setTimeout(() => {
      setProjectModal(null);
      setProjectModalClosing(false);
    }, 220);
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!ladiesNightModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLadiesNightModalOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ladiesNightModalOpen]);

  useEffect(() => {
    if (!projectModal) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeProjectModal();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [projectModal]);

  useEffect(() => {
    if (!classOptionsModal) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setClassOptionsModal(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [classOptionsModal]);

  const services = [
    { 
      title: 'Canvas Painting Classes', 
      desc: 'Master the art of expression in an intimate studio setting in Pennington Gap, VA. Walk away with a masterpiece that\'s uniquely yours.'
    },
    { 
      title: 'Social Paint Experience', 
      desc: 'Where creativity meets community. Professional guidance in an atmosphere designed for connection and unforgettable memories.'
    },
    { 
      title: 'Premium Hospitality', 
      desc: 'All beverages & art supplies included. Just bring your imagination and we\'ll handle the rest — truly stress-free.'
    },
    { 
      title: 'Accessible for Everyone', 
      desc: 'Museum-quality instruction at prices that welcome everyone to the canvas. No experience necessary — ever.'
    }
  ];

  const ladiesNightPaintings = Array.from({ length: 10 }, (_, index) => {
    const paintingNumber = index + 1;

    if (paintingNumber === 1) {
      return {
        title: 'Blue Truck',
        price: '$35',
        image: LadiesNightBlueTruck,
        alt: 'Blue Truck Ladies Night painting',
        link: 'https://buy.stripe.com/4gMdR8bDA7r15PH0Go2kw02'
      };
    }

    if (paintingNumber === 2) {
      return {
        title: 'Chicken',
        price: '$35',
        image: LadiesNightChicken,
        alt: 'Chicken Ladies Night painting',
        link: 'https://buy.stripe.com/fZuaEW9vs6mXemdexe2kw03'
      };
    }

    if (paintingNumber === 3) {
      return {
        title: 'Boots Dirty',
        price: '$35',
        image: LadiesNightBootsDirty,
        alt: 'Boots Dirty Ladies Night painting',
        link: 'https://buy.stripe.com/8x214m4b88v50vn9cU2kw04'
      };
    }

    if (paintingNumber === 4) {
      return {
        title: 'High Lander Purple Flowers',
        price: '$35',
        image: LadiesNightHighlanderPurple,
        alt: 'High Lander Purple Flowers Ladies Night painting',
        link: 'https://buy.stripe.com/7sYdR89vsbHhce5bl22kw05'
      };
    }

    if (paintingNumber === 5) {
      return {
        title: 'Highlander Sunflower',
        price: '$35',
        image: LadiesNightHighlanderSunflower,
        alt: 'Highlander Sunflower Ladies Night painting',
        link: 'https://book.stripe.com/eVq8wO8ro26H2Dv0Go2kw06'
      };
    }

    if (paintingNumber === 6) {
      return {
        title: 'Cup of Sunshine',
        price: '$35',
        image: CupOfSunshine,
        alt: 'Cup of Sunshine Ladies Night painting',
        link: 'https://book.stripe.com/5kQ3cu37426Ha5Xcp62kw07'
      };
    }

    if (paintingNumber === 7) {
      return {
        title: 'Cactus',
        price: '$35',
        image: Cactus,
        alt: 'Cactus Ladies Night painting',
        link: 'https://book.stripe.com/14AfZg4b89z9emd3SA2kw08'
      };
    }

    if (paintingNumber === 8) {
      return {
        title: 'Barn',
        price: '$35',
        image: Barn,
        alt: 'Barn Ladies Night painting',
        link: 'https://book.stripe.com/fZufZg7nk12D6TL0Go2kw09'
      };
    }

    if (paintingNumber === 9) {
      return {
        title: 'Fence',
        price: '$35',
        image: Fence,
        alt: 'Fence Ladies Night painting',
        link: 'https://book.stripe.com/aFa14m7nk26H6TL9cU2kw0a'
      };
    }

    if (paintingNumber === 10) {
      return {
        title: 'Spring Bird',
        price: '$35',
        image: SpringBird,
        alt: 'Spring Bird Ladies Night painting',
        link: 'https://book.stripe.com/cNicN49vs6mX3Hzcp62kw0b'
      };
    }
  });

  const doorHangerOptions = [
    {
      title: '18 inch Welcome Sign',
      price: '$45',
      image: Welcome,
      alt: '18 inch Welcome Sign door hanger project',
      link: 'https://book.stripe.com/28EaEW3747r11zr60I2kw0f'
    },
    {
      title: '11 Seasons Hanger',
      price: '$65',
      image: ElevenSeasons,
      alt: '11 Seasons Hanger door hanger project',
      link: 'https://book.stripe.com/00wfZg9vs6mXfqh2Ow2kw0g'
    }
  ];

  const slimeAndSandOptions = [
    {
      title: 'Sand Bottle',
      price: '$15',
      image: Sand,
      alt: 'Sand Bottle project',
      link: 'https://book.stripe.com/3cI4gy8ro26Hba188Q2kw0i'
    },
    {
      title: 'Slime',
      price: '$20',
      image: Slime,
      alt: 'Slime project',
      link: 'https://book.stripe.com/14A7sK37426H4LD3SA2kw0j'
    }
  ];

  const upcomingClasses = [
    {
      title: 'Painting, Minigolf, laser tag',
      description: 'Day of fun lets help brighten up the space at Appalachian Asenso Mini Golf and Laser Tag in Pennington Gap, VA.',
      schedule: 'Jun 16, 2026 06:00pm - 08:00pm',
      link: 'https://buy.stripe.com/00w4gydLI5iT2Dv88Q2kw01',
      featured: true,
      gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
    },
    {
      title: 'Ladies Night',
      description: 'An evening of art, laughter, and connection. Every Thursday at our Pennington Gap studio.',
      schedule: 'Every Thursday • 6:00 – 8:00 PM',
      link: '#ladies-night-options',
      featured: true,
      bookingOptions: ladiesNightPaintings,
      bookingCta: 'Choose Your Painting →',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Crushed Glass',
      description: 'Discover the beauty of crushed glass art. Create stunning pieces with vibrant colors and unique textures in our guided workshop.',
      schedule: 'Jun 27, 2026 04:00pm - Jun 27, 2026 07:00pm',
      link: 'https://book.stripe.com/dRm14mePMdPp0vnbl22kw00',
      booked: true,
      bookedMessage: "We're booked! Keep tabs for updates on the next class.",
      featured: true,
      gradient: 'linear-gradient(135deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)'
    },
    {
      title: 'Crushed Glass Christmas Tree',
      description: 'Create a festive crushed glass Christmas tree with sparkle, texture, and guided studio instruction.',
      schedule: 'Jul 11, 2026 04:00pm - 07:00pm',
      link: 'https://book.stripe.com/00w3cu2309z92Dv3SA2kw0d',
      featured: true,
      image: CrushedGlassChristmas,
      imageAlt: 'Crushed Glass Christmas Tree class project',
      gradient: 'linear-gradient(135deg, #0f766e 0%, #16a34a 50%, #dc2626 100%)'
    },
    {
      title: 'Crushed Glass Cross',
      description: 'Create an Old Rugged Cross crushed glass project with guided studio instruction. $65 per person.',
      schedule: 'Aug 29, 2026 04:00pm - 07:00pm',
      link: 'https://book.stripe.com/fZu9AS5fcfXx2Dvbl22kw0n',
      featured: true,
      image: CrossCrushedGlass,
      imageAlt: 'Old Rugged Cross crushed glass class project',
      gradient: 'linear-gradient(135deg, #334155 0%, #8b5e34 52%, #dbeafe 100%)'
    },
    {
      title: 'Red, White & Blue Crushed Glass',
      description: 'Create a patriotic red, white, and blue crushed glass flag project with guided studio instruction. $65 per person.',
      schedule: 'Aug 15, 2026 04:00pm - 07:00pm',
      link: 'https://book.stripe.com/14A5kC4b8fXxfqhfBi2kw0o',
      featured: true,
      image: CrushedGlassFlag,
      imageAlt: 'Red, white, and blue crushed glass flag class project',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #ffffff 48%, #dc2626 100%)',
      darkText: true
    },
    {
      title: 'Paint a Sled',
      description: 'Paint a seasonal sled project in a guided studio class. $50 per person.',
      schedule: 'Jul 18, 2026 04:00pm - 07:00pm',
      link: 'https://book.stripe.com/28E00i2307r12DvfBi2kw0e',
      featured: true,
      image: Sled,
      imageAlt: 'Paint a Sled class project',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #b45309 50%, #facc15 100%)'
    },
    {
      title: 'Door Hanger Paint Party',
      description: 'Choose between an 18 inch Welcome Sign or an 11 Seasons Hanger in this guided paint party.',
      schedule: 'Jun 20, 2026 04:00pm - 06:00pm',
      link: '#door-hanger-options',
      featured: true,
      bookingOptions: doorHangerOptions,
      bookingCta: 'Choose Your Door Hanger →',
      gradient: 'linear-gradient(135deg, #065f46 0%, #0f766e 45%, #f59e0b 100%)'
    },
    {
      title: 'Red White & Blue Paint Party',
      description: 'Create a patriotic red, white, and blue project in this guided paint party. $55 per person.',
      schedule: 'May 30, 2026 04:00pm - 06:00pm',
      link: 'https://book.stripe.com/28EaEW230eTtgulcp62kw0h',
      featured: true,
      image: Rwb,
      imageAlt: 'Red White and Blue Paint Party project',
      darkText: true,
      gradient: 'linear-gradient(135deg, #1d4ed8 0%, #ffffff 50%, #dc2626 100%)'
    },
    {
      title: 'Slime & Sand Fun',
      description: 'Choose between a colorful sand bottle or a hands-on slime project in this creative workshop.',
      schedule: 'Jul 25, 2026 04:00pm - 06:00pm',
      link: '#slime-sand-options',
      featured: true,
      bookingOptions: slimeAndSandOptions,
      bookingCta: 'Choose Your Project →',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #84cc16 50%, #f97316 100%)'
    },
    {
      title: 'Highlander Cow Paint Party',
      description: 'Paint a Highlander cow set against a patriotic American flag-inspired background, finished with bright floral details.',
      schedule: '2:30 PM - 4:30 PM',
      link: 'https://buy.stripe.com/7sYdR8230bHh0vn60I2kw0k',
      featured: true,
      image: Highlander,
      imageAlt: 'Highlander cow painting with an American flag background and flowers',
      gradient: 'linear-gradient(135deg, #991b1b 0%, #ffffff 48%, #1e3a8a 100%)',
      darkText: true
    },
  ];

  const studioAddress = {
    '@type': 'PostalAddress',
    streetAddress: '140 Main Street',
    addressLocality: 'Pennington Gap',
    addressRegion: 'VA',
    postalCode: '24277',
    addressCountry: 'US'
  };

  const parseDateCandidate = (value) => {
    if (!value) return null;
    const normalized = value
      .replace(/\s+/g, ' ')
      .replace(/(\d)(am|pm)\b/gi, '$1 $2')
      .replace(/\b(am|pm)\b/gi, (m) => m.toUpperCase())
      .trim();
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const toIsoString = (date) => {
    if (!date) return undefined;
    const pad = (n) => String(n).padStart(2, '0');
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${y}-${m}-${d}T${h}:${min}:00-04:00`;
  };

  const parseScheduleDates = (schedule) => {
    const parts = schedule.split(' - ').map((part) => part.trim());
    if (!parts.length) return {};

    const start = parseDateCandidate(parts[0]);
    if (!start) return {};

    let end = null;
    if (parts[1]) {
      const directEnd = parseDateCandidate(parts[1]);
      if (directEnd) {
        end = directEnd;
      } else {
        const datePrefix = parts[0].replace(/\s+\d{1,2}:\d{2}\s*[AaPp][Mm]\s*$/, '').trim();
        end = parseDateCandidate(`${datePrefix} ${parts[1]}`);
      }
    }

    return {
      startDate: toIsoString(start),
      endDate: toIsoString(end)
    };
  };

  const classesItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Upcoming Classes and Events',
    itemListElement: upcomingClasses.map((classItem, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: classItem.link,
      item: {
        '@type': 'Course',
        name: classItem.title,
        description: classItem.description,
        provider: {
          '@type': 'LocalBusiness',
          name: 'Painting Outside The Lines Studio'
        }
      }
    }))
  };

  const classEventsSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EventSeries',
        name: 'Ladies Night',
        description: 'An evening of art, laughter, and connection. Every Thursday at our Pennington Gap studio.',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: 'Painting Outside The Lines Studio',
          address: studioAddress
        },
        eventSchedule: {
          '@type': 'Schedule',
          byDay: ['https://schema.org/Thursday'],
          startTime: '18:00',
          endTime: '20:00',
          scheduleTimezone: 'America/New_York'
        },
        offers: {
          '@type': 'Offer',
          url: 'https://paintingoutsidethelinesstudios.com/#ladies-night-options',
          availability: 'https://schema.org/InStock'
        },
        organizer: {
          '@type': 'Organization',
          name: 'Painting Outside The Lines Studio',
          url: 'https://paintingoutsidethelinesstudios.com/'
        }
      },
      ...upcomingClasses
        .map((classItem) => {
          const parsed = parseScheduleDates(classItem.schedule);
          if (!parsed.startDate || classItem.title === 'Ladies Night') {
            return null;
          }

          return {
            '@type': 'Event',
            name: classItem.title,
            description: classItem.description,
            startDate: parsed.startDate,
            ...(parsed.endDate ? { endDate: parsed.endDate } : {}),
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            location: {
              '@type': 'Place',
              name: 'Painting Outside The Lines Studio',
              address: studioAddress
            },
            offers: {
              '@type': 'Offer',
              url: classItem.link,
              availability: classItem.booked ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock'
            },
            organizer: {
              '@type': 'Organization',
              name: 'Painting Outside The Lines Studio',
              url: 'https://paintingoutsidethelinesstudios.com/'
            }
          };
        })
        .filter(Boolean)
    ]
  };

  const parties = [
    'Date Night', 'Girls Night', 'Kids Painting', 'Birthday Celebrations', 
    'Holiday Events', 'Corporate Gatherings', 'Team Building', 'Praise & Paint',
    'Town Pride', 'School Programs', 'Bridal Showers'
  ];

  return (
    <div className="bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(classesItemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(classEventsSchema) }}
      />
      
      {/* ─── Navigation (role="navigation" is implicit on <nav>) ─── */}
      <nav className="fixed top-0 left-0 right-0 z-999 transition-all bg-white-90 backdrop-blur" aria-label="Main navigation" style={{ 
        backdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}>
        <div className="flex justify-between items-center pa3 pa4-l max-w-7 center">
          {/* Logo / Brand – wrapping in an anchor for home-link semantics */}
          <a href="/" aria-label="Painting Outside The Lines Studio – Home" className="no-underline">
            <span className="f6 f5-l fw6 black transition-all">Painting Outside The Lines</span>
          </a>
          
          {/* Desktop Navigation */}
          <ul className="dn flex-l gap3 list pa0 ma0" role="list">
            <li><a href="#classes" className="black-70 no-underline hover-black transition-all">Classes</a></li>
            <li><a href="#contact" className="black-70 no-underline hover-black transition-all">Contact</a></li>
          </ul>
          
          {/* Mobile Hamburger */}
          <button 
            className="db dn-l bg-transparent bn pointer pa2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="flex flex-column gap1" aria-hidden="true">
              <div className="bg-black" style={{ 
                width: '24px', 
                height: '2px',
                transform: mobileMenuOpen ? 'rotate(45deg) translateY(8px)' : 'none',
                transition: 'all 0.3s ease'
              }}></div>
              <div className="bg-black" style={{ 
                width: '24px', 
                height: '2px',
                opacity: mobileMenuOpen ? 0 : 1,
                transition: 'all 0.3s ease'
              }}></div>
              <div className="bg-black" style={{ 
                width: '24px', 
                height: '2px',
                transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none',
                transition: 'all 0.3s ease'
              }}></div>
            </div>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <nav 
          id="mobile-menu"
          className="dn-l bg-white transition-all overflow-hidden"
          aria-label="Mobile navigation"
          style={{
            maxHeight: mobileMenuOpen ? '300px' : '0',
            transition: 'max-height 0.3s ease',
            borderTop: mobileMenuOpen ? '1px solid rgba(0,0,0,0.1)' : 'none'
          }}
        >
          <ul className="pa3 flex flex-column gap2 list pa0 ma0" role="list">
            <li>
              <a 
                href="#classes" 
                className="black-70 no-underline hover-black pv3 ph2 transition-all f5 db"
                onClick={() => setMobileMenuOpen(false)}
              >
                Classes & Events
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className="black-70 no-underline hover-black pv3 ph2 transition-all f5 db"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact & Location
              </a>
            </li>
          </ul>
        </nav>
      </nav>

      {/* ─── Main Content ─── */}
      <main>
      {/* ─── Hero Section ─── */}
      <header className="flex flex-column flex-row-l min-vh-100" style={{ paddingTop: '60px' }}>
        <div className="w-100 w-60-l relative overflow-hidden" style={{ minHeight: '40vh' }}>
          <img 
            src="/PaintingInsideTheStudio.webp" 
            alt="Inside Painting Outside The Lines Studio – a warm, inviting painting studio at 140 Main Street, Pennington Gap, Virginia" 
            className="w-100 h-100 object-cover db"
            width="800"
            height="600"
            loading="eager"
            fetchPriority="high"
            style={{ 
              minHeight: '40vh',
              transform: `scale(${1 + scrollY * 0.0002})`
            }}
          />
        </div>
        <div className="w-100 w-40-l flex items-center justify-center pa4 pa5-m pa6-l bg-white">
          <div className="w-100" style={{ maxWidth: '32rem' }}>
            {/* h1 – Only one on the entire page */}
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
            <address className="f6 f5-l fw4 mb1 black-60" style={{ fontStyle: 'normal' }}>
              140 Main Street, Pennington Gap, VA 24277
            </address>
            <p className="f7 black-60 mb4 mb5-l">
              Guided painting classes &amp; paint parties in Lee County, Virginia
            </p>
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
              aria-label="Explore upcoming painting classes and events"
            >
              Explore Classes
            </a>
          </div>
        </div>
      </header>

      {/* ─── Statement Section ─── */}
      <section className="pv5 pv6-l ph3 ph4-l tc max-w-4 center" aria-label="About our studio">
        <h2 className="f3 f2-m f1-l fw6 mb3 mb4-l black" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
          Transform a blank canvas into beautiful memories
        </h2>
        <p className="f5 f4-l lh-copy black-60 measure center">
          Every stroke tells a story. In our Pennington Gap studio, you'll discover not just how to paint, 
          but how to see the world through an artist's eyes — no experience required.
        </p>
      </section>

      {/* ─── Services Grid ─── */}
      <section className="pv5 pv6-l ph3 ph4-l bg-near-white" aria-label="What we offer">
        <div className="max-w-7 center">
          <h2 className="sr-only">What We Offer</h2>
          <div className="grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '1rem'
          }}>
            {services.map((service, i) => (
              <article 
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
                <span className="f2 db mb2" aria-hidden="true">{service.icon}</span>
                <h3 className="f4 f3-l fw6 mb3 black" style={{ letterSpacing: '-0.01em' }}>{service.title}</h3>
                <p className="f5 lh-copy black-60">{service.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Hand Painting Split Section ─── */}
      <section className="flex flex-column flex-row-l min-vh-50 min-vh-100-l" aria-label="About our painting experience">
        <div className="w-100 w-50-l order-1 order-0-l" style={{ minHeight: '40vh' }}>
          <img 
            src={HandPainting} 
            alt="A student's hand painting on canvas during a guided art class at Painting Outside The Lines Studio" 
            className="w-100 h-100 object-cover db"
            width="700"
            height="700"
            loading="lazy"
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
              being perfect, it's about discovering what you're capable of creating.
            </p>
            <a 
              href="#classes" 
              className="dib black ph4 pv3 br-pill no-underline fw6 transition-all tc"
              aria-label="Browse all painting classes at our studio"
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

      {/* ─── Classes Section ─── */}
      <section id="classes" className="pv5 pv6-l ph3 ph4-l bg-white" aria-label="Upcoming classes and events">
        <div className="max-w-7 center">
          <div className="tc mb5">
            <h2 className="f2 f1-l fw6 mb3 black" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Upcoming Classes &amp; Events
            </h2>
            <p className="f5 f4-l lh-copy black-60 measure center">
              From beginner-friendly workshops to special celebrations in Pennington Gap, find the perfect 
              painting class for your creative journey.
            </p>
          </div>

          {/* Featured Classes */}
          <div className="mb4" aria-label="Featured classes">
            <h3 className="sr-only">Featured Classes</h3>
            <div className="grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {upcomingClasses.filter(c => c.featured).map((classItem, i) => (
                <article
                  key={i}
                  className={`br4 pa4 pa5-l relative overflow-hidden transition-all ${classItem.darkText ? 'black' : 'white'}`}
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
                    <div className={`f6 fw6 mb2 tracked ttu ${classItem.darkText ? 'black-70' : 'white-80'}`} style={{ letterSpacing: '0.1em' }}>
                      ★ Featured
                    </div>
                    <h3 className={`f3 f2-l fw7 mb3 ${classItem.darkText ? 'black' : 'white'}`} style={{ letterSpacing: '-0.01em' }}>
                      {classItem.title}
                    </h3>
                    <p className={`f5 lh-copy mb3 ${classItem.darkText ? 'black-70' : 'white-90'}`}>
                      {classItem.description}
                    </p>
                  </div>
                  <div>
                    <div className={`f6 mb3 ${classItem.darkText ? 'black-70' : 'white-80'}`}>
                      <time dateTime={classItem.schedule === 'Every Thursday • 6:00 – 8:00 PM' ? 'RRRR' : undefined}>
                        {classItem.schedule}
                      </time>
                    </div>
                    <div className="flex flex-wrap items-center" style={{ gap: '0.75rem' }}>
                      {classItem.booked ? (
                        <div
                          className="dib ph4 pv2 br-pill fw6 f6"
                          role="status"
                          style={{
                            background: classItem.darkText ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.22)',
                            backdropFilter: 'blur(10px)',
                            border: classItem.darkText ? '2px solid rgba(0,0,0,0.25)' : '2px solid rgba(255,255,255,0.35)',
                            color: classItem.darkText ? 'black' : 'white'
                          }}
                        >
                          {classItem.bookedMessage || "We're booked! Keep tabs for updates on the next class."}
                        </div>
                      ) : classItem.bookingOptions ? (
                        <button
                          type="button"
                          className="pointer bn dib ph4 pv2 br-pill fw6 f6 transition-all"
                          style={{
                            background: classItem.darkText ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: classItem.darkText ? '2px solid rgba(0,0,0,0.25)' : '2px solid rgba(255,255,255,0.3)',
                            color: classItem.darkText ? 'black' : 'white'
                          }}
                          onClick={() => {
                            if (classItem.title === 'Ladies Night') {
                              setLadiesNightModalOpen(true);
                            } else {
                              setClassOptionsModal(classItem);
                            }
                          }}
                        >
                          {classItem.bookingCta || 'Choose Your Option →'}
                        </button>
                      ) : (
                        <a
                          href={classItem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dib ph4 pv2 br-pill fw6 f6 transition-all no-underline"
                          aria-label={`Register for ${classItem.title} – ${classItem.schedule}`}
                          style={{
                            background: classItem.darkText ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: classItem.darkText ? '2px solid rgba(0,0,0,0.25)' : '2px solid rgba(255,255,255,0.3)',
                            color: classItem.darkText ? 'black' : 'white'
                          }}
                        >
                          Register Now →
                        </a>
                      )}
                      {classItem.image && (
                        <button
                          type="button"
                          className="project-preview-button pointer dib ph4 pv2 br-pill fw6 f6 transition-all"
                          style={{
                            background: classItem.darkText ? 'black' : 'white',
                            border: classItem.darkText ? '2px solid black' : '2px solid white',
                            color: classItem.darkText ? 'white' : '#111'
                          }}
                          onClick={() => openProjectModal(classItem)}
                        >
                          View Project
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Regular Classes Grid */}
          <div aria-label="More classes and events">
            <h3 className="sr-only">More Classes and Events</h3>
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
                  aria-label={`Learn more about ${classItem.title} – ${classItem.schedule}`}
                  style={{ textDecoration: 'none' }}
                >
                  <article 
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
                      aria-hidden="true"
                    ></div>
                    <div className="pa4">
                      <h3 className="f4 fw6 mb2 black" style={{ letterSpacing: '-0.01em' }}>
                        {classItem.title}
                      </h3>
                      <p className="f6 lh-copy black-60 mb3">
                        {classItem.description}
                      </p>
                      <p className="f7 black-60 mb3">
                        {classItem.schedule}
                      </p>
                      <div 
                        className="dib ph3 pv2 br-pill fw6 f7 black transition-all"
                        style={{
                          border: '2px solid black'
                        }}
                      >
                        View Details →
                      </div>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="mt5 pt5 bt b--black-10" aria-label="Weekly class schedule">
            <h3 className="f3 f2-l fw6 mb4 tc black" style={{ letterSpacing: '-0.02em' }}>
              Weekly Schedule
            </h3>
            <div className="flex justify-center">
              <div className="bg-near-white pa4 br3" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="fw6 black mb2 f5">Ladies Night – Pennington Gap</div>
                <time className="black-60 db" dateTime="2025-01-02T18:00">Every Thursday, 6:00 – 8:00 PM</time>
                <a 
                  href="#ladies-night-options"
                  className="f7 black no-underline mt2 dib hover-underline"
                  aria-label="Register for Ladies Night painting class – every Thursday 6 to 8 PM"
                  onClick={(event) => {
                    event.preventDefault();
                    setLadiesNightModalOpen(true);
                  }}
                >
                  Register here →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Events Showcase ─── */}
      <section className="pv5 pv6-l ph3 ph4-l bg-black white" aria-label="Private events and parties">
        <div className="max-w-6 center">
          <h2 className="f3 f2-m f1-l fw6 mb2 mb3-l tc" style={{ letterSpacing: '-0.02em' }}>
            Every occasion deserves art
          </h2>
          <p className="f6 f5-l tc mb4 mb5-l white-60">Tailored painting experiences for every celebration in the Pennington Gap area</p>
          
          <ul className="flex flex-wrap justify-center gap2 mb4 mb5-l list pa0 ma0" role="list" style={{ gap: '0.5rem' }} aria-label="Types of private events we host">
            {parties.map((party, i) => (
              <li 
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
              </li>
            ))}
          </ul>

          <div className="tc">
            <a 
              href="#contact" 
              className="dib bg-white black ph4 pv3 ph5-l br-pill no-underline fw6 hover-bg-white-90 transition-all tc"
              aria-label="Contact us to book a private painting party or event"
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

      {/* ─── Split Feature – Schedule ─── */}
      <section className="flex flex-column flex-row-l min-vh-50 min-vh-100-l" aria-label="Flexible class schedules">
        <div className="w-100 w-50-l flex items-center justify-center pa4 pa5-l bg-white order-0">
          <div className="w-100" style={{ maxWidth: '32rem' }}>
            <h2 className="f3 f2-m f1-l fw6 mb3 mb4-l black" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Your schedule.<br/>Your masterpiece.
            </h2>
            <p className="f5 f4-l lh-copy black-60 mb4">
              Whether you prefer structured classes or drop-in sessions, we have options that fit your lifestyle. 
              Browse our full schedule and find the perfect time to create at our Pennington Gap studio.
            </p>
            <a 
              href="#classes" 
              className="dib black ph4 pv3 br-pill no-underline fw6 transition-all tc"
              aria-label="View all available painting classes and schedules"
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
            alt="Exterior view of Painting Outside The Lines Studio on Main Street in Pennington Gap, Virginia" 
            className="w-100 object-cover db"
            width="700"
            height="700"
            loading="lazy"
            style={{ height: '100%', minHeight: '40vh' }}
          />
        </div>
      </section>

      {/* ─── Image Feature – Paint Image ─── */}
      <section className="flex flex-column flex-row-l min-vh-50 min-vh-100-l" aria-label="Creative painting experience">
        <div className="w-100 w-50-l order-1 order-0-l" style={{ minHeight: '40vh' }}>
          <img 
            src={PaintImage} 
            alt="Colorful paint supplies and a canvas being created during a guided painting class at our Virginia studio" 
            className="w-100 h-100 object-cover db"
            width="700"
            height="700"
            loading="lazy"
          />
        </div>
        <div className="w-100 w-50-l flex items-center justify-center pa4 pa5-l bg-near-white order-0 order-1-l">
          <div className="w-100" style={{ maxWidth: '32rem' }}>
            <h2 className="f3 f2-m f1-l fw6 mb3 mb4-l black" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Create something<br/>extraordinary
            </h2>
            <p className="f5 f4-l lh-copy black-60 mb4">
              From first brushstroke to final masterpiece, discover the joy of bringing your vision to life. 
              No experience needed—just bring your creativity and our instructors will guide you through the rest.
            </p>
            <a 
              href="#classes" 
              className="dib black ph4 pv3 br-pill no-underline fw6 transition-all tc"
              aria-label="Browse painting classes at Painting Outside The Lines Studio"
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

      {/* ─── Contact / Studio Interior ─── */}
      <section id="contact" className="flex flex-column flex-row-l min-vh-50 min-vh-100-l" aria-label="Studio location and contact information">
        <div className="w-100 w-50-l flex items-center justify-center pa4 pa5-l bg-white order-0">
          <div className="w-100" style={{ maxWidth: '32rem' }}>
            <h2 className="f3 f2-m f1-l fw6 mb3 mb4-l black" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              A space designed<br/>for inspiration
            </h2>
            <p className="f5 f4-l lh-copy black-60 mb4">
              Step into our thoughtfully designed Pennington Gap studio where every detail encourages creativity. 
              Natural light, comfortable seating, and an atmosphere that makes artistry feel effortless.
            </p>
            <address className="mb4" style={{ fontStyle: 'normal' }}>
              <div className="fw6 black mb2">Location</div>
              <div className="black-60 mb1">140 Main Street</div>
              <div className="black-60 mb3">Pennington Gap, VA 24277</div>
              
              <div className="fw6 black mb2">Contact Us</div>
              <div className="black-60 mb1">
                <a href="tel:+12766908848" className="black-60 no-underline hover-black" aria-label="Call Painting Outside The Lines Studio at 276-690-8848">
                  +1 (276) 690-8848
                </a>
              </div>
              <div className="black-60">
                <a href="mailto:stac68camaro@gmail.com" className="black-60 no-underline hover-black" aria-label="Email Painting Outside The Lines Studio">
                  stac68camaro@gmail.com
                </a>
              </div>
            </address>
            <a 
              href="#classes" 
              className="dib black ph4 pv3 br-pill no-underline fw6 transition-all tc"
              aria-label="View all classes offered at our studio"
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
            alt="Bright and welcoming interior of Painting Outside The Lines Studio with easels, canvases, and natural light in Pennington Gap VA" 
            className="w-100 object-cover db"
            width="700"
            height="700"
            loading="lazy"
            style={{ height: '100%', minHeight: '40vh' }}
          />
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="pv5 pv6-l ph3 ph4-l tc" aria-label="Get started with painting" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="max-w-4 center white">
          <h2 className="f3 f2-m f1-l fw6 mb3" style={{ letterSpacing: '-0.02em' }}>
            Ready to create?
          </h2>
          <p className="f5 f4-l mb4 mb5-l white-90 measure center">
            Join us for an unforgettable painting experience at our Pennington Gap studio. No experience necessary — just show up and have fun.
          </p>
          <div className="flex flex-column flex-row-ns justify-center items-center" style={{ gap: '1rem' }}>
            <a 
              href="#classes" 
              className="dib w-100 w-auto-ns bg-white black ph4 pv3 ph5-l br-pill no-underline fw6 hover-bg-white-90 transition-all tc"
              aria-label="Browse all upcoming painting classes"
              style={{ 
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Browse Classes
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="pv4 pv5-l ph3 ph4-l bg-near-white" aria-label="Site footer">
        <div className="max-w-7 center">
          <div className="flex flex-column flex-row-l justify-between items-start mb4">
            <div className="mb4 mb0-l">
              <h3 className="f4 f3-l fw6 mb3 black">Painting Outside The Lines Studio</h3>
              <address style={{ fontStyle: 'normal' }}>
                <p className="f6 f5-l black-60 mb2">140 Main Street</p>
                <p className="f6 f5-l black-60 mb2">Pennington Gap, VA 24277</p>
                <p className="f6 f5-l black-60 mb1">
                  <a href="tel:+12766908848" className="black-60 no-underline hover-black" aria-label="Call us at 276 690 8848">
                    +1 (276) 690-8848
                  </a>
                </p>
                <p className="f6 f5-l black-60">
                  <a href="mailto:stac68camaro@gmail.com" className="black-60 no-underline hover-black" aria-label="Email us">
                    stac68camaro@gmail.com
                  </a>
                </p>
              </address>
            </div>
            <div className="flex gap3 gap4-l">
              <div>
                <h4 className="f6 f5-l fw6 mb2 black">Navigate</h4>
                <nav aria-label="Footer navigation">
                  <a href="#classes" className="db f7 f6-l black-60 no-underline hover-black pv2 mb1" style={{ minHeight: '44px' }}>Classes &amp; Events</a>
                  <a href="#contact" className="db f7 f6-l black-60 no-underline hover-black pv2" style={{ minHeight: '44px' }}>Location &amp; Contact</a>
                </nav>
              </div>
              <div>
                <h4 className="f6 f5-l fw6 mb2 black">Connect</h4>
                <nav aria-label="Social media links">
                  <a 
                    href="https://www.facebook.com/p/Painting-Outside-the-Lines-Studio-61557459762829/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="db f7 f6-l black-60 no-underline hover-black mb2"
                    aria-label="Visit Painting Outside The Lines Studio on Facebook"
                  >
                    Facebook
                  </a>
                </nav>
              </div>
            </div>
          </div>
          <div className="pt4 bt b--black-10 tc f7 f6-l black-60">
            <div className="mb2">
              © {new Date().getFullYear()} Painting Outside The Lines Studio. All rights reserved.
            </div>
            <div>
              Built by{' '}
              <a 
                href="https://www.smithdigitals.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="black-60 no-underline hover-black fw6"
                aria-label="Visit Smith Digitals – web design agency"
              >
                Smith Digitals
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── FAQ (visually hidden, crawled by Google for rich snippets) ─── */}
      <div className="sr-only" aria-hidden="true">
        <h2>Frequently Asked Questions</h2>
        <div itemScope itemType="https://schema.org/Question">
          <h3 itemProp="name">Do I need painting experience to attend a class?</h3>
          <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
            <p itemProp="text">No experience is needed at all. Our expert instructors guide you step-by-step through the entire painting process at our Pennington Gap studio, so anyone can create a beautiful masterpiece.</p>
          </div>
        </div>
        <div itemScope itemType="https://schema.org/Question">
          <h3 itemProp="name">What is included in the class price?</h3>
          <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
            <p itemProp="text">All beverages and painting supplies are included in your ticket price. Just bring yourself and your imagination!</p>
          </div>
        </div>
        <div itemScope itemType="https://schema.org/Question">
          <h3 itemProp="name">Where is Painting Outside The Lines Studio located?</h3>
          <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
            <p itemProp="text">We are located at 140 Main Street, Pennington Gap, Virginia 24277, in the heart of Lee County.</p>
          </div>
        </div>
        <div itemScope itemType="https://schema.org/Question">
          <h3 itemProp="name">Can I book a private painting party?</h3>
          <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
            <p itemProp="text">Yes! We offer private painting parties for birthdays, bridal showers, corporate team building, holiday events, and more. Contact us at stac68camaro@gmail.com or call +1 276-690-8848 to book your event.</p>
          </div>
        </div>
        <div itemScope itemType="https://schema.org/Question">
          <h3 itemProp="name">When are your regular painting classes held?</h3>
          <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
            <p itemProp="text">Our Ladies Night class runs every Thursday from 6:00 PM to 8:00 PM at our Pennington Gap studio. We also offer special seasonal classes and events throughout the year.</p>
          </div>
        </div>
      </div>

      {projectModal && (
        <div
          className={`project-modal-overlay fixed top-0 left-0 w-100 h-100 flex items-center justify-center pa3 pa4-l ${projectModalClosing ? 'project-modal-closing' : ''}`}
          role="presentation"
          onClick={closeProjectModal}
        >
          <section
            className="project-modal-panel bg-white black br3 overflow-hidden relative"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="project-modal-close absolute bg-white black pointer br-100 flex items-center justify-center"
              aria-label="Close project image"
              onClick={closeProjectModal}
            >
              ×
            </button>
            <img
              src={projectModal.image}
              alt={projectModal.imageAlt || projectModal.title}
              className="db w-100"
              style={{
                maxHeight: '72vh',
                objectFit: 'contain',
                background: '#f4f4f4'
              }}
            />
            <div className="pa4">
              <h2 id="project-modal-title" className="f4 f3-l fw7 black ma0 mb2" style={{ letterSpacing: '-0.01em' }}>
                {projectModal.title}
              </h2>
              <p className="f6 black-60 ma0">{projectModal.schedule}</p>
            </div>
          </section>
        </div>
      )}

      {ladiesNightModalOpen && (
        <div
          className="fixed top-0 left-0 w-100 h-100 flex items-center justify-center pa3 pa4-l"
          style={{
            background: 'rgba(0,0,0,0.72)',
            zIndex: 1200
          }}
          role="presentation"
          onClick={() => setLadiesNightModalOpen(false)}
        >
          <section
            id="ladies-night-options"
            className="bg-white black br3 w-100 overflow-hidden"
            style={{
              maxWidth: '960px',
              maxHeight: '88vh',
              boxShadow: '0 30px 80px rgba(0,0,0,0.35)'
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ladies-night-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between items-start pa4 pa5-l pb3">
              <div>
                <h2 id="ladies-night-title" className="f3 f2-l fw7 ma0 mb2 black" style={{ letterSpacing: '-0.02em' }}>
                  Ladies Night Paintings
                </h2>
                <p className="f6 f5-l lh-copy black-60 ma0">
                  Choose your painting for Thursday night.
                </p>
              </div>
              <button
                type="button"
                className="bg-transparent bn pointer black f2 lh-solid pa2"
                aria-label="Close Ladies Night painting choices"
                onClick={() => setLadiesNightModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div
              className="pa4 pa5-l pt2 overflow-y-auto"
              style={{
                maxHeight: 'calc(88vh - 130px)'
              }}
            >
              <div
                className="grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                  gap: '1rem'
                }}
              >
                {ladiesNightPaintings.map((painting) => (
                  <article
                    key={painting.title}
                    className="bg-white br3 overflow-hidden"
                    style={{
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  >
                    <img
                      src={painting.image}
                      alt={painting.alt || `${painting.title} placeholder`}
                      className="db w-100"
                      style={{
                        aspectRatio: '4 / 3',
                        objectFit: 'cover'
                      }}
                    />
                    <div className="pa3">
                      <div className="flex justify-between items-start mb3" style={{ gap: '0.75rem' }}>
                        <h3 className="f6 fw6 black ma0">{painting.title}</h3>
                        <div className="f6 fw7 black">{painting.price}</div>
                      </div>
                      <a
                        href={painting.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dib w-100 bg-black white pv2 ph3 br-pill no-underline fw6 tc f7"
                        aria-label={`Book ${painting.title}`}
                      >
                        Book Now
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {classOptionsModal && (
        <div
          className="fixed top-0 left-0 w-100 h-100 flex items-center justify-center pa3 pa4-l"
          style={{
            background: 'rgba(0,0,0,0.72)',
            zIndex: 1200
          }}
          role="presentation"
          onClick={() => setClassOptionsModal(null)}
        >
          <section
            id="door-hanger-options"
            className="bg-white black br3 w-100 overflow-hidden"
            style={{
              maxWidth: '720px',
              maxHeight: '88vh',
              boxShadow: '0 30px 80px rgba(0,0,0,0.35)'
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="class-options-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between items-start pa4 pa5-l pb3">
              <div>
                <h2 id="class-options-title" className="f3 f2-l fw7 ma0 mb2 black" style={{ letterSpacing: '-0.02em' }}>
                  {classOptionsModal.title}
                </h2>
                <p className="f6 f5-l lh-copy black-60 ma0">
                  Choose your project for this class.
                </p>
              </div>
              <button
                type="button"
                className="bg-transparent bn pointer black f2 lh-solid pa2"
                aria-label={`Close ${classOptionsModal.title} choices`}
                onClick={() => setClassOptionsModal(null)}
              >
                ×
              </button>
            </div>

            <div
              className="pa4 pa5-l pt2 overflow-y-auto"
              style={{
                maxHeight: 'calc(88vh - 130px)'
              }}
            >
              <div
                className="grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                  gap: '1rem'
                }}
              >
                {classOptionsModal.bookingOptions.map((option) => (
                  <article
                    key={option.title}
                    className="bg-white br3 overflow-hidden"
                    style={{
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  >
                    <img
                      src={option.image}
                      alt={option.alt || option.title}
                      className="db w-100"
                      style={{
                        aspectRatio: '4 / 3',
                        objectFit: 'contain',
                        background: '#f4f4f4'
                      }}
                    />
                    <div className="pa3">
                      <div className="flex justify-between items-start mb3" style={{ gap: '0.75rem' }}>
                        <h3 className="f6 fw6 black ma0">{option.title}</h3>
                        <div className="f6 fw7 black">{option.price}</div>
                      </div>
                      <a
                        href={option.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dib w-100 bg-black white pv2 ph3 br-pill no-underline fw6 tc f7"
                        aria-label={`Book ${option.title}`}
                      >
                        Book Now
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      <style>{`
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* ─── Screen-reader only utility ─── */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
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

        .project-preview-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.18);
        }

        .project-modal-overlay {
          z-index: 1300;
          background: rgba(0,0,0,0.76);
          animation: projectOverlayIn 0.24s ease both;
        }

        .project-modal-overlay.project-modal-closing {
          animation: projectOverlayOut 0.22s ease both;
        }

        .project-modal-panel {
          width: min(92vw, 820px);
          max-height: 90vh;
          box-shadow: 0 30px 90px rgba(0,0,0,0.38);
          animation: projectPanelIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .project-modal-closing .project-modal-panel {
          animation: projectPanelOut 0.22s ease both;
        }

        .project-modal-close {
          top: 1rem;
          right: 1rem;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(0,0,0,0.12);
          font-size: 1.75rem;
          line-height: 1;
          z-index: 1;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18);
          transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
        }

        .project-modal-close:hover {
          background: black;
          color: white;
          transform: scale(1.06);
        }

        @keyframes projectOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes projectOverlayOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes projectPanelIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes projectPanelOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(10px) scale(0.97);
          }
        }

        /* ─── Focus visible for keyboard nav ─── */
        a:focus-visible,
        button:focus-visible {
          outline: 2px solid #667eea;
          outline-offset: 2px;
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
      </main>
    </div>
  );
}

export default App;
