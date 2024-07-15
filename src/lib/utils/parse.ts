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
  hp: 0,
  atk: 0,
  def: 0,
  spa: 0,
  spd: 0,
  spe: 0,
};

const DEFAULT_IVS: PkmnStat = {
  hp: 31,
  atk: 31,
  def: 31,
  spa: 31,
  spd: 31,
  spe: 31,
};

function formatPkmnStat(stats: PkmnStat): string {
  let formattedString = '';

  if (stats.hp > 0) {
    formattedString += `${stats.hp} hp / `;
  }
  if (stats.atk > 0) {
    formattedString += `${stats.atk} atk / `;
  }
  if (stats.def > 0) {
    formattedString += `${stats.def} def / `;
  }
  if (stats.spa > 0) {
    formattedString += `${stats.spa} spa / `;
  }
  if (stats.spd > 0) {
    formattedString += `${stats.spd} spd / `;
  }
  if (stats.spe > 0) {
    formattedString += `${stats.spe} spe`;
  }

  // Remove trailing slash and space
  if (formattedString.endsWith('/ ')) {
    formattedString = formattedString.slice(0, -2);
  }

  return formattedString;
}

function processValues(valuesString: string, iv = false) {
  const values: PkmnStat = {
    hp: iv ? 31 : 0,
    atk: iv ? 31 : 0,
    def: iv ? 31 : 0,
    spa: iv ? 31 : 0,
    spd: iv ? 31 : 0,
    spe: iv ? 31 : 0,
  };

  const valueMatches = valuesString.toLowerCase().match(/(\d+) (\w+)/g);

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
    name = namesArray[0].replace(/^[() ]+|[() ]+$/g, '');
  }

  if (
    !gender &&
    POKEMON_WITH_UNKNOWN_GENDER.includes(name as (typeof POKEMON_WITH_UNKNOWN_GENDER)[number])
  ) {
    gender = 'Unknown';
  }

  return { name, gender, item };
}

function parseSection(section: string): MyPokemon {
  const firstLine = section.split('\n')[0].trim();
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

  const formattedEvs = formatPkmnStat(evs);
  const formattedIvs = formatPkmnStat(ivs);

  const pokemon: MyPokemon = {
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
    evsString: formattedEvs,
    ivs: ivs,
    ivsString: formattedIvs,
    moves: moves,
  };

  return pokemon;
}

export function parseInput(body: string) {
  // split the string into seperate sections for each pokemon
  const pokemonSections = body.trim().split('\n\n');
  const pokemons = pokemonSections.map((section) => parseSection(section));

  return pokemons;
}
