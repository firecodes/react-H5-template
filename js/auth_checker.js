/**
 * H5活动管理系统 - 权限检查和登录状态管理
 * 每个页面都需要引入此脚本进行权限检查
 */

// --- 登录状态管理 ---
const LoginManager = {
  // 保存登录信息（含过期时间）
  saveLoginInfo(userData) {
    const loginInfo = {
      user: userData,
      loginTime: new Date().getTime(),
      expiresIn: 24 * 60 * 60 * 1000 // 24小时
    };
    localStorage.setItem('h5cms_login_info', JSON.stringify(loginInfo));
  },

  // 获取登录信息
  getLoginInfo() {
    const loginInfo = localStorage.getItem('h5cms_login_info');
    if (!loginInfo) return null;

    try {
      const parsed = JSON.parse(loginInfo);
      const now = new Date().getTime();

      // 检查是否过期
      if (now - parsed.loginTime > parsed.expiresIn) {
        this.clearLoginInfo();
        return null;
      }

      return parsed;
    } catch (error) {
      console.error('解析登录信息失败:', error);
      this.clearLoginInfo();
      return null;
    }
  },

  // 清除登录信息
  clearLoginInfo() {
    localStorage.removeItem('h5cms_login_info');
    localStorage.removeItem('h5cms_token');
  },

  // 检查是否已登录且未过期
  isLoggedIn() {
    const loginInfo = this.getLoginInfo();
    return !!loginInfo?.user;
  },

  // 获取用户权限
  getUserRole() {
    const loginInfo = this.getLoginInfo();
    return loginInfo?.user?.role || 'user'; // 默认用户
  },

  // 获取用户信息
  getUserInfo() {
    const loginInfo = this.getLoginInfo();
    return loginInfo?.user || null;
  },

  // 检查是否是管理员
  isAdmin() {
    return this.getUserRole() === 'admin';
  },

  // 检查是否是普通用户
  isUser() {
    return this.getUserRole() === 'user';
  },

  // 获取剩余登录时间（分钟）
  getRemainingTime() {
    const loginInfo = this.getLoginInfo();
    if (!loginInfo) return 0;

    const now = new Date().getTime();
    const remaining = loginInfo.loginTime + loginInfo.expiresIn - now;
    return Math.max(0, Math.floor(remaining / (1000 * 60)));
  },

  // 刷新登录时间（续期）
  refreshLoginTime() {
    const loginInfo = this.getLoginInfo();
    if (loginInfo) {
      loginInfo.loginTime = new Date().getTime();
      localStorage.setItem('h5cms_login_info', JSON.stringify(loginInfo));
    }
  }
};

// --- 页面权限检查 ---
class PageAuthChecker {
  constructor(options = {}) {
    this.options = {
      redirectTo: 'login.html',
      requireAuth: true,
      allowedRoles: ['user', 'admin'],
      checkInterval: 5 * 60 * 1000, // 5分钟检查一次
      ...options
    };

    this.checkTimer = null;
  }

  // 初始化权限检查
  init() {
    this.checkAuth();
    this.startPeriodicCheck();
  }

  // 检查权限
  checkAuth() {
    // 如果页面不需要认证，直接返回
    if (!this.options.requireAuth) {
      console.log('页面不需要认证');
      return true;
    }

    // 检查登录状态
    const isLoggedIn = LoginManager.isLoggedIn();
    const loginInfo = LoginManager.getLoginInfo();
    console.log('=== 权限检查开始 ===');
    console.log('是否已登录:', isLoggedIn);
    console.log('完整登录信息:', loginInfo);

    if (!isLoggedIn) {
      console.log('未登录，重定向到登录页');
      this.redirectToLogin();
      return false;
    }

    // 检查用户角色
    const userRole = LoginManager.getUserRole();
    const userInfo = LoginManager.getUserInfo();
    console.log('用户信息:', userInfo);
    console.log('用户角色:', userRole);
    console.log('允许角色:', this.options.allowedRoles);
    console.log('用户角色类型:', typeof userRole);
    console.log('允许角色类型:', this.options.allowedRoles.map(r => typeof r));
    console.log('是否包含角色:', this.options.allowedRoles.includes(userRole));

    if (!this.options.allowedRoles.includes(userRole)) {
      console.error(`用户角色 ${userRole} 无权限访问此页面`);
      console.error('允许的角色列表:', this.options.allowedRoles);
      this.redirectToLogin();
      return false;
    }

    // 刷新登录时间
    LoginManager.refreshLoginTime();

    console.log(`用户 ${LoginManager.getUserInfo().username} (${userRole}) 权限检查通过，剩余登录时间: ${LoginManager.getRemainingTime()} 分钟`);
    return true;
  }

  // 定期检查
  startPeriodicCheck() {
    if (this.options.checkInterval > 0) {
      this.checkTimer = setInterval(() => {
        console.log('定期检查登录状态...');
        this.checkAuth();
      }, this.options.checkInterval);
    }
  }

  // 停止定期检查
  stopPeriodicCheck() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
  }

  // 重定向到登录页
  redirectToLogin() {
    // 清除定时器
    this.stopPeriodicCheck();

    // 清除登录信息
    LoginManager.clearLoginInfo();

    // 重定向
    const currentPath = encodeURIComponent(window.location.pathname);
    window.location.href = `${this.options.redirectTo}?redirect=${currentPath}`;
  }

  // 登出
  logout() {
    this.stopPeriodicCheck();
    LoginManager.clearLoginInfo();
    window.location.href = this.options.redirectTo;
  }

  // 获取用户信息
  getUserInfo() {
    return LoginManager.getUserInfo();
  }

  // 检查用户是否有特定权限
  hasRole(role) {
    return this.options.allowedRoles.includes(role);
  }
}

// --- 页面初始化函数 ---
function initPageAuth(options = {}) {
  // 单例模式：如果已经有实例，直接返回，避免重复初始化
  if (window.pageAuthInstance) {
    console.log('权限检查器实例已存在，直接返回');
    return window.pageAuthInstance;
  }

  const authChecker = new PageAuthChecker(options);
  authChecker.init();
  window.pageAuthInstance = authChecker;
  return authChecker;
}

// --- 全局工具函数 ---
window.PageAuthChecker = PageAuthChecker;
window.initPageAuth = initPageAuth;
window.LoginManager = LoginManager;

// 保存全局权限检查器实例
window.pageAuthInstance = null;

// --- 自动初始化 ---
document.addEventListener('DOMContentLoaded', () => {
  console.log('=== 页面权限初始化 ===');
  // 检查是否需要自动初始化
  const authMeta = document.querySelector('meta[name="requires-auth"]');
  if (authMeta) {
    const requireAuth = authMeta.content !== 'false';
    const allowedRolesMeta = document.querySelector('meta[name="allowed-roles"]');
    const allowedRolesRaw = allowedRolesMeta ? allowedRolesMeta.content : null;
    const allowedRoles = allowedRolesRaw?.split(',').map(role => role.trim()).filter(role => role) || ['user', 'admin'];
    const redirectToMeta = document.querySelector('meta[name="redirect-to"]');
    const redirectTo = redirectToMeta ? redirectToMeta.content : 'login.html';

    console.log('Meta 标签 allowed-roles:', allowedRolesRaw);
    console.log('解析后的 allowedRoles:', allowedRoles);

    initPageAuth({
      requireAuth,
      allowedRoles,
      redirectTo
    });
  }
});

console.log('%c✅ 权限检查系统已加载', 'font-size: 16px; font-weight: bold; color: #3b82f6;');
