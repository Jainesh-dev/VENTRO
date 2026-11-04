import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, UserProfile } from "@/services/authcontext";
import { OnboardingStepper } from "@/components/OnboardingStepper";
import { InterestChip } from "@/components/InterestChip";
import { SkillChip } from "@/components/SkillChip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
const PREDEFINED_INTERESTS = [
  "Software Engineering", "AI/ML", "Data Science", "Electronics",
  "Embedded Systems", "Cybersecurity", "Cloud Computing",
  "Product Management", "UI/UX", "Finance", "Marketing"
];
const PREDEFINED_SKILLS = [
  "Python", "Java", "C++", "JavaScript", "React", "NodeJS",
  "SQL", "Machine Learning", "Arduino", "Verilog"
];
export const Onboarding: React.FC = () => {
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    firstName: "", lastName: "", dob: "",
    collegeName: "", degree: "", branch: "", gradYear: "", cgpa: "",
    interests: [], skills: [], internshipType: "Remote", locations: [], weeklyGoal: 5
  });
  const [customSkill, setCustomSkill] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const updateField = (key: keyof UserProfile, value: any) => setFormData(prev => ({ ...prev, [key]: value }));
  const handleToggleInterest = (interest: string) => {
    const current = formData.interests || [];
    updateField("interests", current.includes(interest) ? current.filter(i => i !== interest) : [...current, interest]);
  };
  const handleToggleSkill = (skill: string) => {
    const current = formData.skills || [];
    updateField("skills", current.includes(skill) ? current.filter(s => s !== skill) : [...current, skill]);
  };
  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const skill = customSkill.trim();
    if (skill) {
      const current = formData.skills || [];
      if (!current.includes(skill)) updateField("skills", [...current, skill]);
      setCustomSkill("");
    }
  };
  const handleAddLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && locationInput.trim()) {
      e.preventDefault();
      const location = locationInput.trim();
      const current = formData.locations || [];
      if (!current.includes(location)) updateField("locations", [...current, location]);
      setLocationInput("");
    }
  };
  const handleRemoveLocation = (loc: string) => updateField("locations", (formData.locations || []).filter(l => l !== loc));
  const handleNext = async () => {
    if (step === 1 && (!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.dob)) {
      alert("Please fill all personal details.");
      return;
    }
    if (step === 2 && (!formData.collegeName?.trim() || !formData.degree?.trim() || !formData.branch?.trim() || !formData.gradYear?.trim() || !formData.cgpa?.trim())) {
      alert("Please complete your academic details.");
      return;
    }
    if (step === 3 && (formData.interests?.length ?? 0) === 0) {
      alert("Please select at least one interest.");
      return;
    }
    if (step === 4 && (formData.skills?.length ?? 0) === 0) {
      alert("Please add at least one skill.");
      return;
    }
    if (step === 5) {
      if ((formData.locations?.length ?? 0) === 0) {
        alert("Please add at least one preferred location.");
        return;
      }
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      try {
        const payload = {
          user_id: user.id,
          college: formData.collegeName,
          branch: formData.branch,
          degree: formData.degree,
          graduation_year: Number(formData.gradYear),
          skills: formData.skills,
          interests: formData.interests,
          preferred_locations: formData.locations,
        };
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:5001/onboarding/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: JSON.parse(localStorage.getItem("user") || "{}").id,
            college: formData.collegeName,
            branch: formData.branch,
            degree: formData.degree,
            graduation_year: formData.gradYear,
            skills: formData.skills,
            interests: formData.interests,
            preferred_locations: formData.preferredLocations,
          }),
        });
        const result = await response.json();
        if (!response.ok || result.success === false) {
          alert(result.message || "We couldn't save your onboarding details. Please try again.");
          return;
        }
      } catch (err) {
        console.error("Onboarding request failed:", err);
        alert("Unable to save your details. Check your connection and try again.");
        return;
      }
      completeOnboarding(formData as UserProfile);
      navigate("/recommendations");
      return;
    }
    setStep(current => current + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(current => current - 1);
  };
  const fieldClass = "mt-1.5 h-11 rounded-xl border-neutral-200/90 bg-white/65 text-neutral-900 placeholder:text-neutral-400 shadow-inner backdrop-blur-xl transition-all dark:border-white/10 dark:bg-white/[0.045] dark:text-white dark:placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-400/40 dark:focus-visible:ring-white/20 focus-visible:border-neutral-400 dark:focus-visible:border-white/30";
  const labelClass = "text-sm font-medium text-neutral-700 dark:text-neutral-300";
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-5">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">01 / Personal profile</p>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white font-['Sora']">Tell us about yourself</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Let's start with a few details about you.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><Label className={labelClass}>First Name</Label><Input value={formData.firstName || ""} onChange={e => updateField("firstName", e.target.value)} className={fieldClass} placeholder="John" /></div>
              <div><Label className={labelClass}>Last Name</Label><Input value={formData.lastName || ""} onChange={e => updateField("lastName", e.target.value)} className={fieldClass} placeholder="Doe" /></div>
            </div>
            <div><Label className={labelClass}>Date of Birth</Label><Input type="date" value={formData.dob || ""} onChange={e => updateField("dob", e.target.value)} className={`${fieldClass} dark:[color-scheme:dark]`} /></div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-5">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">02 / Education</p>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white font-['Sora']">Your academic background</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Help us understand where you are in your studies.</p>
            </div>
            <div><Label className={labelClass}>College Name</Label><Input value={formData.collegeName || ""} onChange={e => updateField("collegeName", e.target.value)} className={fieldClass} placeholder="University of Technology" /></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><Label className={labelClass}>Degree</Label><Input value={formData.degree || ""} onChange={e => updateField("degree", e.target.value)} className={fieldClass} placeholder="B.Tech" /></div>
              <div><Label className={labelClass}>Branch</Label><Input value={formData.branch || ""} onChange={e => updateField("branch", e.target.value)} className={fieldClass} placeholder="Computer Science" /></div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><Label className={labelClass}>Graduation Year</Label><Input type="number" value={formData.gradYear || ""} onChange={e => updateField("gradYear", e.target.value)} className={fieldClass} placeholder="2027" /></div>
              <div><Label className={labelClass}>CGPA / GPA</Label><Input value={formData.cgpa || ""} onChange={e => updateField("cgpa", e.target.value)} className={fieldClass} placeholder="9.2 / 10" /></div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-5">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">03 / Career direction</p>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white font-['Sora']">What are you interested in?</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Choose the fields you'd like to explore. Select as many as you like.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_INTERESTS.map(interest => <InterestChip key={interest} label={interest} selected={(formData.interests || []).includes(interest)} onToggle={() => handleToggleInterest(interest)} />)}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div key="step4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-5">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">04 / Your toolkit</p>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white font-['Sora']">Map your skill set</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Select your current skills or add your own.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_SKILLS.map(skill => <SkillChip key={skill} label={skill} selected={(formData.skills || []).includes(skill)} onToggle={() => handleToggleSkill(skill)} />)}
              {formData.skills?.filter(skill => !PREDEFINED_SKILLS.includes(skill)).map(skill => <SkillChip key={skill} label={skill} custom onRemove={() => handleToggleSkill(skill)} />)}
            </div>
            <form onSubmit={handleAddCustomSkill} className="flex gap-2">
              <Input value={customSkill} onChange={e => setCustomSkill(e.target.value)} className={fieldClass} placeholder="Add a skill (e.g. Rust)" />
              <Button type="submit" aria-label="Add custom skill" className="h-11 w-11 shrink-0 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"><Plus className="h-4 w-4" /></Button>
            </form>
          </motion.div>
        );
      case 5:
        return (
          <motion.div key="step5" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">05 / Preferences</p>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white font-['Sora']">Shape your opportunities</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Tell us what kind of internship works best for you.</p>
            </div>
            <div>
              <Label className={labelClass}>Preferred Internship Type</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {["Remote", "Hybrid", "Onsite"].map(type => (
                  <button key={type} type="button" onClick={() => updateField("internshipType", type)} className={`rounded-xl border px-3 py-3 text-sm font-medium transition-all duration-200 ${formData.internshipType === type ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950" : "border-neutral-200 bg-white/60 text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:bg-white/[0.08]"}`}>{type}</button>
                ))}
              </div>
            </div>
            <div>
              <Label className={labelClass}>Preferred Locations</Label>
              <Input value={locationInput} onChange={e => setLocationInput(e.target.value)} onKeyDown={handleAddLocation} className={fieldClass} placeholder="Type a location and press Enter" />
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.locations?.map(loc => <span key={loc} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-neutral-300">{loc}<button type="button" onClick={() => handleRemoveLocation(loc)} aria-label={`Remove ${loc}`} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white">×</button></span>)}
              </div>
            </div>
            <div>
              <Label className={labelClass}>Weekly Application Goal</Label>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Apply to</span>
                <Input type="number" min="1" max="50" value={formData.weeklyGoal || 5} onChange={e => updateField("weeklyGoal", parseInt(e.target.value, 10) || 5)} className={`${fieldClass} w-20 text-center`} />
                <span className="text-sm text-neutral-500 dark:text-neutral-400">internships per week</span>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground transition-colors duration-500 sm:px-6">
      {/* SUBTLE MONOCHROME AMBIENT LIGHT */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[12%] -top-[20%] h-[55vw] w-[55vw] rounded-full bg-neutral-300/35 blur-[150px] dark:bg-white/[0.035]" />
        <div className="absolute -bottom-[22%] -right-[10%] h-[50vw] w-[50vw] rounded-full bg-neutral-300/30 blur-[160px] dark:bg-white/[0.035]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-neutral-200/25 dark:from-white/[0.02] dark:to-black/30" />
      </div>
      <div className="relative z-10 w-full max-w-2xl rounded-[30px] border border-white/80 bg-white/75 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-[40px] dark:border-white/10 dark:bg-neutral-950/70 dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-9">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400 dark:text-neutral-500">VENTRO / GETTING STARTED</p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-neutral-950 dark:text-white font-['Sora']">Build your career profile</h1>
          </div>
          <span className="rounded-full border border-neutral-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-neutral-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-neutral-300">Step {step} of 5</span>
        </div>
        <div className="mb-8">
          <OnboardingStepper currentStep={step} totalSteps={5} />
        </div>
        <div className="flex min-h-[340px] flex-col justify-between">
          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
          <div className="mt-9 flex items-center justify-between border-t border-neutral-200/80 pt-6 dark:border-white/10">
            <Button type="button" variant="ghost" disabled={step === 1} onClick={handleBack} className="rounded-xl px-5 text-neutral-600 hover:bg-neutral-900/[0.05] hover:text-neutral-950 disabled:opacity-30 dark:text-neutral-300 dark:hover:bg-white/[0.06] dark:hover:text-white">Back</Button>
            <Button type="button" onClick={handleNext} className="h-11 rounded-xl bg-neutral-950 px-6 font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition-all hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200">{step === 5 ? "Complete Setup" : "Continue"}</Button>
          </div>
        </div>
      </div>
      <p className="relative z-10 mt-5 text-center text-[11px] text-neutral-400 dark:text-neutral-600">Your next opportunity starts with a strong profile.</p>
    </div>
  );
};
export default Onboarding;
