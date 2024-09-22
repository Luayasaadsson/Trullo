export interface UserContext {
  user: {
    id: string;
    role: "admin" | "user";
    email: string;
  };
}
