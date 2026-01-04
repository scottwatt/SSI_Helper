import { useState } from 'react';
import { COMMON_PROBLEMS, HELP_CONTENT, APPEAL_STEPS, IMPORTANT_FORMS, LEGAL_AID_INFO } from '../data/helpCenter';

function ProblemDetail({ problemId, onBack }) {
  const content = HELP_CONTENT[problemId];
  if (!content) return null;

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-medium">
        ← Back to Help Topics
      </button>

      <h2 className="text-xl font-bold text-gray-900">{content.title}</h2>
      <p className="text-gray-700">{content.intro}</p>

      {content.sections.map((section, i) => (
        <div key={i} className={`p-4 rounded-xl ${section.warning ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
          <h3 className="font-semibold text-gray-900 mb-2">{section.title}</h3>
          
          {section.content && <p className="text-gray-700 text-sm mb-2">{section.content}</p>}
          
          {section.bullets && (
            <ul className="space-y-1 text-sm text-gray-700">
              {section.bullets.map((b, j) => (
                <li key={j} className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {section.options && (
            <div className="space-y-3 mt-2">
              {section.options.map((opt, j) => (
                <div key={j} className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="font-medium text-blue-800">{opt.name}</div>
                  <p className="text-sm text-gray-600 mt-1">{opt.desc}</p>
                  {opt.form && <p className="text-xs text-gray-500 mt-1">Form: {opt.form}</p>}
                </div>
              ))}
            </div>
          )}

          {section.deadlines && (
            <div className="space-y-2 mt-2">
              {section.deadlines.map((d, j) => (
                <div key={j} className="flex gap-3 items-center">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                    {d.days}
                  </span>
                  <span className="text-sm text-gray-700">{d.action}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {content.doThis && (
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
          <h3 className="font-semibold text-emerald-900 mb-2">✓ Do This</h3>
          <ul className="space-y-1">
            {content.doThis.map((item, i) => (
              <li key={i} className="text-sm text-emerald-800 flex gap-2">
                <span>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.dontDoThis && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <h3 className="font-semibold text-red-900 mb-2">✗ Don't Do This</h3>
          <ul className="space-y-1">
            {content.dontDoThis.map((item, i) => (
              <li key={i} className="text-sm text-red-800 flex gap-2">
                <span>✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <LegalAidBox />
    </div>
  );
}

function LegalAidBox() {
  return (
    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
      <h3 className="font-semibold text-blue-900 mb-2">📞 Get Free Legal Help</h3>
      <p className="text-sm text-blue-800 mb-3">{LEGAL_AID_INFO.intro}</p>
      <div className="space-y-2">
        {LEGAL_AID_INFO.national.map((org, i) => (
          <div key={i} className="text-sm">
            <div className="font-medium text-blue-900">{org.name}</div>
            <div className="text-blue-700">{org.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormsSection() {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Important SSA Forms</h3>
      {IMPORTANT_FORMS.map((form, i) => (
        <a
          key={i}
          href={form.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-sm text-blue-600">{form.number}</span>
              <span className="text-gray-400 mx-2">•</span>
              <span className="font-medium text-gray-900">{form.name}</span>
            </div>
            <span className="text-blue-500">↗</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{form.use}</p>
        </a>
      ))}
    </div>
  );
}

function AppealSteps() {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">The Appeal Process</h3>
      <p className="text-sm text-gray-600">
        If SSA makes a decision you disagree with, you can appeal. Here are the steps:
      </p>
      {APPEAL_STEPS.map((step, i) => (
        <div key={i} className="p-3 bg-gray-50 rounded-xl border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div className="font-medium text-gray-900">
              Step {step.step}: {step.title}
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
              {step.deadline}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
          <p className="text-xs text-gray-500 mt-1">Form: {step.form}</p>
        </div>
      ))}
      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-sm text-amber-800">
        <strong>Remember:</strong> Appeal within 10 days of a decision to keep your benefits 
        while SSA reviews your case.
      </div>
    </div>
  );
}

export default function HelpCenter() {
  const [view, setView] = useState('main'); // 'main' | 'forms' | 'appeals' | problemId
  
  // Check if view is a problem detail
  const isProblemDetail = HELP_CONTENT[view];

  if (view === 'forms') {
    return (
      <div className="space-y-4">
        <button onClick={() => setView('main')} className="flex items-center gap-2 text-blue-600 font-medium">
          ← Back
        </button>
        <FormsSection />
      </div>
    );
  }

  if (view === 'appeals') {
    return (
      <div className="space-y-4">
        <button onClick={() => setView('main')} className="flex items-center gap-2 text-blue-600 font-medium">
          ← Back
        </button>
        <AppealSteps />
        <LegalAidBox />
      </div>
    );
  }

  if (isProblemDetail) {
    return <ProblemDetail problemId={view} onBack={() => setView('main')} />;
  }

  // Main view
  return (
    <div className="space-y-4">
      <div className="text-center py-2">
        <h2 className="text-lg font-bold text-gray-900">What's Going On?</h2>
        <p className="text-sm text-gray-500">Select your situation for help</p>
      </div>

      {/* Urgent issues first */}
      <div className="space-y-2">
        {COMMON_PROBLEMS.filter(p => p.urgent).map(problem => (
          <button
            key={problem.id}
            onClick={() => setView(problem.id)}
            className="w-full p-4 bg-red-50 border-2 border-red-200 rounded-xl text-left hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{problem.icon}</span>
              <div>
                <div className="font-semibold text-red-900">{problem.title}</div>
                <div className="text-sm text-red-700">{problem.subtitle}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Other issues */}
      <div className="space-y-2">
        {COMMON_PROBLEMS.filter(p => !p.urgent).map(problem => (
          <button
            key={problem.id}
            onClick={() => setView(problem.id)}
            className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl text-left hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{problem.icon}</span>
              <div>
                <div className="font-semibold text-gray-900">{problem.title}</div>
                <div className="text-sm text-gray-500">{problem.subtitle}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button
          onClick={() => setView('forms')}
          className="p-3 bg-gray-100 rounded-xl text-center hover:bg-gray-200 transition-colors"
        >
          <div className="text-lg">📄</div>
          <div className="text-sm font-medium text-gray-700">SSA Forms</div>
        </button>
        <button
          onClick={() => setView('appeals')}
          className="p-3 bg-gray-100 rounded-xl text-center hover:bg-gray-200 transition-colors"
        >
          <div className="text-lg">⚖️</div>
          <div className="text-sm font-medium text-gray-700">How to Appeal</div>
        </button>
      </div>

      <LegalAidBox />
    </div>
  );
}