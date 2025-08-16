package main

import (
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// 主函数，启动Echo服务器
func main() {
	// 创建Echo实例
	e := echo.New()

	// 中间件配置
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORS配置，允许前端访问
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	// 健康检查端点
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status":  "ok",
			"message": "Linera服务器运行正常",
		})
	})

	// API路由组
	api := e.Group("/api")

	// 动态数组管理路由
	setupArrayRoutes(api)

	// 链表管理路由
	setupLinkedListRoutes(api)

	// 静态文件服务（用于生产环境）
	// 检查是否存在前端构建文件
	if _, err := os.Stat("web/dist"); err == nil {
		// 服务静态文件
		e.Static("/", "web/dist")

		// SPA路由支持 - 所有非API路由都返回index.html
		e.GET("/*", func(c echo.Context) error {
			// 如果请求的是API路径，返回404
			if len(c.Request().URL.Path) > 4 && c.Request().URL.Path[:4] == "/api" {
				return echo.NewHTTPError(http.StatusNotFound, "API endpoint not found")
			}
			// 否则返回index.html让前端路由处理
			return c.File("web/dist/index.html")
		})
	}

	// 获取端口号
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// 启动服务器
	e.Logger.Fatal(e.Start(":" + port))
}
