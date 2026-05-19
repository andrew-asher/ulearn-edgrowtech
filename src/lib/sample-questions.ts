// Curated sample question bank used to seed papers with realistic content.
// Templates are short A/L-style prompts. Generators expand them to the
// target section size (e.g. 50 MCQs) by cycling and tagging with year/variant.

import type { AdminQuestion, OptionKey, Difficulty } from "./admin-store";

type MCQTpl = {
  text: string;
  options: [string, string, string, string, string];
  correct: OptionKey;
  topic: string;
  difficulty: Difficulty;
  explanation: string;
};

type LongTpl = {
  text: string;
  topic: string;
  difficulty: Difficulty;
  modelAnswer: string;
  explanation: string;
  marks: number;
};

type Bank = {
  mcq: MCQTpl[];
  structured: LongTpl[];
  essay: LongTpl[];
};

const KEYS: OptionKey[] = ["A", "B", "C", "D", "E"];

const physics: Bank = {
  mcq: [
    {
      text: "A body is projected at 30° to the horizontal with speed 20 m s⁻¹. Take g = 10 m s⁻². The time of flight is",
      options: ["1.0 s", "1.5 s", "2.0 s", "2.5 s", "4.0 s"],
      correct: "C",
      topic: "Mechanics — Projectiles",
      difficulty: "Medium",
      explanation: "T = 2u sinθ / g = 2·20·0.5 / 10 = 2.0 s.",
    },
    {
      text: "Which physical quantity has the same SI base units as work?",
      options: ["Power", "Torque", "Pressure", "Impulse", "Momentum"],
      correct: "B",
      topic: "Units & Dimensions",
      difficulty: "Easy",
      explanation: "Both work and torque have units of N·m = kg·m²·s⁻².",
    },
    {
      text: "The resistance of a uniform wire is R. If it is stretched to double its length without loss of volume, the new resistance is",
      options: ["R/4", "R/2", "R", "2R", "4R"],
      correct: "E",
      topic: "Electricity",
      difficulty: "Medium",
      explanation: "L→2L, A→A/2 (volume constant) ⇒ R = ρL/A increases by factor 4.",
    },
    {
      text: "A converging lens of focal length 10 cm forms a real image at 30 cm. The object distance is",
      options: ["5 cm", "10 cm", "15 cm", "20 cm", "30 cm"],
      correct: "C",
      topic: "Optics",
      difficulty: "Medium",
      explanation: "1/v − 1/u = 1/f ⇒ 1/30 − 1/u = 1/10 ⇒ u = −15 cm.",
    },
    {
      text: "The thermal efficiency of an ideal Carnot engine operating between 500 K and 300 K is",
      options: ["20 %", "30 %", "40 %", "60 %", "80 %"],
      correct: "C",
      topic: "Thermodynamics",
      difficulty: "Easy",
      explanation: "η = 1 − Tc/Th = 1 − 300/500 = 0.4 = 40 %.",
    },
    {
      text: "A particle executes SHM with amplitude A and angular frequency ω. Its maximum speed is",
      options: ["ωA²", "ω²A", "ωA", "A/ω", "ω/A"],
      correct: "C",
      topic: "Oscillations",
      difficulty: "Easy",
      explanation: "v_max = ωA.",
    },
    {
      text: "Photoelectrons are emitted from a metal of work function 2.0 eV by light of wavelength 400 nm. (hc ≈ 1240 eV·nm). Their maximum kinetic energy is",
      options: ["0.5 eV", "1.1 eV", "2.0 eV", "3.1 eV", "5.1 eV"],
      correct: "B",
      topic: "Modern Physics",
      difficulty: "Hard",
      explanation: "E = hc/λ − φ = 1240/400 − 2 = 3.1 − 2 = 1.1 eV.",
    },
    {
      text: "Two capacitors of 2 μF and 4 μF are connected in series across 6 V. The charge on each capacitor is",
      options: ["4 μC", "6 μC", "8 μC", "12 μC", "24 μC"],
      correct: "C",
      topic: "Capacitance",
      difficulty: "Medium",
      explanation: "C_eq = (2·4)/(2+4) = 4/3 μF; Q = CV = (4/3)·6 = 8 μC (same on each in series).",
    },
  ],
  structured: [
    {
      text: "A block of mass 2.0 kg rests on a rough horizontal surface (μ = 0.25). A horizontal force F is applied. (a) Find the minimum F to start motion. (b) If F = 10 N, find the acceleration. (Take g = 10 m s⁻².)",
      topic: "Mechanics — Friction",
      difficulty: "Medium",
      modelAnswer: "(a) F_min = μmg = 0.25·2·10 = 5.0 N. (b) Net = 10 − 5 = 5 N; a = 5/2 = 2.5 m s⁻².",
      explanation: "Use limiting friction to find the threshold, then Newton's 2nd law for the dynamic case.",
      marks: 10,
    },
    {
      text: "A resistor R and an inductor L = 0.1 H in series are connected to a 50 Hz, 100 V (rms) AC source. The current lags the voltage by 45°. Find R and the rms current.",
      topic: "AC Circuits",
      difficulty: "Hard",
      modelAnswer: "ωL = 2π·50·0.1 ≈ 31.4 Ω. tan 45° = ωL/R ⇒ R = 31.4 Ω. Z = R√2 ≈ 44.4 Ω. I = 100/44.4 ≈ 2.25 A.",
      explanation: "Use the impedance triangle. Phase tells you R = ωL.",
      marks: 10,
    },
    {
      text: "An ideal gas at 300 K and 1.0 atm is compressed adiabatically to half its volume. Take γ = 1.4. Find the final pressure and temperature.",
      topic: "Thermodynamics",
      difficulty: "Medium",
      modelAnswer: "P₂ = P₁(V₁/V₂)^γ = 1·2^1.4 ≈ 2.64 atm. T₂ = T₁(V₁/V₂)^(γ−1) = 300·2^0.4 ≈ 396 K.",
      explanation: "Adiabatic relations PV^γ = const and TV^(γ−1) = const.",
      marks: 10,
    },
  ],
  essay: [
    {
      text: "Discuss the principle of conservation of linear momentum. Derive it from Newton's laws and apply it to a one-dimensional elastic collision between two unequal masses. Discuss the limiting cases.",
      topic: "Mechanics",
      difficulty: "Hard",
      modelAnswer: "From F = dp/dt and Newton's 3rd law for an isolated pair, p₁ + p₂ = const. For 1-D elastic collision m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂ and ½m₁u₁² + ½m₂u₂² = ½m₁v₁² + ½m₂v₂². Solve to get v₁ = ((m₁−m₂)u₁ + 2m₂u₂)/(m₁+m₂) etc. Limits: equal masses swap velocities; m₂ → ∞ acts as a wall.",
      explanation: "Marking expects derivation, full algebra, and physical interpretation of limits.",
      marks: 15,
    },
    {
      text: "Explain Faraday's law and Lenz's law of electromagnetic induction. Using a rod moving on parallel rails in a uniform magnetic field, derive the induced EMF and discuss the energy flow.",
      topic: "Electromagnetism",
      difficulty: "Hard",
      modelAnswer: "ε = −dΦ/dt. For rod length L moving with v in field B: Φ = BLx ⇒ ε = BLv. Current I = BLv/R; force on rod = BIL opposes motion, so external work = I²R dissipated.",
      explanation: "Connect EMF to flux change, sign to Lenz's law, and conservation of energy.",
      marks: 15,
    },
    {
      text: "Describe the photoelectric effect, listing the observations classical wave theory cannot explain. State Einstein's equation and outline a graphical method to determine Planck's constant from experimental data.",
      topic: "Modern Physics",
      difficulty: "Medium",
      modelAnswer: "Observations: threshold frequency, instantaneous emission, KE independent of intensity. Einstein: hf = φ + KE_max. Plot V_stop vs f → straight line of slope h/e.",
      explanation: "Marks for both qualitative explanation and quantitative graphical analysis.",
      marks: 15,
    },
  ],
};

const chemistry: Bank = {
  mcq: [
    {
      text: "The number of σ and π bonds in HCN respectively are",
      options: ["1, 1", "2, 1", "2, 2", "1, 2", "3, 0"],
      correct: "C",
      topic: "Bonding",
      difficulty: "Easy",
      explanation: "H–C is 1σ; C≡N is 1σ + 2π. Total: 2σ, 2π.",
    },
    {
      text: "The pH of a 0.01 mol dm⁻³ HCl solution at 25 °C is",
      options: ["1", "2", "3", "12", "13"],
      correct: "B",
      topic: "Acids & Bases",
      difficulty: "Easy",
      explanation: "−log(0.01) = 2.",
    },
    {
      text: "Which of the following has the highest first ionisation energy?",
      options: ["Na", "Mg", "Al", "Si", "P"],
      correct: "E",
      topic: "Periodic Trends",
      difficulty: "Medium",
      explanation: "IE generally increases across the period; P has a half-filled 3p³ giving extra stability.",
    },
    {
      text: "0.1 mol of CaCO₃ is heated. The volume of CO₂ at STP is",
      options: ["1.12 L", "2.24 L", "11.2 L", "22.4 L", "44.8 L"],
      correct: "B",
      topic: "Stoichiometry",
      difficulty: "Easy",
      explanation: "1 mol gas at STP = 22.4 L ⇒ 0.1 mol = 2.24 L.",
    },
    {
      text: "The IUPAC name of (CH₃)₂CHCH₂OH is",
      options: ["butan-1-ol", "butan-2-ol", "2-methylpropan-1-ol", "2-methylpropan-2-ol", "propan-2-ol"],
      correct: "C",
      topic: "Organic Nomenclature",
      difficulty: "Medium",
      explanation: "3-carbon chain with methyl branch and primary OH at C-1.",
    },
    {
      text: "Which reagent best converts a primary alcohol directly to a carboxylic acid?",
      options: ["NaBH₄", "PCC", "KMnO₄ / H⁺ / heat", "LiAlH₄", "H₂ / Pd"],
      correct: "C",
      topic: "Organic Reactions",
      difficulty: "Medium",
      explanation: "Strong oxidiser (acidic KMnO₄) oxidises 1° alcohols all the way to RCOOH.",
    },
    {
      text: "ΔG° for a reaction is −22.8 kJ mol⁻¹ at 298 K. (R = 8.314 J K⁻¹ mol⁻¹.) Kc is approximately",
      options: ["10²", "10³", "10⁴", "10⁵", "10⁶"],
      correct: "C",
      topic: "Thermodynamics / Equilibrium",
      difficulty: "Hard",
      explanation: "ΔG° = −RT ln K ⇒ ln K = 22800/(8.314·298) ≈ 9.2 ⇒ K ≈ e^9.2 ≈ 10⁴.",
    },
    {
      text: "Which species is the strongest Brønsted base?",
      options: ["F⁻", "Cl⁻", "Br⁻", "I⁻", "HSO₄⁻"],
      correct: "A",
      topic: "Acids & Bases",
      difficulty: "Easy",
      explanation: "Conjugate of the weakest acid (HF) is the strongest base in the set.",
    },
  ],
  structured: [
    {
      text: "0.500 g of an organic acid HA requires 25.0 cm³ of 0.100 mol dm⁻³ NaOH for complete neutralisation. (a) Find the moles of NaOH used. (b) Assuming HA is monoprotic, find its molar mass.",
      topic: "Volumetric Analysis",
      difficulty: "Medium",
      modelAnswer: "(a) n = 0.0250·0.100 = 2.50×10⁻³ mol. (b) M = 0.500/2.50×10⁻³ = 200 g mol⁻¹.",
      explanation: "Standard titration calculation; mole ratio 1:1 for monoprotic acid.",
      marks: 10,
    },
    {
      text: "For the equilibrium N₂(g) + 3H₂(g) ⇌ 2NH₃(g), ΔH < 0. State and explain the effect of (a) increasing pressure, (b) increasing temperature, (c) adding a catalyst on the equilibrium yield of NH₃.",
      topic: "Equilibrium",
      difficulty: "Medium",
      modelAnswer: "(a) Yield ↑ — forward reaction reduces moles of gas. (b) Yield ↓ — exothermic, Le Chatelier favours backward. (c) No change in yield, only rate.",
      explanation: "Apply Le Chatelier's principle; catalyst does not shift equilibrium position.",
      marks: 10,
    },
    {
      text: "Outline the mechanism for the bromination of ethene with Br₂ in CCl₄. Show curly arrows and explain the stereochemistry of the product.",
      topic: "Organic Mechanisms",
      difficulty: "Hard",
      modelAnswer: "Electrophilic addition via cyclic bromonium ion; anti attack by Br⁻ gives trans-1,2-dibromoethane (racemic when ring carbons are chiral).",
      explanation: "Mechanism must show π-electron attack on Br₂, bromonium intermediate, and back-side opening.",
      marks: 10,
    },
  ],
  essay: [
    {
      text: "Discuss the principles and applications of the Haber process for ammonia synthesis. Include the conditions used industrially and justify them using kinetics and thermodynamics.",
      topic: "Industrial Chemistry",
      difficulty: "Hard",
      modelAnswer: "Conditions ≈ 450 °C, 200 atm, Fe catalyst (with K₂O, Al₂O₃ promoters). High pressure shifts equilibrium right; moderate temperature is a compromise between yield and rate; catalyst boosts rate.",
      explanation: "Expects equilibrium reasoning + economic compromise + catalyst role.",
      marks: 15,
    },
    {
      text: "Describe the structure and bonding in benzene. Discuss the evidence for delocalisation and explain why benzene undergoes substitution rather than addition.",
      topic: "Aromatic Chemistry",
      difficulty: "Medium",
      modelAnswer: "Planar regular hexagon, equal C–C bond lengths (139 pm), 6 delocalised π-electrons. Evidence: hydrogenation enthalpy, X-ray data. Substitution preserves aromaticity (stable 36 kJ/mol resonance energy).",
      explanation: "Combine MO/VB picture, experimental evidence, and kinetic stability.",
      marks: 15,
    },
    {
      text: "Explain the trends in atomic radius, ionisation energy and electronegativity across Period 3 and down Group 1 of the periodic table.",
      topic: "Periodic Trends",
      difficulty: "Medium",
      modelAnswer: "Across P3: radius ↓ (more nuclear charge, same shell), IE ↑, EN ↑. Down G1: radius ↑ (new shells), IE ↓, EN ↓.",
      explanation: "Standard trend essay; full marks need explanation in terms of effective nuclear charge and shielding.",
      marks: 15,
    },
  ],
};

const biology: Bank = {
  mcq: [
    {
      text: "Which organelle is the site of the light reactions of photosynthesis?",
      options: ["Stroma of chloroplast", "Thylakoid membrane", "Mitochondrial matrix", "Cytosol", "Nuclear envelope"],
      correct: "B",
      topic: "Photosynthesis",
      difficulty: "Easy",
      explanation: "Photosystems I and II reside in the thylakoid membranes.",
    },
    {
      text: "The phase of the cell cycle in which DNA replication occurs is",
      options: ["G1", "S", "G2", "M (mitosis)", "G0"],
      correct: "B",
      topic: "Cell Cycle",
      difficulty: "Easy",
      explanation: "DNA synthesis (S) phase doubles the genome before mitosis.",
    },
    {
      text: "Which enzyme is responsible for unwinding DNA during replication?",
      options: ["Ligase", "Helicase", "Primase", "DNA polymerase I", "Topoisomerase II"],
      correct: "B",
      topic: "Molecular Biology",
      difficulty: "Easy",
      explanation: "Helicase breaks hydrogen bonds between the two DNA strands.",
    },
    {
      text: "A monohybrid cross between two heterozygotes (Aa × Aa) gives an offspring phenotypic ratio of",
      options: ["1:1", "1:2:1", "3:1", "9:3:3:1", "All identical"],
      correct: "C",
      topic: "Genetics",
      difficulty: "Easy",
      explanation: "Complete dominance gives 3 dominant : 1 recessive.",
    },
    {
      text: "Which hormone is secreted by the β-cells of the islets of Langerhans?",
      options: ["Glucagon", "Insulin", "Adrenaline", "Cortisol", "Thyroxine"],
      correct: "B",
      topic: "Endocrine System",
      difficulty: "Easy",
      explanation: "β-cells secrete insulin; α-cells secrete glucagon.",
    },
    {
      text: "Which of the following is NOT a feature of mammalian arteries?",
      options: ["Thick muscular walls", "Narrow lumen", "Valves at intervals", "Elastic tissue", "Endothelial lining"],
      correct: "C",
      topic: "Circulatory System",
      difficulty: "Medium",
      explanation: "Valves are characteristic of veins, not arteries.",
    },
    {
      text: "The Calvin cycle directly produces",
      options: ["O₂", "ATP", "NADPH", "G3P", "Glucose"],
      correct: "D",
      topic: "Photosynthesis",
      difficulty: "Medium",
      explanation: "Glyceraldehyde-3-phosphate (G3P) is the immediate product.",
    },
    {
      text: "Which of the following is a difference between C3 and C4 plants?",
      options: [
        "Only C4 carry out the Calvin cycle",
        "Only C4 use PEP carboxylase for initial fixation",
        "C3 plants lack chloroplasts",
        "C4 plants do not perform light reactions",
        "C3 plants have Kranz anatomy",
      ],
      correct: "B",
      topic: "Plant Physiology",
      difficulty: "Medium",
      explanation: "C4 plants pre-fix CO₂ with PEP carboxylase in mesophyll cells.",
    },
  ],
  structured: [
    {
      text: "Describe the structure of a typical eukaryotic chromosome and explain how DNA is packaged into chromatin. Include the role of histones.",
      topic: "Molecular Biology",
      difficulty: "Medium",
      modelAnswer: "DNA wraps ~1.65 turns around an octamer of H2A, H2B, H3, H4 to form a nucleosome (~146 bp). Linker DNA + H1 condense into 30 nm fibre, then loops and chromatids.",
      explanation: "Marks for nucleosome composition, packing levels and histone role.",
      marks: 10,
    },
    {
      text: "Explain how the human kidney regulates blood osmolality. Refer to the role of the loop of Henle and ADH.",
      topic: "Excretion",
      difficulty: "Hard",
      modelAnswer: "Counter-current multiplier in loop of Henle creates a medullary salt gradient. ADH from posterior pituitary inserts aquaporins in collecting duct, increasing water reabsorption when osmolality is high.",
      explanation: "Mention osmoreceptors → ADH → collecting duct permeability.",
      marks: 10,
    },
    {
      text: "Describe an experiment to demonstrate the effect of substrate concentration on the rate of an enzyme-catalysed reaction. Include the expected graph and explanation.",
      topic: "Enzymes",
      difficulty: "Medium",
      modelAnswer: "Use catalase + varying H₂O₂. Measure O₂ produced per unit time. Plot rate vs [S]. Curve rises then plateaus at V_max — enzyme saturation.",
      explanation: "Mention controlled variables (pH, T, [E]) and Michaelis–Menten shape.",
      marks: 10,
    },
  ],
  essay: [
    {
      text: "Discuss the structure and function of the human heart. Explain how the cardiac cycle is coordinated electrically.",
      topic: "Circulatory System",
      difficulty: "Hard",
      modelAnswer: "Four chambers, AV and SL valves, double circulation. SA node depolarises atria → AV node → Bundle of His → Purkinje fibres → ventricular systole. Include ECG correlation.",
      explanation: "Marks for anatomy, valve function, electrical conduction and ECG.",
      marks: 15,
    },
    {
      text: "Explain the process of meiosis and discuss its significance in producing genetic variation.",
      topic: "Genetics",
      difficulty: "Medium",
      modelAnswer: "Meiosis I separates homologues (crossing over in prophase I, independent assortment in metaphase I). Meiosis II separates sister chromatids. Produces 4 haploid gametes; variation from crossing over + assortment + random fertilisation.",
      explanation: "Highlight three sources of variation explicitly.",
      marks: 15,
    },
    {
      text: "Describe the structure of the mammalian nephron and explain how it produces urine of varying concentration.",
      topic: "Excretion",
      difficulty: "Hard",
      modelAnswer: "Nephron: Bowman's capsule, PCT, loop of Henle, DCT, collecting duct. Filtration → selective reabsorption → secretion → osmotic concentration via medullary gradient + ADH.",
      explanation: "Connect each region to its function and the action of hormones.",
      marks: 15,
    },
  ],
};

const pureMath: Bank = {
  mcq: [],
  structured: [
    {
      text: "Differentiate y = x² ln x with respect to x, simplifying the result.",
      topic: "Calculus",
      difficulty: "Easy",
      modelAnswer: "dy/dx = 2x ln x + x²·(1/x) = x(2 ln x + 1).",
      explanation: "Product rule.",
      marks: 5,
    },
    {
      text: "Find the roots of the quadratic x² − 5x + 6 = 0.",
      topic: "Algebra",
      difficulty: "Easy",
      modelAnswer: "(x − 2)(x − 3) = 0 ⇒ x = 2 or 3.",
      explanation: "Factorise or use the formula.",
      marks: 5,
    },
    {
      text: "Evaluate ∫₀¹ (3x² + 2x) dx.",
      topic: "Calculus",
      difficulty: "Easy",
      modelAnswer: "[x³ + x²]₀¹ = 1 + 1 = 2.",
      explanation: "Direct integration.",
      marks: 5,
    },
    {
      text: "Find the equation of the tangent to y = x³ at the point (1, 1).",
      topic: "Calculus",
      difficulty: "Medium",
      modelAnswer: "dy/dx = 3x² = 3 at x = 1. y − 1 = 3(x − 1) ⇒ y = 3x − 2.",
      explanation: "Slope from derivative; point-slope form.",
      marks: 5,
    },
    {
      text: "Solve the equation 2 sin²θ = sin θ, 0 ≤ θ < 2π.",
      topic: "Trigonometry",
      difficulty: "Medium",
      modelAnswer: "sin θ(2 sin θ − 1) = 0 ⇒ θ = 0, π, π/6, 5π/6.",
      explanation: "Factor; do not divide by sin θ.",
      marks: 5,
    },
    {
      text: "Find the sum of the first 20 terms of the arithmetic progression 3, 7, 11, …",
      topic: "Sequences & Series",
      difficulty: "Easy",
      modelAnswer: "a = 3, d = 4. S₂₀ = 20/2 · (2·3 + 19·4) = 10·82 = 820.",
      explanation: "Use Sₙ = n/2(2a + (n−1)d).",
      marks: 5,
    },
    {
      text: "Find the value of k for which the vectors (1, k, 2) and (2, −1, 1) are perpendicular.",
      topic: "Vectors",
      difficulty: "Medium",
      modelAnswer: "Dot = 2 − k + 2 = 4 − k = 0 ⇒ k = 4.",
      explanation: "Perpendicular ⇒ dot product zero.",
      marks: 5,
    },
    {
      text: "If z = 1 + i, find |z|² and arg z.",
      topic: "Complex Numbers",
      difficulty: "Easy",
      modelAnswer: "|z|² = 2; arg z = π/4.",
      explanation: "Standard modulus/argument.",
      marks: 5,
    },
  ],
  essay: [
    {
      text: "(a) Sketch the curve y = x³ − 3x + 2 indicating turning points and intercepts. (b) Find the area of the region enclosed between the curve and the x-axis between consecutive roots.",
      topic: "Calculus / Curve Sketching",
      difficulty: "Hard",
      modelAnswer: "Roots: x = 1 (double), −2. dy/dx = 3x² − 3 = 0 ⇒ x = ±1: max at (−1, 4), min at (1, 0). Area = ∫₋₂¹ |x³ − 3x + 2| dx = 27/4.",
      explanation: "Need full sketch (intercepts + turning points) plus correctly signed integration.",
      marks: 15,
    },
    {
      text: "Prove by mathematical induction that 1·2 + 2·3 + 3·4 + … + n(n + 1) = n(n + 1)(n + 2)/3 for all n ∈ ℤ⁺.",
      topic: "Proof",
      difficulty: "Medium",
      modelAnswer: "Base n = 1: LHS = 2 = RHS. Assume true for n = k. Then LHS_{k+1} = k(k+1)(k+2)/3 + (k+1)(k+2) = (k+1)(k+2)(k+3)/3. Done.",
      explanation: "Complete induction with base case, hypothesis, and inductive step.",
      marks: 15,
    },
    {
      text: "Solve the differential equation dy/dx + y/x = x², x > 0, with y(1) = 0.",
      topic: "Differential Equations",
      difficulty: "Hard",
      modelAnswer: "Integrating factor = x. d(xy)/dx = x³ ⇒ xy = x⁴/4 + C. y(1) = 0 ⇒ C = −1/4. y = (x⁴ − 1)/(4x).",
      explanation: "First-order linear; use integrating factor method.",
      marks: 15,
    },
  ],
};

const appliedMath: Bank = {
  mcq: [],
  structured: [
    {
      text: "A particle moves with velocity v(t) = 3t² − 2t. Find its displacement during the first 4 s, given it starts at the origin.",
      topic: "Kinematics",
      difficulty: "Easy",
      modelAnswer: "s = ∫₀⁴(3t² − 2t)dt = [t³ − t²]₀⁴ = 64 − 16 = 48 m.",
      explanation: "Displacement = integral of velocity.",
      marks: 5,
    },
    {
      text: "A force of 12 N acts on a 3 kg body for 5 s. Find the impulse and the change in velocity.",
      topic: "Dynamics",
      difficulty: "Easy",
      modelAnswer: "J = Ft = 60 N·s; Δv = J/m = 20 m s⁻¹.",
      explanation: "Impulse-momentum theorem.",
      marks: 5,
    },
    {
      text: "Two forces 5 N and 12 N act at right angles at a point. Find the magnitude and direction of the resultant.",
      topic: "Statics",
      difficulty: "Easy",
      modelAnswer: "R = √(5² + 12²) = 13 N at tan⁻¹(5/12) ≈ 22.6° from the 12 N force.",
      explanation: "Pythagoras + tangent.",
      marks: 5,
    },
    {
      text: "A box of mass 10 kg is pulled up a 30° incline by a rope parallel to the slope, against friction μ = 0.2. Find the tension required for constant velocity. (g = 10)",
      topic: "Statics on Incline",
      difficulty: "Medium",
      modelAnswer: "T = mg sin θ + μmg cos θ = 100·0.5 + 0.2·100·(√3/2) ≈ 50 + 17.3 = 67.3 N.",
      explanation: "Sum forces along the incline at equilibrium.",
      marks: 5,
    },
    {
      text: "A random variable X has P(X = 1) = 0.4, P(X = 2) = 0.3, P(X = 3) = 0.3. Find E(X) and Var(X).",
      topic: "Probability",
      difficulty: "Medium",
      modelAnswer: "E(X) = 0.4 + 0.6 + 0.9 = 1.9. E(X²) = 0.4 + 1.2 + 2.7 = 4.3. Var = 4.3 − 1.9² = 0.69.",
      explanation: "Standard expectation/variance formulas.",
      marks: 5,
    },
    {
      text: "Solve the recurrence aₙ = 2aₙ₋₁ with a₀ = 3 and write aₙ explicitly.",
      topic: "Sequences",
      difficulty: "Easy",
      modelAnswer: "aₙ = 3·2ⁿ.",
      explanation: "Geometric sequence.",
      marks: 5,
    },
    {
      text: "A coin is tossed 4 times. Find the probability of obtaining exactly 2 heads.",
      topic: "Probability",
      difficulty: "Easy",
      modelAnswer: "C(4,2)·(1/2)⁴ = 6/16 = 3/8.",
      explanation: "Binomial distribution.",
      marks: 5,
    },
    {
      text: "Find the moment of inertia of a uniform rod of mass M and length L about an axis through its centre perpendicular to its length.",
      topic: "Rigid Bodies",
      difficulty: "Medium",
      modelAnswer: "I = ML²/12.",
      explanation: "Standard result; derivable from ∫₋L/2^L/2 x²(M/L)dx.",
      marks: 5,
    },
  ],
  essay: [
    {
      text: "Two particles of masses 3 kg and 5 kg are connected by a light inextensible string over a smooth pulley. Find the acceleration of the system and the tension in the string. Then determine how far the heavier particle descends in 2 s starting from rest. (g = 10)",
      topic: "Dynamics — Connected Particles",
      difficulty: "Medium",
      modelAnswer: "a = (5 − 3)g / (5 + 3) = 2.5 m s⁻². T = m₁(g + a) = 3·12.5 = 37.5 N. s = ½·2.5·4 = 5 m.",
      explanation: "Full Newton's 2nd law on each mass + kinematics.",
      marks: 15,
    },
    {
      text: "A particle is projected from ground level with speed u at angle α to the horizontal on level ground. Derive expressions for (i) maximum height, (ii) time of flight, (iii) horizontal range. Hence show that the range is maximum when α = 45°.",
      topic: "Projectiles",
      difficulty: "Medium",
      modelAnswer: "H = u² sin²α / (2g); T = 2u sin α / g; R = u² sin 2α / g. R max when sin 2α = 1 ⇒ α = 45°.",
      explanation: "Standard projectile derivations.",
      marks: 15,
    },
    {
      text: "X follows a normal distribution with mean 50 and standard deviation 8. (a) Find P(X < 60). (b) Find P(40 < X < 60). (c) Given that 5 % of the population has X > k, find k. (Use Z-table; Φ(1.25) = 0.8944, z₀.₀₅ = 1.645.)",
      topic: "Statistics — Normal Distribution",
      difficulty: "Hard",
      modelAnswer: "(a) Z = 1.25 ⇒ 0.8944. (b) 2·0.8944 − 1 = 0.7888. (c) k = 50 + 1.645·8 ≈ 63.16.",
      explanation: "Z-score conversion + standard table values.",
      marks: 15,
    },
  ],
};

const banks: Record<string, Bank> = {
  Physics: physics,
  Chemistry: chemistry,
  Biology: biology,
  "Pure Maths": pureMath,
  "Applied Maths": appliedMath,
};

function pickBank(subjectName: string, sectionTitle: string): Bank {
  const subj = subjectName.toLowerCase();
  const sec = sectionTitle.toLowerCase();
  if (subj.includes("combined") && subj.includes("math")) {
    return sec.includes("applied") ? appliedMath : pureMath;
  }
  if (subj.includes("phys")) return physics;
  if (subj.includes("chem")) return chemistry;
  if (subj.includes("bio")) return biology;
  return physics;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export function generateSampleQuestions(
  subjectName: string,
  sectionTitle: string,
  type: "MCQ" | "Structured" | "Essay",
  count: number,
  year: number,
): AdminQuestion[] {
  const bank = pickBank(subjectName, sectionTitle);
  const pool =
    type === "MCQ" ? bank.mcq : type === "Structured" ? bank.structured : bank.essay;

  // Maths sections never hold MCQs in this app — fall back to structured pool if asked.
  const safePool =
    pool.length === 0
      ? type === "Essay"
        ? bank.essay
        : bank.structured
      : pool;
  if (safePool.length === 0) return [];

  const out: AdminQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const tpl = safePool[i % safePool.length];
    const variant = Math.floor(i / safePool.length) + 1;
    const suffix = variant > 1 ? ` (variant ${variant})` : "";
    const prefix = `[${year}] `;
    if (type === "MCQ") {
      const m = tpl as MCQTpl;
      out.push({
        id: uid(),
        number: i + 1,
        type: "MCQ",
        text: prefix + m.text + suffix,
        options: KEYS.map((k, idx) => ({ key: k, text: m.options[idx] })),
        correct: m.correct,
        explanation: m.explanation,
        topic: m.topic,
        difficulty: m.difficulty,
        marks: 1,
      });
    } else {
      const l = tpl as LongTpl;
      out.push({
        id: uid(),
        number: i + 1,
        type,
        text: prefix + l.text + suffix,
        modelAnswer: l.modelAnswer,
        explanation: l.explanation,
        topic: l.topic,
        difficulty: l.difficulty,
        marks: l.marks,
      });
    }
  }
  return out;
}
