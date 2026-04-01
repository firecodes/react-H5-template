/**
 * H5活动管理系统 - 配置加载器
 * 安全地从多个来源加载API配置，避免硬编码敏感信息
 */

const ConfigLoader = {
    // 配置缓存
    config: null,

    // 配置状态跟踪
    configSource: null,

    /**
     * 初始化配置 - 按优先级从多个来源加载
     * 优先级: 1. window.env  2. meta标签  3. localStorage  4. 默认值
     */
    async init() {
        if (this.config) {
            return this.config;
        }

        try {
            const sources = [
                { name: 'window.env', loader: this.loadFromWindowEnv },
                { name: 'meta tags', loader: this.loadFromMetaTags },
                { name: 'localStorage', loader: this.loadFromLocalStorage },
                { name: 'default', loader: this.getDefaultConfig }
            ];

            for (const source of sources) {
                try {
                    const config = await source.loader.call(this);
                    if (this.isValidConfig(config)) {
                        this.config = config;
                        this.configSource = source.name;
                        console.log(`✅ 配置加载成功 (来源: ${source.name})`);
                        return this.config;
                    }
                } catch (e) {
                    console.debug(`尝试从 ${source.name} 加载配置失败:`, e.message);
                }
            }

            // 最后使用默认配置
            this.config = this.getDefaultConfig();
            this.configSource = 'default';
            console.warn('⚠️  使用默认配置，请在生产环境配置真实API密钥');

        } catch (error) {
            console.error('❌ 配置加载失败:', error);
            this.config = this.getDefaultConfig();
            this.configSource = 'default';
        }

        return this.config;
    },

    /**
     * 从 window.env 加载配置（推荐用于生产环境）
     */
    async loadFromWindowEnv() {
        if (typeof window === 'undefined' || !window.env) {
            throw new Error('window.env 未定义');
        }

        const config = {
            SUPABASE_URL: window.env.SUPABASE_URL,
            SUPABASE_ANON_KEY: window.env.SUPABASE_ANON_KEY,
            API_BASE_URL: window.env.API_BASE_URL || '/api/v1',
            NODE_ENV: window.env.NODE_ENV || 'production'
        };

        if (!this.isValidConfig(config)) {
            throw new Error('window.env 配置不完整');
        }

        return config;
    },

    /**
     * 从 meta 标签加载配置
     */
    async loadFromMetaTags() {
        if (typeof document === 'undefined') {
            throw new Error('document 未定义');
        }

        const supabaseUrlMeta = document.querySelector('meta[name="supabase-url"]');
        const supabaseAnonKeyMeta = document.querySelector('meta[name="supabase-anon-key"]');

        if (!supabaseUrlMeta || !supabaseAnonKeyMeta) {
            throw new Error('未找到 meta 标签配置');
        }

        const config = {
            SUPABASE_URL: supabaseUrlMeta.content,
            SUPABASE_ANON_KEY: supabaseAnonKeyMeta.content,
            API_BASE_URL: '/api/v1',
            NODE_ENV: this.detectEnvironment()
        };

        if (!this.isValidConfig(config)) {
            throw new Error('meta 标签配置不完整');
        }

        return config;
    },

    /**
     * 从 localStorage 加载配置（仅用于开发环境）
     */
    async loadFromLocalStorage() {
        if (typeof localStorage === 'undefined') {
            throw new Error('localStorage 未定义');
        }

        const supabaseUrl = localStorage.getItem('h5cms_supabase_url');
        const supabaseAnonKey = localStorage.getItem('h5cms_supabase_anon_key');

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('localStorage 中未找到配置');
        }

        const config = {
            SUPABASE_URL: supabaseUrl,
            SUPABASE_ANON_KEY: supabaseAnonKey,
            API_BASE_URL: '/api/v1',
            NODE_ENV: this.detectEnvironment()
        };

        if (!this.isValidConfig(config)) {
            throw new Error('localStorage 配置不完整');
        }

        return config;
    },

    /**
     * 获取默认配置（占位符）
     */
    getDefaultConfig() {
        return {
            SUPABASE_URL: 'https://your-project.supabase.co',
            SUPABASE_ANON_KEY: 'your-anon-key-here',
            API_BASE_URL: '/api/v1',
            NODE_ENV: this.detectEnvironment()
        };
    },

    /**
     * 检测当前环境
     */
    detectEnvironment() {
        if (typeof window === 'undefined') {
            return 'development';
        }

        const hostname = window.location.hostname;

        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
            return 'development';
        }

        if (hostname.includes('staging') || hostname.includes('test')) {
            return 'staging';
        }

        return 'production';
    },

    /**
     * 验证配置是否有效
     */
    isValidConfig(config) {
        if (!config) return false;
        if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) return false;

        // 检查是否是默认配置（无效配置）
        const isDefault = config.SUPABASE_URL === 'https://your-project.supabase.co' ||
                         config.SUPABASE_ANON_KEY === 'your-anon-key-here';

        return !isDefault;
    },

    /**
     * 检查是否已正确配置（非默认配置）
     */
    async isConfigured() {
        const config = await this.getConfig();
        return this.isValidConfig(config);
    },

    /**
     * 获取完整配置
     */
    async getConfig() {
        if (!this.config) {
            await this.init();
        }
        return this.config;
    },

    /**
     * 获取特定配置项
     */
    async get(key, defaultValue = null) {
        const config = await this.getConfig();
        return config[key] !== undefined ? config[key] : defaultValue;
    },

    /**
     * 保存配置到 localStorage（仅用于开发环境）
     */
    async saveToLocalStorage(supabaseUrl, supabaseAnonKey) {
        if (typeof localStorage === 'undefined') {
            throw new Error('localStorage 不可用');
        }

        if (supabaseUrl) {
            localStorage.setItem('h5cms_supabase_url', supabaseUrl);
        }
        if (supabaseAnonKey) {
            localStorage.setItem('h5cms_supabase_anon_key', supabaseAnonKey);
        }

        // 清除缓存，重新加载
        this.config = null;
        await this.init();
    },

    /**
     * 清除 localStorage 中的配置
     */
    async clearLocalStorage() {
        if (typeof localStorage === 'undefined') {
            return;
        }

        localStorage.removeItem('h5cms_supabase_url');
        localStorage.removeItem('h5cms_supabase_anon_key');

        // 清除缓存，重新加载
        this.config = null;
        await this.init();
    },

    /**
     * 获取配置状态信息（用于调试）
     */
    async getStatus() {
        const config = await this.getConfig();
        return {
            configured: this.isValidConfig(config),
            source: this.configSource,
            environment: config.NODE_ENV,
            supabaseUrl: this.maskUrl(config.SUPABASE_URL),
            supabaseKey: this.maskKey(config.SUPABASE_ANON_KEY)
        };
    },

    /**
     * 掩码 URL（用于日志输出，避免泄露完整信息）
     */
    maskUrl(url) {
        if (!url || url === 'https://your-project.supabase.co') {
            return url;
        }
        try {
            const parsed = new URL(url);
            return `${parsed.protocol}//***.supabase.co`;
        } catch {
            return '***';
        }
    },

    /**
     * 掩码 API 密钥（用于日志输出）
     */
    maskKey(key) {
        if (!key || key === 'your-anon-key-here') {
            return key;
        }
        if (key.length <= 8) {
            return '***';
        }
        return key.substring(0, 8) + '...' + key.substring(key.length - 4);
    },

    /**
     * 验证并返回 Supabase 配置
     * 与现有代码向后兼容
     */
    async getSupabaseConfig() {
        const config = await this.getConfig();
        return {
            url: config.SUPABASE_URL,
            anonKey: config.SUPABASE_ANON_KEY
        };
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigLoader;
} else {
    // 浏览器环境
    window.ConfigLoader = ConfigLoader;

    // 自动初始化（延迟执行，确保DOM加载完成）
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                ConfigLoader.init().catch(console.error);
            });
        } else {
            ConfigLoader.init().catch(console.error);
        }
    }
}
