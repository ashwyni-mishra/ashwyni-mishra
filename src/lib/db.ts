import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Default data representing the user's resume
export const defaultData = {
  config: {
    siteName: "Ashwani.",
    githubUrl: "https://github.com/ashwyni-mishra",
    email: "ashwani@ashwanimishra.me",
    footerText: "Built with Precision & Security.",
    navLinks: [
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: 'Experience', path: '/experience' },
      { name: 'About', path: '/about' },
      { name: 'Blog', path: '/blog' }
    ]
  },
  profile: {
    name: "Ashwani Mishra",
    headline: "Security Researcher & Student",
    bio: "Cybersecurity student and independent researcher at Parul University. I specialize in vulnerability assessment, automated reconnaissance workflows, and offensive-security research, with a passion for identifying and mitigating emerging threats."
  },
  education: [
    {
      school: "Parul University",
      degree: "B.Tech in Computer Science (Cyber Security)",
      period: "2025 – 2029",
      location: "Vadodara, Gujarat",
      description: "Specializing in network security, digital forensics, and secure software development lifecycles."
    },
    {
      school: "Gujarat Secondary and Higher Secondary Education Board",
      degree: "Higher Secondary (Science)",
      period: "2023 – 2025",
      location: "Gujarat",
      description: "Focused on advanced mathematics and computer science fundamentals."
    }
  ],
  experience: [
    {
      company: "Independent Research",
      role: "Security Researcher",
      period: "2025 – Present",
      location: "Remote",
      description: "Conducting independent research into vulnerability assessment methodologies and automated reconnaissance frameworks. Focusing on identifying and mitigating security gaps in modern web architectures.",
      highlights: [
        "Vulnerability research and disclosure",
        "Automated recon framework development",
        "Security methodology documentation"
      ]
    },
    {
      company: "Shadowfox",
      role: "Cybersecurity Intern",
      period: "Feb 2026 – Mar 2026",
      location: "Remote",
      description: "Conducted exhaustive vulnerability assessments and penetration tests. Optimized reconnaissance workflows through automation and custom scripting.",
      highlights: [
        "Vulnerability assessment (Nmap, Burp Suite, Metasploit)",
        "OWASP Top 10 mitigation strategies"
      ]
    }
  ],
  projects: [
    {
      title: "ReconForge – Web Vulnerability Meta Scanner",
      description: "A Python-based meta-scanner that integrates multiple security tools like Nuclei, Nikto, and Wapiti for comprehensive web vulnerability assessment. Features an automated recon workflow and report generation.",
      technologies: ["Python", "Nuclei", "Nikto", "Wapiti"],
      github: "https://github.com/ashwyni-mishra/reconforge"
    },
    {
      title: "VulnStrike – Bug Bounty Automation Framework",
      description: "Automated reconnaissance framework designed for bug bounty hunters. Includes CVE intelligence gathering, plugin-based architecture for custom scanners, and automated domain discovery.",
      technologies: ["Python", "Automation", "CVE Intelligence"],
      github: "https://github.com/ashwyni-mishra/vulnstrike"
    },
    {
      title: "XSS-Guard – Real-time XSS Detection",
      description: "Developed a browser extension and middleware for real-time detection and mitigation of Cross-Site Scripting (XSS) attacks using advanced regex and context-aware filtering.",
      technologies: ["JavaScript", "Security", "Regex"],
      github: "https://github.com/ashwyni-mishra/xss-guard"
    }
  ],
  skills: {
    "Programming": ["C", "C++", "Java", "Python", "JS", "Bash"],
    "Security": ["Nmap", "Burp Suite", "Wireshark", "OWASP", "Networking"],
    "Platforms": ["Linux", "Kali Linux", "Vite", "Firebase"]
  },
  resources: [
    { title: "Bug Bounty Tools", url: "https://github.com/ashwyni-mishra", category: "Open Source" },
    { title: "Security Checklists", url: "#", category: "Guides" }
  ],
  posts: [],
  pages: []
};

export const getPublicPortfolioData = async () => {
  if (!db) {
    console.warn("Firestore not configured, using default mock data");
    return defaultData;
  }
  try {
    const docRef = doc(db, 'portfolio', 'data');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return default data if DB is empty
      return defaultData;
    }
  } catch (error) {
    console.warn("Firestore query failed, using default mock data", error);
    return defaultData;
  }
};

export const updatePortfolioData = async (data: any) => {
  if (!db) {
    throw new Error("Cannot update: Firestore is not configured. Please add your Firebase credentials to .env.local.");
  }
  const docRef = doc(db, 'portfolio', 'data');
  await setDoc(docRef, data, { merge: true });
};
