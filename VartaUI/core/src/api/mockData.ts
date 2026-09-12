import type { Article, Category, User, UserPreferences } from './types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-all',
    name: 'All Stories',
    slug: 'all',
    iconName: 'Sparkles',
    description: 'Every uplifting story from around the world',
  },
  {
    id: 'cat-planet',
    name: 'Planet & Climate',
    slug: 'planet',
    iconName: 'Leaf',
    description: 'Reforestation, wildlife comebacks, and clean energy milestones',
    articleCount: 42,
  },
  {
    id: 'cat-science',
    name: 'Science & Discovery',
    slug: 'science',
    iconName: 'FlaskConical',
    description: 'Medical triumphs, space exploration, and human ingenuity',
    articleCount: 38,
  },
  {
    id: 'cat-kindness',
    name: 'Humanity & Kindness',
    slug: 'kindness',
    iconName: 'HeartHandshake',
    description: 'Selfless neighbors, heroic rescues, and uplifting communities',
    articleCount: 56,
  },
  {
    id: 'cat-health',
    name: 'Health & Wellness',
    slug: 'health',
    iconName: 'Activity',
    description: 'Breakthrough treatments, mental health progress, and longevity',
    articleCount: 29,
  },
  {
    id: 'cat-innovation',
    name: 'Positive Tech',
    slug: 'innovation',
    iconName: 'Cpu',
    description: 'Technology built for human flourishing and planetary balance',
    articleCount: 34,
  },
  {
    id: 'cat-community',
    name: 'Culture & Arts',
    slug: 'culture',
    iconName: 'Palette',
    description: 'Inspiring arts, restored heritage, and joyful traditions',
    articleCount: 21,
  },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Historic Milestone: Global Renewable Power Surpasses Coal for the First Time in Recorded History',
    summary: 'A breathtaking acceleration in solar and wind installations across 40 countries has permanently tipped the balance toward clean energy, cutting projected emissions by billions of tons.',
    content: `In what environmental scientists are calling the turning point of the century, clean energy generation officially overtook fossil fuel power across major grids worldwide this past quarter.

Driven by unprecedented breakthroughs in perovskite solar efficiency and massive offshore wind deployments, clean energy grew at triple its forecasted rate. Over 18 nations achieved 80% carbon-free electricity during peak months, signaling an unstoppable transition towards a thriving green economy.

Grid operators and international climate observers note that falling battery storage costs have made renewable energy significantly more cost-effective than thermal coal in virtually every major market.`,
    category: 'Planet & Climate',
    categorySlug: 'planet',
    imageUrl: 'https://images.unsplash.com/photo-1523848309072-c199db53f137?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    sourceName: 'Global Clean Energy Review',
    sourceUrl: 'https://example.com/energy-turning-point',
    author: 'Elena Rostova',
    publishedAt: '2 hours ago',
    readingTimeMinutes: 4,
    positivityScore: 99,
    upliftBadge: '99% Joy Index',
    isFeatured: true,
    isBestOfWeek: true,
    bookmarked: false,
  },
  {
    id: 'art-2',
    title: 'Humpback Whales Make Miraculous Population Recovery, Nearing Historic Pre-Whaling Numbers',
    summary: 'Decades of international ocean protection treaties and acoustic tracking have culminated in one of the greatest marine conservation victories in modern memory.',
    content: `Decades of patient, coordinated international treaties have borne magnificent fruit: global humpback whale populations have rebounded from near-extinction levels to more than 93% of their pre-whaling baselines.

From the chilly waters of Antarctica to the warm breeding sanctuaries of the South Pacific, acoustic tracking buoys recorded record singing pods this season. Marine biologists attribute the historic recovery to strict commercial whaling bans, designated migratory safe havens, and modified international shipping lanes that reduce vessel strikes.

The success serves as an irrefutable blueprint proving that when human communities enforce binding environmental protections, ocean ecosystems possess remarkable regenerative power.`,
    category: 'Planet & Climate',
    categorySlug: 'planet',
    imageUrl: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1000&q=80',
    sourceName: 'Marine Conservation Chronicle',
    sourceUrl: 'https://example.com/whales-recovery',
    author: 'David Attenborough Society',
    publishedAt: '4 hours ago',
    readingTimeMinutes: 3,
    positivityScore: 97,
    upliftBadge: 'Conservation Triumph',
    isFeatured: false,
    isBestOfWeek: true,
    bookmarked: false,
  },
  {
    id: 'art-3',
    title: 'Revolutionary Non-Invasive Ultrasound Therapy Eradicates Glioblastoma Cells in Clinical Trial',
    summary: 'Pioneered by neuroscientists in Kyoto and Boston, targeted focused sound waves opened the blood-brain barrier with zero surgical trauma, delivering a 92% remission rate in phase II trials.',
    content: `A multi-center medical trial combining low-intensity pulsed ultrasound with microscopic microbubbles has yielded a landmark breakthrough against previously untreatable glioblastoma tumors.

The breakthrough technique momentarily and harmlessly opens the brain's protective blood-brain barrier without a single surgical incision, enabling targeted immunological medications to reach malignant cells with 400% greater concentration.

Patients who received the soundwave therapy showed complete tumor clearance in 92% of cases, with zero neurological deficits or lasting side effects. Regulatory bodies are now fast-tracking phase III expansion to hospitals across three continents.`,
    category: 'Science & Discovery',
    categorySlug: 'science',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    sourceName: 'Annals of Breakthrough Medicine',
    sourceUrl: 'https://example.com/ultrasound-glioblastoma',
    author: 'Dr. Aris Thorne',
    publishedAt: '6 hours ago',
    readingTimeMinutes: 5,
    positivityScore: 98,
    upliftBadge: 'Medical Miracle',
    isFeatured: false,
    isBestOfWeek: true,
    bookmarked: true,
  },
  {
    id: 'art-4',
    title: 'Neighborhood Secretly Funds Entire University Tuition for Beloved 65-Year-Old Crossing Guard',
    summary: 'After safely guiding three generations of schoolchildren across traffic for 30 years, Mr. Hector received an envelope with full tuition to complete his lifelong dream degree in History.',
    content: `For over three decades, rain or shine, Hector Morales stood at the corner of Maple and 4th Street with a beaming smile, a bright orange vest, and a kind word for every single child crossing to elementary school.

When parents learned that Hector had surrendered his own college ambitions in the 1970s to work three jobs supporting his family, a quiet collective grassroots campaign began. Within three weeks, over 1,400 neighborhood families, alumni, and local merchants pooled together over $85,000.

At a surprise morning assembly disguised as an annual safety inspection, hundreds of alumni and current pupils presented Hector with a full 4-year tuition scholarship to his dream university, accompanied by standing ovations and tears of joy.`,
    category: 'Humanity & Kindness',
    categorySlug: 'kindness',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80',
    sourceName: 'Kindness Daily',
    sourceUrl: 'https://example.com/hector-crossing-guard',
    author: 'Maya Lin',
    publishedAt: '8 hours ago',
    readingTimeMinutes: 3,
    positivityScore: 96,
    upliftBadge: 'Heartwarming',
    isFeatured: false,
    isBestOfWeek: true,
    bookmarked: false,
  },
  {
    id: 'art-5',
    title: 'New Desalination Membrane Powered Solely by Sunlight Drops Clean Water Cost by 70%',
    summary: 'A biomimetic hydrogel membrane developed by engineers promises limitless, affordable drinking water for arid coastal communities without grid electricity or chemical brine pollution.',
    content: `Engineers inspired by the natural capillary transpiration of coastal mangrove trees have engineered an affordable solar desalination system capable of producing 25 liters of crystal-clear drinking water per square meter each day.

Unlike traditional reverse osmosis plants that require massive diesel generators and discharge hazardous concentrated brine back into sensitive shorelines, the new passive hydrogel relies solely on ambient sunlight and emits salt crystals that can be safely harvested for commercial use.

Field tests conducted across 12 drought-affected island villages showed an immediate 70% reduction in municipal water costs, providing reliable hydration to more than 45,000 residents.`,
    category: 'Positive Tech',
    categorySlug: 'innovation',
    imageUrl: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=1000&q=80',
    sourceName: 'Engineering Tomorrow',
    sourceUrl: 'https://example.com/solar-desalination-membrane',
    author: 'Kavita Patel',
    publishedAt: '12 hours ago',
    readingTimeMinutes: 4,
    positivityScore: 95,
    upliftBadge: 'Tech for Good',
    isFeatured: false,
    isBestOfWeek: false,
    bookmarked: false,
  },
  {
    id: 'art-6',
    title: 'Global Literacy Reaches All-Time Peak as Mobile Educational Libraries Reach 50,000 Villages',
    summary: 'Solar-powered digital reader vans equipped with offline multilingual encyclopedias and local stories have brought fluent reading to over 4 million rural children in just 18 months.',
    content: `In an era dominated by high-bandwidth urban infrastructure, a fleet of rugged, solar-powered mobile reading vans has bridged the educational divide across remote mountain and desert villages.

Each converted electric vehicle carries thousands of printed children's books, solar charging stations, and low-power e-ink tablets loaded with rich interactive literature in 64 indigenous and regional dialects.

Educational researchers tracking the rollout observed child literacy rates surging from 41% to 89% in under two academic terms. The project has sparked thousands of local book clubs run entirely by adolescent volunteer librarians.`,
    category: 'Culture & Arts',
    categorySlug: 'culture',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
    sourceName: 'UNESCO Education Report',
    sourceUrl: 'https://example.com/mobile-libraries-literacy',
    author: 'Samira Al-Mansoor',
    publishedAt: '14 hours ago',
    readingTimeMinutes: 4,
    positivityScore: 94,
    upliftBadge: 'Education Win',
    isFeatured: false,
    isBestOfWeek: false,
    bookmarked: false,
  },
  {
    id: 'art-7',
    title: 'Simple 15-Minute Daily Forest Walking Proven to Drop Cortisol and Rebalance Heart Rhythm',
    summary: 'A comprehensive meta-study following 12,000 individuals found that regular green-canopy immersion triggers sustained parasympathetic activation and boosts natural killer immune cells for weeks.',
    content: `Cardiologists and neurobiologists conducting the largest longitudinal study of shinrin-yoku (forest bathing) have quantified the profound physiological benefits of immersing oneself in living greenery.

Participants who walked for just 15 minutes a day beneath tree canopies exhibited an average 38% drop in salivary cortisol levels, significant reductions in blood pressure, and a 50% increase in white blood cell counts that lasted for up to 30 days after park visits.

Physicians in six countries have now begun prescribing 'nature therapy' alongside conventional treatments, prompting municipal governments to invest in protected urban green belts and walking arboretums.`,
    category: 'Health & Wellness',
    categorySlug: 'health',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    sourceName: 'Integrative Wellness Journal',
    sourceUrl: 'https://example.com/forest-walking-study',
    author: 'Dr. Lucas Vance',
    publishedAt: '18 hours ago',
    readingTimeMinutes: 3,
    positivityScore: 91,
    upliftBadge: 'Daily Health',
    isFeatured: false,
    isBestOfWeek: false,
    bookmarked: false,
  },
  {
    id: 'art-8',
    title: 'Ancient Coral Reef Restored in Record Time Using Biodegradable 3D Calcium Skeletons',
    summary: 'Marine biologists celebrate as fish biodiversity increases fivefold in the South Pacific following an innovative non-toxic coral transplant technique that mimics natural reef architectures.',
    content: `A collaborative initiative between marine biologists and bioengineers has successfully re-seeded over 50 hectares of damaged barrier reef in the South Pacific using biodegradable 3D calcium carbonate scaffolding.

The calcium lattices, formed using discarded oyster shells and natural sea minerals, provide immediate structural shelter for juvenile fish while baby coral polyps bind directly to the porous substrate.

Within 14 months, the targeted zone witnessed a 500% increase in native fish populations and full calcification of self-sustaining living coral heads that can withstand elevated marine heatwaves.`,
    category: 'Planet & Climate',
    categorySlug: 'planet',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1000&q=80',
    sourceName: 'Ocean Horizons',
    sourceUrl: 'https://example.com/coral-reef-restoration',
    author: 'Chloe Bennett',
    publishedAt: '1 day ago',
    readingTimeMinutes: 4,
    positivityScore: 96,
    upliftBadge: 'Reef Revival',
    isFeatured: false,
    isBestOfWeek: false,
    bookmarked: false,
  },
  {
    id: 'art-9',
    title: 'Universal mRNA Flu Vaccine Enters Phase III Clinical Trials with 94% Cross-Strain Efficacy',
    summary: 'A single shot designed to target the immutable stalk proteins of influenza viruses promises lifelong protection against seasonal mutations and emerging pandemic strains.',
    content: `Biotechnologists have announced encouraging results from a universal vaccine candidate that targets the conserved stalk region of viral hemagglutinin rather than the ever-mutating head.

In phase II trials across 8,000 diverse participants, the single-dose vaccine elicited robust neutralizing antibodies that neutralized every tested seasonal flu variant from the past 25 years with a 94% efficacy rate.

Medical ethicists and public health leaders hail the development as a monumental step toward ending annual flu epidemics and safeguarding vulnerable populations worldwide.`,
    category: 'Science & Discovery',
    categorySlug: 'science',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    sourceName: 'Global Immunology Dispatch',
    sourceUrl: 'https://example.com/universal-flu-vaccine',
    author: 'Dr. Naomi Chen',
    publishedAt: '1 day ago',
    readingTimeMinutes: 4,
    positivityScore: 98,
    upliftBadge: 'Medical Breakthrough',
    isFeatured: false,
    isBestOfWeek: false,
    bookmarked: false,
  },
  {
    id: 'art-10',
    title: 'Volunteers and Indigenous Stewards Plant 1.2 Million Native Trees to Halt Desert Expansion',
    summary: 'A community-driven Great Green Wall initiative in arid grassland borders has successfully restored natural water tables and brought songbirds back to the savanna.',
    content: `Through a harmonious blend of traditional indigenous soil terracing and drone-assisted seed dispersing, a coalition of local farmers and volunteers has planted over 1.2 million acacia, baobab, and drought-hardy shrubs.

Satellite imagery reveals that the new green buffer has reversed desertification across 3,000 square kilometers, naturally recharging underground aquifers and boosting agricultural yields in surrounding villages.

The project demonstrates that ecological restoration works best when led, owned, and celebrated directly by the communities whose livelihoods depend on the land.`,
    category: 'Humanity & Kindness',
    categorySlug: 'kindness',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
    sourceName: 'Earth Guardians Journal',
    sourceUrl: 'https://example.com/million-tree-restoration',
    author: 'Tariq Osei',
    publishedAt: '2 days ago',
    readingTimeMinutes: 3,
    positivityScore: 97,
    upliftBadge: 'Community Spirit',
    isFeatured: false,
    isBestOfWeek: false,
    bookmarked: false,
  },
  {
    id: 'art-11',
    title: 'Open-Source Bionic Hand Built for Under $80 Restores Fine Touch and Motor Precision',
    summary: 'High school students collaborate with biomedical engineers to release 3D-printable open hardware designs that provide amputees worldwide with lifelike dexterity.',
    content: `In an inspiring triumph of open-source science, a collaborative team of student coders and prosthetic specialists has open-sourced complete schematic designs for an advanced myoelectric bionic hand.

Utilizing off-the-shelf sensors and recyclable polymers, the lightweight hand costs less than $80 to produce while delivering delicate proportional grip control capable of holding an egg or threading a needle.

Over 3,000 prosthetics have already been manufactured by volunteer makerspaces across 28 developing nations, offering mobility and dignity to individuals who could never afford conventional $30,000 alternatives.`,
    category: 'Positive Tech',
    categorySlug: 'innovation',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
    sourceName: 'Open Science Review',
    sourceUrl: 'https://example.com/open-source-bionic-hand',
    author: 'Leo Tanaka',
    publishedAt: '2 days ago',
    readingTimeMinutes: 4,
    positivityScore: 96,
    upliftBadge: 'Empowerment',
    isFeatured: false,
    isBestOfWeek: false,
    bookmarked: false,
  },
  {
    id: 'art-12',
    title: 'Citywide Community Kitchens Transform Surplus Produce into 10 Million Free Gourmet Meals',
    summary: 'By partnering with regional organic farms and Michelin-trained volunteer chefs, a zero-waste culinary initiative nourishes shelters and students with dignity and warmth.',
    content: `What began as a single neighborhood soup kitchen has blossomed into an international culinary movement that redirects tons of cosmetically imperfect yet delicious organic vegetables from landfills.

Professional chefs work alongside local student volunteers to transform surplus harvests into nutrient-dense, restaurant-quality dishes served free of charge in communal dining halls.

In addition to preventing food waste, the initiative has reduced food insecurity by 42% in participating districts and created apprenticeship pathways for hundreds of aspiring culinary professionals.`,
    category: 'Culture & Arts',
    categorySlug: 'culture',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    sourceName: 'Culinary Hope Quarterly',
    sourceUrl: 'https://example.com/community-kitchens-initiative',
    author: 'Gabriela Silva',
    publishedAt: '3 days ago',
    readingTimeMinutes: 4,
    positivityScore: 95,
    upliftBadge: 'Zero Waste',
    isFeatured: false,
    isBestOfWeek: false,
    bookmarked: false,
  },
];

export const MOCK_USER: User = {
  id: 'usr-varta-01',
  name: 'Prince Sharma',
  email: 'prince@varta.news',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  createdAt: '2025-01-15',
};

export const MOCK_DEFAULT_PREFERENCES: UserPreferences = {
  favoriteCategories: ['planet', 'science', 'kindness', 'innovation', 'health', 'culture'],
  positivityThreshold: 85,
  dailyDigestEmail: true,
  breakingGoodNewsAlerts: false,
  readingLayout: 'comfortable',
  quoteOfTheDay: true,
};

export const MOCK_DAILY_QUOTE = {
  quote: "Kindness is like snow—it beautifies everything it covers.",
  author: "Kahlil Gibran",
  category: "Humanity & Spirit",
};
