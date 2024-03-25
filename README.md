# Better Canvas Grades Page Extension
- Chrome extension that calculates and displays the mean and median grades for a given class, useful for determining your relative position in classes that are curved.
- Added several other text and visual changes to make the page a bit better (most changes are minor but helpful in my opinion), such as hiding ungraded assignments and categories.

## Notes
- I am *not* going to implement dropped grades in the calculations because there is no way to know which assignments are dropped by your classmates, so take the cutoffs/range text with a grain of salt if your class uses assignment drops.
- The range text under your total grade is based on the median, not the mean.
- This allows you to print your grades without it putting ungraded assignments in the output (not sure why this was a feature of Canvas to begin with).
- The bug where you are unable to revert your score after inputting a What-If score is an issue with Canvas, not this extension.
- As of right now, this extension has only been tested on UW-Madison's Canvas page, but it should work on other domains as well.
- I will eventually add options to only have the grade statistics part, and to customize the experience overall. I also plan on making certain things look better as well.

## Example Output from CompSci 354
![image](https://github.com/maggardcolin/class-average-extension/assets/110071999/006ee88e-ddf0-4b54-9448-8ff3afc10e3b)

### Let me know if you find any errors with this program or have general feedback, enjoy!
