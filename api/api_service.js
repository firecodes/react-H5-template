/**
 * H5活动管理系统 - API服务层
 * 封装所有后端API调用
 */

// API基础配置
const API_CONFIG = {
  // 开发环境
  development: {
    baseURL: 'http://localhost:3000/api/v1',
    timeout: 30000
  },
  // 生产环境
  production: {
    baseURL: '/api/v1',
    timeout: 30000
  }
};

// 获取当前环境配置
const getConfig = () => {
  const env = window.location.hostname === 'localhost' ? 'development' : 'production';
  return API_CONFIG[env];
};

// Token管理
const TokenManager = {
  getToken() {
    return localStorage.getItem('h5cms_token');
  },
  setToken(token) {
    localStorage.setItem('h5cms_token', token);
  },
  removeToken() {
    localStorage.removeItem('h5cms_token');
  },
  isLoggedIn() {
    return !!this.getToken();
  }
};

// HTTP请求封装
class HttpClient {
  constructor() {
    this.config = getConfig();
    this.pendingRequests = new Map();
  }

  // 生成请求唯一标识
  getRequestKey(config) {
    return `${config.method}_${config.url}_${JSON.stringify(config.params || {})}`;
  }

  // 取消重复请求
  cancelPendingRequest(key) {
    if (this.pendingRequests.has(key)) {
      this.pendingRequests.get(key).abort();
      this.pendingRequests.delete(key);
    }
  }

  // 构建完整URL
  buildURL(url) {
    if (url.startsWith('http')) return url;
    return `${this.config.baseURL}${url}`;
  }

  // 构建请求头
  buildHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders
    };

    const token = TokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // 发送请求
  async request(options) {
    const { method = 'GET', url, data = null, params = null, headers = {} } = options;
    const fullURL = this.buildURL(url);
    const requestKey = this.getRequestKey({ method, url, params });

    // 取消相同请求的重复调用
    this.cancelPendingRequest(requestKey);

    // 创建 AbortController
    const controller = new AbortController();
    this.pendingRequests.set(requestKey, controller);

    // 构建查询参数
    let finalURL = fullURL;
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      finalURL = `${fullURL}?${queryString}`;
    }

    try {
      const fetchOptions = {
        method: method.toUpperCase(),
        headers: this.buildHeaders(headers),
        signal: controller.signal,
        credentials: 'include'
      };

      if (data) {
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(finalURL, fetchOptions);
      this.pendingRequests.delete(requestKey);

      // 处理响应
      if (!response.ok) {
        if (response.status === 401) {
          TokenManager.removeToken();
          window.location.href = '/login.html';
          throw new Error('登录已过期，请重新登录');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      this.pendingRequests.delete(requestKey);
      if (error.name === 'AbortError') {
        throw new Error('请求已取消');
      }
      throw error;
    }
  }

  // GET请求
  get(url, params = null, headers = {}) {
    return this.request({ method: 'GET', url, params, headers });
  }

  // POST请求
  post(url, data = null, headers = {}) {
    return this.request({ method: 'POST', url, data, headers });
  }

  // PUT请求
  put(url, data = null, headers = {}) {
    return this.request({ method: 'PUT', url, data, headers });
  }

  // DELETE请求
  delete(url, headers = {}) {
    return this.request({ method: 'DELETE', url, headers });
  }

  // 上传文件
  async upload(url, file, onProgress = null) {
    const fullURL = this.buildURL(url);
    const formData = new FormData();
    formData.append('file', file);

    const headers = {};
    const token = TokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(fullURL, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '上传失败');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

// 创建HTTP客户端实例
const http = new HttpClient();

// ============================================
// API服务 - 认证相关
// ============================================
const AuthAPI = {
  // 登录
  login(username, password) {
    return http.post('/auth/login', { username, password });
  },

  // 登出
  logout() {
    return http.post('/auth/logout');
  },

  // 获取当前用户信息
  getProfile() {
    return http.get('/auth/profile');
  },

  // 修改密码
  changePassword(oldPassword, newPassword) {
    return http.put('/auth/password', { oldPassword, newPassword });
  }
};

// ============================================
// API服务 - 活动管理
// ============================================
const ActivityAPI = {
  // 获取活动列表
  getList(params = {}) {
    return http.get('/activities', params);
  },

  // 获取活动详情
  getDetail(id) {
    return http.get(`/activities/${id}`);
  },

  // 创建活动
  create(data) {
    return http.post('/activities', data);
  },

  // 更新活动
  update(id, data) {
    return http.put(`/activities/${id}`, data);
  },

  // 删除活动
  delete(id) {
    return http.delete(`/activities/${id}`);
  },

  // 发布活动
  publish(id) {
    return http.post(`/activities/${id}/publish`);
  },

  // 停止活动
  stop(id) {
    return http.post(`/activities/${id}/stop`);
  }
};

// ============================================
// API服务 - 抽奖配置
// ============================================
const LotteryConfigAPI = {
  // 获取抽奖配置
  getConfig(activityId) {
    return http.get(`/activities/${activityId}/lottery-config`);
  },

  // 保存抽奖配置
  saveConfig(activityId, data) {
    return http.put(`/activities/${activityId}/lottery-config`, data);
  }
};

// ============================================
// API服务 - 奖品管理
// ============================================
const PrizeAPI = {
  // 获取奖品列表
  getList(activityId) {
    return http.get(`/activities/${activityId}/prizes`);
  },

  // 创建奖品
  create(activityId, data) {
    return http.post(`/activities/${activityId}/prizes`, data);
  },

  // 更新奖品
  update(id, data) {
    return http.put(`/prizes/${id}`, data);
  },

  // 删除奖品
  delete(id) {
    return http.delete(`/prizes/${id}`);
  },

  // 增加奖品库存
  addStock(id, num) {
    return http.post(`/prizes/${id}/add-stock`, { num });
  }
};

// ============================================
// API服务 - 奖池管理
// ============================================
const PrizePoolAPI = {
  // 获取奖池列表
  getList(activityId, params = {}) {
    return http.get(`/activities/${activityId}/prize-pool`, params);
  },

  // 创建奖池记录
  create(activityId, data) {
    return http.post(`/activities/${activityId}/prize-pool`, data);
  },

  // 更新奖池记录
  update(id, data) {
    return http.put(`/prize-pool/${id}`, data);
  },

  // 删除奖池记录
  delete(id) {
    return http.delete(`/prize-pool/${id}`);
  }
};

// ============================================
// API服务 - 页面管理
// ============================================
const PageAPI = {
  // 获取页面列表
  getList(activityId) {
    return http.get(`/activities/${activityId}/pages`);
  },

  // 创建页面
  create(activityId, data) {
    return http.post(`/activities/${activityId}/pages`, data);
  },

  // 更新页面
  update(id, data) {
    return http.put(`/pages/${id}`, data);
  },

  // 删除页面
  delete(id) {
    return http.delete(`/pages/${id}`);
  }
};

// ============================================
// API服务 - 组件管理
// ============================================
const ComponentAPI = {
  // 获取组件列表
  getList(pageId) {
    return http.get(`/pages/${pageId}/components`);
  },

  // 创建组件
  create(pageId, data) {
    return http.post(`/pages/${pageId}/components`, data);
  },

  // 更新组件
  update(id, data) {
    return http.put(`/components/${id}`, data);
  },

  // 删除组件
  delete(id) {
    return http.delete(`/components/${id}`);
  },

  // 批量更新组件排序
  updateSort(pageId, components) {
    return http.put(`/pages/${pageId}/components/sort`, { components });
  }
};

// ============================================
// API服务 - 数据统计
// ============================================
const StatisticsAPI = {
  // 获取首页统计数据
  getDashboardStats() {
    return http.get('/dashboard/stats');
  },

  // 获取活动统计数据
  getActivityStats(activityId) {
    return http.get(`/activities/${activityId}/stats`);
  },

  // 获取活动趋势数据
  getActivityTrend(activityId, params = {}) {
    return http.get(`/activities/${activityId}/trend`, params);
  }
};

// ============================================
// API服务 - 文件上传
// ============================================
const UploadAPI = {
  // 上传图片
  uploadImage(file, type = 'component', onProgress = null) {
    return http.upload(`/upload/image?type=${type}`, file, onProgress);
  },

  // 上传文件
  uploadFile(file, type = 'file', onProgress = null) {
    return http.upload(`/upload/file?type=${type}`, file, onProgress);
  }
};

// ============================================
// API服务 - 数据提交（C端）
// ============================================
const SubmissionAPI = {
  // 提交表单数据
  submit(activityId, data) {
    return http.post(`/submit/${activityId}`, data);
  },

  // 获取提交记录（B端）
  getSubmissions(activityId, params = {}) {
    return http.get(`/activities/${activityId}/submissions`, params);
  },

  // 导出提交记录
  exportSubmissions(activityId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    window.open(`${http.buildURL(`/activities/${activityId}/submissions/export?${queryString}`)}`, '_blank');
  }
};

// ============================================
// 导出所有API服务
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    http,
    TokenManager,
    AuthAPI,
    ActivityAPI,
    LotteryConfigAPI,
    PrizeAPI,
    PrizePoolAPI,
    PageAPI,
    ComponentAPI,
    StatisticsAPI,
    UploadAPI,
    SubmissionAPI
  };
}