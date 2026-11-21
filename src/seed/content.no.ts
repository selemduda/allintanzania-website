/**
 * Norwegian (Bokmål) versions of the starter content in ./content.ts, keyed the same way.
 * The seed adds them as the Norwegian translation; editors refine them in the admin.
 */

type Block = ['p' | 'h2', string]

export const destinationsNo: Record<
  string,
  { name?: string; tagline: string; summary: string; body: string[]; highlights: string[]; wildlife?: string[] }
> = {
  serengeti: {
    tagline: 'Endeløse sletter og den store migrasjonen',
    summary:
      'Serengeti er det Afrika alle drømmer om som barn: gyllent gress så langt øyet når, løver på granittkoppjer og nesten to millioner gnuer og sebraer som vandrer i en stor sirkel etter regnet.',
    body: [
      'Hvor du bor i Serengeti betyr mer enn noe annet sted i Tanzania, fordi flokkene hele tiden er på vandring. Fra desember til mars kalver de på kortgress-slettene i sør rundt Ndutu. Fra april til juni trekker de gjennom det sentrale og vestlige Serengeti. Fra juli til oktober når de Mara-elven helt i nord, der de berømte elvekrysningene skjer.',
      'Seronera-dalen midt i parken har vann hele året og noe av Afrikas beste rovdyrsafari, så Serengeti skuffer aldri, heller ikke utenom migrasjonssesongen. Vi velger leiren ut fra måneden du reiser, slik at du våkner nær det som skjer.',
    ],
    highlights: [
      'Kalvingssesongen på slettene i sør (desember til mars)',
      'Krysningene av Mara-elven i det nordlige Serengeti (juli til oktober)',
      'Løve, leopard og gepard hele året i Seronera-dalen',
      'Ballongsafari ved soloppgang',
    ],
    wildlife: ['Gnu', 'Sebra', 'Løve', 'Leopard', 'Gepard', 'Elefant', 'Sjiraff', 'Hyene'],
  },
  ngorongoro: {
    name: 'Ngorongoro-krateret',
    tagline: 'En glemt verden inne i en vulkan',
    summary:
      'Verdens største intakte vulkankaldera: 600 meter dyp og rundt 20 kilometer på tvers, med løve, bøffel, flamingo og svart neshorn på kraterbunnen. Masaiene gjeter fortsatt kveget sitt i høylandet rundt kraterkanten.',
    body: [
      'En dag på kraterbunnen er en av de store safaridagene i hele Afrika. Vi kjører ned tidlig, før de andre, og spiser lunsj ved flodhestdammen. Nettene er kjølige oppe på kanten, så ta med et varmt plagg.',
      'Ngorongoro ligger mellom Serengeti og Lake Manyara og passer naturlig inn i enhver safari i nord. Like i nærheten ligger Olduvai-kløften, et av de viktigste stedene for å forstå menneskets opprinnelse.',
    ],
    highlights: [
      'En hel dag på kraterbunnen',
      'Et av de beste stedene i Tanzania for å se svart neshorn',
      'Turer i høylandet med masaiguider',
      'Olduvai-kløften, menneskehetens vugge',
    ],
    wildlife: ['Svart neshorn', 'Løve', 'Bøffel', 'Flamingo', 'Flodhest', 'Elefant', 'Gnu'],
  },
  tarangire: {
    tagline: 'Elefanter blant eldgamle baobabtrær',
    summary:
      'Tarangire blir ofte oversett i skyggen av Serengeti, men er en av våre favorittparker. I tørketiden samles hundrevis av elefanter langs Tarangire-elven under kjempestore baobabtrær.',
    body: [
      'Tarangire ligger rundt to timer fra Arusha og er derfor et perfekt første stopp. Få minutter etter porten er du omgitt av gaseller, bøfler og sjiraffer, og elefantflokkene her er blant de største i Øst-Afrika.',
      'Parken har en uvanlig blanding av landskap, fra gressletter og skog i nord til sumper og lave åser i sør, og over 500 fuglearter. Gåsafari og nattsafari er mulig i verneområdene rundt parken.',
    ],
    highlights: [
      'Store elefantflokker i tørketiden',
      'Baobabtrær som er flere hundre år gamle',
      'Over 500 fuglearter',
      'Gåsafari utenfor parken',
    ],
    wildlife: ['Elefant', 'Løve', 'Sjiraff', 'Bøffel', 'Sebra', 'Oryks', 'Pyton'],
  },
  'lake-manyara': {
    tagline: 'Treklatrende løver og rosa flamingoer',
    summary:
      'En liten og vakker park ved foten av Riftdalens vegg, kjent for løver som hviler i grenene på akasietrærne og for flamingoene som farger innsjøkanten rosa.',
    body: [
      'Ernest Hemingway kalte den «det vakreste jeg har sett i Afrika». På en kort kjøretur går du fra grunnvannsskog full av aper til åpne gressletter, innsjøkanten og de varme kildene.',
      'Manyara er en fin og rolig start på safarien og passer godt for familier og kortere reiser. Tretoppstien lar deg gå oppe blant tretoppene.',
    ],
    highlights: [
      'Treklatrende løver',
      'Flamingoer og over 400 fuglearter',
      'Tretoppsti gjennom skogen',
      'Kulturvandring med masaier i Manyara-området',
    ],
    wildlife: ['Løve', 'Flamingo', 'Elefant', 'Bavian', 'Blåape', 'Flodhest', 'Sjiraff'],
  },
  arusha: {
    tagline: 'Porten til safariene i nord',
    summary:
      'De fleste safarier i nord begynner og slutter i Arusha. Kaffegårder, golf, Arusha nasjonalpark og, på klare morgener, utsikt mot Kilimanjaro og Mount Meru.',
    body: [
      'De fleste gjestene lander på Kilimanjaro internasjonale lufthavn og tilbringer første natt ved Arusha for å hvile etter den lange flyturen. Vi liker lodgene på kaffeplantasjene og Kilimanjaro Golf and Wildlife Estate, der du kan spille en runde med sebraer på fairwayen.',
    ],
    highlights: [
      'Omvisning på kaffegård',
      'Golf på Kilimanjaro Golf and Wildlife Estate',
      'Kano og fotturer i Arusha nasjonalpark',
      'Shanga-verkstedet og håndverksmarkeder',
    ],
  },
  ruaha: {
    tagline: 'Vill, avsides og uforglemmelig',
    summary:
      'Tanzanias største nasjonalpark og et av de villeste stedene som er igjen i Øst-Afrika. Baobabskoger, granittkoppjer og Great Ruaha-elven, med store løveflokker og en brøkdel av turistene i nord.',
    body: [
      'Få har hørt om Ruaha, og ingen glemmer det. Rundt ti prosent av verdens løver lever i det store Ruaha-landskapet, sammen med store elefantflokker, villhunder og både stor og liten kudu.',
      'De fleste gjestene flyr inn fra Dar es Salaam, Zanzibar eller Arusha. Vi kombinerer Ruaha med Nyerere for en klassisk safari i sør, og avslutter på stranden.',
    ],
    highlights: [
      'Store løveflokker og villhunder',
      'Gåsafari med erfarne guider',
      'Svært få andre safaribiler',
      'Ruaha Carnivore Project og lokalt naturvern',
    ],
    wildlife: ['Løve', 'Elefant', 'Villhund', 'Leopard', 'Stor kudu', 'Sabelantilope', 'Gepard'],
  },
  nyerere: {
    tagline: 'Båtsafari på Rufiji-elven',
    summary:
      'Det tidligere Selous Game Reserve er et av de største verneområdene i Afrika. Her foregår safarien med bil, til fots og med båt, forbi flodhester og krokodiller på Rufiji-elven og innsjøene.',
    body: [
      'Grunnleggeren vår drev en lodge i Selous før han startet All in Tanzania, så her er vi på hjemmebane. Båtsafari i solnedgang, fotturer med væpnet ranger og overnatting i flycamp er det som gjør Nyerere annerledes enn parkene i nord.',
      'Her lever en av Afrikas største bestander av villhund, og det er også mye løve, leopard, elefant og bøffel.',
    ],
    highlights: [
      'Båtsafari og solnedgang på innsjøene',
      'Gåsafari og flycamping',
      'Afrikansk villhund',
      'Kort flytur fra Dar es Salaam og Zanzibar',
    ],
    wildlife: ['Villhund', 'Løve', 'Flodhest', 'Krokodille', 'Elefant', 'Bøffel', 'Sjiraff'],
  },
  mikumi: {
    tagline: 'Den enkle safarien fra Dar es Salaam',
    summary:
      'Mikumi ligger noen timers kjøring fra Dar es Salaam på god vei, og passer perfekt for familier, korte reiser og alle som vil kombinere safari med kysten.',
    body: [
      'Mkata-sletten blir ofte sammenlignet med Serengeti: åpne gressletter med elefanter, sjiraffer, sebraer, bøfler og løver, og en flodhestdam full av krokodiller. Det er en av favorittparkene våre for en første safari med barn.',
    ],
    highlights: ['Kort kjøretur fra Dar es Salaam', 'Flodhestdammer', 'Flott første safari for små barn'],
    wildlife: ['Elefant', 'Sjiraff', 'Sebra', 'Løve', 'Flodhest', 'Bøffel'],
  },
  udzungwa: {
    name: 'Udzungwa-fjellene',
    tagline: 'Regnskogsturer og fosser',
    summary:
      'Tanzanias park for dem som liker å gå. Fjellregnskog full av aper og fugler som ikke finnes noe annet sted på jorden, og Sanje-fossen der du kan bade på toppen.',
    body: ['Her er det ingen safaribiler, bare stier. Kombiner Udzungwa med Mikumi og Ruaha for en aktiv rundtur i sør.'],
    highlights: [
      'Fottur til Sanje-fossen og bad i kulpene',
      'Endemiske aper som Udzungwa-rød colobus',
      'Passer perfekt sammen med Mikumi',
    ],
  },
  kilimanjaro: {
    name: 'Kilimanjaro',
    tagline: 'Stå på taket av Afrika',
    summary:
      'Med sine 5 895 meter er Kilimanjaro Afrikas høyeste fjell og verdens høyeste frittstående fjell. Du trenger ingen klatreerfaring, bare god forberedelse, et sterkt team og pole pole: sakte, sakte.',
    body: [
      'Vi går med erfarne fjellguider, bærere og kokker, og velger ruter som gir deg tid til å akklimatisere deg. Machame- og Lemosho-rutene har den flotteste naturen og høyest sjanse for å nå toppen; Marangu har overnatting i hytter.',
      'Etter bestigningen finnes det ingen bedre belønning enn noen dager på en strand på Zanzibar.',
    ],
    highlights: [
      'Soloppgang på Uhuru Peak',
      'Fem klimasoner, fra regnskog til isbre',
      'Sju dagers ruter for bedre akklimatisering',
    ],
  },
  zanzibar: {
    tagline: 'Strender på krydderøya og Stone Town',
    summary:
      'Hvit sand, turkist vann og flere hundre år med swahilisk, arabisk og indisk historie i smugene i Stone Town. Det perfekte stedet å senke tempoet etter safarien.',
    body: [
      'Hver kyst har sin egen karakter: Nungwi og Kendwa i nord for bading uansett tidevann og solnedganger, Matemwe i nordøst for dykking og snorkling ved Mnemba-atollen, og de roligere strendene Paje og Jambiani i sørøst.',
      'Bli minst én natt i Stone Town for de utskårne dørene, takrestaurantene og historien om krydder og slavehandel som formet Øst-Afrika.',
    ],
    highlights: [
      'Stone Town, på UNESCOs verdensarvliste',
      'Snorkling og dykking ved Mnemba-atollen',
      'Besøk på krydderfarm',
      'Røde colobusaper i Jozani-skogen',
      'Seiltur med dhow i solnedgang',
    ],
  },
  'mafia-island': {
    tagline: 'Svøm med hvalhaier',
    summary:
      'En rolig øy sør for Zanzibar i en marin nasjonalpark, der du fra oktober til mars kan svømme sammen med hvalhaier, verdens største fisk.',
    body: [
      'Mafia er slik Zanzibar var for flere tiår siden: ingen store hoteller, tomme strender og noe av den beste snorklingen og dykkingen i Det indiske hav. Det er en kort flytur fra Dar es Salaam og passer nydelig sammen med en safari i sør.',
    ],
    highlights: ['Hvalhaier (omtrent oktober til mars)', 'Korallrevene i Mafia Island Marine Park', 'Rolige strender og små lodger'],
  },
}

export const lodgesNo: Record<string, { summary: string; amenities: string[] }> = {
  'Kwihala Camp': {
    summary: 'En liten, enkel og vakker teltleir midt i Ruaha, kjent for flotte gåsafarier og safariturer.',
    amenities: ['Gåsafari', 'Nattsafari', 'Frokost i bushen'],
  },
  'Jabali Ridge': {
    summary: 'Suiter bygget blant granittblokker høyt over Ruaha-villmarken, med uendelighetsbasseng mot solnedgangen.',
    amenities: ['Uendelighetsbasseng', 'Spa', 'Privat hus kan leies'],
  },
  'Roho ya Selous': {
    summary: 'Åtte romslige telt ved Lake Nzerakera, med safariturer, gåturer, båtsafari og fiske inkludert.',
    amenities: ['Båtsafari', 'Gåsafari', 'Svømmebasseng', 'Fiske'],
  },
  'Angalia Tented Camp': {
    summary: 'En vennlig teltleir like ved Mikumi nasjonalpark, en favoritt for familier på sin første safari.',
    amenities: ['Familietelt', 'Hjemmelaget mat'],
  },
  'Tandala Tented Camp': {
    summary: 'Hevede telt like utenfor porten til Ruaha, der elefantene ofte går gjennom leiren til vannhullet.',
    amenities: ['Utsikt mot vannhullet', 'Svømmebasseng'],
  },
  'Udzungwa Forest Tented Camp': {
    summary: 'En fredelig leir i kanten av regnskogen, utgangspunktet for turen til Sanje-fossen.',
    amenities: ['Guidede skogsturer', 'Fossevandring'],
  },
  'Butiama Beach': {
    summary: 'En avslappet strandlodge på Mafia Island og basen vår for svømming med hvalhaier, snorkling og lange, tomme strender.',
    amenities: ['Turer med hvalhaier', 'Snorkling', 'Halvpensjon'],
  },
  'Matemwe Lodge': {
    summary: 'Tolv bungalower med havutsikt på en korallodde mot Mnemba-atollen, med fantastisk dykking og snorkling.',
    amenities: ['Dykking', 'Snorkling', 'Spa', 'Basseng'],
  },
  'Kendwa Rocks': {
    summary: 'Et livlig strandhotell nordvest på Zanzibar, der du kan bade uansett tidevann og se solen gå ned i havet.',
    amenities: ['Bading uansett tidevann', 'Strandbar', 'Solnedgang over havet'],
  },
  'Serengeti Migration Camp': {
    summary: 'En sesongleir som flytter med gnuene: slettene i sør under kalvingen, Mara-elven under krysningene.',
    amenities: ['Flytter med migrasjonen', 'Alt inkludert', 'Middag i bushen'],
  },
  'Crater Rim Camp': {
    summary: 'Private telt i Ngorongoro-høylandet, for tidlig start ned i krateret og turer med masaiguider.',
    amenities: ['Tidlig inn i krateret', 'Leirbål', 'Turer i høylandet'],
  },
  'Tarangire Camping Safari': {
    summary: 'Vår egen campingsafari: kuppeltelt, egen kokk og kvelder ved bålet under baobabtrærne. Brukes på familieeventyret Afrikidos.',
    amenities: ['Campingutstyr inkludert', 'Egen kokk', 'Flott for familier'],
  },
}

const standardExcluded = [
  'Internasjonale flyreiser',
  'Visum til Tanzania',
  'Reiseforsikring',
  'Tips til guider og ansatte',
  'Drikke og personlige utgifter',
]

type DayNo = { dayRange: string; title: string; description: string }

export const itinerariesNo: Record<
  string,
  { title: string; summary: string; days: DayNo[]; included: string[]; excluded: string[] }
> = {
  'The Great Migration Safari': {
    title: 'Safari med den store migrasjonen',
    summary:
      'Sju dager i det nordlige Tanzania som kombinerer gnuenes store vandring med en hel dag i Ngorongoro-krateret. Leiren din i Serengeti flytter med flokkene, så du bor nær det som skjer uansett måned.',
    days: [
      { dayRange: 'Dag 1', title: 'Karibu Tanzania', description: 'Guiden møter deg på Kilimanjaro lufthavn og kjører deg til en lodge utenfor Arusha, der du kan hvile etter flyturen.' },
      { dayRange: 'Dag 2', title: 'Opp til Ngorongoro-høylandet', description: 'Kjør gjennom masaienes land og opp Riftdalens vegg til leiren på kraterkanten. Ettermiddagstur i høylandet med en masaiguide.' },
      { dayRange: 'Dag 3', title: 'Kraterbunnen', description: 'Kjør ned ved første lys for en hel dag i krateret, på jakt etter svart neshorn, løve og flamingo, med piknik ved flodhestdammen.' },
      { dayRange: 'Dag 4–6', title: 'Etter flokkene', description: 'Fly eller kjør inn i Serengeti til en leir nær migrasjonen: slettene i sør i kalvingssesongen (desember til mars) eller Mara-elven for krysningene (juli til oktober). Ballongsafari ved soloppgang kan legges til.' },
      { dayRange: 'Dag 7', title: 'Kwaheri', description: 'En siste safaritur om morgenen, deretter fly tilbake til Arusha med dagrom før kveldsflyet hjem.' },
    ],
    included: ['All overnatting og alle måltider på safari', 'Privat 4x4-safaribil og profesjonell guide', 'Alle park- og verneavgifter', 'Flyplasstransport', 'Evakueringsdekning med Flying Doctors'],
    excluded: [...standardExcluded, 'Ballongsafari (tillegg)'],
  },
  'Southern Tanzania & Zanzibar': {
    title: 'Sørlige Tanzania og Zanzibar',
    summary:
      'En flysafari gjennom det ville sør: Ruaha for løver og gåsafari, Nyerere for båtsafari på Rufiji-elven, og deretter tre netter på en rolig strand på Zanzibar.',
    days: [
      { dayRange: 'Dag 1–3', title: 'Inn i villmarken i Ruaha', description: 'Bytt fly i Dar es Salaam og fly med småfly til Ruaha. Safariturer og gåturer blant baobabtrær og granittkoppjer i en av Øst-Afrikas mest avsidesliggende parker.' },
      { dayRange: 'Dag 4–6', title: 'Båter, gåturer og villhunder', description: 'Fly til Nyerere. Velg hver dag mellom safaritur, gåsafari, fiske og båttur i solnedgang på innsjøene.' },
      { dayRange: 'Dag 7–9', title: 'Tid ved Det indiske hav', description: 'Fly til Zanzibar for tre netter med utsikt mot Mnemba-atollen. Snorkle, dykk, besøk Stone Town eller bare slapp av i en hengekøye.' },
      { dayRange: 'Dag 10', title: 'Hjemreise', description: 'Fly til Dar es Salaam og videre med ditt internasjonale fly.' },
    ],
    included: ['Alle innenlandsflyvninger', 'Helpensjon på safari, halvpensjon på stranden', 'Felles safariaktiviteter i hver leir', 'Parkavgifter', 'Transport'],
    excluded: standardExcluded,
  },
  'Afrikidos Family Adventure': {
    title: 'Afrikidos familieeventyr',
    summary:
      'Vår egen lærerike campingsafari for familier. Barn og voksne sporer dyr til fots, sover i telt, lærer av masaienes eldste og krigere, og ser elefanter, flamingoer og treklatrende løver.',
    days: [
      { dayRange: 'Dag 1', title: 'Ankomst Arusha', description: 'Henting på Kilimanjaro lufthavn og en rolig natt i Arusha. En klar morgen ser du både Kilimanjaro og Mount Meru.' },
      { dayRange: 'Dag 2–3', title: 'Elefanter og baobabtrær', description: 'Safariturer blant elefantflokkene i Tarangire. Mannskapet setter opp leiren mens barna lærer å kjenne igjen spor, trær og fugler.' },
      { dayRange: 'Dag 4–5', title: 'Lake Manyara med bil og til fots', description: 'Se etter de berømte treklatrende løvene og de rosa flamingoene, gå på tretoppstien og bli med på en guidet gåsafari.' },
      { dayRange: 'Dag 6', title: 'En dag med masaiene', description: 'Masaienes eldste og krigere viser hvordan de lever side om side med dyrene: gjeting, medisinplanter, bueskyting og grillfest på masaivis.' },
      { dayRange: 'Dag 7', title: 'Tilbake til Arusha', description: 'Kjør tilbake til Arusha for suvenirer og avskjedsmiddag før flyet går.' },
    ],
    included: ['Campingutstyr (telt, madrasser, soveposer)', 'Alle måltider med egen kokk', '4x4-safaribil og engelsktalende guide', 'Parkavgifter', 'Kulturbesøk og dag med masaiene', 'Drikkevann'],
    excluded: standardExcluded,
  },
  'Beach & Bush: The Southern Road Trip': {
    title: 'Strand og bush: rundtur i sør',
    summary:
      'Kjør rundturen i sør fra Dar es Salaam: Mikumi, Ruaha og regnskogen i Udzungwa, fly deretter til Mafia Island for å svømme med hvalhaier, og avslutt på Zanzibar.',
    days: [
      { dayRange: 'Dag 1', title: 'Ankomst Dar es Salaam', description: 'Henting på flyplassen og en natt ved havet i Dar es Salaam.' },
      { dayRange: 'Dag 2–3', title: 'Mikumi', description: 'Seks timers kjøring på gode veier med dyr langs veien, deretter safariturer på Mkata-sletten.' },
      { dayRange: 'Dag 4–6', title: 'Ruaha', description: 'To hele dager i Ruaha på jakt etter løve, elefant og kudu langs Great Ruaha-elven.' },
      { dayRange: 'Dag 7–8', title: 'Fossene i Udzungwa', description: 'Gå gjennom regnskogen til Sanje-fossen. Ta med badetøy til kulpene på toppen.' },
      { dayRange: 'Dag 9–12', title: 'Mafia Island', description: 'Fly fra Dar til Mafia. Svøm med hvalhaier (i sesongen), snorkle i nasjonalparken eller gå langs de lange, tomme strendene.' },
      { dayRange: 'Dag 13–15', title: 'Zanzibar', description: 'Fly til Zanzibar for solnedganger på nordvestkysten og en dag i Stone Town.' },
      { dayRange: 'Dag 16', title: 'Hjemreise', description: 'Transport til flyplassen for flyet hjem.' },
    ],
    included: ['Transport med 4x4 og engelsktalende guide', 'Overnatting og måltider på safari', 'Halvpensjon på Mafia, frokost på Zanzibar', 'Parkavgifter og turen i Udzungwa', 'Fly Dar–Mafia–Zanzibar'],
    excluded: standardExcluded,
  },
  'Kilimanjaro Climb & Zanzibar': {
    title: 'Kilimanjaro-bestigning og Zanzibar',
    summary:
      'Bestig Afrikas høyeste fjell langs den vakre Machame-ruten med et erfarent fjellteam, og hent deg inn igjen på de hvite strendene på Zanzibar.',
    days: [
      { dayRange: 'Dag 1', title: 'Ankomst og utstyrssjekk', description: 'Møt fjellguiden din for gjennomgang og sjekk av utstyret.' },
      { dayRange: 'Dag 2–8', title: 'Machame-ruten', description: 'Sju dager på fjellet gjennom regnskog, lyngmark og høyfjellsørken, med tid til å akklimatisere deg før nattbestigningen til Uhuru Peak på 5 895 meter.' },
      { dayRange: 'Dag 9–12', title: 'Zanzibar', description: 'Fly til Zanzibar og hvil beina på stranden.' },
      { dayRange: 'Dag 13', title: 'Hjemreise', description: 'Transport til flyplassen på Zanzibar.' },
    ],
    included: ['Profesjonelle fjellguider, bærere og kokk', 'Campingutstyr og alle måltider på fjellet', 'Park-, camping- og redningsavgifter', 'Fly til Zanzibar', 'Transport'],
    excluded: [...standardExcluded, 'Personlig klatreutstyr og sovepose'],
  },
  'Golf & Safari': {
    title: 'Golf og safari',
    summary:
      'Slå ut med sebraer på fairwayen på Kilimanjaro Golf and Wildlife Estate, og dra deretter videre til Tarangire og Ngorongoro-krateret.',
    days: [
      { dayRange: 'Dag 1–2', title: 'Golf ved foten av Kilimanjaro', description: 'To netter på Kilimanjaro Golf and Wildlife Estate med en runde på mesterskapsbanen.' },
      { dayRange: 'Dag 3–4', title: 'Tarangire', description: 'Safariturer blant elefantene og baobabtrærne.' },
      { dayRange: 'Dag 5–6', title: 'Ngorongoro-krateret', description: 'En hel dag på kraterbunnen og en tur i høylandet.' },
      { dayRange: 'Dag 7', title: 'Avreise', description: 'Tilbake til Arusha med dagrom før flyet hjem.' },
    ],
    included: ['Overnatting og måltider', 'Greenfee for én runde', 'Privat safaribil og guide', 'Parkavgifter', 'Transport'],
    excluded: standardExcluded,
  },
}

export const postsNo: Record<string, { title: string; excerpt: string; body: Block[] }> = {
  'How to take an African safari with kids': {
    title: 'Slik drar du på safari i Afrika med barn',
    excerpt:
      'Vårt første barn var på safari da han var noen måneder gammel, datteren vår da hun var ni måneder. Her er det vi har lært om safari med små barn: hvor du bør dra, hvor lenge og hva du bør pakke.',
    body: [
      ['p', 'Mange tror at safari og små barn ikke passer sammen. Det er vi uenige i. Familien vår er dels tanzaniansk, dels norsk, og de to barna våre har vært med på flere solnedganger og safariturer enn vi kan telle. Her er de praktiske rådene våre.'],
      ['h2', 'Hvor i Tanzania passer best for familier?'],
      ['p', 'Begge rundturene har flott dyreliv som er lett å nå. Den sørlige ruten (Mikumi, Ruaha, Nyerere) er roligere, har lavere malariarisiko i tørketiden og er lett å kombinere med Zanzibar eller Mafia Island. Nord (Tarangire, Manyara, Ngorongoro, Serengeti) har de klassiske storviltopplevelsene.'],
      ['h2', 'Hvor gamle bør barna være?'],
      ['p', 'Barna våre var med på sin første safaritur i Mikumi da de var to år. En tommelfingerregel: 2–3 år, halve dager og vannhull; 4–5 år, halve til hele dager, men ikke en hel uke med safariturer; 6–8 år, de fleste barn klarer en hel safari. Noen leirer har aldersgrenser, så spør oss.'],
      ['h2', 'Hvor mange dager?'],
      ['p', 'Tre eller fire dager med safariturer på rad er nok for de fleste barn. Legg inn en strand, et besøk i en masailandsby, en gåtur eller en dag ved bassenget, så får alle en bedre reise.'],
      ['h2', 'Hva du bør pakke'],
      ['p', 'Vårt beste tips: en ordentlig kikkert til hvert barn. Det holder barna engasjert mye bedre enn leker. Ta også med genser til kalde morgener, solkrem, hatt, insektmiddel, lydbøker og mye snacks. Du trenger ikke en ny kakigarderobe, men unngå veldig sterke farger i åpne biler og på gåturer.'],
      ['h2', 'Helse'],
      ['p', 'Snakk med legen din om malariaforebygging og vaksiner i god tid før du reiser, og sjekk reglene for gulfebersertifikat for ruten din.'],
    ],
  },
  'Five tips for seeing a Mara River crossing': {
    title: 'Fem tips for å se en krysning av Mara-elven',
    excerpt: 'Gnuer som krysser Mara-elven er et av naturens store dramaer. Slik gir du deg selv den beste sjansen til å se det.',
    body: [
      ['h2', '1. Vær ved elven til riktig tid'],
      ['p', 'Krysningene skjer i det nordlige Serengeti omtrent fra juli til oktober. Reis med noen som får daglige oppdateringer fra guider, piloter og leirer om hvor flokkene er.'],
      ['h2', '2. Bli så lenge du kan'],
      ['p', 'Flokkene må bygge opp antall og mot før de hopper. Det kan ta dager. Jo flere netter du tilbringer nær elven, desto bedre er sjansene, og det er flott dyreliv å glede seg over mens du venter.'],
      ['h2', '3. Vent til spenningen bygger seg opp'],
      ['p', 'Når gnuene samles på begge breddene og lydene blir høyere, kan en krysning være nær. Lyden blir til en stor summing.'],
      ['h2', '4. Hold avstand'],
      ['p', 'Biler som står for nær elvebredden kan stoppe en krysning. Vent et stykke unna elven, og kjør først nærmere når flokken har bestemt seg og støvet stiger.'],
      ['h2', '5. Følg med'],
      ['p', 'Se opp og ned langs elven etter andre flokker, og se deg bak også. Leoparder har gått rett forbi biler der alle passasjerene stirret på vannet.'],
    ],
  },
  'Before you travel: practical notes for Tanzania': {
    title: 'Før du reiser: praktisk informasjon om Tanzania',
    excerpt: 'Visum, vaksiner, penger, pakking og sesonger: det praktiske du bør vite før reisen til Tanzania.',
    body: [
      ['h2', 'Sesonger'],
      ['p', 'Tanzania er et reisemål hele året. Den store regntiden varer fra slutten av mars til mai, og den lille regntiden kommer i november. Juni til oktober er tørt og kjøligere, ideelt for safari. Desember til februar er varmt og grønt, med kalvingssesong i det sørlige Serengeti.'],
      ['h2', 'Visum'],
      ['p', 'De fleste kan få visum ved ankomst eller søke på nett på forhånd. Sjekk gjeldende regler for ditt pass før du reiser.'],
      ['h2', 'Helse'],
      ['p', 'Snakk med legen din eller en vaksinasjonsklinikk om malariaforebygging og vaksiner, og ta med vaksinasjonskortet. Bruk insektmiddel om kveldene selv om du tar malariatabletter, og solkrem med høy faktor om dagen.'],
      ['h2', 'Penger'],
      ['p', 'Valutaen er tanzanianske shilling. Amerikanske dollar er godt akseptert for turisttjenester. Minibanker finnes i de større byene, og på Zanzibar mest i Stone Town.'],
      ['h2', 'Pakking'],
      ['p', 'Pakk lett i en myk bag: småfly har ofte en grense på 15 kg. Ta med nøytrale klær som puster, et varmt plagg til morgenene, hatt, solbriller og kikkert. Ha verdisaker og et sett skift i håndbagasjen.'],
      ['h2', 'Kultur'],
      ['p', 'Tanzanianere er kjent for å være gjestfrie. I Stone Town og kystlandsbyene er det respektfullt å dekke skuldre og knær. Lær deg noen ord: jambo (hei), asante (takk), karibu (velkommen).'],
    ],
  },
}

export const homeNo = {
  heroSlides: [
    { eyebrow: 'Serengeti · Den store migrasjonen', heading: 'Følg verdens største naturforestilling' },
    { eyebrow: 'Skreddersydde safarier i Tanzania', heading: 'Der villmarken fortsatt er fri' },
    { eyebrow: 'Kilimanjaro', heading: 'Stå på taket av Afrika' },
    { eyebrow: 'Zanzibar og Mafia Island', heading: 'Fra bushen til stranden' },
  ],
  heroSubheading:
    'Safari, fjelltur og strandferie i hele Tanzania, planlagt av folk som er født der og kjenner hver vei, leir og sesong. Med norsk kontor i Tønsberg.',
  intro: {
    heading: 'Ditt valg. Din ferie. Vårt oppdrag.',
    body: 'All in Tanzania er et familieselskap med røtter i Tanzania og hjem i Norge. Grunnleggeren vår vokste opp i Tanzania og drev en safarilodge i Selous før han startet selskapet. Sammen med et team av lokale guider har vi tilbrakt mange år i parkene, på fjellet og langs kysten.\n\nHver reise er skreddersydd. Fortell oss hva du drømmer om å se og hvordan du liker å reise, så former vi en reise rundt deg, enten det er et campingeventyr med barna eller en flysafari til de villeste hjørnene i sør.',
  },
  pillars: [
    { title: 'Lokale eksperter', body: 'Tanzanianske guider og planleggere som kjenner hver park, leir og sesong fra egen erfaring.' },
    { title: 'Skreddersydd', body: 'Ingen faste gruppeturer. Hver reiserute bygges rundt dine datoer, ditt budsjett og dine interesser.' },
    { title: 'Familier er velkomne', body: 'Fra Afrikidos-campingeventyr til stranddager: vi planlegger safarier barn elsker.' },
    { title: 'Positivt avtrykk', body: 'Vi samarbeider med lokalsamfunn og naturvernprosjekter som Ruaha Carnivore Project.' },
  ],
  expertBanner: {
    heading: (name: string) => `Planlegg med ${name}, når som helst på døgnet`,
    body: 'Vår AI-safariekspert har lært av guidene og planleggerne våre og kjenner parkene, leirene og sesongene. Spør om hva du vil, skriftlig eller muntlig, og form reisen sammen. Når du er klar, tar en av oss over personlig.',
  },
}

export const siteNo = {
  tagline: 'Ditt valg. Din ferie. Vårt oppdrag.',
  footerNote: 'Skreddersydde safarier, Kilimanjaro-bestigninger og strandferier i hele Tanzania, planlagt av folk som kaller det hjem.',
}

export const expertNo = {
  expertTitle: 'Safariekspert, Arusha',
  greeting: (name: string) =>
    `Karibu! Jeg er ${name}, AI-safarieksperten til All in Tanzania. Jeg har lært av guidene og planleggerne våre, så spør meg om alt om parker, sesonger, lodger eller familiereiser, skriftlig eller muntlig. Fortell meg hva du drømmer om å se, så former vi safarien sammen.`,
}
