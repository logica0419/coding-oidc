import type { StoredUser } from "@coding-oidc/shared";

let seeded = false;

const seedUsers = async (): Promise<StoredUser[]> => {
  const users: StoredUser[] = [
    { id: "user1", name: "ユーザー1" },
    { id: "user2", name: "ユーザー2" },
  ];
  for (const user of users) {
    await setStoredUser(user.id, { id: user.id, name: user.name });
  }
  return users;
};

export const listUsers = async (): Promise<StoredUser[]> => {
  if (!seeded) {
    seeded = true;
    return seedUsers();
  }
  const users = await getAllStoredUsers();
  if (users.length === 0) {
    return seedUsers();
  }
  return users;
};

export const findUser = async (id: string): Promise<StoredUser> => {
  const users = await listUsers();
  const found = users.find((user) => user.id === id);
  if (found === undefined) {
    throw new Error("user not found");
  }
  return found;
};
