import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserProfile } from '@/services/authcontext';
import {OnboardingStepper}  from '@/components/OnboardingStepper';
import {InterestChip}  from '@/components/InterestChip';
import { SkillChip } from '@/components/SkillChip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

const PREDEFINED_INTERESTS = [
  'Software Engineering', 'AI/ML', 'Data Science', 'Electronics',
  'Embedded Systems', 'Cybersecurity', 'Cloud Computing',
  'Product Management', 'UI/UX', 'Finance', 'Marketing'
];

const PREDEFINED_SKILLS = [
  'Python', 'Java', 'C++', 'JavaScript', 'React', 'NodeJS',
  'SQL', 'Machine Learning', 'Arduino', 'Verilog'
];

export const Onboarding: React.FC = () => {
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form states
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    firstName: '', lastName: '', dob: '',
    collegeName: '', degree: '', branch: '', gradYear: '', cgpa: '',
    interests: [], skills: [],
    internshipType: 'Remote', locations: [], weeklyGoal: 5
  });

  const [customSkill, setCustomSkill] = useState('');
  const [locationInput, setLocationInput] = useState('');

  const updateField = (key: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleInterest = (interest: string) => {
    const current = formData.interests || [];
    if (current.includes(interest)) {
      updateField('interests', current.filter(i => i !== interest));
    } else {
      updateField('interests', [...current, interest]);
    }
  };

  const handleToggleSkill = (skill: string) => {
    const current = formData.skills || [];
    if (current.includes(skill)) {
      updateField('skills', current.filter(s => s !== skill));
    } else {
      updateField('skills', [...current, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim()) {
      const current = formData.skills || [];
      if (!current.includes(customSkill.trim())) {
        updateField('skills', [...current, customSkill.trim()]);
      }
      setCustomSkill('');
    }
  };

  const handleAddLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && locationInput.trim()) {
      e.preventDefault();
      const current = formData.locations || [];
      if (!current.includes(locationInput.trim())) {
        updateField('locations', [...current, locationInput.trim()]);
      }
      setLocationInput('');
    }
  };

  const handleRemoveLocation = (loc: string) => {
    updateField('locations', (formData.locations || []).filter(l => l !== loc));
  };

      const handleNext = async () => {  
  // Step 1 Validation
  if (step === 1) {
    if (
      !formData.firstName?.trim() ||
      !formData.lastName?.trim() ||
      !formData.dob
    ) {
      alert("Please fill all personal details.");
      return;
    }
  }

  // Step 2 Validation
  if (step === 2) {
    if (
      !formData.collegeName?.trim() ||
      !formData.degree?.trim() ||
      !formData.branch?.trim() ||
      !formData.gradYear?.trim() ||
      !formData.cgpa?.trim()
    ) {
      alert("Please complete your academic details.");
      return;
    }
  }

  // Step 3 Validation
  if (step === 3) {
    if ((formData.interests?.length ?? 0) === 0) {
      alert("Please select at least one interest.");
      return;
    }
  }

  // Step 4 Validation
  if (step === 4) {
    if ((formData.skills?.length ?? 0) === 0) {
      alert("Please add at least one skill.");
      return;
    }
  }

  // Step 5 Validation
  if (step === 5) {
  if ((formData.locations?.length ?? 0) === 0) {
    alert("Please add at least one preferred location.");
    return;
  }

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );
  console.log(user);
  console.log("User from localStorage:", user);

 try {
  console.log("🚀 About to call onboarding API");

  const response = await fetch(
    "http://127.0.0.1:5001/onboarding/complete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        college: formData.collegeName,
        branch: formData.branch,
        degree: formData.degree,
        graduation_year: Number(formData.gradYear),
        skills: formData.skills,
        interests: formData.interests,
        preferred_locations: formData.locations,
      }),
    }
  );

  console.log("Sending:", {
  user_id: user.id,
  college: formData.collegeName,
  branch: formData.branch,
  degree: formData.degree,
  graduation_year: Number(formData.gradYear),
  skills: formData.skills,
  interests: formData.interests,
  preferred_locations: formData.locations,
  });

  console.log("Status:", response.status);

  const result = await response.json();

  console.log("Response:", result);

} catch (err) {
  console.error("Fetch failed:", err);
}

  completeOnboarding(
    formData as UserProfile
  );

  navigate("/recommendations");
  return;
}

  setStep(step + 1);
};

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Content render helpers
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white">Tell us about yourself</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">First Name</Label>
                <Input value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} className="bg-white/5 border-white/10 mt-1" placeholder="John" />
              </div>
              <div>
                <Label className="text-gray-300">Last Name</Label>
                <Input value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} className="bg-white/5 border-white/10 mt-1" placeholder="Doe" />
              </div>
            </div>
            <div>
              <Label className="text-gray-300">Date of Birth</Label>
              <Input type="date" value={formData.dob} onChange={e => updateField('dob', e.target.value)} className="bg-white/5 border-white/10 mt-1 dark:[color-scheme:dark]" />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-white">Academic Metrics</h3>
            <div>
              <Label className="text-gray-300">College Name</Label>
              <Input value={formData.collegeName} onChange={e => updateField('collegeName', e.target.value)} className="bg-white/5 border-white/10 mt-1" placeholder="University of Technology" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Degree</Label>
                <Input value={formData.degree} onChange={e => updateField('degree', e.target.value)} className="bg-white/5 border-white/10 mt-1" placeholder="B.S. / B.Tech" />
              </div>
              <div>
                <Label className="text-gray-300">Branch</Label>
                <Input value={formData.branch} onChange={e => updateField('branch', e.target.value)} className="bg-white/5 border-white/10 mt-1" placeholder="Computer Science" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Graduation Year</Label>
                <Input value={formData.gradYear} onChange={e => updateField('gradYear', e.target.value)} className="bg-white/5 border-white/10 mt-1" placeholder="2027" />
              </div>
              <div>
                <Label className="text-gray-300">CGPA / GPA</Label>
                <Input value={formData.cgpa} onChange={e => updateField('cgpa', e.target.value)} className="bg-white/5 border-white/10 mt-1" placeholder="3.8 / 9.2" />
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            <h3 className="text-xl font-bold text-white">Select Career Interests</h3>
            <p className="text-xs text-gray-400 mb-4">This optimizes the suggestion matrices on your dispatch pipeline.</p>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_INTERESTS.map(interest => (
                <InterestChip
                  key={interest}
                  label={interest}
                  selected={(formData.interests || []).includes(interest)}
                  onToggle={() => handleToggleInterest(interest)}
                />
              ))}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div key="step4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            <h3 className="text-xl font-bold text-white">Map Your Skill Stack</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {PREDEFINED_SKILLS.map(skill => (
                <SkillChip
                  key={skill}
                  label={skill}
                  selected={(formData.skills || []).includes(skill)}
                  onToggle={() => handleToggleSkill(skill)}
                />
              ))}
              {formData.skills?.filter(s => !PREDEFINED_SKILLS.includes(s)).map(skill => (
                <SkillChip key={skill} label={skill} custom onRemove={() => handleToggleSkill(skill)} />
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                value={customSkill} 
                onChange={e => setCustomSkill(e.target.value)} 
                className="bg-white/5 border-white/10" 
                placeholder="Add Custom Skill (e.g. Rust)" 
              />
              <Button type="button" onClick={handleAddCustomSkill} className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div key="step5" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
            <h3 className="text-xl font-bold text-white">Work Environment Preferences</h3>
            <div>
              <Label className="text-gray-300">Preferred Internship Type</Label>
              <div className="grid grid-cols-3 gap-3 mt-1.5">
                {['Remote', 'Hybrid', 'Onsite'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField('internshipType', type)}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      formData.internshipType === type
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Preferred Locations</Label>
              <Input
                value={locationInput}
                onChange={e => setLocationInput(e.target.value)}
                onKeyDown={handleAddLocation}
                className="bg-white/5 border-white/10 mt-1.5"
                placeholder="Type location and press Enter"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.locations?.map(loc => (
                  <span key={loc} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border bg-white/5 border-white/10 text-gray-300">
                    {loc}
                    <button type="button" onClick={() => handleRemoveLocation(loc)} className="text-gray-500 hover:text-white">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Weekly Application Goal</Label>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-gray-400 text-sm">Apply to</span>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.weeklyGoal}
                  onChange={e => updateField('weeklyGoal', parseInt(e.target.value) || 5)}
                  className="bg-white/5 border-white/10 w-20 text-center text-white"
                />
                <span className="text-gray-400 text-sm">internships per week</span>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-purple-600/5 rounded-full blur-[160px] pointer-events-none" />
      
      <div className="w-full max-w-2xl bg-black/40 border border-white/10 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl z-10">
        <OnboardingStepper currentStep={step} totalSteps={5} />
        
        <div className="min-h-[300px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-8">
            <Button
              type="button"
              variant="ghost"
              disabled={step === 1}
              onClick={handleBack}
              className="text-gray-400 hover:text-white disabled:opacity-30"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl px-6 font-medium shadow-lg shadow-purple-900/20"
            >
              {step === 5 ? 'Complete Engine Config' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};