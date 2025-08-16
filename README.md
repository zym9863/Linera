# Linera - 数据结构可视化演示系统

[English version / README-EN.md](README-EN.md)

一个基于 React + Echo 的交互式数据结构学习和演示平台，支持动态数组和链表的可视化操作。

## 🌟 功能特性

### 🔢 动态数组管理模块
- ✅ 创建和销毁动态数组
- ✅ 在指定位置插入元素
- ✅ 在末尾追加元素
- ✅ 按索引删除元素
- ✅ 按值删除元素
- ✅ 查找元素位置
- ✅ 修改指定位置的元素
- ✅ 实时可视化数组状态

### 🔗 链表演示模块
- ✅ 支持单链表、双向链表、循环链表
- ✅ 头部插入、尾部追加、指定位置插入
- ✅ 按索引删除、按值删除节点
- ✅ 查找和修改节点
- ✅ 图形化显示节点连接关系
- ✅ 动态展示操作过程

## 🛠️ 技术栈

- **前端**: React 19 + TypeScript + Vite
- **后端**: Go + Echo Framework
- **包管理**: pnpm
- **容器化**: Docker + Docker Compose
- **样式**: 原生 CSS（响应式设计）

## 🚀 快速开始

### 方式一：本地开发

#### 前置要求
- Node.js 18+
- Go 1.21+
- pnpm

#### 安装和运行

1. **克隆项目**
```bash
git clone https://github.com/zym9863/Linera.git
cd Linera
```

2. **安装前端依赖**
```bash
cd web
pnpm install
```

3. **启动前端开发服务器**
```bash
pnpm dev
# 前端将在 http://localhost:5173 运行
```

4. **启动后端服务器**
```bash
cd ../server
go mod tidy
go run .
# 后端将在 http://localhost:8080 运行
```

### 方式二：使用构建脚本

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

### 方式三：Docker 部署

#### 生产环境部署
```bash
# 构建镜像
docker build -t linera .

# 运行容器
docker run -p 8080:8080 linera

# 或使用 docker-compose
docker-compose up
```

## 📁 项目结构

```
Linera/
├── web/                    # 前端项目
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── pages/         # 页面组件
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
├── server/                 # 后端项目
│   ├── main.go            # 主程序入口
│   ├── array.go           # 动态数组 API
│   ├── linkedlist.go      # 链表 API
│   ├── go.mod
│   └── go.sum
├── Dockerfile             # Docker 配置
├── docker-compose.yml     # Docker Compose 配置
├── build.sh              # Linux/macOS 构建脚本
├── build.bat             # Windows 构建脚本
└── README.md
```

## 🔌 API 接口

### 动态数组 API

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/arrays` | 创建数组 |
| GET | `/api/arrays` | 获取所有数组 |
| GET | `/api/arrays/:id` | 获取指定数组 |
| DELETE | `/api/arrays/:id` | 删除数组 |
| POST | `/api/arrays/:id/insert` | 在指定位置插入元素 |
| POST | `/api/arrays/:id/append` | 在末尾追加元素 |
| DELETE | `/api/arrays/:id/index/:index` | 按索引删除元素 |
| DELETE | `/api/arrays/:id/value/:value` | 按值删除元素 |
| GET | `/api/arrays/:id/find/:value` | 查找元素 |
| PUT | `/api/arrays/:id/index/:index` | 修改元素 |

### 链表 API

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/lists` | 创建链表 |
| GET | `/api/lists` | 获取所有链表 |
| GET | `/api/lists/:id` | 获取指定链表 |
| DELETE | `/api/lists/:id` | 删除链表 |
| POST | `/api/lists/:id/insert` | 在指定位置插入节点 |
| POST | `/api/lists/:id/prepend` | 在头部插入节点 |
| POST | `/api/lists/:id/append` | 在尾部追加节点 |
| DELETE | `/api/lists/:id/index/:index` | 按索引删除节点 |
| DELETE | `/api/lists/:id/value/:value` | 按值删除节点 |
| GET | `/api/lists/:id/find/:value` | 查找节点 |
| PUT | `/api/lists/:id/index/:index` | 修改节点 |

## 🎯 使用说明

### 动态数组操作
1. 在左侧面板创建新的动态数组
2. 从数组列表中选择要操作的数组
3. 在右侧可视化区域查看数组状态
4. 使用操作控制面板执行各种操作
5. 观察数组的实时变化

### 链表操作
1. 创建新链表（支持单链表、双向链表、循环链表）
2. 选择要操作的链表
3. 在可视化区域查看节点连接关系
4. 执行插入、删除、查找、修改操作
5. 观察链表结构的动态变化

## 🔧 开发指南

### 添加新功能
1. 后端：在 `server/` 目录下添加新的 Go 文件
2. 前端：在 `web/src/` 目录下添加新的 React 组件
3. 更新路由配置
4. 添加相应的样式文件

### 代码规范
- 后端：遵循 Go 语言规范，添加函数级注释
- 前端：使用 TypeScript，遵循 React 最佳实践
- 样式：使用语义化的 CSS 类名

## 🐛 故障排除

### 常见问题

1. **前端无法连接后端**
   - 检查后端服务是否在 8080 端口运行
   - 确认 CORS 配置正确

2. **Docker 构建失败**
   - 检查 Docker 版本
   - 确保有足够的磁盘空间

3. **依赖安装失败**
   - 清除 node_modules 和重新安装
   - 检查网络连接

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题，请通过 GitHub Issues 联系。
