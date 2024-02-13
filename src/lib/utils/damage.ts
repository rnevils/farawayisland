import { calculate, Pokemon, Move, type GenerationNum } from '@smogon/calc';

function createPokemonShowdownPokemon(gen: GenerationNum, pokemon: MyPokemon): Pokemon {
  return new Pokemon(gen, pokemon.name, {
    item: pokemon.item,
    nature: pokemon.nature ?? 'Hardy', // this isn't great but i think will work for now
    evs: pokemon.evs,
    level: pokemon.level,
    ability: pokemon.ability ?? undefined, // this could be cleaned up
  });
}

export function calcDamages(
  attackingPokemon: MyPokemon,
  defendingPokemon: MyPokemon
): DamageCalcResult[] {
  const gen = 3;
  const attackingPokemonShowdown = createPokemonShowdownPokemon(gen, attackingPokemon);
  const defendingPokemonShowdown = createPokemonShowdownPokemon(gen, defendingPokemon);

  const damageCalcResults = attackingPokemon.moves.map((move) => {
    const strippedMoved = move.replace(/[\[\]]/g, ''); // needed for hidden power
    const result = calculate(
      gen,
      attackingPokemonShowdown,
      defendingPokemonShowdown,
      new Move(gen, strippedMoved)
    );
    return { name: move, percent: result.moveDesc() };
  });

  return damageCalcResults;
}
