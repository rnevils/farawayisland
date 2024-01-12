<script lang="ts">
  import '../app.postcss';
  import { AppShell } from '@skeletonlabs/skeleton';
  import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppShell>
  <svelte:fragment slot="header">
    <AppBar>
      <span class="font-bold text-xl">
        <a href="/"> Faraway Island</a>
      </span>
      <svelte:fragment slot="trail">
        <a href="/about">about</a>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <div class="container p-10 mx-auto h-full">
    <slot />
  </div>
</AppShell>
