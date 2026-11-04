
import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  firstName: string;
  lastName: string;
  dob: string;
  collegeName: string;
  degree: string;
  branch: string;
  gradYear: string;
  cgpa: string;
  interests: string[];
  skills: string[];
  internshipType: 'Remote' | 'Hybrid' | 'Onsite';
  locations: string[];
  preferredLocations?: string[];
  weeklyGoal: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  User: UserProfile | null;
  onboardingCompleted: boolean;
  login: () => void;
  signup: () => void;
  completeOnboarding: (profile: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('token');
    return !!token && token !== 'temp';
  });

  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem('it_onboarding_complete') === 'true';
  });

  const [User, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('it_user_profile');

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = () => {
    const token = localStorage.getItem('token');

    if (!token || token === 'temp') {
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);

    const savedUser = localStorage.getItem('it_user_profile');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }

    setOnboardingCompleted(
      localStorage.getItem('it_onboarding_complete') === 'true'
    );
  };

  // Registration does not authenticate the user.
  // A real JWT is stored only after successful login.
  const signup = () => {
    setIsAuthenticated(false);
  };

  const completeOnboarding = (profile: UserProfile) => {
    setUser(profile);
    setOnboardingCompleted(true);

    localStorage.setItem('it_user_profile', JSON.stringify(profile));
    localStorage.setItem('it_onboarding_complete', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setOnboardingCompleted(false);

    localStorage.removeItem('token');
    localStorage.removeItem('User');
    localStorage.removeItem('user');
    localStorage.removeItem('it_user_profile');
    localStorage.removeItem('it_onboarding_complete');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        User,
        onboardingCompleted,
        login,
        signup,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
