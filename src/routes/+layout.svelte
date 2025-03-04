<script lang="ts">
  import '../app.postcss';
  import { AppShell } from '@skeletonlabs/skeleton';
  import { AppBar } from '@skeletonlabs/skeleton';
  import { dev } from '$app/environment';
  import { injectAnalytics } from '@vercel/analytics/sveltekit'
  injectAnalytics({ mode: dev ? 'development' : 'production' });
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

  <div class="relative max-w-screen-2xl p-10 mx-auto h-full flex flex-col gap-6">
    <slot />
  </div>
</AppShell>
