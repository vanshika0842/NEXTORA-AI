import prisma from "../lib/prisma";

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