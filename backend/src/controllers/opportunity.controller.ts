import { Request, Response } from "express";

import {
  getOpportunityById,
  listOpportunities,
} from "../services/opportunity.service";
import {
  OpportunityValidationError,
  parseOpportunityId,
  parseOpportunityListQuery,
} from "../validation/opportunity.validation";

function handleOpportunityError(
  res: Response,
  error: unknown,
  fallbackMessage: string
) {
  if (error instanceof OpportunityValidationError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error(fallbackMessage, error);

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
}

export const getAllOpportunitiesController = async (
  req: Request,
  res: Response
) => {
  try {
    const query = parseOpportunityListQuery(
      req.query as Record<string, unknown>
    );
    const result = await listOpportunities(query);

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleOpportunityError(
      res,
      error,
      "Failed to fetch opportunities"
    );
  }
};

export const getOpportunityByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseOpportunityId(req.params.id);
    const opportunity = await getOpportunityById(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    return handleOpportunityError(
      res,
      error,
      "Failed to fetch opportunity"
    );
  }
};
