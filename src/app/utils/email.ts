/**
 * Basic email check
 * @param email
 */
export function emailIsValid(email): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
