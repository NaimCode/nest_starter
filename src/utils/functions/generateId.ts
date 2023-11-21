const generateId = ({
  starter,
  min = 100000,
  max = 900000,
}: {
  starter?: string;
  min?: number;
  max?: number;
}): string => {
  const end = Math.floor(min + Math.random() * max).toString();
  return starter ? starter + end : end;
};

export default generateId;
