#!/usr/bin/env node
/**
 * 检测 Services 模块类型重复和命名规范
 *
 * 使用方法:
 * npm run check:types
 */

import { readdirSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const modulesDir = join(__dirname, '../src/services')

try {
  const modules = readdirSync(modulesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  if (modules.length === 0) {
    console.log('ℹ️  未找到 Services 模块')
    process.exit(0)
  }

  console.log('🔍 开始检测 Services 类型...\n')

  // 类型映射: 类型名 -> [模块名列表]
  const typeMap = new Map()

  // 命名规范违规: 模块名 -> [类型名列表]
  const namingViolations = new Map()

  modules.forEach(moduleName => {
    const typesFile = join(modulesDir, moduleName, 'types.ts')

    if (!existsSync(typesFile)) {
      console.warn(`⚠️  模块 ${moduleName} 缺少 types.ts 文件`)
      return
    }

    const content = readFileSync(typesFile, 'utf-8')

    // 提取类型定义
    const interfaceMatches = content.match(/export interface (\w+)/g) || []
    const typeMatches = content.match(/export type (\w+)/g) || []
    const enumMatches = content.match(/export enum (\w+)/g) || []

    const allTypes = [
      ...interfaceMatches.map(m => m.replace('export interface ', '')),
      ...typeMatches.map(m => m.replace('export type ', '')),
      ...enumMatches.map(m => m.replace('export enum ', '')),
    ]

    allTypes.forEach(typeName => {
      // 检查命名规范：类型名应该以模块名开头
      const modulePrefix = moduleName.charAt(0).toUpperCase() + moduleName.slice(1)
      if (!typeName.startsWith(modulePrefix)) {
        if (!namingViolations.has(moduleName)) {
          namingViolations.set(moduleName, [])
        }
        namingViolations.get(moduleName).push(typeName)
      }

      // 记录类型定义位置
      if (!typeMap.has(typeName)) {
        typeMap.set(typeName, [])
      }
      typeMap.get(typeName).push(moduleName)
    })
  })

  // 检查重复类型
  const duplicates = Array.from(typeMap.entries()).filter(([, modules]) => modules.length > 1)

  let hasError = false

  // 输出重复类型
  if (duplicates.length > 0) {
    console.error('❌ 发现重复的类型定义:\n')
    duplicates.forEach(([typeName, modules]) => {
      console.error(`  ${typeName}:`)
      modules.forEach(module => {
        console.error(`    - ${module}/types.ts`)
      })
      console.error('')
    })
    hasError = true
  } else {
    console.log('✅ 未发现重复类型\n')
  }

  // 输出命名规范违规
  if (namingViolations.size > 0) {
    console.error('❌ 发现命名规范违规:\n')
    namingViolations.forEach((types, moduleName) => {
      const modulePrefix = moduleName.charAt(0).toUpperCase() + moduleName.slice(1)
      console.error(`  模块 ${moduleName} (应以 ${modulePrefix} 开头):`)
      types.forEach(typeName => {
        console.error(`    - ${typeName} → 应改为 ${modulePrefix}${typeName}`)
      })
      console.error('')
    })
    hasError = true
  } else {
    console.log('✅ 所有类型命名符合规范\n')
  }

  // 输出统计信息
  console.log('📊 类型统计:')
  console.log(`  模块数量: ${modules.length}`)
  console.log(`  类型总数: ${typeMap.size}`)

  const moduleTypeCounts = {}
  Array.from(typeMap.entries()).forEach(([typeName, modules]) => {
    modules.forEach(module => {
      moduleTypeCounts[module] = (moduleTypeCounts[module] || 0) + 1
    })
  })

  Object.entries(moduleTypeCounts).forEach(([module, count]) => {
    console.log(`  ${module}: ${count} 个类型`)
  })

  console.log('')

  if (hasError) {
    console.error('💡 修复建议:')
    if (duplicates.length > 0) {
      console.error('  1. 为重复的类型添加模块前缀')
      console.error('  2. 参考文档: docs/API_TYPE_NAMING_GUIDE.md')
    }
    if (namingViolations.size > 0) {
      console.error('  1. 所有类型名应以模块名开头（首字母大写）')
      console.error('  2. 例如: user 模块的类型应以 User 开头')
      console.error('  3. 参考文档: docs/API_TYPE_NAMING_GUIDE.md')
    }
    process.exit(1)
  } else {
    console.log('🎉 所有检查通过！')
    process.exit(0)
  }
} catch (error) {
  console.error('❌ 检测过程中发生错误:', error.message)
  process.exit(1)
}
