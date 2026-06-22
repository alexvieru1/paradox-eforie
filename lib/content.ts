/** All visible copy and structured data for the Paradox Eforie Sud site (Romanian). */

export interface Contact {
  phone: string;
  /** tel: href in international format. */
  phoneHref: string;
}

export const contact: Contact = {
  phone: "0742 064 046",
  phoneHref: "tel:+40742064046",
};

/* ---------------------------------------------------------------- partners */

export type PartnerId = "booking" | "travelmint" | "litoralul";

export interface Partner {
  id: PartnerId;
  name: string;
  /** Placeholder logo-chip text until official marks are added. */
  initials: string;
  /** Brand color for the placeholder chip. */
  color: string;
  /** Where this partner listing lives (placeholder "#"). */
  href: string;
}

export const partners: Record<PartnerId, Partner> = {
  booking: { id: "booking", name: "Booking.com", initials: "B.", color: "#003580", href: "#" },
  travelmint: { id: "travelmint", name: "Travelmint.ro", initials: "Tm", color: "#1fa89b", href: "#" },
  litoralul: { id: "litoralul", name: "Litoralul Românesc", initials: "LR", color: "#c0633f", href: "https://www.litoralulromanesc.ro/" },
};

/* ------------------------------------------------------------------- units */

export type UnitKind = "hotel" | "vila";

export interface Distance {
  label: string;
  value: string;
}

export interface GalleryItem {
  id: string;
  /** Placeholder caption describing the intended photo. */
  caption: string;
}

export interface Unit {
  slug: string;
  name: string;
  kind: UnitKind;
  stars: 2 | 3;
  address: string;
  /** Short context line shown under the name. */
  meta: string;
  blurb: string;
  distances: Distance[];
  /** Variable per unit — only these partners are shown in the Rezervă block. */
  partners: PartnerId[];
  acceptsVouchers: true;
  amenities?: string[];
  gallery?: GalleryItem[];
  /** Long description for the detail page. */
  description?: string[];
}

export const units: Unit[] = [
  {
    slug: "hotel-paradox",
    name: "Hotel Paradox",
    kind: "hotel",
    stars: 3,
    address: "Strada Oituz 4, Eforie Sud",
    meta: "central · 300 m de plajă",
    blurb:
      "Unitatea noastră centrală, cu recepție prietenoasă și tot ce-ți trebuie pentru o vacanță relaxată.",
    distances: [
      { label: "de plajă", value: "300 m" },
      { label: "de Lacul Techirghiol", value: "200 m" },
    ],
    partners: ["booking", "travelmint", "litoralul"],
    acceptsVouchers: true,
    amenities: [
      "Wi-Fi gratuit",
      "Parcare",
      "Aer condiționat",
      "Mic dejun",
      "Prietenos cu familia",
      "TV",
      "Aproape de plajă",
      "Recepție",
    ],
    gallery: [
      { id: "g1", caption: "foto · fațada hotelului" },
      { id: "g2", caption: "foto · cameră dublă" },
      { id: "g3", caption: "foto · camera de familie" },
      { id: "g4", caption: "foto · baie" },
      { id: "g5", caption: "foto · mic dejun / lobby" },
      { id: "g6", caption: "foto · vedere spre mare" },
    ],
    description: [
      "Hotel Paradox (3★) este unitatea noastră centrală: la 300 m de plajă și la doar 200 m de Lacul Techirghiol, renumit pentru băile de nămol terapeutic. Camere curate și confortabile, recepție prietenoasă și tot ce ai nevoie pentru o vacanță relaxată, la doi pași de mare.",
      "Ideal pentru familii cu copii și pentru cei care caută o vacanță tihnită, departe de aglomerație. Parcul din apropiere și apusurile de pe plajă completează experiența.",
    ],
  },
  {
    slug: "vila-paradox",
    name: "Vila Paradox",
    kind: "vila",
    stars: 2,
    address: "Ion Movilă 25, Eforie Sud",
    meta: "lângă terasă · 200 m de plajă",
    blurb:
      "Liniște și intimitate, la câțiva pași de mare și de Terasa Paradox.",
    distances: [
      { label: "de plajă", value: "200 m" },
      { label: "liniște și intimitate", value: "✓" },
    ],
    partners: ["booking", "litoralul"],
    acceptsVouchers: true,
  },
  {
    slug: "paradox-h",
    name: "Paradox H",
    kind: "vila",
    stars: 2,
    address: "Dr. Cantacuzino 79, Eforie Sud",
    meta: "deschis în 2022 · 300 m de plajă",
    blurb:
      "Unitate nouă, cu camere moderne, deschisă în 2022.",
    distances: [
      { label: "de plajă", value: "300 m" },
      { label: "camere noi, moderne", value: "✓" },
    ],
    partners: ["booking", "travelmint"],
    acceptsVouchers: true,
  },
];

export const unitsBySlug = Object.fromEntries(units.map((u) => [u.slug, u]));

/* -------------------------------------------------------------- page copy */

export const hero = {
  eyebrow: "Eforie Sud · Litoralul Românesc",
  title: "Vacanța ta la mare, exact cum o visezi.",
  subline:
    "Trei locuri de cazare, o terasă și o plajă — la câțiva pași de Marea Neagră, într-o stațiune liniștită, gândită pentru familii și pentru cei care caută tihnă.",
  voucherBadge: "Acceptăm vouchere de vacanță la toate unitățile",
};

export const cazare = {
  eyebrow: "Cazare la Paradox",
  heading: "Trei case, același spirit primitor",
  intro:
    "Fiecare unitate are personalitatea ei, dar peste tot vei găsi liniște, curățenie și oameni care te primesc ca acasă.",
};

export const terasa = {
  eyebrow: "Terasa Paradox",
  heading: "Mâncare proaspătă, gust de vacanță",
  body: "O bucătărie variată, cu preparate proaspete la prețuri accesibile — de la micul dejun în familie până la cina cu vin, sub stele, pe Ion Movilă 25.",
  tags: ["Mic dejun", "Pește proaspăt", "Prețuri accesibile", "Terasă în aer liber"],
};

export const plaja = {
  eyebrow: "Plaja Paradox",
  heading: "Plaja noastră, cu cele mai frumoase apusuri",
  body: "Nisip fin, șezlonguri, și marea la doi pași. Dimineața liniște pentru copii, seara cerul se colorează peste apă — momentul preferat al oaspeților noștri.",
};

export interface Testimonial {
  quote: string;
  author: string;
  context: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Loc liniștit, ideal cu copiii. Plaja aproape, oameni amabili. Ne-am simțit ca acasă și sigur revenim.",
    author: "Andreea M.",
    context: "familie, august 2024",
  },
  {
    quote:
      "Camere curate, terasa excelentă și foarte aproape de Techirghiol. Raport calitate-preț foarte bun.",
    author: "Bogdan & Ioana",
    context: "cuplu, iulie 2024",
  },
  {
    quote:
      "Apusurile de pe plajă sunt superbe. Stațiune calmă, perfectă pentru relaxare. Recomand cu drag!",
    author: "Cristina P.",
    context: "septembrie 2024",
  },
];

export const voucherBand = {
  badge: "Plătești cu vouchere de vacanță",
  heading: "Acceptăm vouchere de vacanță la toate unitățile",
  body: "Hotel Paradox, Vila Paradox și Paradox H — toate acceptă voucherele de vacanță. O vacanță la mare, mai ușoară pentru bugetul familiei.",
};

export const footer = {
  name: "Paradox",
  blurb:
    "Cazare, terasă și plajă în Eforie Sud, pe litoralul Mării Negre. O afacere de familie.",
  units: [
    "Hotel Paradox · Str. Oituz 4",
    "Vila Paradox · Ion Movilă 25",
    "Paradox H · Dr. Cantacuzino 79",
    "Terasa Paradox · Ion Movilă 25",
  ],
  location: "Eforie Sud, jud. Constanța · Litoralul Românesc",
  /** EU-grant compliance banner (placeholder text — replace with final disclaimer + logos). */
  euGrant:
    "Proiect cofinanțat din Fondul European de Dezvoltare Regională prin Programul Operațional Regional. Conținutul acestui material nu reprezintă în mod obligatoriu poziția oficială a Uniunii Europene sau a Guvernului României.",
  euGrantTodo: "[ text & sigle finanțare — de completat ]",
};

export const nav = [
  { href: "#cazare", label: "Cazare" },
  { href: "#terasa", label: "Terasă" },
  { href: "#plaja", label: "Plajă" },
  { href: "#recenzii", label: "Recenzii" },
];
