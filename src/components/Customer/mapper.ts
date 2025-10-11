const gradeOptions = [
  { value: "ss", label: "SS" },
  { value: "s", label: "S" },
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
  { value: "vb", label: "VB" },
  { value: "vc", label: "VC" },
  { value: "d", label: "D" },
  { value: "e", label: "E" },
  { value: "f", label: "F" },
];

export const getGradeOptions = () => {
  return gradeOptions;
};

export const getGradeLabel = (value: string) => {
  const option = gradeOptions.find(opt => opt.value === value);
  return option ? option.label : "";
};