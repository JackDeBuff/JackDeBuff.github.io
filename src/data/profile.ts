export const profile = {
  name: "Supawich Puengdang",
  nickname: "Jack",
  handle: "JackDeBuff",
  title: "Data Scientist · Machine Learning @ Duke University",
  /** Rotating status one-liners — Jack's own rap-cadence jokes. Add freely. */
  taglines: [
    "AI is cool, but the AC in my room is cooler — even my cat hates it and chooses to sleep in the washer.",
    "Part-time investor — just lost $2,000 because of Madrid.",
  ],
  location: "Durham, NC 🇺🇸 · est. Bangkok 🇹🇭",
  email: "supawich@gmail.com",
  github: "https://github.com/JackDeBuff",
  linkedin: "https://www.linkedin.com/in/supawich-puengdang-9197781a4/",
  about: [
    "Hi, my name is Jack 👋 and I ❤️ AI and Memes.",
    "I'm a Data Scientist specializing in deep learning and geospatial analytics. I've built and shipped asset-appraisal models, fraud-detection systems, and automated AI-powered room decoration — real ML in real production.",
    "Currently exploring Generative AI and agentic systems while doing my Master's at Duke.",
  ],
  interests: ["Generative AI", "AI Agents", "Geospatial ML", "Computer Vision", "Financial AI"],
  education: [
    {
      school: "Duke University",
      place: "Durham, NC",
      degree: "M.S. Electrical & Computer Engineering — Machine Learning track",
      period: "2025 – 2027",
      detail: "GPA 3.92",
    },
    {
      school: "Chulalongkorn University",
      place: "Bangkok, Thailand",
      degree: "B.Eng. Computer Engineering — 2nd Class Honors",
      period: "2019 – 2023",
      detail: "GPA 3.58",
    },
  ],
  experience: [
    {
      role: "Professional Data Scientist",
      company: "KASIKORN Labs (KBTG)",
      period: "Jun 2023 – Jul 2025",
      bullets: [
        "Pioneered deep learning for land appraisal — cut the process from two weeks to minutes, saving up to $500K and drastically reducing appraiser workload.",
        "Built an automated AI agent pipeline (Flux.1 Kontext + Google Gemini) that decorated 100,000+ room images on KBank's NPA site — projected 40%+ sales lift.",
      ],
    },
    {
      role: "Data Scientist Research Intern",
      company: "KASIKORN Labs (KBTG)",
      period: "Jun 2022 – May 2023",
      bullets: [
        "Developed a CatBoost + XGBoost + LightGBM ensemble for credit-risk assessment, predicting late-payment probability from questionnaire data.",
      ],
    },
  ],
  publications: [
    {
      title: "Thailand Asset Value Estimation Using Aerial or Satellite Imagery",
      venue: "IEEE TENCON 2023",
      doi: "https://doi.org/10.1109/TENCON58879.2023.10322494",
      note: "A breakthrough pioneering AI-driven asset valuation in the Thai asset industry 🚀 — Siamese-inspired network with an EfficientNet backbone: AUC 0.81, recall up from 59.26% to 69.55% over baseline.",
    },
    {
      title: "EEG-Based Person Authentication Using Deep Learning with Visual Stimulation",
      venue: "IEEE KST 2019",
      doi: "https://doi.org/10.1109/KST.2019.8687819",
      note: "SSVEP + ERP brainwaves → LSTM → your brain is your password, on consumer-grade BCI devices. 35 citations 📈 and climbing.",
    },
  ],
  awards: [
    {
      name: "AIHack Thailand 2021 — Winner",
      detail: "Highest AUC in the AI × Financial Data track: ensemble classifier predicting long-overdue debtors.",
    },
    {
      name: "ARV Hackathon 2021 — Winner",
      detail: "Best mAP@0.5 of 20 finalist teams: synthetic underwater dataset + YOLOv5 subsea object detection.",
    },
    {
      name: "TMLCC 2021 — 1st Runner-up",
      detail: "Multimodal graph neural networks predicting gas adsorption of metal-organic frameworks.",
    },
    {
      name: "Intel ISEF 2018 — Finalist",
      detail: "EEG-based biometric authentication; the same project won Best of IT at the Prime Minister's Science Awards 2019, 1st Prize at ASEAN Student Science Project 2018, and Runner-up at the Young Scientist Competition 2018.",
    },
    {
      name: "Outstanding National Youth Award 2019",
      detail: "Innovation & Invention, from Thailand's Ministry of Social Development and Human Security.",
    },
  ],
  skills: {
    "ML / Deep Learning": ["PyTorch", "TensorFlow", "scikit-learn"],
    "Data & Analytics": ["Pandas", "NumPy", "Plotly", "Gradio", "BeautifulSoup"],
    Geospatial: ["GeoPandas", "Shapely", "Folium"],
    Languages: ["Python", "C", "C++", "Go", "SQL"],
    Infra: ["Docker", "Kubernetes", "MongoDB"],
  },
} as const;

/** Jack's "JackDeBuff" playlist (music.youtube.com/playlist?list=PLUgvJ4CJAUaI). */
export const YT_PLAYLIST_ID = "PLUgvJ4CJAUaI";
