import { homedir } from 'os'
import fs from 'fs'
import { ensureDir, readdir } from 'fs-extra'
import { appDirectoryName } from '../../shared/constants'

export const getRootDir = () => `${homedir()}/${appDirectoryName}`

export const getScripts = async () => {
  const rootDir = getRootDir()
  await ensureDir(rootDir)
  const scripts = await readdir(rootDir, {
    encoding: 'utf-8',
    withFileTypes: false
  })
  return scripts.filter((script) => script.endsWith('.json'))
}

export const saveScript = async (data) => {
  const rootDir = getRootDir()
  await ensureDir(rootDir)
  const JSONobj = JSON.stringify(data, null, 2)
  try {
    fs.writeFileSync(`${rootDir}/${data.name}.json`, JSONobj)
    return true
  } catch (err) {
    return false
  }
}
