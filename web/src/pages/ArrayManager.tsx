import React, { useState, useEffect } from 'react';
import './ArrayManager.css';

// 类型定义
interface DynamicArray {
  id: string;
  name: string;
  elements: number[];
  capacity: number;
  size: number;
}

interface ArrayResponse {
  success: boolean;
  message: string;
  array?: DynamicArray;
  data?: any;
}

/**
 * 动态数组管理组件
 * 提供动态数组的可视化操作界面
 */
const ArrayManager: React.FC = () => {
  const [arrays, setArrays] = useState<DynamicArray[]>([]);
  const [selectedArray, setSelectedArray] = useState<DynamicArray | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  // 表单状态
  const [newArrayName, setNewArrayName] = useState('');
  const [newArrayCapacity, setNewArrayCapacity] = useState(10);
  const [operationValue, setOperationValue] = useState<number>(0);
  const [operationIndex, setOperationIndex] = useState<number>(0);

  // 使用同源 API 前缀，生产部署与本地开发（通过 Vite 代理）均可用
  const API_BASE = '/api';

  /**
   * 显示消息
   */
  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  /**
   * 获取所有数组
   */
  const fetchArrays = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/arrays`);
      const data: ArrayResponse = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setArrays(data.data);
      } else {
        showMessage('获取数组列表失败', 'error');
      }
    } catch (error) {
      showMessage('网络错误，请检查后端服务', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 创建新数组
   */
  const createArray = async () => {
    if (!newArrayName.trim()) {
      showMessage('请输入数组名称', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/arrays`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newArrayName,
          capacity: newArrayCapacity,
        }),
      });

      const data: ArrayResponse = await response.json();
      
      if (data.success && data.array) {
        setArrays(prev => [...prev, data.array!]);
        setNewArrayName('');
        setNewArrayCapacity(10);
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message || '创建数组失败', 'error');
      }
    } catch (error) {
      showMessage('网络错误，请检查后端服务', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 选择数组
   */
  const selectArray = async (arrayId: string) => {
    try {
      const response = await fetch(`${API_BASE}/arrays/${arrayId}`);
      const data: ArrayResponse = await response.json();
      
      if (data.success && data.array) {
        setSelectedArray(data.array);
      } else {
        showMessage('获取数组详情失败', 'error');
      }
    } catch (error) {
      showMessage('网络错误，请检查后端服务', 'error');
    }
  };

  /**
   * 删除数组
   */
  const deleteArray = async (arrayId: string) => {
    if (!confirm('确定要删除这个数组吗？')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/arrays/${arrayId}`, {
        method: 'DELETE',
      });

      const data: ArrayResponse = await response.json();
      
      if (data.success) {
        setArrays(prev => prev.filter(arr => arr.id !== arrayId));
        if (selectedArray?.id === arrayId) {
          setSelectedArray(null);
        }
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message || '删除数组失败', 'error');
      }
    } catch (error) {
      showMessage('网络错误，请检查后端服务', 'error');
    }
  };

  /**
   * 执行数组操作
   */
  const performOperation = async (operation: string, endpoint: string, method: string = 'POST', body?: any) => {
    if (!selectedArray) {
      showMessage('请先选择一个数组', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/arrays/${selectedArray.id}${endpoint}`, {
        method,
        headers: method !== 'GET' && method !== 'DELETE' ? {
          'Content-Type': 'application/json',
        } : {},
        body: body ? JSON.stringify(body) : undefined,
      });

      const data: ArrayResponse = await response.json();
      
      if (data.success) {
        if (data.array) {
          setSelectedArray(data.array);
          setArrays(prev => prev.map(arr => 
            arr.id === data.array!.id ? data.array! : arr
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

  // 组件挂载时获取数组列表
  useEffect(() => {
    fetchArrays();
  }, []);

  return (
    <div className="array-manager">
      <div className="page-header">
        <h1>动态数组管理</h1>
        <p>创建和管理动态数组，执行各种操作并观察结果</p>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}

      <div className="manager-layout">
        {/* 左侧：数组列表和创建 */}
        <div className="sidebar">
          <div className="section">
            <h3>创建新数组</h3>
            <div className="form-group">
              <label>数组名称：</label>
              <input
                type="text"
                value={newArrayName}
                onChange={(e) => setNewArrayName(e.target.value)}
                placeholder="输入数组名称"
              />
            </div>
            <div className="form-group">
              <label>容量：</label>
              <input
                type="number"
                value={newArrayCapacity}
                onChange={(e) => setNewArrayCapacity(Number(e.target.value))}
                min="1"
                max="100"
              />
            </div>
            <button 
              className="btn btn-primary"
              onClick={createArray}
              disabled={loading}
            >
              创建数组
            </button>
          </div>

          <div className="section">
            <h3>数组列表</h3>
            <div className="array-list">
              {arrays.length === 0 ? (
                <p className="empty-message">暂无数组</p>
              ) : (
                arrays.map(array => (
                  <div 
                    key={array.id}
                    className={`array-item ${selectedArray?.id === array.id ? 'selected' : ''}`}
                    onClick={() => selectArray(array.id)}
                  >
                    <div className="array-info">
                      <h4>{array.name}</h4>
                      <p>大小: {array.size}/{array.capacity}</p>
                    </div>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteArray(array.id);
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

        {/* 右侧：数组操作和可视化 */}
        <div className="main-content">
          {selectedArray ? (
            <>
              {/* 数组可视化 */}
              <div className="section">
                <h3>{selectedArray.name} - 数组可视化</h3>
                <div className="array-visualization">
                  <div className="array-container">
                    {Array.from({ length: selectedArray.capacity }, (_, index) => (
                      <div 
                        key={index}
                        className={`array-cell ${index < selectedArray.size ? 'filled' : 'empty'}`}
                      >
                        <div className="cell-index">{index}</div>
                        <div className="cell-value">
                          {index < selectedArray.size ? selectedArray.elements[index] : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="array-info-bar">
                    <span>容量: {selectedArray.capacity}</span>
                    <span>大小: {selectedArray.size}</span>
                    <span>使用率: {((selectedArray.size / selectedArray.capacity) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* 操作控制 */}
              <div className="section">
                <h3>数组操作</h3>
                <div className="operations">
                  <div className="operation-group">
                    <h4>插入操作</h4>
                    <div className="operation-controls">
                      <input
                        type="number"
                        value={operationValue}
                        onChange={(e) => setOperationValue(Number(e.target.value))}
                        placeholder="值"
                      />
                      <input
                        type="number"
                        value={operationIndex}
                        onChange={(e) => setOperationIndex(Number(e.target.value))}
                        placeholder="位置"
                        min="0"
                        max={selectedArray.size}
                      />
                      <button
                        className="btn btn-secondary"
                        onClick={() => performOperation('插入', '/insert', 'POST', {
                          value: operationValue,
                          index: operationIndex
                        })}
                        disabled={loading}
                      >
                        在指定位置插入
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => performOperation('追加', '/append', 'POST', {
                          value: operationValue
                        })}
                        disabled={loading}
                      >
                        在末尾追加
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
                        max={selectedArray.size - 1}
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
                        查找元素
                      </button>
                      <input
                        type="number"
                        value={operationIndex}
                        onChange={(e) => setOperationIndex(Number(e.target.value))}
                        placeholder="索引"
                        min="0"
                        max={selectedArray.size - 1}
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
                        修改元素
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <h3>请选择一个数组</h3>
              <p>从左侧列表中选择一个数组来开始操作</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArrayManager;
