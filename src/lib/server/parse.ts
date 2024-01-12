import pkmnDataJson from '../../data/weaknesses.json';

const POKEMON_WITH_UNKNOWN_GENDER = [
  'Magnemite',
  'Magneton',
  'Voltorb',
  'Electrode',
  'Ditto',
  'Staryu',
  'Starmie',
  'Porygon',
  'Porygon2',
  'Shedinja',
  'Lunatone',
  'Solrock',
  'Baltoy',
  'Claydol',
  'Beldum',
  'Metang',
  'Metagross',
  'Articuno',
  'Zapdos',
  'Moltres',
  'Mewtwo',
  'Mew',
  'Lugia',
  'Ho-Oh',
  'Celebi',
  'Unown',
  'Raikou',
  'Entei',
  'Suicune',
  'Regirock',
  'Regice',
  'Registeel',
  'Latias',
  'Latios',
  'Kyogre',
  'Groudon',
  'Rayquaza',
  'Jirachi',
  'Deoxys',
  'Deoxys-Defense',
  'Deoxys-Speed',
  'Deoxys-Attack',
] as const;

const DEFAULT_EVS: PkmnStat = {
  HP: 0,
  Atk: 0,
  Def: 0,
  SpA: 0,
  SpD: 0,
  Spe: 0,
};

const DEFAULT_IVS: PkmnStat = {
  HP: 31,
  Atk: 31,
  Def: 31,
  SpA: 31,
  SpD: 31,
  Spe: 31,
};

function processValues(valuesString: string, iv = false) {
  const values: PkmnStat = {
    HP: iv ? 31 : 0,
    Atk: iv ? 31 : 0,
    Def: iv ? 31 : 0,
    SpA: iv ? 31 : 0,
    SpD: iv ? 31 : 0,
    Spe: iv ? 31 : 0,
  };

  const valueMatches = valuesString.match(/(\d+) (\w+)/g);

  if (valueMatches) {
    valueMatches.forEach((match) => {
      const [value, stat] = match.split(' ');
      values[stat as keyof typeof values] = parseInt(value, 10);
    });
  }
  return values;
}

function extractField(fieldName: string, text: string, pattern?: RegExp): string | null {
  if (!pattern) {
    pattern = new RegExp(`${fieldName}: ([^\n]+)`);
  }
  const match = text.match(pattern);
  return match ? match[1].trim() : null;
}

function processFirstLine(firstLine: string) {
  //  need to do in case there are @ in the nickname
  const firstLineReversedSplit = firstLine.split(' ').reverse().join(' ').split('@');

  let name = '';
  let item = '';
  let gender: Gender = 'Random';

  // get item
  if (firstLineReversedSplit.length > 1) {
    // super edge case where pokmeon has no item and nickname contains "@"
    if (firstLineReversedSplit[0][0] === '(') {
      name = firstLineReversedSplit[0].split(')')[0];
      if (name.startsWith('(')) {
        name = name.substring(1);
      }
    } else {
      item = firstLineReversedSplit[0].trim().split(' ').reverse().join(' ');
    }

    // 2nd element will have optional gender and then name
    for (const chunk of firstLineReversedSplit[1].trim().split(' ')) {
      if (chunk === '(F)') {
        gender = 'Female';
      } else if (chunk === '(M)') {
        gender = 'Male';
      }

      if (chunk !== '(F)' && chunk !== '' && chunk !== '(M)') {
        name = chunk.replace(/[()]/g, '');
        break;
      }
    }
  } else {
    const namesArray = firstLineReversedSplit[0].split(' ');
    name = namesArray[namesArray.length - 1].replace(/^[() ]+|[() ]+$/g, '');
  }

  if (
    !gender &&
    POKEMON_WITH_UNKNOWN_GENDER.includes(name as (typeof POKEMON_WITH_UNKNOWN_GENDER)[number])
  ) {
    gender = 'Unknown';
  }

  return { name, gender, item };
}

function parseSection(section: string): Pokemon {
  const firstLine = section.split('\r\n')[0].trim();
  const { name, gender, item } = processFirstLine(firstLine);

  const ability = extractField('Ability', section);

  const levelValue = extractField('Level', section);
  const level: number = levelValue ? parseInt(levelValue) : 100;

  const shiny = extractField('Shiny', section) === 'Yes' ? true : false;

  const happinessValue = extractField('Happiness', section);
  const happiness: number = happinessValue ? parseInt(happinessValue) : 255;

  const nature = extractField('Nature', section, /(\w+) Nature/);

  const evsString = extractField('EVs', section);
  let evs;
  if (evsString) {
    evs = processValues(evsString);
  } else {
    evs = { ...DEFAULT_EVS };
  }

  const ivsString = extractField('IVs', section);
  let ivs;
  if (ivsString) {
    ivs = processValues(ivsString, true);
  } else {
    ivs = { ...DEFAULT_IVS };
  }

  let moves: string[];
  const movesRegex = section.match(/- ([^\n]+)/g);
  if (movesRegex) {
    moves = movesRegex.map((move) => move.substring(2).trim());
  } else {
    moves = [];
  }

  const pkmnNumber: number = pkmnDataJson[name as keyof typeof pkmnDataJson].Number;

  const pokemon: Pokemon = {
    name: name,
    id: pkmnNumber,
    item: item,
    gender: gender,
    ability: ability,
    level: level,
    shiny: shiny,
    happiness: happiness,
    nature: nature,
    evs: evs,
    ivs: ivs,
    moves: moves,
  };

  return pokemon;
}

export function parseInput(body: string) {
  // split the string into seperate sections for each pokemon
  const pokemonSections = body.trim().split('\r\n\r\n');
  const pokemons = pokemonSections.map((section) => parseSection(section));

  return pokemons;
}
