/**
 * ─────────────────────────────────────────────────────────────────────
 *  PHOTOGRAPHY
 * ─────────────────────────────────────────────────────────────────────
 *  PLACEHOLDER — stock photos from Pexels (free for commercial use,
 *  https://www.pexels.com/license/). People shown are models, not
 *  Park Live Network hosts. Replace with the client's own photography
 *  before launch: drop files in /public/images and update this file.
 *  Photo IDs are listed in src/data/photos.ts (pexels.com/photo/<id>).
 * ─────────────────────────────────────────────────────────────────────
 */
import { PHOTOS } from "@/data/photos";

export type PhotoKey = keyof typeof PHOTOS;

export const ALT: Record<PhotoKey, string> = {
  "concert-phone": "A fan filming a live show on a smartphone in a blue-lit crowd",
  "crowd-lights": "A crowd holding up glowing phone lights at a night event",
  "on-air": "A glowing red neon ON AIR sign",
  "on-air-side": "A red ON AIR sign mounted on a studio wall",
  "mic-podcast": "A podcast microphone on a desk arm in a dim studio",
  "mic-pink": "A studio condenser microphone with a pop filter in pink light",
  "headphones-night": "A woman with headphones listening with her eyes closed under city lights",
  "ringlight-phone": "A woman framed by a ring light holding a smartphone",
  "neon-laptop": "A woman wearing headphones at a laptop in a neon-lit room",
  "neon-studio": "A creator sitting in a home studio with a ring light and neon strips",
  "neon-face": "A portrait with neon make-up and headphones",
  "ringlight-man": "A smiling man talking to camera beside a ring light",
  "phone-stand": "A smartphone on a stand recording a video call",
  "mixer-colour": "A colourful audio mixing console in a dark studio",
  "mixer-dark": "Faders of an audio mixer in low light",
  "crowd-blue": "A crowd in blue light filming with their phones",
  "stage-speaker": "A speaker on stage facing an audience holding up phone lights",
  "team-table": "A team meeting around a long table with laptops",
  "team-meeting": "Four colleagues planning together around a table",
  "payment-tap": "A smartphone tapping a card terminal to pay",
  handshake: "Two people shaking hands over documents",
  "india-phone": "A smiling man in a turban talking on his phone",
  "phone-smile": "A young woman smiling at her phone on an evening street",
  "dance-creator": "A creator dancing in front of a phone on a tripod under neon lights",
  "friends-phone": "Three friends laughing together over a smartphone",
  "night-friends": "Friends gathered at night sharing something on a phone",
};

export const photo = (key: PhotoKey) => ({ ...PHOTOS[key], alt: ALT[key] });

/** Where each photo is used. Swap keys here to change the art direction. */
export const media = {
  /** Hero: the live-stream phone and the floating app cards */
  hero: {
    stream: "ringlight-man",
    shortVideo: "dance-creator",
    match: ["phone-smile", "india-phone"],
  } satisfies { stream: PhotoKey; shortVideo: PhotoKey; match: [PhotoKey, PhotoKey] },

  /** Photos that sit inline inside the manifesto sentence */
  manifesto: { apps: "mic-pink", users: "crowd-lights", team: "team-table" } satisfies Record<string, PhotoKey>,

  /** One photo per service (keyed by service slug) */
  services: {
    "live-streaming": "neon-studio",
    "audio-chat": "headphones-night",
    "dating-social": "phone-smile",
    "short-video": "dance-creator",
    "app-agency-network": "team-table",
  } satisfies Record<string, PhotoKey>,

  /** "Why choose us" panels, in order */
  why: ["mixer-colour", "crowd-lights", "stage-speaker", "team-meeting", "handshake"] satisfies PhotoKey[],

  /** Partnership audiences: app owners, agencies, investors, creators */
  audiences: ["friends-phone", "team-table", "handshake", "dance-creator"] satisfies PhotoKey[],

  /** One photo per role (keyed by role slug) */
  roles: {
    "super-admin": "mixer-colour",
    "coin-seller": "india-phone",
    "bd-agency-admin": "team-meeting",
    "live-host": "ringlight-phone",
  } satisfies Record<string, PhotoKey>,

  /** Countdown step photos (Apply → Verification → Onboarding → Go live) */
  steps: ["phone-stand", "india-phone", "team-meeting", "on-air"] satisfies PhotoKey[],

  /** Draggable "on air" reel */
  reel: [
    { key: "neon-face", label: "Late-night sessions" },
    { key: "stage-speaker", label: "Live on stage" },
    { key: "mixer-colour", label: "Behind the desk" },
    { key: "ringlight-phone", label: "Creator setups" },
    { key: "crowd-blue", label: "Crowd energy" },
    { key: "mic-podcast", label: "Talk shows" },
    { key: "neon-laptop", label: "Audio rooms" },
    { key: "on-air-side", label: "Always on air" },
  ] satisfies { key: PhotoKey; label: string }[],

  /** Photos that trail the cursor in the closing section */
  trail: [
    "neon-studio", "crowd-lights", "dance-creator", "headphones-night", "on-air",
    "neon-face", "phone-smile", "mixer-colour", "night-friends", "stage-speaker",
  ] satisfies PhotoKey[],
};
