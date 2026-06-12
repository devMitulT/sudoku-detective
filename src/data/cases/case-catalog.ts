import { CaseDifficultyLabel } from '@/models';

export interface SuspectBlueprint {
  name: string;
  role: string;
  age: number;
  relationship: string;
  motive: string;
}

export interface CaseBlueprint {
  number: number;
  title: string;
  subtitle: string;
  victim: string;
  location: string;
  timeOfDeath: string;
  synopsis: string;
  difficulty: CaseDifficultyLabel;
  estimatedMinutes: string;
  suspects: [SuspectBlueprint, SuspectBlueprint, SuspectBlueprint, SuspectBlueprint];
  culpritIndex: 0 | 1 | 2 | 3;
  /** Suspect indices cleared by witness clothing clue (two innocent mismatches). */
  witnessClears: [number, number];
  physicalTitle: string;
  physicalBody: string;
  witnessBody: string;
  /** Pairs per suspect: name, clothing/accessory detail (8 entries). */
  witnessRows: [string, string, string, string, string, string, string, string];
  forensicBody: string;
  cctvBody: string;
  cctvExit: string;
  motiveBody: string;
  endingNarrative: string;
  evidenceSummary: [string, string, string, string];
}

const ACCENTS = ['#FF4D6D', '#4CC9F0', '#F7B731', '#52D273', '#A78BFA', '#FB923C'];

export const CASE_BLUEPRINTS: CaseBlueprint[] = [
  {
    number: 2,
    title: 'The Velvet Poison',
    subtitle: 'A prima donna collapses during final act.',
    victim: 'Elena Voss',
    location: 'Grand Opera House',
    timeOfDeath: '10:20 PM',
    synopsis:
      'During the climax of La Notte, celebrated soprano Elena Voss collapsed on stage. The autopsy points to poison delivered backstage. Only four people had access to her dressing room.',
    difficulty: 'Beginner',
    estimatedMinutes: '6–9',
    suspects: [
      { name: 'Clara Duval', role: 'Understudy', age: 29, relationship: 'Elena blocked her promotion.', motive: 'Career rivalry.' },
      { name: 'Marco Bellini', role: 'Conductor', age: 44, relationship: 'Contract dispute with Elena.', motive: 'Professional feud.' },
      { name: 'Henrik Strauss', role: 'Stage Manager', age: 51, relationship: 'Managed backstage access.', motive: 'Embezzlement cover-up.' },
      { name: 'Lydia Chen', role: 'Costume Designer', age: 36, relationship: 'Designed Elena\'s final gown.', motive: 'Unknown.' },
    ],
    culpritIndex: 2,
    witnessClears: [0, 3],
    physicalTitle: 'Poisoned Lipstick',
    physicalBody: 'Traces of toxin found\non Elena\'s dressing table.',
    witnessBody: 'I saw someone in a\ngold cufflink entering\nher dressing room.',
    witnessRows: ['Clara Duval', 'Silver bracelet', 'Henrik Strauss', 'Gold cufflinks', 'Marco Bellini', 'Gold cufflinks', 'Lydia Chen', 'Pearl necklace'],
    forensicBody: 'Stage access logs\nmatch one suspect.',
    cctvBody: 'Henrik entered the\ndressing corridor\nat 9:48 PM.',
    cctvExit: 'No footage of him leaving before curtain',
    motiveBody: 'From: Elena Voss\nTo: Board of Directors\n\n"Henrik diverted gala funds\nfor personal use."',
    endingNarrative:
      'Henrik Strauss had been skimming renovation budgets for years. Elena discovered discrepancies in the ledgers and planned to expose him before the season finale. He poisoned her lipstick minutes before she took the stage. He was arrested at dawn.',
    evidenceSummary: ['Poison Trace', 'Witness Identification', 'Access Logs', 'Financial Motive'],
  },
  {
    number: 3,
    title: 'Cold Harvest',
    subtitle: 'A farmer found dead in the silo at dawn.',
    victim: 'Tom Holloway',
    location: 'Holloway Family Farm',
    timeOfDeath: '5:15 AM',
    synopsis:
      'Tom Holloway was discovered at the bottom of his grain silo. The ladder was locked from outside. Three workers and his estranged brother were on the property that night.',
    difficulty: 'Beginner',
    estimatedMinutes: '6–9',
    suspects: [
      { name: 'Rita Holloway', role: 'Estranged Sister', age: 41, relationship: 'Fighting over inheritance.', motive: 'Land dispute.' },
      { name: 'Dale Finch', role: 'Farm Hand', age: 33, relationship: 'Owed Tom back wages.', motive: 'Debt.' },
      { name: 'Nora Pike', role: 'Veterinarian', age: 38, relationship: 'Treated the livestock.', motive: 'Unknown.' },
      { name: 'Victor Marsh', role: 'Grain Broker', age: 47, relationship: 'Negotiated Tom\'s contracts.', motive: 'Contract fraud.' },
    ],
    culpritIndex: 3,
    witnessClears: [0, 2],
    physicalTitle: 'Mud on the Ladder',
    physicalBody: 'Fresh boot prints found\non the silo ladder.',
    witnessBody: 'A truck with a green\nlogo left around 4 AM.',
    witnessRows: ['Rita Holloway', 'Red pickup', 'Dale Finch', 'Green logo truck', 'Nora Pike', 'White sedan', 'Victor Marsh', 'Green logo truck'],
    forensicBody: 'Boot tread matches\nbroker yard samples.',
    cctvBody: 'Victor\'s truck idled\nby the silo at 4:22 AM.',
    cctvExit: 'Drove away before sunrise',
    motiveBody: 'Tom threatened to report\nfalsified grain weights\nto the co-op board.',
    endingNarrative:
      'Victor Marsh had been short-weighting deliveries for months. Tom confronted him the night before the harvest audit. Victor lured him to the silo and sealed the ladder. Justice arrived with the morning shift.',
    evidenceSummary: ['Boot Evidence', 'Truck Witness', 'Broker Match', 'Fraud Motive'],
  },
  {
    number: 4,
    title: 'Silent Auction',
    subtitle: 'A masterpiece vanishes — and a curator dies.',
    victim: 'Arthur Pemberton',
    location: 'Whitmore Gallery',
    timeOfDeath: '8:05 PM',
    synopsis:
      'Minutes before a record-breaking auction, curator Arthur Pemberton was found dead in the vault. The featured painting was swapped with a forgery. Four insiders held keys.',
    difficulty: 'Beginner',
    estimatedMinutes: '7–10',
    suspects: [
      { name: 'Isabel Grant', role: 'Appraiser', age: 45, relationship: 'Certified the painting.', motive: 'Reputation risk.' },
      { name: 'Leo Tanaka', role: 'Security Chief', age: 39, relationship: 'Controlled vault access.', motive: 'Gambling debts.' },
      { name: 'Mira Solis', role: 'Restorer', age: 34, relationship: 'Worked on the canvas.', motive: 'Artistic jealousy.' },
      { name: 'Owen Blake', role: 'Auctioneer', age: 52, relationship: 'Headlined the sale.', motive: 'Commission fraud.' },
    ],
    culpritIndex: 1,
    witnessClears: [2, 3],
    physicalTitle: 'Vault Fiber',
    physicalBody: 'Synthetic fiber caught\non the vault hinge.',
    witnessBody: 'Someone in a navy guard\nuniform entered late.',
    witnessRows: ['Isabel Grant', 'Red dress', 'Leo Tanaka', 'Navy uniform', 'Mira Solis', 'Paint smock', 'Owen Blake', 'Tuxedo'],
    forensicBody: 'Fiber matches security\nuniform batch.',
    cctvBody: 'Leo opened the vault\nat 7:51 PM alone.',
    cctvExit: 'Carried a tube case out',
    motiveBody: 'Forgery swap would clear\nhis debts to underground lenders.',
    endingNarrative:
      'Leo Tanaka swapped the masterpiece for a forgery he commissioned, planning to sell the original abroad. Pemberton caught him resetting the alarm. The security chief became the prime suspect he once hunted.',
    evidenceSummary: ['Fiber Trace', 'Uniform Witness', 'Vault Footage', 'Debt Motive'],
  },
  {
    number: 5,
    title: 'Frostline Express',
    subtitle: 'Murder on the overnight rail to Geneva.',
    victim: 'Dr. Amira Khatib',
    location: 'Frostline Sleeper Train',
    timeOfDeath: '2:40 AM',
    synopsis:
      'Renowned diplomat Dr. Amira Khatib was found dead in her compartment while the train crossed the Alps. The door was chained from inside — but someone had a master key.',
    difficulty: 'Intermediate',
    estimatedMinutes: '8–11',
    suspects: [
      { name: 'Pierre Duclos', role: 'Chef de Train', age: 48, relationship: 'Served her compartment.', motive: 'Bribery.' },
      { name: 'Sasha Volkov', role: 'Journalist', age: 31, relationship: 'Interviewed her earlier.', motive: 'Expose article.' },
      { name: 'Helena Roth', role: 'Diplomatic Attaché', age: 40, relationship: 'Shared embassy staff.', motive: 'Policy disagreement.' },
      { name: 'Jonas Reed', role: 'Customs Inspector', age: 43, relationship: 'Boarded at last stop.', motive: 'Smuggling ring.' },
    ],
    culpritIndex: 3,
    witnessClears: [0, 2],
    physicalTitle: 'Master Key Scratch',
    physicalBody: 'Fresh scratches on the\ncompartment chain lock.',
    witnessBody: 'A man in a grey inspector\ncoat argued at her door.',
    witnessRows: ['Pierre Duclos', 'Blue uniform', 'Sasha Volkov', 'Tweed coat', 'Helena Roth', 'Embassy pin', 'Jonas Reed', 'Grey inspector coat'],
    forensicBody: 'Key oil matches customs\nmaster set.',
    cctvBody: 'Jonas entered her car\nat 2:18 AM.',
    cctvExit: 'Left via service corridor',
    motiveBody: 'Amira was carrying evidence\nof a smuggling network\nJonas protected.',
    endingNarrative:
      'Jonas Reed ran a smuggling route using diplomatic pouches. Amira photographed manifests before boarding. He used his master key, staged the chain, and dumped the evidence at the next tunnel crossing. Interpol met the train at Geneva.',
    evidenceSummary: ['Lock Evidence', 'Witness Account', 'Key Match', 'Smuggling Motive'],
  },
];

// Cases 6–25 generated from theme table to keep each mystery unique.
const THEMES: Omit<CaseBlueprint, 'number' | 'culpritIndex' | 'witnessClears' | 'difficulty' | 'estimatedMinutes'>[] = [
  { title: 'Harbor Lights', subtitle: 'A dockmaster murdered at midnight.', victim: 'Frank O\'Malley', location: 'North Pier Warehouse', timeOfDeath: '11:58 PM', synopsis: 'Frank O\'Malley was found crushed between cargo crates. Tide records show only four people on the pier after hours.', physicalTitle: 'Rope Fibers', physicalBody: 'Harbor rope fiber on\nvictim\'s jacket.', witnessBody: 'Saw a yellow raincoat\nnear loading bay B.', witnessRows: ['Gina Ortiz', 'Yellow raincoat', 'Pete Walsh', 'Orange vest', 'Iris Boone', 'Navy peacoat', 'Cal Dunn', 'Yellow raincoat'], forensicBody: 'Fiber matches pier inventory.', cctvBody: 'Cal entered bay B\nat 11:40 PM.', cctvExit: 'Stayed until alarm tripped', motiveBody: 'Frank was reporting stolen\ncargo manifests to the port authority.', endingNarrative: 'Cal Dunn falsified shipping logs for years. O\'Malley compiled proof the night of the murder. Cal ambushed him between cranes and staged an accident.', evidenceSummary: ['Rope Evidence', 'Raincoat Witness', 'Pier Footage', 'Theft Motive'], suspects: [{ name: 'Gina Ortiz', role: 'Crane Operator', age: 35, relationship: 'Worked Frank\'s shift.', motive: 'Overtime dispute.' }, { name: 'Pete Walsh', role: 'Longshoreman', age: 42, relationship: 'Loaded Frank\'s vessels.', motive: 'Union conflict.' }, { name: 'Iris Boone', role: 'Harbor Pilot', age: 37, relationship: 'Guided night ships.', motive: 'Unknown.' }, { name: 'Cal Dunn', role: 'Cargo Clerk', age: 45, relationship: 'Logged all manifests.', motive: 'Smuggling profits.' }] },
  { title: 'Gilded Cage', subtitle: 'A hotel magnate dies in a locked suite.', victim: 'Victoria Hale', location: 'The Gilded Cage Hotel', timeOfDeath: '1:10 AM', synopsis: 'Victoria Hale was discovered in her penthouse. The electronic lock logged only staff entries that night.', physicalTitle: 'Champagne Residue', physicalBody: 'Rare sedative found in\nher champagne flute.', witnessBody: 'Staff with silver keycards\nvisited the floor.', witnessRows: ['Nadia Cole', 'Silver keycard', 'Rex Harmon', 'Gold keycard', 'Elise Park', 'Silver keycard', 'Grant Lowe', 'Bronze pass'], forensicBody: 'Sedative traced to hotel pharmacy.', cctvBody: 'Rex entered the suite\nat 12:55 AM.', cctvExit: 'Left via service elevator', motiveBody: 'Victoria planned to sell the hotel\nand fire the executive board.', endingNarrative: 'Rex Harmon stood to lose millions in stock options. He drugged Victoria\'s champagne and triggered a cardiac event. The penthouse cameras were his alibi — until we found the blind spot.', evidenceSummary: ['Toxicology', 'Keycard Witness', 'Suite Footage', 'Corporate Motive'], suspects: [{ name: 'Nadia Cole', role: 'Head Concierge', age: 33, relationship: 'Managed VIP floor.', motive: 'Promotion blocked.' }, { name: 'Rex Harmon', role: 'CFO', age: 49, relationship: 'Hotel board member.', motive: 'Stock options.' }, { name: 'Elise Park', role: 'Private Chef', age: 28, relationship: 'Prepared her meals.', motive: 'Contract dispute.' }, { name: 'Grant Lowe', role: 'Security Director', age: 41, relationship: 'Controlled cameras.', motive: 'Unknown.' }] },
  { title: 'Ember Valley', subtitle: 'A vintner poisoned during harvest festival.', victim: 'Luca Romano', location: 'Ember Valley Winery', timeOfDeath: '9:30 PM', synopsis: 'Luca Romano collapsed in the tasting room during the harvest gala. Four partners stood to inherit the estate.', physicalTitle: 'Wine Sediment', physicalBody: 'Toxic compound in his\nglass of reserve vintage.', witnessBody: 'Someone in a burgundy apron\npoured his final taste.', witnessRows: ['Ana Romano', 'Floral dress', 'Bruno Costa', 'Burgundy apron', 'Celia Marsh', 'White blazer', 'Derek Yu', 'Burgundy apron'], forensicBody: 'Compound matches cellar lab.', cctvBody: 'Bruno poured Luca\'s glass\nat 9:12 PM.', cctvExit: 'Disposed bottle in compost', motiveBody: 'Luca was cutting Bruno out\nof the estate will.', endingNarrative: 'Bruno Costa forged tasting certificates for years. Luca discovered the fraud on the night of the will reading. Bruno poisoned the reserve barrel and served the fatal glass himself.', evidenceSummary: ['Wine Analysis', 'Apron Witness', 'Cellar Footage', 'Inheritance Motive'], suspects: [{ name: 'Ana Romano', role: 'Sister', age: 38, relationship: 'Co-owner.', motive: 'Family rivalry.' }, { name: 'Bruno Costa', role: 'Head Winemaker', age: 46, relationship: 'Ran production.', motive: 'Forgery exposure.' }, { name: 'Celia Marsh', role: 'Distributor', age: 42, relationship: 'Exported the label.', motive: 'Contract loss.' }, { name: 'Derek Yu', role: 'Sommelier', age: 29, relationship: 'Curated tastings.', motive: 'Unknown.' }] },
  { title: 'Clockwork Heir', subtitle: 'Death at the top of the city clock tower.', victim: 'Edmund Wright', location: 'Ashford Clock Tower', timeOfDeath: '6:00 AM', synopsis: 'Edmund Wright, clock tower trustee, was found at the mechanism platform. The tower door requires three separate keys.', physicalTitle: 'Brass Shavings', physicalBody: 'Shavings from a custom\nwrench on the gears.', witnessBody: 'Heard arguing with someone\nwearing a copper badge.', witnessRows: ['Miles Grant', 'Copper badge', 'Tessa Bloom', 'Blue scarf', 'Omar Haddad', 'Copper badge', 'Ruth Pike', 'Grey coat'], forensicBody: 'Wrench matches maintenance kit.', cctvBody: 'Miles entered the tower\nat 5:38 AM.', cctvExit: 'Descended before the chime', motiveBody: 'Edmund uncovered overtime fraud\nin the restoration fund.', endingNarrative: 'Miles Grant billed phantom hours on the clock restoration for a decade. Edmund confronted him at dawn. Miles sabotaged the platform guard and let the mechanism do the rest.', evidenceSummary: ['Tool Evidence', 'Badge Witness', 'Tower Logs', 'Fraud Motive'], suspects: [{ name: 'Miles Grant', role: 'Clockkeeper', age: 50, relationship: 'Maintained the mechanism.', motive: 'Payroll fraud.' }, { name: 'Tessa Bloom', role: 'Historian', age: 36, relationship: 'Catalogued archives.', motive: 'Grant dispute.' }, { name: 'Omar Haddad', role: 'City Engineer', age: 44, relationship: 'Approved repairs.', motive: 'Budget pressure.' }, { name: 'Ruth Pike', role: 'Tour Guide', age: 31, relationship: 'Opened morning tours.', motive: 'Unknown.' }] },
  { title: 'Starfall Gala', subtitle: 'An astronomer dies under the dome.', victim: 'Dr. Yuki Tan', location: 'Starfall Observatory', timeOfDeath: '11:15 PM', synopsis: 'During a meteor shower gala, Dr. Tan was found dead at the telescope controls. The dome was sealed for the event.', physicalTitle: 'Oxygen Valve', physicalBody: 'Valve tampered on her\nprivate respirator unit.', witnessBody: 'Someone in a white lab coat\nleft the control room.', witnessRows: ['Ren Okada', 'Black tie', 'Sienna Locke', 'White lab coat', 'Paul Avery', 'White lab coat', 'Dina Morales', 'Green dress'], forensicBody: 'Tool marks match lab kit.', cctvBody: 'Sienna adjusted the valve\nat 10:58 PM.', cctvExit: 'Rejoined the gala crowd', motiveBody: 'Yuki was about to publish data\nproving Sienna falsified discoveries.', endingNarrative: 'Sienna Locke fabricated comet trajectory data to secure grants. Dr. Tan replicated her results and found the error. Sienna tampered with the respirator during the dome seal.', evidenceSummary: ['Valve Tampering', 'Lab Coat Witness', 'Dome Footage', 'Academic Fraud'], suspects: [{ name: 'Ren Okada', role: 'Postdoc', age: 27, relationship: 'Worked under Yuki.', motive: 'Paper authorship.' }, { name: 'Sienna Locke', role: 'Lead Researcher', age: 41, relationship: 'Shared grant funding.', motive: 'Fabricated data.' }, { name: 'Paul Avery', role: 'Technician', age: 35, relationship: 'Maintained telescopes.', motive: 'Layoff risk.' }, { name: 'Dina Morales', role: 'Donor', age: 53, relationship: 'Funded the observatory.', motive: 'Unknown.' }] },
  { title: 'Marble Verdict', subtitle: 'A judge found dead in chambers.', victim: 'Judge Helen Marsh', location: 'County Courthouse', timeOfDeath: '7:45 PM', synopsis: 'Judge Marsh was found in her chambers after a controversial verdict. Security listed four visitors that evening.', physicalTitle: 'Ink Stain', physicalBody: 'Rare ink on her tea cup\nmatches chambers set.', witnessBody: 'A visitor with a maroon briefcase\nargued loudly.', witnessRows: ['Carter Wells', 'Maroon briefcase', 'Lydia Frost', 'Tan portfolio', 'Nina Ortiz', 'Maroon briefcase', 'Samir Ali', 'Grey suit'], forensicBody: 'Ink batch assigned to one clerk.', cctvBody: 'Carter entered chambers\nat 7:22 PM.', cctvExit: 'Left through side exit', motiveBody: 'Judge Marsh was reviewing\nbribery in Carter\'s firm.', endingNarrative: 'Carter Wells bribed clerks to fix corporate cases. Judge Marsh obtained sealed transcripts. Carter poisoned her tea and fled via the attorney tunnel.', evidenceSummary: ['Ink Analysis', 'Briefcase Witness', 'Chambers Log', 'Bribery Motive'], suspects: [{ name: 'Carter Wells', role: 'Defense Attorney', age: 47, relationship: 'Lost high-profile trial.', motive: 'Bribery exposure.' }, { name: 'Lydia Frost', role: 'Court Reporter', age: 34, relationship: 'Transcribed hearings.', motive: 'Defamation suit.' }, { name: 'Nina Ortiz', role: 'Clerk', age: 29, relationship: 'Managed docket.', motive: 'Promotion.' }, { name: 'Samir Ali', role: 'Bailiff', age: 41, relationship: 'Secured chambers.', motive: 'Unknown.' }] },
  { title: 'Silver Reef', subtitle: 'High stakes murder at the casino.', victim: 'Dante Moreno', location: 'Silver Reef Casino', timeOfDeath: '3:20 AM', synopsis: 'Casino owner Dante Moreno was found in the VIP cage. The vault camera loop was edited — but not perfectly.', physicalTitle: 'Card Shavings', physicalBody: 'Marked chips hidden in\nventilation grate.', witnessBody: 'Dealer in purple vest\nentered the cage twice.', witnessRows: ['Vera Knox', 'Red gown', 'Ivan Cole', 'Purple vest', 'Maya Singh', 'Black uniform', 'Troy Banks', 'Purple vest'], forensicBody: 'Chip marks match dealer station.', cctvBody: 'Ivan accessed the cage\nat 3:05 AM.', cctvExit: 'Exited through staff tunnel', motiveBody: 'Dante discovered Ivan running\na side table skimming players.', endingNarrative: 'Ivan Cole skimmed high-roller tables for months. Moreno reviewed the variance reports. Ivan looped the camera feed and struck when the pit was empty.', evidenceSummary: ['Chip Evidence', 'Vest Witness', 'Cage Footage', 'Skimming Motive'], suspects: [{ name: 'Vera Knox', role: 'Pit Boss', age: 39, relationship: 'Supervised tables.', motive: 'Bonus clawback.' }, { name: 'Ivan Cole', role: 'Head Dealer', age: 36, relationship: 'Ran VIP room.', motive: 'Skimming ring.' }, { name: 'Maya Singh', role: 'Compliance Officer', age: 42, relationship: 'Audited books.', motive: 'License risk.' }, { name: 'Troy Banks', role: 'High Roller', age: 55, relationship: 'Owes casino millions.', motive: 'Debt.' }] },
  { title: 'Hollow Creek', subtitle: 'A writer murdered in a remote cabin.', victim: 'Greta Bloom', location: 'Hollow Creek Cabin', timeOfDeath: '10:50 PM', synopsis: 'Bestselling author Greta Bloom was finishing her memoir when she was killed. A snowstorm trapped four guests on the property.', physicalTitle: 'Typewriter Key', physicalBody: 'Blood on the missing\nletter "E" key.', witnessBody: 'Boots with red laces crossed\nthe east porch.', witnessRows: ['Ethan Cole', 'Red laces', 'Hannah Price', 'Brown boots', 'Julian Marsh', 'Red laces', 'Kira Tan', 'Snow boots'], forensicBody: 'Lace pattern matches guest boots.', cctvBody: 'Julian on porch at 10:35 PM.', cctvExit: 'Returned through kitchen door', motiveBody: 'Greta planned to name Julian\nin a chapter on plagiarism.', endingNarrative: 'Julian Marsh ghostwrote chapters Greta claimed as her own. She threatened exposure before publication. During the storm blackout, he struck her at the typewriter.', evidenceSummary: ['Typewriter Evidence', 'Boot Witness', 'Porch Tracks', 'Plagiarism Motive'], suspects: [{ name: 'Ethan Cole', role: 'Editor', age: 40, relationship: 'Published her work.', motive: 'Advance dispute.' }, { name: 'Hannah Price', role: 'Agent', age: 45, relationship: 'Negotiated contracts.', motive: 'Royalties.' }, { name: 'Julian Marsh', role: 'Research Assistant', age: 26, relationship: 'Ghostwrote sections.', motive: 'Exposure.' }, { name: 'Kira Tan', role: 'Photographer', age: 32, relationship: 'Shot cover art.', motive: 'Unknown.' }] },
  { title: 'Neon Mirage', subtitle: 'A DJ silenced mid-set.', victim: 'Jax Rivera', location: 'Club Neon Mirage', timeOfDeath: '2:05 AM', synopsis: 'Headliner Jax Rivera collapsed in the booth during a sold-out set. The soundproof door was locked from outside.', physicalTitle: 'Mixer Residue', physicalBody: 'Chemical traces in his\nwater bottle.', witnessBody: 'Promoter in neon blazer\nbackstage before set.', witnessRows: ['Luna Park', 'Sequin dress', 'Dre Voss', 'Neon blazer', 'Mika Holt', 'Security black', 'Sable Reed', 'Neon blazer'], forensicBody: 'Bottle prints match promoter office.', cctvBody: 'Dre entered the booth\nat 1:48 AM.', cctvExit: 'Left before crowd noticed', motiveBody: 'Jax was switching labels;\nDre\'s kickbacks would end.', endingNarrative: 'Dre Voss took illegal booking fees from rival promoters. Jax announced a new agency deal on stage. Dre spiked his bottle before the drop.', evidenceSummary: ['Toxicology', 'Blazer Witness', 'Booth Footage', 'Kickback Motive'], suspects: [{ name: 'Luna Park', role: 'Rival DJ', age: 28, relationship: 'Shared billing.', motive: 'Headliner slot.' }, { name: 'Dre Voss', role: 'Promoter', age: 37, relationship: 'Booked the club.', motive: 'Kickback loss.' }, { name: 'Mika Holt', role: 'Security', age: 33, relationship: 'Guarded booth.', motive: 'Unknown.' }, { name: 'Sable Reed', role: 'Label Rep', age: 31, relationship: 'Negotiated contract.', motive: 'Deal collapse.' }] },
  { title: 'Ivory Ledger', subtitle: 'A banker dead in the vault corridor.', victim: 'Margaret Shaw', location: 'First National Bank', timeOfDeath: '6:30 PM', synopsis: 'Branch manager Margaret Shaw was killed after hours. The vault timed lock shows an override code was used.', physicalTitle: 'Override Log', physicalBody: 'Unauthorized override at\n6:12 PM on vault door.', witnessBody: 'Employee with teal badge\nstayed past closing.', witnessRows: ['Roger Pike', 'Teal badge', 'Sandra Li', 'Gold badge', 'Uma Patel', 'Teal badge', 'Wes Ford', 'Visitor pass'], forensicBody: 'Badge swipe matches loan desk.', cctvBody: 'Roger entered vault hall\nat 6:08 PM.', cctvExit: 'Exited via alley camera', motiveBody: 'Margaret reported Roger\'s\nphantom loan scheme.', endingNarrative: 'Roger Pike created fictitious borrowers to siphon fees. Shaw compiled SAR filings. He used his override, ambushed her in the corridor, and fled before the alarm latched.', evidenceSummary: ['Vault Log', 'Badge Witness', 'Hall Footage', 'Loan Fraud'], suspects: [{ name: 'Roger Pike', role: 'Loan Officer', age: 43, relationship: 'Managed portfolios.', motive: 'Phantom loans.' }, { name: 'Sandra Li', role: 'Teller Supervisor', age: 35, relationship: 'Closed the branch.', motive: 'Audit stress.' }, { name: 'Uma Patel', role: 'IT Admin', age: 29, relationship: 'Maintained systems.', motive: 'Access dispute.' }, { name: 'Wes Ford', role: 'Night Guard', age: 52, relationship: 'Patrolled floors.', motive: 'Unknown.' }] },
  { title: 'Thornwood Estate', subtitle: 'Patriarch murdered before the will reading.', victim: 'Harold Thornwood', location: 'Thornwood Manor', timeOfDeath: '8:00 PM', synopsis: 'Harold Thornwood was found in the library. The family had gathered for a reading that never happened.', physicalTitle: 'Fireplace Poker', physicalBody: 'Poker wiped clean but\nwood fibers remain.', witnessBody: 'Heir in green smoking jacket\nargued in the hall.', witnessRows: ['Claire Thornwood', 'Blue dress', 'Douglas Thornwood', 'Green smoking jacket', 'Evelyn Shaw', 'Pearls', 'Felix Grant', 'Green smoking jacket'], forensicBody: 'Fiber matches jacket lining.', cctvBody: 'Douglas left library\nat 7:44 PM.', cctvExit: 'Entered billiard room', motiveBody: 'Harold cut Douglas from\nthe majority stake.', endingNarrative: 'Douglas Thornwood gambled away his allowance for years. Harold\'s new will removed him entirely. Douglas confronted him in the library with the poker.', evidenceSummary: ['Weapon Trace', 'Jacket Witness', 'Manor Timeline', 'Inheritance Cut'], suspects: [{ name: 'Claire Thornwood', role: 'Daughter', age: 34, relationship: 'Heir apparent.', motive: 'Merger plans.' }, { name: 'Douglas Thornwood', role: 'Son', age: 38, relationship: 'Disinherited.', motive: 'Estate cut.' }, { name: 'Evelyn Shaw', role: 'Housekeeper', age: 58, relationship: '30 years service.', motive: 'Pension.' }, { name: 'Felix Grant', role: 'Lawyer', age: 50, relationship: 'Drafted the will.', motive: 'Unknown.' }] },
  { title: 'Blue Meridian', subtitle: 'Death on a private yacht at anchor.', victim: 'Captain Elias Ford', location: 'Yacht Blue Meridian', timeOfDeath: '4:15 AM', synopsis: 'Captain Ford was found on deck during a celebrity charter. The tender was the only way ashore.', physicalTitle: 'Railing Residue', physicalBody: 'Sedative on the starboard\nrail where he fell.', witnessBody: 'Crew in white polo seen\nnear the helm.', witnessRows: ['Ava Quinn', 'Red sundress', 'Benito Cruz', 'White polo', 'Cora Hale', 'Linen suit', 'Dmitri Volk', 'White polo'], forensicBody: 'Polo fiber on rail matches crew locker.', cctvBody: 'Benito at helm at 4:02 AM.', cctvExit: 'Lowered tender alone', motiveBody: 'Elias threatened to report\ncharter insurance fraud.', endingNarrative: 'Benito Cruz inflated insurance claims on every charter. Ford gathered manifests for the maritime board. Benito drugged him and staged a man-overboard.', evidenceSummary: ['Rail Evidence', 'Polo Witness', 'Deck Log', 'Insurance Fraud'], suspects: [{ name: 'Ava Quinn', role: 'Charter Guest', age: 30, relationship: 'Celebrity client.', motive: 'Privacy scandal.' }, { name: 'Benito Cruz', role: 'First Mate', age: 39, relationship: 'Ran deck ops.', motive: 'Insurance scam.' }, { name: 'Cora Hale', role: 'Chef', age: 36, relationship: 'Provisioned voyage.', motive: 'Tip dispute.' }, { name: 'Dmitri Volk', role: 'Engineer', age: 44, relationship: 'Maintained engines.', motive: 'Unknown.' }] },
  { title: 'Ashford Labs B-Wing', subtitle: 'Researcher killed behind sealed doors.', victim: 'Dr. Priya Nair', location: 'Ashford Labs B-Wing', timeOfDeath: '11:30 PM', synopsis: 'Dr. Nair was found in a bio-secure lab. Airlock logs show one badge stayed inside too long.', physicalTitle: 'Airlock Log', physicalBody: 'Extended cycle on B-Wing\nairlock at 11:12 PM.', witnessBody: 'Researcher in orange clean suit\nentered with her.', witnessRows: ['Leo Marsh', 'Orange clean suit', 'Nina Ortiz', 'Blue scrubs', 'Omar Tate', 'Orange clean suit', 'Paula Chen', 'White coat'], forensicBody: 'Suit patch matches B-Wing kit.', cctvBody: 'Omar re-entered airlock\nat 11:18 PM.', cctvExit: 'Decontaminated twice', motiveBody: 'Priya was falsifying trial data\nfor Omar\'s blockbuster drug.', endingNarrative: 'Omar Tate rushed clinical trials with fabricated results. Dr. Nair scheduled an FDA call. Omar trapped her during an airlock cycle and vented sedative gas.', evidenceSummary: ['Airlock Data', 'Suit Witness', 'Lab Footage', 'Trial Fraud'], suspects: [{ name: 'Leo Marsh', role: 'Lab Tech', age: 28, relationship: 'Assisted experiments.', motive: 'Authorship.' }, { name: 'Nina Ortiz', role: 'Ethics Officer', age: 41, relationship: 'Reviewed protocols.', motive: 'Whistleblower risk.' }, { name: 'Omar Tate', role: 'Lead Scientist', age: 46, relationship: 'Ran B-Wing.', motive: 'Trial fraud.' }, { name: 'Paula Chen', role: 'Investor', age: 52, relationship: 'Funded trials.', motive: 'IPO timeline.' }] },
  { title: 'Crimson Oath', subtitle: 'A monk found dead in the scriptorium.', victim: 'Brother Thomas', location: 'Crimson Oath Monastery', timeOfDeath: '5:00 AM', synopsis: 'Brother Thomas was murdered before morning prayers. Only four brothers had keys to the scriptorium.', physicalTitle: 'Illuminated Page', physicalBody: 'Poison on the gold leaf\nof a manuscript.', witnessBody: 'Brother in brown habit\nlit candles early.', witnessRows: ['Brother Mark', 'Brown habit', 'Brother Paul', 'Black habit', 'Sister Elena', 'Grey veil', 'Brother Hugh', 'Brown habit'], forensicBody: 'Habit fiber on lectern.', cctvBody: 'Hugh alone in scriptorium\nat 4:40 AM.', cctvExit: 'Joined bell tower', motiveBody: 'Thomas discovered Hugh selling\nartifacts from the archive.', endingNarrative: 'Hugh sold illuminated pages to collectors for years. Brother Thomas found shipping crates. Hugh poisoned the gold leaf Thomas restored each dawn.', evidenceSummary: ['Manuscript Poison', 'Habit Witness', 'Scriptorium Log', 'Theft Motive'], suspects: [{ name: 'Brother Mark', role: 'Librarian', age: 55, relationship: 'Catalogued texts.', motive: 'Budget cuts.' }, { name: 'Brother Paul', role: 'Abbot', age: 62, relationship: 'Led the order.', motive: 'Succession.' }, { name: 'Sister Elena', role: 'Archivist', age: 48, relationship: 'Preserved relics.', motive: 'Unknown.' }, { name: 'Brother Hugh', role: 'Illuminator', age: 50, relationship: 'Restored manuscripts.', motive: 'Artifact theft.' }] },
  { title: 'Desert Signal', subtitle: 'Radio host silenced mid-broadcast.', victim: 'Cassie Rowe', location: 'Desert Signal Station', timeOfDeath: '9:10 PM', synopsis: 'Cassie Rowe was killed during her live show. The station was isolated — transmitter logs tell the story.', physicalTitle: 'Microphone Pin', physicalBody: 'Sedative on broadcast\nmicrophone foam.', witnessBody: 'Engineer in yellow headphones\nadjusted levels.', witnessRows: ['Dale Cross', 'Yellow headphones', 'Eva Mint', 'Red scarf', 'Finn Boyd', 'Yellow headphones', 'Gia Park', 'Denim jacket'], forensicBody: 'Foam treatment matches engineering bench.', cctvBody: 'Finn at the board at 8:58 PM.', cctvExit: 'Cut to dead air', motiveBody: 'Cassie was exposing payola\nFinn arranged with labels.', endingNarrative: 'Finn Boyd sold playlist slots to indie labels. Cassie recorded the bribes on air. Finn spiked her mic during the commercial break.', evidenceSummary: ['Mic Analysis', 'Headphone Witness', 'Broadcast Log', 'Payola Motive'], suspects: [{ name: 'Dale Cross', role: 'Producer', age: 37, relationship: 'Booked guests.', motive: 'Ratings.' }, { name: 'Eva Mint', role: 'Intern', age: 22, relationship: 'Ran social media.', motive: 'Contract.' }, { name: 'Finn Boyd', role: 'Engineer', age: 40, relationship: 'Controlled broadcast.', motive: 'Payola.' }, { name: 'Gia Park', role: 'Sponsor Rep', age: 35, relationship: 'Bought ad time.', motive: 'Exposure.' }] },
  { title: 'Glass Orchard', subtitle: 'Botanist dead in the greenhouse dome.', victim: 'Dr. Lena Frost', location: 'Glass Orchard Greenhouse', timeOfDeath: '3:45 PM', synopsis: 'Dr. Frost was found among experimental orchids. Humidity seals trapped four staff inside the dome.', physicalTitle: 'Pollen Trace', physicalBody: 'Toxic pollen on her\nrespirator filter.', witnessBody: 'Gardener in khaki apron\nadjusted vents.', witnessRows: ['Hugo Bell', 'Khaki apron', 'Iris Cole', 'Green gloves', 'Jade Wu', 'Khaki apron', 'Karl Penn', 'Rubber boots'], forensicBody: 'Apron matches vent tool marks.', cctvBody: 'Hugo at vent panel 3:28 PM.', cctvExit: 'Returned to orchid row', motiveBody: 'Lena planned to report Hugo\'s\nsale of patented strains.', endingNarrative: 'Hugo Bell smuggled hybrid seeds to rival firms. Dr. Frost tagged every plant with DNA markers. He released toxic pollen during a humidity cycle.', evidenceSummary: ['Pollen Evidence', 'Apron Witness', 'Dome Footage', 'Patent Theft'], suspects: [{ name: 'Hugo Bell', role: 'Head Gardener', age: 44, relationship: 'Maintained strains.', motive: 'Seed smuggling.' }, { name: 'Iris Cole', role: 'Geneticist', age: 33, relationship: 'Edited genomes.', motive: 'Paper dispute.' }, { name: 'Jade Wu', role: 'Intern', age: 24, relationship: 'Logged growth data.', motive: 'Unknown.' }, { name: 'Karl Penn', role: 'Investor', age: 58, relationship: 'Funded research.', motive: 'ROI pressure.' }] },
  { title: 'Iron Mask Ball', subtitle: 'Masquerade murder at the manor.', victim: 'Lord Ashford', location: 'Iron Mask Manor', timeOfDeath: '12:05 AM', synopsis: 'At the stroke of midnight, Lord Ashford fell on the ballroom floor. Every guest wore identical iron masks.', physicalTitle: 'Mask Velvet', physicalBody: 'Sedative lining inside\none iron mask.', witnessBody: 'Guest in silver gloves\ndanced last with him.', witnessRows: ['Lady Vera', 'Gold gloves', 'Miles Drake', 'Silver gloves', 'Nora Blake', 'Pearl mask', 'Oscar Finch', 'Silver gloves'], forensicBody: 'Glove fiber on mask strap.', cctvBody: 'Miles led Ashford to terrace\nat 11:50 PM.', cctvExit: 'Returned mask to hall', motiveBody: 'Ashford discovered Miles forged\nartworks in the family gallery.', endingNarrative: 'Miles Drake replaced originals with forgeries for a decade. Ashford scheduled an appraisal before the ball. Miles drugged his mask during the waltz.', evidenceSummary: ['Mask Analysis', 'Glove Witness', 'Ball Timeline', 'Forgery Motive'], suspects: [{ name: 'Lady Vera', role: 'Widow', age: 46, relationship: 'Spouse.', motive: 'Estate.' }, { name: 'Miles Drake', role: 'Curator', age: 42, relationship: 'Ran gallery.', motive: 'Forgery.' }, { name: 'Nora Blake', role: 'Heiress', age: 29, relationship: 'Cousin.', motive: 'Debt.' }, { name: 'Oscar Finch', role: 'Auctioneer', age: 51, relationship: 'Sold collection.', motive: 'Unknown.' }] },
  { title: 'Pale Comet', subtitle: 'Planetarium director dies before launch.', victim: 'Dr. Sam Klein', location: 'Pale Comet Planetarium', timeOfDeath: '8:20 PM', synopsis: 'Dr. Klein was killed before a comet livestream. The projection dome was locked for calibration.', physicalTitle: 'Projector Lens', physicalBody: 'Lens oil contains sedative\ncompound.', witnessBody: 'Tech in grey coveralls\ncalibrated early.', witnessRows: ['Tara Bloom', 'Blue blazer', 'Ulysses Grant', 'Grey coveralls', 'Vera Moon', 'Red scarf', 'Wade Park', 'Grey coveralls'], forensicBody: 'Oil matches maintenance kit.', cctvBody: 'Wade at projector at 8:05 PM.', cctvExit: 'Started stream late', motiveBody: 'Sam was reporting Wade\'s\nfake ticket revenue.', endingNarrative: 'Wade Park skimmed ticket sales for years. Klein audited the POS data before the comet event. Wade poisoned the lens cooling oil.', evidenceSummary: ['Lens Toxicology', 'Coveralls Witness', 'Dome Log', 'Revenue Fraud'], suspects: [{ name: 'Tara Bloom', role: 'Educator', age: 31, relationship: 'Hosted shows.', motive: 'Program cuts.' }, { name: 'Ulysses Grant', role: 'Board Chair', age: 57, relationship: 'Oversaw budget.', motive: 'Donations.' }, { name: 'Vera Moon', role: 'Sponsor', age: 44, relationship: 'Funded dome.', motive: 'Naming rights.' }, { name: 'Wade Park', role: 'Projection Tech', age: 38, relationship: 'Ran equipment.', motive: 'Ticket skim.' }] },
  { title: 'Last Lighthouse', subtitle: 'Keeper murdered during a coastal storm.', victim: 'Henry Blake', location: 'Last Lighthouse Station', timeOfDeath: '1:35 AM', synopsis: 'Keeper Blake was found at the lamp room. Storm knocked out power — lantern logs still recorded movement.', physicalTitle: 'Lantern Oil', physicalBody: 'Adulterated oil in the\nmain lamp reservoir.', witnessBody: 'Relief keeper in yellow slicker\nclimbed the stairs.', witnessRows: ['Ivy Marsh', 'Blue slicker', 'Jack Doyle', 'Yellow slicker', 'Kate Finn', 'Black coat', 'Liam Ortiz', 'Yellow slicker'], forensicBody: 'Slicker matches supply shed.', cctvBody: 'Jack at lamp room 1:18 AM.', cctvExit: 'Descended before gale peak', motiveBody: 'Henry caught Jack selling\nfuel rations on the black market.', endingNarrative: 'Jack Doyle diverted kerosene shipments for profit. Blake inventory-checked before the storm. Jack adulterated the lamp oil, knowing the fumes would incapacitate him on the stairs.', evidenceSummary: ['Oil Analysis', 'Slicker Witness', 'Lamp Log', 'Ration Theft'], suspects: [{ name: 'Ivy Marsh', role: 'Coast Guard', age: 34, relationship: 'Patrolled waters.', motive: 'Citation dispute.' }, { name: 'Jack Doyle', role: 'Relief Keeper', age: 41, relationship: 'Covered shifts.', motive: 'Fuel theft.' }, { name: 'Kate Finn', role: 'Supply Clerk', age: 29, relationship: 'Stocked station.', motive: 'Unknown.' }, { name: 'Liam Ortiz', role: 'Fisherman', age: 47, relationship: 'Used lamp signals.', motive: 'Harbor fees.' }] },
  { title: 'Black Tulip', subtitle: 'Florist poisoned before wedding season.', victim: 'Rose Delaney', location: 'Black Tulip Florist', timeOfDeath: '6:50 PM', synopsis: 'Rose Delaney collapsed in her shop. Wedding orders filled the cooler — and someone tampered with her tools.', physicalTitle: 'Pruning Shears', physicalBody: 'Toxin on shear handles\nshe used daily.', witnessBody: 'Assistant in pink apron\nclosed the shop.', witnessRows: ['Mia Grant', 'Pink apron', 'Noah Pike', 'Green apron', 'Olivia Tan', 'Yellow scarf', 'Paula Reed', 'Pink apron'], forensicBody: 'Residue matches cold room.', cctvBody: 'Mia wiped shears at 6:38 PM.', cctvExit: 'Left with deposit bag', motiveBody: 'Rose learned Mia diverted wedding\ndeposits to a side business.', endingNarrative: 'Mia Grant double-booked weddings and pocketed deposits. Rose confronted her before the spring rush. Mia poisoned the shears Rose always grabbed first.', evidenceSummary: ['Shear Poison', 'Apron Witness', 'Shop Footage', 'Deposit Fraud'], suspects: [{ name: 'Mia Grant', role: 'Assistant', age: 27, relationship: 'Managed orders.', motive: 'Deposit theft.' }, { name: 'Noah Pike', role: 'Delivery Driver', age: 32, relationship: 'Ran routes.', motive: 'Tips.' }, { name: 'Olivia Tan', role: 'Wedding Planner', age: 38, relationship: 'Sent clients.', motive: 'Commission.' }, { name: 'Paula Reed', role: 'Supplier', age: 45, relationship: 'Sold stems.', motive: 'Unknown.' }] },
  { title: 'Final Witness', subtitle: 'Archivist murdered before trial archive opens.', victim: 'Archivist James Cole', location: 'City Court Archive', timeOfDeath: '10:10 PM', synopsis: 'James Cole was killed the night before sealed records went public. Four people had clearance for the vault.', physicalTitle: 'Seal Wax', physicalBody: 'Broken seal on a box\nmarked CLASSIFIED.', witnessBody: 'Clerk in navy blazer\nsigned out late.', witnessRows: ['Alice Ford', 'Navy blazer', 'Brian Marsh', 'Grey cardigan', 'Cara Wu', 'Red badge', 'Derek Hale', 'Navy blazer'], forensicBody: 'Wax matches Derek\'s desk stamp.', cctvBody: 'Derek entered vault 9:52 PM.', cctvExit: 'Carried document tube', motiveBody: 'James was publishing records\nimplicating Derek in old bribes.', endingNarrative: 'Derek Hale buried bribery evidence decades ago as a junior clerk. Cole digitized the full archive. Derek broke the seal, silenced the archivist, and tried to burn the server — but backups survived.', evidenceSummary: ['Seal Evidence', 'Blazer Witness', 'Vault Access', 'Bribery Archive'], suspects: [{ name: 'Alice Ford', role: 'Deputy Clerk', age: 36, relationship: 'Filed cases.', motive: 'Promotion.' }, { name: 'Brian Marsh', role: 'Judge Emeritus', age: 68, relationship: 'Donated papers.', motive: 'Reputation.' }, { name: 'Cara Wu', role: 'Reporter', age: 33, relationship: 'Requested files.', motive: 'Story.' }, { name: 'Derek Hale', role: 'Senior Clerk', age: 55, relationship: 'Managed vault.', motive: 'Buried crimes.' }] },
];

function difficultyFor(n: number): CaseDifficultyLabel {
  if (n <= 6) return 'Beginner';
  if (n <= 14) return 'Intermediate';
  if (n <= 20) return 'Advanced';
  return 'Expert';
}

function minutesFor(n: number): string {
  const lo = 5 + Math.floor(n / 3);
  const hi = lo + 3;
  return `${lo}–${hi}`;
}

/** Blueprints for cases #6–25 built from theme table. */
export function getExtendedBlueprints(): CaseBlueprint[] {
  return THEMES.map((t, i) => {
    const number = i + 6;
    const culpritIndex = (number % 4) as 0 | 1 | 2 | 3;
    const witnessClears: [number, number] = [
      (culpritIndex + 1) % 4,
      (culpritIndex + 3) % 4,
    ];
    return {
      number,
      ...t,
      difficulty: difficultyFor(number),
      estimatedMinutes: minutesFor(number),
      culpritIndex,
      witnessClears,
    };
  });
}

export const ALL_BLUEPRINTS: CaseBlueprint[] = [...CASE_BLUEPRINTS, ...getExtendedBlueprints()];

export function accentFor(index: number): string {
  return ACCENTS[index % ACCENTS.length];
}
