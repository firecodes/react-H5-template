import React from 'react'
import { SpinLoading } from 'antd-mobile'

interface LoadingProps {
  size?: 'small' | 'middle' | 'large'
  text?: string
  spinning?: boolean
  children?: React.ReactNode
}

const Loading: React.FC<LoadingProps> = ({ 
  text = '加载中...', 
  spinning = true,
  children 
}) => {
  if (children) {
    return (
      <div className={`relative w-full h-full ${spinning ? 'pointer-events-none' : ''}`}>
        {spinning && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/80 flex items-center justify-center z-[9999]">
            <div className="flex flex-col items-center justify-center">
              <SpinLoading color="primary" />
              {text && <div className="mt-3 text-gray-600 text-sm">{text}</div>}
            </div>
          </div>
        )}
        {children}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-50 w-full">
      <div className="flex flex-col items-center justify-center">
        <SpinLoading color="primary" />
        {text && <div className="mt-3 text-gray-600 text-sm">{text}</div>}
      </div>
    </div>
  )
}

export default Loading 