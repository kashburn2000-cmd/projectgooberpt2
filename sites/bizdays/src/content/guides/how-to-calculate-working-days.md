---
title: "How to calculate working days between two dates"
description: "The exact method for counting working days between two dates — including the two mistakes that make most people's answers wrong — with worked examples."
category: "Basics"
updated: 2026-07-10
order: 2
---

Counting working days looks like simple arithmetic, and then a holiday lands in the
middle and everything's off by a day. Here's how to do it correctly, by hand or with
a [calculator](/).

## The method, step by step

To count the working days between a start date and an end date:

1. **List every day** in the range, from the start date to the end date.
2. **Remove weekend days** — for that country. In most places that's Saturday and
   Sunday; elsewhere it may be Friday and Saturday.
3. **Remove public holidays** that fall on a remaining weekday.
4. **Count what's left.** Those are your working days.

The two steps people skip are #2 done *per country* and #3 entirely — which is why
a plain "weekdays between dates" formula so often disagrees with reality.

## Worked example

Count the working days from **Monday, December 21, 2026** to **Friday, January 1,
2027** in the United States.

- Calendar days in range: **12**
- Weekend days removed (Sat Dec 26, Sun Dec 27): **2** → 10 weekdays
- Public holidays on weekdays removed: **Christmas Day (Fri Dec 25)** and **New
  Year's Day (Fri Jan 1)**: **2**
- **Working days = 12 − 2 − 2 = 8**

A naive "weekdays only" count would say 10. Accounting for Christmas and New Year's
brings it to 8 — and those are exactly the two days that trip people up at year-end.

## Inclusive or exclusive?

Decide whether both endpoints count. Conventions differ, so be explicit:

- **Inclusive** of both start and end (what this site's "days between" mode uses):
  good for "how many working days does this span cover?"
- **Exclusive** of the start date: matches "add N business days *from* today,"
  where counting begins the next day — see
  [adding business days to a date](/guides/adding-business-days-to-a-date).

## Don't forget the country

The same two dates can enclose a different number of working days depending on the
country, because holidays and weekends differ. Counting for
[Germany](/holidays) over Easter? You'll lose Good Friday and Easter Monday that the
US calendar keeps. Always calculate against the right country's
[public holidays](/holidays).

## Let the tool do it

By hand this is error-prone; that's the whole reason the [calculator](/) exists.
Pick a country, enter two dates, and it removes that country's weekends and holidays
for you — and shows exactly which holidays it excluded.

## Related reading

- [What is a business day?](/guides/what-is-a-business-day)
- [Adding business days to a date](/guides/adding-business-days-to-a-date)
- [How many working days in a year?](/guides/working-days-in-a-year)
