<script lang="ts">
  export let pokemonTeam: Pokemon[];
  export let teamDefensiveCoverageData: DefensiveCoverageData[];
</script>

<div class="table-container text-center">
  <table class="table my-table-compact table-hover">
    <thead class="text-xs">
      <tr>
        <th />
        {#each pokemonTeam as pokemon}
          <th
            ><img
              class="pkmn-img"
              src="/pokemon/artwork/{pokemon.id}.webp"
              alt="art of pokemon"
            /></th
          >
        {/each}
        <th>total weak</th>
        <th>total resist</th>
      </tr>
    </thead>
    <tbody>
      {#each teamDefensiveCoverageData as weaknessrow}
        <tr>
          <td class="type-{weaknessrow.type}">{weaknessrow.type.toUpperCase()}</td>
          {#each weaknessrow.values as my_number}
            {#if my_number === 1}
              <td />
            {:else if my_number === 0.25}
              <td> <span class="very-not-very-eff"> &#188 </span></td>
            {:else if my_number === 0.5}
              <td class="not-very-eff">&#189</td>
            {:else if my_number === 2}
              <td class="super-eff">2</td>
            {:else if my_number === 4}
              <td><span class="very-super-eff">4</span></td>
            {:else if my_number === 0}
              <td><span class="no-effect">0</span></td>
            {:else}
              <td class="test123">huh??!</td>
            {/if}
          {/each}
          {#if weaknessrow.totalWeak != 0}
            <td class="weak-{weaknessrow.totalWeak}">{weaknessrow.totalWeak}</td>
          {:else}
            <td />
          {/if}
          {#if weaknessrow.totalResist != 0}
            <td class="resist-{weaknessrow.totalResist}">{weaknessrow.totalResist}</td>
          {:else}
            <td />
          {/if}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  thead th {
    padding: 0;
    font-weight: 700;
    height: 64px;
    width: 64px;
    text-align: center;
  }

  table td {
    vertical-align: middle;
  }

  .my-table-compact tbody td {
    padding: 0;
    width: 26px;
    height: 26px;
  }

  @media (max-width: 640px) {
    .my-table-compact {
      min-width: 560px;
      margin-left: auto;
      margin-right: auto;
    }
  }
  @media (min-width: 640px) {
    .my-table-compact {
      max-width: 640px;
      margin-left: auto;
      margin-right: auto;
    }
  }
  @media (min-width: 768px) {
    .my-table-compact {
      max-width: 768px;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .type-Bug {
    background-color: #a6b91a;
    color: white;
  }

  .type-Dark {
    background-color: #705746;
    color: white;
  }

  .type-Dragon {
    background-color: #6f35fc;
    color: white;
  }

  .type-Electric {
    background-color: #f7d02c;
    color: white;
  }

  .type-Fighting {
    background-color: #c22e28;
    color: white;
  }

  .type-Fire {
    background-color: #ee8130;
    color: white;
  }

  .type-Flying {
    background-color: #a98ff3;
    color: white;
  }

  .type-Ghost {
    background-color: #735797;
    color: white;
  }

  .type-Grass {
    background-color: #7ac74c;
    color: white;
  }

  .type-Ground {
    background-color: #e2bf65;
    color: white;
  }

  .type-Ice {
    background-color: #96d9d6;
    color: white;
  }

  .type-Normal {
    background-color: #a8a77a;
    color: white;
  }

  .type-Poison {
    background-color: #a33ea1;
    color: white;
  }

  .type-Psychic {
    background-color: #f95587;
    color: white;
  }

  .type-Rock {
    background-color: #b6a136;
    color: white;
  }

  .type-Steel {
    background-color: #b7b7ce;
    color: white;
  }

  .type-Water {
    background-color: #6390f0;
    color: white;
  }

  .pkmn-img {
    height: 52px;
    width: 52px;
    display: unset;
    object-position: bottom center;
  }

  .very-not-very-eff {
    background-color: rgba(0, 128, 0, 0.6);
    border-radius: 2px;
    padding-left: 3px;
    padding-right: 3px;
  }

  .very-super-eff {
    background-color: rgba(255, 0, 0, 0.557);
    border-radius: 2px;
    padding-left: 3px;
    padding-right: 3px;
  }

  .no-effect {
    background-color: rgba(128, 128, 128, 0.596);
    border-radius: 2px;
    padding-left: 3px;
    padding-right: 3px;
    color: #ffdd57;
  }

  .weak-1 {
    background-color: rgb(var(--color-error-400) / 0.2);
  }
  .weak-2 {
    background-color: rgb(var(--color-error-400) / 0.4);
  }
  .weak-3 {
    background-color: rgb(var(--color-error-400) / 0.6);
  }
  .weak-4 {
    background-color: rgb(var(--color-error-400) / 0.8);
  }
  .weak-5 {
    background-color: rgb(var(--color-error-400) / 0.8);
  }
  .weak-6 {
    background-color: rgb(var(--color-error-400) / 0.8);
  }
  .resist-1 {
    background-color: rgb(var(--color-success-400) / 0.2);
  }
  .resist-2 {
    background-color: rgb(var(--color-success-400) / 0.4);
  }
  .resist-3 {
    background-color: rgb(var(--color-success-400) / 0.6);
  }
  .resist-4 {
    background-color: rgb(var(--color-success-400) / 0.8);
  }
  .resist-5 {
    background-color: rgb(var(--color-success-400) / 0.8);
  }
  .resist-6 {
    background-color: rgb(var(--color-success-400) / 0.8);
  }
</style>
