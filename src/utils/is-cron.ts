export function isCronExecution(): boolean {
  const now = new Date();
  return now.getSeconds() % 10 === 0;
}
