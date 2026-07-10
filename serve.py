#!/usr/bin/env python3
"""Static server with caching disabled, so the browser always gets fresh files."""
import http.server, socketserver

PORT = 4599

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

with socketserver.TCPServer(("127.0.0.1", PORT), NoCacheHandler) as httpd:
    print(f"Serving with no-cache on http://localhost:{PORT}")
    httpd.serve_forever()
