'use server';
/**
 * @fileOverview This file implements a Genkit flow to summarize data access requests in plain language.
 *
 * - summarizeDataRequest - A function that calls the AI to summarize data requested by a platform.
 * - SummarizeDataRequestInput - The input type for the summarizeDataRequest function.
 * - SummarizeDataRequestOutput - The return type for the summarizeDataRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDataRequestInputSchema = z.object({
  dataRequested: z.string().describe('The description of the data requested by a platform.'),
});
export type SummarizeDataRequestInput = z.infer<typeof SummarizeDataRequestInputSchema>;

const SummarizeDataRequestOutputSchema = z.object({
  summary: z.string().describe('A plain language summary of the data requested, explaining its implications.'),
});
export type SummarizeDataRequestOutput = z.infer<typeof SummarizeDataRequestOutputSchema>;

export async function summarizeDataRequest(
  input: SummarizeDataRequestInput
): Promise<SummarizeDataRequestOutput> {
  return summarizeDataRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDataRequestPrompt',
  input: {schema: SummarizeDataRequestInputSchema},
  output: {schema: SummarizeDataRequestOutputSchema},
  prompt: `You are an AI assistant specialized in summarizing data access requests for users.
Your goal is to explain, in plain, easy-to-understand language, what specific data a platform is requesting and what the potential implications (e.g., privacy, functionality) of granting access might be.

Summarize the following data request:

Data Requested: {{{dataRequested}}}

Provide a concise and neutral summary. Focus on clarity and helping the user understand what they are sharing.`, 
});

const summarizeDataRequestFlow = ai.defineFlow(
  {
    name: 'summarizeDataRequestFlow',
    inputSchema: SummarizeDataRequestInputSchema,
    outputSchema: SummarizeDataRequestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to summarize data request.');
    }
    return output;
  }
);
