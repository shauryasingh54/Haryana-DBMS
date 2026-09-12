import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Pre-seeded Database State
const INITIAL_DATA = {
  districts: ['Gurugram', 'Faridabad', 'Ambala', 'Hisar', 'Karnal', 'Rohtak'],
  users: [
    { id: 'usr-1', name: 'Dr. Rajesh Verma', email: 'admin@haryana.gov.in', role: 'SYSTEM_ADMIN', district: 'ALL', active: true, avatar: 'RV' },
    { id: 'usr-2', name: 'Smt. Sunita Sharma', email: 'exec.sunita@haryana.gov.in', role: 'EXECUTIVE', district: 'ALL', active: true, avatar: 'SS' },
    { id: 'usr-3', name: 'Vikramjit Singh', email: 'qa.vikram@haryana.gov.in', role: 'BILLING_QA', district: 'ALL', active: true, avatar: 'VS' },
    { id: 'usr-4', name: 'Amit Kumar', email: 'field.gurugram@haryana.gov.in', role: 'FIELD_ENGINEER', district: 'Gurugram', active: true, avatar: 'AK' },
    { id: 'usr-5', name: 'Pooja Rani', email: 'field.faridabad@haryana.gov.in', role: 'FIELD_ENGINEER', district: 'Faridabad', active: true, avatar: 'PR' },
    { id: 'usr-6', name: 'Deepak Yadav', email: 'field.ambala@haryana.gov.in', role: 'FIELD_ENGINEER', district: 'Ambala', active: true, avatar: 'DY' }
  ],
  deliverables: [
    {
      id: 'DEL-2026-001',
      title: 'NH-48 Flyover Structural Load Testing Report',
      district: 'Gurugram',
      engineer_id: 'usr-4',
      engineer_name: 'Amit Kumar',
      submission_date: '2026-09-01',
      status: 'INVOICED',
      raw_file_name: 'NH48_Flyover_LoadTest_v2.pdf',
      estimated_value: 1250000,
      certified_value: 1250000,
      invoice_id: 'INV-2026-801',
      notes: 'Ultrasonic testing complete. Certified by Senior QA Engineer.'
    },
    {
      id: 'DEL-2026-002',
      title: 'Sector 14 Drainage Modernization Audit',
      district: 'Gurugram',
      engineer_id: 'usr-4',
      engineer_name: 'Amit Kumar',
      submission_date: '2026-09-03',
      status: 'ZERO_VALUE',
      raw_file_name: 'Sec14_Drainage_RawScan.zip',
      estimated_value: 850000,
      certified_value: 0,
      invoice_id: null,
      notes: 'Asynchronous submission. Pending QA valuation mapping.'
    },
    {
      id: 'DEL-2026-003',
      title: 'Badkhal Lake Road Resurfacing Quality Check',
      district: 'Faridabad',
      engineer_id: 'usr-5',
      engineer_name: 'Pooja Rani',
      submission_date: '2026-09-04',
      status: 'CERTIFIED',
      raw_file_name: 'Badkhal_Road_Bitumen_Test.pdf',
      estimated_value: 950000,
      certified_value: 920000,
      invoice_id: null,
      notes: 'Bitumen core samples verified. Awaiting invoice mapping.'
    },
    {
      id: 'DEL-2026-004',
      title: 'GT Road Ambala Overbridge Core Inspection',
      district: 'Ambala',
      engineer_id: 'usr-6',
      engineer_name: 'Deepak Yadav',
      submission_date: '2026-09-05',
      status: 'ZERO_VALUE',
      raw_file_name: 'GT_Bridge_SonarScan.pdf',
      estimated_value: 1400000,
      certified_value: 0,
      invoice_id: null,
      notes: 'Orphaned deliverable. Requires QA specialist valuation.'
    },
    {
      id: 'DEL-2026-005',
      title: 'Hisar Smart Grid Substation Civil Inspection',
      district: 'Hisar',
      engineer_id: 'usr-4',
      engineer_name: 'Amit Kumar',
      submission_date: '2026-09-07',
      status: 'PENDING_QA',
      raw_file_name: 'Hisar_Substation_Civil_Log.pdf',
      estimated_value: 1100000,
      certified_value: 0,
      invoice_id: null,
      notes: 'Submitted via field tablet. Awaiting document review.'
    },
    {
      id: 'DEL-2026-006',
      title: 'Karnal Agri-Tech Hub Soil Bearing Pressure Survey',
      district: 'Karnal',
      engineer_id: 'usr-5',
      engineer_name: 'Pooja Rani',
      submission_date: '2026-09-08',
      status: 'INVOICED',
      raw_file_name: 'Karnal_Soil_Bearing_Report.pdf',
      estimated_value: 780000,
      certified_value: 780000,
      invoice_id: 'INV-2026-802',
      notes: 'Soil compaction certified. Included in invoice INV-2026-802.'
    },
    {
      id: 'DEL-2026-007',
      title: 'Rohtak Ring Road Retaining Wall Integrity Assessment',
      district: 'Rohtak',
      engineer_id: 'usr-6',
      engineer_name: 'Deepak Yadav',
      submission_date: '2026-09-10',
      status: 'ZERO_VALUE',
      raw_file_name: 'Rohtak_RetainingWall_Raw.pdf',
      estimated_value: 1650000,
      certified_value: 0,
      invoice_id: null,
      notes: 'Field upload completed offline during portal outage.'
    },
    {
      id: 'DEL-2026-008',
      title: 'Cyber City Gurugram Underpass Drainage Test',
      district: 'Gurugram',
      engineer_id: 'usr-4',
      engineer_name: 'Amit Kumar',
      submission_date: '2026-09-11',
      status: 'CERTIFIED',
      raw_file_name: 'CyberCity_Underpass_PumpAudit.pdf',
      estimated_value: 1800000,
      certified_value: 1750000,
      invoice_id: null,
      notes: 'Flow rate tests verified. Ready for batch invoice mapping.'
    }
  ],
  invoices: [
    {
      id: 'INV-2026-801',
      invoice_number: 'HR-PWD-2026-0801',
      billing_date: '2026-09-02',
      total_amount: 1250000,
      district: 'Gurugram',
      status: 'PAID',
      deliverable_ids: ['DEL-2026-001'],
      notes: 'NH-48 Flyover certified billing.'
    },
    {
      id: 'INV-2026-802',
      invoice_number: 'HR-PWD-2026-0802',
      billing_date: '2026-09-09',
      total_amount: 780000,
      district: 'Karnal',
      status: 'ISSUED',
      deliverable_ids: ['DEL-2026-006'],
      notes: 'Karnal Soil survey billing.'
    }
  ],
  externalIntegrations: [
    {
      id: 'portal-1',
      name: 'Haryana Govt e-Procurement Portal',
      type: 'GOVERNMENT',
      status: 'ONLINE',
      last_sync: '2026-09-13 01:30',
      retry_queue: 0,
      offline_workaround_active: false,
      uptime_percentage: 99.8
    },
    {
      id: 'portal-2',
      name: 'Corporate Infrastructure Gateway (CIG)',
      type: 'CORPORATE',
      status: 'DEGRADED',
      last_sync: '2026-09-12 18:45',
      retry_queue: 14,
      offline_workaround_active: true,
      uptime_percentage: 84.2
    },
    {
      id: 'portal-3',
      name: 'State Treasury Billing Clearinghouse',
      type: 'FINANCIAL',
      status: 'ONLINE',
      last_sync: '2026-09-13 01:15',
      retry_queue: 0,
      offline_workaround_active: false,
      uptime_percentage: 99.95
    }
  ],
  auditLogs: [
    { id: 'log-101', timestamp: '2026-09-13 01:22:10', user: 'Dr. Rajesh Verma', role: 'SYSTEM_ADMIN', action: 'PORTAL_SYNC', details: 'Manual sync triggered for Corporate Gateway', ip: '10.240.12.89' },
    { id: 'log-102', timestamp: '2026-09-13 00:45:33', user: 'Vikramjit Singh', role: 'BILLING_QA', action: 'ZERO_VALUE_RESOLVED', details: 'Updated DEL-2026-008 from zero-value to ₹17.5L', ip: '10.240.14.12' },
    { id: 'log-103', timestamp: '2026-09-12 21:10:04', user: 'Smt. Sunita Sharma', role: 'EXECUTIVE', action: 'EXECUTIVE_EXPORT', details: 'Generated One-Tap Aggregated Financial PDF Summary', ip: '10.240.10.05' },
    { id: 'log-104', timestamp: '2026-09-12 16:30:12', user: 'Amit Kumar', role: 'FIELD_ENGINEER', action: 'DELIVERABLE_SUBMITTED', details: 'Uploaded raw report DEL-2026-008 (Gurugram District)', ip: '10.240.22.44' }
  ],
  dbMetrics: {
    status: 'HEALTHY',
    active_connections: 42,
    query_latency_ms: 3.8,
    allocated_storage_gb: 14.2,
    max_storage_gb: 100,
    last_backup: '2026-09-13 00:00:00'
  }
};

const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading data file, falling back to initial data:', err);
  }
  return INITIAL_DATA;
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

let db = loadData();

function addAuditLog(user, role, action, details, ip = '127.0.0.1') {
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user,
    role,
    action,
    details,
    ip
  };
  db.auditLogs.unshift(newLog);
  if (db.auditLogs.length > 50) db.auditLogs.pop();
  saveData(db);
}

// Routes

// 1. Health & Admin Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    metrics: db.dbMetrics,
    auditLogs: db.auditLogs
  });
});

// 2. Users Management (Tier 1)
app.get('/api/users', (req, res) => {
  res.json(db.users);
});

app.post('/api/users', (req, res) => {
  const { name, email, role, district } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required.' });
  }
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role,
    district: district || 'ALL',
    active: true,
    avatar: initials
  };
  db.users.push(newUser);
  addAuditLog('Dr. Rajesh Verma', 'SYSTEM_ADMIN', 'USER_CREATED', `Created user ${name} (${role})`);
  saveData(db);
  res.status(201).json(newUser);
});

app.patch('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { role, district, active } = req.body;
  if (role !== undefined) user.role = role;
  if (district !== undefined) user.district = district;
  if (active !== undefined) user.active = active;

  addAuditLog('Dr. Rajesh Verma', 'SYSTEM_ADMIN', 'USER_UPDATED', `Updated permissions for user ${user.name}`);
  saveData(db);
  res.json(user);
});

// 3. Deliverables Management (Tiers 2, 3, 4)
app.get('/api/deliverables', (req, res) => {
  const { district, status } = req.query;
  let result = db.deliverables;

  if (district && district !== 'ALL') {
    result = result.filter(d => d.district === district);
  }
  if (status && status !== 'ALL') {
    result = result.filter(d => d.status === status);
  }

  res.json(result);
});

app.post('/api/deliverables', (req, res) => {
  const { title, district, engineer_id, engineer_name, raw_file_name, estimated_value, notes } = req.body;
  if (!title || !district || !engineer_name) {
    return res.status(400).json({ error: 'Title, district, and engineer name are required.' });
  }

  const newDeliverable = {
    id: `DEL-2026-${String(db.deliverables.length + 1).padStart(3, '0')}`,
    title,
    district,
    engineer_id: engineer_id || 'usr-4',
    engineer_name,
    submission_date: new Date().toISOString().substring(0, 10),
    status: 'ZERO_VALUE', // Default status: zero-value orphaned until mapped/certified
    raw_file_name: raw_file_name || 'raw_field_report.pdf',
    estimated_value: Number(estimated_value) || 0,
    certified_value: 0,
    invoice_id: null,
    notes: notes || 'Raw field upload. Pending QA valuation.'
  };

  db.deliverables.unshift(newDeliverable);
  addAuditLog(engineer_name, 'FIELD_ENGINEER', 'DELIVERABLE_SUBMITTED', `Uploaded field deliverable ${newDeliverable.id} (${district})`);
  saveData(db);
  res.status(201).json(newDeliverable);
});

// 4. Resolve Zero-Value Status (Tier 3: Billing & QA Specialist)
app.patch('/api/deliverables/:id/resolve-zero-value', (req, res) => {
  const { id } = req.params;
  const { certified_value, notes, status } = req.body;

  const deliverable = db.deliverables.find(d => d.id === id);
  if (!deliverable) return res.status(404).json({ error: 'Deliverable not found' });

  deliverable.certified_value = Number(certified_value) || deliverable.estimated_value;
  deliverable.status = status || 'CERTIFIED';
  if (notes) deliverable.notes = notes;

  addAuditLog('Vikramjit Singh', 'BILLING_QA', 'ZERO_VALUE_RESOLVED', `Resolved ${id} to Certified Value ₹${deliverable.certified_value}`);
  saveData(db);
  res.json(deliverable);
});

// 5. Deliverable-to-Invoice Mapping (Tier 3: Billing & QA Specialist)
app.post('/api/invoices/map', (req, res) => {
  const { deliverable_ids, invoice_number, district, notes } = req.body;
  if (!deliverable_ids || !Array.isArray(deliverable_ids) || deliverable_ids.length === 0) {
    return res.status(400).json({ error: 'At least one deliverable ID is required.' });
  }

  const selectedDeliverables = db.deliverables.filter(d => deliverable_ids.includes(d.id));
  if (selectedDeliverables.length === 0) {
    return res.status(404).json({ error: 'No matching deliverables found.' });
  }

  // Calculate total invoice amount from certified values (or estimated if zero)
  const total_amount = selectedDeliverables.reduce((acc, d) => acc + (d.certified_value > 0 ? d.certified_value : d.estimated_value), 0);

  const invNum = invoice_number || `HR-PWD-2026-08${String(db.invoices.length + 3).padStart(2, '0')}`;
  const newInvoice = {
    id: `INV-2026-${String(db.invoices.length + 803)}`,
    invoice_number: invNum,
    billing_date: new Date().toISOString().substring(0, 10),
    total_amount,
    district: district || selectedDeliverables[0].district,
    status: 'ISSUED',
    deliverable_ids,
    notes: notes || `Batched mapping of ${selectedDeliverables.length} report deliverables.`
  };

  // Update status of all mapped deliverables to INVOICED
  selectedDeliverables.forEach(d => {
    d.status = 'INVOICED';
    d.invoice_id = newInvoice.id;
    if (d.certified_value === 0) {
      d.certified_value = d.estimated_value; // Auto-certify upon invoice mapping
    }
  });

  db.invoices.unshift(newInvoice);
  addAuditLog('Vikramjit Singh', 'BILLING_QA', 'INVOICE_MAPPED', `Batched ${deliverable_ids.length} deliverables into Invoice ${newInvoice.invoice_number} (₹${total_amount})`);
  saveData(db);
  res.status(201).json({ invoice: newInvoice, mappedCount: selectedDeliverables.length });
});

// 6. Invoices List
app.get('/api/invoices', (req, res) => {
  res.json(db.invoices);
});

// 7. Executive Dashboard Analytics & One-Tap Aggregated Financials (Tier 2)
app.get('/api/analytics/executive', (req, res) => {
  const totalDeliverables = db.deliverables.length;

  let totalInvoiced = 0;
  let certifiedBalance = 0;
  let pendingZeroValueBalance = 0;

  const districtFinancials = {};
  db.districts.forEach(dist => {
    districtFinancials[dist] = { invoiced: 0, certified: 0, pending: 0, total_reports: 0 };
  });

  db.deliverables.forEach(d => {
    const dist = d.district;
    if (!districtFinancials[dist]) {
      districtFinancials[dist] = { invoiced: 0, certified: 0, pending: 0, total_reports: 0 };
    }
    districtFinancials[dist].total_reports += 1;

    if (d.status === 'INVOICED') {
      totalInvoiced += (d.certified_value || d.estimated_value);
      districtFinancials[dist].invoiced += (d.certified_value || d.estimated_value);
    } else if (d.status === 'CERTIFIED') {
      certifiedBalance += (d.certified_value || d.estimated_value);
      districtFinancials[dist].certified += (d.certified_value || d.estimated_value);
    } else {
      // ZERO_VALUE or PENDING_QA
      pendingZeroValueBalance += d.estimated_value;
      districtFinancials[dist].pending += d.estimated_value;
    }
  });

  const districtChartData = Object.keys(districtFinancials).map(dist => ({
    district: dist,
    Invoiced: districtFinancials[dist].invoiced / 100000, // In Lakhs
    Certified: districtFinancials[dist].certified / 100000,
    PendingZeroValue: districtFinancials[dist].pending / 100000,
    TotalReports: districtFinancials[dist].total_reports
  }));

  const monthlyCashFlow = [
    { month: 'May 2026', invoiced: 35.0, pending: 12.0 },
    { month: 'Jun 2026', invoiced: 42.5, pending: 15.2 },
    { month: 'Jul 2026', invoiced: 58.0, pending: 22.0 },
    { month: 'Aug 2026', invoiced: 64.2, pending: 18.5 },
    { month: 'Sep 2026', invoiced: (totalInvoiced / 100000), pending: ((certifiedBalance + pendingZeroValueBalance) / 100000) }
  ];

  res.json({
    summary: {
      total_deliverables: totalDeliverables,
      total_invoiced_inr: totalInvoiced,
      certified_balance_inr: certifiedBalance,
      pending_zero_value_balance_inr: pendingZeroValueBalance,
      grand_total_portfolio_inr: totalInvoiced + certifiedBalance + pendingZeroValueBalance
    },
    districtBreakdown: districtChartData,
    monthlyCashFlow
  });
});

// 8. External Integrations (Tier 1 & Tier 3)
app.get('/api/admin/integrations', (req, res) => {
  res.json(db.externalIntegrations);
});

app.post('/api/admin/integrations/sync', (req, res) => {
  const { integration_id, toggle_offline_mode } = req.body;
  const integration = db.externalIntegrations.find(i => i.id === integration_id);
  if (!integration) return res.status(404).json({ error: 'Integration not found' });

  if (toggle_offline_mode !== undefined) {
    integration.offline_workaround_active = toggle_offline_mode;
  } else {
    integration.status = 'ONLINE';
    integration.retry_queue = 0;
    integration.last_sync = new Date().toISOString().replace('T', ' ').substring(0, 16);
  }

  addAuditLog('Dr. Rajesh Verma', 'SYSTEM_ADMIN', 'INTEGRATION_SYNC', `Triggered portal sync / status update for ${integration.name}`);
  saveData(db);
  res.json(integration);
});

// 9. Offline Excel Record Batch Reconciliation (Tier 3)
app.post('/api/admin/reconcile-offline', (req, res) => {
  const { records } = req.body; // Array of imported rows
  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Records array required.' });
  }

  let importedCount = 0;
  records.forEach(r => {
    if (r.title && r.district) {
      db.deliverables.unshift({
        id: `DEL-OFFLINE-${Date.now()}-${importedCount + 1}`,
        title: r.title,
        district: r.district,
        engineer_id: 'usr-4',
        engineer_name: r.engineer || 'Reconciled Offline Record',
        submission_date: r.date || new Date().toISOString().substring(0, 10),
        status: r.status || 'CERTIFIED',
        raw_file_name: r.file_name || 'reconciled_offline_ledger.xlsx',
        estimated_value: Number(r.value) || 500000,
        certified_value: Number(r.value) || 500000,
        invoice_id: null,
        notes: 'Imported via Offline Excel Reconciliation Tool during portal outage.'
      });
      importedCount++;
    }
  });

  addAuditLog('Vikramjit Singh', 'BILLING_QA', 'OFFLINE_RECONCILIATION', `Reconciled ${importedCount} offline ledgers into DBMS`);
  saveData(db);
  res.json({ success: true, count: importedCount });
});

app.listen(PORT, () => {
  console.log(`Haryana DBMS Backend running on port ${PORT}`);
});
