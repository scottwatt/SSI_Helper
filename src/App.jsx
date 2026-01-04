import { useState, useCallback } from 'react';
import Layout, { Header, Content } from './components/Layout';
import Disclaimer from './components/Disclaimer';
import StateSelector from './components/StateSelector';
import CaliforniaCalculator from './components/calculators/CaliforniaCalculator';
import NewYorkCalculator from './components/calculators/NewYorkCalculator';
import MassachusettsCalculator from './components/calculators/MassachusettsCalculator';
import HawaiiCalculator from './components/calculators/HawaiiCalculator';
import FederalCalculator from './components/calculators/FederalCalculator';
import HelpCenter from './components/HelpCenter';
import { STATES } from './data/states';

function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [selectedState, setSelectedState] = useState(null);
  const [screen, setScreen] = useState('state'); // 'state' | 'home' | 'calculator' | 'help'

  const stateData = selectedState ? STATES[selectedState] : null;

  const handleSelectState = useCallback((stateCode) => {
    setSelectedState(stateCode);
    setScreen('home');
  }, []);

  const handleReset = useCallback(() => {
    setSelectedState(null);
    setScreen('state');
  }, []);

  if (showDisclaimer) {
    return <Disclaimer onAccept={() => setShowDisclaimer(false)} />;
  }

  // State Selection Screen
  if (screen === 'state' || !selectedState) {
    return (
      <Layout>
        <Header>
          <h1 className="text-2xl font-bold">Benefits Navigator</h1>
          <p className="text-blue-100 text-sm">SSI Payment Estimator</p>
          <p className="text-blue-200 text-xs mt-1">2026 Rates • WIP-C Methodology</p>
        </Header>
        <Content>
          <StateSelector onSelectState={handleSelectState} />
        </Content>
      </Layout>
    );
  }

  // Home Screen
  if (screen === 'home') {
    const hasFullRates = ['CA', 'NY', 'MA', 'HI'].includes(selectedState);
    const tools = [
      {
        id: 'calculator',
        name: 'SSI Calculator',
        icon: '💰',
        desc: hasFullRates
          ? `Full ${selectedState} rates with state supplement`
          : 'Federal rates estimate'
      },
      {
        id: 'help',
        name: 'Help Center',
        icon: '🆘',
        desc: 'Overpayments, appeals, your rights'
      }
    ];

    return (
      <Layout>
        <Header>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Benefits Navigator</h1>
              <p className="text-blue-100 text-sm">
                {stateData?.name}{' '}
                {hasFullRates && (
                  <span className="text-emerald-300">✓ Full rates</span>
                )}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors"
            >
              Change State
            </button>
          </div>
        </Header>
        <Content>
          <div className="space-y-3">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setScreen(tool.id === 'help' ? 'help' : 'calculator')}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 text-left transition-all"
              >
                <span className="text-3xl">{tool.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900">{tool.name}</div>
                  <div className="text-xs text-gray-500">{tool.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {stateData?.hasStateSupplement && !['CA', 'NY', 'MA', 'HI'].includes(selectedState) && (
            <div className="mt-4 bg-amber-50 p-3 rounded-xl text-sm text-amber-800 border border-amber-200">
              <strong>Note:</strong> {stateData.name} has a state supplement. 
              Currently showing federal rates only.
            </div>
          )}
        </Content>
      </Layout>
    );
  }

  // Calculator Screen
  if (screen === 'calculator') {
    const getCalculator = () => {
      switch (selectedState) {
        case 'CA':
          return <CaliforniaCalculator />;
        case 'NY':
          return <NewYorkCalculator />;
        case 'MA':
          return <MassachusettsCalculator />;
        case 'HI':
          return <HawaiiCalculator />;
        default:
          return <FederalCalculator stateName={stateData?.name} />;
      }
    };

    return (
      <Layout>
        <Header showBack onBack={() => setScreen('home')}>
          <h1 className="text-lg font-bold">SSI Calculator</h1>
          <p className="text-blue-200 text-xs">{stateData?.name}</p>
        </Header>
        <Content>
          {getCalculator()}
        </Content>
      </Layout>
    );
  }

  // Help Center Screen
  if (screen === 'help') {
    return (
      <Layout>
        <Header showBack onBack={() => setScreen('home')}>
          <h1 className="text-lg font-bold">SSI Help Center</h1>
          <p className="text-blue-200 text-xs">Know Your Rights</p>
        </Header>
        <Content>
          <HelpCenter />
        </Content>
      </Layout>
    );
  }

  return null;
}

export default App;