import React, { useState, useEffect } from 'react';

const defaultConfigs = {
  Chennai: {
    zoneRisk: 'High Risk',
    zoneMultiplier: 1.30,
    seasonMultiplier: 1.10,
    escalation: [
      { level: 1, payout: 0.60, rain: 40 },
      { level: 2, payout: 0.85, rain: 60 },
      { level: 3, payout: 1.00, rain: 80 },
      { level: 4, payout: 1.00, rain: 100 }
    ],
    windows: {
      rain: [60, 120, 180, 240],
      aqi: [240, 360, 480, 720],
      flood: [360, 480, 720, 1440],
      curfew: [240, 480, 720, 1440],
      platform_outage: [45, 90, 180, 360],
      zone_freeze: [60, 120, 180, 360],
      heat: [180, 240, 360, 480]
    }
  },
  Mumbai: {
    zoneRisk: 'High Risk',
    zoneMultiplier: 1.30,
    seasonMultiplier: 1.15,
    escalation: [
      { level: 1, payout: 0.60, rain: 50 },
      { level: 2, payout: 0.85, rain: 80 },
      { level: 3, payout: 1.00, rain: 110 },
      { level: 4, payout: 1.00, rain: 150 }
    ],
    windows: {
      rain: [60, 120, 180, 240],
      aqi: [240, 360, 480, 720],
      flood: [360, 480, 720, 1440],
      curfew: [240, 480, 720, 1440],
      platform_outage: [45, 90, 180, 360],
      zone_freeze: [60, 120, 180, 360],
      heat: [180, 240, 360, 480]
    }
  },
  Bengaluru: {
    zoneRisk: 'Moderate Risk',
    zoneMultiplier: 1.00,
    seasonMultiplier: 1.05,
    escalation: [
      { level: 1, payout: 0.60, rain: 30 },
      { level: 2, payout: 0.85, rain: 50 },
      { level: 3, payout: 1.00, rain: 70 },
      { level: 4, payout: 1.00, rain: 90 }
    ],
    windows: {
      rain: [60, 120, 180, 240],
      aqi: [240, 360, 480, 720],
      flood: [360, 480, 720, 1440],
      curfew: [240, 480, 720, 1440],
      platform_outage: [45, 90, 180, 360],
      zone_freeze: [60, 120, 180, 360],
      heat: [180, 240, 360, 480]
    }
  },
  Hyderabad: {
    zoneRisk: 'Moderate Risk',
    zoneMultiplier: 1.00,
    seasonMultiplier: 1.05,
    escalation: [
      { level: 1, payout: 0.60, rain: 35 },
      { level: 2, payout: 0.85, rain: 55 },
      { level: 3, payout: 1.00, rain: 75 },
      { level: 4, payout: 1.00, rain: 95 }
    ],
    windows: {
      rain: [60, 120, 180, 240],
      aqi: [240, 360, 480, 720],
      flood: [360, 480, 720, 1440],
      curfew: [240, 480, 720, 1440],
      platform_outage: [45, 90, 180, 360],
      zone_freeze: [60, 120, 180, 360],
      heat: [180, 240, 360, 480]
    }
  },
  Delhi: {
    zoneRisk: 'Moderate Risk',
    zoneMultiplier: 1.00,
    seasonMultiplier: 1.10,
    escalation: [
      { level: 1, payout: 0.60, rain: 20 },
      { level: 2, payout: 0.85, rain: 40 },
      { level: 3, payout: 1.00, rain: 60 },
      { level: 4, payout: 1.00, rain: 80 }
    ],
    windows: {
      rain: [60, 120, 180, 240],
      aqi: [240, 360, 480, 720],
      flood: [360, 480, 720, 1440],
      curfew: [240, 480, 720, 1440],
      platform_outage: [45, 90, 180, 360],
      zone_freeze: [60, 120, 180, 360],
      heat: [180, 240, 360, 480]
    }
  },
  Kolkata: {
    zoneRisk: 'High Risk',
    zoneMultiplier: 1.30,
    seasonMultiplier: 1.10,
    escalation: [
      { level: 1, payout: 0.60, rain: 50 },
      { level: 2, payout: 0.85, rain: 75 },
      { level: 3, payout: 1.00, rain: 100 },
      { level: 4, payout: 1.00, rain: 130 }
    ],
    windows: {
      rain: [60, 120, 180, 240],
      aqi: [240, 360, 480, 720],
      flood: [360, 480, 720, 1440],
      curfew: [240, 480, 720, 1440],
      platform_outage: [45, 90, 180, 360],
      zone_freeze: [60, 120, 180, 360],
      heat: [180, 240, 360, 480]
    }
  }
};

const RISK_LEVELS = [
  { name: 'Low Risk', desc: 'Inland, elevated, historically quiet', defaultMult: 0.85 },
  { name: 'Moderate Risk', desc: 'Urban core, moderate flood history', defaultMult: 1.00 },
  { name: 'High Risk', desc: 'Coastal, riverine, historically flooded', defaultMult: 1.30 },
  { name: 'Extreme Risk', desc: 'T-18 cyclone zone, flood-prone low-lying', defaultMult: 1.55 }
];

export default function RiskConfiguration() {
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [config, setConfig] = useState(JSON.parse(JSON.stringify(defaultConfigs['Chennai'])));
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState('');

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setConfig(JSON.parse(JSON.stringify(defaultConfigs[city])));
    setIsDirty(false);
  };

  const handleEscalationChange = (levelIdx, field, value) => {
    const newConfig = { ...config };
    newConfig.escalation[levelIdx][field] = parseFloat(value);
    setConfig(newConfig);
    setIsDirty(true);
  };

  const handleWindowChange = (trigger, levelIdx, value) => {
    const newConfig = { ...config };
    newConfig.windows[trigger][levelIdx] = parseInt(value, 10);
    setConfig(newConfig);
    setIsDirty(true);
  };

  const handleZoneRiskChange = (riskName) => {
    const newConfig = { ...config };
    newConfig.zoneRisk = riskName;
    newConfig.zoneMultiplier = RISK_LEVELS.find(r => r.name === riskName).defaultMult;
    setConfig(newConfig);
    setIsDirty(true);
  };

  const handleZoneMultChange = (value) => {
    const newConfig = { ...config };
    newConfig.zoneMultiplier = parseFloat(value);
    setConfig(newConfig);
    setIsDirty(true);
  };

  const handleSeasonChange = (value) => {
    const newConfig = { ...config };
    newConfig.seasonMultiplier = parseFloat(value);
    setConfig(newConfig);
    setIsDirty(true);
  };

  const handleSave = () => {
    // In a real app, this would save to a backend or localStorage
    setIsDirty(false);
    setToast('✓ Configuration Saved Locally');
    setTimeout(() => setToast(''), 3000);
  };

  const handleReset = () => {
    setConfig(JSON.parse(JSON.stringify(defaultConfigs[selectedCity])));
    setIsDirty(false);
  };

  const estimatedRiskLevel = config.zoneMultiplier * config.seasonMultiplier >= 1.4 ? 'EXTREME' : config.zoneMultiplier * config.seasonMultiplier >= 1.2 ? 'HIGH' : config.zoneMultiplier * config.seasonMultiplier >= 1.0 ? 'MODERATE' : 'LOW';

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#0B3D91', margin: 0 }}>Risk & Trigger Configuration</h2>
          <span style={{ background: '#EBF0FA', color: '#0B3D91', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Frontend Configuration</span>
        </div>
        <p style={{ color: '#5A6478', fontSize: 14, margin: '6px 0 0 0' }}>Configure city-specific insurance triggers, payout multipliers, disruption windows, and zone risk factors.</p>
      </div>

      {/* City Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '16px 20px', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: 24, border: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontWeight: 600, color: '#1A1A2E' }}>City Configuration:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {Object.keys(defaultConfigs).map(city => (
              <button
                key={city}
                onClick={() => handleCityChange(city)}
                style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1px solid',
                  background: selectedCity === city ? '#EBF0FA' : '#fff',
                  borderColor: selectedCity === city ? '#0B3D91' : '#E5E7EB',
                  color: selectedCity === city ? '#0B3D91' : '#5A6478'
                }}
              >
                {city}
              </button>
            ))}
            <button style={{ padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1px dashed #9CA3AF', background: '#F9FAFB', color: '#5A6478' }}>+ Add City</button>
          </div>
        </div>
        {isDirty ? (
          <span style={{ color: '#E53935', fontSize: 13, fontWeight: 600 }}>● Unsaved Changes</span>
        ) : toast ? (
          <span style={{ color: '#00A86B', fontSize: 13, fontWeight: 600 }}>{toast}</span>
        ) : null}
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Zone Risk', value: config.zoneRisk, sub: `${config.zoneMultiplier.toFixed(2)}×` },
          { label: 'Rain Trigger', value: `${config.escalation[2].rain} mm`, sub: '/ 3hr' },
          { label: 'Maximum Payout', value: `${config.escalation[3].payout.toFixed(2)}×`, sub: 'Multiplier' },
          { label: 'Seasonal Multiplier', value: `${config.seasonMultiplier.toFixed(2)}×`, sub: 'Current' }
        ].map(item => (
          <div key={item.label} className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 12, color: '#5A6478', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1A1A2E', fontFamily: 'Outfit, sans-serif' }}>{item.value}</div>
            <div style={{ fontSize: 13, color: '#0B3D91', fontWeight: 600, marginTop: 2 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Trigger Escalation */}
          <div className="card">
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Trigger Escalation Levels</div>
            <div style={{ fontSize: 13, color: '#5A6478', marginBottom: 20 }}>Adjust severity thresholds and payout multipliers for the selected city.</div>
            
            {config.escalation.map((level, idx) => (
              <div key={idx} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: idx < 3 ? '1px solid #E5E7EB' : 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0B3D91', marginBottom: 12 }}>Level {level.level} — {['Minor', 'Moderate', 'Major', 'Catastrophic'][idx]}</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: '#5A6478' }}>Payout Multiplier</span>
                      <span style={{ fontWeight: 700 }}>{level.payout.toFixed(2)}×</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.05" value={level.payout} onChange={(e) => handleEscalationChange(idx, 'payout', e.target.value)} style={{ width: '100%', accentColor: '#0B3D91' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                      <span>0.00×</span><span>1.00×</span>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: '#5A6478' }}>Rain Threshold</span>
                      <span style={{ fontWeight: 700 }}>{level.rain} mm / 3hr</span>
                    </div>
                    <input type="range" min="0" max="200" step="5" value={level.rain} onChange={(e) => handleEscalationChange(idx, 'rain', e.target.value)} style={{ width: '100%', accentColor: '#0B3D91' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                      <span>0</span><span>200</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Disruption Windows */}
          <div className="card">
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Disruption Window Lengths</div>
            <div style={{ fontSize: 13, color: '#5A6478', marginBottom: 20 }}>Configure default disruption duration for each trigger severity.</div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', fontSize: 12, color: '#9CA3AF', paddingBottom: 12, fontWeight: 600 }}>Trigger</th>
                  <th style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', paddingBottom: 12, fontWeight: 600 }}>Level 1</th>
                  <th style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', paddingBottom: 12, fontWeight: 600 }}>Level 2</th>
                  <th style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', paddingBottom: 12, fontWeight: 600 }}>Level 3</th>
                  <th style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', paddingBottom: 12, fontWeight: 600 }}>Level 4</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(config.windows).map(trigger => (
                  <tr key={trigger} style={{ borderTop: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px 0', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{trigger.replace('_', ' ')}</td>
                    {[0, 1, 2, 3].map(levelIdx => (
                      <td key={levelIdx} style={{ padding: '16px 8px', textAlign: 'center' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{config.windows[trigger][levelIdx]} min</div>
                        <input type="range" min="30" max="1440" step="30" value={config.windows[trigger][levelIdx]} onChange={(e) => handleWindowChange(trigger, levelIdx, e.target.value)} style={{ width: '80%', accentColor: '#1A5BC4' }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Live Preview */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #0B3D91 0%, #1A5BC4 100%)', color: '#fff' }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
              Live Configuration Preview
              <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 12 }}>{selectedCity}</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Estimated Risk Level</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: estimatedRiskLevel === 'EXTREME' ? '#FF6B35' : estimatedRiskLevel === 'HIGH' ? '#FFB347' : '#00A86B' }}>{estimatedRiskLevel}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Rain Trigger L3</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{config.escalation[2].rain} mm / 3hr</div>
              </div>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Zone Multiplier</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{config.zoneMultiplier.toFixed(2)}×</div>
              </div>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Season Multiplier</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{config.seasonMultiplier.toFixed(2)}×</div>
              </div>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Max Payout Multiplier</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{config.escalation[3].payout.toFixed(2)}×</div>
              </div>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Max Disruption Window</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{config.windows.flood[3]} min</div>
              </div>
            </div>
          </div>

          {/* Zone Risk Factor */}
          <div className="card">
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Zone Risk Factor</div>
            <div style={{ fontSize: 13, color: '#5A6478', marginBottom: 20 }}>Configure risk multipliers based on the selected city's historical disruption profile.</div>

            <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
              {RISK_LEVELS.map(risk => (
                <div 
                  key={risk.name} 
                  onClick={() => handleZoneRiskChange(risk.name)}
                  style={{ padding: '12px 16px', borderRadius: 8, border: `2px solid ${config.zoneRisk === risk.name ? '#0B3D91' : '#E5E7EB'}`, background: config.zoneRisk === risk.name ? '#EBF0FA' : '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: config.zoneRisk === risk.name ? '#0B3D91' : '#1A1A2E' }}>{risk.name}</div>
                    <div style={{ fontSize: 12, color: '#5A6478', marginTop: 2 }}>{risk.desc}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: config.zoneRisk === risk.name ? '#0B3D91' : '#5A6478' }}>{risk.defaultMult.toFixed(2)}×</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#F9FAFB', padding: 16, borderRadius: 8, border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: '#5A6478', fontWeight: 600 }}>Custom Zone Multiplier</span>
                <span style={{ fontWeight: 800, color: '#0B3D91' }}>{config.zoneMultiplier.toFixed(2)}×</span>
              </div>
              <input type="range" min="0.5" max="2.0" step="0.05" value={config.zoneMultiplier} onChange={(e) => handleZoneMultChange(e.target.value)} style={{ width: '100%', accentColor: '#0B3D91' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                <span>0.50×</span><span>2.00×</span>
              </div>
            </div>
          </div>

          {/* Season Multiplier */}
          <div className="card">
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Season Multiplier</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: '#5A6478', fontWeight: 600 }}>Current Seasonal Multiplier</span>
              <span style={{ fontWeight: 800, color: '#0B3D91' }}>{config.seasonMultiplier.toFixed(2)}×</span>
            </div>
            <input type="range" min="0.8" max="1.5" step="0.05" value={config.seasonMultiplier} onChange={(e) => handleSeasonChange(e.target.value)} style={{ width: '100%', accentColor: '#0B3D91', marginBottom: 20 }} />

            <div style={{ background: '#1A1A2E', color: '#fff', padding: 16, borderRadius: 8, fontFamily: 'monospace', fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Base Multiplier</span><span>1.00×</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Season Adjustment</span><span style={{ color: config.seasonMultiplier >= 1 ? '#00A86B' : '#FF6B35' }}>{(config.seasonMultiplier - 1) > 0 ? '+' : ''}{(config.seasonMultiplier - 1).toFixed(2)}×</span>
              </div>
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Final Multiplier</span><span style={{ color: '#4CAF50' }}>{config.seasonMultiplier.toFixed(2)}×</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button onClick={handleReset} style={{ padding: '10px 16px', background: '#F3F4F6', color: '#5A6478', border: '1px solid #D1D5DB', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Reset Defaults</button>
            <button onClick={handleSave} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #0B3D91, #1A5BC4)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Save Configuration</button>
          </div>
        </div>
      </div>
    </div>
  );
}
