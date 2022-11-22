export const generateId = () =>
  "feGenerated-" + Math.random().toString(20).substring(2, 6);

// TODO: add correct regex
const getNameWithoutCounter = (n) => n.split(" copy (")?.[0]?.trim();

// TODO: add correct regex
const getCounterOfName = (n) =>
  parseInt(n.split(" copy (")?.[1]?.split(")")?.[0]?.trim(), 10);

/**
 *
 * TODO: add docs
 * @param {string[]} sequenceNames
 * @param {string} name
 * @returns {string}
 */
export const getNextNameInTheSequence = (sequenceNames, name) => {
  // TODO: add smarter regEx
  const nameIndexes = sequenceNames
    .filter((n) => getNameWithoutCounter(n) === getNameWithoutCounter(name))
    .map((n) => getCounterOfName(n))
    .filter(Boolean);

  const topIndex = Math.max(0, ...nameIndexes);

  return `${getNameWithoutCounter(name)} copy (${topIndex + 1})`;
};

// inspiration:
// > https://gist.github.com/codeguy/6684588
export const stringToSlug = (str) => {
  str = str
    .replace(/^\s+|\s+$/g, "") // trim
    .replace(/\(/g, "-") // remove brackets
    .replace(/\)/g, ""); // remove brackets
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
};
