interface UsersOutput {
  users: { id: string; name: string }[];
}

const usersLogic = async (): Promise<UsersOutput> => {
  const users = await listUsers();
  return { users: users.map((user) => ({ id: user.id, name: user.name })) };
};

export default defineEventHandler(async () => {
  try {
    return await usersLogic();
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : "users failed",
    });
  }
});
