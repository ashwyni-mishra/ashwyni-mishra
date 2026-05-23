import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Calendar,
    BookOpen,
    FileText,
    Video,
    HelpCircle,
    ArrowLeft,
    ExternalLink,
    Share2,
    Download,
    X,
    ChevronRight,
    Trash2
} from 'lucide-react';

// Mock dataset for legal resources, FAQs, and support materials
export const legalResources = [
    {
        id: "res-1",
        title: "Understanding FIR Filing",
        description: "A comprehensive step-by-step guide explaining how to file a First Information Report (FIR) at your local police station.",
        category: "Court Procedures",
        type: "Article",
        date: "2026-05-18T10:00:00.000Z",
        dateLabel: "May 18, 2026",
        keywords: ["fir", "police", "complaint", "criminal", "filing"],
        content: "A First Information Report (FIR) is a written document prepared by the police when they receive information about the commission of a cognizable offense. Anyone can file an FIR, either the victim, a witness, or someone who has knowledge of the crime. Under Section 154 of the CrPC (now Section 173 of Bharatiya Nagarik Suraksha Sanhita, BNSS), the police must record the information in writing. Ensure you get a free copy of the FIR immediately after filing. If the police refuse to register it, you can send the substance of the information in writing to the Superintendent of Police (SP) or file a private complaint before a Magistrate.",
        link: "https://example.com/fir-guide"
    },
    {
        id: "res-2",
        title: "BNS Section 42: Right of Private Defense",
        description: "An analysis of Section 42 of the Bharatiya Nyaya Sanhita (BNS) covering self-defense laws and limitations in India.",
        category: "Legal Basics",
        type: "Article",
        date: "2026-04-20T10:00:00.000Z",
        dateLabel: "April 20, 2026",
        keywords: ["defense", "self-defense", "bns", "private defense", "law"],
        content: "Section 42 of the Bharatiya Nyaya Sanhita (BNS) states that nothing is an offense which is done in the exercise of the right of private defense. Every person has a right to defend their own body and property (and the body and property of others) against any offense. However, this right is subject to restrictions. You cannot inflict more harm than is necessary for defense, and the right does not extend to cases where there is time to have recourse to the protection of public authorities.",
        link: "https://example.com/bns-section-42"
    },
    {
        id: "res-3",
        title: "How to use Nyay Saarthi (Vakil Friend AI)",
        description: "Learn how to navigate our virtual AI legal assistant to draft court petitions and clarify doubts in native Indian languages.",
        category: "User Support",
        type: "Video",
        date: "2026-05-22T10:00:00.000Z",
        dateLabel: "May 22, 2026",
        keywords: ["ai", "chat", "assistant", "saarthi", "help", "video"],
        content: "Nyay Saarthi is your intelligent virtual conversational workspace. It features split-screen intelligence allowing you to converse with the AI on the left and see generated petitions or documents on the right. You can type or use speech recognition in English, Hindi, Tamil, and other regional languages. This video guide walks you through starting a session, uploading drafts, asking questions about the BNS, and submitting completed petitions directly to court.",
        attachment: { name: "NyaySaarthi_Tutorial.mp4", duration: "4:32" },
        link: "https://example.com/saarthi-video"
    },
    {
        id: "res-4",
        title: "Required Documents for Bail Applications",
        description: "A checklist of necessary documentation, identity proofs, and surety bonds required when applying for bail in civil or criminal matters.",
        category: "Court Procedures",
        type: "PDF",
        date: "2026-03-15T10:00:00.000Z",
        dateLabel: "March 15, 2026",
        keywords: ["bail", "documents", "checklist", "court", "surety"],
        content: "Filing for bail requires specific documentation to ensure the accused will not abscond and will comply with court summons. Required documents include: 1. Identity proof of the accused (Aadhaar, Passport, or Voter ID). 2. Address proof of the accused. 3. Identity and address proof of the surety (along with property documents, bank statements, or salary slips to prove financial capability). 4. Signed vakalatnama of the lawyer. 5. Certified copy of the FIR and the arrest memo. Download this PDF for a complete checklist and sample bond forms.",
        attachment: { name: "Bail_Application_Checklist.pdf", size: "1.2 MB" },
        link: "https://example.com/bail-checklist-pdf"
    },
    {
        id: "res-5",
        title: "FAQ: How are Lawyers Assigned to Cases?",
        description: "Answers to common questions regarding lawyer assignment, legal representation fees, and client-lawyer confidentiality.",
        category: "FAQ",
        type: "FAQ",
        date: "2026-05-19T10:00:00.000Z",
        dateLabel: "May 19, 2026",
        keywords: ["lawyer", "assignment", "fees", "confidentiality", "legal aid"],
        content: "Q: How does NyaySetu assign a lawyer to my case?\nA: Litigants can browse verified lawyers by specialization, experience, and rating under the \"Find a Lawyer\" portal. Alternatively, under legal aid provisions, the system can auto-propose available lawyers for your case. Once you send a request, the lawyer can accept or suggest consultation times. All communication inside the platform is protected by strict client-lawyer confidentiality and recorded securely on our dashboard. Legal aid cases may qualify for fee waivers supported by the state government."
    },
    {
        id: "res-6",
        title: "Video: Participating in a Virtual Court Hearing",
        description: "A short, helpful walkthrough explaining the process of joining, behaving, and presenting evidence during a Jitsi-powered remote judicial hearing.",
        category: "User Support",
        type: "Video",
        date: "2026-05-10T10:00:00.000Z",
        dateLabel: "May 10, 2026",
        keywords: ["hearing", "virtual", "court", "jitsi", "video", "etiquette"],
        content: "Virtual hearings on NyaySetu are powered by secure, high-bandwidth Jitsi Meet frames. To participate: 1. Ensure you have a stable network connection. You can use the VOIS 5G network tester directly on the dashboard. 2. Log in 10 minutes early. 3. Keep your microphone muted until the Honorable Judge asks you to speak. 4. Keep your camera at eye level in a well-lit room. 5. Be dressed in formal or sober attire. Watch this video to see a mock virtual court session in action.",
        attachment: { name: "Virtual_Court_Etiquette.mp4", duration: "6:15" },
        link: "https://example.com/hearing-guide-video"
    },
    {
        id: "res-7",
        title: "FAQ: Is my legal data safe and encrypted?",
        description: "Learn how NyaySetu uses end-to-end encryption and cryptographic integrity verification to protect court files.",
        category: "FAQ",
        type: "FAQ",
        date: "2026-05-01T10:00:00.000Z",
        dateLabel: "May 01, 2026",
        keywords: ["security", "encryption", "privacy", "hash", "sha-256", "safety"],
        content: "Q: How is my case data protected?\nA: All user data and communications on NyaySetu are encrypted in transit using TLS 1.3 and at rest with AES-256 bank-grade encryption. Furthermore, case diary entries and critical legal documents have their cryptographic integrity sealed using SHA-256 hashing. This creates a secure, tamper-proof audit trail of all evidence and statements. Only authorized judges, assigned lawyers, and yourself have cryptographic keys to read these documents."
    },
    {
        id: "res-8",
        title: "Citizen Rights Guide Upon Arrest",
        description: "A legal pamphlet outlining a citizen's basic rights under Article 22 of the Constitution, such as the right to consult a lawyer and the 24-hour magistrate presentation rule.",
        category: "Legal Basics",
        type: "PDF",
        date: "2026-05-14T10:00:00.000Z",
        dateLabel: "May 14, 2026",
        keywords: ["rights", "arrest", "constitution", "police", "magistrate"],
        content: "Under Article 22 of the Constitution of India, every arrested person has fundamental rights that cannot be violated: 1. Right to be informed of the grounds of arrest immediately. 2. Right to consult and be defended by a legal practitioner of their choice. 3. Right to be produced before the nearest Magistrate within 24 hours of arrest (excluding travel time). 4. Right to not be subjected to torture or third-degree methods during custody. Download this PDF guide to keep a copy of your constitutional rights on your device.",
        attachment: { name: "Know_Your_Rights_Arrest.pdf", size: "850 KB" },
        link: "https://example.com/arrest-rights-pdf"
    }
];

export const categories = ["Legal Basics", "Court Procedures", "FAQ", "User Support"];
export const types = ["Article", "PDF", "Video", "FAQ"];

/**
 * Core filter+sort logic — exported for unit testing.
 * @param {object} params - Search/filter/sort parameters
 * @param {Date}   [now]  - Optional override for "current time" (used by tests)
 */
export function filterAndSortResources({ searchQuery = '', selectedCategories = [], selectedTypes = [], dateFilter = 'Anytime', sortBy = 'newest' }, now) {
    const currentTime = now || new Date();

    const filtered = legalResources.filter(resource => {
        // 1. Keyword search (matches title, description, content, keywords)
        const query = searchQuery.toLowerCase().trim();
        const matchesKeyword = !query ||
            resource.title.toLowerCase().includes(query) ||
            resource.description.toLowerCase().includes(query) ||
            resource.content.toLowerCase().includes(query) ||
            resource.keywords.some(k => k.toLowerCase().includes(query));

        // 2. Category filter (multi-select)
        const matchesCategory = selectedCategories.length === 0 ||
            selectedCategories.includes(resource.category);

        // 3. Resource type filter (multi-select)
        const matchesType = selectedTypes.length === 0 ||
            selectedTypes.includes(resource.type);

        // 4. Date range filter
        let matchesDate = true;
        if (dateFilter !== 'Anytime') {
            const resDate = new Date(resource.date);
            const timeDiff = currentTime.getTime() - resDate.getTime();
            const daysDiff = timeDiff / (1000 * 3600 * 24);

            if (dateFilter === '7days') {
                matchesDate = daysDiff <= 7 && daysDiff >= 0;
            } else if (dateFilter === '30days') {
                matchesDate = daysDiff <= 30 && daysDiff >= 0;
            } else if (dateFilter === '12months') {
                matchesDate = daysDiff <= 365 && daysDiff >= 0;
            }
        }

        return matchesKeyword && matchesCategory && matchesType && matchesDate;
    });

    return [...filtered].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
        return 0;
    });
}

// Helper: icon per resource type
const getResourceTypeIcon = (type) => {
    switch (type) {
        case 'PDF': return <FileText size={20} color="#EF4444" />;
        case 'Video': return <Video size={20} color="#3B82F6" />;
        case 'Article': return <BookOpen size={20} color="#10B981" />;
        case 'FAQ':
        default: return <HelpCircle size={20} color="#F59E0B" />;
    }
};

export default function ResourcesPage() {
    const navigate = useNavigate();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [dateFilter, setDateFilter] = useState('Anytime');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedResource, setSelectedResource] = useState(null);

    const handleCategoryToggle = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const handleTypeToggle = (type) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategories([]);
        setSelectedTypes([]);
        setDateFilter('Anytime');
        setSortBy('newest');
    };

    // Derive filtered + sorted list using the shared helper
    const sortedResources = filterAndSortResources({ searchQuery, selectedCategories, selectedTypes, dateFilter, sortBy });

    const glassStyle = {
        background: 'var(--bg-glass-strong)',
        backdropFilter: 'var(--glass-blur)',
        border: 'var(--border-glass-strong)',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-glass-strong)'
    };

    return (
        <div className="resources-container" style={{ maxWidth: '1400px', margin: '0 auto' }}>

            {/* Header — matches HearingsPage pattern */}
            <div className="resources-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: 'var(--color-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-glass)'
                    }}>
                        <BookOpen size={28} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                            Resources & FAQs
                        </h1>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
                            Browse simplified legal codes, video guides, FAQs, and official court documents.
                        </p>
                    </div>
                </div>
            </div>

            {/* Layout: sidebar filters + main content */}
            <div className="resources-layout" style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: '2rem' }}>

                {/* Filter Sidebar */}
                <aside className="filters-sidebar" style={{ ...glassStyle, display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'fit-content' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: '700', fontSize: '1.1rem' }}>
                            <Filter size={18} color="var(--color-primary)" /> Filters
                        </span>
                        {(selectedCategories.length > 0 || selectedTypes.length > 0 || dateFilter !== 'Anytime' || searchQuery !== '') && (
                            <button
                                onClick={handleResetFilters}
                                style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                                <Trash2 size={14} /> Clear All
                            </button>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {categories.map(cat => (
                                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryToggle(cat)} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Resource Type */}
                    <div>
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resource Type</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {types.map(t => (
                                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => handleTypeToggle(t)} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
                                    {t}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Date Published */}
                    <div>
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Published</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { value: 'Anytime', label: 'Anytime' },
                                { value: '7days', label: 'Last 7 Days' },
                                { value: '30days', label: 'Last 30 Days' },
                                { value: '12months', label: 'Last 12 Months' }
                            ].map(item => (
                                <label key={item.value} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }}>
                                    <input type="radio" name="date-filter" checked={dateFilter === item.value} onChange={() => setDateFilter(item.value)} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
                                    {item.label}
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="resources-main" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Search + Sort bar */}
                    <div className="resources-search-bar" style={{ ...glassStyle, padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                            <input
                                type="text"
                                placeholder="Search resources, FAQs, sections or keywords..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="search-input"
                                style={{
                                    background: 'var(--bg-glass)', border: 'var(--border-glass)', borderRadius: '0.75rem',
                                    padding: '0.6rem 1rem 0.6rem 2.5rem', color: 'var(--text-main)', outline: 'none', width: '100%',
                                    fontSize: '0.95rem', boxSizing: 'border-box'
                                }}
                            />
                            <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', whiteSpace: 'nowrap' }}>Sort:</span>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                style={{
                                    padding: '0.6rem 1rem', borderRadius: '0.75rem', border: 'var(--border-glass)',
                                    background: 'var(--bg-glass)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '600',
                                    outline: 'none', cursor: 'pointer'
                                }}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="alphabetical">Alphabetical (A-Z)</option>
                            </select>
                        </div>
                    </div>

                    {/* Results count */}
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                        Showing <strong>{sortedResources.length}</strong> of {legalResources.length} resources
                    </p>

                    {/* Empty State */}
                    {sortedResources.length === 0 ? (
                        <div style={{ ...glassStyle, padding: '4rem', textAlign: 'center' }}>
                            <Calendar size={48} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                            <h3 style={{ color: 'var(--text-main)', fontSize: '1.25rem' }}>No resources found</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filters.</p>
                            <button
                                onClick={handleResetFilters}
                                style={{
                                    marginTop: '1rem', padding: '0.75rem 1.5rem', background: 'var(--color-primary)',
                                    color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: '700', cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(30, 42, 68, 0.3)'
                                }}
                            >
                                Reset All Filters
                            </button>
                        </div>
                    ) : (
                        /* Resource Cards */
                        <div className="resources-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                            {sortedResources.map(resource => (
                                <div
                                    key={resource.id}
                                    className="resource-card"
                                    style={{
                                        ...glassStyle,
                                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                    onClick={() => setSelectedResource(resource)}
                                    onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                                    onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = ''; }}
                                >
                                    <div>
                                        {/* Tag + Date */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getResourceTypeIcon(resource.type)}
                                                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
                                                    {resource.category}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Calendar size={12} /> {resource.dateLabel}
                                            </span>
                                        </div>

                                        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.5rem 0', lineHeight: '1.4' }}>
                                            {resource.title}
                                        </h3>
                                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
                                            {resource.description}
                                        </p>
                                    </div>

                                    <div>
                                        {/* Keyword tags */}
                                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                                            {resource.keywords.slice(0, 3).map(kw => (
                                                <span key={kw} style={{ fontSize: '0.72rem', background: 'var(--bg-glass)', color: 'var(--text-secondary)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                                                    #{kw}
                                                </span>
                                            ))}
                                            {resource.keywords.length > 3 && (
                                                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>+{resource.keywords.length - 3} more</span>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                                {resource.type === 'PDF' && '📥 Download PDF'}
                                                {resource.type === 'Video' && '▶️ Watch Video'}
                                                {resource.type === 'Article' && '📖 Read Article'}
                                                {resource.type === 'FAQ' && '💬 View Answer'}
                                            </span>
                                            <ChevronRight size={16} color="var(--color-primary)" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Drawer Modal */}
            {selectedResource && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)', padding: '1.5rem' }} onClick={() => setSelectedResource(null)}>
                    <div style={{ ...glassStyle, width: '100%', maxWidth: '650px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }} onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--bg-glass)' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    {getResourceTypeIcon(selectedResource.type)}
                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {selectedResource.category}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>• {selectedResource.dateLabel}</span>
                                </div>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, lineHeight: '1.3' }}>
                                    {selectedResource.title}
                                </h2>
                            </div>
                            <button onClick={() => setSelectedResource(null)} style={{ background: 'var(--bg-glass)', border: 'var(--border-glass)', color: 'var(--text-main)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <blockquote style={{ margin: 0, padding: '0.75rem 1rem', borderLeft: '3px solid var(--color-primary)', background: 'var(--bg-glass)', borderRadius: '0 8px 8px 0', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5', fontStyle: 'italic' }}>
                                "{selectedResource.description}"
                            </blockquote>

                            <div>
                                <h4 style={{ color: 'var(--text-main)', margin: '0 0 0.5rem 0', fontWeight: '700', fontSize: '0.95rem' }}>Detailed Information</h4>
                                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line', background: 'var(--bg-glass)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)' }}>
                                    {selectedResource.content}
                                </p>
                            </div>

                            {/* Attachment */}
                            {selectedResource.attachment && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-glass)', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {selectedResource.type === 'PDF' ? <FileText size={20} color="#EF4444" /> : <Video size={20} color="#3B82F6" />}
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{selectedResource.attachment.name}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{selectedResource.attachment.size || selectedResource.attachment.duration}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => alert(`Downloading ${selectedResource.attachment.name}...`)}
                                        style={{ background: 'var(--color-primary)', border: 'none', color: 'white', padding: '0.4rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                    >
                                        <Download size={14} /> Download
                                    </button>
                                </div>
                            )}

                            {/* Tags */}
                            <div>
                                <h4 style={{ color: 'var(--text-main)', margin: '0 0 0.5rem 0', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tags & Keywords</h4>
                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    {selectedResource.keywords.map(kw => (
                                        <span key={kw} style={{ fontSize: '0.75rem', background: 'var(--bg-glass)', color: 'var(--text-secondary)', padding: '0.25rem 0.75rem', borderRadius: '20px', border: '1px solid var(--border-light)' }}>#{kw}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--bg-glass)' }}>
                            <button
                                onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!'); }}
                                style={{ padding: '0.6rem 1.2rem', background: 'transparent', border: '1px solid var(--border-medium)', borderRadius: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Share2 size={16} /> Share Link
                            </button>
                            {selectedResource.link && (
                                <a href={selectedResource.link} target="_blank" rel="noopener noreferrer" style={{ padding: '0.6rem 1.2rem', background: 'var(--color-primary)', borderRadius: '0.75rem', color: 'white', fontSize: '0.88rem', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(30, 42, 68, 0.2)' }}>
                                    Open Resource <ExternalLink size={16} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 900px) {
                    .resources-layout { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 600px) {
                    .resources-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
