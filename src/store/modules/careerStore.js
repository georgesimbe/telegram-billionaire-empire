import {
  EDUCATION_LEVELS,
  CERTIFICATIONS,
  JOB_CATEGORIES,
  getAvailableEducation,
  getAvailableJobs,
  calculateJobSalary,
  getEducationProgress
} from '../../config/educationConfig.js';

/**
 * Career Store Module
 * Manages jobs, education, skills, and career progression
 */
export const createCareerStore = (set, get) => ({
  // Career State
  career: {
    currentJob: null,
    education: 'high_school',
    skills: [],
    workExperience: 0,
    jobApplications: [],
    certifications: [],
    educationProgress: {
      currentLevel: null,
      startDate: null,
      completionDate: null,
      progress: 0
    },
    skillTraining: {
      activeTraining: null,
      trainingProgress: 0,
      trainingStartDate: null
    },
    careerHistory: [],
    totalSalaryEarned: 0,
    promotionsReceived: 0
  },

  // Career Actions
  updateCareer: (updates) => set((state) => ({
    career: { ...state.career, ...updates }
  })),

  /**
   * Apply for a job
   */
  applyForJob: (job) => set((state) => {
    // Check if already applied for this job
    const alreadyApplied = state.career.jobApplications.some(app => app.job.id === job.id);
    if (alreadyApplied) return state;

    const application = {
      id: Date.now(),
      job,
      status: 'pending',
      appliedDate: new Date(),
      salary: calculateJobSalary(job, state.career.education, state.career.certifications, state.career.skills)
    };

    return {
      career: {
        ...state.career,
        jobApplications: [...state.career.jobApplications, application]
      }
    };
  }),

  /**
   * Accept a job offer
   */
  acceptJob: (job) => set((state) => {
    const salary = calculateJobSalary(job, state.career.education, state.career.certifications, state.career.skills);

    // Add previous job to career history
    const careerHistory = state.career.currentJob
      ? [...state.career.careerHistory, {
        ...state.career.currentJob,
        startDate: state.career.currentJob.startDate || new Date(),
        endDate: new Date(),
        reasonForLeaving: 'new_opportunity'
      }]
      : state.career.careerHistory;

    return {
      career: {
        ...state.career,
        currentJob: {
          ...job,
          salary,
          startDate: new Date()
        },
        jobApplications: state.career.jobApplications.filter(app => app.job.id !== job.id),
        workExperience: state.career.workExperience + 1,
        careerHistory
      },
      player: {
        ...state.player,
        monthlyIncome: salary,
        lifetimeStats: {
          ...state.player.lifetimeStats,
          totalJobsHeld: state.player.lifetimeStats.totalJobsHeld + 1
        }
      }
    };
  }),

  /**
   * Quit current job
   */
  quitJob: (reason = 'voluntary') => set((state) => {
    if (!state.career.currentJob) return state;

    const careerHistory = [...state.career.careerHistory, {
      ...state.career.currentJob,
      endDate: new Date(),
      reasonForLeaving: reason
    }];

    return {
      career: {
        ...state.career,
        currentJob: null,
        careerHistory
      },
      player: {
        ...state.player,
        monthlyIncome: 0
      }
    };
  }),

  /**
   * Start education program
   */
  startEducation: (educationLevel) => set((state) => {
    const educationConfig = EDUCATION_LEVELS[educationLevel];
    if (!educationConfig) return state;

    // Check prerequisites
    const currentEducationIndex = Object.keys(EDUCATION_LEVELS).indexOf(state.career.education);
    const targetEducationIndex = Object.keys(EDUCATION_LEVELS).indexOf(educationLevel);

    if (targetEducationIndex <= currentEducationIndex) return state; // Can't go backwards

    // Check if can afford
    if (state.player.cash < educationConfig.cost) return state;

    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + educationConfig.duration);

    return {
      career: {
        ...state.career,
        educationProgress: {
          currentLevel: educationLevel,
          startDate: new Date(),
          completionDate,
          progress: 0
        }
      },
      player: {
        ...state.player,
        cash: state.player.cash - educationConfig.cost
      }
    };
  }),

  /**
   * Complete education program
   */
  completeEducation: () => set((state) => {
    const { educationProgress } = state.career;
    if (!educationProgress.currentLevel) return state;

    const educationConfig = EDUCATION_LEVELS[educationProgress.currentLevel];
    const skillPoints = educationConfig.skillPoints || 0;

    return {
      career: {
        ...state.career,
        education: educationProgress.currentLevel,
        educationProgress: {
          currentLevel: null,
          startDate: null,
          completionDate: null,
          progress: 0
        }
      },
      player: {
        ...state.player,
        experience: state.player.experience + skillPoints,
        lifetimeStats: {
          ...state.player.lifetimeStats,
          totalEducationCompleted: state.player.lifetimeStats.totalEducationCompleted + 1
        }
      }
    };
  }),

  /**
   * Start skill training
   */
  startSkillTraining: (skillId, trainingLevel = 1) => set((state) => {
    // Check if already training
    if (state.career.skillTraining.activeTraining) return state;

    const cost = trainingLevel * 500; // Base cost scaling
    if (state.player.cash < cost) return state;

    const duration = trainingLevel * 7; // Days to complete
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + duration);

    return {
      career: {
        ...state.career,
        skillTraining: {
          activeTraining: {
            skillId,
            level: trainingLevel,
            cost,
            duration,
            completionDate
          },
          trainingProgress: 0,
          trainingStartDate: new Date()
        }
      },
      player: {
        ...state.player,
        cash: state.player.cash - cost
      }
    };
  }),

  /**
   * Complete skill training
   */
  completeSkillTraining: () => set((state) => {
    const { skillTraining } = state.career;
    if (!skillTraining.activeTraining) return state;

    const { skillId, level } = skillTraining.activeTraining;

    // Find existing skill or create new one
    const existingSkillIndex = state.career.skills.findIndex(skill => skill.id === skillId);
    let updatedSkills;

    if (existingSkillIndex >= 0) {
      // Upgrade existing skill
      updatedSkills = state.career.skills.map((skill, index) =>
        index === existingSkillIndex
          ? { ...skill, level: Math.min(10, skill.level + level) }
          : skill
      );
    } else {
      // Add new skill
      updatedSkills = [...state.career.skills, {
        id: skillId,
        level,
        acquiredDate: new Date()
      }];
    }

    return {
      career: {
        ...state.career,
        skills: updatedSkills,
        skillTraining: {
          activeTraining: null,
          trainingProgress: 0,
          trainingStartDate: null
        }
      }
    };
  }),

  /**
   * Get certification
   */
  getCertification: (certificationId) => set((state) => {
    const certification = CERTIFICATIONS[certificationId];
    if (!certification) return state;

    // Check prerequisites
    if (certification.prerequisites) {
      const hasPrerequisites = certification.prerequisites.every(prereq => {
        if (prereq.type === 'education') {
          const educationIndex = Object.keys(EDUCATION_LEVELS).indexOf(state.career.education);
          const requiredIndex = Object.keys(EDUCATION_LEVELS).indexOf(prereq.value);
          return educationIndex >= requiredIndex;
        }
        if (prereq.type === 'skill') {
          const skill = state.career.skills.find(s => s.id === prereq.skill);
          return skill && skill.level >= prereq.level;
        }
        return false;
      });

      if (!hasPrerequisites) return state;
    }

    // Check if can afford
    if (state.player.cash < certification.cost) return state;

    // Check if already has certification
    if (state.career.certifications.some(cert => cert.id === certificationId)) return state;

    return {
      career: {
        ...state.career,
        certifications: [...state.career.certifications, {
          id: certificationId,
          ...certification,
          acquiredDate: new Date()
        }]
      },
      player: {
        ...state.player,
        cash: state.player.cash - certification.cost
      }
    };
  }),

  /**
   * Request promotion at current job
   */
  requestPromotion: () => set((state) => {
    if (!state.career.currentJob) return state;

    const currentJob = state.career.currentJob;
    const workDuration = new Date() - new Date(currentJob.startDate);
    const monthsWorked = workDuration / (1000 * 60 * 60 * 24 * 30);

    // Check eligibility (worked for at least 6 months)
    if (monthsWorked < 6) return state;

    // Calculate promotion chance based on education, skills, and performance
    const educationBonus = Object.keys(EDUCATION_LEVELS).indexOf(state.career.education) * 10;
    const skillsBonus = state.career.skills.length * 5;
    const experienceBonus = Math.min(50, monthsWorked * 2);

    const promotionChance = Math.min(90, educationBonus + skillsBonus + experienceBonus);
    const success = Math.random() * 100 < promotionChance;

    if (success) {
      const salaryIncrease = currentJob.salary * 0.15; // 15% raise
      const newSalary = currentJob.salary + salaryIncrease;

      return {
        career: {
          ...state.career,
          currentJob: {
            ...currentJob,
            salary: newSalary,
            lastPromotion: new Date()
          },
          promotionsReceived: state.career.promotionsReceived + 1
        },
        player: {
          ...state.player,
          monthlyIncome: newSalary,
          happiness: Math.min(100, state.player.happiness + 15)
        }
      };
    }

    return state; // Promotion denied
  }),

  /**
   * Get available jobs based on education and skills
   */
  getAvailableJobs: () => {
    const state = get();
    return getAvailableJobs(state.career.education, state.career.skills, state.career.certifications);
  },

  /**
   * Get available education options
   */
  getAvailableEducation: () => {
    const state = get();
    return getAvailableEducation(state.career.education);
  },

  /**
   * Get career statistics and progression info
   */
  getCareerStats: () => {
    const state = get();
    const { career } = state;

    const totalJobsHeld = career.careerHistory.length + (career.currentJob ? 1 : 0);
    const averageJobDuration = career.careerHistory.length > 0
      ? career.careerHistory.reduce((sum, job) => {
        const duration = new Date(job.endDate) - new Date(job.startDate);
        return sum + (duration / (1000 * 60 * 60 * 24 * 30)); // Convert to months
      }, 0) / career.careerHistory.length
      : 0;

    const currentJobDuration = career.currentJob
      ? (new Date() - new Date(career.currentJob.startDate)) / (1000 * 60 * 60 * 24 * 30)
      : 0;

    const totalSkillPoints = career.skills.reduce((sum, skill) => sum + skill.level, 0);
    const educationLevel = Object.keys(EDUCATION_LEVELS).indexOf(career.education) + 1;

    return {
      totalJobsHeld,
      averageJobDuration: Math.round(averageJobDuration),
      currentJobDuration: Math.round(currentJobDuration),
      totalSkillPoints,
      educationLevel,
      certificationsCount: career.certifications.length,
      promotionsReceived: career.promotionsReceived,
      currentSalary: career.currentJob?.salary || 0,
      careerProgression: calculateCareerProgression(career),
      nextCareerGoals: getNextCareerGoals(career)
    };
  },

  /**
   * Update education progress (called by time advancement)
   */
  updateEducationProgress: (days) => set((state) => {
    const { educationProgress } = state.career;
    if (!educationProgress.currentLevel) return state;

    const educationConfig = EDUCATION_LEVELS[educationProgress.currentLevel];
    const totalDuration = educationConfig.duration;
    const daysPassed = (new Date() - new Date(educationProgress.startDate)) / (1000 * 60 * 60 * 24);
    const progress = Math.min(100, (daysPassed / totalDuration) * 100);

    return {
      career: {
        ...state.career,
        educationProgress: {
          ...educationProgress,
          progress
        }
      }
    };
  }),

  /**
   * Update skill training progress (called by time advancement)
   */
  updateSkillTrainingProgress: (days) => set((state) => {
    const { skillTraining } = state.career;
    if (!skillTraining.activeTraining) return state;

    const totalDuration = skillTraining.activeTraining.duration;
    const daysPassed = (new Date() - new Date(skillTraining.trainingStartDate)) / (1000 * 60 * 60 * 24);
    const progress = Math.min(100, (daysPassed / totalDuration) * 100);

    return {
      career: {
        ...state.career,
        skillTraining: {
          ...skillTraining,
          trainingProgress: progress
        }
      }
    };
  })
});

// Helper functions
function calculateCareerProgression(career) {
  const educationScore = Object.keys(EDUCATION_LEVELS).indexOf(career.education) * 20;
  const skillsScore = Math.min(40, career.skills.length * 5);
  const certificationScore = Math.min(20, career.certifications.length * 10);
  const experienceScore = Math.min(20, career.workExperience * 2);

  return Math.min(100, educationScore + skillsScore + certificationScore + experienceScore);
}

function getNextCareerGoals(career) {
  const goals = [];

  // Education goals
  const currentEducationIndex = Object.keys(EDUCATION_LEVELS).indexOf(career.education);
  const nextEducation = Object.keys(EDUCATION_LEVELS)[currentEducationIndex + 1];
  if (nextEducation) {
    goals.push({
      type: 'education',
      target: nextEducation,
      description: `Complete ${EDUCATION_LEVELS[nextEducation].name}`
    });
  }

  // Skill goals
  if (career.skills.length < 5) {
    goals.push({
      type: 'skills',
      target: 5 - career.skills.length,
      description: `Learn ${5 - career.skills.length} more skills`
    });
  }

  // Certification goals
  if (career.certifications.length < 3) {
    goals.push({
      type: 'certifications',
      target: 3 - career.certifications.length,
      description: `Get ${3 - career.certifications.length} more certifications`
    });
  }

  return goals.slice(0, 3); // Return top 3 goals
}
