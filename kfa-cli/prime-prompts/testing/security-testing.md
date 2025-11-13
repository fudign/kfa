# Prime Prompt: Security Testing

Add security tests to prevent common vulnerabilities.

## Usage

```bash
kfa prime use testing/security-testing "Test authentication security"
```

## Prompt Template

I need security tests for:

**Context:** {CONTEXT}

### Test Cases

- SQL injection attempts
- XSS attack vectors
- CSRF token validation
- Authentication bypass attempts
- Authorization checks
- Input validation
- Rate limiting
- Session management

### OWASP Top 10

- Injection
- Broken authentication
- Sensitive data exposure
- XML external entities
- Broken access control
- Security misconfiguration
- XSS
- Insecure deserialization
- Using components with known vulnerabilities
- Insufficient logging & monitoring

## Success Criteria

- ✅ Common attacks prevented
- ✅ Vulnerabilities fixed
- ✅ Security tests in CI/CD
