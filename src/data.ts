import { ProposalStructure } from "./types";

export const companyDetails = {
  name: "FADAK MEDIA HUB NIGERIA LIMITED",
  rc: "8426199",
  tagline: "Media · Technology · Strategy",
  address: "No 15 NNPC Plaza, WTC Roundabout, Katsina, Katsina State",
  tel: "09160628769",
  email: "fadakmediahub@gmail.com",
  web: "www.fadakmediahub.com",
  ceoName: "Fatima Dauda Kurfi",
  ceoTitle: "Lead Consultant / Executive Producer"
};

export const defaultProposals: ProposalStructure[] = [
  {
    id: "zamfara_renaissance",
    templateName: "The Zamfara Renaissance (Governor Dauda Lawal)",
    coverTitle: "THE ZAMFARA RENAISSANCE",
    coverSubtitle: "A Media Documentary on Human Capital & Investment in ZAMFARA State (2023 – 2026)",
    coverBadge: "ZAMFARA STATE GOVERNMENT · GOVERNMENT HOUSE, GUSAU",
    coverDescription: "A formal proposal for the production of a landmark documentary chronicling the leadership, vision, reforms, and developmental legacy of His Excellency, Governor Dauda Lawal — with particular focus on industrialization, human capital, and agricultural revitalization.",
    recipient: {
      name: "The Executive Governor of Zamfara state",
      headingName: "His Excellency, Dauda Lawal",
      address: "Government House, Gusau, Zamfara State.",
      attention: "The Honorable Commissioner for Information and Culture",
      date: "29th January 2026"
    },
    company: { ...companyDetails },
    letterTitle: "LETTER OF PROPOSAL: DOCUMENTING THE \"ZAMFARA MIRACLE\" – A CINEMATIC REVIEW OF HUMAN CAPITAL AND INVESTMENT UNDER THE ADMINISTRATION OF GOVERNOR DAUDA LAWAL FROM (2023- 2026)",
    letterBody: [
      "I am writing to formally propose the production of a high-impact, multi-platform media documentary titled \"The Zamfara Renaissance” This project is designed to showcase the unprecedented strides your administration has made in transforming Zamfara State into a national model for industrialization, human capital development, and fiscal discipline.",
      "Under your leadership, Zamfara has moved from a state of \"Despair” to becoming a beacon of hope and progress”. From the Revitalization of the agricultural sector to the massive investment in Education and health care. The “Zamfara Miracle\" is a story that deserves a world-class narrative.",
      "The Objective:\nAs we enter the consolidation phase of 2026, it is vital to institutionalize your legacy. This documentary will serve as:\n1. A Global Marketing Tool: Attracting further Foreign Direct Investment (FDI) to Zamfara’s Industrial and agricultural sector.\n2. A Historical Record: Documenting the tangible impact of your policies on the lives of the people of Zamfara.\n3. A National Benchmark: Positioning Zamfara as the premier example of sub-national governance in Africa.",
      "The Deliverables:\nOur team is prepared to deploy state-of-the-art 4K cinematography and drone technology to produce a 30-minute master documentary for national television (Channels, Arewa24 & NTA), alongside a series of digital \"Impact Clips\" for the youth demographic on social media.",
      "Attached to this letter is a detailed proposal covering the thematic pillars, production timeline, and a comprehensive justification of costs.",
      "We are eager to partner with the Zamfara State Government to ensure that the story of this transformation is told with the prestige and clarity it deserves. We look forward to a favorable response to discuss the commencement of this historic project."
    ],
    letterSignoff: "Fatima Dauda Kurfi\nLead Consultant/Executive Producer\nFADAK MEDIA",
    docTitle: "PROPOSAL: \"THE ZAMFARA RENAISSANCE\"",
    docSubtitle: "A Media Documentary on Human Capital & Investment in ZAMFARA State (2023 – 2026)",
    execSummary: "Since 2023, Zamfara State has undergone a radical socio-economic shift under the leadership of Governor DAUDA LAWAL. Guided by the 10-years Development plan (SIX POINT AGENDA 2025-2035), the administration has moved from \"recovery\" to \"consolidation.\" This proposal outlines a multi-platform media documentary designed to showcase Zamfara as a national model for human capital development and Industrial investment.",
    objectives: [
      "Narrative Ownership: To tell the authentic story of Zamfara progress through the eyes of its people.",
      "Investment Promotion: To highlight Zamfara’s potential for investment and attract global investors.",
      "Accountability: To provide a visual record of the administration’s achievements and impact.",
      "Educational Resource: To serve as a case study for sub-national governors In Nigeria."
    ],
    pillars: [
      {
        id: "p1",
        pillar: "Agriculture",
        highlight: "Revitalization of agriculture, investment in modern Farming techniques, and food security initiatives."
      },
      {
        id: "p2",
        pillar: "Education & Youth",
        highlight: "Building schools, teacher training, and youth empowerment programs."
      },
      {
        id: "p3",
        pillar: "The Health Miracle",
        highlight: "Upgrading healthcare facilities, increasing access to medical services, and disease prevention."
      },
      {
        id: "p4",
        pillar: "Infrastructure",
        highlight: "The ongoing construction of Gusau International Airport, Multi-billion naira road dualization projects in the state capital."
      },
      {
        id: "p5",
        pillar: "Governance & Transparency",
        highlight: "Anti- corruption measures, transparency in governance, and citizen’s engagement."
      }
    ],
    strategy: [
      {
        id: "s1",
        title: "Human-Interest Interviews",
        description: "Instead of just officials, we will interview a teacher in a new classroom, a farmer using the new roads, and a youth employed at GEEP."
      },
      {
        id: "s2",
        title: "Visual Assets",
        description: "4K drone cinematography of the Zamfara skyline, the Gusau international airport, Gusau ultra motor- Park, Dan-sadau road etc."
      },
      {
        id: "s3",
        title: "Data Visualization",
        description: "Using 3D motion graphics to show the rise in WAEC pass rates (from 22% to 70%+) and IGR growth."
      },
      {
        id: "s4",
        title: "Multi-Language Versions",
        description: "Production in English, Hausa, and Fulfulde to ensure every Zamfara indigene feels included."
      }
    ],
    distribution: [
      {
        id: "d1",
        title: "Television",
        description: "Premiere on NTA, Channels TV, and Arewa24."
      },
      {
        id: "d2",
        title: "Digital",
        description: "Short \"Highlight Reels\" (60 seconds) for TikTok, Instagram, and X (Twitter)."
      },
      {
        id: "d3",
        title: "Local Reach",
        description: "Broadcast on Zamfara Media Corporation (ZMC) and local radio stations."
      },
      {
        id: "d4",
        title: "International",
        description: "Submissions to Nigerian Diaspora forums and Investment Summits."
      }
    ],
    timeline: [
      {
        id: "t1",
        phase: "Phase 1: Pre-Production",
        duration: "2 Weeks",
        description: "Research, scriptwriting, and securing interview appointments."
      },
      {
        id: "t2",
        phase: "Phase 2: Production",
        duration: "4 Weeks",
        description: "Filming across the 14 LGAs."
      },
      {
        id: "t3",
        phase: "Phase 3: Post-Production",
        duration: "3 Weeks",
        description: "Editing, voiceovers, and graphics."
      },
      {
        id: "t4",
        phase: "Phase 4: Launch",
        duration: "Week 10",
        description: "Grand premiere and media rollout."
      }
    ],
    budget: [
      {
        id: "b1",
        category: "1. Pre-Production",
        description: "Research, Scriptwriting (English/Hausa), and Location Scouting across Zamfara.",
        cost: 3500000
      },
      {
        id: "b2",
        category: "2. Production (Filming)",
        description: "10–14 days shoot. Includes 4K Cameras, Drone Pilot, Lighting, and Sound Crew.",
        cost: 10000000
      },
      {
        id: "b3",
        category: "3. Logistics",
        description: "Crew travel (Abuja/Lagos to Zamfara), local transport, and accommodation.",
        cost: 4000000
      },
      {
        id: "b4",
        category: "4. Post-Production",
        description: "Editing, 3D Data Motion Graphics, Professional Voiceover, and Color Grading.",
        cost: 5000000
      },
      {
        id: "b5",
        category: "5. National Airtime",
        description: "1-time airing of 30-min documentary on Channels TV, Arise, or NTA.",
        cost: 20000000
      },
      {
        id: "b6",
        category: "6. Local Media & Digital",
        description: "Airing on Zamfara Media Corp (ZMC) + Social Media \"Highlight\" Ads.",
        cost: 3000000
      },
      {
        id: "b7",
        category: "7. Contingency",
        description: "10% for unforeseen costs (fuel, security, extra days).",
        cost: 5000000
      }
    ],
    justification: [
      {
        id: "j1",
        num: "I",
        title: "Protection of Political & Developmental Legacy",
        details: "In the digital age, a narrative left untold is a narrative lost. Governor Dauda Lawal has executed landmark projects—such as the Gusau International Airport and the education reforms. High-quality documentation ensures that these achievements are preserved in history and protected from misinformation.",
        value: "Institutionalizing the \"Zamfara Model\" of governance for future generations."
      },
      {
        id: "j2",
        num: "ii",
        title: "Investment Promotion & Brand Equity (FDI Attraction)",
        details: "Zamfara State has been ranked #1 in Primary health care (north-west) securing $500,000 and highest in IGR growth in 2024. Zamfara is rich in Gold, copper, lithium, and agricultural resources. To attract international investors in mining, the state needs a marketing tool that matches global standards.",
        value: "A cinematic documentary acts as a \"Video Prospectus\" that can be shown at international investment summits, potentially attracting billions in private sector capital."
      },
      {
        id: "j3",
        num: "iii",
        title: "Public Trust & Social Contract (Accountability)",
        details: "The 2026 \"Budget of stability & growth\" is a promise to the people. By showing visual evidence of 440 renovated schools, Rehabilitation of the 11.65k Rawayya-furfuri kurya Madori road. the administration strengthens the \"Social Contract.\"",
        value: "Increasing \"Political Capital\" and citizen cooperation by making the government's work visible to the grassroots."
      },
      {
        id: "j4",
        num: "iv",
        title: "Premium Production for National Prestige",
        details: "To compete for attention on national platforms like Channels TV, Arise News, Arewa 24 and NTA, the production quality must be world-class.\n• 4K & Drone Technology: Essential to show the massive scale of infrastructure projects (Roads and the Industrial Park).\n• National Airtime: Ensures that the Zamfara success story is heard in Abuja and Lagos, where federal policy-makers and corporate leaders reside.",
        value: "Achieving standard national reporting prestige and setting benchmark policy conversations."
      }
    ],
    costBenefit: [
      {
        id: "cb1",
        area: "National Airtime",
        benefit: "National visibility for Zamfara’s industrialization and human capital development."
      },
      {
        id: "cb2",
        area: "High-End Production",
        benefit: "Credibility with international donors (World Bank, AfDB, etc.)."
      },
      {
        id: "cb3",
        area: "Digital Distribution",
        benefit: "Engaging the youth demographic (50% of the population) via social media."
      }
    ],
    conclusionTitle: "8. CONCLUSION AND CALL TO ACTION",
    conclusionParagraphs: [
      "The trajectory of Zamfara since 2023 is a testament to what is possible when visionary leadership meets disciplined execution. From the industrial blueprint of His Excellency Dauda Lawal to the historic enrollment of 854,990 girl child to school in Zamfara State is no longer just \"The farming is our pride\"; it is now the Industrial Hub of the Northwest. This documentary will ensure that the legacy of Governor Dauda Lawal administration is documented with the prestige and clarity it deserves, and the \"Zamfara Miracle\" is a story that belongs to all Nigerians.",
      "However, achievements that are not documented are often forgotten. \"The Zamfara Renaissance\" is more than a television program; it is a strategic asset designed to:",
      "1. Seal the Legacy of the Dauda Lawal administration as the most transformative era in the state’s history.\n2. Market the State as Nigeria’s premier destination for sustainable investment.\n3. Inspire the Citizens by showing them how far they have come under this leadership."
    ],
    pathForwardTitle: "The Path Forward:",
    pathForwardItems: [
      "Review the technical roadmap and interview list.",
      "Finalize the production budget and timeline.",
      "Discuss the strategic launch date to align with the state’s 2026 calendar of events."
    ],
    pathForwardClosing: "Your Excellency, Zamfara is no longer just a state in the North-west, it is a national benchmark. Let us help you tell that story to the world with the prestige and excellence it deserves."
  },
  {
    id: "architect_new_nigeria",
    templateName: "The Architect of a New Nigeria (President Bola Tinubu)",
    coverTitle: "THE ARCHITECT OF A NEW NIGERIA",
    coverSubtitle: "His Excellency, President Bola Ahmed Tinubu, GCFR — Vision, Reforms & National Renewal",
    coverBadge: "FEDERAL REPUBLIC OF NIGERIA · PRESIDENTIAL VILLA, ABUJA",
    coverDescription: "A formal proposal for the production of a landmark documentary chronicling the leadership, vision, reforms, and developmental legacy of His Excellency, President Bola Ahmed Tinubu — with particular focus on his impact on Northern Nigeria and the nation at large.",
    recipient: {
      name: "His Excellency, President Bola Ahmed Tinubu, GCFR",
      headingName: "President & Commander-in-Chief",
      address: "Presidential Villa, Aso Rock, Abuja.",
      attention: "The Chief of Staff to the President / Honorable Minister of Information & National Orientation",
      date: "31st May 2026"
    },
    company: { ...companyDetails },
    letterTitle: "LETTER OF PROPOSAL: CHRONICLING NATION-BUILDING AND RESTRUCTURING – \"THE ARCHITECT OF A NEW NIGERIA\"",
    letterBody: [
      "I am writing to formally propose the production of a high-impact, multi-platform media documentary/series titled \"The Architect of a New Nigeria.” This landmark media asset is designed to showcase the profound and unprecedented reforms initiated under your administration to put Nigeria on the path of robust self-reliance, fiscal sustainability, and democratic progress.",
      "In the course of your mandate, your administration has made bold, difficult, and visionary decisions. From crucial monetary reforms to massive critical infrastructure developments such as Lagos-Calabar Coastal Highway and regional agriculture corridors, your leadership has begun rewriting the foundational narrative of Africa's largest economy.",
      "The Objectives:\nAs we drive national renewal forward, showcasing the strategic impacts of your policies to local communities and global investors is vital. This film serves as:\n1. A Global Investment Compass: Spotlighting Nigeria's secure opportunities in energy, agriculture, and blue economy.\n2. A Narrative Reference: Dispelling biased reporting with raw, visual development evidence from state projects.\n3. A National Unifier: Highlighting sub-national synergy and infrastructure initiatives across the geopolitical zones.",
      "The Deliverables:\nOur team will deploy state-of-the-art cinematic resources to film key milestone projects across the six geopolitical zones, producing a high-impact 30-minute feature and multi-lingual digital highlights optimized for maximum social web distribution.",
      "Attached to this letter is the complete technical breakdown outlining target milestones, budgetary categories, and distribution pathways.",
      "We look forward to an opportunity to collaborate on this highly strategic development. Ready to mobilize our professional team to capture these defining moments of modern Nigerian history."
    ],
    letterSignoff: "Fatima Dauda Kurfi\nLead Consultant/Executive Producer\nFADAK MEDIA HUB NIGERIA LIMITED",
    docTitle: "PROPOSAL: \"THE ARCHITECT OF A NEW NIGERIA\"",
    docSubtitle: "Chronicling National Renewal and Structural Milestones (2023 - 2026)",
    execSummary: "This proposal details the production pipeline for a premier documentary tracking the macro-economic and infrastructural transformation of Nigeria. Built around bold economic reforms and structural shifts, this documentary will provide high-contrast, data-driven visualizations of Nigeria's journey towards sustainable growth and continental prestige.",
    objectives: [
      "Re-establishing Narrative Control: Illustrative storytelling highlighting the concrete benefits of federal policies.",
      "Boosting Global Investor Trust: Presenting structural reforms as a secure foundation for long-term private equity.",
      "Showcasing Inter-State Synergy: Demystifying policy impacts inside communities across Northern Nigeria and the federation.",
      "Fostering Institutional Synergy: Fulfilling the social contract by bringing project accountability to light."
    ],
    pillars: [
      {
        id: "ap1",
        pillar: "Macro-Fiscal Reforms",
        highlight: "Currency harmonization, subsidy redirection, and systematic reduction in sovereignty debt burden."
      },
      {
        id: "ap2",
        pillar: "National Infrastructure",
        highlight: "Lagos-Calabar Coastal Highway, Northern agricultural bypasses, and major modern power plant integrations."
      },
      {
        id: "ap3",
        pillar: "Agricultural Sourced Food",
        highlight: "Empowerment programs in food security, dry season crop initiatives, and massive direct agro-inputs."
      },
      {
        id: "ap4",
        pillar: "Youth Tech & GEEP",
        highlight: "Direct incubation schemes, creative enterprise capitals, and massive tech talent programs."
      }
    ],
    strategy: [
      {
        id: "as1",
        title: "High-Fidelity Site Visits",
        description: "Capturing direct physical footage with modern drones and ultra-HD gear to present raw development progress."
      },
      {
        id: "as2",
        title: "Grassroots Perspectives",
        description: "Focusing on local farmers, remote traders, and young digital technicians who participate in these reforms."
      }
    ],
    distribution: [
      {
        id: "ad1",
        title: "National Broadcasters",
        description: "Simultaneous premiering on Channels TV, Arise News, NTA, and major Northern networks like Arewa24."
      },
      {
        id: "ad2",
        title: "Digital Saturation",
        description: "Staggered high-impact content edits distributed across YouTube, TikTok, and X."
      }
    ],
    timeline: [
      {
        id: "at1",
        phase: "Phase 1: Deep Research",
        duration: "3 Weeks",
        description: "Aligning with ministry officers, drafting script, and setting up interview lists."
      },
      {
        id: "at2",
        phase: "Phase 2: National Shoots",
        duration: "5 Weeks",
        description: "Conducting multi-state on-site captures and drone fly-throughs."
      }
    ],
    budget: [
      {
        id: "ab1",
        category: "1. Pre-Production & Research",
        description: "Scriptwriting, national archival access fees, and stakeholder coordinates.",
        cost: 4000000
      },
      {
        id: "ab2",
        category: "2. Visual Shoots & Drone Travel",
        description: "Cinematography crew deployment across major regional development spots.",
        cost: 15000000
      },
      {
        id: "ab3",
        category: "3. Post-Production Graphics",
        description: "High-end 3D visual statistics tracking the fiscal macro indicators.",
        cost: 6000000
      },
      {
        id: "ab4",
        category: "4. Airtime & Media Buyout",
        description: "Multi-channel nationwide primary broadcast and dynamic social target advertisements.",
        cost: 25000000
      },
      {
        id: "ab5",
        category: "5. Logistics & Contingency",
        description: "Fuel, interstate permissions, security protocols, and crew insurance.",
        cost: 5500000
      }
    ],
    justification: [
      {
        id: "aj1",
        num: "I",
        title: "Sovereign Heritage Documentation",
        details: "Critical economic shifts require dedicated archives to prevent informational gaps and accurately portray structural choices to subsequent generations.",
        value: "Fulfills the state documentation requirements to chronicle transformative federal epochs."
      },
      {
        id: "aj2",
        num: "ii",
        title: "Investment Magnetization",
        details: "Direct proof of policy performance acts as a robust investment tool, helping build confidence in global markets and attracting private sovereign investments.",
        value: "Provides a premium marketing asset suitable for trade summits and economic forums."
      }
    ],
    costBenefit: [
      {
        id: "acb1",
        area: "National Airtime",
        benefit: "Establishes unified national messaging around reforms across urban and grassroots centers."
      },
      {
        id: "acb2",
        area: "Premium Asset",
        benefit: "Can be translated into international trade brochures to present progress directly."
      }
    ],
    conclusionTitle: "CONCLUSION AND CALL TO ACTION",
    conclusionParagraphs: [
      "The current epoch represents a pivotal historical juncture. Clear, modern, and factual documentation of these foundational reforms is vital to counter doubt, build patriotism, and attract capital. 'The Architect of a New Nigeria' represents a decisive instrument designed to achieve absolute clarity, and immortalize these grand national transformations.",
      "By showcasing the physical outcomes of the national vision, we give citizens reasons for enduring optimism and show the world that Nigeria is ready for sustainable, premium-scale investment."
    ],
    pathForwardTitle: "Recommended Milestones:",
    pathForwardItems: [
      "Securing administrative approvals & designated liaison officers.",
      "Conducting scoping interviews with lead policy makers.",
      "Structuring launching logistics aligned to strategic national days."
    ],
    pathForwardClosing: "Let us help you craft this defining visual chapter of Nigeria's historic renaissance."
  }
];
