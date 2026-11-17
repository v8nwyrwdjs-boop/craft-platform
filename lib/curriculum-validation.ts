const lessonCounts: Record<string, number> = {
  idea: 3,
  research: 3,
  validation: 3,
  "business-model": 3,
  mvp: 3,
  launch: 3,
};

export function isValidLessonSlug(lessonSlug: string): boolean {
  const match = /^([a-z-]+)-([1-9])$/.exec(lessonSlug);
  if (!match) return false;
  const [, moduleSlug, lessonNumber] = match;
  const count = lessonCounts[moduleSlug];
  return typeof count === "number" && Number(lessonNumber) <= count;
}

export function isValidLessonForModule(lessonSlug: string, moduleSlug: string): boolean {
  return (
    isValidLessonSlug(lessonSlug) &&
    lessonSlug.startsWith(moduleSlug + "-") &&
    Object.prototype.hasOwnProperty.call(lessonCounts, moduleSlug)
  );
}
