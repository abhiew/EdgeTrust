import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  login: (email: string) => boolean;
  logout: () => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  completeOnboardingStep: (stepIndex: number) => void;
  onboardingChecklist: { id: number; title: string; completed: boolean }[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('edgetrust_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return mockUsers[6]; // Default Admin user
  });

  const [activeRole, setActiveRoleState] = useState<Role>(() => {
    return user?.role || 'Admin';
  });

  const [onboardingChecklist, setOnboardingChecklist] = useState([
    { id: 1, title: 'Workspace created', completed: true },
    { id: 2, title: 'Collections agent connected', completed: true },
    { id: 3, title: 'Policies configured', completed: true },
    { id: 4, title: 'Evaluation suite ready', completed: true },
    { id: 5, title: 'First report generated', completed: false },
  ]);

  const [onboardingStep, setOnboardingStep] = useState(4);

  const setActiveRole = (role: Role) => {
    setActiveRoleState(role);
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('edgetrust_user', JSON.stringify(updatedUser));
    }
  };

  const login = (email: string) => {
    const found = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || mockUsers[6];
    setUser(found);
    setActiveRoleState(found.role);
    localStorage.setItem('edgetrust_user', JSON.stringify(found));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edgetrust_user');
  };

  const completeOnboardingStep = (stepIndex: number) => {
    setOnboardingChecklist((prev) =>
      prev.map((item, idx) => (idx === stepIndex ? { ...item, completed: true } : item))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        setActiveRole,
        login,
        logout,
        onboardingStep,
        setOnboardingStep,
        completeOnboardingStep,
        onboardingChecklist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
