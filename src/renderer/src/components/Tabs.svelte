<script>
  export let items = []
  export let activeTabValue = 1

  const handleClick = (tabValue) => () => {
    console.log("activeTabValue", activeTabValue);
    console.log("tabValue", tabValue);
    activeTabValue = tabValue;
  }
</script>

<div id="tabContainer">
  <ul id="tabs">
    <img src="#" />
    {#each items as item}
      <li class={activeTabValue === item.value ? 'active' : ''}>
        <span on:click={handleClick(item.value)}>{item.label}</span>
      </li>
    {/each}
  </ul>
  {#each items as item}
    {#if activeTabValue == item.value}
      <div class="box">
        <svelte:component this={item.component} />
      </div>
    {/if}
  {/each}
</div>

<style>

  #tabContainer {
    display: flex;
    height: 100%;
    width: 100%;
  }

  #tabs {
    display: flex;
    justify-content: start;
  }

  .box {
    margin-bottom: 10px;
    padding: 40px;
    border: 1px solid #dee2e6;
    border-radius: 0 0 0.5rem 0.5rem;
    border-top: 0;
    width: 100%;
  }
  ul {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
  }
  li {
    margin-bottom: -1px;
  }

  span {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: block;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  span:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }

  li.active > span {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }
</style>
