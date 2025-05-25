export const JOB_CATEGORIES = {
  ENTRY_LEVEL: {
    id: 'entry_level',
    name: 'Entry Level Jobs',
    icon: '👷',
    description: 'Starting positions to build experience',
    requirements: { education: 'none', experience: 0 }
  },
  SERVICE: {
    id: 'service',
    name: 'Service Industry',
    icon: '🍽️',
    description: 'Customer service and hospitality',
    requirements: { education: 'high_school', experience: 0 }
  },
  RETAIL: {
    id: 'retail',
    name: 'Retail & Sales',
    icon: '🛍️',
    description: 'Sales and retail management',
    requirements: { education: 'high_school', experience: 6 }
  },
  OFFICE: {
    id: 'office',
    name: 'Office & Administration',
    icon: '💼',
    description: 'Administrative and clerical work',
    requirements: { education: 'high_school', experience: 12 }
  },
  TECHNOLOGY: {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    description: 'IT and software development',
    requirements: { education: 'college', experience: 0 }
  },
  HEALTHCARE: {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    description: 'Medical and healthcare services',
    requirements: { education: 'college', experience: 24 }
  },
  FINANCE: {
    id: 'finance',
    name: 'Finance & Banking',
    icon: '💰',
    description: 'Financial services and banking',
    requirements: { education: 'college', experience: 12 }
  },
  MANAGEMENT: {
    id: 'management',
    name: 'Management',
    icon: '👔',
    description: 'Leadership and executive roles',
    requirements: { education: 'college', experience: 60 }
  },
  EXECUTIVE: {
    id: 'executive',
    name: 'Executive',
    icon: '👑',
    description: 'C-level and senior executive positions',
    requirements: { education: 'masters', experience: 120 }
  }
};

export const JOBS_CONFIG = {
  // Entry Level Jobs
  CASHIER: {
    id: 'CASHIER',
    name: 'Cashier',
    category: 'entry_level',
    icon: '🛒',
    description: 'Handle customer transactions and provide basic customer service.',
    salary: { min: 2000, max: 2800 },
    requirements: { education: 'none', experience: 0 },
    skills: ['customer_service', 'basic_math'],
    workHours: 40,
    stressLevel: 2,
    promotionPath: ['SHIFT_SUPERVISOR', 'STORE_MANAGER'],
    experienceGain: 2
  },

  DELIVERY_DRIVER: {
    id: 'DELIVERY_DRIVER',
    name: 'Delivery Driver',
    category: 'entry_level',
    icon: '🚗',
    description: 'Deliver food and packages to customers.',
    salary: { min: 2200, max: 3200 },
    requirements: { education: 'none', experience: 0 },
    skills: ['driving', 'time_management'],
    workHours: 35,
    stressLevel: 3,
    promotionPath: ['LOGISTICS_COORDINATOR'],
    experienceGain: 2
  },

  JANITOR: {
    id: 'JANITOR',
    name: 'Janitor',
    category: 'entry_level',
    icon: '🧹',
    description: 'Maintain cleanliness and sanitation of facilities.',
    salary: { min: 1800, max: 2500 },
    requirements: { education: 'none', experience: 0 },
    skills: ['attention_to_detail', 'physical_stamina'],
    workHours: 40,
    stressLevel: 1,
    promotionPath: ['MAINTENANCE_SUPERVISOR'],
    experienceGain: 1
  },

  // Service Industry
  WAITER: {
    id: 'WAITER',
    name: 'Waiter/Waitress',
    category: 'service',
    icon: '🍽️',
    description: 'Serve customers in restaurants and take orders.',
    salary: { min: 2500, max: 4000 },
    requirements: { education: 'high_school', experience: 0 },
    skills: ['customer_service', 'multitasking', 'communication'],
    workHours: 35,
    stressLevel: 4,
    promotionPath: ['HEAD_WAITER', 'RESTAURANT_MANAGER'],
    experienceGain: 3
  },

  BARISTA: {
    id: 'BARISTA',
    name: 'Barista',
    category: 'service',
    icon: '☕',
    description: 'Prepare coffee and serve customers in cafes.',
    salary: { min: 2300, max: 3500 },
    requirements: { education: 'high_school', experience: 0 },
    skills: ['customer_service', 'attention_to_detail'],
    workHours: 30,
    stressLevel: 3,
    promotionPath: ['SHIFT_SUPERVISOR', 'CAFE_MANAGER'],
    experienceGain: 2
  },

  // Retail & Sales
  SALES_ASSOCIATE: {
    id: 'SALES_ASSOCIATE',
    name: 'Sales Associate',
    category: 'retail',
    icon: '🏪',
    description: 'Help customers find products and process sales.',
    salary: { min: 2800, max: 4200 },
    requirements: { education: 'high_school', experience: 6 },
    skills: ['sales', 'customer_service', 'product_knowledge'],
    workHours: 40,
    stressLevel: 3,
    promotionPath: ['SENIOR_SALES', 'SALES_MANAGER'],
    experienceGain: 3
  },

  SHIFT_SUPERVISOR: {
    id: 'SHIFT_SUPERVISOR',
    name: 'Shift Supervisor',
    category: 'retail',
    icon: '👥',
    description: 'Supervise staff during shifts and handle operations.',
    salary: { min: 3500, max: 5000 },
    requirements: { education: 'high_school', experience: 12 },
    skills: ['leadership', 'problem_solving', 'team_management'],
    workHours: 45,
    stressLevel: 4,
    promotionPath: ['ASSISTANT_MANAGER', 'STORE_MANAGER'],
    experienceGain: 4
  },

  // Office & Administration
  RECEPTIONIST: {
    id: 'RECEPTIONIST',
    name: 'Receptionist',
    category: 'office',
    icon: '📞',
    description: 'Answer phones, greet visitors, and handle basic admin tasks.',
    salary: { min: 3000, max: 4000 },
    requirements: { education: 'high_school', experience: 12 },
    skills: ['communication', 'organization', 'computer_skills'],
    workHours: 40,
    stressLevel: 2,
    promotionPath: ['ADMINISTRATIVE_ASSISTANT', 'OFFICE_MANAGER'],
    experienceGain: 3
  },

  DATA_ENTRY: {
    id: 'DATA_ENTRY',
    name: 'Data Entry Clerk',
    category: 'office',
    icon: '⌨️',
    description: 'Input and maintain data in computer systems.',
    salary: { min: 2800, max: 3800 },
    requirements: { education: 'high_school', experience: 6 },
    skills: ['typing', 'attention_to_detail', 'computer_skills'],
    workHours: 40,
    stressLevel: 2,
    promotionPath: ['DATABASE_ADMINISTRATOR'],
    experienceGain: 2
  },

  ADMINISTRATIVE_ASSISTANT: {
    id: 'ADMINISTRATIVE_ASSISTANT',
    name: 'Administrative Assistant',
    category: 'office',
    icon: '📋',
    description: 'Support executives and manage office operations.',
    salary: { min: 3800, max: 5500 },
    requirements: { education: 'high_school', experience: 24 },
    skills: ['organization', 'communication', 'multitasking'],
    workHours: 40,
    stressLevel: 3,
    promotionPath: ['EXECUTIVE_ASSISTANT', 'OFFICE_MANAGER'],
    experienceGain: 4
  },

  // Technology
  JUNIOR_DEVELOPER: {
    id: 'JUNIOR_DEVELOPER',
    name: 'Junior Developer',
    category: 'technology',
    icon: '💻',
    description: 'Write code and assist with software development projects.',
    salary: { min: 5000, max: 7000 },
    requirements: { education: 'college', experience: 0 },
    skills: ['programming', 'problem_solving', 'learning'],
    workHours: 40,
    stressLevel: 4,
    promotionPath: ['SOFTWARE_DEVELOPER', 'SENIOR_DEVELOPER'],
    experienceGain: 5
  },

  IT_SUPPORT: {
    id: 'IT_SUPPORT',
    name: 'IT Support Specialist',
    category: 'technology',
    icon: '🔧',
    description: 'Provide technical support and troubleshoot IT issues.',
    salary: { min: 4500, max: 6500 },
    requirements: { education: 'college', experience: 6 },
    skills: ['technical_support', 'problem_solving', 'communication'],
    workHours: 40,
    stressLevel: 4,
    promotionPath: ['SENIOR_IT_SUPPORT', 'IT_MANAGER'],
    experienceGain: 4
  },

  SOFTWARE_DEVELOPER: {
    id: 'SOFTWARE_DEVELOPER',
    name: 'Software Developer',
    category: 'technology',
    icon: '⚡',
    description: 'Design and develop software applications.',
    salary: { min: 7000, max: 10000 },
    requirements: { education: 'college', experience: 24 },
    skills: ['programming', 'software_design', 'project_management'],
    workHours: 40,
    stressLevel: 5,
    promotionPath: ['SENIOR_DEVELOPER', 'TECH_LEAD'],
    experienceGain: 6
  },

  // Healthcare
  MEDICAL_ASSISTANT: {
    id: 'MEDICAL_ASSISTANT',
    name: 'Medical Assistant',
    category: 'healthcare',
    icon: '🩺',
    description: 'Assist healthcare providers with patient care.',
    salary: { min: 4000, max: 5500 },
    requirements: { education: 'college', experience: 12 },
    skills: ['patient_care', 'medical_knowledge', 'communication'],
    workHours: 40,
    stressLevel: 4,
    promotionPath: ['NURSE', 'HEALTHCARE_COORDINATOR'],
    experienceGain: 4
  },

  NURSE: {
    id: 'NURSE',
    name: 'Registered Nurse',
    category: 'healthcare',
    icon: '👩‍⚕️',
    description: 'Provide direct patient care and medical treatment.',
    salary: { min: 6500, max: 9000 },
    requirements: { education: 'college', experience: 36 },
    skills: ['patient_care', 'medical_procedures', 'critical_thinking'],
    workHours: 40,
    stressLevel: 6,
    promotionPath: ['CHARGE_NURSE', 'NURSE_MANAGER'],
    experienceGain: 6
  },

  // Finance
  BANK_TELLER: {
    id: 'BANK_TELLER',
    name: 'Bank Teller',
    category: 'finance',
    icon: '🏦',
    description: 'Process customer transactions and provide banking services.',
    salary: { min: 3500, max: 4800 },
    requirements: { education: 'college', experience: 0 },
    skills: ['customer_service', 'attention_to_detail', 'math'],
    workHours: 40,
    stressLevel: 3,
    promotionPath: ['PERSONAL_BANKER', 'BRANCH_MANAGER'],
    experienceGain: 3
  },

  FINANCIAL_ANALYST: {
    id: 'FINANCIAL_ANALYST',
    name: 'Financial Analyst',
    category: 'finance',
    icon: '📊',
    description: 'Analyze financial data and prepare reports.',
    salary: { min: 6000, max: 8500 },
    requirements: { education: 'college', experience: 24 },
    skills: ['financial_analysis', 'excel', 'critical_thinking'],
    workHours: 45,
    stressLevel: 5,
    promotionPath: ['SENIOR_ANALYST', 'FINANCE_MANAGER'],
    experienceGain: 5
  },

  // Management
  STORE_MANAGER: {
    id: 'STORE_MANAGER',
    name: 'Store Manager',
    category: 'management',
    icon: '🏪',
    description: 'Manage store operations, staff, and customer service.',
    salary: { min: 5500, max: 8000 },
    requirements: { education: 'college', experience: 48 },
    skills: ['leadership', 'business_management', 'team_building'],
    workHours: 50,
    stressLevel: 6,
    promotionPath: ['DISTRICT_MANAGER', 'REGIONAL_MANAGER'],
    experienceGain: 6
  },

  PROJECT_MANAGER: {
    id: 'PROJECT_MANAGER',
    name: 'Project Manager',
    category: 'management',
    icon: '📋',
    description: 'Plan, execute, and oversee projects from start to finish.',
    salary: { min: 7500, max: 11000 },
    requirements: { education: 'college', experience: 60 },
    skills: ['project_management', 'leadership', 'communication'],
    workHours: 45,
    stressLevel: 6,
    promotionPath: ['SENIOR_PROJECT_MANAGER', 'PROGRAM_MANAGER'],
    experienceGain: 7
  },

  // Executive
  DIRECTOR: {
    id: 'DIRECTOR',
    name: 'Director',
    category: 'executive',
    icon: '👔',
    description: 'Lead departments and make strategic decisions.',
    salary: { min: 12000, max: 18000 },
    requirements: { education: 'masters', experience: 120 },
    skills: ['strategic_planning', 'leadership', 'decision_making'],
    workHours: 55,
    stressLevel: 8,
    promotionPath: ['VP', 'CEO'],
    experienceGain: 8
  },

  CEO: {
    id: 'CEO',
    name: 'Chief Executive Officer',
    category: 'executive',
    icon: '👑',
    description: 'Lead the entire organization and set company vision.',
    salary: { min: 25000, max: 50000 },
    requirements: { education: 'masters', experience: 180 },
    skills: ['visionary_leadership', 'strategic_thinking', 'business_acumen'],
    workHours: 60,
    stressLevel: 10,
    promotionPath: [],
    experienceGain: 10
  }
};

export const EDUCATION_LEVELS = {
  NONE: { id: 'none', name: 'No Education', cost: 0, duration: 0 },
  HIGH_SCHOOL: { id: 'high_school', name: 'High School Diploma', cost: 0, duration: 0 },
  COLLEGE: { id: 'college', name: 'College Degree', cost: 50000, duration: 48 },
  MASTERS: { id: 'masters', name: 'Masters Degree', cost: 80000, duration: 24 }
};

export const SKILLS = {
  CUSTOMER_SERVICE: { id: 'customer_service', name: 'Customer Service', category: 'soft' },
  COMMUNICATION: { id: 'communication', name: 'Communication', category: 'soft' },
  LEADERSHIP: { id: 'leadership', name: 'Leadership', category: 'soft' },
  PROBLEM_SOLVING: { id: 'problem_solving', name: 'Problem Solving', category: 'soft' },
  PROGRAMMING: { id: 'programming', name: 'Programming', category: 'technical' },
  FINANCIAL_ANALYSIS: { id: 'financial_analysis', name: 'Financial Analysis', category: 'technical' },
  PROJECT_MANAGEMENT: { id: 'project_management', name: 'Project Management', category: 'professional' },
  SALES: { id: 'sales', name: 'Sales', category: 'professional' }
};

// Helper functions
export const getJobsByCategory = (category) => {
  return Object.values(JOBS_CONFIG).filter(job => job.category === category);
};

export const getAvailableJobs = (education, experience, skills = []) => {
  return Object.values(JOBS_CONFIG).filter(job => {
    const educationMet = getEducationLevel(education) >= getEducationLevel(job.requirements.education);
    const experienceMet = experience >= job.requirements.experience;
    return educationMet && experienceMet;
  });
};

export const getEducationLevel = (education) => {
  const levels = { 'none': 0, 'high_school': 1, 'college': 2, 'masters': 3 };
  return levels[education] || 0;
};

export const calculateSalary = (job, experience, performance = 1.0) => {
  const baseSalary = (job.salary.min + job.salary.max) / 2;
  const experienceBonus = Math.min(experience * 0.02, 0.5); // Max 50% bonus
  const performanceMultiplier = Math.max(0.8, Math.min(1.3, performance)); // 80% to 130%
  return Math.floor(baseSalary * (1 + experienceBonus) * performanceMultiplier);
}; 