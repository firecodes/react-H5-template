# React 性能优化：终极整理版与可运行代码示例

明白，既然你需要一份**终极整理版**，那我就把所有内容重新压缩成**面试直接背的标准答案** + **可直接运行的代码块**。

内容结构分为三部分：

1. **精简面试话术（直接背）**

2. **代码示例（可复制运行）**

3. **避坑指南（高频扣分点）**

---

### 🧠 第一部分：面试终极答题模板（直接背）

#### 1. 总起句（开场）

“React性能优化的核心原则是**减少不必要的重渲染**和**减少无效计算**，最终目的是降低Virtual DOM对比和协调（Reconciliation）的开销，提升渲染速度和用户体验。”

#### 2. 函数组件优化（主流，占80%分值）

“在React 16.8+的新项目中，我主要通过 **`React.memo`**、**`useCallback`** 和 **`useMemo`** 这三个API进行优化：

- **`React.memo`**：用于包装**纯展示组件**，对props进行浅对比。如果父组件重渲染但props未变，缓存组件不重新渲染，解决‘被动渲染’问题。

- **`useCallback`**：用于缓存**事件回调函数**。确保父组件重渲染时，函数的引用地址不变，配合`memo`使用，避免子组件因函数引用变化而被迫重渲染。

- **`useMemo`**：用于缓存**昂贵的计算结果**。如大数据排序、筛选等，仅当依赖项变化时才重新计算，避免重复执行耗时操作。”

#### 3. 类组件优化（老项目，占20%分值）

“在维护老项目时，主要通过 **`PureComponent`** 和 **`shouldComponentUpdate`** 进行优化：

- **`PureComponent`**：继承自Component，内置了浅对比逻辑。无需手动编写`shouldComponentUpdate`，自动对比props和state，适合简单状态的组件。

- **`shouldComponentUpdate`**：用于**复杂类组件**的精准控制。通过返回true或false，手动决定组件是否渲染，特别适用于只关心对象中某一特定属性变化的场景。

- **关键避坑**：无论是PureComponent还是memo，修改对象或数组时，必须遵循**不可变数据原则**，返回**新对象/新数组**，否则浅对比无法检测到变化。”

#### 4. 拓展优化（加分项）

“除了组件内部优化，我还会从工程化角度进行优化：

- **路由懒加载**：使用`React.lazy`和`Suspense`实现路由级别的按需加载，减少首屏加载体积。

- **正确使用Key**：列表渲染时，使用**唯一ID**作为key，避免使用index，帮助React精准定位DOM元素，提升Diff算法效率。

- **扁平化组件**：减少不必要的组件嵌套，精简Virtual DOM树结构。

- **生产环境构建**：部署时使用production模式，React会自动压缩代码、移除警告，大幅提升运行性能。”

---

### 💻 第二部分：核心代码示例（可直接复制运行）

#### 1. 函数组件优化组合拳

```JavaScript

import React, { memo, useCallback, useMemo, useState } from 'react';

// 1. 纯展示子组件 - 使用 React.memo
const ListItem = memo(({ title }) => {
  console.log('👉 ListItem 渲染了 (仅props变化时)');
  return <li style={{ padding: '8px', border: '1px solid #eee' }}>{title}</li>;
});

// 2. 带回调的子组件 - 使用 useCallback + memo
const ActionBtn = memo(({ label, onClick }) => {
  console.log('👉 ActionBtn 渲染了');
  return <button onClick={onClick}>{label}</button>;
});

// 3. 主组件
const OptimizedDemo = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('优化前');

  // 缓存回调函数 - useCallback
  // 依赖项为空，确保函数引用永久不变
  const handleBtnClick = useCallback(() => {
    alert(`触发事件: ${name}`);
  }, [name]); // 如果依赖name变化，函数才会重新创建

  // 缓存计算结果 - useMemo
  // 模拟耗时计算：格式化一个长字符串
  const formattedText = useMemo(() => {
    console.log('🔄 执行了耗时计算');
    return `【处理后的文本】${name.split('').reverse().join('')}`;
  }, [name]);

  return (
    <div style={{ padding: '20px' }}>
      <p>计数器: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>增加计数 (触发父组件重渲染)</button>
      <button onClick={() => setName(n => n + '✨')}>修改名称 (触发子组件渲染)</button>
      
      <h4>1. 纯展示列表</h4>
      <ul>
        <ListItem title="苹果" />
        <ListItem title="香蕉" />
      </ul>

      <h4>2. 事件回调示例</h4>
      <ActionBtn label="点击触发" onClick={handleBtnClick} />

      <h4>3. 耗时计算示例</h4>
      <p>{formattedText}</p>
    </div>
  );
};

export default OptimizedDemo;
```

#### 2. 类组件优化

```JavaScript

import React from 'react';

// 1. 简单类组件 - 使用 PureComponent
class UserCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: { name: '张三', age: 25 }
    };
  }

  growUp = () => {
    // 关键：返回新对象，让PureComponent检测到变化
    this.setState(prev => ({
      user: { ...prev.user, age: prev.user.age + 1 }
    }));
  };

  render() {
    console.log('🔵 UserCard 渲染了');
    const { name, age } = this.state.user;
    return (
      <div>
        <p>{name} - {age} 岁</p>
        <button onClick={this.growUp}>长大一岁</button>
      </div>
    );
  }
}

// 2. 复杂类组件 - 使用 shouldComponentUpdate
class ComplexUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: '李四',
        info: { age: 30, address: '北京' }
      }
    };
  }

  // 只在 age 变化时才重新渲染
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.user.info.age !== nextState.user.info.age) {
      return true;
    }
    return false;
  }

  move = () => {
    this.setState(prev => ({
      user: {
        ...prev.user,
        info: { ...prev.user.info, address: '上海' }
      }
    }));
  };

  render() {
    console.log('🟢 ComplexUser 渲染了');
    const { name, address } = this.state.user.info;
    return (
      <div>
        <p>姓名: {name}</p>
        <p>地址: {address}</p>
        <button onClick={this.move}>搬家 (不会触发渲染)</button>
      </div>
    );
  }
}

export { UserCard, ComplexUser };
```

#### 3. 拓展优化 - 路由懒加载

```JavaScript

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// 懒加载组件 - 只有访问对应路由时才加载
const Home = lazy(() => import('./Home'));
const About = lazy(() => import('./About'));
const Contact = lazy(() => import('./Contact'));

const AppRouter = () => {
  return (
    <Router>
      <nav style={{ margin: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>首页</Link>
        <Link to="/about" style={{ marginRight: '10px' }}>关于</Link>
        <Link to="/contact">联系我们</Link>
      </nav>

      {/* Suspense 提供加载占位符 */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
```

---

### ⚠️ 第三部分：高频避坑指南（面试必问）

1. **滥用 useCallback/useMemo**

    - **坑**：对所有组件和计算都加缓存。

    - **解**：缓存本身有开销。仅在**组件确实重渲染频繁**、或**计算确实耗时**时使用。简单组件无需优化。

2. **useCallback 依赖数组错误**

    - **坑**：函数内使用了外部变量但没加到依赖数组。

    - **解**：必须保证依赖数组完整。否则会导致闭包陷阱，拿到旧数据。

3. **PureComponent/memo 浅对比失效**

    - **坑**：直接修改对象内部属性（如 `user.age = 30`）。

    - **解**：必须返回**新对象**（如 `{ ...user, age: 30 }`），浅对比才能检测到变化。

4. **列表 Key 错误**

    - **坑**：使用 `index` 作为 key。

    - **解**：使用**唯一ID**（如 `item.id`）。列表增删改时，index会导致React误判，造成UI错乱。

5. **在 render 中定义函数/对象**

    - **坑**：`return <Child onClick={() => {}} />` 或 `const obj = {}` 直接写在组件内部。

    - **解**：父组件每次重渲染都会创建新的引用，导致子组件（即使有memo）被迫重渲染。必须使用 `useCallback`/`useMemo` 或移到组件外部。

这份内容已经为你做了最精简、最核心的整理。可以直接保存下来，面试前快速过一遍。
> （注：文档部分内容可能由 AI 生成）