/* ═══ V5 DNA + FORENSICS + PATHS + CHALLENGES + VAULT + PAIRS + BIAS ═══ */
TRADER DNA PROFILING SYSTEM
   ══════════════════════════════════════ */

const TRADER_ARCHETYPES = {
  'The Disciplined Sniper': {
    emoji: '🎯',
    desc: 'You wait for perfect setups, execute with precision, and rarely deviate from your plan. You are the rarest trader type.',
    strengths: ['Excellent patience','Strong rule adherence','Low overtrading tendency'],
    weaknesses: ['May miss good-enough setups','Can be too rigid when market evolves'],
    advice: 'Your edge is your discipline. Focus on expanding your setup repertoire without sacrificing quality.',
    color: 'var(--green)'
  },
  'The Emotional Reactor': {
    emoji: '😤',
    desc: 'You have solid knowledge but emotions override your plan regularly. Revenge trading and FOMO are your biggest enemies.',
    strengths: ['High market awareness','Quick to spot opportunities'],
    weaknesses: ['Revenge trading','Moving stop losses','Overtrading after losses'],
    advice: 'Implement a mandatory 30-minute break after any loss. Your edge exists — you just need emotional guardrails.',
    color: 'var(--red)'
  },
  'The Systematic Analyst': {
    emoji: '🔬',
    desc: 'You love data, analysis, and understanding the "why". You overthink entries but when you act, it is usually well-reasoned.',
    strengths: ['Deep market understanding','Good risk awareness','Learns quickly from mistakes'],
    weaknesses: ['Analysis paralysis','Late entries','Misses momentum moves'],
    advice: 'Set a maximum analysis time: 5 minutes per setup. If you cannot decide in 5 minutes, skip the trade.',
    color: 'var(--blue)'
  },
  'The Impatient Hunter': {
    emoji: '⚡',
    desc: 'You have high energy and want action. You enter early, chase moves, and get frustrated waiting for setups to develop.',
    strengths: ['High motivation','Good at scalping when disciplined','Spotting emerging moves early'],
    weaknesses: ['Premature entry','Overtrading','Poor patience at key levels'],
    advice: 'Scalping may actually suit you — but only with strict session limits. Maximum 5 trades per session, hard stop.',
    color: 'var(--orange)'
  },
  'The Consistent Builder': {
    emoji: '🏗️',
    desc: 'You are methodical, improving steadily, and building good habits. You may not have found your edge yet but you are doing the right things.',
    strengths: ['Good journaling habits','Consistent process','Open to learning'],
    weaknesses: ['Still finding your strategy','Win rate inconsistent'],
    advice: 'Pick ONE strategy and trade only that for 3 months. Consistency in approach builds consistency in results.',
    color: 'var(--gold)'
  },
  'The Risk Taker': {
    emoji: '🎲',
    desc: 'You oversize positions, know the 1% rule but ignore it, and have blown accounts before. The market excites you more than it should.',
    strengths: ['High conviction entries','Not afraid to pull the trigger'],
    weaknesses: ['Position sizing','Stop loss placement','Account management'],
    advice: 'Reduce position size by 75% immediately. Prove you can grow an account slowly before scaling up.',
    color: 'var(--red)'
  },
  'The Fearful Hesitator': {
    emoji: '😰',
    desc: 'You know what to do but fear stops you from acting. You watch good setups pass, enter late, and take profits too early.',
    strengths: ['Careful with risk','Good at identifying setups','Rarely overtrades'],
    weaknesses: ['Late entries','Premature profit taking','Missed opportunities'],
    advice: 'Start with micro lots (0.01) to remove the emotional weight of money. Prove your strategy works, then scale.',
    color: 'var(--purple)'
  },
};

function calculateTraderDNA() {
  const journal = STATE.journal;
  const trades = STATE.simTrades;
  const progress = STATE.progress;

  if (journal.length < 3 && trades.length < 5) return null;

  const dna = {
    // Emotional scores
    revengeCount: 0, fomoCount: 0, fearCount: 0, greedCount: 0,
    // Behavioral patterns
    planFollowed: 0, planBroken: 0,
    // Performance patterns
    bestDay: null, worstDay: null, bestPair: null,
    bestSession: null, avgWinSize: 0, avgLossSize: 0,
    // Timing patterns
    earlyExits: 0, lateEntries: 0,
    // Risk patterns
    oversized: 0, undersized: 0,
    // Study habits
    lessonsComplete: Object.keys(progress).length,
    journalEntries: journal.length,
    streakDays: STATE.dailyStreak,
  };

  // Analyze journal entries
  journal.forEach(t => {
    const mood = t.mood || '';
    const plan = t.plan || '';
    const notes = (t.notes || '').toLowerCase();
    const pnl = parseFloat(t.pnl) || 0;
    const lots = parseFloat(t.lots) || 0.1;

    if (mood === 'revenge' || notes.includes('revenge') || notes.includes('angry')) dna.revengeCount++;
    if (mood === 'greedy' || notes.includes('fomo') || notes.includes('chased')) dna.fomoCount++;
    if (mood === 'fearful' || notes.includes('scared') || notes.includes('hesit')) dna.fearCount++;
    if (notes.includes('greed') || notes.includes('too early') || notes.includes('moved tp')) dna.greedCount++;
    if (plan === 'yes') dna.planFollowed++;
    if (plan === 'no') dna.planBroken++;
    if (lots > 0.5) dna.oversized++;
    if (notes.includes('too early') || notes.includes('premature')) dna.earlyExits++;
    if (notes.includes('too late') || notes.includes('chased') || notes.includes('missed')) dna.lateEntries++;
  });

  // Day of week analysis
  const dayPnL = {0:0,1:0,2:0,3:0,4:0,5:0,6:0};
  const dayCount = {0:0,1:0,2:0,3:0,4:0,5:0,6:0};
  [...journal, ...trades].forEach(t => {
    const day = new Date(t.date || t.time).getDay();
    if (!isNaN(day)) {
      dayPnL[day] += parseFloat(t.pnl) || 0;
      dayCount[day]++;
    }
  });
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let bestDayPnL = -Infinity, worstDayPnL = Infinity;
  for (let d = 0; d <= 6; d++) {
    if (dayCount[d] > 0) {
      const avg = dayPnL[d] / dayCount[d];
      if (avg > bestDayPnL) { bestDayPnL = avg; dna.bestDay = dayNames[d]; }
      if (avg < worstDayPnL) { worstDayPnL = avg; dna.worstDay = dayNames[d]; }
    }
  }

  // Pair analysis
  const pairPnL = {};
  [...journal, ...trades].forEach(t => {
    const pair = t.pair;
    if (!pair) return;
    if (!pairPnL[pair]) pairPnL[pair] = { pnl: 0, count: 0 };
    pairPnL[pair].pnl += parseFloat(t.pnl) || 0;
    pairPnL[pair].count++;
  });
  let bestPairPnL = -Infinity;
  Object.entries(pairPnL).forEach(([pair, d]) => {
    if (d.count >= 2 && d.pnl > bestPairPnL) { bestPairPnL = d.pnl; dna.bestPair = pair; }
  });

  // Win/loss sizes
  const wins = [...journal, ...trades].filter(t => parseFloat(t.pnl) > 0);
  const losses = [...journal, ...trades].filter(t => parseFloat(t.pnl) < 0);
  dna.avgWinSize = wins.length ? wins.reduce((a,t) => a + parseFloat(t.pnl), 0) / wins.length : 0;
  dna.avgLossSize = losses.length ? Math.abs(losses.reduce((a,t) => a + parseFloat(t.pnl), 0) / losses.length) : 0;
  dna.winRate = (wins.length + losses.length) > 0 ? Math.round(wins.length / (wins.length + losses.length) * 100) : 0;

  // Determine archetype
  const archetype = determineArchetype(dna);
  dna.archetype = archetype;
  dna.calculatedAt = new Date().toISOString();

  // Generate scores (0-100)
  dna.scores = {
    discipline: Math.max(0, Math.min(100, 70 + (dna.planFollowed - dna.planBroken) * 5 - dna.revengeCount * 10)),
    patience: Math.max(0, Math.min(100, 80 - dna.fomoCount * 15 - dna.lateEntries * 8)),
    riskManagement: Math.max(0, Math.min(100, 80 - dna.oversized * 10 + (dna.avgWinSize > dna.avgLossSize ? 20 : -10))),
    emotionalControl: Math.max(0, Math.min(100, 90 - dna.revengeCount * 15 - dna.fearCount * 8 - dna.greedCount * 10)),
    consistency: Math.max(0, Math.min(100, 60 + dna.journalEntries * 2 + dna.streakDays * 2)),
    knowledge: Math.max(0, Math.min(100, Math.round(dna.lessonsComplete / 40 * 100))),
  };

  return dna;
}

function determineArchetype(dna) {
  const total = dna.revengeCount + dna.fomoCount + dna.fearCount + dna.greedCount + dna.planBroken + dna.oversized;
  if (total === 0 && dna.planFollowed > 3) return 'The Disciplined Sniper';
  if (dna.revengeCount > 2 || dna.planBroken > dna.planFollowed) return 'The Emotional Reactor';
  if (dna.oversized > 3) return 'The Risk Taker';
  if (dna.fearCount > 3 || dna.earlyExits > 3) return 'The Fearful Hesitator';
  if (dna.fomoCount > 2 || dna.lateEntries > 3) return 'The Impatient Hunter';
  if (dna.journalEntries > 10 && dna.lessonsComplete > 15) return 'The Systematic Analyst';
  if (dna.journalEntries > 5 && dna.streakDays > 5) return 'The Consistent Builder';
  return 'The Consistent Builder';
}

function renderTraderDNA() {
  const dna = calculateTraderDNA();
  const hasEnoughData = STATE.journal.length >= 3 || STATE.simTrades.length >= 5;

  if (!hasEnoughData) {
    return `<div class="screen-pad">
      <div class="pg-header a-fadeup" style="padding:0 0 14px">
        <div style="display:flex;gap:10px;align-items:center">
          <button class="back-btn" onclick="navigate('profile')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
          <div><h1 class="pg-title">Trader DNA</h1><div style="font-size:12px;color:var(--txt2)">Your trading personality</div></div>
        </div>
      </div>
      <div style="text-align:center;padding:40px 20px">
        <div style="font-size:60px;margin-bottom:16px">🧬</div>
        <div style="font-family:var(--display);font-weight:800;font-size:20px;margin-bottom:10px">Not Enough Data Yet</div>
        <div style="font-size:14px;color:var(--txt2);line-height:1.6;margin-bottom:20px">Complete at least 5 sim trades or log 3 journal entries to unlock your Trader DNA profile.</div>
        <button class="btn btn-gold" onclick="navigate('trade')">Start Practice Trading</button>
      </div>
    </div>`;
  }

  const archetype = TRADER_ARCHETYPES[dna.archetype] || TRADER_ARCHETYPES['The Consistent Builder'];
  const scores = dna.scores;

  return `<div class="screen-pad">
    <div class="pg-header a-fadeup" style="padding:0 0 14px">
      <div style="display:flex;gap:10px;align-items:center">
        <button class="back-btn" onclick="navigate('profile')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div><h1 class="pg-title">Trader DNA</h1><div style="font-size:12px;color:var(--txt2)">Updated ${fmtDate(dna.calculatedAt)}</div></div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="showDNAHistory()">📊 History</button>
    </div>

    <!-- Archetype Card -->
    <div class="card a-fadeup2" style="padding:20px;margin-bottom:14px;background:linear-gradient(135deg,${archetype.color}15,${archetype.color}05);border-color:${archetype.color}44;text-align:center">
      <div style="font-size:64px;margin-bottom:8px">${archetype.emoji}</div>
      <div style="font-family:var(--display);font-weight:800;font-size:22px;color:${archetype.color};margin-bottom:8px">${dna.archetype}</div>
      <div style="font-size:13px;color:var(--txt2);line-height:1.65;margin-bottom:14px">${archetype.desc}</div>
      <div class="card" style="padding:12px;background:${archetype.color}15;border-color:${archetype.color}33">
        <div style="font-size:11px;font-weight:700;font-family:var(--display);color:${archetype.color};letter-spacing:1px;margin-bottom:6px">🎯 YOUR MENTOR SAYS</div>
        <div style="font-size:13px;color:var(--txt2);line-height:1.6;font-style:italic">"${archetype.advice}"</div>
      </div>
    </div>

    <!-- Skill Radar -->
    <div class="section-lbl a-fadeup3">Skill Assessment</div>
    <div class="card a-fadeup3" style="padding:16px;margin-bottom:14px">
      ${Object.entries(scores).map(([skill, score]) => {
        const icons = {discipline:'🎯',patience:'⏳',riskManagement:'🛡️',emotionalControl:'🧠',consistency:'🔥',knowledge:'📚'};
        const labels = {discipline:'Discipline',patience:'Patience',riskManagement:'Risk Mgmt',emotionalControl:'Emotional Control',consistency:'Consistency',knowledge:'Knowledge'};
        const col = score >= 70 ? 'var(--green)' : score >= 40 ? 'var(--gold)' : 'var(--red)';
        return `<div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
            <span style="font-size:13px;font-weight:600">${icons[skill]} ${labels[skill]}</span>
            <span style="font-family:var(--mono);font-size:13px;color:${col}">${score}/100</span>
          </div>
          <div class="prog-bar"><div class="prog-fill" style="width:${score}%;background:${col}"></div></div>
        </div>`;
      }).join('')}
    </div>

    <!-- Strengths & Weaknesses -->
    <div class="inp-row a-fadeup4" style="margin-bottom:14px">
      <div class="card card-green" style="padding:14px">
        <div style="font-size:11px;font-weight:700;font-family:var(--display);color:var(--green);letter-spacing:1px;margin-bottom:8px">✅ STRENGTHS</div>
        ${archetype.strengths.map(s => `<div style="font-size:12px;color:var(--txt2);padding:3px 0">• ${s}</div>`).join('')}
      </div>
      <div class="card card-red" style="padding:14px">
        <div style="font-size:11px;font-weight:700;font-family:var(--display);color:var(--red);letter-spacing:1px;margin-bottom:8px">⚠️ WATCH OUT</div>
        ${archetype.weaknesses.map(w => `<div style="font-size:12px;color:var(--txt2);padding:3px 0">• ${w}</div>`).join('')}
      </div>
    </div>

    <!-- Behavioral Patterns -->
    <div class="section-lbl a-fadeup4">Detected Patterns</div>
    <div class="card a-fadeup4" style="padding:14px;margin-bottom:14px">
      ${dna.revengeCount > 0 ? `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr2)"><span style="font-size:13px">😤 Revenge trades detected</span><span class="pill pill-red">${dna.revengeCount}x</span></div>` : ''}
      ${dna.fomoCount > 0 ? `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr2)"><span style="font-size:13px">🏃 FOMO entries detected</span><span class="pill pill-orange">${dna.fomoCount}x</span></div>` : ''}
      ${dna.planBroken > 0 ? `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr2)"><span style="font-size:13px">❌ Plan deviations</span><span class="pill pill-red">${dna.planBroken}x</span></div>` : ''}
      ${dna.planFollowed > 0 ? `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr2)"><span style="font-size:13px">✅ Plan followed</span><span class="pill pill-green">${dna.planFollowed}x</span></div>` : ''}
      ${dna.bestDay ? `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr2)"><span style="font-size:13px">📅 Best trading day</span><span class="pill pill-gold">${dna.bestDay}</span></div>` : ''}
      ${dna.worstDay ? `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr2)"><span style="font-size:13px">📅 Worst trading day</span><span class="pill pill-red">${dna.worstDay}</span></div>` : ''}
      ${dna.bestPair ? `<div style="display:flex;justify-content:space-between;padding:8px 0"><span style="font-size:13px">💱 Best performing pair</span><span class="pill pill-green">${dna.bestPair}</span></div>` : ''}
      ${!dna.revengeCount && !dna.fomoCount && !dna.planBroken ? `<div style="text-align:center;padding:20px;color:var(--txt3)">Not enough data yet — keep journaling!</div>` : ''}
    </div>

    <!-- Win/Loss ratio -->
    <div class="section-lbl a-fadeup5">Performance Summary</div>
    <div class="stat-grid a-fadeup5" style="margin-bottom:14px">
      <div class="stat-box"><div class="stat-val">${dna.winRate}%</div><div class="stat-lbl">Win Rate</div></div>
      <div class="stat-box"><div class="stat-val" style="color:var(--green)">$${dna.avgWinSize.toFixed(0)}</div><div class="stat-lbl">Avg Win</div></div>
      <div class="stat-box"><div class="stat-val" style="color:var(--red)">$${dna.avgLossSize.toFixed(0)}</div><div class="stat-lbl">Avg Loss</div></div>
      <div class="stat-box"><div class="stat-val" style="color:${dna.avgWinSize > dna.avgLossSize ? 'var(--green)' : 'var(--red)'}">
        ${dna.avgLossSize > 0 ? (dna.avgWinSize / dna.avgLossSize).toFixed(2) : '—'}
      </div><div class="stat-lbl">W/L Ratio</div></div>
    </div>

    <div class="card a-fadeup5" style="padding:14px;background:var(--gold-bg);border-color:var(--bdr)">
      <div style="font-size:11px;font-weight:700;font-family:var(--display);color:var(--gold);letter-spacing:1px;margin-bottom:6px">💡 PERSONALIZED ACTION PLAN</div>
      <div style="font-size:13px;color:var(--txt2);line-height:1.65">${generateActionPlan(dna)}</div>
    </div>
  </div>`;
}

function generateActionPlan(dna) {
  const plans = [];
  if (dna.revengeCount > 1) plans.push('🛑 Implement a hard stop after 2 consecutive losses. Close the app and return tomorrow.');
  if (dna.fomoCount > 1) plans.push('⏰ Only enter trades that were identified BEFORE the candle opened. No chasing.');
  if (dna.planBroken > dna.planFollowed) plans.push('📋 Write your plan on paper before each session. Physical commitment reduces deviations.');
  if (dna.oversized > 2) plans.push('📐 Drop to 0.01 lots for the next 30 trades. Prove the process, then scale up.');
  if (dna.bestDay) plans.push(`📅 Trade MORE on ${dna.bestDay}s — your data shows this is your best day.`);
  if (dna.worstDay) plans.push(`🚫 Consider skipping ${dna.worstDay}s entirely — your worst performing day.`);
  if (dna.bestPair) plans.push(`💱 Specialize in ${dna.bestPair} — your data shows strongest performance here.`);
  if (plans.length === 0) plans.push('Keep building your data. The more trades and journal entries you log, the more precise your DNA profile becomes.');
  return plans.join('<br><br>');
}

/* ══════════════════════════════════════
   2. TRADE FORENSICS ENGINE
   ══════════════════════════════════════ */

function renderForensics() {
  return `<div class="screen-pad">
    <div class="pg-header a-fadeup" style="padding:0 0 14px">
      <div style="display:flex;gap:10px;align-items:center">
        <button class="back-btn" onclick="navigate('journal')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div><h1 class="pg-title">Trade Forensics</h1><div style="font-size:12px;color:var(--txt2)">Post-trade autopsy</div></div>
      </div>
    </div>

    ${STATE.journal.length === 0 ? `
      <div style="text-align:center;padding:50px 20px">
        <div style="font-size:60px;margin-bottom:16px">🔬</div>
        <div style="font-family:var(--display);font-weight:800;font-size:18px;margin-bottom:10px">No Trades to Analyse</div>
        <div style="font-size:13px;color:var(--txt2);margin-bottom:20px">Log trades in your journal to get detailed forensic analysis.</div>
        <button class="btn btn-gold" onclick="navigate('journal')">Go to Journal</button>
      </div>
    ` : `
      <div class="section-lbl">Select a trade to analyse</div>
      ${STATE.journal.slice().reverse().slice(0,15).map((t, i) => {
        const pnl = parseFloat(t.pnl) || 0;
        const idx = STATE.journal.length - 1 - i;
        return `<div class="card card-tappable" style="padding:12px;margin-bottom:8px" onclick="showForensicReport(${idx})">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong style="font-family:var(--display)">${t.pair}</strong>
              <span class="pill ${t.direction==='BUY'?'pill-green':'pill-red'}" style="margin-left:6px;font-size:9px">${t.direction}</span>
            </div>
            <div style="text-align:right">
              <div class="t-mono" style="color:${pnl>=0?'var(--green)':'var(--red)'}">${pnl>=0?'+':''}$${Math.abs(pnl).toFixed(2)}</div>
              <div style="font-size:10px;color:var(--txt3)">${fmtDate(t.date)} · Tap to analyse</div>
            </div>
          </div>
        </div>`;
      }).join('')}
    `}
  </div>`;
}

function showForensicReport(idx) {
  const t = STATE.journal[idx];
  if (!t) return;
  const pnl = parseFloat(t.pnl) || 0;
  const lots = parseFloat(t.lots) || 0.1;

  // Score each dimension
  const scores = scoreForensics(t);
  const overall = Math.round(Object.values(scores).reduce((a,b) => a+b, 0) / Object.keys(scores).length);
  const grade = overall >= 80 ? 'A' : overall >= 65 ? 'B' : overall >= 50 ? 'C' : overall >= 35 ? 'D' : 'F';
  const gradeColor = overall >= 80 ? 'var(--green)' : overall >= 65 ? 'var(--blue)' : overall >= 50 ? 'var(--gold)' : overall >= 35 ? 'var(--orange)' : 'var(--red)';

  const issues = detectIssues(t);

  showModal(`<div class="modal-handle"></div>
    <div style="text-align:center;margin-bottom:16px">
      <div style="font-family:var(--display);font-weight:800;font-size:18px">${t.pair} ${t.direction} — Autopsy</div>
      <div style="font-size:12px;color:var(--txt3)">${fmtDate(t.date)}</div>
      <div style="margin-top:12px;width:72px;height:72px;border-radius:50%;background:${gradeColor}22;border:3px solid ${gradeColor};display:flex;flex-direction:column;align-items:center;justify-content:center;margin:12px auto">
        <div style="font-family:var(--display);font-weight:800;font-size:28px;color:${gradeColor}">${grade}</div>
        <div style="font-size:10px;color:var(--txt3)">${overall}/100</div>
      </div>
    </div>

    <div class="section-lbl">Dimension Scores</div>
    ${Object.entries(scores).map(([dim, score]) => {
      const labels = {setup:'Setup Quality',entry:'Entry Timing',riskMgmt:'Risk Management',exit:'Exit Quality'};
      const col = score >= 70 ? 'var(--green)' : score >= 40 ? 'var(--gold)' : 'var(--red)';
      return `<div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:12px;font-weight:600">${labels[dim]}</span>
          <span style="font-size:12px;color:${col};font-family:var(--mono)">${score}/100</span>
        </div>
        <div class="prog-bar"><div class="prog-fill" style="width:${score}%;background:${col}"></div></div>
      </div>`;
    }).join('')}

    ${issues.length > 0 ? `
    <div class="section-lbl" style="margin-top:14px">Issues Detected</div>
    ${issues.map(issue => `<div class="card" style="padding:10px;margin-bottom:6px;background:var(--red-bg);border-color:var(--red-bdr)">
      <div style="font-size:12px;color:var(--txt2);line-height:1.5">⚠️ ${issue}</div>
    </div>`).join('')}` : `
    <div class="card" style="padding:12px;background:var(--green-bg);border-color:var(--green-bdr);margin-top:14px">
      <div style="font-size:13px;color:var(--green)">✅ No major issues detected in this trade</div>
    </div>`}

    <div class="section-lbl" style="margin-top:14px">Improvement Tips</div>
    <div class="card card-gold" style="padding:12px">
      <div style="font-size:13px;color:var(--txt2);line-height:1.65">${generateForensicTip(t, scores)}</div>
    </div>
    <button class="btn btn-gold" style="margin-top:16px" onclick="closeModal()">Got it</button>
  `);
}

function scoreForensics(t) {
  const pnl = parseFloat(t.pnl) || 0;
  const plan = t.plan || 'mostly';
  const mood = t.mood || 'neutral';
  const notes = (t.notes || '').toLowerCase();
  const lots = parseFloat(t.lots) || 0.1;

  return {
    setup: calcSetupScore(t, notes, plan),
    entry: calcEntryScore(t, notes, mood),
    riskMgmt: calcRiskScore(t, lots),
    exit: calcExitScore(t, pnl, notes),
  };
}

function calcSetupScore(t, notes, plan) {
  let score = 60;
  if (plan === 'yes') score += 20;
  if (plan === 'no') score -= 25;
  if (t.setup && t.setup !== '') score += 15;
  if (notes.includes('confluence') || notes.includes('multiple')) score += 10;
  if (notes.includes('random') || notes.includes('no setup') || notes.includes('bored')) score -= 30;
  if (notes.includes('strong') || notes.includes('perfect') || notes.includes('clean')) score += 10;
  return Math.max(0, Math.min(100, score));
}

function calcEntryScore(t, notes, mood) {
  let score = 65;
  if (mood === 'neutral' || mood === 'confident') score += 15;
  if (mood === 'revenge' || mood === 'frustrated') score -= 30;
  if (mood === 'fearful') score -= 10;
  if (notes.includes('waited') || notes.includes('patient')) score += 15;
  if (notes.includes('chased') || notes.includes('too early') || notes.includes('late')) score -= 25;
  if (notes.includes('confirmation')) score += 10;
  return Math.max(0, Math.min(100, score));
}

function calcRiskScore(t, lots) {
  let score = 70;
  if (lots > 1.0) score -= 30;
  if (lots > 0.5) score -= 15;
  if (lots <= 0.1) score += 15;
  const notes = (t.notes || '').toLowerCase();
  if (notes.includes('moved stop') || notes.includes('widened sl')) score -= 25;
  if (notes.includes('1%') || notes.includes('risk managed') || notes.includes('sized correctly')) score += 15;
  return Math.max(0, Math.min(100, score));
}

function calcExitScore(t, pnl, notes) {
  let score = 65;
  if (pnl > 0 && notes.includes('target')) score += 20;
  if (notes.includes('too early') || notes.includes('closed early') || notes.includes('cut short')) score -= 20;
  if (notes.includes('moved tp') || notes.includes('greedy')) score -= 15;
  if (notes.includes('stop loss') && pnl < 0) score += 20; // respected SL
  if (notes.includes('held') && pnl > 0) score += 10;
  if (notes.includes('panic') || notes.includes('scared out')) score -= 20;
  return Math.max(0, Math.min(100, score));
}

function detectIssues(t) {
  const issues = [];
  const notes = (t.notes || '').toLowerCase();
  const mood = t.mood || '';
  const plan = t.plan || '';
  const lots = parseFloat(t.lots) || 0.1;

  if (mood === 'revenge') issues.push('Revenge trade detected. Trading from an emotional state significantly lowers win probability.');
  if (mood === 'frustrated') issues.push('Frustration was noted. Emotional states like this lead to rule-breaking and poor judgment.');
  if (plan === 'no') issues.push('Trading plan was not followed. Every deviation from your plan is a roll of the dice, not a trade.');
  if (lots > 0.5) issues.push(`Position size of ${lots} lots may be oversized. Ensure this represents no more than 1-2% of your account.`);
  if (notes.includes('moved stop') || notes.includes('widened')) issues.push('Stop loss was moved wider. This is one of the most dangerous habits — it turns small losses into large ones.');
  if (notes.includes('fomo') || notes.includes('chased')) issues.push('FOMO entry detected. Chasing price after the move has started means entering at the worst risk:reward point.');
  if (notes.includes('revenge')) issues.push('Notes indicate revenge motivation. Mandatory break rule should have been applied here.');
  if (notes.includes('no setup') || notes.includes('bored')) issues.push('Trade was taken without a clear setup. Boredom is not a trading signal.');

  return issues;
}

function generateForensicTip(t, scores) {
  const lowest = Object.entries(scores).sort((a,b) => a[1]-b[1])[0];
  const tips = {
    setup: 'Your setup quality needs work. Before entering any trade, write down: (1) What is the setup? (2) Where is confirmation? (3) Why does this setup have edge? If you cannot answer all three, skip the trade.',
    entry: 'Entry timing is your weakness. Use pending limit orders placed at your level BEFORE price arrives. This removes emotion from the entry completely.',
    riskMgmt: 'Risk management scored poorly. Every trade, before touching the lot size field, calculate: Account × 1% ÷ (SL pips × pip value) = exact lot size. Use the calculator.',
    exit: 'Exit quality is bringing down your performance. Set your TP when you are calm and BEFORE entering the trade. Then do not touch it. Your pre-trade self is smarter than your in-trade self.'
  };
  return tips[lowest[0]] || 'Overall solid trade. Keep logging and look for patterns in your best trades to replicate them.';
}

/* ══════════════════════════════════════
   3. CURRICULUM PATHS SYSTEM
   ══════════════════════════════════════ */

const CURRICULUM_PATHS = {
  scalper: {
    id: 'scalper',
    name: 'Scalper Path',
    emoji: '⚡',
    desc: 'Fast trades, tight stops, 5-15 pip targets. For traders with 4+ hours daily.',
    color: 'var(--red)',
    requirements: { schedule: 'fullday', experience: ['demo-traded','live-trader'] },
    lessonOrder: ['what-is-forex','currency-pairs','pips-lots','order-types','session-overview','candlestick-basics','support-resistance','the-1percent-rule','risk-reward','emotions-trading','discipline-rules','key-calculations'],
    milestones: [
      { at: 3, message: 'Master session timing before scalping — your window is 13:00-17:00 UTC only.' },
      { at: 6, message: 'Scalping requires ECN broker with raw spreads. Regular brokers kill scalping edge.' },
      { at: 10, message: 'Ready to study the 5-Minute Scalping strategy. Max 5 trades per session, hard limit.' },
    ]
  },
  swing: {
    id: 'swing',
    name: 'Swing Trader Path',
    emoji: '〰️',
    desc: 'H4/D1 focus. Hold trades 1-5 days. Perfect for those with limited daily time.',
    color: 'var(--blue)',
    requirements: { schedule: ['15min','1hour'], experience: ['complete-beginner','some-knowledge','demo-traded'] },
    lessonOrder: ['what-is-forex','currency-pairs','pips-lots','leverage-margin','order-types','candlestick-basics','support-resistance','trend-analysis','moving-averages','the-1percent-rule','risk-reward','drawdown-recovery','economic-calendar','central-banks','discipline-rules','chart-patterns'],
    milestones: [
      { at: 4, message: 'Swing trading requires patience. You will check charts once daily, not every minute.' },
      { at: 8, message: 'Fundamental analysis matters more for swing trades. Study the economic calendar carefully.' },
      { at: 12, message: 'You are ready for the S&R Bounce and EMA Pullback strategies on H4/D1.' },
    ]
  },
  smc: {
    id: 'smc',
    name: 'SMC / Institutional Path',
    emoji: '🏛️',
    desc: 'Smart Money Concepts. Trade with the banks. Advanced framework.',
    color: 'var(--cyan)',
    requirements: { experience: ['demo-traded','live-trader'] },
    lessonOrder: ['what-is-forex','currency-pairs','candlestick-basics','support-resistance','trend-analysis','chart-patterns','smc-intro','liquidity-hunting','the-1percent-rule','risk-reward','emotions-trading','discipline-rules','market-microstructure'],
    milestones: [
      { at: 4, message: 'SMC requires you to think like an institution. Study who is on the OTHER side of your trade.' },
      { at: 8, message: 'CHOCH and Order Blocks are your foundation. Master these before moving to FVG.' },
      { at: 12, message: 'SMC warning: it is heavily popularised. Banks adapt when retail catches on. Always add confluence.' },
    ]
  },
  psychology: {
    id: 'psychology',
    name: 'Psychology-First Path',
    emoji: '🧠',
    desc: 'For traders who keep blowing accounts emotionally. Fix the root cause first.',
    color: 'var(--purple)',
    requirements: { riskStyle: 'aggressive' },
    lessonOrder: ['emotions-trading','discipline-rules','trading-mindset','the-1percent-rule','drawdown-recovery','risk-reward','what-is-forex','currency-pairs','pips-lots','candlestick-basics','support-resistance','why-journal'],
    milestones: [
      { at: 2, message: 'No strategy works without emotional control. This path rebuilds your foundation.' },
      { at: 5, message: 'Have you implemented the 2-loss rule yet? Stop after 2 consecutive losses, every session.' },
      { at: 8, message: 'You are ready for strategy study. Your edge now is psychological — protect it.' },
    ]
  },
};

function getAssignedPath() {
  const u = STATE.user;
  // Check if manually assigned
  if (STATE.assignedPath) return STATE.assignedPath;

  // Auto-assign based on profile
  if (u.riskStyle === 'aggressive' || (STATE.journal.length > 3 && STATE.journal.filter(t => t.mood === 'revenge').length > 2)) {
    return 'psychology';
  }
  if (u.schedule === 'fullday' && ['demo-traded','live-trader'].includes(u.experience)) {
    return 'scalper';
  }
  if (['demo-traded','live-trader'].includes(u.experience) && u.learningStyle === 'analytical') {
    return 'smc';
  }
  return 'swing'; // Default
}

function renderMyPath() {
  const pathId = getAssignedPath();
  const path = CURRICULUM_PATHS[pathId];
  const completed = path.lessonOrder.filter(id => STATE.progress[id]).length;
  const pct = Math.round(completed / path.lessonOrder.length * 100);
  const nextLesson = path.lessonOrder.find(id => !STATE.progress[id]);
  const currentMilestone = path.milestones.filter(m => completed >= m.at).pop();

  return `<div class="screen-pad">
    <div class="pg-header a-fadeup" style="padding:0 0 14px">
      <div style="display:flex;gap:10px;align-items:center">
        <button class="back-btn" onclick="navigate('learn')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div><h1 class="pg-title">My Path</h1><div style="font-size:12px;color:var(--txt2)">Personalized curriculum</div></div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="showPathSelector()">Change Path</button>
    </div>

    <!-- Current Path Card -->
    <div class="card a-fadeup2" style="padding:18px;margin-bottom:14px;background:${path.color}12;border-color:${path.color}44">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <div style="font-size:44px">${path.emoji}</div>
        <div>
          <div style="font-family:var(--display);font-weight:800;font-size:18px;color:${path.color}">${path.name}</div>
          <div style="font-size:12px;color:var(--txt2);margin-top:3px">${path.desc}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:12px;color:var(--txt2)">${completed}/${path.lessonOrder.length} lessons</span>
        <span style="font-size:12px;color:${path.color};font-family:var(--mono)">${pct}%</span>
      </div>
      <div class="prog-bar lg"><div class="prog-fill" style="width:${pct}%;background:${path.color}"></div></div>
    </div>

    ${currentMilestone ? `
    <div class="card a-fadeup3" style="padding:14px;margin-bottom:14px;background:var(--gold-bg);border-color:var(--bdr)">
      <div style="font-size:11px;font-weight:700;font-family:var(--display);color:var(--gold);letter-spacing:1px;margin-bottom:6px">🗺️ PATH INSIGHT</div>
      <div style="font-size:13px;color:var(--txt2);line-height:1.6;font-style:italic">"${currentMilestone.message}"</div>
    </div>` : ''}

    ${nextLesson ? `
    <div class="section-lbl a-fadeup3">Up Next on Your Path</div>
    <div class="card card-gold card-tappable a-fadeup3" onclick="openLesson('${nextLesson}')" style="padding:14px;margin-bottom:14px">
      ${(() => { const found = getLessonById(nextLesson); return found ? `
        <div style="display:flex;align-items:center;gap:12px">
          <div style="font-size:30px">${found.lesson.emoji}</div>
          <div>
            <div style="font-family:var(--display);font-weight:700;font-size:15px">${found.lesson.title}</div>
            <div style="font-size:11px;color:var(--txt2)">⏱ ${found.lesson.mins} min · +${found.lesson.xp||50} XP</div>
          </div>
          <div style="margin-left:auto;color:var(--gold);font-size:20px">→</div>
        </div>` : '<div>Next lesson</div>'; })()}
    </div>` : `
    <div class="card card-gold a-fadeup3" style="padding:14px;margin-bottom:14px;text-align:center">
      <div style="font-size:32px">🏆</div>
      <div style="font-family:var(--display);font-weight:800;margin-top:8px">Path Complete!</div>
      <div style="font-size:13px;color:var(--txt2);margin-top:4px">You've completed the ${path.name}. Consider switching paths to broaden your knowledge.</div>
    </div>`}

    <div class="section-lbl a-fadeup4">All Lessons on This Path</div>
    ${path.lessonOrder.map((id, i) => {
      const found = getLessonById(id);
      if (!found) return '';
      const l = found.lesson;
      const done = STATE.progress[id];
      const isCurrent = !done && path.lessonOrder.slice(0,i).every(lid => STATE.progress[lid]);
      return `<div class="lesson-card ${done?'done':isCurrent?'current':''}" onclick="openLesson('${id}')">
        <div class="lesson-icon">${l.emoji}</div>
        <div class="lesson-meta">
          <div class="lesson-title">${l.title}</div>
          <div class="lesson-sub">Step ${i+1} · ${l.mins} min</div>
        </div>
        <div class="lesson-check ${done?'done':''}">
          ${done?'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>':''}
        </div>
      </div>`;
    }).join('')}

    <!-- Other paths -->
    <div class="section-lbl" style="margin-top:20px">Other Paths</div>
    ${Object.values(CURRICULUM_PATHS).filter(p => p.id !== pathId).map(p => `
      <div class="card card-tappable" style="padding:14px;margin-bottom:8px;display:flex;align-items:center;gap:12px" onclick="if(confirm('Switch to ${p.name}?')){STATE.assignedPath='${p.id}';saveState();renderScreen('mypath')}">
        <span style="font-size:28px">${p.emoji}</span>
        <div style="flex:1">
          <div style="font-family:var(--display);font-weight:700;font-size:14px;color:${p.color}">${p.name}</div>
          <div style="font-size:12px;color:var(--txt2);margin-top:2px">${p.desc}</div>
        </div>
        <span style="color:var(--txt3)">→</span>
      </div>
    `).join('')}
  </div>`;
}

/* ══════════════════════════════════════
   4. CHALLENGE SYSTEM
   ══════════════════════════════════════ */

const CHALLENGES = [
  { id:'c001', title:'Risk Disciplinarian', desc:'Complete 10 sim trades without ANY exceeding 1% risk', emoji:'🛡️', type:'process', target:10, metric:'risk1pct', xp:200, badge:'risk-disciplinarian' },
  { id:'c002', title:'Plan Follower', desc:'Log 5 journal entries all marked "Plan Followed"', emoji:'📋', type:'journal', target:5, metric:'planFollowed', xp:150, badge:'plan-follower' },
  { id:'c003', title:'R:R Master', desc:'Take 10 trades with minimum 1:2 R:R', emoji:'⚖️', type:'process', target:10, metric:'rr2', xp:175, badge:'rr-master' },
  { id:'c004', title:'Emotional Rock', desc:'Log 7 trades with "Calm/Neutral" mood', emoji:'🧘', type:'mood', target:7, metric:'calmMood', xp:200, badge:'emotional-rock' },
  { id:'c005', title:'The Learner', desc:'Complete 15 lessons in the academy', emoji:'📚', type:'learning', target:15, metric:'lessons', xp:300, badge:'the-learner' },
  { id:'c006', title:'Journal Warrior', desc:'Log 20 journal entries', emoji:'✍️', type:'journal', target:20, metric:'journalCount', xp:250, badge:'journal-warrior' },
  { id:'c007', title:'Streak Legend', desc:'Maintain a 14-day learning streak', emoji:'🔥', type:'streak', target:14, metric:'streak', xp:400, badge:'streak-legend' },
  { id:'c008', title:'No Revenge Month', desc:'Complete 30 days without a revenge trade entry', emoji:'🕊️', type:'behavior', target:30, metric:'noRevenge', xp:500, badge:'no-revenge' },
  { id:'c009', title:'Flashcard Master', desc:'Study 30 different flashcards', emoji:'🃏', type:'learning', target:30, metric:'flashcards', xp:200, badge:'flashcard-master' },
  { id:'c010', title:'Pattern Expert', desc:'Correctly identify 25 patterns in the pattern game', emoji:'🎯', type:'learning', target:25, metric:'patterns', xp:250, badge:'pattern-expert' },
  { id:'c011', title:'Sim Profitable', desc:'Grow your sim account to $11,000 (+10%)', emoji:'💰', type:'performance', target:11000, metric:'equity', xp:300, badge:'sim-profitable' },
  { id:'c012', title:'The Specialist', desc:'Complete one full curriculum path (all lessons)', emoji:'🏆', type:'learning', target:1, metric:'pathComplete', xp:500, badge:'specialist' },
];

function getChallengeProgress(c) {
  const j = STATE.journal;
  const s = STATE.simTrades;
  switch(c.metric) {
    case 'risk1pct': return s.filter(t => (Math.abs(t.pnl)/10000*100) <= 1).length;
    case 'planFollowed': return j.filter(t => t.plan === 'yes').length;
    case 'rr2': return j.filter(t => { const entry = parseFloat(t.entry)||0; const exit = parseFloat(t.exit)||0; const sl = Math.abs(exit-entry); return sl > 0; }).length;
    case 'calmMood': return j.filter(t => t.mood === 'neutral' || t.mood === 'confident').length;
    case 'lessons': return Object.keys(STATE.progress).length;
    case 'journalCount': return j.length;
    case 'streak': return STATE.dailyStreak;
    case 'noRevenge': return j.filter(t => t.mood !== 'revenge').length;
    case 'flashcards': return Object.keys(STATE.flashProgress).length;
    case 'patterns': return STATE.patternScore.correct;
    case 'equity': return STATE.simEquity;
    case 'pathComplete': {
      const path = CURRICULUM_PATHS[getAssignedPath()];
      return path && path.lessonOrder.every(id => STATE.progress[id]) ? 1 : 0;
    }
    default: return 0;
  }
}

function renderChallenges() {
  const active = CHALLENGES.filter(c => {
    const prog = getChallengeProgress(c);
    return prog < c.target;
  });
  const completed = CHALLENGES.filter(c => getChallengeProgress(c) >= c.target);

  return `<div class="screen-pad">
    <div class="pg-header a-fadeup" style="padding:0 0 14px">
      <div style="display:flex;gap:10px;align-items:center">
        <button class="back-btn" onclick="navigate('profile')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div><h1 class="pg-title">Challenges</h1><div style="font-size:12px;color:var(--txt2)">${completed.length}/${CHALLENGES.length} complete</div></div>
      </div>
    </div>

    <div class="stat-grid a-fadeup2" style="margin-bottom:14px">
      <div class="stat-box"><div class="stat-val" style="color:var(--green)">${completed.length}</div><div class="stat-lbl">Completed</div></div>
      <div class="stat-box"><div class="stat-val">${active.length}</div><div class="stat-lbl">Active</div></div>
      <div class="stat-box"><div class="stat-val" style="color:var(--gold)">${completed.reduce((a,c)=>a+c.xp,0)}</div><div class="stat-lbl">XP Earned</div></div>
      <div class="stat-box"><div class="stat-val">${Math.round(completed.length/CHALLENGES.length*100)}%</div><div class="stat-lbl">Done</div></div>
    </div>

    <div class="section-lbl a-fadeup3">Active Challenges</div>
    ${active.map((c,i) => {
      const prog = getChallengeProgress(c);
      const pct = Math.min(100, Math.round(prog / c.target * 100));
      return `<div class="card a-fadeup" style="animation-delay:${i*.04}s;padding:14px;margin-bottom:10px">
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px">
          <div style="font-size:32px;flex-shrink:0">${c.emoji}</div>
          <div style="flex:1">
            <div style="font-family:var(--display);font-weight:700;font-size:14px">${c.title}</div>
            <div style="font-size:12px;color:var(--txt2);margin-top:3px">${c.desc}</div>
          </div>
          <span class="pill pill-gold" style="font-size:9px;flex-shrink:0">+${c.xp} XP</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:11px;color:var(--txt2)">
          <span>${prog} / ${c.target}</span>
          <span>${pct}%</span>
        </div>
        <div class="prog-bar"><div class="prog-fill" style="width:${pct}%"></div></div>
      </div>`;
    }).join('')}

    ${completed.length > 0 ? `
    <div class="section-lbl" style="margin-top:8px">Completed</div>
    ${completed.map(c => `
      <div class="card" style="padding:12px;margin-bottom:8px;background:var(--green-bg);border-color:var(--green-bdr);opacity:.85">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:24px">${c.emoji}</span>
          <div style="flex:1">
            <div style="font-family:var(--display);font-weight:700;font-size:13px">${c.title}</div>
            <div style="font-size:11px;color:var(--green)">✓ Completed · +${c.xp} XP earned</div>
          </div>
        </div>
      </div>`).join('')}` : ''}
  </div>`;
}

/* ══════════════════════════════════════
   5. SHOULD I TRADE TODAY?
   ══════════════════════════════════════ */

function renderShouldITrade() {
  const questions = [
    { id:'q1', text:'Did I sleep at least 6 hours last night?', yes:1, no:-2 },
    { id:'q2', text:'Am I in a calm, neutral emotional state right now?', yes:1, no:-3 },
    { id:'q3', text:'Do I have a clear market analysis prepared?', yes:1, no:-1 },
    { id:'q4', text:'Is there no high-impact news in the next 2 hours? (or I have a strategy for it)', yes:1, no:-1 },
    { id:'q5', text:'Have I reviewed my last 3 trades this week?', yes:1, no:-1 },
    { id:'q6', text:'I am NOT currently trying to "make back" losses from a recent bad session', yes:2, no:-4 },
    { id:'q7', text:'My current trade idea has a clear stop loss and target BEFORE I enter', yes:2, no:-2 },
    { id:'q8', text:'I am not feeling bored, restless, or desperate for action', yes:1, no:-2 },
    { id:'q9', text:'I am within my weekly drawdown limit (less than 5% down this week)', yes:1, no:-3 },
    { id:'q10', text:'I have at least 1 hour of uninterrupted time available', yes:1, no:-2 },
  ];

  const answers = STATE.todayTradeCheck || {};
  const allAnswered = questions.every(q => answers[q.id] !== undefined);
  let score = 0;
  if (allAnswered) {
    questions.forEach(q => { score += answers[q.id] ? q.yes : q.no; });
  }

  const verdict = score >= 8 ? { text:'✅ Green Light — Trade Today', color:'var(--green)', msg:'All indicators look good. Trade your plan with discipline.' }
    : score >= 3 ? { text:'🟡 Proceed with Caution', color:'var(--gold)', msg:'Some concerns noted. Reduce position size by 50% and take only A+ setups.' }
    : { text:'🔴 Do Not Trade Today', color:'var(--red)', msg:'Multiple risk factors detected. Your edge disappears under these conditions. Rest and return tomorrow.' };

  return `<div class="screen-pad">
    <div class="pg-header a-fadeup" style="padding:0 0 14px">
      <div style="display:flex;gap:10px;align-items:center">
        <button class="back-btn" onclick="navigate('home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div><h1 class="pg-title">Should I Trade?</h1><div style="font-size:12px;color:var(--txt2)">Daily readiness check</div></div>
      </div>
    </div>

    ${allAnswered ? `
    <div class="card a-fadeup2" style="padding:20px;margin-bottom:16px;text-align:center;background:${verdict.color}15;border-color:${verdict.color}44">
      <div style="font-family:var(--display);font-weight:800;font-size:18px;color:${verdict.color};margin-bottom:8px">${verdict.text}</div>
      <div style="font-size:13px;color:var(--txt2);line-height:1.6">${verdict.msg}</div>
      <div style="font-family:var(--mono);font-size:24px;color:${verdict.color};margin-top:10px">Score: ${score > 0 ? '+' : ''}${score}</div>
      <button class="btn btn-ghost btn-sm" style="margin-top:12px" onclick="STATE.todayTradeCheck={};saveState();renderScreen('shoulditrade')">Retake</button>
    </div>` : ''}

    <div class="section-lbl a-fadeup3">Answer honestly — no one is watching</div>
    ${questions.map((q,i) => `
      <div class="card a-fadeup" style="animation-delay:${i*.03}s;padding:14px;margin-bottom:8px">
        <div style="font-size:13px;font-weight:600;margin-bottom:10px;line-height:1.5">${i+1}. ${q.text}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <button onclick="answers_sit('${q.id}',true)" style="padding:10px;border-radius:var(--rs);border:2px solid ${answers[q.id]===true?'var(--green)':'var(--bdr2)'};background:${answers[q.id]===true?'var(--green-bg)':'var(--bg4)'};color:${answers[q.id]===true?'var(--green)':'var(--txt2)'};font-family:var(--display);font-weight:700;font-size:13px;cursor:pointer;transition:all .15s">✓ Yes</button>
          <button onclick="answers_sit('${q.id}',false)" style="padding:10px;border-radius:var(--rs);border:2px solid ${answers[q.id]===false?'var(--red)':'var(--bdr2)'};background:${answers[q.id]===false?'var(--red-bg)':'var(--bg4)'};color:${answers[q.id]===false?'var(--red)':'var(--txt2)'};font-family:var(--display);font-weight:700;font-size:13px;cursor:pointer;transition:all .15s">✗ No</button>
        </div>
      </div>`).join('')}
  </div>`;
}

function answers_sit(qid, val) {
  if (!STATE.todayTradeCheck) STATE.todayTradeCheck = {};
  STATE.todayTradeCheck[qid] = val;
  saveState();
  renderScreen('shoulditrade');
}

/* ══════════════════════════════════════
   6. ENHANCED AI MENTOR INTELLIGENCE
   Massively expanded knowledge base
   ══════════════════════════════════════ */

function generateEnhancedResponse(input) {
  const q = input.toLowerCase().trim();
  const dna = calculateTraderDNA();

  // ── PERSONALIZED RESPONSES (uses trader DNA) ──
  if (q.includes('my weakness') || q.includes('what am i doing wrong') || q.includes('why do i keep losing')) {
    if (!dna) return `I need more data to analyse your specific weaknesses. Log at least 5 trades in your journal and I'll give you a precise, personalized breakdown of what's holding you back.`;
    const archetype = TRADER_ARCHETYPES[dna.archetype];
    return `Based on your ${STATE.journal.length} journal entries and ${STATE.simTrades.length} sim trades, here's your honest assessment:<br><br>
    <strong>Your trader type: ${dna.archetype} ${archetype.emoji}</strong><br><br>
    ${archetype.desc}<br><br>
    Your lowest scoring area is <strong>${getLowestSkill(dna.scores)}</strong> at ${Math.min(...Object.values(dna.scores))}/100.<br><br>
    ${archetype.advice}<br><br>
    Go to <strong>Profile → Trader DNA</strong> for your complete analysis.`;
  }

  if (q.includes('personalized') || q.includes('my data') || q.includes('my performance') || q.includes('tell me about me')) {
    if (!dna) return `Log some trades first and I'll give you personalized insights!`;
    return `Here's what your data tells me about you specifically:<br><br>
    🧬 <strong>Trader Type:</strong> ${dna.archetype}<br>
    📊 <strong>Win Rate:</strong> ${dna.winRate}% (${dna.winRate >= 55 ? 'above average ✅' : dna.winRate >= 45 ? 'acceptable ✅' : 'needs improvement — focus on setup quality ⚠️'})<br>
    💰 <strong>W/L Ratio:</strong> ${dna.avgLossSize > 0 ? (dna.avgWinSize/dna.avgLossSize).toFixed(2) : 'N/A'} (${dna.avgWinSize > dna.avgLossSize ? 'wins are larger than losses ✅' : 'losses are larger than wins — fix your exits ⚠️'})<br>
    ${dna.bestDay ? `📅 <strong>Best Day:</strong> ${dna.bestDay}<br>` : ''}
    ${dna.bestPair ? `💱 <strong>Best Pair:</strong> ${dna.bestPair}<br>` : ''}
    ${dna.revengeCount > 0 ? `😤 <strong>Revenge Trades:</strong> ${dna.revengeCount} detected<br>` : ''}
    ${dna.planBroken > 0 ? `❌ <strong>Plan Deviations:</strong> ${dna.planBroken} times<br>` : ''}<br>
    Your single biggest improvement area: <strong>${getImprovementArea(dna)}</strong>`;
  }

  // ── SPECIFIC TECHNIQUE QUESTIONS ──
  const advancedKB = {
    'wyckoff|accumulation|distribution|schematic': `<strong>Wyckoff Method</strong> — One of the oldest and most respected institutional trading frameworks:<br><br>
    <strong>Accumulation Phase (markup coming):</strong><br>
    1. PS (Preliminary Support) — first sign buying is emerging<br>
    2. SC (Selling Climax) — panic selling, institutions absorb<br>
    3. AR (Automatic Rally) — price bounces sharply<br>
    4. ST (Secondary Test) — retest of lows, volume should be lower<br>
    5. Spring — final shakeout below range, traps late sellers<br>
    6. SOS (Sign of Strength) — breakout above range<br><br>
    <strong>Distribution Phase (markdown coming):</strong><br>
    Mirror of accumulation. Look for: PSY, BC, AR, UT (Upthrust), SOW (Sign of Weakness)<br><br>
    The Spring and Upthrust are the highest probability entries in the entire framework. They represent institutional stop hunts before the real move.`,

    'volume|volume profile|poc|vah|val|vpoc': `<strong>Volume Profile & Analysis</strong>:<br><br>
    Volume is the only leading indicator — it tells you WHO is interested in price, not just WHERE price is.<br><br>
    <strong>Key Volume Concepts:</strong><br>
    • <strong>High Volume = Institutional interest</strong> at that level — it becomes S&R<br>
    • <strong>Low Volume areas</strong> = price moves through quickly (imbalance/FVG)<br>
    • <strong>Volume Climax</strong> = extreme volume often signals reversal<br><br>
    <strong>Volume Profile Levels:</strong><br>
    • <strong>POC (Point of Control)</strong> — highest volume node. Price returns here repeatedly<br>
    • <strong>VAH/VAL (Value Area High/Low)</strong> — 70% of volume. Price spends most time here<br>
    • <strong>Volume Node</strong> — Low volume = price moves fast. High volume = price congests<br><br>
    Rule: Buy at VAL (value area low), sell at VAH. POC is magnetic — price always returns.`,

    'order flow|footprint|delta|bid ask volume': `<strong>Order Flow Trading</strong> — Reading real-time supply/demand:<br><br>
    Order flow shows the ACTUAL transactions happening in the market, not just price.<br><br>
    <strong>Key Concepts:</strong><br>
    • <strong>Delta</strong> = Buy volume minus Sell volume. Positive = buyers in control<br>
    • <strong>Absorption</strong> = Large orders absorbing incoming orders — price stays flat despite activity. Often precedes reversal<br>
    • <strong>Iceberg Orders</strong> = Hidden large orders that keep refilling. Institutions hide size here<br>
    • <strong>Aggressive Buy/Sell</strong> = Market orders hitting the bid/ask — shows urgency and direction<br><br>
    Best tools: Jigsaw Trading (futures), Bookmap. Note: Retail forex is OTC — true order flow data is limited. Use it on futures equivalents (ES, NQ, 6E) as proxy.`,

    'intermarket|correlation|dxy|bond yields|yield curve': `<strong>Intermarket Analysis</strong> — Everything is connected:<br><br>
    <strong>USD Relationships:</strong><br>
    • DXY up → EUR/USD down, GBP/USD down, Gold down<br>
    • DXY down → Commodity currencies up (AUD, NZD, CAD), Gold up<br><br>
    <strong>Bond Yields & Forex:</strong><br>
    • US 10Y yield rising → USD strengthens (capital flows to US for better returns)<br>
    • Yield curve inversion (2Y > 10Y) → recession fear → risk-off → USD/JPY may fall<br><br>
    <strong>Commodity Correlations:</strong><br>
    • Oil price up → USD/CAD falls (Canada exports oil)<br>
    • Gold up → AUD/USD rises (Australia exports gold)<br>
    • Iron ore up → AUD pairs bullish<br><br>
    <strong>Risk Sentiment:</strong><br>
    • VIX > 20 = fear = sell AUD/NZD, buy USD/JPY/CHF, buy gold<br>
    • VIX < 15 = complacency = carry trades work (buy AUD/JPY, NZD/JPY)`,

    'institutional|smart money|banks|hedge fund|prop firm': `<strong>How Institutions Actually Trade</strong>:<br><br>
    Banks and hedge funds operate completely differently to retail:<br><br>
    🏦 <strong>Size problem</strong> — A bank cannot enter 1000 lots in one click. They need liquidity pools. They BUILD positions over time at their target price zone.<br><br>
    🎯 <strong>Stop hunting is real</strong> — Institutions need your stop orders as liquidity to fill their positions. They push price beyond obvious retail levels, trigger stops, then reverse.<br><br>
    📊 <strong>CFTC COT Report</strong> — Commitments of Traders report shows institutional positioning. Released every Friday. "Commercial" category = the smart money. When commercials are heavily long = bullish bias.<br><br>
    🏛️ <strong>Order Blocks</strong> form where institutions placed large orders. Price returns to let them complete their position.<br><br>
    🌊 <strong>Liquidity pools</strong> = clusters of stops above swing highs and below swing lows. These are targets, not random levels.`,

    'backtesting|forward testing|strategy testing|validate': `<strong>Testing Your Strategy — The Right Way</strong>:<br><br>
    <strong>Step 1: Define rules precisely</strong><br>
    "I will enter on a bullish engulfing at H4 support after RSI divergence" — every word must be defined.<br><br>
    <strong>Step 2: Manual Backtesting (TradingView)</strong><br>
    1. Go to TradingView → open your pair → set to H4<br>
    2. Press replay mode (clock icon) → set to 2020<br>
    3. Advance candle by candle. Apply your rules. Record each trade in a spreadsheet.<br>
    4. Minimum 100 trades across different market conditions<br><br>
    <strong>What to measure:</strong><br>
    • Win Rate, Avg Win/Loss, Profit Factor (>1.5 = good)<br>
    • Max drawdown, Consecutive losses (plan for worst case)<br>
    • Performance by session, day of week, pair<br><br>
    <strong>Step 3: Forward test</strong> — Paper trade for 3 months with no changes<br>
    <strong>Step 4: Small live account</strong> — Start with $500 max. Same rules, real psychology<br><br>
    ⚠️ Most traders skip steps 2-3 and wonder why they lose.`,

    'prop firm|ftmo|funding|funded account|challenge': `<strong>Prop Firm / Funded Account Guide</strong>:<br><br>
    Prop firms provide capital to traders who pass their challenges. You trade their money and split profits.<br><br>
    <strong>Major Firms:</strong><br>
    • FTMO — Most reputable. Two-phase: 10% gain target, max 10% DD<br>
    • MyForexFunds — Popular, flexible rules<br>
    • The Funded Trader — Aggressive profit splits up to 90%<br>
    • E8 Funding — Lower profit target (8%), beginner friendly<br><br>
    <strong>Rules to know:</strong><br>
    • Maximum Daily Loss: Usually 5% of account<br>
    • Maximum Total Loss: Usually 10%<br>
    • Minimum trading days: Usually 4-10<br>
    • News trading rules: Many ban trading 2 min before/after red events<br><br>
    <strong>Strategy for passing:</strong><br>
    • Risk 0.5% per trade (not 1%) — gives double the buffer<br>
    • 1:3 R:R minimum — you only need 26% win rate<br>
    • Trade only A+ setups. Volume over quality = failure.<br>
    • If you hit -3% daily DD, stop immediately. Never average into losers.<br><br>
    ⚠️ If you cannot be profitable on a small personal account, a funded account will not fix that.`,

    'tax|taxes|trading tax|capital gains': `<strong>Forex Trading Tax Awareness</strong>:<br><br>
    ⚠️ This is general awareness only — always consult a qualified accountant in your jurisdiction.<br><br>
    <strong>General principles across most countries:</strong><br>
    • Forex profits are typically taxable as capital gains or income<br>
    • Losses can often be offset against gains<br>
    • Keeping detailed records (your journal) is essential for tax compliance<br><br>
    <strong>Country overview:</strong><br>
    🇺🇸 <strong>USA</strong> — Section 1256 (60/40 rule for futures), Mark-to-Market election available<br>
    🇬🇧 <strong>UK</strong> — Spread betting is tax-free. CFD/Spot forex taxed as Capital Gains<br>
    🇿🇦 <strong>South Africa</strong> — Taxed as normal income<br>
    🇳🇬 <strong>Nigeria</strong> — Taxable income, FIRS regulations apply<br>
    🇰🇪 <strong>Kenya</strong> — Capital Gains Tax applies<br>
    🇦🇺 <strong>Australia</strong> — CGT with 50% discount if held >12 months<br><br>
    📝 <strong>Best practice:</strong> Keep ALL trade records with dates, amounts, pairs. Your journal already does this.`,

    'psychology book|mark douglas|trading zone|market wizards|trading book': `<strong>Essential Trading Books — Summaries</strong>:<br><br>
    📚 <strong>Trading in the Zone — Mark Douglas</strong><br>
    Core insight: Trading is a probability game. You must detach outcome from process. The market is not against you — it is neutral. Your edge works over many trades, not individual trades. Develop "probabilistic thinking."<br><br>
    📚 <strong>Market Wizards — Jack Schwager</strong><br>
    Interviews with 17 legendary traders. Key patterns: Every successful trader had a period of catastrophic loss before succeeding. They ALL emphasize risk management over strategy. There is no one strategy — find what fits YOUR personality.<br><br>
    📚 <strong>Reminiscences of a Stock Operator — Edwin Lefèvre</strong><br>
    The classic. Jesse Livermore's story. Key lesson: The market always gives you a second chance to be right — but by then, the big money is already made. Patience and sizing at key moments is everything.<br><br>
    📚 <strong>The Disciplined Trader — Mark Douglas</strong><br>
    The predecessor to Trading in the Zone. More philosophical. Explores WHY traders self-sabotage: childhood money beliefs, fear of success, need to be right.<br><br>
    📚 <strong>One Good Trade — Mike Bellafiore</strong><br>
    Modern prop trading insights. Process over outcome. Every trade judged on quality of execution, not result.`,

    'scam|fraud|signal seller|forex scam|fake mentor': `<strong>Forex Scam Detection Guide</strong>:<br><br>
    🚩 <strong>Red Flag #1 — Guaranteed returns</strong><br>
    Nobody can guarantee forex returns. Period. A hedge fund with 20% annual returns is considered exceptional. Anyone promising 10%/week or "doubling accounts" is lying.<br><br>
    🚩 <strong>Red Flag #2 — Signal sellers charging subscription fees</strong><br>
    If someone's strategy is genuinely profitable, why do they need YOUR subscription money? They are selling signals because their trading income is insufficient or nonexistent.<br><br>
    🚩 <strong>Red Flag #3 — Trading Instagram lifestyle accounts</strong><br>
    Lamborghinis and watches are props. Real traders value privacy and capital preservation, not social media validation.<br><br>
    🚩 <strong>Red Flag #4 — PAMM accounts / "Invest with me"</strong><br>
    Unregulated managed accounts in forex are a major scam vector. If not FCA/ASIC/SEC regulated, your money is at high risk.<br><br>
    🚩 <strong>Red Flag #5 — Unregulated brokers offering "special" bonuses</strong><br>
    Bonus money often comes with withdrawal restrictions. Some brokers manipulate spreads or execute against your positions.<br><br>
    ✅ <strong>Legitimate brokers: </strong> FCA (UK), ASIC (Australia), CySEC (EU), FSCA (SA) regulated. Check the register on each regulator's website.`,

    'broker|best broker|which broker|ecn broker|mt4 broker': `<strong>Choosing a Broker — Complete Guide</strong>:<br><br>
    <strong>1. Regulation First</strong><br>
    Tier 1: FCA (UK), ASIC (Australia), CFTC (USA)<br>
    Tier 2: CySEC (Cyprus), FSCA (South Africa), FSC (Mauritius)<br>
    Avoid: Offshore only (Vanuatu, SVG, Belize) — no real recourse if they steal your money<br><br>
    <strong>2. Account Types</strong><br>
    • Standard (Market Maker) — Fixed/variable spreads. Simple. Good for beginners.<br>
    • ECN/STP — Raw spreads (0.0-0.3 pip) + commission. Best for active traders and scalpers<br><br>
    <strong>3. Spread Comparison (EUR/USD typical)</strong><br>
    • Pepperstone ECN: 0.0-0.3 pip + $7/lot commission<br>
    • IC Markets: 0.0-0.2 pip + $7/lot<br>
    • XM Standard: 1.6 pip spread, no commission<br>
    • FXTM: Variable 0.1-2.0 pip<br><br>
    <strong>4. For Beginners</strong> — XM, Exness, Pepperstone Standard<br>
    <strong>5. For Active/Scalpers</strong> — IC Markets ECN, Pepperstone Razor, TMGM<br><br>
    Always test with a demo account for 2 weeks before depositing.`,
  };

  // Check advanced KB
  for (const [patterns, answer] of Object.entries(advancedKB)) {
    const patternList = patterns.split('|');
    if (patternList.some(p => q.includes(p.trim()))) {
      return answer + '<br><br>💬 Want to go deeper on any aspect?';
    }
  }

  // Fall through to original generateResponse
  return generateResponse(input);
}

function getLowestSkill(scores) {
  const labels = {discipline:'Discipline',patience:'Patience',riskManagement:'Risk Management',emotionalControl:'Emotional Control',consistency:'Consistency',knowledge:'Knowledge'};
  const lowest = Object.entries(scores).sort((a,b) => a[1]-b[1])[0];
  return labels[lowest[0]] || lowest[0];
}

function getImprovementArea(dna) {
  if (dna.revengeCount > 1) return 'Stop revenge trading — implement the mandatory break-after-loss rule';
  if (dna.planBroken > dna.planFollowed) return 'Follow your plan on every single trade, no exceptions';
  if (dna.avgWinSize < dna.avgLossSize) return 'Let winners run longer — your exits are too early';
  if (dna.winRate < 40) return 'Improve setup quality — only take A+ setups with multiple confirmation factors';
  return 'Keep consistent — you are on the right path';
}

/* ══════════════════════════════════════
   7. PAIR PERSONALITY PROFILES
   ══════════════════════════════════════ */

const PAIR_PROFILES = {
  'EUR/USD': {
    nickname: 'The Euro', flag: '🇪🇺🇺🇸', character: 'The Reliable Professional',
    personality: 'EUR/USD is the most liquid pair in the world. It trends cleanly, respects technical levels, has tight spreads, and behaves predictably around major news. The ideal pair for beginners to master first.',
    avgDailyRange: { london: '60-90 pips', ny: '70-100 pips', asia: '20-35 pips', total: '80-120 pips' },
    bestSessions: ['London', 'London/NY Overlap'],
    bestStrategies: ['Trend Pullback (EMA)', 'S&R Bounce', 'London Breakout'],
    keyDrivers: ['ECB rates & policy', 'US CPI/NFP/FOMC', 'Eurozone GDP/PMI', 'German economic data'],
    traps: ['False breakouts in Asia session', 'Choppy pre-news consolidation', 'Fake moves at round numbers (1.1000, 1.0500)'],
    correlation: 'Negative with USD/CHF (-0.92). Positive with GBP/USD (+0.85).',
    volatilityRating: '⭐⭐⭐',
    difficulty: '🟢 Beginner Friendly',
    spreadTypical: '0.5-1.5 pips',
    funFact: 'EUR/USD accounts for approximately 28% of all daily forex volume globally.',
    keyLevels: 'Watch 1.0500, 1.1000, 1.0800, 1.1200 as major psychological levels.',
    color: 'var(--blue)'
  },
  'GBP/USD': {
    nickname: 'Cable', flag: '🇬🇧🇺🇸', character: 'The Volatile Beast',
    personality: 'GBP/USD is known for violent, sharp moves that can trigger stops before continuing. Wider spreads, more volatile than EUR/USD. High reward but requires wider stops.',
    avgDailyRange: { london: '80-120 pips', ny: '90-130 pips', asia: '25-40 pips', total: '100-150 pips' },
    bestSessions: ['London Open', 'London/NY Overlap'],
    bestStrategies: ['S&R Bounce', 'Pin Bar Reversal', 'Breakout & Retest'],
    keyDrivers: ['BOE rate decisions', 'UK CPI/employment data', 'Brexit-related developments', 'US data'],
    traps: ['Classic stop hunt spikes beyond key levels', 'Thin liquidity late in London session', 'Wild BOE statement reactions'],
    correlation: 'Positive with EUR/USD (+0.85). Negative with USD/JPY.',
    volatilityRating: '⭐⭐⭐⭐',
    difficulty: '🟡 Intermediate',
    spreadTypical: '0.8-2 pips',
    funFact: 'Called "Cable" because of the telegraph cable laid under the Atlantic in 1866 to transmit GBP/USD rates.',
    keyLevels: '1.2000, 1.2500, 1.3000, 1.3500 are major psychological barriers.',
    color: 'var(--blue)'
  },
  'USD/JPY': {
    nickname: 'The Yen', flag: '🇺🇸🇯🇵', character: 'The Safe Haven Barometer',
    personality: 'USD/JPY is a risk sentiment barometer. Falls in risk-off (USD/JPY goes down = fear), rises in risk-on. Heavily influenced by US Treasury yields and BOJ intervention risk.',
    avgDailyRange: { london: '50-80 pips', ny: '70-100 pips', asia: '40-60 pips', total: '80-120 pips' },
    bestSessions: ['Tokyo (JPY news)', 'New York (US yields)'],
    bestStrategies: ['Trend Following', 'Carry Trade (long USD/JPY in risk-on)', 'S&R Bounce'],
    keyDrivers: ['Federal Reserve policy', 'BOJ intervention (beware 145-155 zone)', 'US Treasury yields (most important)', 'Risk sentiment/VIX'],
    traps: ['BOJ intervention at extreme levels (sudden 200+ pip moves)', 'Thin liquidity overnight = slippage', 'Carry trade unwind in crises'],
    correlation: 'Positive with US 10Y yields. Negative with gold. Negative with risk-off sentiment.',
    volatilityRating: '⭐⭐⭐',
    difficulty: '🟡 Intermediate',
    spreadTypical: '0.5-1.2 pips',
    funFact: 'JPY is one of the top 3 reserve currencies. In every crisis since 1998, JPY has strengthened significantly.',
    keyLevels: '140.00, 145.00, 150.00, 155.00 trigger BOJ intervention warnings.',
    color: 'var(--red)'
  },
  'XAU/USD': {
    nickname: 'Gold', flag: '🥇🇺🇸', character: 'The Crisis King',
    personality: 'Gold is the ultimate safe haven. It moves 500-2000 pips daily, has wide spreads, and can be extremely volatile. Not for beginners. Rewarding when read correctly.',
    avgDailyRange: { london: '800-1500 pips', ny: '1000-2000 pips', asia: '400-800 pips', total: '1500-3000 pips' },
    bestSessions: ['London/NY Overlap', 'Major news events'],
    bestStrategies: ['Trend Following (D1)', 'S&R with wide stops', 'Pin Bar on D1'],
    keyDrivers: ['Real US interest rates (most important)', 'USD strength/weakness', 'Geopolitical crises', 'Central bank gold buying', 'Inflation expectations'],
    traps: ['Wide spreads = invisible cost', 'Violent reversals', 'Over-leveraging due to large pip value'],
    correlation: 'Strongly negative with USD. Positive with AUD. Positive with risk-off sentiment.',
    volatilityRating: '⭐⭐⭐⭐⭐',
    difficulty: '🔴 Advanced',
    spreadTypical: '20-50 pips equivalent',
    funFact: 'Gold hit an all-time high of $2,400+ in 2024 driven by central bank buying and geopolitical uncertainty.',
    keyLevels: '$1800, $2000, $2100, $2400 are major psychological barriers.',
    color: 'var(--gold)'
  },
  'AUD/USD': {
    nickname: 'Aussie', flag: '🇦🇺🇺🇸', character: 'The Commodity Proxy',
    personality: 'AUD/USD moves with Chinese economic data, iron ore prices, and risk sentiment. A risk-on currency — rises when markets are optimistic, falls in fear.',
    avgDailyRange: { london: '50-75 pips', ny: '60-85 pips', asia: '35-55 pips', total: '70-100 pips' },
    bestSessions: ['Sydney/Tokyo (AUD news)', 'London/NY Overlap'],
    bestStrategies: ['Trend Following', 'Carry Trade (AUD/JPY)', 'S&R Bounce'],
    keyDrivers: ['RBA rate decisions', 'Chinese PMI/GDP data', 'Iron ore & commodity prices', 'Global risk sentiment'],
    traps: ['China overnight data gaps', 'RBA surprise decisions', 'Thin Sydney session'],
    correlation: 'Positive with NZD/USD (+0.90). Positive with commodity prices. Negative with VIX.',
    volatilityRating: '⭐⭐⭐',
    difficulty: '🟢 Beginner Friendly',
    spreadTypical: '0.8-1.8 pips',
    funFact: 'Australia is the world\'s largest iron ore exporter. AUD/USD tracks iron ore prices with ~0.75 correlation.',
    keyLevels: '0.6500, 0.7000, 0.6800 are key psychological levels.',
    color: 'var(--green)'
  },
  'GBP/JPY': {
    nickname: 'The Beast', flag: '🇬🇧🇯🇵', character: 'The Widow Maker',
    personality: 'GBP/JPY is one of the most volatile pairs in forex. Up to 300 pip daily ranges. Combines GBP volatility with JPY safe-haven characteristics. For experienced traders only.',
    avgDailyRange: { london: '120-200 pips', ny: '130-220 pips', asia: '50-80 pips', total: '200-300 pips' },
    bestSessions: ['London Open only'],
    bestStrategies: ['Trend Following with wide stops', 'Session breakout'],
    keyDrivers: ['Both BOE and BOJ policy', 'UK and Japan economic data', 'Risk sentiment (JPY part)', 'GBP Brexit/political risk'],
    traps: ['Enormous stop hunts', 'Not suitable for scalping', 'Thin Asia liquidity = gaps'],
    correlation: 'Cross pair combining GBP strength and JPY weakness.',
    volatilityRating: '⭐⭐⭐⭐⭐',
    difficulty: '🔴 Advanced Only',
    spreadTypical: '2-5 pips',
    funFact: 'Professional traders called it "The Beast" because of its unpredictable 200+ pip daily swings.',
    keyLevels: '180.00, 185.00, 190.00, 195.00.',
    color: 'var(--red)'
  },
};

function renderPairProfiles() {
  const pairs = Object.keys(PAIR_PROFILES);
  return `<div class="screen-pad">
    <div class="pg-header a-fadeup" style="padding:0 0 14px">
      <div style="display:flex;gap:10px;align-items:center">
        <button class="back-btn" onclick="navigate('home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div><h1 class="pg-title">Pair Profiles</h1><div style="font-size:12px;color:var(--txt2)">Deep personality analysis</div></div>
      </div>
    </div>
    <p class="a-fadeup2" style="font-size:13px;color:var(--txt2);margin-bottom:14px;line-height:1.6">Every currency pair has a unique personality. Understanding it is the difference between trading blind and trading with an edge.</p>
    ${pairs.map((pair, i) => {
      const p = PAIR_PROFILES[pair];
      return `<div class="card card-tappable a-fadeup" style="animation-delay:${i*.05}s;padding:14px;margin-bottom:10px" onclick="showPairDetail('${pair}')">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
          <div style="font-size:28px">${p.flag}</div>
          <div style="flex:1">
            <div style="font-family:var(--display);font-weight:800;font-size:16px">${pair}</div>
            <div style="font-size:11px;color:var(--txt2)">"${p.character}" · ${p.nickname}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:13px">${p.volatilityRating}</div>
            <div style="font-size:10px;color:var(--txt3)">Volatility</div>
          </div>
        </div>
        <div style="font-size:12px;color:var(--txt2);line-height:1.5;margin-bottom:8px">${p.personality.substring(0,100)}...</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span class="pill ${p.difficulty.includes('🟢')?'pill-green':p.difficulty.includes('🟡')?'pill-gold':'pill-red'}" style="font-size:9px">${p.difficulty}</span>
          <span class="pill pill-blue" style="font-size:9px">Spread: ${p.spreadTypical}</span>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function showPairDetail(pair) {
  const p = PAIR_PROFILES[pair];
  if (!p) return;
  showModal(`<div class="modal-handle"></div>
    <div style="text-align:center;margin-bottom:16px">
      <div style="font-size:48px;margin-bottom:8px">${p.flag}</div>
      <div style="font-family:var(--display);font-weight:800;font-size:22px">${pair}</div>
      <div style="font-size:12px;color:var(--txt2);margin-top:4px">"${p.character}"</div>
      <div style="display:flex;gap:6px;justify-content:center;margin-top:8px">
        <span class="pill ${p.difficulty.includes('🟢')?'pill-green':p.difficulty.includes('🟡')?'pill-gold':'pill-red'}">${p.difficulty}</span>
        <span class="pill pill-blue">Spread: ${p.spreadTypical}</span>
      </div>
    </div>

    <div class="section-lbl">Personality</div>
    <p style="font-size:13px;color:var(--txt2);line-height:1.65;margin-bottom:14px">${p.personality}</p>

    <div class="section-lbl">Average Daily Range by Session</div>
    <div class="stat-grid" style="margin-bottom:14px">
      <div class="stat-box"><div class="stat-val" style="font-size:14px">${p.avgDailyRange.london}</div><div class="stat-lbl">London</div></div>
      <div class="stat-box"><div class="stat-val" style="font-size:14px">${p.avgDailyRange.ny}</div><div class="stat-lbl">New York</div></div>
      <div class="stat-box"><div class="stat-val" style="font-size:14px">${p.avgDailyRange.asia}</div><div class="stat-lbl">Asia</div></div>
      <div class="stat-box"><div class="stat-val" style="font-size:14px;color:var(--gold)">${p.avgDailyRange.total}</div><div class="stat-lbl">Total Range</div></div>
    </div>

    <div class="section-lbl">Key Market Drivers</div>
    <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:14px">
      ${p.keyDrivers.map(d => `<div style="font-size:12px;color:var(--txt2);padding:5px 0;border-bottom:1px solid var(--bdr2)">📌 ${d}</div>`).join('')}
    </div>

    <div class="section-lbl">Common Traps</div>
    <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:14px">
      ${p.traps.map(t => `<div style="font-size:12px;color:var(--txt2);padding:5px 0;border-bottom:1px solid var(--bdr2)">⚠️ ${t}</div>`).join('')}
    </div>

    <div class="section-lbl">Best Strategies</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
      ${p.bestStrategies.map(s => `<span class="pill pill-gold">${s}</span>`).join('')}
    </div>

    <div class="card card-gold" style="padding:12px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--gold);font-family:var(--display);letter-spacing:1px;margin-bottom:6px">💡 FUN FACT</div>
      <div style="font-size:12px;color:var(--txt2);line-height:1.6">${p.funFact}</div>
    </div>

    <div class="card" style="padding:12px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--txt2);font-family:var(--display);letter-spacing:1px;margin-bottom:6px">🔗 CORRELATION</div>
      <div style="font-size:12px;color:var(--txt2);line-height:1.6">${p.correlation}</div>
    </div>

    <div class="card card-gold" style="padding:12px;margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:var(--gold);font-family:var(--display);letter-spacing:1px;margin-bottom:6px">🎯 KEY LEVELS TO WATCH</div>
      <div style="font-size:12px;color:var(--txt2);line-height:1.6">${p.keyLevels}</div>
    </div>

    <button class="btn btn-gold" onclick="closeModal();addXP(10);showToast('📊 Pair studied! +10 XP')">Got it! +10 XP</button>
  `);
}

/* ══════════════════════════════════════
   8. KNOWLEDGE VAULT
   ══════════════════════════════════════ */

const FAMOUS_TRADES = [
  {
    title: "Soros Breaks the Bank of England (1992)",
    trader: "George Soros", profit: "$1 Billion in one day", emoji: "🏦",
    story: "In September 1992, George Soros believed the British pound was overvalued within the European Exchange Rate Mechanism (ERM). The UK government had committed to keeping GBP above 2.7 Deutsche Marks. Soros built a $10 billion short position against the pound. On Black Wednesday (September 16, 1992), despite the Bank of England spending £27 billion in reserves and raising interest rates to 15%, they could not defend the peg. GBP collapsed and was forced out of the ERM. Soros made $1 billion in a single day.",
    lesson: "When a central bank's policy contradicts fundamental economic reality, the market eventually wins. Always.",
    tags: ['macro', 'gbp', 'shorting', 'legendary']
  },
  {
    title: "Jesse Livermore Short-Sells the 1929 Crash",
    trader: "Jesse Livermore", profit: "$100 Million (1929 equivalent ~$1.5B today)", emoji: "📉",
    story: "In 1929, Jesse Livermore had been building a massive short position in US stocks for months, recognizing the signs of irrational exuberance. When the market crashed in October 1929, he had the largest short position in history at the time. He was reported to have made $100 million in a single day during the crash, while the rest of America lost everything.",
    lesson: "Reading market sentiment and having the courage to act against the crowd — with proper risk management — creates legendary returns. Livermore later lost it all due to poor risk management, showing even legends need discipline.",
    tags: ['shorting', 'macro', 'legendary', 'psychology']
  },
  {
    title: "Paul Tudor Jones Predicts Black Monday (1987)",
    trader: "Paul Tudor Jones", profit: "200% return in single month", emoji: "⚡",
    story: "In October 1987, Paul Tudor Jones predicted Black Monday (October 19, 1987) using his own Elliott Wave analysis and pattern recognition. He was massively short the market. The Dow fell 22.6% in one day — the largest single-day percentage crash in history. Jones tripled his money in a single month.",
    lesson: "Technical analysis and pattern recognition, when combined with disciplined risk management and conviction, can identify extraordinary opportunities. Jones famously says: 'The most important rule of trading is to play great defense, not great offense.'",
    tags: ['stocks', 'shorting', 'technical', 'legendary']
  },
  {
    title: "John Paulson Shorts the Housing Market (2007)",
    trader: "John Paulson", profit: "$15 Billion in 2007", emoji: "🏠",
    story: "While the world was buying mortgage-backed securities, John Paulson spent years studying the US housing market and concluded it was a massive bubble built on fraudulent lending standards. He bought Credit Default Swaps (essentially insurance on the mortgage market failing). When the 2008 financial crisis hit, his fund made $15 billion. He personally earned $4 billion in a single year.",
    lesson: "Deep fundamental research can identify opportunities invisible to the crowd. The trade was right for 2+ years before it worked — conviction and patience (with limited downside risk on the CDS) were essential.",
    tags: ['macro', 'shorting', 'fundamental', 'legendary']
  },
  {
    title: "Stanley Druckenmiller Goes All-In on German Reunification (1989)",
    trader: "Stanley Druckenmiller", profit: "Billions for Soros Fund", emoji: "🇩🇪",
    story: "When the Berlin Wall fell in November 1989, Stanley Druckenmiller (managing Soros's Quantum Fund) recognized immediately that German reunification would cause massive capital inflows to Germany. He went LONG on the Deutsche Mark in an enormous position. Soros called him and told him to double the position. The trade made hundreds of millions in weeks.",
    lesson: "Macro events create multi-week currency moves. The traders who see the geopolitical picture and act decisively at the right moment capture the biggest moves.",
    tags: ['macro', 'currencies', 'geopolitical', 'legendary']
  },
];

const CENTRAL_BANK_HISTORY = [
  { year: '2008-09', bank: 'Federal Reserve', event: 'Emergency rate cut to 0%', impact: 'USD initially weakened dramatically. Gold surged to record highs. Began era of zero interest rate policy (ZIRP).', lesson: 'Central bank crisis responses create multi-YEAR trends, not just weeks.' },
  { year: '2011', bank: 'Swiss National Bank (SNB)', event: 'CHF cap at 1.20 vs EUR', impact: 'SNB capped EUR/CHF at 1.20 to protect Swiss exporters. Any trade below 1.20 was automatically reversed. Safe haven flows into CHF during Eurozone crisis.', lesson: 'Central bank pegs artificially suppress volatility — until they break catastrophically.' },
  { year: '2015-Jan', bank: 'Swiss National Bank (SNB)', event: 'SHOCK EUR/CHF peg removal', impact: 'EUR/CHF crashed 2,000 pips in minutes. Many retail traders were wiped out, and several brokers went bankrupt. The most dramatic single event in recent forex history.', lesson: 'Central bank interventions always end. Never hold large positions during periods of artificial price suppression.' },
  { year: '2022', bank: 'Federal Reserve', event: 'Fastest rate hiking cycle in 40 years', impact: 'USD surged dramatically. EUR/USD fell from 1.1500 to parity (1.0000) for first time in 20 years. GBP/USD hit lowest level since 1985. Emerging market currencies collapsed.', lesson: 'Rate differential is the most powerful long-term currency driver. When the Fed diverges from other central banks, it creates multi-month trends.' },
  { year: '2023', bank: 'Bank of Japan (BOJ)', event: 'End of Yield Curve Control', impact: 'BOJ gradually allowed Japanese yields to rise after decades of zero rates. JPY had its strongest period in years. USD/JPY fell 15% in months.', lesson: 'Decades-long policy changes create historic opportunities. BOJ was the last holdout of zero rates — when they turned, the move was massive.' },
];

function renderKnowledgeVault() {
  const tabs = ['Famous Trades', 'Central Banks', 'Book Summaries', 'Broker Guide', 'Tax Guide'];
  if (!STATE.vaultTab) STATE.vaultTab = 0;

  return `<div class="screen-pad">
    <div class="pg-header a-fadeup" style="padding:0 0 12px">
      <div style="display:flex;gap:10px;align-items:center">
        <button class="back-btn" onclick="navigate('home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div><h1 class="pg-title">Knowledge Vault</h1><div style="font-size:12px;color:var(--txt2)">The deepest forex resource</div></div>
      </div>
    </div>

    <div class="h-scroll a-fadeup2" style="margin-bottom:14px">
      ${tabs.map((t,i) => `<button onclick="STATE.vaultTab=${i};renderScreen('vault')" style="flex-shrink:0;padding:7px 14px;border-radius:20px;font-size:11px;font-weight:700;font-family:var(--display);cursor:pointer;border:1.5px solid var(--bdr2);background:${STATE.vaultTab===i?'var(--gold)':'var(--bg3)'};color:${STATE.vaultTab===i?'#0A0A0F':'var(--txt2)'};transition:all .15s">${t}</button>`).join('')}
    </div>

    <div id="vault-content" class="a-fadeup3">
      ${renderVaultTab(STATE.vaultTab)}
    </div>
  </div>`;
}

function renderVaultTab(tab) {
  if (tab === 0) return renderFamousTrades();
  if (tab === 1) return renderCentralBankHistory();
  if (tab === 2) return renderBookSummaries();
  if (tab === 3) return renderBrokerGuide();
  if (tab === 4) return renderTaxGuide();
  return '';
}

function renderFamousTrades() {
  return FAMOUS_TRADES.map((t,i) => `
    <div class="card card-tappable a-fadeup" style="animation-delay:${i*.05}s;padding:16px;margin-bottom:12px" onclick="showFamousTrade(${i})">
      <div style="font-size:40px;margin-bottom:10px">${t.emoji}</div>
      <div style="font-family:var(--display);font-weight:800;font-size:16px;margin-bottom:4px">${t.title}</div>
      <div style="font-size:12px;color:var(--gold);font-family:var(--display);margin-bottom:6px">👤 ${t.trader} · 💰 ${t.profit}</div>
      <div style="font-size:12px;color:var(--txt2);line-height:1.55">${t.story.substring(0,120)}...</div>
      <div style="margin-top:10px;display:flex;gap:5px;flex-wrap:wrap">
        ${t.tags.map(tag => `<span class="pill pill-gold" style="font-size:9px">${tag}</span>`).join('')}
      </div>
    </div>`).join('');
}

function showFamousTrade(idx) {
  const t = FAMOUS_TRADES[idx];
  showModal(`<div class="modal-handle"></div>
    <div style="font-size:52px;text-align:center;margin-bottom:12px">${t.emoji}</div>
    <div style="font-family:var(--display);font-weight:800;font-size:18px;margin-bottom:4px">${t.title}</div>
    <div style="font-size:13px;color:var(--gold);margin-bottom:14px">👤 ${t.trader} · 💰 ${t.profit}</div>
    <div class="section-lbl">The Story</div>
    <p style="font-size:13px;color:var(--txt2);line-height:1.7;margin-bottom:14px">${t.story}</p>
    <div class="card card-gold" style="padding:12px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--gold);font-family:var(--display);letter-spacing:1px;margin-bottom:6px">💡 THE LESSON</div>
      <div style="font-size:13px;color:var(--txt2);line-height:1.65;font-style:italic">"${t.lesson}"</div>
    </div>
    <button class="btn btn-gold" onclick="closeModal();addXP(15);showToast('📖 Trade studied! +15 XP')">Learned it! +15 XP</button>
  `);
}

function renderCentralBankHistory() {
  return CENTRAL_BANK_HISTORY.map((e,i) => `
    <div class="card a-fadeup" style="animation-delay:${i*.05}s;padding:14px;margin-bottom:10px">
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px">
        <div style="padding:4px 10px;background:var(--gold-bg);border:1px solid var(--bdr);border-radius:var(--rss);font-family:var(--mono);font-size:12px;color:var(--gold);flex-shrink:0">${e.year}</div>
        <div>
          <div style="font-family:var(--display);font-weight:700;font-size:14px">${e.event}</div>
          <div style="font-size:11px;color:var(--txt3);margin-top:2px">${e.bank}</div>
        </div>
      </div>
      <div style="font-size:12px;color:var(--txt2);line-height:1.6;margin-bottom:8px">${e.impact}</div>
      <div style="background:var(--gold-bg);border:1px solid var(--bdr);border-radius:var(--rss);padding:8px;font-size:11px;color:var(--txt2);font-style:italic">💡 ${e.lesson}</div>
    </div>`).join('');
}

function renderBookSummaries() {
  const books = [
    { title:'Trading in the Zone', author:'Mark Douglas', year:'2000', emoji:'🧠', rating:'⭐⭐⭐⭐⭐',
      summary:'The bible of trading psychology. Douglas argues that consistent profitability comes not from a better system but from developing a "trading mindset" — one that accepts uncertainty, executes without hesitation, and thinks in probabilities across many trades rather than individual outcomes.',
      keyIdeas:['Every trade is unique — past wins/losses are statistically irrelevant to the next trade','The market is not your enemy — it is neutral. Your mind creates the enemy.','You must WANT to follow your rules more than you want the money','Develop "beliefs" about the market rather than opinions that change with each candle'],
      bestFor:'Every trader who knows what to do but cannot do it consistently.' },
    { title:'Market Wizards', author:'Jack Schwager', year:'1989', emoji:'🧙', rating:'⭐⭐⭐⭐⭐',
      summary:'Interviews with 17 of the world\'s greatest traders including Paul Tudor Jones, Ed Seykota, Bruce Kovner, and Michael Marcus. Despite completely different styles, all share common principles: protect capital first, let profits run, cut losses fast, and develop a system that fits your personality.',
      keyIdeas:['Every great trader had a catastrophic early failure','No single strategy works — find YOUR edge','Risk management is mentioned by EVERY successful trader as #1','Markets change — systems must adapt'],
      bestFor:'Understanding that multiple paths exist to consistent profitability.' },
    { title:'The Disciplined Trader', author:'Mark Douglas', year:'1990', emoji:'🎯', rating:'⭐⭐⭐⭐',
      summary:'Douglas\'s first book, more philosophical and foundational than Trading in the Zone. Explores the psychological roots of trading failure — why intelligent, educated people consistently sabotage themselves in the markets.',
      keyIdeas:['Childhood money beliefs program adult trading behavior','The "need to be right" destroys more accounts than bad strategies','Society conditions us against the mindset needed for trading','Losses must be redefined as the cost of doing business, not personal failure'],
      bestFor:'Traders who want to understand WHY they self-sabotage.' },
    { title:'Reminiscences of a Stock Operator', author:'Edwin Lefèvre', year:'1923', emoji:'📜', rating:'⭐⭐⭐⭐⭐',
      summary:'A fictionalized autobiography of Jesse Livermore, the greatest speculator in history. Despite being 100 years old, every insight is as relevant today as it was then. Livermore made and lost four separate fortunes in his lifetime.',
      keyIdeas:['The big money is made in the big swings — patience, not activity','Never average into a losing trade','The market always gives you a second chance — but by then, the big move is gone','A man who is right about the market but too early is as wrong as the man who is wrong'],
      bestFor:'Understanding market psychology through the greatest speculator\'s real experiences.' },
    { title:'One Good Trade', author:'Mike Bellafiore', year:'2010', emoji:'💼', rating:'⭐⭐⭐⭐',
      summary:'Inside SMB Capital, a modern New York prop trading firm. The title captures the entire philosophy: focus on executing one trade at a time with maximum quality. Grade every trade on process, not outcome.',
      keyIdeas:['"One Good Trade" — focus entirely on the trade in front of you','Create a "Trade Playbook" of your best setups with exact rules','Process over outcome — a perfectly executed losing trade is a success','Review your trades like a professional athlete reviews film'],
      bestFor:'Active traders, especially those interested in day trading and prop trading.' },
  ];

  return books.map((b,i) => `
    <div class="card card-tappable a-fadeup" style="animation-delay:${i*.05}s;padding:16px;margin-bottom:12px" onclick="showBookDetail(${i})">
      <div style="display:flex;gap:12px;align-items:flex-start">
        <div style="font-size:40px;flex-shrink:0">${b.emoji}</div>
        <div style="flex:1">
          <div style="font-family:var(--display);font-weight:800;font-size:15px">${b.title}</div>
          <div style="font-size:11px;color:var(--txt2);margin-top:2px">${b.author} · ${b.year}</div>
          <div style="font-size:14px;margin-top:4px">${b.rating}</div>
        </div>
      </div>
      <div style="font-size:12px;color:var(--txt2);line-height:1.55;margin-top:10px">${b.summary.substring(0,120)}...</div>
      <div style="font-size:11px;color:var(--gold);margin-top:8px">📖 Best for: ${b.bestFor.substring(0,60)}...</div>
    </div>`).join('');

  // Store for detail view
  window._vaultBooks = books;
}

function showBookDetail(idx) {
  if (!window._vaultBooks) { renderBookSummaries(); }
  const b = window._vaultBooks[idx];
  if (!b) return;
  showModal(`<div class="modal-handle"></div>
    <div style="font-size:52px;text-align:center;margin-bottom:8px">${b.emoji}</div>
    <div style="font-family:var(--display);font-weight:800;font-size:20px;text-align:center">${b.title}</div>
    <div style="font-size:12px;color:var(--txt2);text-align:center;margin:4px 0 8px">${b.author} · ${b.year} · ${b.rating}</div>
    <div class="section-lbl">Summary</div>
    <p style="font-size:13px;color:var(--txt2);line-height:1.7;margin-bottom:14px">${b.summary}</p>
    <div class="section-lbl">Key Ideas</div>
    ${b.keyIdeas.map(idea => `<div style="display:flex;gap:8px;padding:8px 0;border-bottom:1px solid var(--bdr2)">
      <span style="color:var(--gold);flex-shrink:0">→</span>
      <span style="font-size:13px;color:var(--txt2);line-height:1.5">${idea}</span>
    </div>`).join('')}
    <div class="card card-gold" style="padding:12px;margin-top:14px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;color:var(--gold);font-family:var(--display);letter-spacing:1px;margin-bottom:4px">BEST FOR</div>
      <div style="font-size:13px;color:var(--txt2)">${b.bestFor}</div>
    </div>
    <button class="btn btn-gold" onclick="closeModal();addXP(20);showToast('📚 Book studied! +20 XP')">Add to Reading List +20 XP</button>
  `);
}

function renderBrokerGuide() {
  return `<div>
    <div class="card" style="padding:14px;margin-bottom:12px;background:var(--red-bg);border-color:var(--red-bdr)">
      <div style="font-size:13px;color:var(--txt2);line-height:1.6"><strong style="color:var(--red)">⚠️ Broker fraud is rampant in forex.</strong> More traders lose money to bad brokers than to bad strategies. Read this carefully.</div>
    </div>

    <div class="section-lbl">🚩 Scam Red Flags</div>
    ${['Guaranteed returns of 10%+ per week', 'Unregulated broker (check regulator register)', 'Withdrawal problems or excessive delays', 'Bonuses with hidden withdrawal conditions', '"Managed accounts" without proper regulation', 'Pressure to deposit quickly for "limited time" offer', 'Cannot find reviews or negative reviews deleted', 'Platform only (no MT4/MT5 — proprietary only platforms are often scam vehicles)'].map(f => `
      <div class="card" style="padding:10px;margin-bottom:6px;background:var(--red-bg);border-color:var(--red-bdr)">
        <div style="font-size:12px;color:var(--txt2)">🚩 ${f}</div>
      </div>`).join('')}

    <div class="section-lbl" style="margin-top:16px">✅ Legitimate Regulatory Bodies</div>
    ${[
      {name:'FCA (UK)', url:'register.fca.org.uk', tier:'Tier 1 — Highest protection'},
      {name:'ASIC (Australia)', url:'asic.gov.au', tier:'Tier 1 — Excellent protection'},
      {name:'CFTC/NFA (USA)', url:'nfa.futures.org', tier:'Tier 1 — Strictest rules'},
      {name:'CySEC (Cyprus)', url:'cysec.gov.cy', tier:'Tier 2 — Good protection'},
      {name:'FSCA (South Africa)', url:'fsca.co.za', tier:'Tier 2 — Decent protection'},
    ].map(r => `<div class="card" style="padding:12px;margin-bottom:8px">
      <div style="font-family:var(--display);font-weight:700;font-size:14px;color:var(--green)">${r.name}</div>
      <div style="font-size:11px;color:var(--txt3);margin-top:2px">${r.url}</div>
      <div style="font-size:11px;color:var(--txt2);margin-top:4px">${r.tier}</div>
    </div>`).join('')}
  </div>`;
}

function renderTaxGuide() {
  return `<div>
    <div class="card" style="padding:14px;margin-bottom:12px;background:var(--gold-bg);border-color:var(--bdr)">
      <div style="font-size:12px;color:var(--txt2);line-height:1.6">⚠️ This is general awareness only. Always consult a qualified tax professional in your jurisdiction before filing.</div>
    </div>

    <div class="section-lbl">General Principles</div>
    <div class="card" style="padding:14px;margin-bottom:12px">
      <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;color:var(--txt2)">
        <div>📝 <strong style="color:var(--txt)">Keep detailed records</strong> — dates, pairs, entry/exit, P&L. Your journal does this automatically.</div>
        <div>💰 <strong style="color:var(--txt)">Profits are almost always taxable</strong> — as capital gains or income tax, depending on jurisdiction.</div>
        <div>📉 <strong style="color:var(--txt)">Losses can offset gains</strong> — in most countries you can deduct trading losses against trading profits.</div>
        <div>🌐 <strong style="color:var(--txt)">Offshore brokers don't hide income</strong> — your home country tax authority can still require you to declare.</div>
      </div>
    </div>

    <div class="section-lbl">By Country Overview</div>
    ${[
      {country:'🇺🇸 United States', rule:'Section 1256: 60% long-term / 40% short-term capital gains on regulated futures. Spot forex under Section 988 as ordinary income. Mark-to-Market election available for professionals.'},
      {country:'🇬🇧 United Kingdom', rule:'Spread betting: completely TAX FREE. CFD/Spot forex: Capital Gains Tax. Annual CGT allowance (~£6,000). Above that: 10% (basic rate) or 20% (higher rate).'},
      {country:'🇿🇦 South Africa', rule:'All forex trading profits taxed as normal income tax. No capital gains treatment. SARS requires full disclosure. FSCA regulated brokers recommended.'},
      {country:'🇳🇬 Nigeria', rule:'FIRS taxes forex income as business income. Must be declared in annual returns. No specific forex tax law — general income tax applies.'},
      {country:'🇰🇪 Kenya', rule:'Capital gains tax applies. KRA requires declaration. Increasing scrutiny on forex traders receiving offshore transfers.'},
      {country:'🇦🇺 Australia', rule:'CGT applies. 50% discount if position held >12 months. Day traders taxed as business income. ATO actively audits large forex traders.'},
      {country:'🇨🇦 Canada', rule:'50% of capital gains are included in taxable income. Active traders may be classified as business income (100% taxable). CRA can assess based on trading frequency.'},
    ].map(c => `<div class="card" style="padding:12px;margin-bottom:8px">
      <div style="font-family:var(--display);font-weight:700;font-size:14px;margin-bottom:6px">${c.country}</div>
      <div style="font-size:12px;color:var(--txt2);line-height:1.6">${c.rule}</div>
    </div>`).join('')}
  </div>`;
}

/* ══════════════════════════════════════
   9. COGNITIVE BIAS TEST
   ══════════════════════════════════════ */

const BIAS_QUESTIONS = [
  { bias:'confirmation', question:'When I have a trade idea, I mostly look for information that supports it rather than challenges it.', weight:1 },
  { bias:'recency', question:'After a 5-trade winning streak, I feel like I am "on fire" and tend to trade bigger or more aggressively.', weight:1 },
  { bias:'lossAversion', question:'I find it much harder to close a losing trade than to close a winning one.', weight:1 },
  { bias:'overconfidence', question:'After studying for a few months, I felt ready to trade live much sooner than most people would recommend.', weight:1 },
  { bias:'gamblersFallacy', question:'After 5 losing trades in a row, I feel like a winning trade is now overdue.', weight:1 },
  { bias:'sunkCost', question:'I have held onto a losing trade much longer than planned because I had already been in it so long.', weight:1 },
  { bias:'anchoring', question:'I find it hard to move on from my entry price — even when the technical picture has completely changed.', weight:1 },
  { bias:'herding', question:'When I see many people in trading groups talking about a certain trade, it influences my decision to take it.', weight:1 },
  { bias:'confirmation', question:'I find it annoying when someone points out the flaws in my trading setup.', weight:1 },
  { bias:'overconfidence', question:'I believe I have above-average trading ability compared to other traders at my experience level.', weight:1 },
];

function renderBiasTest() {
  const answers = STATE.biasAnswers || {};
  const allAnswered = BIAS_QUESTIONS.every((q,i) => answers[i] !== undefined);

  if (allAnswered) {
    // Calculate bias scores
    const biasScores = {};
    BIAS_QUESTIONS.forEach((q,i) => {
      if (!biasScores[q.bias]) biasScores[q.bias] = 0;
      if (answers[i] >= 3) biasScores[q.bias] += q.weight * (answers[i] - 2);
    });

    const biasInfo = {
      confirmation: { name:'Confirmation Bias', emoji:'🔍', advice:'Actively seek out reasons NOT to take a trade. For every bullish argument, find one bearish argument. Devil\'s advocate thinking is your antidote.' },
      recency: { name:'Recency Bias', emoji:'🕐', advice:'Your recent 5 trades are statistically irrelevant. Focus on your 50+ trade performance data. A winning streak doesn\'t mean your edge has changed — neither does a losing streak.' },
      lossAversion: { name:'Loss Aversion', emoji:'😨', advice:'Reframe losses as the cost of doing business. A surgeon doesn\'t dwell on every complication — they improve and move on. Define your maximum loss before entering and accept it completely.' },
      overconfidence: { name:'Overconfidence Bias', emoji:'🦸', advice:'Every year you trade, the market will humble you at least once. Maintain constant respect for risk. The biggest losses come after the biggest winning streaks.' },
      gamblersFallacy: { name:"Gambler's Fallacy", emoji:'🎲', advice:'Every trade has the same statistical probability regardless of your last 10 trades. The market has no memory of your previous results. Treat every setup as if it is your first ever.' },
      sunkCost: { name:'Sunk Cost Fallacy', emoji:'⚓', advice:'The time you\'ve already been in a trade is completely irrelevant to your decision to stay or exit. Ask: If I had no position, would I enter this trade right now at this price? If no — exit.' },
      anchoring: { name:'Anchoring Bias', emoji:'⚓', advice:'Your entry price is meaningless to the market. Once you are in a trade, analyze price relative to structure and levels — not relative to where you entered.' },
      herding: { name:'Herding/Social Bias', emoji:'🐑', advice:'When everyone is talking about a trade, the move is usually already priced in. Contrarian awareness: ask "who is on the other side of this trade?"' },
    };

    const sortedBiases = Object.entries(biasScores).filter(b => b[1] > 0).sort((a,b) => b[1]-a[1]);

    return `<div class="screen-pad">
      <div class="pg-header a-fadeup" style="padding:0 0 14px">
        <div style="display:flex;gap:10px;align-items:center">
          <button class="back-btn" onclick="navigate('learn')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
          <div><h1 class="pg-title">Your Bias Report</h1><div style="font-size:12px;color:var(--txt2)">Cognitive bias analysis</div></div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="STATE.biasAnswers={};saveState();renderScreen('biastest')">Retake</button>
      </div>

      ${sortedBiases.length === 0 ? `
      <div class="card card-green" style="padding:20px;text-align:center">
        <div style="font-size:48px">🧠</div>
        <div style="font-family:var(--display);font-weight:800;font-size:18px;margin-top:10px">Exceptional Mindset!</div>
        <div style="font-size:13px;color:var(--txt2);margin-top:6px">Your responses suggest minimal cognitive bias. This is rare. Continue to journal and stay vigilant.</div>
      </div>` : `
      <div class="section-lbl a-fadeup2">Your Strongest Biases (Most Impactful First)</div>
      ${sortedBiases.map(([bias, score], i) => {
        const info = biasInfo[bias];
        if (!info) return '';
        const intensity = score >= 3 ? 'High' : score >= 2 ? 'Medium' : 'Low';
        const col = score >= 3 ? 'var(--red)' : score >= 2 ? 'var(--orange)' : 'var(--gold)';
        return `<div class="card a-fadeup" style="animation-delay:${i*.07}s;padding:16px;margin-bottom:12px;border-color:${col}44;background:${col}08">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:28px">${info.emoji}</span>
              <div>
                <div style="font-family:var(--display);font-weight:700;font-size:15px">${info.name}</div>
                <span class="pill" style="font-size:9px;background:${col}22;color:${col};border-color:${col}44">${intensity} Impact</span>
              </div>
            </div>
          </div>
          <div class="card" style="padding:10px;background:var(--gold-bg);border-color:var(--bdr)">
            <div style="font-size:11px;font-weight:700;color:var(--gold);font-family:var(--display);letter-spacing:1px;margin-bottom:5px">🎯 HOW TO FIX IT</div>
            <div style="font-size:12px;color:var(--txt2);line-height:1.6">${info.advice}</div>
          </div>
        </div>`;
      }).join('')}`}
    </div>`;
  }

  return `<div class="screen-pad">
    <div class="pg-header a-fadeup" style="padding:0 0 14px">
      <div style="display:flex;gap:10px;align-items:center">
        <button class="back-btn" onclick="navigate('learn')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div><h1 class="pg-title">Cognitive Bias Test</h1><div style="font-size:12px;color:var(--txt2)">Discover your hidden biases</div></div>
      </div>
      <span class="pill pill-gold">${Object.keys(answers).length}/${BIAS_QUESTIONS.length}</span>
    </div>
    <p style="font-size:13px;color:var(--txt2);margin-bottom:14px;line-height:1.6">Answer honestly — these biases affect EVERY trader. Knowing yours is the first step to neutralizing them. Rate 1-5 (1=Never, 5=Always)</p>
    ${BIAS_QUESTIONS.map((q,i) => `
      <div class="card a-fadeup" style="animation-delay:${i*.03}s;padding:14px;margin-bottom:10px">
        <div style="font-size:13px;font-weight:600;margin-bottom:12px;line-height:1.5">${i+1}. ${q.question}</div>
        <div style="display:flex;gap:4px">
          ${[1,2,3,4,5].map(v => `<button onclick="setBiasAnswer(${i},${v})" style="flex:1;padding:10px 0;border-radius:var(--rs);border:2px solid ${answers[i]===v?'var(--gold)':'var(--bdr2)'};background:${answers[i]===v?'var(--gold-bg)':'var(--bg4)'};color:${answers[i]===v?'var(--gold)':'var(--txt2)'};font-family:var(--display);font-weight:700;font-size:12px;cursor:pointer;transition:all .15s">${v}</button>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--txt3);margin-top:4px;padding:0 2px">
          <span>Never</span><span>Always</span>
        </div>
      </div>`).join('')}
    ${Object.keys(answers).length === BIAS_QUESTIONS.length ? `
      <button class="btn btn-gold" onclick="renderScreen('biastest')">View My Bias Report →</button>
    ` : ''}
  </div>`;
}

function setBiasAnswer(qIdx, val) {
  if (!STATE.biasAnswers) STATE.biasAnswers = {};
  STATE.biasAnswers[qIdx] = val;
  saveState();
  renderScreen('biastest');
}



══════════════════════
   

/* ═══ V6 FULL ANALYTICS + BEHAVIOR TRACKING ═══ */
TRADEBABY PRO v6 — ANALYTICS, FLOATING AI, NEW LESSONS
   ═══════════════════════════════════════════════════════ */

// ── BEHAVIOR TRACKING ──
const BEHAVIOR = {
  log(type, data = {}) {
    if (!STATE.behaviorLog) STATE.behaviorLog = [];
    STATE.behaviorLog.push({
      type, data,
      time: new Date().toISOString(),
      screen: STATE.screen,
      hour: new Date().getHours(),
      day: new Date().getDay(),
    });
    // Keep last 500 events
    if (STATE.behaviorLog.length > 500) STATE.behaviorLog = STATE.behaviorLog.slice(-500);
    saveState();
  },
  getScreenTime() {
    const log = STATE.behaviorLog || [];
    const screenTime = {};
    log.filter(e => e.type === 'screen_visit').forEach(e => {
      const s = e.data.screen || e.screen;
      screenTime[s] = (screenTime[s] || 0) + 1;
    });
    return screenTime;
  },
  getMostActiveHour() {
    const log = STATE.behaviorLog || [];
    const hours = {};
    log.forEach(e => { hours[e.hour] = (hours[e.hour] || 0) + 1; });
    return Object.entries(hours).sort((a,b) => b[1]-a[1])[0]?.[0];
  },
  getMostActivePair() {
    const all = [...(STATE.journal||[]), ...(STATE.simTrades||[])];
    const pairs = {};
    all.forEach(t => { if(t.pair) pairs[t.pair] = (pairs[t.pair]||0)+1; });
    return Object.entries(pairs).sort((a,b)=>b[1]-a[1])[0]?.[0];
  },
  getStudyStreak() { return STATE.dailyStreak || 0; },
  getPsychologyScore() {
    const j = STATE.journal || [];
    if (!j.length) return null;
    const calm = j.filter(t => t.mood === 'neutral' || t.mood === 'confident').length;
    const emotional = j.filter(t => ['revenge','frustrated','greedy'].includes(t.mood)).length;
    return Math.round((calm / j.length) * 100);
  },
  getTimeOfDayPerformance() {
    const all = [...(STATE.journal||[])].filter(t => t.date && t.pnl);
    const buckets = { morning:[], afternoon:[], evening:[], night:[] };
    all.forEach(t => {
      const h = new Date(t.date).getHours();
      const pnl = parseFloat(t.pnl)||0;
      if (h >= 6 && h < 12) buckets.morning.push(pnl);
      else if (h >= 12 && h < 17) buckets.afternoon.push(pnl);
      else if (h >= 17 && h < 21) buckets.evening.push(pnl);
      else buckets.night.push(pnl);
    });
    const avg = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null;
    return { morning: avg(buckets.morning), afternoon: avg(buckets.afternoon), evening: avg(buckets.evening), night: avg(buckets.night) };
  },
  getDayOfWeekPerformance() {
    const all = [...(STATE.journal||[])].filter(t => t.date && t.pnl);
    const days = {0:[],1:[],2:[],3:[],4:[],5:[],6:[]};
    const names = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    all.forEach(t => {
      const d = new Date(t.date).getDay();
      days[d].push(parseFloat(t.pnl)||0);
    });
    return Object.entries(days).map(([d,arr]) => ({
      day: names[d],
      avg: arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0,
      count: arr.length,
      wins: arr.filter(p=>p>0).length,
    }));
  },
  getMoodWinRate() {
    const j = STATE.journal || [];
    const moods = {};
    j.forEach(t => {
      const m = t.mood || 'neutral';
      if (!moods[m]) moods[m] = { wins:0, total:0 };
      moods[m].total++;
      if (parseFloat(t.pnl) > 0) moods[m].wins++;
    });
    return Object.entries(moods).map(([mood,d]) => ({
      mood,
      winRate: Math.round(d.wins/d.total*100),
      count: d.total,
    })).sort((a,b)=>b.count-a.count);
  },
  getPairPerformance() {
    const all = [...(STATE.journal||[]), ...(STATE.simTrades||[])].filter(t=>t.pair&&t.pnl);
    const pairs = {};
    all.forEach(t => {
      const p = t.pair;
      if (!pairs[p]) pairs[p] = {pnl:0,count:0,wins:0};
      pairs[p].pnl += parseFloat(t.pnl)||0;
      pairs[p].count++;
      if (parseFloat(t.pnl)>0) pairs[p].wins++;
    });
    return Object.entries(pairs).map(([pair,d])=>({
      pair,pnl:d.pnl,count:d.count,
      winRate: Math.round(d.wins/d.count*100)
    })).sort((a,b)=>b.count-a.count);
  },
  getSetupPerformance() {
    const j = (STATE.journal||[]).filter(t=>t.setup&&t.pnl);
    const setups = {};
    j.forEach(t=>{
      const s = t.setup;
      if(!setups[s]) setups[s]={pnl:0,count:0,wins:0};
      setups[s].pnl+=parseFloat(t.pnl)||0;
      setups[s].count++;
      if(parseFloat(t.pnl)>0) setups[s].wins++;
    });
    return Object.entries(setups).map(([setup,d])=>({
      setup, pnl:d.pnl, count:d.count,
      winRate:Math.round(d.wins/d.count*100)
    })).sort((a,b)=>b.count-a.count);
  }
};


// ── FULL ANALYTICS SCREEN ──
function renderAnalytics() {
  const tabs = ['Overview','Behavior','Psychology','Pairs','Timing','Progress'];
  if (!STATE.analyticTab) STATE.analyticTab = 0;
  const tab = STATE.analyticTab;

  return `<div class="screen-pad">
    <div class="pg-header a-fadeup" style="padding:0 0 12px">
      <div style="display:flex;gap:10px;align-items:center">
        <button class="back-btn" onclick="navigate('profile')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
        <div><h1 class="pg-title">Analytics</h1><div style="font-size:12px;color:var(--txt2)">Deep trader intelligence</div></div>
      </div>
    </div>

    <div class="h-scroll a-fadeup2" style="margin-bottom:14px">
      ${tabs.map((t,i)=>`<button onclick="STATE.analyticTab=${i};renderScreen('analytics')" style="flex-shrink:0;padding:7px 14px;border-radius:20px;font-size:11px;font-weight:700;font-family:var(--display);cursor:pointer;border:1.5px solid var(--bdr2);background:${tab===i?'var(--gold)':'var(--bg3)'};color:${tab===i?'#0A0A0F':'var(--txt2)'};transition:all .15s">${t}</button>`).join('')}
    </div>

    <div class="a-fadeup3">
      ${tab===0 ? renderAnalyticsOverview() :
        tab===1 ? renderBehaviorTab() :
        tab===2 ? renderPsychologyTab() :
        tab===3 ? renderPairsTab() :
        tab===4 ? renderTimingTab() :
        renderProgressTab()}
    </div>
  </div>`;
}

function renderAnalyticsOverview() {
  const trades = [...(STATE.journal||[]), ...(STATE.simTrades||[])];
  const wins = trades.filter(t=>parseFloat(t.pnl)>0);
  const losses = trades.filter(t=>parseFloat(t.pnl)<0);
  const totalPnl = trades.reduce((a,t)=>a+(parseFloat(t.pnl)||0),0);
  const wr = trades.length ? Math.round(wins.length/trades.length*100) : 0;
  const avgW = wins.length ? wins.reduce((a,t)=>a+(parseFloat(t.pnl)||0),0)/wins.length : 0;
  const avgL = losses.length ? Math.abs(losses.reduce((a,t)=>a+(parseFloat(t.pnl)||0),0)/losses.length) : 1;
  const pf = losses.length ? ((avgW*wins.length)/(avgL*losses.length)).toFixed(2) : '∞';
  const psychScore = BEHAVIOR.getPsychologyScore();
  const dna = calculateTraderDNA();

  return `
    <!-- KPI Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div class="stat-box" style="grid-column:span 2;background:linear-gradient(135deg,var(--gold-d),var(--gold));padding:16px">
        <div style="display:flex;justify-content:space-between;align-items:flex-end">
          <div>
            <div style="font-size:11px;color:rgba(10,10,15,0.7);font-family:var(--display);letter-spacing:1px;font-weight:700">TOTAL P&L</div>
            <div style="font-family:var(--display);font-weight:800;font-size:32px;color:#0A0A0F;margin-top:2px">${totalPnl>=0?'+':''}$${Math.abs(totalPnl).toFixed(0)}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:11px;color:rgba(10,10,15,0.6)">${trades.length} total trades</div>
            <div style="font-size:20px;font-family:var(--display);font-weight:800;color:#0A0A0F">${wr}% WR</div>
          </div>
        </div>
      </div>
      <div class="stat-box"><div class="stat-val" style="color:var(--green)">$${avgW.toFixed(0)}</div><div class="stat-lbl">Avg Win</div></div>
      <div class="stat-box"><div class="stat-val" style="color:var(--red)">$${avgL.toFixed(0)}</div><div class="stat-lbl">Avg Loss</div></div>
      <div class="stat-box"><div class="stat-val" style="color:${parseFloat(pf)>=1.5?'var(--green)':parseFloat(pf)>=1?'var(--gold)':'var(--red)'}">${pf}</div><div class="stat-lbl">Profit Factor</div></div>
      <div class="stat-box"><div class="stat-val">${STATE.dailyStreak}🔥</div><div class="stat-lbl">Streak</div></div>
    </div>

    <!-- Equity Curve -->
    <div class="section-lbl">Equity Curve</div>
    <div class="card" style="padding:0;overflow:hidden;margin-bottom:14px;height:160px">
      <canvas id="equity-chart" style="width:100%;height:160px"></canvas>
    </div>

    <!-- Psychology Score -->
    ${psychScore !== null ? `
    <div class="section-lbl">Psychology Health</div>
    <div class="card" style="padding:14px;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:14px">
        <div style="width:60px;height:60px;border-radius:50%;background:conic-gradient(${psychScore>=70?'var(--green)':psychScore>=40?'var(--gold)':'var(--red)'} ${psychScore*3.6}deg, var(--bg4) 0deg);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <div style="width:46px;height:46px;border-radius:50%;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:800;font-size:15px;color:${psychScore>=70?'var(--green)':psychScore>=40?'var(--gold)':'var(--red)'}">${psychScore}%</div>
        </div>
        <div>
          <div style="font-family:var(--display);font-weight:700;font-size:15px">Emotional Trading Score</div>
          <div style="font-size:12px;color:var(--txt2);margin-top:4px;line-height:1.5">${psychScore>=70?'Excellent! You trade with emotional discipline most of the time.':psychScore>=40?'Room for improvement. Track your emotional states more closely.':'Emotions are significantly impacting your trading results.'}</div>
        </div>
      </div>
    </div>` : ''}

    <!-- DNA snapshot -->
    ${dna ? `
    <div class="section-lbl">Trader DNA Snapshot</div>
    <div class="card card-tappable" style="padding:14px;margin-bottom:14px;display:flex;align-items:center;gap:12px" onclick="navigate('dna')">
      <div style="font-size:36px">${(TRADER_ARCHETYPES[dna.archetype]||{}).emoji||'🧬'}</div>
      <div style="flex:1">
        <div style="font-family:var(--display);font-weight:700;font-size:14px">${dna.archetype}</div>
        <div style="font-size:12px;color:var(--txt2);margin-top:2px">Tap for full DNA profile</div>
      </div>
      <span style="color:var(--gold)">→</span>
    </div>` : ''}

    <!-- Challenges quick view -->
    <div class="section-lbl">Active Challenges</div>
    <div class="card card-tappable" style="padding:14px;display:flex;align-items:center;gap:12px" onclick="navigate('challenges')">
      <div style="font-size:28px">🏆</div>
      <div style="flex:1">
        <div style="font-family:var(--display);font-weight:700;font-size:14px">${CHALLENGES.filter(c=>getChallengeProgress(c)>=c.target).length}/${CHALLENGES.length} challenges complete</div>
        <div style="font-size:12px;color:var(--txt2);margin-top:2px">Tap to view all challenges</div>
      </div>
      <span style="color:var(--gold)">→</span>
    </div>
  `;
}

function renderBehaviorTab() {
  const screenTime = BEHAVIOR.getScreenTime();
  const mostActive = BEHAVIOR.getMostActiveHour();
  const sessions = Object.entries(screenTime).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const setupPerf = BEHAVIOR.getSetupPerformance();
  const behaviorLog = STATE.behaviorLog || [];

  return `
    <div class="section-lbl">App Usage Patterns</div>
    <div class="card" style="padding:14px;margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <div>
          <div style="font-family:var(--display);font-weight:700;font-size:16px">${behaviorLog.length}</div>
          <div style="font-size:11px;color:var(--txt2)">Total interactions</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--display);font-weight:700;font-size:16px">${mostActive ? (parseInt(mostActive) < 12 ? mostActive + ':00 AM' : (parseInt(mostActive)-12||12) + ':00 PM') : '—'}</div>
          <div style="font-size:11px;color:var(--txt2)">Most active hour</div>
        </div>
      </div>
      ${sessions.length > 0 ? `
      <div class="section-lbl" style="margin-bottom:8px">Most Visited Screens</div>
      ${sessions.map(([screen,count]) => {
        const max = sessions[0][1];
        return `<div style="margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span style="text-transform:capitalize">${screen}</span>
            <span style="color:var(--gold);font-family:var(--mono)">${count} visits</span>
          </div>
          <div class="prog-bar sm"><div class="prog-fill" style="width:${Math.round(count/max*100)}%"></div></div>
        </div>`;
      }).join('')}` : '<div style="text-align:center;padding:20px;color:var(--txt3)">Keep using the app to generate behavior data</div>'}
    </div>

    <div class="section-lbl">Setup Performance</div>
    ${setupPerf.length > 0 ? `
    <div class="card" style="padding:14px;margin-bottom:14px">
      ${setupPerf.map(s => `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--bdr2)">
        <div>
          <div style="font-size:13px;font-weight:600">${s.setup}</div>
          <div style="font-size:10px;color:var(--txt3)">${s.count} trades</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:13px;color:${s.pnl>=0?'var(--green)':'var(--red)'};font-family:var(--mono)">${s.pnl>=0?'+':''}$${s.pnl.toFixed(0)}</div>
          <div style="font-size:10px;color:var(--txt3)">${s.winRate}% WR</div>
        </div>
      </div>`).join('')}
    </div>` : '<div class="card" style="padding:14px;text-align:center;color:var(--txt3);margin-bottom:14px">Log trades with setup types to see performance data</div>'}

    <div class="card card-gold" style="padding:14px">
      <div style="font-size:11px;font-weight:700;color:var(--gold);font-family:var(--display);letter-spacing:1px;margin-bottom:6px">🤖 AI BEHAVIOR INSIGHT</div>
      <div style="font-size:13px;color:var(--txt2);line-height:1.65">${generateBehaviorInsight()}</div>
    </div>
  `;
}

function renderPsychologyTab() {
  const moodWR = BEHAVIOR.getMoodWinRate();
  const j = STATE.journal || [];
  const revengeCount = j.filter(t=>t.mood==='revenge').length;
  const fomoCount = j.filter(t=>(t.notes||'').toLowerCase().includes('fomo')).length;
  const planFollowed = j.filter(t=>t.plan==='yes').length;
  const planBroken = j.filter(t=>t.plan==='no').length;
  const psychScore = BEHAVIOR.getPsychologyScore() || 0;

  return `
    <div class="section-lbl">Mood vs Win Rate</div>
    <div class="card" style="padding:14px;margin-bottom:14px">
      ${moodWR.length > 0 ? moodWR.map(m => {
        const moodEmoji = {neutral:'😐',confident:'😊',fearful:'😰',greedy:'🤑',frustrated:'😤',revenge:'😠'};
        const col = m.winRate >= 55 ? 'var(--green)' : m.winRate >= 40 ? 'var(--gold)' : 'var(--red)';
        return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--bdr2)">
          <span style="font-size:22px;flex-shrink:0">${moodEmoji[m.mood]||'😐'}</span>
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:13px;text-transform:capitalize;font-weight:600">${m.mood}</span>
              <span style="font-size:13px;color:${col};font-family:var(--mono)">${m.winRate}% WR</span>
            </div>
            <div class="prog-bar sm"><div class="prog-fill" style="width:${m.winRate}%;background:${col}"></div></div>
            <div style="font-size:10px;color:var(--txt3);margin-top:2px">${m.count} trades in this state</div>
          </div>
        </div>`;
      }).join('') : '<div style="text-align:center;padding:20px;color:var(--txt3)">Log trades with mood data to see this analysis</div>'}
    </div>

    <div class="section-lbl">Discipline Metrics</div>
    <div class="stat-grid" style="margin-bottom:14px">
      <div class="stat-box"><div class="stat-val" style="color:var(--green)">${planFollowed}</div><div class="stat-lbl">Plan Followed</div></div>
      <div class="stat-box"><div class="stat-val" style="color:var(--red)">${planBroken}</div><div class="stat-lbl">Plan Broken</div></div>
      <div class="stat-box"><div class="stat-val" style="color:var(--red)">${revengeCount}</div><div class="stat-lbl">Revenge Trades</div></div>
      <div class="stat-box"><div class="stat-val" style="color:var(--orange)">${fomoCount}</div><div class="stat-lbl">FOMO Entries</div></div>
    </div>

    <div class="section-lbl">Psychology Health Score</div>
    <div class="card" style="padding:16px;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">
        <div style="position:relative;width:70px;height:70px;flex-shrink:0">
          <svg viewBox="0 0 36 36" style="width:70px;height:70px;transform:rotate(-90deg)">
            <circle cx="18" cy="18" r="16" fill="none" stroke="var(--bg4)" stroke-width="3.5"/>
            <circle cx="18" cy="18" r="16" fill="none" stroke="${psychScore>=70?'var(--green)':psychScore>=40?'var(--gold)':'var(--red)'}" stroke-width="3.5" stroke-dasharray="${psychScore} 100" stroke-linecap="round"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:800;font-size:15px;color:${psychScore>=70?'var(--green)':psychScore>=40?'var(--gold)':'var(--red)'}">${psychScore}%</div>
        </div>
        <div>
          <div style="font-family:var(--display);font-weight:700;font-size:16px">Emotional Control</div>
          <div style="font-size:12px;color:var(--txt2);margin-top:4px;line-height:1.5">${psychScore>=70?'You trade with strong emotional discipline.':psychScore>=40?'Moderate control. Work on reducing reactive trades.':'Your emotions are frequently overriding your plan.'}</div>
        </div>
      </div>
      <div style="font-size:12px;color:var(--txt2);padding:10px;background:var(--bg4);border-radius:var(--rs);line-height:1.6">
        💡 ${psychScore>=70?'Keep journaling every trade. Your emotional data is one of your biggest edges.':'Every time you note your mood before trading, you build self-awareness. The data shows what conditions lead to your best performance.'}
      </div>
    </div>
  `;
}

function renderPairsTab() {
  const pairPerf = BEHAVIOR.getPairPerformance();

  return `
    <div class="section-lbl">Performance by Pair</div>
    ${pairPerf.length > 0 ? `
    <div class="card" style="padding:14px;margin-bottom:14px">
      ${pairPerf.map(p => {
        const up = p.pnl >= 0;
        return `<div style="padding:10px 0;border-bottom:1px solid var(--bdr2)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <div>
              <strong style="font-family:var(--display);font-size:14px">${p.pair}</strong>
              <span style="font-size:10px;color:var(--txt3);margin-left:6px">${p.count} trades</span>
            </div>
            <div style="text-align:right">
              <div style="font-size:14px;color:${up?'var(--green)':'var(--red)'};font-family:var(--mono);font-weight:600">${up?'+':''}$${p.pnl.toFixed(0)}</div>
              <div style="font-size:10px;color:var(--txt3)">${p.winRate}% win rate</div>
            </div>
          </div>
          <div style="display:flex;gap:2px;height:6px">
            <div style="flex:${p.winRate};background:var(--green);border-radius:3px 0 0 3px"></div>
            <div style="flex:${100-p.winRate};background:var(--red);border-radius:0 3px 3px 0"></div>
          </div>
        </div>`;
      }).join('')}
    </div>` : '<div class="card" style="padding:20px;text-align:center;color:var(--txt3);margin-bottom:14px">Trade different pairs and log them to see performance comparison</div>'}

    <div class="section-lbl">Pair Recommendation</div>
    <div class="card card-gold" style="padding:14px">
      <div style="font-size:11px;font-weight:700;color:var(--gold);font-family:var(--display);letter-spacing:1px;margin-bottom:8px">🎯 SPECIALIZE TO IMPROVE</div>
      <div style="font-size:13px;color:var(--txt2);line-height:1.65">
        ${pairPerf.length > 0 ?
          `Your best pair by P&L is <strong style="color:var(--gold)">${pairPerf.sort((a,b)=>b.pnl-a.pnl)[0]?.pair}</strong> and your most traded pair is <strong style="color:var(--gold)">${pairPerf[0]?.pair}</strong>. Professional traders typically specialize in 1-3 pairs maximum. Deep specialization beats shallow breadth every time.` :
          'Log trades with pair data to get personalized pair recommendations based on your performance.'}
      </div>
    </div>
  `;
}

function renderTimingTab() {
  const todPerf = BEHAVIOR.getTimeOfDayPerformance();
  const dowPerf = BEHAVIOR.getDayOfWeekPerformance();
  const timeLabels = {morning:'☀️ Morning (6am-12pm)', afternoon:'🌤️ Afternoon (12pm-5pm)', evening:'🌆 Evening (5pm-9pm)', night:'🌙 Night (9pm-6am)'};

  const validTOD = Object.entries(todPerf).filter(([,v])=>v!==null);
  const bestTOD = validTOD.sort((a,b)=>b[1]-a[1])[0];
  const worstTOD = validTOD.sort((a,b)=>a[1]-b[1])[0];

  const bestDOW = dowPerf.filter(d=>d.count>0).sort((a,b)=>b.avg-a.avg)[0];
  const worstDOW = dowPerf.filter(d=>d.count>0).sort((a,b)=>a.avg-b.avg)[0];

  return `
    <div class="section-lbl">Performance by Time of Day</div>
    <div class="card" style="padding:14px;margin-bottom:14px">
      ${validTOD.length > 0 ? validTOD.sort((a,b)=>b[1]-a[1]).map(([time, avg]) => {
        const col = avg > 0 ? 'var(--green)' : avg < 0 ? 'var(--red)' : 'var(--txt3)';
        return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--bdr2)">
          <span style="font-size:13px">${timeLabels[time]}</span>
          <span style="font-family:var(--mono);font-size:13px;color:${col}">${avg>0?'+':''}$${avg.toFixed(2)} avg</span>
        </div>`;
      }).join('') : '<div style="text-align:center;padding:20px;color:var(--txt3)">Log more journal entries with timestamps to see time-of-day analysis</div>'}
    </div>

    <div class="section-lbl">Performance by Day of Week</div>
    <div class="card" style="padding:14px;margin-bottom:14px">
      ${dowPerf.filter(d=>d.count>0).length > 0 ? `
      <div style="display:flex;gap:4px;align-items:flex-end;height:80px;margin-bottom:8px">
        ${dowPerf.map(d => {
          const maxAbs = Math.max(...dowPerf.map(x=>Math.abs(x.avg)), 1);
          const h = d.count > 0 ? Math.round(Math.abs(d.avg)/maxAbs*70) : 4;
          const col = d.avg>0?'var(--green)':d.avg<0?'var(--red)':'var(--bg4)';
          return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
            <div style="width:100%;background:${col};border-radius:3px 3px 0 0;height:${h}px;min-height:4px"></div>
            <div style="font-size:9px;color:var(--txt3);font-family:var(--display);font-weight:700">${d.day}</div>
          </div>`;
        }).join('')}
      </div>
      ${dowPerf.filter(d=>d.count>0).map(d=>`
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--bdr3)">
          <span style="font-size:12px;font-weight:600">${d.day}</span>
          <div style="display:flex;gap:10px;font-size:12px">
            <span style="color:var(--txt3)">${d.count} trades</span>
            <span style="color:${d.avg>=0?'var(--green)':'var(--red)'};font-family:var(--mono)">${d.avg>=0?'+':''}$${d.avg.toFixed(1)}</span>
          </div>
        </div>`).join('')}` : '<div style="text-align:center;padding:20px;color:var(--txt3)">Trade across multiple days to see day-of-week patterns</div>'}
    </div>

    ${bestDOW || bestTOD ? `
    <div class="card card-gold" style="padding:14px">
      <div style="font-size:11px;font-weight:700;color:var(--gold);font-family:var(--display);letter-spacing:1px;margin-bottom:8px">⏰ TIMING INTELLIGENCE</div>
      <div style="font-size:13px;color:var(--txt2);line-height:1.65">
        ${bestDOW ? `Your best trading day is <strong style="color:var(--green)">${bestDOW.day}</strong> with avg $${bestDOW.avg.toFixed(1)} per trade. ` : ''}
        ${worstDOW && worstDOW.avg < 0 ? `Avoid trading on <strong style="color:var(--red)">${worstDOW.day}</strong> — your data shows it is your worst day. ` : ''}
        ${bestTOD ? `You perform best in the <strong style="color:var(--green)">${bestTOD[0]}</strong> session. ` : ''}
        Trade when your data says to trade.
      </div>
    </div>` : ''}
  `;
}

function renderProgressTab() {
  const pct = progressPct();
  const lessonsLeft = totalLessons() - completedCount();
  const xpToNext = STATE.user.xpNext - STATE.user.xp;
  const pathId = getAssignedPath();
  const path = CURRICULUM_PATHS[pathId];
  const pathDone = path ? path.lessonOrder.filter(id=>STATE.progress[id]).length : 0;
  const pathTotal = path ? path.lessonOrder.length : 1;

  return `
    <div class="section-lbl">Learning Progress</div>
    <div class="card" style="padding:16px;margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:13px;font-weight:600">Overall Curriculum</span>
        <span style="font-size:13px;color:var(--gold);font-family:var(--mono)">${completedCount()}/${totalLessons()}</span>
      </div>
      <div class="prog-bar lg" style="margin-bottom:6px"><div class="prog-fill" style="width:${pct}%"></div></div>
      <div style="font-size:11px;color:var(--txt3)">${lessonsLeft} lessons remaining</div>
    </div>

    <div class="card" style="padding:16px;margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:13px;font-weight:600">My Path: ${path?.name||'—'}</span>
        <span style="font-size:13px;color:var(--gold);font-family:var(--mono)">${pathDone}/${pathTotal}</span>
      </div>
      <div class="prog-bar lg" style="margin-bottom:6px"><div class="prog-fill" style="width:${Math.round(pathDone/pathTotal*100)}%"></div></div>
    </div>

    <div class="stat-grid" style="margin-bottom:14px">
      <div class="stat-box"><div class="stat-val">Lv${STATE.user.level}</div><div class="stat-lbl">Level</div></div>
      <div class="stat-box"><div class="stat-val" style="color:var(--gold)">${STATE.user.xp}</div><div class="stat-lbl">Total XP</div></div>
      <div class="stat-box"><div class="stat-val">${xpToNext}</div><div class="stat-lbl">XP to Next</div></div>
      <div class="stat-box"><div class="stat-val">${STATE.achievements.length}</div><div class="stat-lbl">Badges</div></div>
    </div>

    <div class="section-lbl">Curriculum by Subject</div>
    <div class="card" style="padding:14px;margin-bottom:14px">
      ${CURRICULUM.map(cat=>{
        const done = cat.lessons.filter(l=>STATE.progress[l.id]).length;
        const p = Math.round(done/cat.lessons.length*100);
        return `<div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span>${cat.emoji} ${cat.title}</span>
            <span style="color:${p===100?'var(--green)':'var(--gold)'};font-family:var(--mono)">${done}/${cat.lessons.length}</span>
          </div>
          <div class="prog-bar"><div class="prog-fill" style="width:${p}%;background:${p===100?'var(--green)':'var(--gold)'}"></div></div>
        </div>`;
      }).join('')}
    </div>
  `;
}

function generateBehaviorInsight() {
  const j = STATE.journal || [];
  const t = STATE.simTrades || [];
  const total = j.length + t.length;
  if (total < 5) return 'Keep logging trades and using the app — the more data you generate, the more precise your behavioral analysis becomes.';

  const insights = [];
  const screenTime = BEHAVIOR.getScreenTime();
  const topScreen = Object.entries(screenTime).sort((a,b)=>b[1]-a[1])[0];
  if (topScreen) insights.push(`You spend the most time on the <strong>${topScreen[0]}</strong> screen.`);

  const revengeCount = j.filter(t=>t.mood==='revenge').length;
  if (revengeCount > 0) insights.push(`You've logged <strong style="color:var(--red)">${revengeCount} revenge trades</strong> — these are statistically your worst entries.`);

  const moodWR = BEHAVIOR.getMoodWinRate();
  const bestMood = moodWR.sort((a,b)=>b.winRate-a.winRate)[0];
  if (bestMood && bestMood.count >= 3) insights.push(`You win <strong style="color:var(--green)">${bestMood.winRate}%</strong> of trades when feeling <strong>${bestMood.mood}</strong>.`);

  const pairPerf = BEHAVIOR.getPairPerformance();
  const bestPair = pairPerf.sort((a,b)=>b.pnl-a.pnl)[0];
  if (bestPair) insights.push(`Your most profitable pair is <strong style="color:var(--gold)">${bestPair.pair}</strong> with $${bestPair.pnl.toFixed(0)} total.`);

  return insights.join(' ') || 'Log more trades to unlock personalized behavioral insights.';
}

// ── 

/* ═══ V6 FLOATING CHAT ═══ */
FLOATING CHAT SYSTEM ──
let _floatOpen = false;
let _floatHistory = [];

function toggleFloatChat() {
  _floatOpen = !_floatOpen;
  const panel = document.getElementById('float-chat-panel');
  const btn = document.getElementById('float-btn');
  if (!panel) return;
  if (_floatOpen) {
    panel.classList.add('open');
    panel.style.display = 'flex';
    if (_floatHistory.length === 0) initFloatChat();
    setTimeout(() => document.getElementById('float-input')?.focus(), 300);
    BEHAVIOR.log('float_chat_open');
  } else {
    panel.classList.remove('open');
    panel.style.display = 'none';
  }
}

function initFloatChat() {
  const dna = calculateTraderDNA();
  const name = STATE.user.name || 'Trader';
  const greeting = dna
    ? `Hey ${name}! I know your full profile — you're <strong>${dna.archetype}</strong> with ${completedCount()} lessons done. I can see your journal (${STATE.journal.length} entries), sim trades (${STATE.simTrades.length} trades), and everything happening in the app. What do you need?`
    : `Hey ${name}! I'm TradeMind — your intelligent trading companion. I know everything about this app and I'm tracking your progress. Log some trades and I'll start giving you personalized insights. What can I help with?`;

  addFloatMsg('bot', greeting);
  renderFloatSuggestions();
}

function renderFloatSuggestions() {
  const container = document.getElementById('float-suggestions');
  if (!container) return;
  const dna = calculateTraderDNA();
  const suggestions = [
    'My biggest weakness?',
    'Best pair for me?',
    dna ? `Fix my ${getLowestSkill(dna.scores)}` : 'Analyse my trades',
    'When to trade today?',
    'Quick psychology tip',
    'My win rate details',
  ];
  container.innerHTML = suggestions.map(s =>
    `<div class="float-suggestion" onclick="sendFloatQuick('${s.replace(/'/g,"\'")}')">${s}</div>`
  ).join('');
}

function addFloatMsg(role, text) {
  _floatHistory.push({role, text});
  const container = document.getElementById('float-messages');
  if (!container) return;
  const div = document.createElement('div');
  div.className = `float-msg ${role}`;
  div.innerHTML = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function sendFloatQuick(text) {
  const input = document.getElementById('float-input');
  if (input) input.value = text;
  sendFloatMsg();
}

function sendFloatMsg() {
  const input = document.getElementById('float-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  addFloatMsg('user', text);
  BEHAVIOR.log('float_chat_msg', { text: text.substring(0,50) });

  // Show typing
  const container = document.getElementById('float-messages');
  const typDiv = document.createElement('div');
  typDiv.className = 'float-msg bot';
  typDiv.id = 'float-typing';
  typDiv.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
  container?.appendChild(typDiv);
  container.scrollTop = container.scrollHeight;

  const delay = 400 + Math.random() * 600;
  setTimeout(() => {
    document.getElementById('float-typing')?.remove();
    const response = generateFloatResponse(text);
    addFloatMsg('bot', response);
    addXP(1);
  }, delay);
}

function generateFloatResponse(input) {
  const q = input.toLowerCase().trim();
  const dna = calculateTraderDNA();
  const j = STATE.journal || [];
  const t = STATE.simTrades || [];
  const name = STATE.user.name || 'Trader';

  // ── HIGHLY PERSONALIZED RESPONSES ──
  if (q.match(/weakness|wrong|losing|problem|issue|fix me/)) {
    if (!dna) return 'Log at least 5 trades and I can tell you exactly what's holding you back. Right now I need your data.';
    const arch = TRADER_ARCHETYPES[dna.archetype];
    return `${name}, based on your ${j.length + t.length} trades your #1 issue is: <strong style="color:var(--red)">${arch?.weaknesses[0]||'discipline'}</strong>. Your emotional control score is ${dna.scores.emotionalControl}/100. ${arch?.advice||'Focus on your plan.'}`;
  }

  if (q.match(/best pair|which pair|what pair/)) {
    const pp = BEHAVIOR.getPairPerformance();
    const best = pp.sort((a,b)=>b.pnl-a.pnl)[0];
    if (!best) return 'Log some trades across different pairs first. Once you have data, I'll tell you exactly which pair suits you best.';
    return `Your data says: <strong style="color:var(--gold)">${best.pair}</strong> is your best pair with $${best.pnl.toFixed(0)} total profit and ${best.winRate}% win rate across ${best.count} trades. Specialize there.`;
  }

  if (q.match(/win rate|winning|how am i doing|performance/)) {
    const wins = [...j,...t].filter(x=>parseFloat(x.pnl)>0);
    const total = j.length + t.length;
    const wr = total ? Math.round(wins.length/total*100) : 0;
    const totalPnl = [...j,...t].reduce((a,x)=>a+(parseFloat(x.pnl)||0),0);
    return `${name}, across your <strong>${total} trades</strong>: <strong style="color:${wr>=50?'var(--green)':'var(--red)'}">${wr}% win rate</strong>, <strong style="color:${totalPnl>=0?'var(--green)':'var(--red)'}">${totalPnl>=0?'+':''}$${totalPnl.toFixed(0)} P&L</strong>. ${wr>=50?'You're above average — now focus on increasing your R:R.':'Win rate needs work — focus only on A+ setups with confluence.'}`;
  }

  if (q.match(/psychology|emotion|mood|mental/)) {
    const psychScore = BEHAVIOR.getPsychologyScore();
    const moodWR = BEHAVIOR.getMoodWinRate();
    const best = moodWR.sort((a,b)=>b.winRate-a.winRate)[0];
    if (!psychScore) return 'Log your mood on every journal entry. That data will reveal your emotional trading patterns precisely.';
    return `Your emotional score is <strong style="color:${psychScore>=70?'var(--green)':psychScore>=40?'var(--gold)':'var(--red)'}">${psychScore}%</strong>. ${best ? `You perform best when feeling <strong>${best.mood}</strong> (${best.winRate}% win rate). ` : ''}${psychScore<60?'The number one thing you can do: implement the 2-loss rule. After 2 consecutive losses, stop for the day.':'Your emotional control is solid — keep tracking it.'}`;
  }

  if (q.match(/timing|when.*trade|best time|what time/)) {
    const tod = BEHAVIOR.getTimeOfDayPerformance();
    const best = Object.entries(tod).filter(([,v])=>v!==null).sort((a,b)=>b[1]-a[1])[0];
    const dow = BEHAVIOR.getDayOfWeekPerformance();
    const bestDay = dow.filter(d=>d.count>0).sort((a,b)=>b.avg-a.avg)[0];
    if (!best && !bestDay) return 'I need more trade data to tell you your optimal trading times. Keep logging entries with timestamps.';
    return `${best?`Your data shows you perform best in the <strong style="color:var(--green)">${best[0]}</strong> (avg +$${best[1].toFixed(1)} per trade). `:''}${bestDay?`Best day: <strong style="color:var(--green)">${bestDay.day}</strong>. `:''}Trade when YOUR data says to trade.`;
  }

  if (q.match(/progress|lessons|level|xp|learning/)) {
    return `You're at <strong style="color:var(--gold)">Level ${STATE.user.level}</strong> with <strong>${completedCount()}/${totalLessons()} lessons</strong> complete (${progressPct()}%). Your streak is <strong style="color:var(--orange)">${STATE.dailyStreak} days 🔥</strong>. ${progressPct()<50?'Focus on completing the Risk Management section next — it's the most impactful.':'You're well advanced. Time to focus on strategy mastery and consistent execution.'}`;
  }

  if (q.match(/today.*trade|should.*trade|ready.*trade|trade.*today/)) {
    const dna2 = calculateTraderDNA();
    if (!dna2) return 'Answer the "Should I Trade?" checklist in your Profile for a full readiness assessment.';
    const revengeRecent = j.slice(-3).filter(x=>x.mood==='revenge').length;
    if (revengeRecent > 0) return '🔴 <strong style="color:var(--red)">I'd advise against trading today.</strong> Your last 3 journal entries show emotional trading. Rest, review your rules, return tomorrow.';
    return `Based on your recent data: ${dna2.scores.emotionalControl > 60 ? '🟢 <strong style="color:var(--green)">You look ready to trade.</strong> Stick to your plan, size correctly, and only take A+ setups.' : '🟡 <strong style="color:var(--gold)">Trade cautiously.</strong> Reduce size by 50% and only take the clearest setups. Your emotional score is lower than usual.'}`;
  }

  // ── APP NAVIGATION HELP ──
  if (q.match(/where.*dna|find.*dna|trader dna|my profile/)) {
    return 'Your Trader DNA is in <strong>Profile → Trader DNA</strong> (the 🧬 card). It analyses all your journal entries and sim trades to identify your trader archetype and weaknesses.';
  }

  if (q.match(/challenge|challenges|goals/)) {
    const completed = CHALLENGES.filter(c=>getChallengeProgress(c)>=c.target).length;
    return `You've completed <strong>${completed}/${CHALLENGES.length} challenges</strong>. Go to <strong>Profile → Challenges 🏆</strong> to see which ones you're closest to finishing.`;
  }

  // Fall through to enhanced response
  return generateEnhancedResponse(input);
}



// ── THEME SETTINGS PATCH (add new themes) ──
const _origRenderSettings = renderSettings;
function renderSettings() {
  const base = _origRenderSettings();
  return base.replace(
    "{key:'dark',    label:'🌙 Dark Gold',  desc:'Default'},",
    "{key:'dark',    label:'🌙 Dark Gold',  desc:'Default'},
        {key:'midnight', label:'🌌 Midnight',  desc:'Deep blue'},
        {key:'sand',    label:'🏖️ Sand',       desc:'Warm cream'},
"
  );
}

console.log('✅ TradeBaby v6 Analytics + Float Chat loaded');

// ── PATCH CURRICULUM WITH NEW LESSONS ──
(function patchCurriculum() {
  if (typeof CURRICULUM === 'undefined') return;

  // Add to Technical Analysis
  const ta = CURRICULUM.find(c => c.id === 'technical-analysis');
  if (ta) {
    ta.lessons.push(
      {id:'price-action-mastery',title:'Price Action Mastery',emoji:'📊',mins:16,xp:160,
       content:`<h3>What is Price Action?</h3>
<p>Price action trading means reading raw price movement — no indicators, no noise. Just candlesticks, structure, and levels. It is the purest form of technical analysis and what institutional traders use.</p>
<h3>The 5 Core Price Action Concepts</h3>
<p><strong>1. Structure</strong> — Price moves in fractal waves. Higher highs and higher lows = uptrend. The key is identifying WHEN structure breaks, not just that it broke.</p>
<p><strong>2. Momentum</strong> — How fast is price moving? Large full-body candles = high momentum. Small-bodied candles = momentum fading. Momentum divergence (price moves far but with small candles) = reversal warning.</p>
<p><strong>3. Rejection</strong> — Long wicks at key levels show price WAS rejected. The longer the wick relative to the body, the more forceful the rejection. This is institutional footprint.</p>
<p><strong>4. Consolidation & Expansion</strong> — Markets alternate between consolidation (tight range) and expansion (directional breakout). Always identify which phase you are in before entering.</p>
<p><strong>5. Context</strong> — The same candle has completely different meaning in different contexts. A hammer at a 3-year support = very high probability. The same hammer mid-range = irrelevant.</p>
<h3>Price Action Decision Tree</h3>
<ol>
<li>What is the HTF (H4/D1) trend direction?</li>
<li>What key S&R level is price approaching?</li>
<li>Is there a recognizable candlestick pattern forming?</li>
<li>Is the pattern at the RIGHT location (S&R, Fibonacci, round number)?</li>
<li>What is the risk:reward if I enter here?</li>
<li>Only enter if ALL boxes are ticked</li>
</ol>
<h3>Reading Candle Bodies vs Wicks</h3>
<ul>
<li><strong>Body</strong> = conviction. Large body = strong directional conviction</li>
<li><strong>Wick</strong> = rejection/testing. Long wick = price tested that level but was pushed back</li>
<li><strong>No wick (Marubozu)</strong> = maximum conviction, opened at one extreme and closed at the other</li>
</ul>
<div class="callout"><strong>The 3-Touch Rule:</strong> Before trading any pattern, ask: Has price touched this level 3+ times? The more times a level holds, the higher the probability it holds again. The first touch is discovery, the second is confirmation, the third is high probability entry.</div>`},

      {id:'wyckoff-basics',title:'Wyckoff Method Introduction',emoji:'🏛️',mins:14,xp:140,
       content:`<h3>Who Was Wyckoff?</h3>
<p>Richard Wyckoff was a stock trader in the early 1900s who developed a framework for understanding institutional market behaviour. Nearly 100 years later, his method is used by professional traders worldwide because the underlying human psychology never changes.</p>
<h3>The Core Wyckoff Concept</h3>
<p>Markets are controlled by a "Composite Man" — a fictional large institutional player whose actions you can read in price and volume. By understanding what the Composite Man is doing, you trade alongside him instead of against him.</p>
<h3>The 4 Phases of Market Cycles</h3>
<p><strong>Phase 1: Accumulation</strong> — The Composite Man quietly buys from panicked retail sellers. Price moves sideways in a range. Volume is declining during downward moves (sellers exhausted). Key events: Selling Climax → Automatic Rally → Secondary Test → Spring (fake breakdown) → Sign of Strength.</p>
<p><strong>Phase 2: Markup</strong> — Price breaks out of accumulation range. Composite Man is long and letting price run. Retail traders now start buying because "price is going up." Classic trend phase.</p>
<p><strong>Phase 3: Distribution</strong> — The Composite Man quietly sells to excited retail buyers at the top. Price moves sideways at highs. Mirror of accumulation. Key events: Buying Climax → Automatic Reaction → Upthrust (fake breakout up) → Sign of Weakness.</p>
<p><strong>Phase 4: Markdown</strong> — Price falls. Retail "buys the dip" repeatedly. Composite Man is short the entire way down.</p>
<h3>The Spring — The Most Powerful Wyckoff Entry</h3>
<p>A Spring is a fake breakdown below the accumulation range's support. It looks like a breakdown — everyone sells — but price immediately reverses back into the range. This is the Composite Man harvesting retail stop losses before the big markup begins.</p>
<p>Trading the Spring: Enter on the reversal candle after the false breakdown. Stop below the Spring low. Target is the top of the accumulation range. R:R is typically 1:5 or better.</p>
<div class="callout"><strong>Wyckoff + SMC:</strong> These two frameworks describe the same institutional behaviour from different angles. The "Spring" in Wyckoff = "Liquidity Sweep" in SMC. Both tell you the same story: institutions hunt stops before reversing.</div>`},

      {id:'multi-timeframe-mastery',title:'Multi-Timeframe Analysis Deep Dive',emoji:'🔭',mins:15,xp:150,
       content:`<h3>The Most Overlooked Edge in Trading</h3>
<p>Most traders look at one timeframe and wonder why their setups fail. The reason is almost always that they ignored the higher timeframe context. Multi-timeframe analysis (MTA) is the difference between trading with the institutional flow and against it.</p>
<h3>The Three-Screen Method (Elder)</h3>
<p>Alexander Elder's Three-Screen Method remains one of the best systematic MTA frameworks:</p>
<p><strong>Screen 1 — The Tide (Weekly/Daily):</strong> What is the macro trend? This determines your directional bias. ONLY trade in the direction of this trend. Never fight it.</p>
<p><strong>Screen 2 — The Wave (H4/H1):</strong> Within the trend, identify pullbacks to key levels. This is where your setup forms. A pullback in an uptrend = potential buy setup.</p>
<p><strong>Screen 3 — The Ripple (M15/M5):</strong> Precise entry timing. Wait for a reversal signal on this lowest timeframe that confirms the higher-timeframe setup.</p>
<h3>The Golden Rule of MTA</h3>
<p>The higher the timeframe, the more significant the level. A support level on the Daily chart is exponentially more powerful than one on M15. When multiple timeframes align at the same level, it is a high-conviction institutional zone.</p>
<h3>Practical MTA Workflow</h3>
<table>
<tr><th>Step</th><th>Timeframe</th><th>Question</th></tr>
<tr><td>1</td><td>Weekly</td><td>What is the multi-week trend?</td></tr>
<tr><td>2</td><td>Daily</td><td>What are the key S&R levels? Where is price relative to them?</td></tr>
<tr><td>3</td><td>H4</td><td>Is price pulling back to a level? Is a setup forming?</td></tr>
<tr><td>4</td><td>H1/M15</td><td>Is there a confirmation signal at the level?</td></tr>
<tr><td>5</td><td>Entry</td><td>Where exactly is entry, SL, and TP?</td></tr>
</table>
<h3>Common MTA Mistakes</h3>
<ul>
<li>Taking H1 signals that go AGAINST the Daily trend</li>
<li>Using too many timeframes (max 3)</li>
<li>Changing bias because of a single lower-TF candle</li>
<li>Treating all timeframes as equally important (they are not)</li>
</ul>
<div class="callout"><strong>The Convergence Rule:</strong> The highest probability trades are when: (1) Higher TF is trending, (2) Price is at a major higher TF S&R level, (3) A reversal pattern forms on the lower TF entry frame. When all three align, you have institutional-grade confirmation.</div>`}
    );
  }

  // Add new Psychology lessons
  const psych = CURRICULUM.find(c => c.id === 'trading-psychology');
  if (psych) {
    psych.lessons.push(
      {id:'visualization-routines',title:'Pre-Session Visualization & Routines',emoji:'🧘',mins:10,xp:100,
       content:`<h3>The Pre-Session Routine — Your Edge Before You Open a Chart</h3>
<p>Every elite performance profession has pre-performance routines. Athletes warm up. Surgeons do pre-op checklists. Pilots run through pre-flight protocols. Professional traders are no different.</p>
<h3>The 15-Minute Pre-Session Protocol</h3>
<p><strong>Step 1 — Physical State Check (2 min)</strong><br>How is your body? Tired? Stressed? Hungry? Your brain's performance is directly linked to physical state. If you slept less than 6 hours last night, consider paper trading only. Studies show sleep deprivation increases risk-seeking behavior similar to mild intoxication.</p>
<p><strong>Step 2 — Emotional State Check (2 min)</strong><br>Rate your emotional state 1-10. 1 = extremely upset/frustrated. 10 = completely calm and focused. If you are below 6, do not trade live today. Emotions below this threshold impair decision-making measurably.</p>
<p><strong>Step 3 — Market Context Review (5 min)</strong><br>Review your key pairs on D1 and H4. Where is price relative to major S&R? Any high-impact news today? What session is opening? Set alerts for your key levels.</p>
<p><strong>Step 4 — Rule Affirmation (1 min)</strong><br>Read your top 5 trading rules aloud. This activates your prefrontal cortex (logical decision-making) and creates a mental contract with yourself before emotional pressure arrives.</p>
<p><strong>Step 5 — Set Intentions (2 min)</strong><br>Write: "Today I will only take setups that meet all my criteria. I will risk maximum 1% per trade. I will stop after 2 consecutive losses." Specificity matters.</p>
<h3>Visualization Exercise (3 min)</h3>
<p>Close your eyes. Visualize yourself: (1) Identifying a perfect setup, (2) Calmly entering with correct size, (3) Managing the trade without anxiety, (4) Accepting the outcome (win or loss) with equanimity. Athletes who visualize performance improve measurably. Traders do too.</p>
<div class="callout"><strong>The Journal Habit:</strong> After every session, write 3 sentences: (1) What went well, (2) What could improve, (3) What I will do differently next session. This 2-minute habit compounds into extraordinary self-awareness over months.</div>`},

      {id:'tilt-detection',title:'Tilt Detection & Recovery',emoji:'🚨',mins:12,xp:120,
       content:`<h3>What is Tilt?</h3>
<p>"Tilt" comes from poker — it means allowing emotions to override rational decision-making. In trading, tilt is the single most common cause of account destruction. You can be profitable for weeks, tilt once, and give it all back in a day.</p>
<h3>The Tilt Spiral</h3>
<div class="card" style="padding:12px;margin:10px 0;background:var(--red-bg);border-color:var(--red-bdr)">
  <div style="font-size:13px;color:var(--txt2);line-height:1.6">Loss → Frustration → Larger trade to recover → Larger loss → Anger → Even larger trade → Account damage → Shame → More revenge trades → Account destroyed</div>
</div>
<h3>Early Tilt Warning Signs</h3>
<ul>
<li>🔴 Feeling that the market "owes you" a winner</li>
<li>🔴 Sizing up after a loss</li>
<li>🔴 Opening the platform immediately after closing a losing trade</li>
<li>🔴 Muttering or swearing at the screen</li>
<li>🔴 Moving stop losses further away "just this once"</li>
<li>🔴 Taking trades you would not normally take</li>
<li>🔴 Checking P&L every 30 seconds</li>
</ul>
<h3>The 5-Minute Tilt Interrupt</h3>
<p>When you notice ANY warning sign: <strong>STOP immediately</strong>. Close your platform. Do one of these: (1) Walk for 5 minutes, (2) Do 20 pushups, (3) Make a drink, (4) Call someone. Physical movement rapidly resets your emotional state by changing your neurochemistry.</p>
<h3>Tilt Rules to Implement NOW</h3>
<ul>
<li><strong>The 2-Loss Rule</strong> — After 2 consecutive losses, trading is DONE for the day. No exceptions.</li>
<li><strong>The 30-Minute Rule</strong> — After any loss, wait 30 minutes before considering the next trade.</li>
<li><strong>The Size-Down Rule</strong> — If you feel ANY emotional pull, halve your position size.</li>
<li><strong>The Walk-Away Rule</strong> — If you are up more than 2% on the day, stop trading. Lock in the win.</li>
</ul>
<div class="callout"><strong>The Professional Mindset:</strong> A professional trader treats a losing day the same way a professional surgeon treats a difficult procedure — they review what happened, identify what could be improved, and return tomorrow focused. They do not emotionally spiral. Develop this equanimity actively.</div>`}
    );
  }

  // Add Advanced Concepts lessons
  const adv = CURRICULUM.find(c => c.id === 'advanced-concepts');
  if (adv) {
    adv.lessons.push(
      {id:'intermarket-analysis',title:'Intermarket Analysis',emoji:'🌐',mins:13,xp:130,
       content:`<h3>Everything Is Connected</h3>
<p>No market exists in isolation. Currencies, bonds, commodities, and equities all influence each other in predictable ways. Understanding these relationships gives you a macro context that most retail traders completely ignore.</p>
<h3>The Four Asset Classes & Their Relationships</h3>
<p><strong>Bonds (Yields) ↔ Currencies</strong><br>
When US interest rates rise (yields rise), capital flows to USD for better returns. USD strengthens. EUR/USD falls. When rates fall, the opposite. This is the most direct relationship in macro forex.</p>
<p><strong>Commodities ↔ Currencies</strong><br>
• Gold up → USD typically weakens (gold priced in USD)<br>
• Oil up → CAD strengthens (Canada = major oil exporter), JPY weakens (Japan = major oil importer)<br>
• Iron ore up → AUD strengthens (Australia = major iron ore exporter)<br>
• Agricultural commodities up → NZD can strengthen</p>
<p><strong>Equities (Stocks) ↔ Safe Havens</strong><br>
• Stocks up → Risk-on → USD/JPY rises, AUD/USD rises, gold falls<br>
• Stocks crash → Risk-off → JPY, CHF, gold surge as capital flees to safety</p>
<h3>The DXY — Your Macro Compass</h3>
<p>The US Dollar Index (DXY) measures USD against a basket of 6 major currencies (EUR 57.6%, JPY 13.6%, GBP 11.9%, CAD 9.1%, SEK 4.2%, CHF 3.6%). When DXY rises, most forex pairs fall. When DXY falls, most pairs rise.</p>
<p>Before trading any major pair, check DXY's trend: Is it trending up or down? Is it at a key level? This gives you the macro context in 10 seconds.</p>
<h3>Practical Intermarket Checklist</h3>
<ul>
<li>Check DXY direction before any USD pair trade</li>
<li>Check gold direction for AUD/USD confluence</li>
<li>Check oil prices for USD/CAD direction</li>
<li>Check VIX: above 25 = risk-off = buy USD/JPY/CHF/gold</li>
<li>Check 10Y US Treasury yield for long-term USD bias</li>
</ul>
<div class="callout"><strong>The Single Best Intermarket Signal:</strong> When DXY breaks a major technical level AND bond yields are moving in the same direction, it is one of the highest probability macro signals available. The two confirming each other reduces noise significantly.</div>`},

      {id:'volatility-trading',title:'Trading Volatility',emoji:'⚡',mins:11,xp:110,
       content:`<h3>Volatility Is Not Your Enemy</h3>
<p>Most traders fear volatility. Professional traders understand it, measure it, and use it. Volatility is simply a measure of price movement range. Higher volatility = larger moves = both more opportunity and more risk.</p>
<h3>Measuring Volatility</h3>
<p><strong>ATR (Average True Range)</strong> — The most practical volatility tool. ATR(14) on H4 tells you the average range per candle over the last 14 periods. Use this to:</p>
<ul>
<li>Set stops (1.5-2× ATR as stop distance)</li>
<li>Set realistic targets (ATR tells you how far price typically moves)</li>
<li>Filter out low-volatility conditions (ATR shrinking = consolidation, wait for breakout)</li>
</ul>
<p><strong>Bollinger Band Width</strong> — As bands squeeze, volatility is contracting. An expansion after a squeeze = high probability breakout setup.</p>
<p><strong>VIX (Volatility Index)</strong> — Measures implied volatility in S&P 500 options. Indirectly affects forex:</p>
<ul>
<li>VIX < 15 = complacency = stable conditions, carry trades work</li>
<li>VIX 20-30 = elevated fear = increase caution, widen stops</li>
<li>VIX > 30 = crisis mode = safe havens surge, risk currencies collapse</li>
</ul>
<h3>Volatility-Based Position Sizing</h3>
<p>In high-volatility conditions, reduce position size. In low-volatility conditions, you can size up slightly. This keeps your dollar risk constant regardless of market conditions.</p>
<p>Formula: Normal lots × (Normal ATR ÷ Current ATR) = Volatility-adjusted lots</p>
<h3>Trading the Volatility Expansion</h3>
<p>After periods of extreme low volatility (BB squeeze, ATR near multi-week low), a volatility expansion is imminent. The direction is unknown until breakout occurs. Strategy: set pending buy stop above range and sell stop below range. Cancel the unfilled order when one triggers.</p>
<div class="callout"><strong>The Volatility Rule:</strong> Never widen your stop just because the market is volatile. Instead, reduce your position size. The volatility-adjusted approach keeps risk constant and removes the temptation to break your rules during wild markets.</div>`}
    );
  }

  console.log('✅ New lessons patched into curriculum');
})();


/* ═══════════════════════════════════════════════════════
   TRADEBABY PRO v7 — QUICK ACCESS FIX + VISUAL LESSONS
   ═══════════════════════════════════════════════════════ */

// ── TOUCH-AWARE QUICK ACCESS CARDS ──
let _qaTouchStartX = 0, _qaTouchStartY = 0, _qaScrolled = false;

function qaTouch(el) {
  _qaTouchStartX = event.touches[0].clientX;
  _qaTouchStartY = event.touches[0].clientY;
  _qaScrolled = false;
  el.style.transform = 'scale(0.96)';
  el.style.borderColor = 'var(--gold)';
}

function qaTap(el, action) {
  el.style.transform = '';
  el.style.borderColor = '';
  const dx = Math.abs(event.changedTouches[0].clientX - _qaTouchStartX);
  const dy = Math.abs(event.changedTouches[0].clientY - _qaTouchStartY);
  // Only navigate if it was a tap (not a scroll)
  if (dx < 12 && dy < 12) {
    navigate(action);
  }
}

// Also handle click (desktop)
document.addEventListener('click', e => {
  const qa = e.target.closest('.qa-card');
  if (qa && qa.dataset.action) {
    // Only if not from a touch event (touchend handles mobile)
    navigate(qa.dataset.action);
  }
}, false);

// ── 

/* ═══ V7 LESSON VISUALS & CHART IMAGES ═══ */
SVG CANDLESTICK ILLUSTRATIONS ──
function svgCandle(x, o, h, l, c, w, bull, label='') {
  const col = bull ? '#22C55E' : '#EF4444';
  const bodyTop = Math.min(o, c);
  const bodyH = Math.max(2, Math.abs(c - o));
  return `<g>
    <line x1="${x}" y1="${h}" x2="${x}" y2="${l}" stroke="${col}" stroke-width="1.5"/>
    <rect x="${x - w/2}" y="${bodyTop}" width="${w}" height="${bodyH}" fill="${col}" rx="1"/>
    ${label ? `<text x="${x}" y="${l + 14}" text-anchor="middle" fill="#9B9891" font-size="8" font-family="monospace">${label}</text>` : ''}
  </g>`;
}

function svgChartBase(w=280, h=120, bg='var(--bg3)') {
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="border-radius:8px;background:${bg}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="#18181F" rx="6"/>
    ${[0.25,0.5,0.75].map(y=>`<line x1="0" y1="${h*y}" x2="${w}" y2="${h*y}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>`).join('')}`;
}

// Pre-built visual SVG charts for lessons
const LESSON_VISUALS = {

  // SUPPORT & RESISTANCE
  'support-resistance': `
    <div style="margin:14px 0">
      <div class="section-lbl">📊 Visual: Support & Resistance Levels</div>
      ${svgChartBase(300, 140)}
        <!-- Resistance line at y=25 -->
        <line x1="10" y1="28" x2="290" y2="28" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="6,3"/>
        <text x="5" y="22" fill="#EF4444" font-size="8" font-family="monospace">RESISTANCE</text>
        <!-- Support line at y=110 -->
        <line x1="10" y1="108" x2="290" y2="108" stroke="#22C55E" stroke-width="1.5" stroke-dasharray="6,3"/>
        <text x="5" y="125" fill="#22C55E" font-size="8" font-family="monospace">SUPPORT</text>
        <!-- Candles bouncing between levels -->
        ${svgCandle(30, 90, 85, 95, 88, 12, false)}
        ${svgCandle(50, 88, 75, 92, 78, 12, false)}
        ${svgCandle(70, 78, 108, 73, 108, 12, false, 'BOUNCE')}
        ${svgCandle(90, 108, 95, 112, 98, 12, true)}
        ${svgCandle(110, 98, 80, 102, 82, 12, true)}
        ${svgCandle(130, 82, 28, 78, 30, 12, true, 'BOUNCE')}
        ${svgCandle(150, 30, 25, 35, 28, 12, false)}
        ${svgCandle(170, 28, 40, 25, 38, 12, false)}
        ${svgCandle(190, 38, 108, 35, 110, 12, false, 'BOUNCE')}
        ${svgCandle(210, 110, 95, 114, 98, 12, true)}
        ${svgCandle(230, 98, 78, 102, 80, 12, true)}
        <!-- Arrows showing bounces -->
        <path d="M70,115 L70,125 L80,120 Z" fill="#22C55E" opacity="0.7"/>
        <path d="M130,20 L130,12 L140,16 Z" fill="#EF4444" opacity="0.7"/>
        <path d="M190,115 L190,125 L200,120 Z" fill="#22C55E" opacity="0.7"/>
      </svg>
      <div style="display:flex;gap:12px;margin-top:8px;font-size:11px;color:var(--txt2)">
        <span style="color:var(--red)">━━ Resistance: Price bounces DOWN</span>
        <span style="color:var(--green)">━━ Support: Price bounces UP</span>
      </div>
    </div>

    <div style="margin:14px 0">
      <div class="section-lbl">📊 Visual: Role Reversal (Broken Support → Resistance)</div>
      ${svgChartBase(300, 130)}
        <!-- Old support now broken -->
        <line x1="10" y1="65" x2="290" y2="65" stroke="#F97316" stroke-width="1.5" stroke-dasharray="5,3"/>
        <text x="5" y="60" fill="#F97316" font-size="8" font-family="monospace">OLD SUPPORT → NEW RESISTANCE</text>
        <!-- Price was supported, then broke below -->
        ${svgCandle(25, 45, 38, 50, 40, 11, false)}
        ${svgCandle(43, 40, 32, 45, 35, 11, false)}
        ${svgCandle(61, 35, 20, 40, 22, 11, false)}
        <!-- Break candle -->
        ${svgCandle(79, 65, 20, 70, 28, 13, false, 'BREAK!')}
        <!-- Now below, tries to retest -->
        ${svgCandle(100, 80, 60, 85, 62, 11, true)}
        ${svgCandle(118, 62, 50, 67, 55, 11, true)}
        <!-- Retest and rejection -->
        ${svgCandle(136, 55, 62, 50, 65, 13, true, 'RETEST')}
        <path d="M136,60 L136,52 L144,56 Z" fill="#EF4444" opacity="0.8"/>
        ${svgCandle(157, 65, 78, 62, 80, 11, false)}
        ${svgCandle(175, 80, 95, 76, 97, 11, false)}
        ${svgCandle(193, 97, 110, 94, 112, 11, false)}
        <text x="215" y="120" fill="#EF4444" font-size="8" font-family="monospace">→ CONTINUES DOWN</text>
      </svg>
    </div>`,

  // CANDLESTICK PATTERNS
  'candlestick-basics': `
    <div style="margin:14px 0">
      <div class="section-lbl">📊 Visual: Candlestick Anatomy</div>
      ${svgChartBase(300, 150)}
        <!-- Bullish candle -->
        ${svgCandle(80, 110, 30, 120, 45, 28, true)}
        <line x1="80" y1="30" x2="140" y2="30" stroke="#9B9891" stroke-width="0.8" stroke-dasharray="3,2"/>
        <text x="145" y="34" fill="#9B9891" font-size="8">HIGH</text>
        <line x1="80" y1="45" x2="140" y2="45" stroke="#22C55E" stroke-width="0.8" stroke-dasharray="3,2"/>
        <text x="145" y="49" fill="#22C55E" font-size="8">CLOSE</text>
        <line x1="80" y1="110" x2="140" y2="110" stroke="#22C55E" stroke-width="0.8" stroke-dasharray="3,2"/>
        <text x="145" y="114" fill="#22C55E" font-size="8">OPEN</text>
        <line x1="80" y1="120" x2="140" y2="120" stroke="#9B9891" stroke-width="0.8" stroke-dasharray="3,2"/>
        <text x="145" y="124" fill="#9B9891" font-size="8">LOW</text>
        <text x="80" y="145" text-anchor="middle" fill="#22C55E" font-size="9" font-weight="bold">BULLISH</text>
        <!-- Bearish candle -->
        ${svgCandle(220, 45, 30, 120, 110, 28, false)}
        <line x1="220" y1="30" x2="260" y2="30" stroke="#9B9891" stroke-width="0.8" stroke-dasharray="3,2"/>
        <text x="264" y="34" fill="#9B9891" font-size="8">HIGH</text>
        <line x1="220" y1="45" x2="260" y2="45" stroke="#EF4444" stroke-width="0.8" stroke-dasharray="3,2"/>
        <text x="264" y="49" fill="#EF4444" font-size="8">OPEN</text>
        <line x1="220" y1="110" x2="260" y2="110" stroke="#EF4444" stroke-width="0.8" stroke-dasharray="3,2"/>
        <text x="264" y="114" fill="#EF4444" font-size="8">CLOSE</text>
        <line x1="220" y1="120" x2="260" y2="120" stroke="#9B9891" stroke-width="0.8" stroke-dasharray="3,2"/>
        <text x="264" y="124" fill="#9B9891" font-size="8">LOW</text>
        <text x="220" y="145" text-anchor="middle" fill="#EF4444" font-size="9" font-weight="bold">BEARISH</text>
      </svg>
    </div>

    <div style="margin:14px 0">
      <div class="section-lbl">📊 Visual: Key Reversal Patterns</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">

        <div style="background:var(--bg3);border:1px solid var(--bdr2);border-radius:var(--rs);padding:10px">
          <div style="font-size:11px;font-weight:700;color:var(--green);font-family:var(--display);margin-bottom:6px">🔨 HAMMER (Bullish)</div>
          ${svgChartBase(120, 90, 'var(--bg4)')}
            ${svgCandle(40, 68, 25, 82, 65, 14, true)}
            <line x1="10" y1="80" x2="110" y2="80" stroke="rgba(34,197,94,0.3)" stroke-width="1" stroke-dasharray="4,3"/>
            <text x="60" y="88" text-anchor="middle" fill="#9B9891" font-size="7">SUPPORT ZONE</text>
            <path d="M55,55 L70,55 L62,45 Z" fill="#22C55E" opacity="0.7"/>
          </svg>
          <div style="font-size:10px;color:var(--txt2);margin-top:6px;line-height:1.4">Long lower wick = buyers rejected lower prices. Bullish reversal at support.</div>
        </div>

        <div style="background:var(--bg3);border:1px solid var(--bdr2);border-radius:var(--rs);padding:10px">
          <div style="font-size:11px;font-weight:700;color:var(--red);font-family:var(--display);margin-bottom:6px">⭐ SHOOTING STAR (Bearish)</div>
          ${svgChartBase(120, 90, 'var(--bg4)')}
            ${svgCandle(40, 70, 82, 25, 72, 14, false)}
            <line x1="10" y1="30" x2="110" y2="30" stroke="rgba(239,68,68,0.3)" stroke-width="1" stroke-dasharray="4,3"/>
            <text x="60" y="18" text-anchor="middle" fill="#9B9891" font-size="7">RESISTANCE ZONE</text>
            <path d="M55,40 L70,40 L62,50 Z" fill="#EF4444" opacity="0.7"/>
          </svg>
          <div style="font-size:10px;color:var(--txt2);margin-top:6px;line-height:1.4">Long upper wick = sellers rejected higher prices. Bearish reversal at resistance.</div>
        </div>

        <div style="background:var(--bg3);border:1px solid var(--bdr2);border-radius:var(--rs);padding:10px">
          <div style="font-size:11px;font-weight:700;color:var(--green);font-family:var(--display);margin-bottom:6px">🐂 BULLISH ENGULFING</div>
          ${svgChartBase(120, 90, 'var(--bg4)')}
            ${svgCandle(35, 45, 38, 60, 48, 14, false)}
            ${svgCandle(65, 62, 30, 65, 32, 20, true)}
            <text x="60" y="88" text-anchor="middle" fill="#9B9891" font-size="7">Green engulfs Red</text>
          </svg>
          <div style="font-size:10px;color:var(--txt2);margin-top:6px;line-height:1.4">Large green candle completely engulfs the previous red one. Strong buy signal.</div>
        </div>

        <div style="background:var(--bg3);border:1px solid var(--bdr2);border-radius:var(--rs);padding:10px">
          <div style="font-size:11px;font-weight:700;color:var(--red);font-family:var(--display);margin-bottom:6px">🐻 BEARISH ENGULFING</div>
          ${svgChartBase(120, 90, 'var(--bg4)')}
            ${svgCandle(35, 60, 55, 45, 52, 14, true)}
            ${svgCandle(65, 42, 65, 38, 68, 20, false)}
            <text x="60" y="88" text-anchor="middle" fill="#9B9891" font-size="7">Red engulfs Green</text>
          </svg>
          <div style="font-size:10px;color:var(--txt2);margin-top:6px;line-height:1.4">Large red candle completely engulfs the previous green one. Strong sell signal.</div>
        </div>

        <div style="background:var(--bg3);border:1px solid var(--bdr2);border-radius:var(--rs);padding:10px">
          <div style="font-size:11px;font-weight:700;color:var(--gold);font-family:var(--display);margin-bottom:6px">✚ DOJI</div>
          ${svgChartBase(120, 90, 'var(--bg4)')}
            ${svgCandle(60, 50, 20, 80, 50, 2, true)}
            <text x="60" y="88" text-anchor="middle" fill="#9B9891" font-size="7">Open ≈ Close</text>
          </svg>
          <div style="font-size:10px;color:var(--txt2);margin-top:6px;line-height:1.4">Open equals close. Complete market indecision. Powerful after a strong trend.</div>
        </div>

        <div style="background:var(--bg3);border:1px solid var(--bdr2);border-radius:var(--rs);padding:10px">
          <div style="font-size:11px;font-weight:700;color:var(--green);font-family:var(--display);margin-bottom:6px">☀️ MORNING STAR</div>
          ${svgChartBase(120, 90, 'var(--bg4)')}
            ${svgCandle(28, 30, 25, 60, 55, 13, false)}
            ${svgCandle(55, 62, 56, 68, 60, 10, true)}
            ${svgCandle(82, 58, 30, 62, 33, 13, true)}
            <text x="60" y="88" text-anchor="middle" fill="#9B9891" font-size="7">3-candle reversal</text>
          </svg>
          <div style="font-size:10px;color:var(--txt2);margin-top:6px;line-height:1.4">Bear → Small indecision → Strong bull. Powerful bottom reversal pattern.</div>
        </div>
      </div>
    </div>`,

  // CHART PATTERNS
  'chart-patterns': `
    <div style="margin:14px 0">
      <div class="section-lbl">📊 Visual: Head & Shoulders</div>
      ${svgChartBase(300, 140)}
        <!-- Price line forming H&S -->
        <polyline points="10,120 40,90 55,100 80,45 105,100 120,90 150,30 175,90 190,100 215,90 240,100 260,115" 
          fill="none" stroke="var(--gold)" stroke-width="1.5"/>
        <!-- Left shoulder -->
        <text x="48" y="86" text-anchor="middle" fill="#9B9891" font-size="8">L Shoulder</text>
        <!-- Head -->
        <text x="150" y="25" text-anchor="middle" fill="var(--txt)" font-size="8" font-weight="bold">HEAD</text>
        <line x1="150" y1="30" x2="150" y2="135" stroke="rgba(239,68,68,0.3)" stroke-width="1" stroke-dasharray="3,3"/>
        <!-- Right shoulder -->
        <text x="215" y="86" text-anchor="middle" fill="#9B9891" font-size="8">R Shoulder</text>
        <!-- Neckline -->
        <line x1="55" y1="100" x2="265" y2="105" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="5,3"/>
        <text x="270" y="108" fill="#EF4444" font-size="8">NECKLINE</text>
        <!-- Entry arrow -->
        <text x="150" y="135" text-anchor="middle" fill="#EF4444" font-size="8">← SELL on neckline break →</text>
      </svg>
      <div style="font-size:11px;color:var(--txt2);margin-top:6px;line-height:1.5">Three peaks: left shoulder → head (highest) → right shoulder. Enter SHORT on close below neckline.</div>
    </div>

    <div style="margin:14px 0">
      <div class="section-lbl">📊 Visual: Double Top & Double Bottom</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--bg3);border:1px solid var(--bdr2);border-radius:var(--rs);padding:10px">
          <div style="font-size:11px;font-weight:700;color:var(--red);font-family:var(--display);margin-bottom:6px">📉 DOUBLE TOP (M Pattern)</div>
          ${svgChartBase(130, 100, 'var(--bg4)')}
            <polyline points="10,80 30,35 50,55 70,35 90,55 110,90 125,95" fill="none" stroke="var(--gold)" stroke-width="1.5"/>
            <line x1="10" y1="55" x2="130" y2="55" stroke="#EF4444" stroke-width="1" stroke-dasharray="4,3"/>
            <text x="65" y="52" text-anchor="middle" fill="#EF4444" font-size="7">NECKLINE → SELL</text>
            <text x="30" y="30" text-anchor="middle" fill="#9B9891" font-size="7">TOP1</text>
            <text x="70" y="30" text-anchor="middle" fill="#9B9891" font-size="7">TOP2</text>
          </svg>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--bdr2);border-radius:var(--rs);padding:10px">
          <div style="font-size:11px;font-weight:700;color:var(--green);font-family:var(--display);margin-bottom:6px">📈 DOUBLE BOTTOM (W Pattern)</div>
          ${svgChartBase(130, 100, 'var(--bg4)')}
            <polyline points="10,20 30,65 50,45 70,65 90,45 110,15 125,10" fill="none" stroke="var(--gold)" stroke-width="1.5"/>
            <line x1="10" y1="45" x2="130" y2="45" stroke="#22C55E" stroke-width="1" stroke-dasharray="4,3"/>
            <text x="65" y="40" text-anchor="middle" fill="#22C55E" font-size="7">NECKLINE → BUY</text>
            <text x="30" y="78" text-anchor="middle" fill="#9B9891" font-size="7">BOT1</text>
            <text x="70" y="78" text-anchor="middle" fill="#9B9891" font-size="7">BOT2</text>
          </svg>
        </div>
      </div>
    </div>

    <div style="margin:14px 0">
      <div class="section-lbl">📊 Visual: Bull Flag Pattern</div>
      ${svgChartBase(300, 130)}
        <!-- Flagpole -->
        <polyline points="20,120 35,105 45,90 55,70 65,48 75,30" fill="none" stroke="#22C55E" stroke-width="2"/>
        <text x="48" y="110" fill="#22C55E" font-size="8">FLAGPOLE</text>
        <!-- Flag (consolidation) -->
        <polyline points="75,30 90,38 105,32 120,40 135,33 150,42" fill="none" stroke="#C9A84C" stroke-width="1.5"/>
        <!-- Flag channel lines -->
        <line x1="75" y1="28" x2="155" y2="38" stroke="#C9A84C" stroke-width="0.8" stroke-dasharray="3,2"/>
        <line x1="75" y1="42" x2="155" y2="52" stroke="#C9A84C" stroke-width="0.8" stroke-dasharray="3,2"/>
        <text x="115" y="58" text-anchor="middle" fill="#C9A84C" font-size="8">FLAG</text>
        <!-- Breakout -->
        <polyline points="150,42 165,30 180,18 195,8" fill="none" stroke="#22C55E" stroke-width="2"/>
        <path d="M185,3 L200,10 L190,15 Z" fill="#22C55E"/>
        <text x="220" y="12" fill="#22C55E" font-size="8">BREAKOUT</text>
        <!-- Entry line -->
        <line x1="148" y1="36" x2="148" y2="90" stroke="rgba(201,168,76,0.5)" stroke-width="1" stroke-dasharray="3,3"/>
        <text x="148" y="100" text-anchor="middle" fill="#C9A84C" font-size="7">→ BUY ENTRY</text>
      </svg>
    </div>

    <div style="margin:14px 0">
      <div class="section-lbl">📊 Visual: Triangle Patterns</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--bg3);border:1px solid var(--bdr2);border-radius:var(--rs);padding:10px">
          <div style="font-size:11px;font-weight:700;color:var(--green);font-family:var(--display);margin-bottom:6px">🔺 ASCENDING TRIANGLE</div>
          ${svgChartBase(130, 100, 'var(--bg4)')}
            <line x1="10" y1="25" x2="100" y2="25" stroke="#EF4444" stroke-width="1.2" stroke-dasharray="4,3"/>
            <polyline points="10,80 25,60 40,70 55,48 70,55 85,38 100,25 118,15" fill="none" stroke="var(--gold)" stroke-width="1.2"/>
            <line x1="10" y1="80" x2="100" y2="28" stroke="#22C55E" stroke-width="1" stroke-dasharray="3,2"/>
            <text x="65" y="98" text-anchor="middle" fill="#22C55E" font-size="7">Rising lows → Breakout UP</text>
          </svg>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--bdr2);border-radius:var(--rs);padding:10px">
          <div style="font-size:11px;font-weight:700;color:var(--red);font-family:var(--display);margin-bottom:6px">🔻 DESCENDING TRIANGLE</div>
          ${svgChartBase(130, 100, 'var(--bg4)')}
            <line x1="10" y1="75" x2="100" y2="75" stroke="#22C55E" stroke-width="1.2" stroke-dasharray="4,3"/>
            <polyline points="10,20 25,40 40,28 55,50 70,38 85,55 100,75 118,85" fill="none" stroke="var(--gold)" stroke-width="1.2"/>
            <line x1="10" y1="20" x2="100" y2="72" stroke="#EF4444" stroke-width="1" stroke-dasharray="3,2"/>
            <text x="65" y="98" text-anchor="middle" fill="#EF4444" font-size="7">Falling highs → Breakout DOWN</text>
          </svg>
        </div>
      </div>
    </div>`,

  // TREND ANALYSIS
  'trend-analysis': `
    <div style="margin:14px 0">
      <div class="section-lbl">📊 Visual: Uptrend Structure (Higher Highs & Higher Lows)</div>
      ${svgChartBase(300, 130)}
        <polyline points="10,115 35,90 50,100 75,70 90,82 115,52 130,64 155,32 170,48 195,18 210,32 235,10" 
          fill="none" stroke="var(--gold)" stroke-width="1.5"/>
        <!-- HH & HL labels -->
        <text x="35" y="85" text-anchor="middle" fill="#9B9891" font-size="7">HL</text>
        <text x="75" y="65" text-anchor="middle" fill="#9B9891" font-size="7">HH</text>
        <text x="90" y="77" text-anchor="middle" fill="#9B9891" font-size="7">HL</text>
        <text x="115" y="47" text-anchor="middle" fill="#9B9891" font-size="7">HH</text>
        <text x="130" y="59" text-anchor="middle" fill="#9B9891" font-size="7">HL</text>
        <text x="155" y="27" text-anchor="middle" fill="#9B9891" font-size="7">HH</text>
        <text x="170" y="43" text-anchor="middle" fill="#9B9891" font-size="7">HL</text>
        <text x="195" y="13" text-anchor="middle" fill="#9B9891" font-size="7">HH</text>
        <!-- Trend line -->
        <line x1="50" y1="100" x2="210" y2="32" stroke="#22C55E" stroke-width="1" stroke-dasharray="4,3"/>
        <text x="150" y="125" text-anchor="middle" fill="#22C55E" font-size="8">↗ UPTREND: Higher Highs + Higher Lows</text>
      </svg>
    </div>

    <div style="margin:14px 0">
      <div class="section-lbl">📊 Visual: Multi-Timeframe Analysis</div>
      <div style="background:var(--bg3);border:1px solid var(--bdr2);border-radius:var(--rs);padding:12px">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-bottom:8px">
          ${['D1 — Trend', 'H4 — Setup', 'H1 — Entry'].map((label,i) => `
            <div style="background:var(--bg4);border-radius:4px;padding:6px;text-align:center">
              <div style="font-size:9px;color:var(--gold);font-family:var(--display);font-weight:700;margin-bottom:4px">${label}</div>
              ${svgChartBase(80, 50, 'var(--bg5)')}
                ${i===0 ? `<polyline points="5,40 20,32 35,22 50,14 65,8 75,5" fill="none" stroke="#22C55E" stroke-width="1.5"/>` :
                  i===1 ? `<polyline points="5,10 20,18 30,14 40,22 50,18 60,30 70,24 78,28" fill="none" stroke="#C9A84C" stroke-width="1.5"/>` :
                  `<polyline points="5,30 12,24 18,28 24,22 32,26 40,18 48,22 56,15 64,18 72,12" fill="none" stroke="#60A5FA" stroke-width="1.5"/>`}
              </svg>
            </div>`).join('')}
        </div>
        <div style="font-size:11px;color:var(--txt2);line-height:1.5">Use D1 for trend direction → H4 for setup identification → H1 for precise entry timing.</div>
      </div>
    </div>`,

  // MOVING AVERAGES
  'moving-averages': `
    <div style="margin:14px 0">
      <div class="section-lbl">📊 Visual: Moving Average as Dynamic Support</div>
      ${svgChartBase(300, 140)}
        <!-- Price line -->
        <polyline points="10,60 25,50 40,42 55,50 65,45 80,35 95,42 110,30 125,38 140,25 155,35 170,22 185,32 200,18 215,28 230,15 245,22 260,12 275,20" 
          fill="none" stroke="var(--gold)" stroke-width="1.5"/>
        <!-- 21 EMA -->
        <polyline points="10,70 25,62 40,55 55,56 65,52 80,46 95,50 110,42 125,46 140,38 155,43 170,36 185,40 200,33 215,38 230,30 245,34 260,28 275,32" 
          fill="none" stroke="#22C55E" stroke-width="1.2" stroke-dasharray="none"/>
        <!-- 200 SMA -->
        <polyline points="10,95 60,90 120,85 180,78 240,72 275,68" fill="none" stroke="#A78BFA" stroke-width="1.2"/>
        <!-- Touch points on EMA -->
        <circle cx="95" cy="42" r="4" fill="none" stroke="#22C55E" stroke-width="1.5"/>
        <circle cx="155" cy="35" r="4" fill="none" stroke="#22C55E" stroke-width="1.5"/>
        <circle cx="215" cy="28" r="4" fill="none" stroke="#22C55E" stroke-width="1.5"/>
        <!-- Labels -->
        <text x="245" y="20" fill="var(--gold)" font-size="8">Price</text>
        <text x="245" y="42" fill="#22C55E" font-size="8">21 EMA</text>
        <text x="245" y="68" fill="#A78BFA" font-size="8">200 SMA</text>
        <text x="150" y="135" text-anchor="middle" fill="#22C55E" font-size="8">Circles = EMA pullback entry points</text>
      </svg>
    </div>

    <div style="margin:14px 0">
      <div class="section-lbl">📊 Visual: Golden Cross & Death Cross</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--bg3);border:1px solid var(--bdr2);border-radius:var(--rs);padding:10px">
          <div style="font-size:11px;font-weight:700;color:var(--green);font-family:var(--display);margin-bottom:6px">✨ GOLDEN CROSS</div>
          ${svgChartBase(130, 100, 'var(--bg4)')}
            <!-- MA50 crossing above MA200 -->
            <polyline points="10,80 40,70 65,50 90,30 115,18" fill="none" stroke="#22C55E" stroke-width="1.5"/>
            <polyline points="10,60 40,62 65,60 90,58 115,55" fill="none" stroke="#9B9891" stroke-width="1"/>
            <!-- Cross point -->
            <circle cx="62" cy="57" r="5" fill="none" stroke="#22C55E" stroke-width="1.5"/>
            <text x="65" y="95" text-anchor="middle" fill="#22C55E" font-size="7">MA50 crosses ABOVE MA200</text>
            <text x="20" y="20" fill="#22C55E" font-size="7">MA50 →</text>
            <text x="20" y="56" fill="#9B9891" font-size="7">MA200 →</text>
          </svg>
        </div>
        <div style="background:var(--bg3);border:1px solid var(--bdr2);border-radius:var(--rs);padding:10px">
          <div style="font-size:11px;font-weight:700;color:var(--red);font-family:var(--display);margin-bottom:6px">💀 DEATH CROSS</div>
          ${svgChartBase(130, 100, 'var(--bg4)')}
            <polyline points="10,20 40,30 65,50 90,70 115,82" fill="none" stroke="#EF4444" stroke-width="1.5"/>
            <polyline points="10,40 40,42 65,44 90,46 115,48" fill="none" stroke="#9B9891" stroke-width="1"/>
            <circle cx="62" cy="48" r="5" fill="none" stroke="#EF4444" stroke-width="1.5"/>
            <text x="65" y="95" text-anchor="middle" fill="#EF4444" font-size="7">MA50 crosses BELOW MA200</text>
            <text x="20" y="18" fill="#EF4444" font-size="7">MA50 →</text>
            <text x="20" y="40" fill="#9B9891" font-size="7">MA200 →</text>
          </svg>
        </div>
      </div>
    </div>`,

  // INDICATORS
  'indicators': `
    <div style="margin:14px 0">
      <div class="section-lbl">📊 Visual: RSI Overbought/Oversold + Divergence</div>
      <div style="background:var(--bg3);border:1px solid var(--bdr2);border-radius:var(--rs);padding:10px">
        <!-- Price chart -->
        <div style="font-size:10px;color:var(--txt3);margin-bottom:4px">PRICE</div>
        ${svgChartBase(280, 70, 'var(--bg4)')}
          <polyline points="10,55 30,45 50,35 70,20 90,28 110,18 130,30 150,40 170,50 190,58 210,48 230,38 250,28 270,20" fill="none" stroke="var(--gold)" stroke-width="1.5"/>
          <!-- Divergence: price makes new high but RSI doesn't -->
          <line x1="110" y1="18" x2="270" y2="20" stroke="rgba(239,68,68,0.4)" stroke-width="0.8" stroke-dasharray="3,2"/>
          <text x="190" y="14" fill="#EF4444" font-size="7">Bearish Divergence</text>
        </svg>
        <!-- RSI -->
        <div style="font-size:10px;color:var(--txt3);margin-top:6px;margin-bottom:4px">RSI (14)</div>
        ${svgChartBase(280, 60, 'var(--bg4)')}
          <!-- RSI levels -->
          <line x1="0" y1="12" x2="280" y2="12" stroke="rgba(239,68,68,0.5)" stroke-width="0.8" stroke-dasharray="3,2"/>
          <text x="3" y="10" fill="#EF4444" font-size="7">70</text>
          <line x1="0" y1="42" x2="280" y2="42" stroke="rgba(34,197,94,0.5)" stroke-width="0.8" stroke-dasharray="3,2"/>
          <text x="3" y="40" fill="#22C55E" font-size="7">30</text>
          <!-- RSI line - makes lower high despite price making higher high -->
          <polyline points="10,42 30,35 50,22 70,8 90,15 110,5 130,18 150,30 170,40 190,48 210,38 230,28 250,20 270,14" fill="none" stroke="#60A5FA" stroke-width="1.5"/>
          <!-- Mark where RSI makes lower high -->
          <circle cx="110" cy="5" r="3" fill="#EF4444"/>
          <circle cx="270" cy="14" r="3" fill="#EF4444"/>
          <line x1="110" y1="5" x2="270" y2="14" stroke="#EF4444" stroke-width="1" stroke-dasharray="2,2"/>
          <text x="190" y="58" text-anchor="middle" fill="#EF4444" font-size="7">RSI lower high = weakening momentum</text>
        </svg>
      </div>
    </div>`,
};

// ── PATCH LESSON RENDERING TO INJECT VISUALS ──
const _origRenderLesson = renderLesson;
function renderLesson() {
  const base = _origRenderLesson();
  if (!_currentLesson) return base;
  const lessonId = _currentLesson.lesson.id;
  const visual = LESSON_VISUALS[lessonId];
  if (!visual) return base;
  // Inject visual after the lesson body content
  return base.replace('</div>\n\n    ${quiz', visual + '</div>\n\n    ${quiz')
             .replace('class="a-fadeup3 lesson-body">', 'class="a-fadeup3 lesson-body">');
}

// Better: patch the lesson body rendering directly
const _origRenderLesson2 = renderLesson;
function renderLesson() {
  if (!_currentLesson) { navigate('learn'); return ''; }
  const {lesson: l, category: cat} = _currentLesson;
  const done = STATE.progress[l.id];
  const allInCat = cat.lessons;
  const idx = allInCat.findIndex(x => x.id === l.id);
  const quiz = (typeof QUIZZES !== 'undefined') ? QUIZZES[l.id] : null;
  const visual = LESSON_VISUALS[l.id] || '';

  return \`<div class="screen-pad">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px" class="a-fadeup">
      <button class="back-btn" onclick="navigate('learn')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div style="flex:1">
        <div style="font-size:10px;color:var(--gold);font-family:var(--display);font-weight:700;letter-spacing:1px">\${cat.title.toUpperCase()}</div>
        <div style="font-size:11px;color:var(--txt3)">Lesson \${idx + 1} of \${allInCat.length}</div>
      </div>
      \${done ? '<span class="pill pill-green">✓ Done</span>' : ''}
    </div>

    <div class="a-fadeup2" style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <div style="font-size:38px;flex-shrink:0">\${l.emoji}</div>
      <div>
        <h1 style="font-size:20px;line-height:1.2">\${l.title}</h1>
        <div style="font-size:12px;color:var(--txt2);margin-top:4px">⏱ \${l.mins} min · +\${l.xp || 50} XP on completion</div>
      </div>
    </div>

    <div class="a-fadeup3 lesson-body">\${l.content}</div>

    \${visual ? \`<div class="a-fadeup4">\${visual}</div>\` : ''}

    \${quiz ? renderLessonQuiz(l.id, quiz) : ''}

    <div class="a-fadeup4" style="margin-top:24px;display:flex;gap:10px">
      \${!done
        ? \`<button class="btn btn-gold" onclick="completelesson('\${l.id}')">✓ Mark Complete · +\${l.xp || 50} XP</button>\`
        : \`<button class="btn btn-ghost btn-sm" onclick="navigate('learn')" style="width:auto">← Back</button>\`
      }
      \${idx < allInCat.length - 1
        ? \`<button class="btn btn-outline btn-sm" onclick="openLesson('\${allInCat[idx + 1].id}')" style="width:auto">Next →</button>\`
        : ''
      }
    </div>

    \${idx < allInCat.length - 1 ? \`
    <div style="margin-top:20px">
      <div class="section-lbl">Up Next</div>
      <div class="lesson-card" onclick="openLesson('\${allInCat[idx + 1].id}')">
        <div class="lesson-icon">\${allInCat[idx + 1].emoji}</div>
        <div class="lesson-meta">
          <div class="lesson-title">\${allInCat[idx + 1].title}</div>
          <div class="lesson-sub">⏱ \${allInCat[idx + 1].mins} min · +\${allInCat[idx + 1].xp || 50} XP</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>\` : ''}
  </div>\`;
}

console.log('✅ v7: Quick access, mentor, visuals, charts all patched');


/* ═══════════════════════════════════════════════════
   

/* ═══ V8 SOUNDS & AUDIO ENGINE ═══ */
const SOUNDS = {
  _ctx: null,
  getCtx() {
    if (!this._ctx) this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    return this._ctx;
  },
  play(type) {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const configs = {
        notification: {freq:[880,1100],dur:0.15,vol:0.3},
        achievement:  {freq:[523,659,784,1047],dur:0.12,vol:0.35},
        levelUp:      {freq:[392,494,587,784],dur:0.15,vol:0.4},
        tradeBuy:     {freq:[440,550],dur:0.1,vol:0.25},
        tradeSell:    {freq:[350,280],dur:0.1,vol:0.25},
        tradeWin:     {freq:[523,659,784],dur:0.12,vol:0.35},
        tradeLoss:    {freq:[280,220],dur:0.15,vol:0.2},
        xp:           {freq:[660,880],dur:0.08,vol:0.2},
        alert:        {freq:[1000,800,1000],dur:0.1,vol:0.3},
      };
      const cfg = configs[type] || configs.notification;
      const now = ctx.currentTime;
      const freqs = Array.isArray(cfg.freq) ? cfg.freq : [cfg.freq];
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(cfg.vol, now+0.01);
      freqs.forEach((f,i) => osc.frequency.setValueAtTime(f, now+i*cfg.dur));
      gain.gain.linearRampToValueAtTime(0, now+freqs.length*cfg.dur+0.05);
      osc.start(now);
      osc.stop(now+freqs.length*cfg.dur+0.1);
    } catch(e) {}
  }
};

/* ═══ V8 AI ACTIVITY TRACKER ═══ */
AI ACTIVITY TRACKING — Rule-Based Intelligence ──
const AI_TRACKER = {
  // Track every significant event
  logLesson(lessonId, action) {
    BEHAVIOR.log('lesson_' + action, { lessonId });
    if (action === 'complete') {
      AI_TRACKER.analyzeProgress();
    }
  },

  logTrade(trade) {
    BEHAVIOR.log('trade_logged', {
      pair: trade.pair,
      direction: trade.direction,
      pnl: trade.pnl,
      mood: trade.mood,
      plan: trade.plan,
      setup: trade.setup,
    });
    AI_TRACKER.analyzeTradePattern(trade);
  },

  logSimTrade(trade) {
    BEHAVIOR.log('sim_trade', {
      pair: trade.pair,
      dir: trade.dir,
      pnl: trade.pnl,
      reason: trade.reason,
    });
  },

  analyzeProgress() {
    const completed = Object.keys(STATE.progress).length;
    const milestones = [5, 10, 20, 30, 40];
    if (milestones.includes(completed)) {
      showToast(`🎓 Milestone: ${completed} lessons complete!`, 4000);
      addNotification(`You've completed ${completed} lessons! Keep going.`, '🎓');
    }
  },

  analyzeTradePattern(trade) {
    const j = STATE.journal || [];
    if (j.length < 3) return;

    // Detect revenge trading
    const recent3 = j.slice(-3);
    const recentLosses = recent3.filter(t => parseFloat(t.pnl) < 0).length;
    if (recentLosses >= 2 && trade.mood === 'frustrated') {
      setTimeout(() => {
        showToast('⚠️ TradeMind: Pattern detected — possible revenge trading. Take a break.', 5000);
        addNotification('Revenge trading pattern detected in your last 3 trades.', '⚠️');
        SOUNDS.play('alert');
      }, 1000);
    }

    // Detect FOMO
    const notes = (trade.notes || '').toLowerCase();
    if (notes.includes('fomo') || notes.includes('chased') || notes.includes('missed')) {
      addNotification('FOMO trade logged. Review if entry was at your planned level.', '🏃');
    }

    // Positive reinforcement
    const winStreak = j.slice(-5).filter(t => parseFloat(t.pnl) > 0).length;
    if (winStreak === 5) {
      setTimeout(() => {
        showToast('🔥 5-trade win streak! Stay disciplined — don't oversize now.', 4000);
        addNotification('5-trade winning streak! Reminder: keep position sizes consistent.', '🔥');
        SOUNDS.play('achievement');
      }, 800);
    }
  },

  getDailyBriefing() {
    const j = STATE.journal || [];
    const t = STATE.simTrades || [];
    const dna = calculateTraderDNA ? calculateTraderDNA() : null;
    const hr = new Date().getHours();
    const session = hr >= 8 && hr < 12 ? 'London open' :
                    hr >= 13 && hr < 17 ? 'London/NY overlap (best time)' :
                    hr >= 17 && hr < 22 ? 'NY session' : 'off-hours';

    const parts = [];
    parts.push(`Current: ${session} 🕐`);

    const recentPnL = [...j,...t].slice(-5).reduce((a,x)=>a+(parseFloat(x.pnl)||0),0);
    if (recentPnL > 0) parts.push(`Last 5 trades: <strong style="color:var(--green)">+$${recentPnL.toFixed(0)} ✅</strong>`);
    else if (recentPnL < 0) parts.push(`Last 5 trades: <strong style="color:var(--red)">-$${Math.abs(recentPnL).toFixed(0)} ⚠️</strong>`);

    if (dna) {
      const lowest = Object.entries(dna.scores).sort((a,b)=>a[1]-b[1])[0];
      const labels = {discipline:'Discipline',patience:'Patience',riskManagement:'Risk Mgmt',emotionalControl:'Emotional Control',consistency:'Consistency',knowledge:'Knowledge'};
      parts.push(`Focus area: <strong>${labels[lowest[0]]}</strong> (${lowest[1]}/100)`);
    }

    const streak = STATE.dailyStreak || 0;
    if (streak > 0) parts.push(`Streak: <strong style="color:var(--orange)">${streak} days 🔥</strong>`);

    return parts.join(' · ');
  },

  getContextualSuggestion() {
    const j = STATE.journal || [];
    const completed = Object.keys(STATE.progress).length;
    const total = totalLessons ? totalLessons() : 40;

    // Time-based suggestions
    const hr = new Date().getHours();
    if (hr >= 7 && hr <= 9) return '☀️ Pre-session: Check the economic calendar and mark your key S/R levels before the London open.';
    if (hr >= 13 && hr <= 17) return '⚡ Peak hours active. London/NY overlap — your highest-probability trading window is open.';
    if (hr >= 22 || hr <= 5) return '🌙 Off-hours: Perfect time for learning, strategy review, and journaling.';

    // Data-based suggestions
    if (j.length === 0) return '📓 Start logging your trades — even sim trades. The more data you give me, the better I understand you.';
    if (completed < 5) return '📚 Complete the Forex Basics section first — it's the foundation everything else builds on.';

    const recentMoods = j.slice(-5).map(t=>t.mood);
    if (recentMoods.filter(m=>m==='revenge'||m==='frustrated').length >= 2) return '🧠 Your recent trades show emotional stress. Consider taking a break before your next session.';

    if (j.length >= 10) {
      const wr = Math.round(j.filter(t=>parseFloat(t.pnl)>0).length/j.length*100);
      if (wr < 40) return '🎯 Win rate below 40%. Focus on setup quality — only enter trades with 3+ confluence factors.';
      if (wr >= 60) return '✅ Strong win rate! Now focus on maximizing your average win vs average loss ratio.';
    }

    return '💡 Consistency is the mother of mastery. One lesson + one trade + one journal entry every day.';
  }
};





// ── INIT TERMINAL ON TRADE SCREEN ──
const _origRenderScreenV8 = renderScreen;
function renderScreen(screen) {
  _origRenderScreenV8(screen);
  if (screen === 'trade') {
    setTimeout(initTerminal, 100);
  }
}

console.log('✅ TradeBaby v8: Sounds + More Menu + AI Tracking + Terminal loaded'

/* ═══ V8 AI TRACKER PATCHES ═══ */
// Patch completelesson for AI tracking
const _origCompleteLesson_v8 = completelesson;
function completelesson(id) {
  _origCompleteLesson_v8(id);
  if (typeof AI_TRACKER !== 'undefined') AI_TRACKER.logLesson(id, 'complete');
}

// Patch saveJournalEntry for AI tracking
const _origSaveJE_v8 = saveJournalEntry;
function saveJournalEntry() {
  _origSaveJE_v8();
  const latest = STATE.journal[STATE.journal.length-1];
  if (latest && typeof AI_TRACKER !== 'undefined') AI_TRACKER.logTrade(latest);
}

// Patch showToast for sounds
const _origShowToast_v8 = showToast;
function showToast(msg, duration=2800, soundType=null) {
  _origShowToast_v8(msg, duration);
  if (!soundType) {
    if (msg.includes('🏅') || msg.includes('Achievement') || msg.includes('Challenge')) soundType='achievement';
    else if (msg.includes('Level')) soundType='levelUp';
    else if (msg.includes('+') && msg.includes('XP')) soundType='xp';
    else if (msg.includes('Profit') || msg.includes('Take Profit')) soundType='tradeWin';
    else if (msg.includes('Stop Loss')) soundType='tradeLoss';
  }
  if (soundType) SOUNDS.play(soundType);
}

// Patch openSimTrade for sounds
const _origOpenSim_v8 = openSimTrade;
function openSimTrade(dir) {
  SOUNDS.play(dir==='BUY'?'tradeBuy':'tradeSell');
  _origOpenSim_v8(dir);
}

// Patch addNotification for sound
const _origAddNotif_v8 = addNotification;
function addNotification(text, icon='📢') {
  _origAddNotif_v8(text, icon);
  SOUNDS.play('notification');
  const dot1 = document.getElementById('mentor-dot');
  const dot2 = document.getElementById('more-mentor-dot');
  const unread = (STATE.notifications||[]).filter(n=>!n.read).length;
  if (dot1) dot1.style.display = unread>0?'block':'none';
  if (dot2) dot2.style.display = unread>0?'block':'none';
}

/* ═══ RENDERSCREEN — SINGLE AUTHORITATIVE VERSION ═══ */
function renderScreen(screen) {
  const screenEl = document.getElementById('screen');
  if (!screenEl) return;
  closeMoreMenu();

  const screens = {
    home: renderHome,
    learn: renderLearn,
    lesson: renderLesson,
    trade: renderTrade,
    journal: renderJournal,
    mentor: renderMentor,
    profile: renderProfile,
    strategies: renderStrategies,
    calculator: renderCalculator,
    analytics: renderAnalytics,
    settings: renderSettings,
    flashcards: renderFlashcards,
    patterns: renderPatternGame,
    candlebible: renderCandleBible,
    skillmap: renderSkillMap,
    curriculum: renderCurriculum,
    notifications: renderNotifications,
    dna: renderTraderDNA,
    forensics: renderForensics,
    mypath: renderMyPath,
    challenges: renderChallenges,
    shoulditrade: renderShouldITrade,
    pairprofiles: renderPairProfiles,
    vault: renderKnowledgeVault,
    biastest: renderBiasTest,
  };

  const fn = screens[screen];
  screenEl.innerHTML = '';
  screenEl.innerHTML = fn ? fn() : renderHome();

  if (screen==='trade') setTimeout(initTerminal,100);
  if (screen==='analytics') setTimeout(initEquityChart,100);
  if (screen==='home') initForexClock();
  if (screen==='patterns') setTimeout(drawPatternCanvas,80);

  const sw = document.getElementById('screen-wrap');
  if (screen==='mentor') {
    if (sw) sw.style.paddingBottom='0';
    setTimeout(()=>{
      const msgs=document.getElementById('chat-messages');
      if(msgs) msgs.scrollTop=msgs.scrollHeight;
    },80);
  } else {
    if (sw) sw.style.paddingBottom='';
  }
}

/* ═══ NAVIGATE — SINGLE AUTHORITATIVE VERSION ═══ */
function navigate(screen, opts={}) {
  closeMoreMenu();
  if (typeof _simPriceInterval!=='undefined' && _simPriceInterval) { clearInterval(_simPriceInterval); _simPriceInterval=null; }
  if (typeof _termPriceInterval!=='undefined' && _termPriceInterval && screen!=='trade') { clearInterval(_termPriceInterval); _termPriceInterval=null; }
  if (typeof _clockInterval!=='undefined' && _clockInterval && screen!=='home') { clearInterval(_clockInterval); _clockInterval=null; }

  STATE.screen = screen;
  if (typeof BEHAVIOR!=='undefined') BEHAVIOR.log('screen_visit',{screen});

  document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
  const nav5={home:'ni-home',learn:'ni-learn',trade:'ni-trade',journal:'ni-journal'};
  const navId=nav5[screen];
  if (navId) { const nb=document.getElementById(navId); if(nb) nb.classList.add('active'); }
  else { const m=document.getElementById('ni-more'); if(m) m.classList.add('active'); }

  renderScreen(screen);
  const sw=document.getElementById('screen-wrap');
  if (sw) sw.scrollTop=0;
}

/* ═══ TOUCH-AWARE QUICK ACCESS ═══ */
let _qaTX=0, _qaTY=0;
function qaTouch(el) {
  _qaTX=event.touches[0].clientX; _qaTY=event.touches[0].clientY;
  el.style.transform='scale(0.95)'; el.style.borderColor='var(--gold)';
}
function qaTap(el, action) {
  el.style.transform=''; el.style.borderColor='';
  const dx=Math.abs(event.changedTouches[0].clientX-_qaTX);
  const dy=Math.abs(event.changedTouches[0].clientY-_qaTY);
  if (dx<12&&dy<12) navigate(action);
}

/* ═══ SWIPE GESTURE ═══ */
(function initSwipe(){
  let tx=0,ty=0,tgt=null;
  document.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;tgt=e.target;},{passive:true});
  document.addEventListener('touchend',e=>{
    if (document.getElementById('modal-backdrop')?.style.display!=='none') return;
    if (STATE.screen==='mentor') return;
    if (tgt&&tgt.closest('.h-scroll,[style*="overflow-x"],[id^="float"]')) return;
    const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty;
    if (Math.abs(dx)>90&&Math.abs(dx)>Math.abs(dy)*2.5) {
      const order=['home','learn','trade','journal'];
      const cur=order.indexOf(STATE.screen);
      if (cur!==-1) {
        if (dx<0&&cur<order.length-1) navigate(order[cur+1]);
        else if (dx>0&&cur>0) navigate(order[cur-1]);
      }
    }
  },{passive:true});
})();

/* ═══ RIPPLE ═══ */
document.addEventListener('click',e=>{
  const btn=e.target.closest('.btn-gold,.btn-outline,.btn-success,.btn-ghost');
  if(!btn)return;
  const r=document.createElement('span');r.className='btn-ripple';
  const rect=btn.getBoundingClientRect();
  r.style.left=(e.clientX-rect.left-5)+'px';r.style.top=(e.clientY-rect.top-5)+'px';
  btn.style.position='relative';btn.style.overflow='hidden';
  btn.appendChild(r);setTimeout(()=>r.remove(),600);
});

/* ═══ SERVICE WORKER ═══ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js',{scope:'./'})
      .then(reg=>{
        console.log('✅ TradeBaby SW registered');
        if ('caches' in window) caches.open('tradebaby-pro-v8').then(c=>c.add(window.location.href).catch(()=>{}));
        reg.addEventListener('updatefound',()=>{
          const nw=reg.installing;
          if(nw) nw.addEventListener('statechange',()=>{
            if(nw.state==='installed'&&navigator.serviceWorker.controller) showToast('🔄 Update available — refresh for latest');
          });
        });
      })
      .catch(e=>console.log('SW:',e.message));
  });
}

/* ═══ URL SHORTCUTS ═══ */
(function(){
  const p=new URLSearchParams(window.location.search);
  const s=p.get('screen');
  if(s) window.addEventListener('tb_ready',()=>setTimeout(()=>navigate(s),300));
})();

/* ═══ AUTOSAVE ═══ */
setInterval(saveState,30000);

/* ═══ BOOT ═══ */
document.addEventListener('DOMContentLoaded', bootApp);

/* ═══ PREVENT DOUBLE-TAP ZOOM ═══ */
let _lt=0;
document.addEventListener('touchend',e=>{const n=Date.now();if(n-_lt<280)e.preventDefault();_lt=n;},{passive:false});

console.log('🚀 TradeBaby Pro v8 by SayMy Tech — all systems loaded');
window.dispatchEvent(new Event('tb_ready'));
