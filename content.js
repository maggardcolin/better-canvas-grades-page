function calculateAndDisplayGrades() {

    console.log("Script loaded!");

    // create summary dictionary for each category weight
    const summaryTable = document.querySelector('.summary');

    // find all mean grades, append them to the correct mean category array

    // find all median grades, append them to the correct median category array
  
    // calculate the mean grade in the class

    // calculate the median grade in the class

    let mean = 1;
    let median = 2;
  
    displayResults(mean, median);
}

function displayResults(mean, median) {
  const resultsContainer = document.querySelector('.final_grade');
  resultsContainer.append("Mean: ");
  const meanSpan = document.createElement('span');
  meanSpan.textContent = mean.toFixed(2);;
  resultsContainer.append(meanSpan);
  resultsContainer.append("Median: ");
  const medianSpan = document.createElement('span');
  medianSpan.textContent = median.toFixed(2);;
  resultsContainer.append(medianSpan);
}

// Run the calculation when the page is loaded
window.addEventListener('load', calculateAndDisplayGrades);