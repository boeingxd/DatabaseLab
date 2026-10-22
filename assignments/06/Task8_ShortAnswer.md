# Task 8 — Short Answer

A connection pool keeps a set of already-open MySQL connections and reuses
them across requests, so the server avoids paying the cost of opening a new
connection for every query and can serve several requests at once while
capping the total number of connections (connectionLimit) the database has
to handle. Putting controllers in their own files separates "what URL maps to
what" (the router) from "what actually happens" (the query and validation
logic), which keeps each file small and focused and makes the logic easier to
find, test and change without touching the routing or app.js.
