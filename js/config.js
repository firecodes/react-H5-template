/**
 * H5活动管理系统 - 配置文件
 * ⚠️  重要提示：此文件已添加到 .gitignore，不会被提交到代码仓库
 *
 * 使用说明：
 * 1. 登录 Supabase 控制台获取您的项目配置
 * 2. 替换下方的占位符为您的实际配置
 * 3. 保存文件后刷新页面即可生效
 */

(function() {
    'use strict';

    /**
     * 配置对象
     * 请填入您的实际配置信息
     */
    window.env = {
        // ==================== 必填配置 ====================
        // Supabase 项目 URL
        // 从 Supabase 控制台 → Project Settings → API 获取
        SUPABASE_URL: 'https://zaeuorgoswepodfbyplz.supabase.co',

        // Supabase 匿名/公钥
        // 从 Supabase 控制台 → Project Settings → API 获取 (anon/public)
        SUPABASE_ANON_KEY: 'sb_publishable_9EDCNmB5HdsvDSyChLDjgg_kUr-g20h',

        // ==================== 可选配置 ====================
        // API 基础路径
        API_BASE_URL: '/api/v1',

        // 环境标识 (development/production/staging)
        NODE_ENV: 'development',

        // 调试模式 (生产环境请设为 false)
        DEBUG: true
    };

    console.log('✅ 配置文件已加载');
})();
