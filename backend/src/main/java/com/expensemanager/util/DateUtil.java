package com.expensemanager.util;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.Locale;

public final class DateUtil {

    private DateUtil() {}

    public static int getWeekOfMonth(LocalDate date) {
        return date.get(WeekFields.of(Locale.getDefault()).weekOfMonth());
    }

    public static int getWeeksInMonth(int month, int year) {
        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay = firstDay.withDayOfMonth(firstDay.lengthOfMonth());
        int firstWeek = getWeekOfMonth(firstDay);
        int lastWeek = getWeekOfMonth(lastDay);
        return Math.max(lastWeek - firstWeek + 1, 4);
    }

    public static int getDaysLeftInWeek(LocalDate date) {
        int dayOfWeek = date.getDayOfWeek().getValue();
        return 7 - dayOfWeek;
    }
}
