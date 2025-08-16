
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ArrayManager from './pages/ArrayManager';
import LinkedListManager from './pages/LinkedListManager';
import './App.css';

/**
 * 主应用组件
 * 配置路由和页面结构
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="arrays" element={<ArrayManager />} />
          <Route path="linked-lists" element={<LinkedListManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
