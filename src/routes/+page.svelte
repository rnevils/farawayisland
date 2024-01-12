<script lang="ts">
  import type { ActionData } from './$types';
  import PokemonTable from './PokemonTable.svelte';

  export let form: ActionData;
  let topXSmogon = 50;

  // hard coded in top 100, eventually fetch this data from smogon.com/stats
  const top_100 = [
    'Tyranitar',
    'Skarmory',
    'Metagross',
    'Swampert',
    'Blissey',
    'Zapdos',
    'Celebi',
    'Jirachi',
    'Dugtrio',
    'Suicune',
    'Gengar',
    'Salamence',
    'Claydol',
    'Starmie',
    'Aerodactyl',
    'Magneton',
    'Snorlax',
    'Forretress',
    'Flygon',
    'Milotic',
    'Moltres',
    'Misdreavus',
    'Jolteon',
    'Gyarados',
    'Charizard',
    'Breloom',
    'Heracross',
    'Raikou',
    'Registeel',
    'Regice',
    'Cloyster',
    'Porygon2',
    'Hariyama',
    'Kingdra',
    'Smeargle',
    'Vaporeon',
    'Marowak',
    'Machamp',
    'Armaldo',
    'Venusaur',
    'Ninjask',
    'Slaking',
    'Weezing',
    'Glalie',
    'Umbreon',
    'Arcanine',
    'Medicham',
    'Dragonite',
    'Ludicolo',
    'Steelix',
    'Regirock',
    'Jynx',
    'Blaziken',
    'Poliwrath',
    'Donphan',
    'Sceptile',
    'Banette',
    'Quagsire',
    'Dusclops',
    'Jumpluff',
    'Camerupt',
    'Aggron',
    'Scizor',
    'Houndoom',
    'Nidoqueen',
    'Golduck',
    'Gardevoir',
    'Alakazam',
    'Sableye',
    'Lapras',
    'Rhydon',
    'Linoone',
    'Zangoose',
    'Ursaring',
    'Sneasel',
    'Hypno',
    'Stantler',
    'Tentacruel',
    'Miltank',
    'Tauros',
    'Raichu',
    'Roselia',
    'Blastoise',
    'Entei',
    'Nidoking',
    'Exeggutor',
    'Articuno',
    'Shiftry',
    'Dodrio',
    'Scyther',
    'Lanturn',
    'Omastar',
    'Grumpig',
    'Meganium',
    'Wailord',
    'Slowbro',
    'Swellow',
    'Hitmontop',
    'Manectric',
    'Muk',
  ] as const;
</script>

{#if form?.errorMessage}
  <div class="container mx-auto flex justify-center p-10">
    <div class="space-y-4">
      <p class="input-error">{form.errorMessage}</p>
      <p class="flex justify-center"><a href="/" class="btn btn-sm variant-filled">Home</a></p>
    </div>
  </div>
{:else if !form?.pokemonTeam}
  <div class="container h-full mx-auto gap-8 flex flex-col max-w-2xl">
    <form method="POST" class="p-4 flex flex-col gap-3 h-full">
      <textarea
        name="body"
        class="textarea text-xs font-mono resize-none h-full max-h-[600px]"
        placeholder="Paste team here"
        required
      />
      <button type="submit" class="btn variant-filled-primary self-end">Submit</button>
    </form>
  </div>
{/if}

{#if form?.pokemonTeam}
  <div class="container mx-auto flex justify-center p-10">
    <div class="space-y-4">
      <h1 class="h1">Defensive Coverage</h1>
    </div>
  </div>
  <PokemonTable
    pokemonTeam={form.pokemonTeam}
    teamDefensiveCoverageData={form.teamDefensiveCoverageData}
  />

  <div class="container mx-auto flex justify-center pt-12 pb-8">
    <h1 class="h1">Offensive Coverage</h1>
  </div>
  <div class="mx-auto max-w-2xl text-center">
    Pokemon you don't have a super effective move against:
  </div>
  <div class="mx-auto max-w-2xl text-center">
    Smogon's top <strong>{topXSmogon}</strong> most used
  </div>

  <div class="flex justify-center mx-auto max-w-md">
    <input type="range" bind:value={topXSmogon} min="1" max="100" />
  </div>
  <div class="container mx-auto flex justify-center">
    <div>
      {#each top_100.slice(0, topXSmogon) as top100pkmn}
        <div class="flex flex-row items-center">
          {#if form.pokemonNoWeakness.includes(top100pkmn)}
            <img class="sprite-img" src="/pokemon/sprites/{top100pkmn}.png" alt="pokemon sprite" />
            {top100pkmn}
          {/if}
        </div>
      {/each}
    </div>
  </div>
  <div class="m" />
{/if}

<style>
  .sprite-img {
    width: 45px;
  }
</style>
