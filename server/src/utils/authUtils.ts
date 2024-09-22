export const checkAuth = (
  context: any,
  roles: string[] = [],
  messages: { 
    authentication?: string; 
    authorization?: string; 
  } = {}
) => {
  const user = context.user;
  const authMessage = messages.authentication || "Authentication required.";
  const roleMessage = messages.authorization || "Unauthorized: You do not have permission to perform this action.";

  if (!user) {
    throw new Error(authMessage);
  }
  if (roles.length > 0 && !roles.includes(user.role)) {
    throw new Error(roleMessage);
  }
};