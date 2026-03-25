export interface MuscleZone {
  id: string;
  label: string;
  paths: string[];
  cx: number;
  cy: number;
}

export const frontMuscles: MuscleZone[] = [
  { id: 'neck', label: 'neck', paths: [
    'M54.5 62 Q57 60 60 59.5 Q63 60 65.5 62 L65 67 Q63 68 60 68.5 Q57 68 55 67 Z'
  ], cx: 60, cy: 64 },
  { id: 'shoulders_l', label: 'shoulders_l', paths: [
    'M42 68 Q38 65 36 68 Q33 72 32 78 Q33 82 36 82 L42 78 Q44 74 44 70 Z',
    'M42 70 Q40 68 38 70 Q36 74 36 78'
  ], cx: 38, cy: 74 },
  { id: 'shoulders_r', label: 'shoulders_r', paths: [
    'M78 68 Q82 65 84 68 Q87 72 88 78 Q87 82 84 82 L78 78 Q76 74 76 70 Z'
  ], cx: 82, cy: 74 },
  { id: 'chest_l', label: 'chest_l', paths: [
    'M44 72 Q48 70 56 72 Q58 73 59 75 L59 84 Q56 88 48 86 Q44 84 42 80 Z'
  ], cx: 50, cy: 78 },
  { id: 'chest_r', label: 'chest_r', paths: [
    'M76 72 Q72 70 64 72 Q62 73 61 75 L61 84 Q64 88 72 86 Q76 84 78 80 Z'
  ], cx: 70, cy: 78 },
  { id: 'biceps_l', label: 'biceps_l', paths: [
    'M32 82 Q30 84 28 90 Q26 98 27 106 Q28 108 30 108 L34 106 Q36 98 36 90 Q35 84 34 82 Z'
  ], cx: 31, cy: 95 },
  { id: 'biceps_r', label: 'biceps_r', paths: [
    'M88 82 Q90 84 92 90 Q94 98 93 106 Q92 108 90 108 L86 106 Q84 98 84 90 Q85 84 86 82 Z'
  ], cx: 89, cy: 95 },
  { id: 'forearms_l', label: 'forearms_l', paths: [
    'M27 108 Q25 115 24 125 Q23 132 24 138 L28 138 Q30 132 30 125 Q31 115 30 108 Z'
  ], cx: 27, cy: 123 },
  { id: 'forearms_r', label: 'forearms_r', paths: [
    'M93 108 Q95 115 96 125 Q97 132 96 138 L92 138 Q90 132 90 125 Q89 115 90 108 Z'
  ], cx: 93, cy: 123 },
  { id: 'abs_upper', label: 'abs_upper', paths: [
    'M52 86 Q56 84 60 84 Q64 84 68 86 L67 98 Q64 99 60 99 Q56 99 53 98 Z'
  ], cx: 60, cy: 92 },
  { id: 'abs_lower', label: 'abs_lower', paths: [
    'M53 100 Q56 99 60 99 Q64 99 67 100 L66 114 Q64 116 60 116 Q56 116 54 114 Z'
  ], cx: 60, cy: 107 },
  { id: 'obliques_l', label: 'obliques_l', paths: [
    'M44 84 Q46 82 50 84 L52 86 L53 112 Q50 114 46 112 Q43 108 42 98 Q42 90 44 84 Z'
  ], cx: 47, cy: 98 },
  { id: 'obliques_r', label: 'obliques_r', paths: [
    'M76 84 Q74 82 70 84 L68 86 L67 112 Q70 114 74 112 Q77 108 78 98 Q78 90 76 84 Z'
  ], cx: 73, cy: 98 },
  { id: 'quads_l', label: 'quads_l', paths: [
    'M48 118 Q50 116 56 118 L58 120 L57 150 Q55 154 52 155 Q48 154 46 150 L45 130 Q46 122 48 118 Z'
  ], cx: 52, cy: 136 },
  { id: 'quads_r', label: 'quads_r', paths: [
    'M72 118 Q70 116 64 118 L62 120 L63 150 Q65 154 68 155 Q72 154 74 150 L75 130 Q74 122 72 118 Z'
  ], cx: 68, cy: 136 },
  { id: 'adductors', label: 'adductors', paths: [
    'M56 118 Q58 117 60 117 Q62 117 64 118 L63 145 Q62 147 60 147 Q58 147 57 145 Z'
  ], cx: 60, cy: 132 },
  { id: 'shins_l', label: 'shins_l', paths: [
    'M47 158 Q49 156 52 157 L53 158 L52 180 Q50 182 48 180 L47 170 Z'
  ], cx: 50, cy: 170 },
  { id: 'shins_r', label: 'shins_r', paths: [
    'M73 158 Q71 156 68 157 L67 158 L68 180 Q70 182 72 180 L73 170 Z'
  ], cx: 70, cy: 170 },
];

export const backMuscles: MuscleZone[] = [
  { id: 'traps', label: 'traps', paths: [
    'M48 66 Q54 62 60 61 Q66 62 72 66 L70 74 Q66 70 60 69 Q54 70 50 74 Z'
  ], cx: 60, cy: 67 },
  { id: 'rear_delts_l', label: 'rear_delts_l', paths: [
    'M42 68 Q38 66 35 70 Q33 74 33 78 L36 80 Q40 76 42 72 Z'
  ], cx: 37, cy: 74 },
  { id: 'rear_delts_r', label: 'rear_delts_r', paths: [
    'M78 68 Q82 66 85 70 Q87 74 87 78 L84 80 Q80 76 78 72 Z'
  ], cx: 83, cy: 74 },
  { id: 'upper_back', label: 'upper_back', paths: [
    'M46 74 Q52 72 60 71 Q68 72 74 74 L72 92 Q66 94 60 94 Q54 94 48 92 Z'
  ], cx: 60, cy: 83 },
  { id: 'lats_l', label: 'lats_l', paths: [
    'M42 78 Q44 76 46 78 L48 94 Q46 100 44 104 Q42 106 40 104 L38 92 Q38 84 42 78 Z'
  ], cx: 43, cy: 91 },
  { id: 'lats_r', label: 'lats_r', paths: [
    'M78 78 Q76 76 74 78 L72 94 Q74 100 76 104 Q78 106 80 104 L82 92 Q82 84 78 78 Z'
  ], cx: 77, cy: 91 },
  { id: 'lower_back', label: 'lower_back', paths: [
    'M50 96 Q54 94 60 94 Q66 94 70 96 L68 114 Q64 116 60 116 Q56 116 52 114 Z'
  ], cx: 60, cy: 105 },
  { id: 'triceps_l', label: 'triceps_l', paths: [
    'M32 80 Q30 82 28 90 Q26 98 27 106 L31 106 Q33 98 34 90 Q34 84 33 80 Z'
  ], cx: 30, cy: 93 },
  { id: 'triceps_r', label: 'triceps_r', paths: [
    'M88 80 Q90 82 92 90 Q94 98 93 106 L89 106 Q87 98 86 90 Q86 84 87 80 Z'
  ], cx: 90, cy: 93 },
  { id: 'glutes_l', label: 'glutes_l', paths: [
    'M50 116 Q54 114 58 116 L59 130 Q56 134 52 133 Q48 132 47 128 L48 120 Z'
  ], cx: 53, cy: 125 },
  { id: 'glutes_r', label: 'glutes_r', paths: [
    'M70 116 Q66 114 62 116 L61 130 Q64 134 68 133 Q72 132 73 128 L72 120 Z'
  ], cx: 67, cy: 125 },
  { id: 'hamstrings_l', label: 'hamstrings_l', paths: [
    'M47 134 Q50 132 54 134 L55 136 L54 162 Q52 164 50 164 Q47 163 46 160 L45 145 Z'
  ], cx: 50, cy: 148 },
  { id: 'hamstrings_r', label: 'hamstrings_r', paths: [
    'M73 134 Q70 132 66 134 L65 136 L66 162 Q68 164 70 164 Q73 163 74 160 L75 145 Z'
  ], cx: 70, cy: 148 },
  { id: 'calves_l', label: 'calves_l', paths: [
    'M46 166 Q48 164 52 165 L53 167 Q54 174 53 182 Q51 186 48 185 Q46 184 45 180 Q44 174 46 166 Z'
  ], cx: 49, cy: 176 },
  { id: 'calves_r', label: 'calves_r', paths: [
    'M74 166 Q72 164 68 165 L67 167 Q66 174 67 182 Q69 186 72 185 Q74 184 75 180 Q76 174 74 166 Z'
  ], cx: 71, cy: 176 },
];

export const stretchMap: Record<string, string[]> = {
  shoulders: ['Cross-Body Stretch 2x20s', 'Wall Slide 3x10', 'Band Pull-Apart 3x15'],
  chest: ['Doorway Stretch 3x30s', 'Foam Roll 2 min'],
  back: ['Cat-Cow 3x10', "Child's Pose 2x30s", 'Thoracic Extension 2x10'],
  traps: ['Upper Trap Stretch 2x20s/side', 'Shrug & Release 3x10'],
  biceps: ['Wall Bicep Stretch 2x20s'],
  triceps: ['Overhead Stretch 2x20s'],
  core: ['Cobra 2x15s', 'Side Bend 2x10/side'],
  quads: ['Couch Stretch 2x45s', 'Standing Quad Pull 2x30s'],
  hamstrings: ['Romanian Reach 2x30s', 'Pigeon Pose 2x30s'],
  glutes: ['Pigeon 2x30s', 'Figure-4 2x30s'],
  calves: ['Wall Stretch 3x20s', 'Downward Dog 2x20s'],
  neck: ['Neck Tilt 2x15s/side', 'Chin Tuck 3x10'],
  forearms: ['Wrist Flexor 2x20s'],
};

/** Map a muscle zone ID to its soreness group key */
export function getMuscleGroup(id: string): string {
  return id
    .replace(/_[lr]$/, '')
    .replace(/^(rear_delts|shoulders).*$/, 'shoulders')
    .replace(/^(chest).*$/, 'chest')
    .replace(/^(abs|obliques).*$/, 'core')
    .replace(/^(upper_back|lats|lower_back).*$/, 'back')
    .replace(/^(shins).*$/, 'calves')
    .replace(/^(adductors|quads).*$/, 'quads');
}
