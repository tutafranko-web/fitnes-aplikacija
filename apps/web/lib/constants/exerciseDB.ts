/**
 * Comprehensive Exercise Database
 * 200+ exercises with muscle targets, equipment, difficulty, animation data
 */

export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'forearms' | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'core' | 'traps' | 'full_body';
export type Equipment = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'kettlebell' | 'band' | 'trx' | 'pullup_bar' | 'bench' | 'none';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ExerciseInfo {
  id: string;
  name: string;
  nameHr: string;
  primary: MuscleGroup[];
  secondary: MuscleGroup[];
  equipment: Equipment[];
  difficulty: Difficulty;
  category: string; // push, pull, legs, core, cardio, plyometric, stretch
  defaultSets: number;
  defaultReps: string;
  defaultRest: number; // seconds
  injuryCaution?: string[]; // injury IDs where caution needed
  injuryAvoid?: string[];  // injury IDs where exercise should be avoided
  instructions: { hr: string; en: string };
  tips: { hr: string; en: string };
  // Animation keyframes: body part positions at key points (optional for extended DB)
  animation?: ExerciseAnimation;
}

export interface ExerciseAnimation {
  type: 'upper' | 'lower' | 'full' | 'core' | 'cardio';
  frames: AnimFrame[];
  tempo: string;
}

export interface AnimFrame {
  torsoAngle: number;
  armAngle: number;
  legAngle: number;
  label?: string;
}

// Simplified exercise type without animation (for extended DB)
export interface ExerciseCompact {
  id: string;
  name: string;
  nameHr: string;
  primary: string[];
  secondary: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  defaultSets: number;
  defaultReps: string;
  defaultRest: number;
  injuryCaution?: string[];
  injuryAvoid?: string[];
  instructions: { hr: string; en: string };
  tips: { hr: string; en: string };
}

// ==========================================
// EXERCISE DATABASE
// ==========================================

export const exercises: ExerciseInfo[] = [
  // ========== CHEST ==========
  {
    id: 'bench_press', name: 'Barbell Bench Press', nameHr: 'Bench Press (ravna klupa)',
    primary: ['chest'], secondary: ['triceps', 'shoulders'],
    equipment: ['barbell', 'bench'], difficulty: 'intermediate', category: 'push',
    defaultSets: 4, defaultReps: '8-10', defaultRest: 90,
    injuryCaution: ['shoulder_rotator', 'shoulder_impingement'],
    instructions: { hr: 'Legni na klupu, noge na podu. Šipku spusti do prsa (sredina), gurnì gore do pune ekstenzije. Lopatice stegnute, leđa blago savijena.', en: 'Lie on bench, feet on floor. Lower bar to mid-chest, press up to full extension. Shoulder blades retracted, slight arch.' },
    tips: { hr: 'Ne odbijaš šipku od prsa. Kontrolirano spuštanje 2-3 sekunde.', en: "Don't bounce bar off chest. Controlled 2-3 second descent." },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 0, label: 'Start' }, { torsoAngle: 0, armAngle: 90, legAngle: 0, label: 'Down' }, { torsoAngle: 0, armAngle: 0, legAngle: 0, label: 'Up' }], tempo: '2-1-1-0' },
  },
  {
    id: 'incline_db_press', name: 'Incline Dumbbell Press', nameHr: 'Kosi DB Press',
    primary: ['chest'], secondary: ['shoulders', 'triceps'],
    equipment: ['dumbbell', 'bench'], difficulty: 'intermediate', category: 'push',
    defaultSets: 3, defaultReps: '10-12', defaultRest: 75,
    injuryCaution: ['shoulder_rotator'],
    instructions: { hr: 'Klupa na 30-45°. Bučice iznad ramena, spusti do razine prsa, gurnì gore.', en: 'Bench at 30-45°. Dumbbells above shoulders, lower to chest level, press up.' },
    tips: { hr: 'Ne idi preširoko — čuvaj ramena. Stisni prsa na vrhu.', en: "Don't go too wide — protect shoulders. Squeeze chest at top." },
    animation: { type: 'upper', frames: [{ torsoAngle: 30, armAngle: 0, legAngle: 0 }, { torsoAngle: 30, armAngle: 80, legAngle: 0 }, { torsoAngle: 30, armAngle: 0, legAngle: 0 }], tempo: '2-0-1-1' },
  },
  {
    id: 'cable_fly', name: 'Cable Fly', nameHr: 'Cable Fly (križanje kablova)',
    primary: ['chest'], secondary: [],
    equipment: ['cable'], difficulty: 'beginner', category: 'push',
    defaultSets: 3, defaultReps: '12-15', defaultRest: 60,
    instructions: { hr: 'Stani između kablova, lagani nagib naprijed. Ruke šire, dovedi ih zajedno ispred prsa u luku.', en: 'Stand between cables, slight forward lean. Arms wide, bring together in front of chest in arc.' },
    tips: { hr: 'Misli na "grljenje drveta". Stisni prsa u kontrakciji.', en: 'Think "hugging a tree". Squeeze chest at contraction.' },
    animation: { type: 'upper', frames: [{ torsoAngle: 15, armAngle: 90, legAngle: 0 }, { torsoAngle: 15, armAngle: 10, legAngle: 0 }, { torsoAngle: 15, armAngle: 90, legAngle: 0 }], tempo: '2-1-2-0' },
  },
  {
    id: 'pushup', name: 'Push-up', nameHr: 'Sklekovi',
    primary: ['chest'], secondary: ['triceps', 'shoulders', 'core'],
    equipment: ['bodyweight', 'none'], difficulty: 'beginner', category: 'push',
    defaultSets: 3, defaultReps: '15-20', defaultRest: 45,
    instructions: { hr: 'Ruke šire od ramena, tijelo ravno kao daska. Spusti prsa do poda, gurnì gore.', en: 'Hands wider than shoulders, body straight as plank. Lower chest to floor, push up.' },
    tips: { hr: 'Core stegnut! Ne spuštaj kukove. Laktovi 45° od tijela.', en: "Core tight! Don't drop hips. Elbows 45° from body." },
    animation: { type: 'full', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 90, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }], tempo: '2-0-1-0' },
  },
  {
    id: 'dips', name: 'Dips', nameHr: 'Dipovi (paralelne)',
    primary: ['chest', 'triceps'], secondary: ['shoulders'],
    equipment: ['bodyweight'], difficulty: 'intermediate', category: 'push',
    defaultSets: 3, defaultReps: '8-12', defaultRest: 75,
    injuryCaution: ['shoulder_rotator', 'shoulder_impingement'],
    instructions: { hr: 'Nagni se naprijed za prsa, ravno za triceps. Spusti se dok nadlaktice nisu paralelne s podom.', en: 'Lean forward for chest, upright for triceps. Lower until upper arms parallel to floor.' },
    tips: { hr: 'Kontrolirano! Ne idi preduboko ako imaš problema s ramenima.', en: "Controlled! Don't go too deep if shoulder issues." },
    animation: { type: 'upper', frames: [{ torsoAngle: 10, armAngle: 0, legAngle: 20 }, { torsoAngle: 20, armAngle: 90, legAngle: 20 }, { torsoAngle: 10, armAngle: 0, legAngle: 20 }], tempo: '2-0-1-1' },
  },
  {
    id: 'db_fly', name: 'Dumbbell Fly', nameHr: 'Bučice Fly (ravna klupa)',
    primary: ['chest'], secondary: [],
    equipment: ['dumbbell', 'bench'], difficulty: 'beginner', category: 'push',
    defaultSets: 3, defaultReps: '12-15', defaultRest: 60,
    injuryCaution: ['shoulder_rotator'],
    instructions: { hr: 'Legni na klupu, bučice gore. Spusti ruke u stranu u luku (lagano savijeni laktovi), vrati gore.', en: 'Lie on bench, dumbbells up. Lower arms to sides in arc (slightly bent elbows), return up.' },
    tips: { hr: 'Zamislì da grljiš veliko drvo. Laktovi uvijek blago savijeni.', en: 'Imagine hugging a big tree. Elbows always slightly bent.' },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 85, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }], tempo: '3-1-2-0' },
  },

  // ========== BACK ==========
  {
    id: 'deadlift', name: 'Conventional Deadlift', nameHr: 'Mrtvo dizanje',
    primary: ['back', 'hamstrings', 'glutes'], secondary: ['traps', 'forearms', 'core'],
    equipment: ['barbell'], difficulty: 'advanced', category: 'pull',
    defaultSets: 4, defaultReps: '5-6', defaultRest: 120,
    injuryAvoid: ['lower_back', 'disc_herniation'],
    injuryCaution: ['knee_general'],
    instructions: { hr: 'Stopala u širini kukova. Šipka nad sredinom stopala. Savij se u kukovima, ravna leđa, hvataj šipku. Guraj pod nogama, šipka klizi uz noge.', en: 'Feet hip-width. Bar over mid-foot. Hinge at hips, flat back, grip bar. Push floor away, bar slides up legs.' },
    tips: { hr: 'NIKAD zaokružena leđa! "Prsa gore, kukovi nazad" je mantru. Šipka uvijek uz tijelo.', en: 'NEVER round back! "Chest up, hips back" is the mantra. Bar always close to body.' },
    animation: { type: 'full', frames: [{ torsoAngle: 70, armAngle: 0, legAngle: 60 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 70, armAngle: 0, legAngle: 60 }], tempo: '1-0-3-1' },
  },
  {
    id: 'pullup', name: 'Pull-up', nameHr: 'Zgibovi',
    primary: ['back', 'biceps'], secondary: ['forearms', 'core'],
    equipment: ['pullup_bar', 'bodyweight'], difficulty: 'intermediate', category: 'pull',
    defaultSets: 4, defaultReps: '6-10', defaultRest: 90,
    instructions: { hr: 'Širi hvat (šire od ramena). Povuci se gore dok brada ne bude iznad šipke. Kontrolirano spusti.', en: 'Wide grip (wider than shoulders). Pull up until chin over bar. Lower with control.' },
    tips: { hr: 'Počni iz mrtvog visa. Lopatice stegnì dolje prije povlačenja.', en: 'Start from dead hang. Pull shoulder blades down before pulling.' },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 180, legAngle: 0 }, { torsoAngle: 0, armAngle: 30, legAngle: 0 }, { torsoAngle: 0, armAngle: 180, legAngle: 0 }], tempo: '1-1-3-0' },
  },
  {
    id: 'barbell_row', name: 'Barbell Row', nameHr: 'Veslanje šipkom',
    primary: ['back'], secondary: ['biceps', 'traps'],
    equipment: ['barbell'], difficulty: 'intermediate', category: 'pull',
    defaultSets: 3, defaultReps: '8-10', defaultRest: 75,
    injuryCaution: ['lower_back'],
    instructions: { hr: 'Nagni se 45° naprijed, ravna leđa. Povuci šipku prema donjem dijelu prsa/trbuhu. Stisni lopatice.', en: 'Lean 45° forward, flat back. Pull bar to lower chest/belly. Squeeze shoulder blades.' },
    tips: { hr: 'Ne koristi momentum! Tijelo mirno, samo ruke rade.', en: "Don't use momentum! Body still, only arms work." },
    animation: { type: 'upper', frames: [{ torsoAngle: 45, armAngle: 0, legAngle: 20 }, { torsoAngle: 45, armAngle: 90, legAngle: 20 }, { torsoAngle: 45, armAngle: 0, legAngle: 20 }], tempo: '1-1-2-0' },
  },
  {
    id: 'lat_pulldown', name: 'Lat Pulldown', nameHr: 'Lat Pulldown',
    primary: ['back'], secondary: ['biceps'],
    equipment: ['cable', 'machine'], difficulty: 'beginner', category: 'pull',
    defaultSets: 3, defaultReps: '10-12', defaultRest: 60,
    instructions: { hr: 'Široki hvat, sjedi ravno. Povuci šipku do gornjeg dijela prsa. Stisni leđa.', en: 'Wide grip, sit tall. Pull bar to upper chest. Squeeze back.' },
    tips: { hr: 'Ne povlači iza glave! Prsa gore, laktovi dolje i nazad.', en: "Don't pull behind head! Chest up, elbows down and back." },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 170, legAngle: 90 }, { torsoAngle: 5, armAngle: 40, legAngle: 90 }, { torsoAngle: 0, armAngle: 170, legAngle: 90 }], tempo: '1-1-2-0' },
  },
  {
    id: 'seated_row', name: 'Seated Cable Row', nameHr: 'Sjedeće veslanje',
    primary: ['back'], secondary: ['biceps', 'traps'],
    equipment: ['cable', 'machine'], difficulty: 'beginner', category: 'pull',
    defaultSets: 3, defaultReps: '10-12', defaultRest: 60,
    instructions: { hr: 'Sjedi ravno, noge na osloncu. Povuci ručku prema trbuhu, stisni lopatice.', en: 'Sit tall, feet on platform. Pull handle to belly, squeeze shoulder blades.' },
    tips: { hr: 'Ne naginjì se nazad! Tijelo stabilno, radi leđima.', en: "Don't lean back! Body stable, work with back." },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 10 }, { torsoAngle: 0, armAngle: 90, legAngle: 10 }, { torsoAngle: 0, armAngle: 0, legAngle: 10 }], tempo: '1-1-2-0' },
  },
  {
    id: 'face_pull', name: 'Face Pull', nameHr: 'Face Pull',
    primary: ['shoulders', 'back'], secondary: ['traps'],
    equipment: ['cable', 'band'], difficulty: 'beginner', category: 'pull',
    defaultSets: 3, defaultReps: '15-20', defaultRest: 45,
    instructions: { hr: 'Kabel na visini glave. Povuci prema licu, ruke se razdvoje u krajnjoj poziciji. Stisni lopatice.', en: 'Cable at face height. Pull toward face, hands separate at end position. Squeeze shoulder blades.' },
    tips: { hr: 'Odlična vježba za posturalnu korekciju. Radi ovo svaki trening!', en: 'Great exercise for postural correction. Do this every workout!' },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 80, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }], tempo: '1-2-2-0' },
  },
  {
    id: 'db_row', name: 'Single-Arm Dumbbell Row', nameHr: 'Jednoručno veslanje bučicom',
    primary: ['back'], secondary: ['biceps'],
    equipment: ['dumbbell', 'bench'], difficulty: 'beginner', category: 'pull',
    defaultSets: 3, defaultReps: '10-12', defaultRest: 60,
    instructions: { hr: 'Jedna ruka i koljeno na klupi. Povuci bučicu prema boku. Stisni lopaticu.', en: 'One hand and knee on bench. Pull dumbbell to hip. Squeeze shoulder blade.' },
    tips: { hr: 'Ne rotiraj torzo! Povlači laktom, ne rukom.', en: "Don't rotate torso! Pull with elbow, not hand." },
    animation: { type: 'upper', frames: [{ torsoAngle: 45, armAngle: 0, legAngle: 30 }, { torsoAngle: 45, armAngle: 90, legAngle: 30 }, { torsoAngle: 45, armAngle: 0, legAngle: 30 }], tempo: '1-1-2-0' },
  },

  // ========== SHOULDERS ==========
  {
    id: 'ohp', name: 'Overhead Press', nameHr: 'Potisak iznad glave',
    primary: ['shoulders'], secondary: ['triceps', 'core'],
    equipment: ['barbell'], difficulty: 'intermediate', category: 'push',
    defaultSets: 4, defaultReps: '6-8', defaultRest: 90,
    injuryAvoid: ['shoulder_impingement'],
    injuryCaution: ['shoulder_rotator', 'lower_back'],
    instructions: { hr: 'Šipka na prednjoj strani ramena. Gurnì ravno gore iznad glave. Zaključaj ruke na vrhu.', en: 'Bar at front of shoulders. Press straight up overhead. Lock arms at top.' },
    tips: { hr: 'Stegni gluteuse i core! Glava se miče naprijed kad šipka prođe.', en: 'Squeeze glutes and core! Head moves forward as bar passes.' },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 90, legAngle: 0 }, { torsoAngle: 0, armAngle: 180, legAngle: 0 }, { torsoAngle: 0, armAngle: 90, legAngle: 0 }], tempo: '1-1-2-0' },
  },
  {
    id: 'lateral_raise', name: 'Lateral Raise', nameHr: 'Bočna podizanja',
    primary: ['shoulders'], secondary: [],
    equipment: ['dumbbell'], difficulty: 'beginner', category: 'push',
    defaultSets: 3, defaultReps: '12-15', defaultRest: 45,
    instructions: { hr: 'Bučice uz tijelo. Podignì ruke u stranu do visine ramena. Mali prsti lagano okrenuti gore.', en: 'Dumbbells at sides. Raise arms to sides to shoulder height. Pinkies slightly turned up.' },
    tips: { hr: 'Ne baci — kontrolirano! Laktovi lagano savijeni.', en: "Don't swing — controlled! Elbows slightly bent." },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 90, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }], tempo: '2-1-2-0' },
  },
  {
    id: 'reverse_fly', name: 'Reverse Fly', nameHr: 'Obratne bučice fly',
    primary: ['shoulders'], secondary: ['back', 'traps'],
    equipment: ['dumbbell'], difficulty: 'beginner', category: 'pull',
    defaultSets: 3, defaultReps: '12-15', defaultRest: 45,
    instructions: { hr: 'Nagnì se naprijed 45°, bučice vise. Podignì ruke u stranu, stisni lopatice.', en: 'Lean forward 45°, dumbbells hang. Raise arms to sides, squeeze shoulder blades.' },
    tips: { hr: 'Mali prsti gore! Fokus na stražnji deltoid.', en: 'Pinkies up! Focus on rear deltoid.' },
    animation: { type: 'upper', frames: [{ torsoAngle: 45, armAngle: 0, legAngle: 10 }, { torsoAngle: 45, armAngle: 80, legAngle: 10 }, { torsoAngle: 45, armAngle: 0, legAngle: 10 }], tempo: '2-1-2-0' },
  },
  {
    id: 'arnold_press', name: 'Arnold Press', nameHr: 'Arnold Press',
    primary: ['shoulders'], secondary: ['triceps'],
    equipment: ['dumbbell'], difficulty: 'intermediate', category: 'push',
    defaultSets: 3, defaultReps: '10-12', defaultRest: 75,
    injuryCaution: ['shoulder_impingement'],
    instructions: { hr: 'Bučice ispred lica, dlanovi prema tebi. Rotiraj i gurnì gore dok dlanovi ne budu od tebe.', en: 'Dumbbells in front of face, palms facing you. Rotate and press up until palms face away.' },
    tips: { hr: 'Glatka rotacija! Obuhvaća sve tri glave deltoida.', en: 'Smooth rotation! Hits all three delt heads.' },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 90, legAngle: 0 }, { torsoAngle: 0, armAngle: 170, legAngle: 0 }, { torsoAngle: 0, armAngle: 90, legAngle: 0 }], tempo: '2-0-2-0' },
  },

  // ========== ARMS ==========
  {
    id: 'barbell_curl', name: 'Barbell Curl', nameHr: 'Biceps pregib šipkom',
    primary: ['biceps'], secondary: ['forearms'],
    equipment: ['barbell'], difficulty: 'beginner', category: 'pull',
    defaultSets: 3, defaultReps: '10-12', defaultRest: 60,
    instructions: { hr: 'Šipka u rukama, laktovi uz tijelo. Savij ruke gore, stisni biceps na vrhu.', en: 'Bar in hands, elbows at sides. Curl up, squeeze biceps at top.' },
    tips: { hr: 'Laktovi se ne miču! Tijelo mirno, bez swinga.', en: "Elbows don't move! Body still, no swinging." },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 140, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }], tempo: '2-1-2-0' },
  },
  {
    id: 'hammer_curl', name: 'Hammer Curl', nameHr: 'Hammer Curl',
    primary: ['biceps'], secondary: ['forearms'],
    equipment: ['dumbbell'], difficulty: 'beginner', category: 'pull',
    defaultSets: 3, defaultReps: '10-12', defaultRest: 60,
    instructions: { hr: 'Bučice uz tijelo, dlanovi prema unutra (neutralni hvat). Savij gore.', en: 'Dumbbells at sides, palms facing in (neutral grip). Curl up.' },
    tips: { hr: 'Odlično za brachialis i brachioradialis — daje "širinu" rukama.', en: 'Great for brachialis and brachioradialis — gives arm "width".' },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 130, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }], tempo: '2-1-2-0' },
  },
  {
    id: 'tricep_pushdown', name: 'Tricep Pushdown', nameHr: 'Triceps pushdown',
    primary: ['triceps'], secondary: [],
    equipment: ['cable'], difficulty: 'beginner', category: 'push',
    defaultSets: 3, defaultReps: '12-15', defaultRest: 60,
    instructions: { hr: 'Laktovi uz tijelo, gurnì ručku dolje do pune ekstenzije. Stisni triceps.', en: 'Elbows at sides, push handle down to full extension. Squeeze triceps.' },
    tips: { hr: 'Samo podlaktice se kreću! Gornji dio ruke miran.', en: 'Only forearms move! Upper arms stay still.' },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 90, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 90, legAngle: 0 }], tempo: '1-1-2-0' },
  },
  {
    id: 'overhead_ext', name: 'Overhead Tricep Extension', nameHr: 'Triceps ekstenzija iznad glave',
    primary: ['triceps'], secondary: [],
    equipment: ['dumbbell', 'cable'], difficulty: 'beginner', category: 'push',
    defaultSets: 3, defaultReps: '10-12', defaultRest: 60,
    instructions: { hr: 'Bučicu drži iznad glave s obje ruke. Spusti iza glave savijajući laktove, vrati gore.', en: 'Hold dumbbell overhead with both hands. Lower behind head bending elbows, return up.' },
    tips: { hr: 'Laktovi pokazuju naprijed, ne u stranu!', en: 'Elbows point forward, not sideways!' },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 180, legAngle: 0 }, { torsoAngle: 0, armAngle: 90, legAngle: 0 }, { torsoAngle: 0, armAngle: 180, legAngle: 0 }], tempo: '2-0-1-1' },
  },
  {
    id: 'skull_crusher', name: 'Skull Crusher', nameHr: 'Skull Crusher (ležeći triceps)',
    primary: ['triceps'], secondary: [],
    equipment: ['barbell', 'bench'], difficulty: 'intermediate', category: 'push',
    defaultSets: 3, defaultReps: '10-12', defaultRest: 60,
    injuryCaution: ['elbow_tennis', 'elbow_golfer'],
    instructions: { hr: 'Legni na klupu, EZ šipka iznad glave. Spusti prema čelu savijajući laktove, vrati gore.', en: 'Lie on bench, EZ bar above head. Lower toward forehead bending elbows, return up.' },
    tips: { hr: 'Laktovi mirni! Spuštaj do čela ili malo iza za veći stretch.', en: 'Elbows still! Lower to forehead or slightly behind for bigger stretch.' },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 180, legAngle: 0 }, { torsoAngle: 0, armAngle: 90, legAngle: 0 }, { torsoAngle: 0, armAngle: 180, legAngle: 0 }], tempo: '2-0-1-1' },
  },
  {
    id: 'preacher_curl', name: 'Preacher Curl', nameHr: 'Preacher Curl',
    primary: ['biceps'], secondary: [],
    equipment: ['barbell', 'dumbbell', 'machine'], difficulty: 'beginner', category: 'pull',
    defaultSets: 3, defaultReps: '10-12', defaultRest: 60,
    instructions: { hr: 'Nadlaktice na preacher klupi. Curl gore, kontrolirano spusti.', en: 'Upper arms on preacher bench. Curl up, lower with control.' },
    tips: { hr: 'Potpuna ekstenzija na dnu! Bez momentum.', en: 'Full extension at bottom! No momentum.' },
    animation: { type: 'upper', frames: [{ torsoAngle: 20, armAngle: 0, legAngle: 90 }, { torsoAngle: 20, armAngle: 130, legAngle: 90 }, { torsoAngle: 20, armAngle: 0, legAngle: 90 }], tempo: '2-1-3-0' },
  },
  {
    id: 'wrist_curl', name: 'Wrist Curl', nameHr: 'Pregib zapešća',
    primary: ['forearms'], secondary: [],
    equipment: ['barbell', 'dumbbell'], difficulty: 'beginner', category: 'pull',
    defaultSets: 3, defaultReps: '15-20', defaultRest: 45,
    instructions: { hr: 'Podlaktice na klupi, zapešća vise. Savij zapešće gore.', en: 'Forearms on bench, wrists hanging. Curl wrists up.' },
    tips: { hr: 'Lagane težine, visoke ponavljanja!', en: 'Light weights, high reps!' },
    animation: { type: 'upper', frames: [{ torsoAngle: 30, armAngle: 0, legAngle: 90 }, { torsoAngle: 30, armAngle: 30, legAngle: 90 }, { torsoAngle: 30, armAngle: 0, legAngle: 90 }], tempo: '1-1-2-0' },
  },

  // ========== LEGS ==========
  {
    id: 'squat', name: 'Barbell Back Squat', nameHr: 'Čučanj sa šipkom',
    primary: ['quads', 'glutes'], secondary: ['hamstrings', 'core'],
    equipment: ['barbell'], difficulty: 'intermediate', category: 'legs',
    defaultSets: 4, defaultReps: '6-8', defaultRest: 120,
    injuryCaution: ['knee_general', 'knee_acl', 'lower_back'],
    instructions: { hr: 'Šipka na gornjim trapezima. Noge u širini ramena. Čučni dok kukovi ne budu ispod koljena. Gurnì gore.', en: 'Bar on upper traps. Feet shoulder-width. Squat until hips below knees. Drive up.' },
    tips: { hr: 'Koljena prate prste! Prsa gore, leđa ravna, kuk nazad.', en: 'Knees track toes! Chest up, back flat, hips back.' },
    animation: { type: 'lower', frames: [{ torsoAngle: 0, armAngle: 90, legAngle: 0 }, { torsoAngle: 30, armAngle: 90, legAngle: 100 }, { torsoAngle: 0, armAngle: 90, legAngle: 0 }], tempo: '2-1-1-0' },
  },
  {
    id: 'leg_press', name: 'Leg Press', nameHr: 'Leg Press',
    primary: ['quads', 'glutes'], secondary: ['hamstrings'],
    equipment: ['machine'], difficulty: 'beginner', category: 'legs',
    defaultSets: 3, defaultReps: '10-12', defaultRest: 90,
    instructions: { hr: 'Leđa ravno na naslonu. Noge na platformi u širini ramena. Gurnì gore, ne zaključavaj koljena.', en: 'Back flat on pad. Feet shoulder-width on platform. Press up, don\'t lock knees.' },
    tips: { hr: 'Šira stopala = više gluteusa. Viša pozicija = više hamstringsa.', en: 'Wider feet = more glutes. Higher placement = more hamstrings.' },
    animation: { type: 'lower', frames: [{ torsoAngle: 45, armAngle: 0, legAngle: 90 }, { torsoAngle: 45, armAngle: 0, legAngle: 10 }, { torsoAngle: 45, armAngle: 0, legAngle: 90 }], tempo: '2-0-1-1' },
  },
  {
    id: 'rdl', name: 'Romanian Deadlift', nameHr: 'Rumunjsko mrtvo dizanje',
    primary: ['hamstrings', 'glutes'], secondary: ['back'],
    equipment: ['barbell', 'dumbbell'], difficulty: 'intermediate', category: 'legs',
    defaultSets: 3, defaultReps: '10-12', defaultRest: 75,
    injuryCaution: ['lower_back'],
    instructions: { hr: 'Šipka ispred tijela, koljena minimalno savijena. Nagni se naprijed gurajući kuk nazad. Osjetì stretch u hamstringsima.', en: 'Bar in front of body, knees slightly bent. Lean forward pushing hips back. Feel hamstring stretch.' },
    tips: { hr: 'Leđa RAVNA cijelo vrijeme! Šipka klizi uz noge. Stop kad osjetiš stretch.', en: 'Back FLAT entire time! Bar slides down legs. Stop when you feel stretch.' },
    animation: { type: 'full', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 10 }, { torsoAngle: 60, armAngle: 0, legAngle: 15 }, { torsoAngle: 0, armAngle: 0, legAngle: 10 }], tempo: '3-1-1-0' },
  },
  {
    id: 'lunge', name: 'Walking Lunge', nameHr: 'Iskoraci u hodu',
    primary: ['quads', 'glutes'], secondary: ['hamstrings', 'core'],
    equipment: ['bodyweight', 'dumbbell'], difficulty: 'beginner', category: 'legs',
    defaultSets: 3, defaultReps: '12/leg', defaultRest: 60,
    injuryCaution: ['knee_general'],
    instructions: { hr: 'Veliki korak naprijed, spusti stražnje koljeno prema podu. Gurnì se naprijed u sljedeći korak.', en: 'Big step forward, lower back knee toward floor. Push forward into next step.' },
    tips: { hr: 'Prednje koljeno ne prelazi prste! Torzo uspravan.', en: "Front knee doesn't pass toes! Torso upright." },
    animation: { type: 'lower', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 90 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }], tempo: '1-0-1-0' },
  },
  {
    id: 'leg_curl', name: 'Lying Leg Curl', nameHr: 'Leg Curl (ležeći)',
    primary: ['hamstrings'], secondary: [],
    equipment: ['machine'], difficulty: 'beginner', category: 'legs',
    defaultSets: 3, defaultReps: '10-12', defaultRest: 60,
    instructions: { hr: 'Legni na trbuh na spravi. Savij noge gore prema gluteusima.', en: 'Lie face down on machine. Curl legs up toward glutes.' },
    tips: { hr: 'Stisni na vrhu! Ne koristi momentum.', en: 'Squeeze at top! Don\'t use momentum.' },
    animation: { type: 'lower', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 120 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }], tempo: '1-1-2-0' },
  },
  {
    id: 'leg_ext', name: 'Leg Extension', nameHr: 'Leg Extension',
    primary: ['quads'], secondary: [],
    equipment: ['machine'], difficulty: 'beginner', category: 'legs',
    defaultSets: 3, defaultReps: '12-15', defaultRest: 60,
    injuryCaution: ['knee_acl', 'knee_general'],
    instructions: { hr: 'Sjedi na spravi, jastuk na gležnjevima. Ispruži noge ravno.', en: 'Sit on machine, pad on ankles. Extend legs straight.' },
    tips: { hr: 'Stisni quadriceps na vrhu! Kontrolirano spuštanje.', en: 'Squeeze quads at top! Controlled lowering.' },
    animation: { type: 'lower', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 90 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 90 }], tempo: '1-2-2-0' },
  },
  {
    id: 'calf_raise', name: 'Standing Calf Raise', nameHr: 'Podizanje na prste (stojeće)',
    primary: ['calves'], secondary: [],
    equipment: ['machine', 'bodyweight'], difficulty: 'beginner', category: 'legs',
    defaultSets: 4, defaultReps: '15-20', defaultRest: 45,
    instructions: { hr: 'Stani na rub stepenice, pete vise. Podignì se na prste što više, spusti ispod razine.', en: 'Stand on step edge, heels hanging. Rise up on toes as high as possible, lower below level.' },
    tips: { hr: 'Puni ROM! Pauza na vrhu 1 sekunda. Sporo spuštanje.', en: 'Full ROM! Pause at top 1 second. Slow lowering.' },
    animation: { type: 'lower', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: -10 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }], tempo: '1-1-2-0' },
  },
  {
    id: 'hip_thrust', name: 'Barbell Hip Thrust', nameHr: 'Hip Thrust sa šipkom',
    primary: ['glutes'], secondary: ['hamstrings'],
    equipment: ['barbell', 'bench'], difficulty: 'intermediate', category: 'legs',
    defaultSets: 3, defaultReps: '10-12', defaultRest: 75,
    instructions: { hr: 'Leđa na klupi, šipka na kukovima. Gurnì kukove gore dok tijelo ne bude ravno. Stisni gluteuse na vrhu.', en: 'Back against bench, bar on hips. Drive hips up until body is straight. Squeeze glutes at top.' },
    tips: { hr: 'Brada na prsima! Ne presavijaj leđa — pokreni kuk.', en: "Chin to chest! Don't arch back — drive hips." },
    animation: { type: 'lower', frames: [{ torsoAngle: 45, armAngle: 0, legAngle: 90 }, { torsoAngle: 0, armAngle: 0, legAngle: 90 }, { torsoAngle: 45, armAngle: 0, legAngle: 90 }], tempo: '1-2-2-0' },
  },
  {
    id: 'bulgarian_split', name: 'Bulgarian Split Squat', nameHr: 'Bugarski split čučanj',
    primary: ['quads', 'glutes'], secondary: ['hamstrings', 'core'],
    equipment: ['dumbbell', 'bodyweight', 'bench'], difficulty: 'intermediate', category: 'legs',
    defaultSets: 3, defaultReps: '10/leg', defaultRest: 75,
    injuryCaution: ['knee_general'],
    instructions: { hr: 'Stražnja noga na klupi. Spusti se dok prednji quadriceps nije paralelan s podom.', en: 'Back foot on bench. Lower until front quad is parallel to floor.' },
    tips: { hr: 'Torzo uspravno! Većina težine na prednjoj nozi.', en: 'Torso upright! Most weight on front foot.' },
    animation: { type: 'lower', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 10 }, { torsoAngle: 5, armAngle: 0, legAngle: 90 }, { torsoAngle: 0, armAngle: 0, legAngle: 10 }], tempo: '2-0-1-0' },
  },

  // ========== CORE ==========
  {
    id: 'plank', name: 'Plank', nameHr: 'Plank (daska)',
    primary: ['core'], secondary: ['shoulders'],
    equipment: ['bodyweight', 'none'], difficulty: 'beginner', category: 'core',
    defaultSets: 3, defaultReps: '30-60s', defaultRest: 45,
    instructions: { hr: 'Na podlakticama i prstima. Tijelo ravno kao daska od glave do pete.', en: 'On forearms and toes. Body straight as board from head to heels.' },
    tips: { hr: 'Stisni gluteuse! Ne spuštaj kukove, ne diži stražnjicu.', en: "Squeeze glutes! Don't drop hips, don't raise butt." },
    animation: { type: 'core', frames: [{ torsoAngle: 0, armAngle: 90, legAngle: 0 }], tempo: 'hold' },
  },
  {
    id: 'hanging_leg_raise', name: 'Hanging Leg Raise', nameHr: 'Podizanje nogu u visu',
    primary: ['core'], secondary: ['forearms'],
    equipment: ['pullup_bar'], difficulty: 'intermediate', category: 'core',
    defaultSets: 3, defaultReps: '10-15', defaultRest: 60,
    instructions: { hr: 'Visi na šipki. Podignì ravne noge do horizontale (ili koljena do prsa za lakšu varijantu).', en: 'Hang from bar. Raise straight legs to horizontal (or knees to chest for easier version).' },
    tips: { hr: 'Ne ljuljai se! Kontrolirano, fokus na donji trbuh.', en: "Don't swing! Controlled, focus on lower abs." },
    animation: { type: 'core', frames: [{ torsoAngle: 0, armAngle: 180, legAngle: 0 }, { torsoAngle: 0, armAngle: 180, legAngle: 90 }, { torsoAngle: 0, armAngle: 180, legAngle: 0 }], tempo: '1-1-2-0' },
  },
  {
    id: 'russian_twist', name: 'Russian Twist', nameHr: 'Ruski zaokret',
    primary: ['core'], secondary: [],
    equipment: ['bodyweight', 'dumbbell'], difficulty: 'beginner', category: 'core',
    defaultSets: 3, defaultReps: '20 (10/strana)', defaultRest: 45,
    instructions: { hr: 'Sjedi, noge podignute, nagni torzo natrag 45°. Rotiraj lijevo-desno dodirujući pod.', en: 'Sit, legs raised, lean torso back 45°. Rotate left-right touching floor.' },
    tips: { hr: 'Rotiraj iz trbuha, ne samo rukama!', en: 'Rotate from abs, not just arms!' },
    animation: { type: 'core', frames: [{ torsoAngle: 45, armAngle: 0, legAngle: 30 }, { torsoAngle: 45, armAngle: 45, legAngle: 30 }, { torsoAngle: 45, armAngle: -45, legAngle: 30 }], tempo: '1-0-1-0' },
  },
  {
    id: 'ab_wheel', name: 'Ab Wheel Rollout', nameHr: 'Ab Wheel (kotačić za trbuh)',
    primary: ['core'], secondary: ['shoulders', 'back'],
    equipment: ['none'], difficulty: 'advanced', category: 'core',
    defaultSets: 3, defaultReps: '8-12', defaultRest: 60,
    injuryCaution: ['lower_back'],
    instructions: { hr: 'Na koljenima, drži kotačić. Roll naprijed koliko možeš kontrolirano, vrati se nazad.', en: 'On knees, hold wheel. Roll forward as far as you can control, return back.' },
    tips: { hr: 'Stegni core cijelo vrijeme! Ne presavijaj leđa na dnu.', en: "Brace core entire time! Don't hyperextend at bottom." },
    animation: { type: 'core', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 90 }, { torsoAngle: 0, armAngle: 170, legAngle: 90 }, { torsoAngle: 0, armAngle: 0, legAngle: 90 }], tempo: '2-0-2-0' },
  },
  {
    id: 'pallof_press', name: 'Pallof Press', nameHr: 'Pallof Press',
    primary: ['core'], secondary: [],
    equipment: ['cable', 'band'], difficulty: 'beginner', category: 'core',
    defaultSets: 3, defaultReps: '12/strana', defaultRest: 45,
    instructions: { hr: 'Stani bočno na kabel/elastiku. Drži ispred prsa, ispruži ruke naprijed. Odupri se rotaciji.', en: 'Stand sideways to cable/band. Hold at chest, extend arms forward. Resist rotation.' },
    tips: { hr: 'Anti-rotacijska vježba — nemoj da te kabel okrene!', en: "Anti-rotation exercise — don't let cable turn you!" },
    animation: { type: 'core', frames: [{ torsoAngle: 0, armAngle: 90, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 90, legAngle: 0 }], tempo: '1-2-1-0' },
  },
  {
    id: 'dead_bug', name: 'Dead Bug', nameHr: 'Dead Bug',
    primary: ['core'], secondary: [],
    equipment: ['bodyweight', 'none'], difficulty: 'beginner', category: 'core',
    defaultSets: 3, defaultReps: '10/strana', defaultRest: 45,
    instructions: { hr: 'Legni na leđa, ruke i noge gore (90°). Istovremeno spusti suprotnu ruku i nogu prema podu. Vrati i ponovi.', en: 'Lie on back, arms and legs up (90°). Simultaneously lower opposite arm and leg toward floor. Return and repeat.' },
    tips: { hr: 'Donji dio leđa pritisnute u pod cijelo vrijeme!', en: 'Lower back pressed into floor entire time!' },
    animation: { type: 'core', frames: [{ torsoAngle: 0, armAngle: 90, legAngle: 90 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 90, legAngle: 90 }], tempo: '2-0-2-0' },
  },
  {
    id: 'bird_dog', name: 'Bird-Dog', nameHr: 'Bird-Dog',
    primary: ['core', 'back'], secondary: ['glutes'],
    equipment: ['bodyweight', 'none'], difficulty: 'beginner', category: 'core',
    defaultSets: 3, defaultReps: '10/strana', defaultRest: 45,
    injuryCaution: [],
    instructions: { hr: 'Na svim četirima. Istovremeno ispruži suprotnu ruku i nogu. Drži 3-5s. Vrati i zamijeni.', en: 'On all fours. Simultaneously extend opposite arm and leg. Hold 3-5s. Return and switch.' },
    tips: { hr: 'Ne rotiraj zdjelicu! Zamislì čašu vode na leđima — ne smije se proliti.', en: "Don't rotate pelvis! Imagine glass of water on back — can't spill." },
    animation: { type: 'core', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 90 }, { torsoAngle: 0, armAngle: 180, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 90 }], tempo: '1-3-1-0' },
  },

  // ========== FULL BODY / HIIT ==========
  {
    id: 'burpee', name: 'Burpee', nameHr: 'Burpees',
    primary: ['full_body'], secondary: ['chest', 'quads', 'shoulders', 'core'],
    equipment: ['bodyweight', 'none'], difficulty: 'intermediate', category: 'cardio',
    defaultSets: 4, defaultReps: '10-15', defaultRest: 30,
    instructions: { hr: 'Stani → čučnì → ruke na pod → skok u plank → sklek → skok natrag → skok gore s rukama iznad glave.', en: 'Stand → squat → hands on floor → jump to plank → push-up → jump back → jump up with arms overhead.' },
    tips: { hr: 'Tempo, tempo, tempo! Ali forma je bitnija od brzine.', en: 'Tempo, tempo, tempo! But form matters more than speed.' },
    animation: { type: 'full', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 90, armAngle: 0, legAngle: 100 }, { torsoAngle: 0, armAngle: 90, legAngle: 0 }, { torsoAngle: 0, armAngle: 180, legAngle: 0 }], tempo: 'explosive' },
  },
  {
    id: 'kb_swing', name: 'Kettlebell Swing', nameHr: 'Kettlebell Swing',
    primary: ['hamstrings', 'glutes'], secondary: ['back', 'shoulders', 'core'],
    equipment: ['kettlebell'], difficulty: 'intermediate', category: 'cardio',
    defaultSets: 4, defaultReps: '15-20', defaultRest: 45,
    instructions: { hr: 'Stani šire od ramena, kettlebell između nogu. Hip hinge — gurnì kukove nazad pa eksplozivno naprijed. Ruke samo drže, snaga iz kukova!', en: 'Stand wider than shoulders, KB between legs. Hip hinge — push hips back then explosively forward. Arms just hold, power from hips!' },
    tips: { hr: 'Nije čučanj! Hip hinge pokret. Kettlebell ide do visine ramena.', en: "Not a squat! Hip hinge movement. KB goes to shoulder height." },
    animation: { type: 'full', frames: [{ torsoAngle: 45, armAngle: 0, legAngle: 30 }, { torsoAngle: 0, armAngle: 90, legAngle: 0 }, { torsoAngle: 45, armAngle: 0, legAngle: 30 }], tempo: 'explosive' },
  },
  {
    id: 'mountain_climber', name: 'Mountain Climber', nameHr: 'Mountain Climbers',
    primary: ['core'], secondary: ['shoulders', 'quads'],
    equipment: ['bodyweight', 'none'], difficulty: 'beginner', category: 'cardio',
    defaultSets: 3, defaultReps: '30s', defaultRest: 30,
    instructions: { hr: 'Plank pozicija. Naizmjenično dovlači koljena prema prsima što brže.', en: 'Plank position. Alternately drive knees toward chest as fast as possible.' },
    tips: { hr: 'Kukovi nisko! Drži plank poziciju dok trčiš.', en: 'Hips low! Maintain plank position while running.' },
    animation: { type: 'cardio', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 90 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }], tempo: 'fast' },
  },
  {
    id: 'box_jump', name: 'Box Jump', nameHr: 'Skok na kutiju',
    primary: ['quads', 'glutes', 'calves'], secondary: ['core'],
    equipment: ['none'], difficulty: 'intermediate', category: 'cardio',
    defaultSets: 4, defaultReps: '8-10', defaultRest: 60,
    injuryCaution: ['knee_acl', 'ankle_sprain'],
    instructions: { hr: 'Stani ispred kutije. Zamahni rukama, skoči gore i doskoči meko na obje noge.', en: 'Stand in front of box. Swing arms, jump up and land softly on both feet.' },
    tips: { hr: 'MEKO doskakivanje! Cijelo stopalo na kutiji. Stupi dolje, nemoj skakati.', en: 'SOFT landing! Full foot on box. Step down, don\'t jump.' },
    animation: { type: 'full', frames: [{ torsoAngle: 30, armAngle: 0, legAngle: 60 }, { torsoAngle: 0, armAngle: 180, legAngle: 0 }, { torsoAngle: 10, armAngle: 0, legAngle: 30 }], tempo: 'explosive' },
  },
  {
    id: 'battle_ropes', name: 'Battle Ropes', nameHr: 'Battle Ropes (borbena užad)',
    primary: ['shoulders'], secondary: ['core', 'biceps', 'forearms'],
    equipment: ['none'], difficulty: 'intermediate', category: 'cardio',
    defaultSets: 4, defaultReps: '30s', defaultRest: 30,
    instructions: { hr: 'Čvrst stav, lagani čučanj. Naizmjenično bacaj užad gore-dolje što brže.', en: 'Solid stance, slight squat. Alternately whip ropes up and down as fast as possible.' },
    tips: { hr: 'Valovi trebaju ići do kraja užeta! Amplituda jednaka.', en: 'Waves should reach end of rope! Consistent amplitude.' },
    animation: { type: 'upper', frames: [{ torsoAngle: 10, armAngle: 60, legAngle: 20 }, { torsoAngle: 10, armAngle: 0, legAngle: 20 }, { torsoAngle: 10, armAngle: 60, legAngle: 20 }], tempo: 'fast' },
  },
  {
    id: 'jump_squat', name: 'Jump Squat', nameHr: 'Čučanj sa skokom',
    primary: ['quads', 'glutes'], secondary: ['calves', 'core'],
    equipment: ['bodyweight', 'none'], difficulty: 'intermediate', category: 'cardio',
    defaultSets: 3, defaultReps: '12-15', defaultRest: 45,
    injuryCaution: ['knee_acl', 'knee_general'],
    instructions: { hr: 'Čučnì do paralele, eksplozivno skoči gore. Doskoči meko nazad u čučanj.', en: 'Squat to parallel, explosively jump up. Land softly back into squat.' },
    tips: { hr: 'Mek doskok na prste pa pete! Koljena ne unutra.', en: 'Soft landing on toes then heels! Knees not inward.' },
    animation: { type: 'full', frames: [{ torsoAngle: 30, armAngle: 0, legAngle: 90 }, { torsoAngle: 0, armAngle: 180, legAngle: 0 }, { torsoAngle: 30, armAngle: 0, legAngle: 90 }], tempo: 'explosive' },
  },

  // ========== TRAPS ==========
  {
    id: 'shrug', name: 'Barbell Shrug', nameHr: 'Shrug (slegnì ramenima)',
    primary: ['traps'], secondary: [],
    equipment: ['barbell', 'dumbbell'], difficulty: 'beginner', category: 'pull',
    defaultSets: 3, defaultReps: '12-15', defaultRest: 60,
    instructions: { hr: 'Drži šipku/bučice. Podignì ramena prema ušima, stisni na vrhu, spusti kontrolirano.', en: 'Hold bar/dumbbells. Raise shoulders toward ears, squeeze at top, lower with control.' },
    tips: { hr: 'Ne rotiraj ramena! Ravno gore-dolje.', en: "Don't rotate shoulders! Straight up and down." },
    animation: { type: 'upper', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 10, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }], tempo: '1-2-2-0' },
  },
  {
    id: 'farmers_walk', name: "Farmer's Walk", nameHr: 'Farmer Walk (nošenje tereta)',
    primary: ['traps', 'forearms', 'core'], secondary: ['full_body'],
    equipment: ['dumbbell', 'kettlebell'], difficulty: 'beginner', category: 'core',
    defaultSets: 3, defaultReps: '40m', defaultRest: 60,
    instructions: { hr: 'Drži teške bučice/kettlebellove uz tijelo. Hodaj ravno, kratki koraci, ramena dolje.', en: 'Hold heavy dumbbells/KBs at sides. Walk straight, short steps, shoulders down.' },
    tips: { hr: 'Core stegnut, ne naginjì se! Odlično za grip i stabilnost.', en: "Core braced, don't lean! Great for grip and stability." },
    animation: { type: 'full', frames: [{ torsoAngle: 0, armAngle: 0, legAngle: 0 }, { torsoAngle: 0, armAngle: 0, legAngle: 30 }, { torsoAngle: 0, armAngle: 0, legAngle: 0 }], tempo: 'walk' },
  },
];

// ==========================================
// FILTER FUNCTIONS
// ==========================================

// Lazy-loaded extended exercises (merged on first call)
let _allExercisesCache: ExerciseInfo[] | null = null;

export function getAllExercises(): ExerciseInfo[] {
  if (_allExercisesCache) return _allExercisesCache;
  try {
    // Dynamic import would be ideal but for sync access, we import at build time
    const ext = require('./exerciseDB_extended').extendedExercises as ExerciseCompact[];
    const existingIds = new Set(exercises.map((e) => e.id));
    const deduped = ext.filter((e) => !existingIds.has(e.id));
    _allExercisesCache = [...exercises, ...deduped as any[]];
  } catch {
    _allExercisesCache = [...exercises];
  }
  return _allExercisesCache;
}

export function filterExercises(opts: {
  muscles?: MuscleGroup[];
  equipment?: Equipment[];
  difficulty?: Difficulty[];
  category?: string[];
  avoidInjuries?: string[];
  search?: string;
}): ExerciseInfo[] {
  let result = [...getAllExercises()];

  if (opts.muscles && opts.muscles.length > 0) {
    result = result.filter((e) => (e.primary as string[]).some((m) => opts.muscles!.includes(m as MuscleGroup)));
  }
  if (opts.equipment && opts.equipment.length > 0) {
    result = result.filter((e) => (e.equipment as string[]).some((eq) => opts.equipment!.includes(eq as Equipment)));
  }
  if (opts.difficulty && opts.difficulty.length > 0) {
    result = result.filter((e) => opts.difficulty!.includes(e.difficulty));
  }
  if (opts.category && opts.category.length > 0) {
    result = result.filter((e) => opts.category!.includes(e.category));
  }
  if (opts.avoidInjuries && opts.avoidInjuries.length > 0) {
    result = result.filter((e) => !e.injuryAvoid?.some((inj) => opts.avoidInjuries!.includes(inj)));
  }
  if (opts.search) {
    const s = opts.search.toLowerCase();
    result = result.filter((e) => e.name.toLowerCase().includes(s) || e.nameHr.toLowerCase().includes(s));
  }

  return result;
}

export function getExerciseById(id: string): ExerciseInfo | undefined {
  return getAllExercises().find((e) => e.id === id);
}

export const muscleGroupLabels: Record<MuscleGroup, { hr: string; en: string }> = {
  chest: { hr: 'Prsa', en: 'Chest' },
  back: { hr: 'Leđa', en: 'Back' },
  shoulders: { hr: 'Ramena', en: 'Shoulders' },
  biceps: { hr: 'Biceps', en: 'Biceps' },
  triceps: { hr: 'Triceps', en: 'Triceps' },
  forearms: { hr: 'Podlaktice', en: 'Forearms' },
  quads: { hr: 'Quadriceps', en: 'Quads' },
  hamstrings: { hr: 'Hamstrings', en: 'Hamstrings' },
  glutes: { hr: 'Gluteus', en: 'Glutes' },
  calves: { hr: 'Listovi', en: 'Calves' },
  core: { hr: 'Core/Trbuh', en: 'Core/Abs' },
  traps: { hr: 'Trapez', en: 'Traps' },
  full_body: { hr: 'Cijelo tijelo', en: 'Full Body' },
};

export const equipmentLabels: Record<Equipment, { hr: string; en: string; emoji: string }> = {
  barbell: { hr: 'Šipka', en: 'Barbell', emoji: '🏋️' },
  dumbbell: { hr: 'Bučice', en: 'Dumbbells', emoji: '🔩' },
  cable: { hr: 'Kabel', en: 'Cable', emoji: '🔗' },
  machine: { hr: 'Sprava', en: 'Machine', emoji: '🏗️' },
  bodyweight: { hr: 'Samo tijelo', en: 'Bodyweight', emoji: '🤸' },
  kettlebell: { hr: 'Kettlebell', en: 'Kettlebell', emoji: '🔔' },
  band: { hr: 'Elastika', en: 'Band', emoji: '🟡' },
  trx: { hr: 'TRX', en: 'TRX', emoji: '🪢' },
  pullup_bar: { hr: 'Šipka za zgibove', en: 'Pull-up Bar', emoji: '🔧' },
  bench: { hr: 'Klupa', en: 'Bench', emoji: '🪑' },
  none: { hr: 'Ništa', en: 'None', emoji: '👐' },
};
