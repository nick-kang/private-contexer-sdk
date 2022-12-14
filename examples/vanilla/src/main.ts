import "./style.css";
import { setupHelpCenter } from "./setupHelpCenter";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <button id="help">Click me</button>
  </div>
`;

setupHelpCenter(document.querySelector<HTMLButtonElement>("#help")!);
