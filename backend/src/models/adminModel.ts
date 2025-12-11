import { Admin } from './index';

export type AdminDTO = {
  id?: number;
  username: string;
  password: string;
};

export const getAdminByUsername = async (username: string): Promise<AdminDTO | undefined> => {
  const admin = await Admin.findOne({ where: { username } });
  return admin ? (admin.toJSON() as AdminDTO) : undefined;
};

export default { getAdminByUsername };
