const DATA = {
  datasets: [
    ['Users (supplied clean)', 1000],
    ['Task Activity (simulated)', 6000],
    ['Rewards (simulated)', 5000],
    ['Wallet (simulated)', 3500],
    ['Withdrawals (simulated)', 1200],
    ['Referrals (simulated)', 900],
    ['Feature Events (simulated)', 12000],
    ['Messy Data (test)', 501]
  ],

  status: [
    ['Task completed', 2548],
    ['Task abandoned', 924],
    ['Task failed', 857],
    ['Task validated', 851],
    ['Task pending', 820]
  ],

  metrics: [
    ['Users', '1,000', 'supplied clean records'],
    ['Task activity', '6,000', 'simulated testing rows'],
    ['Rewards', '5,000', 'simulated testing rows'],
    ['Wallet transactions', '3,500', 'simulated testing rows'],
    ['Withdrawals', '1,200', 'simulated testing rows'],
    ['Feature events', '12,000', 'simulated testing rows']
  ],

  priorities: [
    ['Critical', 'Stable user_id across events and transactions', 'Engineering'],
    ['Critical', 'Stable event_id + idempotency', 'Engineering / Data'],
    ['Critical', 'Task activity → reward linkage', 'Engineering'],
    ['Critical', 'Transaction ID + reversal linkage', 'Engineering'],
    ['High', 'Withdrawal lifecycle instrumentation', 'Engineering / Ops'],
    ['High', 'Automated data-quality gates', 'Data Engineering'],
    ['Medium', 'Governed BI dashboard layer', 'Analytics']
  ],

  quality: [
    ['U01', 'Users_Messy_Audit', 'Duplicate IDs', 8, 'High'],
    ['U11', 'Users_Messy_Audit', 'Malformed dates', 2, 'High'],
    ['S14', 'Messy Data', 'Missing IDs', 21, 'High'],
    ['S15', 'Messy Data', 'Malformed date', 16, 'High'],
    ['S16', 'Messy Data', 'Invalid status', 13, 'Medium'],
    ['S18', 'Messy Data', 'Negative reward', 11, 'Medium'],
    ['S19', 'Messy Data', 'Invalid numeric', 10, 'Medium'],
    ['S21', 'Messy Data', 'Orphan user', 8, 'High']
  ],

  readiness: [
    ['Product data mapping', 4, '22 mapped product/features'],
    ['Event coverage', 2, '34 production events specified'],
    ['Logical data model', 4, 'Core entities + relationships'],
    ['Data dictionary', 5, '122 meaningful fields'],
    ['KPI definitions', 4, '34 reproducible KPIs'],
    ['Simulated data profiling', 5, 'Supplied + testing data profiled'],
    ['Data quality', 4, 'Audit + controls documented'],
    ['Dashboard readiness', 3, '7-dashboard blueprint'],
    ['Developer handoff', 4, 'Acceptance tests + payloads'],
    ['Governance/access', 4, 'Role-based access model']
  ]
};

const fmt = n => new Intl.NumberFormat('en-IN').format(n);
const el = id => document.getElementById(id);

function card(label, val, sub) {
  return `
    <div class="kpi">
      <div class="kpi-label">${label}</div>
      <div class="kpi-value">${val}</div>
      <div class="kpi-sub">${sub}</div>
    </div>`;
}

function table(headers, rows) {
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map(r =>
            `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`
          ).join('')}
        </tbody>
      </table>
    </div>`;
}

function statusClass(value) {
  return /High|Critical|Open|Rejected|Fail/i.test(value)
    ? 'bad'
    : /Medium|Pending|Proposed|Needs/i.test(value)
      ? 'warn'
      : 'good';
}

function buildCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js did not load. Dashboard tables will still work.');
    return;
  }

  const datasetCanvas = el('datasetChart');
  const statusCanvas = el('statusChart');

  if (datasetCanvas) {
    new Chart(datasetCanvas, {
      type: 'bar',
      data: {
        labels: DATA.datasets.map(x =>
          x[0].replace(' (simulated)', '').replace(' (supplied clean)', '')
        ),
        datasets: [{
          label: 'Records',
          data: DATA.datasets.map(x => x[1]),
          borderRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#edf0f4' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 9 } }
          }
        }
      }
    });
  }

  if (statusCanvas) {
    new Chart(statusCanvas, {
      type: 'doughnut',
      data: {
        labels: DATA.status.map(x => x[0]),
        datasets: [{
          data: DATA.status.map(x => x[1]),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { size: 9 }, boxWidth: 10 }
          }
        },
        cutout: '66%'
      }
    });
  }
}

function fillOverview() {
  const overviewCards = el('overviewCards');
  const priorityList = el('priorityList');

  if (overviewCards) {
    overviewCards.innerHTML = DATA.metrics
      .map(x => card(x[0], x[1], x[2]))
      .join('');
  }

  if (priorityList) {
    priorityList.innerHTML = DATA.priorities.map(x => `
      <div class="priority-row">
        <span class="priority-tag ${x[0].toLowerCase()}">${x[0]}</span>
        <strong>${x[1]}</strong>
        <span>${x[2]}</span>
      </div>
    `).join('');
  }
}

function fillViews() {
  const usersContent = el('usersContent');
  const engagementContent = el('engagementContent');
  const rewardsContent = el('rewardsContent');
  const walletContent = el('walletContent');
  const withdrawalsContent = el('withdrawalsContent');
  const referralsContent = el('referralsContent');
  const qualityContent = el('qualityContent');
  const implementationContent = el('implementationContent');

  if (usersContent) {
    usersContent.innerHTML = `
      <div class="panel-head">
        <div>
          <h3>User & Account Analytics</h3>
          <p>Lifecycle structure, identity requirements and what is currently calculable.</p>
        </div>
      </div>

      <div class="mini-grid">
        ${[
          ['Supplied users', '1,000'],
          ['Unique user IDs', '1,000'],
          ['Messy audit rows', '1,008']
        ].map(x => `
          <div class="mini-card">
            <strong>${x[1]}</strong>
            <span>${x[0]}</span>
          </div>
        `).join('')}
      </div>

      <div class="panel">
        <h3>Identity model</h3>
        <p class="muted">
          Stable user_id is the primary cross-domain identity.
          event_id supports deduplication and traceability;
          session_id supports session analysis; transaction_id supports
          wallet and withdrawal auditability. Session and event implementation
          remain proposed/to-be-verified.
        </p>
      </div>

      ${table(
        ['Requirement', 'Status', 'Evidence / Next action'],
        [
          ['Registrations', 'Partial',
            'registration_datetime exists; granular user_registered event still required'],
          ['Daily Active Users', 'Partial',
            'Needs event history with timestamp + qualifying event registry'],
          ['User lifecycle', 'Partial',
            'Account status and lifecycle fields are specified'],
          ['Personal data', 'Controlled',
            'Use analytical identifiers; avoid unnecessary personal information']
        ]
      )}
    `;
  }

  if (engagementContent) {
    engagementContent.innerHTML = `
      <div class="panel-head">
        <div>
          <h3>Engagement Analytics</h3>
          <p>Feature adoption, repeat usage, task activity and daily activity.</p>
        </div>
      </div>

      <div class="section-grid">
        <div class="panel">
          <h3>Measurement framework</h3>
          ${[
            'Feature adoption = unique active users who perform a feature qualifying event / eligible active users',
            'Repeat usage = users with qualifying events on at least two distinct days / active users',
            'Task completion rate = completed valid tasks / started tasks',
            'Daily activity = unique users generating qualifying activity events in a calendar day'
          ].map(t => `
            <div class="list-row">
              <strong>${t.split(' = ')[0]}</strong>
              <span>Reproducible KPI definition</span>
            </div>
          `).join('')}
        </div>

        <div class="panel">
          <h3>Core events</h3>
          <div class="list">
            ${[
              'daily_reward_claimed',
              'streak_updated',
              'mission_started',
              'mission_completed',
              'badge_earned',
              'spin_started',
              'spin_completed'
            ].map(event => `
              <div class="list-row">
                <strong>${event}</strong>
                <span class="status good">Proposed / tracked as applicable</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  if (rewardsContent) {
    rewardsContent.innerHTML = `
      <div class="panel-head">
        <div>
          <h3>Earning & Reward Analytics</h3>
          <p>Discovery → Start → Completion → Validation → Reward.</p>
        </div>
      </div>

      <div class="mini-grid">
        ${[
          ['Task activity', '6,000'],
          ['Completed', '2,548'],
          ['Rewards', '5,000']
        ].map(x => `
          <div class="mini-card">
            <strong>${x[1]}</strong>
            <span>${x[0]} — simulated testing data</span>
          </div>
        `).join('')}
      </div>

      <div class="panel">
        <h3>Reward state model</h3>
        ${table(
          ['State', 'Meaning', 'Analytics treatment'],
          [
            ['Activity occurred', 'Task activity was recorded',
              'Do not assume reward was credited'],
            ['Pending', 'Reward is awaiting finalization',
              'Include in pending queue metrics'],
            ['Credited', 'Reward has been posted',
              'Count as actual reward credit event within the simulated dataset'],
            ['Reversed', 'Previously credited reward was reversed',
              'Maintain reversal relationship'],
            ['Corrected', 'Correction applied',
              'Use correction linkage and audit trail']
          ]
        )}
      </div>
    `;
  }

  if (walletContent) {
    walletContent.innerHTML = `
      <div class="panel-head">
        <div>
          <h3>Wallet Analytics</h3>
          <p>Transaction-level model with status and reversal/correction traceability.</p>
        </div>
      </div>

      ${table(
        ['Field group', 'Required analytical fields', 'Purpose'],
        [
          ['Identity', 'transaction_id, user_id',
            'Cross-domain joins + deduplication'],
          ['Transaction', 'timestamp, type, amount, unit, status',
            'Ledger measurement'],
          ['Traceability', 'source, reference_id, reversal_of',
            'Audit and correction lineage'],
          ['Quality', 'unique IDs, approved statuses, timestamps',
            'Trustworthy reporting']
        ]
      )}

      <div class="panel">
        <h3>Withdrawal linkage</h3>
        <p class="muted">
          Withdrawal analysis uses withdrawal_id, user_id, requested_amount,
          method, requested_at, processing_at, final_at, status and reason
          category. Processing duration is measured from processing_at to
          final_at where valid.
        </p>
      </div>
    `;
  }

  if (withdrawalsContent) {
    withdrawalsContent.innerHTML = `
      <div class="panel-head">
        <div>
          <h3>Withdrawal Analytics</h3>
          <p>Requested → Processing → Completed, with Rejected/Reversed alternatives.</p>
        </div>
      </div>

      <div class="mini-grid">
        ${[
          ['Requests', '1,200'],
          ['Completed', '657'],
          ['Pending', '260']
        ].map(x => `
          <div class="mini-card">
            <strong>${x[1]}</strong>
            <span>${x[0]} — simulated testing data</span>
          </div>
        `).join('')}
      </div>

      <div class="panel">
        ${table(
          ['KPI', 'Definition', 'Frequency', 'Limitation'],
          [
            ['Withdrawal requests',
              'Count of withdrawal_requested records',
              'Daily / weekly', 'Dependent on complete request events'],
            ['Completed withdrawals',
              'Count where status = Completed',
              'Daily / weekly', 'Does not explain rejected/reversed reasons'],
            ['Pending queue',
              'Count currently in Pending/Processing',
              'Daily', 'Snapshot definition must be explicit'],
            ['Processing time',
              'final_at − processing_at for completed valid cases',
              'Daily / weekly', 'Sensitive to timestamp quality'],
            ['Completion rate',
              'Completed / requested',
              'Weekly', 'Not a production performance claim']
          ]
        )}
      </div>
    `;
  }

  if (referralsContent) {
    referralsContent.innerHTML = `
      <div class="panel-head">
        <div>
          <h3>Referral & Engagement</h3>
          <p>Registration is not treated as conversion.</p>
        </div>
      </div>

      <div class="mini-grid">
        ${[
          ['Referral records', '900'],
          ['Activated', '188'],
          ['Converted', '341']
        ].map(x => `
          <div class="mini-card">
            <strong>${x[1]}</strong>
            <span>${x[0]} — simulated testing data</span>
          </div>
        `).join('')}
      </div>

      <div class="panel">
        <h3>Referral lifecycle</h3>
        <div class="list">
          ${[
            'referral_created',
            'referral_registered',
            'referral_activated',
            'referral_converted'
          ].map((event, index) => `
            <div class="list-row">
              <strong>${index + 1}. ${event}</strong>
              <span>
                ${index === 3
                  ? 'Conversion requires an approved definition'
                  : 'Lifecycle stage'}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (qualityContent) {
    qualityContent.innerHTML = `
      <div class="panel-head">
        <div>
          <h3>Data Quality Audit</h3>
          <p>Test issues are documented with detection, correction and prevention rules.</p>
        </div>
      </div>

      ${table(
        ['Issue', 'Dataset', 'Issue type', 'Records', 'Severity'],
        DATA.quality.map(r => [
          r[0],
          r[1],
          r[2],
          fmt(r[3]),
          `<span class="status ${statusClass(r[4])}">${r[4]}</span>`
        ])
      )}

      <div class="panel">
        <h3>Control framework</h3>
        ${[
          'Application',
          'Data Collection',
          'Raw Data',
          'Transformation',
          'Analytics Layer',
          'Dashboard'
        ].map((stage, index) => `
          <div class="list-row">
            <strong>${index + 1}. ${stage}</strong>
            <span>${[
              'Validate allowed inputs and required IDs',
              'Capture schema + event contracts',
              'Preserve raw data with lineage',
              'Clean, normalize and quarantine invalid records',
              'Apply KPI logic on governed data',
              'Surface freshness and quality status'
            ][index]}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (implementationContent) {
    implementationContent.innerHTML = `
      <div class="panel-head">
        <div>
          <h3>Implementation & Readiness</h3>
          <p>Prioritized backlog plus readiness scorecard.</p>
        </div>
      </div>

      ${table(
        ['Priority', 'Requirement', 'Owner', 'Stage'],
        DATA.priorities.map(x => [
          x[0],
          x[1],
          x[2],
          x[0] === 'Medium' ? 'Post-launch' : 'Pre-launch'
        ])
      )}

      <div class="panel">
        <h3>Readiness scorecard</h3>
        ${table(
          ['Area', 'Score', 'Evidence', 'Status'],
          DATA.readiness.map(x => [
            x[0],
            x[1] + '/5',
            x[2],
            `<span class="status ${x[1] >= 4 ? 'good' : 'warn'}">
              ${x[1] >= 4 ? 'Review-ready' : 'Engineering work'}
            </span>`
          ])
        )}
      </div>

      <div class="artifact-grid">
        <div class="artifact">
          <strong>ER Diagram</strong>
          <p>Logical data model with entities, keys and relationships.</p>
          <a href="ER_Diagram.png" target="_blank" rel="noopener">Open diagram →</a>
        </div>

        <div class="artifact">
          <strong>Pipeline Diagram</strong>
          <p>Application → events → raw → validation → analytical layer → BI.</p>
          <a href="Data_Pipeline_Diagram.png" target="_blank" rel="noopener">Open diagram →</a>
        </div>

        <div class="artifact">
          <strong>Dashboard Wireframes</strong>
          <p>Future dashboard specification visuals.</p>
          <a href="Dashboard_Wireframes.png" target="_blank" rel="noopener">Open wireframes →</a>
        </div>
      </div>
    `;
  }
}

function wireNavigation() {
  document.querySelectorAll('.nav-item').forEach(button => {
    button.addEventListener('click', () => showView(button.dataset.view));
  });

  document.querySelectorAll('[data-view-jump]').forEach(button => {
    button.addEventListener('click', () => showView(button.dataset.viewJump));
  });

  const mobileMenu = el('mobileMenu');
  const sidebar = el('sidebar');

  if (mobileMenu && sidebar) {
    mobileMenu.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

function showView(view) {
  document.querySelectorAll('.view').forEach(section => {
    section.classList.remove('active');
  });

  const selectedView = el(`view-${view}`);
  if (!selectedView) return;

  selectedView.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(button => {
    button.classList.toggle('active', button.dataset.view === view);
  });

  const titles = {
    overview: 'Analytics Overview',
    users: 'User & Account Analytics',
    engagement: 'Engagement Analytics',
    rewards: 'Earning & Reward Analytics',
    wallet: 'Wallet Analytics',
    withdrawals: 'Withdrawal Analytics',
    referrals: 'Referral & Engagement',
    quality: 'Data Quality Audit',
    implementation: 'Implementation & Readiness'
  };

  const pageTitle = el('pageTitle');
  if (pageTitle) {
    pageTitle.textContent = titles[view] || 'Analytics Dashboard';
  }

  const sidebar = el('sidebar');
  if (sidebar) {
    sidebar.classList.remove('open');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

fillOverview();
fillViews();
wireNavigation();

if (document.readyState === 'complete') {
  buildCharts();
} else {
  window.addEventListener('load', buildCharts, { once: true });
}
