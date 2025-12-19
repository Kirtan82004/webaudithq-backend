const impactMapper = (score) => {
  if (score <= 0.3) return "High";
  if (score <= 0.7) return "Medium";
  return "Low";
};

export default impactMapper;
