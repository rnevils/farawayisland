<script lang="ts">
  import { SMOGON_TOP_100_USAGE } from '../constants';
  import { parseInput } from '$lib/utils/parse';
  import { calculateDefensiveCoverageData, getPokemonNoWeaknesses } from '$lib/utils/weakness';
  import { calcDamages } from '$lib/utils/damage';
  import PokemonTable from '$lib/components/PokemonTable.svelte';

  let topXSmogon = 50;

  let userHasSubmitTeam = false;
  let userInput = '';
  let thePokemonTeam: MyPokemon[] = [];
  let theteamDefensiveCoverageData: DefensiveCoverageData[] = [];
  let thepokemonNoWeakness: string[];
  let badInput = false;
  let badInputMessage = '';
  let enemyPokemonUserInput = '';
  let enemyPokemon: MyPokemon; //TODO feel like this should havea default value or something
  let damageCalcResults: DamageCalcResults[] = [];
  function newParseTeam() {
    // handle empty body stuff

    // just don't deal with any super long input
    if (userInput.length > 1500) {
      badInputMessage = 'input too long';
      badInput = true;
      return;
    }

    try {
      userHasSubmitTeam = true;
      thePokemonTeam = parseInput(userInput);
      const pokemonNames: string[] = thePokemonTeam.map((pokemon) => pokemon.name);
      theteamDefensiveCoverageData = calculateDefensiveCoverageData(pokemonNames);
      thepokemonNoWeakness = getPokemonNoWeaknesses(thePokemonTeam);
    } catch (error) {
      badInput = true;
      badInputMessage = 'Unable to parse input, please check if it is valid syntax';
      return;
    }
  }
  function reset() {
    userHasSubmitTeam = false;
    // userInput = '';
    enemyPokemonUserInput = '';

    thePokemonTeam = [];
    theteamDefensiveCoverageData = [];
    damageCalcResults = [];
    badInput = false;
  }

  function newCalcDamages() {
    // need unput validation here... maybe create func for it?
    // should be pretty similar as above
    const enemyPokemonArray: MyPokemon[] = parseInput(enemyPokemonUserInput);
    enemyPokemon = enemyPokemonArray[0]; // could probably be clearner with this

    damageCalcResults = thePokemonTeam.map((pokemon) => ({
      id: pokemon.id,
      damage: calcDamages(pokemon, enemyPokemon),
    }));
  }

  function resetEnemyPokemon() {
    enemyPokemonUserInput = '';
    damageCalcResults = [];
  }
</script>

<svelte:head>
  <title>Faraway Island</title>
  <meta name="description" content="Faraway Island - Gen 3 Pokemon tools" />
</svelte:head>

{#if !userHasSubmitTeam}
  <div class="container h-full mx-auto gap-8 flex flex-col max-w-2xl">
    <form class="p-4 flex flex-col gap-3 h-full">
      <textarea
        class="textarea text-xs font-mono resize-none h-full max-h-[600px]"
        placeholder="Paste team here"
        spellcheck="false"
        bind:value={userInput}
        required
      />
      <button
        disabled={!userInput}
        on:click|preventDefault={newParseTeam}
        class="btn variant-filled-primary self-end"
        >Submit
      </button>
    </form>
  </div>
{:else if badInput === true}
  <div class="container mx-auto flex justify-center p-10">
    <div class="space-y-4">
      <p class="input-error">{badInputMessage}</p>
    </div>
  </div>
  <button on:click={reset} class="btn mx-auto variant-filled">Reset </button>
{:else}
  <div id="top-section-container" class="flex flex-col gap-8 lg:flex-row">
    <div id="defensive-coverage-table-container" class="card flex-auto">
      <div class="p-6">
        <h1 class="h2">Defensive Coverage</h1>
      </div>
      <PokemonTable
        pokemonTeam={thePokemonTeam}
        teamDefensiveCoverageData={theteamDefensiveCoverageData}
      />
    </div>
    <div id="smogon-top-100-container" class="card">
      <div class="p-6">
        <h1 class="h2 pb-2">Move Coverage</h1>
      </div>
      <div class="px-6 text-center flex justify-center">
        <div class="max-w-md">
          Pokemon you don't have a super effective move against in Smogon's top <strong
            >{topXSmogon}</strong
          > most used for gen 3 ou:
        </div>
      </div>

      <div class="px-6 flex justify-center">
        <input type="range" class="max-w-lg" bind:value={topXSmogon} min="1" max="100" />
      </div>
      <div class="container mx-auto flex justify-center">
        <div>
          {#each SMOGON_TOP_100_USAGE.slice(0, topXSmogon) as top100pkmn}
            <div class="flex flex-row items-center">
              {#if thepokemonNoWeakness.includes(top100pkmn)}
                <img
                  class="sprite-img"
                  src="/pokemon/sprites/{top100pkmn}.png"
                  alt="pokemon sprite"
                />
                {top100pkmn}
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
  <div id="team-damage-calc-container" class="card">
    <div class="p-6">
      <h2 class="h2">Team Damage Calc</h2>
    </div>
    <!-- change this id -->
    <div class="flex flex-col gap-8 lg:flex-row">
      <div id="attack-a-pokemon-damage-calc-stuff-results" class="flex-auto">
        <div id="team-container" class="p-6">
          {#if damageCalcResults.length == 0}
            {#each thePokemonTeam as pokemon}
              <div class="flex">
                <img
                  class="pkmn-img"
                  src="/pokemon/artwork/{pokemon.id}.webp"
                  alt="art of pokemon"
                />
                <div class="flex flex-col justify-center">
                  {#each pokemon.moves as move}
                    <div class="indent-7">- {move}</div>
                  {/each}
                </div>
              </div>
            {/each}
          {:else}
            {#each damageCalcResults as result}
              <div class="flex">
                <img
                  class="pkmn-img"
                  src="/pokemon/artwork/{result.id}.webp"
                  alt="art of pokemon"
                />
                <div class="flex flex-col justify-center">
                  {#each result.damage as move}
                    <div class="indent-7">- {move.name}: {move.percent}</div>
                  {/each}
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>
      <div id="attacking-pokemon-input-container" class="p-6">
        {#if damageCalcResults.length == 0}
          <h3 class="h3">Pokemon you want to attack:</h3>
          <form class="p-4 flex flex-col gap-3 h-full max-w-xs">
            <textarea
              class="textarea text-xs font-mono resize-none min-h-[200px]"
              placeholder="Paste enemy pokemon here"
              spellcheck="false"
              bind:value={enemyPokemonUserInput}
              required
            />
            <button
              disabled={!enemyPokemonUserInput}
              on:click|preventDefault={newCalcDamages}
              class="btn variant-filled-primary self-end">Submit</button
            >
          </form>
        {:else}
          <h3 class="h3">Enemy Pokemon</h3>
          <div id="enemy-pokemon-container" class="flex">
            <img
              class="pkmn-img"
              src="/pokemon/artwork/{enemyPokemon.id}.webp"
              alt="art of pokemon"
            />
            <div id="enemy-pokemon-stats">
              <div>{enemyPokemon.name}</div>
              {#if enemyPokemon.level != 100}
                <div>Level: {enemyPokemon.level}</div>
              {/if}
              <div>EVs: {enemyPokemon.evsString}</div>
              {#if enemyPokemon.nature}
                <div>{enemyPokemon.nature} Nature</div>
              {/if}
              <div>IVs: {enemyPokemon.ivsString}</div>
            </div>
          </div>
          <button on:click={resetEnemyPokemon} class="btn variant-filled self-end">Reset </button>
        {/if}
      </div>
    </div>
  </div>

  <button on:click={reset} class="btn variant-filled self-end">Reset </button>
{/if}

<style>
  /* TODO this is also used in table.. make it universal? or nah acuse gotta be dif sizes here */
  .pkmn-img {
    height: 130px;
    width: 130px;
    display: unset;
    object-position: bottom center;
  }
</style>
