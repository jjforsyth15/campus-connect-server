/**
 * ============================================================================
 * MARKETPLACE ROUTES
 * ============================================================================
 * 
 * Defines all HTTP endpoints for marketplace feature
 * Maps URLs to controller handlers with middleware
 */

import { Router } from "express";
import * as marketplaceController from "./marketplace.controller";
import { validate } from "../../middleware/validateRequest";
import { authenticateToken } from "../../middleware/auth.middleware";
import {
  createListingSchema,
  updateListingSchema,
  getListingsSchema,
  listingIdSchema,
} from "./marketplace.validation";

const router = Router();

// GET /marketplace - Get all listings (with optional filters)
// Public endpoint - no authentication required
router.get(
  "/",
  validate(getListingsSchema),
  marketplaceController.getAllListingsHandler
);

// GET /marketplace/favorites - Get user's favorited listings
// Requires authentication
router.get(
  "/favorites",
  authenticateToken,
  marketplaceController.getUserFavoritesHandler
);

// GET /marketplace/:id - Get single listing by ID
// Public endpoint
router.get(
  "/:id",
  validate(listingIdSchema),
  marketplaceController.getListingByIdHandler
);

// POST /marketplace - Create new listing
// Requires authentication
router.post(
  "/",
  authenticateToken,
  validate(createListingSchema),
  marketplaceController.createListingHandler
);

// PUT /marketplace/:id - Update listing
// Requires authentication + ownership verification
router.put(
  "/:id",
  authenticateToken,
  validate(listingIdSchema),
  validate(updateListingSchema),
  marketplaceController.updateListingHandler
);

// DELETE /marketplace/:id - Delete listing (soft delete)
// Requires authentication + ownership verification
router.delete(
  "/:id",
  authenticateToken,
  validate(listingIdSchema),
  marketplaceController.deleteListingHandler
);

// POST /marketplace/:id/view - Increment view count
// Public endpoint - can be called by anyone viewing
router.post(
  "/:id/view",
  validate(listingIdSchema),
  marketplaceController.incrementViewsHandler
);

// POST /marketplace/:id/favorite - Toggle favorite status
// Requires authentication
router.post(
  "/:id/favorite",
  authenticateToken,
  validate(listingIdSchema),
  marketplaceController.toggleFavoriteHandler
);

export default router;
