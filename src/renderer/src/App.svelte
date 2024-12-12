<script lang="ts">
  // import electronLogo from './assets/electron.svg'
  import Tabs from "./components/Tabs.svelte";
  import Tab3 from "./components/Tab3.svelte";

  // const ipcHandle = (): void => window.electron.ipcRenderer.send('open-program');

  let items = [
    { label: "Unreal Engine",
		 value: 1,
		 component: Tab3
		}
  ];

  async function login() {
    try {
      const ipcHandle = window.electron.ipcRenderer.send('open-program');
      // const tokens = await ipcRenderer.invoke('auth:login');
      console.log('Logged in successfully:', tokens);
      // Update UI or perform actions with the tokens
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  async function getTokens() {
    const ipcHandle = window.electron.ipcRenderer.send('open-program');
    // const tokens = await ipcRenderer.invoke('auth:get-tokens');
    if (tokens) {
      console.log('Stored tokens:', tokens);
      // Use tokens for API requests
    } else {
      console.log('No stored tokens found');
    }
  }

  // Call these functions when needed, e.g., on button clicks

</script>

<Tabs {items} />

<!-- <img alt="logo" class="logo" src={electronLogo} />
<div class="creator">Powered by electron-vite</div>
<div class="text">
  Build an Electron app with
  <span class="svelte">Svelte</span>
  and
  <span class="ts">TypeScript</span>
</div>
<p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
<div class="actions">
  <div class="action">
    <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
  </div>
  <div class="action">
    svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions a11y-missing-attribute-->
    <!-- <a target="_blank" rel="noreferrer" on:click={ipcHandle}>Send IPC</a>
  </div>
</div> -->
