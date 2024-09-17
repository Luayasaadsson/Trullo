import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  if (password && password.trim() !== "") {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  return undefined;
};
