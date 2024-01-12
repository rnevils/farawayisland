import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { parseInput } from '$lib/server/parse';
import { calculateDefensiveCoverageData, getPokemonNoWeaknesses } from '$lib/server/utils';

export const actions = {
  default: async ({ request }) => {
    // the {request} is deconstructed param cause request is part of RequestEvent
    const data = await request.formData();
    const body = data.get('body') as string;

    if (!body) {
      console.log('no input body found');
      return fail(400, { missing: true });
    }

    // just don't deal with any super long input
    if (body.length > 1500) {
      console.log('input too long');
      return fail(400, { errorMessage: 'Input too long' });
    }

    // parse input and create data
    try {
      const pokemonTeam: Pokemon[] = parseInput(body);
      const pokemonNames: string[] = pokemonTeam.map((pokemon) => pokemon.name);
      const teamDefensiveCoverageData: DefensiveCoverageData[] =
        calculateDefensiveCoverageData(pokemonNames);
      const pokemonNoWeakness: string[] = getPokemonNoWeaknesses(pokemonTeam);

      return {
        pokemonTeam: pokemonTeam,
        teamDefensiveCoverageData: teamDefensiveCoverageData,
        pokemonNoWeakness: pokemonNoWeakness,
      };
    } catch (error) {
      console.log(error);
      return fail(422, {
        errorMessage: 'Unable to parse input, please check if it is valid syntax',
      });
    }
  },
} satisfies Actions;
