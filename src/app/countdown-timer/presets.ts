export interface TimerPreset {
  slug: string;
  minutes: number;
  label: string;
  use: string;
}

export const TIMER_PRESETS: TimerPreset[] = [
  { slug: "1-minute-timer", minutes: 1, label: "1 Minute Timer", use: "Brushing teeth, a plank, a quick stretch between meetings — the one-minute reset." },
  { slug: "2-minute-timer", minutes: 2, label: "2 Minute Timer", use: "The dentist-approved toothbrushing time, microwave waits and speed stretches." },
  { slug: "3-minute-timer", minutes: 3, label: "3 Minute Timer", use: "Soft-boiled eggs, steeping tea, and the classic three-minute presentation drill." },
  { slug: "5-minute-timer", minutes: 5, label: "5 Minute Timer", use: "The most-used timer on the internet: meditation, face masks, French-press coffee and quick tidy-ups." },
  { slug: "10-minute-timer", minutes: 10, label: "10 Minute Timer", use: "Power naps' little brother — study sprints, pasta, workouts and getting-ready races." },
  { slug: "15-minute-timer", minutes: 15, label: "15 Minute Timer", use: "A quarter-hour focus block: inbox zero attempts, journaling, and kids' reading time." },
  { slug: "20-minute-timer", minutes: 20, label: "20 Minute Timer", use: "The classic power-nap length and a solid single-task work sprint." },
  { slug: "25-minute-timer", minutes: 25, label: "25 Minute Timer", use: "One full Pomodoro: 25 minutes of single-task focus, then a 5-minute break." },
  { slug: "30-minute-timer", minutes: 30, label: "30 Minute Timer", use: "Half an hour: workouts, baking, deep-work blocks and screen-time limits." },
  { slug: "45-minute-timer", minutes: 45, label: "45 Minute Timer", use: "A class period, a full workout, or a long Pomodoro for deep work." },
  { slug: "60-minute-timer", minutes: 60, label: "60 Minute Timer", use: "One hour: exams, long bakes, meetings that should have been emails." },
];

export function presetBySlug(slug: string): TimerPreset | undefined {
  return TIMER_PRESETS.find((p) => p.slug === slug);
}
