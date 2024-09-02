const dns = require('native-dns');
const sqlite3 = require('better-sqlite3');
const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');
const db = new sqlite3('dns_records.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS dns_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hostname TEXT,
    type TEXT,
    data TEXT,
    UNIQUE(hostname, type)
  )
`).run();


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/savedomain', (req, res) => {
  const { domain, type, data } = req.body;
  addDnsRecord(domain, type, data);
  res.json({ domain, type, data });
});


app.get('/getdomains', (req, res) => {
  const records = db.prepare('SELECT * FROM dns_records').all();
  res.json(records);
});

function addDnsRecord(hostname, type, data) {
  const existingRecord = db.prepare('SELECT * FROM dns_records WHERE hostname = ? AND type = ?').get(hostname, type);

  if (existingRecord) {
    const stmt = db.prepare('UPDATE dns_records SET data = ? WHERE hostname = ? AND type = ?');
    stmt.run(data, hostname, type);
    console.log(`Updated ${type} record for ${hostname} with data ${data}`);
  } else {
    const stmt = db.prepare('INSERT INTO dns_records (hostname, type, data) VALUES (?, ?, ?)');
    stmt.run(hostname, type, data);
    console.log(`Inserted new ${type} record for ${hostname} with data ${data}`);
  }
}

function getRecordFromDB(hostname, type) {
  const stmt = db.prepare('SELECT data FROM dns_records WHERE hostname = ? AND type = ?');
  const result = stmt.get(hostname, type);
  return result ? result.data : null;
}

function typeToString(type) {
  const typeMapping = {
    1: 'A',
    2: 'NS',
    5: 'CNAME',
    12: 'PTR',
    15: 'MX',
    16: 'TXT',
    28: 'AAAA',
  };
  return typeMapping[type] || null;
}

const server = dns.createServer();

server.on('request', (request, response) => {
  const question = request.question[0];
  const hostname = question.name;
  const typeNumber = question.type;

  console.log(`Received query for: ${hostname} of type ${typeNumber}`);

  const type = typeToString(typeNumber);

  if (type) {
    const data = getRecordFromDB(hostname, type);

    if (data) {
      console.log(`Found ${type} record in DB: ${data}`);

      switch (type) {
        case 'A':
          response.answer.push(dns.A({
            name: hostname,
            address: data,
            ttl: 300
          }));
          break;
        case 'AAAA':
          response.answer.push(dns.AAAA({
            name: hostname,
            address: data,
            ttl: 300
          }));
          break;
        case 'CNAME':
          response.answer.push(dns.CNAME({
            name: hostname,
            data,
            ttl: 300
          }));
          break;
        case 'MX':
          const [preference, exchange] = data.split(' ');
          response.answer.push(dns.MX({
            name: hostname,
            exchange: exchange,
            priority: parseInt(preference, 10),
            ttl: 300
          }));
          break;
        case 'PTR':
          response.answer.push(dns.PTR({
            name: hostname,
            ptrdname: data,
            ttl: 300
          }));
          break;
        case 'TXT':
          response.answer.push(dns.TXT({
            name: hostname,
            data: [data],
            ttl: 300
          }));
          break;

        default:
          console.log(`Unsupported record type: ${type}`);
      }
    } else {
      console.log(`No record found for ${hostname}`);
    }
  } else {
    console.log(`Unsupported record type number: ${typeNumber}`);
  }

  response.send();
});

server.on('error', (err) => {
  console.error('DNS server error:', err);
});

process.on('SIGINT', () => {
  console.log('Stopping DNS server...');
  server.close(() => {
    console.log('DNS server stopped.');
    process.exit(0);
  });
});

server.serve(53, '0.0.0.0');

app.listen(3000, () => {
  console.log('API server listening on port 3000');
});
