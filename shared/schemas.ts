import { z } from "zod";

export const tournamentIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const teamIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createTournamentSchema = z.object({
  name: z.string().trim().min(2).max(120),
  date: z.coerce.date(),
  description: z.string().trim().max(2000).optional().nullable(),
  teams: z.array(z.string().trim().min(1).max(80)).min(2).optional(),
});

export const updateTournamentSchema = createTournamentSchema.partial().extend({
  teams: z.array(z.string().trim().min(1).max(80)).min(2).optional(),
});

export const updateMatchScoreSchema = z.object({
  homeScore: z.coerce.number().int().min(0),
  awayScore: z.coerce.number().int().min(0),
});

export const createTeamSchema = z.object({
  name: z.string().trim().min(1).max(80),
  tournamentId: z.coerce.number().int().positive(),
});

export const listTeamsQuerySchema = z.object({
  tournamentId: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined))
    .refine((value) => value === undefined || Number.isInteger(value), {
      message: "tournamentId must be an integer",
    })
    .refine((value) => value === undefined || value > 0, {
      message: "tournamentId must be positive",
    }),
});

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
export type UpdateTournamentInput = z.infer<typeof updateTournamentSchema>;
export type UpdateMatchScoreInput = z.infer<typeof updateMatchScoreSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
