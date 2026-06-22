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

export interface MenuItem {
  name: string;
  price: string;
  /** Optional one-line description. */
  desc?: string;
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export interface HoursEntry {
  label: string;
  value: string;
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
  href: "/terasa",
  more: "Află mai multe",
  address: "Ion Movilă 25, Eforie Sud",
  locationBody:
    "Terasa Paradox se află pe Ion Movilă 25, în centrul stațiunii Eforie Sud — la câteva minute de mers de mare și de unitățile de cazare.",
  intro: [
    "Terasa Paradox este locul unde se adună familia la masă, pe Ion Movilă 25 — la doi pași de plajă. Bucătărie proaspătă, porții generoase și prețuri prietenoase, într-o atmosferă relaxată, în aer liber.",
    "De dimineață servim mic dejun, iar seara terasa se aprinde pentru cină — pește proaspăt, preparate la grătar și un pahar de vin sub stele. Te primim cu drag, fără rezervare sau cu o masă rezervată la telefon.",
  ],
  gallery: [
    { id: "t1", caption: "foto · terasa seara" },
    { id: "t2", caption: "foto · pește proaspăt la grătar" },
    { id: "t3", caption: "foto · mic dejun în familie" },
    { id: "t4", caption: "foto · preparate de sezon" },
    { id: "t5", caption: "foto · atmosfera în aer liber" },
    { id: "t6", caption: "foto · desert de casă" },
  ],
  menu: [
    {
      category: "Mic dejun",
      items: [
        { name: "Omletă cu brânză și verdețuri", price: "18 lei", desc: "ouă proaspete, brânză de Eforie, pâine prăjită" },
        { name: "Clătite cu gem de casă", price: "16 lei" },
        { name: "Platou continental", price: "24 lei", desc: "mezeluri, brânzeturi, legume, ou fiert" },
      ],
    },
    {
      category: "Pește & fructe de mare",
      items: [
        { name: "Pește proaspăt la grătar", price: "preț de piață", desc: "în funcție de captura zilei" },
        { name: "Midii marinare", price: "42 lei" },
        { name: "Saramură de crap", price: "38 lei" },
      ],
    },
    {
      category: "De la grătar",
      items: [
        { name: "Mici de casă (5 buc.)", price: "22 lei" },
        { name: "Ceafă de porc", price: "32 lei" },
        { name: "Piept de pui la grătar", price: "28 lei" },
      ],
    },
    {
      category: "Desert & băuturi",
      items: [
        { name: "Papanași cu smântână și dulceață", price: "20 lei" },
        { name: "Limonadă de casă", price: "12 lei" },
        { name: "Vin de casă (250 ml)", price: "14 lei" },
      ],
    },
  ],
  hours: [
    { label: "Luni – Vineri", value: "08:00 – 23:00" },
    { label: "Sâmbătă – Duminică", value: "08:00 – 24:00" },
    { label: "Sezon", value: "mai – septembrie" },
  ],
  reserve: {
    eyebrow: "Rezervă o masă",
    heading: "Te așteptăm pe terasă",
    body: "Vino direct sau sună-ne să-ți pregătim o masă — răspundem cu drag și te ajutăm cu orice.",
    cta: "Rezervă o masă",
  },
};

export const plaja = {
  eyebrow: "Plaja Paradox",
  heading: "Plaja noastră, cu cele mai frumoase apusuri",
  body: "Nisip fin, șezlonguri, și marea la doi pași. Dimineața liniște pentru copii, seara cerul se colorează peste apă — momentul preferat al oaspeților noștri.",
  href: "/plaja",
  more: "Află mai multe",
  address: "Eforie Sud, jud. Constanța",
  locationBody:
    "Plaja Paradox este în centrul stațiunii Eforie Sud, cu nisip fin și cele mai frumoase apusuri de pe litoral.",
  gallery: [
    { id: "p1", caption: "foto · plaja la apus" },
    { id: "p2", caption: "foto · șezlonguri și umbrele" },
    { id: "p3", caption: "foto · nisip fin dimineața" },
    { id: "p4", caption: "foto · copii la mare" },
    { id: "p5", caption: "foto · marea liniștită" },
    { id: "p6", caption: "foto · apus peste apă" },
  ],
  cta: {
    eyebrow: "Cazare lângă plajă",
    heading: "Stai la câțiva pași de mare",
    body: "Toate unitățile Paradox sunt aproape de plajă — alege-ți cazarea și bucură-te de apusuri în fiecare seară.",
    label: "Vezi cazarea",
    href: "/#cazare",
  },
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
