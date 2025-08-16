import React, { useState, useEffect } from 'react';
import './LinkedListManager.css';

// 类型定义
interface NodeData {
  value: number;
  nextId?: string;
  prevId?: string;
  id: string;
}

interface LinkedList {
  id: string;
  name: string;
  type: 'single' | 'double' | 'circular';
  size: number;
  nodes: NodeData[];
}

interface LinkedListResponse {
  success: boolean;
  message: string;
  list?: LinkedList;
  data?: any;
}

/**
 * 链表管理组件
 * 提供链表的可视化操作界面
 */
const LinkedListManager: React.FC = () => {
  const [lists, setLists] = useState<LinkedList[]>([]);
  const [selectedList, setSelectedList] = useState<LinkedList | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  // 表单状态
  const [newListName, setNewListName] = useState('');
  const [newListType, setNewListType] = useState<'single' | 'double' | 'circular'>('single');
  const [operationValue, setOperationValue] = useState<number>(0);
  const [operationIndex, setOperationIndex] = useState<number>(0);

  const API_BASE = 'http://localhost:8080/api';

  /**
   * 显示消息
   */
  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  /**
   * 获取所有链表
   */
  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/lists`);
      const data: LinkedListResponse = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setLists(data.data);
      } else {
        showMessage('获取链表列表失败', 'error');
      }
    } catch (error) {
      showMessage('网络错误，请检查后端服务', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 创建新链表
   */
  const createList = async () => {
    if (!newListName.trim()) {
      showMessage('请输入链表名称', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newListName,
          type: newListType,
        }),
      });

      const data: LinkedListResponse = await response.json();
      
      if (data.success && data.list) {
        setLists(prev => [...prev, data.list!]);
        setNewListName('');
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message || '创建链表失败', 'error');
      }
    } catch (error) {
      showMessage('网络错误，请检查后端服务', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 选择链表
   */
  const selectList = async (listId: string) => {
    try {
      const response = await fetch(`${API_BASE}/lists/${listId}`);
      const data: LinkedListResponse = await response.json();
      
      if (data.success && data.list) {
        setSelectedList(data.list);
      } else {
        showMessage('获取链表详情失败', 'error');
      }
    } catch (error) {
      showMessage('网络错误，请检查后端服务', 'error');
    }
  };

  /**
   * 删除链表
   */
  const deleteList = async (listId: string) => {
    if (!confirm('确定要删除这个链表吗？')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/lists/${listId}`, {
        method: 'DELETE',
      });

      const data: LinkedListResponse = await response.json();
      
      if (data.success) {
        setLists(prev => prev.filter(list => list.id !== listId));
        if (selectedList?.id === listId) {
          setSelectedList(null);
        }
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message || '删除链表失败', 'error');
      }
    } catch (error) {
      showMessage('网络错误，请检查后端服务', 'error');
    }
  };

  /**
   * 执行链表操作
   */
  const performOperation = async (operation: string, endpoint: string, method: string = 'POST', body?: any) => {
    if (!selectedList) {
      showMessage('请先选择一个链表', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/lists/${selectedList.id}${endpoint}`, {
        method,
        headers: method !== 'GET' && method !== 'DELETE' ? {
          'Content-Type': 'application/json',
        } : {},
        body: body ? JSON.stringify(body) : undefined,
      });

      const data: LinkedListResponse = await response.json();
      
      if (data.success) {
        if (data.list) {
          setSelectedList(data.list);
          setLists(prev => prev.map(list => 
            list.id === data.list!.id ? data.list! : list
          ));
        }
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message || `${operation}失败`, 'error');
      }
    } catch (error) {
      showMessage('网络错误，请检查后端服务', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取链表列表
  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div className="linkedlist-manager">
      <div className="page-header">
        <h1>链表可视化演示</h1>
        <p>创建和管理链表，观察节点连接关系和操作过程</p>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}

      <div className="manager-layout">
        {/* 左侧：链表列表和创建 */}
        <div className="sidebar">
          <div className="section">
            <h3>创建新链表</h3>
            <div className="form-group">
              <label>链表名称：</label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="输入链表名称"
              />
            </div>
            <div className="form-group">
              <label>链表类型：</label>
              <select
                value={newListType}
                onChange={(e) => setNewListType(e.target.value as 'single' | 'double' | 'circular')}
              >
                <option value="single">单链表</option>
                <option value="double">双向链表</option>
                <option value="circular">循环链表</option>
              </select>
            </div>
            <button 
              className="btn btn-primary"
              onClick={createList}
              disabled={loading}
            >
              创建链表
            </button>
          </div>

          <div className="section">
            <h3>链表列表</h3>
            <div className="list-container">
              {lists.length === 0 ? (
                <p className="empty-message">暂无链表</p>
              ) : (
                lists.map(list => (
                  <div 
                    key={list.id}
                    className={`list-item ${selectedList?.id === list.id ? 'selected' : ''}`}
                    onClick={() => selectList(list.id)}
                  >
                    <div className="list-info">
                      <h4>{list.name}</h4>
                      <p>类型: {list.type === 'single' ? '单链表' : list.type === 'double' ? '双向链表' : '循环链表'}</p>
                      <p>节点数: {list.size}</p>
                    </div>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteList(list.id);
                      }}
                    >
                      删除
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 右侧：链表操作和可视化 */}
        <div className="main-content">
          {selectedList ? (
            <>
              {/* 链表可视化 */}
              <div className="section">
                <h3>{selectedList.name} - 链表可视化</h3>
                <div className="list-visualization">
                  <div className="list-type-info">
                    <span className="type-badge">
                      {selectedList.type === 'single' ? '单链表' : 
                       selectedList.type === 'double' ? '双向链表' : '循环链表'}
                    </span>
                    <span className="size-info">节点数: {selectedList.size}</span>
                  </div>
                  
                  {selectedList.nodes.length === 0 ? (
                    <div className="empty-list">
                      <p>链表为空</p>
                    </div>
                  ) : (
                    <div className="nodes-container">
                      {selectedList.nodes.map((node, index) => (
                        <div key={node.id} className="node-wrapper">
                          <div className="node">
                            <div className="node-value">{node.value}</div>
                            <div className="node-index">{index}</div>
                          </div>
                          
                          {/* 显示指向下一个节点的箭头 */}
                          {node.nextId && (
                            <div className="arrow arrow-next">
                              <svg width="40" height="20" viewBox="0 0 40 20">
                                <line x1="5" y1="10" x2="30" y2="10" stroke="#667eea" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                                <defs>
                                  <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                                    refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#667eea" />
                                  </marker>
                                </defs>
                              </svg>
                            </div>
                          )}
                          
                          {/* 双向链表的反向箭头 */}
                          {selectedList.type === 'double' && node.prevId && index > 0 && (
                            <div className="arrow arrow-prev">
                              <svg width="40" height="20" viewBox="0 0 40 20">
                                <line x1="35" y1="15" x2="10" y2="15" stroke="#e74c3c" strokeWidth="2" markerEnd="url(#arrowhead-prev)"/>
                                <defs>
                                  <marker id="arrowhead-prev" markerWidth="10" markerHeight="7" 
                                    refX="1" refY="3.5" orient="auto">
                                    <polygon points="10 0, 0 3.5, 10 7" fill="#e74c3c" />
                                  </marker>
                                </defs>
                              </svg>
                            </div>
                          )}
                          
                          {/* 循环链表的回环箭头 */}
                          {selectedList.type === 'circular' && index === selectedList.nodes.length - 1 && selectedList.size > 1 && (
                            <div className="arrow arrow-circular">
                              <svg width="60" height="40" viewBox="0 0 60 40">
                                <path d="M 10 20 Q 30 5 50 20" stroke="#f39c12" strokeWidth="2" fill="none" markerEnd="url(#arrowhead-circular)"/>
                                <defs>
                                  <marker id="arrowhead-circular" markerWidth="10" markerHeight="7" 
                                    refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#f39c12" />
                                  </marker>
                                </defs>
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 操作控制 */}
              <div className="section">
                <h3>链表操作</h3>
                <div className="operations">
                  <div className="operation-group">
                    <h4>插入操作</h4>
                    <div className="operation-controls">
                      <input
                        type="number"
                        value={operationValue}
                        onChange={(e) => setOperationValue(Number(e.target.value))}
                        placeholder="节点值"
                      />
                      <button
                        className="btn btn-secondary"
                        onClick={() => performOperation('头部插入', '/prepend', 'POST', {
                          value: operationValue
                        })}
                        disabled={loading}
                      >
                        头部插入
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => performOperation('尾部追加', '/append', 'POST', {
                          value: operationValue
                        })}
                        disabled={loading}
                      >
                        尾部追加
                      </button>
                      <input
                        type="number"
                        value={operationIndex}
                        onChange={(e) => setOperationIndex(Number(e.target.value))}
                        placeholder="位置"
                        min="0"
                        max={selectedList.size}
                      />
                      <button
                        className="btn btn-secondary"
                        onClick={() => performOperation('指定位置插入', '/insert', 'POST', {
                          value: operationValue,
                          index: operationIndex
                        })}
                        disabled={loading}
                      >
                        指定位置插入
                      </button>
                    </div>
                  </div>

                  <div className="operation-group">
                    <h4>删除操作</h4>
                    <div className="operation-controls">
                      <input
                        type="number"
                        value={operationIndex}
                        onChange={(e) => setOperationIndex(Number(e.target.value))}
                        placeholder="索引"
                        min="0"
                        max={selectedList.size - 1}
                      />
                      <button
                        className="btn btn-warning"
                        onClick={() => performOperation('按索引删除', `/index/${operationIndex}`, 'DELETE')}
                        disabled={loading}
                      >
                        按索引删除
                      </button>
                      <input
                        type="number"
                        value={operationValue}
                        onChange={(e) => setOperationValue(Number(e.target.value))}
                        placeholder="值"
                      />
                      <button
                        className="btn btn-warning"
                        onClick={() => performOperation('按值删除', `/value/${operationValue}`, 'DELETE')}
                        disabled={loading}
                      >
                        按值删除
                      </button>
                    </div>
                  </div>

                  <div className="operation-group">
                    <h4>查找和修改</h4>
                    <div className="operation-controls">
                      <input
                        type="number"
                        value={operationValue}
                        onChange={(e) => setOperationValue(Number(e.target.value))}
                        placeholder="查找值"
                      />
                      <button
                        className="btn btn-info"
                        onClick={() => performOperation('查找', `/find/${operationValue}`, 'GET')}
                        disabled={loading}
                      >
                        查找节点
                      </button>
                      <input
                        type="number"
                        value={operationIndex}
                        onChange={(e) => setOperationIndex(Number(e.target.value))}
                        placeholder="索引"
                        min="0"
                        max={selectedList.size - 1}
                      />
                      <input
                        type="number"
                        value={operationValue}
                        onChange={(e) => setOperationValue(Number(e.target.value))}
                        placeholder="新值"
                      />
                      <button
                        className="btn btn-info"
                        onClick={() => performOperation('修改', `/index/${operationIndex}`, 'PUT', {
                          value: operationValue
                        })}
                        disabled={loading}
                      >
                        修改节点
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <h3>请选择一个链表</h3>
              <p>从左侧列表中选择一个链表来开始操作</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedListManager;
