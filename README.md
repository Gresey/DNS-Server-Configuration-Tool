
# DNS Server Configuration Tool





## Overview

This project sets up a DNS server that allows you to manage DNS records through a web interface. The server supports various DNS record types, including A, CNAME, MX, PTR, TXT, and AAAA. The web interface provides functionalities to add new DNS records, retrieve all stored records, and display them.

https://github.com/user-attachments/assets/690227a9-b524-4b85-bf16-f674567c9c3c


## Features

- **DNS Record Management**: Add and view DNS records.
- **Web Interface**: User-friendly React-based UI to interact with the DNS server.
- **Support for Various Record Types**: Includes A, CNAME, MX, PTR, TXT, and AAAA record types.

## Technologies Used

- **Node.js**: Backend server for handling DNS queries and API requests.
- **native-dns**: Node.js library for DNS server implementation.
- **React**: Frontend framework for building the web interface.
- **SQLite**: Database for storing DNS records.


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (or [yarn](https://yarnpkg.com/))

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/dns-server.git
   cd dns-server
   ```

2. **Install Dependencies**

   Navigate to both the backend and frontend directories to install the required dependencies.

   ```bash
   
   
   npm install

  

3. **Set Up the Database**

   The project uses SQLite for storing DNS records. The database will be automatically created when you start the backend server.

4. **Run the Application**

   In separate terminal windows, start the backend server and the frontend development server:

   ```bash
   # For backend
   
   node server.js

   # For frontend
   
   npm start
   ```

   The backend server will run on port `53` and the frontend will run on port `3000`.

### API Endpoints

- **POST /savedomain**: Adds or updates a DNS record.
  - Request Body: `{ "domain": "example.com", "type": "A", "data": "192.168.1.1" }`
  - Response: `{ "domain": "example.com", "type": "A", "data": "192.168.1.1" }`

- **GET /getdomains**: Retrieves all stored DNS records.
  - Response: An array of DNS records, e.g., `[ { "hostname": "example.com", "type": "A", "data": "192.168.1.1" }, ... ]`

### Usage

1. **Open the Web Interface**: Navigate to `http://localhost:3000` in your browser.
2. **Add DNS Records**: Fill out the form with domain name, type, and data, then click "Save".
3. **Retrieve All Records**: Click "Retrieve All" to view all stored DNS records.

### Troubleshooting

- **DNS Queries Not Working**: Ensure the DNS server is running on port `53` and there are no firewall issues blocking the port.
- **API Issues**: Verify that the backend server is running and the API endpoints are correctly configured.



