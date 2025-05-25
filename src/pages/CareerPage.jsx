import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import {
  JOB_CATEGORIES,
  JOBS_CONFIG,
  EDUCATION_LEVELS,
  SKILL_TYPES,
  getJobsByCategory,
  getAvailableJobs,
  calculateSalary,
  calculateJobSalary,
  calculateSkillRequirements,
  getPromotionPath,
  getCareerAdvice,
  simulateJobMarket
} from '../config/jobsConfig';
import { formatNumber } from '../utils/formatters';
import AnimatedButton from '../components/AnimatedButton';
import LoadingSpinner from '../components/LoadingSpinner';

const CareerPage = () => {
  const {
    player,
    updatePlayer,
    spendMoney,
    addIncome,
    addExperience
  } = useGameStore();

  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedCategory, setSelectedCategory] = useState('entry_level');
  const [jobApplications, setJobApplications] = useState([]);
  const [showJobDetails, setShowJobDetails] = useState(null);
  const [jobMarket, setJobMarket] = useState({});
  const [skillTraining, setSkillTraining] = useState(null);

  // Initialize job market
  useEffect(() => {
    const market = simulateJobMarket();
    setJobMarket(market);

    // Update job market every 2 minutes
    const interval = setInterval(() => {
      setJobMarket(simulateJobMarket());
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'jobs', label: 'Job Search', icon: '🔍' },
    { id: 'career', label: 'My Career', icon: '📈' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '💪' }
  ];

  const availableJobs = getAvailableJobs(player);
  const categoryJobs = getJobsByCategory(selectedCategory);

  const applyForJob = (jobId) => {
    const job = availableJobs.find(j => j.id === jobId);
    if (!job) return;

    const requirements = calculateSkillRequirements(job);
    const playerSkills = player.skills || {};

    // Check if player meets requirements
    const meetsRequirements = requirements.every(req =>
      (playerSkills[req.skill] || 0) >= req.level
    );

    if (!meetsRequirements) {
      alert('You do not meet the skill requirements for this job.');
      return;
    }

    // Calculate salary based on player skills and market conditions
    const salary = calculateJobSalary(job, playerSkills, jobMarket);

    updatePlayer({
      currentJob: {
        ...job,
        salary,
        startDate: Date.now(),
        performance: 75, // Starting performance
        experience: 0
      }
    });

    addExperience(50); // XP for getting a job
  };

  const quitJob = () => {
    updatePlayer({ currentJob: null });
  };

  const trainSkill = (skillType, trainingLevel) => {
    const cost = SKILL_TYPES[skillType].trainingCosts[trainingLevel];
    if (player.cash < cost) return;

    spendMoney(cost);

    const currentSkills = player.skills || {};
    const currentLevel = currentSkills[skillType] || 0;
    const newLevel = Math.min(currentLevel + 1, 100);

    updatePlayer({
      skills: {
        ...currentSkills,
        [skillType]: newLevel
      }
    });

    addExperience(25); // XP for skill training
    setSkillTraining({ skill: skillType, level: newLevel });

    setTimeout(() => setSkillTraining(null), 3000);
  };

  const pursueEducation = (educationLevel) => {
    const education = EDUCATION_LEVELS[educationLevel];
    if (!education || player.cash < education.cost) return;

    spendMoney(education.cost);

    const currentEducation = player.education || [];
    updatePlayer({
      education: [...currentEducation, {
        level: educationLevel,
        completedAt: Date.now(),
        gpa: 3.0 + Math.random() * 1.0 // Random GPA between 3.0-4.0
      }]
    });

    addExperience(education.xpReward);
  };

  const JobCard = ({ job, isAvailable = true }) => {
    const playerSkills = player.skills || {};
    const salary = calculateJobSalary(job, playerSkills, jobMarket);
    const requirements = calculateSkillRequirements(job);
    const meetsRequirements = requirements.every(req =>
      (playerSkills[req.skill] || 0) >= req.level
    );
    const hasJob = player.currentJob !== null;

    return (
      <motion.div
        className={`bg-gray-800 rounded-xl p-4 border ${isAvailable ? 'border-gray-600 hover:border-blue-500' : 'border-gray-700 opacity-50'
          } transition-colors cursor-pointer`}
        whileHover={isAvailable ? { scale: 1.02 } : {}}
        onClick={() => isAvailable && setShowJobDetails(job)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{job.icon}</span>
            <div>
              <h3 className="font-semibold text-white">{job.name}</h3>
              <p className="text-sm text-gray-400">{JOB_CATEGORIES[job.category.toUpperCase()]?.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-green-400">${formatNumber(salary)}/mo</p>
            <p className="text-xs text-gray-500">{job.workHours}h/week</p>
          </div>
        </div>

        <p className="text-sm text-gray-300 mb-3">{job.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {job.skills.slice(0, 2).map(skill => (
              <span key={skill} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
                {skill.replace('_', ' ')}
              </span>
            ))}
          </div>

          {isAvailable && (
            <AnimatedButton
              variant={!meetsRequirements || hasJob ? "secondary" : "primary"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (meetsRequirements && !hasJob) applyForJob(job.id);
              }}
              disabled={!meetsRequirements || hasJob}
            >
              {hasJob ? 'Employed' : !meetsRequirements ? 'Requirements' : 'Apply'}
            </AnimatedButton>
          )}
        </div>
      </motion.div>
    );
  };

  const JobDetailsModal = ({ job, onClose }) => {
    const salary = calculateSalary(job, experience);

    return (
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{job.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{job.name}</h2>
                <p className="text-blue-400">{JOB_CATEGORIES[job.category.toUpperCase()]?.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">Monthly Salary</p>
              <p className="text-xl font-bold text-green-400">${formatNumber(salary)}</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">Work Hours</p>
              <p className="text-xl font-bold text-white">{job.workHours}h/week</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">Stress Level</p>
              <p className="text-xl font-bold text-orange-400">{job.stressLevel}/10</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">Experience Gain</p>
              <p className="text-xl font-bold text-purple-400">+{job.experienceGain}/mo</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-white mb-3">Job Description</h3>
            <p className="text-gray-300">{job.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-white mb-3">Requirements</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Education:</span>
                <span className="text-sm text-white">{EDUCATION_LEVELS[job.requirements.education.toUpperCase()]?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Experience:</span>
                <span className="text-sm text-white">{job.requirements.experience} months</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-white mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full">
                  {skill.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>

          {job.promotionPath.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-3">Career Path</h3>
              <div className="flex items-center gap-2">
                {job.promotionPath.map((nextJob, index) => (
                  <React.Fragment key={nextJob}>
                    <span className="px-2 py-1 bg-green-600/20 text-green-400 text-sm rounded">
                      {nextJob.replace('_', ' ')}
                    </span>
                    {index < job.promotionPath.length - 1 && (
                      <span className="text-gray-400">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <AnimatedButton
              variant="secondary"
              size="md"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              size="md"
              onClick={() => {
                handleApplyForJob(job);
                onClose();
              }}
              className="flex-1"
            >
              Apply for Job
            </AnimatedButton>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Career Center</h1>
        <p className="text-gray-400">Build your career and advance your professional life</p>
      </div>

      {/* Current Status */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400">Current Job</p>
            <p className="font-semibold text-white">
              {currentJob ? currentJob.name : 'Unemployed'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Monthly Income</p>
            <p className="font-semibold text-green-400">${formatNumber(playerStats.monthlyIncome)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Experience</p>
            <p className="font-semibold text-purple-400">{experience} months</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Education</p>
            <p className="font-semibold text-blue-400">{EDUCATION_LEVELS[education.toUpperCase()]?.name}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === tab.id
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'jobs' && (
          <motion.div
            key="jobs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-3">Job Categories</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(JOB_CATEGORIES).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key.toLowerCase())}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === key.toLowerCase()
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  isAvailable={availableJobs.some(availableJob => availableJob.id === job.id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'career' && (
          <motion.div
            key="career"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {currentJob ? (
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{currentJob.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{currentJob.name}</h3>
                        <p className="text-gray-400">{JOB_CATEGORIES[currentJob.category.toUpperCase()]?.name}</p>
                      </div>
                    </div>
                    <AnimatedButton
                      variant="danger"
                      size="sm"
                      onClick={handleQuitJob}
                    >
                      Quit Job
                    </AnimatedButton>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <p className="text-sm text-gray-400">Monthly Salary</p>
                      <p className="text-lg font-bold text-green-400">${formatNumber(calculateSalary(currentJob, experience))}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <p className="text-sm text-gray-400">Work Hours</p>
                      <p className="text-lg font-bold text-white">{currentJob.workHours}h/week</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <p className="text-sm text-gray-400">Job Satisfaction</p>
                      <p className="text-lg font-bold text-blue-400">85%</p>
                    </div>
                  </div>
                </div>

                {/* Job Applications */}
                {jobApplications.length > 0 && (
                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4">Pending Applications</h3>
                    <div className="space-y-3">
                      {jobApplications.map(application => (
                        <div key={application.id} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{application.job.icon}</span>
                            <div>
                              <p className="font-medium text-white">{application.job.name}</p>
                              <p className="text-sm text-gray-400">Applied {application.appliedDate.toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${application.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                              application.status === 'accepted' ? 'bg-green-600/20 text-green-400' :
                                'bg-red-600/20 text-red-400'
                              }`}>
                              {application.status}
                            </span>
                            {application.status === 'accepted' && (
                              <AnimatedButton
                                variant="success"
                                size="sm"
                                onClick={() => handleAcceptJob(application.job)}
                              >
                                Accept
                              </AnimatedButton>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">💼</span>
                <h3 className="text-xl font-bold text-white mb-2">No Current Job</h3>
                <p className="text-gray-400 mb-6">Start your career by applying for jobs in the Job Search tab</p>
                <AnimatedButton
                  variant="primary"
                  size="md"
                  onClick={() => setActiveTab('jobs')}
                >
                  Find Jobs
                </AnimatedButton>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job Details Modal */}
      <AnimatePresence>
        {showJobDetails && (
          <JobDetailsModal
            job={showJobDetails}
            onClose={() => setShowJobDetails(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerPage; 