import { app } from 'electron'
import { exec } from 'child_process'
import { scheduleJob } from 'node-schedule'
import fs from 'fs'
import path from 'path'
import ShortUniqueId from 'short-unique-id'
import os from 'os'
import { Notification } from 'electron'

const userDataPath = app.getPath('userData')
const scriptsFilePath = path.join(userDataPath, 'scripts.json')
const scriptsFolder = path.join(userDataPath, 'scripts')

// Ensure scripts folder exists
if (!fs.existsSync(scriptsFolder)) {
  fs.mkdirSync(scriptsFolder, { recursive: true })
}

function loadScripts() {
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

    // Reschedule active scripts on startup
    this.activeScripts.forEach((script) => {
      if (script.active) {
        this.scheduleTask(script)
      }
    })
  }

  saveScripts() {
    const scriptsToSave = this.scripts.map(({ job, ...script }) => script)
    fs.writeFileSync(scriptsFilePath, JSON.stringify(scriptsToSave), 'utf-8')
  }

  createScriptFile(script) {
    const extension =
      script.language === 'python' ? '.py' : script.language === 'javascript' ? '.js' : '.sh'
    const filename = `${script.id}${extension}`
    const filepath = path.join(scriptsFolder, filename)
    fs.writeFileSync(filepath, script.code)
    return filepath
  }

  scheduleTask(script) {
    if (script.job) {
      script.job.cancel()
    }

    if (!script.active) {
      script.job = null
      return script
    }

    const scriptPath = this.createScriptFile(script)

    const job = scheduleJob(script.schedule, () => {
      let command
      switch (script.language) {
        case 'python':
          command = `python "${scriptPath}"`
          break
        case 'javascript':
          command = `node "${scriptPath}"`
          break
        case 'bash':
          command = os.platform() === 'win32' ? `bash "${scriptPath}"` : `bash "${scriptPath}"`
          break
        default:
          console.error('Unsupported script language')
          return
      }

      exec(command, (error, stdout, stderr) => {
        let notification
        if (error) {
          console.error(`Error executing ${script.name}: ${error}`)
          notification = new Notification({
            title: `Error executing ${script.name}`,
            body: error.message
          })
          notification.show()
          return
        }
        if (stderr) {
          console.error(`${script.name} stderr: ${stderr}`)
          notification = new Notification({
            title: `Error executing ${script.name}`,
            body: stderr
          })
          notification.show()
        }
        if (stdout) {
          console.log(`${script.name} output: ${stdout}`)
          notification = new Notification({
            title: `${script.name} executed successfully`,
            body: stdout
          })
          notification.show()
        }
      })
    })

    script.job = job
    return script
  }

  addScript(script) {
    const newScript = {
      id: this.uid.rnd(),
      ...script,
      job: null
    }

    if (script.active) {
      this.scheduleTask(newScript)
    }

    this.scripts.push(newScript)
    this.saveScripts()
    this.activeScripts = this.scripts.filter((script) => script.active)
  }

  updateScript(script) {
    const index = this.scripts.findIndex((s) => s.id === script.id)
    if (index === -1) return

    if (this.scripts[index].job) {
      this.scripts[index].job.cancel()
    }

    if (script.active) {
      this.scheduleTask(script)
    }

    this.scripts[index] = { ...script }
    this.saveScripts()
    this.activeScripts = this.scripts.filter((script) => script.active)
  }

  toggleScript(id) {
    const script = this.scripts.find((s) => s.id === id)
    if (!script) return

    script.active = !script.active

    if (script.active) {
      this.scheduleTask(script)
    } else if (script.job) {
      script.job.cancel()
      script.job = null
    }

    this.saveScripts()
    this.activeScripts = this.scripts.filter((script) => script.active)
  }

  removeScript(id) {
    const script = this.scripts.find((s) => s.id === id)
    if (script?.job) {
      script.job.cancel()
    }

    // Remove script file if exists
    const extensions = ['.py', '.js', '.sh']
    extensions.forEach((ext) => {
      const filepath = path.join(scriptsFolder, `${id}${ext}`)
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
    })

    this.scripts = this.scripts.filter((s) => s.id !== id)
    this.saveScripts()
    this.activeScripts = this.scripts.filter((script) => script.active)
  }
}
