# Linera - Data Structure Visualization Demo

[中文版本 / README.md](README.md)

An interactive platform for learning and demonstrating data structures, built with React and the Echo framework (Go). It supports dynamic arrays and linked lists with visualized operations.

## 🌟 Features

### 🔢 Dynamic Array Management
- ✅ Create and delete dynamic arrays
- ✅ Insert an element at a specified index
- ✅ Append an element to the end
- ✅ Delete an element by index
- ✅ Delete an element by value
- ✅ Find the position of an element
- ✅ Update an element at a specified index
- ✅ Real-time visualization of array state

### 🔗 Linked List Module
- ✅ Supports singly linked list, doubly linked list, and circular linked list
- ✅ Insert at head, append at tail, insert at a specific position
- ✅ Delete by index, delete by value
- ✅ Find and update nodes
- ✅ Graphical display of node connections
- ✅ Dynamic animation of operations

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Go + Echo Framework
- **Package Manager**: pnpm
- **Containerization**: Docker + Docker Compose
- **Styling**: Plain CSS (responsive)

## 🚀 Quick Start

### Option 1: Local development

#### Prerequisites
- Node.js 18+
- Go 1.21+
- pnpm

#### Install and run

1. Clone the repository
```bash
git clone https://github.com/zym9863/Linera.git
cd Linera
```

2. Install frontend dependencies
```bash
cd web
pnpm install
```

3. Start frontend dev server
```bash
pnpm dev
# Frontend runs at http://localhost:5173
```

4. Start backend server
```bash
cd ../server
go mod tidy
go run .
# Backend runs at http://localhost:8080
```

### Option 2: Build scripts

#### Linux/macOS
```bash
chmod +x build.sh
./build.sh
./linera
```

#### Windows
```cmd
build.bat
linera.exe
```

### Option 3: Docker

#### Production deployment
```bash
# Build image
docker build -t linera .

# Run container
docker run -p 8080:8080 linera

# Or use docker-compose
docker-compose up
```

## 📁 Project Structure

```
Linera/
├── web/                    # Frontend project
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Backend project
│   ├── main.go             # Entry point
│   ├── array.go            # Dynamic array API
│   ├── linkedlist.go       # Linked list API
│   ├── go.mod
│   └── go.sum
├── Dockerfile
├── docker-compose.yml
├── build.sh
├── build.bat
└── README.md
```

## 🔌 API Endpoints

### Dynamic Array API

| Method | Path | Description |
|------|------|------|
| POST | `/api/arrays` | Create an array |
| GET | `/api/arrays` | Get all arrays |
| GET | `/api/arrays/:id` | Get a specific array |
| DELETE | `/api/arrays/:id` | Delete an array |
| POST | `/api/arrays/:id/insert` | Insert element at index |
| POST | `/api/arrays/:id/append` | Append element |
| DELETE | `/api/arrays/:id/index/:index` | Delete by index |
| DELETE | `/api/arrays/:id/value/:value` | Delete by value |
| GET | `/api/arrays/:id/find/:value` | Find element |
| PUT | `/api/arrays/:id/index/:index` | Update element |

### Linked List API

| Method | Path | Description |
|------|------|------|
| POST | `/api/lists` | Create a list |
| GET | `/api/lists` | Get all lists |
| GET | `/api/lists/:id` | Get a specific list |
| DELETE | `/api/lists/:id` | Delete a list |
| POST | `/api/lists/:id/insert` | Insert node at position |
| POST | `/api/lists/:id/prepend` | Insert node at head |
| POST | `/api/lists/:id/append` | Append node at tail |
| DELETE | `/api/lists/:id/index/:index` | Delete by index |
| DELETE | `/api/lists/:id/value/:value` | Delete by value |
| GET | `/api/lists/:id/find/:value` | Find node |
| PUT | `/api/lists/:id/index/:index` | Update node |

## 🎯 Usage

### Dynamic array operations
1. Create a new dynamic array from the left panel
2. Select an array from the list to operate on
3. Observe the array state in the visualization area
4. Use the control panel to perform operations
5. Watch real-time updates

### Linked list operations
1. Create a new linked list (singly/doubly/circular)
2. Select a list to operate on
3. View node connections in the visualization area
4. Perform insert, delete, find, and update operations
5. Observe animated changes

## 🔧 Development Guide

### Add new features
1. Backend: add new Go files under `server/`
2. Frontend: add new React components under `web/src/`
3. Update routing and styles

### Code style
- Backend: follow Go conventions and add function-level comments
- Frontend: use TypeScript and React best practices
- Styles: use semantic CSS class names

## 🐛 Troubleshooting

### Common issues

1. Frontend cannot connect to backend
   - Ensure backend runs on port 8080
   - Check CORS settings

2. Docker build failed
   - Check Docker version
   - Ensure sufficient disk space

3. Dependency install failed
   - Clear node_modules and reinstall
   - Check network connectivity

## 📄 License

MIT License

## 🤝 Contributing

Pull requests and issues are welcome.

## 📞 Contact

If you have questions, please open an issue on GitHub.
