import { useState, useEffect } from "react";
import {
  profile,
  about,
  skills,
  experience,
  projects,
  education,
  certifications,
  achievements,
} from "./data.js";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="container nav__inner">
        <a href="#home" className="nav__brand" onClick={() => setOpen(false)}>
          {profile.shortName}
          <span className="nav__dot">.</span>
        </a>
        <nav className={`nav__links ${open ? "nav__links--open" : ""}`}>
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a className="nav__resume" href={profile.resumeUrl} target="_blank" rel="noreferrer">
            Resume
          </a>
        </nav>
        <button
          className="nav__toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero__inner">
        <p className="hero__eyebrow">Hello, I'm</p>
        <h1 className="hero__name">{profile.name}</h1>
        <h2 className="hero__title">{profile.title}</h2>
        <p className="hero__tagline">{profile.tagline}</p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#contact">
            Get in touch
          </a>
          <a className="btn btn--ghost" href={profile.resumeUrl} target="_blank" rel="noreferrer">
            Download Resume
          </a>
        </div>
        <div className="hero__social">
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={`mailto:${profile.email}`}>Email</a>
        </div>
      </div>
    </section>
  );
}

function Section({ id, title, kicker, children }) {
  return (
    <section id={id} className="section">
      <div className="container">
        <div className="section__head">
          {kicker && <span className="section__kicker">{kicker}</span>}
          <h2 className="section__title">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function About() {
  return (
    <Section id="about" title="About Me" kicker="01">
      <div className="about">
        <p className="about__text">{about}</p>
        <ul className="about__facts">
          <li>
            <span className="about__label">Location</span>
            {profile.location}
          </li>
          <li>
            <span className="about__label">Role</span>
            {profile.title} @ WebileApps
          </li>
          <li>
            <span className="about__label">Focus</span>
            React.js, Modern Frontend
          </li>
        </ul>
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience" title="Work Experience" kicker="02">
      <div className="timeline">
        {experience.map((job, i) => (
          <article key={i} className="timeline__item">
            <div className="timeline__marker" />
            <div className="timeline__content">
              <div className="timeline__top">
                <h3>{job.role}</h3>
                <span className="timeline__period">{job.period}</span>
              </div>
              <p className="timeline__company">
                {job.company} <span className="badge">{job.type}</span>
              </p>
              <ul className="timeline__points">
                {job.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
              <div className="tags">
                {job.technologies.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Projects() {
  return (
    <Section id="projects" title="Projects" kicker="03">
      <div className="projects">
        {projects.map((p, i) => (
          <article key={i} className="card">
            <div className="card__head">
              <h3>{p.name}</h3>
            </div>
            <p className="card__desc">{p.description}</p>
            <ul className="card__highlights">
              {p.highlights.map((h, j) => (
                <li key={j}>{h}</li>
              ))}
            </ul>
            <div className="tags">
              {p.tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
            {p.link && (
              <a className="card__link" href={p.link} target="_blank" rel="noreferrer">
                View project →
              </a>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" title="Skills" kicker="04">
      <div className="skills">
        {skills.map((group) => (
          <div key={group.category} className="skills__group">
            <h3>{group.category}</h3>
            <div className="tags">
              {group.items.map((s) => (
                <span key={s} className="tag tag--lg">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Education() {
  return (
    <Section id="education" title="Education & Certifications" kicker="05">
      <div className="edu-grid">
        <div className="edu-col">
          {education.map((e, i) => (
            <article key={i} className="edu-item">
              <div className="edu-item__top">
                <h3>{e.degree}</h3>
                <span className="edu-item__period">{e.period}</span>
              </div>
              <p className="edu-item__school">{e.school}</p>
              <p className="edu-item__score">{e.score}</p>
            </article>
          ))}
        </div>
        <div className="edu-col">
          <div className="panel">
            <h3 className="panel__title">Certifications</h3>
            <ul className="panel__list">
              {certifications.map((c, i) => (
                <li key={i}>
                  <span>{c.name}</span>
                  <em>{c.date}</em>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel">
            <h3 className="panel__title">Achievements</h3>
            <ul className="panel__list panel__list--plain">
              {achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" title="Get In Touch" kicker="06">
      <div className="contact">
        <p className="contact__lead">
          I'm open to new opportunities and collaborations. Feel free to reach out.
        </p>
        <div className="contact__links">
          <a className="contact__card" href={`mailto:${profile.email}`}>
            <span className="contact__label">Email</span>
            {profile.email}
          </a>
          <a className="contact__card" href={`tel:${profile.phone.replace(/\s/g, "")}`}>
            <span className="contact__label">Phone</span>
            {profile.phone}
          </a>
          <a className="contact__card" href={profile.linkedin} target="_blank" rel="noreferrer">
            <span className="contact__label">LinkedIn</span>
            maturi-abhinaya
          </a>
          <a className="contact__card" href={profile.github} target="_blank" rel="noreferrer">
            <span className="contact__label">GitHub</span>
            abhinayamaturi-284
          </a>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          &copy; {new Date().getFullYear()} {profile.name}
        </p>
        <p className="footer__note">Built with React &amp; Vite</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
