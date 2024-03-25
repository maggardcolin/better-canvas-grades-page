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

    // find all mean grades, append points to the correct mean point total

    // find all median grades, append points to the correct median point total

    // calculate the mean grade in the class

    // calculate the median grade in the class

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