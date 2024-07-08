import weaknessDataJson from '../../data/weaknesses.json';
import movesJson from '../../data/moves.json';

const POKEMON_TYPES: string[] = [
  'Normal',
  'Fire',
  'Water',
  'Electric',
  'Grass',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
];

export function calculateDefensiveCoverageData(pokemons: string[]) {
  const finalData: DefensiveCoverageData[] = [];

  // for every type
  for (const [idx, pokemonType] of POKEMON_TYPES.entries()) {
    // get numbers
    const values = pokemons.map(
      (pokemon) => weaknessDataJson[pokemon as keyof typeof weaknessDataJson]['Matchups'][idx]
    );

    const totalWeak = values.reduce((total, currentValue) => {
      if (currentValue > 1) {
        return total + 1;
      }
      return total;
    }, 0);

    const totalResist = values.reduce((total, currentValue) => {
      if (currentValue < 1) {
        return total + 1;
      }
      return total;
    }, 0);

    finalData.push({
      type: pokemonType,
      values: values,
      totalWeak: totalWeak,
      totalResist: totalResist,
    });
  }

  return finalData;
}

export function getPokemonNoWeaknesses(pokemonTeam: MyPokemon[]): string[] {
  // Extract moves from each object
  const movesArray = pokemonTeam
    .map((pokemon) => pokemon.moves.map((move) => move.toLowerCase().replace(/\s/g, '-')))
    .flat();

  // Filter out hidden power moves and store their types
  const hiddenPowerTypes: string[] = [];
  const filteredMovesArray: string[] = movesArray.filter((move) => {
    if (move.startsWith('hidden-power-')) {
      // Extract and store the type
      const typeMatch = /\[([^\]]+)\]/.exec(move);
      if (typeMatch) {
        hiddenPowerTypes.push(typeMatch[1].toLowerCase());
      }
      return false; // Skip hidden power moves
    }
    return true;
  });

  // get the types of those moves, and also remove moves that don't do any damage, and also then add in hidden power types
  const movesWithInfo = new Set(
    filteredMovesArray
      .map((move) => {
        const moveData = movesJson[move as keyof typeof movesJson];
        if (moveData.power) {
          return moveData.type;
        }
      })
      .filter((move) => move !== undefined)
      .concat(hiddenPowerTypes)
  );

  // from this list of types, check entire pokedex to see what it doesn't cover (yes probably not the most efficient way to do this)
  const pokemonWithoutSuperEffectiveMove: string[] = [];
  for (const [pokemon, weaknesses] of Object.entries(weaknessDataJson)) {
    if (!weaknesses.WeaknessesNames.some((weakness) => movesWithInfo.has(weakness))) {
      pokemonWithoutSuperEffectiveMove.push(pokemon);
    }
  }

  return pokemonWithoutSuperEffectiveMove;
}
