import { supabase } from './supabase';
function parseCard(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string' && raw.startsWith('[')) { try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch {} }
  return raw ? [raw] : [];
}
export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*').order('created_at');
  if (error) throw error;
  return data.map(u => ({ id: u.id, name: u.name, email: u.email, password: u.password, role: u.role, active: u.active, card: parseCard(u.card), createdAt: u.created_at }));
}
export async function loginUser(email, password) {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password).eq('active', true).single();
  if (error) return null;
  return { ...data, card: parseCard(data.card) };
}
export async function createUser(user) {
  const id = 'u' + Date.now();
  const { data, error } = await supabase.from('users').insert({ ...user, id, active: true, created_at: new Date().toISOString().slice(0,10) }).select().single();
  if (error) throw error;
  return data;
}
export async function updateUser(id, changes) {
  const { error } = await supabase.from('users').update(changes).eq('id', id);
  if (error) throw error;
}
export async function uploadReceiptFile(file, txId) {
  const ext = file.name.split('.').pop() || 'pdf';
  const path = `${txId}/${Date.now()}.${ext}`;
  // Ensure bucket exists (ignore error if already exists)
  await supabase.storage.createBucket('receipts', { public: true }).catch(() => {});
  const { error } = await supabase.storage.from('receipts').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('receipts').getPublicUrl(path);
  return data.publicUrl;
}
export async function attachReceipt(transactionId, receipt) {
  await supabase.from('receipts').delete().eq('transaction_id', transactionId);
  const { error } = await supabase.from('receipts').insert({ transaction_id: transactionId, name: receipt.name, size: receipt.size, url: receipt.url, receipt_match: receipt.receiptMatch || null });
  if (error) throw error;
}
export async function removeReceipt(transactionId) {
  const { error } = await supabase.from('receipts').delete().eq('transaction_id', transactionId);
  if (error) throw error;
}
export async function getStatementStatuses() {
  const { data, error } = await supabase.from('statement_status').select('*');
  if (error) throw error;
  const map = {};
  for (const row of data) map[row.user_id] = row.status;
  return map;
}
export async function setStatementStatus(userId, period, status) {
  const { error } = await supabase.from('statement_status').upsert({ user_id: userId, period, status, updated_at: new Date().toISOString() }, { onConflict: 'user_id,period' });
  if (error) throw error;
}
export async function getExportHistory() {
  const { data, error } = await supabase.from('export_history').select('*').order('exported_at', { ascending: false });
  if (error) throw error;
  return data.map(r => ({ reconId: r.recon_id, nsId: r.ns_id, total: parseFloat(r.total), txCount: r.tx_count, receiptCount: r.receipt_count, exportedBy: r.exported_by, exportedAt: r.exported_at }));
}
export async function saveExportRecord(record) {
  const { error } = await supabase.from('export_history').insert({ recon_id: record.reconId, ns_id: record.nsId, total: record.total, tx_count: record.txCount, receipt_count: record.receiptCount, exported_by: record.exportedBy, exported_at: record.exportedAt });
  if (error) throw error;
}
export async function getTransactions() {
  const { data, error } = await supabase.from('transactions').select('*, receipts(id, name, size, url, receipt_match)').order('date');
  if (error) throw error;
  return data.map(t => ({
    id: t.id, date: t.date, vendor: t.vendor, description: t.description,
    amount: parseFloat(t.amount), card: t.card, userId: t.user_id,
    categoryId: t.category_id, categoryName: t.category_name, dept: t.dept,
    confidence: t.confidence, autoAssigned: t.auto_assigned, isRecurring: t.is_recurring,
    assigneeId: t.assignee_id, autoAssignee: t.auto_assignee, status: t.status,
    memo: t.memo, flagReason: t.flag_reason, reconId: t.recon_id,
    receipt: t.receipts?.[0] ? { name: t.receipts[0].name, size: t.receipts[0].size, url: t.receipts[0].url } : null,
    receiptMatch: t.receipts?.[0]?.receipt_match || null
  }));
}
export async function updateTransaction(id, changes) {
  const keyMap = {
    userId: 'user_id', categoryId: 'category_id', categoryName: 'category_name',
    autoAssigned: 'auto_assigned', isRecurring: 'is_recurring',
    assigneeId: 'assignee_id', autoAssignee: 'auto_assignee',
    flagReason: 'flag_reason', reconId: 'recon_id'
  };
  const mapped = {};
  for (const [k, v] of Object.entries(changes)) {
    if (k === 'receipt' || k === 'receiptMatch') continue;
    mapped[keyMap[k] || k] = v;
  }
  const { error } = await supabase.from('transactions').update(mapped).eq('id', id);
  if (error) throw error;
}
export async function bulkUpdateStatus(ids, status, reconId) {
  const update = { status };
  if (reconId) update.recon_id = reconId;
  const { error } = await supabase.from('transactions').update(update).in('id', ids);
  if (error) throw error;
}
export async function getCards() {
  const { data, error } = await supabase.from('cards').select('*').order('created_at');
  if (error) throw error;
  return data.map(c => ({ id: c.id, name: c.name, network: c.network, last4: c.last4, division: c.division, active: c.active }));
}
export async function createCard(card) {
  const id = 'c' + Date.now();
  const { data, error } = await supabase.from('cards').insert({ ...card, id }).select().single();
  if (error) throw error;
  return data;
}
export async function updateCard(id, changes) {
  const { error } = await supabase.from('cards').update(changes).eq('id', id);
  if (error) throw error;
}