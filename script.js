"use strict";

const DATA = {
  datasets: [
    ["Users (supplied)", 1000],
    ["Task Activity (simulated)", 6000],
    ["Rewards (simulated)", 5000],
    ["Wallet (simulated)", 3500],
    ["Withdrawals (simulated)", 1200],
    ["Referrals (simulated)", 900],
    ["Feature Events (simulated)", 12000],
    ["Messy Data (test)", 501]
  ],

  status: [
    ["Task completed", 2548],
    ["Task abandoned", 924],
    ["Task failed", 857],
    ["Task validated", 851],
    ["Task pending", 820]
  ],

  metrics: [
    ["Users", "1,000", "supplied assignment records"],
    ["Task Activity", "6,000", "simulated test rows"],
    ["Rewards", "5,000", "simulated test rows"],
    ["Wallet Transactions", "3,500", "simulated test rows"],
    ["Withdrawals", "1,200", "simulated test rows"],
    ["Feature Events", "12,000", "simulated test rows"]
  ],

  priorities: [
    ["Critical", "Stable user_id across events and transactions", "Engineering"],
    ["Critical", "Stable event_id and deduplication", "Engineering / Data"],
    ["Critical", "Task activity to reward linkage", "Engineering"],
    ["Critical", "Transaction ID and reversal linkage", "Engineering"],
    ["High", "Withdrawal lifecycle instrumentation", "Engineering / Operations"],
    ["High", "Automated data-quality checks", "Data Engineering"],
    ["Medium", "Governed analytics dashboard layer", "Analytics"]
  ],

  quality: [
    ["U01", "Users_Messy_Audit", "Duplicate IDs", 8, "High"],
    ["U11", "Users_Messy_Audit", "Malformed dates", 2, "High"],
    ["S14", "Messy Data", "Missing IDs", 21, "High"],
    ["S15", "Messy Data", "Malformed date", 16, "High"],
    ["S16", "Messy Data", "Invalid status", 13, "Medium"],
    ["S18", "Messy Data", "Negative reward", 11, "Medium"],
    ["S19", "Messy Data", "Invalid numeric", 10, "Medium"],
    ["S21", "Messy Data", "Orphan user", 8, "High"]
  ],

  readiness: [
    ["Product data mapping", 4, "Mapped product areas and features"],
    ["Event coverage", 2, "Proposed event tracking plan"],
    ["Logical data model", 4, "Core entities and relationships documented"],
    ["Data dictionary", 5, "122 documented field definitions"],
    ["KPI definitions", 4, "34 KPI definitions documented"],
    ["Simulated data profiling", 5, "Profiling and testing structures documented"],
    ["Data quality", 4, "Audit and controls documented"],
    ["Dashboard readiness", 3, "Seven dashboard areas specified"],
    ["Developer handoff", 4, "Payload requirements and acceptance tests"],
    ["Governance/access", 4, "Proposed role-based access model"]
  ]
};

const formatNumber = value =>
  new Intl.NumberFormat("en-IN").format(value);

const getElement = id => document.getElementById(id);

function createCard(label, value, description) {
  return `
    <div class="kpi">
      <div class="kpi-label">${label}</div>
      <div class="kpi-value">${value}</div>
      <div class="kpi-sub">${description}</div>
    </div>
  `;
}

function createTable(headers, rows) {
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            ${headers.map(header => `<th>${header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              ${row.map(cell => `<td>${cell}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function getStatusClass(value) {
  if (/High|Critical|Open|Rejected|Fail/i.test(String(value))) {
    return "bad";
  }

  if (/Medium|Pending|Proposed|Needs/i.test(String(value))) {
    return "warn";
  }

  return "good";
}

function fillOverview() {
  const cards = getElement("overviewCards");
  const priorityList = getElement("priorityList");

  if (cards) {
    cards.innerHTML = DATA.metrics
      .map(item => createCard(item[0], item[1], item[2]))
      .join("");
  }

  if (priorityList) {
    priorityList.innerHTML = DATA.priorities.map(item => `
      <div class="priority-row">
        <span class="priority-tag ${item[0].toLowerCase()}">${item[0]}</span>
        <strong>${item[1]}</strong>
        <span>${item[2]}</span>
      </div>
    `).join("");
  }
}

function fillUsers() {
  const container = getElement("usersContent");
  if (!container) return;

  container.innerHTML = `
    <div class="panel-head">
      <div>
        <h3>User &amp; Account Analytics</h3>
        <p>User lifecycle, identity requirements and data availability.</p>
      </div>
    </div>

    <div class="mini-grid">
      ${[
        ["Supplied user rows", "1,000"],
        ["User identity", "user_id"],
        ["Lifecycle", "Proposed"]
      ].map(item => `
        <div class="mini-card">
          <strong>${item[1]}</strong>
          <span>${item[0]}</span>
        </div>
      `).join("")}
    </div>

    <div class="panel">
      <h3>Identity model</h3>
      <p class="muted">
        user_id supports cross-domain analysis. event_id supports event
        traceability and deduplication. session_id supports session analysis.
        transaction_id supports wallet and withdrawal auditability.
        Existing implementation must be verified with engineering.
      </p>
    </div>

    ${createTable(
      ["Requirement", "Status", "Evidence / Next action"],
      [
        ["Registration", "Review", "Verify registration timestamps and source fields"],
        ["Login events", "Proposed", "Confirm login event instrumentation"],
        ["Daily Active Users", "Conditional", "Requires timestamped qualifying events"],
        ["Account lifecycle", "Proposed", "Define status changes and lifecycle timestamps"],
        ["Personal data", "Controlled", "Avoid unnecessary personal information"]
      ]
    )}
  `;
}

function fillEngagement() {
  const container = getElement("engagementContent");
  if (!container) return;

  container.innerHTML = `
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
          ["Feature adoption", "Unique users with a qualifying feature event / eligible users"],
          ["Repeat usage", "Users active on two or more distinct days"],
          ["Task completion rate", "Completed valid tasks / started tasks"],
          ["Daily activity", "Unique users with a qualifying event on a calendar day"]
        ].map(item => `
          <div class="list-row">
            <strong>${item[0]}</strong>
            <span>${item[1]}</span>
          </div>
        `).join("")}
      </div>

      <div class="panel">
        <h3>Proposed engagement events</h3>
        <div class="list">
          ${[
            "daily_reward_claimed",
            "streak_updated",
            "mission_started",
            "mission_completed",
            "badge_earned",
            "spin_started",
            "spin_completed"
          ].map(event => `
            <div class="list-row">
              <strong>${event}</strong>
              <span class="status warn">Proposed / verify</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function fillRewards() {
  const container = getElement("rewardsContent");
  if (!container) return;

  container.innerHTML = `
    <div class="panel-head">
      <div>
        <h3>Earning &amp; Reward Analytics</h3>
        <p>Discovery → Start → Completion → Validation → Reward.</p>
      </div>
    </div>

    <div class="mini-grid">
      ${[
        ["Task activity", "6,000"],
        ["Reward records", "5,000"],
        ["Data status", "Simulated"]
      ].map(item => `
        <div class="mini-card">
          <strong>${item[1]}</strong>
          <span>${item[0]}</span>
        </div>
      `).join("")}
    </div>

    <div class="panel">
      <h3>Reward state model</h3>
      ${createTable(
        ["State", "Meaning", "Analytical treatment"],
        [
          ["Activity occurred", "Task activity was recorded", "Does not automatically mean a reward was credited"],
          ["Pending", "Reward requires finalization", "Track pending rewards"],
          ["Credited", "Reward was posted", "Count only confirmed credit events"],
          ["Reversed", "Previously credited reward was reversed", "Preserve reversal linkage"],
          ["Corrected", "A correction was applied", "Maintain an audit trail"]
        ]
      )}
    </div>

    <div class="notice">
      All operational examples on this dashboard are for analytical testing.
      They are not actual VELOOP production results.
    </div>
  `;
}

function fillWallet() {
  const container = getElement("walletContent");
  if (!container) return;

  container.innerHTML = `
    <div class="panel-head">
      <div>
        <h3>Wallet Analytics</h3>
        <p>Transaction-level tracking, status and reversal traceability.</p>
      </div>
    </div>

    ${createTable(
      ["Field group", "Required analytical fields", "Purpose"],
      [
        ["Identity", "transaction_id, user_id", "Cross-domain joins and deduplication"],
        ["Transaction", "timestamp, type, amount, unit, status", "Ledger measurement"],
        ["Traceability", "source, reference_id, reversal_of", "Audit and correction lineage"],
        ["Quality", "Unique IDs, allowed statuses, valid timestamps", "Reliable reporting"]
      ]
    )}

    <div class="panel">
      <h3>Withdrawal linkage</h3>
      <p class="muted">
        Proposed withdrawal fields include withdrawal_id, user_id,
        requested_amount, method, requested_at, processing_at, final_at,
        status and reason category. Processing duration requires valid timestamps.
      </p>
    </div>
  `;
}

function fillWithdrawals() {
  const container = getElement("withdrawalsContent");
  if (!container) return;

  container.innerHTML = `
    <div class="panel-head">
      <div>
        <h3>Withdrawal Analytics</h3>
        <p>Requested → Processing → Completed, with Rejected and Reversed alternatives.</p>
      </div>
    </div>

    <div class="panel">
      ${createTable(
        ["KPI", "Definition", "Frequency", "Limitation"],
        [
          ["Withdrawal requests", "Count of valid withdrawal requests", "Daily / weekly", "Requires complete request events"],
          ["Completed withdrawals", "Count of completed withdrawal records", "Daily / weekly", "Requires valid final status"],
          ["Pending queue", "Count in pending or processing states", "Daily", "Requires a consistent snapshot definition"],
          ["Processing duration", "Final timestamp minus processing timestamp", "Daily / weekly", "Depends on timestamp quality"],
          ["Completion rate", "Completed requests / eligible requests", "Weekly", "Use a defined cohort and period"]
        ]
      )}
    </div>

    <div class="notice">
      The KPI definitions are proposed. Do not interpret them as verified
      production withdrawal performance.
    </div>
  `;
}

function fillReferrals() {
  const container = getElement("referralsContent");
  if (!container) return;

  container.innerHTML = `
    <div class="panel-head">
      <div>
        <h3>Referral &amp; Engagement</h3>
        <p>Registration is not automatically equal to referral conversion.</p>
      </div>
    </div>

    <div class="panel">
      <h3>Referral lifecycle</h3>
      <div class="list">
        ${[
          "referral_created",
          "referral_registered",
          "referral_activated",
          "referral_converted"
        ].map((event, index) => `
          <div class="list-row">
            <strong>${index + 1}. ${event}</strong>
            <span>${index === 3 ? "Requires an approved conversion definition" : "Lifecycle stage"}</span>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="panel">
      <h3>Recommended referral fields</h3>
      ${createTable(
        ["Field", "Purpose"],
        [
          ["referral_id", "Unique referral record"],
          ["referring_user_id", "Identifies the referring user"],
          ["referred_user_id", "Connects the referred account"],
          ["created_at", "Records referral creation time"],
          ["registered_at", "Records registration time when available"],
          ["activated_at", "Records activation time when available"],
          ["status", "Represents the approved referral state"]
        ]
      )}
    </div>
  `;
}

function fillQuality() {
  const container = getElement("qualityContent");
  if (!container) return;

  container.innerHTML = `
    <div class="panel-head">
      <div>
        <h3>Data Quality Audit</h3>
        <p>Example audit categories and proposed prevention controls.</p>
      </div>
    </div>

    ${createTable(
      ["Issue", "Dataset", "Issue type", "Example count", "Severity"],
      DATA.quality.map(row => [
        row[0],
        row[1],
        row[2],
        formatNumber(row[3]),
        `<span class="status ${getStatusClass(row[4])}">${row[4]}</span>`
      ])
    )}

    <div class="panel">
      <h3>Quality control framework</h3>
      ${[
        ["Application", "Validate required inputs and IDs"],
        ["Data collection", "Validate schema and event contracts"],
        ["Raw data", "Preserve original records and lineage"],
        ["Transformation", "Normalize values and flag invalid records"],
        ["Analytics layer", "Apply governed KPI definitions"],
        ["Dashboard", "Show freshness and data quality status"]
      ].map((item, index) => `
        <div class="list-row">
          <strong>${index + 1}. ${item[0]}</strong>
          <span>${item[1]}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function fillImplementation() {
  const container = getElement("implementationContent");
  if (!container) return;

  container.innerHTML = `
    <div class="panel-head">
      <div>
        <h3>Implementation &amp; Readiness</h3>
        <p>Proposed backlog and analytical readiness assessment.</p>
      </div>
    </div>

    <div class="panel">
      <h3>Implementation priorities</h3>
      ${createTable(
        ["Priority", "Requirement", "Owner", "Stage"],
        DATA.priorities.map(item => [
          item[0],
          item[1],
          item[2],
          item[0] === "Medium" ? "Post-launch" : "Pre-launch"
        ])
      )}
    </div>

    <div class="panel">
      <h3>Readiness scorecard</h3>
      ${createTable(
        ["Area", "Score", "Evidence", "Status"],
        DATA.readiness.map(item => [
          item[0],
          `${item[1]}/5`,
          item[2],
          `<span class="status ${item[1] >= 4 ? "good" : "warn"}">
            ${item[1] >= 4 ? "Review-ready" : "Further work"}
          </span>`
        ])
      )}
    </div>

    <div class="artifact-grid">
      <div class="artifact">
        <strong>ER Diagram</strong>
        <p>Logical entities, keys and relationships.</p>
        <a href="ER_Diagram.png" target="_blank" rel="noopener noreferrer">Open diagram →</a>
      </div>

      <div class="artifact">
        <strong>Data Pipeline Diagram</strong>
        <p>Application to raw data, validation and analytical reporting.</p>
        <a href="Data_Pipeline_Diagram.png" target="_blank" rel="noopener noreferrer">Open diagram →</a>
      </div>

      <div class="artifact">
        <strong>Dashboard Wireframes</strong>
        <p>Proposed analytics dashboard layouts.</p>
        <a href="Dashboard_Wireframes.png" target="_blank" rel="noopener noreferrer">Open wireframes →</a>
      </div>
    </div>

    <div class="panel">
      <h3>Additional deliverables</h3>
      <div class="list">
        <div class="list-row">
          <strong>Final Report PDF</strong>
          <a href="VELOOP_Task01_Final_Consolidated_Report.pdf" target="_blank" rel="noopener noreferrer">Open →</a>
        </div>

        <div class="list-row">
          <strong>Master Excel Workbook</strong>
          <a href="VELOOP_Task01_Master_Analytics_Workbook.xlsx" download>Download →</a>
        </div>

        <div class="list-row">
          <strong>Final Report DOCX</strong>
          <a href="VELOOP_Task01_Final_Consolidated_Report.docx" download>Download →</a>
        </div>

        <div class="list-row">
          <strong>Supplied Source Data</strong>
          <a href="Source_Data_01.xlsx" download>Download →</a>
        </div>

        <div class="list-row">
          <strong>Synthetic Testing Data</strong>
          <a href="Synthetic_Analytical_Test_Data.json" download>Download →</a>
        </div>
      </div>
    </div>
  `;
}

function showView(viewName) {
  const selectedView = getElement(`view-${viewName}`);
  if (!selectedView) return;

  document.querySelectorAll(".view").forEach(section => {
    section.classList.remove("active");
  });

  selectedView.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });

  const titles = {
    overview: "Analytics Overview",
    users: "User & Account Analytics",
    engagement: "Engagement Analytics",
    rewards: "Earning & Reward Analytics",
    wallet: "Wallet Analytics",
    withdrawals: "Withdrawal Analytics",
    referrals: "Referral & Engagement",
    quality: "Data Quality Audit",
    implementation: "Implementation & Readiness"
  };

  const pageTitle = getElement("pageTitle");
  if (pageTitle) {
    pageTitle.textContent = titles[viewName] || "Analytics Dashboard";
  }

  const sidebar = getElement("sidebar");
  if (sidebar) {
    sidebar.classList.remove("open");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function wireNavigation() {
  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
      showView(button.dataset.view);
    });
  });

  document.querySelectorAll("[data-view-jump]").forEach(button => {
    button.addEventListener("click", () => {
      showView(button.dataset.viewJump);
    });
  });

  const mobileMenu = getElement("mobileMenu");
  const sidebar = getElement("sidebar");

  if (mobileMenu && sidebar) {
    mobileMenu.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }
}

function buildCharts() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js did not load. Navigation and tables remain available.");
    return;
  }

  const datasetCanvas = getElement("datasetChart");
  const statusCanvas = getElement("statusChart");

  if (datasetCanvas) {
    new Chart(datasetCanvas, {
      type: "bar",
      data: {
        labels: DATA.datasets.map(item => item[0]),
        datasets: [{
          label: "Records",
          data: DATA.datasets.map(item => item[1]),
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
            grid: { color: "#edf0f4" }
          },
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 9 },
              maxRotation: 50,
              minRotation: 20
            }
          }
        }
      }
    });
  }

  if (statusCanvas) {
    new Chart(statusCanvas, {
      type: "doughnut",
      data: {
        labels: DATA.status.map(item => item[0]),
        datasets: [{
          data: DATA.status.map(item => item[1]),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: { size: 9 },
              boxWidth: 10
            }
          }
        },
        cutout: "66%"
      }
    });
  }
}

function initializeDashboard() {
  fillOverview();
  fillUsers();
  fillEngagement();
  fillRewards();
  fillWallet();
  fillWithdrawals();
  fillReferrals();
  fillQuality();
  fillImplementation();
  wireNavigation();
  buildCharts();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeDashboard, { once: true });
} else {
  initializeDashboard();
}
