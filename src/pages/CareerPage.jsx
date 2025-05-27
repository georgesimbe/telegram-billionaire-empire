import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  TrophyIcon,
  BookOpenIcon,
  UserGroupIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import useIntegratedGameStore from '../store/integratedGameStore';
import { formatNumber } from '../utils/formatters';
import HintIcon, { QuickHint } from '../components/HintIcon';
import PageHeader from '../components/ui/PageHeader';
import Card, { StatCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import TabNavigation from '../components/ui/TabNavigation';
import {
  EDUCATION_LEVELS,
  CERTIFICATIONS,
  JOB_CATEGORIES,
  SKILLS,
  getAvailableEducation,
  getAvailableJobs,
  calculateJobSalary,
  getEducationProgress,
  getCareerAdvancement
} from '../config/educationConfig';

const CareerPage = () => {
  const {
    player,
    career,
    enrollInEducation,
    completeEducation,
    applyForJob,
    acceptJob,
    quitJob,
    improveSkill
  } = useIntegratedGameStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // Calculate available options
  const availableEducation = getAvailableEducation(player.level, career.education, player.creditScore);
  const availableJobs = getAvailableJobs(career.education, career.certifications, career.workExperience);
  const careerAdvancement = getCareerAdvancement(career.currentJob, career.education, career.workExperience, career.skills);

  // Education progress
  const educationProgress = career.currentEducation ?
    getEducationProgress(career.currentEducation.startDate, EDUCATION_LEVELS[career.currentEducation.type]?.duration) : null;

  useEffect(() => {
    // Auto-complete education when progress reaches 100%
    if (educationProgress?.isComplete && career.currentEducation && !career.currentEducation.isComplete) {
      completeEducation();
    }
  }, [educationProgress, career.currentEducation, completeEducation]);

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Career Overview</h3>
          <QuickHint hintKey="CAREER_PROGRESSION" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Current Education</p>
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {EDUCATION_LEVELS[career.education]?.icon || '🎓'}
                </span>
                <span className="font-semibold text-white">
                  {EDUCATION_LEVELS[career.education]?.name || 'High School'}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Current Job</p>
              <div className="flex items-center space-x-2">
                <BriefcaseIcon className="h-5 w-5 text-blue-400" />
                <span className="font-semibold text-white">
                  {career.currentJob?.name || 'Unemployed'}
                </span>
              </div>
              {career.currentJob && (
                <p className="text-sm text-green-400 mt-1">
                  ${formatNumber(career.currentJob.salary)}/month
                </p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-400">Work Experience</p>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold text-white">
                  {Math.floor(career.workExperience / 30)} months
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Certifications</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {career.certifications.length > 0 ? (
                  career.certifications.map(certId => {
                    const cert = CERTIFICATIONS[certId];
                    return (
                      <span key={certId} className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                        {cert?.icon} {cert?.name}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-500 text-sm">None</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Monthly Income</p>
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-5 w-5 text-green-400" />
                <span className="font-semibold text-white">
                  ${formatNumber(player.monthlyIncome)}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Career Level</p>
              <div className="flex items-center space-x-2">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold text-white">
                  Level {player.level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Education Progress */}
      {career.currentEducation && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Education in Progress</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {EDUCATION_LEVELS[career.currentEducation.type]?.icon}
                </span>
                <div>
                  <h4 className="font-semibold text-white">
                    {EDUCATION_LEVELS[career.currentEducation.type]?.name}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {EDUCATION_LEVELS[career.currentEducation.type]?.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Progress</p>
                <p className="font-semibold text-white">
                  {educationProgress?.progress.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${educationProgress?.progress || 0}%` }}
              />
            </div>

            <div className="flex justify-between text-sm text-gray-400">
              <span>Started: {new Date(career.currentEducation.startDate).toLocaleDateString()}</span>
              <span>
                {educationProgress?.daysRemaining > 0
                  ? `${educationProgress.daysRemaining} days remaining`
                  : 'Complete!'
                }
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Career Advancement */}
      {careerAdvancement.nextJob && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Career Advancement</h3>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">Next Career Step</h4>
              <ArrowUpIcon className="h-5 w-5 text-green-400" />
            </div>

            <div className="space-y-2">
              <p className="text-white font-semibold">{careerAdvancement.nextJob.name}</p>
              <p className="text-green-400">
                +${formatNumber(careerAdvancement.salaryIncrease)}/month increase
              </p>

              {careerAdvancement.recommendedSkills.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Recommended Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {careerAdvancement.recommendedSkills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                        {skill.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderEducationTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Education & Training</h3>
          <QuickHint hintKey="EDUCATION_SYSTEM" />
        </div>

        <div className="grid gap-4">
          {availableEducation.map(education => {
            const canAfford = player.cash >= education.cost;
            const isCurrentlyEnrolled = career.currentEducation?.type === education.id;

            return (
              <motion.div
                key={education.id}
                whileHover={{ scale: 1.02 }}
                className={`bg-gray-700 rounded-lg p-4 cursor-pointer border-2 transition-colors ${selectedEducation === education.id
                  ? 'border-blue-500'
                  : 'border-transparent hover:border-gray-600'
                  } ${!canAfford ? 'opacity-50' : ''}`}
                onClick={() => setSelectedEducation(education.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{education.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{education.name}</h4>
                      <p className="text-sm text-gray-400">{education.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">${formatNumber(education.cost)}</p>
                    <p className="text-sm text-gray-400">{education.duration} days</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Benefits</p>
                    <div className="space-y-1">
                      <p className="text-sm text-green-400">
                        +{((education.benefits.jobMultiplier - 1) * 100).toFixed(0)}% salary multiplier
                      </p>
                      <p className="text-sm text-blue-400">
                        +{education.benefits.skillPoints} skill points
                      </p>
                      <p className="text-sm text-purple-400">
                        +{education.benefits.socialStatus} social status
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Unlocks</p>
                    <div className="flex flex-wrap gap-1">
                      {education.benefits.unlocks.map(unlock => (
                        <span key={unlock} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                          {unlock.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {isCurrentlyEnrolled ? (
                  <div className="flex items-center justify-center py-2 bg-blue-600 rounded text-white">
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    Currently Enrolled
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canAfford && !career.currentEducation) {
                        enrollInEducation(education.id);
                      }
                    }}
                    disabled={!canAfford || career.currentEducation}
                    className={`w-full py-2 rounded font-semibold transition-colors ${canAfford && !career.currentEducation
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {!canAfford ? 'Insufficient Funds' :
                      career.currentEducation ? 'Already Enrolled' : 'Enroll Now'}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderJobsTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Available Jobs</h3>
          <QuickHint hintKey="JOB_APPLICATIONS" />
        </div>

        {career.currentJob && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">Current Job</h4>
              <button
                onClick={quitJob}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                Quit Job
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Position</p>
                <p className="font-semibold text-white">{career.currentJob.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Salary</p>
                <p className="font-semibold text-green-400">${formatNumber(career.currentJob.salary)}/month</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Start Date</p>
                <p className="text-white">{new Date(career.currentJob.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Experience Gained</p>
                <p className="text-white">
                  {Math.floor((new Date() - new Date(career.currentJob.startDate)) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {availableJobs.map(job => {
            const salary = calculateJobSalary(job, career.education, career.certifications, career.skills, career.workExperience);
            const hasApplied = career.jobApplications.some(app => app.jobId === job.id);
            const isCurrentJob = career.currentJob?.id === job.id;

            return (
              <motion.div
                key={job.id}
                whileHover={{ scale: 1.02 }}
                className={`bg-gray-700 rounded-lg p-4 cursor-pointer border-2 transition-colors ${selectedJob === job.id
                  ? 'border-blue-500'
                  : 'border-transparent hover:border-gray-600'
                  } ${isCurrentJob ? 'opacity-50' : ''}`}
                onClick={() => setSelectedJob(job.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white">{job.name}</h4>
                    <p className="text-sm text-gray-400">
                      Required: {EDUCATION_LEVELS[job.requirements.education]?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">${formatNumber(salary)}/month</p>
                    <p className="text-sm text-gray-400">Base: ${formatNumber(job.salary)}</p>
                  </div>
                </div>

                {job.skills && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                          {skill.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {isCurrentJob ? (
                  <div className="flex items-center justify-center py-2 bg-blue-600 rounded text-white">
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Current Job
                  </div>
                ) : hasApplied ? (
                  <div className="flex items-center justify-center py-2 bg-yellow-600 rounded text-white">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Application Pending
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        applyForJob(job.id);
                      }}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors"
                    >
                      Apply
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        acceptJob(job.id);
                      }}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition-colors"
                    >
                      Accept Directly
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSkillsTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Skills Development</h3>
          <QuickHint hintKey="SKILL_DEVELOPMENT" />
        </div>

        <div className="grid gap-4">
          {Object.entries(SKILLS).map(([skillId, skill]) => {
            const currentLevel = career.skills[skillId] || 0;
            const category = skill.category;
            const categoryColors = {
              soft: 'bg-green-600',
              technical: 'bg-blue-600',
              industry: 'bg-purple-600'
            };

            return (
              <div key={skillId} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white">{skill.name}</h4>
                    <span className={`px-2 py-1 ${categoryColors[category]} text-white text-xs rounded capitalize`}>
                      {category}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{currentLevel}/100</p>
                    <p className="text-sm text-gray-400">Level {Math.floor(currentLevel / 10)}</p>
                  </div>
                </div>

                <div className="w-full bg-gray-600 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full ${categoryColors[category]}`}
                    style={{ width: `${currentLevel}%` }}
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => improveSkill(skillId, 5)}
                    disabled={player.cash < 100}
                    className={`flex-1 py-2 rounded font-semibold transition-colors ${player.cash >= 100
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Train (+5) - $100
                  </button>
                  <button
                    onClick={() => improveSkill(skillId, 15)}
                    disabled={player.cash < 500}
                    className={`flex-1 py-2 rounded font-semibold transition-colors ${player.cash >= 500
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Course (+15) - $500
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'education', name: 'Education', icon: AcademicCapIcon },
    { id: 'jobs', name: 'Jobs', icon: BriefcaseIcon },
    { id: 'skills', name: 'Skills', icon: TrophyIcon }
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto pb-20">
      <PageHeader
        title="Career Development"
        subtitle="Advance your education, skills, and career"
        icon={InformationCircleIcon}
        rightContent={<HintIcon hintKey="CAREER_OVERVIEW" />}
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-6"
      />

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'education' && renderEducationTab()}
        {activeTab === 'jobs' && renderJobsTab()}
        {activeTab === 'skills' && renderSkillsTab()}
      </motion.div>
    </div>
  );
};

export default CareerPage; 