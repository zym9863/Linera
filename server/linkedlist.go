package main

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// Node 链表节点结构体
type Node struct {
	Value int   `json:"value"`
	Next  *Node `json:"next,omitempty"`
	Prev  *Node `json:"prev,omitempty"`
}

// NodeData 用于前端显示的节点数据
type NodeData struct {
	Value  int    `json:"value"`
	NextID string `json:"nextId,omitempty"`
	PrevID string `json:"prevId,omitempty"`
	ID     string `json:"id"`
}

// LinkedList 链表结构体
type LinkedList struct {
	ID    string      `json:"id"`
	Name  string      `json:"name"`
	Type  string      `json:"type"` // "single", "double", "circular"
	Head  *Node       `json:"-"`
	Tail  *Node       `json:"-"`
	Size  int         `json:"size"`
	Nodes []*NodeData `json:"nodes"`
}

// LinkedListRequest 链表操作请求结构体
type LinkedListRequest struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

// NodeRequest 节点操作请求结构体
type NodeRequest struct {
	Value int `json:"value"`
	Index int `json:"index"`
}

// LinkedListResponse 链表操作响应结构体
type LinkedListResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	List    *LinkedList `json:"list,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

// 全局链表存储
var linkedLists = make(map[string]*LinkedList)
var listCounter = 0

// 生成链表ID
func generateListID() string {
	listCounter++
	return fmt.Sprintf("list_%d", listCounter)
}

// 生成节点ID
func generateNodeID(listID string, index int) string {
	return fmt.Sprintf("%s_node_%d", listID, index)
}

// 设置链表相关路由
func setupLinkedListRoutes(g *echo.Group) {
	listGroup := g.Group("/lists")

	// 创建链表
	listGroup.POST("", createLinkedList)

	// 获取所有链表
	listGroup.GET("", getAllLinkedLists)

	// 获取指定链表
	listGroup.GET("/:id", getLinkedList)

	// 删除链表
	listGroup.DELETE("/:id", deleteLinkedList)

	// 在指定位置插入节点
	listGroup.POST("/:id/insert", insertNode)

	// 在头部插入节点
	listGroup.POST("/:id/prepend", prependNode)

	// 在尾部追加节点
	listGroup.POST("/:id/append", appendNode)

	// 按索引删除节点
	listGroup.DELETE("/:id/index/:index", deleteNodeByIndex)

	// 按值删除节点
	listGroup.DELETE("/:id/value/:value", deleteNodeByValue)

	// 查找节点
	listGroup.GET("/:id/find/:value", findNode)

	// 修改节点
	listGroup.PUT("/:id/index/:index", updateNode)
}

// 更新链表的可视化数据
func (list *LinkedList) updateVisualizationData() {
	list.Nodes = make([]*NodeData, 0, list.Size)

	if list.Head == nil {
		return
	}

	current := list.Head
	index := 0

	for current != nil {
		nodeData := &NodeData{
			Value: current.Value,
			ID:    generateNodeID(list.ID, index),
		}

		// 设置下一个节点的ID
		if current.Next != nil {
			nodeData.NextID = generateNodeID(list.ID, index+1)
		}

		// 设置前一个节点的ID（双向链表）
		if list.Type == "double" && current.Prev != nil {
			if index > 0 {
				nodeData.PrevID = generateNodeID(list.ID, index-1)
			}
		}

		list.Nodes = append(list.Nodes, nodeData)

		// 防止循环链表无限循环
		if list.Type == "circular" && current.Next == list.Head && index > 0 {
			// 设置循环连接
			nodeData.NextID = generateNodeID(list.ID, 0)
			break
		}

		current = current.Next
		index++

		// 防止无限循环
		if index > 1000 {
			break
		}
	}
}

// 创建链表
func createLinkedList(c echo.Context) error {
	var req LinkedListRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, LinkedListResponse{
			Success: false,
			Message: "请求参数格式错误",
		})
	}

	if req.Type == "" {
		req.Type = "single"
	}

	if req.Type != "single" && req.Type != "double" && req.Type != "circular" {
		return c.JSON(http.StatusBadRequest, LinkedListResponse{
			Success: false,
			Message: "链表类型必须是single、double或circular",
		})
	}

	id := generateListID()
	list := &LinkedList{
		ID:    id,
		Name:  req.Name,
		Type:  req.Type,
		Head:  nil,
		Tail:  nil,
		Size:  0,
		Nodes: make([]*NodeData, 0),
	}

	linkedLists[id] = list

	return c.JSON(http.StatusCreated, LinkedListResponse{
		Success: true,
		Message: "链表创建成功",
		List:    list,
	})
}

// 获取所有链表
func getAllLinkedLists(c echo.Context) error {
	listArray := make([]*LinkedList, 0, len(linkedLists))
	for _, list := range linkedLists {
		list.updateVisualizationData()
		listArray = append(listArray, list)
	}

	return c.JSON(http.StatusOK, LinkedListResponse{
		Success: true,
		Message: "获取链表列表成功",
		Data:    listArray,
	})
}

// 获取指定链表
func getLinkedList(c echo.Context) error {
	id := c.Param("id")
	list, exists := linkedLists[id]
	if !exists {
		return c.JSON(http.StatusNotFound, LinkedListResponse{
			Success: false,
			Message: "链表不存在",
		})
	}

	list.updateVisualizationData()

	return c.JSON(http.StatusOK, LinkedListResponse{
		Success: true,
		Message: "获取链表成功",
		List:    list,
	})
}

// 删除链表
func deleteLinkedList(c echo.Context) error {
	id := c.Param("id")
	_, exists := linkedLists[id]
	if !exists {
		return c.JSON(http.StatusNotFound, LinkedListResponse{
			Success: false,
			Message: "链表不存在",
		})
	}

	delete(linkedLists, id)

	return c.JSON(http.StatusOK, LinkedListResponse{
		Success: true,
		Message: "链表删除成功",
	})
}

// 在指定位置插入节点
func insertNode(c echo.Context) error {
	id := c.Param("id")
	list, exists := linkedLists[id]
	if !exists {
		return c.JSON(http.StatusNotFound, LinkedListResponse{
			Success: false,
			Message: "链表不存在",
		})
	}

	var req NodeRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, LinkedListResponse{
			Success: false,
			Message: "请求参数格式错误",
		})
	}

	if req.Index < 0 || req.Index > list.Size {
		return c.JSON(http.StatusBadRequest, LinkedListResponse{
			Success: false,
			Message: "插入位置无效",
		})
	}

	newNode := &Node{Value: req.Value}

	if req.Index == 0 {
		// 在头部插入
		if list.Head == nil {
			list.Head = newNode
			list.Tail = newNode
			if list.Type == "circular" {
				newNode.Next = newNode
			}
		} else {
			newNode.Next = list.Head
			if list.Type == "double" {
				list.Head.Prev = newNode
			}
			list.Head = newNode

			if list.Type == "circular" {
				list.Tail.Next = newNode
			}
		}
	} else if req.Index == list.Size {
		// 在尾部插入
		if list.Tail != nil {
			list.Tail.Next = newNode
			if list.Type == "double" {
				newNode.Prev = list.Tail
			}
			list.Tail = newNode

			if list.Type == "circular" {
				newNode.Next = list.Head
			}
		}
	} else {
		// 在中间插入
		current := list.Head
		for i := 0; i < req.Index-1; i++ {
			current = current.Next
		}

		newNode.Next = current.Next
		current.Next = newNode

		if list.Type == "double" {
			newNode.Prev = current
			if newNode.Next != nil {
				newNode.Next.Prev = newNode
			}
		}
	}

	list.Size++
	list.updateVisualizationData()

	return c.JSON(http.StatusOK, LinkedListResponse{
		Success: true,
		Message: "节点插入成功",
		List:    list,
	})
}

// 在头部插入节点
func prependNode(c echo.Context) error {
	id := c.Param("id")
	_, exists := linkedLists[id]
	if !exists {
		return c.JSON(http.StatusNotFound, LinkedListResponse{
			Success: false,
			Message: "链表不存在",
		})
	}

	var req NodeRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, LinkedListResponse{
			Success: false,
			Message: "请求参数格式错误",
		})
	}

	req.Index = 0
	return insertNode(c)
}

// 在尾部追加节点
func appendNode(c echo.Context) error {
	id := c.Param("id")
	list, exists := linkedLists[id]
	if !exists {
		return c.JSON(http.StatusNotFound, LinkedListResponse{
			Success: false,
			Message: "链表不存在",
		})
	}

	var req NodeRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, LinkedListResponse{
			Success: false,
			Message: "请求参数格式错误",
		})
	}

	req.Index = list.Size
	return insertNode(c)
}

// 按索引删除节点
func deleteNodeByIndex(c echo.Context) error {
	id := c.Param("id")
	list, exists := linkedLists[id]
	if !exists {
		return c.JSON(http.StatusNotFound, LinkedListResponse{
			Success: false,
			Message: "链表不存在",
		})
	}

	indexStr := c.Param("index")
	index, err := strconv.Atoi(indexStr)
	if err != nil || index < 0 || index >= list.Size {
		return c.JSON(http.StatusBadRequest, LinkedListResponse{
			Success: false,
			Message: "索引无效",
		})
	}

	var deletedValue int

	if index == 0 {
		// 删除头节点
		deletedValue = list.Head.Value
		if list.Size == 1 {
			list.Head = nil
			list.Tail = nil
		} else {
			list.Head = list.Head.Next
			if list.Type == "double" && list.Head != nil {
				list.Head.Prev = nil
			}
			if list.Type == "circular" {
				list.Tail.Next = list.Head
			}
		}
	} else {
		// 删除其他位置的节点
		current := list.Head
		for i := 0; i < index; i++ {
			current = current.Next
		}

		deletedValue = current.Value

		if current == list.Tail {
			// 删除尾节点
			prev := current.Prev
			if list.Type == "double" {
				prev.Next = nil
				list.Tail = prev
			} else {
				// 单链表需要找到前一个节点
				prev = list.Head
				for prev.Next != current {
					prev = prev.Next
				}
				prev.Next = nil
				list.Tail = prev
			}

			if list.Type == "circular" {
				list.Tail.Next = list.Head
			}
		} else {
			// 删除中间节点
			if list.Type == "double" {
				current.Prev.Next = current.Next
				current.Next.Prev = current.Prev
			} else {
				prev := list.Head
				for prev.Next != current {
					prev = prev.Next
				}
				prev.Next = current.Next
			}
		}
	}

	list.Size--
	list.updateVisualizationData()

	return c.JSON(http.StatusOK, LinkedListResponse{
		Success: true,
		Message: fmt.Sprintf("成功删除索引%d处的节点，值为%d", index, deletedValue),
		List:    list,
		Data:    deletedValue,
	})
}

// 按值删除节点
func deleteNodeByValue(c echo.Context) error {
	id := c.Param("id")
	list, exists := linkedLists[id]
	if !exists {
		return c.JSON(http.StatusNotFound, LinkedListResponse{
			Success: false,
			Message: "链表不存在",
		})
	}

	valueStr := c.Param("value")
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, LinkedListResponse{
			Success: false,
			Message: "值格式错误",
		})
	}

	// 查找要删除的节点
	current := list.Head
	index := 0

	for current != nil {
		if current.Value == value {
			// 找到要删除的节点，调用按索引删除
			indexStr := strconv.Itoa(index)
			c.SetParamNames("id", "index")
			c.SetParamValues(id, indexStr)
			return deleteNodeByIndex(c)
		}

		current = current.Next
		index++

		// 防止循环链表无限循环
		if list.Type == "circular" && current == list.Head && index > 0 {
			break
		}
	}

	return c.JSON(http.StatusNotFound, LinkedListResponse{
		Success: false,
		Message: fmt.Sprintf("未找到值为%d的节点", value),
	})
}

// 查找节点
func findNode(c echo.Context) error {
	id := c.Param("id")
	list, exists := linkedLists[id]
	if !exists {
		return c.JSON(http.StatusNotFound, LinkedListResponse{
			Success: false,
			Message: "链表不存在",
		})
	}

	valueStr := c.Param("value")
	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, LinkedListResponse{
			Success: false,
			Message: "值格式错误",
		})
	}

	current := list.Head
	index := 0

	for current != nil {
		if current.Value == value {
			list.updateVisualizationData()
			return c.JSON(http.StatusOK, LinkedListResponse{
				Success: true,
				Message: fmt.Sprintf("找到值为%d的节点，位于索引%d", value, index),
				List:    list,
				Data:    index,
			})
		}

		current = current.Next
		index++

		// 防止循环链表无限循环
		if list.Type == "circular" && current == list.Head && index > 0 {
			break
		}
	}

	return c.JSON(http.StatusNotFound, LinkedListResponse{
		Success: false,
		Message: fmt.Sprintf("未找到值为%d的节点", value),
	})
}

// 修改节点
func updateNode(c echo.Context) error {
	id := c.Param("id")
	list, exists := linkedLists[id]
	if !exists {
		return c.JSON(http.StatusNotFound, LinkedListResponse{
			Success: false,
			Message: "链表不存在",
		})
	}

	indexStr := c.Param("index")
	index, err := strconv.Atoi(indexStr)
	if err != nil || index < 0 || index >= list.Size {
		return c.JSON(http.StatusBadRequest, LinkedListResponse{
			Success: false,
			Message: "索引无效",
		})
	}

	var req NodeRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, LinkedListResponse{
			Success: false,
			Message: "请求参数格式错误",
		})
	}

	current := list.Head
	for i := 0; i < index; i++ {
		current = current.Next
	}

	oldValue := current.Value
	current.Value = req.Value

	list.updateVisualizationData()

	return c.JSON(http.StatusOK, LinkedListResponse{
		Success: true,
		Message: fmt.Sprintf("成功将索引%d处的节点值从%d修改为%d", index, oldValue, req.Value),
		List:    list,
		Data:    oldValue,
	})
}
