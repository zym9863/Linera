import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './Layout.css';

/**
 * 主布局组件
 * 提供应用的整体布局结构，包括导航栏和内容区域
 */
const Layout: React.FC = () => {
  const location = useLocation();

  /**
   * 检查当前路径是否为活动状态
   * @param path - 要检查的路径
   * @returns 是否为活动状态
   */
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <div className="layout">
      {/* 顶部导航栏 */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <Link to="/">Linera 数据结构演示</Link>
          </h1>
          <nav className="nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link 
                  to="/" 
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                >
                  首页
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/arrays" 
                  className={`nav-link ${isActive('/arrays') ? 'active' : ''}`}
                >
                  动态数组
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/linked-lists" 
                  className={`nav-link ${isActive('/linked-lists') ? 'active' : ''}`}
                >
                  链表演示
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* 底部信息 */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Linera 数据结构演示系统</p>
          <p>基于 React + Echo 构建</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
