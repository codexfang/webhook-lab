# Webhook Lab

A real-time webhook inspection and debugging platform that allows developers to create temporary webhook endpoints, receive HTTP requests, and visualize incoming payloads instantly in a modern dashboard.

## Architecture

```
                          ┌──────────────────────┐
                          │   External Services   │
                          │  (send webhook POST)  │
                          └──────────┬───────────┘
                                     │ HTTP
                                     ▼
                          ┌──────────────────────┐
                          │   Express Server     │
                          │   /webhook/:id       │
                          └──────┬───────────────┘
                                 │ capture headers/body/query
                                 ▼
                          ┌──────────────────────┐
                          │   Request Store      │
                          │   (in-memory)        │
                          └──────┬───────────────┘
                                 │ broadcast via WebSocket
                                 ▼
                          ┌──────────────────────┐
                          │   WebSocket Server   │
                          │   /ws?sessionId=xxx  │
                          └──────┬───────────────┘
                                 │ real-time stream
                                 ▼
                          ┌──────────────────────┐
                          │   React Dashboard    │
                          │   (static/GitHub      │
                          │    Pages)            │
                          └──────────────────────┘
```

## Features

- **Webhook Generator**: Creates unique webhook endpoints at `/webhook/:id` with copyable URLs
- **Live Request Viewer**: Real-time display of method, headers, body, query params, and timing
- **WebSocket Live Feed**: Instant push of incoming requests to all connected clients
- **Request History**: Stores last 100 requests per session with IndexedDB persistence
- **JSON Viewer**: Collapsible tree viewer with syntax highlighting for request payloads
- **Copy & Debug Tools**: Copy URL, copy payload, export individual requests as JSON
- **Filter by Method**: Filter the request list by HTTP method

## Tech Stack

- **Runtime**: Node.js
- **Backend Framework**: Express
- **WebSockets**: ws (WebSocketServer)
- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Storage**: IndexedDB / localStorage
- **Deployment**: Render (backend), GitHub Pages (frontend)

## License

MIT
