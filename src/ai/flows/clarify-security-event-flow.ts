'use server';
/**
 * @fileOverview An AI agent that clarifies security event log entries.
 *
 * - clarifySecurityEvent - A function that handles the clarification of a security event.
 * - ClarifySecurityEventInput - The input type for the clarifySecurityEvent function.
 * - ClarifySecurityEventOutput - The return type for the clarifySecurityEvent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClarifySecurityEventInputSchema = z.object({
  securityEventLog: z
    .string()
    .describe(
      'A single entry from a security activity log that needs to be clarified.'
    ),
});
export type ClarifySecurityEventInput = z.infer<
  typeof ClarifySecurityEventInputSchema
>;

const ClarifySecurityEventOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A clear, plain-language explanation of the security event.'),
  implications: z
    .string()
    .describe(
      'A summary of the potential security implications or risks of this event.'
    ),
  advice: z
    .string()
    .describe('Actionable advice or recommendations for the user.'),
});
export type ClarifySecurityEventOutput = z.infer<
  typeof ClarifySecurityEventOutputSchema
>;

export async function clarifySecurityEvent(
  input: ClarifySecurityEventInput
): Promise<ClarifySecurityEventOutput> {
  return clarifySecurityEventFlow(input);
}

const prompt = ai.definePrompt({
  name: 'clarifySecurityEventPrompt',
  input: {schema: ClarifySecurityEventInputSchema},
  output: {schema: ClarifySecurityEventOutputSchema},
  prompt: `You are a security expert whose job is to help users understand complex security log entries.

Clarify the following security event log entry in plain language, explain its potential security implications, and provide actionable advice to the user.

Security Event Log Entry: {{{securityEventLog}}}`,
});

const clarifySecurityEventFlow = ai.defineFlow(
  {
    name: 'clarifySecurityEventFlow',
    inputSchema: ClarifySecurityEventInputSchema,
    outputSchema: ClarifySecurityEventOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
