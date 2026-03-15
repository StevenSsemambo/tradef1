/* ═══ PROFILE & ANALYTICS ═══ */
/* ═══ PROFILE SCREEN ═══ */

function renderProfile() {
  const wins = STATE.simTrades.filter(t => t.pnl > 0).length;
  const totalPnl = STATE.simTrades.reduce((a, t) => a + (t.pnl || 0), 0);
  const winRate = STATE.simTrades.length > 0 ? Math.round(wins / STATE.simTrades.length * 100) : 0;
  const xpPct = Math.round(STATE.user.xp / STATE.user.xpNext * 100);

  const BADGES = [
    {id:'first-lesson',   emoji:'📚', name:'First Step'},
    {id:'five-lessons',   emoji:'🎯', name:'Getting Going'},
    {id:'ten-lessons',    emoji:'💪', name:'Committed'},
    {id:'twenty-lessons', emoji:'🔥', name:'On Fire'},
    {id:'all-lessons',    emoji:'🏆', name:'Graduate'},
    {id:'first-trade',    emoji:'📈', name:'First Trade'},
    {id:'ten-trades',     emoji:'💼', name:'Active Trader'},
    {id:'first-journal',  emoji:'📓', name:'First Entry'},
    {id:'ten-journal',    emoji:'✍️', name:'Chronicler'},
    {id:'streak-3',       emoji:'🔥', name:'3-Day Streak'},
    {id:'streak-7',       emoji:'⚡', name:'Week Streak'},
    {id:'streak-30',      emoji:'🌟', name:'Month Legend'},
    {id:'level-5',        emoji:'⭐', name:'Rising Star'},
    {id:'level-10',       emoji:'💫', name:'Pro Trader'},
    {id:'profitable',     emoji:'💰', name:'In Profit'},
    {id:'flashcard-20',   emoji:'🃏', name:'Card Shark'},
    {id:'pattern-10',     emoji:'🔍', name:'Pattern Spotter'},
    {id:'pattern-50',     emoji:'🎯', name:'Pattern Master'},
  ];

  const earnedCount = BADGES.filter(b => STATE.achievements.includes(b.id)).length;

  return `<div class="screen-pad">
    <div class="a-fadeup" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <h1 class="pg-title">My Profile</h1>
      <div style="display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="navigate('analytics')">📊 Stats</button>
        <button class="btn-icon" onclick="navigate('settings')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg></button>
      </div>
    </div>

    <!-- Profile card -->
    <div class="card card-gold a-fadeup2" style="padding:20px;margin-bottom:14px;text-align:center;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(201,168,76,.12),transparent 70%);pointer-events:none"></div>
      <div style="width:76px;height:76px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-d));display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:32px;font-family:var(--display);font-weight:800;color:#0A0A0F;box-shadow:0 4px 20px var(--gold-glow)">
        ${(STATE.user.name || 'T').charAt(0).toUpperCase()}
      </div>
      <div style="font-family:var(--display);font-weight:800;font-size:22px">${STATE.user.name || 'Trader'}</div>
      <div style="color:var(--gold);font-size:13px;margin-top:3px;font-family:var(--display)">Level ${STATE.user.level} Trader</div>
      ${STATE.user.goal ? `<div style="font-size:11px;color:var(--txt3);margin-top:4px">Goal: ${STATE.user.goal.replace(/-/g,' ')}</div>` : ''}
      <div style="display:flex;justify-content:center;gap:20px;margin-top:14px;padding-top:14px;border-top:1px solid var(--bdr2)">
        <div><div style="font-family:var(--display);font-weight:800;font-size:20px;color:var(--gold)">${STATE.dailyStreak}🔥</div><div style="font-size:10px;color:var(--txt3);font-family:var(--display)">STREAK</div></div>
        <div style="width:1px;background:var(--bdr2)"></div>
        <div><div style="font-family:var(--display);font-weight:800;font-size:20px;color:var(--gold)">${completedCount()}</div><div style="font-size:10px;color:var(--txt3);font-family:var(--display)">LESSONS</div></div>
        <div style="width:1px;background:var(--bdr2)"></div>
        <div><div style="font-family:var(--display);font-weight:800;font-size:20px;color:var(--gold)">${STATE.user.xp}</div><div style="font-size:10px;color:var(--txt3);font-family:var(--display)">XP</div></div>
      </div>
    </div>

    <!-- XP bar -->
    <div class="xp-wrap a-fadeup3" style="margin-bottom:14px">
      <div class="xp-row">
        <div class="xp-level">Level ${STATE.user.level}</div>
        <div class="xp-pts">${STATE.user.xp} / ${STATE.user.xpNext} XP</div>
      </div>
      <div class="prog-bar lg"><div class="prog-fill" style="width:${xpPct}%"></div></div>
      <div style="font-size:11px;color:var(--txt3);margin-top:5px">${STATE.user.xpNext - STATE.user.xp} XP to Level ${STATE.user.level + 1}</div>
    </div>

    <!-- Sim stats -->
    <div class="a-fadeup3" style="margin-bottom:14px">
      <div class="section-lbl">Simulation Account</div>
      <div class="stat-grid">
        <div class="stat-box"><div class="stat-val" style="color:${totalPnl>=0?'var(--green)':'var(--red)'}">${totalPnl>=0?'+':''}$${Math.abs(totalPnl).toFixed(0)}</div><div class="stat-lbl">Net P&L</div></div>
        <div class="stat-box"><div class="stat-val">${winRate}%</div><div class="stat-lbl">Win Rate</div></div>
        <div class="stat-box"><div class="stat-val">${STATE.simTrades.length}</div><div class="stat-lbl">Trades</div></div>
        <div class="stat-box"><div class="stat-val">${fmtCurrency(STATE.simEquity).replace('$','')}</div><div class="stat-lbl">Equity</div></div>
      </div>
    </div>

    <!-- Streak Calendar -->
    <div class="a-fadeup4" style="margin-bottom:14px">
      <div class="section-lbl">Activity (Last 28 Days)</div>
      <div class="card" style="padding:12px">
        <div class="streak-grid">
          ${Array.from({length:28},(_,i)=>{
            const isToday=i===27;
            const active=isToday||Math.random()>.45;
            return `<div class="streak-day ${isToday?'today':active?'active':''}"></div>`;
          }).join('')}
        </div>
        <div style="font-size:10px;color:var(--txt3);margin-top:8px">
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--gold);vertical-align:middle;margin-right:4px"></span>Today
          &nbsp;
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:rgba(34,197,94,.6);vertical-align:middle;margin-right:4px"></span>Active
        </div>
      </div>
    </div>

    <!-- Achievements -->
    <div class="a-fadeup5">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="section-lbl" style="margin-bottom:0">Achievements</div>
        <span style="font-size:12px;color:var(--txt2)">${earnedCount}/${BADGES.length} earned</span>
      </div>
      <div class="badge-grid">
        ${BADGES.map(b => {
          const earned = STATE.achievements.includes(b.id);
          return `<div class="badge ${earned?'earned':'locked'}" onclick="showToast('${earned?'🏅':'🔒'} ${b.name}')">
            <div class="badge-icon">${b.emoji}</div>
            <div class="badge-name">${b.name}</div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--bdr2)">
      <button class="btn btn-danger btn-sm" onclick="if(confirm('Reset sim to $10,000?')){STATE.simBalance=10000;STATE.simEquity=10000;STATE.simTrades=[];saveState();showToast('🔄 Sim reset');navigate('profile')}">Reset Sim Account</button>
    </div>
  </div>`;
}

/* ═══ ANALYTICS ═══ */
function renderAnalytics() {
  return `<div class="screen-pad">
    <div class="pg-header a-fadeup" style="padding:0 0 14px">
      <div style="display:flex;gap:10px;align-items:center">
        <button class="back-btn" onclick="navigate('profile')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
        <h1 class="pg-title">Analytics</h1>
      </div>
    </div>

    <div class="section-lbl a-fadeup2">Equity Curve</div>
    <div class="equity-wrap a-fadeup2" style="height:160px;margin-bottom:14px">
      <canvas id="equity-chart" style="width:100%;height:160px"></canvas>
    </div>

    ${renderAnalyticsSummary()}

    <div class="section-lbl a-fadeup4" style="margin-top:16px">Course Progress</div>
    <div class="card a-fadeup4" style="padding:14px;margin-bottom:12px">
      ${CURRICULUM.map(cat => {
        const done = cat.lessons.filter(l => STATE.progress[l.id]).length;
        const pct = Math.round(done / cat.lessons.length * 100);
        return `<div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
            <span>${cat.emoji} ${cat.title}</span>
            <span style="color:var(--gold);font-family:var(--mono)">${done}/${cat.lessons.length}</span>
          </div>
          <div class="prog-bar"><div class="prog-fill" style="width:${pct}%"></div></div>
        </div>`;
      }).join('')}
    </div>

    <div class="section-lbl a-fadeup5">Activity</div>
    <div class="stat-grid a-fadeup5">
      <div class="stat-box"><div class="stat-val">${STATE.dailyStreak}🔥</div><div class="stat-lbl">Streak</div></div>
      <div class="stat-box"><div class="stat-val">${STATE.user.level}</div><div class="stat-lbl">Level</div></div>
      <div class="stat-box"><div class="stat-val">${STATE.user.xp}</div><div class="stat-lbl">XP</div></div>
      <div class="stat-box"><div class="stat-val">${STATE.journal.length}</div><div class="stat-lbl">Journal</div></div>
    </div>
  </div>`;
}

function renderAnalyticsSummary() {
  const trades = STATE.simTrades;
  if (!trades.length) return `<div class="card a-fadeup3" style="padding:14px;text-align:center;color:var(--txt3);margin-bottom:12px">Complete sim trades to see analytics</div>`;
  const wins = trades.filter(t => t.pnl > 0);
  const losses = trades.filter(t => t.pnl <= 0);
  const totalPnl = trades.reduce((a, t) => a + t.pnl, 0);
  const wr = Math.round(wins.length / trades.length * 100);
  const avgW = wins.length ? wins.reduce((a,t)=>a+t.pnl,0)/wins.length : 0;
  const avgL = losses.length ? Math.abs(losses.reduce((a,t)=>a+t.pnl,0)/losses.length) : 0;
  const pf = avgL > 0 ? ((avgW*wins.length)/(avgL*losses.length)).toFixed(2) : '∞';
  return `<div class="stat-grid a-fadeup3" style="margin-bottom:12px">
    <div class="stat-box"><div class="stat-val" style="color:${totalPnl>=0?'var(--green)':'var(--red)'}">${totalPnl>=0?'+':''}$${Math.abs(totalPnl).toFixed(0)}</div><div class="stat-lbl">Total P&L</div></div>
    <div class="stat-box"><div class="stat-val">${wr}%</div><div class="stat-lbl">Win Rate</div></div>
    <div class="stat-box"><div class="stat-val">${trades.length}</div><div class="stat-lbl">Trades</div></div>
    <div class="stat-box"><div class="stat-val" style="color:${parseFloat(pf)>=1?'var(--green)':'var(--red)'}">${pf}</div><div class="stat-lbl">P Factor</div></div>
  </div>`;
}

function initEquityChart() {
  const canvas = document.getElementById('equity-chart');
  if (!canvas) return;
  canvas.width = canvas.offsetWidth || 340;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  let eq = [10000];
  STATE.simTrades.forEach(t => eq.push(eq[eq.length-1] + t.pnl));
  const w = canvas.width, h = canvas.height;
  const minE = Math.min(...eq) * .996, maxE = Math.max(...eq) * 1.004;
  const range = maxE - minE || 1;
  const sy = v => h - ((v-minE)/range)*(h-20) - 10;
  const sx = i => (i/Math.max(eq.length-1,1))*w;
  ctx.clearRect(0,0,w,h);
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg3').trim() || '#18181F';
  ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);
  if (eq.length < 2) {
    ctx.fillStyle='#5A5855'; ctx.font='12px sans-serif'; ctx.textAlign='center';
    ctx.fillText('Make sim trades to see equity curve', w/2, h/2); return;
  }
  const color = eq[eq.length-1] >= 10000 ? '#22C55E' : '#EF4444';
  ctx.beginPath(); ctx.moveTo(sx(0), sy(eq[0]));
  eq.forEach((v,i) => ctx.lineTo(sx(i), sy(v)));
  ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
  const grad = ctx.createLinearGradient(0,0,0,h);
  grad.addColorStop(0, color+'44'); grad.addColorStop(1, color+'00');
  ctx.fillStyle=grad; ctx.fill();
  ctx.beginPath(); ctx.moveTo(sx(0), sy(eq[0]));
  eq.forEach((v,i) => ctx.lineTo(sx(i), sy(v)));
  ctx.strokeStyle=color; ctx.lineWidth=2.5; ctx.stroke();
  ctx.fillStyle='#C9A84C'; ctx.font='bold 10px monospace'; ctx.textAlign='right';
  ctx.fillText('$'+eq[eq.length-1].toFixed(0), w-4, sy(eq[eq.length-1])-4);
}

/* ═══ CALCULATOR ═══ */
let _calcTab = 'position';

function renderCalculator() {
  return `<div class="screen-pad">
    <div class="pg-header a-fadeup" style="padding:0 0 12px">
      <div style="display:flex;gap:10px;align-items:center">
        <button class="back-btn" onclick="navigate('trade')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
        <h1 class="pg-title">Calculator</h1>
      </div>
    </div>
    <div class="tab-bar a-fadeup2">
      ${['position','pip','profit'].map(t => `<div class="tab-btn ${_calcTab===t?'active':''}" onclick="_calcTab='${t}';document.getElementById('calc-body').innerHTML=renderCalcBody()">${t.charAt(0).toUpperCase()+t.slice(1)}</div>`).join('')}
    </div>
    <div id="calc-body" class="a-fadeup3">${renderCalcBody()}</div>
  </div>`;
}

function renderCalcBody() {
  if (_calcTab === 'pip') return `
    <div class="section-lbl">Pip Value Calculator</div>
    <p style="font-size:12px;color:var(--txt2);margin-bottom:12px">Calculate the dollar value of each pip movement</p>
    <div class="inp-wrap"><label class="inp-label">Lot Size</label><input class="inp" id="pv-lots" type="number" value="0.10" step="0.01"></div>
    <div class="inp-wrap"><label class="inp-label">Pair Type</label>
      <select class="inp" id="pv-pair">
        <option value="usd-quote">USD-quoted (EUR/USD, GBP/USD, AUD/USD)</option>
        <option value="jpy">JPY pairs (USD/JPY, EUR/JPY, GBP/JPY)</option>
        <option value="usd-base">USD-base (USD/CHF, USD/CAD)</option>
        <option value="gold">Gold (XAU/USD)</option>
      </select>
    </div>
    <div class="inp-wrap"><label class="inp-label">Current Exchange Rate</label><input class="inp" id="pv-rate" type="number" value="1.0850" step="0.0001"></div>
    <button class="btn btn-gold" onclick="calcPipValue()">Calculate Pip Value</button>
    <div id="pv-result" style="margin-top:12px"></div>`;

  if (_calcTab === 'profit') return `
    <div class="section-lbl">Profit / Loss Calculator</div>
    <div class="inp-wrap"><label class="inp-label">Direction</label>
      <select class="inp" id="pl-dir"><option value="1">BUY (Long)</option><option value="-1">SELL (Short)</option></select>
    </div>
    <div class="inp-row">
      <div class="inp-wrap"><label class="inp-label">Lot Size</label><input class="inp" id="pl-lots" type="number" value="0.10" step="0.01"></div>
      <div class="inp-wrap"><label class="inp-label">Pip Value ($/pip)</label><input class="inp" id="pl-pv" type="number" value="0.10" step="0.01"></div>
    </div>
    <div class="inp-row">
      <div class="inp-wrap"><label class="inp-label">Entry Price</label><input class="inp" id="pl-entry" type="number" value="1.0800" step="0.0001"></div>
      <div class="inp-wrap"><label class="inp-label">Exit Price</label><input class="inp" id="pl-exit" type="number" value="1.0860" step="0.0001"></div>
    </div>
    <button class="btn btn-gold" onclick="calcProfitLoss()">Calculate P&L</button>
    <div id="pl-result" style="margin-top:12px"></div>`;

  return `
    <div class="section-lbl">Position Size Calculator</div>
    <p style="font-size:12px;color:var(--txt2);margin-bottom:12px">Find the exact lot size for your account and risk tolerance</p>
    <div class="inp-row">
      <div class="inp-wrap"><label class="inp-label">Account Balance ($)</label><input class="inp" id="c-bal" type="number" value="10000"></div>
      <div class="inp-wrap"><label class="inp-label">Risk Percentage (%)</label><input class="inp" id="c-risk" type="number" value="1" step="0.5" min="0.1" max="10"></div>
    </div>
    <div class="inp-row">
      <div class="inp-wrap"><label class="inp-label">Stop Loss (pips)</label><input class="inp" id="c-sl" type="number" value="30"></div>
      <div class="inp-wrap"><label class="inp-label">Pip Value Type</label>
        <select class="inp" id="c-pv">
          <option value="10">Majors (std lot $10/pip)</option>
          <option value="6.67">JPY pairs (std lot $6.67)</option>
          <option value="1">Mini lot ($1/pip)</option>
          <option value="0.10">Micro lot ($0.10/pip)</option>
        </select>
      </div>
    </div>
    <button class="btn btn-gold" onclick="calcPositionSize()">Calculate Position Size</button>
    <div id="c-result" style="margin-top:12px"></div>`;
}

function calcPositionSize() {
  const bal = parseFloat(document.getElementById('c-bal').value) || 10000;
  const risk = parseFloat(document.getElementById('c-risk').value) || 1;
  const sl = parseFloat(document.getElementById('c-sl').value) || 30;
  const pv = parseFloat(document.getElementById('c-pv').value) || 10;
  const riskAmt = bal * (risk / 100);
  const lots = riskAmt / (sl * pv);
  const rr2 = (riskAmt * 2).toFixed(2);
  const rr3 = (riskAmt * 3).toFixed(2);
  document.getElementById('c-result').innerHTML = `
    <div class="card card-gold" style="padding:14px">
      <div class="section-lbl">Result</div>
      <div class="stat-grid3" style="margin-bottom:10px">
        <div class="calc-res"><div class="calc-res-val">${lots.toFixed(2)}</div><div class="calc-res-lbl">Lot Size</div></div>
        <div class="calc-res"><div class="calc-res-val">$${riskAmt.toFixed(2)}</div><div class="calc-res-lbl">Max Risk</div></div>
        <div class="calc-res"><div class="calc-res-val">${risk}%</div><div class="calc-res-lbl">Account %</div></div>
      </div>
      <div style="font-size:12px;color:var(--txt2)">
        At 1:2 R:R → target profit: <strong style="color:var(--green)">$${rr2}</strong><br>
        At 1:3 R:R → target profit: <strong style="color:var(--green)">$${rr3}</strong>
      </div>
    </div>`;
}

function calcPipValue() {
  const lots = parseFloat(document.getElementById('pv-lots').value) || 0.1;
  const pair = document.getElementById('pv-pair').value;
  const rate = parseFloat(document.getElementById('pv-rate').value) || 1.085;
  const units = lots * 100000;
  let pv;
  if (pair === 'usd-quote') pv = units * 0.0001;
  else if (pair === 'jpy') pv = (units * 0.01) / rate;
  else if (pair === 'gold') pv = units * 0.01;
  else pv = (units * 0.0001) / rate;
  document.getElementById('pv-result').innerHTML = `
    <div class="card card-gold" style="padding:14px">
      <div class="inp-row">
        <div class="calc-res"><div class="calc-res-val">$${pv.toFixed(2)}</div><div class="calc-res-lbl">Per 1 Pip</div></div>
        <div class="calc-res"><div class="calc-res-val">$${(pv*10).toFixed(2)}</div><div class="calc-res-lbl">Per 10 Pips</div></div>
        <div class="calc-res"><div class="calc-res-val">$${(pv*50).toFixed(2)}</div><div class="calc-res-lbl">Per 50 Pips</div></div>
        <div class="calc-res"><div class="calc-res-val">$${(pv*100).toFixed(2)}</div><div class="calc-res-lbl">Per 100 Pips</div></div>
      </div>
    </div>`;
}

function calcProfitLoss() {
  const dir = parseInt(document.getElementById('pl-dir').value);
  const entry = parseFloat(document.getElementById('pl-entry').value) || 1.08;
  const exit = parseFloat(document.getElementById('pl-exit').value) || 1.086;
  const pv = parseFloat(document.getElementById('pl-pv').value) || 0.1;
  const lots = parseFloat(document.getElementById('pl-lots').value) || 0.1;
  const pips = Math.abs(exit - entry) / 0.0001;
  const pnl = dir * (exit - entry) * lots * 100000 * pv / 10;
  const up = pnl >= 0;
  document.getElementById('pl-result').innerHTML = `
    <div class="card ${up?'card-green':'card-red'}" style="padding:14px;text-align:center">
      <div style="font-family:var(--display);font-weight:800;font-size:28px;color:${up?'var(--green)':'var(--red)'}">${up?'+':''}$${Math.abs(pnl).toFixed(2)}</div>
      <div style="font-size:13px;color:var(--txt2);margin-top:4px">${pips.toFixed(1)} pips · ${up?'PROFIT':'LOSS'}</div>
    </div>`;
}

/* ═══ SETTINGS ═══ */
function renderSettings() {
  const themes = [
    {key:'dark',    label:'🌙 Dark Gold',  desc:'Default'},
    {key:'light',   label:'☀️ Light',      desc:'Clean mode'},
    {key:'slate',   label:'🔷 Slate',      desc:'Blue-gray'},
    {key:'matrix',  label:'💚 Matrix',     desc:'Green dark'},
    {key:'ocean',   label:'🌊 Ocean',      desc:'Deep blue'},
    {key:'crimson', label:'🔴 Crimson',    desc:'Red accent'},
    {key:'forest',  label:'🌿 Forest',     desc:'Nature green'},
  ];

  return `<div class="screen-pad">
    <div class="pg-header a-fadeup" style="padding:0 0 14px">
      <div style="display:flex;gap:10px;align-items:center">
        <button class="back-btn" onclick="navigate('profile')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
        <h1 class="pg-title">Settings</h1>
      </div>
    </div>

    <!-- Theme -->
    <div class="section-lbl a-fadeup2">App Theme</div>
    <div class="card a-fadeup2" style="padding:12px;margin-bottom:14px">
      <div class="theme-grid">
        ${themes.map(t => `
          <div class="theme-opt ${STATE.user.theme === t.key ? 'active' : ''}" onclick="applyTheme('${t.key}');saveState();renderScreen('settings')">
            <div class="theme-opt-label">${t.label}</div>
            <div class="theme-opt-desc">${t.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Brightness -->
    <div class="section-lbl a-fadeup3">Display</div>
    <div class="card a-fadeup3" style="padding:14px;margin-bottom:14px">
      <div style="margin-bottom:12px">
        <div style="font-size:13px;font-weight:600;font-family:var(--display);margin-bottom:8px">Brightness</div>
        <div class="slider-wrap">
          <span style="font-size:14px">🌑</span>
          <input type="range" min="30" max="120" value="${STATE.user.brightness || 100}" 
            oninput="applyBrightness(this.value);document.getElementById('bright-val').textContent=this.value+'%'">
          <span style="font-size:14px">☀️</span>
          <span class="slider-label" id="bright-val">${STATE.user.brightness || 100}%</span>
        </div>
      </div>
      <div>
        <div style="font-size:13px;font-weight:600;font-family:var(--display);margin-bottom:8px">Text Size</div>
        <div style="display:flex;gap:8px">
          ${['small','medium','large'].map(s => `
            <div onclick="applyFontSize('${s}');saveState();renderScreen('settings')" style="flex:1;padding:10px;border-radius:var(--rs);border:2px solid ${STATE.user.fontSize===s?'var(--gold)':'var(--bdr2)'};cursor:pointer;text-align:center;font-size:${s==='small'?'12px':s==='large'?'16px':'14px'};background:${STATE.user.fontSize===s?'var(--gold-bg)':'var(--bg4)'};font-family:var(--display);font-weight:600;transition:all .15s">
              ${s.charAt(0).toUpperCase()+s.slice(1)}
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <div class="section-lbl a-fadeup4">Notifications</div>
    <div class="card a-fadeup4" style="padding:14px;margin-bottom:14px">
      ${STATE.user.notificationsEnabled ? `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
          <span style="font-size:20px">✅</span>
          <div style="flex:1;font-size:13px;color:var(--txt2)">Push notifications are <strong style="color:var(--green)">enabled</strong></div>
          <button class="btn btn-ghost btn-xs" onclick="disableNotifications()">Disable</button>
        </div>
      ` : `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
          <span style="font-size:20px">🔔</span>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:600">Enable Notifications</div>
            <div style="font-size:11px;color:var(--txt2)">Daily reminders, session alerts, achievements</div>
          </div>
          <button class="btn btn-gold btn-sm" onclick="requestNotificationPermission()">Enable</button>
        </div>
      `}
      <div style="font-size:12px;color:var(--txt3)">
        You'll receive: morning reminders, London/NY session alerts, weekly review prompts, and achievement notifications.
      </div>
    </div>

    <!-- Account -->
    <div class="section-lbl a-fadeup5">Account</div>
    <div class="card a-fadeup5" style="padding:14px;margin-bottom:14px">
      <div class="inp-wrap">
        <label class="inp-label">Display Name</label>
        <input class="inp" id="s-name" value="${STATE.user.name}">
      </div>
      <button class="btn btn-gold btn-sm" onclick="const n=document.getElementById('s-name').value.trim();if(n){STATE.user.name=n;saveState();showToast('✅ Name saved!')}">Save Name</button>
    </div>

    <!-- About -->
    <div class="section-lbl a-fadeup5">About TradeBaby Pro</div>
    <div class="card a-fadeup5" style="padding:14px;margin-bottom:14px">
      <div style="display:flex;flex-direction:column;gap:8px;font-size:13px">
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Version</span><strong>4.0.0</strong></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Developer</span><strong>SayMy Tech</strong></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Lessons</span><span>${totalLessons()} available</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Strategies</span><span>${STRATEGIES.length} strategies</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Flashcards</span><span>${FLASHCARDS.length} cards</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Offline</span><span style="color:var(--green)">✅ Full PWA</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Your Level</span><span style="color:var(--gold)">Level ${STATE.user.level} (${STATE.user.xp} XP)</span></div>
      </div>
    </div>

    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
      <button class="btn btn-ghost btn-sm" onclick="STATE.user.toured=false;saveState();showToast('Tour restarted!')">🗺️ Restart Tour</button>
      <button class="btn btn-ghost btn-sm" onclick="exportUserData()">📤 Export Data</button>
      <button class="btn btn-danger btn-sm" onclick="if(confirm('Reset ALL data?')){localStorage.removeItem('tb4');location.reload()}">🗑️ Reset All</button>
    </div>
  </div>`;
}

function exportUserData() {
  const data = JSON.stringify({
    exportDate: new Date().toISOString(),
    user: STATE.user, progress: STATE.progress, journal: STATE.journal,
    simTrades: STATE.simTrades, achievements: STATE.achievements
  }, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `tradebaby-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(url);
  showToast('📤 Data exported!');
}


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

// ── SVG CANDLESTICK ILLUSTRATIONS ──
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

// ── PATCH LESSON RENDERING TO INJECT VISUALS ──
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
   TRADEBABY PRO v8 — SOUNDS + MORE MENU + AI TRACKING
   ═══════════════════════════════════════════════════ */

// ── WEB AUDIO NOTIFICATION SOUNDS ──

// Patch showToast to play sound
const _origShowToast = showToast;
function showToast(msg, duration = 2800, soundType = null) {
  _origShowToast(msg, duration);
  if (soundType) SOUNDS.play(soundType);
  else if (msg.includes('🏅') || msg.includes('Achievement')) SOUNDS.play('achievement');
  else if (msg.includes('Level')) SOUNDS.play('levelUp');
  else if (msg.includes('XP') && msg.includes('+')) SOUNDS.play('xp');
  else if (msg.includes('Profit') || msg.includes('+$')) SOUNDS.play('tradeWin');
  else if (msg.includes('Loss') || msg.includes('Stop Loss')) SOUNDS.play('tradeLoss');
}

// Patch openSimTrade for sound
const _origOpenSimTrade = openSimTrade;
function openSimTrade(dir) {
  SOUNDS.play(dir === 'BUY' ? 'tradeBuy' : 'tradeSell');
  _origOpenSimTrade(dir);
}

// Patch closeSimTrade for sound
const _origCloseSimTrade = closeSimTrade;
function closeSimTrade(reason) {
  _origCloseSimTrade(reason);
  if (reason === 'Take Profit') SOUNDS.play('tradeWin');
  else if (reason === 'Stop Loss') SOUNDS.play('tradeLoss');
}

// Patch addXP for sound
const _origAddXPv8 = addXP;
function addXP(amt) {
  const prevLvl = STATE.user.level;
  const result = _origAddXPv8(amt);
  if (STATE.user.level > prevLvl) SOUNDS.play('levelUp');
  return result;
}

// ── MORE MENU ──
function showMoreMenu() {
  const backdrop = document.getElementById('more-menu-backdrop');
  if (!backdrop) return;
  backdrop.style.display = 'block';
  BEHAVIOR.log('more_menu_open');
  // Sync mentor dot
  const unread = (STATE.notifications||[]).filter(n=>!n.read).length;
  const dot = document.getElementById('more-mentor-dot');
  if (dot) dot.style.display = unread > 0 ? 'block' : 'none';
}

function closeMoreMenu() {
  const backdrop = document.getElementById('more-menu-backdrop');
  if (backdrop) backdrop.style.display = 'none';
}

// ── NAV PATCH - handle mentor dot in more menu ──
// Override addNotification to also update more menu dot
const _origAddNotif = addNotification;
function addNotification(text, icon = '📢') {
  _origAddNotif(text, icon);
  SOUNDS.play('notification');
  const dot = document.getElementById('more-mentor-dot');
  const unread = (STATE.notifications||[]).filter(n=>!n.read).length;
  if (dot) dot.style.display = unread > 0 ? 'block' : 'none';
}

// ── NAVIGATE PATCH - close more menu on navigate ──
const _navV8 = navigate;
function navigate(screen, opts = {}) {
  closeMoreMenu();
  _navV8(screen, opts);
  // Update nav active state for 5-icon bar
  const nav5 = { home:'ni-home', learn:'ni-learn', trade:'ni-trade', journal:'ni-journal' };
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  const navId = nav5[screen];
  if (navId) {
    const nb = document.getElementById(navId);
    if (nb) nb.classList.add('active');
  } else {
    // For "more" screens, highlight More button
    const more = document.getElementById('ni-more');
    if (more) more.classList.add('active');
  }
}

// ── AI ACTIVITY TRACKING — Rule-Based Intelligence ──

// Patch completelesson to track
const _origCompleteLesson = completelesson;
function completelesson(id) {
  _origCompleteLesson(id);
  AI_TRACKER.logLesson(id, 'complete');
}

// Patch saveJournalEntry to track
const _origSaveJournalEntry = saveJournalEntry;
function saveJournalEntry() {
  _origSaveJournalEntry();
  const latest = STATE.journal[STATE.journal.length - 1];
  if (latest) AI_TRACKER.logTrade(latest);
}

// Patch closeSimTrade to track sim trades
const _origCloseSim2 = closeSimTrade;
// Note: closeSimTrade already patched above for sound - just add logging
const _prevClose = closeSimTrade;

// ── PATCH HOME SCREEN to show AI briefing ──
const _homeV8 = renderHome;
function renderHome() {
  const base = _homeV8();
  const briefing = AI_TRACKER.getDailyBriefing();
  const suggestion = AI_TRACKER.getContextualSuggestion();
  // Inject AI status bar after ticker
  return base.replace(
    '</div>\n\n      <!-- Greeting -->',
    `</div>
      <!-- AI Daily Briefing -->
      <div style="background:linear-gradient(135deg,var(--bg2),var(--bg3));border:1px solid var(--bdr);padding:10px 14px;font-size:12px;color:var(--txt2);line-height:1.6;border-bottom:1px solid var(--bdr2)">
        <div style="font-size:9px;font-family:var(--display);font-weight:700;color:var(--gold);letter-spacing:1.5px;margin-bottom:4px">🤖 TRADEMIND BRIEFING</div>
        <div>${briefing}</div>
        <div style="margin-top:4px;color:var(--txt3);font-style:italic">${suggestion}</div>
      </div>

      <!-- Greeting -->`
  );
}

// ── INIT TERMINAL ON TRADE SCREEN ──
function renderScreen(screen) {
  _origRenderScreenV8(screen);
  if (screen === 'trade') {
    setTimeout(initTerminal, 100);
  }
}

console.log('✅ TradeBaby v8: Sounds + More Menu + AI Tracking + Terminal loaded');


</body>
</html>

function exportUserData() {
  const data = JSON.stringify({
    exportDate: new Date().toISOString(),
    user: STATE.user, progress: STATE.progress, journal: STATE.journal,
    simTrades: STATE.simTrades, achievements: STATE.achievements
  }, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `tradebaby-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(url);
  showToast('📤 Data exported!');
}


