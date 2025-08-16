import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

/**
 * 首页组件
 * 展示应用介绍和功能导航
 */
const Home: React.FC = () => {
  return (
    <div className="home">
      {/* 欢迎区域 */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">欢迎使用 Linera</h1>
          <p className="hero-subtitle">
            一个交互式的数据结构学习和演示平台
          </p>
          <p className="hero-description">
            通过可视化的方式学习和理解动态数组和链表的基本操作，
            包括创建、插入、删除、查找和修改等核心功能。
          </p>
        </div>
      </section>

      {/* 功能卡片区域 */}
      <section className="features">
        <h2 className="features-title">核心功能</h2>
        <div className="features-grid">
          {/* 动态数组卡片 */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="9" x2="9" y2="15"/>
                <line x1="15" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h3 className="feature-title">动态数组管理</h3>
            <p className="feature-description">
              可视化的动态数组操作界面，支持创建、插入、删除、查找和修改元素。
              实时显示数组状态和操作结果。
            </p>
            <div className="feature-actions">
              <Link to="/arrays" className="btn btn-primary">
                开始使用
              </Link>
            </div>
          </div>

          {/* 链表演示卡片 */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6"/>
                <path d="m21 12-6-6-6 6-6-6"/>
              </svg>
            </div>
            <h3 className="feature-title">链表可视化</h3>
            <p className="feature-description">
              支持单链表、双向链表和循环链表的图形化展示。
              直观显示节点连接关系和操作过程。
            </p>
            <div className="feature-actions">
              <Link to="/linked-lists" className="btn btn-primary">
                开始使用
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 技术特性区域 */}
      <section className="tech-features">
        <h2 className="tech-title">技术特性</h2>
        <div className="tech-grid">
          <div className="tech-item">
            <h4>React 前端</h4>
            <p>现代化的用户界面，响应式设计</p>
          </div>
          <div className="tech-item">
            <h4>Echo 后端</h4>
            <p>高性能的 Go 语言 Web 框架</p>
          </div>
          <div className="tech-item">
            <h4>RESTful API</h4>
            <p>标准化的接口设计，易于扩展</p>
          </div>
          <div className="tech-item">
            <h4>实时可视化</h4>
            <p>动态展示数据结构的变化过程</p>
          </div>
        </div>
      </section>

      {/* 快速开始区域 */}
      <section className="quick-start">
        <div className="quick-start-content">
          <h2>快速开始</h2>
          <p>选择一个数据结构开始你的学习之旅：</p>
          <div className="quick-start-buttons">
            <Link to="/arrays" className="btn btn-outline">
              动态数组 →
            </Link>
            <Link to="/linked-lists" className="btn btn-outline">
              链表演示 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
