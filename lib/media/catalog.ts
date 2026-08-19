import type { CSSProperties } from "react";

export interface AeraMediaAsset {
  id: string;
  src: string;
  alt: string;
  kind: "exercise-poster" | "meal-photo" | "progress-demo";
  aspectRatio: "4:5" | "3:2";
}

const assets: Record<string, AeraMediaAsset> = {
  TRAINING_PUSHUP: exercise("TRAINING_PUSHUP", "push-up.jpg", "Push-up performed with a straight body line"),
  TRAINING_INCLINE_PUSHUP: exercise("TRAINING_INCLINE_PUSHUP", "incline-push-up.jpg", "Incline push-up using a stable bench"),
  TRAINING_DUMBBELL_BENCH_PRESS: exercise("TRAINING_DUMBBELL_BENCH_PRESS", "dumbbell-bench-press.jpg", "Dumbbell bench press with feet planted"),
  TRAINING_DUMBBELL_ROW: exercise("TRAINING_DUMBBELL_ROW", "dumbbell-row.jpg", "Supported single-arm dumbbell row"),
  TRAINING_BAND_ROW: exercise("TRAINING_BAND_ROW", "band-row.jpg", "Standing resistance-band row"),
  TRAINING_SHOULDER_PRESS: exercise("TRAINING_SHOULDER_PRESS", "shoulder-press.jpg", "Seated dumbbell shoulder press"),
  TRAINING_LATERAL_RAISE: exercise("TRAINING_LATERAL_RAISE", "lateral-raise.jpg", "Controlled dumbbell lateral raise"),
  TRAINING_BICEPS_CURL: exercise("TRAINING_BICEPS_CURL", "biceps-curl.jpg", "Standing dumbbell biceps curl"),
  TRAINING_TRICEPS_EXTENSION: exercise("TRAINING_TRICEPS_EXTENSION", "triceps-extension.jpg", "Overhead dumbbell triceps extension"),
  TRAINING_SQUAT: exercise("TRAINING_SQUAT", "bodyweight-squat.jpg", "Bodyweight squat with feet planted"),
  TRAINING_GOBLET_SQUAT: exercise("TRAINING_GOBLET_SQUAT", "goblet-squat.jpg", "Goblet squat holding one dumbbell at the chest"),
  TRAINING_REVERSE_LUNGE: exercise("TRAINING_REVERSE_LUNGE", "reverse-lunge.jpg", "Reverse lunge in a stable split stance"),
  TRAINING_RDL: exercise("TRAINING_RDL", "romanian-deadlift.jpg", "Dumbbell Romanian deadlift with a neutral spine"),
  TRAINING_GLUTE_BRIDGE: exercise("TRAINING_GLUTE_BRIDGE", "glute-bridge.jpg", "Glute bridge performed on an exercise mat"),
  TRAINING_CALF_RAISE: exercise("TRAINING_CALF_RAISE", "calf-raise.jpg", "Standing calf raise with light balance support"),
  TRAINING_PLANK: exercise("TRAINING_PLANK", "plank.jpg", "Forearm plank with a straight body line"),
  TRAINING_SIDE_PLANK: exercise("TRAINING_SIDE_PLANK", "side-plank.jpg", "Side plank with hips lifted"),
  TRAINING_DEAD_BUG: exercise("TRAINING_DEAD_BUG", "dead-bug.jpg", "Dead bug exercise with opposite arm and leg extended"),
  NUTRITION_BREAKFAST_01: meal("NUTRITION_BREAKFAST_01", "greek-yogurt-bowl.jpg", "Greek yogurt bowl with banana, oats and almonds"),
  NUTRITION_LUNCH_01: meal("NUTRITION_LUNCH_01", "chicken-pita.jpg", "Whole-wheat chicken pita with tomato and yogurt"),
  PROGRESS_DEMO_FRONT: progress("PROGRESS_DEMO_FRONT", "demo-front-diptych.jpg", "Front-view demo progress comparison"),
  PROGRESS_DEMO_SIDE: progress("PROGRESS_DEMO_SIDE", "demo-side-diptych.jpg", "Side-view demo progress comparison"),
};

function exercise(id: string, filename: string, alt: string): AeraMediaAsset {
  return { id, src: `/media/training/${filename}`, alt, kind: "exercise-poster", aspectRatio: "4:5" };
}

function meal(id: string, filename: string, alt: string): AeraMediaAsset {
  return { id, src: `/media/nutrition/${filename}`, alt, kind: "meal-photo", aspectRatio: "4:5" };
}

function progress(id: string, filename: string, alt: string): AeraMediaAsset {
  return { id, src: `/media/progress/${filename}`, alt, kind: "progress-demo", aspectRatio: "3:2" };
}

export function getMediaAsset(id?: string) {
  return id ? assets[id] : undefined;
}

export function getProgressPhotoStyle(photo: { id: string; url?: string; isDemo?: boolean }): CSSProperties | undefined {
  if (!photo.url) return undefined;
  if (!photo.isDemo) return { backgroundImage: `url(${photo.url})`, backgroundPosition: "center", backgroundSize: "cover" };
  return {
    backgroundImage: `url(${photo.url})`,
    backgroundPosition: photo.id.endsWith("may") ? "left center" : "right center",
    backgroundSize: "200% 100%",
  };
}

export const aeraMediaAssets = Object.freeze(assets);
