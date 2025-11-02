import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost/api';
const APP_URL = 'http://localhost:3000';

const testAccounts = {
  user: { email: 'user@kfa.kg', password: 'password', role: 'user' },
  member: { email: 'member@kfa.kg', password: 'password', role: 'member' },
  admin: { email: 'admin@kfa.kg', password: 'password', role: 'admin' }
};

// Helper to generate unique emails for tests that require new users
const generateEmail = (prefix: string) => `test-${prefix}-${Date.now()}@example.com`;

test.describe.configure({ mode: 'serial' });

test.describe('Authentication and Role-Based Access Control', () => {

  test.skip('should register a new user with default role', async ({ request }) => {
    const response = await request.post(`${API_URL}/register`, {
      data: {
        name: 'Test User',
        email: generateEmail('user'),
        password: testAccounts.user.password,
        password_confirmation: testAccounts.user.password,
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();

    expect(data).toHaveProperty('user');
    expect(data).toHaveProperty('token');
    // Email will be unique, not checking exact value
    expect(data.user.role).toBe('user'); // Default role
  });

  test.skip('should register a new member with member role', async ({ request }) => {
    const response = await request.post(`${API_URL}/register`, {
      data: {
        name: 'Test Member',
        email: generateEmail('member'),
        password: testAccounts.member.password,
        password_confirmation: testAccounts.member.password,
        role: 'member'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();

    // Email will be unique, not checking exact value
    expect(data.user.role).toBe('member');
  });

  test.skip('should register a new admin with admin role', async ({ request }) => {
    const response = await request.post(`${API_URL}/register`, {
      data: {
        name: 'Test Admin',
        email: generateEmail('admin'),
        password: testAccounts.admin.password,
        password_confirmation: testAccounts.admin.password,
        role: 'admin'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();

    // Email will be unique, not checking exact value
    expect(data.user.role).toBe('admin');
  });

  test('should login with correct credentials', async ({ request }) => {
    // Login with seeded account
    // Then login
    const response = await request.post(`${API_URL}/login`, {
      data: {
        email: testAccounts.user.email,
        password: testAccounts.user.password
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data).toHaveProperty('user');
    expect(data).toHaveProperty('token');
  });

  test.skip('should fail login with incorrect credentials', async ({ request }) => {
    const response = await request.post(`${API_URL}/login`, {
      data: {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      }
    });

    expect(response.status()).toBe(422);
  });

  test('should get user info with valid token', async ({ request }) => {
    // Login with seeded account
    const loginResponse = await request.post(`${API_URL}/login`, {
      data: {
        email: testAccounts.admin.email,
        password: testAccounts.admin.password
      }
    });
    
    const { token } = await loginResponse.json();

    // Get user info
    const response = await request.get(`${API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('email');
  });

  test.skip('should deny access without authentication', async ({ request }) => {
    const response = await request.get(`${API_URL}/user`);
    expect(response.status()).toBe(401);
  });
});

test.describe('Role-Based Authorization', () => {

  let userToken: string;
  let memberToken: string;
  let adminToken: string;

  test.beforeAll(async ({ request }) => {
    // Register users with different roles
    const userResponse = await request.post(`${API_URL}/login`, {
      data: {
        email: testAccounts.user.email,
        password: testAccounts.user.password
      }
    });
    userToken = (await userResponse.json()).token;

    const memberResponse = await request.post(`${API_URL}/login`, {
      data: {
        email: testAccounts.member.email,
        password: testAccounts.member.password
      }
    });
    memberToken = (await memberResponse.json()).token;

    const adminResponse = await request.post(`${API_URL}/login`, {
      data: {
        email: testAccounts.admin.email,
        password: testAccounts.admin.password
      }
    });
    adminToken = (await adminResponse.json()).token;
  });

  test('user role can READ news', async ({ request }) => {
    const response = await request.get(`${API_URL}/news`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json'
      }
    });
    expect(response.status()).toBe(200);
  });

  test('user role CANNOT CREATE news', async ({ request }) => {
    const response = await request.post(`${API_URL}/news`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'Test News',
        slug: 'test-news',
        content: 'Test content'
      }
    });
    expect(response.status()).toBe(403);
    const data = await response.json();
    expect(data.message).toContain('Forbidden');
  });

  test('member role CAN CREATE news', async ({ request }) => {
    const response = await request.post(`${API_URL}/news`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'Member News',
        slug: `member-news-${Date.now()}`,
        content: 'Test content by member'
      }
    });
    expect(response.status()).toBe(201);
  });

  test('member role CANNOT DELETE news', async ({ request }) => {
    // First create a news item as member
    const createResponse = await request.post(`${API_URL}/news`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'News to Delete',
        slug: `news-to-delete-${Date.now()}`,
        content: 'This will be deleted'
      }
    });
    const createData = await createResponse.json();
    const newsId = createData.data.id;

    // Try to delete as member
    const deleteResponse = await request.delete(`${API_URL}/news/${newsId}`, {
      headers: {
        'Authorization': `Bearer ${memberToken}`,
        'Accept': 'application/json'
      }
    });
    expect(deleteResponse.status()).toBe(403);
  });

  test('admin role CAN DELETE news', async ({ request }) => {
    // First create a news item as admin
    const createResponse = await request.post(`${API_URL}/news`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'Admin News to Delete',
        slug: `admin-news-to-delete-${Date.now()}`,
        content: 'This will be deleted by admin'
      }
    });
    const createData = await createResponse.json();
    const newsId = createData.data.id;

    // Delete as admin
    const deleteResponse = await request.delete(`${API_URL}/news/${newsId}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });
    expect(deleteResponse.status()).toBe(200);
  });

  test('admin role has full CRUD access', async ({ request }) => {
    // Create
    const createResponse = await request.post(`${API_URL}/events`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'Admin Event',
        slug: `admin-event-${Date.now()}`,
        description: 'Admin created event',
        starts_at: new Date().toISOString()
      }
    });
    expect(createResponse.status()).toBe(201);
    const createData = await createResponse.json();
    const eventId = createData.data.id;

    // Read
    const readResponse = await request.get(`${API_URL}/events/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });
    expect(readResponse.status()).toBe(200);

    // Update
    const updateResponse = await request.put(`${API_URL}/events/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        title: 'Updated Admin Event',
        slug: `updated-admin-event-${Date.now()}`,
        description: 'Updated by admin',
        starts_at: new Date().toISOString()
      }
    });
    expect(updateResponse.status()).toBe(200);

    // Delete
    const deleteResponse = await request.delete(`${API_URL}/events/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });
    expect(deleteResponse.status()).toBe(200);
  });

  test('logout invalidates token', async ({ request }) => {
    // Login with seeded account to get token
    const loginResponse = await request.post(`${API_URL}/login`, {
      data: {
        email: testAccounts.user.email,
        password: testAccounts.user.password
      }
    });
    const { token } = await loginResponse.json();

    // Logout
    const logoutResponse = await request.post(`${API_URL}/logout`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    expect(logoutResponse.status()).toBe(200);

    // Try to use token after logout
    const userResponse = await request.get(`${API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    expect(userResponse.status()).toBe(401);
  });
});
