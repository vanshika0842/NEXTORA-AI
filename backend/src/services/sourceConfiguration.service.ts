import prisma from "../lib/prisma";

import type { Prisma } from "../generated/prisma/client";

import type { SourceDiscoveryConfig } from "./source-discovery.service";

function objectValue(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function toInputJsonObject(value: Record<string, unknown>): Prisma.InputJsonObject {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonObject;
}

/** Updates the existing parsingConfig document without introducing a second configuration model. */
export const updateSourceDiscoveryConfiguration = async (
  sourceId: number,
  discovery: SourceDiscoveryConfig
) => {
  const existing = await prisma.sourceConfiguration.findUnique({
    where: { sourceId },
  });
  const parsingConfig = toInputJsonObject({
    ...objectValue(existing?.parsingConfig),
    discovery,
  });

  return prisma.sourceConfiguration.upsert({
    where: { sourceId },
    create: {
      sourceId,
      requestConfig: { method: "GET" },
      parsingConfig,
      monitoringConfig: { enabled: true },
    },
    update: { parsingConfig },
  });
};

export const createSourceConfiguration = async () => {
  const source = await prisma.source.findUnique({
    where: {
      id: 2,
    },
  });

  if (!source) {
    throw new Error("Source with ID 2 not found");
  }

  const configuration = await prisma.sourceConfiguration.create({
    data: {
      sourceId: source.id,

      requestConfig: {
        method: "GET",
      },

      parsingConfig: {},

      monitoringConfig: {
        enabled: true,
      },
    },
  });

  return configuration;
};
