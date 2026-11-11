import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  Play,
  Phone,
  Sparkles,
  UserRoundSearch,
  BadgeDollarSign,
  MapPin,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CleanerSection } from "@/components/home/cleaner-section";
import { LaunchAction } from "@/components/home/launch-action";
const services = [
  {
    title: "Standard Cleaning",
    description: "Keep your home fresh with dependable everyday cleaning.",
    image: "/images/kitchen.jpg",
    alt: "Bright, tidy kitchen with white cabinets and natural wood details",
    detail: "A little refresh. A lot more ease.",
    number: "01",
  },
  {
    title: "Deep Cleaning",
    description: "Detailed cleaning for the spaces that need extra attention.",
    image: "/images/bathroom.jpg",
    alt: "Fresh contemporary bathroom with a clean vanity and shower",
    detail: "A fresh start, down to the details.",
    number: "02",
  },
  {
    title: "Move-Out Cleaning",
    description:
      "Checklist-driven cleaning to help prepare your space for the next chapter.",
    image: "/images/move-out.jpg",
    alt: "Sunlit, uncluttered home ready for its next chapter",
    detail: "New chapter. Clean slate.",
    number: "03",
    flagship: true,
  },
];
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <section id="home" className="hero">
          <div className="hero-wash" />
          <div className="container hero-grid">
            <div className="hero-content">
              <span className="eyebrow">PROFESSIONAL HOME CLEANING</span>
              <h1>
                Clean Spaces.
                <br />
                <span>Clear Minds.</span>
              </h1>
              <p className="hero-description">
                Trusted cleaning professionals for standard, deep, and move-out
                cleaning in the Twin Cities.
              </p>
              <div className="hero-actions">
                <LaunchAction
                  title="Your fresh start is on its way."
                  message="Online cleaning estimates are coming soon. You’ll be able to share your home details and explore a clear estimate before requesting an appointment."
                >
                  Get My Cleaning Estimate
                </LaunchAction>
                <a className="button button-outline" href="#how-it-works">
                  <Play size={15} fill="currentColor" />
                  How It Works
                </a>
              </div>
              <div className="hero-location">
                <MapPin size={15} /> A fresh start for Minneapolis–St. Paul
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-photo">
                <Image
                  src="/images/living-room.jpg"
                  alt="A light-filled living room with a cream sofa, warm neutral furnishings, and leafy plants"
                  fill
                  priority
                  sizes="(max-width: 767px) 70vw, (max-width: 1200px) 55vw, 750px"
                />
              </div>
              <div className="image-caption">
                <span className="caption-icon">
                  <Sparkles size={20} />
                </span>
                <span>
                  A little less cleaning.
                  <br />
                  <strong>A little more living.</strong>
                </span>
              </div>
              <span className="visual-spark" aria-hidden="true">
                ✦
              </span>
            </div>
          </div>
        </section>
        <section className="benefits container" aria-label="Sweaply benefits">
          {[
            { icon: UserRoundSearch, label: "Cleaner Profiles" },
            { icon: CalendarDays, label: "Flexible Scheduling" },
            { icon: BadgeDollarSign, label: "Clear Estimates" },
            { icon: ClipboardCheck, label: "Cleaning Checklists" },
          ].map(({ icon: Icon, label }) => (
            <div className="benefit" key={label}>
              <Icon strokeWidth={1.6} aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </section>
        <CleanerSection />
        <section id="services" className="services-section container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A CLEAN FOR EVERY CHAPTER</span>
              <h2>
                Our <span>Cleaning Services</span>
              </h2>
            </div>
            <p className="section-aside">
              From the everyday reset
              <br />
              to the big fresh start.
            </p>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <article
                className={`service-card ${service.flagship ? "flagship" : ""}`}
                key={service.title}
              >
                <div className="service-image">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 767px) 90vw, 33vw"
                  />
                  {service.flagship && (
                    <span className="flagship-badge">
                      <Sparkles size={13} /> OUR SIGNATURE SERVICE
                    </span>
                  )}
                  <span className="service-number">{service.number}</span>
                </div>
                <div className="service-content">
                  <span className="service-detail">{service.detail}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <LaunchAction
                    variant="text"
                    title={`${service.title}, made simple.`}
                    message="Service details and personalized estimates are coming soon. No appointment has been requested. An appointment will only be confirmed after a cleaner accepts your request."
                  >
                    Explore service
                  </LaunchAction>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="how-it-works" className="how-section">
          <div className="container how-grid">
            <div className="how-intro">
              <span className="eyebrow">LESS ON YOUR LIST</span>
              <h2>
                Your fresh start,
                <br />
                <span>in three simple steps.</span>
              </h2>
              <p>
                A little support for your home.
                <br />
                More time for what feels like you.
              </p>
              <span className="status-label">
                <span /> THE EXPERIENCE WE’RE BUILDING
              </span>
            </div>
            <ol className="steps">
              {[
                {
                  title: "Tell us about your space",
                  copy: "Choose your cleaning service and share the details for a personalized estimate.",
                },
                {
                  title: "Find your kind of cleaner",
                  copy: "Explore local professionals and request a cleaner who feels like the right fit.",
                },
                {
                  title: "Make room for life",
                  copy: "Once your cleaner accepts and your appointment is confirmed, look forward to a fresh start.",
                },
              ].map((step, i) => (
                <li key={step.title}>
                  <span className="step-number">0{i + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                  {i === 2 && <Check className="step-check" size={19} />}
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="help-section container">
          <div className="help-icon">
            <Phone size={31} strokeWidth={1.4} />
            <Sparkles size={16} />
          </div>
          <div className="help-copy">
            <span className="eyebrow">A LITTLE HELP GOES A LONG WAY</span>
            <h2>
              Need Help? <span>Sweaply Can Answer.</span>
            </h2>
            <p>
              Questions about cleaning services or requesting an appointment?
              We&apos;re here to help.
            </p>
          </div>
          <div className="help-action">
            <button className="button button-outline" disabled>
              <Phone size={16} />
              Call Sweaply
              <ArrowUpRight size={17} />
            </button>
            <span>Phone support is coming soon</span>
          </div>
        </section>
        <div className="closing-line container">
          <Sparkles size={16} />
          <span>Clean home. Clear head. More you.</span>
          <ArrowRight size={18} />
        </div>
      </main>
      <Footer />
    </>
  );
}
