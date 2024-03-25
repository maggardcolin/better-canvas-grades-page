// global variables
let hideUngradedAssignments = false;

function calculateAndDisplayGrades() {

    // find categories and percentages and create dictionary for each category
    const summaryTable = document.querySelector('.summary');
    const summaryBody = summaryTable.querySelector('tbody');
    const categories = summaryBody.querySelectorAll('tr');
    let categoryDetails = [];
    categories.forEach(category => {
        const title = category.textContent.split("\n")[1].trim();
        const percentage = category.textContent.split("\n")[2].trim();
        let percentageValue = parseFloat(percentage.replace('%', ''));
        let percentageDecimal = (percentageValue / 100);

        // create a dictionary where there is a title, percentage, and total field
        let categoryDict = {
            title: title,
            percentage: percentageDecimal,
            yourGrade: 0,
            meanPoints: 0,
            medianPoints: 0,
            upperQuartile: 0,
            lowerQuartile: 0,
            totalPoints: 0
        };
        if (title !== 'Total') {
            categoryDetails.push(categoryDict);
        }
    });

    /***************************
    *  Data gathering section  *
    ***************************/
    let assignmentCategories = [];

    // find all assignments, see which categories they are
    const assignments = document.querySelectorAll('.student_assignment.assignment_graded');
    const gradeBoxes = document.querySelectorAll('.grade_details.assignment_graded');
    assignments.forEach(assignment => {
        const category = assignment.querySelector('.context').textContent.trim();
        assignmentCategories.push(category);
    });

    // find means and medians and max possible points
    let means = [];
    let medians = [];
    let yourGrades = [];
    let upperQuartiles = [];
    let lowerQuartiles = [];
    let maxValues = [];

    gradeBoxes.forEach(box => {
        const fields = box.querySelector('tbody tr td').textContent.split('\n').map(field => field.trim()).filter(field => field !== '');
        fields.forEach((field, index) => {
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
        });
    });

    // add the mean and median points to the correct categories
    assignmentCategories.forEach((assignment, index) => {
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
    });

    /************************
    *  Calculation section  *
    ************************/
    // add the percentage if it was used, otherwise do not
    let totalPercentageUsed = 0;
    categoryDetails.forEach(category => {
        console.log(`${category.title} (${category.percentage * 100}%)\nMean: ${category.meanPoints}\nMedian: ${category.medianPoints}\nTotal possible: ${category.totalPoints}`);
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

    // calculate the mean percentage grade in the class assuming not all categories may be filled
    let mean = 0;
    categoryDetails.forEach(category => {
        if (category.totalPoints !== 0) {
            mean += category.percentage * (category.meanPoints / category.totalPoints) * 100;
        }
    });
    mean /= totalPercentageUsed;

    // calculate the median percentage grade in the class assuming not all categories may be filled
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

    // other minor visual adjustments to the page, I will have a way to turn these off eventually

    // adds space under the details button
    showDetailsButton = document.querySelector('.show_all_details');
    showDetailsButton.append(document.createElement('br'));
    showDetailsButton.append(document.createElement('br'));

    // makes some text less wordy/more understandable/better around the page
    weightingDesc = document.querySelector('#assignments-not-weighted');
    weightingDesc.querySelector('h2').textContent = 'Category Weights';
    weightingDesc.querySelector('table thead tr').remove();
    descRows = weightingDesc.querySelectorAll('table tbody tr');
    descRows.forEach(row => {
        if (row.querySelector('th').textContent === 'Total') {
            row.remove();
        }
    });
    document.querySelector('#whatif-score-description').remove();

    // add an option to only show graded assignments
    const onlyGradedWrapper = document.createElement('div');
    const onlyGradedBox = document.createElement('input');
    onlyGradedBox.id = 'only-graded-assignments';
    onlyGradedBox.type = 'checkbox';
    onlyGradedBox.checked = true;
    const onlyGradedLabel = document.createElement('label');
    onlyGradedLabel.for = 'only-graded-assignments';
    onlyGradedLabel.textContent = 'Only display graded assignments';

    onlyGradedWrapper.appendChild(onlyGradedBox);
    onlyGradedWrapper.appendChild(onlyGradedLabel);
    weightingDesc.appendChild(onlyGradedWrapper);
    document.querySelector('#only-graded-assignments').addEventListener('change', toggleUngradedAssignments);

    // updates to say which class the grades are for, not your name
    gradeHeader = document.querySelector('.ic-Action-header__Heading');
    let classText = document.querySelector('.mobile-header-title').querySelector('div').textContent;
    gradeHeader.textContent = `Grades for ${classText}`;
    document.title = `Grades for ${classText}`;

}

function toggleUngradedAssignments() {
    hideUngradedAssignments = !hideUngradedAssignments;
    const assignments = document.querySelectorAll('.student_assignment.editable');

    assignments.forEach(assignment => {
        if (!assignment.classList.contains('assignment_graded')) {
            assignment.style.display = hideUngradedAssignments ? 'none' : 'table-row';
        }
    });
}

calculateAndDisplayGrades();
toggleUngradedAssignments();