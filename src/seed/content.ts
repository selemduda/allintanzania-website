/**
 * Starter content for the All in Tanzania website. Written from the company's own itineraries,
 * travel notes and articles in Dropbox; everything here can be edited in the admin afterwards.
 * Photo keys refer to files in ./media (see media/SOURCES.txt for where each came from).
 */

export type SeedDestination = {
  slug: string
  name: string
  region: 'northern' | 'southern' | 'coast' | 'mountains'
  type: 'park' | 'conservation' | 'reserve' | 'beach' | 'mountain' | 'town'
  order: number
  tagline: string
  hero: string
  gallery?: string[]
  summary: string
  body: string[]
  highlights: string[]
  wildlife?: string[]
  bestMonths: string[]
  recommendedNights: number
  expertNotes?: string
}

export const destinations: SeedDestination[] = [
  {
    slug: 'serengeti',
    name: 'Serengeti',
    region: 'northern',
    type: 'park',
    order: 10,
    tagline: 'Endless plains and the Great Migration',
    hero: 'serengeti-plains',
    gallery: ['mara-river-crossing', 'zebra-and-wildebeest', 'lion-in-grass', 'leopard-yawning', 'zebra-portrait', 'cheetahs-resting'],
    summary:
      'The Serengeti is the Africa of every childhood dream: golden grass to the horizon, lions on granite kopjes, and nearly two million wildebeest and zebra moving in a great circle with the rains.',
    body: [
      'Where you stay in the Serengeti matters more than anywhere else in Tanzania, because the herds keep moving. From December to March they calve on the short-grass plains of the south around Ndutu. From April to June they drift through the central and western Serengeti. From July to October they reach the Mara River in the far north, where the famous river crossings happen.',
      'The central Seronera valley has water all year and some of the best resident predator viewing in Africa, so even outside migration season the Serengeti never disappoints. We match your camp to the month you travel, so you wake up close to the action.',
    ],
    highlights: [
      'Wildebeest calving season on the southern plains (December to March)',
      'Mara River crossings in the northern Serengeti (July to October)',
      'Lion, leopard and cheetah all year in the Seronera valley',
      'Hot air balloon safari at sunrise',
    ],
    wildlife: ['Wildebeest', 'Zebra', 'Lion', 'Leopard', 'Cheetah', 'Elephant', 'Giraffe', 'Hyena'],
    bestMonths: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec'],
    recommendedNights: 3,
    expertNotes:
      'Always ask the travel month first, then recommend the right area: Ndutu/south Dec-Mar, central/west Apr-Jun, Kogatende/north Jul-Oct, Lobo/north-east in November. River crossings need patience: recommend 3+ nights near the Mara River and explain that crossings cannot be guaranteed. Fly-in saves a long drive for guests with limited time.',
  },
  {
    slug: 'ngorongoro',
    name: 'Ngorongoro Crater',
    region: 'northern',
    type: 'conservation',
    order: 20,
    tagline: 'A lost world inside a volcano',
    hero: 'ngorongoro-crater-view',
    gallery: ['ngorongoro-crater-floor', 'maasai-warriors'],
    summary:
      'The largest unbroken volcanic caldera on earth: 600 metres deep, about 20 kilometres across, with lion, buffalo, flamingo and black rhino living on its floor. Maasai herders still graze their cattle in the highlands around the rim.',
    body: [
      'A day on the crater floor is one of the great wildlife days anywhere in Africa. We descend early, before the crowds, with a picnic lunch by the hippo pool. Nights are cool up on the rim, so pack a warm layer.',
      'Ngorongoro sits between the Serengeti and Lake Manyara, so it fits naturally into any northern safari. Close by is Olduvai Gorge, one of the most important sites for understanding human origins.',
    ],
    highlights: ['Full day on the crater floor', 'One of the best places in Tanzania to see black rhino', 'Highland walks with Maasai guides', 'Olduvai Gorge, the cradle of mankind'],
    wildlife: ['Black rhino', 'Lion', 'Buffalo', 'Flamingo', 'Hippo', 'Elephant', 'Wildebeest'],
    bestMonths: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec'],
    recommendedNights: 2,
    expertNotes:
      'Crater vehicle fee is charged per vehicle per descent and crater time is limited to about six hours. Rim lodges give the earliest start; Karatu lodges are better value. It is cold at night on the rim (often under 10°C).',
  },
  {
    slug: 'tarangire',
    name: 'Tarangire',
    region: 'northern',
    type: 'park',
    order: 30,
    tagline: 'Elephants among ancient baobabs',
    hero: 'elephant-tarangire',
    gallery: ['elephant-family', 'giraffe-portrait'],
    summary:
      'Often overlooked in the shadow of the Serengeti, Tarangire is one of our favourite parks. In the dry season hundreds of elephants gather along the Tarangire River beneath giant baobab trees.',
    body: [
      'Tarangire is about two hours from Arusha, which makes it a perfect first stop. Within minutes of the gate you will be among gazelle, buffalo and giraffe, and the elephant herds here are some of the largest in East Africa.',
      'The park has an unusual mix of habitats, from grassland and woodland in the north to swamps and low hills in the south, and more than 500 bird species. Walking safaris and night drives are possible in the surrounding conservation areas.',
    ],
    highlights: ['Huge elephant herds in the dry season', 'Baobab trees that are hundreds of years old', 'Over 500 bird species', 'Walking safaris outside the park'],
    wildlife: ['Elephant', 'Lion', 'Giraffe', 'Buffalo', 'Zebra', 'Oryx', 'Python'],
    bestMonths: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    recommendedNights: 2,
  },
  {
    slug: 'lake-manyara',
    name: 'Lake Manyara',
    region: 'northern',
    type: 'park',
    order: 40,
    tagline: 'Tree-climbing lions and pink flamingos',
    hero: 'lake-manyara-flamingos',
    gallery: ['tree-climbing-lions-manyara', 'giraffes-manyara', 'manyara-forest-road'],
    summary:
      'A small, beautiful park at the foot of the Rift Valley wall, famous for lions that rest in the branches of acacia trees and for the flamingos that turn the lake shore pink.',
    body: [
      'Ernest Hemingway called it "the loveliest I have seen in Africa". In one short drive you pass from groundwater forest full of monkeys to open grassland, the lake shore and the hot springs.',
      'Manyara is a gentle introduction to safari and works well for families and shorter trips. The treetop walkway lets you walk among the forest canopy.',
    ],
    highlights: ['Tree-climbing lions', 'Flamingos and over 400 bird species', 'Treetop walkway through the forest', 'Cultural walks with Maasai in the Manyara ecosystem'],
    wildlife: ['Lion', 'Flamingo', 'Elephant', 'Baboon', 'Blue monkey', 'Hippo', 'Giraffe'],
    bestMonths: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec'],
    recommendedNights: 1,
  },
  {
    slug: 'arusha',
    name: 'Arusha',
    region: 'northern',
    type: 'town',
    order: 50,
    tagline: 'Gateway to the northern safari circuit',
    hero: 'golf-safari-arusha',
    summary:
      'Arusha is where most northern safaris begin and end. Coffee farms, golf, Arusha National Park and on clear mornings, views of Kilimanjaro and Mount Meru.',
    body: [
      'Most guests land at Kilimanjaro International Airport and spend their first night near Arusha to rest after the long flight. We like lodges on the coffee estates and the Kilimanjaro Golf and Wildlife Estate, where you can play a round with zebra on the fairway.',
    ],
    highlights: ['Coffee farm tours', 'Golf on the Kilimanjaro Golf and Wildlife Estate', 'Canoeing and walking in Arusha National Park', 'Shanga workshop and craft markets'],
    bestMonths: ['Jan', 'Feb', 'Mar', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    recommendedNights: 1,
  },
  {
    slug: 'ruaha',
    name: 'Ruaha',
    region: 'southern',
    type: 'park',
    order: 60,
    tagline: 'Wild, remote and unforgettable',
    hero: 'ruaha-lodge-pool',
    gallery: ['ruaha-lodge-view', 'ruaha-lodge-lounge'],
    summary:
      'Tanzania’s largest national park and one of the wildest places left in East Africa. Baobab forests, granite kopjes and the Great Ruaha River, with huge lion prides and a fraction of the visitors of the north.',
    body: [
      'Few people have heard of Ruaha and nobody forgets it. Around ten percent of the world’s lions live in the wider Ruaha landscape, along with large elephant herds, wild dogs, and both greater and lesser kudu.',
      'Most guests fly in from Dar es Salaam, Zanzibar or Arusha. We combine Ruaha with Nyerere for a classic southern safari, then finish on the beach.',
    ],
    highlights: ['Big lion prides and wild dog', 'Walking safaris with expert guides', 'Very few other vehicles', 'Ruaha Carnivore Project and community conservation'],
    wildlife: ['Lion', 'Elephant', 'Wild dog', 'Leopard', 'Greater kudu', 'Sable antelope', 'Cheetah'],
    bestMonths: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    recommendedNights: 3,
    expertNotes:
      'July-August mornings and evenings are cold in Ruaha, recommend a warm jacket. Southern circuit has lower malaria risk in the dry season and fewer crowds; good for families and repeat visitors. We support the Ruaha Carnivore Project through our Positive Impact initiative.',
  },
  {
    slug: 'nyerere',
    name: 'Nyerere (Selous)',
    region: 'southern',
    type: 'park',
    order: 70,
    tagline: 'Boat safaris on the Rufiji River',
    hero: 'selous-river-sunset',
    gallery: ['selous-buffalo', 'giraffe-portrait', 'elephant-family'],
    summary:
      'The former Selous Game Reserve is one of the largest protected areas in Africa. Here a safari happens by vehicle, on foot and by boat, drifting past hippos and crocodiles on the Rufiji River and its lakes.',
    body: [
      'Our founder ran a lodge in the Selous before starting All in Tanzania, so this is home ground. Boat safaris at sunset, walking with an armed ranger and fly-camping are what make Nyerere different from the parks of the north.',
      'It is home to one of Africa’s largest populations of wild dog, as well as good numbers of lion, leopard, elephant and buffalo.',
    ],
    highlights: ['Boat safaris and sundowners on the lakes', 'Walking safaris and fly-camping', 'African wild dog', 'Short flight from Dar es Salaam and Zanzibar'],
    wildlife: ['Wild dog', 'Lion', 'Hippo', 'Crocodile', 'Elephant', 'Buffalo', 'Giraffe'],
    bestMonths: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    recommendedNights: 3,
    expertNotes: 'Sele (founder) was a lodge general manager in the Selous: speak about it from personal experience. Many camps close in April and May for the long rains.',
  },
  {
    slug: 'mikumi',
    name: 'Mikumi',
    region: 'southern',
    type: 'park',
    order: 80,
    tagline: 'The easy safari from Dar es Salaam',
    hero: 'giraffe-portrait',
    summary:
      'Mikumi is a few hours’ drive from Dar es Salaam on a good road, which makes it perfect for families, short trips and anyone combining safari with the coast.',
    body: [
      'The Mkata floodplain is often compared to the Serengeti: open grassland with elephants, giraffe, zebra, buffalo and lions, plus a hippo pool full of crocodiles. It is one of our favourite parks for a first safari with children.',
    ],
    highlights: ['Short drive from Dar es Salaam', 'Hippo pools', 'Great first safari for young children'],
    wildlife: ['Elephant', 'Giraffe', 'Zebra', 'Lion', 'Hippo', 'Buffalo'],
    bestMonths: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    recommendedNights: 2,
  },
  {
    slug: 'udzungwa',
    name: 'Udzungwa Mountains',
    region: 'southern',
    type: 'park',
    order: 85,
    tagline: 'Rainforest walks and waterfalls',
    hero: 'manyara-forest-road',
    summary:
      'Tanzania’s park for walkers. Mountain rainforest full of primates and birds found nowhere else on earth, and the Sanje Falls where you can swim at the top.',
    body: [
      'There are no game drives here, only footpaths. Combine Udzungwa with Mikumi and Ruaha for an active southern road trip.',
    ],
    highlights: ['Hike to Sanje Falls and swim in the pools', 'Endemic primates like the Udzungwa red colobus', 'Pairs perfectly with Mikumi'],
    bestMonths: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    recommendedNights: 2,
  },
  {
    slug: 'kilimanjaro',
    name: 'Mount Kilimanjaro',
    region: 'mountains',
    type: 'mountain',
    order: 90,
    tagline: 'Stand on the roof of Africa',
    hero: 'kilimanjaro-sunrise',
    gallery: ['uhuru-peak-summit', 'kilimanjaro-climber'],
    summary:
      'At 5,895 metres, Kilimanjaro is the highest mountain in Africa and the tallest free-standing mountain in the world. No technical climbing is needed, just good preparation, a strong team and pole pole: slowly, slowly.',
    body: [
      'We climb with experienced mountain guides, porters and cooks, choosing routes that give you time to acclimatise. The Machame and Lemosho routes have the best scenery and summit success; Marangu offers hut accommodation.',
      'After the climb, there is no better reward than a few days on a Zanzibar beach.',
    ],
    highlights: ['Sunrise at Uhuru Peak', 'Five climate zones, from rainforest to glacier', '7-day routes for better acclimatisation'],
    bestMonths: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    recommendedNights: 7,
    expertNotes: 'Recommend at least 7 days on the mountain for acclimatisation. Avoid April-May. Ask about fitness and any health conditions; recommend travel insurance that covers high-altitude trekking.',
  },
  {
    slug: 'zanzibar',
    name: 'Zanzibar',
    region: 'coast',
    type: 'beach',
    order: 100,
    tagline: 'Spice island beaches and Stone Town',
    hero: 'zanzibar-beach-palms',
    gallery: ['zanzibar-turquoise', 'zanzibar-door', 'dhow-sunset-zanzibar'],
    summary:
      'White sand, turquoise water and centuries of Swahili, Arab and Indian history in the alleys of Stone Town. The perfect place to slow down after safari.',
    body: [
      'Each coast has its own character: Nungwi and Kendwa in the north for swimming at any tide and sunsets, Matemwe in the north-east for diving and snorkelling at Mnemba Atoll, and the quieter south-east beaches of Paje and Jambiani.',
      'Spend at least one night in Stone Town for its carved doors, rooftop restaurants and the spice and slave-trade history that shaped East Africa.',
    ],
    highlights: ['Stone Town, a UNESCO World Heritage Site', 'Snorkelling and diving at Mnemba Atoll', 'Spice farm tours', 'Red colobus monkeys in Jozani Forest', 'Sunset dhow cruises'],
    bestMonths: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec'],
    recommendedNights: 4,
    expertNotes: 'In Stone Town women usually feel more comfortable with shoulders and knees covered. ATMs are mainly in Stone Town, so bring cash for excursions. Check yellow fever certificate requirements if arriving from a risk country.',
  },
  {
    slug: 'mafia-island',
    name: 'Mafia Island',
    region: 'coast',
    type: 'beach',
    order: 110,
    tagline: 'Swim with whale sharks',
    hero: 'mafia-butiama-sunrise',
    gallery: ['mafia-butiama-veranda', 'mafia-beach'],
    summary:
      'A quiet island south of Zanzibar inside a marine park, where from October to March you can swim alongside whale sharks, the largest fish in the world.',
    body: [
      'Mafia is what Zanzibar was decades ago: no big hotels, empty beaches and some of the best snorkelling and diving in the Indian Ocean. It is a short flight from Dar es Salaam and combines beautifully with a southern safari.',
    ],
    highlights: ['Whale sharks (roughly October to March)', 'Mafia Island Marine Park reefs', 'Quiet beaches and small lodges'],
    bestMonths: ['Jan', 'Feb', 'Oct', 'Nov', 'Dec'],
    recommendedNights: 3,
  },
  {
    slug: 'lake-tanganyika',
    name: 'Lake Tanganyika',
    region: 'southern',
    type: 'beach',
    order: 120,
    tagline: 'Africa’s longest lake, with beaches to match',
    hero: 'all-in-tanzania-safari-vehicle',
    summary:
      'The longest freshwater lake in the world, on Tanzania’s far western border. Clear water, sandy coves, fishing villages and hardly another tourist: a place where families can slow down after days on the road.',
    body: [
      'The southern shore around Kipili is reached by road from Sumbawanga and has a handful of small, family-run lodges with kayaks, snorkelling among colourful cichlid fish and dhow trips to the islands.',
      'Further north the lake leads to Kigoma, Ujiji and the chimpanzees of Gombe. Driving the lake shore is one of the great road trips in East Africa.',
    ],
    highlights: ['Kayaking and snorkelling among cichlid fish', 'Sunsets over the mountains of Congo', 'Quiet beaches and fishing villages'],
    bestMonths: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec', 'Jan'],
    recommendedNights: 3,
  },
  {
    slug: 'gombe',
    name: 'Kigoma & Gombe',
    region: 'southern',
    type: 'park',
    order: 125,
    tagline: 'Chimpanzees on the shore of Lake Tanganyika',
    hero: 'all-in-tanzania-safari-vehicle',
    summary:
      'Gombe Stream is where Jane Goodall began her chimpanzee research in 1960. The park is reached by boat from Kigoma, the lively lake port that is also home to Ujiji, where Stanley met Livingstone.',
    body: [
      'There are no roads in Gombe. You arrive by lake taxi or private boat, then walk forest trails with a ranger to find the chimpanzee families that have been studied for more than sixty years.',
      'Kigoma itself is a relaxed town with beach hotels, fish markets and the Livingstone memorial in Ujiji, so there is plenty for children who are too young to join the chimpanzee trek.',
    ],
    highlights: ['Chimpanzee trekking with park rangers', 'Boat ride along the lake to the park', 'Livingstone memorial in Ujiji', 'Swimming and sunsets on the beaches of Kigoma'],
    wildlife: ['Chimpanzee', 'Olive baboon', 'Red-tailed monkey', 'Red colobus'],
    bestMonths: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec', 'Jan'],
    recommendedNights: 3,
    expertNotes: 'Gombe sets a minimum age for chimpanzee trekking (check the current rule with the team), so younger children stay in Kigoma with one parent. Long trousers and closed shoes for the forest. The road from Kigoma to Tabora and the lake-shore road can be slow in the long rains (March to May).',
  },
]

export type SeedLodge = {
  name: string
  destination: string
  tier: 'comfort' | 'classic' | 'luxury'
  style: 'tented' | 'lodge' | 'mobile' | 'beach' | 'hotel'
  hero: string
  summary: string
  amenities: string[]
  featured?: boolean
}

export const lodges: SeedLodge[] = [
  {
    name: 'Kwihala Camp',
    destination: 'ruaha',
    tier: 'classic',
    style: 'tented',
    hero: 'ruaha-lodge-view',
    summary: 'A small, simple and beautiful tented camp in the heart of Ruaha, known for excellent walking and game drives.',
    amenities: ['Walking safaris', 'Night drives', 'Bush breakfasts'],
    featured: true,
  },
  {
    name: 'Jabali Ridge',
    destination: 'ruaha',
    tier: 'luxury',
    style: 'lodge',
    hero: 'ruaha-lodge-pool',
    summary: 'Suites built among granite boulders above the Ruaha wilderness, with an infinity pool facing the sunset.',
    amenities: ['Infinity pool', 'Spa', 'Private house option'],
    featured: true,
  },
  {
    name: 'Roho ya Selous',
    destination: 'nyerere',
    tier: 'luxury',
    style: 'tented',
    hero: 'selous-river-sunset',
    summary: 'Eight spacious tents on Lake Nzerakera with game drives, walks, boat safaris and fishing included.',
    amenities: ['Boat safaris', 'Walking safaris', 'Swimming pool', 'Fishing'],
  },
  {
    name: 'Angalia Tented Camp',
    destination: 'mikumi',
    tier: 'comfort',
    style: 'tented',
    hero: 'giraffe-portrait',
    summary: 'A friendly tented camp close to Mikumi National Park, a favourite for families on their first safari.',
    amenities: ['Family tents', 'Home-cooked meals'],
  },
  {
    name: 'Tandala Tented Camp',
    destination: 'ruaha',
    tier: 'comfort',
    style: 'tented',
    hero: 'elephant-family',
    summary: 'Raised tents just outside Ruaha’s gate, where elephants often walk through camp to the waterhole.',
    amenities: ['Waterhole views', 'Swimming pool'],
  },
  {
    name: 'Udzungwa Forest Tented Camp',
    destination: 'udzungwa',
    tier: 'comfort',
    style: 'tented',
    hero: 'manyara-forest-road',
    summary: 'A peaceful camp at the edge of the rainforest, the base for the hike to Sanje Falls.',
    amenities: ['Guided forest walks', 'Waterfall hikes'],
  },
  {
    name: 'Butiama Beach',
    destination: 'mafia-island',
    tier: 'classic',
    style: 'beach',
    hero: 'mafia-butiama-veranda',
    summary: 'A relaxed beach lodge on Mafia Island and our base for whale shark swims, snorkelling and long empty beaches.',
    amenities: ['Whale shark trips', 'Snorkelling', 'Half board'],
    featured: true,
  },
  {
    name: 'Matemwe Lodge',
    destination: 'zanzibar',
    tier: 'luxury',
    style: 'beach',
    hero: 'zanzibar-turquoise',
    summary: 'Twelve sea-view bungalows on a coral outcrop facing Mnemba Atoll, with superb diving and snorkelling.',
    amenities: ['Diving', 'Snorkelling', 'Spa', 'Pool'],
  },
  {
    name: 'Kendwa Rocks',
    destination: 'zanzibar',
    tier: 'comfort',
    style: 'beach',
    hero: 'zanzibar-beach-palms',
    summary: 'A lively beach resort in north-west Zanzibar where you can swim at any tide and watch the sun set into the ocean.',
    amenities: ['Swimming at all tides', 'Beach bar', 'Sunset views'],
  },
  {
    name: 'Serengeti Migration Camp',
    destination: 'serengeti',
    tier: 'classic',
    style: 'mobile',
    hero: 'migration-game-drive',
    summary: 'A seasonal tented camp that moves with the wildebeest: the southern plains for the calving, the Mara River for the crossings.',
    amenities: ['Moves with the migration', 'All-inclusive', 'Bush dinners'],
    featured: true,
  },
  {
    name: 'Crater Rim Camp',
    destination: 'ngorongoro',
    tier: 'classic',
    style: 'tented',
    hero: 'ngorongoro-crater-view',
    summary: 'Private tents in the Ngorongoro highlands for an early start to the crater floor and walks with Maasai guides.',
    amenities: ['Early crater access', 'Campfire', 'Highland walks'],
  },
  {
    name: 'Tarangire Camping Safari',
    destination: 'tarangire',
    tier: 'comfort',
    style: 'mobile',
    hero: 'riverbed-dinner',
    summary: 'Our own camping safari: dome tents, a camp cook and nights by the fire under the baobabs. Used on our Afrikidos family adventure.',
    amenities: ['Camping equipment included', 'Camp cook', 'Great for families'],
  },
]

export type SeedItinerary = {
  title: string
  durationDays: number
  tier: 'comfort' | 'classic' | 'luxury'
  styles: string[]
  hero: string
  gallery?: string[]
  /** Key of an .mp4 file in ./media. */
  video?: string
  summary: string
  days: { dayRange: string; title: string; destination?: string; lodge?: string; nights: number; description: string }[]
  included: string[]
  excluded: string[]
  featured?: boolean
}

const standardExcluded = ['International flights', 'Tanzania visa', 'Travel insurance', 'Tips for guides and camp staff', 'Drinks and items of a personal nature']

export const itineraries: SeedItinerary[] = [
  {
    title: 'The Great Migration Safari',
    durationDays: 7,
    tier: 'classic',
    styles: ['migration', 'classic'],
    hero: 'migration-game-drive',
    summary:
      'Seven days in northern Tanzania that combine the spectacle of the wildebeest migration with a full day in the Ngorongoro Crater. Your Serengeti camp moves with the herds, so you stay close to the action whatever the month.',
    days: [
      { dayRange: 'Day 1', title: 'Karibu Tanzania', destination: 'arusha', nights: 1, description: 'Your guide meets you at Kilimanjaro Airport and drives you to a lodge outside Arusha to rest after the flight.' },
      { dayRange: 'Day 2', title: 'Up to the Ngorongoro highlands', destination: 'ngorongoro', lodge: 'Crater Rim Camp', nights: 2, description: 'Drive through Maasai country and up the Rift Valley wall to camp on the crater rim. Afternoon walk in the highlands with a Maasai guide.' },
      { dayRange: 'Day 3', title: 'The crater floor', destination: 'ngorongoro', nights: 0, description: 'Descend at first light for a full day in the crater, looking for black rhino, lion and flamingo, with a picnic by the hippo pool.' },
      { dayRange: 'Days 4–6', title: 'Following the herds', destination: 'serengeti', lodge: 'Serengeti Migration Camp', nights: 3, description: 'Fly or drive into the Serengeti to a camp placed near the migration: the southern plains for calving season (December to March) or the Mara River for crossings (July to October). Optional sunrise balloon safari.' },
      { dayRange: 'Day 7', title: 'Kwaheri', nights: 0, description: 'A last morning game drive, then fly back to Arusha for a day room and your evening flight home.' },
    ],
    included: ['All accommodation and meals on safari', 'Private 4x4 safari vehicle and professional guide', 'All park and conservation fees', 'Airport transfers', 'Flying Doctors evacuation cover'],
    excluded: [...standardExcluded, 'Balloon safari (optional extra)'],
    featured: true,
  },
  {
    title: 'Southern Tanzania & Zanzibar',
    durationDays: 10,
    tier: 'luxury',
    styles: ['beach', 'classic', 'honeymoon'],
    hero: 'ruaha-lodge-pool',
    summary:
      'A fly-in safari through the wild south: Ruaha for lions and walking safaris, Nyerere for boat safaris on the Rufiji, then three nights on a quiet Zanzibar beach.',
    days: [
      { dayRange: 'Days 1–3', title: 'Into the wilds of Ruaha', destination: 'ruaha', lodge: 'Kwihala Camp', nights: 3, description: 'Connect in Dar es Salaam for a light-aircraft flight to Ruaha. Game drives and walks among baobabs and granite kopjes in one of East Africa’s most remote parks.' },
      { dayRange: 'Days 4–6', title: 'Boats, walks and wild dogs', destination: 'nyerere', lodge: 'Roho ya Selous', nights: 3, description: 'Fly to Nyerere. Choose each day between game drives, walking safaris, fishing and sunset boat trips on the lakes.' },
      { dayRange: 'Days 7–9', title: 'Indian Ocean time', destination: 'zanzibar', lodge: 'Matemwe Lodge', nights: 3, description: 'Fly to Zanzibar for three nights facing Mnemba Atoll. Snorkel, dive, visit Stone Town or simply rest in a hammock.' },
      { dayRange: 'Day 10', title: 'Homeward', nights: 0, description: 'Fly to Dar es Salaam to connect with your international flight.' },
    ],
    included: ['All internal flights', 'Full board on safari, half board on the beach', 'Shared game activities at each camp', 'Park fees', 'Transfers'],
    excluded: standardExcluded,
    featured: true,
  },
  {
    title: 'Afrikidos Family Adventure',
    durationDays: 7,
    tier: 'comfort',
    styles: ['family', 'cultural', 'walking'],
    hero: 'kids-archery-maasai',
    summary:
      'Our own educational camping safari for families. Kids and parents track wildlife on foot, sleep under canvas, learn from Maasai elders and warriors, and see elephants, flamingos and tree-climbing lions.',
    days: [
      { dayRange: 'Day 1', title: 'Arrival in Arusha', destination: 'arusha', nights: 1, description: 'Pick-up at Kilimanjaro Airport and a quiet night in Arusha. On a clear morning you will see both Kilimanjaro and Mount Meru.' },
      { dayRange: 'Days 2–3', title: 'Elephants and baobabs', destination: 'tarangire', lodge: 'Tarangire Camping Safari', nights: 2, description: 'Game drives among Tarangire’s elephant herds. The crew sets up camp while the kids learn to recognise tracks, trees and birds.' },
      { dayRange: 'Days 4–5', title: 'Lake Manyara by vehicle and on foot', destination: 'lake-manyara', nights: 2, description: 'Look for the famous tree-climbing lions and pink flamingos, walk the treetop walkway and take a guided walking safari.' },
      { dayRange: 'Day 6', title: 'A day with the Maasai', destination: 'lake-manyara', nights: 1, description: 'Maasai elders and warriors show you how they live alongside wildlife: herding, medicinal plants, archery and a Maasai-style barbecue.' },
      { dayRange: 'Day 7', title: 'Back to Arusha', destination: 'arusha', nights: 0, description: 'Drive back to Arusha for souvenirs and a farewell dinner before your flight.' },
    ],
    included: ['Camping equipment (tents, mattresses, sleeping bags)', 'All meals with a camp cook', '4x4 safari vehicle and English-speaking guide', 'Park fees', 'Cultural visit and Maasai day', 'Drinking water'],
    excluded: standardExcluded,
    featured: true,
  },
  {
    title: 'Beach & Bush: The Southern Road Trip',
    durationDays: 16,
    tier: 'comfort',
    styles: ['beach', 'family', 'walking'],
    hero: 'mafia-butiama-sunrise',
    summary:
      'Drive the southern circuit from Dar es Salaam: Mikumi, Ruaha and the Udzungwa rainforest, then fly to Mafia Island to swim with whale sharks and finish on Zanzibar.',
    days: [
      { dayRange: 'Day 1', title: 'Arrive in Dar es Salaam', nights: 1, description: 'Pick-up at the airport and a night by the ocean in Dar es Salaam.' },
      { dayRange: 'Days 2–3', title: 'Mikumi', destination: 'mikumi', lodge: 'Angalia Tented Camp', nights: 2, description: 'A six-hour drive on good roads, spotting wildlife along the way, then game drives on the Mkata floodplain.' },
      { dayRange: 'Days 4–6', title: 'Ruaha', destination: 'ruaha', lodge: 'Tandala Tented Camp', nights: 3, description: 'Two full days in Ruaha, looking for lion, elephant and kudu along the Great Ruaha River.' },
      { dayRange: 'Days 7–8', title: 'Udzungwa waterfalls', destination: 'udzungwa', lodge: 'Udzungwa Forest Tented Camp', nights: 2, description: 'Hike through the rainforest to Sanje Falls. Bring a swimsuit for the pools at the top.' },
      { dayRange: 'Days 9–12', title: 'Mafia Island', destination: 'mafia-island', lodge: 'Butiama Beach', nights: 4, description: 'Fly from Dar to Mafia. Swim with whale sharks (in season), snorkel the marine park or walk the long empty beaches.' },
      { dayRange: 'Days 13–15', title: 'Zanzibar', destination: 'zanzibar', lodge: 'Kendwa Rocks', nights: 3, description: 'Fly to Zanzibar for sunsets on the north-west coast and a day in Stone Town.' },
      { dayRange: 'Day 16', title: 'Fly home', nights: 0, description: 'Transfer to the airport for your flight home.' },
    ],
    included: ['Road transport by 4x4 with English-speaking guide', 'Accommodation and meals on safari', 'Half board on Mafia, bed and breakfast on Zanzibar', 'Park fees and the Udzungwa hike', 'Flights Dar–Mafia–Zanzibar'],
    excluded: standardExcluded,
  },
  {
    title: 'Kilimanjaro Climb & Zanzibar',
    durationDays: 13,
    tier: 'classic',
    styles: ['kilimanjaro', 'beach'],
    hero: 'uhuru-peak-summit',
    summary:
      'Climb Africa’s highest mountain on the scenic Machame route with an experienced mountain crew, then recover on the white sands of Zanzibar.',
    days: [
      { dayRange: 'Day 1', title: 'Arrive and gear check', destination: 'arusha', nights: 1, description: 'Meet your mountain guide for a briefing and equipment check.' },
      { dayRange: 'Days 2–8', title: 'The Machame route', destination: 'kilimanjaro', nights: 6, description: 'Seven days on the mountain through rainforest, moorland and alpine desert, with time to acclimatise before the night climb to Uhuru Peak at 5,895 m.' },
      { dayRange: 'Days 9–12', title: 'Zanzibar', destination: 'zanzibar', lodge: 'Kendwa Rocks', nights: 4, description: 'Fly to Zanzibar and rest your legs on the beach.' },
      { dayRange: 'Day 13', title: 'Fly home', nights: 0, description: 'Transfer to Zanzibar airport.' },
    ],
    included: ['Professional mountain guides, porters and cook', 'Camping equipment and all meals on the mountain', 'Park, camping and rescue fees', 'Flight to Zanzibar', 'Transfers'],
    excluded: [...standardExcluded, 'Personal climbing gear and sleeping bag'],
  },
  {
    title: 'Golf & Safari',
    durationDays: 7,
    tier: 'luxury',
    styles: ['classic'],
    hero: 'golf-safari-arusha',
    summary:
      'Tee off with zebra on the fairway at the Kilimanjaro Golf and Wildlife Estate, then head out to Tarangire and the Ngorongoro Crater.',
    days: [
      { dayRange: 'Days 1–2', title: 'Golf at the foot of Kilimanjaro', destination: 'arusha', nights: 2, description: 'Two nights on the Kilimanjaro Golf and Wildlife Estate with a round on the championship course.' },
      { dayRange: 'Days 3–4', title: 'Tarangire', destination: 'tarangire', nights: 2, description: 'Game drives among the elephants and baobabs.' },
      { dayRange: 'Days 5–6', title: 'Ngorongoro Crater', destination: 'ngorongoro', lodge: 'Crater Rim Camp', nights: 2, description: 'A full day on the crater floor and a walk in the highlands.' },
      { dayRange: 'Day 7', title: 'Departure', destination: 'arusha', nights: 0, description: 'Return to Arusha for a day room and your flight home.' },
    ],
    included: ['Accommodation and meals', 'Green fees for one round', 'Private safari vehicle and guide', 'Park fees', 'Transfers'],
    excluded: standardExcluded,
  },
  {
    title: 'Kigoma Family Self-Drive Adventure',
    durationDays: 18,
    tier: 'comfort',
    styles: ['selfdrive', 'family', 'cultural'],
    hero: 'all-in-tanzania-safari-vehicle',
    summary:
      'Take the wheel of our own Toyota Land Cruiser double cabin (automatic) and drive your family across Tanzania: Mikumi’s elephants, the Southern Highlands, the beaches of Lake Tanganyika and the chimpanzees of Gombe, then home through Tabora and Dodoma. We plan the route and book the stays; you set the pace.',
    days: [
      { dayRange: 'Days 1–2', title: 'Collect your Land Cruiser and head for Mikumi', destination: 'mikumi', nights: 2, description: 'We hand over the Land Cruiser in Dar es Salaam with a full briefing on the car, the route and the road rules. Drive west via Morogoro and the Uluguru Mountains to Mikumi for your first game drives among elephants, giraffe and zebra.' },
      { dayRange: 'Days 3–4', title: 'Up to Iringa', nights: 2, description: 'Climb through the baobab-filled Ruaha valley to the cool town of Iringa. Visit the Isimila Stone Age site and the busy market, or add a detour to Ruaha National Park.' },
      { dayRange: 'Day 5', title: 'The Southern Highlands to Mbeya', nights: 1, description: 'Green tea and coffee country all the way to Mbeya. Stay on a working coffee farm near the town.' },
      { dayRange: 'Day 6', title: 'Sumbawanga', nights: 1, description: 'A quiet drive across the Ufipa Plateau to Sumbawanga, the last town before the lake. Fill up the tank and the cool box here.' },
      { dayRange: 'Days 7–10', title: 'Beach days on Lake Tanganyika', destination: 'lake-tanganyika', nights: 4, description: 'Drop down the escarpment to the lake shore near Kipili. Four nights to swim, kayak, snorkel with cichlid fish and take a boat to the islands while the car rests.' },
      { dayRange: 'Day 11', title: 'Waterfalls on the way north', nights: 1, description: 'Follow the lake north towards Mpanda, with a stop at a waterfall and an overnight at a simple camp. A good day to spot wildlife on the edge of Katavi.' },
      { dayRange: 'Days 12–14', title: 'Kigoma and the chimpanzees of Gombe', destination: 'gombe', nights: 3, description: 'Base yourselves on the beach in Kigoma. Take a boat up the lake to Gombe Stream to trek with the chimpanzees, visit the Livingstone memorial in Ujiji and watch the fishing boats go out at sunset.' },
      { dayRange: 'Day 15', title: 'East to Tabora', nights: 1, description: 'A long drive east through miombo woodland to Tabora, an old caravan town with mango-lined avenues and stories from the slave and ivory trade routes.' },
      { dayRange: 'Days 16–17', title: 'Dodoma', nights: 2, description: 'Continue to Dodoma, Tanzania’s capital. Rest, visit the vineyards around the city and enjoy a family dinner after two weeks on the road.' },
      { dayRange: 'Day 18', title: 'Back to Dar es Salaam', nights: 0, description: 'Drive the final stretch to Dar es Salaam and hand back the Land Cruiser.' },
    ],
    included: [
      'Toyota Land Cruiser double cabin, automatic, for the whole trip',
      'Route plan and day-by-day driving notes',
      'Handover briefing in Dar es Salaam',
      'Booking of lodges and campsites along the route',
      'Phone support from our team while you drive',
    ],
    excluded: [...standardExcluded, 'Fuel', 'Accommodation and meals (quoted separately, depending on where you choose to stay)', 'Park fees and the Gombe boat and chimpanzee trek', 'International driving permit'],
  },
]

export const posts = [
  {
    title: 'How to take an African safari with kids',
    author: 'Sele Mduda',
    hero: 'kids-bush-walk',
    excerpt:
      'Our first child went on safari at a few months old, our daughter at nine months. Here is what we have learned about safari with young children: where to go, how long, and what to pack.',
    body: [
      ['p', 'There is a common belief that safari and young children don’t go together. We disagree. Our family is part Tanzanian, part Norwegian, and our two children have been to more sundowners and game drives than we can count. Here is our practical advice.'],
      ['h2', 'Where in Tanzania is best for families?'],
      ['p', 'Both circuits have excellent, easy-to-reach wildlife. The southern circuit (Mikumi, Ruaha, Nyerere) is quieter, has lower malaria risk in the dry season and combines easily with Zanzibar or Mafia Island. The north (Tarangire, Manyara, Ngorongoro, Serengeti) has the classic big-game experiences.'],
      ['h2', 'How old should children be?'],
      ['p', 'Our children’s first game drive was in Mikumi when they were two. As a rule of thumb: 2–3 years, half-day drives and waterholes; 4–5 years, half to full days but not a week of drives; 6–8 years, most children can manage a full safari. Some camps have minimum ages, so ask us.'],
      ['h2', 'How many days?'],
      ['p', 'Three or four days of game drives in a row is plenty for most children. Mix in a beach, a Maasai village visit, a walk or a pool day and everyone has a better trip.'],
      ['h2', 'What to pack'],
      ['p', 'Our best tip: a real pair of binoculars for every child. They keep kids engaged far better than toys. Add a sweater for cold mornings, sunscreen, a hat, insect repellent, audio books and plenty of snacks. You don’t need a new khaki wardrobe; just avoid very bright colours on open vehicles and walks.'],
      ['h2', 'Health'],
      ['p', 'Talk to your doctor about malaria prevention and vaccinations well before you travel, and check the yellow fever certificate rules for your route.'],
    ],
  },
  {
    title: 'Five tips for seeing a Mara River crossing',
    author: 'All in Tanzania',
    hero: 'mara-river-crossing',
    excerpt: 'Wildebeest crossing the Mara River is one of nature’s great dramas. Here is how to give yourself the best chance of seeing it.',
    body: [
      ['h2', '1. Be at the river at the right time'],
      ['p', 'Crossings happen in the northern Serengeti roughly from July to October. Travel with someone who gets daily news from guides, pilots and camps about where the herds are.'],
      ['h2', '2. Stay as long as you can'],
      ['p', 'The herds need to build up numbers and courage before they jump. It can take days. The more nights you spend near the river, the better your chances, and there is excellent resident game to enjoy while you wait.'],
      ['h2', '3. Wait for the energy to build'],
      ['p', 'When wildebeest gather on both banks and their calls grow louder, a crossing may be close. The noise becomes a giant hum.'],
      ['h2', '4. Keep your distance'],
      ['p', 'Vehicles too close to the bank can stop a crossing. Wait back from the river and only move closer once the herd has committed and the dust is rising.'],
      ['h2', '5. Stay observant'],
      ['p', 'Watch up and down the river for other herds, and look behind you too. Leopards have walked right past vehicles whose passengers were all staring at the water.'],
    ],
  },
  {
    title: 'Before you travel: practical notes for Tanzania',
    author: 'All in Tanzania',
    hero: 'zanzibar-door',
    excerpt: 'Visas, vaccines, money, packing and seasons: the practical things to know before your trip to Tanzania.',
    body: [
      ['h2', 'Seasons'],
      ['p', 'Tanzania is a year-round destination. The long rains fall from late March to May and the short rains in November. June to October is dry and cooler, ideal for safari. December to February is hot and green, with the calving season in the southern Serengeti.'],
      ['h2', 'Visa'],
      ['p', 'Most nationalities can get a visa on arrival or apply online in advance. Check the current rules for your passport before you fly.'],
      ['h2', 'Health'],
      ['p', 'Speak to your doctor or a travel clinic about malaria prevention and vaccinations, and bring your vaccination card. Use insect repellent in the evenings even if you take malaria tablets, and high-factor sunscreen during the day.'],
      ['h2', 'Money'],
      ['p', 'The currency is the Tanzanian shilling. US dollars are widely accepted for tourist services. ATMs are found in the larger towns; on Zanzibar mostly in Stone Town.'],
      ['h2', 'Packing'],
      ['p', 'Pack light in a soft bag: light flights often have a 15 kg limit. Bring neutral, breathable clothing, a warm layer for mornings, a hat, sunglasses and binoculars. Keep valuables and a change of clothes in your hand luggage.'],
      ['h2', 'Culture'],
      ['p', 'Tanzanians are famously welcoming. In Stone Town and coastal villages, covering shoulders and knees is respectful. Learn a few words: jambo (hello), asante (thank you), karibu (welcome).'],
    ],
  },
]
