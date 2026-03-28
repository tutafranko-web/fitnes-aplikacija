// ═══════════════════════════════════════════════════════════════
// MUSCLES DATABASE — 22 muscle groups, 83+ heads, 80+ fun facts
// Used by: Muscle Passport, Fun Facts, Tamagotchi, Body Map
// ═══════════════════════════════════════════════════════════════

export interface MuscleHead {
  id: string;
  nameHr: string;
  nameEn: string;
  nameLatin: string;
}

export interface MuscleGroup {
  id: string;
  nameHr: string;
  nameEn: string;
  bodyMapGroup: string; // maps to soreness keys (chest, back, shoulders, etc.)
  heads: MuscleHead[];
  funFacts: FunFact[];
  unlockExercises: string[]; // exercise names that unlock heads of this group
}

export interface FunFact {
  textHr: string;
  textEn: string;
  category: 'anatomy' | 'performance' | 'evolution' | 'trivia' | 'science';
}

export const musclesDatabase: MuscleGroup[] = [
  // ── NECK ───────────────────────────────────────────────
  {
    id: 'neck',
    nameHr: 'Vrat',
    nameEn: 'Neck',
    bodyMapGroup: 'neck',
    heads: [
      { id: 'scm_sternal', nameHr: 'SCM sternalna', nameEn: 'SCM Sternal', nameLatin: 'Sternocleidomastoideus (caput sternale)' },
      { id: 'scm_clavicular', nameHr: 'SCM klavikularna', nameEn: 'SCM Clavicular', nameLatin: 'Sternocleidomastoideus (caput claviculare)' },
      { id: 'scalenes', nameHr: 'Skaleni', nameEn: 'Scalenes', nameLatin: 'Musculi scaleni' },
    ],
    funFacts: [
      { textHr: 'SCM je jedini mišić koji možeš vidjeti i opipati na sebi — ona "traka" sa strane vrata kad okreneš glavu.', textEn: 'The SCM is the only muscle you can both see and feel — that "band" on the side of your neck when you turn your head.', category: 'anatomy' },
      { textHr: 'Ljudski vrat drži 5kg tešku glavu cijeli dan — to je kao da držiš kuglačku kuglu na štapiću 16 sati dnevno.', textEn: 'Your neck holds a 5kg head all day — like balancing a bowling ball on a stick for 16 hours daily.', category: 'trivia' },
      { textHr: 'Žirafe imaju isti broj vratnih kralježaka kao ljudi — samo 7. Ali svaki je dugačak do 25cm.', textEn: 'Giraffes have the same number of neck vertebrae as humans — just 7. But each one is up to 25cm long.', category: 'evolution' },
      { textHr: 'Kronični "tech neck" od gledanja u mobitel dodaje do 27kg pritiska na vratnu kralježnicu pri nagibu od 60°.', textEn: 'Chronic "tech neck" from phone use adds up to 27kg of pressure on cervical spine at a 60° angle.', category: 'science' },
    ],
    unlockExercises: ['neck curl', 'neck extension', 'shrug', 'face pull'],
  },

  // ── DELTOIDS / SHOULDERS ───────────────────────────────
  {
    id: 'deltoid',
    nameHr: 'Ramena',
    nameEn: 'Shoulders',
    bodyMapGroup: 'shoulders',
    heads: [
      { id: 'delt_anterior', nameHr: 'Prednja glava', nameEn: 'Anterior Deltoid', nameLatin: 'Deltoideus (pars clavicularis)' },
      { id: 'delt_lateral', nameHr: 'Srednja glava', nameEn: 'Lateral Deltoid', nameLatin: 'Deltoideus (pars acromialis)' },
      { id: 'delt_posterior', nameHr: 'Stražnja glava', nameEn: 'Posterior Deltoid', nameLatin: 'Deltoideus (pars spinalis)' },
    ],
    funFacts: [
      { textHr: 'Deltoid je dobio ime po grčkom slovu delta (Δ) jer ima oblik trokuta. Jedan od rijetkih mišića s 3 potpuno odvojene glave.', textEn: 'The deltoid is named after the Greek letter delta (Δ) due to its triangular shape. One of the rare muscles with 3 completely separate heads.', category: 'anatomy' },
      { textHr: 'Srednja glava deltoida je najaktivnija pri lateral raise-u, ali samo iznad 30° — ispod toga radi supraspinatus.', textEn: 'The lateral deltoid is most active during lateral raises, but only above 30° — below that, the supraspinatus does the work.', category: 'science' },
      { textHr: 'Ramena su najpokretniji zglob u tijelu — mogu se micati u 16 smjerova. Cijena te pokretljivosti: najčešće dislociran zglob.', textEn: 'Shoulders are the most mobile joint — they can move in 16 directions. The price: the most commonly dislocated joint.', category: 'anatomy' },
      { textHr: 'Bodybuilder Markus Rühl je imao ramena široka 78cm — šira od prosječnih kućnih vrata (76cm).', textEn: 'Bodybuilder Markus Rühl had shoulders 78cm wide — wider than a standard door frame (76cm).', category: 'trivia' },
    ],
    unlockExercises: ['overhead press', 'lateral raise', 'front raise', 'face pull', 'arnold press', 'reverse fly'],
  },

  // ── PECTORALIS / CHEST ─────────────────────────────────
  {
    id: 'pectoralis',
    nameHr: 'Prsa',
    nameEn: 'Chest',
    bodyMapGroup: 'chest',
    heads: [
      { id: 'pec_clavicular', nameHr: 'Gornja prsa', nameEn: 'Upper Chest', nameLatin: 'Pectoralis major (pars clavicularis)' },
      { id: 'pec_sternal', nameHr: 'Srednja prsa', nameEn: 'Mid Chest', nameLatin: 'Pectoralis major (pars sternocostalis)' },
      { id: 'pec_abdominal', nameHr: 'Donja prsa', nameEn: 'Lower Chest', nameLatin: 'Pectoralis major (pars abdominalis)' },
      { id: 'pec_minor', nameHr: 'Mali prsni', nameEn: 'Pectoralis Minor', nameLatin: 'Pectoralis minor' },
    ],
    funFacts: [
      { textHr: 'Bench press NE aktivira gornja prsa značajno — incline od 30-45° je jedini način da se ciljano pogodi pars clavicularis.', textEn: 'Bench press does NOT significantly activate upper chest — a 30-45° incline is the only way to target pars clavicularis.', category: 'science' },
      { textHr: 'Prsni mišić je jedini mišić u tijelu čija se vlakna križ-rasprostiru — gornja vlakna idu prema dolje, donja prema gore.', textEn: 'The pec is the only muscle whose fibers criss-cross — upper fibers run downward, lower fibers run upward.', category: 'anatomy' },
      { textHr: 'Pectoralis minor je "skriven" ispod velikog prsnog mišića i glavni je krivac za zaobljana ramena kod programera.', textEn: 'Pectoralis minor is "hidden" under the pec major and is the main culprit for rounded shoulders in programmers.', category: 'science' },
      { textHr: 'Rekord u bench pressu bez opreme je 355kg (Kirill Sarychev, 2015.) — težina odraslog lava.', textEn: 'The raw bench press record is 355kg (Kirill Sarychev, 2015) — the weight of an adult male lion.', category: 'trivia' },
    ],
    unlockExercises: ['bench press', 'incline bench press', 'decline press', 'chest fly', 'push up', 'cable crossover', 'dip'],
  },

  // ── SERRATUS ANTERIOR ──────────────────────────────────
  {
    id: 'serratus',
    nameHr: 'Serratus',
    nameEn: 'Serratus Anterior',
    bodyMapGroup: 'core',
    heads: [
      { id: 'serratus_upper', nameHr: 'Gornja vlakna', nameEn: 'Upper Fibers', nameLatin: 'Serratus anterior (pars superior)' },
      { id: 'serratus_lower', nameHr: 'Donja vlakna', nameEn: 'Lower Fibers', nameLatin: 'Serratus anterior (pars inferior)' },
    ],
    funFacts: [
      { textHr: 'Serratus anterior se zove "boxer\'s muscle" — odgovoran je za ispružanje šake u punch-u. Bez njega ne možeš udariti.', textEn: 'Serratus anterior is called the "boxer\'s muscle" — it\'s responsible for extending the arm in a punch. You can\'t throw one without it.', category: 'performance' },
      { textHr: 'Nazvan "serratus" (pilasti) jer izgleda kao zupci pile — prstoliki nastavci koji se vide na bočnom dijelu prsa.', textEn: 'Named "serratus" (saw-like) because it looks like saw teeth — finger-like protrusions visible on the side of the ribcage.', category: 'anatomy' },
      { textHr: 'Slabi serratus uzrokuje "krilato lopatica" (scapular winging) — lopatica strši sa leđa kao malo krilo.', textEn: 'A weak serratus causes "winged scapula" — the shoulder blade protrudes from the back like a small wing.', category: 'science' },
    ],
    unlockExercises: ['push up plus', 'serratus punch', 'ab rollout', 'overhead press'],
  },

  // ── BICEPS ─────────────────────────────────────────────
  {
    id: 'biceps',
    nameHr: 'Biceps',
    nameEn: 'Biceps',
    bodyMapGroup: 'biceps',
    heads: [
      { id: 'bicep_long', nameHr: 'Duga glava', nameEn: 'Long Head', nameLatin: 'Biceps brachii (caput longum)' },
      { id: 'bicep_short', nameHr: 'Kratka glava', nameEn: 'Short Head', nameLatin: 'Biceps brachii (caput breve)' },
      { id: 'brachialis', nameHr: 'Brahijalis', nameEn: 'Brachialis', nameLatin: 'Brachialis' },
      { id: 'brachioradialis', nameHr: 'Brahioradijalis', nameEn: 'Brachioradialis', nameLatin: 'Brachioradialis' },
    ],
    funFacts: [
      { textHr: '"Biceps" znači "dvoglavi" na latinskom. Zanimljivo — tvoj biceps zapravo nije najjači fleksor lakta. To je brahijalis ispod njega.', textEn: '"Biceps" means "two-headed" in Latin. Fun fact — your biceps isn\'t actually the strongest elbow flexor. That\'s the brachialis underneath it.', category: 'anatomy' },
      { textHr: 'Hammer curl je jedina vježba koja primarno cilja brahioradijalis — najveći mišić podlaktice i ključ za "debele" ruke.', textEn: 'Hammer curl is the only exercise that primarily targets the brachioradialis — the biggest forearm muscle and key to "thick" arms.', category: 'performance' },
      { textHr: 'Biceps je jedan od rijetkih mišića koji je i fleksor (savija lakat) i supinator (okreće dlan prema gore). Zato curls s rotacijom bolje aktiviraju.', textEn: 'Biceps is one of the rare muscles that\'s both a flexor (bends elbow) and supinator (turns palm up). That\'s why curls with rotation activate it better.', category: 'science' },
      { textHr: 'Rekord za najveći obujam bicepsa je 78.7cm — Moustafa Ismail. Kontroverzno, vjerojatno synthol injekcije.', textEn: 'The record for largest biceps circumference is 78.7cm — Moustafa Ismail. Controversial, likely synthol injections.', category: 'trivia' },
    ],
    unlockExercises: ['bicep curl', 'hammer curl', 'preacher curl', 'concentration curl', 'chin up', 'reverse curl'],
  },

  // ── TRICEPS ────────────────────────────────────────────
  {
    id: 'triceps',
    nameHr: 'Triceps',
    nameEn: 'Triceps',
    bodyMapGroup: 'triceps',
    heads: [
      { id: 'tri_lateral', nameHr: 'Lateralna glava', nameEn: 'Lateral Head', nameLatin: 'Triceps brachii (caput laterale)' },
      { id: 'tri_medial', nameHr: 'Medijalna glava', nameEn: 'Medial Head', nameLatin: 'Triceps brachii (caput mediale)' },
      { id: 'tri_long', nameHr: 'Duga glava', nameEn: 'Long Head', nameLatin: 'Triceps brachii (caput longum)' },
    ],
    funFacts: [
      { textHr: 'Triceps čini 2/3 obujma nadlaktice — ako želiš veće ruke, triceps je važniji od bicepsa.', textEn: 'Triceps makes up 2/3 of upper arm size — if you want bigger arms, triceps matters more than biceps.', category: 'performance' },
      { textHr: '"Triceps" znači "troglavi" — jedini mišić nadlaktice s 3 glave. Duga glava je jedina koja prelazi rameni zglob.', textEn: '"Triceps" means "three-headed" — the only upper arm muscle with 3 heads. The long head is the only one crossing the shoulder joint.', category: 'anatomy' },
      { textHr: 'Overhead triceps extension je jedina vježba koja potpuno isteže dugu glavu — zato je toliko efektivna za veličinu.', textEn: 'Overhead triceps extension is the only exercise that fully stretches the long head — that\'s why it\'s so effective for size.', category: 'science' },
    ],
    unlockExercises: ['tricep pushdown', 'overhead extension', 'close grip bench', 'dip', 'skull crusher', 'diamond push up'],
  },

  // ── FOREARMS ───────────────────────────────────────────
  {
    id: 'forearm',
    nameHr: 'Podlaktica',
    nameEn: 'Forearm',
    bodyMapGroup: 'forearms',
    heads: [
      { id: 'wrist_flexors', nameHr: 'Fleksori zapešća', nameEn: 'Wrist Flexors', nameLatin: 'Flexor carpi radialis + ulnaris' },
      { id: 'wrist_extensors', nameHr: 'Ekstenzori zapešća', nameEn: 'Wrist Extensors', nameLatin: 'Extensor carpi radialis + ulnaris' },
      { id: 'pronator_supinator', nameHr: 'Pronator/Supinator', nameEn: 'Pronator/Supinator', nameLatin: 'Pronator teres + Supinator' },
    ],
    funFacts: [
      { textHr: 'Podlaktica sadrži 20 mišića — više nego cijeli gornji dio ruke. Većina njih kontrolira prste, ne zapešće.', textEn: 'The forearm contains 20 muscles — more than the entire upper arm. Most of them control fingers, not the wrist.', category: 'anatomy' },
      { textHr: 'Grip strength je jedan od najboljih prediktora ukupnog zdravlja i dugovječnosti — jači stisak = duži život, prema studijama.', textEn: 'Grip strength is one of the best predictors of overall health and longevity — stronger grip = longer life, according to studies.', category: 'science' },
      { textHr: 'Mišići podlaktice nemaju mišićno tkivo u prstima — prsti se pokreću tetivama kao marioneta na koncu.', textEn: 'Forearm muscles have no muscle tissue in the fingers — fingers are moved by tendons like a puppet on strings.', category: 'anatomy' },
    ],
    unlockExercises: ['wrist curl', 'reverse curl', 'farmer walk', 'dead hang', 'hammer curl'],
  },

  // ── RECTUS ABDOMINIS / ABS ─────────────────────────────
  {
    id: 'abs',
    nameHr: 'Trbušni mišići',
    nameEn: 'Abdominals',
    bodyMapGroup: 'core',
    heads: [
      { id: 'abs_upper', nameHr: 'Gornji abs', nameEn: 'Upper Abs', nameLatin: 'Rectus abdominis (pars superior)' },
      { id: 'abs_middle', nameHr: 'Srednji abs', nameEn: 'Mid Abs', nameLatin: 'Rectus abdominis (pars media)' },
      { id: 'abs_lower', nameHr: 'Donji abs', nameEn: 'Lower Abs', nameLatin: 'Rectus abdominis (pars inferior)' },
      { id: 'transversus', nameHr: 'Transversus', nameEn: 'Transversus Abdominis', nameLatin: 'Transversus abdominis' },
    ],
    funFacts: [
      { textHr: 'Six-pack zapravo ima 8 segmenata — donja 2 su skrivena ispod masnog tkiva kod 99% ljudi. Neki ljudi genetski imaju 4-pack ili 10-pack.', textEn: 'A six-pack actually has 8 segments — the bottom 2 are hidden under fat in 99% of people. Some genetically have a 4-pack or 10-pack.', category: 'anatomy' },
      { textHr: 'Rectus abdominis je JEDAN mišić — nema "gornje" i "donje" abse. Ali možeš naglasiti dijelove promjenom kuta vježbe.', textEn: 'Rectus abdominis is ONE muscle — there are no "upper" and "lower" abs. But you can emphasize regions by changing exercise angle.', category: 'science' },
      { textHr: 'Transversus abdominis je najdublji trbušni mišić — djeluje kao prirodni "pojas" koji štiti kralježnicu. Aktivira se kad kašlješ.', textEn: 'Transversus abdominis is the deepest ab muscle — it acts as a natural "belt" protecting the spine. It activates when you cough.', category: 'anatomy' },
      { textHr: 'Vidljivost absa ovisi isključivo o postotku tjelesne masti — ispod 12% za muškarce, ispod 18% za žene. Nijedan crunch ne pomaže bez toga.', textEn: 'Ab visibility depends solely on body fat percentage — below 12% for men, 18% for women. No amount of crunches helps without that.', category: 'science' },
    ],
    unlockExercises: ['crunch', 'leg raise', 'plank', 'ab rollout', 'sit up', 'hanging leg raise', 'cable crunch'],
  },

  // ── OBLIQUES ───────────────────────────────────────────
  {
    id: 'obliques',
    nameHr: 'Kosi trbušni',
    nameEn: 'Obliques',
    bodyMapGroup: 'core',
    heads: [
      { id: 'oblique_external', nameHr: 'Vanjski kosi', nameEn: 'External Oblique', nameLatin: 'Obliquus externus abdominis' },
      { id: 'oblique_internal', nameHr: 'Unutarnji kosi', nameEn: 'Internal Oblique', nameLatin: 'Obliquus internus abdominis' },
    ],
    funFacts: [
      { textHr: 'Vanjski i unutarnji kosi rade suprotno — kad se okreneš desno, radi lijevi vanjski + desni unutarnji. Kao X koji se križa.', textEn: 'External and internal obliques work oppositely — when you rotate right, the left external + right internal work. Like a criss-crossing X.', category: 'anatomy' },
      { textHr: 'Kosi mišići su ključni za snagu u rotaciji — golf swing, bejzbol udarac, i boksački hook svi ovise o njima.', textEn: 'Obliques are key for rotational power — golf swing, baseball hit, and boxing hook all depend on them.', category: 'performance' },
      { textHr: 'Side plank je najefikasnija vježba za kose mišiće prema EMG studijama — bolja od Russian twista.', textEn: 'Side plank is the most effective oblique exercise according to EMG studies — better than Russian twists.', category: 'science' },
    ],
    unlockExercises: ['russian twist', 'side plank', 'woodchop', 'bicycle crunch', 'oblique crunch'],
  },

  // ── HIP FLEXORS ────────────────────────────────────────
  {
    id: 'hip_flexors',
    nameHr: 'Fleksori kuka',
    nameEn: 'Hip Flexors',
    bodyMapGroup: 'quads',
    heads: [
      { id: 'psoas_major', nameHr: 'Psoas major', nameEn: 'Psoas Major', nameLatin: 'Psoas major' },
      { id: 'iliacus', nameHr: 'Iliacus', nameEn: 'Iliacus', nameLatin: 'Iliacus' },
      { id: 'rectus_femoris_hf', nameHr: 'Rectus femoris', nameEn: 'Rectus Femoris (hip flexion)', nameLatin: 'Rectus femoris' },
    ],
    funFacts: [
      { textHr: 'Psoas major je jedini mišić koji spaja kralježnicu s nogama — prolazi kroz zdjelicu kao most. Skraćen psoas = bol u leđima.', textEn: 'Psoas major is the only muscle connecting the spine to the legs — it passes through the pelvis like a bridge. A tight psoas = back pain.', category: 'anatomy' },
      { textHr: 'Sjedenje 8h dnevno permanentno skraćuje hip fleksore — zato toliko ljudi ima "anterior pelvic tilt" (zdjelica nagnuta naprijed).', textEn: 'Sitting 8h/day permanently shortens hip flexors — that\'s why so many people have anterior pelvic tilt.', category: 'science' },
      { textHr: 'Sprinteri imaju hip fleksore 3x jače od prosječne osobe — oni su "motor" za podizanje koljena pri trčanju.', textEn: 'Sprinters have hip flexors 3x stronger than average — they\'re the "engine" for knee lift during running.', category: 'performance' },
    ],
    unlockExercises: ['leg raise', 'mountain climber', 'hanging knee raise', 'lunge'],
  },

  // ── QUADRICEPS ─────────────────────────────────────────
  {
    id: 'quadriceps',
    nameHr: 'Quadriceps',
    nameEn: 'Quadriceps',
    bodyMapGroup: 'quads',
    heads: [
      { id: 'rectus_femoris', nameHr: 'Rectus femoris', nameEn: 'Rectus Femoris', nameLatin: 'Rectus femoris' },
      { id: 'vastus_lateralis', nameHr: 'Vastus lateralis', nameEn: 'Vastus Lateralis', nameLatin: 'Vastus lateralis' },
      { id: 'vastus_medialis', nameHr: 'Vastus medialis (VMO)', nameEn: 'Vastus Medialis (VMO)', nameLatin: 'Vastus medialis obliquus' },
      { id: 'vastus_intermedius', nameHr: 'Vastus intermedius', nameEn: 'Vastus Intermedius', nameLatin: 'Vastus intermedius' },
    ],
    funFacts: [
      { textHr: '"Quadriceps" znači "četveroglavi" — 4 glave koje se spajaju u jednu tetivu na koljenu. Najmasivnija mišićna grupa u tijelu.', textEn: '"Quadriceps" means "four-headed" — 4 heads joining into one tendon at the knee. The most massive muscle group in the body.', category: 'anatomy' },
      { textHr: 'VMO (kapljica iznad koljena) je ključan za stabilnost koljena — slab VMO = 70% veći rizik od ozljede ACL-a.', textEn: 'VMO (teardrop above knee) is crucial for knee stability — weak VMO = 70% higher ACL injury risk.', category: 'science' },
      { textHr: 'Biciklisti imaju quadricepse do 2x veće od prosjeka — Robert Förstemann ima bedra obujma 74cm.', textEn: 'Cyclists have quads up to 2x larger than average — Robert Förstemann has thighs measuring 74cm.', category: 'trivia' },
      { textHr: 'Čučanj do potpune dubine aktivira VMO 40% više nego polu-čučanj — zato je "ass to grass" bolji za koljena, ne gori.', textEn: 'Full depth squat activates VMO 40% more than half squat — that\'s why "ass to grass" is better for knees, not worse.', category: 'science' },
    ],
    unlockExercises: ['squat', 'leg press', 'leg extension', 'lunge', 'bulgarian split squat', 'front squat', 'hack squat'],
  },

  // ── ADDUCTORS ──────────────────────────────────────────
  {
    id: 'adductors',
    nameHr: 'Aduktori',
    nameEn: 'Adductors',
    bodyMapGroup: 'quads',
    heads: [
      { id: 'adductor_magnus', nameHr: 'Adductor magnus', nameEn: 'Adductor Magnus', nameLatin: 'Adductor magnus' },
      { id: 'adductor_longus', nameHr: 'Adductor longus', nameEn: 'Adductor Longus', nameLatin: 'Adductor longus' },
      { id: 'gracilis', nameHr: 'Gracilis', nameEn: 'Gracilis', nameLatin: 'Gracilis' },
    ],
    funFacts: [
      { textHr: 'Adductor magnus je jedan od najvećih mišića tijela — čini skoro 30% mase bedra. Značajan pomoćnik u čučnju i deadliftu.', textEn: 'Adductor magnus is one of the body\'s largest muscles — it makes up nearly 30% of thigh mass. A significant squat and deadlift helper.', category: 'anatomy' },
      { textHr: 'Gracilis je najtanji mišić bedra — ali kirurzi ga koriste kao "zamjenski dio" za rekonstrukciju ACL-a jer je potrošan.', textEn: 'Gracilis is the thinnest thigh muscle — but surgeons use it as a "spare part" for ACL reconstruction since it\'s expendable.', category: 'science' },
      { textHr: 'Footballeri imaju 3x veći rizik od ozljede aduktora nego bilo kojeg drugog mišića — "pubalgia" je najčešća dijagnoza.', textEn: 'Football players have 3x higher adductor injury risk than any other muscle — "pubalgia" is the most common diagnosis.', category: 'trivia' },
    ],
    unlockExercises: ['sumo squat', 'copenhagen plank', 'adductor machine', 'sumo deadlift', 'side lunge'],
  },

  // ── TIBIALIS ───────────────────────────────────────────
  {
    id: 'tibialis',
    nameHr: 'Tibialis',
    nameEn: 'Tibialis',
    bodyMapGroup: 'calves',
    heads: [
      { id: 'tibialis_anterior', nameHr: 'Tibialis anterior', nameEn: 'Tibialis Anterior', nameLatin: 'Tibialis anterior' },
      { id: 'peroneus', nameHr: 'Peroneus', nameEn: 'Peroneus', nameLatin: 'Peroneus longus + brevis' },
    ],
    funFacts: [
      { textHr: 'Tibialis anterior je mišić koji podiže stopalo prema gore — bez njega bi ti stopalo "klapalo" pri svakom koraku (foot drop).', textEn: 'Tibialis anterior lifts the foot upward — without it, your foot would "slap" with every step (foot drop).', category: 'anatomy' },
      { textHr: 'Shin splints (bol u potkoljenici) su najčešće uzrokovani preopterećenim tibialis anteriorom — čest kod novih trkača.', textEn: 'Shin splints are most commonly caused by overloaded tibialis anterior — common in new runners.', category: 'science' },
      { textHr: 'Kneesovertoesguy je popularizirao tibialis raise kao "najvažniju vježbu za prevenciju ozljeda koljena".', textEn: 'Kneesovertoesguy popularized the tibialis raise as "the most important exercise for knee injury prevention".', category: 'trivia' },
    ],
    unlockExercises: ['tibialis raise', 'toe walk', 'ankle dorsiflexion'],
  },

  // ── TRAPEZIUS ──────────────────────────────────────────
  {
    id: 'trapezius',
    nameHr: 'Trapez',
    nameEn: 'Trapezius',
    bodyMapGroup: 'traps',
    heads: [
      { id: 'trap_upper', nameHr: 'Gornja vlakna', nameEn: 'Upper Traps', nameLatin: 'Trapezius (pars descendens)' },
      { id: 'trap_middle', nameHr: 'Srednja vlakna', nameEn: 'Middle Traps', nameLatin: 'Trapezius (pars transversa)' },
      { id: 'trap_lower', nameHr: 'Donja vlakna', nameEn: 'Lower Traps', nameLatin: 'Trapezius (pars ascendens)' },
    ],
    funFacts: [
      { textHr: 'Trapezius je jedini mišić koji se proteže od lubanje do sredine leđa — jedan od najvećih mišića tijela u površini.', textEn: 'The trapezius is the only muscle extending from skull to mid-back — one of the largest muscles by surface area.', category: 'anatomy' },
      { textHr: 'Gornji trapez je najčešće napet mišić u tijelu — stres ga automatski kontrahira. Zato ti ramena idu prema ušima kad si pod stresom.', textEn: 'Upper traps are the most commonly tense muscle — stress automatically contracts them. That\'s why your shoulders rise toward your ears when stressed.', category: 'science' },
      { textHr: 'Shrug aktivira samo gornji trapez. Za srednji trebaš face pull ili row, za donji Y-raise ili pullover.', textEn: 'Shrugs only activate upper traps. For middle you need face pulls or rows, for lower Y-raises or pullovers.', category: 'performance' },
      { textHr: 'Trapez je nazvan po geometrijskom obliku — trapez (četverokut s jednim parom paralelnih stranica). Oblik lijeve+desne strane zajedno.', textEn: 'Trapezius is named after the geometric shape — trapezoid. The shape of left+right sides combined.', category: 'trivia' },
    ],
    unlockExercises: ['shrug', 'face pull', 'barbell row', 'y raise', 'farmer walk'],
  },

  // ── RHOMBOIDS ──────────────────────────────────────────
  {
    id: 'rhomboids',
    nameHr: 'Romboidni',
    nameEn: 'Rhomboids',
    bodyMapGroup: 'back',
    heads: [
      { id: 'rhomboid_minor', nameHr: 'Rhomboid minor', nameEn: 'Rhomboid Minor', nameLatin: 'Rhomboideus minor' },
      { id: 'rhomboid_major', nameHr: 'Rhomboid major', nameEn: 'Rhomboid Major', nameLatin: 'Rhomboideus major' },
    ],
    funFacts: [
      { textHr: 'Romboidni mišići povlače lopatice prema kralježnici — ključni za dobro držanje. Slabi romboidi = zaobljena leđa.', textEn: 'Rhomboids pull shoulder blades toward the spine — key for good posture. Weak rhomboids = rounded back.', category: 'anatomy' },
      { textHr: 'Nazvani po geometrijskom obliku romba — njihova vlakna tvore romboidni oblik između kralježnice i lopatice.', textEn: 'Named after the rhombus geometric shape — their fibers form a rhomboid shape between spine and scapula.', category: 'trivia' },
    ],
    unlockExercises: ['barbell row', 'cable row', 'face pull', 'reverse fly', 'chin up'],
  },

  // ── LATISSIMUS DORSI ───────────────────────────────────
  {
    id: 'latissimus',
    nameHr: 'Široki leđni',
    nameEn: 'Latissimus Dorsi',
    bodyMapGroup: 'back',
    heads: [
      { id: 'lat_vertebral', nameHr: 'Vertebralna vlakna', nameEn: 'Vertebral Fibers', nameLatin: 'Latissimus dorsi (pars vertebralis)' },
      { id: 'lat_iliac', nameHr: 'Ilijačna vlakna', nameEn: 'Iliac Fibers', nameLatin: 'Latissimus dorsi (pars iliaca)' },
      { id: 'lat_costal', nameHr: 'Rebarna vlakna', nameEn: 'Costal Fibers', nameLatin: 'Latissimus dorsi (pars costalis)' },
    ],
    funFacts: [
      { textHr: 'Latissimus dorsi = "najširi leđni" na latinskom. Jedini mišić koji spaja ruku s kralježnicom I zdjelicom — zato zgibovi rade cijeli gornji dio tijela.', textEn: 'Latissimus dorsi = "broadest back" in Latin. The only muscle connecting arm to spine AND pelvis — that\'s why pull-ups work the entire upper body.', category: 'anatomy' },
      { textHr: 'Latsi daju V-oblik tijela — široka leđa + uski struk. Plivači imaju najrazvijenije latse od svih sportaša.', textEn: 'Lats create the V-taper — wide back + narrow waist. Swimmers have the most developed lats of all athletes.', category: 'performance' },
      { textHr: 'Pull up i chin up aktiviraju latse gotovo identično prema EMG studijama — razlika u gripu mijenja samo uključenost bicepsa.', textEn: 'Pull-ups and chin-ups activate lats almost identically per EMG studies — grip difference only changes biceps involvement.', category: 'science' },
    ],
    unlockExercises: ['pull up', 'chin up', 'lat pulldown', 'barbell row', 'single arm row', 'pullover'],
  },

  // ── ROTATOR CUFF ───────────────────────────────────────
  {
    id: 'rotator_cuff',
    nameHr: 'Rotatorna manšeta',
    nameEn: 'Rotator Cuff',
    bodyMapGroup: 'shoulders',
    heads: [
      { id: 'infraspinatus', nameHr: 'Infraspinatus', nameEn: 'Infraspinatus', nameLatin: 'Infraspinatus' },
      { id: 'supraspinatus', nameHr: 'Supraspinatus', nameEn: 'Supraspinatus', nameLatin: 'Supraspinatus' },
      { id: 'teres_minor', nameHr: 'Teres minor', nameEn: 'Teres Minor', nameLatin: 'Teres minor' },
      { id: 'subscapularis', nameHr: 'Subscapularis', nameEn: 'Subscapularis', nameLatin: 'Subscapularis' },
    ],
    funFacts: [
      { textHr: '4 mišića rotatorne manšete tvore "manšetu" oko ramena — drže kuglu u ležištu. Ozljeda bilo kojeg = rameno nestabilno.', textEn: '4 rotator cuff muscles form a "cuff" around the shoulder — they keep the ball in the socket. Injury to any = unstable shoulder.', category: 'anatomy' },
      { textHr: 'Supraspinatus je najčešće ozlijeđeni mišić u tijelu — odgovoran za 50%+ svih operacija ramena.', textEn: 'Supraspinatus is the most commonly injured muscle — responsible for 50%+ of all shoulder surgeries.', category: 'science' },
      { textHr: 'Bejzbol pitcheri mogu baciti loptu 160+ km/h — rotatorna manšeta mora apsorbirati 300% tjelesne težine sile pri svakom bacanju.', textEn: 'Baseball pitchers can throw 160+ km/h — the rotator cuff must absorb 300% body weight force with each pitch.', category: 'performance' },
      { textHr: 'External rotation s elastičnom trakom je #1 preventivna vježba za rame — 5 min zagrijavanja smanjuje ozljede za 60%.', textEn: 'External rotation with a band is the #1 preventive shoulder exercise — 5 min warmup reduces injuries by 60%.', category: 'science' },
    ],
    unlockExercises: ['external rotation', 'face pull', 'band pull apart', 'cuban press'],
  },

  // ── ERECTOR SPINAE ─────────────────────────────────────
  {
    id: 'erector_spinae',
    nameHr: 'Paraspinalni',
    nameEn: 'Erector Spinae',
    bodyMapGroup: 'back',
    heads: [
      { id: 'iliocostalis', nameHr: 'Iliocostalis', nameEn: 'Iliocostalis', nameLatin: 'Iliocostalis' },
      { id: 'longissimus', nameHr: 'Longissimus', nameEn: 'Longissimus', nameLatin: 'Longissimus' },
      { id: 'spinalis', nameHr: 'Spinalis', nameEn: 'Spinalis', nameLatin: 'Spinalis' },
    ],
    funFacts: [
      { textHr: 'Erector spinae = "uspravljivač kralježnice". Bez njega bi se urušio naprijed — radi 24/7 dok stojiš ili sjediš.', textEn: 'Erector spinae = "spine erector". Without it you\'d collapse forward — it works 24/7 while you stand or sit.', category: 'anatomy' },
      { textHr: 'Deadlift je najefikasnija vježba za erector spinae — generira do 3x tjelesne težine kompresije na kralježnicu.', textEn: 'Deadlift is the most effective erector spinae exercise — it generates up to 3x body weight compression on the spine.', category: 'performance' },
      { textHr: '"Lower back pain" — 80% ljudi će ga iskusiti u životu. U 90% slučajeva uzrok su slabi erector spinae + prenapeti hip flexors.', textEn: '"Lower back pain" — 80% of people will experience it. In 90% of cases the cause is weak erector spinae + tight hip flexors.', category: 'science' },
    ],
    unlockExercises: ['deadlift', 'back extension', 'good morning', 'superman', 'romanian deadlift'],
  },

  // ── GLUTES ─────────────────────────────────────────────
  {
    id: 'glutes',
    nameHr: 'Stražnjica',
    nameEn: 'Glutes',
    bodyMapGroup: 'glutes',
    heads: [
      { id: 'glute_max', nameHr: 'Gluteus maximus', nameEn: 'Gluteus Maximus', nameLatin: 'Gluteus maximus' },
      { id: 'glute_med', nameHr: 'Gluteus medius', nameEn: 'Gluteus Medius', nameLatin: 'Gluteus medius' },
      { id: 'glute_min', nameHr: 'Gluteus minimus', nameEn: 'Gluteus Minimus', nameLatin: 'Gluteus minimus' },
    ],
    funFacts: [
      { textHr: 'Gluteus maximus je najveći mišić u tijelu. Bez njega ne bi mogao stajati uspravno — evolucijski razlog zašto ljudi imaju veću stražnjicu od majmuna.', textEn: 'Gluteus maximus is the largest muscle in the body. Without it you couldn\'t stand upright — the evolutionary reason humans have larger glutes than apes.', category: 'evolution' },
      { textHr: 'Gluteus medius je ključan za hodanje — kad staneš na jednu nogu, on sprečava da ti zdjelica padne na drugu stranu.', textEn: 'Gluteus medius is crucial for walking — when you stand on one leg, it prevents your pelvis from dropping to the other side.', category: 'anatomy' },
      { textHr: 'Hip thrust aktivira gluteus maximus 2x više nego čučanj — zato je Bret Contreras (aka "The Glute Guy") napravio karijeru na njemu.', textEn: 'Hip thrust activates gluteus maximus 2x more than squat — that\'s why Bret Contreras (aka "The Glute Guy") built his career on it.', category: 'science' },
      { textHr: '"Glutealna amnezija" je stvarni medicinski termin — dugotrajno sjedenje uzrokuje da mozak "zaboravi" aktivirati stražnjicu.', textEn: '"Gluteal amnesia" is a real medical term — prolonged sitting causes the brain to "forget" to activate the glutes.', category: 'science' },
    ],
    unlockExercises: ['hip thrust', 'squat', 'deadlift', 'glute bridge', 'lunge', 'step up', 'cable kickback'],
  },

  // ── HAMSTRINGS ─────────────────────────────────────────
  {
    id: 'hamstrings',
    nameHr: 'Hamstringsi',
    nameEn: 'Hamstrings',
    bodyMapGroup: 'hamstrings',
    heads: [
      { id: 'bicep_femoris_long', nameHr: 'Biceps femoris duga', nameEn: 'Biceps Femoris Long Head', nameLatin: 'Biceps femoris (caput longum)' },
      { id: 'bicep_femoris_short', nameHr: 'Biceps femoris kratka', nameEn: 'Biceps Femoris Short Head', nameLatin: 'Biceps femoris (caput breve)' },
      { id: 'semitendinosus', nameHr: 'Semitendinosus', nameEn: 'Semitendinosus', nameLatin: 'Semitendinosus' },
      { id: 'semimembranosus', nameHr: 'Semimembranosus', nameEn: 'Semimembranosus', nameLatin: 'Semimembranosus' },
    ],
    funFacts: [
      { textHr: '"Hamstring" dolazi od starog engleskog "ham" (bedro) + "string" (tetiva) — mesari su vješali svinjske butove za ove tetive.', textEn: '"Hamstring" comes from Old English "ham" (thigh) + "string" (tendon) — butchers hung pork legs by these tendons.', category: 'trivia' },
      { textHr: 'Hamstringsi prelaze 2 zgloba (kuk i koljeno) — zato su toliko osjetljivi na ozljede pri sprintu.', textEn: 'Hamstrings cross 2 joints (hip and knee) — that\'s why they\'re so susceptible to injury during sprinting.', category: 'anatomy' },
      { textHr: 'Nordic hamstring curl smanjuje ozljede hamstringsa za 51% prema meta-analizama — najbolja preventivna vježba.', textEn: 'Nordic hamstring curl reduces hamstring injuries by 51% per meta-analyses — the best preventive exercise.', category: 'science' },
      { textHr: 'Romanian deadlift cilja dugu glavu biceps femorisa, leg curl cilja kratku. Za kompletne hamstringse trebaš oboje.', textEn: 'Romanian deadlift targets biceps femoris long head, leg curl targets the short head. You need both for complete hamstrings.', category: 'performance' },
    ],
    unlockExercises: ['romanian deadlift', 'leg curl', 'nordic curl', 'good morning', 'stiff leg deadlift', 'glute ham raise'],
  },

  // ── CALVES ─────────────────────────────────────────────
  {
    id: 'calves',
    nameHr: 'Listovi',
    nameEn: 'Calves',
    bodyMapGroup: 'calves',
    heads: [
      { id: 'gastroc_medial', nameHr: 'Gastroc medijalna', nameEn: 'Gastrocnemius Medial', nameLatin: 'Gastrocnemius (caput mediale)' },
      { id: 'gastroc_lateral', nameHr: 'Gastroc lateralna', nameEn: 'Gastrocnemius Lateral', nameLatin: 'Gastrocnemius (caput laterale)' },
      { id: 'soleus', nameHr: 'Soleus', nameEn: 'Soleus', nameLatin: 'Soleus' },
    ],
    funFacts: [
      { textHr: 'Soleus je jedini mišić u tijelu dizajniran da radi satima bez umora — ima najviši postotak sporih vlakana (80%+). Zato možeš stajati cijeli dan.', textEn: 'Soleus is the only muscle designed to work for hours without fatigue — it has the highest slow-twitch fiber percentage (80%+). That\'s why you can stand all day.', category: 'anatomy' },
      { textHr: 'Gastrocnemius radi samo kad je koljeno ispruženo (standing calf raise). Soleus radi kad je koljeno savijeno (seated calf raise). Trebaš oboje.', textEn: 'Gastrocnemius only works when knee is straight (standing calf raise). Soleus works when knee is bent (seated calf raise). You need both.', category: 'science' },
      { textHr: 'Ahilova tetiva (spoj lista za petu) je najjača tetiva u tijelu — može izdržati silu od 1000+ kg. Ipak, najčešće puknuta tetiva kod sportaša.', textEn: 'Achilles tendon (calf-to-heel connection) is the strongest tendon — it can withstand 1000+ kg force. Yet, the most commonly ruptured tendon in athletes.', category: 'anatomy' },
      { textHr: 'Genetika listova je najjači faktor veličine — Arnold Schwarzenegger je javno priznavao da mu listovi nikad nisu rasli koliko je htio.', textEn: 'Calf genetics is the strongest size factor — Arnold Schwarzenegger publicly admitted his calves never grew as much as he wanted.', category: 'trivia' },
    ],
    unlockExercises: ['standing calf raise', 'seated calf raise', 'donkey calf raise', 'jump rope'],
  },
];

// ── COMPUTED HELPERS ──────────────────────────────────────

/** Total number of individual muscle heads */
export const TOTAL_HEADS = musclesDatabase.reduce((sum, g) => sum + g.heads.length, 0);

/** Flat list of all heads with parent group info */
export const allHeads = musclesDatabase.flatMap(g =>
  g.heads.map(h => ({ ...h, groupId: g.id, groupNameHr: g.nameHr, groupNameEn: g.nameEn, bodyMapGroup: g.bodyMapGroup }))
);

/** Get a random fun fact for a muscle group */
export function getRandomFunFact(groupId: string, locale: 'hr' | 'en' = 'hr'): string {
  const group = musclesDatabase.find(g => g.id === groupId);
  if (!group || group.funFacts.length === 0) return '';
  const fact = group.funFacts[Math.floor(Math.random() * group.funFacts.length)];
  return locale === 'hr' ? fact.textHr : fact.textEn;
}

/** Get all fun facts for a muscle group */
export function getFunFacts(groupId: string): FunFact[] {
  return musclesDatabase.find(g => g.id === groupId)?.funFacts || [];
}

/** Find which heads an exercise unlocks */
export function getUnlockedHeads(exerciseName: string): typeof allHeads {
  const name = exerciseName.toLowerCase();
  return musclesDatabase
    .filter(g => g.unlockExercises.some(e => name.includes(e.toLowerCase())))
    .flatMap(g => g.heads.map(h => ({ ...h, groupId: g.id, groupNameHr: g.nameHr, groupNameEn: g.nameEn, bodyMapGroup: g.bodyMapGroup })));
}

/** Get muscle group by body map key (e.g., 'chest' → pectoralis group) */
export function getGroupByBodyMapKey(key: string): MuscleGroup | undefined {
  return musclesDatabase.find(g => g.bodyMapGroup === key || g.id === key);
}

/** Get all groups that map to a body map key (e.g., 'core' → abs, obliques, serratus) */
export function getGroupsByBodyMapKey(key: string): MuscleGroup[] {
  return musclesDatabase.filter(g => g.bodyMapGroup === key);
}
