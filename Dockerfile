# 多阶段构建 Dockerfile
# 阶段1: 构建前端
FROM node:18-alpine AS frontend-builder

# 设置工作目录
WORKDIR /app/web

# 安装 pnpm
RUN npm install -g pnpm

# 复制前端依赖文件
COPY web/package.json web/pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制前端源代码
COPY web/ ./

# 构建前端应用
RUN pnpm build

# 阶段2: 构建后端
FROM golang:1.21-alpine AS backend-builder

# 安装必要的工具
RUN apk add --no-cache git

# 设置工作目录
WORKDIR /app/server

# 复制 Go 模块文件
COPY server/go.mod server/go.sum ./

# 下载依赖
RUN go mod download

# 复制后端源代码
COPY server/ ./

# 构建后端应用
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# 阶段3: 最终运行镜像
FROM alpine:latest

# 安装必要的运行时依赖
RUN apk --no-cache add ca-certificates tzdata

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 创建非root用户
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# 设置工作目录
WORKDIR /app

# 从构建阶段复制后端可执行文件
COPY --from=backend-builder /app/server/main ./

# 从构建阶段复制前端构建产物
COPY --from=frontend-builder /app/web/dist ./web/dist

# 更改文件所有者
RUN chown -R appuser:appgroup /app

# 切换到非root用户
USER appuser

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# 启动应用
CMD ["./main"]
