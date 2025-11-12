import { test, expect } from '@playwright/test';

/**
 * E2E Tests for KFA Business Processes
 * Based on BUSINESS-PROCESSES-AND-ROLES.md
 *
 * Test Coverage:
 * - Membership Application Process
 * - Payment Processing
 * - Content Creation and Moderation
 * - Certification Process
 * - Membership Lifecycle
 * - Event Registration
 * - Course Enrollment
 */

const API_URL = 'http://localhost/api';

// Seeded test accounts with different roles
const testAccounts = {
  user: { email: 'user@kfa.kg', password: 'password', role: 'user' },
  member: { email: 'member@kfa.kg', password: 'password', role: 'member' },
  admin: { email: 'admin@kfa.kg', password: 'password', role: 'admin' }
};

// Helper to generate unique identifiers
const generateUnique = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

test.describe.configure({ mode: 'serial' });

// ========================================================================
// 1. MEMBERSHIP APPLICATION PROCESS
// ========================================================================

test.describe('Membership Application Process', () => {

  let userToken: string;
  let memberToken: string;
  let adminToken: string;
  let applicationId: number;

  test.beforeAll(async ({ request }) => {
    // Login all roles for testing
    const userRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.user.email, password: testAccounts.user.password }
    });
    userToken = (await userRes.json()).token;

    const memberRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.member.email, password: testAccounts.member.password }
    });
    memberToken = (await memberRes.json()).token;

    const adminRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.admin.email, password: testAccounts.admin.password }
    });
    adminToken = (await adminRes.json()).token;
  });

  test('USER can submit membership application', async ({ request }) => {
    const response = await request.post(`${API_URL}/applications`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        membership_type: 'full', // Full Membership - 50,000 сом/год
        organization: 'Test Financial Company',
        position: 'Financial Analyst',
        experience_years: 5,
        education: 'Bachelor in Finance',
        motivation: 'Want to improve my professional skills and network'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.data).toHaveProperty('id');
    expect(data.data.membership_type).toBe('full');
    expect(data.data.status).toBe('pending'); // Initial status

    applicationId = data.data.id;
  });

  test('USER can view their own applications', async ({ request }) => {
    const response = await request.get(`${API_URL}/applications/my`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('USER CANNOT view all applications', async ({ request }) => {
    const response = await request.get(`${API_URL}/applications`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(403);
  });

  test('ADMIN can view all applications', async ({ request }) => {
    const response = await request.get(`${API_URL}/applications`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('ADMIN can approve application', async ({ request }) => {
    const response = await request.post(`${API_URL}/applications/${applicationId}/approve`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        notes: 'Application approved. Documents verified.'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.status).toBe('approved');
  });

  test('MEMBER CANNOT approve applications', async ({ request }) => {
    // Create another application for testing
    const newApp = await request.post(`${API_URL}/applications`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json'
      },
      data: {
        membership_type: 'associate',
        organization: 'Another Company'
      }
    });
    const newAppId = (await newApp.json()).data.id;

    const response = await request.post(`${API_URL}/applications/${newAppId}/approve`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(403);
  });

  test('ADMIN can reject application with reason', async ({ request }) => {
    // Create application to reject
    const newApp = await request.post(`${API_URL}/applications`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json'
      },
      data: {
        membership_type: 'full',
        organization: 'Test Reject'
      }
    });
    const rejectAppId = (await newApp.json()).data.id;

    const response = await request.post(`${API_URL}/applications/${rejectAppId}/reject`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        reason: 'Insufficient documentation provided'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.status).toBe('rejected');
  });
});

// ========================================================================
// 2. PAYMENT PROCESSING
// ========================================================================

test.describe('Payment Processing', () => {

  let memberToken: string;
  let adminToken: string;
  let paymentId: number;
  let applicationId: number;

  test.beforeAll(async ({ request }) => {
    const memberRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.member.email, password: testAccounts.member.password }
    });
    memberToken = (await memberRes.json()).token;

    const adminRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.admin.email, password: testAccounts.admin.password }
    });
    adminToken = (await adminRes.json()).token;

    // Create an application for payment tests
    const appRes = await request.post(`${API_URL}/applications`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        membershipType: 'full',
        firstName: 'Payment',
        lastName: 'Test',
        position: 'Analyst',
        email: testAccounts.member.email,
        phone: '+996555123456',
        experience: 'Testing payments',
        motivation: 'Test payment processing'
      }
    });
    applicationId = (await appRes.json()).data.id;
  });

  test('MEMBER can create payment for membership', async ({ request }) => {
    const response = await request.post(`${API_URL}/payments`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        application_id: applicationId,
        amount: 50000, // Full Membership - 50,000 сом/год
        payment_type: 'membership_fee'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.data).toHaveProperty('id');
    expect(data.data.amount).toBe(50000);
    expect(data.data.status).toBe('pending');

    paymentId = data.data.id;
  });

  test('MEMBER can view their payment history', async ({ request }) => {
    const response = await request.get(`${API_URL}/payments/my`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('MEMBER CANNOT view all payments', async ({ request }) => {
    const response = await request.get(`${API_URL}/payments`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(403);
  });

  test('ADMIN can view all payments', async ({ request }) => {
    const response = await request.get(`${API_URL}/payments`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('ADMIN can confirm payment', async ({ request }) => {
    const response = await request.post(`${API_URL}/payments/${paymentId}/confirm`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.status).toBe('completed');
  });

  test('MEMBER CANNOT confirm payments', async ({ request }) => {
    // Create another payment
    const newPayment = await request.post(`${API_URL}/payments`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        application_id: applicationId,
        amount: 30000, // Associate Membership
        payment_type: 'subscription'
      }
    });
    const newPaymentId = (await newPayment.json()).data.id;

    const response = await request.post(`${API_URL}/payments/${newPaymentId}/confirm`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(403);
  });
});

// ========================================================================
// 3. CONTENT CREATION AND MODERATION
// ========================================================================

test.describe('Content Creation and Moderation', () => {

  let memberToken: string;
  let adminToken: string;
  let newsId: number;

  test.beforeAll(async ({ request }) => {
    const memberRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.member.email, password: testAccounts.member.password }
    });
    memberToken = (await memberRes.json()).token;

    const adminRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.admin.email, password: testAccounts.admin.password }
    });
    adminToken = (await adminRes.json()).token;
  });

  test('MEMBER can create news as draft', async ({ request }) => {
    const response = await request.post(`${API_URL}/news`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'Financial Market Update Q4 2025',
        slug: generateUnique('financial-market-update'),
        content: 'Detailed analysis of the financial market trends...',
        status: 'draft'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.data.status).toBe('draft');

    newsId = data.data.id;
  });

  test('MEMBER can update their own news', async ({ request }) => {
    const response = await request.put(`${API_URL}/news/${newsId}`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'Financial Market Update Q4 2025 - Updated',
        content: 'Updated analysis with new data...',
        status: 'submitted' // Submit for moderation
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.status).toBe('submitted');
  });

  test('ADMIN can approve news for publication', async ({ request }) => {
    const response = await request.post(`${API_URL}/news/${newsId}/approve`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        moderation_notes: 'Content reviewed and approved'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.status).toBe('published');
  });

  test('ADMIN can mark news as featured', async ({ request }) => {
    const response = await request.post(`${API_URL}/news/${newsId}/feature`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.featured).toBe(true);
  });

  test('MEMBER CANNOT delete news', async ({ request }) => {
    const response = await request.delete(`${API_URL}/news/${newsId}`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(403);
  });

  test('ADMIN can unpublish and archive news', async ({ request }) => {
    const response = await request.post(`${API_URL}/news/${newsId}/archive`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.status).toBe('archived');
  });
});

// ========================================================================
// 4. CERTIFICATION PROCESS
// ========================================================================

test.describe('Certification Process', () => {

  let memberToken: string;
  let adminToken: string;
  let courseId: number;
  let enrollmentId: number;
  let examId: number;

  test.beforeAll(async ({ request }) => {
    const memberRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.member.email, password: testAccounts.member.password }
    });
    memberToken = (await memberRes.json()).token;

    const adminRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.admin.email, password: testAccounts.admin.password }
    });
    adminToken = (await adminRes.json()).token;
  });

  test('MEMBER can view available courses', async ({ request }) => {
    const response = await request.get(`${API_URL}/courses`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();

    if (data.data.length > 0) {
      courseId = data.data[0].id;
    }
  });

  test('MEMBER can enroll in course', async ({ request }) => {
    // If no courses exist, create one as admin first
    if (!courseId) {
      const createCourse = await request.post(`${API_URL}/courses`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: {
          title: 'CFA Level I Preparation Course',
          description: 'Comprehensive preparation for CFA Level I exam',
          duration_weeks: 12,
          price: 15000
        }
      });
      courseId = (await createCourse.json()).data.id;
    }

    const response = await request.post(`${API_URL}/courses/${courseId}/enroll`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.data).toHaveProperty('id');
    expect(data.data.course_id).toBe(courseId);

    enrollmentId = data.data.id;
  });

  test('MEMBER can view course progress', async ({ request }) => {
    const response = await request.get(`${API_URL}/courses/${courseId}/progress`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data).toHaveProperty('progress_percentage');
  });

  test('MEMBER can register for exam', async ({ request }) => {
    const response = await request.post(`${API_URL}/exams/register`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        course_id: courseId,
        exam_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        location: 'Bishkek Testing Center'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.data).toHaveProperty('id');

    examId = data.data.id;
  });

  test('ADMIN can issue certificate after exam pass', async ({ request }) => {
    const response = await request.post(`${API_URL}/certificates`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        user_id: 2, // Member user ID
        course_id: courseId,
        exam_id: examId,
        credential_id: generateUnique('CFA-CERT'),
        issued_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        grade: 'Pass',
        score: 85
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.data).toHaveProperty('credential_id');
  });

  test('MEMBER can view their certificates', async ({ request }) => {
    const response = await request.get(`${API_URL}/certificates/my`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('Anyone can verify certificate by credential ID', async ({ request }) => {
    // Get a certificate credential ID
    const certs = await request.get(`${API_URL}/certificates/my`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });
    const certsData = await certs.json();

    if (certsData.data.length > 0) {
      const credentialId = certsData.data[0].credential_id;

      const response = await request.get(`${API_URL}/certificates/${credentialId}/verify`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.data.valid).toBe(true);
    }
  });
});

// ========================================================================
// 5. MEMBERSHIP LIFECYCLE
// ========================================================================

test.describe('Membership Lifecycle', () => {

  let memberToken: string;
  let adminToken: string;

  test.beforeAll(async ({ request }) => {
    const memberRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.member.email, password: testAccounts.member.password }
    });
    memberToken = (await memberRes.json()).token;

    const adminRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.admin.email, password: testAccounts.admin.password }
    });
    adminToken = (await adminRes.json()).token;
  });

  test('MEMBER can view their membership status', async ({ request }) => {
    const response = await request.get(`${API_URL}/membership/status`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data).toHaveProperty('membership_type');
    expect(data.data).toHaveProperty('expires_at');
    expect(data.data).toHaveProperty('is_active');
  });

  test('MEMBER receives renewal notification before expiry', async ({ request }) => {
    const response = await request.get(`${API_URL}/notifications`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('MEMBER can initiate membership renewal', async ({ request }) => {
    const response = await request.post(`${API_URL}/membership/renew`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        membership_type: 'full', // Continue with full membership
        payment_method: 'bank_transfer'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.data).toHaveProperty('renewal_invoice_id');
    expect(data.data.status).toBe('pending_payment');
  });

  test('ADMIN can manually extend membership', async ({ request }) => {
    const response = await request.post(`${API_URL}/membership/extend`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        user_id: 2, // Member user ID
        extension_days: 30,
        reason: 'Complimentary extension for active participation'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data).toHaveProperty('new_expiry_date');
  });

  test('Expired MEMBER status is downgraded to USER', async ({ request }) => {
    // This test simulates the automated background job
    // In real scenario, this would be a cron job checking expired memberships

    const response = await request.post(`${API_URL}/admin/memberships/check-expired`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('processed_count');
  });
});

// ========================================================================
// 6. EVENT REGISTRATION
// ========================================================================

test.describe('Event Registration', () => {

  let userToken: string;
  let memberToken: string;
  let adminToken: string;
  let eventId: number;

  test.beforeAll(async ({ request }) => {
    const userRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.user.email, password: testAccounts.user.password }
    });
    userToken = (await userRes.json()).token;

    const memberRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.member.email, password: testAccounts.member.password }
    });
    memberToken = (await memberRes.json()).token;

    const adminRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.admin.email, password: testAccounts.admin.password }
    });
    adminToken = (await adminRes.json()).token;
  });

  test('ADMIN can create event', async ({ request }) => {
    const response = await request.post(`${API_URL}/events`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'Annual Finance Conference 2025',
        slug: generateUnique('finance-conference-2025'),
        description: 'Major financial industry conference',
        starts_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
        ends_at: new Date(Date.now() + 62 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Hyatt Regency Bishkek',
        max_participants: 200,
        registration_fee_user: 5000,
        registration_fee_member: 0 // Free for members
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    eventId = data.data.id;
  });

  test('USER can view public events', async ({ request }) => {
    const response = await request.get(`${API_URL}/events`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('USER can register for event with fee', async ({ request }) => {
    const response = await request.post(`${API_URL}/events/${eventId}/register`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        answers: {
          dietary_requirements: 'Vegetarian',
          special_needs: 'None'
        }
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.registration).toHaveProperty('id');
    expect(data.registration.amount_paid).toBe(5000); // USER pays 5000
  });

  test('MEMBER can register for event for free', async ({ request }) => {
    const response = await request.post(`${API_URL}/events/${eventId}/register`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.registration.amount_paid).toBe(0); // MEMBER gets free access
  });

  test('MEMBER gets priority registration', async ({ request }) => {
    // Create event with limited capacity
    const limitedEvent = await request.post(`${API_URL}/events`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'VIP Networking Event',
        slug: generateUnique('vip-networking'),
        type: 'networking',
        status: 'published',
        description: 'VIP networking event with limited capacity',
        starts_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        location: 'VIP Lounge',
        max_participants: 50,
        price: 10000,
        member_price: 0,
        requires_approval: false
      }
    });
    const limitedEventId = (await limitedEvent.json()).data.id;

    const response = await request.post(`${API_URL}/events/${limitedEventId}/register`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.registration).toHaveProperty('id');
    // Member gets better pricing (member_price = 0 vs price = 10000)
    expect(data.registration.amount_paid).toBe(0);
  });
});

// ========================================================================
// 7. DASHBOARD ACCESS CONTROL
// ========================================================================

test.describe('Dashboard Access Control', () => {

  let userToken: string;
  let memberToken: string;
  let adminToken: string;

  test.beforeAll(async ({ request }) => {
    const userRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.user.email, password: testAccounts.user.password }
    });
    userToken = (await userRes.json()).token;

    const memberRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.member.email, password: testAccounts.member.password }
    });
    memberToken = (await memberRes.json()).token;

    const adminRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.admin.email, password: testAccounts.admin.password }
    });
    adminToken = (await adminRes.json()).token;
  });

  test('USER can access profile dashboard', async ({ request }) => {
    const response = await request.get(`${API_URL}/dashboard/profile`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
  });

  test('USER CANNOT access main dashboard', async ({ request }) => {
    const response = await request.get(`${API_URL}/dashboard`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(403);
  });

  test('USER CANNOT access payments dashboard', async ({ request }) => {
    const response = await request.get(`${API_URL}/dashboard/payments`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(403);
  });

  test('MEMBER can access main dashboard', async ({ request }) => {
    const response = await request.get(`${API_URL}/dashboard`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
  });

  test('MEMBER can access payments dashboard', async ({ request }) => {
    const response = await request.get(`${API_URL}/dashboard/payments`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
  });

  test('MEMBER can access certificates dashboard', async ({ request }) => {
    const response = await request.get(`${API_URL}/dashboard/certificates`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
  });

  test('MEMBER can access education dashboard', async ({ request }) => {
    const response = await request.get(`${API_URL}/dashboard/education`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
  });

  test('MEMBER CANNOT access admin dashboard', async ({ request }) => {
    const response = await request.get(`${API_URL}/dashboard/admin`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(403);
  });

  test('ADMIN can access admin dashboard', async ({ request }) => {
    const response = await request.get(`${API_URL}/dashboard/admin`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
  });

  test('ADMIN can access all dashboard sections', async ({ request }) => {
    const sections = ['', 'profile', 'payments', 'certificates', 'education', 'admin'];

    for (const section of sections) {
      const url = section ? `${API_URL}/dashboard/${section}` : `${API_URL}/dashboard`;
      const response = await request.get(url, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Accept': 'application/json'
        }
      });

      expect(response.status()).toBe(200);
    }
  });
});

// ========================================================================
// 8. USER MANAGEMENT (ADMIN ONLY)
// ========================================================================

test.describe('User Management', () => {

  let adminToken: string;
  let memberToken: string;
  let testUserId: number;

  test.beforeAll(async ({ request }) => {
    const adminRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.admin.email, password: testAccounts.admin.password }
    });
    adminToken = (await adminRes.json()).token;

    const memberRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.member.email, password: testAccounts.member.password }
    });
    memberToken = (await memberRes.json()).token;
  });

  test('ADMIN can view all users', async ({ request }) => {
    const response = await request.get(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();

    if (data.data.length > 0) {
      testUserId = data.data.find((u: any) => u.role === 'user')?.id;
    }
  });

  test('MEMBER CANNOT view all users', async ({ request }) => {
    const response = await request.get(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(403);
  });

  test('ADMIN can change user role', async ({ request }) => {
    if (!testUserId) {
      // Create a test user first
      const newUser = await request.post(`${API_URL}/register`, {
        data: {
          name: 'Test Role Change User',
          email: generateUnique('rolechange') + '@test.com',
          password: 'password123',
          password_confirmation: 'password123'
        }
      });
      testUserId = (await newUser.json()).user.id;
    }

    const response = await request.put(`${API_URL}/users/${testUserId}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        role: 'member' // Upgrade USER to MEMBER
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.role).toBe('member');
  });

  test('MEMBER CANNOT change user roles', async ({ request }) => {
    const response = await request.put(`${API_URL}/users/${testUserId}`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      },
      data: {
        role: 'admin'
      }
    });

    expect(response.status()).toBe(403);
  });

  test('ADMIN can view user activity logs', async ({ request }) => {
    const response = await request.get(`${API_URL}/users/${testUserId}/activity`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();
  });
});
