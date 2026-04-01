/**
 * H5活动管理系统 - Supabase客户端适配器
 * 用于连接Supabase PostgreSQL数据库
 */

// Supabase配置
// 注意：请将以下配置替换为您的实际Supabase项目配置
const SUPABASE_CONFIG = {
  // 开发环境
  development: {
    url: 'https://your-project-id.supabase.co',
    anonKey: 'your-anon-key-here',
    serviceRoleKey: 'your-service-role-key-here' // 仅服务端使用
  },
  // 生产环境
  production: {
    url: 'https://your-project-id.supabase.co',
    anonKey: 'your-anon-key-here'
  }
};

// 获取当前环境配置
const getSupabaseConfig = () => {
  const env = window.location.hostname === 'localhost' ? 'development' : 'production';
  return SUPABASE_CONFIG[env];
};

// Supabase REST API客户端
class SupabaseClient {
  constructor() {
    this.config = getSupabaseConfig();
    this.baseURL = `${this.config.url}/rest/v1`;
    this.headers = {
      'apikey': this.config.anonKey,
      'Authorization': `Bearer ${this.config.anonKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // 设置JWT Token（用于RLS认证）
  setAuthToken(token) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  // 清除Token
  clearAuthToken() {
    this.headers['Authorization'] = `Bearer ${this.config.anonKey}`;
  }

  // 构建查询URL
  buildURL(table, query = {}) {
    const params = new URLSearchParams();

    // 处理select
    if (query.select) {
      params.append('select', query.select);
    }

    // 处理filters
    if (query.filters) {
      Object.entries(query.filters).forEach(([key, value]) => {
        if (typeof value === 'object') {
          // 操作符支持: eq, neq, gt, gte, lt, lte, like, ilike, in, is, fts, etc.
          const [op, val] = Object.entries(value)[0];
          params.append(key, `${op}.${val}`);
        } else {
          params.append(key, `eq.${value}`);
        }
      });
    }

    // 处理order
    if (query.order) {
      params.append('order', query.order);
    }

    // 处理分页
    if (query.limit) {
      params.append('limit', query.limit);
    }
    if (query.offset) {
      params.append('offset', query.offset);
    }

    const queryString = params.toString();
    return `${this.baseURL}/${table}${queryString ? '?' + queryString : ''}`;
  }

  // GET请求
  async get(table, query = {}) {
    const url = this.buildURL(table, query);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // POST请求
  async post(table, data, query = {}) {
    const url = this.buildURL(table, query);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    // 返回插入的数据（如果有Prefer: return=representation）
    if (response.status === 201) {
      return response.json().catch(() => data);
    }
    return data;
  }

  // PATCH请求（用于更新）
  async patch(table, data, filters = {}) {
    const query = { filters };
    const url = this.buildURL(table, query);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json().catch(() => data);
  }

  // DELETE请求
  async delete(table, filters = {}) {
    const query = { filters };
    const url = this.buildURL(table, query);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return true;
  }

  // RPC调用（调用存储过程）
  async rpc(functionName, params = {}) {
    const url = `${this.config.url}/rest/v1/rpc/${functionName}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }
}

// 创建Supabase客户端实例
const supabase = new SupabaseClient();

// Token管理
const TokenManager = {
  getToken() {
    return localStorage.getItem('sb_token');
  },
  setToken(token) {
    localStorage.setItem('sb_token', token);
    // 同时设置到Supabase客户端
    supabase.setAuthToken(token);
  },
  removeToken() {
    localStorage.removeItem('sb_token');
    supabase.clearAuthToken();
  },
  isLoggedIn() {
    return !!this.getToken();
  }
};

// ============================================
// Supabase API服务封装
// ============================================

// 通用响应处理
const handleResponse = (data, error) => {
  if (error) {
    throw new Error(error.message || '操作失败');
  }
  return {
    code: 200,
    message: 'success',
    data: data
  };
};

// 活动管理API
const ActivityAPI = {
  // 获取活动列表
  async getList({ page = 1, page_size = 10, keyword = '', status = '', creator_id = '' } = {}) {
    let query = supabase
      .from('activities')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (keyword) {
      query = query.or(`name.ilike.%${keyword}%,activity_code.ilike.%${keyword}%`);
    }
    if (status !== '') {
      query = query.eq('status', parseInt(status));
    }
    if (creator_id) {
      query = query.eq('creator_id', creator_id);
    }

    const { data, error, count } = await query
      .range((page - 1) * page_size, page * page_size - 1);

    return handleResponse({
      list: data || [],
      total: count || 0,
      page,
      page_size
    }, error);
  },

  // 获取活动详情
  async getDetail(id) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    return handleResponse(data, error);
  },

  // 创建活动
  async create(data) {
    const { data: result, error } = await supabase
      .from('activities')
      .insert([data])
      .select()
      .single();

    return handleResponse(result, error);
  },

  // 更新活动
  async update(id, data) {
    const { data: result, error } = await supabase
      .from('activities')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    return handleResponse(result, error);
  },

  // 删除活动（软删除）
  async delete(id) {
    const { data, error } = await supabase
      .from('activities')
      .update({ is_deleted: true })
      .eq('id', id);

    return handleResponse(data, error);
  }
};

// 导出所有API服务
window.H5CmsSupabaseAPI = {
  supabase,
  TokenManager,
  ActivityAPI
};

console.log('Supabase客户端已加载，请配置您的Supabase项目信息');