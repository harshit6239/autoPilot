import { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { Editor } from '@monaco-editor/react'
import DropDown from '../components/dropDown'

function AddScript() {
  const ipc = window.ipcRenderer
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')
  const [runAt, setRunAt] = useState('')
  const [active, setActive] = useState(false)
  const navigate = useNavigate()
  const [language, setLanguage] = useState('python')
  const changeLanguage = (lang) => {
    if (lang !== language) {
      setLanguage(lang)
    }
  }
  const options = [
    {
      label: 'Python',
      value: 'python'
    },
    {
      label: 'NodeJS',
      value: 'javascript'
    },
    {
      label: 'Bash',
      value: 'bash'
    }
  ]

  const defaultOption = options[0]
  return (
    <div className="h-full w-full p-8 overflow-scroll">
      <button
        onClick={() => {
          navigate('/')
        }}
        className="bg-[#34424d] p-[0.5em] rounded-md flex items-center gap-2 hover:bg-[#3e515f] transition-colors  ease-in-out active:bg-[#313d46] mb-4"
      >
        <IoIosArrowBack />
      </button>
      <div className="w-full flex h-max justify-between mb-4">
        <input
          type="text"
          name="name"
          value={name}
          placeholder="Name"
          className="bg-transparent h-max w-[48%] p-4 pt-2 pb-2 border border-solid border-[#34424d] rounded-md focus:outline-none"
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          name="description"
          value={description}
          placeholder="Description"
          className="bg-transparent w-[48%] p-4 pt-2 pb-2 border border-solid border-[#34424d] rounded-md focus:outline-none min-h-11 max-h-32 h-11"
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="bg-transparent h-80 w-full border border-solid border-[#34424d] rounded-md mb-4">
        <Editor
          height="100%"
          defaultLanguage={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
        />
      </div>
      <div className="mb-4">
        <DropDown options={options} defaultOption={defaultOption} setLang={changeLanguage} />
      </div>
      <input
        type="number"
        name="runAt"
        value={runAt}
        placeholder="Run At"
        className="bg-transparent w-[20%] mb-4 p-4 pt-2 pb-2 border border-solid border-[#34424d] rounded-md focus:outline-none"
        onChange={(e) => setRunAt(e.target.value)}
      />
      <div className="mb-4 flex gap-2 items-center">
        <input
          type="checkbox"
          name="active"
          id="active"
          className="form-checkbox h-5 w-5 text-blue-600"
          onChange={(e) => setActive(e.target.checked)}
        />
        <label htmlFor="active" className="text-white">
          Active
        </label>
      </div>
      <div>
        <button
          className="bg-[#34424d] w-full h-max p-3 rounded-md flex justify-center items-center hover:bg-[#3e515f] transition-colors ease-in-out active:bg-[#313d46] mb-4"
          onClick={() => {
            console.log({
              name,
              description,
              code,
              language,
              runAt,
              active
            })
            ipc.send('addScript', {
              name,
              description,
              code,
              language,
              runAt,
              active
            })
            navigate('/')
          }}
        >
          Add Script
        </button>
      </div>
    </div>
  )
}

export default AddScript
