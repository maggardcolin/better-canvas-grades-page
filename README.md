# Better Canvas Grades Page Extension
- Chrome extension that calculates and displays the mean and median grades for a given class, useful for determining your relative position in classes that are curved.
- Options to hide ungraded assignments and to view percentages rather than points earned.
- Several other text and visual changes to make the page a bit better (most changes are minor but helpful in my opinion), such as hiding ungraded assignments and categories.

## Example Output from CompSci 354
![image](https://github.com/maggardcolin/better-canvas-grades-page/assets/110071999/f38c1371-fb69-4548-8dcb-772a8750844f)
How the page looks upon access
![image](https://github.com/maggardcolin/better-canvas-grades-page/assets/110071999/ca1159b9-4327-4662-b4dc-49de8034f3fa)
How the page looks when percentages are enabled rather than point totals

### Notable Changes
- Personal and Class performance sections with detailed information sourced from the page itself and displayed in a comprehensive format.
- Only assignments that have been graded are displayed, only categories that are worth above 0% are shown in the sidebar, and only categories that have graded assignments in them are shown at the bottom.
- The title at the top says the name of the class instead of the user's name.
- The print grades button now prints the page without all of the ungraded assignments (not sure why this was a feature of Canvas to begin with).
- The annoying "new grade" bubbles are removed.
- More space above and below the details button in the sidebar.

### Notes
- There is no way to know which assignments are dropped by your classmates, so take the cutoffs/range text with a grain of salt if your class uses assignment drops. I will eventually implement some sort of estimation system but this issue specifically has a few more roadblocks than anything else. Canvas has a lot of quirks that take a lot of time to fix, but I have already found a way to find a way to make excused and uncounted assignments work.
- The range text under your total grade is based on the median, not the mean.
- The bug where you are unable to revert your score after inputting a What-If score is an issue with Canvas, not this extension.
- As of right now, this extension has only been tested on UW-Madison's Canvas page, but it should work on other domains as well.
- I will eventually add options to only have the grade statistics part, and to customize the experience overall. Currently, the page is not customizable other than the two checkboxes, and I plan on eventually expanding this as I have more time.

### Let me know if you find any errors with this program not listed on the issues page or in these notes, or if you have general feedback, enjoy!
