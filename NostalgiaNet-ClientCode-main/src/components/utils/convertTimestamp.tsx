const convertTimestampToDate = (timestamp: {
    seconds: number;
    nanoseconds: number;
  }): string => {
    // Extract seconds from the timestamp
    const { seconds } = timestamp;

    // Convert the seconds to milliseconds (JavaScript Date works with milliseconds)
    const date = new Date(seconds * 1000);

    // Define options for formatting the date
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // Format the date to a readable string
    return date.toLocaleDateString("en-GB", options);
  };

  export default convertTimestampToDate;