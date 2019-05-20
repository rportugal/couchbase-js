# Overview
This project implements a pure JS client based on the undocumented Couchbase REST APIs that power the Web UI. As such, it only works if you already have credentials for the UI.

# Usage
```
const conn = new Couchbase('https://some.server:18091', 'myuser', 'mypass', { insecure: true });
const bucket = await conn.openBucket('somebucket');

const data = await bucket.get('my::document::id');
```
