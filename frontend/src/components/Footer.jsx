import { useState } from "react";


const CREATORS = [
  {
    name: "Rahul Goyal",
    role: "Frontend Developer",
    photo: "/creators/rahul.jpg",
    linkedin: "https://www.linkedin.com/in/rahulgoyal83789",
    github: "https://github.com/rahulgoyal83789",
    instagram: "https://www.instagram.com/rahulgoyal83789/",
  },
  {
    name: "Madhur Gupta",
    role: "Backend Developer",
    photo: "/creators/madhur.jpg",
    linkedin: "https://www.linkedin.com/in/madhur-gupta-881535308/",
    github: "https://github.com/madhur2284",
    instagram: "https://www.instagram.com/madhur_gupta2/",
  },
];

function initialsOf(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function CreatorAvatar({ name, photo }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-paper bg-tape font-display text-xl text-paper shadow-card">
        {initialsOf(name)}
      </div>
    );
  }

  return (
    <img
      src={photo}
      alt={name}
      onError={() => setFailed(true)}
      className="h-20 w-20 rounded-full border-4 border-paper object-cover shadow-card"
    />
  );
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-paper/10 text-paper/80 transition-colors hover:bg-marker hover:text-ink"
    >
      {children}
    </a>
  );
}

function CreatorCard({ creator, rotation }) {
  return (
    <div className={`flex flex-col items-center gap-2 rounded-sm bg-paper/[0.04] px-6 py-5 ${rotation}`}>
      <div className="relative">
        <span className="pin-dot" aria-hidden="true" />
        <CreatorAvatar name={creator.name} photo={creator.photo} />
      </div>

      <p className="mt-1 font-display text-lg text-paper">{creator.name}</p>
      <p className="-mt-1 font-hand text-sm text-paper/60">{creator.role}</p>

      <div className="mt-1 flex items-center gap-2">
        <SocialIcon href={creator.linkedin} label={`${creator.name} on LinkedIn`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
          </svg>
        </SocialIcon>
        <SocialIcon href={creator.github} label={`${creator.name} on GitHub`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.46-1.2-1.11-1.52-1.11-1.52-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.1 2.91.84.09-.66.35-1.1.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.28 9.28 0 0 1 2.5-.35c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2z" />
          </svg>
        </SocialIcon>
        <SocialIcon href={creator.instagram} label={`${creator.name} on Instagram`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.55.22.95.47 1.37.89.42.42.67.82.89 1.37.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.55-.47.95-.89 1.37-.42.42-.82.67-1.37.89-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.37-.89 3.7 3.7 0 0 1-.89-1.37c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.55.47-.95.89-1.37.42-.42.82-.67 1.37-.89.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.5.01-4.73.07-.96.04-1.48.2-1.83.34-.46.18-.78.39-1.13.73-.34.34-.55.67-.73 1.13-.14.35-.3.87-.34 1.83-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.04.96.2 1.48.34 1.83.18.46.39.78.73 1.13.34.34.67.55 1.13.73.35.14.87.3 1.83.34 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c.96-.04 1.48-.2 1.83-.34.46-.18.78-.39 1.13-.73.34-.34.55-.67.73-1.13.14-.35.3-.87.34-1.83.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.04-.96-.2-1.48-.34-1.83a2.7 2.7 0 0 0-.73-1.13 2.7 2.7 0 0 0-1.13-.73c-.35-.14-.87-.3-1.83-.34-1.23-.06-1.58-.07-4.73-.07zm0 3.65a4.35 4.35 0 1 1 0 8.7 4.35 4.35 0 0 1 0-8.7zm0 1.8a2.55 2.55 0 1 0 0 5.1 2.55 2.55 0 0 0 0-5.1zm5.54-2a1.02 1.02 0 1 1-2.04 0 1.02 1.02 0 0 1 2.04 0z" />
          </svg>
        </SocialIcon>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-cork-dark pb-6 pt-8 text-center">
      <p className="font-hand text-lg text-paper/70">made by</p>

      <div className="mx-auto mt-3 flex max-w-md flex-col items-center justify-center gap-4 px-5 sm:flex-row sm:gap-8">
        <CreatorCard creator={CREATORS[0]} rotation="-rotate-1.5" />
        <CreatorCard creator={CREATORS[1]} rotation="rotate-1.5" />
      </div>

      <p className="mt-6 px-5 text-xs text-paper/60">
        CampusConnect &mdash; find it here, message the seller, sort it out
        yourselves. No payments, no middlemen.
      </p>
    </footer>
  );
}
