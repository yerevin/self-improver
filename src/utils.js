export const convertHoursToHumanReadableFormatWithoutSeconds = hours => {
  let minutes = parseInt((hours * 60) % 60);
  hours = parseInt(~~hours);

  return hours + "h " + minutes + "m ";
};
