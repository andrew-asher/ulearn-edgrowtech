export type Stream = {
  id: string;
  name: string;
  status: "available" | "coming-soon";
  subjects: string[];
  description: string;
};

export const streams: Stream[] = [
  {
    id: "physical-science",
    name: "Physical Science",
    status: "available",
    description: "Combined Maths, Physics & Chemistry — the engineering / IT pathway.",
    subjects: ["Combined Mathematics", "Physics", "Chemistry"],
  },
  {
    id: "bio-science",
    name: "Bio Science",
    status: "available",
    description: "Biology, Physics & Chemistry — the medical & life sciences pathway.",
    subjects: ["Biology", "Physics", "Chemistry"],
  },
  { id: "commerce", name: "Commerce", status: "coming-soon", description: "Accounting, Economics, Business Studies.", subjects: [] },
  { id: "arts", name: "Arts", status: "coming-soon", description: "Languages, history, geography & humanities.", subjects: [] },
  { id: "technology", name: "Technology", status: "coming-soon", description: "ET / BST / SFT & ICT.", subjects: [] },
];

export const subjectSlug = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export type Paper = {
  id: string;
  subject: string;
  year: number;
  medium: "English" | "Tamil" | "Sinhala";
  paperType: "MCQ" | "Structured" | "Essay";
  questionCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  downloadUrl: string;
};

export const papers: Paper[] = [
  { id: "phy-2023-mcq", subject: "Physics", year: 2023, medium: "English", paperType: "MCQ", questionCount: 5, difficulty: "Medium", downloadUrl: "/papers/physics-2023-mcq.pdf" },
  { id: "chem-2022-mcq", subject: "Chemistry", year: 2022, medium: "English", paperType: "MCQ", questionCount: 5, difficulty: "Hard", downloadUrl: "/papers/chemistry-2022-mcq.pdf" },
  { id: "bio-2021-mcq", subject: "Biology", year: 2021, medium: "English", paperType: "MCQ", questionCount: 5, difficulty: "Medium", downloadUrl: "/papers/biology-2021-mcq.pdf" },
  { id: "cmaths-2023-str", subject: "Combined Mathematics", year: 2023, medium: "English", paperType: "Structured", questionCount: 5, difficulty: "Hard", downloadUrl: "/papers/cmaths-2023-structured.pdf" },
  { id: "phy-2022-mcq", subject: "Physics", year: 2022, medium: "English", paperType: "MCQ", questionCount: 5, difficulty: "Easy", downloadUrl: "/papers/physics-2022-mcq.pdf" },
];

export type Question = {
  id: string;
  paperId: string;
  number: number;
  text: string;
  options: { key: "A" | "B" | "C" | "D" | "E"; text: string }[];
  correct: "A" | "B" | "C" | "D" | "E";
  explanation: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  diagram?: string;
};

const opts = (a: string, b: string, c: string, d: string, e: string) => [
  { key: "A" as const, text: a }, { key: "B" as const, text: b }, { key: "C" as const, text: c },
  { key: "D" as const, text: d }, { key: "E" as const, text: e },
];

export const questions: Question[] = [
  {
    id: "q1", paperId: "phy-2023-mcq", number: 1, topic: "Mechanics", difficulty: "Medium",
    text: "A ball is dropped from a height of 20 m. Taking g = 10 m/s², the time taken to reach the ground is:",
    options: opts("1 s", "2 s", "3 s", "4 s", "5 s"),
    correct: "B",
    explanation: "Using s = ½gt² → 20 = ½ · 10 · t² → t² = 4 → t = 2 s.",
  },
  {
    id: "q2", paperId: "phy-2023-mcq", number: 2, topic: "Electricity", difficulty: "Easy",
    text: "The SI unit of electric current is:",
    options: opts("Volt", "Ohm", "Ampere", "Coulomb", "Watt"),
    correct: "C",
    explanation: "Current is measured in Amperes (A), one of the seven SI base units.",
  },
  {
    id: "q3", paperId: "phy-2023-mcq", number: 3, topic: "Waves", difficulty: "Medium",
    text: "If a wave has frequency 50 Hz and wavelength 4 m, its speed is:",
    options: opts("100 m/s", "150 m/s", "200 m/s", "250 m/s", "400 m/s"),
    correct: "C",
    explanation: "v = fλ = 50 × 4 = 200 m/s.",
  },
  {
    id: "q4", paperId: "phy-2023-mcq", number: 4, topic: "Thermodynamics", difficulty: "Hard",
    text: "An ideal gas undergoes isothermal expansion. Which quantity remains constant?",
    options: opts("Pressure", "Volume", "Temperature", "Entropy", "Internal energy of surroundings"),
    correct: "C",
    explanation: "Isothermal means constant temperature; for an ideal gas internal energy also stays constant, but the defining condition is T = constant.",
  },
  {
    id: "q5", paperId: "phy-2023-mcq", number: 5, topic: "Optics", difficulty: "Medium",
    text: "A converging lens of focal length 10 cm forms a real image at 20 cm. The object distance is:",
    options: opts("5 cm", "10 cm", "15 cm", "20 cm", "30 cm"),
    correct: "D",
    explanation: "1/f = 1/v + 1/u → 1/10 = 1/20 + 1/u → 1/u = 1/20 → u = 20 cm.",
  },
];

export const years = [2024, 2023, 2022, 2021, 2020];
