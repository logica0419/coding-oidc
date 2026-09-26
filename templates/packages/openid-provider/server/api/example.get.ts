interface ExampleOutput {
  message: string;
}

// TODO: Phase 1: OAuth
const exampleLogic = async (): Promise<ExampleOutput> => {
  return { message: "access granted!" };
};

export default defineEventHandler(async () => {
  try {
    return await exampleLogic();
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : "example failed",
    });
  }
});
