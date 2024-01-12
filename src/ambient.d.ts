type Gender = 'Unknown' | 'Random' | 'Male' | 'Female';

type PkmnStat = {
  HP: number;
  Atk: number;
  Def: number;
  SpA: number;
  SpD: number;
  Spe: number;
};

type Pokemon = {
  name: string;
  id: number;
  item: string;
  gender: Gender;
  ability: string | null; // wait it shouldn't be null... like i'm pretty sure it needs an ability.. actually tested it and it can have nothing there.. just very unlikely. Very interesting tho might be a bug cause like I tested and I can have a valid team of snorlax with no ability mentioned so what happens in battle? it just picks a random one? That doesn't seem right, u gotta have an ability picked if it has more than 1 right? (i mean I'm of opinion it should be there no matter what)
  level: number;
  shiny: boolean;
  happiness: number;
  nature: string | null;
  evs: PkmnStat;
  ivs: PkmnStat;
  moves: string[];
};

type DefensiveCoverageData = {
  type: string;
  values: number[];
  totalWeak: number;
  totalResist: number;
};

/*
export type NatureName =
  | 'Adamant'
  | 'Bashful'
  | 'Bold'
  | 'Brave'
  | 'Calm'
  | 'Careful'
  | 'Docile'
  | 'Gentle'
  | 'Hardy'
  | 'Hasty'
  | 'Impish'
  | 'Jolly'
  | 'Lax'
  | 'Lonely'
  | 'Mild'
  | 'Modest'
  | 'Naive'
  | 'Naughty'
  | 'Quiet'
  | 'Quirky'
  | 'Rash'
  | 'Relaxed'
  | 'Sassy'
  | 'Serious'
  | 'Timid';
*/
