import drivelist from 'drivelist'
import fs from 'fs/promises'
import path from 'path'

export const getSecurityKeys = async () => {
  const drives = await drivelist.list()
  const securityKeys: string[] = []
  for (const drive of drives) {
    if (drive.isUSB) {
      for (const mount of drive.mountpoints) {
        try {
          const files = await fs.readdir(mount.path, { withFileTypes: true })
          for (const file of files) {
            if (file.isFile() && file.name.endsWith('.key')) {
              const filePath = path.join(mount.path, file.name)
              const fileContent = await fs.readFile(filePath, 'utf-8')
              securityKeys.push(fileContent.trim())
            }
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
  return securityKeys
}
