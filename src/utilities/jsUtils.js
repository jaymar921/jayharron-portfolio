export function getYearsAndMonthsFromDate(inputDate) {
  try {
    // Convert input to Date object
    const startDate = new Date(inputDate);
    if (isNaN(startDate)) {
      throw new Error("Invalid date format");
    }

    const today = new Date();

    // Calculate year and month difference
    let years = today.getFullYear() - startDate.getFullYear();
    let months = today.getMonth() - startDate.getMonth();

    // Adjust if the current month is before the start month
    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months };
  } catch (error) {
    console.error(error.message);
    return { years: 0, months: 0 };
  }
}
