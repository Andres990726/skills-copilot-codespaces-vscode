// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var comments = [];
var server = http.createServer(function(req, res) {
  var parsedUrl = url.parse(req.url);
  var path = parsedUrl.pathname;
  var query = qs.parse(parsedUrl.query);
  if (path === '/comments' && req.method === 'POST') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      var comment = qs.parse(body);
      comments.push(comment);
      res.writeHead(302, {'Location': '/comments'});
      res.end();
    });
  } else if (path === '/comments' && req.method === 'GET') {
    var body = JSON.stringify(comments);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
  } else {
    res.statusCode = 404;
    res.end();
  }
});
server.listen(3000);

// Test
// $ curl -X POST -d "name=John&comment=hello" http://localhost:3000/comments
// $ curl http://localhost:3000/comments
// [{"name":"John","comment":"hello"}]