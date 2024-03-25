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
    console.log(categoryDetails);

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
    let upperQuartiles = [];
    let lowerQuartiles = [];
    let maxValues = [];

    gradeBoxes.forEach(box => {
        const fields = box.querySelector('tbody tr td').textContent.split('\n').map(field => field.trim()).filter(field => field !== '');
        fields.forEach((field, index) => {
            console.log(field);
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
                const maxvalue = parseFloat(field.split('out of ')[1]);
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

    displayResults(mean, median, upperQuartile, lowerQuartile);
}

function displayResults(mean, median, upperQuartile, lowerQuartile) {
    const resultsContainer = document.querySelector('#student-grades-right-content');
    const totalGrade = resultsContainer.querySelector('.final_grade');
    totalGrade.append(document.createElement('br'));
    // mean
    totalGrade.append("Mean: ");
    const meanSpan = document.createElement('span');
    meanSpan.textContent = `${mean.toFixed(2)}%`;
    totalGrade.append(meanSpan);
    totalGrade.append(document.createElement('br'));
    totalGrade.append(document.createElement('br'));
    // upper quartile
    totalGrade.append("Upper Quartile: ");
    const upperSpan = document.createElement('span');
    upperSpan.textContent = `${upperQuartile.toFixed(2)}%`;
    totalGrade.append(upperSpan);
    totalGrade.append(document.createElement('br'));
    // median
    totalGrade.append("Median: ");
    const medianSpan = document.createElement('span');
    medianSpan.textContent = `${median.toFixed(2)}%`;
    totalGrade.append(medianSpan);
    totalGrade.append(document.createElement('br'));
    // lower quartile
    totalGrade.append("Lower Quartile: ");
    const lowerSpan = document.createElement('span');
    lowerSpan.textContent = `${lowerQuartile.toFixed(2)}%`;
    totalGrade.append(lowerSpan);
}

calculateAndDisplayGrades();