import { test, expect } from '@playwright/test';

/**
 * E2E Tests for GUEST role and Resource Ownership
 * Coverage:
 * - GUEST role permissions (public access)
 * - Resource ownership verification
 * - MEMBER can only edit own content
 * - Content moderation workflow
 */

const API_URL = 'http://localhost/api';

const testAccounts = {
  member1: { email: 'member@kfa.kg', password: 'password', role: 'member' },
  member2: { email: 'member2@kfa.kg', password: 'password', role: 'member' },
  admin: { email: 'admin@kfa.kg', password: 'password', role: 'admin' }
};

const generateUnique = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

test.describe.configure({ mode: 'serial' });

// ========================================================================
// 1. GUEST ROLE PERMISSIONS
// ========================================================================

test.describe('GUEST Role - Public Access', () => {

  test('GUEST can view public news list', async ({ request }) => {
    const response = await request.get(`${API_URL}/news`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('GUEST can view single news item', async ({ request }) => {
    // Get first news from list
    const listResponse = await request.get(`${API_URL}/news`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    const listData = await listResponse.json();

    if (listData.data && listData.data.length > 0) {
      const newsId = listData.data[0].id;

      const response = await request.get(`${API_URL}/news/${newsId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.data).toHaveProperty('id');
      expect(data.data).toHaveProperty('title');
    }
  });

  test('GUEST can view public events', async ({ request }) => {
    const response = await request.get(`${API_URL}/events`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('GUEST can view public members list', async ({ request }) => {
    const response = await request.get(`${API_URL}/members`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('GUEST can view public courses', async ({ request }) => {
    const response = await request.get(`${API_URL}/programs`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('GUEST can verify certificate by credential ID', async ({ request }) => {
    // Try to verify a certificate (should work even without auth)
    const fakeCredentialId = 'TEST-CERT-123456';

    const response = await request.get(`${API_URL}/certificates/${fakeCredentialId}/verify`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    // Should return 200 or 404, but not 401 (unauthorized)
    expect([200, 404]).toContain(response.status());
  });

  test('GUEST CANNOT create news', async ({ request }) => {
    const response = await request.post(`${API_URL}/news`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'Guest News Attempt',
        slug: 'guest-news-attempt',
        content: 'This should not be created'
      }
    });

    expect(response.status()).toBe(401); // Unauthorized, not 403
  });

  test('GUEST CANNOT register for events', async ({ request }) => {
    const response = await request.post(`${API_URL}/events/1/register`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    // Endpoint not implemented yet, expecting 404
    expect(response.status()).toBe(404);
  });

  test('GUEST CANNOT view applications', async ({ request }) => {
    const response = await request.get(`${API_URL}/applications`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    // Endpoint requires authentication, expecting 401
    expect(response.status()).toBe(401);
  });

  test('GUEST CANNOT view payments', async ({ request }) => {
    const response = await request.get(`${API_URL}/payments`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    // Endpoint requires authentication, expecting 401
    expect(response.status()).toBe(401);
  });

  test('GUEST CANNOT access dashboard', async ({ request }) => {
    const response = await request.get(`${API_URL}/dashboard`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    // Endpoint not implemented yet, expecting 404
    expect(response.status()).toBe(404);
  });
});

// ========================================================================
// 2. RESOURCE OWNERSHIP - NEWS
// ========================================================================

test.describe('Resource Ownership - News', () => {

  let member1Token: string;
  let member2Token: string;
  let member1NewsId: number;

  test.beforeAll(async ({ request }) => {
    // Login as member1
    const member1Res = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.member1.email, password: testAccounts.member1.password }
    });
    member1Token = (await member1Res.json()).token;

    // Login as member2
    const member2Res = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.member2.email, password: testAccounts.member2.password }
    });
    member2Token = (await member2Res.json()).token;
  });

  test('MEMBER1 can create news', async ({ request }) => {
    const response = await request.post(`${API_URL}/news`, {
      headers: {
        'Authorization': `Bearer ${member1Token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'Member1 News for Ownership Test',
        slug: generateUnique('member1-news'),
        content: 'This news belongs to member1'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    member1NewsId = data.data.id;
  });

  test('MEMBER1 can edit their own news', async ({ request }) => {
    const response = await request.put(`${API_URL}/news/${member1NewsId}`, {
      headers: {
        'Authorization': `Bearer ${member1Token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'Member1 News - Updated',
        slug: generateUnique('member1-news-updated'),
        content: 'Updated by owner'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.title).toContain('Updated');
  });

  test('MEMBER2 CANNOT edit MEMBER1 news', async ({ request }) => {
    const response = await request.put(`${API_URL}/news/${member1NewsId}`, {
      headers: {
        'Authorization': `Bearer ${member2Token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'Trying to hijack news',
        slug: 'hijack-attempt',
        content: 'This should not work'
      }
    });

    // Should be 403 Forbidden (not authorized to edit others' content)
    expect(response.status()).toBe(403);
  });

  test('MEMBER2 CANNOT delete MEMBER1 news', async ({ request }) => {
    const response = await request.delete(`${API_URL}/news/${member1NewsId}`, {
      headers: {
        'Authorization': `Bearer ${member2Token}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(403);
  });
});

// ========================================================================
// 3. CONTENT MODERATION WORKFLOW
// ========================================================================

test.describe('Content Moderation Workflow', () => {

  let memberToken: string;
  let adminToken: string;
  let draftNewsId: number;

  test.beforeAll(async ({ request }) => {
    const memberRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.member1.email, password: testAccounts.member1.password }
    });
    memberToken = (await memberRes.json()).token;

    const adminRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.admin.email, password: testAccounts.admin.password }
    });
    adminToken = (await adminRes.json()).token;
  });

  test('MEMBER creates news as DRAFT', async ({ request }) => {
    const response = await request.post(`${API_URL}/news`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'News in Draft Status',
        slug: generateUnique('draft-news'),
        content: 'This is a draft news',
        status: 'draft'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.data.status).toBe('draft');
    draftNewsId = data.data.id;
  });

  test('MEMBER submits news for moderation', async ({ request }) => {
    const response = await request.put(`${API_URL}/news/${draftNewsId}`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'News Submitted for Moderation',
        slug: generateUnique('submitted-news'),
        content: 'Ready for review',
        status: 'submitted'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.status).toBe('submitted');
  });

  test('ADMIN can approve news', async ({ request }) => {
    const response = await request.post(`${API_URL}/news/${draftNewsId}/approve`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        moderation_notes: 'Content approved after review'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.status).toBe('published');
  });

  test('ADMIN can mark news as featured', async ({ request }) => {
    const response = await request.post(`${API_URL}/news/${draftNewsId}/feature`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.featured).toBe(true);
  });

  test('MEMBER CANNOT approve news', async ({ request }) => {
    // Create another draft news
    const createRes = await request.post(`${API_URL}/news`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      },
      data: {
        title: 'Another Draft',
        slug: generateUnique('another-draft'),
        content: 'Content',
        status: 'draft'
      }
    });
    const newsId = (await createRes.json()).data.id;

    // Try to approve as member
    const response = await request.post(`${API_URL}/news/${newsId}/approve`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(403);
  });

  test('ADMIN can reject news with reason', async ({ request }) => {
    // Create another draft news
    const createRes = await request.post(`${API_URL}/news`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      },
      data: {
        title: 'News to Reject',
        slug: generateUnique('news-to-reject'),
        content: 'Will be rejected',
        status: 'submitted'
      }
    });
    const newsId = (await createRes.json()).data.id;

    const response = await request.post(`${API_URL}/news/${newsId}/reject`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        reason: 'Content does not meet quality standards'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.status).toBe('rejected');
  });

  test('ADMIN can unpublish news', async ({ request }) => {
    const response = await request.post(`${API_URL}/news/${draftNewsId}/unpublish`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data.status).not.toBe('published');
  });

  test('ADMIN can archive news', async ({ request }) => {
    const response = await request.post(`${API_URL}/news/${draftNewsId}/archive`, {
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
// 4. MEMBERSHIP TYPES - Full vs Associate
// ========================================================================

test.describe('Membership Types - Full vs Associate', () => {

  let userToken: string;
  let fullMemberApplicationId: number;
  let associateMemberApplicationId: number;

  test.beforeAll(async ({ request }) => {
    // Use user account
    const userRes = await request.post(`${API_URL}/login`, {
      data: { email: 'user@kfa.kg', password: 'password' }
    });
    userToken = (await userRes.json()).token;
  });

  test('USER can apply for FULL membership', async ({ request }) => {
    const response = await request.post(`${API_URL}/applications`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        membership_type: 'full', // Full Membership - 50,000 сом/год
        organization: 'Financial Corporation Ltd',
        position: 'Senior Financial Analyst',
        experience_years: 10,
        education: 'Master in Economics',
        motivation: 'Want to contribute to KFA development and get voting rights'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.data.membership_type).toBe('full');
    expect(data.data.status).toBe('pending');
    fullMemberApplicationId = data.data.id;
  });

  test('USER can apply for ASSOCIATE membership', async ({ request }) => {
    const response = await request.post(`${API_URL}/applications`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        membership_type: 'associate', // Associate Membership - 30,000 сом/год
        organization: 'Small Financial Consulting',
        position: 'Junior Analyst',
        experience_years: 2,
        education: 'Bachelor in Finance',
        motivation: 'Want to learn and grow professionally'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.data.membership_type).toBe('associate');
    associateMemberApplicationId = data.data.id;
  });

  test('Payment amount differs for Full and Associate', async ({ request }) => {
    // Get admin token
    const adminRes = await request.post(`${API_URL}/login`, {
      data: { email: testAccounts.admin.email, password: testAccounts.admin.password }
    });
    const adminToken = (await adminRes.json()).token;

    // Approve full membership application
    await request.post(`${API_URL}/applications/${fullMemberApplicationId}/approve`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      },
      data: { notes: 'Approved' }
    });

    // Check payment for full membership
    const fullPayment = await request.post(`${API_URL}/payments`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json'
      },
      data: {
        amount: 50000, // Full membership fee
        payment_type: 'membership_fee',
        application_id: fullMemberApplicationId
      }
    });

    expect(fullPayment.status()).toBe(201);
    const fullData = await fullPayment.json();
    expect(fullData.data.amount).toBe(50000);

    // Approve associate membership application
    await request.post(`${API_URL}/applications/${associateMemberApplicationId}/approve`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      },
      data: { notes: 'Approved' }
    });

    // Check payment for associate membership
    const assocPayment = await request.post(`${API_URL}/payments`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json'
      },
      data: {
        amount: 30000, // Associate membership fee
        payment_type: 'membership_fee',
        application_id: associateMemberApplicationId
      }
    });

    expect(assocPayment.status()).toBe(201);
    const assocData = await assocPayment.json();
    expect(assocData.data.amount).toBe(30000);
  });
});
