module.exports = {
  now: () => new Date().toISOString(),
  fromEpochMs: (epochMs) => new Date(epochMs).toISOString(),
};
