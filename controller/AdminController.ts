export const FindVandor = (id: number | string | undefined, email?: string) => {
  if (email) return Vandor.findOne({ email: email });
  else return Vandor.findById(id);
};
