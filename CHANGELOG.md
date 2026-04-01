# 更新日志

所有重要的更改都将记录在此文件中。

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

## 如何生成 CHANGELOG

使用以下命令自动生成 CHANGELOG：

```bash
# 自动升级版本、生成 CHANGELOG、创建 tag
npm run changelog

# 首次发布
npm run changelog -- --first-release

# 指定版本号
npm run changelog -- --release-as 1.0.0

# 预发布版本
npm run changelog -- --prerelease alpha
```

## 版本升级规则

- `feat`: 升级 minor 版本（0.1.0 -> 0.2.0）
- `fix`: 升级 patch 版本（0.1.0 -> 0.1.1）
- `BREAKING CHANGE`: 升级 major 版本（0.1.0 -> 1.0.0）

---

_注意：当你第一次运行 `npm run changelog` 后，这个文件将被自动更新。_
