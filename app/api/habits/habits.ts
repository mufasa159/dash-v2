/**
 * Function to calculate the new streak number
 * of a habit to be stored in the database.
 * 
 * Assuming that the habit is completed today,
 * if the last completed date was yesterday,
 * the streak is incremented by 1. If the last
 * completed date was not yesterday, the streak
 * is reset to 1.
 * 
 * You should only use this function when a
 * habit has been completed to get the new
 * streak value for storing in the database.
 * 
 * @param lastCompleted The last completed date
 * @param lastStreak The last streak
 * @returns The new streak
 */
export function calculateStreak(
    lastCompleted: string,
    lastStreak: number,
): number {
    const lastDate = new Date(lastCompleted)

    if (isNaN(lastDate.getTime())) {
        throw new Error("Invalid date");
    }

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (lastDate.getDate() === today.getDate()) {
        return lastStreak
    } else if (lastDate.getDate() === yesterday.getDate()) {
        return lastStreak + 1
    } else {
        return 1
    }
}