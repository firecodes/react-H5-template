(function() {
    'use strict';

    window.env = {
        // 这些占位符会在 CI/CD 部署时被替换
        SUPABASE_URL: '{{SUPABASE_URL}}',
        SUPABASE_ANON_KEY: '{{SUPABASE_ANON_KEY}}',
        API_BASE_URL: '/api/v1',
        NODE_ENV: 'production',
        DEBUG: false
    };

    console.log('✅ 配置文件已加载 (动态生成)');
})();
