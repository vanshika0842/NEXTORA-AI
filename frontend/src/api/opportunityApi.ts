import api from "./axios";
import type {
  Opportunity,
  OpportunityListResponse,
  OpportunityQueryParams,
} from "../types/opportunity";

function buildParams(query: OpportunityQueryParams = {}) {
  const params: Record<string, string | number> = {};

  if (query.search?.trim()) params.search = query.search.trim();
  if (query.type) params.type = query.type;
  if (query.status) params.status = query.status;
  if (query.location?.trim()) params.location = query.location.trim();
  if (query.remote === "true" || query.remote === "false") {
    params.remote = query.remote;
  }
  if (query.sort) params.sort = query.sort;
  if (query.page) params.page = query.page;
  if (query.limit) params.limit = query.limit;

  return params;
}

export const getOpportunities = async (
  query: OpportunityQueryParams = {}
): Promise<OpportunityListResponse> => {
  const response = await api.get("/opportunities", {
    params: buildParams(query),
  });

  return {
    data: response.data.data ?? [],
    pagination: response.data.pagination ?? {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0,
    },
  };
};

export const getOpportunityById = async (
  id: string | number
): Promise<Opportunity> => {
  const response = await api.get(`/opportunities/${id}`);
  return response.data.data;
};
