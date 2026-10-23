"use client";

import React from "react";
import Link from "next/link";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook } from "react-icons/fa";
import { SiteContentData } from "@/utils/siteContentDefaults";
import styles from "./PublicSite.module.css";

// "**negrito**" -> <strong>, "\n" -> <br/>
const renderInline = (text: string) =>
  text.split("\n").map((line, lineIndex, lines) => (
    <React.Fragment key={lineIndex}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part
      )}
      {lineIndex < lines.length - 1 && <br />}
    </React.Fragment>
  ));

// Parágrafos separados por linha em branco
const RichText = ({ text, className }: { text: string; className?: string }) => (
  <div className={className}>
    {text
      .split(/\n\s*\n/)
      .filter((p) => p.trim())
      .map((paragraph, i) => (
        <p key={i}>{renderInline(paragraph.trim())}</p>
      ))}
  </div>
);

// Texto em círculo (SVG textPath)
const CircleText = ({ id, text, className }: { id: string; text: string; className?: string }) => (
  <svg className={className} viewBox="0 0 250 250" aria-hidden>
    <path id={id} d="M 30,125 a 95,95 0 1,1 190,0 a 95,95 0 1,1 -190,0" fill="none" />
    <text>
      <textPath href={`#${id}`} startOffset="0">
        {text}
      </textPath>
    </text>
  </svg>
);

const SideLabel = ({ text, className }: { text: string; className?: string }) => (
  <span className={`${styles.sideLabel} ${className ?? ""}`}>{text}</span>
);

const bg = (url: string) => ({ backgroundImage: `url("${url}")` });

const telHref = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return `tel:${digits.length === 9 ? `+351${digits}` : digits}`;
};

interface Props {
  content: SiteContentData;
}

export default function PublicSite({ content }: Props) {
  const { header, hero, selection, about, local, team, map, contacts } = content;

  return (
    <div className={styles.site}>
      {/* ── Cabeçalho ───────────────────────────────────────── */}
      <header className={styles.header}>
        <a href="#top" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={header.logo} alt="Padaria das Trinas" />
        </a>
        <nav className={styles.nav}>
          <a href="#produtos">{header.menuProducts}</a>
          <a href="#sobre-nos">{header.menuAbout}</a>
          <a href="#contactos">{header.menuContacts}</a>
          <Link href="/auth/login" className={styles.navLogin}>
            {header.menuLogin}
          </Link>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section id="top" className={styles.hero}>
        <div className={styles.heroBg} style={bg(hero.backgroundImage)} />
        <SideLabel text={hero.sideLabel} className={styles.heroSideLabel} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span>{hero.titleLine1}</span>
            <span>{hero.titleLine2}</span>
          </h1>
          <h2 className={styles.heroSubtitle}>{hero.subtitle}</h2>
          <RichText text={hero.text} className={styles.heroText} />
          <a href="#produtos" className={styles.heroButton}>
            {hero.buttonLabel}
          </a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero.image} alt="" className={styles.heroImage} />
      </section>

      {/* ── A nossa seleção ─────────────────────────────────── */}
      <section id="produtos" className={styles.selection}>
        <span className={styles.selectionScript} aria-hidden>
          {selection.scriptText}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={selection.decorationImage} alt="" className={styles.selectionDecoration} />
        <SideLabel text={selection.sideLabel} className={styles.selectionSideLabel} />
        <div className={styles.selectionContent}>
          <h2 className={styles.selectionTitle}>{selection.title}</h2>
          <RichText text={selection.text} className={styles.darkText} />
        </div>
        <div className={styles.collage}>
          <div className={`${styles.collageItem} ${styles.collage1}`} style={bg(selection.image1)} />
          <div className={`${styles.collageItem} ${styles.collage2}`} style={bg(selection.image2)} />
          <div className={`${styles.collageItem} ${styles.collage3}`} style={bg(selection.image3)} />
          <div className={`${styles.collageItem} ${styles.collage4}`} style={bg(selection.image4)} />
          <CircleText id="circle-selection" text={selection.circleText} className={`${styles.circle} ${styles.circleDark} ${styles.selectionCircle}`} />
        </div>
      </section>

      {/* ── Sobre nós ───────────────────────────────────────── */}
      <section id="sobre-nos" className={`${styles.split} ${styles.about}`}>
        <div className={`${styles.splitImage} ${styles.aboutImage}`} style={bg(about.image)} />
        <div className={styles.splitBody}>
          <h2 className={styles.splitTitle}>
            <span>{about.titleLine1}</span>
            <span>{about.titleLine2}</span>
          </h2>
          <RichText text={about.text} className={styles.lightText} />
          <CircleText id="circle-about" text={about.circleText} className={`${styles.circle} ${styles.circleSmall} ${styles.aboutCircle}`} />
        </div>
        <div className={styles.splitStrip}>
          <SideLabel text={about.sideLabel} className={styles.stripLabel} />
        </div>
        <span className={`${styles.bigWord} ${styles.aboutBigWord}`} aria-hidden>
          {about.bigWord}
        </span>
      </section>

      {/* ── Produtos locais ─────────────────────────────────── */}
      <section className={`${styles.split} ${styles.local}`}>
        <div className={styles.splitStrip}>
          <SideLabel text={local.sideLabel} className={styles.stripLabel} />
        </div>
        <div className={`${styles.splitBody} ${styles.localBody}`}>
          <h2 className={styles.splitTitle}>
            <span>{local.titleLine1}</span>
            <span>{local.titleLine2}</span>
          </h2>
          <h3 className={styles.splitHeading}>{local.heading}</h3>
          <RichText text={local.text} className={styles.lightText} />
          <CircleText id="circle-local" text={local.circleText} className={`${styles.circle} ${styles.circleSmall} ${styles.localCircle}`} />
        </div>
        <div className={`${styles.splitImage} ${styles.localImage}`} style={bg(local.image)} />
        <span className={`${styles.bigWord} ${styles.localBigWord}`} aria-hidden>
          {local.bigWord}
        </span>
      </section>

      {/* ── A tua equipa ────────────────────────────────────── */}
      <section className={`${styles.split} ${styles.team}`}>
        <div className={`${styles.splitImage} ${styles.teamImage}`} style={bg(team.image)} />
        <div className={styles.splitBody}>
          <h2 className={`${styles.splitTitle} ${styles.teamTitle}`}>
            <span>{team.titleLine1}</span>
            <span>{team.titleLine2}</span>
          </h2>
          <h3 className={styles.splitHeading}>{team.heading}</h3>
          <RichText text={team.text} className={styles.lightText} />
        </div>
        <div className={styles.splitStrip}>
          <SideLabel text={team.sideLabel} className={styles.stripLabel} />
        </div>
        <span className={`${styles.bigWord} ${styles.teamBigWord}`} aria-hidden>
          {team.bigWord}
        </span>
      </section>

      {/* ── Mapa ────────────────────────────────────────────── */}
      {map.embedUrl && (
        <section className={styles.map}>
          <iframe title="google maps" src={map.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </section>
      )}

      {/* ── Contactos / rodapé ──────────────────────────────── */}
      <footer id="contactos" className={styles.footer}>
        <div className={styles.footerTop}>
          <div>
            <h2 className={styles.footerTitle}>{contacts.title}</h2>
            <ul className={styles.contactList}>
              <li>
                <FaMapMarkerAlt className={styles.contactIcon} />
                <span>{renderInline(contacts.address)}</span>
              </li>
              {contacts.phone && (
                <li>
                  <FaPhoneAlt className={styles.contactIcon} />
                  <a href={telHref(contacts.phone)}>{contacts.phone}</a>
                </li>
              )}
              {contacts.email && (
                <li>
                  <FaEnvelope className={styles.contactIcon} />
                  <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
                </li>
              )}
            </ul>
          </div>
          {contacts.facebookUrl && (
            <a href={contacts.facebookUrl} target="_blank" rel="noreferrer" className={styles.social}>
              <FaFacebook />
              {contacts.facebookLabel}
            </a>
          )}
          <a href="#top" className={styles.toTop} aria-label="Voltar ao topo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12 21V3M6 9l6-6 6 6" />
            </svg>
          </a>
        </div>
        <div className={styles.footerBottom}>
          <span>{contacts.copyright.replace("{ano}", String(new Date().getFullYear()))}</span>
          {contacts.credit &&
            (contacts.creditUrl ? (
              <a href={contacts.creditUrl} target="_blank" rel="noreferrer">
                {contacts.credit}
              </a>
            ) : (
              <span>{contacts.credit}</span>
            ))}
        </div>
      </footer>
    </div>
  );
}
