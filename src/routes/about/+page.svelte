<svelte:head>
  <title>About</title>
  <meta name="description" content="About this app" />
</svelte:head>

<div class="container mx-auto flex justify-center p-10">
  <div class="space-y-10 max-w-2xl">
    <div class="space-y-4">
      <h2 class="h2">About</h2>
      <p>
        Faraway Island is a gen 3 pokemon team analysis tool. Inspired by sites such as
        <a class="anchor" href="pokepast.es" target="_blank">PokePaste</a> and
        <a class="anchor" href="https://marriland.com/tools/team-builder" target="_blank"
          >Marriland's team builder</a
        > it aims to provide relevant information to help with teambuilding.
      </p>
    </div>
    <div class="space-y-4">
      <h2 class="h2">Usage</h2>
      <p>
        Paste in your <a
          class="anchor"
          href="https://play.pokemonshowdown.com/teambuilder"
          target="_blank">Pokémon Showdown</a
        >
        team in the input box. Your team will only be able to be proccessed if it follows
        <a
          class="anchor"
          href="https://github.com/smogon/pokemon-showdown/blob/master/sim/TEAMS.md"
          target="_blank">Showdown export format</a
        >.
      </p>
      <ul>
        <li>To find your team in export format:</li>
        <li>- Go to Teambuilder</li>
        <li>- Select the team</li>
        <li>- Click "Import/Export" at the top of the page</li>
        <li>- Copy the resulting text</li>
      </ul>
    </div>
  </div>
</div>
