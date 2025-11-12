# 📘 КФА API Reference Guide

**Version**: 1.0.0
**Base URL**: `http://127.0.0.1:8000/api`
**Authentication**: Laravel Sanctum (Bearer Token)

---

## 🔐 Authentication

### POST /register
Регистрация нового пользователя.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response 201:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "1|abc123..."
}
```

---

### POST /login
Вход в систему.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "user": { ... },
  "token": "1|abc123..."
}
```

---

### POST /logout
Выход из системы.

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "message": "Logged out successfully"
}
```

---

## 📝 Membership Applications

### POST /applications
Подать заявку на членство (public).

**Body:**
```json
{
  "membershipType": "full",
  "firstName": "John",
  "lastName": "Doe",
  "organizationName": "Example Corp",
  "position": "Financial Analyst",
  "email": "john@example.com",
  "phone": "+996555123456",
  "experience": "5 years in finance",
  "motivation": "Want to improve skills"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": 1,
    "status": "pending",
    "createdAt": "2025-11-13T..."
  }
}
```

---

### GET /applications/my
Получить свои заявки.

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "membership_type": "full",
      "status": "pending",
      "created_at": "2025-11-13T..."
    }
  ]
}
```

---

### GET /applications (Admin)
Получить все заявки.

**Headers:** `Authorization: Bearer {admin_token}`

**Query Parameters:**
- `status` - фильтр по статусу
- `page` - номер страницы

**Response 200:**
```json
{
  "data": [...],
  "links": {...},
  "meta": {...}
}
```

---

### GET /applications/pending (Admin)
Получить заявки в статусе pending.

**Headers:** `Authorization: Bearer {admin_token}`

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "status": "pending",
      ...
    }
  ]
}
```

---

### POST /applications/{id}/approve (Admin)
Одобрить заявку.

**Headers:** `Authorization: Bearer {admin_token}`

**Response 200:**
```json
{
  "success": true,
  "message": "Application approved successfully",
  "data": {
    "id": 1,
    "status": "approved",
    ...
  }
}
```

---

### POST /applications/{id}/reject (Admin)
Отклонить заявку.

**Headers:** `Authorization: Bearer {admin_token}`

**Body:**
```json
{
  "reason": "Insufficient documentation"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Application rejected successfully",
  "data": {
    "id": 1,
    "status": "rejected",
    "rejection_reason": "Insufficient documentation"
  }
}
```

---

## 💳 Payments

### POST /payments
Создать платёж.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "application_id": 1,
  "amount": 50000,
  "payment_type": "membership_fee"
}
```

**Payment Types:**
- `membership_fee`
- `subscription`
- `donation`
- `other`

**Response 201:**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "id": 1,
    "amount": 50000,
    "status": "pending",
    "payment_type": "membership_fee",
    "created_at": "2025-11-13T..."
  }
}
```

---

### GET /payments/my
Получить свои платежи.

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "amount": 50000,
      "status": "pending",
      "payment_type": "membership_fee",
      "application": {...}
    }
  ]
}
```

---

### GET /payments/{id}
Получить конкретный платёж.

**Headers:** `Authorization: Bearer {token}`

**Access:** Owner or Admin

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "amount": 50000,
    "status": "pending",
    "user": {...},
    "application": {...}
  }
}
```

---

### GET /payments (Admin)
Получить все платежи.

**Headers:** `Authorization: Bearer {admin_token}`

**Response 200:**
```json
{
  "data": [...],
  "links": {...},
  "meta": {...}
}
```

---

### POST /payments/{id}/confirm (Admin)
Подтвердить платёж.

**Headers:** `Authorization: Bearer {admin_token}`

**Response 200:**
```json
{
  "success": true,
  "message": "Payment confirmed successfully",
  "data": {
    "id": 1,
    "status": "completed"
  }
}
```

---

### POST /payments/{id}/fail (Admin)
Отклонить платёж.

**Headers:** `Authorization: Bearer {admin_token}`

**Body:**
```json
{
  "reason": "Invalid bank transfer"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Payment marked as failed",
  "data": {
    "id": 1,
    "status": "failed",
    "failure_reason": "Invalid bank transfer"
  }
}
```

---

### POST /payments/{id}/refund (Admin)
Вернуть средства.

**Headers:** `Authorization: Bearer {admin_token}`

**Body:**
```json
{
  "reason": "User requested refund"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Payment refunded successfully",
  "data": {
    "id": 1,
    "status": "refunded",
    "refund_reason": "User requested refund"
  }
}
```

---

### DELETE /payments/{id} (Admin)
Удалить платёж (только pending/failed).

**Headers:** `Authorization: Bearer {admin_token}`

**Response 200:**
```json
{
  "success": true,
  "message": "Payment deleted successfully"
}
```

---

## 🎓 Certifications

### GET /certification-programs
Получить все программы сертификации.

**Query Parameters:**
- `type` - basic/specialized
- `is_active` - true/false
- `search` - поиск по названию

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "КФА Базовая Сертификация",
      "code": "KFA-BASIC",
      "type": "basic",
      "exam_fee": 5000,
      "validity_months": 12
    }
  ]
}
```

---

### GET /my-certifications
Получить свои сертификаты.

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "certificate_number": "KFA-2025-001",
      "status": "passed",
      "issued_date": "2025-11-13",
      "expiry_date": "2026-11-13",
      "program": {...}
    }
  ]
}
```

---

### POST /certifications/apply
Подать заявку на сертификацию.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "certification_program_id": 1,
  "notes": "Optional notes"
}
```

**Response 200:**
```json
{
  "data": {
    "id": 1,
    "certificate_number": "KFA-2025-001",
    "status": "pending",
    "application_date": "2025-11-13"
  }
}
```

---

### POST /certifications/{id}/approve (Admin)
Одобрить заявку на сертификацию.

**Headers:** `Authorization: Bearer {admin_token}`

**Response 200:**
```json
{
  "data": {
    "id": 1,
    "status": "in_progress"
  }
}
```

---

### POST /certifications/{id}/issue (Admin)
Выдать сертификат после сдачи экзамена.

**Headers:** `Authorization: Bearer {admin_token}`

**Body:**
```json
{
  "exam_score": 85,
  "exam_date": "2025-11-13",
  "exam_results": {
    "section1": 90,
    "section2": 80
  }
}
```

**Response 200:**
```json
{
  "data": {
    "id": 1,
    "status": "passed",
    "exam_score": 85,
    "issued_date": "2025-11-13",
    "expiry_date": "2026-11-13"
  }
}
```

---

### GET /certifications/verify/{certificateNumber}
Проверить сертификат (public).

**Response 200:**
```json
{
  "valid": true,
  "certificate": {
    "number": "KFA-2025-001",
    "status": "passed",
    "holder": "John Doe",
    "program": "КФА Базовая Сертификация",
    "issued_date": "2025-11-13",
    "expiry_date": "2026-11-13",
    "is_expired": false
  }
}
```

---

## 🎫 Events

### GET /events
Получить все события.

**Query Parameters:**
- `type` - conference/workshop/webinar/networking/exam
- `status` - draft/published/cancelled/completed
- `upcoming` - true (только предстоящие)

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Annual Finance Conference",
      "type": "conference",
      "starts_at": "2025-12-01T10:00:00Z",
      "location": "Bishkek",
      "price": 5000,
      "member_price": 0
    }
  ]
}
```

---

### POST /events/{id}/register
Зарегистрироваться на событие.

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "answers": {
    "dietary_requirements": "Vegetarian",
    "special_needs": "None"
  }
}
```

**Response 201:**
```json
{
  "message": "Successfully registered for event",
  "registration": {
    "id": 1,
    "event_id": 1,
    "status": "approved",
    "amount_paid": 0,
    "registered_at": "2025-11-13T..."
  }
}
```

---

### GET /my-event-registrations
Получить свои регистрации на события.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `status` - pending/approved/cancelled
- `upcoming` - true

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "status": "approved",
      "event": {...},
      "registered_at": "2025-11-13T..."
    }
  ]
}
```

---

## 📰 News & Content

### GET /news
Получить все новости (public).

**Query Parameters:**
- `status` - draft/published/archived
- `search` - поиск по заголовку
- `category` - фильтр по категории

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Добро пожаловать в КФА",
      "slug": "dobro-pozhalovat-v-kfa",
      "excerpt": "...",
      "status": "published",
      "featured": true
    }
  ]
}
```

---

## 🔒 Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "message": "The given data was invalid",
  "errors": {
    "email": ["The email field is required"]
  }
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "An error occurred",
  "error": "Detailed error message (only in debug mode)"
}
```

---

## 📊 Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## 🔑 Authentication Flow

1. **Register or Login** → Get Token
2. **Store Token** in localStorage/sessionStorage
3. **Include Token** in all API requests:
   ```
   Authorization: Bearer {token}
   ```
4. **Handle 401** → Redirect to login

---

## 💡 Best Practices

### Pagination
Все list endpoints поддерживают пагинацию:
```
GET /api/news?page=2&per_page=20
```

### Error Handling
Всегда проверяйте `success` field:
```javascript
if (response.data.success) {
  // Success
} else {
  // Error
}
```

### Rate Limiting
- Auth endpoints: 5 requests/minute
- Other endpoints: 60 requests/minute

---

*API Reference v1.0.0 - Updated: 2025-11-13*
