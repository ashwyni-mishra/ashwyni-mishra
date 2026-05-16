import { useEffect, useState, type FC } from 'react';
import { 
  Save, FolderKanban, Briefcase, FileText, 
  Settings, Trash2, Plus, ExternalLink, 
  Loader2, Lock, Layout, Cpu, Globe, Mail, Users, CheckCircle,
  Smartphone, Fingerprint
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, collection, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';
import { defaultData } from '../../lib/db';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'config' | 'general' | 'skills' | 'projects' | 'experience' | 'blog' | 'messages' | 'subscribers' | 'resources' | 'pages' | 'mfa';

export const Dashboard: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('config');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'messages') fetchMessages();
    if (activeTab === 'subscribers') fetchSubscribers();
  }, [activeTab]);

  const fetchData = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'portfolio', 'data');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fetchedData = docSnap.data();
        if (!fetchedData.config) {
          fetchedData.config = defaultData.config;
        }
        setData(fetchedData);
      } else {
        setData(defaultData);
        toast('Initializing with default profile content', { icon: '🚀' });
      }
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!db) return;
    try {
      const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      toast.error('Failed to fetch messages');
    }
  };

  const fetchSubscribers = async () => {
    if (!db) return;
    try {
      const q = query(collection(db, 'subscribers'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      setSubscribers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      toast.error('Failed to fetch subscribers');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!db || !window.confirm('Delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages(messages.filter(m => m.id !== id));
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!db || !window.confirm('Remove this subscriber?')) return;
    try {
      await deleteDoc(doc(db, 'subscribers', id));
      setSubscribers(subscribers.filter(s => s.id !== id));
      toast.success('Subscriber removed');
    } catch (err) {
      toast.error('Removal failed');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all fields to default?')) {
      setData(defaultData);
      toast.success('Fields reset to defaults');
    }
  };

  const registerPasskey = async () => {
    if (!window.PublicKeyCredential) {
      toast.error("Biometrics not supported in this browser");
      return;
    }

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const userID = Uint8Array.from(currentUser?.uid || 'user', c => c.charCodeAt(0));

      const options: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: { name: "Ashwani Portfolio", id: window.location.hostname },
        user: { 
          id: userID, 
          name: currentUser?.email || "admin", 
          displayName: currentUser?.email || "Admin" 
        }, 
        pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
        timeout: 60000,
      };

      const credential = await navigator.credentials.create({ publicKey: options }) as any;
      if (credential) {
        const credentialID = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
        setData((prev: any) => ({
          ...prev,
          passkey: { credentialID, registeredAt: new Date().toISOString() },
          mfaType: 'passkey',
          mfaEnabled: true
        }));
        toast.success("Biometrics linked! Click 'Save All' to synchronize.");
      }
    } catch (err: any) {
      toast.error("Registration failed: " + err.message);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData = { ...data };
      await updateDoc(doc(db, 'portfolio', 'data'), updatedData);
      
      if (currentUser) {
        const { setDoc, doc: fDoc } = await import('firebase/firestore');
        await setDoc(fDoc(db, 'users', currentUser.uid), {
          mfaEnabled: updatedData.mfaEnabled || false,
          mfaType: updatedData.mfaType || 'email',
          totpSecret: updatedData.totpSecret || 'JBSWY3DPEHPK3PXP',
          passkey: updatedData.passkey || null,
          email: currentUser.email,
          lastSync: new Date().toISOString()
        }, { merge: true });
      }
      toast.success('Security parameters synchronized');
    } catch (err) {
      console.error(err);
      toast.error('Sync failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse">Synchronizing parameters...</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'config', label: 'Site Config', icon: Globe },
    { id: 'general', label: 'Profile', icon: Settings },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'subscribers', label: 'Subscribers', icon: Users },
    { id: 'resources', label: 'Resources', icon: ExternalLink },
    { id: 'pages', label: 'Pages', icon: Layout },
    { id: 'mfa', label: 'Security', icon: Lock },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:w-64 space-y-2">
          <div className="mb-8 px-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your identity</p>
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
          
          <div className="pt-8 px-2 space-y-4">
            <Button onClick={handleSave} isLoading={saving} className="w-full">
              <Save className="w-4 h-4" /> Save All
            </Button>
            <Button onClick={handleReset} variant="secondary" className="w-full bg-white/5 border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20">
              <Trash2 className="w-4 h-4" /> Reset Fields
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="min-h-[600px] border-white/5 bg-surface-dark/40 backdrop-blur-xl p-8">
                
                {activeTab === 'config' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-6">Site Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                          label="Site Name / Logo Text" 
                          value={data?.config?.siteName || ''} 
                          onChange={e => setData({...data, config: {...data.config, siteName: e.target.value}})}
                        />
                        <Input 
                          label="Contact Email" 
                          value={data?.config?.email || ''} 
                          onChange={e => setData({...data, config: {...data.config, email: e.target.value}})}
                        />
                        <Input 
                          label="GitHub Profile URL" 
                          value={data?.config?.githubUrl || ''} 
                          onChange={e => setData({...data, config: {...data.config, githubUrl: e.target.value}})}
                        />
                        <Input 
                          label="Footer Tagline" 
                          value={data?.config?.footerText || ''} 
                          onChange={e => setData({...data, config: {...data.config, footerText: e.target.value}})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'general' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-6">General Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                          label="Full Name" 
                          value={data?.profile?.name || ''} 
                          onChange={e => setData({...data, profile: {...data.profile, name: e.target.value}})}
                        />
                        <Input 
                          label="Headline" 
                          value={data?.profile?.headline || ''} 
                          onChange={e => setData({...data, profile: {...data.profile, headline: e.target.value}})}
                        />
                      </div>
                    </div>
                    <Input 
                      label="Bio" 
                      textarea 
                      value={data?.profile?.bio || ''} 
                      onChange={e => setData({...data, profile: {...data.profile, bio: e.target.value}})}
                    />
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Skills Matrix</h3>
                      <Button variant="outline" size="sm" onClick={() => {
                        const categoryName = prompt('Category Name?');
                        if (categoryName) {
                          setData({...data, skills: {...(data.skills || {}), [categoryName]: []}});
                        }
                      }}>
                        <Plus className="w-4 h-4" /> Add Category
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                      {data?.skills && Object.entries(data.skills).map(([category, items]: [string, any], idx) => (
                        <div key={idx} className="p-6 rounded-xl border border-white/5 bg-white/5 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-accent font-bold tracking-widest uppercase text-xs">{category}</h4>
                            <button 
                              onClick={() => {
                                const newSkills = {...data.skills};
                                delete newSkills[category];
                                setData({...data, skills: newSkills});
                              }}
                              className="p-2 text-gray-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <Input 
                            label="Items (comma-separated)" 
                            value={items.join(', ')} 
                            onChange={e => {
                              const newItems = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                              setData({...data, skills: {...data.skills, [category]: newItems}});
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Project Inventory</h3>
                      <Button variant="outline" size="sm" onClick={() => {
                        const newProject = { id: Date.now(), title: 'New Project', description: '', technologies: [], github: '' };
                        setData({...data, projects: [...(data.projects || []), newProject]});
                      }}>
                        <Plus className="w-4 h-4" /> Add Project
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {data?.projects?.map((proj: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input 
                                label="Project Title"
                                value={proj.title}
                                onChange={e => {
                                  const newProj = [...data.projects];
                                  newProj[idx].title = e.target.value;
                                  setData({...data, projects: newProj});
                                }}
                              />
                              <Input 
                                label="GitHub URL"
                                value={proj.github}
                                onChange={e => {
                                  const newProj = [...data.projects];
                                  newProj[idx].github = e.target.value;
                                  setData({...data, projects: newProj});
                                }}
                              />
                            </div>
                            <button 
                              onClick={() => setData({...data, projects: data.projects.filter((_: any, i: number) => i !== idx)})}
                              className="p-2 text-gray-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <Input 
                            label="Technologies (comma-separated)"
                            value={proj.technologies?.join(', ') || ''}
                            onChange={e => {
                              const newProj = [...data.projects];
                              newProj[idx].technologies = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                              setData({...data, projects: newProj});
                            }}
                          />
                          <Input 
                            label="Description"
                            textarea 
                            value={proj.description}
                            onChange={e => {
                              const newProj = [...data.projects];
                              newProj[idx].description = e.target.value;
                              setData({...data, projects: newProj});
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Work Experience</h3>
                        <Button variant="outline" size="sm" onClick={() => {
                          const newExp = { id: Date.now(), role: '', company: '', period: '', description: '', highlights: [] };
                          setData({...data, experience: [...(data.experience || []), newExp]});
                        }}>
                          <Plus className="w-4 h-4" /> Add Experience
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {data?.experience?.map((exp: any, idx: number) => (
                          <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Input label="Role" value={exp.role} onChange={e => {
                                const newData = [...data.experience];
                                newData[idx].role = e.target.value;
                                setData({...data, experience: newData});
                              }} />
                              <Input label="Company" value={exp.company} onChange={e => {
                                const newData = [...data.experience];
                                newData[idx].company = e.target.value;
                                setData({...data, experience: newData});
                              }} />
                              <Input label="Period" value={exp.period} onChange={e => {
                                const newData = [...data.experience];
                                newData[idx].period = e.target.value;
                                setData({...data, experience: newData});
                              }} />
                            </div>
                            <Input label="Highlights (comma-separated)" value={exp.highlights?.join(', ') || ''} onChange={e => {
                                const newData = [...data.experience];
                                newData[idx].highlights = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                                setData({...data, experience: newData});
                              }} />
                            <Input label="Description" textarea value={exp.description} onChange={e => {
                                const newData = [...data.experience];
                                newData[idx].description = e.target.value;
                                setData({...data, experience: newData});
                              }} />
                            <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300" onClick={() => {
                              setData({...data, experience: data.experience.filter((_: any, i: number) => i !== idx)});
                            }}>Delete</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'blog' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-white">Blog Posts</h3>
                      <Button variant="outline" size="sm" onClick={() => {
                        const newPost = { id: Date.now(), title: '', slug: '', excerpt: '', content: '', date: new Date().toLocaleDateString(), readTime: '', category: '' };
                        setData({...data, posts: [...(data.posts || []), newPost]});
                      }}>
                        <Plus className="w-4 h-4" /> Add Post
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {data?.posts?.map((post: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Title" value={post.title} onChange={e => {
                              const newData = [...data.posts];
                              newData[idx].title = e.target.value;
                              if(!newData[idx].slug) {
                                newData[idx].slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                              }
                              setData({...data, posts: newData});
                            }} />
                            <Input label="Slug" value={post.slug} onChange={e => {
                              const newData = [...data.posts];
                              newData[idx].slug = e.target.value;
                              setData({...data, posts: newData});
                            }} />
                          </div>
                          <Input label="Content" textarea value={post.content} onChange={e => {
                              const newData = [...data.posts];
                              newData[idx].content = e.target.value;
                              setData({...data, posts: newData});
                            }} />
                          <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300" onClick={() => {
                            setData({...data, posts: data.posts.filter((_: any, i: number) => i !== idx)});
                          }}>Delete</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'messages' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Contact Messages</h3>
                      <Button variant="outline" size="sm" onClick={fetchMessages}><CheckCircle className="w-4 h-4" /> Refresh</Button>
                    </div>
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div key={msg.id} className="p-6 rounded-xl border border-white/5 bg-white/5">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-white font-bold">{msg.subject}</h4>
                              <p className="text-accent text-sm">{msg.name} ({msg.email})</p>
                            </div>
                            <button onClick={() => deleteMessage(msg.id)} className="text-gray-500 hover:text-red-400">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'subscribers' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white mb-6">Newsletter Subscribers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subscribers.map((sub) => (
                        <div key={sub.id} className="p-4 rounded-xl border border-white/5 bg-white/5 flex justify-between items-center">
                          <span className="text-white text-sm">{sub.email}</span>
                          <button onClick={() => deleteSubscriber(sub.id)} className="text-gray-500 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Resource Links</h3>
                      <Button variant="outline" size="sm" onClick={() => {
                        const newResource = { id: Date.now(), title: 'New Resource', url: '', category: 'Tools' };
                        setData({...data, resources: [...(data.resources || []), newResource]});
                      }}>
                        <Plus className="w-4 h-4" /> Add Link
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {data?.resources?.map((res: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col md:flex-row gap-4 items-end md:items-center">
                          <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <Input
                              label="Title"
                              value={res.title}
                              onChange={e => {
                                const newRes = [...data.resources];
                                newRes[idx].title = e.target.value;
                                setData({...data, resources: newRes});
                              }}
                            />
                            <Input
                              label="URL"
                              value={res.url}
                              onChange={e => {
                                const newRes = [...data.resources];
                                newRes[idx].url = e.target.value;
                                setData({...data, resources: newRes});
                              }}
                            />
                            <Input
                              label="Category"
                              value={res.category}
                              onChange={e => {
                                const newRes = [...data.resources];
                                newRes[idx].category = e.target.value;
                                setData({...data, resources: newRes});
                              }}
                            />
                          </div>
                          <button
                            onClick={() => setData({...data, resources: data.resources.filter((_: any, i: number) => i !== idx)})}
                            className="p-3 text-gray-500 hover:text-red-400 bg-white/5 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'pages' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Dynamic Pages</h3>
                      <Button variant="outline" size="sm" onClick={() => {
                        const newPage = { id: Date.now(), title: 'New Page', slug: 'new-page', content: 'Page content goes here...' };
                        setData({...data, pages: [...(data.pages || []), newPage]});
                      }}>
                        <Plus className="w-4 h-4" /> Add Page
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {data?.pages?.map((page: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                label="Page Title"
                                value={page.title}
                                onChange={e => {
                                  const newPages = [...data.pages];
                                  newPages[idx].title = e.target.value;
                                  setData({...data, pages: newPages});
                                }}
                              />
                              <Input
                                label="URL Slug (e.g., my-page)"
                                value={page.slug}
                                onChange={e => {
                                  const newPages = [...data.pages];
                                  newPages[idx].slug = e.target.value.toLowerCase().replace(/\s+/g, '-');
                                  setData({...data, pages: newPages});
                                }}
                              />
                            </div>
                            <button
                              onClick={() => setData({...data, pages: data.pages.filter((_: any, i: number) => i !== idx)})}
                              className="p-2 text-gray-500 hover:text-red-400 ml-4"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <Input
                            label="Content (Markdown/HTML supported)"
                            textarea
                            value={page.content}
                            onChange={e => {
                              const newPages = [...data.pages];
                              newPages[idx].content = e.target.value;
                              setData({...data, pages: newPages});
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'mfa' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-8 p-6 rounded-2xl bg-accent/5 border border-accent/10">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Security & Multi-Factor Auth</h3>
                        <p className="text-sm text-gray-400">Add biometric or code-based security to your account.</p>
                      </div>
                    </div>

                    <div className="space-y-6 max-w-2xl">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                        <div>
                          <p className="font-bold text-white">Enable MFA</p>
                          <p className="text-xs text-gray-500">Require an extra step to log in.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={data?.mfaEnabled || false}
                            onChange={(e) => setData({...data, mfaEnabled: e.target.checked})}
                          />
                          <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                        </label>
                      </div>

                      {data?.mfaEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <button
                            onClick={() => setData({...data, mfaType: 'email'})}
                            className={`p-6 rounded-2xl border transition-all text-left ${data?.mfaType === 'email' ? 'bg-accent/10 border-accent' : 'bg-white/5 border-white/5'}`}
                          >
                            <Mail className={`w-8 h-8 mb-4 ${data?.mfaType === 'email' ? 'text-accent' : 'text-gray-500'}`} />
                            <h4 className="font-bold text-white mb-1">Email</h4>
                            <p className="text-xs text-gray-500">OTP to your email.</p>
                          </button>

                          <button
                            onClick={() => setData({...data, mfaType: 'totp'})}
                            className={`p-6 rounded-2xl border transition-all text-left ${data?.mfaType === 'totp' ? 'bg-accent/10 border-accent' : 'bg-white/5 border-white/5'}`}
                          >
                            <Smartphone className={`w-8 h-8 mb-4 ${data?.mfaType === 'totp' ? 'text-accent' : 'text-gray-500'}`} />
                            <h4 className="font-bold text-white mb-1">App</h4>
                            <p className="text-xs text-gray-500">Google Auth / Authy.</p>
                          </button>

                          <button
                            onClick={() => setData({...data, mfaType: 'passkey'})}
                            className={`p-6 rounded-2xl border transition-all text-left ${data?.mfaType === 'passkey' ? 'bg-accent/10 border-accent' : 'bg-white/5 border-white/5'}`}
                          >
                            <Fingerprint className={`w-8 h-8 mb-4 ${data?.mfaType === 'passkey' ? 'text-accent' : 'text-gray-500'}`} />
                            <h4 className="font-bold text-white mb-1">Passkey</h4>
                            <p className="text-xs text-gray-500">TouchID / Windows Hello.</p>
                          </button>
                        </div>
                      )}

                      {data?.mfaEnabled && data?.mfaType === 'passkey' && (
                        <div className="p-6 rounded-2xl border border-accent/20 bg-accent/5 mt-8 space-y-6">
                          <div className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-widest">
                            <Fingerprint className="w-4 h-4" /> Device Registration
                          </div>
                          {data?.passkey ? (
                            <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                              <span className="text-green-400 text-sm font-medium">Device Linked: {new Date(data.passkey.registeredAt).toLocaleDateString()}</span>
                              <Button size="sm" variant="outline" onClick={registerPasskey}>Update</Button>
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <Button onClick={registerPasskey}>Register This Device</Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
