import { calculateStreak } from "./habits";

describe("calculateStreak", () => {
    it("should increment the streak by 1 if the last completed date was yesterday", () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const lastCompleted = yesterday.toISOString();
        const lastStreak = 5;

        const result = calculateStreak(lastCompleted, lastStreak);

        expect(result).toBe(6);
    });

    it("should reset the streak to 1 if the last completed date was not yesterday", () => {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const lastCompleted = twoDaysAgo.toISOString();
        const lastStreak = 5;

        const result = calculateStreak(lastCompleted, lastStreak);

        expect(result).toBe(1);
    });

    it("should return original streak if the last completed date is today", () => {
        const today = new Date().toISOString();
        const lastStreak = 5;

        const result = calculateStreak(today, lastStreak);

        expect(result).toBe(5);
    });

    it("should reset the streak to 1 if the last completed date is in the future", () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const lastCompleted = tomorrow.toISOString();
        const lastStreak = 5;

        const result = calculateStreak(lastCompleted, lastStreak);

        expect(result).toBe(1);
    });

    it("should handle edge cases where the last completed date is invalid", () => {
        const invalidDate = "invalid-date";
        const lastStreak = 5;

        expect(() => calculateStreak(invalidDate, lastStreak)).toThrowError();
    });
});