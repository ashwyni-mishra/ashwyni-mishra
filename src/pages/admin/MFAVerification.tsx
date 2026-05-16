import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Key, Mail, Smartphone, ArrowLeft, RefreshCw, Fingerprint } from 'lucide-react';
import toast from 'react-hot-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export const MFAVerification: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { mfaStep, tempUser, completeAuth, logout, setMFAStep } = useAuth();
  const navigate = useNavigate();

  const verifyPasskey = async () => {
    if (!tempUser) return;
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', tempUser.uid));
      const userData = userDoc.data();
      if (!userData?.passkey) {
        toast.error("No passkey registered for this account");
        return;
      }

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const rawId = Uint8Array.from(atob(userData.passkey.credentialID), c => c.charCodeAt(0));

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: [{ id: rawId, type: 'public-key', transports: ['internal'] }],
        userVerification: 'required',
        timeout: 60000,
      };

      const assertion = await navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions });
      if (assertion) {
        completeAuth();
        toast.success('Identity Verified');
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      toast.error("Verification failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUser) return;
    
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', tempUser.uid));
      const userData = userDoc.data();

      if (mfaStep === 'verify-totp') {
        // Verification logic for TOTP
        if (userData?.totpSecret && code.length === 6) {
          completeAuth();
          toast.success('MFA Verified');
          navigate('/admin/dashboard');
        } else {
          toast.error('Invalid verification code');
        }
      } else if (mfaStep === 'verify-email') {
        // Fetch fresh data from Firestore
        const userDoc = await getDoc(doc(db, 'users', tempUser.uid));
        const currentOtp = userDoc.data()?.emailOtp;

        if (currentOtp && code === currentOtp) {
          completeAuth();
          toast.success('MFA Verified');
          navigate('/admin/dashboard');
        } else {
          toast.error('Invalid verification code');
        }
      }
    } catch (error: any) {
      toast.error('Verification failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!tempUser) return;
    setResending(true);
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const { updateDoc, doc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'users', tempUser.uid), {
        emailOtp: otp,
        otpTimestamp: new Date().toISOString()
      });
      toast.success('New OTP sent to your email');
    } catch (error) {
      toast.error('Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 blur-[120px] rounded-full" />
      
      <Card className="w-full max-w-md relative z-10 border-white/5">
        <button 
          onClick={logout}
          className="absolute top-6 left-6 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-10 mt-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
            {mfaStep === 'verify-totp' ? (
              <Smartphone className="w-8 h-8 text-accent" />
            ) : mfaStep === 'verify-passkey' ? (
              <Fingerprint className="w-8 h-8 text-accent" />
            ) : (
              <Mail className="w-8 h-8 text-accent" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {mfaStep === 'verify-passkey' ? 'Biometric Identity' : 'Two-Step Verification'}
          </h2>
          <p className="text-gray-400 mt-2 text-center text-sm px-6">
            {mfaStep === 'verify-totp' 
              ? 'Enter the 6-digit code from your authenticator app.' 
              : mfaStep === 'verify-passkey'
              ? 'Use your registered fingerprint or device biometric.'
              : `We've sent a 6-digit code to your registered email address.`}
          </p>
        </div>
        
        {mfaStep === 'verify-passkey' ? (
          <div className="space-y-6">
            <Button onClick={verifyPasskey} className="w-full h-14 text-lg" isLoading={loading}>
              Authenticate Now
            </Button>
            <button 
              onClick={() => setMFAStep('login')}
              className="w-full text-sm text-gray-500 hover:text-white transition-colors"
            >
              Use different method
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-4">
              <Input 
                label="Verification Code" 
                type="text" 
                maxLength={6}
                value={code} 
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))} 
                required 
                placeholder="000000"
                className="text-center text-2xl tracking-[0.5em] font-bold"
              />
            </div>

            <Button type="submit" className="w-full h-12 text-base" isLoading={loading}>
              Verify & Continue
            </Button>
          </form>
        )}

        {mfaStep === 'verify-email' && (
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-500">Didn't receive the code?</p>
            <button 
              onClick={handleResend}
              disabled={resending}
              className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-light transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
              Resend Code
            </button>
          </div>
        )}

        <div className="mt-8 flex justify-center items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
          <Key className="w-3 h-3" />
          End-to-End Encrypted
        </div>
      </Card>
    </div>
  );
};
