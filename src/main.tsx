import React from 'react'
import ReactDOM from 'react-dom/client'
import "./index.scss"
import App from './App.tsx'
import { RecoilRoot } from 'recoil'
import RecoilNexus from 'recoil-nexus'
import 'react-tooltip/dist/react-tooltip.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <RecoilNexus />
      <App />
    </RecoilRoot>
  </React.StrictMode>,
)
