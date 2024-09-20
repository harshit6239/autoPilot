import { app } from 'electron'
// import { Notification, app } from 'electron'
// import { spawn } from 'child_process'
// import scheduleJob from 'node-schedule'
import fs from 'fs'
import path from 'path'
import ShortUniqueId from 'short-unique-id'

const userDataPath = app.getPath('userData')
const scriptsFilePath = path.join(userDataPath, 'scripts.json')

function loadScripts() {
  console.log('scriptsFilePath', scriptsFilePath)
  if (!fs.existsSync(scriptsFilePath)) {
    fs.writeFileSync(scriptsFilePath, JSON.stringify([]), 'utf-8')
  }
  const scripts = JSON.parse(fs.readFileSync(scriptsFilePath))
  return scripts
}

export default class ScriptScheduler {
  constructor() {
    this.scripts = loadScripts()
    this.activeScripts = this.scripts.filter((script) => script.active)
    this.uid = new ShortUniqueId()
  }

  saveScripts() {
    fs.writeFileSync(scriptsFilePath, JSON.stringify(this.scripts), 'utf-8')
  }

  addScript(script) {
    this.scripts.push({ id: this.uid.rnd(), ...script })
    this.saveScripts()
    this.activeScripts = this.scripts.filter((script) => script.active)
  }

  updateScript(script) {
    this.scripts = this.scripts.map((s) => (s.id === script.id ? script : s))
    this.saveScripts()
    this.activeScripts = this.scripts.filter((script) => script.active)
  }

  removeScript(id) {
    this.scripts = this.scripts.filter((script) => script.id !== id)
    this.saveScripts()
    this.activeScripts = this.scripts.filter((script) => script.active)
  }

  toggleScript(id) {
    const script = this.scripts.find((script) => script.id === id)
    script.active = !script.active
    this.saveScripts()
    this.activeScripts = this.scripts.filter((script) => script.active)
  }
}
