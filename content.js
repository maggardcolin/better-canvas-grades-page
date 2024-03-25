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
        let percentageDecimal = Math.round((percentageValue / 100) * 10) / 10;

        // create a dictionary where there is a title, percentage, and total field
        let categoryDict = {
            title: title,
            percentage: percentageDecimal,
            totalPoints: 0
        };
        if (title !== 'Total') {
            categoryDetails.push(categoryDict);
        }
    });
    console.log(categoryDetails);

    let assignmentCategories = [];

    // find all assignments, see which categories they are
    const assignments = document.querySelectorAll('.student_assignment.assignment_graded');
    const gradeBoxes = document.querySelectorAll('.grade_details.assignment_graded');
    assignments.forEach(assignment => {
        const category = assignment.querySelector('.context').textContent.trim();
        assignmentCategories.push(category);
    });


    // find means and medians
    let means = [];
    let medians = [];

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
            }
        });
    });

    console.log(assignmentCategories.length);
    console.log(means.length);
    console.log(medians.length);

    // append points to the correct mean point total

    // find all median grades, append points to the correct median point total

    // calculate the mean grade in the class assuming not all categories may be filled

    // calculate the median grade in the class assuming not all categories may be filled

    let mean = 1;
    let median = 2;

    displayResults(mean, median);
}

function displayResults(mean, median) {
    const resultsContainer = document.querySelector('#student-grades-right-content');
    const totalGrade = resultsContainer.querySelector('.final_grade');
    console.log(totalGrade.textContent);
    totalGrade.append(document.createElement('br'));
    totalGrade.append("Mean: ");
    const meanSpan = document.createElement('span');
    meanSpan.textContent = `${mean.toFixed(2)}%`;
    totalGrade.append(meanSpan);
    totalGrade.append(document.createElement('br'));
    totalGrade.append("Median: ");
    const medianSpan = document.createElement('span');
    medianSpan.textContent = `${median.toFixed(2)}%`;
    totalGrade.append(medianSpan);
}

calculateAndDisplayGrades();