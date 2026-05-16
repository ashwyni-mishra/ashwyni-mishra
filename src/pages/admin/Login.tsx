import { useState, type FC, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { Shield, Mail, Smartphone, Key } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { MFAVerification } from './MFAVerification';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { mfaStep, setMFAStep, setTempUser, currentUser } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  if (currentUser) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check MFA status in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (userData?.mfaEnabled) {
        setTempUser(user);
        const nextStep = userData.mfaType === 'passkey' ? 'verify-passkey' : (userData.mfaType === 'totp' ? 'verify-totp' : 'verify-email');
        
        if (nextStep === 'verify-email') {
          // Generate and save real OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const { setDoc, doc } = await import('firebase/firestore');
          await setDoc(doc(db, 'users', user.uid), {
            emailOtp: otp,
            otpTimestamp: new Date().toISOString()
          }, { merge: true });
          
          toast.success('A verification code has been generated');
        }
        
        setMFAStep(nextStep);
      } else {
        toast.success('Access Granted');
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  if (mfaStep !== 'login' && mfaStep !== 'complete') {
    return <MFAVerification />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 blur-[120px] rounded-full" />
      
      <Card className="w-full max-w-md relative z-10 border-white/5">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h2>
          <p className="text-gray-400 mt-2">Secure access for authorized administrators</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            placeholder="admin@portfolio.com"
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full h-12 text-base shadow-accent/20" isLoading={loading}>
            Sign In Securely
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 flex justify-center gap-6 grayscale opacity-50">
          <Mail className="w-5 h-5 text-gray-400" />
          <Smartphone className="w-5 h-5 text-gray-400" />
          <Key className="w-5 h-5 text-gray-400" />
        </div>
      </Card>
    </div>
  );
};
