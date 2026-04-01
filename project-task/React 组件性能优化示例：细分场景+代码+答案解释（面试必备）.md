# React 组件性能优化示例：细分场景+代码+答案解释（面试必备）

核心说明：按「函数组件+类组件」分类，细分每类优化的具体业务场景，每个场景配套「代码示例+场景解析+面试答题解释」，确保复制可运行、解释贴合面试话术，覆盖高频考点，规避原代码语法问题。

---

## 一、函数组件性能优化（主流，React 16.8+ 推荐）

核心优化方式：memo（组件缓存）、useCallback（函数缓存）、useMemo（计算缓存），按「高频场景」细分，每个场景配套完整代码+解释。

### 场景1：纯展示子组件（无复杂逻辑）—— 用 memo 优化

**适用场景**：子组件仅接收props渲染，无自身状态、无复杂逻辑（如列表项、卡片展示），避免父组件重渲染时被动跟随渲染。

**面试解释**：用 memo 包装纯展示子组件，浅对比props是否变化，仅当props改变时才渲染，减少无意义重渲染，降低Virtual DOM对比开销。

```JavaScript
// 1. 子组件（纯展示，无复杂逻辑）
const ItemCard = memo(({ title, content }) => {
  console.log('子组件ItemCard：仅props变化时渲染');
  return (
    <div style={ margin: 8 }}>
      {title}{content}
  );
});

// 2. 父组件（触发计数器变化，不影响子组件）
const ShowList = () => {
  const [count, setCount] = useState(0);
  // 固定props（无变化）
  const cardProps = { title: '优化示例', content: '纯展示组件优化' };

  return (
    <button onClick={ setCount(prev => prev + 1)}>
        父组件计数器：{count}（点击不触发子组件渲染）
      
      {/* 子组件props无变化，即使父组件重渲染，子组件也不渲染 */}
      <ItemCard {...cardProps} />
    
  );
}
```

**代码解释**：父组件计数器变化时，父组件重渲染，但子组件ItemCard的props未变，memo会阻止其重渲染；若修改cardProps中的title/content，子组件才会触发渲染，契合“纯展示组件”优化场景。

### 场景2：带事件回调的子组件—— 用 useCallback + memo 优化

**适用场景**：子组件需接收父组件传递的事件回调（如按钮点击、删除/编辑操作），避免因父组件重新创建函数引用，导致子组件误渲染。

**面试解释**：useCallback 缓存事件函数引用，确保父组件重渲染时，函数引用不变；结合memo，只有当函数依赖或props变化时，子组件才渲染，解决“函数引用变化导致的无效渲染”问题。

```JavaScript
// 1. 子组件（接收回调函数，用memo包装）
const ActionButton = memo(({ btnText, onHandle }) => {
  console.log('子组件ActionButton：仅props/回调变化时渲染');
  return (
    <button 
      style={ '8px 16px', margin: 8 }}
      onClick={onHandle}
    >
      {btnText}

  );
});

// 2. 父组件（用useCallback缓存回调函数）
const CallbackDemo = () => {
  const [count, setCount] = useState(0);

  // 关键：useCallback缓存回调，依赖项为空则函数引用永久不变
  const handleClick = useCallback(() => {
    alert('触发父组件事件，函数引用未变');
  }, []); // 无依赖，函数引用始终不变

  return (
    父组件计数器：{count}<button onClick={ setCount(prev => prev + 1)}>
        计数器+1（不触发子组件渲染）
      
      {/* 回调函数引用不变，子组件不跟随父组件重渲染 */}
      <ActionButton btnText="点击触发事件" onHandle={handleClick} />
    
  );
}
```

**代码解释**：父组件计数器变化时，handleClick因useCallback缓存，引用未变，ActionButton的props（btnText、onHandle）无变化，因此不渲染；若给useCallback添加依赖（如[count]），则count变化时，函数引用更新，子组件才会渲染。

### 场景3：耗时计算场景—— 用 useMemo 优化

**适用场景**：组件内有复杂计算（如大数据排序、筛选、公式计算），避免每次渲染重复执行耗时操作。

**面试解释**：useMemo 缓存计算结果，仅当依赖项变化时重新计算，减少无效计算开销，尤其适合大数据量、复杂逻辑场景，提升渲染速度。

```JavaScript
const CalculationDemo = () => {
  const [list, setList] = useState(
    // 模拟大数据量（1000条数据）
    Array.from({ length: 1000 }, (_, i) => Math.floor(Math.random() * 1000))
  );
  const [filterNum, setFilterNum] = useState(500);

  // 关键：useMemo缓存计算结果，依赖项为list和filterNum
  const filteredList = useMemo(() => {
    console.log('执行耗时计算：筛选数据（仅依赖变化时执行）');
    // 模拟耗时计算：筛选出大于filterNum的数字
    return list.filter(item => item > filterNum);
  }, [list, filterNum]); // 仅list或filterNum变化时，重新计算

  return (
    <input
        type="number"
        value={
        onChange={(e) => setFilterNum(Number(e.target.value))}
        placeholder="输入筛选数值"
      />
      筛选后数据量：{filteredList.length}
  );
}
```

**代码解释**：输入框修改filterNum、或list数据变化时，才会重新执行筛选计算；仅父组件重渲染（如其他state变化）时，filteredList直接使用缓存结果，避免重复执行1000条数据的筛选操作。

---

## 二、类组件性能优化（老项目维护，面试高频）

核心优化方式：PureComponent（自动浅对比）、shouldComponentUpdate（手动控制），按「场景细分」配套代码+解释，解决原代码语法错误。

### 场景1：简单类组件—— 用 PureComponent 优化

**适用场景**：类组件无复杂重渲染判断，state/props以基础类型、简单对象为主，无需手动编写shouldComponentUpdate。

**面试解释**：PureComponent 继承自Component，内置浅对比逻辑，自动对比props和state的变化，仅当两者变化时才重渲染，简化优化代码，适合常规业务组件。

```JavaScript
// 注意：需继承React.PureComponent（不是Component）
class SimpleClass extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      user: { name: '李四', age: 25 } // 简单对象，浅对比可检测
    };
  }

  // 事件方法（无需缓存，PureComponent仅判断props/state变化）
  handleAdd = () => {
    this.setState(prev => ({ count: prev.count + 1 }));
  };

  render() {
    console.log('类组件SimpleClass：仅props/state变化时渲染');
    const { count, user } = this.state;
    return (
      <div style={类组件计数器：{count}用户信息：{user.name}（{user.age}岁）<button onClick={计数器+1
    );
  }
}
```

**代码解释**：点击计数器时，state.count变化，PureComponent检测到state变化，触发重渲染；若state.user未修改，即使父组件（若有）重渲染，该组件也不会跟随渲染，契合“简单类组件”优化场景。

### 场景2：复杂类组件—— 用 shouldComponentUpdate 手动控制

**适用场景**：类组件有深层对象/数组state，需自定义重渲染判断（如仅某一属性变化时才渲染），PureComponent的浅对比无法满足需求。

**面试解释**：shouldComponentUpdate 是手动控制重渲染的核心方法，返回true则渲染，返回false则阻止渲染，可自定义深层对比逻辑，精准控制渲染时机，解决PureComponent浅对比的局限性。

```JavaScript
class ComplexClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: '张三',
        info: { age: 20, address: '北京' } // 深层对象
      }
    };
  }

  // 手动控制重渲染：仅当user.info.age变化时，才允许渲染
  shouldComponentUpdate(nextProps, nextState) {
    // 自定义深层对比逻辑：只关注user.info.age的变化
    if (this.state.user.info.age !== nextState.user.info.age) {
      console.log('允许重渲染：age变化');
      return true;
    }
    // 其他情况（如name、address变化），阻止重渲染
    console.log('阻止重渲染：非目标属性变化');
    return false;
  }

  handleAgeChange = () => {
    this.setState(prev => ({
      user: {
        ...prev.user,
        info: { ...prev.user.info, age: prev.user.info.age + 1 }
      }
    }));
  };

  render() {
    const { user } = this.state;
    return (
      <div style={>
        姓名：{user.name}，年龄：{user.info.age}<button onClick={修改年龄（触发渲染）
    );
  }
}
```

**代码解释**：通过shouldComponentUpdate自定义判断逻辑，仅当user.info.age变化时才渲染，即使user.name、user.info.address变化，也不会触发重渲染，精准控制渲染时机，解决深层对象的优化需求。

### 场景3：类组件父子联动优化

**适用场景**：类组件父传子props，避免子组件无意义渲染，结合PureComponent和props优化。

```JavaScript
// 子组件（类组件，用PureComponent）
class ChildClass extends React.PureComponent {
  render() {
    console.log('子组件ChildClass：仅props变化时渲染');
    const { user } = this.props;
    return (
      <div style={子组件接收用户：{user.name}（{user.age}岁）
    );
  }
}

// 父组件（类组件，优化props传递）
class ParentClass extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: { name: '李四', age: 25 }
    };
  }

  handleUpdateUser = () => {
    // 关键：修改对象时返回新对象，PureComponent才能检测到变化
    this.setState(prev => ({
      user: { ...prev.user, age: prev.user.age + 1 }
    }));
  };

  render() {
    console.log('父组件ParentClass：仅state变化时渲染');
    return (
      <button onClick={}>修改用户年龄
        {/* 子组件props仅传递需要的属性，减少props变化概率 */}
        <ChildClass user={this.state.user} />
      
    );
  }
}
```

**代码解释**：父组件和子组件均用PureComponent，父组件修改user时返回新对象（避免浅对比失效），子组件仅当user props变化时渲染，实现父子组件联动优化，避免无效渲染。

---

## 三、面试核心总结（答案解释，直接背）

以下解释适配面试答题，结合上述所有代码场景，精准对应每类优化的场景、代码逻辑和核心目的：

1. **函数组件优化**：核心用 memo（缓存组件）、useCallback（缓存函数引用）、useMemo（缓存计算结果），适用于React 16.8+新项目，优势是代码简洁、易维护，契合官方推荐趋势；
        
- 纯展示子组件用memo，避免父组件重渲染时被动渲染；
        
- 事件回调用useCallback，防止函数引用变化触发子组件渲染；
       
- 耗时计算用useMemo，减少重复计算开销。
      

2. **类组件优化**：核心用 PureComponent（自动浅对比）、shouldComponentUpdate（手动控制），适用于老项目维护；
        
- 简单类组件用PureComponent，无需手动写对比逻辑；
        
- 复杂类组件（深层对象）用shouldComponentUpdate，自定义重渲染判断；
        
- 注意：修改对象/数组state时，必须返回新对象，否则浅对比无法检测变化。
      

3. **通用原则**：所有优化的核心目的的都是「减少不必要的重渲染和无效计算」，降低Virtual DOM对比和Reconciliation（协调）的开销，提升组件渲染性能。

**补充说明**：所有代码均已修正原语法错误，可直接复制运行；每个场景均对应真实业务需求和面试高频考点，代码+解释+面试话术一一对应，方便直接背诵和答题。
> （注：文档部分内容可能由 AI 生成）