import React, { useState } from 'react';
import useIntegratedGameStore from '../store/integratedGameStore';
import {
  DYNASTY_TIERS,
  DYNASTY_TRAITS,
  LEGACY_PROJECTS,
  DYNASTY_FOCUSES,
  GENERATIONAL_PROGRESSION,
  calculateDynastyTier,
  getAvailableTraits,
  getAvailableLegacyProjects,
  calculateLegacyScore,
  getDynastyInsights
} from '../config/dynastyConfig';

const DynastyPage = () => {
  const {
    points,
    businesses,
    dynasty = {},
    updateDynasty,
    spendPoints,
    netWorth,
    totalRevenue
  } = useIntegratedGameStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const playerStats = {
    points,
    businesses,
    netWorth: netWorth || 0,
    totalRevenue: totalRevenue || 0
  };

  const currentTier = calculateDynastyTier(playerStats.netWorth);
  const availableTraits = getAvailableTraits(dynasty, playerStats);
  const availableProjects = getAvailableLegacyProjects(dynasty, playerStats);
  const legacyScore = calculateLegacyScore(dynasty, playerStats);
  const insights = getDynastyInsights(dynasty, playerStats);

  const purchaseTrait = (trait) => {
    if (dynasty.legacyPoints >= trait.cost) {
      const newTraits = [...(dynasty.traits || []), trait.id];
      updateDynasty({
        ...dynasty,
        traits: newTraits,
        legacyPoints: (dynasty.legacyPoints || 0) - trait.cost
      });
    }
  };

  const startLegacyProject = (project) => {
    if (points >= project.cost && dynasty.legacyPoints >= project.legacyPointCost) {
      spendPoints(project.cost);
      const newProjects = [...(dynasty.activeProjects || []), {
        id: project.id,
        startTime: Date.now(),
        duration: project.duration * 60 * 60 * 1000 // Convert hours to milliseconds
      }];
      updateDynasty({
        ...dynasty,
        activeProjects: newProjects,
        legacyPoints: (dynasty.legacyPoints || 0) - project.legacyPointCost
      });
    }
  };

  const setDynastyFocus = (focusId) => {
    updateDynasty({
      ...dynasty,
      focus: focusId
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Dynasty Tier */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              {currentTier.icon} {currentTier.name}
            </h3>
            <p className="text-purple-200">{currentTier.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-yellow-400">
              {(dynasty.legacyPoints || 0).toLocaleString()}
            </div>
            <div className="text-sm text-purple-200">Legacy Points</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-lg font-bold text-white">{legacyScore.toLocaleString()}</div>
            <div className="text-xs text-purple-200">Legacy Score</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-lg font-bold text-white">{dynasty.traits?.length || 0}/{currentTier.traitSlots}</div>
            <div className="text-xs text-purple-200">Dynasty Traits</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-lg font-bold text-white">{dynasty.completedProjects?.length || 0}</div>
            <div className="text-xs text-purple-200">Legacy Projects</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-lg font-bold text-white">{Math.floor((dynasty.age || 0) / 12)}</div>
            <div className="text-xs text-purple-200">Dynasty Age (Years)</div>
          </div>
        </div>
      </div>

      {/* Dynasty Focus */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Dynasty Focus</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(DYNASTY_FOCUSES).map(focus => (
            <div
              key={focus.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${dynasty.focus === focus.id
                ? 'border-purple-500 bg-purple-900/30'
                : 'border-gray-600 bg-gray-700 hover:border-purple-400'
                }`}
              onClick={() => setDynastyFocus(focus.id)}
            >
              <div className="text-2xl mb-2">{focus.icon}</div>
              <h4 className="font-bold text-white">{focus.name}</h4>
              <p className="text-sm text-gray-300 mt-2">{focus.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Dynasty Insights</h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${insight.priority === 'high'
                  ? 'border-red-500 bg-red-900/20'
                  : insight.priority === 'medium'
                    ? 'border-yellow-500 bg-yellow-900/20'
                    : 'border-blue-500 bg-blue-900/20'
                  }`}
              >
                <p className="text-white">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTraits = () => (
    <div className="space-y-6">
      {/* Current Traits */}
      {dynasty.traits && dynasty.traits.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Active Dynasty Traits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dynasty.traits.map(traitId => {
              const trait = DYNASTY_TRAITS[traitId.toUpperCase()];
              if (!trait) return null;
              return (
                <div key={trait.id} className="bg-purple-900/30 border border-purple-500 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{trait.icon}</span>
                    <h4 className="font-bold text-white">{trait.name}</h4>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{trait.description}</p>
                  <div className="space-y-1">
                    {Object.entries(trait.effects).map(([effect, value]) => (
                      <div key={effect} className="text-xs text-green-400">
                        +{typeof value === 'number' ? (value * 100).toFixed(0) + '%' : value} {effect.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Traits */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Available Dynasty Traits</h3>
        {availableTraits.length === 0 ? (
          <p className="text-gray-400">No traits available. Increase your dynasty tier or meet trait requirements.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableTraits.map(trait => (
              <div key={trait.id} className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{trait.icon}</span>
                    <h4 className="font-bold text-white">{trait.name}</h4>
                  </div>
                  <div className="text-yellow-400 font-bold">{trait.cost} LP</div>
                </div>
                <p className="text-sm text-gray-300 mb-3">{trait.description}</p>
                <div className="space-y-1 mb-4">
                  {Object.entries(trait.effects).map(([effect, value]) => (
                    <div key={effect} className="text-xs text-green-400">
                      +{typeof value === 'number' ? (value * 100).toFixed(0) + '%' : value} {effect.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => purchaseTrait(trait)}
                  disabled={dynasty.legacyPoints < trait.cost}
                  className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Purchase Trait
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderLegacyProjects = () => (
    <div className="space-y-6">
      {/* Active Projects */}
      {dynasty.activeProjects && dynasty.activeProjects.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Active Legacy Projects</h3>
          <div className="space-y-4">
            {dynasty.activeProjects.map(activeProject => {
              const project = LEGACY_PROJECTS[activeProject.id.toUpperCase()];
              if (!project) return null;

              const elapsed = Date.now() - activeProject.startTime;
              const progress = Math.min(100, (elapsed / activeProject.duration) * 100);

              return (
                <div key={activeProject.id} className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{project.icon}</span>
                      <h4 className="font-bold text-white">{project.name}</h4>
                    </div>
                    <div className="text-blue-400 font-bold">{progress.toFixed(1)}%</div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-300">{project.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Projects */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Available Legacy Projects</h3>
        {availableProjects.length === 0 ? (
          <p className="text-gray-400">No legacy projects available. Increase your wealth and meet project requirements.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableProjects.map(project => (
              <div key={project.id} className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{project.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-lg">{project.name}</h4>
                      <div className="text-sm text-gray-400">{project.category}</div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-4">{project.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Cost:</span>
                    <span className="text-white">{project.cost.toLocaleString()} points</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Legacy Points:</span>
                    <span className="text-yellow-400">{project.legacyPointCost} LP</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{Math.floor(project.duration / 24)} days</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-sm font-bold text-white mb-2">Effects:</h5>
                  <div className="space-y-1">
                    {Object.entries(project.effects).map(([effect, value]) => (
                      <div key={effect} className="text-xs text-green-400">
                        +{typeof value === 'number' ? (value * 100).toFixed(0) + '%' : value} {effect.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => startLegacyProject(project)}
                  disabled={points < project.cost || dynasty.legacyPoints < project.legacyPointCost}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-bold"
                >
                  Launch Project
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderGeneration = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Generational Progression</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(GENERATIONAL_PROGRESSION).map(generation => {
            const isActive = dynasty.generation === generation.id;
            const yearsElapsed = (dynasty.age || 0) / 12;

            let isUnlocked = false;
            if (generation.id === 'first_generation') isUnlocked = true;
            else if (generation.id === 'second_generation') isUnlocked = yearsElapsed >= 25;
            else if (generation.id === 'third_generation') isUnlocked = yearsElapsed >= 50;
            else if (generation.id === 'fourth_generation_plus') isUnlocked = yearsElapsed >= 75;

            return (
              <div
                key={generation.id}
                className={`p-4 rounded-lg border-2 ${isActive
                  ? 'border-gold-500 bg-gold-900/30'
                  : isUnlocked
                    ? 'border-gray-500 bg-gray-700'
                    : 'border-gray-700 bg-gray-800 opacity-50'
                  }`}
              >
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{generation.icon}</div>
                  <h4 className="font-bold text-white text-sm">{generation.name}</h4>
                </div>

                <div className="space-y-2">
                  <div>
                    <h5 className="text-xs font-bold text-green-400 mb-1">Bonuses:</h5>
                    {Object.entries(generation.bonuses).map(([bonus, value]) => (
                      <div key={bonus} className="text-xs text-green-300">
                        +{(value * 100).toFixed(0)}% {bonus.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </div>
                    ))}
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-red-400 mb-1">Challenges:</h5>
                    {Object.entries(generation.challenges).map(([challenge, value]) => (
                      <div key={challenge} className="text-xs text-red-300">
                        +{(value * 100).toFixed(0)}% {challenge.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dynasty Management</h1>
          <p className="text-purple-200">Build a lasting business empire across generations</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: '👑' },
            { id: 'traits', label: 'Dynasty Traits', icon: '⭐' },
            { id: 'projects', label: 'Legacy Projects', icon: '🏗️' },
            { id: 'generation', label: 'Generations', icon: '🌱' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'traits' && renderTraits()}
          {activeTab === 'projects' && renderLegacyProjects()}
          {activeTab === 'generation' && renderGeneration()}
        </div>
      </div>
    </div>
  );
};

export default DynastyPage; 