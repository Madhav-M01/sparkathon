import React, { useState, useEffect } from 'react';
import { 
  User, Phone, Mail, Edit, Camera, Star, Gift, 
  Trophy, Target, ShoppingBag, Heart, MessageCircle,
  Calendar, MapPin, CreditCard, Settings, LogOut,
  Coins, Award, TrendingUp, Zap, Crown, Leaf
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Move LoginModal and SignupModal outside ProfilePage
function LoginModal({ email, setEmail, password, setPassword, authError, handleLogin, setShowLogin, setAuthError }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Nextgen!</h2>
          <p className="text-gray-600">Login to your account</p>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input 
              type="email" 
              placeholder="Email address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {authError && <div className="text-red-500 text-sm">{authError}</div>}
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">Don't have an account? 
            <button className="text-purple-500 font-semibold ml-1" onClick={() => { setShowLogin(false); setAuthError(''); }}>Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function SignupModal({ name, setName, email, setEmail, password, setPassword, authError, handleSignup, setShowLogin, setAuthError }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Create your account</h2>
          <p className="text-gray-600">Sign up to get started</p>
        </div>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <input 
              type="text" 
              placeholder="Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div>
            <input 
              type="email" 
              placeholder="Email address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {authError && <div className="text-red-500 text-sm">{authError}</div>}
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">Already have an account? 
            <button className="text-green-500 font-semibold ml-1" onClick={() => { setShowLogin(true); setAuthError(''); }}>Login</button>
          </p>
        </div>
      </div>
    </div>
  );
}

const ProfilePage = () => {
  const navigate =useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(true); // true = login, false = signup
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [currentStep, setCurrentStep] = useState('login'); // login, phone, complete
  const [userScore, setUserScore] = useState(1250);
  const [ecoScore, setEcoScore] = useState(750); // Environmental score
  const [showEcoInfo, setShowEcoInfo] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  const [openSetting, setOpenSetting] = useState(null); // 'personal', 'contact', 'address', 'payment'

  // Environmental score functions
  const getEcoLevel = (score) => {
    if (score >= 5000) return { level: 'Eco Champion', icon: '🏆', color: 'text-purple-600' };
    if (score >= 3000) return { level: 'Tree Guardian', icon: '🌳', color: 'text-green-600' };
    if (score >= 1500) return { level: 'Sapling Supporter', icon: '🌱', color: 'text-lime-600' };
    return { level: 'Eco Beginner', icon: '🌿', color: 'text-green-500' };
  };

  const getDiscountFromEcoScore = (score) => {
    if (score >= 5000) return 25;
    if (score >= 3000) return 20;
    if (score >= 1500) return 15;
    if (score >= 500) return 10;
    return 5;
  };

  const getEcoScoreFromDonation = (amount) => {
    return Math.floor(amount / 10); // 10 points per ₹10 donated
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('https://sparkathon-gfwo.onrender.com/users/me', {
            headers: { Authorization: token }
          });
          setUser(res.data);
        } catch (err) {
          setUser(null);
        }
      }
    };
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await axios.post('https://sparkathon-gfwo.onrender.com/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
    } catch (err) {
      setAuthError(err.response?.data?.msg || 'Login failed');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await axios.post('https://sparkathon-gfwo.onrender.com/auth/register', {
        name,
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
    } catch (err) {
      setAuthError(err.response?.data?.msg || 'Signup failed');
    }
  };

  const handlePhoneVerification = (phoneData) => {
    // Simulate phone verification
    setShowPhoneModal(false);
    setCurrentStep('complete');
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('https://sparkathon-gfwo.onrender.com/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token,
        },
      });
      setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
    } catch (err) {
      alert('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleSettingSave = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('https://sparkathon-gfwo.onrender.com/users/me', data, {
        headers: { Authorization: token }
      });
      setUser(res.data);
      setOpenSetting(null);
    } catch (err) {
      alert('Failed to update info');
    }
  };



  const currentEcoLevel = getEcoLevel(ecoScore);

  // Modal Wrapper
  function Modal({ title, children, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 min-w-[300px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-500">&times;</button>
          </div>
          {children}
        </div>
      </div>
    );
  }
  // Personal Info Modal
  function PersonalInfoModal({ user, onClose, onSave }) {
    const [name, setName] = useState(user?.name || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const handleSave = () => {
      if (!name.trim()) {
        setError('Name cannot be empty');
        setSuccess(false);
        return;
      }
      setError('');
      onSave({ name });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    };
    return (
      <Modal title="Edit Personal Information" onClose={onClose}>
        <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" /> Name
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className={`input w-full border p-2 rounded mb-2 focus:ring-2 focus:ring-blue-400 ${error ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="Enter your name"
          autoFocus
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-2">Saved!</div>}
        <button onClick={handleSave} className="btn bg-blue-500 text-white px-4 py-2 rounded w-full mt-2">Save</button>
      </Modal>
    );
  }
  // Contact Modal
  function ContactModal({ user, onClose, onSave }) {
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const validateEmail = (email) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email);
    const validatePhone = (phone) => /^\d{10}$/.test(phone);
    const handleSave = () => {
      if (!validateEmail(email)) {
        setError('Invalid email address');
        setSuccess(false);
        return;
      }
      if (phone && !validatePhone(phone)) {
        setError('Phone must be 10 digits');
        setSuccess(false);
        return;
      }
      setError('');
      onSave({ email, phone });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    };
    return (
      <Modal title="Edit Contact Information" onClose={onClose}>
        <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" /> Email
        </label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={`input w-full border p-2 rounded mb-2 focus:ring-2 focus:ring-blue-400 ${error && error.includes('email') ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="Enter your email"
          type="email"
        />
        <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500" /> Phone
        </label>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
          className={`input w-full border p-2 rounded mb-2 focus:ring-2 focus:ring-blue-400 ${error && error.includes('Phone') ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="Enter your phone (10 digits)"
          maxLength={10}
          type="tel"
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-2">Saved!</div>}
        <button onClick={handleSave} className="btn bg-blue-500 text-white px-4 py-2 rounded w-full mt-2">Save</button>
      </Modal>
    );
  }
  // Address Modal
  function AddressModal({ user, onClose, onSave }) {
    const [address, setAddress] = useState(user?.address || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const handleSave = () => {
      if (!address.trim()) {
        setError('Address cannot be empty');
        setSuccess(false);
        return;
      }
      setError('');
      onSave({ address });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    };
    return (
      <Modal title="Edit Address" onClose={onClose}>
        <label className="block mb-2 font-medium text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" /> Address
        </label>
        <textarea
          value={address}
          onChange={e => setAddress(e.target.value)}
          className={`input w-full border p-2 rounded mb-2 focus:ring-2 focus:ring-blue-400 ${error ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="Enter your address"
          rows={3}
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-2">Saved!</div>}
        <button onClick={handleSave} className="btn bg-blue-500 text-white px-4 py-2 rounded w-full mt-2">Save</button>
      </Modal>
    );
  }
  // Payment Modal
  function PaymentModal({ user, onClose, onSave }) {
    const [cardName, setCardName] = useState(user?.cardName || '');
    const [cardNumber, setCardNumber] = useState(user?.cardNumber || '');
    const [expiry, setExpiry] = useState(user?.expiry || '');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validateCard = () => /^\d{16}$/.test(cardNumber.replace(/\s/g, ''));
    const validateExpiry = () => /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
    const validateCvv = () => /^\d{3,4}$/.test(cvv);

    const handleSave = () => {
      if (!cardName.trim()) return setError('Cardholder name required');
      if (!validateCard()) return setError('Card number must be 16 digits');
      if (!validateExpiry()) return setError('Expiry must be MM/YY');
      if (!validateCvv()) return setError('CVV must be 3 or 4 digits');
      setError('');
      onSave({
        cardName,
        cardNumber: '**** **** **** ' + cardNumber.slice(-4),
        expiry
      }); // Mask card number
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    };

    return (
      <Modal title="Edit Payment Method" onClose={onClose}>
        <label className="block mb-2 font-medium text-gray-700">Cardholder Name</label>
        <input value={cardName} onChange={e => setCardName(e.target.value)} className="input w-full border p-2 rounded mb-2" placeholder="Name on card" />
        <label className="block mb-2 font-medium text-gray-700">Card Number</label>
        <input value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/[^0-9]/g, '').slice(0,16))} className="input w-full border p-2 rounded mb-2" placeholder="1234 5678 9012 3456" maxLength={16} />
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-700">Expiry (MM/YY)</label>
            <input value={expiry} onChange={e => setExpiry(e.target.value)} className="input w-full border p-2 rounded mb-2" placeholder="MM/YY" maxLength={5} />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-700">CVV</label>
            <input value={cvv} onChange={e => setCvv(e.target.value.replace(/[^0-9]/g, '').slice(0,4))} className="input w-full border p-2 rounded mb-2" placeholder="CVV" maxLength={4} type="password" />
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-2">Saved!</div>}
        <button onClick={handleSave} className="btn bg-blue-500 text-white px-4 py-2 rounded w-full mt-2">Save</button>
      </Modal>
    );
  }

  // Preferences Modal
  function PreferencesModal({ user, onClose, onSave }) {
    const [darkMode, setDarkMode] = useState(user?.preferences?.darkMode || false);
    const [emailNotif, setEmailNotif] = useState(user?.preferences?.emailNotif ?? true);
    const [language, setLanguage] = useState(user?.preferences?.language || 'en');
    const [newsletter, setNewsletter] = useState(user?.preferences?.newsletter ?? true);
    const [success, setSuccess] = useState(false);

    const handleSave = () => {
      onSave({
        preferences: {
          darkMode,
          emailNotif,
          language,
          newsletter
        }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    };

    return (
      <Modal title="Preferences" onClose={onClose}>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
            Dark Mode
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)} />
            Email Notifications
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)} className="input w-full border p-2 rounded">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} />
            Subscribe to Newsletter
          </label>
        </div>
        {success && <div className="text-green-500 text-sm mb-2">Saved!</div>}
        <button onClick={handleSave} className="btn bg-blue-500 text-white px-4 py-2 rounded w-full mt-2">Save</button>
      </Modal>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modals */}
      {!isAuthenticated && (showLogin ?
        <LoginModal
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          authError={authError}
          handleLogin={handleLogin}
          setShowLogin={setShowLogin}
          setAuthError={setAuthError}
        /> :
        <SignupModal
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          authError={authError}
          handleSignup={handleSignup}
          setShowLogin={setShowLogin}
          setAuthError={setAuthError}
        />
      )}
      {isAuthenticated && (
        <>
          {showPhoneModal && <PhoneModal />}
          <div className="max-w-8xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={user?.avatar || '/api/placeholder/100/100'} 
                      alt="Profile" 
                      className="w-20 h-20 border rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      className="absolute bottom-0 right-0 bg-white border rounded-full p-1 shadow hover:bg-gray-100"
                      style={{ display: uploading ? 'none' : 'block' }}
                      title="Change profile picture"
                    >
                      <Camera className="w-5 h-5 text-gray-700" />
                    </button>
                    {uploading && (
                      <div className="absolute bottom-0 right-0 bg-white border rounded-full p-1 shadow">
                        <span className="text-xs text-gray-500">Uploading...</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSignOut}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Environmental Score Header */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Environmental Impact</h3>
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <span className="font-medium">
                          {currentEcoLevel.icon} {currentEcoLevel.level}
                        </span>
                        <span>• {ecoScore} Eco Points</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{getDiscountFromEcoScore(ecoScore)}%</div>
                    <div className="text-sm opacity-90">Eco Discount</div>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Your Environmental Contribution</span>
                    <span>{Math.floor(ecoScore / 50)} trees planted</span>
                  </div>
                  <div className="text-xs opacity-90">
                    CO₂ absorbed: ~{(ecoScore / 50 * 22).toFixed(0)}kg annually • Equivalent to {(ecoScore / 50 * 95).toFixed(0)}km less driving
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center"
                 onClick={()=>{ navigate("/123456");}}
                 >
                    <ShoppingBag className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-blue-800">Order History</span>
                  </button>
                  
                  <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-center"
                  onClick={()=>{ navigate("/123456");}}
                  >
                    <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-red-800">Wishlist</span>
                  </button>
                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center">
                    <MessageCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-purple-800">Support</span>
                </button>
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center">
                    <Gift className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-green-800">Refer Friends</span>
                  </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Environmental Impact Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-green-800">Environmental Impact Dashboard</h3>
                  <button
                    onClick={() => setShowEcoInfo(!showEcoInfo)}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    How it works?
                  </button>
                </div>

                {/* Eco Info */}
                {showEcoInfo && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                      🌍 Environmental Impact & CO₂ Absorption
                    </h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-medium">🌱</span>
                        <div>
                          <strong>Sapling (₹50):</strong> Absorbs 22kg CO₂/year when mature. 
                          Equivalent to driving 95km less in a car!
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-medium">🌳</span>
                        <div>
                          <strong>Small Tree (₹150):</strong> Mature trees absorb 48kg CO₂/year. 
                          Equal to powering your home for 2 days with clean energy!
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-medium">🏞️</span>
                        <div>
                          <strong>Forest Patch (₹500):</strong> 10+ trees absorbing 220kg+ CO₂/year. 
                          Removes equivalent emissions from 950km of car travel!
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Impact Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{Math.floor(ecoScore / 50)}</div>
                    <div className="text-sm text-gray-600">Trees Planted</div>
                    <div className="text-xs text-green-600">🌱 Your Forest</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{(ecoScore / 50 * 22).toFixed(0)}kg</div>
                    <div className="text-sm text-gray-600">CO₂ Absorbed</div>
                    <div className="text-xs text-blue-600">💨 Annually</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{(ecoScore / 50 * 95).toFixed(0)}km</div>
                    <div className="text-sm text-gray-600">Car Travel Offset</div>
                    <div className="text-xs text-purple-600">🚗 Equivalent</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{getDiscountFromEcoScore(ecoScore)}%</div>
                    <div className="text-sm text-gray-600">Eco Discount</div>
                    <div className="text-xs text-orange-600">🎉 Active</div>
                  </div>
                </div>

                {/* Progress to Next Level */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Next Level Progress</span>
                    <span className="text-xs text-green-600">
                      {ecoScore >= 5000 ? 'Max Level!' : 
                       ecoScore >= 3000 ? `${5000 - ecoScore} points to Eco Champion` :
                       ecoScore >= 1500 ? `${3000 - ecoScore} points to Tree Guardian` :
                       `${1500 - ecoScore} points to Sapling Supporter`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${ecoScore >= 5000 ? 100 : 
                                ecoScore >= 3000 ? ((ecoScore - 3000) / 2000) * 100 :
                                ecoScore >= 1500 ? ((ecoScore - 1500) / 1500) * 100 :
                                (ecoScore / 1500) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>🌿 Beginner</span>
                    <span>🌱 Supporter</span>
                    <span>🌳 Guardian</span>
                    <span>🏆 Champion</span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-green-700">
                    Join 12,847 eco-warriors who've planted <span className="font-semibold">25,692 trees</span> this month!
                  </p>
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Account Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => setOpenSetting('personal')}>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-600" />
                      <span>Personal Information</span>
                      <span className="text-gray-400 ml-2">{user?.name || 'Not set'}</span>
                    </div>
                    <Edit className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => setOpenSetting('contact')}>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <span>Phone & Email</span>
                      <span className="text-gray-400 ml-2">{user?.phone || 'No phone'}, {user?.email || 'No email'}</span>
                    </div>
                    <Edit className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => setOpenSetting('address')}>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <span>Addresses</span>
                      <span className="text-gray-400 ml-2">{user?.address || 'No address'}</span>
                    </div>
                    <Edit className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => setOpenSetting('payment')}>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span>Payment Methods</span>
                      <span className="text-gray-400 ml-2">{user?.paymentMethod || 'No payment method'}</span>
                    </div>
                    <Edit className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => setOpenSetting('preferences')}>
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-gray-600" />
                      <span>Preferences</span>
                      <span className="text-gray-400 ml-2">{user?.preferences?.language ? user.preferences.language : 'Default'}</span>
                    </div>
                    <Edit className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </>
      )}
      {openSetting === 'personal' && (
        <PersonalInfoModal user={user} onClose={() => setOpenSetting(null)} onSave={handleSettingSave} />
      )}
      {openSetting === 'contact' && (
        <ContactModal user={user} onClose={() => setOpenSetting(null)} onSave={handleSettingSave} />
      )}
      {openSetting === 'address' && (
        <AddressModal user={user} onClose={() => setOpenSetting(null)} onSave={handleSettingSave} />
      )}
      {openSetting === 'payment' && (
        <PaymentModal user={user} onClose={() => setOpenSetting(null)} onSave={handleSettingSave} />
      )}
      {openSetting === 'preferences' && (
        <PreferencesModal user={user} onClose={() => setOpenSetting(null)} onSave={handleSettingSave} />
      )}
    </div>
  );
};

export default ProfilePage;
