# Prime Prompt: WebSocket Integration

Implement real-time communication using WebSockets with proper connection management and error handling.

## Usage

```bash
kfa prime use development/websocket-integration "Add real-time notifications"
```

## Prompt Template

I need you to implement WebSocket functionality:

**Context:** {CONTEXT}

Please implement the following:

### 1. Server-Side Setup

**WebSocket Server:**

- Set up WebSocket server (Socket.io, ws, or native)
- Implement connection handling
- Add authentication/authorization
- Implement room/namespace management if needed

**Event Handlers:**

- Create event listeners for client messages
- Implement broadcast functionality
- Handle disconnections gracefully
- Add reconnection logic

### 2. Client-Side Setup

**WebSocket Client:**

- Create WebSocket client wrapper/service
- Implement connection management
- Add automatic reconnection with exponential backoff
- Handle connection state (connecting, connected, disconnected)

**Event Handling:**

- Subscribe to server events
- Emit events to server
- Handle connection errors
- Implement message queuing for offline mode

### 3. Message Protocol

**Message Format:**

- Define consistent message structure
- Include message types/events
- Add timestamps
- Include sender/recipient information

**Data Validation:**

- Validate incoming messages
- Sanitize user input
- Handle malformed messages
- Implement rate limiting

### 4. State Management

**Connection State:**

- Track connection status
- Store pending messages
- Implement message acknowledgment
- Handle duplicate messages

**UI Updates:**

- Update UI based on connection state
- Show connection indicators
- Display real-time data updates
- Handle optimistic updates

### 5. Error Handling

**Connection Errors:**

- Handle network failures
- Implement retry logic
- Show user-friendly error messages
- Log errors for debugging

**Message Errors:**

- Handle invalid messages
- Implement timeout for responses
- Queue failed messages for retry
- Notify user of delivery failures

### 6. Security

**Authentication:**

- Implement WebSocket authentication
- Validate session tokens
- Handle expired tokens
- Implement heartbeat/ping-pong

**Authorization:**

- Check user permissions for events
- Validate room/channel access
- Prevent unauthorized data access
- Implement rate limiting

### 7. Performance

**Optimization:**

- Implement message batching if applicable
- Use binary protocol if needed
- Compress large messages
- Limit message size

**Scaling:**

- Consider horizontal scaling (Redis adapter)
- Implement load balancing strategy
- Handle server restarts gracefully
- Document scaling approach

### 8. Testing

**Tests:**

- Unit tests for message handling
- Integration tests for full flow
- Test connection scenarios
- Test error scenarios
- Performance/stress tests

## Context Files

Review these files:

- Existing WebSocket setup (if any)
- Authentication system
- API structure
- State management patterns

## Expected Output

Provide:

1. Server-side WebSocket setup
2. Client-side WebSocket service/hook
3. Message type definitions
4. Connection state management
5. Error handling implementation
6. Tests for WebSocket functionality
7. Documentation for events and usage

## Success Criteria

- ✅ WebSocket connection established successfully
- ✅ Messages sent/received in real-time
- ✅ Automatic reconnection works
- ✅ Authentication/authorization implemented
- ✅ Error handling is comprehensive
- ✅ Connection state tracked properly
- ✅ Tests cover main scenarios
- ✅ Documentation is clear and complete
