// 主题配置文件
// 提供全局主题变量和动画效果

export const themeConfig = {
  // 动画持续时间
  transitions: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
  
  // 阴影效果
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  
  // 渐变色
  gradients: {
    primary: 'linear-gradient(145deg, var(--primary) 0%, var(--chart-1) 100%)',
    secondary: 'linear-gradient(145deg, var(--secondary) 0%, var(--accent) 100%)',
    blue: 'linear-gradient(145deg, #3b82f6 0%, #1e40af 100%)',
    purple: 'linear-gradient(145deg, #8b5cf6 0%, #6d28d9 100%)',
  },
  
  // 动画效果
  animations: {
    fadeIn: 'fadeIn 0.3s ease-in-out',
    slideUp: 'slideUp 0.4s ease-out',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
  },
};

// 导出动画关键帧
export const keyframes = {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideUp: {
    '0%': { transform: 'translateY(10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '.5' },
  },
  bounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
};