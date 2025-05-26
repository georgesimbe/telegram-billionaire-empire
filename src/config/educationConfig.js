// Education System Configuration - Complete Career Development
// Implements the education and career progression described in the wiki

export const EDUCATION_LEVELS = {
  high_school: {
    id: 'high_school',
    name: 'High School Diploma',
    description: 'Basic secondary education completion',
    icon: '🎓',
    cost: 0,
    duration: 180, // days
    unlockLevel: 1,
    requirements: {
      age: 14,
      previousEducation: null
    },
    benefits: {
      jobMultiplier: 1.0,
      skillPoints: 5,
      socialStatus: 10,
      unlocks: ['basic_jobs', 'community_college']
    },
    subjects: ['mathematics', 'english', 'science', 'history', 'physical_education'],
    completionRewards: {
      experience: 100,
      cash: 500,
      achievement: 'high_school_graduate'
    }
  },

  community_college: {
    id: 'community_college',
    name: 'Community College Certificate',
    description: 'Two-year associate degree or professional certificate',
    icon: '📜',
    cost: 15000,
    duration: 730, // 2 years
    unlockLevel: 5,
    requirements: {
      age: 18,
      previousEducation: 'high_school'
    },
    benefits: {
      jobMultiplier: 1.2,
      skillPoints: 10,
      socialStatus: 20,
      unlocks: ['technical_jobs', 'trade_jobs', 'university']
    },
    subjects: ['business_basics', 'computer_literacy', 'communication', 'specialized_training'],
    completionRewards: {
      experience: 250,
      cash: 1000,
      achievement: 'college_graduate'
    }
  },

  university: {
    id: 'university',
    name: 'Bachelor\'s Degree',
    description: 'Four-year university degree in chosen field',
    icon: '🎓',
    cost: 50000,
    duration: 1460, // 4 years
    unlockLevel: 10,
    requirements: {
      age: 18,
      previousEducation: 'high_school',
      creditScore: 600
    },
    benefits: {
      jobMultiplier: 1.5,
      skillPoints: 20,
      socialStatus: 40,
      unlocks: ['professional_jobs', 'management_roles', 'graduate_school']
    },
    majors: [
      'business_administration',
      'computer_science',
      'engineering',
      'economics',
      'marketing',
      'finance',
      'psychology',
      'communications'
    ],
    completionRewards: {
      experience: 500,
      cash: 2500,
      achievement: 'university_graduate'
    }
  },

  masters: {
    id: 'masters',
    name: 'Master\'s Degree',
    description: 'Advanced graduate degree with specialization',
    icon: '🎖️',
    cost: 75000,
    duration: 730, // 2 years
    unlockLevel: 20,
    requirements: {
      age: 22,
      previousEducation: 'university',
      creditScore: 650
    },
    benefits: {
      jobMultiplier: 2.0,
      skillPoints: 30,
      socialStatus: 60,
      unlocks: ['executive_roles', 'specialized_positions', 'phd_programs']
    },
    specializations: [
      'mba',
      'computer_science',
      'engineering',
      'finance',
      'data_science',
      'project_management'
    ],
    completionRewards: {
      experience: 1000,
      cash: 5000,
      achievement: 'masters_graduate'
    }
  },

  phd: {
    id: 'phd',
    name: 'Doctorate (PhD)',
    description: 'Highest academic degree with research focus',
    icon: '👨‍🎓',
    cost: 100000,
    duration: 1825, // 5 years
    unlockLevel: 30,
    requirements: {
      age: 24,
      previousEducation: 'masters',
      creditScore: 700
    },
    benefits: {
      jobMultiplier: 2.5,
      skillPoints: 50,
      socialStatus: 80,
      unlocks: ['research_positions', 'university_roles', 'consulting']
    },
    specializations: [
      'business_administration',
      'computer_science',
      'economics',
      'engineering',
      'data_science'
    ],
    completionRewards: {
      experience: 2000,
      cash: 10000,
      achievement: 'phd_graduate'
    }
  }
};

// Professional certifications and skills
export const CERTIFICATIONS = {
  project_management: {
    id: 'project_management',
    name: 'Project Management Professional (PMP)',
    description: 'Industry-standard project management certification',
    icon: '📋',
    cost: 5000,
    duration: 90,
    unlockLevel: 15,
    requirements: {
      previousEducation: 'university',
      workExperience: 365 // 1 year
    },
    benefits: {
      jobMultiplier: 1.3,
      skillPoints: 15,
      unlocks: ['senior_management']
    }
  },

  data_science: {
    id: 'data_science',
    name: 'Data Science Certification',
    description: 'Advanced analytics and machine learning skills',
    icon: '📊',
    cost: 8000,
    duration: 120,
    unlockLevel: 20,
    requirements: {
      previousEducation: 'university',
      major: 'computer_science'
    },
    benefits: {
      jobMultiplier: 1.4,
      skillPoints: 20,
      unlocks: ['ai_researcher', 'data_scientist']
    }
  },

  financial_analyst: {
    id: 'financial_analyst',
    name: 'Chartered Financial Analyst (CFA)',
    description: 'Premier investment management credential',
    icon: '💹',
    cost: 10000,
    duration: 365,
    unlockLevel: 25,
    requirements: {
      previousEducation: 'university',
      major: 'finance'
    },
    benefits: {
      jobMultiplier: 1.5,
      skillPoints: 25,
      unlocks: ['investment_banker', 'portfolio_manager']
    }
  },

  cybersecurity: {
    id: 'cybersecurity',
    name: 'Cybersecurity Professional',
    description: 'Information security and risk management',
    icon: '🔒',
    cost: 7000,
    duration: 180,
    unlockLevel: 18,
    requirements: {
      previousEducation: 'university',
      major: 'computer_science'
    },
    benefits: {
      jobMultiplier: 1.4,
      skillPoints: 18,
      unlocks: ['security_analyst', 'ciso']
    }
  }
};

// Job categories and requirements
export const JOB_CATEGORIES = {
  basic_jobs: {
    name: 'Basic Jobs',
    description: 'Entry-level positions requiring minimal education',
    unlockEducation: 'high_school',
    jobs: [
      {
        id: 'retail_worker',
        name: 'Retail Worker',
        salary: 2000,
        requirements: { education: 'high_school' },
        skills: ['customer_service', 'communication']
      },
      {
        id: 'food_service',
        name: 'Food Service Worker',
        salary: 1800,
        requirements: { education: 'high_school' },
        skills: ['customer_service', 'teamwork']
      },
      {
        id: 'delivery_driver',
        name: 'Delivery Driver',
        salary: 2200,
        requirements: { education: 'high_school', license: true },
        skills: ['time_management', 'navigation']
      }
    ]
  },

  technical_jobs: {
    name: 'Technical Jobs',
    description: 'Skilled positions requiring specialized training',
    unlockEducation: 'community_college',
    jobs: [
      {
        id: 'computer_technician',
        name: 'Computer Technician',
        salary: 3500,
        requirements: { education: 'community_college' },
        skills: ['technical_skills', 'problem_solving']
      },
      {
        id: 'medical_assistant',
        name: 'Medical Assistant',
        salary: 3200,
        requirements: { education: 'community_college' },
        skills: ['healthcare', 'attention_to_detail']
      },
      {
        id: 'automotive_technician',
        name: 'Automotive Technician',
        salary: 4000,
        requirements: { education: 'community_college' },
        skills: ['mechanical_skills', 'diagnostic_thinking']
      }
    ]
  },

  professional_jobs: {
    name: 'Professional Jobs',
    description: 'Career positions requiring university education',
    unlockEducation: 'university',
    jobs: [
      {
        id: 'software_developer',
        name: 'Software Developer',
        salary: 7500,
        requirements: { education: 'university', major: 'computer_science' },
        skills: ['programming', 'logical_thinking', 'creativity']
      },
      {
        id: 'marketing_specialist',
        name: 'Marketing Specialist',
        salary: 6000,
        requirements: { education: 'university', major: 'marketing' },
        skills: ['creativity', 'communication', 'analytics']
      },
      {
        id: 'financial_analyst',
        name: 'Financial Analyst',
        salary: 6500,
        requirements: { education: 'university', major: 'finance' },
        skills: ['analytical_thinking', 'mathematics', 'attention_to_detail']
      },
      {
        id: 'project_manager',
        name: 'Project Manager',
        salary: 8000,
        requirements: { education: 'university', certification: 'project_management' },
        skills: ['leadership', 'organization', 'communication']
      }
    ]
  },

  executive_roles: {
    name: 'Executive Roles',
    description: 'Leadership positions requiring advanced education',
    unlockEducation: 'masters',
    jobs: [
      {
        id: 'senior_manager',
        name: 'Senior Manager',
        salary: 12000,
        requirements: { education: 'masters', experience: 1095 }, // 3 years
        skills: ['leadership', 'strategic_thinking', 'decision_making']
      },
      {
        id: 'director',
        name: 'Director',
        salary: 15000,
        requirements: { education: 'masters', experience: 1825 }, // 5 years
        skills: ['vision', 'team_building', 'business_strategy']
      },
      {
        id: 'vice_president',
        name: 'Vice President',
        salary: 20000,
        requirements: { education: 'masters', experience: 2555 }, // 7 years
        skills: ['executive_presence', 'negotiation', 'industry_expertise']
      }
    ]
  },

  research_positions: {
    name: 'Research Positions',
    description: 'Academic and research roles requiring PhD',
    unlockEducation: 'phd',
    jobs: [
      {
        id: 'research_scientist',
        name: 'Research Scientist',
        salary: 9000,
        requirements: { education: 'phd' },
        skills: ['research_methodology', 'critical_thinking', 'writing']
      },
      {
        id: 'university_professor',
        name: 'University Professor',
        salary: 10000,
        requirements: { education: 'phd', experience: 730 }, // 2 years
        skills: ['teaching', 'research', 'public_speaking']
      },
      {
        id: 'chief_scientist',
        name: 'Chief Scientist',
        salary: 18000,
        requirements: { education: 'phd', experience: 1825 }, // 5 years
        skills: ['innovation', 'leadership', 'strategic_research']
      }
    ]
  }
};

// Skills system
export const SKILLS = {
  // Soft Skills
  communication: { name: 'Communication', category: 'soft', maxLevel: 100 },
  leadership: { name: 'Leadership', category: 'soft', maxLevel: 100 },
  teamwork: { name: 'Teamwork', category: 'soft', maxLevel: 100 },
  problem_solving: { name: 'Problem Solving', category: 'soft', maxLevel: 100 },
  time_management: { name: 'Time Management', category: 'soft', maxLevel: 100 },
  creativity: { name: 'Creativity', category: 'soft', maxLevel: 100 },
  critical_thinking: { name: 'Critical Thinking', category: 'soft', maxLevel: 100 },

  // Technical Skills
  programming: { name: 'Programming', category: 'technical', maxLevel: 100 },
  data_analysis: { name: 'Data Analysis', category: 'technical', maxLevel: 100 },
  financial_modeling: { name: 'Financial Modeling', category: 'technical', maxLevel: 100 },
  project_management: { name: 'Project Management', category: 'technical', maxLevel: 100 },
  digital_marketing: { name: 'Digital Marketing', category: 'technical', maxLevel: 100 },

  // Industry Skills
  healthcare: { name: 'Healthcare Knowledge', category: 'industry', maxLevel: 100 },
  finance: { name: 'Finance Expertise', category: 'industry', maxLevel: 100 },
  technology: { name: 'Technology Expertise', category: 'industry', maxLevel: 100 },
  manufacturing: { name: 'Manufacturing Knowledge', category: 'industry', maxLevel: 100 }
};

// Helper functions
export const getAvailableEducation = (playerLevel, currentEducation, creditScore) => {
  return Object.values(EDUCATION_LEVELS).filter(education => {
    if (education.unlockLevel > playerLevel) return false;
    if (education.requirements.previousEducation && education.requirements.previousEducation !== currentEducation) return false;
    if (education.requirements.creditScore && education.requirements.creditScore > creditScore) return false;
    return true;
  });
};

export const getAvailableJobs = (education, certifications = [], experience = 0) => {
  const availableCategories = Object.values(JOB_CATEGORIES).filter(category => {
    const educationOrder = ['high_school', 'community_college', 'university', 'masters', 'phd'];
    const playerEducationLevel = educationOrder.indexOf(education);
    const requiredEducationLevel = educationOrder.indexOf(category.unlockEducation);
    return playerEducationLevel >= requiredEducationLevel;
  });

  const allJobs = [];
  availableCategories.forEach(category => {
    const categoryJobs = category.jobs.filter(job => {
      // Check education requirement
      const educationOrder = ['high_school', 'community_college', 'university', 'masters', 'phd'];
      const playerEducationLevel = educationOrder.indexOf(education);
      const requiredEducationLevel = educationOrder.indexOf(job.requirements.education);
      if (playerEducationLevel < requiredEducationLevel) return false;

      // Check certification requirement
      if (job.requirements.certification && !certifications.includes(job.requirements.certification)) return false;

      // Check experience requirement
      if (job.requirements.experience && experience < job.requirements.experience) return false;

      return true;
    });
    allJobs.push(...categoryJobs);
  });

  return allJobs;
};

export const calculateEducationCost = (educationType, scholarships = []) => {
  const education = EDUCATION_LEVELS[educationType];
  if (!education) return 0;

  let cost = education.cost;

  // Apply scholarships
  scholarships.forEach(scholarship => {
    cost *= (1 - scholarship.discountPercent);
  });

  return Math.max(0, cost);
};

export const calculateJobSalary = (baseJob, education, certifications = [], skills = {}, experience = 0) => {
  let salary = baseJob.salary;

  // Education multiplier
  const educationMultiplier = EDUCATION_LEVELS[education]?.benefits.jobMultiplier || 1.0;
  salary *= educationMultiplier;

  // Certification bonuses
  certifications.forEach(certId => {
    const cert = CERTIFICATIONS[certId];
    if (cert) {
      salary *= cert.benefits.jobMultiplier;
    }
  });

  // Experience bonus (1% per month of experience, capped at 50%)
  const experienceBonus = Math.min(0.5, experience / 30 * 0.01);
  salary *= (1 + experienceBonus);

  // Skills bonus
  if (baseJob.skills) {
    const skillBonus = baseJob.skills.reduce((bonus, skillName) => {
      const skillLevel = skills[skillName] || 0;
      return bonus + (skillLevel / 100 * 0.2); // Max 20% bonus per skill
    }, 0);
    salary *= (1 + Math.min(skillBonus, 1.0)); // Cap total skill bonus at 100%
  }

  return Math.round(salary);
};

export const getEducationProgress = (startDate, duration) => {
  const now = new Date();
  const start = new Date(startDate);
  const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const progress = Math.min(100, (daysPassed / duration) * 100);
  const isComplete = daysPassed >= duration;

  return { progress, isComplete, daysPassed, daysRemaining: Math.max(0, duration - daysPassed) };
};

export const getCareerAdvancement = (currentJob, education, experience, skills) => {
  const allJobs = getAvailableJobs(education, [], experience);
  const currentSalary = currentJob ? currentJob.salary : 0;

  const betterJobs = allJobs.filter(job => job.salary > currentSalary);
  const nextJob = betterJobs.sort((a, b) => a.salary - b.salary)[0];

  return {
    nextJob,
    salaryIncrease: nextJob ? nextJob.salary - currentSalary : 0,
    recommendedSkills: nextJob ? nextJob.skills : []
  };
};

export const calculateSkillGain = (activity, duration, currentLevel) => {
  // Diminishing returns - harder to gain skills at higher levels
  const difficultyMultiplier = 1 - (currentLevel / 100) * 0.5;
  const baseGain = duration * 0.1; // Base skill gain per day
  return Math.round(baseGain * difficultyMultiplier);
};

export default EDUCATION_LEVELS; 