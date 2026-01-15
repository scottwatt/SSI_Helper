import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';

// Federal rates 2026
const FED = {
  SSI_FBR: 994,
  GIE: 20,
  EIE: 65,
  SEIE_MONTHLY: 2410,
  RESOURCE_LIMIT: 2000,
  RESOURCE_LIMIT_COUPLE: 3000,
};

const CA_1619B_THRESHOLD = 64517;

const LIVING_ARRANGEMENTS = {
  independent: { label: 'Independent Living', rate: 1233.94 },
  withParents: { label: 'Living with Parents', rate: 1233.94 },
  inHousehold: { label: "In Someone Else's Home", rate: 907.87 },
  facility: { label: 'Care Facility', rate: 62 }
};

// Input component
const Input = ({ label, hint, value, onChange, prefix = '$', small = false }) => (
  <div className={small ? 'mb-2' : 'mb-3'}>
    <label className={`font-medium text-gray-700 ${small ? 'text-xs' : 'text-sm'}`}>{label}</label>
    {hint && <p className="text-xs text-gray-500">{hint}</p>}
    <div className="relative mt-1">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{prefix}</span>}
      <input
        type="number"
        value={value || ''}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        placeholder="0"
        className={`w-full py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm ${prefix ? 'pl-7' : 'pl-3'} pr-3`}
      />
    </div>
  </div>
);

// Checkbox component
const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="accent-blue-600" />
    <span className="text-sm">{label}</span>
  </label>
);

// Benefit Input Row
const BenefitInput = ({ icon, label, enabled, onToggle, value, onChange, hint, statusNote }) => (
  <div className={`p-3 rounded-xl border-2 ${enabled ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xl">{icon}</span>
      <label className="flex items-center gap-2 flex-1 cursor-pointer">
        <input type="checkbox" checked={enabled} onChange={e => onToggle(e.target.checked)} className="accent-blue-600" />
        <span className="font-medium text-sm">{label}</span>
      </label>
    </div>
    {enabled && (
      <div className="ml-7">
        {onChange && <Input label="Monthly Amount" hint={hint} value={value} onChange={onChange} small />}
        {statusNote && <p className="text-xs text-blue-700 mt-1">{statusNote}</p>}
      </div>
    )}
  </div>
);

// Warning Card
const WarningCard = ({ icon, title, status, children, color = 'amber' }) => {
  const colors = {
    red: 'bg-red-50 border-red-300',
    amber: 'bg-amber-50 border-amber-300',
    green: 'bg-green-50 border-green-300',
    blue: 'bg-blue-50 border-blue-300'
  };
  const textColors = { red: 'text-red-800', amber: 'text-amber-800', green: 'text-green-800', blue: 'text-blue-800' };
  return (
    <div className={`p-3 rounded-xl border-2 ${colors[color]}`}>
      <div className="flex items-start gap-2">
        <span className="text-xl">{icon}</span>
        <div className="flex-1">
          <div className={`font-bold text-sm ${textColors[color]}`}>{title}
            {status && <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${status === 'OK' ? 'bg-green-200' : status === 'WARNING' ? 'bg-amber-200' : 'bg-red-200'}`}>{status}</span>}
          </div>
          <div className={`text-sm mt-1 ${textColors[color]}`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

// Benefits Impact Display
const BenefitImpactCard = ({ name, icon, currentAmount, newAmount, status, note }) => {
  const loss = currentAmount - newAmount;
  const lossPercent = currentAmount > 0 ? Math.round((loss / currentAmount) * 100) : 0;
  
  return (
    <div className={`p-3 rounded-xl border ${status === 'safe' ? 'bg-green-50 border-green-200' : status === 'reduced' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="font-medium text-sm">{name}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status === 'safe' ? 'bg-green-200 text-green-800' : status === 'reduced' ? 'bg-amber-200 text-amber-800' : 'bg-red-200 text-red-800'}`}>
          {status === 'safe' ? '✓ SAFE' : status === 'reduced' ? `↓ -$${loss}/mo` : '⚠ AT RISK'}
        </span>
      </div>
      {note && <p className="text-xs mt-1 ml-7 text-gray-600">{note}</p>}
      {status === 'reduced' && currentAmount > 0 && (
        <div className="mt-2 ml-7">
          <div className="flex justify-between text-xs mb-1">
            <span>Was: ${currentAmount}/mo</span>
            <span>Now: ~${newAmount}/mo</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: `${100 - lossPercent}%` }} />
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border text-sm">
      <p className="font-bold">{d.hours} hrs/week</p>
      <div className="mt-1 space-y-1">
        <p className="text-emerald-600 font-semibold">💰 Real Total: ${d.realTotal}/mo</p>
        <p className="text-blue-600">💵 Take-home: ${d.monthlyNet}/mo</p>
        <p className="text-purple-600">🏛️ SSI: ${d.ssi}/mo</p>
        {d.benefitLoss > 0 && <p className="text-red-500">📉 Benefit Loss: -${d.benefitLoss}/mo</p>}
      </div>
      <p className={`mt-1 pt-1 border-t text-xs ${d.medicaidSafe ? 'text-green-600' : 'text-red-600'}`}>
        {d.medicaidSafe ? '✅ Medi-Cal PROTECTED' : '⚠️ Over 1619(b) limit'}
      </p>
    </div>
  );
};

// SSI Rules Checker
const SSIRulesChecker = ({ bankBalance, receivesGifts, paysRent, age, isMarried }) => {
  const resourceLimit = isMarried ? FED.RESOURCE_LIMIT_COUPLE : FED.RESOURCE_LIMIT;
  const resourceStatus = bankBalance > resourceLimit ? 'DANGER' : bankBalance > resourceLimit * 0.8 ? 'WARNING' : 'OK';
  
  return (
    <div className="space-y-3">
      <WarningCard icon="🏦" title={`Bank Limit: $${resourceLimit.toLocaleString()}`} status={resourceStatus}
        color={resourceStatus === 'DANGER' ? 'red' : resourceStatus === 'WARNING' ? 'amber' : 'green'}>
        <p>Your balance: <strong>${bankBalance.toLocaleString()}</strong></p>
        {resourceStatus === 'DANGER' && <p className="font-bold mt-1">🚨 OVER LIMIT - SSI stops until reduced!</p>}
        <div className="mt-2 p-2 bg-white/50 rounded text-xs">
          <strong>Doesn't count:</strong> Home, 1 car, ABLE account (up to $100k), household items
        </div>
        <div className="mt-1 p-2 bg-blue-100 rounded text-xs text-blue-800">
          💡 <strong>Open CalABLE account</strong> - up to $100k doesn't count! <a href="https://www.calable.ca.gov" target="_blank" rel="noopener noreferrer" className="underline">CalABLE.ca.gov</a>
        </div>
      </WarningCard>

      <WarningCard icon="🎁" title="Gifts & Inheritance" color={receivesGifts ? 'amber' : 'green'}>
        <p>Any gift = income that month. Birthday money, holiday gifts, inheritance can affect SSI.</p>
        <div className="mt-1 p-2 bg-blue-100 rounded text-xs text-blue-800">
          💡 Have gifts go directly to ABLE account or Special Needs Trust!
        </div>
      </WarningCard>

      <WarningCard icon="🏠" title="Free Food/Shelter (In-Kind Support)" color={!paysRent ? 'amber' : 'green'}>
        {!paysRent ? (
          <p><strong>Not paying rent?</strong> SSI may be reduced ~$330/mo (In-Kind Support & Maintenance)</p>
        ) : (
          <p>Paying fair share = no reduction. Keep receipts!</p>
        )}
      </WarningCard>

      {age >= 16 && age < 19 && (
        <WarningCard icon="🎂" title="Age 18 Redetermination" color="amber">
          <p><strong>At 18:</strong> Parent income stops counting ("deeming" ends), but disability re-evaluated under adult rules.</p>
          <p className="mt-1 text-xs">Apply 60-90 days before 18th birthday to avoid gaps!</p>
        </WarningCard>
      )}

      <WarningCard icon="📝" title="Report Within 10 Days" color="blue">
        <p className="mb-2">Failing to report causes overpayments!</p>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div>• Job/pay changes</div>
          <div>• Address change</div>
          <div>• Someone moves in/out</div>
          <div>• Marriage/divorce</div>
          <div>• Bank over $2k</div>
          <div>• Any gift received</div>
          <div>• Hospital/facility stay</div>
          <div>• Leave US 30+ days</div>
        </div>
      </WarningCard>

      <WarningCard icon="💸" title="Overpayments" color="red">
        <p>If SSA pays too much, they WILL ask for it back - sometimes years later!</p>
        <div className="mt-1 p-2 bg-amber-100 rounded text-xs">
          <strong>If you get an overpayment notice:</strong> You can request a waiver (Form SSA-632) if it wasn't your fault AND you can't afford to pay it back.
        </div>
      </WarningCard>
    </div>
  );
};

export default function HoursOptimizer() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [mode, setMode] = useState('simple');
  
  // Calculator inputs
  const [hourlyRate, setHourlyRate] = useState(16);
  const [living, setLiving] = useState('withParents');
  const [unearned, setUnearned] = useState(0);
  const [irwe, setIrwe] = useState(0);
  const [bwe, setBwe] = useState(0);
  const [pass, setPass] = useState(0);
  const [isStudent, setIsStudent] = useState(false);
  const [isBlind, setIsBlind] = useState(false);
  
  // Benefits tracking
  const [benefits, setBenefits] = useState({
    medicaid: true,
    ihss: false, ihssAmount: 0,
    section8: false, section8Amount: 0,
    snap: false, snapAmount: 0,
    liheap: false, liheapAmount: 0,
    regionalCenter: true,
  });
  
  // Rules checker inputs
  const [bankBalance, setBankBalance] = useState(500);
  const [receivesGifts, setReceivesGifts] = useState(false);
  const [paysRent, setPaysRent] = useState(false);
  const [age, setAge] = useState(22);
  const [isMarried, setIsMarried] = useState(false);

  const updateBenefit = (key, value) => setBenefits(b => ({ ...b, [key]: value }));
  const baseRate = LIVING_ARRANGEMENTS[living].rate;

  // Generate all scenarios - all calculations inline to satisfy React Compiler
  const scenarios = useMemo(() => {
    if (!hourlyRate || hourlyRate <= 0) return [];
    
    // Tax estimation (simplified)
    const estimateTaxes = (annual) => {
      if (annual <= 0) return 0;
      const fica = annual * 0.0765;
      const taxable = Math.max(0, annual - 14600);
      let fed = 0;
      if (taxable > 0) {
        if (taxable <= 11600) fed = taxable * 0.10;
        else if (taxable <= 47150) fed = 1160 + (taxable - 11600) * 0.12;
        else fed = 5426 + (taxable - 47150) * 0.22;
      }
      const state = Math.max(0, (annual - 10000) * 0.04);
      return Math.round((fica + fed + state) / 12);
    };

    // SSI Calculation using proper POMS order
    const calculateSSI = (monthlyEarned) => {
      let earned = monthlyEarned;
      const seieUsed = isStudent ? Math.min(earned, FED.SEIE_MONTHLY) : 0;
      earned = Math.max(0, earned - seieUsed);
      const gieOnUnearned = Math.min(unearned, FED.GIE);
      const countableUnearned = Math.max(0, unearned - gieOnUnearned);
      const gieRemaining = FED.GIE - gieOnUnearned;
      earned = Math.max(0, earned - gieRemaining);
      earned = Math.max(0, earned - FED.EIE);
      earned = Math.max(0, earned - irwe);
      earned = earned / 2;
      if (isBlind) earned = Math.max(0, earned - bwe);
      const totalCountable = Math.max(0, countableUnearned + earned - pass);
      return Math.max(0, baseRate - totalCountable);
    };

    // Calculate impact on all benefits
    const calculateBenefitImpacts = (monthlyGross, ssiPayment) => {
      const annualGross = monthlyGross * 12;
      const totalMonthlyIncome = monthlyGross + unearned + ssiPayment;
      const impacts = [];
      let totalLoss = 0;

      if (benefits.medicaid) {
        if (ssiPayment > 0) {
          impacts.push({ name: 'Medi-Cal', icon: '🏥', status: 'safe', current: 0, new: 0, note: 'Protected while receiving SSI' });
        } else if (annualGross <= CA_1619B_THRESHOLD) {
          impacts.push({ name: 'Medi-Cal', icon: '🏥', status: 'safe', current: 0, new: 0, note: `Protected under 1619(b) up to ${CA_1619B_THRESHOLD.toLocaleString()}/yr` });
        } else {
          const medicaidValue = 500;
          impacts.push({ name: 'Medi-Cal', icon: '🏥', status: 'at-risk', current: medicaidValue, new: 0, note: 'Over 1619(b) limit - look into Medi-Cal Buy-In program' });
          totalLoss += medicaidValue;
        }
      }

      if (benefits.ihss && benefits.ihssAmount > 0) {
        const ihssStatus = (ssiPayment > 0 || annualGross <= CA_1619B_THRESHOLD) ? 'safe' : 'at-risk';
        impacts.push({ 
          name: 'IHSS', icon: '🏠', status: ihssStatus, 
          current: benefits.ihssAmount, new: ihssStatus === 'safe' ? benefits.ihssAmount : 0,
          note: ihssStatus === 'safe' ? 'IHSS is based on NEED, not income. Safe while Medi-Cal continues!' : 'IHSS requires Medi-Cal eligibility'
        });
        if (ihssStatus === 'at-risk') totalLoss += benefits.ihssAmount;
      }

      if (benefits.section8 && benefits.section8Amount > 0) {
        const rentIncrease = Math.round(monthlyGross * 0.30);
        const newSubsidy = Math.max(0, benefits.section8Amount - rentIncrease);
        const loss = benefits.section8Amount - newSubsidy;
        impacts.push({ 
          name: 'Section 8', icon: '🏘️', 
          status: loss >= benefits.section8Amount ? 'at-risk' : loss > 0 ? 'reduced' : 'safe',
          current: benefits.section8Amount, new: newSubsidy,
          note: loss > 0 ? 'You pay 30% of income toward rent' : 'Subsidy stable'
        });
        totalLoss += loss;
      }

      if (benefits.snap && benefits.snapAmount > 0) {
        const snapReduction = Math.round(monthlyGross * 0.24);
        const newSnap = Math.max(0, benefits.snapAmount - snapReduction);
        const loss = benefits.snapAmount - newSnap;
        impacts.push({ 
          name: 'CalFresh/SNAP', icon: '🍎', 
          status: newSnap === 0 ? 'at-risk' : loss > 0 ? 'reduced' : 'safe',
          current: benefits.snapAmount, new: newSnap,
          note: loss > 0 ? 'Reduced ~$0.24 per $1 earned' : 'Stable'
        });
        totalLoss += loss;
      }

      if (benefits.liheap && benefits.liheapAmount > 0) {
        const annualTotal = totalMonthlyIncome * 12;
        const liheapSafe = annualTotal <= 22590;
        const monthlyValue = Math.round(benefits.liheapAmount / 12);
        impacts.push({ 
          name: 'LIHEAP', icon: '💡', 
          status: liheapSafe ? 'safe' : 'at-risk',
          current: monthlyValue, new: liheapSafe ? monthlyValue : 0,
          note: liheapSafe ? 'Under 150% FPL' : 'May exceed income limit'
        });
        if (!liheapSafe) totalLoss += monthlyValue;
      }

      if (benefits.regionalCenter) {
        impacts.push({ 
          name: 'Regional Center/SDP', icon: '🎯', status: 'safe',
          current: 0, new: 0,
          note: 'Based on IPP (needs), NOT income. Always protected!'
        });
      }

      return { impacts, totalLoss };
    };

    // Generate results
    const results = [];
    for (let hours = 0; hours <= 40; hours += 2) {
      const monthlyGross = Math.round(hours * 4.33 * hourlyRate);
      const annualGross = monthlyGross * 12;
      const taxes = estimateTaxes(annualGross);
      const ssi = calculateSSI(monthlyGross);
      const monthlyNet = monthlyGross - taxes;
      const { impacts, totalLoss } = calculateBenefitImpacts(monthlyGross, ssi);
      const realTotal = Math.round(monthlyNet + ssi + unearned - totalLoss);
      
      results.push({
        hours, monthlyGross, annualGross, taxes,
        monthlyNet: Math.round(monthlyNet),
        ssi: Math.round(ssi),
        benefitLoss: totalLoss,
        benefitImpacts: impacts,
        realTotal,
        medicaidSafe: annualGross <= CA_1619B_THRESHOLD,
        wages: Math.round(monthlyNet),
        ssiAmount: Math.round(ssi)
      });
    }
    return results;
  }, [hourlyRate, baseRate, unearned, irwe, bwe, pass, isStudent, isBlind, benefits]);

  // Find optimal points
  const { best, maxMedicaidSafe, cliffs } = useMemo(() => {
    if (scenarios.length < 2) return { best: null, maxMedicaidSafe: null, cliffs: [] };
    
    const best = scenarios.reduce((a, b) => b.realTotal > a.realTotal ? b : a);
    const safe = scenarios.filter(s => s.medicaidSafe && s.hours > 0);
    const maxMedicaidSafe = safe.length > 0 ? safe.reduce((a, b) => b.hours > a.hours ? b : a) : null;
    
    const cliffs = [];
    for (let i = 1; i < scenarios.length; i++) {
      if (scenarios[i].realTotal < scenarios[i-1].realTotal - 20) {
        cliffs.push({ from: scenarios[i-1].hours, to: scenarios[i].hours, loss: scenarios[i-1].realTotal - scenarios[i].realTotal });
      }
    }
    
    return { best, maxMedicaidSafe, cliffs };
  }, [scenarios]);

  // Warning count for badge
  const warningCount = [
    bankBalance > FED.RESOURCE_LIMIT, 
    receivesGifts, 
    !paysRent && living !== 'independent', 
    age >= 16 && age < 19
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Medi-Cal Protection Banner */}
      <div className="p-3 bg-green-100 border-2 border-green-400 rounded-xl text-center">
        <div className="font-bold text-green-800">🛡️ MEDI-CAL PROTECTED up to ${CA_1619B_THRESHOLD.toLocaleString()}/year</div>
        <p className="text-green-700 text-xs">Section 1619(b) keeps Medi-Cal even when SSI drops to $0</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b text-sm">
        {[
          { id: 'calculator', label: '💰 Calculator' },
          { id: 'benefits', label: '📋 My Benefits' },
          { id: 'rules', label: '⚠️ SSI Rules', badge: warningCount }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 font-medium relative transition-colors ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.label}
            {tab.badge > 0 && (
              <span className="absolute top-1 right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CALCULATOR TAB */}
      {activeTab === 'calculator' && (
        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button onClick={() => setMode('simple')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'simple' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              🎯 Simple
            </button>
            <button onClick={() => setMode('advanced')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'advanced' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              ⚙️ Advanced
            </button>
          </div>

          {/* Core Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <Input label="Hourly Wage" value={hourlyRate} onChange={setHourlyRate} />
            <Input label="Other Monthly Income" hint="SSDI, VA, pensions" value={unearned} onChange={setUnearned} />
          </div>

          {/* Living Arrangement */}
          <div>
            <label className="text-sm font-medium text-gray-700">Living Situation</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {Object.entries(LIVING_ARRANGEMENTS).map(([key, { label, rate }]) => (
                <button 
                  key={key} 
                  onClick={() => setLiving(key)}
                  className={`p-2 rounded-lg text-left text-xs border-2 transition-colors ${living === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-gray-500">${rate}/mo base</div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          {mode === 'advanced' && (
            <div className="space-y-3 border-t pt-3">
              <div className="text-sm font-medium text-gray-700">Work Incentive Deductions</div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="IRWE" hint="Disability-related work costs" value={irwe} onChange={setIrwe} small />
                <Input label="PASS" hint="Self-support plan savings" value={pass} onChange={setPass} small />
              </div>
              <div className="flex flex-wrap gap-2">
                <Checkbox label="Student under 22 (SEIE)" checked={isStudent} onChange={setIsStudent} />
                <Checkbox label="Statutorily Blind" checked={isBlind} onChange={setIsBlind} />
              </div>
              {isBlind && <Input label="BWE (Blind Work Expenses)" value={bwe} onChange={setBwe} small />}
            </div>
          )}

          {/* Results */}
          {scenarios.length > 0 && (
            <>
              {/* Cliff Warnings */}
              {cliffs.length > 0 && (
                <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl">
                  <div className="font-bold text-red-800">🚨 Benefits Cliff Detected!</div>
                  {cliffs.map((c, i) => (
                    <p key={i} className="text-sm text-red-700">
                      At {c.to} hrs, you <strong>LOSE ${c.loss}/mo</strong> compared to working {c.from} hrs!
                    </p>
                  ))}
                </div>
              )}

              {/* Sweet Spot Cards */}
              <div className="grid grid-cols-2 gap-3">
                {best && (
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl">
                    <div className="text-xs opacity-80">💰 BEST TOTAL INCOME</div>
                    <div className="text-2xl font-bold">{best.hours} hrs/wk</div>
                    <div className="text-emerald-100 text-sm">${best.realTotal}/mo</div>
                    <div className="text-xs mt-1 opacity-90">{best.medicaidSafe ? '✅ Medi-Cal safe' : '⚠️ Check limit'}</div>
                  </div>
                )}
                {maxMedicaidSafe && (
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl">
                    <div className="text-xs opacity-80">🛡️ MAX SAFE HOURS</div>
                    <div className="text-2xl font-bold">{maxMedicaidSafe.hours} hrs/wk</div>
                    <div className="text-green-100 text-sm">${maxMedicaidSafe.realTotal}/mo</div>
                    <div className="text-xs mt-1 opacity-90">Medi-Cal guaranteed</div>
                  </div>
                )}
              </div>

              {/* Chart */}
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="text-sm font-medium text-gray-700 mb-2">📊 Income by Hours Worked</div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scenarios} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="hours" tickFormatter={v => `${v}h`} tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={v => `$${v}`} tick={{ fontSize: 10 }} width={40} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="ssiAmount" stackId="1" stroke="#8b5cf6" fill="#c4b5fd" name="SSI" />
                      <Area type="monotone" dataKey="wages" stackId="1" stroke="#3b82f6" fill="#93c5fd" name="Take-home" />
                      {best && <ReferenceLine x={best.hours} stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2 text-xs text-gray-600">
                  <span><span className="inline-block w-3 h-3 bg-purple-300 rounded mr-1"></span>SSI</span>
                  <span><span className="inline-block w-3 h-3 bg-blue-300 rounded mr-1"></span>Take-home Pay</span>
                </div>
              </div>

              {/* Benefits Impact at Best Hours */}
              {best && best.benefitImpacts.length > 0 && (
                <div className="space-y-2">
                  <div className="font-semibold text-sm text-gray-700">Benefits Impact at {best.hours} hrs/week:</div>
                  {best.benefitImpacts.map((b, i) => (
                    <BenefitImpactCard key={i} {...b} currentAmount={b.current} newAmount={b.new} />
                  ))}
                  {best.benefitLoss > 0 && (
                    <div className="p-2 bg-amber-100 rounded-lg text-sm text-amber-800">
                      ⚠️ Total benefit reductions: <strong>-${best.benefitLoss}/mo</strong> (already factored into totals above)
                    </div>
                  )}
                </div>
              )}

              {/* Data Table */}
              <details className="bg-white rounded-xl border border-gray-200">
                <summary className="p-3 font-semibold cursor-pointer text-sm hover:bg-gray-50">📋 View All Numbers</summary>
                <div className="max-h-48 overflow-y-auto text-xs">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="p-2 text-left">Hrs</th>
                        <th className="p-2 text-right">Gross</th>
                        <th className="p-2 text-right">SSI</th>
                        <th className="p-2 text-right">-Benefits</th>
                        <th className="p-2 text-right font-bold">Real Total</th>
                        <th className="p-2 text-center">MC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenarios.map(s => (
                        <tr key={s.hours} className={`border-t ${best && s.hours === best.hours ? 'bg-emerald-50 font-semibold' : ''}`}>
                          <td className="p-2">{s.hours}{best && s.hours === best.hours && ' ★'}</td>
                          <td className="p-2 text-right">${s.monthlyGross}</td>
                          <td className="p-2 text-right text-purple-600">${s.ssi}</td>
                          <td className="p-2 text-right text-red-500">{s.benefitLoss > 0 ? `-$${s.benefitLoss}` : '—'}</td>
                          <td className="p-2 text-right font-bold">${s.realTotal}</td>
                          <td className="p-2 text-center">{s.medicaidSafe ? '✅' : '⚠️'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>

              {/* Key Points for Parents */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="font-bold text-blue-800 text-sm mb-2">👨‍👩‍👧 Key Points for Parents:</div>
                <ul className="space-y-1 text-xs text-blue-700">
                  <li>✅ <strong>Medi-Cal stays</strong> under ${CA_1619B_THRESHOLD.toLocaleString()}/year (1619b protection)</li>
                  <li>✅ <strong>IHSS continues</strong> — based on functional need, not income</li>
                  <li>✅ <strong>SDP/Regional Center NEVER affected</strong> — based on IPP, not income</li>
                  <li>⚠️ Section 8 & CalFresh may reduce as income increases</li>
                  <li>💡 Even with some benefit reductions, <strong>total income usually goes UP!</strong></li>
                </ul>
              </div>
            </>
          )}
        </div>
      )}

      {/* BENEFITS TAB */}
      {activeTab === 'benefits' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Select all benefits you currently receive to see how work affects them.</p>
          
          <BenefitInput 
            icon="🏥" label="Medi-Cal / Medicaid" 
            enabled={benefits.medicaid} onToggle={v => updateBenefit('medicaid', v)}
            statusNote="Protected under 1619(b) up to $64,517/yr — NOT affected by work!" 
          />
          
          <BenefitInput 
            icon="🏠" label="IHSS (In-Home Supportive Services)" 
            enabled={benefits.ihss} onToggle={v => updateBenefit('ihss', v)}
            value={benefits.ihssAmount} onChange={v => updateBenefit('ihssAmount', v)} 
            hint="Monthly IHSS payment amount"
            statusNote="Based on functional NEED, not income. Safe while Medi-Cal continues!" 
          />
          
          <BenefitInput 
            icon="🏘️" label="Section 8 / Housing Voucher" 
            enabled={benefits.section8} onToggle={v => updateBenefit('section8', v)}
            value={benefits.section8Amount} onChange={v => updateBenefit('section8Amount', v)} 
            hint="Monthly subsidy value"
            statusNote="You pay 30% of income toward rent. As income ↑, subsidy ↓" 
          />
          
          <BenefitInput 
            icon="🍎" label="CalFresh / SNAP (Food Stamps)" 
            enabled={benefits.snap} onToggle={v => updateBenefit('snap', v)}
            value={benefits.snapAmount} onChange={v => updateBenefit('snapAmount', v)} 
            hint="Monthly amount"
            statusNote="Reduces ~$0.24 per $1 earned after deductions" 
          />
          
          <BenefitInput 
            icon="💡" label="LIHEAP (Utility Assistance)" 
            enabled={benefits.liheap} onToggle={v => updateBenefit('liheap', v)}
            value={benefits.liheapAmount} onChange={v => updateBenefit('liheapAmount', v)} 
            hint="Annual assistance amount"
            statusNote="Income limit ~150% FPL ($22,590/yr for individual)" 
          />
          
          <BenefitInput 
            icon="🎯" label="Regional Center / Self-Determination Program" 
            enabled={benefits.regionalCenter} onToggle={v => updateBenefit('regionalCenter', v)}
            statusNote="Based on your IPP (needs), NOT income. ALWAYS PROTECTED!" 
          />

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="font-bold text-amber-800 text-sm">💡 Pro Tip: Check all that apply!</div>
            <p className="text-xs text-amber-700 mt-1">
              The calculator factors in ALL your benefits to show your TRUE total income at each hours level.
            </p>
          </div>
        </div>
      )}

      {/* RULES TAB */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          {/* Quick Situation Check */}
          <div className="p-3 bg-gray-50 rounded-xl space-y-3">
            <div className="font-semibold text-sm text-gray-700">Check Your Situation:</div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Bank Balance" hint="All accounts combined" value={bankBalance} onChange={setBankBalance} small />
              <Input label="Age" prefix="" value={age} onChange={setAge} small />
            </div>
            <div className="flex flex-wrap gap-2">
              <Checkbox label="Receives gifts/money regularly" checked={receivesGifts} onChange={setReceivesGifts} />
              <Checkbox label="Pays fair share of rent/food" checked={paysRent} onChange={setPaysRent} />
              <Checkbox label="Married" checked={isMarried} onChange={setIsMarried} />
            </div>
          </div>

          <SSIRulesChecker 
            bankBalance={bankBalance} 
            receivesGifts={receivesGifts} 
            paysRent={paysRent} 
            age={age} 
            isMarried={isMarried} 
          />
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-3 bg-gray-100 rounded-xl text-xs text-gray-600">
        <strong>Disclaimer:</strong> These are estimates for educational purposes only. Actual SSI and benefit amounts 
        are determined by SSA and respective program administrators. Always consult with a certified benefits 
        counselor before making employment decisions.
      </div>
    </div>
  );
}