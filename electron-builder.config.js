const prod = process.env.VITE_MODE === 'prod'

const appId = prod ? 'com.jurnal.desktop.app' : 'com.jurnal.desktop.pre-release.app'
const guid = prod ? 'D1D1D1D1-D1D1-D1D1-D1D1-D1D1D1D1D1D1' : 'D2D2D2D2-D2D2-D2D2-D2D2-D2D2D2D2D2D2'
const productName = prod ? 'Журнал молия' : 'Журнал молия (Тестирование)'
const artifactName = prod
  ? '${name}-${version}-setup.${ext}'
  : '${name}-${version}-pre-release-setup.${ext}'
const executableName = prod ? 'jurnal.desktop' : 'jurnal.desktop.pre-release'

/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  appId,
  productName,
  directories: {
    buildResources: 'build'
  },
  files: [
    '!**/.vscode/*',
    '!src/*',
    '!electron.vite.config.{js,ts,mjs,cjs}',
    '!{.eslintignore,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}',
    '!{.env,.env.*,.npmrc,pnpm-lock.yaml}',
    '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}'
  ],
  asarUnpack: ['resources/**'],
  win: {
    executableName
  },
  nsis: {
    guid,
    artifactName,
    shortcutName: '${productName}',
    uninstallDisplayName: '${productName}',
    createDesktopShortcut: 'always'
  },
  mac: {
    entitlementsInherit: 'build/entitlements.mac.plist',
    extendInfo: [
      { NSCameraUsageDescription: "Application requests access to the device's camera." },
      { NSMicrophoneUsageDescription: "Application requests access to the device's microphone." },
      {
        NSDocumentsFolderUsageDescription:
          "Application requests access to the user's Documents folder."
      },
      {
        NSDownloadsFolderUsageDescription:
          "Application requests access to the user's Downloads folder."
      }
    ],
    notarize: false
  },
  dmg: {
    artifactName: '${name}-${version}.${ext}'
  },
  linux: {
    target: ['AppImage', 'snap', 'deb'],
    maintainer: 'electronjs.org',
    category: 'Utility'
  },
  appImage: {
    artifactName: '${name}-${version}.${ext}'
  },
  npmRebuild: false,
  publish: {
    provider: 'generic',
    url: 'https://example.com/auto-updates'
  }
}

module.exports = config
