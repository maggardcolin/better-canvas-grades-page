// global variables
let hideUngradedAssignments = false; // toggles with a checkbox
let showPercentages = true; // toggles with a checkbox
let debug = true; // used for debug, delete eventually

/**
 * Definitions:
 * Sum-based grading: where a class uses a single point total rather than a set of categories with individual weights to determine final grade.
 */


/**
 * Calculates and displays mean, median, lower quartile, upper quartile, and user grades to display relevant information.
 */
function calculateAndDisplayGrades() {
    
    let categoryDetails = []; // holds each category and its associated fields, such as mean for the category, etc.

    // find categories and percentages and create dictionary for each category
    const summaryTable = document.querySelector('.summary');
    if (summaryTable) {
        const summaryBody = summaryTable.querySelector('tbody');
        const categories = summaryBody.querySelectorAll('tr');
        categories.forEach(category => {
            const title = category.textContent.split("\n")[1].trim();
            const percentage = category.textContent.split("\n")[2].trim();
            let percentageValue = parseFloat(percentage.replace('%', ''));
            let percentageDecimal = (percentageValue / 100);

            // create a dictionary where there is a title, percentage, and statistical fields
            let categoryDict = {
                title: title,
                percentage: percentageDecimal,
                drops: 0,
                yourGrade: 0,
                meanPoints: 0,
                medianPoints: 0,
                upperQuartile: 0,
                lowerQuartile: 0,
                totalPoints: 0
            };
            // ignore the total field, as it usually sums to 100% and is not useful for statistical calculations
            if (title !== 'Total') {
                categoryDetails.push(categoryDict);
            }
        });
    } else {
        // this is in case the class uses entirely sum-based grading and no weightings
        let categoryDict = {
            yourGrade: 0,
            meanPoints: 0,
            medianPoints: 0,
            upperQuartile: 0,
            lowerQuartile: 0,
            totalPoints: 0
        };
        categoryDetails.push(categoryDict);
    }
    
    /***************************
    *  Data gathering section  *
    ***************************/
    let assignmentCategories = [];
    let droppedGrades = []; // 0 for dropped, 1 for included

    // find all assignments, see which categories they are
    const assignments = document.querySelectorAll('.student_assignment.assignment_graded');
    const gradeBoxes = document.querySelectorAll('.grade_details.assignment_graded');
    assignments.forEach(assignment => {
        if (assignment.classList.contains('excused')) {
            console.log('An assignment has been detected as excused.');
        } else if (!assignment.querySelector('.details').querySelector('.tooltip').getAttribute('aria-hidden')) {
            console.log("An assignment has been detected that does not count towards the final grade.");
        } else {   
            const category = assignment.querySelector('.context').textContent.trim();
            assignmentCategories.push(category);
            const isDropped = assignment.classList.contains('dropped');
            droppedGrades.push(isDropped ? 0 : 1);
        }
    });

    // find means and medians and max possible points
    let means = [];
    let medians = [];
    let yourGrades = [];
    let upperQuartiles = [];
    let lowerQuartiles = [];
    let maxValues = [];

    gradeBoxes.forEach(box => {
        try {
            const fieldTextBox = box.querySelector('tbody tr td');
            if (fieldTextBox) {
                const fields = fieldTextBox.textContent.split('\n').map(field => field.trim()).filter(field => field !== '');
                fields.forEach((field, index) => {
                    try {
                        if (field === "Mean:" && index + 1 < fields.length) {
                            const meanValue = parseFloat(fields[index + 1]);
                            if (!isNaN(meanValue)) {
                                means.push(meanValue);
                            }
                        } else if (field === "Median:" && index + 1 < fields.length) {
                            const medianValue = parseFloat(fields[index + 1]);
                            if (!isNaN(medianValue)) {
                                medians.push(medianValue);
                            }
                        } else if (field === "Upper Quartile:" && index + 1 < fields.length) {
                            const upperValue = parseFloat(fields[index + 1]);
                            if (!isNaN(upperValue)) {
                                upperQuartiles.push(upperValue);
                            }
                        } else if (field === "Lower Quartile:" && index + 1 < fields.length) {
                            const lowerValue = parseFloat(fields[index + 1]);
                            if (!isNaN(lowerValue)) {
                                lowerQuartiles.push(lowerValue);
                            }
                        } else if (field.includes("Your Score:")) {
                            const yourScore = parseFloat((field.split(' out of ')[0]).split('Your Score: ')[1]);
                            const maxvalue = parseFloat(field.split(' out of ')[1]);
                            if (!isNaN(yourScore)) {
                                yourGrades.push(yourScore);
                            }
                            if (!isNaN(maxvalue)) {
                                maxValues.push(maxvalue);
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
    });

    // add the mean and median points to the correct categories
    // TODO change this to a dictionary and sort per assignment in case of dropped assignments?
    assignmentCategories.forEach((assignment, index) => {
        if (summaryTable) {
            categoryDetails.forEach(category => {
                if (assignment === category.title) {
                    category.yourGrade += yourGrades[index];
                    category.meanPoints += means[index];
                    category.medianPoints += medians[index];
                    category.totalPoints += maxValues[index];
                    category.upperQuartile += upperQuartiles[index];
                    category.lowerQuartile += lowerQuartiles[index];
                }
            });
        }
    });

    // in the case of sum-based grading, note that grade is not necessary
    if (!summaryTable) {
        yourGrades.forEach((grade, index) => {
            categoryDetails.forEach(category => {
                category.yourGrade += yourGrades[index];
                category.meanPoints += means[index];
                category.medianPoints += medians[index];
                category.totalPoints += maxValues[index];
                category.upperQuartile += upperQuartiles[index];
                category.lowerQuartile += lowerQuartiles[index];
            });
        });
    }

    /************************
    *  Calculation section  *
    ************************/

    // if categories are present
    if (summaryTable) {
        // add the percentage if it was used, otherwise do not, this allows the current grade to be discerned rather than using the overall categories
        let totalPercentageUsed = 0;
        categoryDetails.forEach(category => {
            // display statistics if in debug mode
            if (debug) console.log(`${category.title} (${category.percentage * 100}%)\nYour Score: ${category.yourGrade}\nMean: ${category.meanPoints}\nMedian: ${category.medianPoints}\nTotal possible: ${category.totalPoints}`);
            if (category.totalPoints > 0) {
                totalPercentageUsed += category.percentage;
            }
        });

        // calculate your grade
        let you = 0;
        categoryDetails.forEach(category => {
            if (category.totalPoints !== 0) {
                you += category.percentage * (category.yourGrade / category.totalPoints) * 100;
            }
        });
        you /= totalPercentageUsed;

        // calculate the mean percentage grade in the class assuming
        let mean = 0;
        categoryDetails.forEach(category => {
            if (category.totalPoints !== 0) {
                mean += category.percentage * (category.meanPoints / category.totalPoints) * 100;
            }
        });
        mean /= totalPercentageUsed;

        // calculate the median percentage grade in the class assuming
        let median = 0;
        categoryDetails.forEach(category => {
            if (category.totalPoints !== 0) {
                median += category.percentage * (category.medianPoints / category.totalPoints) * 100;
            }
        });
        median /= totalPercentageUsed;

        // calculate upper quartile
        let upperQuartile = 0;
        categoryDetails.forEach(category => {
            if (category.totalPoints !== 0) {
                upperQuartile += category.percentage * (category.upperQuartile / category.totalPoints) * 100;
            }
        });
        upperQuartile /= totalPercentageUsed;

        // calculate lower quartile
        let lowerQuartile = 0;
        categoryDetails.forEach(category => {
            if (category.totalPoints !== 0) {
                lowerQuartile += category.percentage * (category.lowerQuartile / category.totalPoints) * 100;
            }
        });
        lowerQuartile /= totalPercentageUsed;

        displayResults(you, mean, median, upperQuartile, lowerQuartile);
    } 
    
    // sum-based grading instead
    else {
        categoryDetails.forEach(category => {
            if (debug) console.log(`Total\nYour Score: ${category.yourGrade}\nMean: ${category.meanPoints}\nMedian: ${category.medianPoints}\nTotal possible: ${category.totalPoints}`);
        });

        // your grade
        let you = 0;
        categoryDetails.forEach(category => {
            if (category.totalPoints !== 0) {
                you += (category.yourGrade / category.totalPoints) * 100;
            }
        });
         
        // mean
        let mean = 0;
        categoryDetails.forEach(category => {
            if (category.totalPoints !== 0) {
                mean += (category.meanPoints / category.totalPoints) * 100;
            }
        });
        
        // median
        let median = 0;
        categoryDetails.forEach(category => {
            if (category.totalPoints !== 0) {
                median += (category.medianPoints / category.totalPoints) * 100;
            }
        });

        // upper quartile
        let upperQuartile = 0;
        categoryDetails.forEach(category => {
            if (category.totalPoints !== 0) {
                upperQuartile += (category.upperQuartile / category.totalPoints) * 100;
            }
        });

        // lower quartile
        let lowerQuartile = 0;
        categoryDetails.forEach(category => {
            if (category.totalPoints !== 0) {
                lowerQuartile += (category.lowerQuartile / category.totalPoints) * 100;
            }
        });

        displayResults(you, mean, median, upperQuartile, lowerQuartile);
    }
    
}

function displayResults(you, mean, median, upperQuartile, lowerQuartile) {
    
    const resultsContainer = document.querySelector('#student-grades-right-content');
    const totalGrade = resultsContainer.querySelector('.final_grade');
    const totalPercentage = totalGrade.querySelector('.grade');
    totalGrade.style.fontWeight = 'bold';
    totalPercentage.style.fontWeight = 'bold';
    let zone = (you > upperQuartile) ? 'Top 25% of Class' : (you > median) ? 'Above Average' : (you > lowerQuartile) ? 'Below Average' : 'Bottom 25% of Class';
    
    // label
    const gradeLabel = document.createElement('h2');
    gradeLabel.textContent = 'Your Performance';
    totalGrade.prepend(gradeLabel);

    // Your relative performance
    totalGrade.append(document.createElement('br'));
    const relPerformance = document.createElement('span');
    relPerformance.textContent = zone;
    relPerformance.style.fontWeight = 'normal';
    totalGrade.append(relPerformance);
    totalGrade.append(document.createElement('br'));
    totalGrade.append(document.createElement('br'));

    // class performance
    const classPerformance = document.createElement('h2');
    classPerformance.textContent = 'Class Performance';
    totalGrade.append(classPerformance);

    // mean
    const meanSpan = document.createElement('span');
    meanSpan.textContent = `Mean: ${mean.toFixed(2)}%`;
    meanSpan.style.fontWeight = 'normal';
    totalGrade.append(meanSpan);
    totalGrade.append(document.createElement('br'));

    // upper quartile
    const upperSpan = document.createElement('span');
    upperSpan.textContent = `Upper Quartile: ${upperQuartile.toFixed(2)}%`;
    upperSpan.style.fontWeight = 'normal';
    totalGrade.append(upperSpan);
    totalGrade.append(document.createElement('br'));

    // median
    const medianSpan = document.createElement('span');
    medianSpan.textContent = `Median: ${median.toFixed(2)}%`;
    medianSpan.style.fontWeight = 'normal';
    totalGrade.append(medianSpan);
    totalGrade.append(document.createElement('br'));

    // lower quartile
    const lowerSpan = document.createElement('span');
    lowerSpan.textContent = `Lower Quartile: ${lowerQuartile.toFixed(2)}%`;
    lowerSpan.style.fontWeight = 'normal';
    totalGrade.append(lowerSpan);
    totalGrade.append(document.createElement('br'));
    totalGrade.append(document.createElement('br'));
}

function toggleUngradedAssignments() {
    hideUngradedAssignments = !hideUngradedAssignments;

    // individual assigments
    const assignments = document.querySelectorAll('.student_assignment.editable');

    // at bottom of page
    const categories = document.querySelectorAll('.student_assignment.hard_coded.group_total');

    assignments.forEach(assignment => {
        if (!assignment.classList.contains('assignment_graded')) {
            assignment.style.display = hideUngradedAssignments ? 'none' : 'table-row';
        }
    });

    // used since categories at the bottom are dynamically loaded and do not work at page load (look into later)
    setTimeout(function() {
        categories.forEach(category => {
            let categoryText = category.querySelector('.grade').textContent.trim();
            if (categoryText === 'N/A' || categoryText === 'Instructor has not posted this grade') {
                category.style.display = hideUngradedAssignments ? 'none' : 'table-row';
            }
        });
      }, 150);

    const gradeSummary = document.querySelector('#grade-summary-content');
    const smallMessage = gradeSummary.querySelector('small');
    if (smallMessage) {
        smallMessage.style.display = hideUngradedAssignments ? 'none' : 'block';
    }

    // remove ungraded categories
    const summaryTable = document.querySelector('.summary');
    if (summaryTable) {
        const summaryBody = summaryTable.querySelector('tbody');
        const categories = summaryBody.querySelectorAll('tr');
        if (hideUngradedAssignments) {
            categories.forEach(category => {
                percentage = category.querySelector('td').textContent;
                if (percentage && percentage === '0%') {
                    category.style.display = 'none';
                }
            });
        } else  {
            categories.forEach(category => {
                percentage = category.querySelector('td').textContent;
                if (percentage && percentage === '0%') {
                    category.style.display = 'table-row';
                }
            });
        }
    }
}

/**/
function togglePercentagesAndPoints() {
    showPercentages = !showPercentages;
    const assignments = document.querySelectorAll('.student_assignment.assignment_graded:not(excused)');
    if (showPercentages) {
        assignments.forEach(assignment => {
            const totalPointsContainer = assignment.querySelector('.tooltip');

            // if we have already done this just swap what's in there
            if (totalPointsContainer.ariaLabel) {
                let percentage = totalPointsContainer.ariaLabel;
                let ariaText = totalPointsContainer.querySelector('span:not(grade)').textContent;
                totalPointsContainer.querySelector('span:not(grade)').textContent = `${percentage}%`;
                totalPointsContainer.setAttribute('aria-label', ariaText);
                return;
            }

            // otherwise we have to manually calculate the percentage
            let lowerNode = null;
            const childNodes = totalPointsContainer.childNodes;
            childNodes.forEach((node) => {
                if (node.textContent.includes('/')) {
                    lowerNode = node;
                };
            });

            const grade = assignment.querySelector('.grade');
            yourPoints = grade.textContent.split('\n').map(field => field.trim()).filter(field => field !== '')[2];
            totalPoints = totalPointsContainer.textContent.split('/ ')[1].trim();
            if (totalPoints === 0) {
                console.log("total points 0");
            }
            let percentage = ((parseFloat(yourPoints) / parseFloat(totalPoints)) * 100).toFixed(2);

            // update the text fields
            totalPointsContainer.querySelector('span:not(grade)').textContent = `${percentage}%`;
            lowerNode.textContent = ``;

            // temporary storage of the point values
            totalPointsContainer.setAttribute('aria-label', `${yourPoints} / ${totalPoints}`);
        });
    } else { 
        assignments.forEach(assignment => {
            const totalPointsContainer = assignment.querySelector('.tooltip');
            let lowerNode = null;
            const childNodes = totalPointsContainer.childNodes;
            childNodes.forEach((node) => {
                if (node.textContent.includes('/')) {
                    lowerNode = node;
                };
            });

            if (!totalPointsContainer.ariaLabel) {
                // don't do anything
                return;
            }

            // just take whatever is in the aria label
            const yourPoints = totalPointsContainer.ariaLabel.split(' / ')[0];
            const totalPoints = totalPointsContainer.ariaLabel.split(' / ')[1];

            // update the text fields
            totalPointsContainer.querySelector(':not(grade) span').textContent = `${yourPoints} / ${totalPoints}`;

            // temporary storage of the percentage
            totalPointsContainer.setAttribute('aria-label', `${((parseFloat(yourPoints) / parseFloat(totalPoints)) * 100).toFixed(2)}`);
        });
    }
}
/**/

function visualUpdates() {
    // other minor visual adjustments to the page, I will have a way to turn these off eventually
    const navBadge = document.querySelector('.grades').querySelector('.nav-badge');
    if (navBadge) {
        navBadge.textContent = '';
    }

    // adds space under the details button
    showDetailsButton = document.querySelector('.show_all_details');
    showDetailsButton.append(document.createElement('br'));
    showDetailsButton.append(document.createElement('br'));

    // makes some text less wordy/more understandable/better around the page
    weightingDesc = document.querySelector('#assignments-not-weighted');
    if (weightingDesc) {
        try {
            weightingDesc.querySelector('h2').textContent = 'Category Weights';
            weightingDescHeaderRow = weightingDesc.querySelector('table thead tr');
            if (weightingDescHeaderRow) {
                weightingDescHeaderRow.remove();
            }
            descRows = weightingDesc.querySelectorAll('table tbody tr');
            descRows.forEach(row => {
                if (row.querySelector('th').textContent === 'Total') {
                    row.remove();
                }
            });
        } catch (e) {
            console.log(e);
        }
    }
    document.querySelector('#whatif-score-description').remove();

    // add an option to only show graded assignments
    const onlyGradedWrapper = document.createElement('div');
    onlyGradedWrapper.style.display = 'flex';
    onlyGradedWrapper.style.flexDirection = 'horizontal';

    // checkbox
    const onlyGradedBox = document.createElement('input');
    onlyGradedBox.id = 'only-graded-assignments';
    onlyGradedBox.type = 'checkbox';
    onlyGradedBox.checked = true;
    onlyGradedBox.style.accentColor = '#080808';
    onlyGradedBox.style.width = '20px';
    onlyGradedBox.style.margin = '3px 8px 3px 0px';
    onlyGradedBox.style.borderRadius = '5px';

    // associated label
    const onlyGradedLabel = document.createElement('label');
    onlyGradedLabel.for = 'only-graded-assignments';
    onlyGradedLabel.textContent = 'Only display graded assignments and categories';
    onlyGradedLabel.style.color = '#000000';
    
    // put it all together
    onlyGradedWrapper.appendChild(onlyGradedBox);
    onlyGradedWrapper.appendChild(onlyGradedLabel);
    weightingDesc.appendChild(onlyGradedWrapper);
    document.querySelector('#only-graded-assignments').addEventListener('change', toggleUngradedAssignments);

    // add an option to show percentages rather than points
    const percentageWrapper = document.createElement('div');
    percentageWrapper.style.display = 'flex';
    percentageWrapper.style.flexDirection = 'horizontal';

    // checkbox
    const percentageCheckbox = document.createElement('input');
    percentageCheckbox.id = 'show-percentages';
    percentageCheckbox.type = 'checkbox';
    percentageCheckbox.checked = false;
    percentageCheckbox.style.accentColor = '#080808';
    percentageCheckbox.style.width = '18px';
    percentageCheckbox.style.margin = '3px 8px 3px 0px';
    percentageCheckbox.style.borderRadius = '5px';

    // associated label
    const percentageLabel = document.createElement('label');
    percentageLabel.for = 'show-percentages';
    percentageLabel.textContent = 'Show percentages instead of points';
    percentageLabel.style.color = '#000000';
    
    // put it all together
    percentageWrapper.appendChild(percentageCheckbox);
    percentageWrapper.appendChild(percentageLabel);
    weightingDesc.appendChild(percentageWrapper);
    document.querySelector('#show-percentages').addEventListener('change', togglePercentagesAndPoints);

    // updates to say which class the grades are for, not your name
    gradeHeader = document.querySelector('.ic-Action-header__Heading');
    let classText = document.querySelector('.mobile-header-title').querySelector('div').textContent;
    if (gradeHeader) {
        gradeHeader.textContent = `Grades for ${classText}`;
    }
    document.title = `Grades for ${classText}`;

    // delete those grade dots that I can never figure out how to get off
    gradeDots = document.querySelectorAll('.unread_dot.grade_dot');
    gradeDots.forEach(dot => {
        dot.remove();
    });
}

console.info("Better Canvas Grades Page running.");
allChanges = true;
if (allChanges) {
    visualUpdates();
}
const totalGrade = document.querySelector('.final_grade');
const gradePercentage = document.querySelector('.grade');
if ((totalGrade.textContent.trim() !== "Calculation of totals has been disabled") && (gradePercentage.textContent.trim() !== "N/A")) {
    calculateAndDisplayGrades();
}
if (allChanges) {
    toggleUngradedAssignments();
    togglePercentagesAndPoints();
}