import './style.css'
import { setupCounter } from './counter'
import {} from '@contexer/base'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <button>Click me</button>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
