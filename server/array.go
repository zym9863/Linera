package main

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// DynamicArray 动态数组结构体
type DynamicArray struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Elements []int  `json:"elements"`
	Capacity int    `json:"capacity"`
	Size     int    `json:"size"`
}

// ArrayRequest 数组操作请求结构体
type ArrayRequest struct {
	Name     string `json:"name"`
	Capacity int    `json:"capacity"`
}

// ElementRequest 元素操作请求结构体
type ElementRequest struct {
	Value int `json:"value"`
	Index int `json:"index"`
}

// ArrayResponse 数组操作响应结构体
type ArrayResponse struct {
	Success bool         `json:"success"`
	Message string       `json:"message"`
	Array   *DynamicArray `json:"array,omitempty"`
	Data    interface{}  `json:"data,omitempty"`
}

// 全局数组存储（实际项目中应使用数据库）
var arrays = make(map[string]*DynamicArray)
var arrayCounter = 0

// 生成数组ID
func generateArrayID() string {
	arrayCounter++
	return fmt.Sprintf("array_%d", arrayCounter)
}

// 设置动态数组相关路由
func setupArrayRoutes(g *echo.Group) {
	arrayGroup := g.Group("/arrays")

	// 创建数组
	arrayGroup.POST("", createArray)
	
	// 获取所有数组
	arrayGroup.GET("", getAllArrays)
	
	// 获取指定数组
	arrayGroup.GET("/:id", getArray)
	
	// 删除数组
	arrayGroup.DELETE("/:id", deleteArray)
	
	// 在指定位置插入元素
	arrayGroup.POST("/:id/insert", insertElement)
	
	// 在末尾追加元素
	arrayGroup.POST("/:id/append", appendElement)
	
	// 按索引删除元素
	arrayGroup.DELETE("/:id/index/:index", deleteByIndex)
	
	// 按值删除元素
	arrayGroup.DELETE("/:id/value/:value", deleteByValue)
	
	// 查找元素
	arrayGroup.GET("/:id/find/:value", findElement)
	
	// 修改元素
	arrayGroup.PUT("/:id/index/:index", updateElement)
}

// 创建动态数组
func createArray(c echo.Context) error {
	var req ArrayRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, ArrayResponse{
			Success: false,
			Message: "请求参数格式错误",
		})
	}

	if req.Capacity <= 0 {
		req.Capacity = 10 // 默认容量
	}

	id := generateArrayID()
	array := &DynamicArray{
		ID:       id,
		Name:     req.Name,
		Elements: make([]int, 0, req.Capacity),
		Capacity: req.Capacity,
		Size:     0,
	}

	arrays[id] = array

	return c.JSON(http.StatusCreated, ArrayResponse{
		Success: true,
		Message: "数组创建成功",
		Array:   array,
	})
}

// 获取所有数组
func getAllArrays(c echo.Context) error {
	arrayList := make([]*DynamicArray, 0, len(arrays))
	for _, array := range arrays {
		arrayList = append(arrayList, array)
	}

	return c.JSON(http.StatusOK, ArrayResponse{
		Success: true,
		Message: "获取数组列表成功",
		Data:    arrayList,
	})
}

// 获取指定数组
func getArray(c echo.Context) error {
	id := c.Param("id")
	array, exists := arrays[id]
	if !exists {
		return c.JSON(http.StatusNotFound, ArrayResponse{
			Success: false,
			Message: "数组不存在",
		})
	}

	return c.JSON(http.StatusOK, ArrayResponse{
		Success: true,
		Message: "获取数组成功",
		Array:   array,
	})
}

// 删除数组
func deleteArray(c echo.Context) error {
	id := c.Param("id")
	_, exists := arrays[id]
	if !exists {
		return c.JSON(http.StatusNotFound, ArrayResponse{
			Success: false,
			Message: "数组不存在",
		})
	}

	delete(arrays, id)

	return c.JSON(http.StatusOK, ArrayResponse{
		Success: true,
		Message: "数组删除成功",
	})
}

// 在指定位置插入元素
func insertElement(c echo.Context) error {
	id := c.Param("id")
	array, exists := arrays[id]
	if !exists {
		return c.JSON(http.StatusNotFound, ArrayResponse{
			Success: false,
			Message: "数组不存在",
		})
	}

	var req ElementRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, ArrayResponse{
			Success: false,
			Message: "请求参数格式错误",
		})
	}

	if req.Index < 0 || req.Index > array.Size {
		return c.JSON(http.StatusBadRequest, ArrayResponse{
			Success: false,
			Message: "插入位置无效",
		})
	}

	if array.Size >= array.Capacity {
		return c.JSON(http.StatusBadRequest, ArrayResponse{
			Success: false,
			Message: "数组已满，无法插入",
		})
	}

	// 在指定位置插入元素
	array.Elements = append(array.Elements, 0)
	copy(array.Elements[req.Index+1:], array.Elements[req.Index:])
	array.Elements[req.Index] = req.Value
	array.Size++

	return c.JSON(http.StatusOK, ArrayResponse{
		Success: true,
		Message: "元素插入成功",
		Array:   array,
	})
}

// 在末尾追加元素
func appendElement(c echo.Context) error {
	id := c.Param("id")
	array, exists := arrays[id]
	if !exists {
		return c.JSON(http.StatusNotFound, ArrayResponse{
			Success: false,
			Message: "数组不存在",
		})
	}

	var req ElementRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, ArrayResponse{
			Success: false,
			Message: "请求参数格式错误",
		})
	}

	if array.Size >= array.Capacity {
		return c.JSON(http.StatusBadRequest, ArrayResponse{
			Success: false,
			Message: "数组已满，无法追加",
		})
	}

	array.Elements = append(array.Elements, req.Value)
	array.Size++

	return c.JSON(http.StatusOK, ArrayResponse{
		Success: true,
		Message: "元素追加成功",
		Array:   array,
	})
}

// 按索引删除元素
func deleteByIndex(c echo.Context) error {
	id := c.Param("id")
	array, exists := arrays[id]
	if !exists {
		return c.JSON(http.StatusNotFound, ArrayResponse{
			Success: false,
			Message: "数组不存在",
		})
	}

	indexStr := c.Param("index")
	index, err := strconv.Atoi(indexStr)
	if err != nil || index < 0 || index >= array.Size {
		return c.JSON(http.StatusBadRequest, ArrayResponse{
			Success: false,
			Message: "索引无效",
		})
	}

	// 删除指定索引的元素
	deletedValue := array.Elements[index]
	copy(array.Elements[index:], array.Elements[index+1:])
	array.Elements = array.Elements[:array.Size-1]
	array.Size--

	return c.JSON(http.StatusOK, ArrayResponse{
		Success: true,
		Message: fmt.Sprintf("成功删除索引%d处的元素%d", index, deletedValue),
		Array:   array,
		Data:    deletedValue,
	})
}

// 按值删除元素
func deleteByValue(c echo.Context) error {
	id := c.Param("id")
	array, exists := arrays[id]
	if !exists {
		return c.JSON(http.StatusNotFound, ArrayResponse{
			Success: false,
			Message: "数组不存在",
		})
	}

	valueStr := c.Param("value")
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, ArrayResponse{
			Success: false,
			Message: "值格式错误",
		})
	}

	// 查找并删除第一个匹配的元素
	for i, element := range array.Elements {
		if element == value {
			copy(array.Elements[i:], array.Elements[i+1:])
			array.Elements = array.Elements[:array.Size-1]
			array.Size--

			return c.JSON(http.StatusOK, ArrayResponse{
				Success: true,
				Message: fmt.Sprintf("成功删除值为%d的元素", value),
				Array:   array,
				Data:    i,
			})
		}
	}

	return c.JSON(http.StatusNotFound, ArrayResponse{
		Success: false,
		Message: fmt.Sprintf("未找到值为%d的元素", value),
	})
}

// 查找元素
func findElement(c echo.Context) error {
	id := c.Param("id")
	array, exists := arrays[id]
	if !exists {
		return c.JSON(http.StatusNotFound, ArrayResponse{
			Success: false,
			Message: "数组不存在",
		})
	}

	valueStr := c.Param("value")
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, ArrayResponse{
			Success: false,
			Message: "值格式错误",
		})
	}

	// 查找元素
	for i, element := range array.Elements {
		if element == value {
			return c.JSON(http.StatusOK, ArrayResponse{
				Success: true,
				Message: fmt.Sprintf("找到值为%d的元素，位于索引%d", value, i),
				Array:   array,
				Data:    i,
			})
		}
	}

	return c.JSON(http.StatusNotFound, ArrayResponse{
		Success: false,
		Message: fmt.Sprintf("未找到值为%d的元素", value),
	})
}

// 修改元素
func updateElement(c echo.Context) error {
	id := c.Param("id")
	array, exists := arrays[id]
	if !exists {
		return c.JSON(http.StatusNotFound, ArrayResponse{
			Success: false,
			Message: "数组不存在",
		})
	}

	indexStr := c.Param("index")
	index, err := strconv.Atoi(indexStr)
	if err != nil || index < 0 || index >= array.Size {
		return c.JSON(http.StatusBadRequest, ArrayResponse{
			Success: false,
			Message: "索引无效",
		})
	}

	var req ElementRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, ArrayResponse{
			Success: false,
			Message: "请求参数格式错误",
		})
	}

	oldValue := array.Elements[index]
	array.Elements[index] = req.Value

	return c.JSON(http.StatusOK, ArrayResponse{
		Success: true,
		Message: fmt.Sprintf("成功将索引%d处的元素从%d修改为%d", index, oldValue, req.Value),
		Array:   array,
		Data:    oldValue,
	})
}
