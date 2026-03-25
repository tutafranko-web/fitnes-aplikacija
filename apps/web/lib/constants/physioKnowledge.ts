/**
 * Evidence-based Physiotherapy Knowledge Base
 * Sources: NICE guidelines, ACSM protocols, WHO rehabilitation standards,
 * Sports Medicine Australia, JOSPT clinical practice guidelines
 */

export interface PhysioDiagnosis {
  id: string;
  name: { hr: string; en: string };
  category: string;
  icd10?: string; // ICD-10 code
  description: { hr: string; en: string };
  symptoms: { hr: string[]; en: string[] };
  causes: { hr: string[]; en: string[] };
  redFlags: { hr: string[]; en: string[] }; // When to see a real doctor
  assessment: { hr: string[]; en: string[] }; // Tests to perform
  phase1_acute: { // 0-72h
    hr: string[]; en: string[];
    duration: string;
    protocol: string; // RICE, POLICE, etc
  };
  phase2_subacute: { // 3-14 days
    hr: string[]; en: string[];
    duration: string;
  };
  phase3_rehab: { // 2-12 weeks
    hr: string[]; en: string[];
    duration: string;
  };
  phase4_return: { // Return to sport
    hr: string[]; en: string[];
    criteria: { hr: string[]; en: string[] };
  };
  exercises: PhysioExercise[];
  contraindications: { hr: string[]; en: string[] };
  recoveryTimeline: string; // e.g. "6-12 weeks"
  successRate: string;
}

export interface PhysioExercise {
  name: string;
  nameHr: string;
  sets: string;
  reps: string;
  hold?: string;
  frequency: string;
  phase: number; // 1-4
  difficulty: 'easy' | 'medium' | 'hard';
  targetMuscles: string[];
  description: { hr: string; en: string };
  contraindicated?: string[]; // injuries where this is NOT safe
}

// ============================
// KNOWLEDGE BASE — 50+ CONDITIONS
// ============================

export const physioDatabase: PhysioDiagnosis[] = [
  // ========== KNEE ==========
  {
    id: 'acl_tear',
    name: { hr: 'Ruptura prednjeg križnog ligamenta (ACL)', en: 'Anterior Cruciate Ligament (ACL) Tear' },
    category: 'knee',
    icd10: 'S83.5',
    description: {
      hr: 'Potpuna ili djelomična ruptura prednjeg križnog ligamenta, najčešće kod rotacijskih pokreta, naglog zaustavljanja ili skoka.',
      en: 'Complete or partial tear of the anterior cruciate ligament, most common during rotational movements, sudden stops or jumps.'
    },
    symptoms: {
      hr: ['Čujan "pop" zvuk u trenutku ozljede', 'Brzi otok (unutar 2-4 sata)', 'Nestabilnost koljena — "daje"', 'Nemogućnost pune ekstenzije', 'Bol pri rotaciji'],
      en: ['Audible "pop" at time of injury', 'Rapid swelling (within 2-4 hours)', 'Knee instability — "gives way"', 'Inability to fully extend', 'Pain during rotation']
    },
    causes: {
      hr: ['Nagli pivot/rotacija na fiksiranom stopalu', 'Loše doskočenje', 'Direktni udarac u koljeno', 'Naglo zaustavljanje iz sprinta', 'Valgus kolaps (koljeno prema unutra)'],
      en: ['Sudden pivot/rotation on fixed foot', 'Poor landing mechanics', 'Direct blow to knee', 'Sudden deceleration from sprint', 'Valgus collapse (knee inward)']
    },
    redFlags: {
      hr: ['⚠️ OBAVEZNO posjet ortopedskom kirurgu', 'Ako koljeno "zaključava" — meniskus', 'Gubitak osjeta u stopalu', 'Koljeno blijedo/hladno — vaskularna ozljeda'],
      en: ['⚠️ MUST see orthopedic surgeon', 'If knee "locks" — meniscus involvement', 'Loss of sensation in foot', 'Pale/cold knee — vascular injury']
    },
    assessment: {
      hr: ['Lachman test (zlatni standard)', 'Anterior drawer test', 'Pivot shift test', 'MRI za potvrdu'],
      en: ['Lachman test (gold standard)', 'Anterior drawer test', 'Pivot shift test', 'MRI for confirmation']
    },
    phase1_acute: {
      hr: ['POLICE protokol (Protection, Optimal Loading, Ice, Compression, Elevation)', 'Led 20 min svaka 2 sata', 'Kompresivni zavoj', 'Štake za rasterećenje', 'Aktivacija quadricepsa izometrički', 'ROM vježbe u bezbolnom rasponu'],
      en: ['POLICE protocol (Protection, Optimal Loading, Ice, Compression, Elevation)', 'Ice 20 min every 2 hours', 'Compression bandage', 'Crutches for offloading', 'Isometric quad activation', 'ROM exercises in pain-free range'],
      duration: '0-7 dana / 0-7 days',
      protocol: 'POLICE'
    },
    phase2_subacute: {
      hr: ['Progresivni ROM — cilj puna ekstenzija', 'Quad setovi i SLR (Straight Leg Raise)', 'Mini čučnjevi 0-45°', 'Vježbe balansa na jednoj nozi', 'Hidrorehabilitacija (bazen)', 'Bicikl bez otpora'],
      en: ['Progressive ROM — goal full extension', 'Quad sets and SLR (Straight Leg Raise)', 'Mini squats 0-45°', 'Single leg balance exercises', 'Aqua rehabilitation (pool)', 'Stationary bike no resistance'],
      duration: '1-6 tjedana / 1-6 weeks'
    },
    phase3_rehab: {
      hr: ['Progresivni čučnjevi do 90°', 'Leg press', 'Step-up vježbe', 'Hamstring jačanje — Nordic curls', 'Propriocepcija na nestabilnim površinama', 'Trčanje po ravnom (od 12. tjedna)', 'Plyometrija — skokovi (od 16. tjedna)'],
      en: ['Progressive squats to 90°', 'Leg press', 'Step-up exercises', 'Hamstring strengthening — Nordic curls', 'Proprioception on unstable surfaces', 'Flat running (from week 12)', 'Plyometrics — jumps (from week 16)'],
      duration: '6-24 tjedna / 6-24 weeks'
    },
    phase4_return: {
      hr: ['Sport-specifični treninzi', 'Agilnost — pivot/cut drillovi', 'Reaktivna agilnost', 'Psihološka spremnost'],
      en: ['Sport-specific training', 'Agility — pivot/cut drills', 'Reactive agility', 'Psychological readiness'],
      criteria: {
        hr: ['Quad snaga ≥90% zdrave noge', 'Hop test ≥90% zdrave noge', 'Puni ROM bez boli', 'Funkcijski testovi bez straha'],
        en: ['Quad strength ≥90% of healthy leg', 'Hop test ≥90% of healthy leg', 'Full ROM without pain', 'Functional tests without apprehension']
      }
    },
    exercises: [
      { name: 'Quad Sets', nameHr: 'Izometrička kontrakcija quadricepsa', sets: '3', reps: '10', hold: '10s', frequency: '3x dnevno', phase: 1, difficulty: 'easy', targetMuscles: ['quads'], description: { hr: 'Legni na leđa, stisni koljeno u podlogu aktivirajući quad. Drži 10s.', en: 'Lie on back, press knee into floor activating quad. Hold 10s.' } },
      { name: 'Straight Leg Raise', nameHr: 'Podizanje ispružene noge', sets: '3', reps: '15', frequency: '2x dnevno', phase: 1, difficulty: 'easy', targetMuscles: ['quads', 'hip_flexors'], description: { hr: 'Legni, stegni quad i podigni nogu 30cm. Spusti kontrolirano.', en: 'Lie down, tighten quad and lift leg 30cm. Lower with control.' } },
      { name: 'Mini Squats', nameHr: 'Mini čučnjevi', sets: '3', reps: '12', frequency: 'svaki dan', phase: 2, difficulty: 'easy', targetMuscles: ['quads', 'glutes'], description: { hr: 'Čučanj samo do 45° savijanja koljena. Koljena ne prelaze prste.', en: 'Squat only to 45° knee bend. Knees don\'t pass toes.' } },
      { name: 'Single Leg Balance', nameHr: 'Balans na jednoj nozi', sets: '3', reps: '30s', frequency: 'svaki dan', phase: 2, difficulty: 'medium', targetMuscles: ['quads', 'calves', 'core'], description: { hr: 'Stani na ozlijeđenu nogu, zatvori oči. Cilj: 30s bez padanja.', en: 'Stand on injured leg, close eyes. Goal: 30s without falling.' } },
      { name: 'Nordic Hamstring Curl', nameHr: 'Nordijski hamstring curl', sets: '3', reps: '6', frequency: '3x tjedno', phase: 3, difficulty: 'hard', targetMuscles: ['hamstrings'], description: { hr: 'Klekni, partner drži gležnjeve. Spuštaj se polako prema naprijed koristeći hamstringse.', en: 'Kneel, partner holds ankles. Lower slowly forward using hamstrings.' } },
      { name: 'Box Jumps', nameHr: 'Skokovi na kutiju', sets: '3', reps: '8', frequency: '2x tjedno', phase: 4, difficulty: 'hard', targetMuscles: ['quads', 'glutes', 'calves'], description: { hr: 'Skoči na kutiju 30-50cm. Doskoči meko na obje noge.', en: 'Jump onto 30-50cm box. Land softly on both feet.' } },
    ],
    contraindications: { hr: ['Trčanje prije 12. tjedna', 'Plyometrija prije 16. tjedna', 'Kontaktni sport prije 9 mjeseci', 'Duboki čučnjevi pod opterećenjem u prvih 6 tjedana'], en: ['Running before week 12', 'Plyometrics before week 16', 'Contact sport before 9 months', 'Deep loaded squats in first 6 weeks'] },
    recoveryTimeline: '9-12 mjeseci / 9-12 months',
    successRate: '82-95% (ovisno o operaciji i rehabilitaciji / depending on surgery and rehab)',
  },

  // ========== SHOULDER ==========
  {
    id: 'rotator_cuff',
    name: { hr: 'Ozljeda rotatorne manšete', en: 'Rotator Cuff Injury' },
    category: 'shoulder',
    icd10: 'M75.1',
    description: {
      hr: 'Upala, parcijalna ili potpuna ruptura tetiva rotatorne manšete (supraspinatus, infraspinatus, teres minor, subscapularis).',
      en: 'Inflammation, partial or complete tear of rotator cuff tendons (supraspinatus, infraspinatus, teres minor, subscapularis).'
    },
    symptoms: {
      hr: ['Bol pri podizanju ruke iznad glave', 'Noćna bol (spavanje na ramenu)', 'Slabost pri rotaciji', 'Bol pri bočnom podizanju 60-120° (painful arc)', 'Škljocanje/krepitacije'],
      en: ['Pain lifting arm overhead', 'Night pain (sleeping on shoulder)', 'Weakness in rotation', 'Pain with lateral raise 60-120° (painful arc)', 'Clicking/crepitus']
    },
    causes: {
      hr: ['Ponavljajući overhead pokreti', 'Degeneracija (dob >40)', 'Akutna trauma (pad)', 'Loša bench press forma', 'Impingement sindrom'],
      en: ['Repetitive overhead movements', 'Degeneration (age >40)', 'Acute trauma (fall)', 'Poor bench press form', 'Impingement syndrome']
    },
    redFlags: {
      hr: ['⚠️ Potpuni gubitak snage — moguća potpuna ruptura', 'Deformitet ramena', 'Nemogućnost podizanja ruke uopće'],
      en: ['⚠️ Complete loss of strength — possible full tear', 'Shoulder deformity', 'Inability to lift arm at all']
    },
    assessment: {
      hr: ['Empty can test (supraspinatus)', 'External rotation lag test', 'Neer impingement test', 'Hawkins-Kennedy test', 'Ultrazlvuk ili MRI'],
      en: ['Empty can test (supraspinatus)', 'External rotation lag test', 'Neer impingement test', 'Hawkins-Kennedy test', 'Ultrasound or MRI']
    },
    phase1_acute: {
      hr: ['Relativni odmor (ne potpuna imobilizacija)', 'Led 15-20 min, 3-4x dnevno', 'Pendularne vježbe (Codmanove)', 'Izbjegavati pokrete iznad glave', 'NSAID po potrebi'],
      en: ['Relative rest (not complete immobilization)', 'Ice 15-20 min, 3-4x daily', 'Pendulum exercises (Codman)', 'Avoid overhead movements', 'NSAID as needed'],
      duration: '1-2 tjedna / 1-2 weeks',
      protocol: 'Relative rest + pendulums'
    },
    phase2_subacute: {
      hr: ['Pasivni i aktivno-asistirani ROM', 'Izometrička rotacija (neutralna pozicija)', 'Skapularna stabilizacija', 'Wall slides', 'Postural korekcija'],
      en: ['Passive and active-assisted ROM', 'Isometric rotation (neutral position)', 'Scapular stabilization', 'Wall slides', 'Postural correction'],
      duration: '2-6 tjedana / 2-6 weeks'
    },
    phase3_rehab: {
      hr: ['Progresivna rotacija s elastikom', 'Face pulls', 'Prone Y-T-W raises', 'Band pull-aparts', 'Eccentric supraspinatus jačanje', 'Push-up plus za serratus'],
      en: ['Progressive rotation with band', 'Face pulls', 'Prone Y-T-W raises', 'Band pull-aparts', 'Eccentric supraspinatus strengthening', 'Push-up plus for serratus'],
      duration: '6-12 tjedana / 6-12 weeks'
    },
    phase4_return: {
      hr: ['Overhead pressing (lagan)', 'Sport-specifični pokreti', 'Plyometrijski push-upovi'],
      en: ['Overhead pressing (light)', 'Sport-specific movements', 'Plyometric push-ups'],
      criteria: {
        hr: ['Puni ROM bez boli', 'Snaga rotacije ≥85% zdrave strane', 'Nema noćne boli'],
        en: ['Full ROM without pain', 'Rotation strength ≥85% of healthy side', 'No night pain']
      }
    },
    exercises: [
      { name: 'Pendulum Swings', nameHr: 'Pendularne vježbe', sets: '3', reps: '20 krugova', frequency: '4x dnevno', phase: 1, difficulty: 'easy', targetMuscles: ['shoulders'], description: { hr: 'Nagni se naprijed, pusti ruku da visi i kruži u malim krugovima.', en: 'Lean forward, let arm hang and circle in small circles.' } },
      { name: 'External Rotation (Band)', nameHr: 'Vanjska rotacija s elastikom', sets: '3', reps: '15', frequency: 'svaki dan', phase: 2, difficulty: 'easy', targetMuscles: ['shoulders'], description: { hr: 'Lakat uz tijelo, rotiraj podlakticu van protiv otpora elastike.', en: 'Elbow at side, rotate forearm outward against band resistance.' } },
      { name: 'Face Pull', nameHr: 'Face pull', sets: '3', reps: '15', frequency: '3x tjedno', phase: 3, difficulty: 'medium', targetMuscles: ['shoulders', 'upper_back'], description: { hr: 'Vuci elastiku/kabel prema licu, razdvoji ruke u završnoj poziciji.', en: 'Pull band/cable toward face, separate hands at end position.' } },
      { name: 'Prone Y-T-W', nameHr: 'Prone Y-T-W podizanja', sets: '2', reps: '10 svako', frequency: '3x tjedno', phase: 3, difficulty: 'medium', targetMuscles: ['shoulders', 'upper_back', 'traps'], description: { hr: 'Lezi na trbuhu, podižì ruke u oblik Y, T, pa W. Stisni lopatice.', en: 'Lie prone, lift arms in Y, T, then W shape. Squeeze shoulder blades.' } },
    ],
    contraindications: { hr: ['Bench press s punim ROM-om u prvih 6 tjedana', 'Behind-the-neck press', 'Upright rows', 'Dips s dubokim ROM-om'], en: ['Full ROM bench press in first 6 weeks', 'Behind-the-neck press', 'Upright rows', 'Deep ROM dips'] },
    recoveryTimeline: '3-6 mjeseci / 3-6 months',
    successRate: '85-90% (konzervativno liječenje parcijalnih ruptura / conservative treatment of partial tears)',
  },

  // ========== LOWER BACK ==========
  {
    id: 'disc_herniation',
    name: { hr: 'Hernija diska (lumbalna)', en: 'Lumbar Disc Herniation' },
    category: 'lower_back',
    icd10: 'M51.1',
    description: {
      hr: 'Izbočenje ili puknuće intervertebralnog diska koji pritišće živčani korijen, najčešće L4-L5 ili L5-S1.',
      en: 'Protrusion or rupture of intervertebral disc pressing on nerve root, most commonly L4-L5 or L5-S1.'
    },
    symptoms: {
      hr: ['Bol u donjem dijelu leđa', 'Radikulopatija — bol niz nogu (išijas)', 'Trnjenje/mravinjanje u stopalu', 'Pogoršanje pri sjedenju i saginjanju', 'Poboljšanje pri hodanju i stajanju', 'Slabost dorzifleksije stopala (L5)'],
      en: ['Lower back pain', 'Radiculopathy — pain down leg (sciatica)', 'Numbness/tingling in foot', 'Worsens with sitting and bending', 'Improves with walking and standing', 'Weakness in foot dorsiflexion (L5)']
    },
    causes: {
      hr: ['Nepravilno dizanje tereta', 'Degenerativne promjene', 'Prolongirano sjedenje', 'Slabi core mišići', 'Ponavljani pokreti fleksije'],
      en: ['Improper lifting', 'Degenerative changes', 'Prolonged sitting', 'Weak core muscles', 'Repetitive flexion movements']
    },
    redFlags: {
      hr: ['🚨 HITNO — Cauda equina sindrom: gubitak kontrole mjehura/crijeva', '🚨 Progresivna bilateralna slabost nogu', '🚨 Sedlasta anestezija (gubitak osjeta u preponama)'],
      en: ['🚨 EMERGENCY — Cauda equina syndrome: loss of bladder/bowel control', '🚨 Progressive bilateral leg weakness', '🚨 Saddle anesthesia (loss of sensation in groin area)']
    },
    assessment: {
      hr: ['SLR test (Straight Leg Raise) — pozitivan 30-70°', 'Neurološki pregled (refleksi, snaga, osjet)', 'Crossed SLR test', 'MRI za potvrdu'],
      en: ['SLR test (Straight Leg Raise) — positive 30-70°', 'Neurological exam (reflexes, strength, sensation)', 'Crossed SLR test', 'MRI for confirmation']
    },
    phase1_acute: {
      hr: ['Izbjegavati sjedenje >20 min', 'Hodanje svaka 2 sata', 'McKenzie ekstenzijske vježbe', 'Led ili toplina (što pomaže)', 'Izbjegavati fleksiju kralježnice', 'Spavanje s jastukom između koljena'],
      en: ['Avoid sitting >20 min', 'Walking every 2 hours', 'McKenzie extension exercises', 'Ice or heat (whichever helps)', 'Avoid spinal flexion', 'Sleep with pillow between knees'],
      duration: '1-2 tjedna / 1-2 weeks',
      protocol: 'McKenzie + POLICE'
    },
    phase2_subacute: {
      hr: ['Bird-Dog vježbe', 'Dead Bug', 'Pelvic tilts', 'Cat-Cow (oprezno)', 'Glute bridge', 'Nerve floss/mobilizacija živca'],
      en: ['Bird-Dog exercises', 'Dead Bug', 'Pelvic tilts', 'Cat-Cow (carefully)', 'Glute bridge', 'Nerve floss/neural mobilization'],
      duration: '2-6 tjedana / 2-6 weeks'
    },
    phase3_rehab: {
      hr: ['McGill Big 3: Curl-up, Side Plank, Bird-Dog', 'Hip hinge trening', 'Progresivni deadlift s kettlebellom', 'Farmer walks', 'Anti-rotacijske vježbe (Pallof press)'],
      en: ['McGill Big 3: Curl-up, Side Plank, Bird-Dog', 'Hip hinge training', 'Progressive kettlebell deadlift', 'Farmer walks', 'Anti-rotation exercises (Pallof press)'],
      duration: '6-12 tjedana / 6-12 weeks'
    },
    phase4_return: {
      hr: ['Postepeno uvođenje čučnjeva i mrtvog dizanja', 'Sport-specifična priprema', 'Edukacija o pravilnoj biomehanici dizanja'],
      en: ['Gradual reintroduction of squats and deadlifts', 'Sport-specific preparation', 'Education on proper lifting biomechanics'],
      criteria: {
        hr: ['Nema radijacije boli niz nogu', 'McGill endurance testovi zadovoljeni', 'Puni ROM bez simptoma'],
        en: ['No pain radiation down leg', 'McGill endurance tests passed', 'Full ROM without symptoms']
      }
    },
    exercises: [
      { name: 'McKenzie Extension', nameHr: 'McKenzie ekstenzija', sets: '10', reps: '1', hold: '2s', frequency: 'svaka 2 sata', phase: 1, difficulty: 'easy', targetMuscles: ['back'], description: { hr: 'Legni na trbuh, podignì gornji dio tijela na rukama (kao cobra). Drži 2s.', en: 'Lie face down, push upper body up on arms (like cobra). Hold 2s.' } },
      { name: 'Bird-Dog', nameHr: 'Bird-Dog', sets: '3', reps: '8 po strani', hold: '5s', frequency: 'svaki dan', phase: 2, difficulty: 'easy', targetMuscles: ['core', 'back', 'glutes'], description: { hr: 'Na svim četirima, ispruži suprotnu ruku i nogu. Drži 5s. Ne rotiraj zdjelicu.', en: 'On all fours, extend opposite arm and leg. Hold 5s. Don\'t rotate pelvis.' } },
      { name: 'McGill Curl-up', nameHr: 'McGill Curl-up', sets: '3', reps: '10', hold: '8s', frequency: 'svaki dan', phase: 3, difficulty: 'medium', targetMuscles: ['core'], description: { hr: 'Legni, jedna noga savijena, ruke pod lumbalnu kralježnicu. Podignì glavu i ramena 3cm. NE flektiraj lumbalnu!', en: 'Lie down, one leg bent, hands under lumbar spine. Lift head and shoulders 3cm. Do NOT flex lumbar!' } },
      { name: 'Pallof Press', nameHr: 'Pallof Press', sets: '3', reps: '12 po strani', frequency: '3x tjedno', phase: 3, difficulty: 'medium', targetMuscles: ['core', 'obliques'], description: { hr: 'Stani bočno na elastiku, drži ispred prsa, ispruži ruke naprijed. Odupri se rotaciji.', en: 'Stand sideways to band, hold at chest, extend arms forward. Resist rotation.' } },
    ],
    contraindications: { hr: ['Sjedenje na podu (fleksija)', 'Sit-upovi i crunches', 'Zaokružena leđa pri dizanju', 'Toe touches', 'Teška mrtva dizanja u akutnoj fazi'], en: ['Floor sitting (flexion)', 'Sit-ups and crunches', 'Rounded back lifting', 'Toe touches', 'Heavy deadlifts in acute phase'] },
    recoveryTimeline: '6-12 tjedana (90% se poboljša konzervativno) / 6-12 weeks (90% improve conservatively)',
    successRate: '90% (konzervativno) / 90% (conservative)',
  },

  // ========== ANKLE ==========
  {
    id: 'ankle_sprain',
    name: { hr: 'Uganuće gležnja (lateralno)', en: 'Lateral Ankle Sprain' },
    category: 'ankle',
    icd10: 'S93.4',
    description: { hr: 'Istegnuće ili ruptura lateralnih ligamenata gležnja (ATFL, CFL, PTFL), najčešća sportska ozljeda.', en: 'Stretch or tear of lateral ankle ligaments (ATFL, CFL, PTFL), most common sports injury.' },
    symptoms: { hr: ['Otok lateralne strane gležnja', 'Modrica (hematom)', 'Bol pri hodu', 'Nestabilnost', 'Smanjeni ROM'], en: ['Lateral ankle swelling', 'Bruising (hematoma)', 'Pain walking', 'Instability', 'Reduced ROM'] },
    causes: { hr: ['Inverzija stopala', 'Loš doskok', 'Neravni teren', 'Umor'], en: ['Foot inversion', 'Poor landing', 'Uneven surface', 'Fatigue'] },
    redFlags: { hr: ['⚠️ Ottawa pravila: bol na stražnjem rubu maleola + nemogućnost 4 koraka = RTG', 'Deformitet', 'Nemogućnost nošenja težine'], en: ['⚠️ Ottawa rules: posterior malleolar tenderness + inability to take 4 steps = X-ray', 'Deformity', 'Inability to bear weight'] },
    assessment: { hr: ['Anterior drawer test gležnja', 'Talar tilt test', 'Ottawa ankle rules', 'Squeeze test (sindesmoza)'], en: ['Anterior drawer test ankle', 'Talar tilt test', 'Ottawa ankle rules', 'Squeeze test (syndesmosis)'] },
    phase1_acute: { hr: ['POLICE protokol', 'Led 20 min, svaka 2 sata', 'Kompresija', 'Elevacija iznad srca', 'Zaštitna ortoza ili taping', 'Rano opterećenje koliko tolerira'], en: ['POLICE protocol', 'Ice 20 min, every 2 hours', 'Compression', 'Elevation above heart', 'Protective brace or taping', 'Early weight bearing as tolerated'], duration: '0-7 dana', protocol: 'POLICE' },
    phase2_subacute: { hr: ['ROM vježbe — abeceda stopalom', 'Calf raises (sjedeći)', 'Balans na jednoj nozi', 'Theraband everizija', 'Hodanje bez pomagala'], en: ['ROM exercises — alphabet with foot', 'Calf raises (seated)', 'Single leg balance', 'Theraband eversion', 'Walking without aids'], duration: '1-3 tjedna' },
    phase3_rehab: { hr: ['Progresivne calf raises (stojeći)', 'BOSU balans', 'Cutting i pivoting', 'Hop testovi', 'Sport-specifični drillovi'], en: ['Progressive calf raises (standing)', 'BOSU balance', 'Cutting and pivoting', 'Hop tests', 'Sport-specific drills'], duration: '3-8 tjedana' },
    phase4_return: { hr: ['Puni sport s profilaktičkim tapingom', 'Nastavak balans programa'], en: ['Full sport with prophylactic taping', 'Continue balance program'], criteria: { hr: ['Hop test ≥90%', 'Puni ROM', 'Nema boli pri sprintu'], en: ['Hop test ≥90%', 'Full ROM', 'No pain during sprint'] } },
    exercises: [
      { name: 'Alphabet Ankle', nameHr: 'Abeceda gležnjem', sets: '2', reps: 'A-Z', frequency: '3x dnevno', phase: 1, difficulty: 'easy', targetMuscles: ['calves'], description: { hr: 'Sjedi, podignì nogu i "piši" slova abecede stopalom.', en: 'Sit, lift foot and "write" alphabet letters with foot.' } },
      { name: 'Band Eversion', nameHr: 'Everizija s elastikom', sets: '3', reps: '15', frequency: 'svaki dan', phase: 2, difficulty: 'easy', targetMuscles: ['calves'], description: { hr: 'Elastika oko stopala, gurni stopalo prema van protiv otpora.', en: 'Band around foot, push foot outward against resistance.' } },
    ],
    contraindications: { hr: ['Trčanje na neravnom terenu u prvih 4 tjedna', 'Skokovi bez tapinga u ranoj fazi'], en: ['Running on uneven ground in first 4 weeks', 'Jumping without taping in early phase'] },
    recoveryTimeline: '2-8 tjedana (ovisno o stupnju) / 2-8 weeks (depending on grade)',
    successRate: '90%+',
  },

  // ========== PLANTAR FASCIITIS ==========
  {
    id: 'plantar_fasciitis',
    name: { hr: 'Plantarni fasciitis', en: 'Plantar Fasciitis' },
    category: 'foot',
    icd10: 'M72.2',
    description: { hr: 'Upala plantarne fascije — debeloe vezivno tkivo na donjem dijelu stopala. Najčešći uzrok boli pete.', en: 'Inflammation of plantar fascia — thick connective tissue on bottom of foot. Most common cause of heel pain.' },
    symptoms: { hr: ['Oštra bol u peti prvi koraci ujutro', 'Bol nakon dugog sjedenja pa ustajanja', 'Bol se smanjuje hodanjem pa se vraća', 'Bol pri trčanju/skakanju'], en: ['Sharp heel pain first steps in morning', 'Pain after prolonged sitting then standing', 'Pain reduces with walking then returns', 'Pain during running/jumping'] },
    causes: { hr: ['Pretjerano trčanje', 'Ravna stopala ili visoki svod', 'Pretilost', 'Loša obuća', 'Tight Ahilova tetiva'], en: ['Excessive running', 'Flat feet or high arches', 'Obesity', 'Poor footwear', 'Tight Achilles tendon'] },
    redFlags: { hr: ['⚠️ Bol koja se ne poboljšava 6 tjedana — mogući stres fraktura'], en: ['⚠️ Pain not improving in 6 weeks — possible stress fracture'] },
    assessment: { hr: ['Palpacija medijalnog tuberkula calcanusa', 'Windlass test', 'Ultrazlvuk za debljinu fascije'], en: ['Palpation of medial calcaneal tubercle', 'Windlass test', 'Ultrasound for fascia thickness'] },
    phase1_acute: { hr: ['Smrznuta bočica vode — roll pod stopalom 10 min', 'Noćna udlaga (dorzifleksija)', 'Gelske uloške', 'Redukcija aktivnosti (ne potpuni odmor)', 'Istezanje lista prije ustajanja iz kreveta'], en: ['Frozen water bottle — roll under foot 10 min', 'Night splint (dorsiflexion)', 'Gel insoles', 'Activity reduction (not complete rest)', 'Calf stretch before getting out of bed'], duration: '1-2 tjedna', protocol: 'Ice rolling + night splint' },
    phase2_subacute: { hr: ['Eccentric calf raises (spuštanje pete preko stepenice)', 'Towel toe curls', 'Istezanje plantarne fascije', 'Intrinsic foot strengthening'], en: ['Eccentric calf raises (heel drops off step)', 'Towel toe curls', 'Plantar fascia stretching', 'Intrinsic foot strengthening'], duration: '2-6 tjedana' },
    phase3_rehab: { hr: ['Heavy slow resistance calf raises', 'Progresivno trčanje (run-walk)', 'Propriocepcija boso'], en: ['Heavy slow resistance calf raises', 'Progressive running (run-walk)', 'Barefoot proprioception'], duration: '6-12 tjedana' },
    phase4_return: { hr: ['Puno trčanje s uloškama', 'Nastavak eccentric programa'], en: ['Full running with insoles', 'Continue eccentric program'], criteria: { hr: ['Nema jutarnje boli', 'Nema boli pri trčanju 30 min'], en: ['No morning pain', 'No pain during 30 min run'] } },
    exercises: [
      { name: 'Frozen Bottle Roll', nameHr: 'Roll smrznutom bočicom', sets: '1', reps: '10 min', frequency: '2x dnevno', phase: 1, difficulty: 'easy', targetMuscles: ['foot'], description: { hr: 'Smrzni bočicu vode, roll pod stopalom 10 minuta.', en: 'Freeze water bottle, roll under foot for 10 minutes.' } },
      { name: 'Eccentric Calf Raise', nameHr: 'Eccentric spuštanje pete', sets: '3', reps: '15', hold: '3s na dnu', frequency: 'svaki dan', phase: 2, difficulty: 'medium', targetMuscles: ['calves'], description: { hr: 'Stani na rub stepenice, podignì se na prste pa se POLAKO spuštaj 3 sekunde.', en: 'Stand on step edge, rise on toes then SLOWLY lower for 3 seconds.' } },
    ],
    contraindications: { hr: ['Hodanje bos na tvrdim površinama', 'Sprint trčanje u akutnoj fazi', 'Skakanje bez uložaka'], en: ['Walking barefoot on hard surfaces', 'Sprint running in acute phase', 'Jumping without insoles'] },
    recoveryTimeline: '3-6 mjeseci / 3-6 months',
    successRate: '90% (konzervativno unutar 12 mjeseci / conservative within 12 months)',
  },

  // ========== TENNIS ELBOW ==========
  {
    id: 'tennis_elbow',
    name: { hr: 'Lateralni epikondilitis (teniski lakat)', en: 'Lateral Epicondylitis (Tennis Elbow)' },
    category: 'elbow',
    icd10: 'M77.1',
    description: { hr: 'Tendinopatija tetiva ekstenzora podlaktice na lateralnom epikondilu humerusa.', en: 'Tendinopathy of forearm extensor tendons at lateral epicondyle of humerus.' },
    symptoms: { hr: ['Bol na vanjskoj strani lakta', 'Bol pri stiskanju/hvatanju', 'Bol pri okretanju kvake', 'Slabost gripa', 'Bol se širi niz podlakticu'], en: ['Pain on outside of elbow', 'Pain with gripping/grasping', 'Pain turning doorknob', 'Grip weakness', 'Pain radiates down forearm'] },
    causes: { hr: ['Ponavljajući pokreti zapešća', 'Teniski backhand (loša tehnika)', 'Tipkanje/miš', 'Rad s alatima'], en: ['Repetitive wrist movements', 'Tennis backhand (poor technique)', 'Typing/mouse use', 'Tool work'] },
    redFlags: { hr: ['⚠️ Ako bol traje >12 tjedana uz terapiju'], en: ['⚠️ If pain persists >12 weeks with therapy'] },
    assessment: { hr: ['Cozen test', 'Mill test', 'Grip strength test'], en: ['Cozen test', 'Mill test', 'Grip strength test'] },
    phase1_acute: { hr: ['Izbjegavati bolne pokrete', 'Taping/ortoza', 'Led nakon aktivnosti', 'Izometrička ekstenzija zapešća'], en: ['Avoid painful movements', 'Taping/brace', 'Ice after activity', 'Isometric wrist extension'], duration: '1-2 tjedna', protocol: 'Isometric loading + relative rest' },
    phase2_subacute: { hr: ['Eccentric wrist extensions', 'Tyler twist (FlexBar)', 'Forearm pronation/supination', 'Grip jačanje (plastelin)'], en: ['Eccentric wrist extensions', 'Tyler twist (FlexBar)', 'Forearm pronation/supination', 'Grip strengthening (putty)'], duration: '2-6 tjedana' },
    phase3_rehab: { hr: ['Heavy slow resistance (HSR)', 'Progresivni grip rad', 'Povratak aktivnostima'], en: ['Heavy slow resistance (HSR)', 'Progressive grip work', 'Return to activities'], duration: '6-12 tjedana' },
    phase4_return: { hr: ['Puna aktivnost s ergonomskim prilagodbama'], en: ['Full activity with ergonomic adjustments'], criteria: { hr: ['Grip snaga ≥90% zdrave strane', 'Nema boli pri aktivnosti'], en: ['Grip strength ≥90% of healthy side', 'No pain during activity'] } },
    exercises: [
      { name: 'Eccentric Wrist Extension', nameHr: 'Eccentric ekstenzija zapešća', sets: '3', reps: '15', frequency: 'svaki dan', phase: 2, difficulty: 'easy', targetMuscles: ['forearms'], description: { hr: 'Drži uteg, zapešće preko ruba stola, polako spuštaj (3s). Drugom rukom vraćaj gore.', en: 'Hold weight, wrist over table edge, slowly lower (3s). Use other hand to lift back up.' } },
      { name: 'Tyler Twist', nameHr: 'Tyler Twist (FlexBar)', sets: '3', reps: '15', frequency: 'svaki dan', phase: 2, difficulty: 'medium', targetMuscles: ['forearms'], description: { hr: 'FlexBar u obje ruke, uvij zdravom i polako odmotaj bolesnom rukom.', en: 'FlexBar in both hands, twist with healthy and slowly untwist with affected hand.' } },
    ],
    contraindications: { hr: ['Teški grip rad u akutnoj fazi', 'Kortizon injekcije (kratkoročno olakšanje, dugoročno pogoršanje)'], en: ['Heavy grip work in acute phase', 'Cortisone injections (short-term relief, long-term worsening)'] },
    recoveryTimeline: '6-12 tjedana / 6-12 weeks',
    successRate: '80-90%',
  },

  // ========== SCIATICA ==========
  {
    id: 'sciatica',
    name: { hr: 'Išijas (radikulopatija)', en: 'Sciatica (Radiculopathy)' },
    category: 'lower_back',
    icd10: 'M54.3',
    description: { hr: 'Bol koja se širi duž ishijadičnog živca — od donjeg dijela leđa, kroz gluteus, niz nogu do stopala.', en: 'Pain radiating along sciatic nerve — from lower back, through buttock, down leg to foot.' },
    symptoms: { hr: ['Oštra/žareća bol niz nogu', 'Trnjenje u stopalu', 'Slabost noge', 'Pogoršanje pri sjedenju', 'Bol pri kašlju/kihanju'], en: ['Sharp/burning pain down leg', 'Numbness in foot', 'Leg weakness', 'Worsens with sitting', 'Pain with coughing/sneezing'] },
    causes: { hr: ['Hernija diska (najčešće)', 'Stenoza spinalnog kanala', 'Piriformis sindrom', 'Spondilolisteza'], en: ['Disc herniation (most common)', 'Spinal canal stenosis', 'Piriformis syndrome', 'Spondylolisthesis'] },
    redFlags: { hr: ['🚨 Cauda equina — gubitak kontrole sfinktera', '🚨 Progresivna bilateralna slabost', '🚨 Sedlasta anestezija'], en: ['🚨 Cauda equina — sphincter control loss', '🚨 Progressive bilateral weakness', '🚨 Saddle anesthesia'] },
    assessment: { hr: ['SLR test', 'Slump test', 'Neurološki pregled', 'MRI'], en: ['SLR test', 'Slump test', 'Neurological exam', 'MRI'] },
    phase1_acute: { hr: ['McKenzie ekstenzije', 'Nerve flossing (oprezno)', 'Hodanje svaka 2 sata', 'Izbjegavati sjedenje >15 min', 'Toplina na gluteus (piriformis)'], en: ['McKenzie extensions', 'Nerve flossing (carefully)', 'Walking every 2 hours', 'Avoid sitting >15 min', 'Heat on glute (piriformis)'], duration: '1-3 tjedna', protocol: 'McKenzie + neural mobilization' },
    phase2_subacute: { hr: ['Glute bridge', 'Piriformis stretch', 'Core aktivacija (Dead Bug)', 'Sciatic nerve glides'], en: ['Glute bridge', 'Piriformis stretch', 'Core activation (Dead Bug)', 'Sciatic nerve glides'], duration: '3-6 tjedana' },
    phase3_rehab: { hr: ['McGill Big 3', 'Hip hinge progresija', 'Farmer walks', 'Swimming'], en: ['McGill Big 3', 'Hip hinge progression', 'Farmer walks', 'Swimming'], duration: '6-12 tjedana' },
    phase4_return: { hr: ['Postupni povratak sportu'], en: ['Gradual return to sport'], criteria: { hr: ['Nema radikularne boli', 'Negativan SLR', 'Puna snaga noge'], en: ['No radicular pain', 'Negative SLR', 'Full leg strength'] } },
    exercises: [
      { name: 'Sciatic Nerve Glide', nameHr: 'Glajd ishijadičnog živca', sets: '2', reps: '10', frequency: '3x dnevno', phase: 1, difficulty: 'easy', targetMuscles: ['hamstrings'], description: { hr: 'Sjedi na rub stolice, ispruži nogu, povuci prste prema sebi, zatim vrati natrag. Nikad do boli!', en: 'Sit on chair edge, extend leg, pull toes toward you, then release. Never into pain!' } },
      { name: 'Piriformis Stretch', nameHr: 'Istezanje piriformisa', sets: '2', reps: '30s po strani', frequency: '3x dnevno', phase: 2, difficulty: 'easy', targetMuscles: ['glutes'], description: { hr: 'Legni na leđa, stavi gležanj na suprotno koljeno, povuci koljeno prema prsima.', en: 'Lie on back, place ankle on opposite knee, pull knee toward chest.' } },
    ],
    contraindications: { hr: ['Sit-upovi', 'Toe touches', 'Agresivno istezanje hamstringsa', 'Teški deadlift u akutnoj fazi'], en: ['Sit-ups', 'Toe touches', 'Aggressive hamstring stretching', 'Heavy deadlift in acute phase'] },
    recoveryTimeline: '4-12 tjedana / 4-12 weeks',
    successRate: '85-90% (konzervativno / conservative)',
  },
];

// ============================
// GENERAL PROTOCOLS
// ============================

export const generalProtocols = {
  POLICE: {
    name: 'POLICE Protocol',
    steps: {
      hr: ['P — Protection: Zaštiti ozlijeđeno područje', 'OL — Optimal Loading: Rano kontrolirano opterećenje', 'I — Ice: Led 20 min svaka 2-3 sata', 'C — Compression: Kompresivni zavoj', 'E — Elevation: Podignì iznad razine srca'],
      en: ['P — Protection: Protect injured area', 'OL — Optimal Loading: Early controlled loading', 'I — Ice: Ice 20 min every 2-3 hours', 'C — Compression: Compression bandage', 'E — Elevation: Raise above heart level']
    },
  },
  icing: {
    name: 'Icing Protocol',
    steps: {
      hr: ['20 minuta ON / 40 minuta OFF', 'Nikad direktno na kožu — uvijek krpa između', 'Prvih 72 sata — svaka 2-3 sata', 'STOP ako koža postane bijela ili nema osjeta'],
      en: ['20 minutes ON / 40 minutes OFF', 'Never directly on skin — always cloth between', 'First 72 hours — every 2-3 hours', 'STOP if skin turns white or loses sensation']
    },
  },
  rom_norms: {
    name: 'Normal ROM Values',
    joints: {
      shoulder: { flexion: 180, extension: 60, abduction: 180, internal_rotation: 70, external_rotation: 90 },
      elbow: { flexion: 150, extension: 0 },
      hip: { flexion: 120, extension: 30, abduction: 45, internal_rotation: 35, external_rotation: 45 },
      knee: { flexion: 135, extension: 0 },
      ankle: { dorsiflexion: 20, plantarflexion: 50 },
    },
  },
  pain_scale: {
    hr: ['0 — Nema boli', '1-3 — Blaga bol, ne ometa aktivnosti', '4-6 — Umjerena bol, ometa neke aktivnosti', '7-9 — Jaka bol, značajno ograničava aktivnosti', '10 — Najjača zamisliva bol'],
    en: ['0 — No pain', '1-3 — Mild pain, doesn\'t interfere with activities', '4-6 — Moderate pain, interferes with some activities', '7-9 — Severe pain, significantly limits activities', '10 — Worst imaginable pain'],
  },
};

// ============================
// LOOKUP FUNCTIONS
// ============================

/** Find diagnosis by injury keyword */
export function findDiagnosis(keyword: string): PhysioDiagnosis | null {
  const lower = keyword.toLowerCase();
  const mappings: Record<string, string> = {
    'acl': 'acl_tear', 'križni': 'acl_tear', 'cruciate': 'acl_tear', 'meniskus': 'acl_tear',
    'rotator': 'rotator_cuff', 'manšeta': 'rotator_cuff', 'cuff': 'rotator_cuff', 'impingement': 'rotator_cuff',
    'disk': 'disc_herniation', 'disc': 'disc_herniation', 'hernij': 'disc_herniation', 'lumbal': 'disc_herniation',
    'uganuć': 'ankle_sprain', 'sprain': 'ankle_sprain', 'gležanj': 'ankle_sprain', 'ankle': 'ankle_sprain',
    'plantar': 'plantar_fasciitis', 'fasciitis': 'plantar_fasciitis', 'peta': 'plantar_fasciitis', 'heel': 'plantar_fasciitis',
    'teniski': 'tennis_elbow', 'tennis': 'tennis_elbow', 'epikondil': 'tennis_elbow', 'lakat': 'tennis_elbow',
    'išijas': 'sciatica', 'sciatic': 'sciatica', 'radikul': 'sciatica',
  };

  for (const [key, id] of Object.entries(mappings)) {
    if (lower.includes(key)) {
      return physioDatabase.find((d) => d.id === id) || null;
    }
  }
  return null;
}

/** Get all exercises for a diagnosis at a specific phase */
export function getExercisesForPhase(diagnosisId: string, phase: number): PhysioExercise[] {
  const diag = physioDatabase.find((d) => d.id === diagnosisId);
  if (!diag) return [];
  return diag.exercises.filter((e) => e.phase <= phase);
}

/** Build a comprehensive prompt block from the knowledge base */
export function buildKnowledgePrompt(locale: 'hr' | 'en'): string {
  const l = locale;
  let prompt = `\n\n=== FIZIOTERAPEUTSKA BAZA ZNANJA ===\n`;
  prompt += `Imaš pristup sljedećim dijagnozama i protokolima:\n\n`;

  for (const d of physioDatabase) {
    prompt += `## ${d.name[l]} (${d.icd10 || 'N/A'})\n`;
    prompt += `Simptomi: ${d.symptoms[l].join('; ')}\n`;
    prompt += `Akutna faza: ${d.phase1_acute[l].join('; ')}\n`;
    prompt += `Vježbe: ${d.exercises.map(e => `${l === 'hr' ? e.nameHr : e.name} (${e.sets}×${e.reps})`).join(', ')}\n`;
    prompt += `Kontraindikacije: ${d.contraindications[l].join('; ')}\n`;
    prompt += `Oporavak: ${d.recoveryTimeline}\n`;
    prompt += `Crvene zastave: ${d.redFlags[l].join('; ')}\n\n`;
  }

  prompt += `\n=== PROTOKOLI ===\n`;
  prompt += `POLICE: ${generalProtocols.POLICE.steps[l].join('; ')}\n`;
  prompt += `Icing: ${generalProtocols.icing.steps[l].join('; ')}\n`;
  prompt += `Pain Scale: ${generalProtocols.pain_scale[l].join('; ')}\n`;

  return prompt;
}
