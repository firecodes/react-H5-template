import React from "react";
import { Button, Space } from "antd-mobile";
import { useLanguage } from "@/hooks/useLanguage";

interface LanguageSwitcherProps {
  type?: "button" | "list";
  onLanguageChange?: (language: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  type = "button",
  onLanguageChange 
}) => {
  const { currentLanguage, changeLanguage, t } = useLanguage();

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    onLanguageChange?.(lang);
  };

  if (type === "list") {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">{t('language.switchLanguage')}</h3>
        </div>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
              currentLanguage === 'zh-CN' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleLanguageChange('zh-CN')}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">🇨🇳</span>
              <span className="text-gray-800">{t('language.chinese')}</span>
            </div>
            {currentLanguage === 'zh-CN' && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
          <div
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
              currentLanguage === 'en-US' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleLanguageChange('en-US')}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">🇺🇸</span>
              <span className="text-gray-800">{t('language.english')}</span>
            </div>
            {currentLanguage === 'en-US' && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </Space>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        size="small"
        color={currentLanguage === 'zh-CN' ? 'primary' : 'default'}
        onClick={() => handleLanguageChange('zh-CN')}
        style={{ minWidth: '60px' }}
      >
        中文
      </Button>
      <Button
        size="small"
        color={currentLanguage === 'en-US' ? 'primary' : 'default'}
        onClick={() => handleLanguageChange('en-US')}
        style={{ minWidth: '60px' }}
      >
        EN
      </Button>
    </div>
  );
};

export default LanguageSwitcher; 