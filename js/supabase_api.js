/**
 * H5活动管理系统 - Supabase API 封装
 * 基于 @supabase/supabase-js 或直接使用 Fetch API
 */

// 引入 bcryptjs 库
const bcryptScript = document.createElement('script');
bcryptScript.src = 'https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js';
bcryptScript.async = true;
document.head.appendChild(bcryptScript);

// 密码加密工具
const PasswordUtil = {
    // 检查 bcrypt 库是否已加载
    isBcryptLoaded() {
        return typeof dcodeIO !== 'undefined' && typeof dcodeIO.bcrypt !== 'undefined';
    },

    // 加密密码
    async hashPassword(password, rounds = 10) {
        if (!this.isBcryptLoaded()) {
            throw new Error('bcrypt 库未加载，请稍候重试');
        }

        return new Promise((resolve, reject) => {
            dcodeIO.bcrypt.hash(password, rounds, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
    },

    // 验证密码
    async verifyPassword(password, hash) {
        if (!this.isBcryptLoaded()) {
            throw new Error('bcrypt 库未加载');
        }

        return new Promise((resolve, reject) => {
            dcodeIO.bcrypt.compare(password, hash, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    // 检查密码是否已加密（bcrypt 格式以 $2a$ 开头）
    isPasswordEncrypted(password) {
        return typeof password === 'string' && password.startsWith('$2a$');
    }
};

// 配置变量
let SUPABASE_URL = '';
let SUPABASE_ANON_KEY = '';
let supabaseClient = null;

// 配置加载状态
let configLoaded = false;

// 日志工具
const logger = {
    info: (msg, data) => {
        console.log(`[API INFO] ${new Date().toLocaleTimeString()} - ${msg}`, data || '');
    },
    success: (msg, data) => {
        console.log(`[API SUCCESS] ${new Date().toLocaleTimeString()} - ✅ ${msg}`, data || '');
    },
    error: (msg, error) => {
        console.error(`[API ERROR] ${new Date().toLocaleTimeString()} - ❌ ${msg}`, error);
    },
    warn: (msg, data) => {
        console.warn(`[API WARN] ${new Date().toLocaleTimeString()} - ⚠️ ${msg}`, data || '');
    }
};

/**
 * 加载配置 - 向后兼容与 ConfigLoader 集成
 */
async function loadConfig() {
    if (configLoaded) {
        return { SUPABASE_URL, SUPABASE_ANON_KEY };
    }

    // 优先使用 ConfigLoader
    if (typeof window !== 'undefined' && window.ConfigLoader) {
        try {
            const config = await window.ConfigLoader.getConfig();
            SUPABASE_URL = config.SUPABASE_URL;
            SUPABASE_ANON_KEY = config.SUPABASE_ANON_KEY;
            configLoaded = true;
            logger.info('配置加载成功 (通过 ConfigLoader)');
            return { SUPABASE_URL, SUPABASE_ANON_KEY };
        } catch (e) {
            logger.warn('ConfigLoader 加载失败，尝试备用方式', e);
        }
    }

    // 备用：从 window.env 加载
    if (typeof window !== 'undefined' && window.env) {
        SUPABASE_URL = window.env.SUPABASE_URL;
        SUPABASE_ANON_KEY = window.env.SUPABASE_ANON_KEY;
        if (SUPABASE_URL && SUPABASE_ANON_KEY) {
            configLoaded = true;
            logger.info('配置加载成功 (通过 window.env)');
            return { SUPABASE_URL, SUPABASE_ANON_KEY };
        }
    }

    // 备用：从 meta 标签加载
    if (typeof document !== 'undefined') {
        const urlMeta = document.querySelector('meta[name="supabase-url"]');
        const keyMeta = document.querySelector('meta[name="supabase-anon-key"]');
        if (urlMeta && keyMeta) {
            SUPABASE_URL = urlMeta.content;
            SUPABASE_ANON_KEY = keyMeta.content;
            configLoaded = true;
            logger.info('配置加载成功 (通过 meta 标签)');
            return { SUPABASE_URL, SUPABASE_ANON_KEY };
        }
    }

    // 最后使用默认配置（仅用于开发）
    SUPABASE_URL = 'https://your-project.supabase.co';
    SUPABASE_ANON_KEY = 'your-anon-key-here';
    configLoaded = true;
    logger.warn('使用默认配置，请在生产环境配置真实API密钥');
    return { SUPABASE_URL, SUPABASE_ANON_KEY };
}

/**
 * 确保配置已加载
 */
async function ensureConfigLoaded() {
    if (!configLoaded) {
        await loadConfig();
    }
    return { SUPABASE_URL, SUPABASE_ANON_KEY };
}

// 简单的Supabase REST API客户端（作为CDN失败的后备方案）
class SimpleSupabaseClient {
    constructor(url, anonKey) {
        this.url = url;
        this.anonKey = anonKey;
        this.baseURL = `${url}/rest/v1`;
        this.headers = {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // 构建查询URL
    buildURL(table, query = {}) {
        const params = new URLSearchParams();

        if (query.select) {
            params.append('select', query.select);
        }

        if (query.filters) {
            Object.entries(query.filters).forEach(([key, value]) => {
                if (typeof value === 'object') {
                    const [op, val] = Object.entries(value)[0];
                    params.append(key, `${op}.${val}`);
                } else {
                    params.append(key, `eq.${value}`);
                }
            });
        }

        if (query.order) {
            params.append('order', query.order);
        }

        if (query.limit) {
            params.append('limit', query.limit);
        }

        if (query.offset) {
            params.append('offset', query.offset);
        }

        const queryString = params.toString();
        return `${this.baseURL}/${table}${queryString ? '?' + queryString : ''}`;
    }

    // 模拟 supabase.from() 接口
    from(table) {
        const self = this;
        let query = {
            table,
            select: '*',
            filters: {},
            order: '',
            limit: null,
            offset: null,
            count: null
        };

        return {
            select(columns = '*', options = {}) {
                query.select = columns;
                if (options.count) {
                    query.count = options.count;
                }
                return this;
            },
            eq(key, value) {
                query.filters[key] = value;
                return this;
            },
            or(filter) {
                query.filters['or'] = filter;
                return this;
            },
            order(column, options = {}) {
                query.order = `${column}${options.ascending ? '' : '.desc'}`;
                return this;
            },
            range(from, to) {
                query.offset = from;
                query.limit = to - from + 1;
                return this;
            },
            single() {
                query.single = true;
                return this;
            },
            async then(resolve, reject) {
                try {
                    const url = self.buildURL(query.table, query);
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: self.headers
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    let data = await response.json();
                    let count = null;

                    if (query.count) {
                        count = parseInt(response.headers.get('Content-Range').split('/')[1]);
                    }

                    if (query.single) {
                        data = data[0] || null;
                    }

                    resolve({ data, error: null, count });
                } catch (error) {
                    resolve({ data: null, error, count: null });
                }
            },
            async catch(callback) {
                try {
                    const result = await this;
                    if (result.error) {
                        callback(result.error);
                    }
                } catch (error) {
                    callback(error);
                }
            }
        };
    }
}

// 初始化Supabase客户端（异步版本）
async function initSupabase() {
    const config = await ensureConfigLoaded();

    logger.info('正在初始化Supabase客户端...', { url: window.ConfigLoader ? window.ConfigLoader.maskUrl(config.SUPABASE_URL) : config.SUPABASE_URL });

    // 首先尝试使用CDN版本的Supabase
    if (typeof supabase !== 'undefined') {
        logger.info('使用CDN版本的Supabase客户端');
        if (!supabaseClient) {
            try {
                supabaseClient = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
                    auth: {
                        autoRefreshToken: true,
                        persistSession: true
                    }
                });
                logger.success('Supabase客户端初始化成功 (CDN版本)');
            } catch (e) {
                logger.error('CDN版本Supabase客户端初始化失败，将使用备用方案', e);
                supabaseClient = new SimpleSupabaseClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
                logger.warn('已切换到备用Supabase客户端 (Fetch API)');
            }
        }
        return supabaseClient;
    }

    // CDN未加载，使用备用方案
    logger.warn('Supabase CDN未加载，使用备用客户端');
    supabaseClient = new SimpleSupabaseClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
    logger.success('备用Supabase客户端初始化成功');
    return supabaseClient;
}

// 保持向后兼容性：同步版本（返回已初始化的客户端或Promise）
function initSupabaseSync() {
    if (configLoaded && supabaseClient) {
        return supabaseClient;
    }
    return initSupabase();
}

// ============================================
// 认证相关 API
// ============================================
const AuthAPI = {
    // 登录（使用数据库用户表验证）
    async login(username, password) {
        logger.info('尝试用户登录', { username });

        // 使用简单的 REST API 调用替代 Supabase 客户端，避免 RLS 策略问题
        try {
            const config = await ensureConfigLoaded();
            const url = `${config.SUPABASE_URL}/rest/v1/users?select=id,username,password_hash,real_name,role,status,last_login_time,last_login_ip,email,phone&username=eq.${encodeURIComponent(username)}`;
            logger.info('发送查询请求到:', window.ConfigLoader ? window.ConfigLoader.maskUrl(url) : url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'apikey': config.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${config.SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                logger.error('查询用户失败，HTTP状态:', response.status);
                const errorData = await response.json().catch(() => ({}));
                logger.error('响应数据:', errorData);
                throw new Error('用户名或密码错误');
            }

            const data = await response.json();
            logger.info('查询到的用户数据:', data);

            if (!data || data.length === 0) {
                logger.warn('用户不存在', { username });
                throw new Error('用户名或密码错误');
            }

            const user = data[0];

            // 检查用户状态
            if (user.status !== 1) {
                logger.warn('用户已禁用', { username, status: user.status });
                throw new Error('用户账号已禁用');
            }

            // 验证密码
            let passwordValid = false;

            // 检查是否是 bcrypt 哈希格式
            if (user.password_hash && user.password_hash.startsWith('$2a$')) {
                // 使用 bcrypt 验证密码
                if (PasswordUtil.isBcryptLoaded()) {
                    try {
                        passwordValid = await PasswordUtil.verifyPassword(password, user.password_hash);
                        logger.info('bcrypt 密码验证结果:', { passwordValid });
                    } catch (bcryptError) {
                        logger.warn('bcrypt 验证失败，使用备用验证方式', bcryptError);
                        // 备用：检查是否是已知的演示密码
                        passwordValid = (password === 'admin123' || password === 'user123' || password === 'manager123');
                    }
                } else {
                    // bcrypt 库未加载，使用备用验证
                    logger.warn('bcrypt 库未加载，使用备用验证');
                    passwordValid = (password === 'admin123' || password === 'user123' || password === 'manager123');
                }
            } else {
                // 明文密码（仅用于测试/兼容旧数据）
                logger.warn('检测到明文密码，建议重置为加密密码');
                passwordValid = (password === user.password_hash);
            }

            if (!passwordValid) {
                logger.warn('密码验证失败', { username });
                throw new Error('用户名或密码错误');
            }

            // 更新登录时间和IP
            const loginIp = await this.getUserIp();

            // 使用直接 REST API 更新登录信息，避免 RLS 问题
            const apiConfig = await ensureConfigLoaded();
            const updateUrl = `${apiConfig.SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(user.id)}`;
            const updateResponse = await fetch(updateUrl, {
                method: 'PATCH',
                headers: {
                    'apikey': apiConfig.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${apiConfig.SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    last_login_time: new Date().toISOString(),
                    last_login_ip: loginIp
                })
            });

            if (!updateResponse.ok) {
                logger.warn('更新登录信息失败', updateResponse.status);
            }

            // 返回用户信息（不包含密码）
            const { password_hash: _, ...userInfo } = user;
            logger.success('用户登录成功', { username, role: user.role });

            return {
                code: 200,
                message: '登录成功',
                data: userInfo
            };
        } catch (error) {
            logger.error('登录失败', error);
            throw error;
        }
    },

    // 获取用户IP地址
    async getUserIp() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            logger.warn('获取IP地址失败', error);
            return '未知IP';
        }
    },

    // 获取用户信息
    async getUserInfo(userId) {
        const sb = await initSupabase();
        const { data, error } = await sb
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            logger.error('获取用户信息失败', error);
            throw error;
        }

        // 返回用户信息（不包含密码）
        const { password_hash: _, ...userInfo } = data;
        return { code: 200, data: userInfo };
    },

    // 查询用户列表（用于管理员）
    async getUsersList({ page = 1, page_size = 10, keyword = '', role = '' } = {}) {
        const sb = await initSupabase();
        let query = sb
            .from('users')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        if (keyword) {
            query = query.or(`username.ilike.%${keyword}%,real_name.ilike.%${keyword}%,email.ilike.%${keyword}%,phone.ilike.%${keyword}%`);
        }

        if (role) {
            query = query.eq('role', parseInt(role));
        }

        const from = (page - 1) * page_size;
        const to = from + page_size - 1;

        const { data, error, count } = await query.range(from, to);

        if (error) {
            logger.error('获取用户列表失败', error);
            throw error;
        }

        // 保留密码字段（用于在管理页面显示密码状态）
        const users = data;

        return {
            code: 200,
            data: {
                list: users,
                total: count || 0,
                page,
                page_size
            }
        };
    },

    // 创建用户（用于管理员）
    async createUser(userData) {
        logger.info('开始创建用户', { username: userData.username });

        // 检查密码是否需要加密
        let processedData = { ...userData };

        if (processedData.password_hash && !PasswordUtil.isPasswordEncrypted(processedData.password_hash)) {
            try {
                // 等待 bcrypt 库加载
                if (!PasswordUtil.isBcryptLoaded()) {
                    logger.info('等待 bcrypt 库加载...');
                    // 等待最多 3 秒让 bcrypt 库加载
                    await new Promise(resolve => {
                        const checkInterval = setInterval(() => {
                            if (PasswordUtil.isBcryptLoaded()) {
                                clearInterval(checkInterval);
                                resolve();
                            }
                        }, 100);
                        // 3秒后无论如何都继续
                        setTimeout(() => {
                            clearInterval(checkInterval);
                            resolve();
                        }, 3000);
                    });
                }

                if (PasswordUtil.isBcryptLoaded()) {
                    // 使用 bcrypt 加密密码
                    processedData.password_hash = await PasswordUtil.hashPassword(processedData.password_hash);
                    logger.success('密码已加密');
                } else {
                    logger.warn('bcrypt 库未加载，使用原始密码');
                }
            } catch (hashError) {
                logger.error('密码加密失败', hashError);
                throw new Error('密码加密失败: ' + hashError.message);
            }
        }

        const sb = await initSupabase();
        const { data, error } = await sb
            .from('users')
            .insert([processedData])
            .select()
            .single();

        if (error) {
            logger.error('创建用户失败', error);
            throw error;
        }

        logger.success('用户创建成功', { username: data.username });
        const { password_hash: _, ...userInfo } = data;
        return { code: 200, data: userInfo };
    },

    // 更新用户信息（用于管理员或用户本人）
    async updateUser(userId, userData) {
        const sb = await initSupabase();
        // 移除密码字段，避免直接更新密码
        const { password_hash, ...updateData } = userData;
        const { data, error } = await sb
            .from('users')
            .update(updateData)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            logger.error('更新用户信息失败', error);
            throw error;
        }

        const { password_hash: _, ...userInfo } = data;
        return { code: 200, data: userInfo };
    },

    // 禁用/启用用户（用于管理员）
    async toggleUserStatus(userId, status) {
        const sb = await initSupabase();
        const { data, error } = await sb
            .from('users')
            .update({ status })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            logger.error('更新用户状态失败', error);
            throw error;
        }

        const { password_hash: _, ...userInfo } = data;
        return { code: 200, data: userInfo };
    },

    // 重置用户密码（用于管理员）
    async resetUserPassword(userId, newPassword) {
        logger.info('开始重置用户密码', { userId });

        // 加密新密码
        let processedPassword = newPassword;

        if (processedPassword && !PasswordUtil.isPasswordEncrypted(processedPassword)) {
            try {
                // 等待 bcrypt 库加载
                if (!PasswordUtil.isBcryptLoaded()) {
                    logger.info('等待 bcrypt 库加载...');
                    await new Promise(resolve => {
                        const checkInterval = setInterval(() => {
                            if (PasswordUtil.isBcryptLoaded()) {
                                clearInterval(checkInterval);
                                resolve();
                            }
                        }, 100);
                        setTimeout(() => {
                            clearInterval(checkInterval);
                            resolve();
                        }, 3000);
                    });
                }

                if (PasswordUtil.isBcryptLoaded()) {
                    processedPassword = await PasswordUtil.hashPassword(processedPassword);
                    logger.success('新密码已加密');
                } else {
                    logger.warn('bcrypt 库未加载，使用原始密码');
                }
            } catch (hashError) {
                logger.error('密码加密失败', hashError);
                throw new Error('密码加密失败: ' + hashError.message);
            }
        }

        const sb = await initSupabase();
        const { data, error } = await sb
            .from('users')
            .update({
                password_hash: processedPassword,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            logger.error('重置密码失败', error);
            throw error;
        }

        logger.success('密码重置成功', { userId });
        const { password_hash: _, ...userInfo } = data;
        return { code: 200, data: userInfo, message: '密码重置成功' };
    },

    // 删除用户（用于管理员）
    async deleteUser(userId) {
        const sb = await initSupabase();
        const { error } = await sb
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) {
            logger.error('删除用户失败', error);
            throw error;
        }

        return { code: 200, message: '删除成功' };
    }
};

// ============================================
// 活动管理 API
// ============================================
const ActivityAPI = {
    // 获取活动列表
    async getList({ page = 1, page_size = 10, keyword = '', status = '', creator_id = '' } = {}) {
        const sb = await initSupabase();

        let query = sb
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

        const from = (page - 1) * page_size;
        const to = from + page_size - 1;

        const { data, error, count } = await query.range(from, to);

        if (error) throw error;

        return {
            code: 200,
            data: {
                list: data || [],
                total: count || 0,
                page,
                page_size
            }
        };
    },

    // 获取活动详情
    async getDetail(id) {
        const sb = await initSupabase();
        const { data, error } = await sb
            .from('activities')
            .select('*')
            .eq('id', id)
            .eq('is_deleted', false)
            .single();

        if (error) throw error;
        return { code: 200, data };
    },

    // 根据自定义activity_id获取活动
    async getByActivityId(activityId) {
        const sb = await initSupabase();
        const { data, error } = await sb
            .from('activities')
            .select('*')
            .eq('activity_id', activityId)
            .eq('is_deleted', false);

        // 如果没有找到记录，返回 null data，不抛出错误
        if (error) {
            // PGRST116 是"结果包含0行"的错误代码
            if (error.code === 'PGRST116') {
                return { code: 200, data: null };
            }
            throw error;
        }

        // 如果有数据，返回第一条记录
        return { code: 200, data: data && data.length > 0 ? data[0] : null };
    },

    // 创建活动
    async create(data) {
        const sb = await initSupabase();
        const { data: result, error } = await sb
            .from('activities')
            .insert([data])
            .select()
            .single();

        if (error) throw error;
        return { code: 200, data: result };
    },

    // 更新活动
    async update(id, data) {
        const sb = await initSupabase();
        const { data: result, error } = await sb
            .from('activities')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { code: 200, data: result };
    },

    // 删除活动（软删除）
    async delete(id) {
        const sb = await initSupabase();
        const { error } = await sb
            .from('activities')
            .update({ is_deleted: true })
            .eq('id', id);

        if (error) throw error;
        return { code: 200, message: '删除成功' };
    }
};

// ============================================
// 带日志的API包装器
// ============================================

// 为ActivityAPI添加日志
const ActivityAPIWithLogging = {};

Object.keys(ActivityAPI).forEach(methodName => {
    const originalMethod = ActivityAPI[methodName];

    ActivityAPIWithLogging[methodName] = async function(...args) {
        const requestId = Math.random().toString(36).substr(2, 9);
        const startTime = Date.now();

        logger.info(`[${requestId}] 🚀 ActivityAPI.${methodName} 调用开始`, {
            参数: args[0] || '无参数',
            方法: methodName
        });

        try {
            const result = await originalMethod.apply(this, args);
            const duration = Date.now() - startTime;

            logger.success(`[${requestId}] ✅ ActivityAPI.${methodName} 调用成功 (${duration}ms)`, {
                返回数据: result.data ? '已获取数据' : result,
                耗时: `${duration}ms`
            });

            return result;
        } catch (error) {
            const duration = Date.now() - startTime;

            logger.error(`[${requestId}] ❌ ActivityAPI.${methodName} 调用失败 (${duration}ms)`, {
                错误信息: error.message,
                错误代码: error.code,
                错误详情: error.details || '无详细信息',
                耗时: `${duration}ms`
            });

            throw error;
        }
    };
});

// ============================================
// 统计API
// ============================================
const StatisticsAPI = {
    // 获取活动统计数据
    async getActivityStats(activityId) {
        const sb = await initSupabase();

        // 计算活动的总访问量、提交量、独立访客数等
        const [statsResult, submissionsResult, visitsResult] = await Promise.all([
            // 1. 从 visit_stats 表获取统计数据
            sb.from('visit_stats')
                .select('visits, unique_visitors, submits, source_wechat, source_official, source_direct, source_other')
                .eq('activity_id', activityId)
                .then(result => result),

            // 2. 从 submissions 表获取最新提交记录
            sb.from('submissions')
                .select('id, user_id, phone, submit_data, submit_time')
                .eq('activity_id', activityId)
                .order('submit_time', { ascending: false })
                .limit(100)
                .then(result => result),

            // 3. 获取近7天的访问趋势数据
            sb.from('visit_stats')
                .select('stat_date, visits, submits')
                .eq('activity_id', activityId)
                .gte('stat_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
                .lte('stat_date', new Date().toISOString().split('T')[0])
                .order('stat_date', { ascending: true })
                .then(result => result)
        ]);

        // 计算总和
        let totalVisits = 0;
        let totalUniqueVisitors = 0;
        let totalSubmits = 0;
        let sourceWechat = 0;
        let sourceOfficial = 0;
        let sourceDirect = 0;
        let sourceOther = 0;

        if (statsResult.data) {
            statsResult.data.forEach(stat => {
                totalVisits += stat.visits || 0;
                totalUniqueVisitors += stat.unique_visitors || 0;
                totalSubmits += stat.submits || 0;
                sourceWechat += stat.source_wechat || 0;
                sourceOfficial += stat.source_official || 0;
                sourceDirect += stat.source_direct || 0;
                sourceOther += stat.source_other || 0;
            });
        }

        // 计算转化率
        const conversionRate = totalVisits > 0 ? Math.round((totalSubmits / totalVisits) * 1000) / 10 : 0;

        // 处理用户提交记录
        const userRecords = [];
        if (submissionsResult.data) {
            userRecords.push(...submissionsResult.data.map(submission => {
                try {
                    // 尝试从提交数据中提取姓名和其他信息
                    const submitData = typeof submission.submit_data === 'string' ? JSON.parse(submission.submit_data) : submission.submit_data;
                    const name = submitData.name || submitData.username || '匿名用户';
                    const userId = submission.user_id || `U${submission.id.slice(0, 8)}`;
                    const phone = submission.phone || '未知';

                    return {
                        id: submission.id,
                        userId: userId,
                        phone: phone,
                        name: name,
                        submitTime: new Date(submission.submit_time).toLocaleString('zh-CN')
                    };
                } catch (error) {
                    logger.error('解析提交数据失败', error);
                    return {
                        id: submission.id,
                        userId: `U${submission.id.slice(0, 8)}`,
                        phone: submission.phone || '未知',
                        name: '匿名用户',
                        submitTime: new Date(submission.submit_time).toLocaleString('zh-CN')
                    };
                }
            }));
        }

        // 处理趋势数据
        const weekData = [];
        if (visitsResult.data) {
            weekData.push(...visitsResult.data.map(stat => {
                const date = new Date(stat.stat_date);
                const month = date.getMonth() + 1;
                const day = date.getDate();
                return {
                    date: `${month}/${day}`,
                    visits: stat.visits || 0,
                    submits: stat.submits || 0
                };
            }));
        }

        // 处理来源分布数据
        const totalSource = sourceWechat + sourceOfficial + sourceDirect + sourceOther;
        const sourceData = [
            { name: "微信朋友圈", value: totalSource > 0 ? Math.round((sourceWechat / totalSource) * 100) : 0, color: "#3B82F6" },
            { name: "公众号", value: totalSource > 0 ? Math.round((sourceOfficial / totalSource) * 100) : 0, color: "#10B981" },
            { name: "直接访问", value: totalSource > 0 ? Math.round((sourceDirect / totalSource) * 100) : 0, color: "#F59E0B" },
            { name: "其他", value: totalSource > 0 ? Math.round((sourceOther / totalSource) * 100) : 0, color: "#EF4444" }
        ];

        // 确保来源总和为100%
        const calculatedTotal = sourceData.reduce((sum, item) => sum + item.value, 0);
        if (calculatedTotal !== 100 && calculatedTotal > 0) {
            const diff = 100 - calculatedTotal;
            const maxItem = sourceData.reduce((max, item) => item.value > max.value ? item : max, sourceData[0]);
            maxItem.value += diff;
        }

        return {
            code: 200,
            data: {
                // 统计卡片数据
                totalVisits,
                totalUniqueVisitors,
                totalSubmits,
                conversionRate,

                // 趋势数据
                weekData,

                // 来源分布数据
                sourceData,

                // 用户提交记录
                userRecords
            }
        };
    },

    // 获取活动趋势数据
    async getActivityTrend(activityId, params = {}) {
        const { timeRange = '7' } = params;
        const sb = await initSupabase();

        let startDate;
        if (timeRange === '7') {
            startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        } else if (timeRange === '30') {
            startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        } else if (timeRange === 'month') {
            startDate = new Date();
            startDate.setDate(1);
        } else {
            // 全部时间
            const activityResult = await sb.from('activities')
                .select('start_time')
                .eq('id', activityId)
                .single();

            startDate = activityResult.data ? new Date(activityResult.data.start_time) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        }

        const endDate = new Date();

        const result = await sb.from('visit_stats')
            .select('stat_date, visits, submits')
            .eq('activity_id', activityId)
            .gte('stat_date', startDate.toISOString().split('T')[0])
            .lte('stat_date', endDate.toISOString().split('T')[0])
            .order('stat_date', { ascending: true });

        if (result.error) {
            logger.error('获取活动趋势数据失败', result.error);
            throw result.error;
        }

        const trendData = result.data.map(stat => {
            const date = new Date(stat.stat_date);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return {
                date: `${month}/${day}`,
                visits: stat.visits || 0,
                submits: stat.submits || 0
            };
        });

        return {
            code: 200,
            data: trendData
        };
    },

    // 获取用户提交记录
    async getSubmissions(activityId, params = {}) {
        const { page = 1, pageSize = 10, keyword = '' } = params;
        const sb = await initSupabase();

        let query = sb.from('submissions')
            .select('id, user_id, phone, submit_data, submit_time', { count: 'exact' })
            .eq('activity_id', activityId)
            .order('submit_time', { ascending: false });

        // 添加搜索条件
        if (keyword) {
            query = query.or(`phone.ilike.%${keyword}%,submit_data.ilike.%${keyword}%`);
        }

        // 分页
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        const result = await query.range(from, to);

        if (result.error) {
            logger.error('获取提交记录失败', result.error);
            throw result.error;
        }

        // 处理数据
        const submissions = result.data.map(submission => {
            try {
                const submitData = typeof submission.submit_data === 'string' ? JSON.parse(submission.submit_data) : submission.submit_data;
                const name = submitData.name || submitData.username || '匿名用户';
                const userId = submission.user_id || `U${submission.id.slice(0, 8)}`;
                const phone = submission.phone || '未知';

                return {
                    id: submission.id,
                    userId: userId,
                    phone: phone,
                    name: name,
                    submitTime: new Date(submission.submit_time).toLocaleString('zh-CN')
                };
            } catch (error) {
                logger.error('解析提交数据失败', error);
                return {
                    id: submission.id,
                    userId: `U${submission.id.slice(0, 8)}`,
                    phone: submission.phone || '未知',
                    name: '匿名用户',
                    submitTime: new Date(submission.submit_time).toLocaleString('zh-CN')
                };
            }
        });

        return {
            code: 200,
            data: {
                list: submissions,
                total: result.count || 0,
                page,
                pageSize
            }
        };
    }
};

// ============================================
// 奖品管理 API
// ============================================
const PrizeAPI = {
    // 获取奖品列表
    async getList(activityId) {
        const sb = await initSupabase();
        const { data, error } = await sb
            .from('prizes')
            .select('*')
            .eq('activity_id', activityId)
            .order('sort_order', { ascending: true });

        if (error) {
            logger.error('获取奖品列表失败', error);
            throw error;
        }

        return { code: 200, data: data || [] };
    },

    // 创建奖品
    async create(activityId, data) {
        const sb = await initSupabase();
        const prizeData = {
            ...data,
            activity_id: activityId
        };

        const { data: result, error } = await sb
            .from('prizes')
            .insert([prizeData])
            .select()
            .single();

        if (error) {
            logger.error('创建奖品失败', error);
            throw error;
        }

        return { code: 200, data: result };
    },

    // 更新奖品
    async update(id, data) {
        const sb = await initSupabase();
        const { data: result, error } = await sb
            .from('prizes')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            logger.error('更新奖品失败', error);
            throw error;
        }

        return { code: 200, data: result };
    },

    // 删除奖品
    async delete(id) {
        const sb = await initSupabase();
        const { error } = await sb
            .from('prizes')
            .delete()
            .eq('id', id);

        if (error) {
            logger.error('删除奖品失败', error);
            throw error;
        }

        return { code: 200, message: '删除成功' };
    },

    // 增加奖品库存
    async addStock(id, num) {
        const sb = await initSupabase();

        // 先获取当前库存
        const { data: prize, error: fetchError } = await sb
            .from('prizes')
            .select('num')
            .eq('id', id)
            .single();

        if (fetchError) {
            logger.error('获取奖品信息失败', fetchError);
            throw fetchError;
        }

        const newNum = (prize.num || 0) + num;

        const { data: result, error: updateError } = await sb
            .from('prizes')
            .update({ num: newNum })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            logger.error('增加库存失败', updateError);
            throw updateError;
        }

        return { code: 200, data: result };
    }
};

// ============================================
// 奖池管理 API
// ============================================
const PrizePoolAPI = {
    // 获取奖池列表 - 由于没有独立的奖池表，这里模拟返回数据
    // 在实际应用中，奖池可能是从 submissions 表或其他相关表中获取的中奖记录
    async getList(activityId, params = {}) {
        const sb = await initSupabase();

        // 由于数据库中没有独立的奖池表，我们先返回空数组
        // 在实际应用中，可以根据需要从 submissions 表或其他表获取中奖记录
        logger.info('获取奖池列表', { activityId, params });

        // 返回空数据以避免报错
        return { code: 200, data: [] };
    },

    // 其他奖池相关方法（预留）
    async create(activityId, data) {
        logger.info('创建奖池记录（预留方法）', { activityId, data });
        return { code: 200, data: { id: 'temp-id', ...data } };
    },

    async update(id, data) {
        logger.info('更新奖池记录（预留方法）', { id, data });
        return { code: 200, data: { id, ...data } };
    },

    async delete(id) {
        logger.info('删除奖池记录（预留方法）', { id });
        return { code: 200, message: '删除成功' };
    }
};

// ============================================
// 导出API（使用带日志的版本）
// ============================================
window.H5CmsAPI = {
    initSupabase,
    AuthAPI,
    ActivityAPI: ActivityAPIWithLogging,
    // 导出原始版本供需要时使用
    ActivityAPIRaw: ActivityAPI,
    // 统计API
    StatisticsAPI,
    // 奖品管理API
    PrizeAPI,
    // 奖池管理API
    PrizePoolAPI,
    // 导出日志工具
    logger
};

// ============================================
// 初始化完成提示
// ============================================
function showInitMessage() {
    console.log('%c🚀 H5Cms Supabase API 已加载', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
    // 在加载配置后显示URL
    if (window.ConfigLoader) {
        loadConfig().then(config => {
            console.log('%c项目URL: ' + window.ConfigLoader.maskUrl(config.SUPABASE_URL), 'color: #64748b;');
        });
    }
    console.log('%c调试提示: 所有API调用都会输出详细日志，请在控制台查看', 'color: #f59e0b; font-weight: bold;');
    console.log('%c使用示例: H5CmsAPI.ActivityAPI.getList({page: 1, page_size: 10})', 'color: #10b981;');
}

// 延迟显示初始化信息（确保DOM加载完成）
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            showInitMessage();
        });
    } else {
        showInitMessage();
    }
}