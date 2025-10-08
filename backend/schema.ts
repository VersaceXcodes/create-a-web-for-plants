import { z } from 'zod';

// Users Entity Schema
export const userSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
  name: z.string(),
  created_at: z.coerce.date()
});

// Input schema for creating user
export const createUserInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  // Don't include user_id, created_at (auto-generated)
});

// Input schema for updating user
export const updateUserInputSchema = z.object({
  user_id: z.string(),
  email: z.string().email().optional(),
  name: z.string().min(1).max(255).optional(),
});

// Users query schema
export const searchUserInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['email', 'name', 'created_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// Plants Entity Schema
export const plantSchema = z.object({
  plant_id: z.string(),
  scientific_name: z.string(),
  common_name: z.string(),
  description: z.string().nullable(),
  care_guidelines: z.string().nullable(),
  photos: z.string().nullable(),
  type: z.string().nullable(),
  light_requirement: z.string().nullable(),
  watering_needs: z.string().nullable(),
  user_reviews: z.string().nullable()
});

// Input schema for creating plant
export const createPlantInputSchema = z.object({
  scientific_name: z.string().min(1).max(255),
  common_name: z.string().min(1).max(255),
  description: z.string().nullable(),
  care_guidelines: z.string().nullable(),
  photos: z.string().url().nullable(),
  type: z.string().nullable(),
  light_requirement: z.string().nullable(),
  watering_needs: z.string().nullable(),
  user_reviews: z.string().nullable(),
  // Don't include plant_id (auto-generated)
});

// Input schema for updating plant
export const updatePlantInputSchema = z.object({
  plant_id: z.string(),
  scientific_name: z.string().min(1).max(255).optional(),
  common_name: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  care_guidelines: z.string().nullable().optional(),
  photos: z.string().url().nullable().optional(),
  type: z.string().nullable().optional(),
  light_requirement: z.string().nullable().optional(),
  watering_needs: z.string().nullable().optional(),
  user_reviews: z.string().nullable().optional(),
});

// Plants query schema
export const searchPlantInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['scientific_name', 'common_name']).default('scientific_name'),
  sort_order: z.enum(['asc', 'desc']).default('asc')
});

// Care Guides Entity Schema
export const careGuideSchema = z.object({
  guide_id: z.string(),
  plant_family: z.string().nullable(),
  content: z.string(),
  created_by: z.string()
});

// Input schema for creating care guide
export const createCareGuideInputSchema = z.object({
  plant_family: z.string().nullable(),
  content: z.string().min(1),
  created_by: z.string(),
  // Don't include guide_id (auto-generated)
});

// Input schema for updating care guide
export const updateCareGuideInputSchema = z.object({
  guide_id: z.string(),
  plant_family: z.string().nullable().optional(),
  content: z.string().min(1).optional(),
  created_by: z.string().optional()
});

// Care Guides query schema
export const searchCareGuideInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['plant_family', 'content']).default('content'),
  sort_order: z.enum(['asc', 'desc']).default('asc')
});

// Forum Posts Entity Schema
export const forumPostSchema = z.object({
  post_id: z.string(),
  user_id: z.string(),
  content: z.string(),
  created_at: z.coerce.date(),
  topic: z.string()
});

// Input schema for creating forum post
export const createForumPostInputSchema = z.object({
  user_id: z.string(),
  content: z.string().min(1),
  topic: z.string().min(1),
  // Don't include post_id, created_at (auto-generated)
});

// Input schema for updating forum post
export const updateForumPostInputSchema = z.object({
  post_id: z.string(),
  user_id: z.string().optional(),
  content: z.string().min(1).optional(),
  topic: z.string().min(1).optional(),
});

// Forum Posts query schema
export const searchForumPostInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['created_at', 'topic']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// Forum Replies Entity Schema
export const forumReplySchema = z.object({
  reply_id: z.string(),
  post_id: z.string(),
  user_id: z.string(),
  content: z.string(),
  created_at: z.coerce.date()
});

// Input schema for creating forum reply
export const createForumReplyInputSchema = z.object({
  post_id: z.string(),
  user_id: z.string(),
  content: z.string().min(1),
  // Don't include reply_id, created_at (auto-generated)
});

// Input schema for updating forum reply
export const updateForumReplyInputSchema = z.object({
  reply_id: z.string(),
  post_id: z.string().optional(),
  user_id: z.string().optional(),
  content: z.string().min(1).optional(),
});

// Forum Replies query schema
export const searchForumReplyInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['created_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// Plant Marketplace Entity Schema
export const plantMarketplaceSchema = z.object({
  listing_id: z.string(),
  user_id: z.string(),
  plant_id: z.string(),
  condition: z.string(),
  desired_trade: z.string().nullable(),
  status: z.string(),
  created_at: z.coerce.date()
});

// Input schema for creating marketplace listing
export const createPlantMarketplaceInputSchema = z.object({
  user_id: z.string(),
  plant_id: z.string(),
  condition: z.string().min(1),
  desired_trade: z.string().nullable(),
  status: z.string(),
  // Don't include listing_id, created_at (auto-generated)
});

// Input schema for updating marketplace listing
export const updatePlantMarketplaceInputSchema = z.object({
  listing_id: z.string(),
  user_id: z.string().optional(),
  plant_id: z.string().optional(),
  condition: z.string().min(1).optional(),
  desired_trade: z.string().nullable().optional(),
  status: z.string().optional(),
});

// Plant Marketplace query schema
export const searchPlantMarketplaceInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['created_at', 'status']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// Trade Requests Entity Schema
export const tradeRequestSchema = z.object({
  request_id: z.string(),
  listing_id: z.string(),
  user_id: z.string(),
  status: z.string(),
  created_at: z.coerce.date()
});

// Input schema for creating trade request
export const createTradeRequestInputSchema = z.object({
  listing_id: z.string(),
  user_id: z.string(),
  status: z.string(),
  // Don't include request_id, created_at (auto-generated)
});

// Input schema for updating trade request
export const updateTradeRequestInputSchema = z.object({
  request_id: z.string(),
  listing_id: z.string().optional(),
  user_id: z.string().optional(),
  status: z.string().optional(),
});

// Trade Requests query schema
export const searchTradeRequestInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['created_at', 'status']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// User Activity Entity Schema
export const userActivitySchema = z.object({
  activity_id: z.string(),
  user_id: z.string(),
  activity_type: z.string(),
  reference_id: z.string().nullable(),
  created_at: z.coerce.date()
});

// Input schema for creating user activity
export const createUserActivityInputSchema = z.object({
  user_id: z.string(),
  activity_type: z.string().min(1),
  reference_id: z.string().nullable(),
  // Don't include activity_id, created_at (auto-generated)
});

// Input schema for updating user activity
export const updateUserActivityInputSchema = z.object({
  activity_id: z.string(),
  user_id: z.string().optional(),
  activity_type: z.string().min(1).optional(),
  reference_id: z.string().nullable().optional(),
});

// User Activity query schema
export const searchUserActivityInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['created_at', 'activity_type']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// User Favorites Entity Schema
export const userFavoriteSchema = z.object({
  favorite_id: z.string(),
  user_id: z.string(),
  plant_id: z.string(),
  saved_at: z.coerce.date()
});

// Input schema for creating user favorite
export const createUserFavoriteInputSchema = z.object({
  user_id: z.string(),
  plant_id: z.string(),
  // Don't include favorite_id, saved_at (auto-generated)
});

// Input schema for updating user favorite
export const updateUserFavoriteInputSchema = z.object({
  favorite_id: z.string(),
  user_id: z.string().optional(),
  plant_id: z.string().optional(),
});

// User Favorites query schema
export const searchUserFavoriteInputSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['saved_at']).default('saved_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// Define inferred types for all schemas
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export type SearchUserInput = z.infer<typeof searchUserInputSchema>;

export type Plant = z.infer<typeof plantSchema>;
export type CreatePlantInput = z.infer<typeof createPlantInputSchema>;
export type UpdatePlantInput = z.infer<typeof updatePlantInputSchema>;
export type SearchPlantInput = z.infer<typeof searchPlantInputSchema>;

export type CareGuide = z.infer<typeof careGuideSchema>;
export type CreateCareGuideInput = z.infer<typeof createCareGuideInputSchema>;
export type UpdateCareGuideInput = z.infer<typeof updateCareGuideInputSchema>;
export type SearchCareGuideInput = z.infer<typeof searchCareGuideInputSchema>;

export type ForumPost = z.infer<typeof forumPostSchema>;
export type CreateForumPostInput = z.infer<typeof createForumPostInputSchema>;
export type UpdateForumPostInput = z.infer<typeof updateForumPostInputSchema>;
export type SearchForumPostInput = z.infer<typeof searchForumPostInputSchema>;

export type ForumReply = z.infer<typeof forumReplySchema>;
export type CreateForumReplyInput = z.infer<typeof createForumReplyInputSchema>;
export type UpdateForumReplyInput = z.infer<typeof updateForumReplyInputSchema>;
export type SearchForumReplyInput = z.infer<typeof searchForumReplyInputSchema>;

export type PlantMarketplace = z.infer<typeof plantMarketplaceSchema>;
export type CreatePlantMarketplaceInput = z.infer<typeof createPlantMarketplaceInputSchema>;
export type UpdatePlantMarketplaceInput = z.infer<typeof updatePlantMarketplaceInputSchema>;
export type SearchPlantMarketplaceInput = z.infer<typeof searchPlantMarketplaceInputSchema>;

export type TradeRequest = z.infer<typeof tradeRequestSchema>;
export type CreateTradeRequestInput = z.infer<typeof createTradeRequestInputSchema>;
export type UpdateTradeRequestInput = z.infer<typeof updateTradeRequestInputSchema>;
export type SearchTradeRequestInput = z.infer<typeof searchTradeRequestInputSchema>;

export type UserActivity = z.infer<typeof userActivitySchema>;
export type CreateUserActivityInput = z.infer<typeof createUserActivityInputSchema>;
export type UpdateUserActivityInput = z.infer<typeof updateUserActivityInputSchema>;
export type SearchUserActivityInput = z.infer<typeof searchUserActivityInputSchema>;

export type UserFavorite = z.infer<typeof userFavoriteSchema>;
export type CreateUserFavoriteInput = z.infer<typeof createUserFavoriteInputSchema>;
export type UpdateUserFavoriteInput = z.infer<typeof updateUserFavoriteInputSchema>;
export type SearchUserFavoriteInput = z.infer<typeof searchUserFavoriteInputSchema>;