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

	// CORS配置，允许前端访问（部署到 Render 时允许任意来源，同源访问时无需 CORS）
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowCredentials: true,
		ExposeHeaders:    []string{"Content-Length"},
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
		// 仅将 /assets 静态资源目录挂载到构建产物，避免与通配符路由冲突
		e.Static("/assets", "web/dist/assets")

		// 根路径直接返回 index.html
		e.GET("/", func(c echo.Context) error {
			return c.File("web/dist/index.html")
		})

		// SPA 路由回退：非 /api 与非静态资源路径统一回到 index.html，由前端路由接管
		e.GET("/*", func(c echo.Context) error {
			p := c.Request().URL.Path
			if len(p) >= 4 && p[:4] == "/api" {
				return echo.NewHTTPError(http.StatusNotFound, "API endpoint not found")
			}
			if len(p) >= 7 && p[:7] == "/assets" {
				return echo.NewHTTPError(http.StatusNotFound, "Asset not found")
			}
			if p == "/health" {
				return echo.NewHTTPError(http.StatusNotFound, "Not found")
			}
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
