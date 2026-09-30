import { Router } from "express";

import {
  getAllOpportunitiesController,
  getOpportunityByIdController,
} from "../controllers/opportunity.controller";

const router = Router();

// Public read endpoints for Opportunity Finder (Part B)
router.get("/", getAllOpportunitiesController);
router.get("/:id", getOpportunityByIdController);

export default router;
