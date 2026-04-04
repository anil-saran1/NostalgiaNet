const calculateTimeLeft = (
  greaterTimestamp: number,
  smallerTimestamp: number
): string => {
  const difference = greaterTimestamp - smallerTimestamp;

  if (difference <= 0) {
    return "N/A";
  }

  const seconds = Math.floor(difference / 1000) % 60;
  const minutes = Math.floor(difference / (1000 * 60)) % 60;
  const hours = Math.floor(difference / (1000 * 60 * 60)) % 24;
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const formatUnit = (value: number, unit: string) => {
    return `${value} ${unit}${value !== 1 ? "s" : ""}`;
  };

  if (years > 0) {
    return formatUnit(years, "year");
  } else if (months > 0) {
    return formatUnit(months, "month");
  } else if (days > 0) {
    return formatUnit(days, "day");
  } else if (hours > 0) {
    return formatUnit(hours, "hour");
  } else if (minutes > 0) {
    return formatUnit(minutes, "minute");
  } else {
    return formatUnit(seconds, "second");
  }
};

export default calculateTimeLeft;
