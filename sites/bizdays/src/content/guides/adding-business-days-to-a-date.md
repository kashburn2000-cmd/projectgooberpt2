---
title: "How to Add Business Days to a Date (Correctly)"
description: "Add or subtract business days the right way: start counting the day after, skip weekends and holidays, and handle start dates that fall on a weekend."
category: "Basics"
updated: 2026-07-10
order: 12
---

## The basic method

Adding business days sounds simple, but the counting rule catches people out. Here's the correct approach:

1. **Start counting the day *after* your start date.** The start date itself is day zero, not day one.
2. **Skip weekends.** For most countries that's Saturday and Sunday, though some regions differ — see [what is a business day](/guides/what-is-a-business-day).
3. **Skip public holidays.** Any national holiday in the window doesn't count as a business day.
4. **Stop when you've counted N qualifying days.** The last one you land on is your answer.

Subtracting works the same way in reverse: count backward from the day *before* your start date, skipping weekends and holidays as you go.

## Why "the day after" matters

If you order something on Monday with "2 business days" delivery, you don't count Monday itself. Tuesday is day one and Wednesday is day two, so it arrives Wednesday. Counting the start date by mistake is the single most common error, and it makes every result land one day early.

## The weekend or holiday edge case

What if your start date is itself a Saturday, Sunday, or holiday? The rule doesn't change — you still begin counting from the next day. Because you skip non-working days, the count effectively starts on the following business day:

- Start on **Saturday**, add 1 business day: Sunday is skipped, Monday becomes day one, so you land on **Monday**.
- Start on a **Friday holiday**, add 1 business day: the following Monday (assuming it's clear) becomes day one.

This is why the same "add 3 business days" can produce different-looking gaps depending on where the start date falls.

## Worked examples

### Example 1: a mid-week start

Add **5 business days** to **Tuesday, April 7, 2026** (no holidays in the window):

- Wed Apr 8 — day 1
- Thu Apr 9 — day 2
- Fri Apr 10 — day 3
- *(skip Sat 11 and Sun 12)*
- Mon Apr 13 — day 4
- Tue Apr 14 — day 5

Result: **Tuesday, April 14, 2026.**

### Example 2: a weekend start with a holiday

Add **3 business days** to **Saturday, May 23, 2026**, when **Monday, May 25** is a public holiday:

- *(Sun May 24 skipped — weekend)*
- *(Mon May 25 skipped — holiday)*
- Tue May 26 — day 1
- Wed May 27 — day 2
- Thu May 28 — day 3

Result: **Thursday, May 28, 2026.**

Notice how the weekend start and the holiday stack up, pushing the result well past a naive "add 3 days." The safest way to get this right — especially across long spans or unfamiliar [holiday calendars](/holidays) — is to let the [calculator](/) do the skipping for you.

## Related reading

- [Business days vs. calendar days](/guides/business-days-vs-calendar-days)
- [What is a business day?](/guides/what-is-a-business-day)
- [How to calculate working days](/guides/how-to-calculate-working-days)
